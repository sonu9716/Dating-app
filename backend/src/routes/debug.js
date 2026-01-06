const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');

// Get user by email (for debugging)
router.get('/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, age, gender, bio, photos, interests, created_at FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get swipe count
        const swipeCount = await pool.query(
            'SELECT COUNT(*) FROM swipes WHERE user_id = $1',
            [result.rows[0].id]
        );

        res.json({
            success: true,
            user: result.rows[0],
            swipeCount: parseInt(swipeCount.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset all swipes for a user (for testing)
router.delete('/swipes/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.rows[0].id;
        const deleteResult = await pool.query('DELETE FROM swipes WHERE user_id = $1', [userId]);

        res.json({
            success: true,
            message: `Deleted ${deleteResult.rowCount} swipes for ${email}`,
            userId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total user count and breakdown
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
        const withPhotos = await pool.query('SELECT COUNT(*) FROM users WHERE photos IS NOT NULL AND array_length(photos, 1) > 0');
        const withBio = await pool.query('SELECT COUNT(*) FROM users WHERE bio IS NOT NULL');
        const totalSwipes = await pool.query('SELECT COUNT(*) FROM swipes');
        const totalMatches = await pool.query('SELECT COUNT(*) FROM matches');

        res.json({
            success: true,
            stats: {
                totalUsers: parseInt(totalUsers.rows[0].count),
                usersWithPhotos: parseInt(withPhotos.rows[0].count),
                usersWithBio: parseInt(withBio.rows[0].count),
                totalSwipes: parseInt(totalSwipes.rows[0].count),
                totalMatches: parseInt(totalMatches.rows[0].count)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
