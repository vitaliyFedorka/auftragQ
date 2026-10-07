import { supabase } from '@/lib/supabase/client';

import { extractedOrderSchema, type ExtractedOrder, type ReplyTone } from './schemas';

/**
 * The app never calls an AI provider directly — every request goes through a Supabase Edge
 * Function so provider keys stay server-side. See supabase/functions/ai-extract-order and
 * supabase/functions/_shared/aiProvider.ts.
 */
export async function extractOrderFromText(text: string): Promise<ExtractedOrder> {
  const { data, error } = await supabase.functions.invoke('ai-extract-order', { body: { text } });
  if (error) throw error;
  return extractedOrderSchema.parse(data);
}

export interface ReplyOrderSummary {
  title: string;
  date: string | null;
  price: number;
  currency: string;
  fulfillment: 'delivery' | 'pickup';
}

export async function generateCustomerReply(
  order: ReplyOrderSummary,
  tone: ReplyTone,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-generate-reply', {
    body: { order, tone },
  });
  if (error) throw error;
  const reply = data?.reply;
  if (typeof reply !== 'string') throw new Error('AI did not return a reply.');
  return reply;
}
