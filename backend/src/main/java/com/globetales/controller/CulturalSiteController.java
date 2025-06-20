package com.globetales.controller;

import com.globetales.dto.CulturalSiteDTO;
import com.globetales.service.CulturalSiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CulturalSiteController extends BaseController {
    private final CulturalSiteService siteService;

    @GetMapping
    public ResponseEntity<List<CulturalSiteDTO>> getAllSites() {
        return ok(siteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CulturalSiteDTO> getSiteById(@PathVariable Long id) {
        return siteService.findById(id)
                .map(this::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CulturalSiteDTO> createSite(@RequestBody CulturalSiteDTO siteDTO) {
        return created(siteService.save(siteDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CulturalSiteDTO> updateSite(@PathVariable Long id, @RequestBody CulturalSiteDTO siteDTO) {
        siteDTO.setId(id);
        return ok(siteService.save(siteDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
        siteService.deleteById(id);
        return noContent();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<CulturalSiteDTO>> getNearbySites(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius) {
        return ok(siteService.findNearbySites(latitude, longitude, radius));
    }

    @GetMapping("/type/{siteType}")
    public ResponseEntity<List<CulturalSiteDTO>> getSitesByType(@PathVariable String siteType) {
        return ok(siteService.findBySiteType(siteType));
    }

    @GetMapping("/nearby/type/{siteType}")
    public ResponseEntity<List<CulturalSiteDTO>> getNearbySitesByType(
            @PathVariable String siteType,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius) {
        return ok(siteService.findNearbyByType(latitude, longitude, radius, siteType));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CulturalSiteDTO>> searchSites(@RequestParam String query) {
        return ok(siteService.search(query));
    }
} 