-- ENUM: papel do usuário dentro da academia
create type public.user_role as enum ('admin', 'colaborador', 'aluno');

-- TABELA: academias (tenants)
create table public.academias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);
alter table public.academias enable row level security;

-- TABELA: profiles (1:1 com auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  academia_id uuid not null references public.academias (id) on delete cascade,
  nome text not null,
  role public.user_role not null default 'aluno',
  created_at timestamptz not null default now()
);
create index profiles_academia_id_idx on public.profiles (academia_id);
alter table public.profiles enable row level security;

-- FUNÇÕES AUXILIARES
create or replace function public.get_my_academia_id()
returns uuid language sql security definer set search_path = public stable
as $$ select academia_id from public.profiles where id = auth.uid(); $$;

create or replace function public.get_my_role()
returns public.user_role language sql security definer set search_path = public stable
as $$ select role from public.profiles where id = auth.uid(); $$;

-- RLS: academias
create policy "select_academia_propria" on public.academias
  for select to authenticated using (id = public.get_my_academia_id());

-- RLS: profiles
create policy "select_profiles_mesma_academia" on public.profiles
  for select to authenticated using (academia_id = public.get_my_academia_id());

create policy "insert_proprio_profile" on public.profiles
  for insert to authenticated with check (id = auth.uid());

create policy "update_proprio_profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());