/**
 * Profile Screen
 * User profile view and edit
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function ProfileScreen({ navigation }) {
  const { state: authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const user = authState.user;

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.bgPrimary,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}>
      <Header title="Profile" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING,
          paddingVertical: SPACING,
        }}
      >
        {/* Profile Image */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: SPACING,
          }}
        >
          <Image
            source={{ uri: user.avatar }}
            style={{
              width: 120,
              height: 120,
              borderRadius: RADIUS.full,
              marginBottom: SPACING,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: COLORS.textPrimary,
            }}
          >
            {user.name}, {user.age}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginTop: SPACING,
            }}
          >
            {user.location}
          </Text>
        </View>

        {/* Bio */}
        <View
          style={{
            backgroundColor: COLORS.bgSecondary,
            borderRadius: RADIUS.md,
            padding: SPACING,
            marginBottom: SPACING,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: SPACING,
            }}
          >
            About
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
            }}
          >
            {user.bio}
          </Text>
        </View>

        {/* Menu Items */}
        {[
          { title: 'Edit Profile', icon: 'pencil' },
          { title: 'Photos', icon: 'images' },
          { title: 'Preferences', icon: 'sliders' },
          { title: 'Settings', icon: 'settings' },
          { title: 'Help & Support', icon: 'help-circle' },
          { title: 'Logout', icon: 'log-out' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              item.title === 'Settings'
                ? navigation.navigate('Settings')
                : null
            }
            style={{
              flexDirection: 'row',
              paddingVertical: SPACING,
              paddingHorizontal: SPACING,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
              alignItems: 'center',
            }}
          >
            <Ionicons name={item.icon} size={20} color={COLORS.primary} />
            <Text
              style={{
                fontSize: 16,
                color: COLORS.textPrimary,
                marginLeft: SPACING,
              }}
            >
              {item.title}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textTertiary}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
