/**
 * Chat Bubble Component
 * Individual message bubble
 */

import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

export default function ChatBubble({ message, isOwn }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginVertical: SPACING[4],
      }}
    >
      <View
        style={{
          maxWidth: '80%',
          backgroundColor: isOwn ? COLORS.primary : COLORS.bgSecondary,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING[4],
          paddingVertical: SPACING[4],
        }}
      >
        <Text
          style={{
            color: isOwn ? COLORS.bgPrimary : COLORS.textPrimary,
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {message.text}
        </Text>

        <Text
          style={{
            color: isOwn ? COLORS.primaryLight : COLORS.textTertiary,
            fontSize: 11,
            marginTop: SPACING[4],
            alignSelf: 'flex-end',
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}
