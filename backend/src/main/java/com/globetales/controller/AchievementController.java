package com.globetales.controller;

import com.globetales.dto.AchievementDTO;
import com.globetales.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AchievementController extends BaseController {
    private final AchievementService achievementService;

    @GetMapping
    public ResponseEntity<List<AchievementDTO>> getAllAchievements() {
        return ok(achievementService.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<AchievementDTO> getAchievementByCode(@PathVariable String code) {
        return achievementService.findById(code)
                .map(this::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AchievementDTO> createAchievement(@RequestBody AchievementDTO achievementDTO) {
        return created(achievementService.save(achievementDTO));
    }

    @PutMapping("/{code}")
    public ResponseEntity<AchievementDTO> updateAchievement(
            @PathVariable String code,
            @RequestBody AchievementDTO achievementDTO) {
        achievementDTO.setCode(code);
        return ok(achievementService.save(achievementDTO));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable String code) {
        achievementService.deleteById(code);
        return noContent();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AchievementDTO>> getAchievementsByCategory(@PathVariable String category) {
        return ok(achievementService.findByCategory(category));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<AchievementDTO>> getAchievementsByDifficulty(@PathVariable String difficulty) {
        return ok(achievementService.findByDifficulty(difficulty));
    }

    @GetMapping("/user/{userId}/unlocked")
    public ResponseEntity<List<AchievementDTO>> getUnlockedAchievements(@PathVariable UUID userId) {
        return ok(achievementService.findUnlockedAchievements(userId));
    }

    @GetMapping("/user/{userId}/locked")
    public ResponseEntity<List<AchievementDTO>> getLockedAchievements(@PathVariable UUID userId) {
        return ok(achievementService.findLockedAchievements(userId));
    }

    @PostMapping("/user/{userId}/check")
    public ResponseEntity<Void> checkAndAwardAchievements(@PathVariable UUID userId) {
        achievementService.checkAndAwardAchievements(userId);
        return noContent();
    }
} 