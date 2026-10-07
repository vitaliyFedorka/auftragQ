import { filterOrders } from '@/features/orders/filters';
import { calculateEstimatedProfit, calculateRevenue } from '@/utils/currency';
import type { Order } from '@/types/models';

export interface TodaySummary {
  revenue: number;
  orderCount: number;
  unpaidCount: number;
  deliveryCount: number;
}

export interface MonthSummary {
  revenue: number;
  costs: number;
  profit: number;
}

/** Pure so it can be unit tested without touching Supabase. */
export function getTodaySummary<T extends Order>(orders: T[], todayIso: string): TodaySummary {
  const todayOrders = filterOrders(orders, 'today', todayIso);
  return {
    revenue: todayOrders.reduce(
      (sum, order) => sum + calculateRevenue(order.price, order.deliveryFee),
      0,
    ),
    orderCount: todayOrders.length,
    unpaidCount: todayOrders.filter((order) => order.paymentStatus === 'unpaid').length,
    deliveryCount: todayOrders.filter((order) => order.deliveryRequired).length,
  };
}

/** `monthIso` is a `YYYY-MM` prefix; orders without a date are excluded. */
export function getMonthSummary<T extends Order>(orders: T[], monthIso: string): MonthSummary {
  const monthOrders = orders.filter((order) => order.date?.startsWith(monthIso));
  const revenue = monthOrders.reduce(
    (sum, order) => sum + calculateRevenue(order.price, order.deliveryFee),
    0,
  );
  const costs = monthOrders.reduce((sum, order) => sum + order.materialCost, 0);
  const profit = monthOrders.reduce(
    (sum, order) =>
      sum + calculateEstimatedProfit(order.price, order.deliveryFee, order.materialCost),
    0,
  );
  return { revenue, costs, profit };
}

/** Orders scheduled on or before today that are still unconfirmed or unpaid. */
export function getOrdersRequiringAttention<T extends Order>(orders: T[], todayIso: string): T[] {
  return orders.filter((order) => {
    if (!order.date || order.date > todayIso) return false;
    if (order.orderStatus === 'cancelled' || order.orderStatus === 'completed') return false;
    return order.orderStatus === 'new' || order.paymentStatus === 'unpaid';
  });
}

export function getUpcomingAppointments<T extends Order>(
  orders: T[],
  todayIso: string,
  limit = 5,
): T[] {
  return filterOrders(orders, 'upcoming', todayIso)
    .sort((a, b) => ((a.date ?? '') < (b.date ?? '') ? -1 : 1))
    .slice(0, limit);
}
