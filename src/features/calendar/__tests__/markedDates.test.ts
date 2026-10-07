import { describe, expect, it } from 'vitest';

import { buildMarkedDates } from '../markedDates';
import { colors } from '@/theme/tokens';
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

describe('buildMarkedDates', () => {
  it('adds one dot per order on its date', () => {
    const orders = [
      makeOrder({ id: '1', date: '2026-06-01' }),
      makeOrder({ id: '2', date: '2026-06-01' }),
    ];
    const marked = buildMarkedDates(orders, colors.light);
    expect(marked['2026-06-01'].dots).toHaveLength(2);
  });

  it('ignores undated orders', () => {
    const marked = buildMarkedDates([makeOrder({ date: null })], colors.light);
    expect(Object.keys(marked)).toHaveLength(0);
  });

  it('caps dots at 4 per date', () => {
    const orders = Array.from({ length: 6 }, (_, i) =>
      makeOrder({ id: `o${i}`, date: '2026-06-01' }),
    );
    const marked = buildMarkedDates(orders, colors.light);
    expect(marked['2026-06-01'].dots).toHaveLength(4);
  });

  it('marks the selected date even with no orders', () => {
    const marked = buildMarkedDates([], colors.light, '2026-06-01');
    expect(marked['2026-06-01'].selected).toBe(true);
  });

  it('keeps dots when the selected date also has orders', () => {
    const marked = buildMarkedDates(
      [makeOrder({ date: '2026-06-01' })],
      colors.light,
      '2026-06-01',
    );
    expect(marked['2026-06-01'].selected).toBe(true);
    expect(marked['2026-06-01'].dots).toHaveLength(1);
  });
});
