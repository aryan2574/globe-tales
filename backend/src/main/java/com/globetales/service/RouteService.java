package com.globetales.service;

import com.globetales.dto.RouteRequestDTO;
import com.globetales.dto.RouteResponseDTO;

public interface RouteService {
    RouteResponseDTO getRoute(RouteRequestDTO request);
} 