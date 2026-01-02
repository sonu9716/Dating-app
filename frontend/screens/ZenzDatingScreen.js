import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../utils/theme';

const { width } = Dimensions.get('window');

const categories = [
    {
        id: 'anonymous',
        title: 'Anonymous Dating',
        description: 'Connect without revealing your identity first',
        icon: 'eye-off-outline',
        gradient: ['#667eea', '#764ba2'],
        badge: 'New'
    },
    {
        id: 'blind',
        title: 'Blind Date',
        description: 'Surprise matches based on personality',
        icon: 'glasses-outline',
        gradient: ['#FF6B6B', '#C44569'],
        popular: true
    },
    {
        id: 'double',
        title: 'Double Date',
        description: 'Bring a friend for double the fun',
        icon: 'people-outline',
        gradient: ['#4ECDC4', '#44A08D']
    },
    {
        id: 'group',
        title: 'Group Date',
        description: 'Meet multiple people at once',
        icon: 'people-circle-outline',
        gradient: ['#F093FB', '#F5576C']
    },
    {
        id: 'speed',
        title: 'Speed Dating',
        description: 'Quick dates, multiple matches',
        icon: 'flash-outline',
        gradient: ['#FFD26F', '#FFA931'],
        badge: 'Hot'
    },
    {
        id: 'events',
        title: 'Matchmaking Events',
        description: 'Join curated in-person events',
        icon: 'map-outline',
        gradient: ['#A8EDEA', '#6DD5ED']
    },
    {
        id: 'exclusive',
        title: 'Exclusive',
        description: 'Premium verified members only',
        icon: 'ribbon-outline',
        gradient: ['#FDC830', '#F37335'],
        badge: 'VIP'
    },
    {
        id: 'distance',
        title: 'Long Distance',
        description: 'Connect across cities and countries',
        icon: 'globe-outline',
        gradient: ['#8EC5FC', '#E0C3FC']
    }
];

export default function ZenzDatingScreen({ navigation }) {
    const handleCategoryPress = (category) => {
        // Navigate to Home tab and pass the mode as a parameter
        navigation.navigate('HomeTab', {
            screen: 'Discovery',
            params: { mode: category.id, title: category.title }
        });
    };

    const handleTakeQuiz = () => {
        // Placeholder for Quiz functionality
        alert('Personality Quiz starting soon! This will help us find your perfect Zenz mode.');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <Ionicons name="sparkles" size={24} color={COLORS.neonPink} />
                        <Text style={styles.title}>Zenz Dating</Text>
                    </View>
                    <Text style={styles.subtitle}>Choose your perfect dating experience</Text>
                </Animated.View>

                <View style={styles.grid}>
                    {categories.map((category, index) => (
                        <Animated.View
                            key={category.id}
                            entering={FadeInUp.delay(300 + index * 100)}
                            style={styles.cardWrapper}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.card}
                                onPress={() => handleCategoryPress(category)}
                            >
                                <BlurView tint="light" intensity={10} style={styles.glassContainer}>
                                    <LinearGradient
                                        colors={category.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.iconContainer}
                                    >
                                        <Ionicons name={category.icon} size={24} color="#FFF" />
                                    </LinearGradient>

                                    <View style={styles.content}>
                                        <View style={styles.titleRow}>
                                            <Text style={styles.cardTitle}>{category.title}</Text>
                                            {category.badge && (
                                                <View style={[styles.badge, { backgroundColor: category.gradient[0] }]}>
                                                    <Text style={styles.badgeText}>{category.badge}</Text>
                                                </View>
                                            )}
                                            {category.popular && (
                                                <View style={styles.popularBadge}>
                                                    <Text style={styles.badgeText}>🔥 Popular</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.cardDescription}>{category.description}</Text>
                                    </View>

                                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                                </BlurView>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Bottom CTA Card */}
                <Animated.View entering={FadeInUp.delay(1200)} style={styles.ctaCardWrapper}>
                    <BlurView tint="light" intensity={20} style={styles.ctaCard}>
                        <Text style={styles.ctaTitle}>Not sure which to choose?</Text>
                        <Text style={styles.ctaSubtitle}>Take our 2-minute quiz to find your perfect style</Text>
                        <TouchableOpacity style={styles.ctaButton} onPress={handleTakeQuiz}>
                            <LinearGradient
                                colors={[COLORS.primaryStart, COLORS.primaryEnd]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaGradient}
                            >
                                <Text style={styles.ctaButtonText}>Take Quiz ✨</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </BlurView>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: SPACING[6],
        paddingBottom: 100,
    },
    header: {
        marginBottom: SPACING[8],
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.textWhite,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textTertiary,
    },
    grid: {
        gap: SPACING[4],
    },
    cardWrapper: {
        width: '100%',
    },
    card: {
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    glassContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING[4],
        gap: SPACING[4],
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textWhite,
    },
    cardDescription: {
        fontSize: 13,
        color: COLORS.textTertiary,
        lineHeight: 18,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    popularBadge: {
        backgroundColor: 'rgba(255, 46, 151, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 46, 151, 0.3)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFF',
        textTransform: 'uppercase',
    },
    ctaCardWrapper: {
        marginTop: SPACING[8],
    },
    ctaCard: {
        borderRadius: RADIUS.xl,
        padding: SPACING[6],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textWhite,
        marginBottom: 4,
    },
    ctaSubtitle: {
        fontSize: 14,
        color: COLORS.textTertiary,
        textAlign: 'center',
        marginBottom: SPACING[6],
    },
    ctaButton: {
        width: '100%',
    },
    ctaGradient: {
        paddingVertical: 14,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
    },
    ctaButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    }
});
