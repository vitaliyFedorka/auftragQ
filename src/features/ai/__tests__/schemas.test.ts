import { describe, expect, it } from 'vitest';

import { extractedOrderSchema } from '../schemas';

describe('extractedOrderSchema', () => {
  it('parses a well-formed AI response', () => {
    const result = extractedOrderSchema.parse({
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
    });
    expect(result.customerName).toBe('Maria');
    expect(result.budget).toBe(75);
    expect(result.preferences).toEqual(['pink', 'white']);
  });

  it('falls back to safe defaults for malformed fields instead of throwing', () => {
    const result = extractedOrderSchema.parse({
      customerName: 123, // wrong type
      orderType: null,
      title: null, // wrong type, title is required to be a string
      date: null,
      time: null,
      budget: 'seventy-five', // wrong type
      deliveryRequired: 'yes', // wrong type
      deliveryAddress: null,
      preferences: 'pink, white', // wrong type, should be an array
      notes: null,
    });
    expect(result.customerName).toBeNull();
    expect(result.title).toBe('New order');
    expect(result.budget).toBeNull();
    expect(result.deliveryRequired).toBe(false);
    expect(result.preferences).toEqual([]);
  });

  it('fills in missing fields entirely', () => {
    const result = extractedOrderSchema.parse({});
    expect(result).toEqual({
      customerName: null,
      orderType: null,
      title: 'New order',
      date: null,
      time: null,
      budget: null,
      deliveryRequired: false,
      deliveryAddress: null,
      preferences: [],
      notes: null,
    });
  });

  it('never throws, even for a completely unexpected shape', () => {
    expect(() => extractedOrderSchema.parse('not an object')).not.toThrow();
    expect(() => extractedOrderSchema.parse(null)).not.toThrow();
    expect(() => extractedOrderSchema.parse(42)).not.toThrow();
  });
});
