import { StyleSheet, Text, View } from 'react-native';

import { paymentStatusColors } from '@/features/orders/statusColors';
import { paymentStatusLabel } from '@/features/orders/labels';
import { radius, spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import type { PaymentStatus } from '@/types/models';

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const colors = useThemeColors();
  const { bg, fg } = paymentStatusColors(colors, status);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[typography.caption, { color: fg }]}>{paymentStatusLabel(status)}</Text>
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
