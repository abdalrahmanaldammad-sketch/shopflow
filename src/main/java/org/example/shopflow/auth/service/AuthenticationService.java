package org.example.shopflow.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.auth.dto.request.ForgotPasswordRequest;
import org.example.shopflow.auth.dto.request.LoginRequest;
import org.example.shopflow.auth.dto.request.RegisterRequest;
import org.example.shopflow.auth.dto.request.ResetPasswordRequest;
import org.example.shopflow.auth.dto.response.AuthResponse;
import org.example.shopflow.auth.entity.EmailVerificationToken;
import org.example.shopflow.auth.entity.PasswordResetToken;
import org.example.shopflow.auth.repository.EmailVerificationTokenRepository;
import org.example.shopflow.auth.repository.PasswordResetTokenRepository;
import org.example.shopflow.auth.security.JwtService;
import org.example.shopflow.shared.exception.AccountNotVerifiedException;
import org.example.shopflow.shared.exception.BadRequestException;
import org.example.shopflow.shared.exception.EmailAlreadyExistsException;
import org.example.shopflow.shared.exception.ResourceNotFoundException;
import org.example.shopflow.shared.exception.TokenException;
import org.example.shopflow.shared.util.TokenUtils;
import org.example.shopflow.user.entity.Role;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.entity.enums.AuthProvider;
import org.example.shopflow.user.entity.enums.RoleName;
import org.example.shopflow.user.mapper.UserMapper;
import org.example.shopflow.user.repository.RoleRepository;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final EmailVerificationTokenRepository verificationTokenRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final AuthenticationManager authenticationManager;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final SessionService sessionService;
  private final EmailService emailService;
  private final MfaService mfaService;
  private final UserMapper userMapper;

  @Transactional
  public void register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
      throw new EmailAlreadyExistsException("An account with this email already exists");
    }

    Role userRole =
        roleRepository
            .findByName(RoleName.ROLE_USER)
            .orElseThrow(
                () ->
                    new RuntimeException(
                        "Default role ROLE_USER not found. Please run migrations."));

    User user =
        User.builder()
            .email(request.getEmail().toLowerCase().trim())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName().trim())
            .lastName(request.getLastName().trim())
            .authProvider(AuthProvider.LOCAL)
            .emailVerified(false)
            .enabled(true)
            .roles(Set.of(userRole))
            .build();

    user = userRepository.save(user);

    String token = UUID.randomUUID().toString();
    EmailVerificationToken verificationToken =
        EmailVerificationToken.builder()
            .token(token)
            .user(user)
            .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
            .build();
    verificationTokenRepository.save(verificationToken);

    emailService.sendVerificationEmail(user.getEmail(), token);
    log.info("User registered successfully: {}", user.getEmail());
  }

  @Transactional
  public LoginResult login(LoginRequest request, HttpServletRequest httpRequest) {
    String normalizedEmail = request.getEmail().toLowerCase().trim();
    User user =
        userRepository
            .findByEmail(normalizedEmail)
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

    if (!user.isEmailVerified()) {
      throw new AccountNotVerifiedException(
          "Email not verified. Please check your inbox or request a new verification email.");
    }

    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword()));
    } catch (BadCredentialsException e) {
      user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
      if (user.getFailedLoginAttempts() >= 5) {
        user.setAccountLocked(true);
        log.warn("Account locked due to too many failed attempts: {}", user.getEmail());
      }
      userRepository.save(user);
      throw e;
    } catch (DisabledException e) {
      throw new DisabledException("Account is disabled");
    } catch (LockedException e) {
      throw new LockedException("Account is locked due to too many failed login attempts");
    }

    user.setFailedLoginAttempts(0);
    user.setLastLogin(Instant.now());
    userRepository.save(user);

    if (user.isMfaEnabled()) {
      String mfaToken = jwtService.generateMfaToken(user.getId(), user.getEmail());

      AuthResponse authResponse =
          AuthResponse.builder().mfaRequired(true).mfaToken(mfaToken).build();

      log.info("MFA verification required for user: {}", user.getEmail());
      return new LoginResult(authResponse, null);
    }

    String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
    String refreshToken = sessionService.createSession(user.getId(), httpRequest);
    sessionService.updateLastAccessJti(refreshToken, jwtService.getJtiFromToken(accessToken));

    log.info("User logged in successfully: {}", user.getEmail());

    AuthResponse authResponse =
        AuthResponse.builder()
            .accessToken(accessToken)
            .tokenType("Bearer")
            .expiresIn(jwtService.getAccessTokenExpirationMs() / 1000)
            .user(userMapper.toUserResponse(user))
            .build();

    return new LoginResult(authResponse, refreshToken);
  }

  @Transactional
  public LoginResult completeMfaLogin(
      String mfaToken, String totpCode, HttpServletRequest httpRequest) {
    UUID userId = jwtService.validateMfaToken(mfaToken);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!mfaService.verifyUserTotpCode(userId, totpCode)) {
      throw new BadCredentialsException("Invalid TOTP code");
    }

    String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
    String refreshToken = sessionService.createSession(user.getId(), httpRequest);
    sessionService.updateLastAccessJti(refreshToken, jwtService.getJtiFromToken(accessToken));

    log.info("MFA verification successful for user: {}", user.getEmail());

    AuthResponse authResponse =
        AuthResponse.builder()
            .accessToken(accessToken)
            .tokenType("Bearer")
            .expiresIn(jwtService.getAccessTokenExpirationMs() / 1000)
            .user(userMapper.toUserResponse(user))
            .build();

    return new LoginResult(authResponse, refreshToken);
  }

  @Transactional
  public LoginResult completeMfaLoginWithRecovery(
      String mfaToken, String recoveryCode, HttpServletRequest httpRequest) {
    UUID userId = jwtService.validateMfaToken(mfaToken);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!mfaService.verifyRecoveryCode(userId, recoveryCode)) {
      throw new BadCredentialsException("Invalid recovery code");
    }

    String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
    String refreshToken = sessionService.createSession(user.getId(), httpRequest);
    sessionService.updateLastAccessJti(refreshToken, jwtService.getJtiFromToken(accessToken));

    log.info("MFA recovery code login successful for user: {}", user.getEmail());

    AuthResponse authResponse =
        AuthResponse.builder()
            .accessToken(accessToken)
            .tokenType("Bearer")
            .expiresIn(jwtService.getAccessTokenExpirationMs() / 1000)
            .user(userMapper.toUserResponse(user))
            .build();

    return new LoginResult(authResponse, refreshToken);
  }

  @Transactional
  public RefreshResult refreshAccessToken(String rawRefreshToken, HttpServletRequest request) {
    SessionService.RotationResult rotation =
        sessionService.rotateRefreshToken(rawRefreshToken, request);

    User user =
        userRepository
            .findById(rotation.userId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
    sessionService.updateLastAccessJti(
        rotation.newRawToken(), jwtService.getJtiFromToken(accessToken));

    AuthResponse authResponse =
        AuthResponse.builder()
            .accessToken(accessToken)
            .tokenType("Bearer")
            .expiresIn(jwtService.getAccessTokenExpirationMs() / 1000)
            .build();

    return new RefreshResult(authResponse, rotation.newRawToken());
  }

  @Transactional
  public void verifyEmail(String token) {
    EmailVerificationToken verificationToken =
        verificationTokenRepository
            .findByToken(token)
            .orElseThrow(() -> new TokenException("Invalid verification token"));

    if (verificationToken.isUsed()) {
      throw new TokenException("Email has already been verified");
    }

    if (verificationToken.isExpired()) {
      throw new TokenException("Verification token has expired. Please request a new one.");
    }

    verificationToken.setConfirmedAt(Instant.now());
    verificationTokenRepository.save(verificationToken);

    User user = verificationToken.getUser();
    user.setEmailVerified(true);
    userRepository.save(user);

    log.info("Email verified for user: {}", user.getEmail());
  }

  @Transactional
  public void resendVerificationEmail(String email) {
    User user =
        userRepository
            .findByEmail(email.toLowerCase().trim())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with this email"));

    if (user.isEmailVerified()) {
      throw new BadRequestException("Email is already verified");
    }

    String token = UUID.randomUUID().toString();
    EmailVerificationToken verificationToken =
        EmailVerificationToken.builder()
            .token(token)
            .user(user)
            .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
            .build();
    verificationTokenRepository.save(verificationToken);

    emailService.sendVerificationEmail(user.getEmail(), token);
    log.info("Verification email resent to: {}", user.getEmail());
  }

  @Transactional
  public void forgotPassword(ForgotPasswordRequest request) {
    userRepository
        .findByEmail(request.getEmail().toLowerCase().trim())
        .ifPresent(
            user -> {
              String token = UUID.randomUUID().toString();
              PasswordResetToken resetToken =
                  PasswordResetToken.builder()
                      .token(token)
                      .user(user)
                      .expiresAt(Instant.now().plus(30, ChronoUnit.MINUTES))
                      .build();
              passwordResetTokenRepository.save(resetToken);

              emailService.sendPasswordResetEmail(user.getEmail(), token);
              log.info("Password reset email sent to: {}", user.getEmail());
            });
  }

  @Transactional
  public void resetPassword(ResetPasswordRequest request) {
    PasswordResetToken resetToken =
        passwordResetTokenRepository
            .findByToken(request.getToken())
            .orElseThrow(() -> new TokenException("Invalid password reset token"));

    if (resetToken.isUsed()) {
      throw new TokenException("This password reset token has already been used");
    }

    if (resetToken.isExpired()) {
      throw new TokenException("Password reset token has expired. Please request a new one.");
    }

    resetToken.setUsedAt(Instant.now());
    passwordResetTokenRepository.save(resetToken);

    User user = resetToken.getUser();
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    user.setPasswordChangedAt(Instant.now());
    user.setFailedLoginAttempts(0);
    user.setAccountLocked(false);
    userRepository.save(user);

    sessionService.revokeAllSessions(user.getId());

    log.info("Password reset successfully for user: {}", user.getEmail());
  }

  @Transactional
  public void logout(String rawRefreshToken) {
    if (rawRefreshToken == null) return;

    String tokenHash = TokenUtils.hashToken(rawRefreshToken);
    sessionService.revokeByTokenHash(tokenHash);
  }

  @Transactional
  public void logoutAll(UUID userId) {
    sessionService.revokeAllSessions(userId);
    log.info("All sessions revoked for user: {}", userId);
  }

  public record LoginResult(AuthResponse authResponse, String refreshToken) {}

  public record RefreshResult(AuthResponse authResponse, String newRefreshToken) {}
}
