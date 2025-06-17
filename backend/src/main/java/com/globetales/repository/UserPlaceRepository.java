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
    @Query("SELECT up FROM UserPlace up WHERE up.user.id = :userId")
    List<UserPlace> findByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT CASE WHEN COUNT(up) > 0 THEN true ELSE false END FROM UserPlace up WHERE up.user.id = :userId AND up.site.id = :siteId")
    boolean existsByUserIdAndSiteId(@Param("userId") UUID userId, @Param("siteId") Long siteId);
    
    @Query("DELETE FROM UserPlace up WHERE up.user.id = :userId AND up.site.id = :siteId")
    void deleteByUserIdAndSiteId(@Param("userId") UUID userId, @Param("siteId") Long siteId);
    
    @Query("SELECT up FROM UserPlace up WHERE up.user.id = :userId AND up.site.siteType = :siteType")
    List<UserPlace> findByUserIdAndSiteType(@Param("userId") UUID userId, @Param("siteType") String siteType);
    
    @Query("SELECT up FROM UserPlace up WHERE up.user.id = :userId AND up.visitStatus = :visitStatus")
    List<UserPlace> findByUserIdAndVisitStatus(@Param("userId") UUID userId, @Param("visitStatus") String visitStatus);

    @Query(value = "SELECT up FROM UserPlace up WHERE up.user.id = :userId ORDER BY up.visitedAt DESC LIMIT :limit", nativeQuery = true)
    List<UserPlace> findRecentPlacesByUserId(@Param("userId") UUID userId, @Param("limit") int limit);
} 