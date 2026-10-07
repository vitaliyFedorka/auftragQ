import { orderFormDefaults, type OrderInput } from '@/features/orders/schemas';

import type { ExtractedOrder } from './schemas';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

function buildNotes(extracted: ExtractedOrder): string {
  const parts: string[] = [];
  if (extracted.notes) parts.push(extracted.notes);
  if (extracted.preferences.length > 0)
    parts.push(`Preferences: ${extracted.preferences.join(', ')}`);
  return parts.join('\n');
}

export function extractedOrderToFormInput(
  extracted: ExtractedOrder,
  customerId: string | null,
): OrderInput {
  return {
    ...orderFormDefaults,
    customerId,
    title: extracted.title,
    orderType: extracted.orderType ?? '',
    date: extracted.date && ISO_DATE_PATTERN.test(extracted.date) ? extracted.date : null,
    startTime: extracted.time && TIME_PATTERN.test(extracted.time) ? extracted.time : null,
    price: extracted.budget != null ? String(extracted.budget) : orderFormDefaults.price,
    deliveryRequired: extracted.deliveryRequired,
    deliveryAddress: extracted.deliveryAddress ?? '',
    notes: buildNotes(extracted),
  };
}
