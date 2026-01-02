const { pool } = require('../utils/db');
const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

exports.signup = async (req, res) => {
    let { email, password, firstName, lastName, username, name, age, gender, bio, interests, location } = req.body;

    // Handle single "name" field from frontend (e.g. from SignupScreen.js)
    if (!firstName && !lastName && name) {
        const nameParts = name.trim().split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ') || '';
    }

    try {
        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        // Note: username is required in schema, so we either use email prefix or a provided username
        const finalUsername = username || email.split('@')[0] + Math.floor(Math.random() * 1000);

        const newUser = await pool.query(
            `INSERT INTO users(
    email, password_hash, first_name, last_name, username,
    age, gender, bio, interests, location
) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING * `,
            [email, hashedPassword, firstName, lastName, finalUsername, age, gender, bio, interests || [], location]
        );

        const user = newUser.rows[0];
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.status(201).json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name} `,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
                photos: user.photos || [],
                location: user.location,
                interests: user.interests
            }
        });
    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name} `,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
                photos: user.photos || [],
                location: user.location,
                interests: user.interests
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = verifyToken(refreshToken);
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.userId]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const newToken = generateToken(decoded.userId);
        res.json({ success: true, token: newToken });
    } catch (err) {
        console.error('Refresh error:', err.message);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

exports.logout = async (req, res) => {
    try {
        // Since we use stateless JWT, we just return success.
        // The client will clear the token.
        // In a more complex app, we might blacklist the token in Redis here.
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ error: 'Server error during logout' });
    }
};
