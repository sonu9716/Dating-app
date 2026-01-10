const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    console.log('🔄 Running migration...');
    const migrationPath = path.join(__dirname, '../../migrations/20260110_add_location_coords.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    try {
        await pool.query(sql);
        console.log('✅ Migration applied successfully');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

runMigration();
