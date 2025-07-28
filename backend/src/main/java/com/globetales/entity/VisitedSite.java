package com.globetales.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "visited_sites")
public class VisitedSite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private Long placeId;
    private String placeName;
    private Double latitude;
    private Double longitude;

    private LocalDateTime visitedAt;
} 