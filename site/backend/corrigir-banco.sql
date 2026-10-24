-- ============================================================
-- CORREÇÃO RÁPIDA — Adicionar colunas faltantes no Supabase
-- Rode este SQL no Supabase: SQL Editor → cole e execute
-- ============================================================

-- Adicionar cupom_codigo em vendas_afiliadas se não existir
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vendas_afiliadas'
      and column_name = 'cupom_codigo'
  ) then
    alter table public.vendas_afiliadas add column cupom_codigo text;
  end if;
end $$;

-- Adicionar cupom_codigo em afiliados se não existir
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'afiliados'
      and column_name = 'cupom_codigo'
  ) then
    alter table public.afiliados add column cupom_codigo text unique;
  end if;
end $$;

-- Adicionar codigo_afiliado em afiliados se não existir
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'afiliados'
      and column_name = 'codigo_afiliado'
  ) then
    alter table public.afiliados add column codigo_afiliado text unique;
  end if;
end $$;

-- Adicionar comissao_fixa_centavos em afiliados se não existir
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'afiliados'
      and column_name = 'comissao_fixa_centavos'
  ) then
    alter table public.afiliados add column comissao_fixa_centavos integer not null default 3000;
  end if;
end $$;

-- Adicionar codigo_afiliado em profiles se não existir
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'codigo_afiliado'
  ) then
    alter table public.profiles add column codigo_afiliado text unique;
  end if;
end $$;

-- Após rodar este SQL, também rode o schema_admin.sql completo
-- para criar as políticas RLS e o produto único, se ainda não existirem.
