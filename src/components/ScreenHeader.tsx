import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { spacing, typography } from '@/theme/tokens';

interface ScreenHeaderProps {
  title: string;
  rightAction?: ReactNode;
}

export function ScreenHeader({ title, rightAction }: ScreenHeaderProps) {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[typography.heading, { color: colors.text, flex: 1 }]} numberOfLines={1}>
        {title}
      </Text>
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
});
