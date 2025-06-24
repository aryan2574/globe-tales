package com.globetales.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequestDTO {
    private PointDTO start;
    private PointDTO end;
    private String transportMode; // e.g., "driving-car", "foot-walking"

    @Override
    public String toString() {
        return "RouteRequestDTO{" +
                "start=" + start +
                ", end=" + end +
                ", transportMode='" + transportMode + '\'' +
                '}';
    }
} 