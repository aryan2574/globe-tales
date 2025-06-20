package com.globetales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPlaceDTO {
    private UUID id;
    private UUID userId;
    private Long siteId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private OffsetDateTime visitedAt;
    private CulturalSiteDTO site;

    public void setId(UUID id) {
        this.id = id;
    }
} 