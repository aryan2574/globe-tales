package com.globetales.service.impl;

import com.globetales.dto.CulturalSiteDTO;
import com.globetales.entity.CulturalSite;
import com.globetales.mapper.CulturalSiteMapper;
import com.globetales.repository.CulturalSiteRepository;
import com.globetales.service.CulturalSiteService;
import org.locationtech.jts.geom.Point;
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
    public List<CulturalSiteDTO> findNearbySites(Point location, double radius) {
        return culturalSiteRepository.findNearbySites(location, radius)
                .stream()
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
    public List<CulturalSiteDTO> findNearbyByType(Point location, double radius, String siteType) {
        return culturalSiteRepository.findNearbySitesByType(location, radius, siteType)
                .stream()
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
} 