import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

interface MetricCardProps {
  label: string;
  value: string;
  tone?: 'default' | 'warning' | 'danger';
}

export function MetricCard({ label, value, tone = 'default' }: MetricCardProps) {
  const colors = useThemeColors();
  const valueColor =
    tone === 'warning' ? colors.warning : tone === 'danger' ? colors.danger : colors.text;

  return (
    <Card style={styles.card}>
      <Text style={[typography.heading, { color: valueColor }]}>{value}</Text>
      <View style={{ marginTop: spacing.xs }}>
        <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
});
