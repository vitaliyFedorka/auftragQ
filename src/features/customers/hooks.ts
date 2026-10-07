import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/providers/SessionProvider';

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  listOrdersForCustomer,
  updateCustomer,
} from './api';
import type { CustomerInput } from './schemas';

export function useCustomers() {
  return useQuery({ queryKey: ['customers'], queryFn: listCustomers });
}

export function useCustomer(id: string) {
  return useQuery({ queryKey: ['customers', id], queryFn: () => getCustomer(id), enabled: !!id });
}

export function useCustomerOrders(customerId: string) {
  return useQuery({
    queryKey: ['orders', 'byCustomer', customerId],
    queryFn: () => listOrdersForCustomer(customerId),
    enabled: !!customerId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (input: CustomerInput) => {
      if (!session) throw new Error('Not signed in');
      return createCustomer(session.user.id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CustomerInput) => updateCustomer(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
