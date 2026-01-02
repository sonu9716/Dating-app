const { pool } = require('../utils/db');

exports.getMatches = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT m.id as match_id, m.matched_at,
              u.id, u.first_name, u.last_name, u.photos, u.username,
              (SELECT text FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message_time
       FROM matches m
       JOIN users u ON (m.user_id_1 = u.id OR m.user_id_2 = u.id)
       WHERE (m.user_id_1 = $1 OR m.user_id_2 = $1) AND u.id != $1
       ORDER BY last_message_time DESC NULLS LAST, matched_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            data: result.rows.map(row => ({
                id: row.id,
                matchId: row.match_id,
                name: `${row.first_name} ${row.last_name || ''}`.trim(),
                avatar: row.photos?.[0],
                username: row.username,
                lastMessage: row.last_message,
                lastMessageTime: row.last_message_time,
                matchedAt: row.matched_at
            }))
        });
    } catch (err) {
        console.error('Get matches error:', err.message);
        res.status(500).json({ error: 'Server error fetching matches' });
    }
};

exports.getMatch = async (req, res) => {
    const { matchId } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT m.*, u.id as user_id, u.first_name, u.last_name, u.photos, u.bio
       FROM matches m
       JOIN users u ON (m.user_id_1 = u.id OR m.user_id_2 = u.id)
       WHERE m.id = $1 AND (m.user_id_1 = $2 OR m.user_id_2 = $2) AND u.id != $2`,
            [matchId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const row = result.rows[0];
        res.json({
            success: true,
            data: {
                id: row.user_id,
                matchId: row.id,
                name: `${row.first_name} ${row.last_name || ''}`.trim(),
                avatar: row.photos?.[0],
                photos: row.photos,
                bio: row.bio
            }
        });
    } catch (err) {
        console.error('Get match error:', err.message);
        res.status(500).json({ error: 'Server error fetching match' });
    }
};

exports.unmatch = async (req, res) => {
    const { matchId } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'DELETE FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2) RETURNING id',
            [matchId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found or not authorized' });
        }

        res.json({ success: true, message: 'Unmatched successfully' });
    } catch (err) {
        console.error('Unmatch error:', err.message);
        res.status(500).json({ error: 'Server error during unmatch' });
    }
};
