package com.globetales.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Data
@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @Column(name = "code")
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "points", nullable = false)
    private Integer points;

    @OneToMany(mappedBy = "achievement", cascade = CascadeType.ALL)
    private Set<UserAchievement> userAchievements;

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Set<UserAchievement> getUserAchievements() {
        return userAchievements;
    }

    public void setUserAchievements(Set<UserAchievement> userAchievements) {
        this.userAchievements = userAchievements;
    }
} 