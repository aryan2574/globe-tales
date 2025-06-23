package com.globetales.mapper;

import com.globetales.dto.UserFavouriteDTO;
import com.globetales.entity.UserFavourite;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserFavouriteMapper {
    @Mapping(target = "userId", source = "id.userId")
    @Mapping(target = "siteId", source = "id.siteId")
    @Mapping(target = "siteType", source = "siteType")
    @Mapping(target = "savedAt", source = "savedAt")
    @Mapping(target = "placeName", source = "placeName")
    UserFavouriteDTO toDTO(UserFavourite userFavourite);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "placeName", source = "placeName")
    UserFavourite toEntity(UserFavouriteDTO userFavouriteDTO);

    default UserFavourite toEntityWithId(UserFavouriteDTO dto) {
        if (dto == null) return null;
        UserFavourite entity = toEntity(dto);
        entity.setId(new com.globetales.entity.UserFavouriteId(dto.getUserId(), dto.getSiteId()));
        return entity;
    }
} 