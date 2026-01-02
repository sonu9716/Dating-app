import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Switch,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const [ageRange, setAgeRange] = useState(35);
  const [distance, setDistance] = useState(25);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    showDistance: true,
    showOnlineStatus: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ title, icon, value, isSwitch, onPress, onChange, last }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[styles.item, last && { borderBottomWidth: 0 }]}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={20} color={COLORS.modernTeal} />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.modernTeal }}
          thumbColor={Platform.OS === 'ios' ? '#FFF' : value ? COLORS.modernTeal : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <BlurView tint="light" intensity={20} style={styles.headerBlur}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </BlurView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100)}>
          <SettingsSection title="Account">
            <SettingsItem title="Edit Profile" icon="person-outline" onPress={() => navigation.navigate('EditProfile')} />
            <SettingsItem title="Verification" icon="checkmark-circle-outline" onPress={() => { }} />
            <SettingsItem title="Safety Center" icon="shield-checkmark-outline" onPress={() => navigation.navigate('SafetyCenter')} last />
          </SettingsSection>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <SettingsSection title="Discovery Preferences">
            <View style={styles.sliderContainer}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Maximum Distance</Text>
                <Text style={styles.sliderValue}>{distance} km</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                value={distance}
                onValueChange={setDistance}
                minimumTrackTintColor={COLORS.modernTeal}
                maximumTrackTintColor="rgba(255,255,255,0.1)"
                thumbTintColor={COLORS.modernTeal}
              />
            </View>
            <View style={[styles.sliderContainer, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }]}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Preferred Age</Text>
                <Text style={styles.sliderValue}>Up to {ageRange}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={99}
                value={ageRange}
                onValueChange={setAgeRange}
                minimumTrackTintColor={COLORS.modernTeal}
                maximumTrackTintColor="rgba(255,255,255,0.1)"
                thumbTintColor={COLORS.modernTeal}
              />
            </View>
          </SettingsSection>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <SettingsSection title="App Settings">
            <SettingsItem
              title="Push Notifications"
              icon="notifications-outline"
              isSwitch
              value={settings.notifications}
              onChange={() => toggleSetting('notifications')}
            />
            <SettingsItem
              title="Dark Mode"
              icon="moon-outline"
              isSwitch
              value={settings.darkMode}
              onChange={() => toggleSetting('darkMode')}
            />
            <SettingsItem
              title="Show Online Status"
              icon="eye-outline"
              isSwitch
              value={settings.showOnlineStatus}
              onChange={() => toggleSetting('showOnlineStatus')}
              last
            />
          </SettingsSection>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <SettingsSection title="Danger Zone">
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.coral} />
              <Text style={styles.dangerButtonText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dangerButton, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }]}
              onPress={() => { }}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.coral} />
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </SettingsSection>
        </Animated.View>

        <Text style={styles.versionText}>Version 1.0.0 (Build 42)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    zIndex: 10,
  },
  headerBlur: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  scrollContent: {
    paddingTop: SPACING[4],
    paddingHorizontal: SPACING[6],
    paddingBottom: 40,
  },
  section: {
    marginBottom: SPACING[6],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: SPACING[2],
    marginBottom: SPACING[3],
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[3],
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textWhite,
  },
  sliderContainer: {
    padding: SPACING[4],
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textWhite,
  },
  sliderValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.modernTeal,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[4],
    gap: SPACING[3],
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.coral,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: SPACING[4],
  }
});
