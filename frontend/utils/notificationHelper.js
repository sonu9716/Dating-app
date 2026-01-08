import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

/**
 * Register for push notifications
 * Returns the Expo Push Token or null
 */
export async function registerForPushNotificationsAsync() {
    try {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF233171',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permission Required', 'Notification permissions were NOT granted. Please enable them in settings.');
                return null;
            }

            token = (await Notifications.getExpoPushTokenAsync({
                projectId: 'a9a9455f-c8de-4683-8f9f-8880a9850f21',
            })).data;

            console.log('Push Token Generated:', token);
            // Alert.alert('Token Generated', 'Your device is ready for notifications!');
        } else {
            console.log('Push notifications require a physical device');
        }

        return token;
    } catch (error) {
        Alert.alert('Push Error', error.message);
        console.error('Push Registration Error:', error);
        return null;
    }
}

/**
 * Configure notification behavior
 */
export function configureNotifications() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}
