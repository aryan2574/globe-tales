package com.globetales.controller;

import com.globetales.dto.WeatherResponseDTO;
import com.globetales.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping
    public ResponseEntity<WeatherResponseDTO> getWeather(@RequestParam double lat, @RequestParam double lon) {
        WeatherResponseDTO weather = weatherService.getWeather(lat, lon);
        return ResponseEntity.ok(weather);
    }
} 