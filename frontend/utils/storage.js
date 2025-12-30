import * as SecureStore from 'expo-secure-store';

export const storage = {
  async setToken(token) {
    try {
      await SecureStore.setItemAsync('userToken', token);
    } catch (err) {
      console.error('Failed to save token:', err);
    }
  },

  async getToken() {
    try {
      return await SecureStore.getItemAsync('userToken');
    } catch (err) {
      console.error('Failed to get token:', err);
      return null;
    }
  },

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync('userToken');
    } catch (err) {
      console.error('Failed to remove token:', err);
    }
  },

  async setUser(user) {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  },

  async getUser() {
    try {
      const user = await SecureStore.getItemAsync('user');
      return user ? JSON.parse(user) : null;
    } catch (err) {
      console.error('Failed to get user:', err);
      return null;
    }
  },

  async clearAll() {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('user');
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  }
};

export default storage;
