import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { updatePassword } from '@/features/auth/api';
import { supabase } from '@/lib/supabase/client';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Supabase's recovery link appends `#access_token=...&refresh_token=...` to the redirect URL. */
function useRecoverySession() {
  const url = Linking.useURL();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    const hash = url.split('#')[1];
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) return;

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: setError_ }) => {
        if (setError_) setError(getErrorMessage(setError_));
        setReady(true);
      });
  }, [url]);

  return { ready, error };
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { ready, error: sessionError } = useRecoverySession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setSubmitError(null);
    try {
      await updatePassword(values.password);
      router.replace('/(auth)/login');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AuthScreenLayout title="Set a new password" subtitle="Choose a new password for your account">
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="New password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
          />
        )}
      />
      {submitError || sessionError ? (
        <Text style={{ color: colors.danger }}>{submitError ?? sessionError}</Text>
      ) : null}
      <Button
        label="Update password"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={!ready}
      />
    </AuthScreenLayout>
  );
}
