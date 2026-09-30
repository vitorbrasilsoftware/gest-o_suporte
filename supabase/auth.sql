-- ════════════════════════════════════════════════════════════════════════════
-- Gestão Suporte — Login e controle de acesso
--
-- Execute este script inteiro no Supabase: Dashboard → SQL Editor → New query.
-- É idempotente: pode ser executado de novo sem duplicar nada.
--
-- Papéis:
--   admin    → acesso total: Setup, Usuários, importar backup, "Limpar todos",
--              excluir clientes, cadastro de técnicos e tipos de procedimento.
--   tecnico  → lê tudo; cria/edita/exclui SPED, procedimentos, problemas e
--              implantações; cria/edita clientes (sem excluir).
--   consulta → somente leitura.
--
-- Usuários novos entram com papel "consulta" e INATIVOS — só acessam o sistema
-- depois que um administrador os ativa em usuarios.html.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Tabela de perfis (1:1 com auth.users) ───────────────────────────────────

create table if not exists public.perfis (
  id          uuid primary key references auth.users (id) on delete cascade,
  nome        text not null default '',
  email       text not null default '',
  papel       text not null default 'consulta' check (papel in ('admin', 'tecnico', 'consulta')),
  ativo       boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Papel do usuário logado (null = sem acesso) ─────────────────────────────
-- SECURITY DEFINER para poder ser usada dentro das policies de "perfis" sem
-- recursão de RLS.

create or replace function public.papel_atual()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select papel from public.perfis where id = auth.uid() and ativo
$$;

revoke all on function public.papel_atual() from public, anon;
grant execute on function public.papel_atual() to authenticated;

-- ── Cria o perfil automaticamente quando um usuário é cadastrado ────────────

create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nome'), ''), split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- Usuários que já existiam antes deste script
insert into public.perfis (id, nome, email)
select u.id, split_part(coalesce(u.email, ''), '@', 1), coalesce(u.email, '')
from auth.users u
on conflict (id) do nothing;

-- ── Nunca deixar o sistema sem administrador ativo ──────────────────────────

create or replace function public.proteger_perfis()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    new.id := old.id;
    new.email := old.email;
    new.created_at := old.created_at;
    new.updated_at := now();
  end if;

  if old.papel = 'admin' and old.ativo
     and (tg_op = 'DELETE' or new.papel <> 'admin' or not new.ativo)
     and not exists (
       select 1 from public.perfis
       where papel = 'admin' and ativo and id <> old.id
     ) then
    raise exception 'É necessário manter pelo menos um administrador ativo.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_perfis on public.perfis;
create trigger proteger_perfis
  before update or delete on public.perfis
  for each row execute function public.proteger_perfis();

-- ── RLS de perfis ───────────────────────────────────────────────────────────

alter table public.perfis enable row level security;

drop policy if exists "perfis_select" on public.perfis;
drop policy if exists "perfis_update_admin" on public.perfis;

-- Cada usuário lê o próprio perfil (mesmo inativo, para a tela de login saber
-- o motivo do bloqueio); o admin lê todos.
create policy "perfis_select" on public.perfis
  for select to authenticated
  using (id = auth.uid() or public.papel_atual() = 'admin');

create policy "perfis_update_admin" on public.perfis
  for update to authenticated
  using (public.papel_atual() = 'admin')
  with check (public.papel_atual() = 'admin');

revoke all on public.perfis from anon;
grant select, update on public.perfis to authenticated;

-- ── RLS das tabelas do sistema ──────────────────────────────────────────────
-- Remove qualquer policy antiga (ex.: acesso liberado para "anon") e recria.

do $$
declare
  t text;
  p record;
  todas        text[] := array['clientes', 'tecnicos', 'tipos_procedimento', 'procedimentos',
                               'sped_clients', 'sped_corrections', 'issues', 'implantacoes'];
  operacionais text[] := array['procedimentos', 'sped_clients', 'sped_corrections', 'issues', 'implantacoes'];
  cadastros    text[] := array['tecnicos', 'tipos_procedimento'];
begin
  foreach t in array todas loop
    execute format('alter table public.%I enable row level security', t);

    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;

    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    execute format(
      'create policy "leitura" on public.%I for select to authenticated using (public.papel_atual() is not null)', t);
  end loop;

  -- SPED, procedimentos, problemas, implantações: admin e técnico escrevem
  foreach t in array operacionais loop
    execute format(
      'create policy "escrita_insert" on public.%I for insert to authenticated with check (public.papel_atual() in (''admin'', ''tecnico''))', t);
    execute format(
      'create policy "escrita_update" on public.%I for update to authenticated using (public.papel_atual() in (''admin'', ''tecnico'')) with check (public.papel_atual() in (''admin'', ''tecnico''))', t);
    execute format(
      'create policy "escrita_delete" on public.%I for delete to authenticated using (public.papel_atual() in (''admin'', ''tecnico''))', t);
  end loop;

  -- Técnicos e tipos de procedimento: só admin
  foreach t in array cadastros loop
    execute format(
      'create policy "admin_insert" on public.%I for insert to authenticated with check (public.papel_atual() = ''admin'')', t);
    execute format(
      'create policy "admin_update" on public.%I for update to authenticated using (public.papel_atual() = ''admin'') with check (public.papel_atual() = ''admin'')', t);
    execute format(
      'create policy "admin_delete" on public.%I for delete to authenticated using (public.papel_atual() = ''admin'')', t);
  end loop;
end $$;

-- Clientes: admin e técnico criam/editam (versão de banco, Força de Vendas);
-- só admin exclui.
create policy "escrita_insert" on public.clientes
  for insert to authenticated with check (public.papel_atual() in ('admin', 'tecnico'));
create policy "escrita_update" on public.clientes
  for update to authenticated
  using (public.papel_atual() in ('admin', 'tecnico'))
  with check (public.papel_atual() in ('admin', 'tecnico'));
create policy "admin_delete" on public.clientes
  for delete to authenticated using (public.papel_atual() = 'admin');

-- ════════════════════════════════════════════════════════════════════════════
-- PRIMEIRO ADMINISTRADOR
-- 1. Crie sua conta em login.html → "Criar conta" (ou em Authentication → Users).
-- 2. Rode a linha abaixo trocando o e-mail:
--
-- update public.perfis set papel = 'admin', ativo = true where email = 'seu@email.com';
-- ════════════════════════════════════════════════════════════════════════════
