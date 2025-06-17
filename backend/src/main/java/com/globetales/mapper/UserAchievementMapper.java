package com.globetales.mapper;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.entity.UserAchievement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Mapper(componentModel = "spring", uses = {AchievementMapper.class})
public interface UserAchievementMapper {
    @Mapping(target = "userId", source = "user", qualifiedByName = "userToUserId")
    @Mapping(target = "achievementCode", source = "achievement", qualifiedByName = "achievementToCode")
    @Mapping(target = "earnedAt", source = "earnedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    UserAchievementDTO toDTO(UserAchievement userAchievement);

    // TODO: Set user and achievement from userId and achievementCode using services or context
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "achievement", ignore = true)
    @Mapping(target = "earnedAt", source = "earnedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    UserAchievement toEntity(UserAchievementDTO userAchievementDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "achievement", ignore = true)
    @Mapping(target = "earnedAt", source = "earnedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    void updateEntityFromDTO(UserAchievementDTO userAchievementDTO, @MappingTarget UserAchievement userAchievement);

    @Named("userToUserId")
    default UUID userToUserId(com.globetales.entity.User user) {
        return user != null ? user.getId() : null;
    }

    @Named("achievementToCode")
    default String achievementToCode(com.globetales.entity.Achievement achievement) {
        return achievement != null ? achievement.getCode() : null;
    }

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }
} 