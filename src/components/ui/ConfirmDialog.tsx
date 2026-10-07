import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, spacing, typography } from '@/theme/tokens';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const colors = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[typography.subheading, { color: colors.text }]}>{title}</Text>
          <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
            {message}
          </Text>
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button label="Cancel" variant="secondary" onPress={onCancel} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label={confirmLabel} variant="danger" onPress={onConfirm} loading={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
