-- ============================================================
-- PROFESSOR DO FUTURO — Schema Completo (versão simples)
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

-- 1) Tabela profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  nome text,
  email text,
  role text not null default 'aluno' check (role in ('admin','aluno')),
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

-- 3) Tabela vendas (simplificada — sem afiliado/cupom)
create table if not exists public.vendas (
  id uuid default gen_random_uuid() primary key,
  cliente_email text not null,
  produto_id uuid references public.produtos(id) on delete set null,
  produto_nome text,
  valor_venda_centavos integer not null check (valor_venda_centavos >= 0),
  desconto_centavos integer not null default 0,
  comissao_centavos integer not null default 0,
  status text not null default 'paga' check (status in ('paga','pendente','cancelada')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Adicionar colunas faltantes se as tabelas já existirem
alter table public.vendas add column if not exists cupom_codigo text;

-- Habilitar RLS
alter table public.profiles enable row level security;
alter table public.produtos enable row level security;
alter table public.vendas enable row level security;

-- Políticas RLS: drop se existir e cria novamente
drop policy if exists "profiles_select_auth" on public.profiles;
create policy "profiles_select_auth" on public.profiles for select using (auth.role() = 'authenticated');

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "produtos_select_ativos" on public.produtos;
create policy "produtos_select_ativos" on public.produtos for select using (ativo = true);

drop policy if exists "produtos_admin_write" on public.produtos;
create policy "produtos_admin_write" on public.produtos for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "vendas_select_own" on public.vendas;
create policy "vendas_select_own" on public.vendas for select using (true);

drop policy if exists "vendas_admin_all" on public.vendas;
create policy "vendas_admin_all" on public.vendas for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Inserir produto único
insert into public.produtos (nome, descricao, preco_centavos, ativo)
values (
  'Professor do Futuro — Curso + Ferramentas',
  'Curso Professor do Futuro + Ferramentas do Laboratório',
  19700,
  true
)
on conflict (nome) do nothing;

-- Definir perfil como admin (se necessário)
-- update public.profiles set role = 'admin' where email = 'SUA_EMAIL@gmail.com';