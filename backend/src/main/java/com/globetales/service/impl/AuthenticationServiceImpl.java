package com.globetales.service.impl;

import com.globetales.dto.AuthenticationRequest;
import com.globetales.dto.AuthenticationResponse;
import com.globetales.dto.RegisterRequest;
import com.globetales.dto.UserDTO;
import com.globetales.entity.User;
import com.globetales.exception.BusinessException;
import com.globetales.exception.ResourceNotFoundException;
import com.globetales.mapper.UserMapper;
import com.globetales.repository.UserRepository;
import com.globetales.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getUsername())
                .createdAt(OffsetDateTime.now())
                .roles(Set.of("USER"))
                .isDeleted(false)
                .build();

        userRepository.save(user);
        var userDTO = userMapper.toDTO(user);

        return AuthenticationResponse.builder()
                .user(userDTO)
                .build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BusinessException("Invalid email or password");
        }

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
        var userDTO = userMapper.toDTO(user);

        return AuthenticationResponse.builder()
                .user(userDTO)
                .build();
    }
} 