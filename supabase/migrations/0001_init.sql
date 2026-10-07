-- auftragQ initial schema: profiles, customers, orders, order_images, notifications.
-- All tables are scoped to auth.uid() via Row Level Security — a user can only ever
-- see or modify their own data.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  business_name text,
  user_name text,
  business_category text,
  currency text not null default 'EUR',
  country text,
  logo_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create an (incomplete) profile row the moment a user signs up, so
-- onboarding always has a row to upsert into.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create index customers_user_id_idx on public.customers (user_id);

alter table public.customers enable row level security;

create policy "customers: select own" on public.customers
  for select using (auth.uid() = user_id);
create policy "customers: insert own" on public.customers
  for insert with check (auth.uid() = user_id);
create policy "customers: update own" on public.customers
  for update using (auth.uid() = user_id);
create policy "customers: delete own" on public.customers
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  title text not null,
  description text,
  order_type text,
  date date,
  start_time time,
  end_time time,
  price numeric(10, 2) not null default 0,
  deposit numeric(10, 2) not null default 0,
  material_cost numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'partially_paid', 'paid')),
  order_status text not null default 'new'
    check (order_status in ('new', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled')),
  delivery_required boolean not null default false,
  delivery_address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_customer_id_idx on public.orders (customer_id);
create index orders_date_idx on public.orders (date);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

create policy "orders: select own" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders: insert own" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders: update own" on public.orders
  for update using (auth.uid() = user_id);
create policy "orders: delete own" on public.orders
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- order_images
-- ---------------------------------------------------------------------------
create table public.order_images (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index order_images_order_id_idx on public.order_images (order_id);

alter table public.order_images enable row level security;

create policy "order_images: select own" on public.order_images
  for select using (auth.uid() = user_id);
create policy "order_images: insert own" on public.order_images
  for insert with check (auth.uid() = user_id);
create policy "order_images: delete own" on public.order_images
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  order_id uuid references public.orders (id) on delete cascade,
  type text not null,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);

alter table public.notifications enable row level security;

create policy "notifications: select own" on public.notifications
  for select using (auth.uid() = user_id);
create policy "notifications: insert own" on public.notifications
  for insert with check (auth.uid() = user_id);
create policy "notifications: update own" on public.notifications
  for update using (auth.uid() = user_id);
create policy "notifications: delete own" on public.notifications
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- storage: order images bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('order-images', 'order-images', false)
on conflict (id) do nothing;

create policy "order-images: read own" on storage.objects
  for select using (bucket_id = 'order-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "order-images: upload own" on storage.objects
  for insert with check (bucket_id = 'order-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "order-images: delete own" on storage.objects
  for delete using (bucket_id = 'order-images' and (storage.foldername(name))[1] = auth.uid()::text);
