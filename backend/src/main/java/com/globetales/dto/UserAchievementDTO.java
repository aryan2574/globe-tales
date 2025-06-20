package com.globetales.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserAchievementDTO {
    private UUID userId;
    private String achievementCode;
    private LocalDateTime earnedAt;
} 