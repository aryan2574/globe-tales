package com.globetales.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_favourites")
public class UserFavourite {
    @EmbeddedId
    private UserFavouriteId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Column(name = "site_type")
    private String siteType;

    @Column(name = "saved_at")
    private LocalDateTime savedAt;

    @Column(name = "place_name")
    private String placeName;

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }
} 