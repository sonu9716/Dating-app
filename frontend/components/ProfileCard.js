/**
 * Profile Card Component
 * Displays user profile with photo, name, and info
 */

import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function ProfileCard({ profile, onSwipeLeft, onSwipeRight }) {
  return (
    <View
      style={{
        width: '100%',
        height: 500,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginVertical: SPACING,
      }}
    >
      {/* Profile Image */}
      <Image
        source={{ uri: profile.image }}
        style={{
          width: '100%',
          height: '70%',
          backgroundColor: COLORS.border,
        }}
        resizeMode="cover"
      />

      {/* Profile Info */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: SPACING,
          paddingVertical: SPACING,
          backgroundColor: COLORS.bgPrimary,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              marginBottom: SPACING,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: COLORS.textPrimary,
                marginRight: SPACING,
              }}
            >
              {profile.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: COLORS.textSecondary,
              }}
            >
              {profile.age}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              color: COLORS.textSecondary,
            }}
          >
            {profile.location || 'Location not shared'}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 18,
          }}
        >
          {profile.bio}
        </Text>
      </View>
    </View>
  );
}
