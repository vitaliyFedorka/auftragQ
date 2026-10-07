import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

interface StatusPickerSheetProps<T extends string> {
  visible: boolean;
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onSelect: (value: T) => void;
  onClose: () => void;
}

export function StatusPickerSheet<T extends string>({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: StatusPickerSheetProps<T>) {
  const colors = useThemeColors();

  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <View style={{ gap: spacing.xs }}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: spacing.md,
              }}
            >
              <Text style={[typography.body, { color: colors.text }]}>{option.label}</Text>
              {selected ? <Ionicons name="checkmark" size={20} color={colors.accent} /> : null}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}
