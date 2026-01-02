import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Image,
    Alert,
    Dimensions,
    StyleSheet,
    StatusBar,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';

import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - SPACING[6] * 2 - SPACING[4] * 2) / 3;

export default function PhotosScreen({ navigation }) {
    const { state, refreshProfile } = useAuth();
    const user = state.user;

    // Use photos from user profile, ensuring we have 6 slots
    const photos = Array(6).fill(null).map((_, i) => {
        const photoUrl = user?.photos && user.photos[i] ? user.photos[i] : null;
        return {
            id: i,
            url: photoUrl,
            isPrimary: i === 0
        };
    });

    const handleAddPhoto = async (index) => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your gallery to upload photos.');
            return;
        }

        // Pick image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (result.canceled) return;

        const asset = result.assets[0];

        // Prepare FormData
        const formData = new FormData();
        const uriParts = asset.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('photo', {
            uri: asset.uri,
            name: `photo-${Date.now()}.${fileType}`,
            type: `image/${fileType}`,
        });

        try {
            await userAPI.uploadPhoto(formData);
            if (refreshProfile) await refreshProfile();
            Alert.alert('Success', 'Photo uploaded successfully!');
        } catch (err) {
            console.error('Upload photo error:', err);
            Alert.alert('Error', 'Failed to upload photo. Please try again.');
        }
    };

    const handleDeletePhoto = async (url) => {
        try {
            await userAPI.deletePhoto(url);
            if (refreshProfile) await refreshProfile();
        } catch (err) {
            console.error('Delete photo error:', err);
            Alert.alert('Error', 'Failed to delete photo.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <BlurView tint="light" intensity={20} style={styles.headerBlur}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Photos</Text>
                    <View style={{ width: 40 }} />
                </BlurView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View entering={FadeInDown.delay(100)}>
                    <Text style={styles.description}>
                        Showcase your best self. Add at least 2 photos to increase your match rate.
                    </Text>
                </Animated.View>

                <View style={styles.photoGrid}>
                    {photos.map((photo, index) => (
                        <Animated.View
                            entering={FadeInDown.delay(200 + index * 50)}
                            key={photo.id}
                            style={[styles.photoCard, { width: GRID_SIZE, height: GRID_SIZE * 1.35 }]}
                        >
                            {photo.url ? (
                                <>
                                    <Image
                                        source={{ uri: photo.url }}
                                        style={styles.photoImage}
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                                        style={styles.photoGradient}
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleDeletePhoto(photo.url)}
                                        style={styles.deleteButton}
                                    >
                                        <BlurView tint="dark" intensity={50} style={styles.deleteBlur}>
                                            <Ionicons name="close" size={16} color={COLORS.textWhite} />
                                        </BlurView>
                                    </TouchableOpacity>
                                    {photo.isPrimary && (
                                        <View style={styles.primaryBadge}>
                                            <Text style={styles.primaryBadgeText}>DISPLAY</Text>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => handleAddPhoto(index)}
                                    style={styles.addButton}
                                >
                                    <View style={styles.addButtonCircle}>
                                        <Ionicons name="add" size={24} color={COLORS.bgDark} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInDown.delay(600)} style={styles.tipsContainer}>
                    <Ionicons name="bulb" size={20} color={COLORS.neonPink} />
                    <View style={styles.tipTextContent}>
                        <Text style={styles.tipTitle}>Photo Tip</Text>
                        <Text style={styles.tipDescription}>High-quality, eye-contact photos get 3x more matches!</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 44 : 0,
        zIndex: 10,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textWhite,
    },
    scrollContent: {
        padding: SPACING[6],
        paddingBottom: 40,
    },
    description: {
        fontSize: 14,
        color: COLORS.textTertiary,
        marginBottom: SPACING[8],
        lineHeight: 20,
        fontWeight: '500',
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING[4],
    },
    photoCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    photoGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
    deleteBlur: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    primaryBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: COLORS.modernTeal,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    primaryBadgeText: {
        fontSize: 8,
        fontWeight: '900',
        color: COLORS.bgDark,
    },
    addButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.neonPink,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.neonPink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    tipsContainer: {
        marginTop: SPACING[10],
        backgroundColor: 'rgba(255,46,151,0.05)',
        borderRadius: RADIUS.xl,
        padding: SPACING[4],
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[4],
        borderWidth: 1,
        borderColor: 'rgba(255,46,151,0.1)',
    },
    tipTextContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.neonPink,
        marginBottom: 2,
    },
    tipDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    }
});
