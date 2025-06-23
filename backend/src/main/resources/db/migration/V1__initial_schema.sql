-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create user_roles table
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create user_favourites table
CREATE TABLE user_favourites (
    user_id UUID NOT NULL,
    site_id BIGINT NOT NULL,
    place_name VARCHAR(255),
    saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    site_type VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id, site_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create user_achievements table
CREATE TABLE user_achievements (
    user_id UUID NOT NULL,
    achievement_code VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_code),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_favourites_user_id ON user_favourites(user_id);
CREATE INDEX idx_user_favourites_site_id ON user_favourites(site_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_code ON user_achievements(achievement_code);

-- Create user_story table (with visit_date)
CREATE TABLE user_story (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    place_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visit_date TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for user_story table
CREATE INDEX idx_user_story_user_id ON user_story(user_id);
CREATE INDEX idx_user_story_place_id ON user_story(place_id);

-- Create places table (with simple JSONB column)
CREATE TABLE places (
    id BIGSERIAL PRIMARY KEY,
    osm_id BIGINT UNIQUE,
    name VARCHAR(255),
    type VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    tags JSONB
);

-- Create visited_sites table
CREATE TABLE visited_sites (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    place_id BIGINT NOT NULL,
    place_name VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    visited_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_visited_sites_user_id ON visited_sites(user_id);
CREATE INDEX idx_visited_sites_place_id ON visited_sites(place_id); 