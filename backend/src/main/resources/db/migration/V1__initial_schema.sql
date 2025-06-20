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

-- Create user_favourites table (with saved_at and site_type as NOT NULL)
CREATE TABLE user_favourites (
    user_id UUID NOT NULL,
    site_id BIGINT NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    site_type VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id, site_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (site_id) REFERENCES cultural_sites(id)
);

-- Create user_places table
CREATE TABLE user_places (
    user_id UUID NOT NULL,
    site_id BIGINT NOT NULL,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visit_status VARCHAR(50) NOT NULL DEFAULT 'VISITED',
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

-- Insert initial achievements
TRUNCATE TABLE achievements RESTART IDENTITY CASCADE;
INSERT INTO achievements (code, title, description, category, difficulty, points) VALUES
('FIRST_VISIT', 'First Steps', 'Visit your first cultural site', 'Exploration', 'Easy', 10),
('CULTURE_SEEKER', 'Culture Seeker', 'Visit 5 different cultural sites', 'Exploration', 'Medium', 50),
('HERITAGE_EXPLORER', 'Heritage Explorer', 'Visit 10 different cultural sites', 'Exploration', 'Hard', 100),
('LOCAL_GUIDE', 'Local Guide', 'Visit 5 sites in the same city', 'Local Knowledge', 'Medium', 75),
('WORLD_TRAVELER', 'World Traveler', 'Visit sites in 3 different countries', 'Global Explorer', 'Hard', 150),
('EARLY_BIRD', 'Early Bird', 'Visit a site during its opening hours', 'Timing', 'Easy', 25),
('NIGHT_OWL', 'Night Owl', 'Visit a site during evening hours', 'Timing', 'Medium', 50),
('PHOTOGRAPHER', 'Cultural Photographer', 'Take photos at 5 different sites', 'Documentation', 'Medium', 75),
('HISTORY_BUFF', 'History Buff', 'Visit 3 historical monuments', 'Knowledge', 'Medium', 60),
('ART_LOVER', 'Art Lover', 'Visit 3 art galleries or museums', 'Arts', 'Medium', 60); 