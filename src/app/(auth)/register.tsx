import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { signUp } from '@/features/auth/api';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas';
import { useThemeColors } from '@/theme/useThemeColors';
import { spacing } from '@/theme/tokens';
import { getErrorMessage } from '@/utils/errors';

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterInput) => {
    setSubmitError(null);
    try {
      await signUp(values.email, values.password);
      router.replace('/');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AuthScreenLayout title="Create your account" subtitle="Set up your business in a few minutes">
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
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Password"
            secureTextEntry
            autoComplete="password"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <Input
            label="Confirm password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={errors.confirmPassword?.message}
          />
        )}
      />
      {submitError ? <Text style={{ color: colors.danger }}>{submitError}</Text> : null}
      <Button label="Create account" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      <Link
        href="/(auth)/login"
        style={{ color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg }}
      >
        Already have an account? Log in
      </Link>
    </AuthScreenLayout>
  );
}
