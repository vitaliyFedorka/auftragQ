import type { Order } from '@/types/models';

export interface AgendaSection<T extends Order> {
  date: string;
  orders: T[];
}

/** Pure so it can be unit tested without touching Supabase. Orders without a date are excluded. */
export function groupOrdersByDate<T extends Order>(orders: T[]): AgendaSection<T>[] {
  const byDate = new Map<string, T[]>();

  for (const order of orders) {
    if (!order.date) continue;
    const existing = byDate.get(order.date);
    if (existing) {
      existing.push(order);
    } else {
      byDate.set(order.date, [order]);
    }
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, dateOrders]) => ({ date, orders: dateOrders }));
}
