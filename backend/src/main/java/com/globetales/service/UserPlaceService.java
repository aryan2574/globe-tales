package com.globetales.service;

import com.globetales.dto.UserPlaceDTO;
import com.globetales.entity.UserPlaceId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPlaceService {
    boolean existsById(UserPlaceId id);
    List<UserPlaceDTO> findByUserId(UUID userId);
    UserPlaceDTO save(UserPlaceDTO userPlaceDTO);
    void deleteById(UserPlaceId id);
    List<UserPlaceDTO> findRecentPlacesByUserId(UUID userId, int limit);
    Optional<UserPlaceDTO> findById(UserPlaceId id);
} 