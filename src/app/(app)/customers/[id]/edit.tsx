import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { useCustomer, useUpdateCustomer } from '@/features/customers/hooks';
import type { CustomerInput } from '@/features/customers/schemas';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { data: customer, isLoading, isError, error, refetch } = useCustomer(id);
  const updateCustomer = useUpdateCustomer(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Edit customer" />
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError || !customer) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Edit customer" />
        <ErrorState
          message={error ? getErrorMessage(error) : 'Customer not found'}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const onSubmit = async (input: CustomerInput) => {
    setSubmitError(null);
    try {
      await updateCustomer.mutateAsync(input);
      router.back();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Edit customer" />
      <CustomerForm
        defaultValues={{
          firstName: customer.firstName,
          lastName: customer.lastName ?? '',
          phone: customer.phone ?? '',
          email: customer.email ?? '',
          address: customer.address ?? '',
          notes: customer.notes ?? '',
        }}
        onSubmit={onSubmit}
        submitLabel="Save changes"
        submitError={submitError}
      />
    </ScreenContainer>
  );
}
