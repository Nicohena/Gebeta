-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. menu_items table
create table public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null,
  description jsonb not null,
  category text not null,
  price_usd numeric(10, 2) not null,
  image text not null,
  badge text not null default 'none',
  is_signature boolean not null default false,
  visible boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. drink_items table
create table public.drink_items (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null,
  description jsonb not null,
  category text not null,
  price_usd numeric(10, 2) not null,
  sizes jsonb,
  image text not null,
  badge text not null default 'none',
  is_signature boolean not null default false,
  visible boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. restaurant_settings table (only one row)
create table public.restaurant_settings (
  id integer primary key default 1 check (id = 1),
  name text not null,
  tagline text not null,
  email text not null,
  phone text not null,
  address text not null,
  hero_image_url text not null,
  hero_headline text not null,
  show_hero_cta boolean not null default true,
  hours jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. exchange_rates table (only one row)
create table public.exchange_rates (
  id integer primary key default 1 check (id = 1),
  usd numeric(10, 4) not null,
  etb numeric(10, 4) not null,
  cny numeric(10, 4) not null,
  eur numeric(10, 4) not null,
  mxn numeric(10, 4) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. rate_history table
create table public.rate_history (
  id uuid primary key default uuid_generate_v4(),
  timestamp timestamp with time zone not null,
  changed_by text not null,
  changes jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Setup
alter table public.menu_items enable row level security;
alter table public.drink_items enable row level security;
alter table public.restaurant_settings enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.rate_history enable row level security;

-- Policies for public reading
create policy "Allow public read access to menu_items" on public.menu_items for select using (true);
create policy "Allow public read access to drink_items" on public.drink_items for select using (true);
create policy "Allow public read access to restaurant_settings" on public.restaurant_settings for select using (true);
create policy "Allow public read access to exchange_rates" on public.exchange_rates for select using (true);

-- Policies for authenticated users (admins) to write
create policy "Allow authenticated users full access to menu_items" on public.menu_items for all to authenticated using (true) with check (true);
create policy "Allow authenticated users full access to drink_items" on public.drink_items for all to authenticated using (true) with check (true);
create policy "Allow authenticated users full access to restaurant_settings" on public.restaurant_settings for all to authenticated using (true) with check (true);
create policy "Allow authenticated users full access to exchange_rates" on public.exchange_rates for all to authenticated using (true) with check (true);
create policy "Allow authenticated users full access to rate_history" on public.rate_history for all to authenticated using (true) with check (true);

-- Functions and triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_menu_items
  before update on public.menu_items
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_drink_items
  before update on public.drink_items
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_restaurant_settings
  before update on public.restaurant_settings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_exchange_rates
  before update on public.exchange_rates
  for each row execute procedure public.handle_updated_at();
