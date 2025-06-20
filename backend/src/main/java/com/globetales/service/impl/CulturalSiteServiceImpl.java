package com.globetales.service.impl;

import com.globetales.dto.CulturalSiteDTO;
import com.globetales.entity.CulturalSite;
import com.globetales.mapper.CulturalSiteMapper;
import com.globetales.repository.CulturalSiteRepository;
import com.globetales.service.CulturalSiteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CulturalSiteServiceImpl implements CulturalSiteService {

    private final CulturalSiteRepository culturalSiteRepository;
    private final CulturalSiteMapper culturalSiteMapper;

    public CulturalSiteServiceImpl(CulturalSiteRepository culturalSiteRepository, CulturalSiteMapper culturalSiteMapper) {
        this.culturalSiteRepository = culturalSiteRepository;
        this.culturalSiteMapper = culturalSiteMapper;
    }

    @Override
    public Optional<CulturalSiteDTO> findById(Long id) {
        return culturalSiteRepository.findById(id)
                .map(culturalSiteMapper::toDTO);
    }

    @Override
    public List<CulturalSiteDTO> findAll() {
        return culturalSiteRepository.findAll()
                .stream()
                .map(culturalSiteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CulturalSiteDTO save(CulturalSiteDTO culturalSiteDTO) {
        CulturalSite culturalSite = culturalSiteMapper.toEntity(culturalSiteDTO);
        CulturalSite savedSite = culturalSiteRepository.save(culturalSite);
        return culturalSiteMapper.toDTO(savedSite);
    }

    @Override
    public void deleteById(Long id) {
        culturalSiteRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return culturalSiteRepository.existsById(id);
    }

    @Override
    public List<CulturalSiteDTO> findNearbySites(double latitude, double longitude, double radius) {
        // Simple Haversine filter in Java (for demo; for large datasets, use native SQL or PostGIS)
        return culturalSiteRepository.findAll().stream()
            .filter(site -> site.getLatitude() != null && site.getLongitude() != null &&
                haversine(site.getLatitude(), site.getLongitude(), latitude, longitude) <= radius)
            .map(culturalSiteMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<CulturalSiteDTO> findBySiteType(String siteType) {
        return culturalSiteRepository.findBySiteType(siteType)
                .stream()
                .map(culturalSiteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CulturalSiteDTO> findNearbyByType(double latitude, double longitude, double radius, String siteType) {
        return culturalSiteRepository.findBySiteType(siteType).stream()
            .filter(site -> site.getLatitude() != null && site.getLongitude() != null &&
                haversine(site.getLatitude(), site.getLongitude(), latitude, longitude) <= radius)
            .map(culturalSiteMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<CulturalSiteDTO> search(String query) {
        return culturalSiteRepository.search(query)
                .stream()
                .map(culturalSiteMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Haversine formula for distance in meters
    private static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
} 