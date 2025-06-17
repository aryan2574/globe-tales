package com.globetales.service;

import com.globetales.dto.CulturalSiteDTO;
import com.globetales.dto.PointDTO;
import org.locationtech.jts.geom.Point;
import java.util.List;
import java.util.Optional;

public interface CulturalSiteService extends BaseService<CulturalSiteDTO, Long> {
    List<CulturalSiteDTO> findAll();
    Optional<CulturalSiteDTO> findById(Long id);
    CulturalSiteDTO save(CulturalSiteDTO culturalSiteDTO);
    void deleteById(Long id);
    boolean existsById(Long id);
    List<CulturalSiteDTO> findNearbySites(Point location, double radiusInMeters);
    List<CulturalSiteDTO> findBySiteType(String siteType);
    List<CulturalSiteDTO> findNearbyByType(Point location, double radiusInMeters, String siteType);
    List<CulturalSiteDTO> search(String query);
} 