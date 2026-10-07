export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
}

export const colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#E8E8EB',
    text: '#13131A',
    textMuted: '#6B6B76',
    textSubtle: '#9797A3',
    accent: '#3B5BFD',
    accentMuted: '#EEF0FF',
    success: '#1C9A6C',
    successMuted: '#E6F7EF',
    warning: '#B6791F',
    warningMuted: '#FBF0DF',
    danger: '#D14343',
    dangerMuted: '#FBEAEA',
  },
  dark: {
    background: '#0E0E12',
    surface: '#17171D',
    border: '#2A2A32',
    text: '#F5F5F7',
    textMuted: '#A5A5B0',
    textSubtle: '#71717B',
    accent: '#6B82FF',
    accentMuted: '#1C2142',
    success: '#3FC98B',
    successMuted: '#123828',
    warning: '#E0A440',
    warningMuted: '#3A2C10',
    danger: '#E57373',
    dangerMuted: '#3A1818',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const },
  heading: { fontSize: 20, fontWeight: '600' as const },
  subheading: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};

export type ThemeMode = 'light' | 'dark';
