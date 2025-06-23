package com.globetales.controller;

import com.globetales.entity.Place;
import com.globetales.service.PlaceService;
import com.globetales.service.OverpassService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {
    private final PlaceService placeService;
    private final OverpassService overpassService;

    public PlaceController(PlaceService placeService, OverpassService overpassService) {
        this.placeService = placeService;
        this.overpassService = overpassService;
    }

    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @GetMapping("/{id}")
    public Place getPlaceById(@PathVariable Long id) {
        return placeService.getPlaceById(id);
    }

    @PostMapping("/fetch")
    public String fetchPlacesForArea(@RequestParam("bbox") String bbox) throws Exception {
        // bbox format: south,west,north,east
        String[] parts = bbox.split(",");
        if (parts.length != 4) return "Invalid bbox";
        double south = Double.parseDouble(parts[0]);
        double west = Double.parseDouble(parts[1]);
        double north = Double.parseDouble(parts[2]);
        double east = Double.parseDouble(parts[3]);
        overpassService.fetchAndStorePlaces(south, west, north, east);
        return "Fetch started for bbox: " + bbox;
    }
} 