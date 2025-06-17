package com.globetales.service;

import com.globetales.dto.LocationDTO;
import com.globetales.dto.UserDTO;
import java.util.Optional;
import java.util.UUID;

public interface UserService extends BaseService<UserDTO, UUID> {
    Optional<UserDTO> findByEmail(String email);
    Optional<UserDTO> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    UserDTO createUser(UserDTO userDTO, String password);
    void updateUserLocation(UUID userId, double latitude, double longitude);
    void softDelete(UUID userId);
    UserDTO getCurrentUser();
} 