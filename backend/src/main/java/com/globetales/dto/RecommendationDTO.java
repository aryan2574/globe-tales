package com.globetales.dto;

import com.globetales.entity.Place;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private Place place;
    private double distance; // in meters
    private double duration; // in seconds
} 