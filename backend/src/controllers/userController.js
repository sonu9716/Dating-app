const { pool } = require('../utils/db');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, username, bio, gender, age, location, photos FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                bio: user.bio,
                gender: user.gender,
                age: user.age,
                location: user.location,
                avatar: user.photos && user.photos.length > 0 ? user.photos[0] : 'https://via.placeholder.com/150',
                photos: user.photos || []
            }
        });
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).json({ error: 'Server error retrieving profile' });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    let { firstName, lastName, bio, gender, age, location, photos, interests, name } = req.body;

    // Handle single "name" field from frontend
    if (!firstName && !lastName && name) {
        const nameParts = name.trim().split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ') || '';
    }

    try {
        const result = await pool.query(
            `UPDATE users 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 bio = COALESCE($3, bio),
                 gender = COALESCE($4, gender),
                 age = COALESCE($5, age),
                 location = COALESCE($6, location),
                 photos = COALESCE($7, photos),
                 interests = COALESCE($8, interests),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9
             RETURNING *`,
            [
                firstName || null,
                lastName || null,
                bio || null,
                gender || null,
                age || null,
                location || null,
                photos || null,
                interests || null,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = result.rows[0];
        res.json({
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: `${updatedUser.first_name} ${updatedUser.last_name}`,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                bio: updatedUser.bio,
                gender: updatedUser.gender,
                age: updatedUser.age,
                location: updatedUser.location,
                avatar: updatedUser.photos && updatedUser.photos.length > 0 ? updatedUser.photos[0] : 'https://via.placeholder.com/150',
                photos: updatedUser.photos || [],
                interests: updatedUser.interests || []
            }
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ success: false, message: 'Server error updating profile', error: err.message });
    }
};

exports.getDiscovery = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mode } = req.query;

        // Discovery: Find users who are not the current user
        // and have not been swiped by the current user yet
        // Randomize order so every refresh feels new
        const result = await pool.query(
            `SELECT id, first_name, last_name, bio, gender, age, location, photos, interests
             FROM users 
             WHERE id != $1 
             AND id NOT IN (
                 SELECT target_user_id FROM swipes WHERE user_id = $1
             )
             ORDER BY RANDOM()
             LIMIT 40`,
            [userId]
        );

        const profiles = result.rows.map(user => {
            // Build a clean interests array
            const userInterests = Array.isArray(user.interests) && user.interests.length > 0
                ? user.interests
                : ['Art', 'Music', 'Travel'];

            return {
                id: user.id,
                name: user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : (user.first_name || user.email.split('@')[0] || 'Unknown'),
                age: user.age || 22,
                photos: user.photos && user.photos.length > 0
                    ? user.photos
                    : ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500'],
                bio: user.bio || 'Check out my profile! ✨',
                distance: Math.floor(Math.random() * 20) + 1,
                interests: userInterests,
                isVerified: true
            };
        });

        res.json({
            success: true,
            data: { profiles }
        });
    } catch (err) {
        console.error('Discovery error:', err.message);
        res.status(500).json({ error: 'Server error in discovery' });
    }
};

exports.getPreferences = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            'SELECT min_age, max_age, max_distance_km, looking_for FROM user_preferences WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            // Return defaults if none exist
            return res.json({
                success: true,
                data: {
                    minAge: 18,
                    maxAge: 35,
                    maxDistance: 25,
                    lookingFor: 'everyone'
                }
            });
        }

        const prefs = result.rows[0];
        res.json({
            success: true,
            data: {
                minAge: prefs.min_age,
                maxAge: prefs.max_age,
                maxDistance: prefs.max_distance_km,
                lookingFor: prefs.looking_for
            }
        });
    } catch (err) {
        console.error('Get preferences error:', err.message);
        res.status(500).json({ error: 'Server error retrieving preferences' });
    }
};

exports.updatePreferences = async (req, res) => {
    const userId = req.user.id;
    const { minAge, maxAge, maxDistance, lookingFor } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO user_preferences (user_id, min_age, max_age, max_distance_km, looking_for)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (user_id) DO UPDATE 
             SET min_age = EXCLUDED.min_age,
                 max_age = EXCLUDED.max_age,
                 max_distance_km = EXCLUDED.max_distance_km,
                 looking_for = EXCLUDED.looking_for,
                 updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, minAge, maxAge, maxDistance, lookingFor]
        );

        const updated = result.rows[0];
        res.json({
            success: true,
            data: {
                minAge: updated.min_age,
                maxAge: updated.max_age,
                maxDistance: updated.max_distance_km,
                lookingFor: updated.looking_for
            }
        });
    } catch (err) {
        console.error('Update preferences error:', err.message);
        res.status(500).json({ error: 'Server error updating preferences' });
    }
};

exports.uploadPhoto = async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ error: 'No photo file provided' });
    }

    // Construct the photo URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const photoUrl = `${baseUrl}/uploads/${req.file.filename}`;

    try {
        const result = await pool.query(
            'UPDATE users SET photos = array_append(photos, $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING photos',
            [photoUrl, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            data: { photos: result.rows[0].photos }
        });
    } catch (err) {
        console.error('Upload photo error:', err.message);
        res.status(500).json({ error: 'Server error uploading photo' });
    }
};

exports.deletePhoto = async (req, res) => {
    const userId = req.user.id;
    const { photoUrl } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET photos = array_remove(photos, $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING photos',
            [photoUrl, userId]
        );

        res.json({
            success: true,
            data: { photos: result.rows[0].photos }
        });
    } catch (err) {
        console.error('Delete photo error:', err.message);
        res.status(500).json({ error: 'Server error deleting photo' });
    }
};
exports.debugDiscovery = async (req, res) => {
    try {
        const result = await pool.query('SELECT count(*) FROM users');
        const users = await pool.query('SELECT id, first_name, email FROM users LIMIT 5');
        res.json({
            count: result.rows[0].count,
            sample: users.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
