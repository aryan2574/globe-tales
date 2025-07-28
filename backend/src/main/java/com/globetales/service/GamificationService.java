package com.globetales.service;

import com.globetales.entity.User;

public interface GamificationService {
    void awardPoints(User user, int points);
    void checkLevelUp(User user);
} 