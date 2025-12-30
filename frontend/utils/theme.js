/**
 * Theme Configuration - Figma Design System
 * Colors, spacing, typography tokens
 */

export const COLORS = {
  // Primary Colors (Figma - Coral)
  primary: '#FF6B6B',
  primaryHover: '#FF5555',
  primaryActive: '#E85555',
  primaryLight: '#FFB3B3',
  primaryLighter: '#FFE0E0',

  // Secondary Colors (Figma - Teal)
  secondary: '#4ECDC4',
  secondaryHover: '#3DB5B0',
  secondaryActive: '#2D9D9A',
  secondaryLight: '#7FE5DD',
  secondaryLighter: '#BFEFEA',

  // Accent Colors (Figma - Yellow)
  accent: '#FFE66D',
  accentHover: '#FFE050',
  accentActive: '#FFD830',
  accentLight: '#FFF1A3',
  accentLighter: '#FFF9D9',

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
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5F5F5',
  bgTertiary: '#E8E8E8',
  bgDark: '#1F2121',
  bgDarkSecondary: '#2A2C2C',

  // Text Colors
  textPrimary: '#000000',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textWhite: '#FFFFFF',
  textDisabled: '#D1D5DB',

  // Borders & Dividers
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  borderLight: '#F3F4F6',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  // Special
  transparent: 'transparent',
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

export default theme;
