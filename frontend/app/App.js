import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { SafetyProvider } from '../context/SafetyContext';
import RootNavigator from './navigation/RootNavigator';
import * as Notifications from 'expo-notifications';
import { configureNotifications } from '../utils/notificationHelper';
import { navigationRef } from './navigation/navigationRef';

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
      const data = response.notification.request.content.data;
      console.log('👆 Notification Tapped:', data);

      if (data && data.matchId) {
        // Navigate to Chat detailing
        // We use navigate on the ref to ensure it works even if not in a component
        if (navigationRef.isReady()) {
          // Navigate to ChatTab, then inside it, navigation to ChatDetail
          navigationRef.navigate('ChatTab', {
            screen: 'ChatDetail',
            params: { match: { matchId: String(data.matchId) } }
          });
        }
      } else if (data && data.type === 'MATCH') {
        // If it's a new match alert, go to the chat list
        if (navigationRef.isReady()) {
          navigationRef.navigate('ChatTab', { screen: 'ChatList' });
        }
      }
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
            <NavigationContainer ref={navigationRef}>
              <RootNavigator />
            </NavigationContainer>
          </ChatProvider>
        </SafetyProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
