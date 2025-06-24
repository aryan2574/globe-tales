package com.globetales.service.impl;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.entity.Achievement;
import com.globetales.entity.User;
import com.globetales.entity.UserAchievement;
import com.globetales.entity.UserAchievementId;
import com.globetales.repository.*;
import com.globetales.service.UserAchievementService;
import com.globetales.mapper.UserAchievementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAchievementServiceImpl implements UserAchievementService {

    private final UserAchievementRepository userAchievementRepository;
    private final UserStoryRepository userStoryRepository;
    private final PlaceReviewRepository placeReviewRepository;
    private final VisitedSiteRepository visitedSiteRepository;
    private final UserAchievementMapper userAchievementMapper;

    @Override
    public List<UserAchievementDTO> findByUserId(UUID userId) {
        return userAchievementRepository.findByUserId(userId).stream()
                .map(userAchievementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void checkAndGrantAchievements(User user, String actionType) {
        long storyCount = userStoryRepository.countByUserId(user.getId());
        long reviewCount = placeReviewRepository.countByUserId(user.getId());
        long visitedCount = visitedSiteRepository.countByUserId(user.getId().toString());

        if (storyCount >= 1) {
            grantAchievement(user, Achievement.FIRST_STORY);
        }
        if (storyCount >= 5) {
            grantAchievement(user, Achievement.STORY_PRO);
        }

        if (reviewCount >= 1) {
            grantAchievement(user, Achievement.FIRST_REVIEW);
        }
        if (reviewCount >= 10) {
            grantAchievement(user, Achievement.REVIEW_MASTER);
        }

        if (visitedCount >= 1) {
            grantAchievement(user, Achievement.FIRST_VISIT);
        }
        if (visitedCount >= 20) {
            grantAchievement(user, Achievement.WORLD_TRAVELER);
        }
    }

    private void grantAchievement(User user, Achievement achievement) {
        UserAchievementId achievementId = new UserAchievementId(user.getId(), achievement.getCode());
        if (!userAchievementRepository.existsById(achievementId)) {
            UserAchievement userAchievement = new UserAchievement();
            userAchievement.setId(achievementId);
            userAchievement.setUser(user);
            userAchievementRepository.save(userAchievement);
        }
    }
} 