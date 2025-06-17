-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    current_location geography(Point, 4326),
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

-- Create cultural_sites table
CREATE TABLE cultural_sites (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location geography(Point, 4326),
    site_type VARCHAR(100),
    opening_hours VARCHAR(255),
    contact_info VARCHAR(255),
    website_url VARCHAR(255)
);

-- Create achievements table
CREATE TABLE achievements (
    code VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL
);

-- Create user_favourites table
CREATE TABLE user_favourites (
    user_id UUID NOT NULL,
    site_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, site_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (site_id) REFERENCES cultural_sites(id)
);

-- Create user_places table
CREATE TABLE user_places (
    user_id UUID NOT NULL,
    site_id BIGINT NOT NULL,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, site_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (site_id) REFERENCES cultural_sites(id)
);

-- Create user_achievements table
CREATE TABLE user_achievements (
    user_id UUID NOT NULL,
    achievement_code VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_code),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_code) REFERENCES achievements(code)
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cultural_sites_location ON cultural_sites USING GIST(location);
CREATE INDEX idx_users_current_location ON users USING GIST(current_location);
CREATE INDEX idx_user_favourites_user_id ON user_favourites(user_id);
CREATE INDEX idx_user_favourites_site_id ON user_favourites(site_id);
CREATE INDEX idx_user_places_user_id ON user_places(user_id);
CREATE INDEX idx_user_places_site_id ON user_places(site_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_code ON user_achievements(achievement_code); 