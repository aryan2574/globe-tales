package com.globetales.service.impl;

import com.globetales.dto.UserDTO;
import com.globetales.entity.User;
import com.globetales.exception.ResourceNotFoundException;
import com.globetales.mapper.UserMapper;
import com.globetales.repository.UserRepository;
import com.globetales.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> findAll() {
        return userRepository.findAllActive().stream()
                .map(userMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> findById(UUID id) {
        return userRepository.findActiveById(id)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO, String password) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new AccessDeniedException("Email already exists");
        }
        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreatedAt(OffsetDateTime.now());
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public UserDTO save(UserDTO userDTO) {
        User existing = userRepository.findById(userDTO.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Only update fields that are not null in userDTO
        if (userDTO.getDisplayName() != null) existing.setDisplayName(userDTO.getDisplayName());
        if (userDTO.getUsername() != null) existing.setUsername(userDTO.getUsername());
        if (userDTO.getEmail() != null) existing.setEmail(userDTO.getEmail());
        if (userDTO.getLatitude() != null) existing.setLatitude(userDTO.getLatitude());
        if (userDTO.getLongitude() != null) existing.setLongitude(userDTO.getLongitude());
        // Add more fields as needed
        return userMapper.toDTO(userRepository.save(existing));
    }

    @Override
    public void deleteById(UUID id) {
        softDelete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(UUID id) {
        return userRepository.findActiveById(id).isPresent();
    }

    @Override
    public void updateUserLocation(UUID userId, double latitude, double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        userRepository.save(user);
    }

    @Override
    public void updateCurrentUserLocation(double latitude, double longitude) {
        UserDTO currentUserDTO = getCurrentUser();
        User user = userRepository.findById(currentUserDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id ".concat(currentUserDTO.getId().toString())));
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        userRepository.save(user);
    }

    @Override
    public void softDelete(UUID userId) {
        User user = userRepository.findActiveById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setDeletedAt(OffsetDateTime.now());
        user.setDeleted(true);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser() {
        return userMapper.toDTO(getCurrentUserEntity());
    }

    @Override
    public User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            throw new AccessDeniedException("User is not authenticated");
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> findAllSoftDeleted() {
        return userRepository.findAllSoftDeleted().stream()
                .map(userMapper::toDTO)
                .toList();
    }
} 