import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { requestPasswordReset } from '@/features/auth/api';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas';
import { useThemeColors } from '@/theme/useThemeColors';
import { spacing } from '@/theme/tokens';
import { getErrorMessage } from '@/utils/errors';

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setSubmitError(null);
    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  if (sent) {
    return (
      <AuthScreenLayout
        title="Check your email"
        subtitle="We sent you a link to reset your password."
      >
        <Link href="/(auth)/login" style={{ color: colors.accent, textAlign: 'center' }}>
          Back to login
        </Link>
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      title="Reset password"
      subtitle="We'll email you a link to reset your password"
    >
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
          />
        )}
      />
      {submitError ? <Text style={{ color: colors.danger }}>{submitError}</Text> : null}
      <Button label="Send reset link" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      <Link
        href="/(auth)/login"
        style={{ color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg }}
      >
        Back to login
      </Link>
    </AuthScreenLayout>
  );
}
