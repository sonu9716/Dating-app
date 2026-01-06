/**
 * Auth Context
 * Manages global authentication state
 */

import React, { createContext, useReducer, useEffect } from 'react';
import { secureStorage, appStorage } from '../utils/storage';
import { authAPI, userAPI } from '../utils/api';
import { socketEmitters } from '../utils/socket';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'SIGNUP_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
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

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await secureStorage.getToken();
        if (token) {
          // Verify token is still valid
          const response = await userAPI.getProfile();
          dispatch({ type: 'RESTORE_TOKEN', payload: response.data.data });
          socketEmitters.authenticate(token);
        } else {
          dispatch({ type: 'RESTORE_TOKEN', payload: null });
        }
      } catch (e) {
        console.error('Error restoring token:', e);
        dispatch({ type: 'RESTORE_TOKEN', payload: null });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    state,
    dispatch,
    login: async (email, password) => {
      try {
        const response = await authAPI.login(email.toLowerCase().trim(), password);
        const { user, token, refreshToken } = response.data;

        await secureStorage.setToken(token);
        await secureStorage.setRefreshToken(refreshToken);

        socketEmitters.authenticate(token);

        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return { success: true, user };
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        dispatch({ type: 'LOGIN_ERROR', payload: message });
        return { success: false, error: message };
      }
    },

    signup: async (userData) => {
      try {
        if (userData.email) userData.email = userData.email.toLowerCase().trim();
        const response = await authAPI.signup(userData);
        const { user, token, refreshToken } = response.data;

        await secureStorage.setToken(token);
        await secureStorage.setRefreshToken(refreshToken);

        socketEmitters.authenticate(token);

        dispatch({ type: 'SIGNUP_SUCCESS', payload: user });
        return { success: true, user };
      } catch (error) {
        const message = error.response?.data?.message || 'Signup failed';
        dispatch({ type: 'SIGNUP_ERROR', payload: message });
        return { success: false, error: message };
      }
    },

    logout: async () => {
      try {
        await authAPI.logout();
        await secureStorage.clearAll();
        dispatch({ type: 'LOGOUT' });
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error };
      }
    },

    updateProfile: async (profileData) => {
      try {
        const response = await userAPI.updateProfile(profileData);
        dispatch({ type: 'UPDATE_PROFILE', payload: response.data.data });
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.message || 'Update failed';
        dispatch({ type: 'SET_ERROR', payload: message });
        return { success: false, error: message };
      }
    },

    refreshProfile: async () => {
      try {
        const response = await userAPI.getProfile();
        dispatch({ type: 'UPDATE_PROFILE', payload: response.data.data });
        return { success: true };
      } catch (error) {
        console.error('Refresh profile error:', error);
        return { success: false };
      }
    },

    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
