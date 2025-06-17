package com.globetales.repository;

import com.globetales.entity.UserPlace;
import com.globetales.entity.UserPlaceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserPlaceRepository extends JpaRepository<UserPlace, UserPlaceId> {
    List<UserPlace> findByUserId(UUID userId);
    
    boolean existsByUserIdAndSiteId(UUID userId, Long siteId);
    
    void deleteByUserIdAndSiteId(UUID userId, Long siteId);
    
    @Query("SELECT up FROM UserPlace up JOIN up.site cs WHERE up.userId = :userId AND cs.siteType = :siteType")
    List<UserPlace> findByUserIdAndSiteType(@Param("userId") UUID userId, @Param("siteType") String siteType);
    
    @Query("SELECT up FROM UserPlace up WHERE up.userId = :userId AND up.visitStatus = :visitStatus")
    List<UserPlace> findByUserIdAndVisitStatus(@Param("userId") UUID userId, @Param("visitStatus") String visitStatus);

    List<UserPlace> findRecentPlacesByUserId(UUID userId, int limit);
} 