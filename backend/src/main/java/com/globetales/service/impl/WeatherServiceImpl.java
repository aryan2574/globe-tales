package com.globetales.service.impl;

import com.globetales.dto.WeatherResponseDTO;
import com.globetales.service.WeatherService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WeatherServiceImpl implements WeatherService {

    private final RestTemplate restTemplate;
    private static final String WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code";

    public WeatherServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    @Cacheable(value = "weather", key = "#latitude + ',' + #longitude", cacheManager = "weatherCacheManager")
    public WeatherResponseDTO getWeather(double latitude, double longitude) {
        String url = WEATHER_API_URL.replace("{lat}", String.valueOf(latitude)).replace("{lon}", String.valueOf(longitude));
        return restTemplate.getForObject(url, WeatherResponseDTO.class);
    }

    public static String getWeatherDescription(int code) {
        return WMO_CODES.getOrDefault(code, "Unknown");
    }

    private static final Map<Integer, String> WMO_CODES = Map.ofEntries(
            Map.entry(0, "Clear sky"),
            Map.entry(1, "Mainly clear"),
            Map.entry(2, "Partly cloudy"),
            Map.entry(3, "Overcast"),
            Map.entry(45, "Fog"),
            Map.entry(48, "Depositing rime fog"),
            Map.entry(51, "Light drizzle"),
            Map.entry(53, "Moderate drizzle"),
            Map.entry(55, "Dense drizzle"),
            Map.entry(56, "Light freezing drizzle"),
            Map.entry(57, "Dense freezing drizzle"),
            Map.entry(61, "Slight rain"),
            Map.entry(63, "Moderate rain"),
            Map.entry(65, "Heavy rain"),
            Map.entry(66, "Light freezing rain"),
            Map.entry(67, "Heavy freezing rain"),
            Map.entry(71, "Slight snow fall"),
            Map.entry(73, "Moderate snow fall"),
            Map.entry(75, "Heavy snow fall"),
            Map.entry(77, "Snow grains"),
            Map.entry(80, "Slight rain showers"),
            Map.entry(81, "Moderate rain showers"),
            Map.entry(82, "Violent rain showers"),
            Map.entry(85, "Slight snow showers"),
            Map.entry(86, "Heavy snow showers"),
            Map.entry(95, "Thunderstorm"),
            Map.entry(96, "Thunderstorm with slight hail"),
            Map.entry(99, "Thunderstorm with heavy hail")
    );
} 