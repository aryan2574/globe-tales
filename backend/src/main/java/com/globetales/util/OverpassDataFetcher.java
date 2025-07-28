package com.globetales.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetales.entity.Place;
import com.globetales.repository.PlaceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;

@Component
public class OverpassDataFetcher implements CommandLineRunner {
    private final PlaceRepository placeRepository;

    public OverpassDataFetcher(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String overpassUrl = "https://overpass-api.de/api/interpreter";
        String query = """
            [out:json][timeout:60];
            (
              node[\"amenity\"=\"theatre\"](50.786,12.803,50.900,12.983);
              node[\"amenity\"=\"restaurant\"](50.786,12.803,50.900,12.983);
              node[\"tourism\"=\"museum\"](50.786,12.803,50.900,12.983);
              node[\"tourism\"=\"artwork\"](50.786,12.803,50.900,12.983);
            );
            out body;
            >;
            out skel qt;
        """;

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
            // Upsert logic: update if exists, else insert
            Place existing = placeRepository.findByOsmId(place.getOsmId());
            if (existing != null) {
                place.setId(existing.getId());
            }
            placeRepository.save(place);
        }
        System.out.println("Overpass data fetch and store complete.");
    }
} 