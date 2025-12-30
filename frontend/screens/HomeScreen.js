/**
 * Home Screen
 * Main swiping cards interface
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../utils/theme';
import { swipeAPI } from '../utils/api';
import ProfileCard from '../components/ProfileCard';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';

export default function HomeScreen() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      // Fetch profiles from API
      setProfiles([
        {
          id: 1,
          name: 'Sarah',
          age: 26,
          image: 'https://via.placeholder.com/400x500',
          bio: 'Love hiking and coffee',
        },
        {
          id: 2,
          name: 'Emma',
          age: 24,
          image: 'https://via.placeholder.com/400x500',
          bio: 'Artist and yoga enthusiast',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const userId = profiles[currentIndex].id;
      await swipeAPI.like(userId);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handlePass = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSuperLike = async () => {
    try {
      const userId = profiles[currentIndex].id;
      await swipeAPI.superLike(userId);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Super like error:', error);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.bgPrimary,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.bgPrimary,
          paddingHorizontal: SPACING,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: COLORS.textPrimary,
            marginBottom: SPACING,
          }}
        >
          No more profiles
        </Text>
        <Text style={{ color: COLORS.textSecondary, marginBottom: SPACING }}>
          Come back later for more matches
        </Text>
        <TouchableOpacity
          onPress={() => setCurrentIndex(0)}
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: SPACING,
            paddingVertical: SPACING,
            borderRadius: RADIUS.md,
          }}
        >
          <Text style={{ color: COLORS.bgPrimary, fontWeight: '600' }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}>
      <Header title="Discover" />

      <View style={{ flex: 1, paddingHorizontal: SPACING }}>
        <ProfileCard profile={currentProfile} />
      </View>

      <ActionButtons
        onLike={handleLike}
        onPass={handlePass}
        onSuperLike={handleSuperLike}
      />
    </View>
  );
}
