package org.example.shopflow.shared.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

// Req 6 — Distributed Caching.
// Caches the hot read path (product catalog) in Redis so repeated reads under load
// are served from memory instead of hitting Postgres on every request.
//
// Benchmark toggle (Req 10): this manager backs off when spring.cache.type=none, in which
// case Spring supplies a NoOpCacheManager and @Cacheable becomes a pass-through. That lets
// the "before" (no cache) and "after" (cache) runs use the SAME jar/image — only config differs.
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String PRODUCTS_CACHE = "products";

    // TTL is short — products change (stock decrements on every order). The cache absorbs
    // read bursts while @CacheEvict keeps it correct on writes; TTL is the safety net.
    private static final Duration PRODUCTS_TTL = Duration.ofSeconds(60);

    @Bean
    @ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis", matchIfMissing = true)
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(PRODUCTS_TTL)
                .disableCachingNullValues()  // never cache a miss
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }
}