const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://localhost:5432/dating_app'
});

async function checkColumns() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
        console.log('Columns in users table:');
        res.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type}`);
        });
    } catch (err) {
        console.error('Error checking columns:', err.message);
    } finally {
        await pool.end();
    }
}

checkColumns();
