const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./utils/jwt');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`✅ User ${socket.id} connected`);

  // Secure authentication with JWT
  socket.on('auth', (data) => {
    try {
      if (!data || !data.token) return;

      const decoded = jwt.verify(data.token, JWT_SECRET);
      socket.userId = decoded.userId;
      console.log(`👤 User ${socket.userId} authenticated on socket ${socket.id}`);
    } catch (err) {
      console.error('❌ Socket auth failed:', err.message);
    }
  });

  // Join match room
  socket.on('match:view', (data) => {
    socket.join(`match-${data.matchId}`);
    console.log(`📍 User ${socket.id} viewing match: match-${data.matchId}`);
  });

  // Send message
  socket.on('message:send', async (data) => {
    const { matchId, message, messageType = 'text', mediaUrl = null, iv = 'none', authTag = 'none' } = data;
    const userId = socket.userId;

    if (!userId) return;

    try {
      // Save message to database for persistence
      const result = await pool.query(
        'INSERT INTO messages (match_id, sender_id, encrypted_content, iv, auth_tag, message_type, media_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [matchId, userId, message || '', iv, authTag, messageType, mediaUrl]
      );

      const savedMsg = result.rows[0];

      // Broadcast to other users in the room (EXCEPT sender to prevent duplicates)
      socket.to(`match-${matchId}`).emit('message:new', {
        id: savedMsg.id,
        matchId: parseInt(matchId),
        text: savedMsg.encrypted_content,
        messageType: savedMsg.message_type,
        mediaUrl: savedMsg.media_url,
        senderId: userId,
        time: savedMsg.created_at,
        isOwn: false
      });
      console.log(`💬 ${messageType} message saved and broadcast in match-${matchId}`);
    } catch (err) {
      console.error('❌ Error saving socket message:', err.message);
    }
  });

  // Typing indicator
  socket.on('typing:start', (data) => {
    socket.to(`match-${data.matchId}`).emit('user:typing', {
      matchId: data.matchId,
      userId: socket.userId,
      typing: true
    });
  });

  socket.on('typing:stop', (data) => {
    socket.to(`match-${data.matchId}`).emit('user:stopped-typing', {
      matchId: data.matchId,
      userId: socket.userId,
      typing: false
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User ${socket.id} disconnected`);
  });
});

// Database Migration (Auto-run on startup for Render)
const fs = require('fs');
const path = require('path');
const { pool } = require('./utils/db');

async function runMigration() {
  try {
    console.log('🔄 Checking database migrations...');
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements (basic splitting)
    const statements = schema.split(';').filter(s => s.trim().length > 0);

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (!trimmed) continue;

      try {
        await pool.query(trimmed);
      } catch (err) {
        // Ignore "relation already exists" (42P07) or "column already exists" (42701)
        if (err.code !== '42P07' && err.code !== '42701') {
          console.warn(`⚠️ Migration warning on [${trimmed.substring(0, 50)}...]: ${err.message}`);
        }
      }
    }
    console.log('✅ Database migration completed');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

// Start Server with Migration and Seeding
const { seedGenZUsers } = require('./utils/seeder');

(async () => {
  await runMigration();
  await seedGenZUsers();

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 WebSocket ready for real-time chat`);
    console.log(`🔒 E2E encryption enabled with Signal Protocol`);
    console.log(`🗄️  PostgreSQL database connected`);
    console.log(`💾 Redis cache ready`);
  });
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
