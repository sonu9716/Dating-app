/**
 * Login Screen
 * Email and password authentication
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, state } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Login Failed', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: SPACING,
          paddingVertical: SPACING,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: SPACING }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: COLORS.textPrimary,
              marginBottom: SPACING,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}
          >
            Sign in to continue finding your match
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: SPACING }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: SPACING,
            }}
          >
            Email
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.bgSecondary,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING,
              paddingVertical: SPACING,
              fontSize: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.textTertiary}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: SPACING }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: SPACING,
            }}
          >
            Password
          </Text>
          <TextInput
            style={{
              backgroundColor: COLORS.bgSecondary,
              borderRadius: RADIUS.md,
              paddingHorizontal: SPACING,
              paddingVertical: SPACING,
              fontSize: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.textTertiary}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.md,
            paddingVertical: SPACING,
            alignItems: 'center',
            marginBottom: SPACING,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.bgPrimary} />
          ) : (
            <Text
              style={{
                color: COLORS.bgPrimary,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Login
            </Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity style={{ marginBottom: SPACING }}>
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
