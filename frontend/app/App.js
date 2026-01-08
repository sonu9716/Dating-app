import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { SafetyProvider } from '../context/SafetyContext';
import RootNavigator from './navigation/RootNavigator';
import * as Notifications from 'expo-notifications';
import { configureNotifications } from '../utils/notificationHelper';

export default function App() {
  React.useEffect(() => {
    // Configure how notifications are handled when the app is open
    configureNotifications();

    // Listener for when a notification is received while the app is open
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Foreground Notification:', notification);
    });

    // Listener for when a user taps on a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification Tapped:', response.notification.request.content.data);
      // Logic for deep linking could go here in the future
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

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
