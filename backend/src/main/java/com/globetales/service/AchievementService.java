package com.globetales.service;

import com.globetales.dto.AchievementDTO;
import java.util.List;
import java.util.UUID;

public interface AchievementService extends BaseService<AchievementDTO, String> {
    List<AchievementDTO> findByCategory(String category);
    List<AchievementDTO> findByDifficulty(String difficulty);
    List<AchievementDTO> findUnlockedAchievements(UUID userId);
    List<AchievementDTO> findLockedAchievements(UUID userId);
    void checkAndAwardAchievements(UUID userId);
} 