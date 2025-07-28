package com.globetales.controller;

import com.globetales.entity.Place;
import com.globetales.service.PlaceService;
import com.globetales.service.OverpassService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

/**
 * Controller for managing places.
 */
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

    /**
     * Get all places.
     * @return List of all places
     */
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    /**
     * Get a place by its internal ID.
     * @param id Internal database ID
     * @return Place object
     */
    @GetMapping("/{id}")
    public Place getPlaceById(@PathVariable Long id) {
        return placeService.getPlaceById(id);
    }

    /**
     * Fetch and store places for a given bounding box.
     * @param bbox Bounding box in format south,west,north,east
     * @return Status message
     */
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
     * Update sites for a given bounding box (for when user is outside Chemnitz).
     * @param bbox Bounding box in format south,west,north,east
     * @return Status message
     * @throws Exception if update fails
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

    /**
     * Get a place by its OSM ID.
     * @param osmId OSM node ID
     * @return Place object
     */
    @GetMapping("/osm/{osmId}")
    public Place getPlaceByOsmId(@PathVariable Long osmId) {
        return placeService.getPlaceByOsmId(osmId);
    }

    /**
     * Import a list of places by OSM IDs. Fetches from Overpass if missing.
     * @param osmIds List of OSM IDs
     * @return Status message
     */
    @PostMapping("/import-osm")
    public ResponseEntity<?> importOsmPlaces(@RequestBody List<Long> osmIds) {
        int imported = 0;
        for (Long osmId : osmIds) {
            try {
                placeService.importPlaceByOsmId(osmId);
                imported++;
            } catch (Exception e) {
                // log and skip
            }
        }
        return ResponseEntity.ok("Imported/ensured " + imported + " places.");
    }
} 