# Supabase schema

`migrations/0001_init.sql` creates `profiles`, `customers`, `orders`, `order_images`,
`notifications`, a private `order-images` storage bucket, and Row Level Security
policies scoping every row to `auth.uid()`.

## Apply it

Either:

- Paste the file into the Supabase Dashboard → SQL Editor → Run, or
- With the [Supabase CLI](https://supabase.com/docs/guides/cli) linked to your project:
  ```sh
  supabase link --project-ref <your-project-ref>
  supabase db push
  ```

After applying, copy your project URL and anon key into `.env` (see `.env.example`
at the repo root).

## AI Edge Functions

`functions/ai-extract-order` and `functions/ai-generate-reply` implement the
provider-independent `AIProvider` interface (`functions/_shared/aiProvider.ts`).
The mobile app never calls an AI provider directly — it invokes these functions,
which hold provider keys server-side. `functions/_shared/mockProvider.ts` is a
deterministic, regex-based extractor with no API key needed (good enough to
demo the whole flow for free); `functions/_shared/openaiProvider.ts` is a real
provider wired up but inert until a key is set.

Deploy them:

```sh
supabase functions deploy ai-extract-order
supabase functions deploy ai-generate-reply
```

Pick the provider with a secret (defaults to `mock` if unset):

```sh
supabase secrets set AI_PROVIDER=mock
# or, to use OpenAI:
supabase secrets set AI_PROVIDER=openai
supabase secrets set OPENAI_API_KEY=sk-...
```

Switching providers is just that secret — no client or function code changes.
To add Claude or Gemini later, implement `AIProvider` in a new
`functions/_shared/<provider>Provider.ts` and add it to the `getProvider()`
switch in both function `index.ts` files.
