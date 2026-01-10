-- Migration to add last_lat and last_lng for live location
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_lat DOUBLE PRECISION;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_lng DOUBLE PRECISION;

-- Add index for spatial performance (if using PostGIS later, we'd use GIST)
CREATE INDEX IF NOT EXISTS idx_users_last_lat_lng ON users(last_lat, last_lng);

-- Background update for existing location (optional)
-- UPDATE users SET last_lat = 28.6139, last_lng = 77.2090 WHERE location = 'New Delhi' AND last_lat IS NULL;
