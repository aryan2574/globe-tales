package com.globetales.service.impl;

import com.globetales.dto.UserPlaceDTO;
import com.globetales.entity.UserPlace;
import com.globetales.entity.UserPlaceId;
import com.globetales.mapper.UserPlaceMapper;
import com.globetales.repository.UserPlaceRepository;
import com.globetales.service.UserPlaceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserPlaceServiceImpl implements UserPlaceService {

    private final UserPlaceRepository userPlaceRepository;
    private final UserPlaceMapper userPlaceMapper;

    public UserPlaceServiceImpl(UserPlaceRepository userPlaceRepository, UserPlaceMapper userPlaceMapper) {
        this.userPlaceRepository = userPlaceRepository;
        this.userPlaceMapper = userPlaceMapper;
    }

    @Override
    public Optional<UserPlaceDTO> findById(UserPlaceId id) {
        return userPlaceRepository.findById(id)
                .map(userPlaceMapper::toDTO);
    }

    @Override
    public boolean existsById(UserPlaceId id) {
        return userPlaceRepository.existsById(id);
    }

    @Override
    public List<UserPlaceDTO> findByUserId(UUID userId) {
        return userPlaceRepository.findByUserId(userId)
                .stream()
                .map(userPlaceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserPlaceDTO save(UserPlaceDTO userPlaceDTO) {
        UserPlace userPlace = userPlaceMapper.toEntity(userPlaceDTO);
        UserPlace savedPlace = userPlaceRepository.save(userPlace);
        return userPlaceMapper.toDTO(savedPlace);
    }

    @Override
    public void deleteById(UserPlaceId id) {
        userPlaceRepository.deleteById(id);
    }

    @Override
    public List<UserPlaceDTO> findRecentPlacesByUserId(UUID userId, int limit) {
        return userPlaceRepository.findRecentPlacesByUserId(userId, limit)
                .stream()
                .map(userPlaceMapper::toDTO)
                .collect(Collectors.toList());
    }
} 