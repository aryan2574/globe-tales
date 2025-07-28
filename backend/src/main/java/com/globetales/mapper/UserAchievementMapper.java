package com.globetales.mapper;

import com.globetales.dto.UserAchievementDTO;
import com.globetales.entity.Achievement;
import com.globetales.entity.UserAchievement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserAchievementMapper {

    @Mappings({
        @Mapping(source = "id.achievementCode", target = "achievementCode", qualifiedByName = "getAchievementCode"),
        @Mapping(source = "achievedAt", target = "achievedAt"),
        @Mapping(target = "displayName", source = "id.achievementCode", qualifiedByName = "getAchievementDisplayName"),
        @Mapping(target = "description", source = "id.achievementCode", qualifiedByName = "getAchievementDescription")
    })
    UserAchievementDTO toDto(UserAchievement userAchievement);

    @Named("getAchievementCode")
    default String getAchievementCode(String achievementCode) {
        return achievementCode;
    }

    @Named("getAchievementDisplayName")
    default String getAchievementDisplayName(String achievementCode) {
        for (Achievement achievement : Achievement.values()) {
            if (achievement.getCode().equals(achievementCode)) {
                return achievement.getDisplayName();
            }
        }
        return "Unknown Achievement";
    }

    @Named("getAchievementDescription")
    default String getAchievementDescription(String achievementCode) {
        for (Achievement achievement : Achievement.values()) {
            if (achievement.getCode().equals(achievementCode)) {
                return achievement.getDescription();
            }
        }
        return "No description available.";
    }
}