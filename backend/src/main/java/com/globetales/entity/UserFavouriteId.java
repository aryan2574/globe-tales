package com.globetales.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class UserFavouriteId implements Serializable {
    private UUID userId;
    private Long siteId;

    public UserFavouriteId() {
    }

    public UserFavouriteId(UUID userId, Long siteId) {
        this.userId = userId;
        this.siteId = siteId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserFavouriteId that = (UserFavouriteId) o;

        if (!userId.equals(that.userId)) return false;
        return siteId.equals(that.siteId);
    }

    @Override
    public int hashCode() {
        int result = userId.hashCode();
        result = 31 * result + siteId.hashCode();
        return result;
    }
} 