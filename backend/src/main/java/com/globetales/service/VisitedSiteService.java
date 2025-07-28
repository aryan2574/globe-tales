package com.globetales.service;

import com.globetales.entity.VisitedSite;
import java.util.List;

public interface VisitedSiteService {
    VisitedSite addVisitedSite(VisitedSite visitedSite);
    List<VisitedSite> getVisitedSitesByUser(String userId);
    boolean isSiteVisited(String userId, Long placeId);
    void removeVisitedSite(String userId, Long placeId);
} 