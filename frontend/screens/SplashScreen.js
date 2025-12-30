/**
 * Splash Screen
 * Loading screen shown while checking authentication
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
      }}
    >
      {/* Logo placeholder */}
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: COLORS.bgPrimary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: SPACING,
        }}
      >
        <Text style={{ fontSize: 48 }}>❤️</Text>
      </View>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: COLORS.bgPrimary,
          marginBottom: SPACING,
        }}
      >
        Dating App
      </Text>

      <ActivityIndicator
        size="large"
        color={COLORS.bgPrimary}
        style={{ marginTop: SPACING }}
      />
    </View>
  );
}
