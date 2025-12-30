/**
 * Action Buttons Component
 * Like, Pass, and Super Like buttons
 */

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function ActionButtons({
  onPass,
  onLike,
  onSuperLike,
  isLoading = false,
}) {
  const Button = ({ icon, label, color, onPress, isIcon = false }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SPACING,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: RADIUS.full,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {isIcon ? (
          icon
        ) : (
          <Ionicons name={icon} size={28} color={COLORS.bgPrimary} />
        )}
      </View>
      <Text
        style={{
          marginTop: SPACING,
          fontSize: 12,
          color: COLORS.textSecondary,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        paddingVertical: SPACING,
        paddingHorizontal: SPACING,
        backgroundColor: COLORS.bgPrimary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
      }}
    >
      {/* Pass Button */}
      <Button
        icon="close-outline"
        label="Pass"
        color={COLORS.bgSecondary}
        onPress={onPass}
      />

      {/* Super Like Button */}
      <Button
        icon={
          <MaterialCommunityIcons name="star" size={28} color={COLORS.bgPrimary} />
        }
        label="Super Like"
        color={COLORS.accent}
        onPress={onSuperLike}
        isIcon
      />

      {/* Like Button */}
      <Button
        icon="heart"
        label="Like"
        color={COLORS.primary}
        onPress={onLike}
      />
    </View>
  );
}
