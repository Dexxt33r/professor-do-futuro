-- ============================================================
-- APLICAR POLÍTICAS RLS — Somente se não existirem
-- Rode no Supabase: SQL Editor → cole e execute
-- ============================================================

-- profiles: select autenticados
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_select_auth'
  ) then
    create policy "profiles_select_auth" on public.profiles
      for select using (auth.role() = 'authenticated');
  end if;
end $$;

-- profiles: admin escreve
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_admin_write'
  ) then
    create policy "profiles_admin_write" on public.profiles
      for all using (
        exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      );
  end if;
end $$;

-- produtos: leitura ativos
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'produtos'
      and policyname = 'produtos_select_ativos'
  ) then
    create policy "produtos_select_ativos" on public.produtos
      for select using (ativo = true);
  end if;
end $$;

-- produtos: admin escreve
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'produtos'
      and policyname = 'produtos_admin_write'
  ) then
    create policy "produtos_admin_write" on public.produtos
      for all using (
        exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      );
  end if;
end $$;

-- cupons: leitura ativos
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cupons'
      and policyname = 'cupons_select_ativos'
  ) then
    create policy "cupons_select_ativos" on public.cupons
      for select using (ativo = true);
  end if;
end $$;

-- cupons: admin escreve
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cupons'
      and policyname = 'cupons_admin_write'
  ) then
    create policy "cupons_admin_write" on public.cupons
      for all using (
        exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      );
  end if;
end $$;

-- afiliados: leitura ativos
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'afiliados'
      and policyname = 'afiliados_select_ativos'
  ) then
    create policy "afiliados_select_ativos" on public.afiliados
      for select using (ativo = true);
  end if;
end $$;

-- afiliados: admin escreve
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'afiliados'
      and policyname = 'afiliados_admin_write'
  ) then
    create policy "afiliados_admin_write" on public.afiliados
      for all using (
        exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      );
  end if;
end $$;

-- vendas: afiliado lê próprias
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'vendas_afiliadas'
      and policyname = 'vendas_afiliadas_select_own'
  ) then
    create policy "vendas_afiliadas_select_own" on public.vendas_afiliadas
      for select using (
        exists (select 1 from public.afiliados a where a.id = vendas_afiliadas.afiliado_id and a.profile_id = auth.uid())
      );
  end if;
end $$;

-- vendas: admin tudo
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'vendas_afiliadas'
      and policyname = 'vendas_afiliadas_admin_all'
  ) then
    create policy "vendas_afiliadas_admin_all" on public.vendas_afiliadas
      for all using (
        exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      );
  end if;
end $$;

-- Após rodar, defina seu perfil como admin:
--   update public.profiles set role = 'admin' where email = 'klzinnmta202010@gmail.com';
