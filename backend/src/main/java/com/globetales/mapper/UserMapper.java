package com.globetales.mapper;

import com.globetales.dto.UserDTO;
import com.globetales.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "displayName", source = "displayName")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "latitude", source = "latitude")
    @Mapping(target = "longitude", source = "longitude")
    @Mapping(target = "experiencePoints", source = "experiencePoints")
    @Mapping(target = "level", source = "level")
    UserDTO toDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "latitude", source = "latitude")
    @Mapping(target = "longitude", source = "longitude")
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "experiencePoints", ignore = true)
    @Mapping(target = "level", ignore = true)
    User toEntity(UserDTO userDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "latitude", source = "latitude")
    @Mapping(target = "longitude", source = "longitude")
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "experiencePoints", ignore = true)
    @Mapping(target = "level", ignore = true)
    void updateEntityFromDTO(UserDTO userDTO, @MappingTarget User user);
} 