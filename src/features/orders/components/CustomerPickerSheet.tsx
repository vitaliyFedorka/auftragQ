import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { useCustomers } from '@/features/customers/hooks';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import type { Customer } from '@/types/models';

interface CustomerPickerSheetProps {
  visible: boolean;
  onSelect: (customer: Customer | null) => void;
  onClose: () => void;
}

export function CustomerPickerSheet({ visible, onSelect, onClose }: CustomerPickerSheetProps) {
  const colors = useThemeColors();
  const { data: customers, isLoading } = useCustomers();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!customers) return [];
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) =>
      [customer.firstName, customer.lastName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [customers, search]);

  return (
    <BottomSheet visible={visible} title="Select customer" onClose={onClose}>
      <Input placeholder="Search customers" value={search} onChangeText={setSearch} />
      <Pressable
        onPress={() => {
          onSelect(null);
          onClose();
        }}
        style={{ paddingVertical: spacing.md }}
      >
        <Text style={[typography.body, { color: colors.textMuted }]}>No customer</Text>
      </Pressable>
      {isLoading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              style={{ paddingVertical: spacing.md }}
            >
              <Text style={[typography.body, { color: colors.text }]}>
                {[item.firstName, item.lastName].filter(Boolean).join(' ')}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ paddingVertical: spacing.md }}>
              <Text style={[typography.caption, { color: colors.textSubtle }]}>
                No customers found.
              </Text>
            </View>
          }
        />
      )}
    </BottomSheet>
  );
}
