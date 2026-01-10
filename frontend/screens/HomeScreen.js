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
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  FadeInUp,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import api, { swipeAPI, userAPI } from '../utils/api';
import ProfileCard from '../components/ProfileCard';
import ActionButtons from '../components/ActionButtons';
import DiscoveryHeader from '../components/DiscoveryHeader';
import MatchModal from '../components/MatchModal';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export default function HomeScreen({ route, navigation }) {
  const { state: authState } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const zenzMode = route?.params?.mode;
  const zenzTitle = route?.params?.title;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const initHomeScreen = async () => {
      await requestLocation();
      loadProfiles(zenzMode);
    };
    initHomeScreen();
  }, [zenzMode]);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      await userAPI.updateLocation(latitude, longitude);
      console.log('Location updated:', latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadProfiles = async (mode) => {
    try {
      setIsLoading(true);
      // Ensure we have coordinates before fetching discovery for best results
      // Although discovery will fallback to random even without coords
      const response = await userAPI.getDiscovery(mode);
      console.log('Discovery response:', response.data); // Debug log

      // Backend returns { success: true, data: { profiles: [...] } }
      // Axios wraps in response.data, so full path is response.data.data.profiles
      if (response && response.data && response.data.data && response.data.data.profiles) {
        const loadedProfiles = response.data.data.profiles;
        setProfiles(loadedProfiles);
        setCurrentIndex(0); // Reset to first card
        Alert.alert('Discovery Debug',
          `Server: ${api.defaults.baseURL}\n` +
          `User: ${authState.user?.email} (ID: ${authState.user?.id})\n` +
          `Profiles: ${loadedProfiles.length}`
        );
      } else {
        console.warn('No profiles in response:', response.data);
        setProfiles([]);
        Alert.alert('Discovery Debug', 'Response success but no data!');
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      console.error('Error response:', error.response?.data);
      // Don't set fallback data - let user see empty state to know something is wrong
      setProfiles([]);
      Alert.alert('Discovery Error', error.response?.data?.error || error.message || 'Failed to load profiles');
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
          setMatchData({
            id: userId,
            matchId: response.data.data.matchId,
            name: profileName,
            avatar: profiles[currentIndex].photos[0]
          });
          setShowMatchModal(true);
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

      <MatchModal
        visible={showMatchModal}
        userAvatar={authState.user?.avatar}
        matchAvatar={matchData?.avatar}
        matchName={matchData?.name}
        onKeepSwiping={() => {
          setShowMatchModal(false);
          nextCard();
        }}
        onSendMessage={() => {
          setShowMatchModal(false);
          nextCard();
          navigation.navigate('ChatTab', {
            screen: 'ChatDetail',
            params: { match: matchData }
          });
        }}
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
