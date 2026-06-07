create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('customer', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  collection text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  rating numeric(2, 1) not null default 4.5 check (rating >= 0 and rating <= 5),
  colors text[] not null default '{}',
  sizes text[] not null default '{S,M,L,XL}',
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  is_featured boolean not null default false,
  is_worldcup boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1 check (quantity > 0),
  size text,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  shipping_address jsonb,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  payment_status text not null default 'unpaid',
  order_status text not null default 'pending',
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Home',
  full_name text not null,
  phone text not null,
  city text not null,
  area text,
  address_line text not null,
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
    and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.addresses enable row level security;
alter table public.newsletter_signups enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Anyone reads active products" on public.products;
drop policy if exists "Anyone can read active products" on public.products;
drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Users manage own carts" on public.carts;
drop policy if exists "Users manage own cart items" on public.cart_items;
drop policy if exists "Users read own orders" on public.orders;
drop policy if exists "Users create own orders" on public.orders;
drop policy if exists "Admins update orders" on public.orders;
drop policy if exists "Users read own order events" on public.order_events;
drop policy if exists "Users read own order progress" on public.order_events;
drop policy if exists "Users create own order events" on public.order_events;
drop policy if exists "Admins create order events" on public.order_events;
drop policy if exists "Admins create order progress" on public.order_events;
drop policy if exists "Users manage own addresses" on public.addresses;
drop policy if exists "Anyone joins newsletter" on public.newsletter_signups;
drop policy if exists "Admins read newsletter" on public.newsletter_signups;

create policy "Users read own profile"
on public.profiles for select
using ((select auth.uid()) = id or public.is_admin());

create policy "Users update own profile"
on public.profiles for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Anyone reads active products"
on public.products for select
using (is_active = true);

create policy "Admins manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users manage own carts"
on public.carts for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage own cart items"
on public.cart_items for all
using (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id
    and carts.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id
    and carts.user_id = (select auth.uid())
  )
);

create policy "Users read own orders"
on public.orders for select
using ((select auth.uid()) = user_id or public.is_admin());

create policy "Users create own orders"
on public.orders for insert
with check ((select auth.uid()) = user_id);

create policy "Admins update orders"
on public.orders for update
using (public.is_admin())
with check (public.is_admin());

create policy "Users read own order events"
on public.order_events for select
using (
  public.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = order_events.order_id
    and orders.user_id = (select auth.uid())
  )
);

create policy "Users create own order events"
on public.order_events for insert
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_events.order_id
    and orders.user_id = (select auth.uid())
  )
);

create policy "Admins create order events"
on public.order_events for insert
with check (public.is_admin());

create policy "Users manage own addresses"
on public.addresses for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Anyone joins newsletter"
on public.newsletter_signups for insert
with check (true);

create policy "Admins read newsletter"
on public.newsletter_signups for select
using (public.is_admin());

insert into public.products
  (name, category, collection, description, price, rating, colors, sizes, stock, is_featured, is_worldcup)
select *
from (
  values
    ('World Cup Home Jersey', 'World Cup Jerseys', '2026 Jersey Drop', 'Fan-ready home jersey inspired by tournament colors.', 72::numeric, 4.9::numeric, array['#16a34a', '#ffffff', '#dc2626'], array['S', 'M', 'L', 'XL', 'XXL'], 60, true, true),
    ('World Cup Away Jersey', 'World Cup Jerseys', '2026 Jersey Drop', 'Lightweight away jersey with breathable mesh texture.', 76::numeric, 4.8::numeric, array['#1d4ed8', '#facc15', '#111827'], array['S', 'M', 'L', 'XL', 'XXL'], 54, false, true),
    ('Midnight Tailored Blazer', 'Fashion', 'City Edit', 'A sharp blazer for evening fits and office wear.', 89::numeric, 4.9::numeric, array['#111827', '#f8fafc'], array['S', 'M', 'L', 'XL'], 28, true, false)
) as seed(name, category, collection, description, price, rating, colors, sizes, stock, is_featured, is_worldcup)
where not exists (
  select 1 from public.products
  where products.name = seed.name
);
