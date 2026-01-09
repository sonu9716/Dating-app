const { pool } = require('./src/utils/db');

async function debugSamDiscovery() {
    try {
        console.log('🔍 Starting Diagnostic for sam@gmail.com');

        // 1. Get Sam
        const userRes = await pool.query("SELECT id, email, first_name FROM users WHERE email = 'sam@gmail.com'");
        if (userRes.rows.length === 0) {
            console.log('❌ Sam not found');
            process.exit(1);
        }
        const sam = userRes.rows[0];
        console.log(`✅ Found Sam: ID=${sam.id}, Name=${sam.first_name}`);

        // 2. Check Preferences
        const prefsRes = await pool.query("SELECT * FROM user_preferences WHERE user_id = $1", [sam.id]);
        console.log('📋 Preferences:', prefsRes.rows[0] || 'None');

        // 3. Count Total Active Users (other than Sam)
        const totalOtherRes = await pool.query("SELECT count(*) FROM users WHERE id != $1", [sam.id]);
        console.log(`👥 Total other users in DB: ${totalOtherRes.rows[0].count}`);

        // 4. Count Sam's Swipes
        const swipesRes = await pool.query("SELECT count(*) FROM swipes WHERE user_id = $1", [sam.id]);
        console.log(`👆 Sam's total swipes: ${swipesRes.rows[0].count}`);

        // 5. Check if Sam has swiped on everybody
        const availableRes = await pool.query(`
            SELECT count(*) FROM users 
            WHERE id != $1 
            AND id NOT IN (SELECT target_user_id FROM swipes WHERE user_id = $1)
        `, [sam.id]);
        console.log(`✨ Available in Discovery Query: ${availableRes.rows[0].count}`);

        // 6. Test actual discovery logic
        const discoveryRes = await pool.query(`
            SELECT id, first_name FROM users 
            WHERE id != $1 
            AND id NOT IN (SELECT target_user_id FROM swipes WHERE user_id = $1)
            ORDER BY RANDOM()
            LIMIT 40
        `, [sam.id]);
        console.log(`🎬 Discovery SQL result count: ${discoveryRes.rows.length}`);

        if (discoveryRes.rows.length > 0) {
            console.log('📝 Sample rows:', discoveryRes.rows.slice(0, 3));
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Diagnostic Error:', err);
        process.exit(1);
    }
}

debugSamDiscovery();
