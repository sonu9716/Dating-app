import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { state } = useAuth();

  if (state.isLoading) {
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bgPrimary },
      }}
    >
      {state.user == null ? (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animation: 'none',
          }}
        />
      ) : (
        <Stack.Screen
          name="App"
          component={AppNavigator}
          options={{
            animation: 'none',
          }}
        />
      )}
    </Stack.Navigator>
  );
}
