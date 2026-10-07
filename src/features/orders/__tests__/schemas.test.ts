import { describe, expect, it } from 'vitest';

import { orderFormDefaults, orderSchema } from '../schemas';

describe('orderSchema', () => {
  it('requires a title', () => {
    const result = orderSchema.safeParse({ ...orderFormDefaults, title: '' });
    expect(result.success).toBe(false);
  });

  it('accepts a minimal valid order', () => {
    const result = orderSchema.safeParse({ ...orderFormDefaults, title: 'Birthday bouquet' });
    expect(result.success).toBe(true);
  });

  it('rejects a non-numeric price', () => {
    const result = orderSchema.safeParse({ ...orderFormDefaults, title: 'Bouquet', price: 'abc' });
    expect(result.success).toBe(false);
  });

  it('rejects a negative-looking price format', () => {
    const result = orderSchema.safeParse({ ...orderFormDefaults, title: 'Bouquet', price: '-10' });
    expect(result.success).toBe(false);
  });

  it('requires a delivery address when delivery is required', () => {
    const result = orderSchema.safeParse({
      ...orderFormDefaults,
      title: 'Bouquet',
      deliveryRequired: true,
      deliveryAddress: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts delivery orders with an address', () => {
    const result = orderSchema.safeParse({
      ...orderFormDefaults,
      title: 'Bouquet',
      deliveryRequired: true,
      deliveryAddress: 'Hauptstrasse 1, Minden',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a deposit greater than the price', () => {
    const result = orderSchema.safeParse({
      ...orderFormDefaults,
      title: 'Bouquet',
      price: '50',
      deposit: '80',
    });
    expect(result.success).toBe(false);
  });

  it('allows a deposit equal to the price', () => {
    const result = orderSchema.safeParse({
      ...orderFormDefaults,
      title: 'Bouquet',
      price: '50',
      deposit: '50',
    });
    expect(result.success).toBe(true);
  });
});
