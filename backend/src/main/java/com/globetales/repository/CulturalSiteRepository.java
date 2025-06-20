package com.globetales.repository;

import com.globetales.entity.CulturalSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CulturalSiteRepository extends JpaRepository<CulturalSite, Long> {
    List<CulturalSite> findBySiteType(String siteType);

    @Query(value = "SELECT * FROM cultural_sites WHERE to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', :query)", nativeQuery = true)
    List<CulturalSite> search(@Param("query") String query);
} 