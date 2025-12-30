/**
 * Loading Component
 * Loading spinner overlay
 */

import React from 'react';
import { View, ActivityIndicator, Modal, Text } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

export default function Loading({ visible = false, message = 'Loading...' }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.bgPrimary,
            borderRadius: 12,
            paddingVertical: SPACING,
            paddingHorizontal: SPACING,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: SPACING,
              color: COLORS.textSecondary,
              fontSize: 14,
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
