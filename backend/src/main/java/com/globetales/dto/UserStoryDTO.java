package com.globetales.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class UserStoryDTO {
    private UUID id;
    private UUID userId;
    private String placeId;
    private String title;
    private String content;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private ZonedDateTime visitDate;

    public UserStoryDTO(UUID id, String placeId, String title, String content, ZonedDateTime createdAt, ZonedDateTime updatedAt, ZonedDateTime visitDate, UUID userId) {
        this.id = id;
        this.placeId = placeId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.visitDate = visitDate;
        this.userId = userId;
    }

    public UserStoryDTO() {
        // no-args constructor for frameworks and mapping
    }
} 