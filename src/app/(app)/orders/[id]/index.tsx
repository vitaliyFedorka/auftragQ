import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { PaymentBadge } from '@/components/ui/PaymentBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatusPickerSheet } from '@/features/orders/components/StatusPickerSheet';
import {
  useDeleteOrder,
  useOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from '@/features/orders/hooks';
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '@/features/orders/labels';
import { useSession } from '@/providers/SessionProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { calculateEstimatedProfit, calculateRevenue, formatCurrency } from '@/utils/currency';
import { formatDate, formatTime } from '@/utils/date';
import { getErrorMessage } from '@/utils/errors';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { profile } = useSession();
  const [statusSheet, setStatusSheet] = useState<'order' | 'payment' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: order, isLoading, isError, error, refetch } = useOrder(id);
  const updateOrderStatus = useUpdateOrderStatus(id);
  const updatePaymentStatus = useUpdatePaymentStatus(id);
  const deleteOrder = useDeleteOrder();

  if (isLoading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Order" />
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError || !order) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Order" />
        <ErrorState
          message={error ? getErrorMessage(error) : 'Order not found'}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const currency = profile?.currency ?? 'EUR';
  const revenue = calculateRevenue(order.price, order.deliveryFee);
  const profit = calculateEstimatedProfit(order.price, order.deliveryFee, order.materialCost);

  const handleDelete = async () => {
    setActionError(null);
    try {
      await deleteOrder.mutateAsync(order.id);
      router.back();
    } catch (err) {
      setActionError(getErrorMessage(err));
      setConfirmDelete(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={order.title}
        rightAction={
          <Pressable onPress={() => router.push(`/(app)/orders/${order.id}/edit`)} hitSlop={8}>
            <Ionicons name="create-outline" size={22} color={colors.accent} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.badgeRow}>
          <Pressable onPress={() => setStatusSheet('order')}>
            <StatusBadge status={order.orderStatus} />
          </Pressable>
          <Pressable onPress={() => setStatusSheet('payment')}>
            <PaymentBadge status={order.paymentStatus} />
          </Pressable>
        </View>

        <Card style={{ gap: spacing.sm }}>
          {order.customerName ? <InfoLine label="Customer" value={order.customerName} /> : null}
          {order.orderType ? <InfoLine label="Order type" value={order.orderType} /> : null}
          {order.date ? (
            <InfoLine
              label="Date"
              value={`${formatDate(order.date)}${order.startTime ? ` · ${formatTime(order.startTime)}` : ''}${
                order.endTime ? ` – ${formatTime(order.endTime)}` : ''
              }`}
            />
          ) : null}
          {order.deliveryRequired ? (
            <InfoLine label="Delivery" value={order.deliveryAddress ?? 'Delivery required'} />
          ) : (
            <InfoLine label="Fulfillment" value="Pickup" />
          )}
          {order.description ? <InfoLine label="Description" value={order.description} /> : null}
          {order.notes ? <InfoLine label="Notes" value={order.notes} /> : null}
        </Card>

        <Card>
          <SectionHeader title="Revenue & profit" />
          <View style={styles.financeRow}>
            <FinanceLine label="Price" value={formatCurrency(order.price, currency)} />
            <FinanceLine label="Deposit" value={formatCurrency(order.deposit, currency)} />
          </View>
          <View style={styles.financeRow}>
            <FinanceLine
              label="Material cost"
              value={formatCurrency(order.materialCost, currency)}
            />
            <FinanceLine label="Delivery fee" value={formatCurrency(order.deliveryFee, currency)} />
          </View>
          <View style={[styles.financeRow, { marginTop: spacing.sm }]}>
            <FinanceLine label="Revenue" value={formatCurrency(revenue, currency)} emphasize />
            <FinanceLine label="Est. profit" value={formatCurrency(profit, currency)} emphasize />
          </View>
        </Card>

        <Button
          label="Generate reply"
          variant="secondary"
          onPress={() => router.push(`/(app)/orders/${order.id}/reply`)}
        />

        {actionError ? <Text style={{ color: colors.danger }}>{actionError}</Text> : null}
        <Pressable onPress={() => setConfirmDelete(true)} style={styles.deleteRow}>
          <Text style={{ color: colors.danger }}>Delete order</Text>
        </Pressable>
      </ScrollView>

      <StatusPickerSheet
        visible={statusSheet === 'order'}
        title="Order status"
        options={ORDER_STATUS_OPTIONS}
        value={order.orderStatus}
        onSelect={(value) => updateOrderStatus.mutate(value)}
        onClose={() => setStatusSheet(null)}
      />
      <StatusPickerSheet
        visible={statusSheet === 'payment'}
        title="Payment status"
        options={PAYMENT_STATUS_OPTIONS}
        value={order.paymentStatus}
        onSelect={(value) => updatePaymentStatus.mutate(value)}
        onClose={() => setStatusSheet(null)}
      />

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete order"
        message={`This will permanently delete "${order.title}". This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteOrder.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </ScreenContainer>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  const colors = useThemeColors();
  return (
    <View>
      <Text style={[typography.caption, { color: colors.textSubtle }]}>{label}</Text>
      <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function FinanceLine({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View style={{ flex: 1 }}>
      <Text style={[typography.caption, { color: colors.textSubtle }]}>{label}</Text>
      <Text style={[emphasize ? typography.subheading : typography.body, { color: colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  financeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  deleteRow: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
