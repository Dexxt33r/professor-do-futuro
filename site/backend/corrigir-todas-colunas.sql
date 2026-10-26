-- ============================================================
-- CORREÇÃO DEFINITIVA - Adicionar TODAS as colunas faltantes
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

-- Adicionar colunas em perfis se não existirem
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists codigo_afiliado text unique;
alter table public.profiles add column if not exists role text not null default 'aluno' check (role in ('admin','afiliado','aluno'));
alter table public.profiles add column if not exists ativo boolean not null default true;
alter table public.profiles add column if not exists criado_em timestamptz not null default now();
alter table public.profiles add column if not exists atualizado_em timestamptz not null default now();

-- Adicionar colunas em afiliados se não existirem
alter table public.afiliados add column if not exists email text;
alter table public.afiliados add column if not exists codigo_afiliado text unique;
alter table public.afiliados add column if not exists cupom_codigo text unique;
alter table public.afiliados add column if not exists comissao_fixa_centavos integer not null default 3000;
alter table public.afiliados add column if not exists ativo boolean not null default true;
alter table public.afiliados add column if not exists total_vendas integer not null default 0;
alter table public.afiliados add column if not exists total_comissao_centavos integer not null default 0;
alter table public.afiliados add column if not exists criado_em timestamptz not null default now();
alter table public.afiliados add column if not exists atualizado_em timestamptz not null default now();

-- Adicionar colunas em cupons se não existirem
alter table public.cupons add column if not exists produto_id uuid references public.produtos(id) on delete set null;
alter table public.cupons add column if not exists data_expiracao timestamptz;
alter table public.cupons add column if not exists usos_max integer;
alter table public.cupons add column if not exists usos_usados integer not null default 0;

-- Adicionar colunas em vendas_afiliadas se não existirem
alter table public.vendas_afiliadas add column if not exists cupom_codigo text;
alter table public.vendas_afiliadas add column if not exists desconto_centavos integer not null default 0;
alter table public.vendas_afiliadas add column if not exists comissao_centavos integer not null check (comissao_centavos >= 0);
alter table public.vendas_afiliadas add column if not exists status text not null default 'paga' check (status in ('paga','pendente','cancelada'));

-- Verificar se as colunas existem
select table_name, column_name, data_type 
from information_schema.columns 
where table_schema = 'public' 
and table_name in ('profiles','afiliados','cupons','vendas_afiliadas')
order by table_name, ordinal_position;

