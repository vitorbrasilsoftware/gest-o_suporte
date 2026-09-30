# Gestão Suporte

Sistema web de gestão de suporte técnico. Sem framework, sem build step — HTML/CSS/JS puro com Supabase como backend.

## Stack

- **Frontend**: HTML + CSS + JavaScript vanilla (sem React, Vue, etc.)
- **Backend**: Supabase (PostgreSQL via PostgREST)
- **Autenticação**: Supabase Auth (e-mail + senha) com perfis de acesso e RLS — ver "Login e controle de acesso"
- **Deploy**: arquivos estáticos, podem ser abertos direto no browser

## Estrutura de arquivos

```
login.html          — Login, solicitar acesso, recuperar e redefinir senha (não carrega script.js)
usuarios.html       — Gestão de usuários e perfis (somente admin)
index.html          — Home / painel com links e backup
sped.html           — Controle de SPED (PIS/COFINS, ICMS/IPI)
procedimentos.html  — Procedimentos técnicos por cliente
implantacoes.html   — Implantação: lista de clientes em andamento + ficha de implantação por cliente (uma por cliente)
diario.html         — Diário do cliente (view agregada)
problemas.html      — Problemas recorrentes / issues
agenda.html         — Visão do dia estilo Kanban
forca-vendas.html   — Força de Vendas: quais clientes têm os produtos VEM e/ou Automação de Vendas
setup.html          — Cadastro de clientes, técnicos, tipos de procedimento e tipos de implantação
styles.css          — Estilos globais (único arquivo CSS)
script.js           — Toda a lógica JS (único arquivo, compartilhado entre todas as páginas)
supabase-config.js  — Instância do cliente Supabase (expõe `db`)
auth.js             — Sessão, guarda de páginas, barra do usuário, permissões na UI e fluxo do login.html
supabase/auth.sql   — Tabela `perfis`, triggers e policies RLS de todas as tabelas (rodar no SQL Editor)
supabase/clientes_cpf_cnpj.sql — Coluna `clientes.cpf_cnpj` + constraint UNIQUE (rodar no SQL Editor)
supabase/clientes_forca_vendas.sql — Colunas `clientes.fv_tecnico` e `clientes.fv_observacao` (rodar no SQL Editor)
```

## Arquitetura JS

O `script.js` é **compartilhado por todas as páginas**. Funciona assim:

- **`state`**: objeto global com todos os dados em memória (`state.issues`, `state.spedCorrections`, `state.procedimentos`, etc.)
- **`refs`**: objeto com todos os elementos DOM, populado via `document.getElementById()` no carregamento. Elementos que não existem na página atual retornam `null` — sempre verificar `if (refs.elemento)` antes de usar.
- **`supabaseAllData()`**: busca todas as tabelas em paralelo e retorna os dados mapeados para JS.
- **`updateState(data)`**: atualiza o `state` global com os dados recebidos.
- **`refreshCurrentView()`**: re-renderiza as seções presentes na página atual (verifica `refs` para saber quais existem).
- **`supabaseRoute(path, method, payload)`**: camada de abstração das operações no banco — centraliza todos os INSERTs, UPDATEs, DELETEs.
- **`sendData(path, method, payload)`**: chama `supabaseRoute` + `updateState` + `refreshCurrentView` em sequência.

## Tabelas no Supabase

| Tabela | Campos principais |
|---|---|
| `clientes` | id, nome, cpf_cnpj (único), telefone, prioridade, sped (bool), versao_banco, vem (bool), vem_licencas (int), automacao_vendas (bool), automacao_vendas_licencas (int), fv_tecnico, fv_observacao |
| `tecnicos` | id, nome, email |
| `tipos_procedimento` | id, nome |
| `procedimentos` | id, cliente, tipo, status, tecnico, telefone, data_agendamento, horario, data_finalizacao, observacao, versao_banco |
| `sped_clients` | name, phone |
| `sped_corrections` | id, cliente, competencia, tipo, status, tecnico, telefone, data_agendamento, horario_agendamento, data_finalizacao, observacao |
| `issues` | id, descricao, tecnicos (array), jira, cliente |
| `perfis` | id (= auth.users.id), nome, email, papel (admin/tecnico/consulta), ativo (bool) |
| `implantacoes` | id, cliente (único), status, tecnico, enquadramento, estrutura, base_gerencial_qtd, base_gerencial_descricao, base_fiscal_qtd, base_fiscal_descricao, qtd_maquinas, maquinas (jsonb), reunioes (jsonb), cronograma (jsonb), financeiro (jsonb) |

**Não existe tabela `diario_cliente`.** O Diário do Cliente é uma view agregada que lê de `procedimentos` e `sped_corrections`.

## Regras importantes

### Login e controle de acesso
- Toda página (exceto `login.html`) carrega no `<head>`: supabase-js → `supabase-config.js` → `auth.js`. O `script.js` fica no fim do `<body>` e `initApp` aguarda `window.authReady` (Promise<boolean>) antes de buscar dados; se for `false`, o `auth.js` já redirecionou.
- `auth.js` esconde a página (`html.auth-pending`) até validar sessão + perfil **ativo**; sem sessão → `login.html?next=<página>`; perfil inativo → logout + `?motivo=inativo`. Páginas só de admin: `setup.html`, `usuarios.html` (`PAGINAS_ADMIN`).
- `window.auth`: `user`, `perfil`, `papel`, `can("read"|"write"|"admin")`, `signOut()`.
- Papéis: **admin** (tudo), **tecnico** (lê tudo; escreve SPED, procedimentos, problemas, implantações; cria/edita clientes, sem excluir), **consulta** (somente leitura).
- A segurança real é a RLS de `supabase/auth.sql` (função `papel_atual()`); a anon key sozinha não lê nada. Ao criar tabela nova, incluí-la no script e dar policies.
- `sendData`/`deleteData` chamam `assertPermission` (`requiredPermission` espelha a RLS: backup, técnicos, tipos de procedimento, excluir cliente e "Limpar todos" = admin; resto = write). Erros de permissão têm `isPermissionError` e são exibidos pelo handler de `unhandledrejection`. Ao adicionar rota nova em `supabaseRoute`, revisar `requiredPermission`.
- UI: `data-requires="write"|"admin"` esconde elementos estáticos; o body recebe `perm-admin`/`perm-write`/`perm-readonly` e o CSS esconde `.quick-actions` e botões `onclick^=edit/delete` para quem é somente leitura.
- Novo usuário: em `usuarios.html` o admin cadastra com senha provisória (signUp num cliente Supabase sem sessão persistida, para não deslogar o admin) e o perfil é ativado na hora. Quem usa "Solicitar acesso" no login entra inativo/`consulta` até um admin ativar. O trigger impede ficar sem nenhum admin ativo.

### Implantação (`implantacoes.html`)
- Página única: no topo, a lista somente-leitura (`renderImplAbertas`) de todos os clientes de `implantacoes` com `status` igual a "Em andamento" (ordenados por nome), mostrando o técnico responsável e um badge de status. Clicar em um item chama `selectImplClient` e rola a página até a ficha abaixo — não navega para outra página.
- Abaixo da lista, o seletor de cliente (busca) e a ficha de implantação do cliente selecionado, com os dados gerais, cronograma, reuniões e financeiro.
- Ficha única por cliente: cada cliente tem no máximo um registro em `implantacoes` (coluna `cliente` é `UNIQUE`).
- Os dados gerais (técnico, status, enquadramento, estrutura, máquinas) são editados em um modal (`implFormModal`, botão "Editar dados"); a página principal mostra só um card somente-leitura (`renderImplSummary`) — os dados não ficam expostos em um formulário sempre aberto.
- `enquadramento` é o regime tributário da empresa: "Simples Nacional", "Lucro Real" ou "Lucro Presumido" (select de opções fixas, sem cadastro em `setup.html` — não confundir com `clientes.tipo_empresa`, que trata de Matriz/Filial/Independente).
- "Estrutura do cliente" agrupa: quantidade e descrição das bases Gerencial e Fiscal (`base_gerencial_qtd`/`base_gerencial_descricao`/`base_fiscal_qtd`/`base_fiscal_descricao` — campos fixos, não uma lista), observações gerais em texto livre (`estrutura`) e as máquinas de acesso remoto (`maquinas`). No modal e no card-resumo essas três partes ficam juntas sob o mesmo título "Estrutura do cliente".
- `maquinas`, `reunioes`, `cronograma` e `financeiro` são arrays JSONB armazenados dentro do próprio registro (não são tabelas separadas). Cada item de `maquinas` é `{ descricao, codigo, senha }` — a quantidade de itens é controlada pelo campo "Quantidade de máquinas" no modal (`onImplQtdMaquinasChange` gera/remove campos dinamicamente e confirma antes de descartar dados preenchidos). No card-resumo a senha fica mascarada com um botão "Mostrar/Ocultar" (`bindImplSenhaToggle`). Cada item de `reunioes` é `{ id, data, texto }`; cada item de `cronograma` é `{ id, etapa, tecnico, data, status }` (status: "Pendente" ou "Concluído").
- "Financeiro da implantação" é onde o técnico presta contas dos gastos feitos durante a implantação (ex.: deslocamento, hospedagem, material). Cada item de `financeiro` é `{ id, tecnico, data, valor, descricao }`. A tabela mostra um "Total de gastos" somando todos os valores (`renderImplFinanceiro`).
- Ao selecionar um cliente sem ficha, o card-resumo mostra o estado vazio; a ficha só é criada no banco (INSERT) ao salvar dados gerais, adicionar uma etapa do cronograma, uma anotação de reunião ou um gasto do financeiro — o que ocorrer primeiro (`persistImplantacao` decide INSERT vs UPDATE pela presença de `id`).
- A página lê o parâmetro de URL `?cliente=` no carregamento (`initApp`) e seleciona automaticamente esse cliente via `selectImplClient` — permite linkar direto para a ficha de um cliente específico (`implantacoes.html?cliente=<nome>`).

### Diário do Cliente (`diario.html`)
- Não persiste dados próprios — exibe registros de `procedimentos` e `sped_corrections` filtrados pelo cliente selecionado.
- `state.diario` é sempre `[]` (campo legado mantido por compatibilidade com `renderDiario`).
- O card "Estrutura do Cliente" exibe `versao_banco` lido da tabela `clientes`.

### Força de Vendas (`forca-vendas.html`)
- Não é uma tabela própria: `vem`/`automacao_vendas` (bool) e `vem_licencas`/`automacao_vendas_licencas` (int, quantidade de vendedores com licença de uso) são colunas da tabela `clientes`.
- Os dois produtos são independentes entre si — um cliente pode ter nenhum, um ou os dois, cada um com sua própria quantidade de licenças.
- `fv_tecnico` (técnico responsável, nome vindo de `state.tecnicos`) e `fv_observacao` (texto livre) também são colunas de `clientes` — um valor por cliente, comum aos dois produtos.
- Ao desmarcar um produto (`vem`/`automacao_vendas` = false), a quantidade de licenças correspondente é zerada junto — não faz sentido manter licenças de um produto que o cliente não tem.
- Editáveis em dois lugares que gravam no mesmo registro: (1) no formulário de cadastro do cliente (`clienteForm`, presente em `clientes.html` e `setup.html`), junto com os demais dados do cliente — o campo de quantidade só aparece quando o produto está marcado como "Sim"; (2) em `forca-vendas.html`, pelo botão "Editar" de cada linha, que abre o modal `fvFormModal` (`editForcaVendas`/`saveForcaVendas`) com Sim/Não + licenças por produto, técnico e observação. Grava via `PATCH /api/clientes-fv/:id`, que só toca nas colunas de força de vendas (não reescreve o resto do cliente). Sem checkboxes — o usuário não quer.
- A tabela é somente leitura: cliente, CPF/CNPJ, VEM e Automação como badge ("Sim · N licenças"/"Não"), técnico, observação (truncada, texto completo no `title`) e o botão Editar.
- A tabela só lista clientes quando há busca (nome ou CPF/CNPJ) e/ou filtro de produto ativo — o filtro "Todos os clientes" lista todo mundo; sem nada, fica vazia com uma instrução. O resumo no topo mostra os totais da base inteira enquanto não há filtro, e os do resultado filtrado depois. Botão "Limpar filtros".
- Botão "Gerar relatório PDF" (`generateForcaVendasPdf`) usa `window.print()` em **A4 paisagem** (injeta `<style id="fvPdfPageStyle">@page { size: A4 landscape }` e remove no `afterprint`, para não afetar o PDF de implantação) sobre uma área oculta (`#fvPdfArea`, mesmo padrão de `generateImplantacaoPdf`/`#implPdfArea`), independente da busca na tela. Sem resumo de totais — só **duas tabelas separadas** (uma por produto: "Clientes com VEM" e "Clientes com Automação de Vendas", colunas: cliente, CPF/CNPJ, técnico responsável, quantidade de vendedores), cada uma listando só quem tem aquele produto — um cliente sem VEM simplesmente não aparece na tabela de VEM, não há coluna nem célula vazia para o produto que ele não tem.

### CPF/CNPJ do cliente
- Campo obrigatório no `clienteForm` (`clientes.html` e `setup.html`) e único. Um select "Documento" (`clienteTipoDocumento`: CNPJ/CPF, padrão CNPJ) define o campo: CPF = 11 dígitos, CNPJ = 14 caracteres, sem pontuação (`onClienteTipoDocumentoChange` ajusta `maxLength`/rótulo; `onClienteCpfCnpjInput` remove o que não cabe). O tipo não é gravado — na edição é deduzido pelo tamanho do documento.
- `saveCliente` valida tamanho e dígitos verificadores conforme o tipo escolhido (`isValidCpf`/`isValidCnpj` — o CNPJ aceita o formato alfanumérico), bloqueia duplicado em `state.clientes` e trata o `23505` do banco.
- Armazenado sem pontuação e em maiúsculas (`normalizeCpfCnpj`); exibido com máscara só na listagem (`formatCpfCnpj`). Coluna criada por `supabase/clientes_cpf_cnpj.sql` (UNIQUE; aceita NULL só por causa dos clientes antigos).
- Todo PUT em `/api/clientes/:id` grava `cpf_cnpj` — quem montar payload completo de cliente precisa repassar `cpfCnpj`, senão apaga o documento. Para alterar só parte do cliente, prefira uma rota PATCH dedicada (como `/api/clientes-fv/` e `/api/clientes-versao/`).

### Atualização de banco
- Quando um procedimento do tipo "Atualização de banco" é salvo com `versaoBanco` preenchido, o sistema também faz PATCH em `clientes.versao_banco` via `/api/clientes-versao/:id`.
- Após salvar, `updateState` + `refreshCurrentView` atualiza automaticamente o campo `#estruturaVersaoBanco` no diário.

### Formato de datas
- Armazenamento interno e no banco: `DD/MM/YYYY`
- Inputs HTML `type="date"`: `YYYY-MM-DD`
- Conversão: `toStorageDate()` (input → storage) e `storageToInputDate()` (storage → input)

### Comparação de strings
- Sempre usar `normalizeText()` para comparar nomes de clientes, técnicos etc. — remove acentos e converte para minúsculo.

### IDs
- Gerados no frontend via `createId()` (UUID v4-like).

## Backup / Restore

- **Exportar**: botão na `index.html` — gera JSON com `issues`, `spedCorrections`, `spedClients`, `procedimentos`.
- **Importar**: substitui todos os dados via `replaceSupabaseData()` — apaga tudo antes de reinserir.
- O campo `diario` em backups antigos é ignorado (tabela não existe mais).
