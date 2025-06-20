package com.globetales.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetales.dto.RouteRequestDTO;
import com.globetales.dto.RouteResponseDTO;
import com.globetales.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {
    private static final Logger logger = LoggerFactory.getLogger(RouteServiceImpl.class);
    @Value("${openrouteservice.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate;

    // Polyline decoder for OpenRouteService encoded polyline (Google polyline algorithm, 5 precision)
    private static List<List<Double>> decodePolyline(String polyline) {
        List<List<Double>> coordinates = new ArrayList<>();
        int index = 0, len = polyline.length();
        int lat = 0, lng = 0;
        while (index < len) {
            int b, shift = 0, result = 0;
            do {
                b = polyline.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = polyline.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            List<Double> point = new ArrayList<>();
            point.add(lng / 1e5);
            point.add(lat / 1e5);
            coordinates.add(point);
        }
        return coordinates;
    }

    private String mapTransportMode(String mode) {
        if (mode == null) throw new IllegalArgumentException("Transport mode is required");
        switch (mode.toLowerCase()) {
            case "car":
            case "driving-car":
                return "driving-car";
            case "foot":
            case "by foot":
            case "walking":
            case "foot-walking":
                return "foot-walking";
            case "bike":
            case "by bike":
            case "cycling":
            case "cycling-regular":
                return "cycling-regular";
            default:
                throw new IllegalArgumentException("Unsupported transport mode: " + mode);
        }
    }

    @Override
    public RouteResponseDTO getRoute(RouteRequestDTO request) {
        String profile = mapTransportMode(request.getTransportMode());
        String url = "https://api.openrouteservice.org/v2/directions/" + profile;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", apiKey);

        // Prepare coordinates in [lng, lat] order
        List<List<Double>> coordinates = new ArrayList<>();
        coordinates.add(List.of(request.getStart().getLongitude(), request.getStart().getLatitude()));
        coordinates.add(List.of(request.getEnd().getLongitude(), request.getEnd().getLatitude()));
        String body = "{\"coordinates\": " + objectMapper.valueToTree(coordinates).toString() + "}";
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            String responseBody = response.getBody();
            logger.debug("OpenRouteService response: {}", responseBody);
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode route = root.path("routes").get(0);
            double distance = route.path("summary").path("distance").asDouble();
            double duration = route.path("summary").path("duration").asDouble();
            String encodedPolyline = route.path("geometry").asText();
            List<List<Double>> decoded = decodePolyline(encodedPolyline);
            RouteResponseDTO.Geometry geometry = RouteResponseDTO.Geometry.builder()
                .type("LineString")
                .coordinates(decoded)
                .build();
            return RouteResponseDTO.builder()
                .distance(distance)
                .duration(duration)
                .geometry(geometry)
                .build();
        } catch (Exception e) {
            logger.error("Failed to get route from OpenRouteService: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get route: " + e.getMessage(), e);
        }
    }
} 