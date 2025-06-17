package com.globetales.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CulturalSiteDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 200, message = "Name must be between 2 and 200 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private PointDTO location;

    @NotBlank(message = "Site type is required")
    private String siteType;

    private String openingHours;
    private String contactInfo;
    private String websiteUrl;

    public void setId(Long id) {
        this.id = id;
    }
} 