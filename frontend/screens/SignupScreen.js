/**
 * Signup Screen
 * Multi-step signup process
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

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup(formData);
      if (!result.success) {
        Alert.alert('Signup Failed', result.error);
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
        {/* Progress Indicator */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: SPACING,
            justifyContent: 'space-between',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                backgroundColor: i <= step ? COLORS.primary : COLORS.border,
                marginHorizontal: 4,
                borderRadius: 2,
              }}
            />
          ))}
        </View>

        {/* Step 1: Name */}
        {step === 1 && (
          <>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginBottom: SPACING,
              }}
            >
              What's your name?
            </Text>

            <TextInput
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingHorizontal: SPACING,
                paddingVertical: SPACING,
                fontSize: 16,
                marginBottom: SPACING,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              placeholder="First name"
              placeholderTextColor={COLORS.textTertiary}
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
            />

            <TextInput
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingHorizontal: SPACING,
                paddingVertical: SPACING,
                fontSize: 16,
                marginBottom: SPACING,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              placeholder="Last name"
              placeholderTextColor={COLORS.textTertiary}
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
            />
          </>
        )}

        {/* Step 2: Email */}
        {step === 2 && (
          <>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginBottom: SPACING,
              }}
            >
              Email address
            </Text>

            <TextInput
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingHorizontal: SPACING,
                paddingVertical: SPACING,
                fontSize: 16,
                marginBottom: SPACING,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textTertiary}
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        )}

        {/* Step 3: Password */}
        {step === 3 && (
          <>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginBottom: SPACING,
              }}
            >
              Create password
            </Text>

            <TextInput
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingHorizontal: SPACING,
                paddingVertical: SPACING,
                fontSize: 16,
                marginBottom: SPACING,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              placeholder="Password"
              placeholderTextColor={COLORS.textTertiary}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
            />

            <TextInput
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingHorizontal: SPACING,
                paddingVertical: SPACING,
                fontSize: 16,
                marginBottom: SPACING,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.textTertiary}
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
            />
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginBottom: SPACING,
              }}
            >
              Ready to go?
            </Text>

            <View
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                padding: SPACING,
                marginBottom: SPACING,
              }}
            >
              <Text style={{ color: COLORS.textSecondary, marginBottom: 8 }}>
                Name: {formData.firstName} {formData.lastName}
              </Text>
              <Text style={{ color: COLORS.textSecondary, marginBottom: 8 }}>
                Email: {formData.email}
              </Text>
            </View>
          </>
        )}

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: SPACING }}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              style={{
                flex: 1,
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingVertical: SPACING,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.textPrimary,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={step === 4 ? handleSignup : handleNext}
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: COLORS.primary,
              borderRadius: RADIUS.md,
              paddingVertical: SPACING,
              alignItems: 'center',
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
                {step === 4 ? 'Create Account' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: SPACING }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
