package com.globetales.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class UserAchievementDTO {
    private String achievementCode;
    private OffsetDateTime achievedAt;
    private String displayName;
    private String description;
} 