import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/useThemeColors';
import { radius, spacing, typography } from '@/theme/tokens';

interface ChipOption {
  value: string;
  label: string;
}

interface ChipGroupProps {
  options: readonly ChipOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ChipGroup({ options, value, onChange }: ChipGroupProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.accentMuted : colors.surface,
                borderColor: selected ? colors.accent : colors.border,
              },
            ]}
          >
            <Text style={[typography.caption, { color: selected ? colors.accent : colors.text }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
