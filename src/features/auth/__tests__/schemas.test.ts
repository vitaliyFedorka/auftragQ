import { describe, expect, it } from 'vitest';

import { loginSchema, registerSchema } from '../schemas';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'anna@flowershop.de', password: 'supersecret' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'supersecret' });
    expect(result.success).toBe(false);
  });

  it('rejects a short password', () => {
    const result = loginSchema.safeParse({ email: 'anna@flowershop.de', password: '123' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      email: 'anna@flowershop.de',
      password: 'supersecret',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });

  it('accepts matching passwords', () => {
    const result = registerSchema.safeParse({
      email: 'anna@flowershop.de',
      password: 'supersecret',
      confirmPassword: 'supersecret',
    });
    expect(result.success).toBe(true);
  });
});
