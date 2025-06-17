package com.globetales.repository;

import com.globetales.entity.UserFavourite;
import com.globetales.entity.UserFavouriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserFavouriteRepository extends JpaRepository<UserFavourite, UserFavouriteId> {
    List<UserFavourite> findByUser_Id(UUID userId);
    void deleteByUser_IdAndSite_Id(UUID userId, Long siteId);
    List<UserFavourite> findByUser_IdAndSiteType(UUID userId, String siteType);
    boolean existsByUser_IdAndSite_Id(UUID userId, Long siteId);
    List<UserFavourite> findByUserId(UUID userId);
} 