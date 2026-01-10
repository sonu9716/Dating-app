const { pool } = require('./src/utils/db');

async function testInternal() {
    console.log('🔄 Starting Internal Verification...');

    try {
        const testUserEmail = 'test@gmail.com';

        // 1. Manually update location
        console.log('\n📍 Updating location for test user...');
        await pool.query(
            'UPDATE users SET last_lat = $1, last_lng = $2 WHERE email = $3',
            [40.7128, -74.0060, testUserEmail]
        );
        console.log('✅ Location updated in DB');

        // 2. Fetch test user ID
        const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [testUserEmail]);
        const userId = userRes.rows[0].id;

        // 3. Test Discovery Query Logic
        console.log('\n🔍 Running Discovery Query (Distance Calculation)...');
        const discoveryQuery = `
            SELECT id, first_name, 
                   (6371 * acos(cos(radians($2)) * cos(radians(last_lat)) * cos(radians(last_lng) - radians($3)) + sin(radians($2)) * sin(radians(last_lat)))) AS distance_km
            FROM users 
            WHERE id != $1 
            ORDER BY distance_km ASC NULLS LAST
            LIMIT 20
        `;
        const discRes = await pool.query(discoveryQuery, [userId, 40.7128, -74.0060]);
        console.log(`✅ Query returned ${discRes.rows.length} profiles`);

        discRes.rows.forEach(profile => {
            console.log(`👤 Profile ${profile.id} (${profile.first_name || 'N/A'}): ${profile.distance_km ? Math.round(profile.distance_km * 10) / 10 : 'N/A'} km`);
        });

        console.log('\n✨ Internal Verification Completed!');
    } catch (err) {
        console.error('❌ Internal Verification Error:', err.message);
    } finally {
        process.exit();
    }
}

testInternal();
