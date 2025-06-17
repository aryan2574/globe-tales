package com.globetales.repository;

import com.globetales.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {
    List<Achievement> findByCategory(String category);
    List<Achievement> findByDifficulty(String difficulty);
    
    @Query("SELECT a FROM Achievement a WHERE a.code NOT IN (SELECT ua.achievement.code FROM UserAchievement ua WHERE ua.user.id = :userId)")
    List<Achievement> findLockedAchievements(@Param("userId") UUID userId);
    
    @Query("SELECT a FROM Achievement a WHERE a.code IN (SELECT ua.achievement.code FROM UserAchievement ua WHERE ua.user.id = :userId)")
    List<Achievement> findUnlockedAchievements(@Param("userId") UUID userId);
} 