package com.globetales.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenRouteServiceConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
} 