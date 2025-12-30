/**
 * Chat Context
 * Manages real-time chat state and messages
 */

import React, { createContext, useReducer, useEffect } from 'react';
import { socket, socketEmitters } from '../utils/socket';

export const ChatContext = createContext();

const initialState = {
  messages: {},
  matches: [],
  activeChat: null,
  typingUsers: {},
  onlineUsers: {},
  unreadCount: 0,
  isLoading: false,
  error: null,
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_MATCHES':
      return {
        ...state,
        matches: action.payload,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.matchId]: [
            ...(state.messages[action.payload.matchId] || []),
            action.payload.message,
          ],
        },
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.matchId]: action.payload.messages,
        },
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.matchId]: state.messages[
            action.payload.matchId
          ].filter((msg) => msg.id !== action.payload.messageId),
        },
      };

    case 'SET_ACTIVE_CHAT':
      return {
        ...state,
        activeChat: action.payload,
      };

    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.matchId]: action.payload.isTyping,
        },
      };

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        onlineUsers: {
          ...state.onlineUsers,
          [action.payload.userId]: action.payload.isOnline,
        },
      };

    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Socket listeners
  useEffect(() => {
    socket.on('message:new', (data) => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          matchId: data.matchId,
          message: data,
        },
      });
    });

    socket.on('message:deleted', (data) => {
      dispatch({
        type: 'DELETE_MESSAGE',
        payload: {
          matchId: data.matchId,
          messageId: data.messageId,
        },
      });
    });

    socket.on('user:typing', (data) => {
      dispatch({
        type: 'SET_TYPING',
        payload: {
          matchId: data.matchId,
          isTyping: true,
        },
      });
    });

    socket.on('user:stopped-typing', (data) => {
      dispatch({
        type: 'SET_TYPING',
        payload: {
          matchId: data.matchId,
          isTyping: false,
        },
      });
    });

    socket.on('user:online', (data) => {
      dispatch({
        type: 'SET_ONLINE_STATUS',
        payload: {
          userId: data.userId,
          isOnline: true,
        },
      });
    });

    socket.on('user:offline', (data) => {
      dispatch({
        type: 'SET_ONLINE_STATUS',
        payload: {
          userId: data.userId,
          isOnline: false,
        },
      });
    });

    return () => {
      socket.off('message:new');
      socket.off('message:deleted');
      socket.off('user:typing');
      socket.off('user:stopped-typing');
      socket.off('user:online');
      socket.off('user:offline');
    };
  }, []);

  const chatContext = {
    state,
    dispatch,

    setMatches: (matches) => {
      dispatch({ type: 'SET_MATCHES', payload: matches });
    },

    sendMessage: (matchId, message) => {
      socketEmitters.sendMessage(matchId, message);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          matchId,
          message: {
            id: Date.now(),
            matchId,
            text: message,
            createdAt: new Date(),
            isOwn: true,
          },
        },
      });
    },

    setActiveChat: (matchId) => {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: matchId });
      socketEmitters.markAsRead(matchId);
    },

    startTyping: (matchId) => {
      socketEmitters.startTyping(matchId);
    },

    stopTyping: (matchId) => {
      socketEmitters.stopTyping(matchId);
    },

    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  return (
    <ChatContext.Provider value={chatContext}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
