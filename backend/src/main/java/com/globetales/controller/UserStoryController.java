package com.globetales.controller;

import com.globetales.dto.UserStoryDTO;
import com.globetales.service.UserStoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stories")
public class UserStoryController {

    private final UserStoryService userStoryService;

    public UserStoryController(UserStoryService userStoryService) {
        this.userStoryService = userStoryService;
    }

    @PostMapping
    public ResponseEntity<UserStoryDTO> createStory(@RequestBody UserStoryDTO userStoryDTO, Authentication authentication) {
        UserStoryDTO createdStory = userStoryService.createStory(userStoryDTO, authentication.getName());
        return new ResponseEntity<>(createdStory, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserStoryDTO>> getStoriesForUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(List.of());
        }
        List<UserStoryDTO> stories = userStoryService.getStoriesForUser(authentication.getName());
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserStoryDTO> getStoryById(@PathVariable UUID id, Authentication authentication) {
        UserStoryDTO story = userStoryService.getStoryById(id, authentication.getName());
        return ResponseEntity.ok(story);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserStoryDTO> updateStory(@PathVariable UUID id, @RequestBody UserStoryDTO userStoryDTO, Authentication authentication) {
        UserStoryDTO updatedStory = userStoryService.updateStory(id, userStoryDTO, authentication.getName());
        return ResponseEntity.ok(updatedStory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable UUID id, Authentication authentication) {
        userStoryService.deleteStory(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
} 