import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { state: authState, logout } = useAuth();
  const user = authState.user;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'Logout failed. Please try again.');
            }
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.neonPink} />
      </View>
    );
  }

  const menuItems = [
    { title: 'Edit Profile', icon: 'pencil-outline', screen: 'EditProfile' },
    { title: 'Photos', icon: 'images-outline', screen: 'Photos' },
    { title: 'Preferences', icon: 'options-outline', screen: 'Preferences' },
    { title: 'Settings', icon: 'settings-outline', screen: 'Settings' },
    { title: 'Safety Center', icon: 'shield-checkmark-outline', screen: 'Safety' },
    { title: 'Help & Support', icon: 'help-circle-outline', screen: 'Support' },
    { title: 'Logout', icon: 'log-out-outline', action: handleLogout, color: COLORS.coral },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={StyleSheet.absoluteFill}
      />

      {/* Glass Header */}
      <View style={styles.headerContainer}>
        <BlurView tint="light" intensity={20} style={styles.headerBlur}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        </BlurView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user.avatar || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']}
              style={styles.avatarGradient}
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={() => navigation.navigate('Photos')}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={COLORS.modernTeal} />
            <Text style={styles.locationText}>{user.location || 'Location not set'}</Text>
          </View>
        </Animated.View>

        {/* User Stats/Quick info can go here */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>84%</Text>
            <Text style={styles.statLabel}>Match Rate</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>VIP</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => item.action ? item.action() : navigation.navigate(item.screen)}
              style={styles.menuItem}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color ? `${item.color}20` : 'rgba(255,255,255,0.05)' }]}>
                <Ionicons name={item.icon} size={20} color={item.color || COLORS.modernTeal} />
              </View>
              <Text style={[styles.menuItemText, item.color && { color: item.color }]}>
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255,255,255,0.2)"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <TouchableOpacity style={styles.premiumCard}>
          <LinearGradient
            colors={[COLORS.secondaryStart, COLORS.secondaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}
          >
            <View>
              <Text style={styles.premiumTitle}>Get Premium ✨</Text>
              <Text style={styles.premiumSubtitle}>See who likes you and more</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerBlur: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING[6],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  settingsButton: {
    position: 'absolute',
    right: SPACING[6],
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 120 : 80,
    paddingHorizontal: SPACING[6],
    paddingBottom: 40,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: SPACING[8],
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.neonPink,
    marginBottom: SPACING[4],
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
  },
  avatarGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 70,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neonPink,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.bgDark,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    opacity: 0.7,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textWhite,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING[6],
    marginBottom: SPACING[8],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.modernTeal,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.xl,
    padding: SPACING[2],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: SPACING[6],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[4],
    gap: SPACING[4],
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  premiumCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: COLORS.secondaryStart,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[6],
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  }
});
