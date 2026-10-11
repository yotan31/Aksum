-- ============================================================
--  AKSUM – Datenbank (Supabase, Region Frankfurt)
--  Einmal komplett im Supabase "SQL Editor" ausführen.
--  Danach in der letzten Zeile deine E-Mail eintragen und
--  diese Zeile ebenfalls ausführen.
-- ============================================================

-- ---------- Admins (wer darf ins Kontor) ----------
create table if not exists public.admins (
  email text primary key,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Ist der angemeldete Nutzer ein freigegebener Admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke execute on function public.is_admin() from anon, public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins lesen" on public.admins;
create policy "admins lesen" on public.admins for select to authenticated using (public.is_admin());
drop policy if exists "admins verwalten" on public.admins;
create policy "admins verwalten" on public.admins for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Kontor-Daten ----------
-- Alle Kontor-Einträge (Kosten, Einkäufe, Bestellungen, Belege, Todos, ...)
-- als Dokumente: collection = Bereich, id = Eintrag, data = Inhalt.
create table if not exists public.docs (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);
create index if not exists docs_collection_idx on public.docs (collection);
alter table public.docs enable row level security;

drop policy if exists "kontor admins" on public.docs;
create policy "kontor admins" on public.docs for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.docs_touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then new.version := old.version + 1; end if;
  return new;
end $$;
drop trigger if exists docs_touch on public.docs;
create trigger docs_touch before update on public.docs for each row execute function public.docs_touch();

-- Änderungen live ans Kontor schicken
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;

-- ---------- Verfügbarkeit für den Shop (öffentlich lesbar) ----------
create table if not exists public.shop_status (
  sku text primary key,
  sold_out boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.shop_status enable row level security;
drop policy if exists "shop liest" on public.shop_status;
create policy "shop liest" on public.shop_status for select to anon, authenticated using (true);
drop policy if exists "kontor schreibt" on public.shop_status;
create policy "kontor schreibt" on public.shop_status for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Belegfotos (privater Speicher) ----------
insert into storage.buckets (id, name, public)
values ('belege', 'belege', false)
on conflict (id) do nothing;

drop policy if exists "belege admins lesen" on storage.objects;
create policy "belege admins lesen" on storage.objects for select to authenticated using (bucket_id = 'belege' and public.is_admin());
drop policy if exists "belege admins hochladen" on storage.objects;
create policy "belege admins hochladen" on storage.objects for insert to authenticated with check (bucket_id = 'belege' and public.is_admin());
-- Bewusst KEINE Lösch- oder Änderungsregel: Belegfotos bleiben unverändert (Finanzamt).

-- ---------- Wach-halten (kostenloser Tarif pausiert nach 7 Tagen ohne Zugriff) ----------
create or replace function public.ping()
returns text language sql stable set search_path = '' as $$ select 'ok'::text $$;
grant execute on function public.ping() to anon;

-- ============================================================
--  ZUM SCHLUSS: deine E-Mail als ersten Admin eintragen
--  (die Adresse, mit der du dich im Kontor anmeldest)
-- ============================================================
-- insert into public.admins (email) values ('deine@email.de') on conflict do nothing;
