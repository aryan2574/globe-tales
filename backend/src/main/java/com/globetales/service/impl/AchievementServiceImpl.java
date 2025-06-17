package com.globetales.service.impl;

import com.globetales.dto.AchievementDTO;
import com.globetales.entity.Achievement;
import com.globetales.mapper.AchievementMapper;
import com.globetales.repository.AchievementRepository;
import com.globetales.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AchievementServiceImpl implements AchievementService {
    private final AchievementRepository achievementRepository;
    private final AchievementMapper achievementMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AchievementDTO> findAll() {
        return achievementRepository.findAll().stream()
                .map(achievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AchievementDTO> findById(String code) {
        return achievementRepository.findById(code)
                .map(achievementMapper::toDTO);
    }

    @Override
    public AchievementDTO save(AchievementDTO achievementDTO) {
        Achievement achievement = achievementMapper.toEntity(achievementDTO);
        return achievementMapper.toDTO(achievementRepository.save(achievement));
    }

    @Override
    public void deleteById(String code) {
        achievementRepository.deleteById(code);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(String code) {
        return achievementRepository.existsById(code);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementDTO> findByCategory(String category) {
        return achievementRepository.findByCategory(category).stream()
                .map(achievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementDTO> findByDifficulty(String difficulty) {
        return achievementRepository.findByDifficulty(difficulty).stream()
                .map(achievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementDTO> findUnlockedAchievements(UUID userId) {
        return achievementRepository.findUnlockedAchievements(userId).stream()
                .map(achievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementDTO> findLockedAchievements(UUID userId) {
        return achievementRepository.findLockedAchievements(userId).stream()
                .map(achievementMapper::toDTO)
                .toList();
    }

    @Override
    public void checkAndAwardAchievements(UUID userId) {
        // This method will be implemented to check various conditions and award achievements
        // For example:
        // 1. Check number of visited places
        // 2. Check number of different site types visited
        // 3. Check if user has visited places in different countries
        // 4. Check if user has completed certain challenges
        // The implementation will depend on the specific achievement criteria
    }
} 