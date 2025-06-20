package com.globetales.service;

import com.globetales.dto.AuthenticationRequest;
import com.globetales.dto.AuthenticationResponse;
import com.globetales.dto.RegisterRequest;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);
} 