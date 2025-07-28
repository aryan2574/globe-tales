package com.globetales.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponseDTO {
    private double distance;
    private double duration;
    private Geometry geometry;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Geometry {
        private String type;
        private List<List<Double>> coordinates; // [ [lng, lat], ... ]
    }
} 