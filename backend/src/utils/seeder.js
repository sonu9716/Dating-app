const { pool } = require('./db');
const bcrypt = require('bcryptjs');

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

async function seedGenZUsers() {
    try {
        console.log('🌱 Checking if seeding is needed...');
        const countResult = await pool.query('SELECT count(*) FROM users');
        const count = parseInt(countResult.rows[0].count);

        if (count > 10) {
            console.log(`✅ Database already has ${count} users. Skipping seed.`);
            return;
        }

        console.log('🌱 Seeding Gen Z users...');
        const passwordHash = await bcrypt.hash('password123', 10);

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
                        age, gender, bio, interests, location, verified
                    ) VALUES (
                        $1, $2, $3, $4, $5, 
                        $6, $7, $8, $9, point($10, $11), true
                    ) ON CONFLICT (username) DO UPDATE SET
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        password_hash = EXCLUDED.password_hash,
                        age = EXCLUDED.age,
                        gender = EXCLUDED.gender,
                        bio = EXCLUDED.bio,
                        interests = EXCLUDED.interests,
                        verified = true
                `, [
                    email, passwordHash, username, firstName, lastName,
                    18 + Math.floor(Math.random() * 12),
                    isMale ? 'Man' : 'Woman',
                    BIOS[Math.floor(Math.random() * BIOS.length)],
                    ['Travel', 'Music', 'Tech'],
                    lat, lng
                ]);

                // Also update photos and ensure Sam gets one too
                await pool.query(
                    'UPDATE users SET photos = Array[$1] WHERE username = $2 OR email = $3',
                    [PHOTOS[Math.floor(Math.random() * PHOTOS.length)], username, 'sam@gmail.com']
                );
            }
        }
        console.log('✅ Seeding complete from startup!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
}

module.exports = { seedGenZUsers };
