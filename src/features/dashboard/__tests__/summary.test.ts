import { describe, expect, it } from 'vitest';

import {
  getMonthSummary,
  getOrdersRequiringAttention,
  getTodaySummary,
  getUpcomingAppointments,
} from '../summary';
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
    materialCost: 15,
    deliveryFee: 5,
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

const today = '2026-06-15';

describe('getTodaySummary', () => {
  it('matches the spec example: revenue, order count, unpaid count, delivery count', () => {
    const orders = [
      makeOrder({
        id: '1',
        date: today,
        price: 200,
        deliveryFee: 0,
        paymentStatus: 'paid',
        deliveryRequired: true,
      }),
      makeOrder({
        id: '2',
        date: today,
        price: 150,
        deliveryFee: 10,
        paymentStatus: 'unpaid',
        deliveryRequired: true,
      }),
      makeOrder({
        id: '3',
        date: today,
        price: 70,
        deliveryFee: 0,
        paymentStatus: 'paid',
        deliveryRequired: false,
      }),
      makeOrder({ id: 'other-day', date: '2026-06-16', price: 1000 }),
    ];
    const summary = getTodaySummary(orders, today);
    expect(summary.orderCount).toBe(3);
    expect(summary.revenue).toBe(430);
    expect(summary.unpaidCount).toBe(1);
    expect(summary.deliveryCount).toBe(2);
  });

  it('is all zeros when there are no orders today', () => {
    expect(getTodaySummary([makeOrder({ date: '2026-01-01' })], today)).toEqual({
      revenue: 0,
      orderCount: 0,
      unpaidCount: 0,
      deliveryCount: 0,
    });
  });
});

describe('getMonthSummary', () => {
  it('sums revenue, costs and profit for orders in the given month', () => {
    const orders = [
      makeOrder({ date: '2026-06-01', price: 100, deliveryFee: 10, materialCost: 30 }),
      makeOrder({ date: '2026-06-20', price: 50, deliveryFee: 0, materialCost: 10 }),
      makeOrder({ date: '2026-07-01', price: 999, materialCost: 999 }),
      makeOrder({ date: null, price: 999, materialCost: 999 }),
    ];
    const summary = getMonthSummary(orders, '2026-06');
    expect(summary.revenue).toBe(160);
    expect(summary.costs).toBe(40);
    expect(summary.profit).toBe(120);
  });
});

describe('getOrdersRequiringAttention', () => {
  it('flags unconfirmed or unpaid orders scheduled on or before today', () => {
    const orders = [
      makeOrder({
        id: 'new-overdue',
        date: '2026-06-10',
        orderStatus: 'new',
        paymentStatus: 'paid',
      }),
      makeOrder({
        id: 'unpaid-today',
        date: today,
        orderStatus: 'confirmed',
        paymentStatus: 'unpaid',
      }),
      makeOrder({
        id: 'future-new',
        date: '2026-07-01',
        orderStatus: 'new',
        paymentStatus: 'paid',
      }),
      makeOrder({
        id: 'cancelled',
        date: '2026-06-01',
        orderStatus: 'cancelled',
        paymentStatus: 'unpaid',
      }),
      makeOrder({
        id: 'completed-unpaid',
        date: '2026-06-01',
        orderStatus: 'completed',
        paymentStatus: 'unpaid',
      }),
      makeOrder({
        id: 'fine',
        date: '2026-06-01',
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
      }),
    ];
    const result = getOrdersRequiringAttention(orders, today).map((o) => o.id);
    expect(result).toEqual(['new-overdue', 'unpaid-today']);
  });
});

describe('getUpcomingAppointments', () => {
  it('returns future orders soonest-first, limited', () => {
    const orders = [
      makeOrder({ id: 'far', date: '2026-08-01' }),
      makeOrder({ id: 'near', date: '2026-06-20' }),
      makeOrder({ id: 'mid', date: '2026-07-01' }),
    ];
    const result = getUpcomingAppointments(orders, today, 2).map((o) => o.id);
    expect(result).toEqual(['near', 'mid']);
  });
});
