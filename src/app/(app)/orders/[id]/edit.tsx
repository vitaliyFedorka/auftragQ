import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { useOrder, useUpdateOrder } from '@/features/orders/hooks';
import { orderToFormInput, type OrderInput } from '@/features/orders/schemas';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';

export default function EditOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);
  const updateOrder = useUpdateOrder(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Edit order" />
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError || !order) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Edit order" />
        <ErrorState
          message={error ? getErrorMessage(error) : 'Order not found'}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const onSubmit = async (input: OrderInput) => {
    setSubmitError(null);
    try {
      await updateOrder.mutateAsync(input);
      router.back();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Edit order" />
      <OrderForm
        defaultValues={orderToFormInput(order)}
        initialCustomerName={order.customerName}
        onSubmit={onSubmit}
        submitLabel="Save changes"
        submitError={submitError}
      />
    </ScreenContainer>
  );
}
