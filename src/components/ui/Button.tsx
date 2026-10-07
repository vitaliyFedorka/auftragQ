import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
} from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { radius, spacing, typography } from '@/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const backgrounds: Record<ButtonVariant, string> = {
    primary: colors.accent,
    secondary: colors.surface,
    ghost: 'transparent',
    danger: colors.danger,
  };
  const textColors: Record<ButtonVariant, string> = {
    primary: '#FFFFFF',
    secondary: colors.text,
    ghost: colors.accent,
    danger: '#FFFFFF',
  };
  const borderColors: Record<ButtonVariant, string> = {
    primary: colors.accent,
    secondary: colors.border,
    ghost: 'transparent',
    danger: colors.danger,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: backgrounds[variant],
          borderColor: borderColors[variant],
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.label, typography.subheading, { color: textColors[variant] }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
