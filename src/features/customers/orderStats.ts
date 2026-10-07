import { calculateRevenue } from '@/utils/currency';
import type { Order } from '@/types/models';

export interface CustomerOrderSummary {
  totalOrders: number;
  totalRevenue: number;
  previousOrders: Order[];
  upcomingOrders: Order[];
}

/** Pure so it can be unit tested without touching Supabase. */
export function summarizeCustomerOrders(orders: Order[], todayIso: string): CustomerOrderSummary {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + calculateRevenue(order.price, order.deliveryFee),
    0,
  );

  const withDate = orders.filter((order): order is Order & { date: string } => Boolean(order.date));
  const previousOrders = withDate
    .filter((order) => order.date < todayIso)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const upcomingOrders = withDate
    .filter((order) => order.date >= todayIso)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return {
    totalOrders: orders.length,
    totalRevenue,
    previousOrders,
    upcomingOrders,
  };
}
