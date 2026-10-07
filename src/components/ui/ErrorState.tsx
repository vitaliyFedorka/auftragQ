import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { useThemeColors } from '@/theme/useThemeColors';
import { spacing, typography } from '@/theme/tokens';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[typography.subheading, { color: colors.text, textAlign: 'center' }]}>
        {title}
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },
        ]}
      >
        {message}
      </Text>
      {onRetry ? (
        <View style={{ marginTop: spacing.lg, width: '100%' }}>
          <Button label="Try again" onPress={onRetry} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
});
