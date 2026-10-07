import type { AIProvider, ExtractedOrder, OrderSummaryInput, ReplyTone } from './aiProvider.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini';

async function chatJSON(systemPrompt: string, userPrompt: string): Promise<unknown> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Set AI_PROVIDER=mock or add the secret.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned no content');
  return JSON.parse(content);
}

export const openaiProvider: AIProvider = {
  async extractOrderFromText(text) {
    const result = await chatJSON(
      'You extract structured order information from short customer messages for a small ' +
        'service business (florist, photographer, decorator, etc). Respond with strict JSON ' +
        'matching exactly this shape: {"customerName": string|null, "orderType": string|null, ' +
        '"title": string, "date": string|null (ISO YYYY-MM-DD), "time": string|null (HH:mm), ' +
        '"budget": number|null, "deliveryRequired": boolean, "deliveryAddress": string|null, ' +
        `"preferences": string[], "notes": string|null}. Today's date is ${new Date().toISOString().slice(0, 10)}; ` +
        'resolve relative dates (e.g. "Saturday", "tomorrow") against it.',
      text,
    );
    return result as ExtractedOrder;
  },

  async generateCustomerReply(order: OrderSummaryInput, tone: ReplyTone) {
    const result = await chatJSON(
      `Write a short customer-facing message confirming an order, in a ${tone} tone. ` +
        'Respond with strict JSON: {"reply": string}.',
      JSON.stringify(order),
    );
    return (result as { reply: string }).reply;
  },

  async summarizeConversation(messages: string[]) {
    const result = await chatJSON(
      'Summarize this customer conversation in 1-2 sentences. Respond with strict JSON: {"summary": string}.',
      messages.join('\n'),
    );
    return (result as { summary: string }).summary;
  },
};
