package com.globetales.controller;

import com.globetales.entity.VisitedSite;
import com.globetales.service.VisitedSiteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/visited-sites")
public class VisitedSiteController {
    private final VisitedSiteService visitedSiteService;

    public VisitedSiteController(VisitedSiteService visitedSiteService) {
        this.visitedSiteService = visitedSiteService;
    }

    @PostMapping
    public VisitedSite addVisitedSite(@RequestBody VisitedSite visitedSite) {
        return visitedSiteService.addVisitedSite(visitedSite);
    }

    @GetMapping("/user/{userId}")
    public List<VisitedSite> getVisitedSitesByUser(@PathVariable String userId) {
        return visitedSiteService.getVisitedSitesByUser(userId);
    }

    @GetMapping("/check")
    public boolean isSiteVisited(@RequestParam String userId, @RequestParam Long placeId) {
        return visitedSiteService.isSiteVisited(userId, placeId);
    }

    @DeleteMapping("/user/{userId}/place/{placeId}")
    public void removeVisitedSite(@PathVariable String userId, @PathVariable Long placeId) {
        visitedSiteService.removeVisitedSite(userId, placeId);
    }
} 