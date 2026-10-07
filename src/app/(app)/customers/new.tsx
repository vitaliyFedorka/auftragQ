import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { useCreateCustomer } from '@/features/customers/hooks';
import { customerFormDefaults, type CustomerInput } from '@/features/customers/schemas';
import { getErrorMessage } from '@/utils/errors';

export default function NewCustomerScreen() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (input: CustomerInput) => {
    setSubmitError(null);
    try {
      const customer = await createCustomer.mutateAsync(input);
      router.replace(`/(app)/customers/${customer.id}`);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="New customer" />
      <CustomerForm
        defaultValues={customerFormDefaults}
        onSubmit={onSubmit}
        submitLabel="Add customer"
        submitError={submitError}
      />
    </ScreenContainer>
  );
}
