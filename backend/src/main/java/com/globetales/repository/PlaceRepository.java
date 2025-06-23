package com.globetales.repository;

import com.globetales.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    Place findByOsmId(Long osmId);

    @Query("SELECT COUNT(p) FROM Place p WHERE p.latitude BETWEEN :south AND :north AND p.longitude BETWEEN :west AND :east")
    long countByBoundingBox(@Param("south") double south, @Param("west") double west, @Param("north") double north, @Param("east") double east);
} 