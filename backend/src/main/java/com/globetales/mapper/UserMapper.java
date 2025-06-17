package com.globetales.mapper;

import com.globetales.dto.UserDTO;
import com.globetales.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {PointMapper.class})
public interface UserMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "displayName", source = "displayName")
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "currentLocation", source = "currentLocation")
    UserDTO toDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "visitedPlaces", ignore = true)
    @Mapping(target = "achievements", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserDTO userDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "favourites", ignore = true)
    @Mapping(target = "visitedPlaces", ignore = true)
    @Mapping(target = "achievements", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateEntityFromDTO(UserDTO userDTO, @MappingTarget User user);
} 