package org.example.shopflow.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final StringRedisTemplate redisTemplate;

    private static final String BLACKLIST_PREFIX = "jwt:blacklist:";

    public void blacklist(String jti, long remainingMs) {
        if (jti == null || remainingMs <= 0) return;

        String key = BLACKLIST_PREFIX + jti;
        redisTemplate.opsForValue().set(key, "1", Duration.ofMillis(remainingMs));
        log.debug("Blacklisted token jti={} for {}ms", jti, remainingMs);
    }

    public boolean isBlacklisted(String jti) {
        if (jti == null) return false;
        return redisTemplate.hasKey(BLACKLIST_PREFIX + jti);
    }
}