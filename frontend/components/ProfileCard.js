import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function ProfileCard({ profile }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.image];

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={handleNextPhoto} style={styles.photoPressable}>
        <Image
          source={{ uri: photos[currentPhotoIndex] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Photo Indicators */}
        <View style={styles.indicatorsContainer}>
          {photos.length > 1 && photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: index === currentPhotoIndex ? COLORS.textWhite : 'rgba(255, 255, 255, 0.3)' }
              ]}
            />
          ))}
        </View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {/* Profile Info Overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            {profile.isVerified && (
              <View style={styles.verifyBadge}>
                <Ionicons name="checkmark-sharp" size={12} color="#FFF" />
              </View>
            )}
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={COLORS.modernTeal} />
            <Text style={styles.distance}>{profile.distance || 'Near'} km away</Text>
          </View>

          <Text style={styles.bio} numberOfLines={2}>
            {profile.bio}
          </Text>

          <View style={styles.interestsRow}>
            {profile.interests && profile.interests.slice(0, 3).map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    aspectRatio: 0.75, // Matches the 3/4 aspect ratio from design
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.bgDarkSecondary,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  photoPressable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorsContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
  },
  indicator: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING[6],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  verifyBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.modernTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    opacity: 0.9,
  },
  distance: {
    fontSize: 14,
    color: COLORS.textWhite,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  interestText: {
    fontSize: 12,
    color: COLORS.modernTeal,
    fontWeight: '600',
  },
});
