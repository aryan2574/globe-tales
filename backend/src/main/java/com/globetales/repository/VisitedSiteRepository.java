package com.globetales.repository;

import com.globetales.entity.VisitedSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitedSiteRepository extends JpaRepository<VisitedSite, Long> {
    List<VisitedSite> findByUserId(String userId);
    boolean existsByUserIdAndPlaceId(String userId, Long placeId);
    void deleteByUserIdAndPlaceId(String userId, Long placeId);
    long countByUserId(String userId);
} 