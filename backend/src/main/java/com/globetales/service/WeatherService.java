package com.globetales.service;

import com.globetales.dto.WeatherResponseDTO;

public interface WeatherService {
    WeatherResponseDTO getWeather(double latitude, double longitude);
} 