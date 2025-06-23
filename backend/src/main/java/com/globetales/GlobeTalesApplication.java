package com.globetales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GlobeTalesApplication {
    public static void main(String[] args) {
        SpringApplication.run(GlobeTalesApplication.class, args);
    }
} 