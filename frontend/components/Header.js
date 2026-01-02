/**
 * Header Component
 * Navigation header for screens
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function Header({ title, showBack = false, onBackPress }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: COLORS.bgPrimary,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[4],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {showBack ? (
        <TouchableOpacity
          onPress={onBackPress || (() => navigation.goBack())}
          style={{ padding: SPACING[4] }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}

      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: COLORS.textPrimary,
          textAlign: 'center',
          flex: 1,
        }}
      >
        {title}
      </Text>

      <View style={{ width: 40 }} />
    </View>
  );
}
