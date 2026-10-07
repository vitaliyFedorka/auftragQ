import { describe, expect, it } from 'vitest';

import { filterOrders } from '../filters';
import type { Order } from '@/types/models';

function makeOrder(overrides: Partial<Order>): Order {
  return {
    id: 'order-1',
    userId: 'user-1',
    customerId: null,
    title: 'Bouquet',
    description: null,
    orderType: null,
    date: null,
    startTime: null,
    endTime: null,
    price: 50,
    deposit: 0,
    materialCost: 10,
    deliveryFee: 0,
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

const today = '2026-06-01';

describe('filterOrders', () => {
  const orders = [
    makeOrder({ id: 'today', date: today }),
    makeOrder({ id: 'future', date: '2026-07-01' }),
    makeOrder({ id: 'past', date: '2026-01-01' }),
    makeOrder({ id: 'completed', orderStatus: 'completed', date: '2026-01-01' }),
    makeOrder({ id: 'unpaid', paymentStatus: 'unpaid', date: null }),
    makeOrder({ id: 'paid', paymentStatus: 'paid', date: null }),
  ];

  it('today: only orders dated today', () => {
    expect(filterOrders(orders, 'today', today).map((o) => o.id)).toEqual(['today']);
  });

  it('upcoming: only orders strictly after today', () => {
    expect(filterOrders(orders, 'upcoming', today).map((o) => o.id)).toEqual(['future']);
  });

  it('completed: only completed orders regardless of date', () => {
    expect(filterOrders(orders, 'completed', today).map((o) => o.id)).toEqual(['completed']);
  });

  it('unpaid: only unpaid orders', () => {
    expect(filterOrders(orders, 'unpaid', today).map((o) => o.id)).toContain('unpaid');
    expect(filterOrders(orders, 'unpaid', today).map((o) => o.id)).not.toContain('paid');
  });

  it('all: every order', () => {
    expect(filterOrders(orders, 'all', today)).toHaveLength(orders.length);
  });
});
