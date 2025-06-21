package com.globetales.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WeatherResponseDTO {
    private double latitude;
    private double longitude;
    @JsonProperty("current")
    private CurrentWeatherDTO currentWeather;
} 