package org.example.shopflow.shared.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.shopflow.auth.repository.RefreshTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupScheduler {

    private final RefreshTokenRepository refreshTokenRepository;

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupStaleTokens() {
        Instant now = Instant.now();
        Instant revokedCutoff = now.minus(24, ChronoUnit.HOURS);

        refreshTokenRepository.deleteExpiredTokens(now);
        refreshTokenRepository.deleteRevokedTokensBefore(revokedCutoff);

        log.info("Token cleanup completed");
    }
}