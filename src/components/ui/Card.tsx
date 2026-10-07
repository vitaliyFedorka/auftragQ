import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { radius, spacing } from '@/theme/tokens';

export function Card({ style, ...rest }: ViewProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.base, { backgroundColor: colors.surface, borderColor: colors.border }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
});
