import { useColorScheme } from 'react-native';

import { colors, type ThemeColors } from './tokens';

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return colors[scheme === 'dark' ? 'dark' : 'light'];
}
