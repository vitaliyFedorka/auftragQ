import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Input } from '@/components/ui/Input';
import { completeOnboarding } from '@/features/onboarding/api';
import {
  businessCategories,
  countries,
  onboardingSchema,
  type OnboardingInput,
} from '@/features/onboarding/schemas';
import { useSession } from '@/providers/SessionProvider';
import { useThemeColors } from '@/theme/useThemeColors';
import { spacing, typography } from '@/theme/tokens';
import { getErrorMessage } from '@/utils/errors';
import { useQueryClient } from '@tanstack/react-query';

export default function BusinessSetupScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { session } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: '',
      userName: '',
      businessCategory: 'florist',
      country: 'DE',
      currency: 'EUR',
      logoUrl: null,
    },
  });

  const country = useWatch({ control, name: 'country' });

  const onSelectCountry = (value: string) => {
    const match = countries.find((c) => c.value === value);
    setValue('country', value);
    if (match) setValue('currency', match.currency);
  };

  const onSubmit = async (values: OnboardingInput) => {
    if (!session) return;
    setSubmitError(null);
    try {
      await completeOnboarding(session.user.id, values);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.replace('/(app)/(tabs)');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.title, { color: colors.text }]}>Set up your business</Text>
      <Text
        style={[
          typography.body,
          { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl },
        ]}
      >
        This helps us tailor the app to how you work.
      </Text>

      <View style={{ gap: spacing.lg }}>
        <Controller
          control={control}
          name="businessName"
          render={({ field }) => (
            <Input
              label="Business name"
              placeholder="e.g. FLO.RISTA Flowers"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.businessName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="userName"
          render={({ field }) => (
            <Input
              label="Your name"
              placeholder="e.g. Anna Becker"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.userName?.message}
            />
          )}
        />

        <View>
          <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.sm }]}>
            Business category
          </Text>
          <Controller
            control={control}
            name="businessCategory"
            render={({ field }) => (
              <ChipGroup
                options={businessCategories}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </View>

        <View>
          <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.sm }]}>
            Country
          </Text>
          <ChipGroup options={countries} value={country} onChange={onSelectCountry} />
        </View>

        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <Input
              label="Currency"
              autoCapitalize="characters"
              maxLength={3}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.currency?.message}
            />
          )}
        />

        {submitError ? <Text style={{ color: colors.danger }}>{submitError}</Text> : null}
        <Button label="Finish setup" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
});
