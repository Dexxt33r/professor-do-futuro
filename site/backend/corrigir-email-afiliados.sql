-- ============================================================
-- CORREÇÃO RÁPIDA - Adicionar coluna email na tabela afiliados
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

-- Adicionar coluna email em afiliados se não existir
alter table public.afiliados add column if not exists email text;

-- Verificar se a coluna foi adicionada
select column_name, data_type from information_schema.columns 
where table_schema = 'public' and table_name = 'afiliados'
order by ordinal_position;

