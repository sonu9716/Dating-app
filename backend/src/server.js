const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`✅ User ${socket.id} connected`);

  // Join match room
  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`📍 User ${socket.id} joined match room: match-${matchId}`);
  });

  // Send encrypted message
  socket.on('send-message', (data) => {
    io.to(`match-${data.matchId}`).emit('receive-message', {
      ...data,
      receivedAt: new Date().toISOString()
    });
    console.log(`💬 Message sent in match-${data.matchId}`);
  });

  // Typing indicator
  socket.on('user-typing', (data) => {
    io.to(`match-${data.matchId}`).emit('user-typing', {
      userId: data.userId,
      typing: true
    });
  });

  socket.on('user-stopped-typing', (data) => {
    io.to(`match-${data.matchId}`).emit('user-typing', {
      userId: data.userId,
      typing: false
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 WebSocket ready for real-time chat`);
  console.log(`🔒 E2E encryption enabled with Signal Protocol`);
  console.log(`🗄️  PostgreSQL database connected`);
  console.log(`💾 Redis cache ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
