/**
 * App Navigator
 * Main app navigation with bottom tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';
import HomeScreen from '../screens/HomeScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Chat Stack
function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatListMain" component={ChatListScreen} />
      <Stack.Screen
        name="ChatDetail"
        component={ChatScreen}
        options={{
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Custom Tab Bar Button
function TabBarButton({ label, icon, onPress, isActive }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING,
      }}
    >
      <Ionicons
        name={icon}
        size={24}
        color={isActive ? COLORS.primary : COLORS.textSecondary}
      />
      <Text
        style={{
          fontSize: 10,
          color: isActive ? COLORS.primary : COLORS.textSecondary,
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgPrimary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: SPACING,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarButton: (props) => {
          const { onPress, accessibilityState } = props;
          const isFocused = accessibilityState.selected;

          let label = '';
          let icon = 'heart';

          if (route.name === 'HomeTab') {
            label = 'Discover';
            icon = isFocused ? 'flame' : 'flame-outline';
          } else if (route.name === 'ChatTab') {
            label = 'Messages';
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
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
