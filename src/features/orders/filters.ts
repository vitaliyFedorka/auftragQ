import type { Order } from '@/types/models';

export type OrderFilter = 'today' | 'upcoming' | 'completed' | 'unpaid' | 'all';

export const ORDER_FILTER_OPTIONS: { value: OrderFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'all', label: 'All' },
];

/** Pure so it can be unit tested without touching Supabase. */
export function filterOrders<T extends Order>(
  orders: T[],
  filter: OrderFilter,
  todayIso: string,
): T[] {
  switch (filter) {
    case 'today':
      return orders.filter((order) => order.date === todayIso);
    case 'upcoming':
      return orders.filter((order) => order.date !== null && order.date > todayIso);
    case 'completed':
      return orders.filter((order) => order.orderStatus === 'completed');
    case 'unpaid':
      return orders.filter((order) => order.paymentStatus === 'unpaid');
    case 'all':
      return orders;
  }
}
