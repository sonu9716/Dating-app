/**
 * Typing Indicator Component
 * Shows when user is typing
 */

import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function TypingIndicator() {
  const dot1Anim = new Animated.Value(0);
  const dot2Anim = new Animated.Value(0);
  const dot3Anim = new Animated.Value(0);

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, []);

  const DotAnimated = ({ anim }) => (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 3,
        opacity: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -6],
            }),
          },
        ],
      }}
    />
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING,
        paddingVertical: SPACING,
        alignItems: 'center',
        width: 50,
      }}
    >
      <DotAnimated anim={dot1Anim} />
      <DotAnimated anim={dot2Anim} />
      <DotAnimated anim={dot3Anim} />
    </View>
  );
}
