import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { CustomerCard } from '@/components/ui/CustomerCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { useCustomers } from '@/features/customers/hooks';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';

export default function CustomersScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [search, setSearch] = useState('');
  const { data: customers, isLoading, isError, error, refetch } = useCustomers();

  const filtered = useMemo(() => {
    if (!customers) return [];
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) => {
      const haystack = [customer.firstName, customer.lastName, customer.phone, customer.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [customers, search]);

  return (
    <ScreenContainer style={{ gap: spacing.md }}>
      <View style={styles.header}>
        <Text style={[typography.title, { color: colors.text }]}>Customers</Text>
        <Pressable onPress={() => router.push('/(app)/customers/new')} hitSlop={8}>
          <Ionicons name="add-circle" size={32} color={colors.accent} />
        </Pressable>
      </View>

      <Input
        placeholder="Search by name, phone or email"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? 'No matching customers' : 'No customers yet'}
          description={
            search ? 'Try a different search term.' : 'Add your first customer to get started.'
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <CustomerCard
              customer={item}
              onPress={() => router.push(`/(app)/customers/${item.id}`)}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
