package com.globetales.service;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.entity.User;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface UserAchievementService {
    List<UserAchievementDTO> findByUserId(UUID userId);
    void checkAndGrantAchievements(User user, String actionType);
} 