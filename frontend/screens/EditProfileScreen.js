import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, GRADIENTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const FormInput = ({ label, value, onChangeText, placeholder, multiline, keyboardType, delay = 0 }) => (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
                style={[styles.input, multiline && styles.textArea]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline={multiline}
                keyboardType={keyboardType}
                textAlignVertical={multiline ? 'top' : 'center'}
                autoCapitalize="sentences"
            />
        </View>
    </Animated.View>
);

export default function EditProfileScreen({ navigation }) {
    const { state, updateProfile } = useAuth();
    const user = state.user;

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        age: user?.age?.toString() || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName) {
            Alert.alert('Error', 'First and last name are required');
            return;
        }

        setIsLoading(true);
        try {
            // Include 'name' for backend compatibility and all other fields
            const result = await updateProfile({
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                age: parseInt(formData.age, 10)
            });
            if (result.success) {
                Alert.alert('Success', 'Profile updated correctly');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Update failed');
            }
        } catch (err) {
            Alert.alert('Error', 'An unexpected error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
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
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave} disabled={isLoading} style={styles.saveButtonHeader}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={COLORS.modernTeal} />
                        ) : (
                            <Text style={styles.saveTextHeader}>Save</Text>
                        )}
                    </TouchableOpacity>
                </BlurView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <FormInput
                        label="First Name"
                        value={formData.firstName}
                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                        placeholder="Your first name"
                        delay={100}
                    />

                    <FormInput
                        label="Last Name"
                        value={formData.lastName}
                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                        placeholder="Your last name"
                        delay={150}
                    />

                    <FormInput
                        label="Age"
                        value={formData.age}
                        onChangeText={(text) => setFormData({ ...formData, age: text.replace(/[^0-9]/g, '') })}
                        placeholder="Your age"
                        keyboardType="numeric"
                        delay={200}
                    />

                    <FormInput
                        label="Location"
                        value={formData.location}
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                        placeholder="e.g. New York, NY"
                        delay={250}
                    />

                    <FormInput
                        label="Bio"
                        value={formData.bio}
                        onChangeText={(text) => setFormData({ ...formData, bio: text })}
                        placeholder="Tell us about yourself..."
                        multiline
                        delay={300}
                    />

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isLoading}
                        style={styles.saveButton}
                    >
                        {isLoading ? (
                            <View style={[styles.gradientButton, { backgroundColor: COLORS.bgDarkSecondary }]}>
                                <ActivityIndicator color="#FFF" />
                            </View>
                        ) : (
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.saveButtonText}>Apply Changes</Text>
                            </LinearGradient>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
    saveButtonHeader: {
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[2],
    },
    saveTextHeader: {
        color: COLORS.modernTeal,
        fontWeight: '700',
        fontSize: 16,
    },
    scrollContent: {
        padding: SPACING[6],
        paddingBottom: 40,
    },
    inputContainer: {
        marginBottom: SPACING[6],
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING[2],
        marginLeft: SPACING[2],
    },
    inputWrapper: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    input: {
        padding: SPACING[4],
        fontSize: 16,
        color: COLORS.textWhite,
    },
    textArea: {
        minHeight: 120,
        paddingTop: SPACING[4],
    },
    saveButton: {
        marginTop: SPACING[4],
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        height: 56,
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    }
});
