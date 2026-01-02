import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function DiscoveryHeader({ onSettings, onFilter }) {
    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.left}>
                    <TouchableOpacity onPress={onSettings} style={styles.iconButton}>
                        <Ionicons name="settings-outline" size={22} color={COLORS.textWhite} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Discover</Text>
                </View>

                <TouchableOpacity onPress={onFilter} style={styles.filterButton}>
                    <BlurView tint="light" intensity={20} style={styles.blurIcon}>
                        <Ionicons name="options-outline" size={20} color={COLORS.modernTeal} />
                        <View style={styles.dot} />
                    </BlurView>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 44 : 20,
        zIndex: 10,
    },
    inner: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING[6],
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[3],
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textWhite,
        letterSpacing: -0.5,
    },
    filterButton: {
        overflow: 'hidden',
        borderRadius: 12,
    },
    blurIcon: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(6, 182, 212, 0.2)',
    },
    dot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.modernTeal,
        borderWidth: 1.5,
        borderColor: COLORS.bgDark,
    }
});
