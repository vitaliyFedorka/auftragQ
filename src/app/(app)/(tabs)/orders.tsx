import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { OrderCard } from '@/components/ui/OrderCard';
import { ORDER_FILTER_OPTIONS, filterOrders, type OrderFilter } from '@/features/orders/filters';
import { useOrders } from '@/features/orders/hooks';
import { useSession } from '@/providers/SessionProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';

export default function OrdersScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { profile } = useSession();
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [search, setSearch] = useState('');
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const { data: orders, isLoading, isError, error, refetch } = useOrders();

  const visible = useMemo(() => {
    const byFilter = filterOrders(orders ?? [], filter, dayjs().format('YYYY-MM-DD'));
    const query = search.trim().toLowerCase();
    if (!query) return byFilter;
    return byFilter.filter((order) =>
      [order.title, order.customerName].filter(Boolean).join(' ').toLowerCase().includes(query),
    );
  }, [orders, filter, search]);

  const currency = profile?.currency ?? 'EUR';

  return (
    <ScreenContainer style={{ gap: spacing.md }}>
      <View style={styles.header}>
        <Text style={[typography.title, { color: colors.text }]}>Orders</Text>
        <Pressable onPress={() => setCreateSheetOpen(true)} hitSlop={8}>
          <Ionicons name="add-circle" size={32} color={colors.accent} />
        </Pressable>
      </View>

      <Input
        placeholder="Search by title or customer"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      <ChipGroup
        options={ORDER_FILTER_OPTIONS}
        value={filter}
        onChange={(value) => setFilter(value as OrderFilter)}
      />

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No orders here"
          description="Try a different filter, or create a new order."
        />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              currency={currency}
              onPress={() => router.push(`/(app)/orders/${item.id}`)}
            />
          )}
        />
      )}

      <BottomSheet
        visible={createSheetOpen}
        title="New order"
        onClose={() => setCreateSheetOpen(false)}
      >
        <Pressable
          style={styles.sheetRow}
          onPress={() => {
            setCreateSheetOpen(false);
            router.push('/(app)/orders/new');
          }}
        >
          <Ionicons name="create-outline" size={20} color={colors.text} />
          <Text style={[typography.body, { color: colors.text }]}>Write manually</Text>
        </Pressable>
        <Pressable
          style={styles.sheetRow}
          onPress={() => {
            setCreateSheetOpen(false);
            router.push('/(app)/orders/ai-create');
          }}
        >
          <Ionicons name="sparkles-outline" size={20} color={colors.text} />
          <Text style={[typography.body, { color: colors.text }]}>From customer message (AI)</Text>
        </Pressable>
      </BottomSheet>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
});
