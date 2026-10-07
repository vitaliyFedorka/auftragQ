import type { AIProvider, OrderSummaryInput, ReplyTone } from '../_shared/aiProvider.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { mockProvider } from '../_shared/mockProvider.ts';
import { openaiProvider } from '../_shared/openaiProvider.ts';

const VALID_TONES: ReplyTone[] = ['friendly', 'professional', 'short', 'warm'];

function getProvider(): AIProvider {
  const name = Deno.env.get('AI_PROVIDER') ?? 'mock';
  return name === 'openai' ? openaiProvider : mockProvider;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isOrderSummary(value: unknown): value is OrderSummaryInput {
  if (!value || typeof value !== 'object') return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.title === 'string' &&
    typeof order.price === 'number' &&
    typeof order.currency === 'string' &&
    (order.fulfillment === 'delivery' || order.fulfillment === 'pickup')
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { order, tone } = await req.json();
    if (!isOrderSummary(order)) {
      return jsonResponse({ error: 'order is required' }, 400);
    }
    if (!VALID_TONES.includes(tone)) {
      return jsonResponse({ error: `tone must be one of ${VALID_TONES.join(', ')}` }, 400);
    }

    const provider = getProvider();
    const reply = await provider.generateCustomerReply(order, tone);
    return jsonResponse({ reply });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
