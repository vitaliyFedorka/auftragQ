import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { extractOrderFromText } from '@/features/ai/api';
import { useAiOrderDraftStore } from '@/features/ai/draftStore';
import { CustomerPickerSheet } from '@/features/orders/components/CustomerPickerSheet';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';
import type { Customer } from '@/types/models';

export default function AiCreateOrderScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const setDraft = useAiOrderDraftStore((state) => state.setDraft);

  const [text, setText] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onExtract = async () => {
    setError(null);
    setLoading(true);
    try {
      const extracted = await extractOrderFromText(text);
      setDraft(extracted, customer?.id ?? null);
      router.push('/(app)/orders/ai-review');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="AI create order" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[typography.body, { color: colors.textMuted }]}>
          Paste or type the customer&apos;s request. AI will suggest the order details — you&apos;ll
          review and edit everything before it&apos;s created.
        </Text>

        <Input
          placeholder={
            'e.g. "Maria braucht am Freitag um 16 Uhr einen Geburtstagsstrauß für 75 €..."'
          }
          multiline
          numberOfLines={6}
          value={text}
          onChangeText={setText}
        />

        <View>
          <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
            Customer (optional)
          </Text>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={[
              styles.pickerRow,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Text style={[typography.body, { color: customer ? colors.text : colors.textSubtle }]}>
              {customer
                ? [customer.firstName, customer.lastName].filter(Boolean).join(' ')
                : 'No customer selected'}
            </Text>
          </Pressable>
        </View>

        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

        <Button
          label="Extract with AI"
          onPress={onExtract}
          loading={loading}
          disabled={text.trim().length === 0}
        />
      </ScrollView>

      <CustomerPickerSheet
        visible={pickerOpen}
        onSelect={setCustomer}
        onClose={() => setPickerOpen(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  pickerRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});
