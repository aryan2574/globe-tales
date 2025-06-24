CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID NOT NULL,
    achievement_code VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, achievement_code),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'user_achievements' AND column_name = 'achieved_at'
    ) THEN
        ALTER TABLE user_achievements ADD COLUMN achieved_at TIMESTAMP WITH TIME ZONE NOT NULL;
    END IF;
END
$$; 