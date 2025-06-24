package com.globetales.controller;

import com.globetales.dto.PlaceReviewDTO;
import com.globetales.service.PlaceReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class PlaceReviewController {

    private final PlaceReviewService placeReviewService;

    @PostMapping
    public ResponseEntity<PlaceReviewDTO> createReview(@RequestBody PlaceReviewDTO placeReviewDTO) {
        PlaceReviewDTO createdReview = placeReviewService.createReview(placeReviewDTO);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<PlaceReviewDTO>> getReviewsByPlaceId(@PathVariable String placeId) {
        List<PlaceReviewDTO> reviews = placeReviewService.getReviewsByPlaceId(placeId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PlaceReviewDTO>> getReviewsByUserId(@PathVariable UUID userId) {
        List<PlaceReviewDTO> reviews = placeReviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlaceReviewDTO> updateReview(@PathVariable UUID id, @RequestBody PlaceReviewDTO placeReviewDTO, Authentication authentication) {
        PlaceReviewDTO updatedReview = placeReviewService.updateReview(id, placeReviewDTO, authentication.getName());
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID id, Authentication authentication) {
        placeReviewService.deleteReview(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
} 