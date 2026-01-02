const jwt = require('jsonwebtoken');
const { pool } = require('../utils/db');
const { JWT_SECRET } = require('../utils/jwt');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Verify user still exists in DB
        const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [decoded.userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Token is not valid' });
        }

        req.user = result.rows[0];
        req.token = token;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = auth;
