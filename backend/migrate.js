const { pool } = require('./src/utils/db');

const migrationSql = `
-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  app_user_id INT REFERENCES users(id),
  relationship VARCHAR(50) NOT NULL,
  avatar TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, phone)
);

-- Live Date Sessions Table
CREATE TABLE IF NOT EXISTS live_date_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  match_name VARCHAR(255),
  match_avatar TEXT,
  location JSONB,
  duration INT, -- in minutes
  status VARCHAR(20) DEFAULT 'active',
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  last_check_in TIMESTAMP,
  emergency_activated BOOLEAN DEFAULT false,
  emergency_activated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Events Table
CREATE TABLE IF NOT EXISTS emergency_events (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES live_date_sessions(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_known_location JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  contacts_notified INT[]
);

-- Safety Reports Table
CREATE TABLE IF NOT EXISTS safety_reports (
  id SERIAL PRIMARY KEY,
  reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id INT REFERENCES live_date_sessions(id),
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed BOOLEAN DEFAULT false,
  action VARCHAR(20)
);

-- Safety Preferences Table
CREATE TABLE IF NOT EXISTS safety_preferences (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  allow_location_sharing BOOLEAN DEFAULT true,
  enable_check_in_reminders BOOLEAN DEFAULT true,
  notify_via_sms BOOLEAN DEFAULT true,
  notify_via_push BOOLEAN DEFAULT true,
  check_in_frequency INT DEFAULT 30,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_user ON live_date_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_events_session ON emergency_events(session_id);
CREATE INDEX IF NOT EXISTS idx_safety_reports_reporter ON safety_reports(reporter_id);
`;

async function migrate() {
    try {
        console.log('🚀 Starting database migration...');
        await pool.query(migrationSql);
        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
