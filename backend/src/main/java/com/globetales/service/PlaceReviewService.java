package com.globetales.service;

import com.globetales.dto.PlaceReviewDTO;
import java.util.List;
import java.util.UUID;

public interface PlaceReviewService {
    PlaceReviewDTO createReview(PlaceReviewDTO placeReviewDTO);
    List<PlaceReviewDTO> getReviewsByPlaceId(String placeId);
    List<PlaceReviewDTO> getReviewsByUserId(UUID userId);
    PlaceReviewDTO updateReview(UUID id, PlaceReviewDTO placeReviewDTO, String email);
    void deleteReview(UUID id, String email);
} 