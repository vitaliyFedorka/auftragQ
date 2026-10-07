import { describe, expect, it } from 'vitest';

import { customerFormDefaults, customerSchema } from '../schemas';

describe('customerSchema', () => {
  it('requires a first name', () => {
    const result = customerSchema.safeParse({ ...customerFormDefaults, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('allows optional fields to stay empty', () => {
    const result = customerSchema.safeParse({ ...customerFormDefaults, firstName: 'Maria' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email when one is provided', () => {
    const result = customerSchema.safeParse({
      ...customerFormDefaults,
      firstName: 'Maria',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid email', () => {
    const result = customerSchema.safeParse({
      ...customerFormDefaults,
      firstName: 'Maria',
      email: 'maria@example.com',
    });
    expect(result.success).toBe(true);
  });
});
