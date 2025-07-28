package com.globetales.service;

import com.globetales.dto.RecommendationDTO;
import com.globetales.dto.RecommendationResponseDTO;
import com.globetales.entity.User;

import java.util.List;

public interface RecommendationService {
    RecommendationResponseDTO getRecommendations(String transportMode, double maxDistance, int page, int size);
    List<RecommendationDTO> getCachedRecommendations(User user, String transportMode, double maxDistance);
} 