import { z } from 'zod';

/**
 * Mirrors supabase/functions/_shared/aiProvider.ts's ExtractedOrder. AI output is never fully
 * trusted: every field falls back to a safe default instead of rejecting the whole response,
 * so a malformed or partial reply still produces a usable (if incomplete) draft order.
 */
const extractedOrderShape = z.object({
  customerName: z.string().nullable().catch(null),
  orderType: z.string().nullable().catch(null),
  title: z.string().catch('New order'),
  date: z.string().nullable().catch(null),
  time: z.string().nullable().catch(null),
  budget: z.number().nullable().catch(null),
  deliveryRequired: z.boolean().catch(false),
  deliveryAddress: z.string().nullable().catch(null),
  preferences: z.array(z.string()).catch([]),
  notes: z.string().nullable().catch(null),
});

export type ExtractedOrder = z.infer<typeof extractedOrderShape>;

const defaultExtractedOrder: ExtractedOrder = {
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
};

/** Falls back to a fully-default draft if the response isn't even an object (e.g. a network error body). */
export const extractedOrderSchema = extractedOrderShape.catch(defaultExtractedOrder);

export type ReplyTone = 'friendly' | 'professional' | 'short' | 'warm';

export const REPLY_TONE_OPTIONS: { value: ReplyTone; label: string }[] = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'short', label: 'Short' },
  { value: 'warm', label: 'Warm' },
];
