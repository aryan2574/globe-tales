-- Add site_type column to user_favourites table
ALTER TABLE user_favourites ADD COLUMN site_type VARCHAR(100);

-- Update site_type based on the cultural_sites table
UPDATE user_favourites uf
SET site_type = cs.site_type
FROM cultural_sites cs
WHERE uf.site_id = cs.id;

-- Make site_type NOT NULL after data migration
ALTER TABLE user_favourites ALTER COLUMN site_type SET NOT NULL; 