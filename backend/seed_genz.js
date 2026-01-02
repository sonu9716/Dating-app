const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Production DB Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const CATEGORIES = [
    'anonymous', 'blind', 'double', 'group',
    'speed', 'events', 'exclusive', 'distance'
];

const MALE_NAMES = ['Aiden', 'Liam', 'Noah', 'Elijah', 'Lucas', 'Mason', 'Logan', 'Ethan', 'Jacob', 'James', 'Alex', 'Ryan', 'Jayden', 'Nathan', 'Caleb'];
const FEMALE_NAMES = ['Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Zoe', 'Lily', 'Chloe', 'Layla', 'Nora'];

const BIOS = [
    "Just looking to vibe 🌊",
    "Here for a good time not a long time ✨",
    "Coffee addict ☕️",
    "Traveler & Foodie ✈️🍕",
    "IG: @socials 📸",
    "Music is life 🎵",
    "Let's go on an adventure 🏔",
    "Looking for my player 2 🎮",
    "Swipe right if you have a dog 🐶",
    "Not sure what I'm doing here 🤷‍♂️"
];

const PHOTOS = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXRoJTIwbWVuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXRoJTIwd29tZW4lMjBmYWNlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXRoJTIwbWVuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXRoJTIwd29tZW4lMjBmYWNlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXRoJTIwbWVuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXRoJTIwd29tZW4lMjBmYWNlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1521119989659-a83eee488058?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydHJhaXRoJTIwbWVuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXRoJTIwd29tZW4lMjBmYWNlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0aCUyMG1lbiUyMGZhY2V8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0aCUyMHdvbWVuJTIwZmFjZXxlbnwwfHwwfHx8'
];

async function seed() {
    try {
        console.log('🌱 Start seeding Gen Z users...');

        // Hash password once for all users
        const passwordHash = await bcrypt.hash('password123', 10);

        for (const category of CATEGORIES) {
            console.log(`Creating 10 users for: ${category}`);

            for (let i = 0; i < 10; i++) {
                const isMale = Math.random() > 0.5;
                const firstName = isMale
                    ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
                    : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];

                const lastName = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random initial

                const email = `${firstName.toLowerCase()}.${category}.${i}@example.com`;
                const username = `${firstName.toLowerCase()}_${category}_${i}`;

                const query = `
                    INSERT INTO users (
                        email, password_hash, username, first_name, last_name, 
                        bio, age, gender, location, photos, looking_for, initialized
                    ) VALUES (
                        $1, $2, $3, $4, $5, 
                        $6, $7, $8, point($9, $10), $11, $12, true
                    ) ON CONFLICT (email) DO NOTHING
                `;

                // Random location (approx New York coordinates with jitter)
                const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
                const lng = -74.0060 + (Math.random() - 0.5) * 0.1;

                const values = [
                    email,
                    passwordHash,
                    username,
                    firstName,
                    lastName,
                    BIOS[Math.floor(Math.random() * BIOS.length)],
                    18 + Math.floor(Math.random() * 12), // Gen Z age range (18-30)
                    isMale ? 'Man' : 'Woman',
                    lat,
                    lng,
                    [PHOTOS[Math.floor(Math.random() * PHOTOS.length)]], // 1 random photo
                    category
                ];

                await pool.query(query, values);
            }
        }

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
