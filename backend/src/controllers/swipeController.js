const { pool } = require('../utils/db');

exports.handleSwipe = async (req, res) => {
    const { userId: targetUserId, type } = req.body;
    const userId = req.user.id;

    if (!targetUserId || !['like', 'pass', 'super-like'].includes(type)) {
        return res.status(400).json({ error: 'Invalid swipe data' });
    }

    try {
        // Record the swipe
        await pool.query(
            'INSERT INTO swipes (user_id, target_user_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
            [userId, targetUserId, type]
        );

        let isMatch = false;
        let matchId = null;

        // If it's a like or super-like, check for a mutual match
        if (type === 'like' || type === 'super-like') {
            const matchResult = await pool.query(
                'SELECT id FROM swipes WHERE user_id = $1 AND target_user_id = $2 AND (type = \'like\' OR type = \'super-like\')',
                [targetUserId, userId]
            );

            if (matchResult.rows.length > 0) {
                isMatch = true;
                // Create match record
                const newMatch = await pool.query(
                    'INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2) RETURNING id',
                    [userId, targetUserId]
                );
                matchId = newMatch.rows[0].id;
            }
        }

        res.json({
            success: true,
            data: {
                isMatch,
                matchId
            }
        });
    } catch (err) {
        console.error('Swipe error:', err.message);
        res.status(500).json({ error: 'Server error during swipe' });
    }
};

exports.like = async (req, res) => {
    req.body.type = 'like';
    return exports.handleSwipe(req, res);
};

exports.pass = async (req, res) => {
    req.body.type = 'pass';
    return exports.handleSwipe(req, res);
};

exports.superLike = async (req, res) => {
    req.body.type = 'super-like';
    return exports.handleSwipe(req, res);
};
