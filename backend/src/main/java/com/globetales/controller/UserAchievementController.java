package com.globetales.controller;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.service.UserAchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-achievements")
@RequiredArgsConstructor
public class UserAchievementController {

    private final UserAchievementService userAchievementService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAchievementDTO>> getAchievementsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userAchievementService.findByUserId(userId));
    }
} 