import React, { createContext, useReducer, useContext, useCallback, useEffect } from 'react';
import * as safetyService from '../utils/safetyService';
import { useAuth } from './AuthContext';

const SafetyContext = createContext();

const initialState = {
    emergencyContacts: [],
    liveSession: null,
    preferences: {
        allow_location_sharing: true,
        enable_check_in_reminders: true,
        notify_via_sms: true,
        notify_via_push: true,
        check_in_frequency: 30
    },
    isEmergencyActive: false,
    loading: false,
    error: null,
};

function safetyReducer(state, action) {
    switch (action.type) {
        case 'SET_CONTACTS':
            return { ...state, emergencyContacts: action.payload };
        case 'ADD_CONTACT':
            return { ...state, emergencyContacts: [...state.emergencyContacts, action.payload] };
        case 'REMOVE_CONTACT':
            return {
                ...state,
                emergencyContacts: state.emergencyContacts.filter((c) => c.id !== action.payload),
            };
        case 'START_SESSION':
            return { ...state, liveSession: action.payload };
        case 'END_SESSION':
            return { ...state, liveSession: null };
        case 'TRIGGER_EMERGENCY':
            return {
                ...state,
                isEmergencyActive: true,
                liveSession: state.liveSession
                    ? { ...state.liveSession, emergency_activated: true, emergency_activated_at: new Date() }
                    : null,
            };
        case 'SET_PREFERENCES':
            return { ...state, preferences: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

export function SafetyProvider({ children }) {
    const [state, dispatch] = useReducer(safetyReducer, initialState);
    const { user } = useAuth();

    const loadSafetyData = useCallback(async () => {
        if (!user) return;
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const [contactsResponse, prefsResponse] = await Promise.all([
                safetyService.getEmergencyContacts(),
                safetyService.getSafetyPreferences(),
            ]);
            dispatch({ type: 'SET_CONTACTS', payload: contactsResponse.data });
            dispatch({ type: 'SET_PREFERENCES', payload: prefsResponse.data });
        } catch (err) {
            console.error('loadSafetyData error:', err);
            dispatch({ type: 'SET_ERROR', payload: err.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadSafetyData();
        }
    }, [user, loadSafetyData]);

    const addEmergencyContact = async (contactData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await safetyService.addEmergencyContact(contactData);
            dispatch({ type: 'ADD_CONTACT', payload: response.data });
            return response.data;
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const removeEmergencyContact = async (id) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await safetyService.deleteEmergencyContact(id);
            dispatch({ type: 'REMOVE_CONTACT', payload: id });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const startLiveSession = async (matchData, duration) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await safetyService.startLiveDateSession({
                matchId: matchData.id,
                matchName: `${matchData.first_name} ${matchData.last_name || ''}`,
                matchAvatar: matchData.photos?.[0],
                duration,
                location: {} // Optional location data
            });
            dispatch({ type: 'START_SESSION', payload: response.data });
            safetyService.startBackgroundLocationTracking(response.data.id);
            return response.data;
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const endLiveSession = async () => {
        if (!state.liveSession) return;
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await safetyService.endLiveDateSession(state.liveSession.id);
            safetyService.stopBackgroundLocationTracking();
            dispatch({ type: 'END_SESSION' });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const triggerEmergency = async () => {
        if (!state.liveSession) throw new Error('No active session');
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await safetyService.triggerEmergencyHelp(state.liveSession.id, state.emergencyContacts);
            dispatch({ type: 'TRIGGER_EMERGENCY' });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updatePreferences = async (newPrefs) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await safetyService.updateSafetyPreferences(newPrefs);
            dispatch({ type: 'SET_PREFERENCES', payload: response.data });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <SafetyContext.Provider
            value={{
                ...state,
                addEmergencyContact,
                removeEmergencyContact,
                startLiveSession,
                endLiveSession,
                triggerEmergency,
                updatePreferences,
                refreshSafetyData: loadSafetyData
            }}
        >
            {children}
        </SafetyContext.Provider>
    );
}

export function useSafety() {
    const context = useContext(SafetyContext);
    if (!context) {
        throw new Error('useSafety must be used within a SafetyProvider');
    }
    return context;
}
