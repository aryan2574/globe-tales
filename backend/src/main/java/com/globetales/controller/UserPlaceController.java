package com.globetales.controller;

import com.globetales.dto.UserPlaceDTO;
import com.globetales.entity.UserPlaceId;
import com.globetales.service.UserPlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-places")
public class UserPlaceController {

    private final UserPlaceService userPlaceService;

    public UserPlaceController(UserPlaceService userPlaceService) {
        this.userPlaceService = userPlaceService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserPlaceDTO>> getPlacesByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userPlaceService.findByUserId(userId));
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<UserPlaceDTO>> getRecentPlacesByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(userPlaceService.findRecentPlacesByUserId(userId, limit));
    }

    @PostMapping
    public ResponseEntity<UserPlaceDTO> addPlace(@RequestBody UserPlaceDTO userPlaceDTO) {
        return ResponseEntity.ok(userPlaceService.save(userPlaceDTO));
    }

    @DeleteMapping("/{userId}/{siteId}")
    public ResponseEntity<Void> deletePlace(
            @PathVariable UUID userId,
            @PathVariable Long siteId) {
        UserPlaceId id = new UserPlaceId(userId, siteId);
        userPlaceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 