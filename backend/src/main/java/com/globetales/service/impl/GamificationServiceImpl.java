package com.globetales.service.impl;

import com.globetales.entity.User;
import com.globetales.repository.UserRepository;
import com.globetales.service.GamificationService;
import com.globetales.service.UserAchievementService;
import org.springframework.stereotype.Service;

@Service
public class GamificationServiceImpl implements GamificationService {

    private final UserRepository userRepository;
    private final UserAchievementService userAchievementService;

    public GamificationServiceImpl(UserRepository userRepository, UserAchievementService userAchievementService) {
        this.userRepository = userRepository;
        this.userAchievementService = userAchievementService;
    }

    @Override
    public void awardPoints(User user, int points) {
        user.setExperiencePoints(user.getExperiencePoints() + points);
        checkLevelUp(user);
        userAchievementService.checkAndGrantAchievements(user, null); // actionType can be enhanced later
        userRepository.save(user);
    }

    @Override
    public void checkLevelUp(User user) {
        int points = user.getExperiencePoints();
        String currentLevel = user.getLevel();
        String newLevel = currentLevel;

        if (points >= 1000) {
            newLevel = "Globetrotter";
        } else if (points >= 500) {
            newLevel = "Adventurer";
        } else if (points >= 250) {
            newLevel = "Explorer";
        } else if (points >= 100) {
            newLevel = "Traveler";
        } else {
            newLevel = "Beginner";
        }

        if (!newLevel.equals(currentLevel)) {
            user.setLevel(newLevel);
            // Award bonus points for leveling up
            switch (newLevel) {
                case "Traveler":
                    user.setExperiencePoints(user.getExperiencePoints() + 50);
                    break;
                case "Explorer":
                    user.setExperiencePoints(user.getExperiencePoints() + 100);
                    break;
                case "Adventurer":
                    user.setExperiencePoints(user.getExperiencePoints() + 200);
                    break;
                case "Globetrotter":
                    user.setExperiencePoints(user.getExperiencePoints() + 500);
                    break;
            }
        }
    }
} 