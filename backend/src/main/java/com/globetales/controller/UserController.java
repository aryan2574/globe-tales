package com.globetales.controller;

import com.globetales.dto.UserDTO;
import com.globetales.dto.LocationDTO;
import com.globetales.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO, @RequestParam String password) {
        return ResponseEntity.created(null).body(userService.createUser(userDTO, password));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody UserDTO userDTO) {
        userDTO.setId(id);
        return ResponseEntity.ok(userService.save(userDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<Void> updateUserLocation(
            @PathVariable UUID id,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        userService.updateUserLocation(id, latitude, longitude);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        return ResponseEntity.ok(userService.existsByEmail(email));
    }

    @GetMapping("/check/username")
    public ResponseEntity<Boolean> checkUsernameExists(@RequestParam String username) {
        return ResponseEntity.ok(userService.existsByUsername(username));
    }

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

    @PostMapping("/{id}/location")
    public ResponseEntity<Void> setUserLocation(@PathVariable UUID id, @RequestBody LocationDTO location) {
        userService.updateUserLocation(id, location.getLatitude(), location.getLongitude());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/location")
    public ResponseEntity<Void> updateCurrentUserLocation(@RequestBody LocationDTO locationDTO) {
        userService.updateCurrentUserLocation(locationDTO.getLatitude(), locationDTO.getLongitude());
        return ResponseEntity.noContent().build();
    }
} 