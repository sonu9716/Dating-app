/**
 * Socket.io Real-time Communication
 * Handles messages, matches, typing indicators
 */

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.2:5001';

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
});

// Connection events
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Message events
socket.on('message:new', (data) => {
  console.log('New message received:', data);
  // Handled by ChatContext
});

socket.on('message:deleted', (data) => {
  console.log('Message deleted:', data);
  // Handled by ChatContext
});

// Match events
socket.on('match:created', (data) => {
  console.log('New match created:', data);
  // Handled by context/navigation
});

socket.on('match:removed', (data) => {
  console.log('Match removed:', data);
  // Handled by context
});

// Typing events
socket.on('user:typing', (data) => {
  console.log('User typing:', data);
  // Handled by ChatContext
});

socket.on('user:stopped-typing', (data) => {
  console.log('User stopped typing:', data);
  // Handled by ChatContext
});

// Online status
socket.on('user:online', (data) => {
  console.log('User online:', data);
  // Handled by context
});

socket.on('user:offline', (data) => {
  console.log('User offline:', data);
  // Handled by context
});

// Socket emitters
export const socketEmitters = {
  // Authentication
  authenticate: (token) => {
    socket.emit('auth', { token });
  },

  // Messages
  sendMessage: (matchId, message) => {
    socket.emit('message:send', { matchId, message });
  },

  deleteMessage: (messageId) => {
    socket.emit('message:delete', { messageId });
  },

  // Typing indicator
  startTyping: (matchId) => {
    socket.emit('typing:start', { matchId });
  },

  stopTyping: (matchId) => {
    socket.emit('typing:stop', { matchId });
  },

  // Online status
  setOnline: () => {
    socket.emit('user:status', { status: 'online' });
  },

  setOffline: () => {
    socket.emit('user:status', { status: 'offline' });
  },

  // Match events
  viewMatch: (matchId) => {
    socket.emit('match:view', { matchId });
  },

  // Notifications
  subscribeToNotifications: () => {
    socket.emit('notifications:subscribe');
  },

  unsubscribeFromNotifications: () => {
    socket.emit('notifications:unsubscribe');
  },
};

export default socket;
