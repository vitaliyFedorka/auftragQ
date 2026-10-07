/**
 * Provider-independent AI interface. Swap `mockProvider` for `openaiProvider` (or a future
 * Claude/Gemini provider) by setting the AI_PROVIDER secret — callers never change.
 */

export interface ExtractedOrder {
  customerName: string | null;
  orderType: string | null;
  title: string;
  date: string | null;
  time: string | null;
  budget: number | null;
  deliveryRequired: boolean;
  deliveryAddress: string | null;
  preferences: string[];
  notes: string | null;
}

export type ReplyTone = 'friendly' | 'professional' | 'short' | 'warm';

export interface OrderSummaryInput {
  title: string;
  date: string | null;
  price: number;
  currency: string;
  fulfillment: 'delivery' | 'pickup';
}

export interface AIProvider {
  extractOrderFromText(text: string): Promise<ExtractedOrder>;
  generateCustomerReply(order: OrderSummaryInput, tone: ReplyTone): Promise<string>;
  summarizeConversation(messages: string[]): Promise<string>;
}
