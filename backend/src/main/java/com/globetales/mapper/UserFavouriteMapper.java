package com.globetales.mapper;

import com.globetales.dto.UserFavouriteDTO;
import com.globetales.entity.UserFavourite;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {CulturalSiteMapper.class})
public interface UserFavouriteMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "siteId", source = "site.id")
    UserFavouriteDTO toDTO(UserFavourite userFavourite);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "site", ignore = true)
    UserFavourite toEntity(UserFavouriteDTO userFavouriteDTO);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "site", ignore = true)
    void updateEntityFromDTO(UserFavouriteDTO favouriteDTO, @MappingTarget UserFavourite favourite);
} 