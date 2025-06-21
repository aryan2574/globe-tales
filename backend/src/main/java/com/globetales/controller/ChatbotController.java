package com.globetales.controller;

import com.globetales.dto.ChatbotRequest;
import com.globetales.dto.ChatbotResponse;
import com.globetales.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.globetales.service.WeatherService;
import com.globetales.service.impl.WeatherServiceImpl;
import com.globetales.dto.WeatherResponseDTO;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final WeatherService weatherService;

    public ChatbotController(ChatbotService chatbotService, WeatherService weatherService) {
        this.chatbotService = chatbotService;
        this.weatherService = weatherService;
    }

    @PostMapping
    public ResponseEntity<ChatbotResponse> chat(@RequestBody ChatbotRequest chatbotRequest) {
        return ResponseEntity.ok(chatbotService.chat(chatbotRequest));
    }

    @GetMapping("/greeting")
    public ResponseEntity<ChatbotResponse> getGreeting(@RequestParam double lat, @RequestParam double lon) {
        WeatherResponseDTO weather = weatherService.getWeather(lat, lon);
        String weatherDescription = WeatherServiceImpl.getWeatherDescription(weather.getCurrentWeather().getWeatherCode());
        double temperature = weather.getCurrentWeather().getTemperature();

        String greeting = String.format(
            "Hello! It's currently %.0f°C and %s. How can I help you today?",
            temperature,
            weatherDescription.toLowerCase()
        );

        return ResponseEntity.ok(new ChatbotResponse(greeting));
    }
} 