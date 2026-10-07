import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useCustomer } from '@/features/customers/hooks';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { useCreateOrder } from '@/features/orders/hooks';
import { orderFormDefaults, type OrderInput } from '@/features/orders/schemas';
import { getErrorMessage } from '@/utils/errors';

export default function NewOrderScreen() {
  const router = useRouter();
  const { customerId } = useLocalSearchParams<{ customerId?: string }>();
  const { data: preselectedCustomer } = useCustomer(customerId ?? '');
  const createOrder = useCreateOrder();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (input: OrderInput) => {
    setSubmitError(null);
    try {
      const order = await createOrder.mutateAsync(input);
      router.replace(`/(app)/orders/${order.id}`);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="New order" />
      <OrderForm
        defaultValues={{ ...orderFormDefaults, customerId: customerId ?? null }}
        initialCustomerName={
          preselectedCustomer
            ? [preselectedCustomer.firstName, preselectedCustomer.lastName]
                .filter(Boolean)
                .join(' ')
            : null
        }
        onSubmit={onSubmit}
        submitLabel="Create order"
        submitError={submitError}
      />
    </ScreenContainer>
  );
}
