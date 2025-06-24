package com.globetales.service.impl;

import com.globetales.dto.PlaceReviewDTO;
import com.globetales.entity.PlaceReview;
import com.globetales.entity.User;
import com.globetales.exception.ResourceNotFoundException;
import com.globetales.exception.AccessDeniedException;
import com.globetales.mapper.PlaceReviewMapper;
import com.globetales.repository.PlaceReviewRepository;
import com.globetales.repository.UserRepository;
import com.globetales.service.PlaceReviewService;
import com.globetales.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaceReviewServiceImpl implements PlaceReviewService {

    private final PlaceReviewRepository placeReviewRepository;
    private final PlaceReviewMapper placeReviewMapper;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Override
    public PlaceReviewDTO createReview(PlaceReviewDTO placeReviewDTO) {
        User user = userRepository.findById(placeReviewDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        PlaceReview placeReview = placeReviewMapper.toEntity(placeReviewDTO);
        placeReview.setUser(user);
        PlaceReview savedReview = placeReviewRepository.save(placeReview);

        gamificationService.awardPoints(user, 25);

        return placeReviewMapper.toDto(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlaceReviewDTO> getReviewsByPlaceId(String placeId) {
        return placeReviewRepository.findByPlaceId(placeId).stream()
                .map(placeReviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlaceReviewDTO> getReviewsByUserId(UUID userId) {
        return placeReviewRepository.findByUserId(userId).stream()
                .map(placeReviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PlaceReviewDTO updateReview(UUID id, PlaceReviewDTO placeReviewDTO, String email) {
        PlaceReview existingReview = placeReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!existingReview.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to update this review");
        }

        existingReview.setComment(placeReviewDTO.getComment());
        existingReview.setRating(placeReviewDTO.getRating());

        PlaceReview updatedReview = placeReviewRepository.save(existingReview);
        return placeReviewMapper.toDto(updatedReview);
    }

    @Override
    public void deleteReview(UUID id, String email) {
        PlaceReview existingReview = placeReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!existingReview.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to delete this review");
        }

        placeReviewRepository.deleteById(id);
    }
} 