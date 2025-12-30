/**
 * Match Animation Component
 * Confetti and celebration effect when users match
 */

import React, { useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function MatchAnimation({ visible = false, onClose, match }) {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            backgroundColor: COLORS.bgPrimary,
            borderRadius: RADIUS.lg,
            paddingVertical: SPACING,
            paddingHorizontal: SPACING,
            alignItems: 'center',
            width: '85%',
          }}
        >
          {/* Celebration Icon */}
          <Text style={{ fontSize: 64, marginBottom: SPACING }}>
            ✨
          </Text>

          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: COLORS.primary,
              marginBottom: SPACING,
              textAlign: 'center',
            }}
          >
            It's a Match!
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              marginBottom: SPACING,
              textAlign: 'center',
            }}
          >
            You and {match?.name} have liked each other!
          </Text>

          {/* Match Info */}
          {match && (
            <View
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: RADIUS.md,
                paddingVertical: SPACING,
                paddingHorizontal: SPACING,
                marginBottom: SPACING,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.textPrimary,
                }}
              >
                {match.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  marginTop: SPACING,
                }}
              >
                {match.age}
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View style={{ width: '100%', gap: SPACING }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: RADIUS.md,
                paddingVertical: SPACING,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: COLORS.bgPrimary,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Send a Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={{
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
                Keep Swiping
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
