package com.globetales.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "cultural_sites")
public class CulturalSite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "site_type")
    private String siteType;

    @Column(name = "opening_hours")
    private String openingHours;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "website_url")
    private String websiteUrl;

    @OneToMany(mappedBy = "site")
    private Set<UserFavourite> favourites;

    @OneToMany(mappedBy = "site")
    private Set<UserPlace> visitedPlaces;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getSiteType() {
        return siteType;
    }

    public void setSiteType(String siteType) {
        this.siteType = siteType;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public Set<UserFavourite> getFavourites() {
        return favourites;
    }

    public void setFavourites(Set<UserFavourite> favourites) {
        this.favourites = favourites;
    }

    public Set<UserPlace> getVisitedPlaces() {
        return visitedPlaces;
    }

    public void setVisitedPlaces(Set<UserPlace> visitedPlaces) {
        this.visitedPlaces = visitedPlaces;
    }
} 