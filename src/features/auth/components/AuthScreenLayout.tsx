import { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { spacing, typography } from '@/theme/tokens';

interface AuthScreenLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

export function AuthScreenLayout({ title, subtitle, children }: AuthScreenLayoutProps) {
  const colors = useThemeColors();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[typography.title, { color: colors.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.form}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
});
