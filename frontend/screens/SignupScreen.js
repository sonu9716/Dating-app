import React, { useState, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const interests = ['Travel', 'Art', 'Sports', 'Music', 'Food', 'Gaming', 'Reading', 'Fitness', 'Photography', 'Outdoor'];

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '25',
    gender: '',
    interests: [],
    bio: '',
  });

  const totalSteps = 4;
  const progress = useSharedValue(0.25);

  useEffect(() => {
    progress.value = withTiming(step / totalSteps, { duration: 500 });
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.password)) {
      Alert.alert('Error', 'Please fill in all account details');
      return;
    }
    if (step === 2 && !formData.gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSignup();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const result = await signup({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        bio: formData.bio,
        interests: formData.interests,
      });

      if (!result.success) {
        Alert.alert('Signup Failed', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ gap: SPACING[4] }}>
            <Text style={styles.stepTitle}>Create Your Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ gap: SPACING[6] }}>
            <Text style={styles.stepTitle}>A bit more about you</Text>

            <View>
              <Text style={styles.label}>Age: {formData.age}</Text>
              <View style={styles.sliderPlaceholder}>
                <TextInput
                  style={styles.input}
                  value={formData.age.toString()}
                  onChangeText={(text) => setFormData({ ...formData, age: text.replace(/[^0-9]/g, '') })}
                  keyboardType="numeric"
                  placeholder="Enter your age"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Gender</Text>
              <View style={{ flexDirection: 'row', gap: SPACING[2] }}>
                {['Man', 'Woman', 'Other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setFormData({ ...formData, gender: option })}
                    style={[
                      styles.choiceButton,
                      formData.gender === option && styles.choiceButtonActive
                    ]}
                  >
                    <Text style={[styles.choiceText, formData.gender === option && styles.choiceTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ gap: SPACING[6] }}>
            <Text style={styles.stepTitle}>Select your interests</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING[2] }}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.interestChip,
                    formData.interests.includes(interest) && styles.interestChipActive
                  ]}
                >
                  <Text style={[styles.interestText, formData.interests.includes(interest) && styles.interestTextActive]}>
                    {interest}
                  </Text>
                  {formData.interests.includes(interest) && (
                    <Ionicons name="close-circle" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ gap: SPACING[6] }}>
            <Text style={styles.stepTitle}>Finish your profile</Text>
            <View>
              <Text style={styles.label}>Write a short bio</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                placeholder="Tell us about yourself..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                maxLength={150}
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
              />
              <Text style={{ textAlign: 'right', color: COLORS.textTertiary, fontSize: 12, marginTop: 4 }}>
                {formData.bio.length}/150
              </Text>
            </View>

            <BlurView tint="dark" intensity={40} style={styles.previewCard}>
              <Text style={styles.previewTitle}>Profile Preview</Text>
              <Text style={styles.previewText}>
                {formData.firstName} {formData.lastName}, {formData.age}
              </Text>
              <Text style={styles.previewBio} numberOfLines={2}>
                {formData.bio || 'No bio yet'}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {formData.interests.slice(0, 3).map(i => (
                  <View key={i} style={styles.miniChip}>
                    <Text style={styles.miniChipText}>{i}</Text>
                  </View>
                ))}
                {formData.interests.length > 3 && <Text style={styles.miniChipText}>+{formData.interests.length - 3}</Text>}
              </View>
            </BlurView>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgDark }}>
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: SPACING[6], paddingTop: 10 }}>
            <TouchableOpacity onPress={handleBack} style={styles.backButtonRefined}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
              <Text style={{ color: COLORS.textWhite, fontSize: 16 }}>Back</Text>
            </TouchableOpacity>

            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, progressStyle]}>
                <LinearGradient
                  colors={[COLORS.neonPink, COLORS.electricPurple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: SPACING[6],
              paddingVertical: SPACING[8],
            }}
            showsVerticalScrollIndicator={false}
          >
            <BlurView
              tint="light"
              intensity={10}
              style={styles.glassCard}
            >
              {renderStep()}

              <TouchableOpacity
                onPress={handleNext}
                disabled={isLoading}
                style={{ marginTop: SPACING[8] }}
              >
                <LinearGradient
                  colors={GRADIENTS.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.textWhite} />
                  ) : (
                    <>
                      <Text style={styles.nextButtonText}>
                        {step === totalSteps ? 'Complete Profile' : 'Continue'}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color={COLORS.textWhite} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const SafeAreaView = ({ children, style }) => (
  <View style={[{ paddingTop: Platform.OS === 'ios' ? 44 : 0 }, style]}>{children}</View>
);

const styles = {
  backButtonRefined: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING[4],
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  glassCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING[8],
    borderWidth: 1,
    borderColor: COLORS.glassBorderDark,
    overflow: 'hidden',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginBottom: SPACING[2],
  },
  input: {
    height: 54,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING[4],
    fontSize: 16,
    color: COLORS.textWhite,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: SPACING[2],
  },
  choiceButton: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  choiceButtonActive: {
    backgroundColor: COLORS.modernTeal,
    borderColor: COLORS.modernTeal,
  },
  choiceText: {
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  choiceTextActive: {
    color: '#FFF',
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestChipActive: {
    backgroundColor: COLORS.modernTeal,
  },
  interestText: {
    color: COLORS.textWhite,
    fontSize: 14,
  },
  interestTextActive: {
    fontWeight: '600',
  },
  nextButton: {
    height: 54,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  previewCard: {
    padding: SPACING[4],
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewTitle: {
    color: COLORS.neonPink,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  previewText: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
  previewBio: {
    color: COLORS.textTertiary,
    fontSize: 14,
    marginTop: 2,
  },
  miniChip: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  miniChipText: {
    color: COLORS.modernTeal,
    fontSize: 10,
    fontWeight: '600',
  }
};
