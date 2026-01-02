const { pool } = require('../utils/db');

// EMERGENCY CONTACTS
exports.getEmergencyContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('getEmergencyContacts error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addEmergencyContact = async (req, res) => {
    const { name, phone, relationship, avatar, appUserId } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO emergency_contacts (user_id, name, phone, relationship, avatar, app_user_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (user_id, phone) DO UPDATE SET
             name = EXCLUDED.name, relationship = EXCLUDED.relationship, avatar = EXCLUDED.avatar, app_user_id = EXCLUDED.app_user_id
             RETURNING *`,
            [userId, name, phone, relationship, avatar, appUserId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('addEmergencyContact error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteEmergencyContact = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        await pool.query(
            'DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('deleteEmergencyContact error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// LIVE DATE SESSIONS
exports.startDateSession = async (req, res) => {
    const { matchId, matchName, matchAvatar, location, duration } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO live_date_sessions 
             (user_id, match_id, match_name, match_avatar, location, duration, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'active') 
             RETURNING *`,
            [userId, matchId, matchName, matchAvatar, JSON.stringify(location), duration]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('startDateSession error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.endDateSession = async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            "UPDATE live_date_sessions SET status = 'ended', end_time = NOW() WHERE id = $1 AND user_id = $2",
            [sessionId, userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('endDateSession error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.checkInSession = async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            'UPDATE live_date_sessions SET last_check_in = NOW() WHERE id = $1 AND user_id = $2',
            [sessionId, userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('checkInSession error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// EMERGENCY TRIGGER
exports.triggerEmergency = async (req, res) => {
    const { sessionId, lastKnownLocation, contactsToNotify } = req.body;
    const userId = req.user.id;

    try {
        // Record the event
        const result = await pool.query(
            `INSERT INTO emergency_events (session_id, last_known_location, status)
             VALUES ($1, $2, 'pending') RETURNING *`,
            [sessionId, JSON.stringify(lastKnownLocation)]
        );

        // Update session status
        await pool.query(
            'UPDATE live_date_sessions SET emergency_activated = true, emergency_activated_at = NOW() WHERE id = $1',
            [sessionId]
        );

        // In a real app, this is where you'd call Twilio for SMS
        console.log('🚨 ALERT: Emergency triggered for session', sessionId);
        console.log('Contacts to notify:', contactsToNotify);

        res.json(result.rows[0]);
    } catch (err) {
        console.error('triggerEmergency error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// PREFERENCES
exports.getSafetyPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM safety_preferences WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            // Return default preferences if none exist
            return res.json({
                allow_location_sharing: true,
                enable_check_in_reminders: true,
                notify_via_sms: true,
                notify_via_push: true,
                check_in_frequency: 30
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('getSafetyPreferences error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateSafetyPreferences = async (req, res) => {
    const { allow_location_sharing, enable_check_in_reminders, notify_via_sms, notify_via_push, check_in_frequency } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO safety_preferences (user_id, allow_location_sharing, enable_check_in_reminders, notify_via_sms, notify_via_push, check_in_frequency)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (user_id) DO UPDATE SET
             allow_location_sharing = EXCLUDED.allow_location_sharing,
             enable_check_in_reminders = EXCLUDED.enable_check_in_reminders,
             notify_via_sms = EXCLUDED.notify_via_sms,
             notify_via_push = EXCLUDED.notify_via_push,
             check_in_frequency = EXCLUDED.check_in_frequency,
             updated_at = NOW()
             RETURNING *`,
            [userId, allow_location_sharing, enable_check_in_reminders, notify_via_sms, notify_via_push, check_in_frequency]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('updateSafetyPreferences error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};
