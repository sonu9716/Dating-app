import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Switch,
    StyleSheet,
    StatusBar,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../utils/theme';

export default function PreferencesScreen({ navigation }) {
    const [preferences, setPreferences] = useState({
        maxDistance: 25,
        ageRange: 35,
        showMen: false,
        showWomen: true,
        showEveryone: false,
        newMatchNotifications: true,
        messageNotifications: true,
    });

    const updatePref = (key, value) => {
        setPreferences({ ...preferences, [key]: value });
    };

    const PreferenceSection = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionCard}>
                {children}
            </View>
        </View>
    );

    const PreferenceItem = ({ label, icon, value, isSwitch, onChange, last }) => (
        <View style={[styles.item, last && { borderBottomWidth: 0 }]}>
            <View style={styles.itemLeft}>
                <View style={styles.iconWrapper}>
                    <Ionicons name={icon} size={20} color={COLORS.modernTeal} />
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.modernTeal }}
                thumbColor={Platform.OS === 'ios' ? '#FFF' : value ? COLORS.modernTeal : '#f4f3f4'}
            />
        </View>
    );

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
                    <Text style={styles.headerTitle}>Preferences</Text>
                    <View style={{ width: 40 }} />
                </BlurView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View entering={FadeInDown.delay(100)}>
                    <PreferenceSection title="Discovery Settings">
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderHeader}>
                                <Text style={styles.sliderLabel}>Maximum Distance</Text>
                                <Text style={styles.sliderValue}>{preferences.maxDistance} km</Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={2}
                                maximumValue={100}
                                step={1}
                                value={preferences.maxDistance}
                                onValueChange={(val) => updatePref('maxDistance', val)}
                                minimumTrackTintColor={COLORS.modernTeal}
                                maximumTrackTintColor="rgba(255,255,255,0.1)"
                                thumbTintColor={COLORS.modernTeal}
                            />
                        </View>
                        <View style={[styles.sliderContainer, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                            <View style={styles.sliderHeader}>
                                <Text style={styles.sliderLabel}>Preferred Age</Text>
                                <Text style={styles.sliderValue}>Up to {preferences.ageRange}</Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={18}
                                maximumValue={99}
                                step={1}
                                value={preferences.ageRange}
                                onValueChange={(val) => updatePref('ageRange', val)}
                                minimumTrackTintColor={COLORS.modernTeal}
                                maximumTrackTintColor="rgba(255,255,255,0.1)"
                                thumbTintColor={COLORS.modernTeal}
                            />
                        </View>
                    </PreferenceSection>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                    <PreferenceSection title="Show Me">
                        <PreferenceItem
                            label="Men"
                            icon="male-outline"
                            value={preferences.showMen}
                            onChange={(val) => updatePref('showMen', val)}
                        />
                        <PreferenceItem
                            label="Women"
                            icon="female-outline"
                            value={preferences.showWomen}
                            onChange={(val) => updatePref('showWomen', val)}
                        />
                        <PreferenceItem
                            label="Everyone"
                            icon="people-outline"
                            value={preferences.showEveryone}
                            onChange={(val) => updatePref('showEveryone', val)}
                            last
                        />
                    </PreferenceSection>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)}>
                    <PreferenceSection title="Notifications">
                        <PreferenceItem
                            label="New Matches"
                            icon="heart-outline"
                            value={preferences.newMatchNotifications}
                            onChange={(val) => updatePref('newMatchNotifications', val)}
                        />
                        <PreferenceItem
                            label="Messages"
                            icon="chatbubble-outline"
                            value={preferences.messageNotifications}
                            onChange={(val) => updatePref('messageNotifications', val)}
                            last
                        />
                    </PreferenceSection>
                </Animated.View>

                <TouchableOpacity style={styles.premiumBanner}>
                    <LinearGradient
                        colors={[COLORS.primaryStart, COLORS.primaryEnd]}
                        style={styles.premiumGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="sparkles" size={24} color="#FFF" />
                        <View style={styles.premiumTextContent}>
                            <Text style={styles.premiumTitle}>Unlock Advanced Filters</Text>
                            <Text style={styles.premiumSubtitle}>Find exactly who you're looking for</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
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
    section: {
        marginBottom: SPACING[8],
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: SPACING[2],
        marginBottom: SPACING[3],
    },
    sectionCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING[4],
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[3],
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.textWhite,
    },
    sliderContainer: {
        padding: SPACING[4],
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING[2],
    },
    sliderLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.textWhite,
    },
    sliderValue: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.modernTeal,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    premiumBanner: {
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        marginTop: SPACING[4],
    },
    premiumGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING[5],
        gap: SPACING[4],
    },
    premiumTextContent: {
        flex: 1,
    },
    premiumTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
    premiumSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    }
});
