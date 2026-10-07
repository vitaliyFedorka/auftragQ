import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaymentBadge } from './PaymentBadge';
import { StatusBadge } from './StatusBadge';
import { radius, spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { formatCurrency } from '@/utils/currency';
import { formatTime } from '@/utils/date';
import type { OrderStatus, PaymentStatus } from '@/types/models';

interface OrderCardProps {
  order: {
    title: string;
    customerName: string | null;
    startTime: string | null;
    price: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    deliveryRequired: boolean;
  };
  currency: string;
  onPress: () => void;
}

export function OrderCard({ order, currency, onPress }: OrderCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.subheading, { color: colors.text }]} numberOfLines={1}>
            {order.title}
          </Text>
          <Text
            style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}
            numberOfLines={1}
          >
            {order.customerName ?? 'No customer'}
            {order.startTime ? ` · ${formatTime(order.startTime)}` : ''}
          </Text>
        </View>
        <Text style={[typography.subheading, { color: colors.text }]}>
          {formatCurrency(order.price, currency)}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <StatusBadge status={order.orderStatus} />
        <PaymentBadge status={order.paymentStatus} />
        {order.deliveryRequired ? (
          <View style={styles.deliveryChip}>
            <Ionicons name="bicycle-outline" size={14} color={colors.textMuted} />
            <Text style={[typography.caption, { color: colors.textMuted }]}>Delivery</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  deliveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
