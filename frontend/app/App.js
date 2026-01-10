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
  React.useEffect(() =\u003e {
    // Configure how notifications are handled when the app is open
    configureNotifications();

    // Listener for when a notification is received while the app is open
    const notificationListener = Notifications.addNotificationReceivedListener(notification =\u003e {
      console.log('🔔 Foreground Notification:', notification);
    });

    // Listener for when a user taps on a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response =\u003e {
      const data = response.notification.request.content.data;
      console.log('👆 Notification Tapped - Full Response:', JSON.stringify(response, null, 2));
      console.log('👆 Notification Data:', JSON.stringify(data, null, 2));
      console.log('👆 Navigation Ready?', navigationRef.isReady());

      // Add a small delay to ensure navigation is fully mounted
      setTimeout(() =\u003e {
        if(data && data.matchId) {
    console.log('🚀 Navigating to ChatDetail with matchId:', data.matchId);
    // Navigate to Chat detailing
    if(navigationRef.isReady()) {
    try {
      navigationRef.navigate('ChatTab', {
        screen: 'ChatDetail',
        params: { match: { matchId: String(data.matchId) } }
      });
      console.log('✅ Navigation successful');
    } catch (err) {
      console.error('❌ Navigation Error:', err);
    }
  } else {
    console.warn('⚠️ Navigation not ready yet');
  }
} else if (data && data.type === 'MATCH') {
  console.log('🚀 Navigating to ChatList');
  // If it's a new match alert, go to the chat list
  if (navigationRef.isReady()) {
    try {
      navigationRef.navigate('ChatTab', { screen: 'ChatList' });
      console.log('✅ Navigation to ChatList successful');
    } catch (err) {
      console.error('❌ Navigation Error:', err);
    }
  } else {
    console.warn('⚠️ Navigation not ready yet');
  }
} else {
  console.warn('⚠️ No valid navigation data in notification');
}
      }, 500);
    });

return () =\u003e {
  Notifications.removeNotificationSubscription(notificationListener);
  Notifications.removeNotificationSubscription(responseListener);
};
  }, []);

return (
\u003cGestureHandlerRootView style = {{ flex: 1 }}\u003e
\u003cAuthProvider\u003e
\u003cSafetyProvider\u003e
\u003cChatProvider\u003e
\u003cNavigationContainer ref = { navigationRef }\u003e
\u003cRootNavigator /\u003e
\u003c / NavigationContainer\u003e
\u003c / ChatProvider\u003e
\u003c / SafetyProvider\u003e
\u003c / AuthProvider\u003e
\u003c / GestureHandlerRootView\u003e
  );
}
