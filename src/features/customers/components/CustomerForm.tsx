import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { spacing } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

import { customerSchema, type CustomerInput } from '../schemas';

interface CustomerFormProps {
  defaultValues: CustomerInput;
  onSubmit: (input: CustomerInput) => Promise<void>;
  submitLabel: string;
  submitError: string | null;
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitError,
}: CustomerFormProps) {
  const colors = useThemeColors();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="firstName"
        render={({ field }) => (
          <Input
            label="First name"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.firstName?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field }) => (
          <Input label="Last name" value={field.value} onChangeText={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <Input
            label="Phone"
            keyboardType="phone-pad"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <Input label="Address" value={field.value} onChangeText={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <Input
            label="Notes"
            multiline
            numberOfLines={4}
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      {submitError ? <Text style={{ color: colors.danger }}>{submitError}</Text> : null}
      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
});
