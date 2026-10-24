-- ============================================================
-- ADICIONAR UNIQUE CONSTRAINT na coluna nome da tabela produtos
-- Necessário para o ON CONFLICT (nome) funcionar
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

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

-- Após rodar este SQL, o produto único será inserido corretamente
-- com o ON CONFLICT (nome) do schema_admin.sql
