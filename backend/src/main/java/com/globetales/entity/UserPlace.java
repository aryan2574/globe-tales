package com.globetales.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_places")
public class UserPlace {
    @EmbeddedId
    private UserPlaceId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("siteId")
    @JoinColumn(name = "site_id")
    private CulturalSite site;

    @Column(name = "visited_at")
    private OffsetDateTime visitedAt;

    @Column(name = "visit_status", nullable = false)
    private String visitStatus = "VISITED";

    @PrePersist
    protected void onCreate() {
        visitedAt = OffsetDateTime.now();
        if (visitStatus == null) {
            visitStatus = "VISITED";
        }
    }

    // Getters and Setters
    public UserPlaceId getId() {
        return id;
    }

    public void setId(UserPlaceId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CulturalSite getSite() {
        return site;
    }

    public void setSite(CulturalSite site) {
        this.site = site;
    }

    public OffsetDateTime getVisitedAt() {
        return visitedAt;
    }

    public void setVisitedAt(OffsetDateTime visitedAt) {
        this.visitedAt = visitedAt;
    }

    public String getVisitStatus() {
        return visitStatus;
    }

    public void setVisitStatus(String visitStatus) {
        this.visitStatus = visitStatus;
    }
} 