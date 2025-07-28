package com.globetales.repository;

import com.globetales.entity.PlaceReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlaceReviewRepository extends JpaRepository<PlaceReview, UUID> {
    List<PlaceReview> findByPlaceId(String placeId);
    List<PlaceReview> findByUserId(UUID userId);
    long countByUserId(UUID userId);
} 