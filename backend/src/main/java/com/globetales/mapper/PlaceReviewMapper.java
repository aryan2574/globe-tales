package com.globetales.mapper;

import com.globetales.dto.PlaceReviewDTO;
import com.globetales.entity.PlaceReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlaceReviewMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    PlaceReviewDTO toDto(PlaceReview placeReview);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "updatedAt", ignore = true)
    PlaceReview toEntity(PlaceReviewDTO placeReviewDTO);
} 