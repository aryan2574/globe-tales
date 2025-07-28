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
    List<UserFavourite> findByUserId(UUID userId);
    List<UserFavourite> findByUserIdAndSiteType(UUID userId, String siteType);
    void deleteById(UserFavouriteId id);
    boolean existsById(UserFavouriteId id);
} 