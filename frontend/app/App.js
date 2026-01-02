import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { SafetyProvider } from '../context/SafetyContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafetyProvider>
          <ChatProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ChatProvider>
        </SafetyProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
