package com.globetales.mapper;

import com.globetales.dto.CulturalSiteDTO;
import com.globetales.entity.CulturalSite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {PointMapper.class})
public interface CulturalSiteMapper {
    CulturalSiteDTO toDTO(CulturalSite site);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "visitedPlaces", ignore = true)
    CulturalSite toEntity(CulturalSiteDTO siteDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "visitedPlaces", ignore = true)
    void updateEntityFromDTO(CulturalSiteDTO siteDTO, @MappingTarget CulturalSite site);
} 