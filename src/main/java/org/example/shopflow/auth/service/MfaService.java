package org.example.shopflow.auth.service;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import dev.samstevens.totp.util.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.auth.dto.response.MfaSetupResponse;
import org.example.shopflow.auth.entity.MfaRecoveryCode;
import org.example.shopflow.auth.repository.MfaRecoveryCodeRepository;
import org.example.shopflow.shared.exception.BadRequestException;
import org.example.shopflow.shared.exception.ResourceNotFoundException;
import org.example.shopflow.shared.util.TokenUtils;
import org.example.shopflow.user.entity.User;
import org.example.shopflow.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MfaService {

  private final UserRepository userRepository;
  private final MfaRecoveryCodeRepository recoveryCodeRepository;

  @Value("${spring.application.name:AuthApp}")
  private String applicationName;

  private static final int RECOVERY_CODE_COUNT = 8;

  @Transactional(readOnly = true)
  public MfaSetupResponse setupMfa(UUID userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (user.isMfaEnabled()) {
      throw new BadRequestException("MFA is already enabled. Disable it first to reconfigure.");
    }

    SecretGenerator secretGenerator = new DefaultSecretGenerator(32);
    String secret = secretGenerator.generate();

    QrData qrData =
        new QrData.Builder()
            .label(user.getEmail())
            .secret(secret)
            .issuer(applicationName)
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();

    String qrCodeUri;
    try {
      qrCodeUri =
          Utils.getDataUriForImage(
              new ZxingPngQrGenerator().generate(qrData),
              new ZxingPngQrGenerator().getImageMimeType());
    } catch (QrGenerationException e) {
      log.error("Failed to generate QR code for user: {}", userId, e);
      throw new RuntimeException("Failed to generate QR code");
    }

    return MfaSetupResponse.builder().secret(secret).qrCodeUri(qrCodeUri).build();
  }

  @Transactional
  public MfaSetupResponse verifyAndEnableMfa(UUID userId, String secret, String code) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (user.isMfaEnabled()) {
      throw new BadRequestException("MFA is already enabled");
    }

    if (!verifyTotpCode(secret, code)) {
      throw new BadRequestException("Invalid verification code. Please try again.");
    }

    user.setMfaSecret(secret);
    user.setMfaEnabled(true);
    userRepository.save(user);

    List<String> recoveryCodes = generateAndSaveRecoveryCodes(user);

    log.info("MFA enabled for user: {}", user.getEmail());

    return MfaSetupResponse.builder().recoveryCodes(recoveryCodes).build();
  }

  @Transactional
  public void disableMfa(UUID userId, String code) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!user.isMfaEnabled()) {
      throw new BadRequestException("MFA is not enabled");
    }

    if (!verifyTotpCode(user.getMfaSecret(), code)) {
      throw new BadRequestException("Invalid TOTP code");
    }

    user.setMfaEnabled(false);
    user.setMfaSecret(null);
    userRepository.save(user);

    recoveryCodeRepository.deleteAllByUserId(userId);

    log.info("MFA disabled for user: {}", user.getEmail());
  }

  public boolean verifyTotpCode(String secret, String code) {
    TimeProvider timeProvider = new SystemTimeProvider();
    CodeGenerator codeGenerator = new DefaultCodeGenerator();
    DefaultCodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    verifier.setTimePeriod(30);
    verifier.setAllowedTimePeriodDiscrepancy(2);
    return verifier.isValidCode(secret, code);
  }

  public boolean verifyUserTotpCode(UUID userId, String code) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!user.isMfaEnabled() || user.getMfaSecret() == null) {
      throw new BadRequestException("MFA is not enabled for this account");
    }

    return verifyTotpCode(user.getMfaSecret(), code);
  }

  @Transactional
  public boolean verifyRecoveryCode(UUID userId, String rawCode) {
    String codeHash = TokenUtils.hashToken(rawCode.trim().toUpperCase());

    List<MfaRecoveryCode> unusedCodes = recoveryCodeRepository.findAllByUserIdAndUsedFalse(userId);

    for (MfaRecoveryCode rc : unusedCodes) {
      if (rc.getCodeHash().equals(codeHash)) {
        rc.setUsed(true);
        rc.setUsedAt(Instant.now());
        recoveryCodeRepository.save(rc);
        log.info("Recovery code used for user: {}", userId);
        return true;
      }
    }

    return false;
  }

  @Transactional
  public List<String> regenerateRecoveryCodes(UUID userId, String code) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!user.isMfaEnabled()) {
      throw new BadRequestException("MFA is not enabled");
    }

    if (!verifyTotpCode(user.getMfaSecret(), code)) {
      throw new BadRequestException("Invalid TOTP code");
    }

    recoveryCodeRepository.deleteAllByUserId(userId);
    List<String> newCodes = generateAndSaveRecoveryCodes(user);

    log.info("Recovery codes regenerated for user: {}", user.getEmail());
    return newCodes;
  }

  private List<String> generateAndSaveRecoveryCodes(User user) {
    SecureRandom random = new SecureRandom();
    List<String> rawCodes = new ArrayList<>();
    List<MfaRecoveryCode> entities = new ArrayList<>();

    for (int i = 0; i < RECOVERY_CODE_COUNT; i++) {
      String code = String.format("%04X-%04X", random.nextInt(0xFFFF), random.nextInt(0xFFFF));
      rawCodes.add(code);

      entities.add(
          MfaRecoveryCode.builder().user(user).codeHash(TokenUtils.hashToken(code)).build());
    }

    recoveryCodeRepository.saveAll(entities);
    return rawCodes;
  }
}
