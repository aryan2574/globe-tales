package com.globetales.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CachingConfig {

    public static final String ROUTES_CACHE = "routes";
    public static final String RECOMMENDATIONS_CACHE = "recommendations";
    public static final String WEATHER_CACHE = "weather";
    public static final String CHATBOT_CACHE = "chatbot";

    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(ROUTES_CACHE, RECOMMENDATIONS_CACHE);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(2, TimeUnit.HOURS)
                .maximumSize(500));
        return cacheManager;
    }

    @Bean
    public CacheManager weatherCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(WEATHER_CACHE);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .maximumSize(100));
        return cacheManager;
    }

    @Bean
    public CacheManager chatbotCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(CHATBOT_CACHE);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(200));
        return cacheManager;
    }
} 