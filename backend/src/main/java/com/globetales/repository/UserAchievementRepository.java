package com.globetales.repository;

import com.globetales.entity.UserAchievement;
import com.globetales.entity.UserAchievementId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UserAchievementId> {
    List<UserAchievement> findByUserId(UUID userId);
    long countByUserId(UUID userId);
} 