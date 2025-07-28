package com.globetales.controller;

import com.globetales.dto.RecommendationDTO;
import com.globetales.dto.RecommendationResponseDTO;
import com.globetales.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<RecommendationResponseDTO> getRecommendations(
            @RequestParam String transportMode,
            @RequestParam double maxDistance,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(recommendationService.getRecommendations(transportMode, maxDistance, page, size));
    }
} 