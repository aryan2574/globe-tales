package com.globetales.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetales.entity.Place;
import com.globetales.repository.PlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;
import org.springframework.scheduling.annotation.Scheduled;

@Service
public class OverpassService {
    private final PlaceRepository placeRepository;

    // Chemnitz bounding box
    private static final double CHEMNITZ_SOUTH = 50.786;
    private static final double CHEMNITZ_WEST = 12.803;
    private static final double CHEMNITZ_NORTH = 50.900;
    private static final double CHEMNITZ_EAST = 12.983;

    public OverpassService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public void fetchAndStorePlaces(double south, double west, double north, double east) throws Exception {
        String overpassUrl = "https://overpass-api.de/api/interpreter";
        String query = String.format("""
            [out:json][timeout:60];
            (
              node[\"amenity\"=\"theatre\"](%f,%f,%f,%f);
              node[\"amenity\"=\"restaurant\"](%f,%f,%f,%f);
              node[\"tourism\"=\"museum\"](%f,%f,%f,%f);
              node[\"tourism\"=\"artwork\"](%f,%f,%f,%f);
            );
            out body;
            >;
            out skel qt;
        """,
            south, west, north, east,
            south, west, north, east,
            south, west, north, east,
            south, west, north, east
        );

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String body = "data=" + URLEncoder.encode(query, StandardCharsets.UTF_8);
        HttpEntity<String> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(overpassUrl, request, String.class);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response.getBody());
        for (JsonNode element : root.get("elements")) {
            if (!element.has("lat") || !element.has("lon")) continue;
            Place place = new Place();
            place.setOsmId(element.get("id").asLong());
            place.setLatitude(element.get("lat").asDouble());
            place.setLongitude(element.get("lon").asDouble());
            if (element.has("tags")) {
                JsonNode tags = element.get("tags");
                place.setName(tags.has("name") ? tags.get("name").asText() : null);
                place.setType(tags.has("amenity") ? tags.get("amenity").asText() :
                              tags.has("tourism") ? tags.get("tourism").asText() : null);
                place.setAddress(tags.has("addr:full") ? tags.get("addr:full").asText() : null);
                place.setTags(mapper.convertValue(tags, new TypeReference<Map<String, Object>>() {}));
            }
            Place existing = placeRepository.findByOsmId(place.getOsmId());
            if (existing != null) {
                place.setId(existing.getId());
            }
            placeRepository.save(place);
        }
    }

    public boolean hasPlacesInArea(double south, double west, double north, double east) {
        return placeRepository.countByBoundingBox(south, west, north, east) > 0;
    }

    /**
     * Scheduled job to update Chemnitz sites every 3 days
     */
    @Scheduled(cron = "0 0 0 */3 * *") // Every 3 days at midnight
    public void scheduledUpdateChemnitzSites() {
        try {
            fetchAndStorePlaces(CHEMNITZ_SOUTH, CHEMNITZ_WEST, CHEMNITZ_NORTH, CHEMNITZ_EAST);
            System.out.println("[Scheduler] Chemnitz sites updated from Overpass API.");
        } catch (Exception e) {
            System.err.println("[Scheduler] Failed to update Chemnitz sites: " + e.getMessage());
        }
    }

    /**
     * Update sites for a given bounding box (can be called when user is outside Chemnitz)
     */
    public void updateSitesForArea(double south, double west, double north, double east) throws Exception {
        fetchAndStorePlaces(south, west, north, east);
    }
} 