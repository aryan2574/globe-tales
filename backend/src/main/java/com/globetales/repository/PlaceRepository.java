package com.globetales.repository;

import com.globetales.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    Place findByOsmId(Long osmId);

    @Query("SELECT COUNT(p) FROM Place p WHERE p.latitude BETWEEN :south AND :north AND p.longitude BETWEEN :west AND :east")
    long countByBoundingBox(@Param("south") double south, @Param("west") double west, @Param("north") double north, @Param("east") double east);

    @Query(value = "SELECT * FROM (SELECT p.*, (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(p.latitude)))) AS distance FROM places p) AS places_with_distance WHERE distance < :radius ORDER BY distance LIMIT 50", nativeQuery = true)
    List<Place> findNearbyPlaces(@Param("lat") double latitude, @Param("lon") double longitude, @Param("radius") double radius);
} 