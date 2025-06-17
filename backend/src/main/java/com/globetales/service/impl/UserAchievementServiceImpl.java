package com.globetales.service.impl;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.entity.UserAchievement;
import com.globetales.mapper.UserAchievementMapper;
import com.globetales.repository.AchievementRepository;
import com.globetales.repository.UserAchievementRepository;
import com.globetales.repository.UserRepository;
import com.globetales.service.UserAchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserAchievementServiceImpl implements UserAchievementService {
    private final UserAchievementRepository userAchievementRepository;
    private final UserAchievementMapper userAchievementMapper;
    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserAchievementDTO> findAll() {
        return userAchievementRepository.findAll().stream()
                .map(userAchievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserAchievementDTO> findById(UUID id) {
        return userAchievementRepository.findById(id)
                .map(userAchievementMapper::toDTO);
    }

    @Override
    public UserAchievementDTO save(UserAchievementDTO userAchievementDTO) {
        UserAchievement userAchievement = userAchievementMapper.toEntity(userAchievementDTO);
        return userAchievementMapper.toDTO(userAchievementRepository.save(userAchievement));
    }

    @Override
    public void deleteById(UUID id) {
        userAchievementRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(UUID id) {
        return userAchievementRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAchievementDTO> findByUserId(UUID userId) {
        return userAchievementRepository.findByUserId(userId).stream()
                .map(userAchievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUserIdAndAchievementCode(UUID userId, String achievementCode) {
        return userAchievementRepository.existsByUserIdAndAchievementCode(userId, achievementCode);
    }

    @Override
    public void unlockAchievement(UUID userId, String achievementCode) {
        if (!existsByUserIdAndAchievementCode(userId, achievementCode)) {
            UserAchievement userAchievement = new UserAchievement();
            userAchievement.setUser(userRepository.findById(userId).orElseThrow());
            userAchievement.setAchievement(achievementRepository.findById(achievementCode).orElseThrow());
            userAchievement.setEarnedAt(LocalDateTime.now());
            userAchievementRepository.save(userAchievement);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAchievementDTO> findRecentAchievements(UUID userId, Pageable pageable) {
        return userAchievementRepository.findRecentAchievementsByUserId(userId, pageable).stream()
                .map(userAchievementMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAchievementDTO> findAchievementsByCategory(UUID userId, String category) {
        return userAchievementRepository.findByUserIdAndAchievementCategory(userId, category).stream()
                .map(userAchievementMapper::toDTO)
                .toList();
    }
} 