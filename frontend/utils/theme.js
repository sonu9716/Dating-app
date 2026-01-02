/**
 * Theme Configuration - Figma Design System
 * Colors, spacing, typography tokens
 */

export const COLORS = {
  // Primary Gradient Colors
  primary: '#FF6B6B',
  primaryStart: '#FF6B6B',
  primaryMid: '#C44569',
  primaryEnd: '#A8577D',

  // Secondary/Accent Gradients
  secondary: '#8B5CF6',
  secondaryStart: '#667eea',
  secondaryEnd: '#764ba2',

  // Neon Accents
  neonPink: '#FF2E97',
  electricPurple: '#8B5CF6',
  modernTeal: '#06B6D4',
  coral: '#FF6B6B',
  deepPurple: '#764ba2',

  // Status Colors
  success: '#22C55E',
  successLight: '#BBF7D0',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  warning: '#F97316',
  warningLight: '#FDBA74',
  info: '#3B82F6',
  infoLight: '#BFDBFE',

  // Backgrounds
  bgPrimary: '#F8F8F8',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#F0F0F0',
  bgDark: '#1A1A1A',
  bgDarkSecondary: '#2D1B2E',
  bgDarkTertiary: '#252525',

  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textWhite: '#F5F5F5',
  textDisabled: '#D1D5DB',

  // Borders & Dividers
  border: 'rgba(0, 0, 0, 0.08)',
  borderDark: 'rgba(255, 255, 255, 0.1)',
  borderLight: '#F3F4F6',

  // Glassmorphism
  glassBgLight: 'rgba(255, 255, 255, 0.7)',
  glassBgDark: 'rgba(30, 30, 30, 0.7)',
  glassBorderLight: 'rgba(255, 255, 255, 0.3)',
  glassBorderDark: 'rgba(255, 255, 255, 0.1)',

  // Special
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const GRADIENTS = {
  primary: [COLORS.primaryStart, COLORS.primaryMid, COLORS.primaryEnd],
  secondary: [COLORS.secondaryStart, COLORS.secondaryEnd],
  dark: [COLORS.bgDark, COLORS.bgDarkSecondary],
};

export const SPACING = {
  0: 0,
  1: 4,      // xs
  2: 8,      // sm
  3: 12,     // base
  4: 16,     // md
  5: 20,     // lg
  6: 24,     // xl
  7: 32,     // 2xl
  8: 40,     // 3xl
  9: 48,     // 4xl
  10: 56,    // 5xl
};

export const RADIUS = {
  xs: 4,
  sm: 6,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
};

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
};

export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};
