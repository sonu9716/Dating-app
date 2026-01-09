import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeIn,
    FadeInDown,
    ZoomIn,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withRepeat,
    withSequence,
    withDelay
} from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function MatchModal({ visible, userAvatar, matchAvatar, matchName, onSendMessage, onKeepSwiping }) {
    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.container}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                <LinearGradient
                    colors={['rgba(255, 46, 151, 0.2)', 'transparent', 'rgba(0, 242, 254, 0.1)']}
                    style={StyleSheet.absoluteFill}
                />

                <Animated.View entering={FadeInDown.delay(200)} style={styles.content}>
                    <Text style={styles.title}>It's a Match!</Text>
                    <Text style={styles.subtitle}>You and {matchName} have liked each other.</Text>

                    <View style={styles.avatarContainer}>
                        <Animated.View entering={ZoomIn.delay(400).springify()} style={[styles.avatarWrapper, styles.userAvatar]}>
                            <Image source={{ uri: userAvatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                        </Animated.View>

                        <Animated.View entering={ZoomIn.delay(600).springify()} style={[styles.avatarWrapper, styles.matchAvatar]}>
                            <Image source={{ uri: matchAvatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                        </Animated.View>

                        <View style={styles.heartContainer}>
                            <Animated.View entering={ZoomIn.delay(800).springify()}>
                                <Ionicons name="heart" size={40} color={COLORS.neonPink} />
                            </Animated.View>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onSendMessage} activeOpacity={0.8} style={styles.mainButton}>
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>Send Message</Text>
                                <Ionicons name="chatbubble" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onKeepSwiping} activeOpacity={0.7} style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '90%',
        alignItems: 'center',
        padding: SPACING[8],
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.textWhite,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
        textShadowColor: 'rgba(255, 46, 151, 0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: SPACING[2],
        marginBottom: SPACING[12],
        fontWeight: '500',
    },
    avatarContainer: {
        flexDirection: 'row',
        height: 180,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING[12],
    },
    avatarWrapper: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#FFF',
        overflow: 'hidden',
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    userAvatar: {
        left: width * 0.15,
        transform: [{ rotate: '-10deg' }],
    },
    matchAvatar: {
        right: width * 0.15,
        transform: [{ rotate: '10deg' }],
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    heartContainer: {
        position: 'absolute',
        backgroundColor: '#FFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: COLORS.neonPink,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonContainer: {
        width: '100%',
        gap: SPACING[4],
    },
    mainButton: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: COLORS.neonPink,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    secondaryButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.8,
    }
});
