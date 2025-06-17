package com.globetales.service.impl;

import com.globetales.dto.UserFavouriteDTO;
import com.globetales.entity.UserFavourite;
import com.globetales.entity.UserFavouriteId;
import com.globetales.repository.UserFavouriteRepository;
import com.globetales.service.UserFavouriteService;
import com.globetales.mapper.UserFavouriteMapper;
import com.globetales.repository.UserRepository;
import com.globetales.repository.CulturalSiteRepository;
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
    private final CulturalSiteRepository culturalSiteRepository;

    public UserFavouriteServiceImpl(UserFavouriteRepository userFavouriteRepository,
                                  UserFavouriteMapper userFavouriteMapper,
                                  UserRepository userRepository,
                                  CulturalSiteRepository culturalSiteRepository) {
        this.userFavouriteRepository = userFavouriteRepository;
        this.userFavouriteMapper = userFavouriteMapper;
        this.userRepository = userRepository;
        this.culturalSiteRepository = culturalSiteRepository;
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
        UserFavourite userFavourite = userFavouriteMapper.toEntity(userFavouriteDTO);
        UserFavourite savedFavourite = userFavouriteRepository.save(userFavourite);
        return userFavouriteMapper.toDTO(savedFavourite);
    }

    @Override
    public void deleteById(UserFavouriteId id) {
        userFavouriteRepository.deleteById(id);
    }

    @Override
    public List<UserFavouriteDTO> findByUserIdAndSiteType(UUID userId, String siteType) {
        return userFavouriteRepository.findByUser_IdAndSiteType(userId, siteType)
                .stream()
                .map(userFavouriteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(UserFavouriteId id) {
        return userFavouriteRepository.existsById(id);
    }
} 