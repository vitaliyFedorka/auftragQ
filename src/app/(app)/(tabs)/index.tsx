import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { MetricCard } from '@/components/ui/MetricCard';
import { OrderCard } from '@/components/ui/OrderCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  getMonthSummary,
  getOrdersRequiringAttention,
  getTodaySummary,
  getUpcomingAppointments,
} from '@/features/dashboard/summary';
import { filterOrders } from '@/features/orders/filters';
import { useOrders } from '@/features/orders/hooks';
import { useSession } from '@/providers/SessionProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { profile } = useSession();
  const { data: orders, isLoading, isError, error, refetch } = useOrders();

  const today = dayjs().format('YYYY-MM-DD');
  const month = dayjs().format('YYYY-MM');
  const currency = profile?.currency ?? 'EUR';

  const todaySummary = useMemo(() => getTodaySummary(orders ?? [], today), [orders, today]);
  const monthSummary = useMemo(() => getMonthSummary(orders ?? [], month), [orders, month]);
  const todayOrders = useMemo(() => filterOrders(orders ?? [], 'today', today), [orders, today]);
  const attentionOrders = useMemo(
    () => getOrdersRequiringAttention(orders ?? [], today),
    [orders, today],
  );
  const upcomingOrders = useMemo(
    () => getUpcomingAppointments(orders ?? [], today, 3),
    [orders, today],
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxl }}>
        <Text style={[typography.title, { color: colors.text }]}>
          {profile?.businessName ?? 'Welcome'}
        </Text>

        <View>
          <SectionHeader title="Today" />
          <View style={styles.metricGrid}>
            <MetricCard label="Revenue" value={formatCurrency(todaySummary.revenue, currency)} />
            <MetricCard
              label={todaySummary.orderCount === 1 ? 'Order' : 'Orders'}
              value={String(todaySummary.orderCount)}
            />
          </View>
          <View style={[styles.metricGrid, { marginTop: spacing.sm }]}>
            <MetricCard
              label="Unpaid invoices"
              value={String(todaySummary.unpaidCount)}
              tone={todaySummary.unpaidCount > 0 ? 'danger' : 'default'}
            />
            <MetricCard label="Deliveries" value={String(todaySummary.deliveryCount)} />
          </View>
        </View>

        <View>
          <SectionHeader title="Today's orders" />
          {todayOrders.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSubtle }]}>
              No orders scheduled for today.
            </Text>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {todayOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currency={currency}
                  onPress={() => router.push(`/(app)/orders/${order.id}`)}
                />
              ))}
            </View>
          )}
        </View>

        {attentionOrders.length > 0 ? (
          <View>
            <SectionHeader title="Needs attention" trailing={String(attentionOrders.length)} />
            <View style={{ gap: spacing.sm }}>
              {attentionOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currency={currency}
                  onPress={() => router.push(`/(app)/orders/${order.id}`)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View>
          <SectionHeader title="Upcoming" />
          {upcomingOrders.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSubtle }]}>
              No upcoming appointments.
            </Text>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {upcomingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currency={currency}
                  onPress={() => router.push(`/(app)/orders/${order.id}`)}
                />
              ))}
            </View>
          )}
        </View>

        <View>
          <SectionHeader title="This month" />
          <View style={styles.metricGrid}>
            <MetricCard label="Revenue" value={formatCurrency(monthSummary.revenue, currency)} />
            <MetricCard label="Costs" value={formatCurrency(monthSummary.costs, currency)} />
          </View>
          <View style={[styles.metricGrid, { marginTop: spacing.sm }]}>
            <MetricCard
              label="Estimated profit"
              value={formatCurrency(monthSummary.profit, currency)}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
