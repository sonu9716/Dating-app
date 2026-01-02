import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Modal, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function EmergencyConfirmButton({ visible, onConfirm, onCancel }) {
    const [isHolding, setIsHolding] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);

    // Pulse animation when visible
    useEffect(() => {
        if (visible && !isHolding) {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
            return () => animation.stop();
        }
    }, [visible, isHolding, pulseAnim]);

    // Handle countdown
    useEffect(() => {
        if (isHolding) {
            if (countdown <= 0) {
                handleTrigger();
                return;
            }

            timerRef.current = setTimeout(() => {
                setCountdown(prev => prev - 1);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }, 1000);

            Animated.timing(progressAnim, {
                toValue: (5 - (countdown - 1)) / 5,
                duration: 1000,
                useNativeDriver: false,
            }).start();

            return () => clearTimeout(timerRef.current);
        } else {
            setCountdown(5);
            progressAnim.setValue(0);
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [isHolding, countdown]);

    const handleTrigger = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onConfirm();
        setIsHolding(false);
    };

    const handlePressIn = () => {
        setIsHolding(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const handlePressOut = () => {
        if (isHolding && countdown > 0) {
            setIsHolding(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onCancel}
                    style={styles.dismissOverlay}
                />

                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.emergencyIcon}>
                            <MaterialIcons name="emergency-share" size={32} color="#FF4B2B" />
                        </View>
                        <Text style={styles.title}>Emergency Confirmation</Text>
                        <Text style={styles.subtitle}>
                            Hold the button for 5 seconds to alert your emergency contacts and share your location.
                        </Text>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], opacity: isHolding ? 0 : 0.4 }]} />

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={styles.mainButton}
                        >
                            <LinearGradient
                                colors={['#FF4B2B', '#FF416C']}
                                style={styles.gradient}
                            >
                                <MaterialIcons name="sos" size={60} color="#FFF" />
                                {isHolding && (
                                    <Text style={styles.countdownText}>{countdown}</Text>
                                )}
                            </LinearGradient>

                            {isHolding && (
                                <View style={styles.progressContainer}>
                                    <Animated.View
                                        style={[
                                            styles.progressBar,
                                            {
                                                width: progressAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%']
                                                })
                                            }
                                        ]}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dismissOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: width * 0.85,
        backgroundColor: 'rgba(30, 30, 40, 0.95)',
        borderRadius: RADIUS.xxl,
        padding: SPACING[6],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 75, 43, 0.3)',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING[8],
    },
    emergencyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 75, 43, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING[4],
    },
    title: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: SPACING[3],
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: SPACING[2],
    },
    buttonWrapper: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING[8],
    },
    pulseCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FF4B2B',
    },
    mainButton: {
        width: 130,
        height: 130,
        borderRadius: 65,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#FF416C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownText: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: '900',
        position: 'absolute',
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFF',
    },
    cancelButton: {
        paddingVertical: SPACING[2],
        paddingHorizontal: SPACING[6],
    },
    cancelText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: '600',
    },
});
