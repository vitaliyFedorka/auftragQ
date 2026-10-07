import { describe, expect, it } from 'vitest';

import { summarizeCustomerOrders } from '../orderStats';
import type { Order } from '@/types/models';

function makeOrder(overrides: Partial<Order>): Order {
  return {
    id: 'order-1',
    userId: 'user-1',
    customerId: 'customer-1',
    title: 'Bouquet',
    description: null,
    orderType: null,
    date: null,
    startTime: null,
    endTime: null,
    price: 60,
    deposit: 0,
    materialCost: 20,
    deliveryFee: 10,
    paymentStatus: 'unpaid',
    orderStatus: 'new',
    deliveryRequired: false,
    deliveryAddress: null,
    notes: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('summarizeCustomerOrders', () => {
  it('sums revenue (price + delivery fee) across all orders', () => {
    const orders = [
      makeOrder({ price: 60, deliveryFee: 10 }),
      makeOrder({ price: 40, deliveryFee: 0 }),
    ];
    const summary = summarizeCustomerOrders(orders, '2026-06-01');
    expect(summary.totalOrders).toBe(2);
    expect(summary.totalRevenue).toBe(110);
  });

  it('splits orders into previous and upcoming by date', () => {
    const orders = [
      makeOrder({ id: 'past', date: '2026-01-01' }),
      makeOrder({ id: 'today', date: '2026-06-01' }),
      makeOrder({ id: 'future', date: '2026-12-01' }),
    ];
    const summary = summarizeCustomerOrders(orders, '2026-06-01');
    expect(summary.previousOrders.map((o) => o.id)).toEqual(['past']);
    expect(summary.upcomingOrders.map((o) => o.id)).toEqual(['today', 'future']);
  });

  it('excludes undated orders from previous/upcoming but still counts them', () => {
    const orders = [makeOrder({ id: 'undated', date: null })];
    const summary = summarizeCustomerOrders(orders, '2026-06-01');
    expect(summary.totalOrders).toBe(1);
    expect(summary.previousOrders).toHaveLength(0);
    expect(summary.upcomingOrders).toHaveLength(0);
  });

  it('orders upcoming by soonest first and previous by most recent first', () => {
    const orders = [
      makeOrder({ id: 'future-2', date: '2026-12-01' }),
      makeOrder({ id: 'future-1', date: '2026-07-01' }),
      makeOrder({ id: 'past-1', date: '2026-02-01' }),
      makeOrder({ id: 'past-2', date: '2026-04-01' }),
    ];
    const summary = summarizeCustomerOrders(orders, '2026-06-01');
    expect(summary.upcomingOrders.map((o) => o.id)).toEqual(['future-1', 'future-2']);
    expect(summary.previousOrders.map((o) => o.id)).toEqual(['past-2', 'past-1']);
  });
});
