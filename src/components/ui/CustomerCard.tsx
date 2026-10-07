import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { radius, spacing, typography } from '@/theme/tokens';
import type { Customer } from '@/types/models';

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
}

export function CustomerCard({ customer, onPress }: CustomerCardProps) {
  const colors = useThemeColors();
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  const subtitle = customer.phone ?? customer.email ?? 'No contact info';

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
      <View style={styles.text}>
        <Text style={[typography.subheading, { color: colors.text }]}>{fullName}</Text>
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  text: {
    flex: 1,
  },
});
