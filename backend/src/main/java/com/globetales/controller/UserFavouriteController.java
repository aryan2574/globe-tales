package com.globetales.controller;

import com.globetales.dto.UserFavouriteDTO;
import com.globetales.entity.UserFavouriteId;
import com.globetales.service.UserFavouriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-favourites")
public class UserFavouriteController {

    private final UserFavouriteService userFavouriteService;

    public UserFavouriteController(UserFavouriteService userFavouriteService) {
        this.userFavouriteService = userFavouriteService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserFavouriteDTO>> getFavouritesByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userFavouriteService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<UserFavouriteDTO> addFavourite(@RequestBody UserFavouriteDTO userFavouriteDTO) {
        return ResponseEntity.ok(userFavouriteService.save(userFavouriteDTO));
    }

    @DeleteMapping("/user/{userId}/site/{siteId}")
    public ResponseEntity<Void> deleteFavouriteByUserAndSite(
            @PathVariable UUID userId,
            @PathVariable Long siteId) {
        UserFavouriteId id = new UserFavouriteId(userId, siteId);
        userFavouriteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/type/{siteType}")
    public ResponseEntity<List<UserFavouriteDTO>> getFavouritesByType(
            @PathVariable UUID userId,
            @PathVariable String siteType) {
        return ResponseEntity.ok(userFavouriteService.findByUserIdAndSiteType(userId, siteType));
    }
} 