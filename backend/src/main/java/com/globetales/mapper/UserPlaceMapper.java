package com.globetales.mapper;

import com.globetales.dto.UserPlaceDTO;
import com.globetales.entity.UserPlace;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CulturalSiteMapper.class, PointMapper.class})
public interface UserPlaceMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "siteId", source = "site.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "site.name")
    @Mapping(target = "description", source = "site.description")
    @Mapping(target = "location", source = "site.location")
    @Mapping(target = "location.latitude", source = "site.location.y")
    @Mapping(target = "location.longitude", source = "site.location.x")
    UserPlaceDTO toDTO(UserPlace userPlace);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "site", ignore = true)
    UserPlace toEntity(UserPlaceDTO userPlaceDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "site", ignore = true)
    void updateEntityFromDTO(UserPlaceDTO userPlaceDTO, @MappingTarget UserPlace userPlace);
} 