package org.example.shopflow.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.auth.dto.response.SessionResponse;
import org.example.shopflow.auth.entity.RefreshToken;
import org.example.shopflow.auth.repository.RefreshTokenRepository;
import org.example.shopflow.shared.exception.ResourceNotFoundException;
import org.example.shopflow.shared.exception.TokenException;
import org.example.shopflow.shared.util.RequestUtils;
import org.example.shopflow.shared.util.TokenUtils;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

  private final RefreshTokenRepository refreshTokenRepository;
  private final UserRepository userRepository;
  private final TokenBlacklistService tokenBlacklistService;

  @Value("${app.jwt.refresh-token-expiration-days}")
  private int refreshTokenExpirationDays;

  @Value("${app.jwt.access-token-expiration-ms}")
  private long accessTokenExpirationMs;

  @Transactional
  public String createSession(UUID userId, HttpServletRequest request) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    String rawToken = TokenUtils.generateSecureToken();
    String tokenHash = TokenUtils.hashToken(rawToken);
    String userAgent = RequestUtils.getUserAgent(request);

    RefreshToken refreshToken =
        RefreshToken.builder()
            .tokenHash(tokenHash)
            .user(user)
            .ipAddress(RequestUtils.getClientIp(request))
            .userAgent(userAgent)
            .browser(RequestUtils.detectBrowser(userAgent))
            .operatingSystem(RequestUtils.detectOs(userAgent))
            .deviceType(RequestUtils.detectDeviceType(userAgent))
            .expiresAt(Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS))
            .lastUsedAt(Instant.now())
            .build();

    refreshTokenRepository.save(refreshToken);
    log.info("Created new session for user: {}", userId);
    return rawToken;
  }

  @Transactional
  public RotationResult rotateRefreshToken(String rawToken, HttpServletRequest request) {
    String tokenHash = TokenUtils.hashToken(rawToken);
    RefreshToken existingToken =
        refreshTokenRepository
            .findByTokenHash(tokenHash)
            .orElseThrow(() -> new TokenException("Invalid refresh token"));

    if (existingToken.isRevoked()) {
      log.warn(
          "Attempted reuse of revoked refresh token for user: {}. Revoking all sessions.",
          existingToken.getUser().getId());
      refreshTokenRepository.revokeAllByUserId(existingToken.getUser().getId(), Instant.now());
      throw new TokenException(
          "Refresh token has been revoked. All sessions invalidated for security.");
    }

    if (existingToken.isExpired()) {
      throw new TokenException("Refresh token has expired. Please login again.");
    }

    existingToken.setLastUsedAt(Instant.now());
    existingToken.setRevoked(true);
    existingToken.setRevokedAt(Instant.now());
    refreshTokenRepository.save(existingToken);

    String newRawToken = createSession(existingToken.getUser().getId(), request);
    return new RotationResult(existingToken.getUser().getId(), newRawToken);
  }

  @Transactional(readOnly = true)
  public List<SessionResponse> getActiveSessions(UUID userId, String currentTokenHash) {
    List<RefreshToken> sessions =
        refreshTokenRepository.findActiveSessionsByUserId(userId, Instant.now());

    return sessions.stream()
        .map(
            session ->
                SessionResponse.builder()
                    .id(session.getId())
                    .ipAddress(session.getIpAddress())
                    .browser(session.getBrowser())
                    .operatingSystem(session.getOperatingSystem())
                    .deviceType(session.getDeviceType())
                    .createdAt(session.getCreatedAt())
                    .lastUsedAt(session.getLastUsedAt())
                    .expiresAt(session.getExpiresAt())
                    .current(session.getTokenHash().equals(currentTokenHash))
                    .build())
        .collect(Collectors.toList());
  }

  @Transactional
  public void updateLastAccessJti(String rawToken, String jti) {
    String tokenHash = TokenUtils.hashToken(rawToken);
    refreshTokenRepository
        .findByTokenHash(tokenHash)
        .ifPresent(
            token -> {
              token.setLastAccessTokenJti(jti);
              refreshTokenRepository.save(token);
            });
  }

  @Transactional
  public void revokeSession(UUID sessionId, UUID userId) {
    RefreshToken token =
        refreshTokenRepository
            .findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

    if (!token.getUser().getId().equals(userId)) {
      throw new ResourceNotFoundException("Session not found");
    }

    if (token.getLastAccessTokenJti() != null) {
      tokenBlacklistService.blacklist(token.getLastAccessTokenJti(), accessTokenExpirationMs);
    }

    token.setRevoked(true);
    token.setRevokedAt(Instant.now());
    refreshTokenRepository.save(token);
    log.info("Revoked session {} for user {}", sessionId, userId);
  }

  @Transactional
  public void revokeAllSessions(UUID userId) {
    List<RefreshToken> activeSessions =
        refreshTokenRepository.findActiveSessionsByUserId(userId, Instant.now());

    activeSessions.forEach(
        session -> {
          if (session.getLastAccessTokenJti() != null) {
            tokenBlacklistService.blacklist(
                session.getLastAccessTokenJti(), accessTokenExpirationMs);
          }
        });

    refreshTokenRepository.revokeAllByUserId(userId, Instant.now());
    log.info("Revoked all sessions for user: {}", userId);
  }

  @Transactional
  public void revokeOtherSessions(UUID userId, String currentRawToken) {
    String currentHash = TokenUtils.hashToken(currentRawToken);
    List<RefreshToken> activeSessions =
        refreshTokenRepository.findActiveSessionsByUserId(userId, Instant.now());

    activeSessions.stream()
        .filter(session -> !session.getTokenHash().equals(currentHash))
        .forEach(
            session -> {
              session.setRevoked(true);
              session.setRevokedAt(Instant.now());
            });

    refreshTokenRepository.saveAll(activeSessions);
    log.info("Revoked all other sessions for user: {}", userId);
  }

  @Transactional
  public void revokeByTokenHash(String tokenHash) {
    refreshTokenRepository
        .findByTokenHash(tokenHash)
        .ifPresent(
            token -> {
              if (token.isActive()) {
                token.setRevoked(true);
                token.setRevokedAt(Instant.now());
                refreshTokenRepository.save(token);
                log.info("Session revoked for user: {}", token.getUser().getId());
              }
            });
  }

  @Transactional(readOnly = true)
  public RefreshToken findByTokenHash(String tokenHash) {
    return refreshTokenRepository.findByTokenHash(tokenHash).orElse(null);
  }

  public record RotationResult(UUID userId, String newRawToken) {}
}
