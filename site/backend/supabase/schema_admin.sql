-- ============================================================
-- PROFESSOR DO FUTURO — Schema do painel do DONO (admin)
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

-- 1) Perfis com papel (role): admin | afiliado | aluno
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  nome text,
  email text,
  role text not null default 'aluno' check (role in ('admin','afiliado','aluno')),
  codigo_afiliado text unique,
  comissao_percentual numeric default 10 check (comissao_percentual >= 0 and comissao_percentual <= 100),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 2) Produtos / cursos à venda
create table if not exists public.produtos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  preco_centavos integer not null default 0 check (preco_centavos >= 0),
  preco_promocional_centavos integer,
  ativo boolean not null default true,
  url_compra text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

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

-- 4) Afiliados (vinculado a um profile)
create table if not exists public.afiliados (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  codigo_afiliado text not null unique,
  comissao_percentual numeric not null default 10 check (comissao_percentual >= 0 and comissao_percentual <= 100),
  ativo boolean not null default true,
  total_vendas integer not null default 0,
  total_comissao_centavos integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- 5) Vendas geradas por afiliados
create table if not exists public.vendas_afiliadas (
  id uuid default gen_random_uuid() primary key,
  afiliado_id uuid references public.afiliados(id) on delete cascade not null,
  cliente_email text not null,
  produto_id uuid references public.produtos(id) on delete set null,
  produto_nome text,
  valor_venda_centavos integer not null check (valor_venda_centavos >= 0),
  comissao_centavos integer not null check (comissao_centavos >= 0),
  status text not null default 'pendente' check (status in ('pendente','paga','cancelada')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);


-- Índices úteis
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_codigo_afiliado on public.profiles(codigo_afiliado);
create index if not exists idx_cupons_codigo on public.cupons(codigo);
create index if not exists idx_cupons_ativo on public.cupons(ativo);
create index if not exists idx_afiliados_codigo on public.afiliados(codigo_afiliado);
create index if not exists idx_vendas_afiliadas_afiliado on public.vendas_afiliadas(afiliado_id);
create index if not exists idx_vendas_afiliadas_status on public.vendas_afiliadas(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.produtos enable row level security;
alter table public.cupons enable row level security;
alter table public.afiliados enable row level security;
alter table public.vendas_afiliadas enable row level security;

-- Profiles: qualquer autenticado lê; admin edita tudo
create policy "profiles_select_auth" on public.profiles
  for select using (auth.role() = 'authenticated');
create policy "profiles_admin_write" on public.profiles
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Produtos: leitura pública de produtos ativos; admin escreve
create policy "produtos_select_ativos" on public.produtos
  for select using (ativo = true);
create policy "produtos_admin_write" on public.produtos
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Cupons: leitura pública de cupons ativos; admin escreve
create policy "cupons_select_ativos" on public.cupons
  for select using (ativo = true);
create policy "cupons_admin_write" on public.cupons
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Afiliados: leitura pública de afiliados ativos; admin escreve
create policy "afiliados_select_ativos" on public.afiliados
  for select using (ativo = true);
create policy "afiliados_admin_write" on public.afiliados
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Vendas afiliadas: afiliado lê só as próprias; admin tudo
create policy "vendas_afiliadas_select_own" on public.vendas_afiliadas
  for select using (
    exists (
      select 1 from public.afiliados a
      where a.id = vendas_afiliadas.afiliado_id
        and a.profile_id = auth.uid()
    )
  );
create policy "vendas_afiliadas_admin_all" on public.vendas_afiliadas
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- Após rodar este SQL, defina o dono como admin:
--   update public.profiles set role = 'admin' where email = 'seu-email@dono.com';
-- ============================================================

