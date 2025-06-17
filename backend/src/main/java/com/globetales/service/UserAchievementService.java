package com.globetales.service;

import com.globetales.dto.UserAchievementDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface UserAchievementService extends BaseService<UserAchievementDTO, UUID> {
    List<UserAchievementDTO> findByUserId(UUID userId);
    boolean existsByUserIdAndAchievementCode(UUID userId, String achievementCode);
    void unlockAchievement(UUID userId, String achievementCode);
    List<UserAchievementDTO> findRecentAchievements(UUID userId, Pageable pageable);
    List<UserAchievementDTO> findAchievementsByCategory(UUID userId, String category);
} 