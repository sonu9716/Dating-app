/**
 * Root Navigator
 * Manages authentication state and routes to appropriate navigator
 */

import { COLORS } from '../utils/theme';
import { secureStorage } from '../utils/storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            isSignout: false,
            userToken: action.payload,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.payload,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await secureStorage.getToken();
      } catch (e) {
        console.error('Failed to restore token', e);
      }

      dispatch({ type: 'RESTORE_TOKEN', payload: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (credentials) => {
        // Sign in logic
        dispatch({ type: 'SIGN_IN', payload: 'dummy-token' });
      },
      signUp: async (credentials) => {
        // Sign up logic
        dispatch({ type: 'SIGN_IN', payload: 'dummy-token' });
      },
      signOut: async () => {
        await secureStorage.removeToken();
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (credentials) => {
        // Sign up logic
        dispatch({ type: 'SIGN_IN', payload: 'dummy-token' });
      },
    }),
    []
  );

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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.bgPrimary },
        }}
      >
        {state.userToken == null ? (
          <Stack.Group
            screenOptions={{
              animationEnabled: false,
            }}
          >
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="App"
              component={AppNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
