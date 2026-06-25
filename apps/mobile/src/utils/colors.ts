export const LightColors = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  secondary: '#10B981',
  accent: '#F59E0B',
  error: '#EF4444',
  warning: '#F97316',

  background: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  star: '#F59E0B',
  starEmpty: '#E5E7EB',

  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',
} as const;

export const DarkColors = {
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#4F46E5',
  secondary: '#34D399',
  accent: '#FCD34D',
  error: '#F87171',
  warning: '#FB923C',

  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  border: '#374151',
  borderLight: '#1F2937',

  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textInverse: '#111827',

  star: '#FCD34D',
  starEmpty: '#374151',

  gradientStart: '#4F46E5',
  gradientEnd: '#7C3AED',
} as const;

export type ColorTokens = typeof LightColors;

// 기본 export — useTheme 훅을 통해 동적으로 사용
export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
