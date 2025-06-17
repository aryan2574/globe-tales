-- Add saved_at column to user_favourites table
ALTER TABLE user_favourites ADD COLUMN saved_at TIMESTAMP WITH TIME ZONE;

-- Copy data from created_at to saved_at
UPDATE user_favourites SET saved_at = created_at;

-- Make saved_at NOT NULL after data migration
ALTER TABLE user_favourites ALTER COLUMN saved_at SET NOT NULL; 