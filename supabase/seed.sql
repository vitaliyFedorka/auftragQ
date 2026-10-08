-- Demo data for FLO.RISTA Flowers.
-- Run in the Supabase SQL Editor AFTER creating a test user (Authentication > Users).
-- Replace the email below with your test user's email, then run.

do $$
declare
  demo_user_id uuid;
  anna_id uuid;
  maria_id uuid;
  julia_id uuid;
begin
  select id into demo_user_id from auth.users where email = 'demo@auftragq.test';

  if demo_user_id is null then
    raise exception 'No user found with that email. Create the test user first, then re-run this script.';
  end if;

  -- Profile / onboarding
  insert into public.profiles (id, business_name, user_name, business_category, currency, country, onboarding_completed)
  values (demo_user_id, 'FLO.RISTA Flowers', 'Anna Fleurist', 'florist', 'EUR', 'DE', true)
  on conflict (id) do update set
    business_name = excluded.business_name,
    user_name = excluded.user_name,
    business_category = excluded.business_category,
    currency = excluded.currency,
    country = excluded.country,
    onboarding_completed = true;

  -- Customers
  insert into public.customers (id, user_id, first_name, last_name, phone, email, address, notes)
  values (gen_random_uuid(), demo_user_id, 'Anna', 'Becker', '+49 170 1234567', 'anna.becker@example.com', 'Hauptstraße 12, 10115 Berlin', 'Prefers pastel colors')
  returning id into anna_id;

  insert into public.customers (id, user_id, first_name, last_name, phone, email, address, notes)
  values (gen_random_uuid(), demo_user_id, 'Maria', 'Schulz', '+49 171 2345678', 'maria.schulz@example.com', 'Bahnhofstraße 5, 32423 Minden', null)
  returning id into maria_id;

  insert into public.customers (id, user_id, first_name, last_name, phone, email, address, notes)
  values (gen_random_uuid(), demo_user_id, 'Julia', 'Hoffmann', '+49 172 3456789', 'julia.hoffmann@example.com', 'Lindenallee 8, 80331 München', 'Regular customer, orders monthly')
  returning id into julia_id;

  -- Orders
  insert into public.orders (
    user_id, customer_id, title, description, order_type, date, start_time, end_time,
    price, deposit, material_cost, delivery_fee, payment_status, order_status,
    delivery_required, delivery_address, notes
  )
  values
    (demo_user_id, anna_id, 'Wedding bouquet', 'White and green roses, eucalyptus accents', 'Wedding bouquet',
     current_date + 5, '11:00', '12:00', 180, 50, 60, 0, 'partially_paid', 'confirmed', false, null, 'Pickup at the shop'),
    (demo_user_id, maria_id, 'Birthday bouquet', 'Pink and white flowers, ribbon', 'Birthday bouquet',
     current_date + 2, '16:00', null, 75, 0, 20, 10, 'unpaid', 'new', true, 'Bahnhofstraße 5, 32423 Minden', 'Delivery requested around 4pm'),
    (demo_user_id, julia_id, 'Table decoration', '6x centerpieces for dinner event', 'Table decoration',
     current_date - 3, '09:00', '10:00', 220, 100, 70, 15, 'paid', 'completed', true, 'Lindenallee 8, 80331 München', null),
    (demo_user_id, null, 'Flower basket', 'Seasonal mixed flower basket', 'Flower basket',
     current_date, '14:00', null, 55, 0, 18, 0, 'unpaid', 'new', false, null, 'Walk-in customer, no profile yet');
end $$;
