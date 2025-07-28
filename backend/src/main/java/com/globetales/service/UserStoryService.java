package com.globetales.service;

import com.globetales.dto.UserStoryDTO;
import java.util.List;
import java.util.UUID;

public interface UserStoryService {
    UserStoryDTO createStory(UserStoryDTO userStoryDTO, String username);
    List<UserStoryDTO> getStoriesForUser(String email);
    UserStoryDTO getStoryById(UUID id, String username);
    UserStoryDTO updateStory(UUID id, UserStoryDTO userStoryDTO, String username);
    void deleteStory(UUID id, String username);
    UserStoryDTO markSiteAsVisited(String placeId, String email);
    List<UserStoryDTO> getVisitedSitesForUser(String email);
} 