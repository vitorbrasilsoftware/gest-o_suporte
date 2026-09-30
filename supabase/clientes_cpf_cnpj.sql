-- CPF/CNPJ do cliente (rodar uma vez no SQL Editor do Supabase).
-- Armazenado sem pontuação e em maiúsculas (11 dígitos = CPF, 14 posições = CNPJ,
-- inclusive o alfanumérico). A unicidade é garantida pela constraint abaixo.
--
-- A coluna aceita NULL porque os clientes já cadastrados ainda não têm documento;
-- o preenchimento é obrigatório no formulário (saveCliente). Vários NULLs não
-- violam o UNIQUE.

alter table public.clientes
  add column if not exists cpf_cnpj text;

alter table public.clientes
  drop constraint if exists clientes_cpf_cnpj_key;

alter table public.clientes
  add constraint clientes_cpf_cnpj_key unique (cpf_cnpj);

-- Opcional: depois que TODOS os clientes tiverem CPF/CNPJ preenchido, tornar a
-- coluna obrigatória também no banco:
--
--   select nome from public.clientes where cpf_cnpj is null;  -- deve voltar vazio
--   alter table public.clientes alter column cpf_cnpj set not null;
