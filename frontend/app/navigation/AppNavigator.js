/**
 * App Navigator
 * Main app navigation with bottom tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/theme';

// Screens
import HomeScreen from '../../screens/HomeScreen';
import ZenzDatingScreen from '../../screens/ZenzDatingScreen';
import ChatListScreen from '../../screens/ChatListScreen';
import ChatScreen from '../../screens/ChatScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import EditProfileScreen from '../../screens/EditProfileScreen';
import PhotosScreen from '../../screens/PhotosScreen';
import PreferencesScreen from '../../screens/PreferencesScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import SafetyCenterScreen from '../../screens/SafetyCenterScreen';
import UserProfileScreen from '../../screens/UserProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stacks
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discovery" component={HomeScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="SafetyCenter" component={SafetyCenterScreen} />
    </Stack.Navigator>
  );
}

function ZenzStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ZenzMain" component={ZenzDatingScreen} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Photos" component={PhotosScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="SafetyCenter" component={SafetyCenterScreen} />
    </Stack.Navigator>
  );
}

// Custom Tab Bar Button
function TabBarButton({ label, icon, onPress, isActive }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      }}
    >
      <View style={{
        padding: 4,
        borderRadius: 12,
        backgroundColor: isActive ? 'rgba(255, 46, 151, 0.1)' : 'transparent',
      }}>
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? COLORS.neonPink : COLORS.textTertiary}
        />
      </View>
      <Text
        style={{
          fontSize: 10,
          fontWeight: isActive ? '700' : '500',
          color: isActive ? COLORS.textWhite : COLORS.textTertiary,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'ChatDetail') {
      return 'none';
    }
    return 'flex';
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: getTabBarVisibility(route),
          backgroundColor: COLORS.bgDark,
          borderTopColor: 'rgba(255,255,255,0.05)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        },
        tabBarButton: (props) => {
          const { onPress, accessibilityState } = props;
          const isFocused = accessibilityState.selected;

          let label = '';
          let icon = 'heart';

          if (route.name === 'HomeTab') {
            label = 'Discover';
            icon = isFocused ? 'flame' : 'flame-outline';
          } else if (route.name === 'ZenzTab') {
            label = 'Zenz';
            icon = isFocused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'ChatTab') {
            label = 'Chat';
            icon = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'ProfileTab') {
            label = 'Profile';
            icon = isFocused ? 'person' : 'person-outline';
          }

          return (
            <TabBarButton
              label={label}
              icon={icon}
              onPress={onPress}
              isActive={isFocused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ZenzTab" component={ZenzStack} />
      <Tab.Screen name="ChatTab" component={ChatStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}
