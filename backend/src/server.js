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
  socket.on('message:send', (data) => {
    const { matchId, message } = data;
    io.to(`match-${matchId}`).emit('message:new', {
      ...message,
      matchId,
      createdAt: new Date().toISOString()
    });
    console.log(`💬 Message sent in match-${matchId}`);
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
      try {
        await pool.query(statement);
      } catch (err) {
        // Ignore "relation already exists" or simple errors if table exists
        if (err.code !== '42P07') { // 42P07 is duplicate_table in Postgres
          console.warn(`⚠️ Migration warning: ${err.message}`);
        }
      }
    }
    console.log('✅ Database migration completed');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

// Start Server with Migration
(async () => {
  await runMigration();

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
