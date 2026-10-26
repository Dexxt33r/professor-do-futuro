-- ============================================================
-- CORREÇÃO DEFINITIVA - Todas as colunas em TODAS as tabelas
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

-- ============================================================
-- ADICIONAR COLUNAS EM profiles
-- ============================================================
alter table public.profiles add column if not exists nome text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists role text not null default 'aluno' check (role in ('admin','afiliado','aluno'));
alter table public.profiles add column if not exists codigo_afiliado text unique;
alter table public.profiles add column if not exists ativo boolean not null default true;
alter table public.profiles add column if not exists criado_em timestamptz not null default now();
alter table public.profiles add column if not exists atualizado_em timestamptz not null default now();

-- ============================================================
-- ADICIONAR COLUNAS EM produtos
-- ============================================================
alter table public.produtos add column if not exists nome text not null default '';
alter table public.produtos add column if not exists descricao text;
alter table public.produtos add column if not exists preco_centavos integer not null default 0 check (preco_centavos >= 0);
alter table public.produtos add column if not exists preco_promocional_centavos integer;
alter table public.produtos add column if not exists ativo boolean not null default true;
alter table public.produtos add column if not exists criado_em timestamptz not null default now();
alter table public.produtos add column if not exists atualizado_em timestamptz not null default now();

-- ============================================================
-- ADICIONAR COLUNAS EM cupons
-- ============================================================
alter table public.cupons add column if not exists codigo text not null unique;
alter table public.cupons add column if not exists tipo text not null default 'percentual' check (tipo in ('percentual','fixo'));
alter table public.cupons add column if not exists valor numeric not null default 0 check (valor >= 0);
alter table public.cupons add column if not exists produto_id uuid references public.produtos(id) on delete set null;
alter table public.cupons add column if not exists ativo boolean not null default true;
alter table public.cupons add column if not exists data_expiracao timestamptz;
alter table public.cupons add column if not exists usos_max integer;
alter table public.cupons add column if not exists usos_usados integer not null default 0;
alter table public.cupons add column if not exists criado_em timestamptz not null default now();
alter table public.cupons add column if not exists atualizado_em timestamptz not null default now();

-- ============================================================
-- ADICIONAR COLUNAS EM afiliados (ESTA É A QUE FALTAVA)
-- ============================================================
alter table public.afiliados add column if not exists nome text not null default '';
alter table public.afiliados add column if not exists email text;
alter table public.afiliados add column if not exists codigo_afiliado text unique;
alter table public.afiliados add column if not exists cupom_codigo text unique;
alter table public.afiliados add column if not exists comissao_fixa_centavos integer not null default 3000;
alter table public.afiliados add column if not exists ativo boolean not null default true;
alter table public.afiliados add column if not exists total_vendas integer not null default 0;
alter table public.afiliados add column if not exists total_comissao_centavos integer not null default 0;
alter table public.afiliados add column if not exists criado_em timestamptz not null default now();
alter table public.afiliados add column if not exists atualizado_em timestamptz not null default now();

-- ============================================================
-- ADICIONAR COLUNAS EM vendas_afiliadas
-- ============================================================
alter table public.vendas_afiliadas add column if not exists afiliado_id uuid references public.afiliados(id) on delete set null;
alter table public.vendas_afiliadas add column if not exists cupom_codigo text;
alter table public.vendas_afiliadas add column if not exists cliente_email text not null default '';
alter table public.vendas_afiliadas add column if not exists produto_id uuid references public.produtos(id) on delete set null;
alter table public.vendas_afiliadas add column if not exists produto_nome text;
alter table public.vendas_afiliadas add column if not exists valor_venda_centavos integer not null default 0 check (valor_venda_centavos >= 0);
alter table public.vendas_afiliadas add column if not exists desconto_centavos integer not null default 0;
alter table public.vendas_afiliadas add column if not exists comissao_centavos integer not null check (comissao_centavos >= 0);
alter table public.vendas_afiliadas add column if not exists status text not null default 'paga' check (status in ('paga','pendente','cancelada'));
alter table public.vendas_afiliadas add column if not exists criado_em timestamptz not null default now();
alter table public.vendas_afiliadas add column if not exists atualizado_em timestamptz not null default now();

-- ============================================================
-- VERIFICAÇÃO - Mostrar todas as colunas
-- ============================================================
select table_name, column_name, data_type 
from information_schema.columns 
where table_schema = 'public' 
and table_name in ('profiles','produtos','cupons','afiliados','vendas_afiliadas')
order by table_name, ordinal_position;

