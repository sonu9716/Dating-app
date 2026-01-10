import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    Platform,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { matchAPI } from '../utils/api';

const { width } = Dimensions.get('window');

export default function UserProfileScreen({ route, navigation }) {
    const { userId, matchId } = route.params;
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, [userId, matchId]);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await matchAPI.getMatch(matchId);
            if (response.data.success) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
                    style={StyleSheet.absoluteFill}
                />
                <ActivityIndicator size="large" color={COLORS.neonPink} />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#FFF' }}>User not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
                {/* Header */}
                <View style={styles.header}>
                    <BlurView tint="light" intensity={20} style={styles.headerBlur}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color={COLORS.textWhite} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <View style={{ width: 40 }} />
                    </BlurView>
                </View>

                {/* Profile Content */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100)} style={styles.imageContainer}>
                        <Image
                            source={{ uri: user.avatar || 'https://via.placeholder.com/400' }}
                            style={styles.mainImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.imageGradient}
                        />
                        <View style={styles.infoOverlay}>
                            <Text style={styles.name}>{user.name}, {user.age || '22'}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-sharp" size={16} color={COLORS.modernTeal} />
                                <Text style={styles.locationText}>{user.location || 'San Francisco'}</Text>
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bioText}>
                            {user.bio || "No bio provided."}
                        </Text>
                    </Animated.View>

                    {user.interests && user.interests.length > 0 && (
                        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                            <Text style={styles.sectionTitle}>Interests</Text>
                            <View style={styles.interestsGrid}>
                                {user.interests.map((interest, index) => (
                                    <View key={index} style={styles.interestTag}>
                                        <Text style={styles.interestText}>{interest}</Text>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {user.photos && user.photos.length > 1 && (
                        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                            <Text style={styles.sectionTitle}>Photos</Text>
                            <View style={styles.photosGrid}>
                                {user.photos.slice(1).map((photo, index) => (
                                    <Image key={index} source={{ uri: photo }} style={styles.gridImage} />
                                ))}
                            </View>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>

            {/* Action Bar */}
            <BlurView tint="dark" intensity={80} style={styles.actionBar}>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => navigation.navigate('ChatDetail', { match: user })}
                >
                    <LinearGradient
                        colors={GRADIENTS.primary}
                        style={styles.chatGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="chatbubble" size={20} color="#FFF" />
                        <Text style={styles.chatButtonText}>Message {user.name.split(' ')[0]}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 44 : 0,
        zIndex: 100,
    },
    headerBlur: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING[4],
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textWhite,
    },
    content: {
        paddingBottom: 100,
    },
    imageContainer: {
        width: width,
        height: width * 1.2,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    infoOverlay: {
        position: 'absolute',
        bottom: SPACING[6],
        left: SPACING[6],
    },
    name: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -1,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    locationText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: SPACING[6],
        marginTop: SPACING[8],
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textWhite,
        marginBottom: SPACING[4],
    },
    bioText: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.textSecondary,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    interestTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255, 46, 151, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 46, 151, 0.2)',
    },
    interestText: {
        color: COLORS.neonPink,
        fontSize: 14,
        fontWeight: '600',
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    gridImage: {
        width: (width - SPACING[6] * 2 - 8) / 2,
        height: 200,
        borderRadius: RADIUS.lg,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === 'ios' ? 34 : SPACING[6],
        paddingTop: SPACING[4],
        paddingHorizontal: SPACING[6],
    },
    chatButton: {
        height: 56,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
    },
    chatGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    chatButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
