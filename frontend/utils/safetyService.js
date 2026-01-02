import api from './api';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// EMERGENCY CONTACTS
export const getEmergencyContacts = () => api.get('/safety/contacts');
export const addEmergencyContact = (contact) => api.post('/safety/contacts', contact);
export const deleteEmergencyContact = (id) => api.delete(`/safety/contacts/${id}`);

// LIVE DATE SESSIONS
export const startLiveDateSession = (sessionData) => api.post('/safety/session/start', sessionData);
export const endLiveDateSession = (sessionId) => api.post('/safety/session/end', { sessionId });
export const checkInLiveSession = (sessionId) => api.post('/safety/session/checkin', { sessionId });

// EMERGENCY HELP
export const triggerEmergencyHelp = async (sessionId, contactsToNotify) => {
    // Get current location
    let locationData = { lat: 0, lng: 0 };
    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        locationData = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        };
    } catch (err) {
        console.warn('Could not get location for emergency:', err);
    }

    const response = await api.post('/safety/emergency/trigger', {
        sessionId,
        lastKnownLocation: locationData,
        contactsToNotify: contactsToNotify.map((c) => ({
            id: c.id,
            phone: c.phone,
            name: c.name,
        })),
    });

    return response.data;
};

// SAFETY PREFERENCES
export const getSafetyPreferences = () => api.get('/safety/preferences');
export const updateSafetyPreferences = (prefs) => api.put('/safety/preferences', prefs);

// BACKGROUND LOCATION TRACKING
let locationWatcher = null;

export const startBackgroundLocationTracking = async (sessionId) => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.status !== 'granted') {
        console.warn('Foreground location permission denied');
        return;
    }

    // watchPositionAsync is more suitable for app-is-open tracking
    // For true background, taskManager would be needed, but let's start with foreground-background
    locationWatcher = await Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 30000, // Every 30 seconds
            distanceInterval: 100, // Or every 100 meters
        },
        async (location) => {
            try {
                // We'd add a specialized endpoint for location updates if needed,
                // but for now we'll just log it or send to a general update endpoint
                console.log('Location update for session:', sessionId, location.coords);
            } catch (err) {
                console.error('Failed to update location:', err);
            }
        }
    );
};

export const stopBackgroundLocationTracking = () => {
    if (locationWatcher) {
        locationWatcher.remove();
        locationWatcher = null;
    }
};
