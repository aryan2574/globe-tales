package com.globetales.service.impl;

import com.globetales.entity.VisitedSite;
import com.globetales.repository.VisitedSiteRepository;
import com.globetales.service.VisitedSiteService;
import com.globetales.service.GamificationService;
import com.globetales.repository.UserRepository;
import com.globetales.entity.User;
import com.globetales.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VisitedSiteServiceImpl implements VisitedSiteService {
    private final VisitedSiteRepository visitedSiteRepository;
    private final GamificationService gamificationService;
    private final UserRepository userRepository;

    public VisitedSiteServiceImpl(VisitedSiteRepository visitedSiteRepository, GamificationService gamificationService, UserRepository userRepository) {
        this.visitedSiteRepository = visitedSiteRepository;
        this.gamificationService = gamificationService;
        this.userRepository = userRepository;
    }

    @Override
    public VisitedSite addVisitedSite(VisitedSite visitedSite) {
        VisitedSite savedSite = visitedSiteRepository.save(visitedSite);
        
        User user = userRepository.findById(UUID.fromString(visitedSite.getUserId()))
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        gamificationService.awardPoints(user, 10);

        return savedSite;
    }

    @Override
    public List<VisitedSite> getVisitedSitesByUser(String userId) {
        return visitedSiteRepository.findByUserId(userId);
    }

    @Override
    public boolean isSiteVisited(String userId, Long placeId) {
        return visitedSiteRepository.existsByUserIdAndPlaceId(userId, placeId);
    }

    @Override
    public void removeVisitedSite(String userId, Long placeId) {
        visitedSiteRepository.deleteByUserIdAndPlaceId(userId, placeId);
    }
} 