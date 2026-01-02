import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { swipeAPI, userAPI } from '../utils/api';
import ProfileCard from '../components/ProfileCard';
import ActionButtons from '../components/ActionButtons';
import DiscoveryHeader from '../components/DiscoveryHeader';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export default function HomeScreen({ route, navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const zenzMode = route?.params?.mode;
  const zenzTitle = route?.params?.title;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    loadProfiles(zenzMode);
  }, [zenzMode]);

  const loadProfiles = async (mode) => {
    try {
      setIsLoading(true);
      // Pass mode to API if supported, otherwise just fetch regular discovery
      const response = await userAPI.getDiscovery(mode);
      if (response && response.data && response.data.profiles) {
        setProfiles(response.data.profiles);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles([
        {
          id: 1,
          name: 'Sarah',
          age: 26,
          photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800'],
          bio: 'Passionate about art and architecture. Love to travel and explore new cultures.',
          interests: ['Art', 'Travel', 'Music'],
          distance: 5,
        },
        {
          id: 2,
          name: 'Emma',
          age: 24,
          photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800'],
          bio: 'Fitness enthusiast and yoga lover. Looking for someone to share healthy vibes with.',
          interests: ['Yoga', 'Fitness', 'Cooking'],
          distance: 12,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = useCallback(() => {
    translateX.value = 0;
    translateY.value = 0;
    setCurrentIndex((prev) => prev + 1);
  }, [translateX, translateY]);

  const handleLike = async () => {
    try {
      if (currentIndex < profiles.length) {
        const userId = profiles[currentIndex].id;
        const profileName = profiles[currentIndex].name;
        const response = await swipeAPI.like(userId);

        if (response.data.data && response.data.data.isMatch) {
          Alert.alert(
            "It's a Match! 🔥",
            `You and ${profileName} have liked each other.`,
            [
              { text: 'Keep Swiping', onPress: nextCard },
              {
                text: 'Send Message',
                onPress: () => {
                  nextCard();
                  navigation.navigate('ChatTab', {
                    screen: 'ChatDetail',
                    params: {
                      match: {
                        id: userId,
                        matchId: response.data.data.matchId,
                        name: profileName,
                        avatar: profiles[currentIndex].photos[0]
                      }
                    }
                  });
                }
              }
            ]
          );
        } else {
          nextCard();
        }
      }
    } catch (error) {
      console.error('Like error:', error);
      nextCard();
    }
  };

  const handlePass = async () => {
    try {
      if (currentIndex < profiles.length) {
        const userId = profiles[currentIndex].id;
        await swipeAPI.pass(userId);
        nextCard();
      }
    } catch (error) {
      console.error('Pass error:', error);
    }
  };

  const handleSuperLike = async () => {
    try {
      if (currentIndex < profiles.length) {
        const userId = profiles[currentIndex].id;
        await swipeAPI.superLike(userId);
        nextCard();
      }
    } catch (error) {
      console.error('Super like error:', error);
    }
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 1.5);
        runOnJS(handleLike)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width * 1.5);
        runOnJS(handlePass)();
      } else if (event.translationY < -SWIPE_THRESHOLD) {
        translateY.value = withSpring(-width * 1.5);
        runOnJS(handleSuperLike)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

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

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.emptyInner}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="people" size={60} color={COLORS.modernTeal} />
          </View>
          <Text style={styles.emptyTitle}>You've reviewed everyone nearby!</Text>
          <Text style={styles.emptySubtitle}>
            Come back later or expand your search distance in settings.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentIndex(0);
              loadProfiles();
            }}
            style={styles.refreshButton}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.refreshButtonText}>Refresh Discover</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={StyleSheet.absoluteFill}
      />

      <DiscoveryHeader
        onSettings={() => navigation.navigate('Settings')}
        onFilter={() => navigation.navigate('Preferences')}
      />

      {zenzMode && (
        <Animated.View
          entering={FadeInUp}
          style={styles.zenzBanner}
        >
          <BlurView tint="light" intensity={30} style={styles.zenzBannerInner}>
            <LinearGradient
              colors={['rgba(255, 46, 151, 0.2)', 'rgba(121, 40, 202, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="sparkles" size={16} color={COLORS.neonPink} />
            <Text style={styles.zenzBannerText}>
              Active Mode: <Text style={{ fontWeight: '800', color: COLORS.neonPink }}>{zenzTitle}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.setParams({ mode: null, title: null })}
              style={styles.zenzExitButton}
            >
              <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      )}

      <View style={styles.cardWrapper}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.animatedCard, animatedStyle]}>
            <ProfileCard
              profile={currentProfile}
              key={currentProfile.id}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={styles.actionWrapper}>
        <ActionButtons
          onLike={handleLike}
          onPass={handlePass}
          onSuperLike={handleSuperLike}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING[8],
  },
  emptyInner: {
    alignItems: 'center',
    gap: SPACING[4],
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  refreshButton: {
    marginTop: SPACING[6],
    width: '100%',
  },
  gradientButton: {
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[8],
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: SPACING[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionWrapper: {
    paddingBottom: SPACING[8],
    paddingTop: SPACING[4],
  },
  zenzBanner: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[2],
  },
  zenzBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 46, 151, 0.3)',
    gap: SPACING[2],
  },
  zenzBannerText: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '500',
  },
  zenzExitButton: {
    padding: 2,
  },
});
