package com.globetales.controller;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.service.UserAchievementService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-achievements")
public class UserAchievementController {

    private final UserAchievementService userAchievementService;

    public UserAchievementController(UserAchievementService userAchievementService) {
        this.userAchievementService = userAchievementService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAchievementDTO>> getUserAchievements(@PathVariable UUID userId) {
        return ResponseEntity.ok(userAchievementService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<UserAchievementDTO> createUserAchievement(@RequestBody UserAchievementDTO userAchievementDTO) {
        return ResponseEntity.ok(userAchievementService.save(userAchievementDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAchievement(@PathVariable UUID id) {
        userAchievementService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UserAchievementDTO>> getAllUserAchievements() {
        return ResponseEntity.ok(userAchievementService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserAchievementDTO> getUserAchievementById(@PathVariable UUID id) {
        return userAchievementService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkUserAchievementExists(
            @RequestParam UUID userId,
            @RequestParam String achievementCode) {
        return ResponseEntity.ok(userAchievementService.existsByUserIdAndAchievementCode(userId, achievementCode));
    }

    @PostMapping("/user/{userId}/achievement/{achievementCode}")
    public ResponseEntity<Void> unlockAchievement(
            @PathVariable UUID userId,
            @PathVariable String achievementCode) {
        userAchievementService.unlockAchievement(userId, achievementCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<UserAchievementDTO>> getRecentAchievements(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(userAchievementService.findRecentAchievements(userId, PageRequest.of(0, limit)));
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<UserAchievementDTO>> getAchievementsByCategory(
            @PathVariable UUID userId,
            @PathVariable String category) {
        return ResponseEntity.ok(userAchievementService.findAchievementsByCategory(userId, category));
    }
} 