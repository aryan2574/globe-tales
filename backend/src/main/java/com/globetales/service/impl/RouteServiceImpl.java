package com.globetales.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetales.config.OpenRouteServiceConfig;
import com.globetales.dto.RouteRequestDTO;
import com.globetales.dto.RouteResponseDTO;
import com.globetales.exception.ResourceNotFoundException;
import com.globetales.service.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteServiceImpl implements RouteService {
    @Value("${openrouteservice.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate;
    private final OpenRouteServiceConfig config;

    private static final String API_URL = "https://api.openrouteservice.org/v2/directions/";

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
    @Cacheable(value = "routes", key = "#routeRequest")
    public RouteResponseDTO getRoute(RouteRequestDTO routeRequest) {
        log.info("Fetching route from OpenRouteService for request: {}", routeRequest);
        String profile = mapTransportMode(routeRequest.getTransportMode());
        String url = API_URL + profile + "/geojson";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", apiKey);

        // Prepare coordinates in [lng, lat] order
        List<List<Double>> coordinates = new ArrayList<>();
        coordinates.add(List.of(routeRequest.getStart().getLongitude(), routeRequest.getStart().getLatitude()));
        coordinates.add(List.of(routeRequest.getEnd().getLongitude(), routeRequest.getEnd().getLatitude()));
        String body = "{\"coordinates\": " + objectMapper.valueToTree(coordinates).toString() + "}";
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            String responseBody = response.getBody();

            if (responseBody == null || responseBody.isBlank()) {
                log.warn("OpenRouteService returned an empty response for request: {}", routeRequest);
                throw new ResourceNotFoundException("No route found (empty response).");
            }

            log.debug("OpenRouteService response: {}", responseBody);
            return parseGeoJsonResponse(responseBody);
        } catch (Exception e) {
            log.error("Failed to get route from OpenRouteService: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get route: " + e.getMessage(), e);
        }
    }

    private RouteResponseDTO parseGeoJsonResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        JsonNode features = root.path("features");
        if (features.isMissingNode() || !features.isArray() || features.isEmpty()) {
            throw new ResourceNotFoundException("No features found in GeoJSON response.");
        }

        JsonNode feature = features.get(0);
        JsonNode properties = feature.path("properties");
        JsonNode summary = properties.path("summary");

        double distance = summary.path("distance").asDouble();
        double duration = summary.path("duration").asDouble();

        JsonNode geometryNode = feature.path("geometry");
        List<List<Double>> coordinates = new ArrayList<>();
        if (geometryNode.path("type").asText().equals("LineString")) {
            for (JsonNode coordNode : geometryNode.path("coordinates")) {
                List<Double> point = new ArrayList<>();
                point.add(coordNode.get(0).asDouble());
                point.add(coordNode.get(1).asDouble());
                coordinates.add(point);
            }
        }

        RouteResponseDTO.Geometry geometry = RouteResponseDTO.Geometry.builder()
            .type("LineString")
            .coordinates(coordinates)
            .build();

        return RouteResponseDTO.builder()
            .distance(distance)
            .duration(duration)
            .geometry(geometry)
            .build();
    }
} 