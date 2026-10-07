import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useCustomer } from '@/features/customers/hooks';
import { extractedOrderToFormInput } from '@/features/ai/mapper';
import { useAiOrderDraftStore } from '@/features/ai/draftStore';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { useCreateOrder } from '@/features/orders/hooks';
import type { OrderInput } from '@/features/orders/schemas';
import { getErrorMessage } from '@/utils/errors';

export default function AiReviewOrderScreen() {
  const router = useRouter();
  const draft = useAiOrderDraftStore((state) => state.draft);
  const customerId = useAiOrderDraftStore((state) => state.customerId);
  const clearDraft = useAiOrderDraftStore((state) => state.clear);
  const { data: preselectedCustomer } = useCustomer(customerId ?? '');
  const createOrder = useCreateOrder();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!draft) {
    return <Redirect href="/(app)/orders/ai-create" />;
  }

  const onSubmit = async (input: OrderInput) => {
    setSubmitError(null);
    try {
      const order = await createOrder.mutateAsync(input);
      clearDraft();
      router.replace(`/(app)/orders/${order.id}`);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Review AI suggestion" />
      <OrderForm
        defaultValues={extractedOrderToFormInput(draft, customerId)}
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
