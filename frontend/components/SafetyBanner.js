import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafety } from '../context/SafetyContext';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function SafetyBanner({ onReportPress, onGetHelpPress }) {
    const { liveSession } = useSafety();
    const [elapsedTime, setElapsedTime] = useState('0:00');
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Calculate elapsed time
    useEffect(() => {
        if (!liveSession) return;

        const interval = setInterval(() => {
            const start = new Date(liveSession.start_time);
            const now = new Date();
            const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
            const hrs = Math.floor(diff / 3600);
            const mins = Math.floor((diff % 3600) / 60);
            const secs = diff % 60;

            const timeStr = hrs > 0
                ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                : `${mins}:${secs.toString().padStart(2, '0')}`;

            setElapsedTime(timeStr);
        }, 1000);

        return () => clearInterval(interval);
    }, [liveSession]);

    // Pulse animation for the shield icon
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulseAnim]);

    if (!liveSession) return null;

    return (
        <Animated.View style={styles.container}>
            <BlurView tint="dark" intensity={50} style={styles.blurBackground}>
                <LinearGradient
                    colors={['rgba(27, 138, 123, 0.2)', 'rgba(45, 155, 110, 0.2)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />

                <View style={styles.leftSection}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="security" size={20} color={COLORS.modernTeal} />
                        </View>
                    </Animated.View>
                    <View style={styles.textSection}>
                        <Text style={styles.mainText}>Date Protected</Text>
                        <Text style={styles.subText}>{elapsedTime} elapsed</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={styles.issueButton}
                        onPress={onReportPress}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="report-problem" size={16} color={COLORS.neonYellow || '#E8A837'} />
                        <Text style={styles.buttonText}>Issue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.helpButton}
                        onPress={onGetHelpPress}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['#FF4B2B', '#FF416C']}
                            style={styles.helpGradient}
                        >
                            <MaterialIcons name="emergency" size={16} color="#FFF" />
                            <Text style={styles.helpButtonText}>Get Help</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: SPACING[4],
        marginTop: SPACING[2],
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(27, 138, 123, 0.3)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    blurBackground: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[3],
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(27, 138, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSection: {
        justifyContent: 'center',
    },
    mainText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    subText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        marginTop: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[2],
    },
    issueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: RADIUS.md,
        backgroundColor: 'rgba(232, 168, 55, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(232, 168, 55, 0.3)',
    },
    buttonText: {
        color: '#E8A837',
        fontSize: 12,
        fontWeight: '600',
    },
    helpButton: {
        borderRadius: RADIUS.md,
        overflow: 'hidden',
    },
    helpGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    helpButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
});
