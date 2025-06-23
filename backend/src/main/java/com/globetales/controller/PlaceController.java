package com.globetales.controller;

import com.globetales.entity.Place;
import com.globetales.service.PlaceService;
import com.globetales.service.OverpassService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/places")
public class PlaceController {
    private static final Logger logger = LoggerFactory.getLogger(PlaceController.class);
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

    /**
     * POST /api/places/update-area?bbox=south,west,north,east
     * Triggers an update for the given bounding box (for when user is outside Chemnitz)
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/update-area")
    public String updateSitesForArea(@RequestParam("bbox") String bbox) throws Exception {
        logger.info("Update sites requested for bbox: {}", bbox);
        String[] parts = bbox.split(",");
        if (parts.length != 4) {
            logger.warn("Invalid bbox received: {}", bbox);
            return "Invalid bbox";
        }
        double south = Double.parseDouble(parts[0]);
        double west = Double.parseDouble(parts[1]);
        double north = Double.parseDouble(parts[2]);
        double east = Double.parseDouble(parts[3]);
        try {
            overpassService.updateSitesForArea(south, west, north, east);
            logger.info("Update succeeded for bbox: {}", bbox);
            return "Update started for bbox: " + bbox;
        } catch (Exception e) {
            logger.error("Update failed for bbox: {}: {}", bbox, e.getMessage());
            throw e;
        }
    }
} 