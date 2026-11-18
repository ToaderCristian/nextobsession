-- Next Obsession: database schema
-- Rulează tot fișierul o singură dată în Supabase > SQL Editor > New query.

create extension if not exists pgcrypto;

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key,
  username text unique not null,
  display_name text,
  city text default 'București',
  verified boolean not null default false,
  splits_done int not null default 0,
  created_at timestamptz not null default now()
);

-- creează profilul automat la înregistrare
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base text; candidate text; n int := 0;
begin
  base := lower(regexp_replace(split_part(coalesce(new.email, 'membru'), '@', 1), '[^a-z0-9._]', '', 'g'));
  if base = '' then base := 'membru'; end if;
  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    n := n + 1; candidate := base || n::text;
  end loop;
  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, coalesce(new.raw_user_meta_data->>'full_name', candidate));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- SPLITS ----------
create table if not exists public.splits (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  house text not null check (char_length(house) between 1 and 60),
  category text not null default 'nisa' check (category in ('nisa','designer','arab')),
  concentration text not null default 'Eau de parfum',
  bottle_ml int not null check (bottle_ml between 5 and 500),
  total_ml int not null check (total_ml between 2 and 500),
  price_per_ml numeric(8,2) not null check (price_per_ml > 0 and price_per_ml <= 200),
  year text, notes_top text, notes_heart text, notes_base text, season text,
  description text check (char_length(description) <= 600),
  city text not null,
  area text not null,
  meet_when text not null,
  tint text not null default '#E9C9BD',
  lot_verified boolean not null default false,
  base_taken int not null default 0,
  base_count int not null default 0,
  created_at timestamptz not null default now(),
  check (total_ml <= bottle_ml)
);
create index if not exists splits_city_idx on public.splits (city);

-- userii nu pot să-și marcheze singuri lotul ca verificat
create or replace function public.protect_split_fields()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' and current_user not in ('postgres','supabase_admin') then
    if tg_op = 'INSERT' then
      new.lot_verified := false; new.base_taken := 0; new.base_count := 0;
    else
      new.lot_verified := old.lot_verified; new.base_taken := old.base_taken; new.base_count := old.base_count;
      new.seller_id := old.seller_id;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists protect_split_fields on public.splits;
create trigger protect_split_fields before insert or update on public.splits
  for each row execute function public.protect_split_fields();

-- ---------- RESERVATIONS ----------
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  split_id uuid not null references public.splits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  ml int not null check (ml in (2,5,10)),
  with_kit boolean not null default false,
  created_at timestamptz not null default now(),
  unique (split_id, user_id)
);

-- nu se poate rezerva peste ml-ii liberi, nici la propriul split
create or replace function public.check_reservation()
returns trigger language plpgsql security definer set search_path = public as $$
declare s public.splits; used int;
begin
  select * into s from public.splits where id = new.split_id for update;
  if s.seller_id = new.user_id then raise exception 'Nu poți rezerva la propriul split'; end if;
  select coalesce(sum(ml),0) into used from public.reservations
    where split_id = new.split_id and id <> coalesce(new.id, gen_random_uuid());
  if s.base_taken + used + new.ml > s.total_ml then
    raise exception 'Nu mai sunt destui ml liberi';
  end if;
  return new;
end $$;
drop trigger if exists check_reservation on public.reservations;
create trigger check_reservation before insert or update on public.reservations
  for each row execute function public.check_reservation();

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  split_id uuid references public.splits(id) on delete set null,
  split_label text,
  stars int not null check (stars between 1 and 5),
  body text check (char_length(body) <= 400),
  created_at timestamptz not null default now(),
  unique (split_id, reviewer_id)
);

-- ---------- STATS (views, citite de toată lumea) ----------
create or replace view public.split_stats as
  select s.id as split_id,
         s.base_taken + coalesce(sum(r.ml),0) as taken_ml,
         s.base_count + count(r.id) as participants
  from public.splits s left join public.reservations r on r.split_id = s.id
  group by s.id;

create or replace view public.seller_stats as
  select p.id as seller_id,
         coalesce(avg(rv.stars),0)::numeric(3,2) as avg_rating,
         count(rv.id) as review_count
  from public.profiles p left join public.reviews rv on rv.seller_id = p.id
  group by p.id;

grant select on public.split_stats, public.seller_stats to anon, authenticated;

-- ---------- ROW LEVEL SECURITY ----------
alter table public.profiles enable row level security;
alter table public.splits enable row level security;
alter table public.reservations enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (true);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "splits read" on public.splits;
create policy "splits read" on public.splits for select using (true);
drop policy if exists "splits insert own" on public.splits;
create policy "splits insert own" on public.splits for insert to authenticated with check (auth.uid() = seller_id);
drop policy if exists "splits update own" on public.splits;
create policy "splits update own" on public.splits for update to authenticated using (auth.uid() = seller_id);
drop policy if exists "splits delete own" on public.splits;
create policy "splits delete own" on public.splits for delete to authenticated using (auth.uid() = seller_id);

-- rezervările le văd doar cel care a rezervat și vânzătorul
drop policy if exists "res read" on public.reservations;
create policy "res read" on public.reservations for select to authenticated using (
  auth.uid() = user_id or auth.uid() = (select seller_id from public.splits where id = split_id));
drop policy if exists "res insert own" on public.reservations;
create policy "res insert own" on public.reservations for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "res delete own" on public.reservations;
create policy "res delete own" on public.reservations for delete to authenticated using (auth.uid() = user_id);

-- recenzii: toată lumea citește; scrie doar cine a rezervat la acel split
drop policy if exists "reviews read" on public.reviews;
create policy "reviews read" on public.reviews for select using (true);
drop policy if exists "reviews insert participant" on public.reviews;
create policy "reviews insert participant" on public.reviews for insert to authenticated with check (
  auth.uid() = reviewer_id
  and exists (select 1 from public.reservations r join public.splits s on s.id = r.split_id
              where r.split_id = reviews.split_id and r.user_id = auth.uid() and s.seller_id = reviews.seller_id));
drop policy if exists "reviews delete own" on public.reviews;
create policy "reviews delete own" on public.reviews for delete to authenticated using (auth.uid() = reviewer_id);

-- profilurile demo nu au cont de login; cheia străină spre auth.users lipsește intenționat

-- ---------- REPORTS (sesizări; le vezi doar tu din Supabase > Table editor) ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  split_id uuid references public.splits(id) on delete set null,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 500),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "reports insert own" on public.reports;
create policy "reports insert own" on public.reports for insert to authenticated with check (auth.uid() = reporter_id);
