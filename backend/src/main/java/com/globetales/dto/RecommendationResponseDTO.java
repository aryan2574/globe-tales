package com.globetales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    private List<RecommendationDTO> recommendations;
    private boolean hasMore;
} 