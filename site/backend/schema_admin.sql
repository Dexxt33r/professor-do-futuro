-- PROFESSOR DO FUTURO — Schema para Afiliados + Cupons vinculados
-- Cada afiliado tem seu próprio cupom. Cliente digita cupom OU código do afiliado.
-- Rode no Supabase: SQL Editor → cole e execute

-- 1) Perfis (usuários do sistema)
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

-- 2) Produto único (único produto à venda)
create table if not exists public.produtos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  preco_centavos integer not null default 0 check (preco_centavos >= 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Garantir constraint UNIQUE na coluna nome (necessário para ON CONFLICT)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.produtos'::regclass
      and contype = 'u'
      and conname = 'produtos_nome_key'
  ) then
    alter table public.produtos add constraint produtos_nome_key unique (nome);
  end if;
end $$;

-- 3) Cupons de desconto
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

-- 4) Afiliados (cada afiliado tem seu próprio cupom_codigo)
create table if not exists public.afiliados (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  nome text not null,
  email text,
  codigo_afiliado text not null unique,
  cupom_codigo text not null unique,
  comissao_fixa_centavos integer not null default 3000,
  ativo boolean not null default true,
  total_vendas integer not null default 0,
  total_comissao_centavos integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 5) Vendas (registra quem vendeu via cupom OU código do afiliado)
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

-- Índices
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_afiliados_codigo on public.afiliados(codigo_afiliado);
create index if not exists idx_afiliados_cupom on public.afiliados(cupom_codigo);
create index if not exists idx_cupons_codigo on public.cupons(codigo);
create index if not exists idx_vendas_afiliadas_afiliado on public.vendas_afiliadas(afiliado_id);
create index if not exists idx_vendas_afiliadas_cupom on public.vendas_afiliadas(cupom_codigo);
create index if not exists idx_vendas_afiliadas_status on public.vendas_afiliadas(status);

-- RLS
alter table public.profiles enable row level security;
alter table public.produtos enable row level security;
alter table public.cupons enable row level security;
alter table public.afiliados enable row level security;
alter table public.vendas_afiliadas enable row level security;

create policy "profiles_select_auth" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "profiles_admin_write" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "produtos_select_ativos" on public.produtos
  for select using (ativo = true);
create policy "produtos_admin_write" on public.produtos
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "cupons_select_ativos" on public.cupons
  for select using (ativo = true);
create policy "cupons_admin_write" on public.cupons
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "afiliados_select_ativos" on public.afiliados
  for select using (ativo = true);
create policy "afiliados_admin_write" on public.afiliados
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "vendas_afiliadas_select_own" on public.vendas_afiliadas
  for select using (exists (select 1 from public.afiliados a where a.id = vendas_afiliadas.afiliado_id and a.profile_id = auth.uid()));
create policy "vendas_afiliadas_admin_all" on public.vendas_afiliadas
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Inserir produto único
insert into public.produtos (nome, descricao, preco_centavos, ativo)
values (
  'Professor do Futuro — Curso + Ferramentas',
  'Curso Professor do Futuro + Ferramentas do Laboratório',
  19700,
  true
)
on conflict (nome) do nothing;

-- Depois de rodar, defina seu perfil como admin:
--   update public.profiles set role = 'admin' where email = 'seu-email@aqui.com';

