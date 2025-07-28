package com.globetales.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrentWeatherDTO {
    @JsonProperty("temperature_2m")
    private double temperature;
    @JsonProperty("weather_code")
    private int weatherCode;
} 