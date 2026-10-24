-- ============================================================
-- PROFESSOR DO FUTURO — Schema Completo e Seguro (idempotente)
-- Rode no Supabase: SQL Editor → cole e execute
-- Não dá erro se já existir nada. Pode rodar quantas vezes quiser.
-- ============================================================

-- 1) Tabela profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  nome text,
  email text,
  role text not null default 'aluno' check (role in ('admin','afiliado','aluno')),
  codigo_afiliado text unique,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 2) Tabela produtos
create table if not exists public.produtos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  preco_centavos integer not null default 0 check (preco_centavos >= 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 3) Tabela cupons
create table if not exists public.cupons (
  id uuid default gen_random_uuid() primary key,
  codigo text not null unique,
  tipo text not null default 'percentual' check (tipo in ('percentual','fixo')),
  valor numeric not null check (valor >= 0),
  produto_id uuid references public.produtos(id) on delete set null,
  ativo boolean not null default true,
  data_expiracao timestamptz,
  usos_max integer,
  usos_usados integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 4) Tabela afiliados
create table if not exists public.afiliados (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  nome text not null,
  email text,
  codigo_afiliado text unique,
  cupom_codigo text unique,
  comissao_fixa_centavos integer not null default 3000,
  ativo boolean not null default true,
  total_vendas integer not null default 0,
  total_comissao_centavos integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 5) Tabela vendas_afiliadas
create table if not exists public.vendas_afiliadas (
  id uuid default gen_random_uuid() primary key,
  afiliado_id uuid references public.afiliados(id) on delete set null,
  cupom_codigo text,
  cliente_email text not null,
  produto_id uuid references public.produtos(id) on delete set null,
  produto_nome text,
  valor_venda_centavos integer not null check (valor_venda_centavos >= 0),
  desconto_centavos integer not null default 0,
  comissao_centavos integer not null check (comissao_centavos >= 0),
  status text not null default 'paga' check (status in ('paga','pendente','cancelada')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);


-- ============================================================
-- Adicionar colunas faltantes se as tabelas já existirem
-- ============================================================

do 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='vendas_afiliadas' and column_name='cupom_codigo') then
    alter table public.vendas_afiliadas add column cupom_codigo text;
  end if;
end ;

do 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='afiliados' and column_name='cupom_codigo') then
    alter table public.afiliados add column cupom_codigo text unique;
  end if;
end ;

do 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='afiliados' and column_name='codigo_afiliado') then
    alter table public.afiliados add column codigo_afiliado text unique;
  end if;
end ;

do 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='afiliados' and column_name='comissao_fixa_centavos') then
    alter table public.afiliados add column comissao_fixa_centavos integer not null default 3000;
  end if;
end ;

do 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='codigo_afiliado') then
    alter table public.profiles add column codigo_afiliado text unique;
  end if;
end ;

-- ============================================================
-- UNIQUE constraint na coluna nome da tabela produtos
-- ============================================================
do 
begin
  if not exists (select 1 from pg_constraint where conrelid='public.produtos'::regclass and contype='u' and conname='produtos_nome_key') then
    alter table public.produtos add constraint produtos_nome_key unique (nome);
  end if;
end ;

-- ============================================================
-- Habilitar RLS (não falha se já ativo)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.produtos enable row level security;
alter table public.cupons enable row level security;
alter table public.afiliados enable row level security;
alter table public.vendas_afiliadas enable row level security;


-- ============================================================
-- Políticas RLS (apenas se não existirem)
-- ============================================================

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_select_auth') then
    create policy "profiles_select_auth" on public.profiles for select using (auth.role() = 'authenticated');
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_admin_write') then
    create policy "profiles_admin_write" on public.profiles for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='produtos' and policyname='produtos_select_ativos') then
    create policy "produtos_select_ativos" on public.produtos for select using (ativo = true);
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='produtos' and policyname='produtos_admin_write') then
    create policy "produtos_admin_write" on public.produtos for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cupons' and policyname='cupons_select_ativos') then
    create policy "cupons_select_ativos" on public.cupons for select using (ativo = true);
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cupons' and policyname='cupons_admin_write') then
    create policy "cupons_admin_write" on public.cupons for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='afiliados' and policyname='afiliados_select_ativos') then
    create policy "afiliados_select_ativos" on public.afiliados for select using (ativo = true);
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='afiliados' and policyname='afiliados_admin_write') then
    create policy "afiliados_admin_write" on public.afiliados for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='vendas_afiliadas' and policyname='vendas_afiliadas_select_own') then
    create policy "vendas_afiliadas_select_own" on public.vendas_afiliadas for select using (exists (select 1 from public.afiliados a where a.id = vendas_afiliadas.afiliado_id and a.profile_id = auth.uid()));
  end if;
end ;

do 
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='vendas_afiliadas' and policyname='vendas_afiliadas_admin_all') then
    create policy "vendas_afiliadas_admin_all" on public.vendas_afiliadas for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
  end if;
end ;

-- ============================================================
-- Inserir produto único (se não existir)
-- ============================================================
insert into public.produtos (nome, descricao, preco_centavos, ativo)
values (
  'Professor do Futuro — Curso + Ferramentas',
  'Curso Professor do Futuro + Ferramentas do Laboratório',
  19700,
  true
)
on conflict (nome) do nothing;

-- Depois de rodar, defina seu perfil como admin:
--   update public.profiles set role = 'admin' where email = 'klzinnmta202010@gmail.com';

