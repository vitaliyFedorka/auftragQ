import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Share, StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { generateCustomerReply } from '@/features/ai/api';
import { REPLY_TONE_OPTIONS, type ReplyTone } from '@/features/ai/schemas';
import { useOrder } from '@/features/orders/hooks';
import { useSession } from '@/providers/SessionProvider';
import { spacing } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { calculateRevenue } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';

export default function GenerateReplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const { profile } = useSession();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);

  const [tone, setTone] = useState<ReplyTone>('friendly');
  const [reply, setReply] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Generate reply" />
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError || !order) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Generate reply" />
        <ErrorState
          message={error ? getErrorMessage(error) : 'Order not found'}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const currency = profile?.currency ?? 'EUR';

  const onGenerate = async () => {
    setGenerateError(null);
    setCopied(false);
    setGenerating(true);
    try {
      const text = await generateCustomerReply(
        {
          title: order.title,
          date: order.date,
          price: calculateRevenue(order.price, order.deliveryFee),
          currency,
          fulfillment: order.deliveryRequired ? 'delivery' : 'pickup',
        },
        tone,
      );
      setReply(text);
    } catch (err) {
      setGenerateError(getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  const onCopy = async () => {
    await Clipboard.setStringAsync(reply);
    setCopied(true);
  };

  const onShare = () => {
    Share.share({ message: reply });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Generate reply" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ChipGroup
          options={REPLY_TONE_OPTIONS}
          value={tone}
          onChange={(value) => setTone(value as ReplyTone)}
        />

        <Button
          label={reply ? 'Regenerate' : 'Generate'}
          onPress={onGenerate}
          loading={generating}
          variant="secondary"
        />

        {generateError ? <Text style={{ color: colors.danger }}>{generateError}</Text> : null}

        <Input
          label="Message"
          multiline
          numberOfLines={6}
          value={reply}
          onChangeText={(value) => {
            setReply(value);
            setCopied(false);
          }}
          placeholder="Generate a draft, then edit it before sending."
        />

        {reply ? (
          <>
            <Button label={copied ? 'Copied' : 'Copy'} onPress={onCopy} variant="secondary" />
            <Button label="Share" onPress={onShare} variant="ghost" />
          </>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
});
