package com.globetales.service;

import com.globetales.dto.UserFavouriteDTO;
import com.globetales.entity.UserFavouriteId;

import java.util.List;
import java.util.UUID;

public interface UserFavouriteService {
    List<UserFavouriteDTO> findByUserId(UUID userId);
    UserFavouriteDTO save(UserFavouriteDTO userFavouriteDTO);
    void deleteById(UserFavouriteId id);
    boolean existsById(UserFavouriteId id);
    List<UserFavouriteDTO> findByUserIdAndSiteType(UUID userId, String siteType);
} 