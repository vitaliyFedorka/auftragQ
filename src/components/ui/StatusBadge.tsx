import { StyleSheet, Text, View } from 'react-native';

import { orderStatusColors } from '@/features/orders/statusColors';
import { orderStatusLabel } from '@/features/orders/labels';
import { radius, spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import type { OrderStatus } from '@/types/models';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const colors = useThemeColors();
  const { bg, fg } = orderStatusColors(colors, status);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[typography.caption, { color: fg }]}>{orderStatusLabel(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});
