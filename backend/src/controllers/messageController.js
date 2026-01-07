const { pool } = require('../utils/db');

exports.getMessages = async (req, res) => {
    const { matchId } = req.params;
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    try {
        // Verify user belongs to this match
        const matchCheck = await pool.query(
            'SELECT id FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
            [matchId, userId]
        );

        if (matchCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized to view these messages' });
        }

        const result = await pool.query(
            `SELECT m.*, u.first_name as sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.match_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
            [matchId, limit, offset]
        );

        res.json({
            success: true,
            data: result.rows.map(row => ({
                id: row.id,
                text: row.encrypted_content,
                messageType: row.message_type || 'text',
                mediaUrl: row.media_url,
                senderId: row.sender_id,
                isOwn: row.sender_id === userId,
                time: row.created_at,
                isRead: row.read
            }))
        });
    } catch (err) {
        console.error('Get messages error:', err.message);
        res.status(500).json({ error: 'Server error fetching messages' });
    }
};

exports.sendMessage = async (req, res) => {
    const { matchId } = req.params;
    const { message: text, messageType = 'text', mediaUrl = null, iv = 'none', authTag = 'none' } = req.body;
    const userId = req.user.id;

    if (messageType === 'text' && (!text || !text.trim())) {
        return res.status(400).json({ error: 'Message text is required for text messages' });
    }

    try {
        // Verify authorization and get recipient
        const matchResult = await pool.query(
            'SELECT user_id_1, user_id_2 FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
            [matchId, userId]
        );

        if (matchResult.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized to send message to this match' });
        }

        const recipientId = matchResult.rows[0].user_id_1 === userId
            ? matchResult.rows[0].user_id_2
            : matchResult.rows[0].user_id_1;

        const result = await pool.query(
            'INSERT INTO messages (match_id, sender_id, encrypted_content, iv, auth_tag, message_type, media_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [matchId, userId, text || '', iv, authTag, messageType, mediaUrl]
        );

        const newMessage = result.rows[0];

        res.status(201).json({
            success: true,
            data: {
                id: newMessage.id,
                text: newMessage.encrypted_content,
                messageType: newMessage.message_type,
                mediaUrl: newMessage.media_url,
                senderId: newMessage.sender_id,
                isOwn: true,
                time: newMessage.created_at,
                isRead: false
            }
        });
    } catch (err) {
        console.error('Send message error:', err.message);
        res.status(500).json({ error: 'Server error sending message' });
    }
};

exports.markAsRead = async (req, res) => {
    const { matchId } = req.params;
    const userId = req.user.id;

    try {
        await pool.query(
            'UPDATE messages SET read = true WHERE match_id = $1 AND sender_id != $2 AND read = false',
            [matchId, userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Mark read error:', err.message);
        res.status(500).json({ error: 'Server error marking messages as read' });
    }
};

exports.uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No media file uploaded' });
        }

        const mediaUrl = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            data: {
                url: mediaUrl
            }
        });
    } catch (err) {
        console.error('Media upload error:', err.message);
        res.status(500).json({ error: 'Server error during media upload' });
    }
};
