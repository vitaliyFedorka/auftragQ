export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'de-DE',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateRevenue(price: number, deliveryFee: number): number {
  return price + deliveryFee;
}

export function calculateEstimatedProfit(
  price: number,
  deliveryFee: number,
  materialCost: number,
): number {
  return calculateRevenue(price, deliveryFee) - materialCost;
}
