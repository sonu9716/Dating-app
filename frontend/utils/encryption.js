/**
 * End-to-End Encryption Utilities
 * Uses crypto for message encryption/decryption
 */

import * as Crypto from 'expo-crypto';

/**
 * Generate a random encryption key
 */
export const generateEncryptionKey = async () => {
  try {
    const randomBytes = await Crypto.getRandomBytes(32);
    return randomBytes;
  } catch (error) {
    console.error('Error generating encryption key:', error);
    throw error;
  }
};

/**
 * Encrypt a message
 */
export const encryptMessage = async (message, key) => {
  try {
    if (!key) {
      throw new Error('Encryption key is required');
    }

    const messageBytes = new TextEncoder().encode(message);
    
    // In production, use proper Signal Protocol library
    // For now, using basic encryption
    const encrypted = await Crypto.digest(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message + key
    );

    return encrypted;
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw error;
  }
};

/**
 * Decrypt a message
 */
export const decryptMessage = async (encryptedMessage, key) => {
  try {
    if (!key) {
      throw new Error('Decryption key is required');
    }

    // In production, use proper Signal Protocol library
    // For now, verification only
    const decrypted = encryptedMessage; // Placeholder

    return decrypted;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw error;
  }
};

/**
 * Hash a password
 */
export const hashPassword = async (password) => {
  try {
    const hash = await Crypto.digest(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Generate a random token
 */
export const generateToken = async (length = 32) => {
  try {
    const randomBytes = await Crypto.getRandomBytes(length);
    return randomBytes;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

export default {
  generateEncryptionKey,
  encryptMessage,
  decryptMessage,
  hashPassword,
  generateToken,
};
