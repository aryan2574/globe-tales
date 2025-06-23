package com.globetales.service.impl;

import com.globetales.entity.VisitedSite;
import com.globetales.repository.VisitedSiteRepository;
import com.globetales.service.VisitedSiteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitedSiteServiceImpl implements VisitedSiteService {
    private final VisitedSiteRepository visitedSiteRepository;

    public VisitedSiteServiceImpl(VisitedSiteRepository visitedSiteRepository) {
        this.visitedSiteRepository = visitedSiteRepository;
    }

    @Override
    public VisitedSite addVisitedSite(VisitedSite visitedSite) {
        return visitedSiteRepository.save(visitedSite);
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