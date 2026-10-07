import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/providers/SessionProvider';
import type { OrderStatus, PaymentStatus } from '@/types/models';

import {
  createOrder,
  deleteOrder,
  getOrder,
  listOrders,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from './api';
import type { OrderInput } from './schemas';

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: listOrders });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: ['orders', id], queryFn: () => getOrder(id), enabled: !!id });
}

function useInvalidateOrders(id?: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['orders', id] });
    queryClient.invalidateQueries({ queryKey: ['orders', 'byCustomer'] });
  };
}

export function useCreateOrder() {
  const invalidate = useInvalidateOrders();
  const { session } = useSession();

  return useMutation({
    mutationFn: (input: OrderInput) => {
      if (!session) throw new Error('Not signed in');
      return createOrder(session.user.id, input);
    },
    onSuccess: invalidate,
  });
}

export function useUpdateOrder(id: string) {
  const invalidate = useInvalidateOrders(id);
  return useMutation({
    mutationFn: (input: OrderInput) => updateOrder(id, input),
    onSuccess: invalidate,
  });
}

export function useUpdateOrderStatus(id: string) {
  const invalidate = useInvalidateOrders(id);
  return useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useUpdatePaymentStatus(id: string) {
  const invalidate = useInvalidateOrders(id);
  return useMutation({
    mutationFn: (status: PaymentStatus) => updatePaymentStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteOrder() {
  const invalidate = useInvalidateOrders();
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: invalidate,
  });
}
