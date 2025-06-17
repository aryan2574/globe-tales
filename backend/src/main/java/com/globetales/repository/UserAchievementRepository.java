package com.globetales.repository;

import com.globetales.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UUID> {
    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId")
    List<UserAchievement> findByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT CASE WHEN COUNT(ua) > 0 THEN true ELSE false END FROM UserAchievement ua WHERE ua.user.id = :userId AND ua.achievement.code = :achievementCode")
    boolean existsByUserIdAndAchievementCode(@Param("userId") UUID userId, @Param("achievementCode") String achievementCode);
    
    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId ORDER BY ua.earnedAt DESC")
    List<UserAchievement> findRecentAchievements(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId AND ua.achievement.category = :category")
    List<UserAchievement> findByUserIdAndCategory(@Param("userId") UUID userId, @Param("category") String category);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId ORDER BY ua.earnedAt DESC")
    List<UserAchievement> findRecentAchievementsByUserId(UUID userId, Pageable pageable);

    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user.id = :userId AND ua.achievement.category = :category")
    List<UserAchievement> findByUserIdAndAchievementCategory(UUID userId, String category);
} 