package com.globetales.controller;

import com.globetales.dto.UserDTO;
import com.globetales.dto.LocationDTO;
import com.globetales.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

@Tag(name = "User", description = "User management APIs")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get user by ID", description = "Returns a single user by their UUID.")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get all users", description = "Returns a list of all users.")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @Operation(summary = "Get current user", description = "Returns the currently authenticated user.")
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @Operation(summary = "Create a new user", description = "Creates a new user with the provided details and password.")
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO, @RequestParam String password) {
        return ResponseEntity.created(null).body(userService.createUser(userDTO, password));
    }

    @Operation(summary = "Update user", description = "Updates the details of an existing user by UUID.")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody UserDTO userDTO) {
        userDTO.setId(id);
        return ResponseEntity.ok(userService.save(userDTO));
    }

    @Operation(summary = "Delete user", description = "Deletes a user by their UUID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update user location", description = "Updates the location of a user by UUID.")
    @PutMapping("/{id}/location")
    public ResponseEntity<Void> updateUserLocation(
            @PathVariable UUID id,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        userService.updateUserLocation(id, latitude, longitude);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Check if email exists", description = "Checks if an email is already registered.")
    @GetMapping("/check/email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        return ResponseEntity.ok(userService.existsByEmail(email));
    }

    @Operation(summary = "Check if username exists", description = "Checks if a username is already registered.")
    @GetMapping("/check/username")
    public ResponseEntity<Boolean> checkUsernameExists(@RequestParam String username) {
        return ResponseEntity.ok(userService.existsByUsername(username));
    }

    @Operation(summary = "Get user location", description = "Returns the location of a user by UUID.")
    @GetMapping("/{id}/location")
    public ResponseEntity<LocationDTO> getUserLocation(@PathVariable UUID id) {
        return userService.findById(id)
            .map(user -> {
                if (user.getLatitude() != null && user.getLongitude() != null) {
                    return ResponseEntity.ok(new LocationDTO(
                        user.getLatitude(),
                        user.getLongitude()
                    ));
                } else {
                    return ResponseEntity.noContent().<LocationDTO>build();
                }
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Set user location", description = "Sets the location of a user by UUID.")
    @PostMapping("/{id}/location")
    public ResponseEntity<Void> setUserLocation(@PathVariable UUID id, @RequestBody LocationDTO location) {
        userService.updateUserLocation(id, location.getLatitude(), location.getLongitude());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update current user location", description = "Updates the location of the currently authenticated user.")
    @PutMapping("/location")
    public ResponseEntity<Void> updateCurrentUserLocation(@RequestBody LocationDTO locationDTO) {
        userService.updateCurrentUserLocation(locationDTO.getLatitude(), locationDTO.getLongitude());
        return ResponseEntity.noContent().build();
    }
} 