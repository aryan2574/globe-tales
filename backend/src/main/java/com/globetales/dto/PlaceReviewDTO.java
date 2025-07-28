package com.globetales.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class PlaceReviewDTO {
    private UUID id;
    private UUID userId;
    private String username;
    private String placeId;
    private String placeName;
    private String comment;
    private Integer rating;
    private ZonedDateTime createdAt;
} 