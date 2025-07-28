package com.globetales.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_achievements")
public class UserAchievement {

    @EmbeddedId
    private UserAchievementId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Column(name = "achieved_at", nullable = false)
    private OffsetDateTime achievedAt;

    @PrePersist
    protected void onCreate() {
        achievedAt = OffsetDateTime.now();
    }
} 