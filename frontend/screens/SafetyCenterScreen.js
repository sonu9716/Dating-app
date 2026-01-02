import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image, TextInput, Alert, Platform, Modal } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafety } from '../context/SafetyContext';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function SafetyCenterScreen({ navigation }) {
    const { emergencyContacts, preferences, addEmergencyContact, removeEmergencyContact, updatePreferences, loading } = useSafety();
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: 'Friend' });

    const handleAddContact = async () => {
        if (!newContact.name || !newContact.phone) {
            Alert.alert('Error', 'Please enter name and phone number');
            return;
        }

        try {
            await addEmergencyContact(newContact);
            setShowAddContact(false);
            setNewContact({ name: '', phone: '', relationship: 'Friend' });
        } catch (err) {
            Alert.alert('Error', 'Failed to add contact');
        }
    };

    const handleTogglePreference = (key) => {
        updatePreferences({ ...preferences, [key]: !preferences[key] });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.bgDark, '#0A0A0F']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Safety Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <LinearGradient
                    colors={['rgba(27, 138, 123, 0.8)', 'rgba(45, 155, 110, 0.6)']}
                    style={styles.heroBanner}
                >
                    <MaterialIcons name="security" size={40} color="#FFF" />
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroTitle}>Your Safety, Our Priority</Text>
                        <Text style={styles.heroSubtitle}>Date with confidence knowing your safety network is always with you.</Text>
                    </View>
                </LinearGradient>

                {/* Emergency Contacts Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                        <Text style={styles.sectionLimit}>{emergencyContacts.length}/3</Text>
                    </View>

                    {emergencyContacts.map(contact => (
                        <BlurView key={contact.id} intensity={10} tint="light" style={styles.contactCard}>
                            <View style={styles.contactInfo}>
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarInitial}>{contact.name[0]}</Text>
                                </View>
                                <View>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                                    <View style={styles.relationshipBadge}>
                                        <Text style={styles.relationshipText}>{contact.relationship}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => removeEmergencyContact(contact.id)}
                                style={styles.removeButton}
                            >
                                <Ionicons name="trash-outline" size={20} color="#FF4B2B" />
                            </TouchableOpacity>
                        </BlurView>
                    ))}

                    {emergencyContacts.length < 3 && (
                        <TouchableOpacity
                            style={styles.addContactButton}
                            onPress={() => setShowAddContact(true)}
                        >
                            <MaterialIcons name="add" size={24} color={COLORS.modernTeal} />
                            <Text style={styles.addContactText}>Add Emergency Contact</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Safety Preferences</Text>

                    <PreferenceToggle
                        label="Location Sharing"
                        sublabel="Share real-time location during dates"
                        isActive={preferences.allow_location_sharing}
                        onToggle={() => handleTogglePreference('allow_location_sharing')}
                        icon="location-on"
                    />

                    <PreferenceToggle
                        label="Check-in Reminders"
                        sublabel="Get prompts during active date sessions"
                        isActive={preferences.enable_check_in_reminders}
                        onToggle={() => handleTogglePreference('enable_check_in_reminders')}
                        icon="notifications-active"
                    />

                    <PreferenceToggle
                        label="Notify via SMS"
                        sublabel="Alert contacts via SMS in emergencies"
                        isActive={preferences.notify_via_sms}
                        onToggle={() => handleTogglePreference('notify_via_sms')}
                        icon="sms"
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Add Contact Modal Flow (Simplified for brevity) */}
            {showAddContact && (
                <Modal
                    visible={showAddContact}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <BlurView intensity={90} tint="dark" style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Emergency Contact</Text>

                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                style={styles.input}
                                value={newContact.name}
                                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                            />

                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                style={styles.input}
                                keyboardType="phone-pad"
                                value={newContact.phone}
                                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                            />

                            <View style={styles.relationshipContainer}>
                                {['Friend', 'Family', 'Partner'].map(rel => (
                                    <TouchableOpacity
                                        key={rel}
                                        style={[styles.relOption, newContact.relationship === rel && styles.relOptionActive]}
                                        onPress={() => setNewContact({ ...newContact, relationship: rel })}
                                    >
                                        <Text style={[styles.relText, newContact.relationship === rel && styles.relTextActive]}>{rel}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={() => setShowAddContact(false)} style={styles.cancelBtn}>
                                    <Text style={styles.cancelBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleAddContact} style={styles.confirmBtn}>
                                    <Text style={styles.confirmBtnText}>Add Contact</Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    </View>
                </Modal>
            )}
        </View>
    );
}

function PreferenceToggle({ label, sublabel, isActive, onToggle, icon }) {
    return (
        <TouchableOpacity style={styles.prefItem} onPress={onToggle} activeOpacity={0.8}>
            <View style={styles.prefLeft}>
                <View style={styles.prefIconContainer}>
                    <MaterialIcons name={icon} size={22} color={COLORS.modernTeal} />
                </View>
                <View>
                    <Text style={styles.prefLabel}>{label}</Text>
                    <Text style={styles.prefSublabel}>{sublabel}</Text>
                </View>
            </View>
            <View style={[styles.toggleContainer, isActive && styles.toggleActive]}>
                <View style={[styles.toggleCircle, isActive && styles.toggleCircleActive]} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: SPACING[4],
        paddingBottom: SPACING[4],
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scrollContent: {
        padding: SPACING[4],
    },
    heroBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING[6],
        borderRadius: RADIUS.xxl,
        marginBottom: SPACING[8],
    },
    heroTextContainer: {
        marginLeft: SPACING[4],
        flex: 1,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 4,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        lineHeight: 18,
    },
    section: {
        marginBottom: SPACING[8],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING[4],
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    sectionLimit: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING[4],
        borderRadius: RADIUS.xl,
        marginBottom: SPACING[3],
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[4],
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(27, 138, 123, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: COLORS.modernTeal,
        fontSize: 20,
        fontWeight: '700',
    },
    contactName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    contactPhone: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        marginTop: 2,
    },
    relationshipBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(27, 138, 123, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
    },
    relationshipText: {
        color: COLORS.modernTeal,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    removeButton: {
        padding: 8,
    },
    addContactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING[4],
        borderRadius: RADIUS.xl,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(27, 138, 123, 0.3)',
        gap: 8,
        marginTop: SPACING[2],
    },
    addContactText: {
        color: COLORS.modernTeal,
        fontSize: 15,
        fontWeight: '700',
    },
    prefItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING[4],
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    prefLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[4],
        flex: 1,
    },
    prefIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    prefLabel: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    prefSublabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 2,
    },
    toggleContainer: {
        width: 48,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleActive: {
        backgroundColor: COLORS.modernTeal,
    },
    toggleCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FFF',
    },
    toggleCircleActive: {
        alignSelf: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        padding: SPACING[6],
        borderTopLeftRadius: RADIUS.xxl,
        borderTopRightRadius: RADIUS.xxl,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: SPACING[6],
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: RADIUS.xl,
        padding: SPACING[4],
        color: '#FFF',
        fontSize: 16,
        marginBottom: SPACING[4],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    relationshipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING[8],
    },
    relOption: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: RADIUS.lg,
        marginHorizontal: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    relOptionActive: {
        backgroundColor: 'rgba(27, 138, 123, 0.2)',
        borderColor: COLORS.modernTeal,
    },
    relText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '600',
    },
    relTextActive: {
        color: COLORS.modernTeal,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING[4],
    },
    cancelBtn: {
        flex: 1,
        padding: SPACING[4],
        alignItems: 'center',
        borderRadius: RADIUS.xl,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    cancelBtnText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '700',
    },
    confirmBtn: {
        flex: 2,
        padding: SPACING[4],
        alignItems: 'center',
        borderRadius: RADIUS.xl,
        backgroundColor: COLORS.modernTeal,
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
