create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Fashion', 'World Cup Jerseys')),
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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'packed', 'shipped', 'cancelled')),
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_signups enable row level security;

drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products"
on public.products for select
using (is_active = true);

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders for insert
with check (true);

drop policy if exists "Anyone can join newsletter" on public.newsletter_signups;
create policy "Anyone can join newsletter"
on public.newsletter_signups for insert
with check (true);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_worldcup_idx on public.products(is_worldcup);
create index if not exists orders_email_idx on public.orders(email);

insert into public.products
  (name, category, collection, description, price, rating, colors, sizes, stock, is_featured, is_worldcup)
values
  (
    'Midnight Tailored Blazer',
    'Fashion',
    'City Edit',
    'A sharp blazer for evening fits, office wear, and layered street styling.',
    89,
    4.9,
    array['#111827', '#f8fafc'],
    array['S', 'M', 'L', 'XL'],
    28,
    true,
    false
  ),
  (
    'Layered Cotton Overshirt',
    'Fashion',
    'Everyday',
    'Heavy cotton overshirt with a relaxed cut and year-round layering weight.',
    54,
    4.7,
    array['#b91c1c', '#1f2937', '#f9fafb'],
    array['S', 'M', 'L', 'XL', 'XXL'],
    42,
    false,
    false
  ),
  (
    'Relaxed Denim Set',
    'Fashion',
    'Weekend',
    'Soft denim shirt and trouser styling for casual daily outfits.',
    68,
    4.6,
    array['#1e3a8a', '#93c5fd'],
    array['S', 'M', 'L', 'XL'],
    36,
    false,
    false
  ),
  (
    'World Cup Home Jersey',
    'World Cup Jerseys',
    '2026 Jersey Drop',
    'Fan-ready home jersey inspired by global tournament colors, without official federation marks.',
    72,
    4.9,
    array['#16a34a', '#ffffff', '#dc2626'],
    array['S', 'M', 'L', 'XL', 'XXL'],
    60,
    true,
    true
  ),
  (
    'World Cup Away Jersey',
    'World Cup Jerseys',
    '2026 Jersey Drop',
    'Lightweight away jersey with breathable mesh texture and bold color blocking.',
    76,
    4.8,
    array['#1d4ed8', '#facc15', '#111827'],
    array['S', 'M', 'L', 'XL', 'XXL'],
    54,
    false,
    true
  ),
  (
    'Limited Goalkeeper Jersey',
    'World Cup Jerseys',
    '2026 Jersey Drop',
    'A darker goalkeeper-style jersey for collectors and match-day streetwear.',
    82,
    4.7,
    array['#0f172a', '#22c55e', '#eab308'],
    array['M', 'L', 'XL'],
    24,
    false,
    true
  )
on conflict do nothing;
