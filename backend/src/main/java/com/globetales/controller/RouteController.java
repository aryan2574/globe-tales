package com.globetales.controller;

import com.globetales.dto.RouteRequestDTO;
import com.globetales.dto.RouteResponseDTO;
import com.globetales.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @PostMapping
    public ResponseEntity<RouteResponseDTO> getRoute(@RequestBody RouteRequestDTO request) {
        RouteResponseDTO response = routeService.getRoute(request);
        return ResponseEntity.ok(response);
    }
} 