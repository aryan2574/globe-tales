-- Create place_reviews table
CREATE TABLE place_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    place_id VARCHAR(255) NOT NULL,
    place_name VARCHAR(255),
    comment TEXT,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_place_reviews_user_id ON place_reviews(user_id);
CREATE INDEX idx_place_reviews_place_id ON place_reviews(place_id);

-- Modify user_story table
ALTER TABLE user_story DROP COLUMN rating; 