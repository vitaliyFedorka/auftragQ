import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { signIn } from '@/features/auth/api';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { useThemeColors } from '@/theme/useThemeColors';
import { spacing } from '@/theme/tokens';
import { getErrorMessage } from '@/utils/errors';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginInput) => {
    setSubmitError(null);
    try {
      await signIn(values.email, values.password);
      router.replace('/');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AuthScreenLayout title="Welcome back" subtitle="Sign in to manage your business">
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
      {submitError ? <Text style={{ color: colors.danger }}>{submitError}</Text> : null}
      <Button label="Log in" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      <Link
        href="/(auth)/forgot-password"
        style={{ color: colors.accent, textAlign: 'center', marginTop: spacing.sm }}
      >
        Forgot password?
      </Link>
      <Link
        href="/(auth)/register"
        style={{ color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg }}
      >
        Don&apos;t have an account? Sign up
      </Link>
    </AuthScreenLayout>
  );
}
