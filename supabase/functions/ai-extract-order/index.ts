import type { AIProvider } from '../_shared/aiProvider.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { mockProvider } from '../_shared/mockProvider.ts';
import { openaiProvider } from '../_shared/openaiProvider.ts';

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (typeof text !== 'string' || text.trim().length === 0) {
      return jsonResponse({ error: 'text is required' }, 400);
    }

    const provider = getProvider();
    const result = await provider.extractOrderFromText(text);
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
