import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { spacing, typography } from '@/theme/tokens';

interface SectionHeaderProps {
  title: string;
  trailing?: string;
}

export function SectionHeader({ title, trailing }: SectionHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <Text style={[typography.subheading, { color: colors.text }]}>{title}</Text>
      {trailing ? (
        <Text style={[typography.caption, { color: colors.textMuted }]}>{trailing}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
});
