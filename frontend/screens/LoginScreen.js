import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function LoginScreen({ navigation }) {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Google Auth Configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // expoClientId: 'your-expo-client-id', // For testing in Expo Go
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    } else if (response?.type === 'error') {
      Alert.alert('Google Login Error', 'Failed to authenticate with Google');
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    setIsLoading(true);
    try {
      const result = await googleLogin(idToken);
      if (!result.success) {
        Alert.alert('Google Login Failed', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Animation shared values
  const orb1Value = useSharedValue(0);
  const orb2Value = useSharedValue(0);
  const cardY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    // Floating orb animations
    orb1Value.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
    orb2Value.value = withRepeat(withTiming(1, { duration: 5000 }), -1, true);

    // Card entry animation
    cardY.value = withSpring(0, { damping: 15 });
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(orb1Value.value, [0, 1], [1, 1.2]) },
      { translateY: interpolate(orb1Value.value, [0, 1], [0, -20]) }
    ],
    opacity: interpolate(orb1Value.value, [0, 1], [0.3, 0.5])
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(orb2Value.value, [0, 1], [1, 1.3]) },
      { translateX: interpolate(orb2Value.value, [0, 1], [0, 30]) }
    ],
    opacity: interpolate(orb2Value.value, [0, 1], [0.2, 0.4])
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value
  }));

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
    <View style={{ flex: 1, backgroundColor: COLORS.bgDark }}>
      {/* Dynamic Background */}
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {/* Animated Orbs */}
      <Animated.View
        style={[
          orb1Style,
          {
            position: 'absolute',
            top: height * 0.1,
            right: -width * 0.1,
            width: width * 0.6,
            height: width * 0.6,
            borderRadius: width * 0.3,
            backgroundColor: COLORS.neonPink,
          }
        ]}
      />
      <Animated.View
        style={[
          orb2Style,
          {
            position: 'absolute',
            bottom: height * 0.1,
            left: -width * 0.1,
            width: width * 0.5,
            height: width * 0.5,
            borderRadius: width * 0.25,
            backgroundColor: COLORS.electricPurple,
          }
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: SPACING[6],
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={cardStyle}>
            <BlurView
              tint="dark"
              intensity={80}
              style={{
                borderRadius: RADIUS.xl,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: COLORS.glassBorderDark,
                padding: SPACING[8],
              }}
            >
              {/* Logo/Header Area */}
              <View style={{ alignItems: 'center', marginBottom: SPACING[8] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING[2], marginBottom: SPACING[2] }}>
                  <Ionicons name="sparkles" size={24} color={COLORS.neonPink} />
                  <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.textWhite }}>
                    Welcome Back
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: COLORS.textTertiary, textAlign: 'center' }}>
                  Your next connection awaits ✨
                </Text>
              </View>

              {/* Form Areas */}
              <View style={{ gap: SPACING[4] }}>
                {/* Email */}
                <View>
                  <TextInput
                    style={{
                      height: 54,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: RADIUS.md,
                      paddingHorizontal: SPACING[4],
                      fontSize: 16,
                      color: COLORS.textWhite,
                      borderWidth: 2,
                      borderColor: focusedField === 'email' ? COLORS.neonPink : 'transparent',
                    }}
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password */}
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={{
                      height: 54,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: RADIUS.md,
                      paddingHorizontal: SPACING[4],
                      paddingRight: 50,
                      fontSize: 16,
                      color: COLORS.textWhite,
                      borderWidth: 2,
                      borderColor: focusedField === 'password' ? COLORS.electricPurple : 'transparent',
                    }}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 15, top: 15 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity>
                  <Text style={{ color: COLORS.neonPink, fontSize: 13, fontWeight: '500' }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  style={{ marginTop: SPACING[4] }}
                >
                  <LinearGradient
                    colors={GRADIENTS.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      height: 54,
                      borderRadius: RADIUS.md,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={COLORS.textWhite} />
                    ) : (
                      <Text style={{ color: COLORS.textWhite, fontSize: 16, fontWeight: '700' }}>
                        Login
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: SPACING[4] }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Text style={{ paddingHorizontal: SPACING[4], color: COLORS.textTertiary, fontSize: 12 }}>
                    Or continue with
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                </View>

                {/* Social Logins */}
                <View style={{ flexDirection: 'row', gap: SPACING[4] }}>
                  <TouchableOpacity style={{
                    flex: 1,
                    height: 50,
                    borderRadius: RADIUS.md,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}>
                    <Ionicons name="logo-apple" size={20} color={COLORS.textWhite} />
                    <Text style={{ color: COLORS.textWhite, fontWeight: '600' }}>Apple</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => promptAsync()}
                    disabled={!request}
                    style={{
                      flex: 1,
                      height: 50,
                      borderRadius: RADIUS.md,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      opacity: !request ? 0.5 : 1,
                    }}
                  >
                    <Ionicons name="logo-google" size={20} color={COLORS.textWhite} />
                    <Text style={{ color: COLORS.textWhite, fontWeight: '600' }}>Google</Text>
                  </TouchableOpacity>
                </View>

                {/* Signup Link */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: SPACING[4] }}>
                  <Text style={{ color: COLORS.textTertiary, fontSize: 14 }}>New here? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ color: COLORS.neonPink, fontWeight: '700', fontSize: 14 }}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
