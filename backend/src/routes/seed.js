const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../utils/db');

const CATEGORIES = [
    'anonymous', 'blind', 'double', 'group',
    'speed', 'events', 'exclusive', 'distance'
];

const MALE_NAMES = ['Aiden', 'Liam', 'Noah', 'Lucas', 'Mason', 'Logan', 'Ethan', 'Jacob', 'James', 'Alex'];
const FEMALE_NAMES = ['Emma', 'Olivia', 'Ava', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Zoe'];

const BIOS = [
    "Just looking to vibe 🌊",
    "Here for a good time ✨",
    "Coffee addict ☕️",
    "Traveler & Foodie ✈️",
    "IG: @socials 📸",
    "Music is life 🎵",
    "Let's go on an adventure 🏔",
    "Looking for player 2 🎮",
    "Dog lover 🐶",
    "Mystery & Chill 🕵️"
];

const PHOTOS = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500',
    'https://images.unsplash.com/photo-1521119989659-a83eee488058?w=500',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500'
];

router.get('/genz', async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash('password123', 10);
        let count = 0;

        for (const category of CATEGORIES) {
            for (let i = 0; i < 10; i++) {
                const isMale = Math.random() > 0.5;
                const firstName = isMale
                    ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
                    : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];

                const lastName = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                const email = `${firstName.toLowerCase()}.${category}.${i}@example.com`;
                const username = `${firstName.toLowerCase()}_${category}_${i}`;

                // Random location near New Delhi, India
                const lat = 28.6139 + (Math.random() - 0.5) * 0.5;
                const lng = 77.2090 + (Math.random() - 0.5) * 0.5;

                await pool.query(`
                    INSERT INTO users (
                        email, password_hash, username, first_name, last_name, 
                        bio, age, gender, location, photos, looking_for, verified
                    ) VALUES (
                        $1, $2, $3, $4, $5, 
                        $6, $7, $8, point($9, $10), $11, $12, true
                    ) ON CONFLICT (username) DO NOTHING
                `, [
                    email, passwordHash, username, firstName, lastName,
                    BIOS[Math.floor(Math.random() * BIOS.length)],
                    18 + Math.floor(Math.random() * 12),
                    isMale ? 'Man' : 'Woman',
                    lat, lng,
                    [PHOTOS[Math.floor(Math.random() * PHOTOS.length)]],
                    category
                ]);
                count++;
            }
        }
        res.json({ success: true, message: `Seeded ${count} Gen Z profiles!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/swipes/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT COUNT(*) as count FROM swipes WHERE user_id = $1', [userId]);
        res.json({
            success: true,
            userId: parseInt(userId),
            swipeCount: parseInt(result.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/swipes/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('DELETE FROM swipes WHERE user_id = $1', [userId]);
        res.json({
            success: true,
            message: `Deleted ${result.rowCount} swipes for user ${userId}`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
