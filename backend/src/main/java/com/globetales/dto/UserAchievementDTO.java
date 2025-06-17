package com.globetales.dto;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class UserAchievementDTO {
    private UUID userId;
    private String achievementCode;
    private OffsetDateTime earnedAt;
    private AchievementDTO achievement;
} 