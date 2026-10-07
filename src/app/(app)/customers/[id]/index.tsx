import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useCustomer, useCustomerOrders, useDeleteCustomer } from '@/features/customers/hooks';
import { summarizeCustomerOrders } from '@/features/customers/orderStats';
import { useSession } from '@/providers/SessionProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { callPhone, openWhatsApp, sendEmail } from '@/utils/contact';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { getErrorMessage } from '@/utils/errors';
import type { Order } from '@/types/models';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { profile } = useSession();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: customer, isLoading, isError, error, refetch } = useCustomer(id);
  const { data: orders } = useCustomerOrders(id);
  const deleteCustomer = useDeleteCustomer();

  if (isLoading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Customer" />
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError || !customer) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Customer" />
        <ErrorState
          message={error ? getErrorMessage(error) : 'Customer not found'}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const summary = summarizeCustomerOrders(orders ?? [], dayjs().format('YYYY-MM-DD'));
  const currency = profile?.currency ?? 'EUR';
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');

  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteCustomer.mutateAsync(customer.id);
      router.back();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
      setConfirmDelete(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={fullName}
        rightAction={
          <Pressable
            onPress={() => router.push(`/(app)/customers/${customer.id}/edit`)}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={22} color={colors.accent} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card>
          <View style={styles.contactRow}>
            <ActionButton
              icon="call-outline"
              label="Call"
              disabled={!customer.phone}
              onPress={() => customer.phone && callPhone(customer.phone)}
            />
            <ActionButton
              icon="logo-whatsapp"
              label="WhatsApp"
              disabled={!customer.phone}
              onPress={() => customer.phone && openWhatsApp(customer.phone)}
            />
            <ActionButton
              icon="mail-outline"
              label="Email"
              disabled={!customer.email}
              onPress={() => customer.email && sendEmail(customer.email)}
            />
          </View>
          {customer.phone ? <InfoLine label="Phone" value={customer.phone} /> : null}
          {customer.email ? <InfoLine label="Email" value={customer.email} /> : null}
          {customer.address ? <InfoLine label="Address" value={customer.address} /> : null}
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[typography.title, { color: colors.text }]}>{summary.totalOrders}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Total orders</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[typography.title, { color: colors.text }]}>
              {formatCurrency(summary.totalRevenue, currency)}
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Total revenue</Text>
          </Card>
        </View>

        {customer.notes ? (
          <Card>
            <SectionHeader title="Notes" />
            <Text style={[typography.body, { color: colors.textMuted }]}>{customer.notes}</Text>
          </Card>
        ) : null}

        <View>
          <SectionHeader title="Upcoming orders" />
          {summary.upcomingOrders.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSubtle }]}>
              No upcoming orders.
            </Text>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {summary.upcomingOrders.map((order) => (
                <OrderRow key={order.id} order={order} currency={currency} />
              ))}
            </View>
          )}
        </View>

        <View>
          <SectionHeader title="Previous orders" />
          {summary.previousOrders.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSubtle }]}>
              No previous orders.
            </Text>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {summary.previousOrders.map((order) => (
                <OrderRow key={order.id} order={order} currency={currency} />
              ))}
            </View>
          )}
        </View>

        {deleteError ? <Text style={{ color: colors.danger }}>{deleteError}</Text> : null}
        <Pressable onPress={() => setConfirmDelete(true)} style={styles.deleteRow}>
          <Text style={{ color: colors.danger }}>Delete customer</Text>
        </Pressable>
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete customer"
        message={`This will permanently delete ${fullName}. This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteCustomer.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </ScreenContainer>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ marginTop: spacing.sm }}>
      <Text style={[typography.caption, { color: colors.textSubtle }]}>{label}</Text>
      <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.actionButton}>
      <Ionicons name={icon} size={20} color={disabled ? colors.textSubtle : colors.accent} />
      <Text
        style={[
          typography.caption,
          { color: disabled ? colors.textSubtle : colors.accent, marginTop: 4 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OrderRow({ order, currency }: { order: Order; currency: string }) {
  const colors = useThemeColors();
  return (
    <Card style={styles.orderRow}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.body, { color: colors.text }]}>{order.title}</Text>
        {order.date ? (
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {formatDate(order.date)}
          </Text>
        ) : null}
      </View>
      <Text style={[typography.subheading, { color: colors.text }]}>
        {formatCurrency(order.price, currency)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: spacing.sm,
  },
  actionButton: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteRow: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
