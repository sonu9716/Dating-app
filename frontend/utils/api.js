/**
 * API Client with Axios
 * Handles authentication, error handling, and interceptors
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_URL}/api/auth/refresh`,
            { refreshToken }
          );

          const { token } = response.data;
          await SecureStore.setItemAsync('userToken', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed - redirect to login
        console.error('Token refresh failed:', refreshError);
        // Trigger logout (handled by navigation context)
      }
    }

    // Handle 400 Bad Request
    if (error.response?.status === 400) {
      console.error('Bad request:', error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerificationEmail: (email) =>
    api.post('/auth/resend-verification', { email }),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  updatePassword: (oldPassword, newPassword) =>
    api.post('/auth/update-password', { oldPassword, newPassword }),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadPhoto: (photo) => {
    const formData = new FormData();
    formData.append('photo', photo);
    return api.post('/users/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePhoto: (photoId) => api.delete(`/users/photo/${photoId}`),
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (data) => api.put('/users/preferences', data),
};

export const swipeAPI = {
  getProfile: (userId) => api.get(`/swipes/${userId}`),
  like: (userId) => api.post('/swipes/like', { userId }),
  pass: (userId) => api.post('/swipes/pass', { userId }),
  superLike: (userId) => api.post('/swipes/super-like', { userId }),
  getMatches: () => api.get('/swipes/matches'),
};

export const matchAPI = {
  getMatches: () => api.get('/matches'),
  getMatch: (matchId) => api.get(`/matches/${matchId}`),
  unmatch: (matchId) => api.delete(`/matches/${matchId}`),
  blockUser: (userId) => api.post(`/matches/${userId}/block`),
};

export const messageAPI = {
  getMessages: (matchId, limit = 50, offset = 0) =>
    api.get(`/messages/${matchId}`, { params: { limit, offset } }),
  sendMessage: (matchId, message) =>
    api.post(`/messages/${matchId}`, { message }),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  markAsRead: (matchId) => api.put(`/messages/${matchId}/read`),
};

export default api;
