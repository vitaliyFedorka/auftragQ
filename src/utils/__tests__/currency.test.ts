import { describe, expect, it } from 'vitest';

import { calculateEstimatedProfit, calculateRevenue, formatCurrency } from '../currency';

describe('calculateRevenue', () => {
  it('adds price and delivery fee', () => {
    expect(calculateRevenue(60, 10)).toBe(70);
  });

  it('handles zero delivery fee', () => {
    expect(calculateRevenue(45, 0)).toBe(45);
  });
});

describe('calculateEstimatedProfit', () => {
  it('subtracts material cost from revenue', () => {
    expect(calculateEstimatedProfit(60, 10, 25)).toBe(45);
  });

  it('can be negative when material cost exceeds revenue', () => {
    expect(calculateEstimatedProfit(20, 0, 30)).toBe(-10);
  });
});

describe('formatCurrency', () => {
  it('formats EUR amounts for German locale', () => {
    expect(formatCurrency(70, 'EUR', 'de-DE')).toContain('70');
  });
});
