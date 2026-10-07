import { describe, expect, it } from 'vitest';

import { groupOrdersByDate } from '../agenda';
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

describe('groupOrdersByDate', () => {
  it('groups orders by date, sorted ascending, excluding undated orders', () => {
    const orders = [
      makeOrder({ id: 'b', date: '2026-06-02' }),
      makeOrder({ id: 'a1', date: '2026-06-01' }),
      makeOrder({ id: 'undated', date: null }),
      makeOrder({ id: 'a2', date: '2026-06-01' }),
    ];

    const sections = groupOrdersByDate(orders);

    expect(sections.map((s) => s.date)).toEqual(['2026-06-01', '2026-06-02']);
    expect(sections[0].orders.map((o) => o.id)).toEqual(['a1', 'a2']);
    expect(sections[1].orders.map((o) => o.id)).toEqual(['b']);
  });

  it('returns an empty array when nothing has a date', () => {
    expect(groupOrdersByDate([makeOrder({ date: null })])).toEqual([]);
  });
});
