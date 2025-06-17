package com.globetales.repository;

import com.globetales.entity.CulturalSite;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CulturalSiteRepository extends JpaRepository<CulturalSite, Long> {
    @Query("SELECT cs FROM CulturalSite cs WHERE ST_Distance(cs.location, :location) <= :radius")
    List<CulturalSite> findNearbySites(@Param("location") Point location, @Param("radius") double radius);

    List<CulturalSite> findBySiteType(String siteType);

    @Query("SELECT cs FROM CulturalSite cs WHERE cs.siteType = :siteType AND ST_Distance(cs.location, :location) <= :radius")
    List<CulturalSite> findNearbySitesByType(
            @Param("location") Point location,
            @Param("radius") double radius,
            @Param("siteType") String siteType);

    @Query(value = "SELECT * FROM cultural_sites WHERE to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', :query)", nativeQuery = true)
    List<CulturalSite> search(@Param("query") String query);
} 