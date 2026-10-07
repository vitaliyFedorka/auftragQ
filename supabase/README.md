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
