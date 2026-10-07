import { describe, expect, it } from 'vitest';

import { extractedOrderToFormInput } from '../mapper';
import type { ExtractedOrder } from '../schemas';

function makeExtracted(overrides: Partial<ExtractedOrder> = {}): ExtractedOrder {
  return {
    customerName: 'Maria',
    orderType: 'Birthday bouquet',
    title: 'Birthday bouquet for Maria',
    date: '2026-06-20',
    time: '16:00',
    budget: 75,
    deliveryRequired: true,
    deliveryAddress: 'Minden',
    preferences: ['pink', 'white'],
    notes: null,
    ...overrides,
  };
}

describe('extractedOrderToFormInput', () => {
  it('maps a well-formed extraction onto the order form', () => {
    const input = extractedOrderToFormInput(makeExtracted(), 'customer-1');
    expect(input.customerId).toBe('customer-1');
    expect(input.title).toBe('Birthday bouquet for Maria');
    expect(input.date).toBe('2026-06-20');
    expect(input.startTime).toBe('16:00');
    expect(input.price).toBe('75');
    expect(input.deliveryRequired).toBe(true);
    expect(input.deliveryAddress).toBe('Minden');
    expect(input.notes).toBe('Preferences: pink, white');
  });

  it('discards a malformed date or time rather than passing it through', () => {
    const input = extractedOrderToFormInput(
      makeExtracted({ date: 'Saturday', time: 'afternoon' }),
      null,
    );
    expect(input.date).toBeNull();
    expect(input.startTime).toBeNull();
  });

  it('falls back to the default price when no budget was extracted', () => {
    const input = extractedOrderToFormInput(makeExtracted({ budget: null }), null);
    expect(input.price).toBe('0');
  });

  it('combines notes and preferences when both are present', () => {
    const input = extractedOrderToFormInput(makeExtracted({ notes: 'Allergic to lilies' }), null);
    expect(input.notes).toBe('Allergic to lilies\nPreferences: pink, white');
  });
});
