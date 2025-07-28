package com.globetales.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class UserAchievementId implements Serializable {
    private UUID userId;
    private String achievementCode;

    public UserAchievementId() {
    }

    public UserAchievementId(UUID userId, String achievementCode) {
        this.userId = userId;
        this.achievementCode = achievementCode;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getAchievementCode() {
        return achievementCode;
    }

    public void setAchievementCode(String achievementCode) {
        this.achievementCode = achievementCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserAchievementId that = (UserAchievementId) o;

        if (!userId.equals(that.userId)) return false;
        return achievementCode.equals(that.achievementCode);
    }

    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + achievementCode.hashCode();
        return result;
    }
} 