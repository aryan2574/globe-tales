package com.globetales.entity;

public enum Achievement {
    FIRST_STORY("FIRST_STORY", "First Story", "You wrote your first story!"),
    FIRST_REVIEW("FIRST_REVIEW", "First Review", "You submitted your first review!"),
    FIRST_VISIT("FIRST_VISIT", "First Visit", "You marked your first visited site!"),
    STORY_PRO("STORY_PRO", "Story Pro", "You've written 5 stories!"),
    REVIEW_MASTER("REVIEW_MASTER", "Review Master", "You've submitted 10 reviews!"),
    WORLD_TRAVELER("WORLD_TRAVELER", "World Traveler", "You've visited 20 places!");

    private final String code;
    private final String displayName;
    private final String description;

    Achievement(String code, String displayName, String description) {
        this.code = code;
        this.displayName = displayName;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
} 