import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence
} from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const { width } = Dimensions.get('window');

const AnimatedButton = ({ icon, color, onPress, size = 60, iconSize = 28 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Animated.View style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        animatedStyle
      ]}>
        <Ionicons name={icon} size={iconSize} color={COLORS.textWhite} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ActionButtons({ onPass, onLike, onSuperLike }) {
  return (
    <View style={styles.container}>
      {/* Pass Button */}
      <AnimatedButton
        icon="close"
        color="rgba(255, 255, 255, 0.1)"
        onPress={onPass}
        size={56}
        iconSize={30}
      />

      {/* Super Like Button */}
      <AnimatedButton
        icon="star"
        color={COLORS.modernTeal}
        onPress={onSuperLike}
        size={64}
        iconSize={32}
      />

      {/* Like Button */}
      <AnimatedButton
        icon="heart"
        color={COLORS.coral}
        onPress={onLike}
        size={56}
        iconSize={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING[8],
    paddingHorizontal: SPACING[6],
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
