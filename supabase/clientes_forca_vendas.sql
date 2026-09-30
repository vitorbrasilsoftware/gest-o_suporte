-- Força de Vendas: técnico responsável e observação (rodar uma vez no SQL Editor do Supabase).
-- Um valor por cliente, valendo para VEM e Automação de Vendas.
-- A RLS de public.clientes (supabase/auth.sql) já cobre as colunas novas.

alter table public.clientes
  add column if not exists fv_tecnico text default '',
  add column if not exists fv_observacao text default '';
