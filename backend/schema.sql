-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  age INT CHECK (age >= 18 AND age <= 100),
  gender VARCHAR(20),
  location POINT,
  photos TEXT[] DEFAULT '{}',
  looking_for VARCHAR(100),
  interests TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  public_key TEXT UNIQUE,
  private_key_encrypted TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_users_age_gender ON users(age, gender) WHERE verified = true;
CREATE INDEX idx_users_location ON users USING GIST(location) WHERE verified = true;
CREATE INDEX idx_users_looking_for ON users(looking_for);
CREATE INDEX idx_users_last_active ON users(last_active DESC);
CREATE INDEX idx_users_verified ON users(verified);
CREATE INDEX idx_users_email ON users(email);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user_id_1 INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_match UNIQUE (LEAST(user_id_1, user_id_2), GREATEST(user_id_1, user_id_2))
);

CREATE INDEX idx_matches_user_1 ON matches(user_id_1);
CREATE INDEX idx_matches_user_2 ON matches(user_id_2);
CREATE INDEX idx_matches_status ON matches(status);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id INT NOT NULL REFERENCES users(id),
  encrypted_content TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_read ON messages(read, match_id);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  min_age INT CHECK (min_age >= 18),
  max_age INT CHECK (max_age <= 100),
  max_distance_km INT,
  looking_for VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  target_user_id INT NOT NULL REFERENCES users(id),
  action VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_swipes_user ON swipes(user_id, created_at DESC);
CREATE INDEX idx_swipes_action ON swipes(action);
CREATE UNIQUE INDEX idx_swipes_unique ON swipes(user_id, target_user_id);
