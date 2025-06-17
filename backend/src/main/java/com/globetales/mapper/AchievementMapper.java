package com.globetales.mapper;

import com.globetales.dto.AchievementDTO;
import com.globetales.entity.Achievement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AchievementMapper {
    AchievementDTO toDTO(Achievement achievement);

    @Mapping(target = "userAchievements", ignore = true)
    Achievement toEntity(AchievementDTO achievementDTO);

    @Mapping(target = "userAchievements", ignore = true)
    void updateEntityFromDTO(AchievementDTO achievementDTO, @MappingTarget Achievement achievement);
} 