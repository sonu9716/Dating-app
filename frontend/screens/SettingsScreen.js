/**
 * Settings Screen
 * App settings and preferences
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import Header from '../components/Header';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const SettingsItem = ({ title, icon, value, onChange }) => (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: SPACING,
        paddingHorizontal: SPACING,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <Text
          style={{
            fontSize: 16,
            color: COLORS.textPrimary,
            marginLeft: SPACING,
          }}
        >
          {title}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: COLORS.bgSecondary,
          true: COLORS.primaryLight,
        }}
        thumbColor={value ? COLORS.primary : COLORS.textTertiary}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}>
      <Header title="Settings" />

      <ScrollView>
        {/* Notifications */}
        <View style={{ marginTop: SPACING }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: COLORS.textSecondary,
              marginLeft: SPACING,
              marginBottom: SPACING,
              textTransform: 'uppercase',
            }}
          >
            Notifications
          </Text>
          <SettingsItem
            title="Push Notifications"
            icon="notifications"
            value={notifications}
            onChange={setNotifications}
          />
          <SettingsItem
            title="Messages"
            icon="chatbubbles"
            value={notifications}
            onChange={setNotifications}
          />
        </View>

        {/* Privacy */}
        <View style={{ marginTop: SPACING }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: COLORS.textSecondary,
              marginLeft: SPACING,
              marginBottom: SPACING,
              textTransform: 'uppercase',
            }}
          >
            Privacy
          </Text>
          <SettingsItem
            title="Location Access"
            icon="location"
            value={location}
            onChange={setLocation}
          />
          <SettingsItem
            title="Online Status"
            icon="eye"
            value={true}
            onChange={() => {}}
          />
        </View>

        {/* Appearance */}
        <View style={{ marginTop: SPACING }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: COLORS.textSecondary,
              marginLeft: SPACING,
              marginBottom: SPACING,
              textTransform: 'uppercase',
            }}
          >
            Appearance
          </Text>
          <SettingsItem
            title="Dark Mode"
            icon="moon"
            value={darkMode}
            onChange={setDarkMode}
          />
        </View>

        {/* Account */}
        <View style={{ marginTop: SPACING, marginBottom: SPACING }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: COLORS.textSecondary,
              marginLeft: SPACING,
              marginBottom: SPACING,
              textTransform: 'uppercase',
            }}
          >
            Account
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: SPACING,
              paddingHorizontal: SPACING,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.error }}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
