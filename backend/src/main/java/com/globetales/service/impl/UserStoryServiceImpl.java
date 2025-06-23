package com.globetales.service.impl;

import com.globetales.dto.UserStoryDTO;
import com.globetales.entity.User;
import com.globetales.entity.UserStory;
import com.globetales.exception.ResourceNotFoundException;
import com.globetales.repository.UserRepository;
import com.globetales.repository.UserStoryRepository;
import com.globetales.service.UserStoryService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserStoryServiceImpl implements UserStoryService {

    private final UserStoryRepository userStoryRepository;
    private final UserRepository userRepository;

    public UserStoryServiceImpl(UserStoryRepository userStoryRepository, UserRepository userRepository) {
        this.userStoryRepository = userStoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserStoryDTO createStory(UserStoryDTO userStoryDTO, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        UserStory userStory = toEntity(userStoryDTO);
        userStory.setUser(user);
        UserStory savedStory = userStoryRepository.save(userStory);
        return toDTO(savedStory);
    }

    @Override
    public List<UserStoryDTO> getStoriesForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return userStoryRepository.findAllDTOByUserId(user.getId());
    }

    @Override
    public UserStoryDTO getStoryById(UUID id, String email) {
        UserStory userStory = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
        if (!userStory.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to view this story");
        }
        return toDTO(userStory);
    }

    @Override
    public UserStoryDTO updateStory(UUID id, UserStoryDTO userStoryDTO, String email) {
        UserStory existingStory = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
        if (!existingStory.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to update this story");
        }
        existingStory.setTitle(userStoryDTO.getTitle());
        existingStory.setContent(userStoryDTO.getContent());
        existingStory.setPlaceId(userStoryDTO.getPlaceId());
        UserStory updatedStory = userStoryRepository.save(existingStory);
        return toDTO(updatedStory);
    }

    @Override
    public void deleteStory(UUID id, String email) {
        UserStory userStory = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
        if (!userStory.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to delete this story");
        }
        userStoryRepository.delete(userStory);
    }

    private UserStoryDTO toDTO(UserStory userStory) {
        UserStoryDTO dto = new UserStoryDTO();
        dto.setId(userStory.getId());
        if (userStory.getUser() != null) {
            dto.setUserId(userStory.getUser().getId());
        }
        dto.setPlaceId(userStory.getPlaceId());
        dto.setTitle(userStory.getTitle());
        dto.setContent(userStory.getContent());
        dto.setCreatedAt(userStory.getCreatedAt());
        dto.setUpdatedAt(userStory.getUpdatedAt());
        return dto;
    }

    private UserStory toEntity(UserStoryDTO dto) {
        UserStory userStory = new UserStory();
        userStory.setId(dto.getId());
        userStory.setPlaceId(dto.getPlaceId());
        userStory.setTitle(dto.getTitle());
        userStory.setContent(dto.getContent());
        return userStory;
    }
} 