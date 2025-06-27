package com.globetales.service.impl;

import com.globetales.dto.UserFavouriteDTO;
import com.globetales.entity.UserFavourite;
import com.globetales.entity.UserFavouriteId;
import com.globetales.repository.UserFavouriteRepository;
import com.globetales.service.UserFavouriteService;
import com.globetales.mapper.UserFavouriteMapper;
import com.globetales.repository.UserRepository;
import com.globetales.service.PlaceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserFavouriteServiceImpl implements UserFavouriteService {

    private final UserFavouriteRepository userFavouriteRepository;
    private final UserFavouriteMapper userFavouriteMapper;
    private final UserRepository userRepository;
    private final PlaceService placeService;

    public UserFavouriteServiceImpl(UserFavouriteRepository userFavouriteRepository,
                                  UserFavouriteMapper userFavouriteMapper,
                                  UserRepository userRepository,
                                  PlaceService placeService) {
        this.userFavouriteRepository = userFavouriteRepository;
        this.userFavouriteMapper = userFavouriteMapper;
        this.userRepository = userRepository;
        this.placeService = placeService;
    }

    @Override
    public List<UserFavouriteDTO> findByUserId(UUID userId) {
        return userFavouriteRepository.findByUserId(userId)
                .stream()
                .map(userFavouriteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserFavouriteDTO save(UserFavouriteDTO userFavouriteDTO) {
        try {
            // Ensure the place exists in the places table
            placeService.importPlaceByOsmId(userFavouriteDTO.getSiteId());
        } catch (Exception e) {
            // log and continue (optional: throw if you want to fail on missing place)
        }
        UserFavourite userFavourite = userFavouriteMapper.toEntityWithId(userFavouriteDTO);
        // Set the User entity
        userFavourite.setUser(userRepository.findById(userFavouriteDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found: " + userFavouriteDTO.getUserId())));
        UserFavourite savedFavourite = userFavouriteRepository.save(userFavourite);
        return userFavouriteMapper.toDTO(savedFavourite);
    }

    @Override
    public void deleteById(UserFavouriteId id) {
        userFavouriteRepository.deleteById(id);
    }

    @Override
    public List<UserFavouriteDTO> findByUserIdAndSiteType(UUID userId, String siteType) {
        return userFavouriteRepository.findByUserIdAndSiteType(userId, siteType)
                .stream()
                .map(userFavouriteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(UserFavouriteId id) {
        return userFavouriteRepository.existsById(id);
    }
} 