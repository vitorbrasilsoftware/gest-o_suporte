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
index.html          — Home: resumo do dia (agendados hoje, atrasados — `renderHomeToday`) e backup; navegação só pelo menu lateral
sped.html           — Controle de SPED (PIS/COFINS, ICMS/IPI)
procedimentos.html  — Procedimentos técnicos por cliente
implantacoes.html   — Implantação: lista de clientes em andamento + ficha de implantação por cliente (uma por cliente)
diario.html         — Diário do cliente (view agregada)
problemas.html      — Problemas recorrentes / issues
agenda.html         — Visão do dia estilo Kanban
tdi.html            — TDI: tela estilo chat em que a IA monta o TDI a partir da descrição do técnico, e lista dos TDIs criados
atualizacoes.html   — Atualizações do sistema: banco de dados e estações, com técnico responsável e confirmação de realização
escala.html         — Escala dos técnicos: revezamento semanal das equipes entre os horários, com inversões e exceções
forca-vendas.html   — Força de Vendas: quais clientes têm os produtos VEM e/ou Automação de Vendas
ciencia-fv.html     — Página pública (sem login) onde o Financeiro confirma ciência da lista de Força de Vendas (`?token=`); usa só `ciencia-fv.js`
setup.html          — Cadastro de clientes, técnicos, tipos de procedimento e tipos de implantação
styles.css          — Estilos globais (único arquivo CSS)
script.js           — Toda a lógica JS (único arquivo, compartilhado entre todas as páginas)
supabase-config.js  — Instância do cliente Supabase (expõe `db`)
auth.js             — Sessão, guarda de páginas, menu lateral, permissões na UI e fluxo do login.html
supabase/auth.sql   — Tabela `perfis`, triggers e policies RLS de todas as tabelas (rodar no SQL Editor)
supabase/clientes_cpf_cnpj.sql — Coluna `clientes.cpf_cnpj` + constraint UNIQUE (rodar no SQL Editor)
supabase/clientes_forca_vendas.sql — Colunas `clientes.fv_tecnico` e `clientes.fv_observacao` (rodar no SQL Editor)
supabase/fv_ciencias.sql — Tabela `fv_ciencias` + RPCs públicas `fv_ciencia_obter`/`fv_ciencia_confirmar` (rodar no SQL Editor)
supabase/perfis_rotinas.sql — Coluna `perfis.rotinas` (rotinas liberadas por usuário) (rodar no SQL Editor)
supabase/perfil_qualidade.sql — Libera o papel `qualidade` na constraint de `perfis` (rodar no SQL Editor, antes de tdis.sql)
supabase/tdis.sql   — Tabela `tdis` com policies próprias (rodar no SQL Editor)
supabase/atualizacoes.sql — Tabela `atualizacoes` com policies próprias (rodar no SQL Editor)
supabase/escala.sql — Tabelas `escala_config` e `escala_excecoes` com policies próprias (rodar no SQL Editor)
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
| `perfis` | id (= auth.users.id), nome, email, papel (admin/tecnico/consulta), ativo (bool), rotinas (jsonb: array de páginas liberadas; null = todas) |
| `implantacoes` | id, cliente (único), status, tecnico, enquadramento, estrutura, base_gerencial_qtd, base_gerencial_descricao, base_fiscal_qtd, base_fiscal_descricao, qtd_maquinas, maquinas (jsonb), reunioes (jsonb), cronograma (jsonb), financeiro (jsonb) |
| `fv_ciencias` | id, token (único), conteudo (ambos/vem/automacao), clientes (jsonb: retrato `{ nome, cpfCnpj, vem, automacao, confirmadoEm?, confirmadoPor?, observacao? }`), criado_em, criado_por, confirmado_em/confirmado_por (preenchidos quando o último cliente é confirmado), confirmacao_observacao (legado, sem uso) |
| `tdis` | id, cliente, titulo, conteudo, descricao (texto original do técnico), imagem (data URL JPEG), criado_por (uuid, default auth.uid()), criado_por_nome, created_at |
| `atualizacoes` | id, tipo (`banco` / `estacao`), cliente, tecnico, data_prevista, versao, estacoes, observacao, realizada (bool), realizada_em (DD/MM/YYYY), confirmado_por, created_at, updated_at |
| `escala_config` | id (sempre `'principal'` — uma linha só), turnos (jsonb `[{ id, nome, periodos: [{ inicio, fim }] }]`), equipes (jsonb `[{ id, nome, turnoReferenciaId, tecnicos: [nomes] }]`), semana_referencia (DD/MM/YYYY, segunda-feira), updated_at |
| `escala_excecoes` | id, tipo (`inverter` / `inverter_daqui` / `tecnico`), data_inicio, data_fim (DD/MM/YYYY), tecnico, turno_id (vazio = folga/ausente), motivo, created_at |

**Não existe tabela `diario_cliente`.** O Diário do Cliente é uma view agregada que lê de `procedimentos` e `sped_corrections`.

## Regras importantes

### Login e controle de acesso
- Toda página (exceto `login.html`) carrega no `<head>`: supabase-js → `supabase-config.js` → `auth.js`. O `script.js` fica no fim do `<body>` e `initApp` aguarda `window.authReady` (Promise<boolean>) antes de buscar dados; se for `false`, o `auth.js` já redirecionou.
- `auth.js` esconde a página (`html.auth-pending`) até validar sessão + perfil **ativo**; sem sessão → `login.html?next=<página>`; perfil inativo → logout + `?motivo=inativo`. Páginas só de admin: `setup.html`, `usuarios.html` (`PAGINAS_ADMIN`).
- `window.auth`: `user`, `perfil`, `papel`, `can("read"|"write"|"admin")`, `signOut()`.
- Papéis: **admin** (tudo), **tecnico** (lê tudo, exceto SPED, procedimentos e atualizações, onde só vê e altera o que está atribuído a ele; escreve problemas, implantações; cria/edita clientes, sem excluir), **consulta** (somente leitura; não vê SPED, procedimentos nem atualizações), **qualidade** (somente leitura; vê os TDIs de todos os técnicos em grid; por padrão só a rotina TDI — `ROTINAS_PADRAO_POR_PAPEL` no `auth.js`, usado quando `perfis.rotinas` é null; para papel com padrão, o modal de rotinas grava sempre a lista explícita; entra direto em `tdi.html` em vez do Início). Papel novo: incluir na constraint `perfis_papel_check` (`auth.sql`/`perfil_qualidade.sql`), em `PAPEIS` (`auth.js`), `PAPEL_LABELS` (`script.js`) e nos selects de `usuarios.html`.
- **Registros atribuídos (o usuário pediu):** em `procedimentos`, `sped_corrections` e `atualizacoes`, o admin vê tudo e o técnico só as linhas cujo `tecnico` é ele (ler, criar, editar, excluir); consulta não vê nenhuma. RLS: `tecnico_e_do_usuario(tecnico)` em `auth.sql` (`atribuidas` no loop; `atualizacao_do_usuario` de `atualizacoes.sql` só chama essa função, que é repetida com o mesmo corpo em `atualizacoes.sql` para ele rodar sozinho — ao alterar uma, alterar a outra). Na tela: `registrosDoUsuario` filtra em `updateState` (vale também para Agenda, Diário e Início, que leem dessas tabelas); `fixarTecnicoDoUsuario` deixa o campo técnico dos formulários de SPED e procedimento fixo (readonly, sem menu) no nome do técnico logado (`tecnicoDoUsuario`: técnico com o mesmo e-mail do perfil; senão o nome do perfil). Usuário não-admin sem vínculo não consegue abrir o formulário. Exportar backup como não-admin avisa que o arquivo é parcial.
- A segurança real é a RLS de `supabase/auth.sql` (função `papel_atual()`); a anon key sozinha não lê nada. Ao criar tabela nova, incluí-la no script e dar policies.
- `sendData`/`deleteData` chamam `assertPermission` (`requiredPermission` espelha a RLS: backup, técnicos, tipos de procedimento, excluir cliente e "Limpar todos" = admin; resto = write). Erros de permissão têm `isPermissionError` e são exibidos pelo handler de `unhandledrejection`. Ao adicionar rota nova em `supabaseRoute`, revisar `requiredPermission`.
- UI: `data-requires="write"|"admin"` esconde elementos estáticos; o body recebe `perm-admin`/`perm-write`/`perm-readonly` e o CSS esconde `.quick-actions` e botões `onclick^=edit/delete` para quem é somente leitura.
- Menu lateral: montado pelo `auth.js` (`montarMenuLateral`, lista `MENU`) em todas as páginas protegidas — as páginas **não** têm `<nav>` próprio. Página nova = um item em `MENU` (com `admin: true` se for só de admin). Tem grupos, ícones SVG inline, item ativo pela página atual, rodapé com usuário/papel, "Alterar senha" e "Sair". No desktop pode ser recolhido (só ícones; preferência em `localStorage` `gs.sidebarRecolhido`); ≤ 900px vira gaveta aberta por um botão na `.mobile-topbar`. O espaço do menu sai do `padding-left` do `body.has-sidebar`, e `body.has-sidebar .container` sobrepõe as larguras de `.container` das media queries.
- **Rotinas por usuário (o usuário pediu):** o admin escolhe, em `usuarios.html` (coluna "Rotinas" → modal `usuarioRotinasModal`, `openUsuarioRotinas`/`saveUsuarioRotinas`), quais rotinas cada usuário não-admin pode usar. Gravado em `perfis.rotinas` (array de hrefs; tudo marcado = `null` = todas, que é o padrão dos usuários existentes). A lista de rotinas é `ROTINAS` no `auth.js` (exposta em `window.auth.ROTINAS`) — página nova que deva ser controlável entra lá também, além de `MENU`. Início, Setup e Usuários ficam fora (Início sempre liberado; os outros são só de admin). `auth.rotinaLiberada(href)`: admin sempre true. Rotina bloqueada some do menu, os links para ela no conteúdo são escondidos e abrir a página direto redireciona para `index.html?negado=rotina`.
- O bloqueio de rotinas é **só no navegador** (menu + guarda da página): a RLS continua por papel, então um técnico bloqueado numa rotina ainda conseguiria ler/gravar aquelas tabelas pela API. Só o admin altera `perfis`, então o usuário não consegue se liberar.
- Novo usuário: em `usuarios.html` o admin cadastra com senha provisória (signUp num cliente Supabase sem sessão persistida, para não deslogar o admin) e o perfil é ativado na hora. Quem usa "Solicitar acesso" no login entra inativo/`consulta` até um admin ativar. O trigger impede ficar sem nenhum admin ativo.

### Layout responsivo
- `.container` é grid com `grid-template-columns: minmax(0, 1fr)` — sem isso uma tabela larga (`table { min-width: 1240px }`) estica a coluna e a página inteira passa da tela. Tabela larga rola dentro do `.table-wrap`.
- SPED (`sped.html`): o card da lista é `.sped-card` (`container-type: inline-size`) e as tabelas têm `.sped-table`. Cada `<td>` tem `data-label` (`spedLinhaTabela`); com o card ≤ 880px (`@container`) cada linha vira um card com rótulos (3 colunas de campos; 2 abaixo de 520px). No desktop a tabela é compacta: Telefone e Horário viram segunda linha (`.sped-sub`) do Técnico e do Agendamento, e suas colunas (`.sped-col-extra`) só aparecem nos cards. Ao mudar colunas do SPED, manter `SPED_LABELS_TABELA`/`SPED_LABELS_AGRUPADO` e os `<th>` alinhados.
- Ao alterar `styles.css`/`script.js`/`auth.js`, subir o `?v=` em todas as páginas (cache do navegador).

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
- A tabela só lista clientes quando há busca (nome ou CPF/CNPJ) e/ou filtro de produto ativo — o filtro "Todos os clientes" lista todo mundo; sem nada, fica vazia com uma instrução. A página não tem resumo/dashboard de totais no topo (o usuário pediu para tirar). Botão "Limpar filtros".
- Botão "Gerar relatório PDF" abre o modal `fvPdfModal`, onde se escolhe o conteúdo (`fvPdfConteudo`): "VEM e Automação de Vendas (ATS)" (padrão), "Somente VEM" ou "Somente Automação de Vendas (ATS)" — o usuário chama Automação de Vendas de "ATS". Um checkbox "Informar o técnico responsável" (`fvPdfTecnico`, **desmarcado por padrão** e desmarcado de novo a cada abertura do modal) acrescenta a coluna de técnico depois do CPF/CNPJ. (A regra "sem checkboxes" vale para o modal de edição `fvFormModal`, não para este.)
- Ao confirmar o modal, `generateForcaVendasPdf` usa `window.print()` em **A4 paisagem** (injeta `<style id="fvPdfPageStyle">@page { size: A4 landscape }` e remove no `afterprint`, para não afetar o PDF de implantação) sobre uma área oculta (`#fvPdfArea`, mesmo padrão de `generateImplantacaoPdf`/`#implPdfArea`), independente da busca na tela. **Uma tabela só** (o usuário não quer seções separadas por produto): `# | Cliente | CPF/CNPJ | VEM | ATS | Total`, uma linha por cliente que tem ao menos um dos produtos, com a quantidade de vendedores licenciados de cada produto ("—" no produto que o cliente não tem) e o total da linha; o rodapé traz o número de clientes e a soma de cada coluna. Com "Somente VEM"/"Somente ATS", entram só os clientes daquele produto e aparece só a coluna dele (sem a coluna Total, que seria repetida).

### Ciência do Financeiro (Força de Vendas)
- O Financeiro não tem login: em `forca-vendas.html`, o card "Ciência do Financeiro" gera um link `ciencia-fv.html?token=<64 hex>` (modal `fvCienciaModal`, `saveFvCiencia`, `POST /api/fv-ciencias`) e lista os links gerados (`renderFvCiencias`) com a situação (Aguardando / Parcial / Ciente + "N de M clientes"), "Ver clientes" (modal `fvCienciaDetalheModal`, `verFvCienciaDetalhe`: situação, quem/quando e observação de cada cliente), copiar, abrir e excluir.
- O link guarda um **retrato** da lista no momento em que é gerado (`buildFvCienciaSnapshot`, mesmo critério do PDF); se os dados mudarem depois, a linha mostra "Dados alterados desde o envio" e o certo é gerar um link novo.
- **A ciência é individual, por cliente** (o usuário pediu): na página pública cada linha tem um botão "Ciente" que abre um modal com o nome de quem está dando ciência (obrigatório, vem preenchido com o último usado — `localStorage` `gs.cienciaNome`) e a observação opcional; não há campo de nome fora do modal. `fv_ciencia_confirmar(token, indice, nome, observacao)` grava `confirmadoEm`/`confirmadoPor`/`observacao` no item `clientes[indice]` e nunca sobrescreve um cliente já confirmado. A página pública não tem resumo/dashboard de totais no topo (o usuário pediu para tirar) — os totais ficam só no rodapé da tabela. Também não mostra o subtítulo do conteúdo ("Somente clientes com VEM"...) nem "Lista enviada por X em data" nem texto de instrução — só o título e a tabela.
- `fv_ciencias` fica fora de `supabaseAllData` (carregada só nesta página por `loadFvCiencias`, que tolera a tabela ainda não existir) e fora do loop de `auth.sql` (tem policies próprias em `fv_ciencias.sql`, sem UPDATE). A anon key não lê a tabela: a página pública só usa as funções `security definer` `fv_ciencia_obter` e `fv_ciencia_confirmar`, que exigem o token.

### Atualizações do sistema (`atualizacoes.html`)
- Dois tipos: atualização de **banco de dados** (`banco`) e de **estações** (`estacao`; campo `estacoes` = quais/quantas estações, só aparece nesse tipo). Cada uma tem cliente (só clientes cadastrados, combo `atuClientMenu`), técnico responsável (de `state.tecnicos`, obrigatório), data prevista, versão e observação.
- **Cadastro em lote (o usuário pediu):** em "Nova atualização" o campo vira "Clientes" e aceita vários clientes (chips `.atu-chip`, `state.atuClientesLote`; escolher no menu ou Enter no nome; quem já foi escolhido sai do menu). Ao salvar (`saveAtualizacoesLote`), cria **uma atualização por cliente** com os mesmos técnico/tipo/data/versão/estações/observação/situação, num único INSERT (`POST /api/atualizacoes-lote`, admin; linha montada por `atuRowDoPayload`, a mesma do cadastro unitário). Na edição continua um cliente só.
- **Um cliente, um técnico (o usuário pediu):** enquanto o cliente tiver atualização **pendente** com um técnico, ele não pode receber atualização pendente de outro técnico; depois que as dele forem realizadas, fica livre. No banco: trigger `atualizacoes_cliente_um_tecnico` (insert/update, compara cliente e técnico com `lower(trim())`). Na tela: `atuTecnicoPendenteDoCliente`/`atuConflitosTecnico` — o menu de clientes mostra "pendente com X" e bloqueia (`.combo-option--bloqueada`) quando X ≠ técnico escolhido; chips em conflito ficam vermelhos (`.atu-chip--conflito`, recalculados ao trocar o técnico); salvar (lote ou edição) é recusado com a lista de conflitos.
- Confirmação de realização: botão **"Realizado"** na linha (nome pedido pelo usuário) (`confirmarAtualizacao`, `PATCH /api/atualizacoes-confirmar/:id`: grava hoje em `realizada_em` e o usuário logado em `confirmado_por`) ou o select "Atualização realizada?" no modal `atuFormModal` (com data da realização). Pendente com data prevista passada aparece como "Atrasada".
- Atualização de banco confirmada com versão também grava `clientes.versao_banco` (`/api/clientes-versao/:id`), como o procedimento "Atualização de banco"; ao editar uma já confirmada, só regrava se a versão mudou.
- Filtros: busca, tipo, situação (padrão "Pendentes") e técnico. Pendentes primeiro, pela data prevista.
- **Visibilidade (o usuário pediu):** só o admin vê todas; o técnico vê só as atribuídas a ele; consulta não vê nenhuma. Garantido pela RLS de `atualizacoes.sql` (função `atualizacao_do_usuario(tecnico)`) e espelhado na tela (`atuAtualizacoesVisiveis`; filtro de técnico só para o admin).
- **Técnico só confirma (o usuário pediu):** cadastrar, editar e excluir atualização é só do admin ("Nova atualização" com `data-requires="admin"`, Editar/Excluir só para admin, `requiredPermission` = admin em `/api/atualizacoes`). O técnico tem só o botão "Realizado" (`/api/atualizacoes-confirmar/`, permissão write). No banco: INSERT/DELETE só admin; o UPDATE do técnico passa pela policy mas o trigger `atualizacoes_tecnico_so_confirma` só aceita marcar como realizada (sem mudar outros campos nem desfazer).
- Vínculo usuário ↔ técnico (`atuTecnicoDoUsuario`, mesmo critério da RLS): cadastro em `tecnicos` com o mesmo e-mail do perfil; sem isso, o nome do perfil igual ao nome do técnico (sem diferenciar maiúsculas). Técnico sem vínculo não consegue cadastrar (alerta pedindo o e-mail em Setup).
- A tabela fica fora de `supabaseAllData` (carregada só nesta página por `loadAtualizacoes`, que tolera ela ainda não existir e mostra aviso) e fora do loop de `auth.sql` (policies próprias em `atualizacoes.sql`).

### TDI (`tdi.html`)
- Tela estilo ChatGPT/Claude (`.tdi-composer`, só para quem tem `write`): o técnico escolhe o cliente (combo `tdiCliente`, só clientes cadastrados), descreve o TDI em texto livre e pode anexar uma imagem (reduzida no navegador para JPEG com lado ≤ 1600px, `tdiLerImagem`). Enter envia, Shift+Enter quebra linha.
- A IA monta o TDI (`tdiChamarIA`): Claude `claude-opus-5-5`, effort `medium`, saída estruturada (`output_config.format` json_schema `{ titulo, conteudo }`), `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`) e tratamento de `stop_reason` `refusal`/`max_tokens`. As seções do TDI ficam em `TDI_INSTRUCOES` (ajustar ali se o modelo de TDI mudar); o `conteudo` usa `## Seção` e listas `- `/`1. `, renderizados por `tdiRenderDoc` (sempre escapado).
- O resultado vira um rascunho editável (título + conteúdo). Com rascunho na tela, o que for enviado é um **ajuste**: um pedido novo e sem histórico, com o rascunho atual + o pedido (não reenvia a conversa). "Salvar TDI" grava (`POST /api/tdis`); "Descartar" limpa. Em erro, o texto e a imagem voltam para o campo.
- Chamada pelo mesmo `proxy.js` do assistente do Início (`http://localhost:3001/api/chat`), que agora repassa os cabeçalhos `anthropic-version` e `anthropic-beta` enviados pela página (o TDI manda `2026-10-21` + o beta de fallback; sem cabeçalho, o proxy mantém `2023-06-01`). O proxy precisa estar rodando (`node proxy.js`) e acessível no `localhost` de quem usa.
- Abaixo, a lista "Meus TDIs" (`renderTdis`): o técnico vê só os que criou; o admin vê todos ("TDIs"), com filtro por técnico. Clicar abre `tdiVerModal` (conteúdo formatado, imagem, descrição original, "Copiar texto", "Excluir" só admin). Sem edição depois de salvo.
- **Perfil Qualidade (o usuário pediu):** vê os TDIs de todos os técnicos num **grid** (`renderTdiGrid`, `tdiModoQualidade`): tabela Data/Técnico/Cliente/Título/Imagem, ordenável pelo cabeçalho (`state.tdiOrdem`), filtros de busca, técnico, cliente e período (De/Até sobre a data local de criação), total "N de M"; clicar na linha (ou Enter) abre `tdiVerModal`. Sem o composer (`data-requires="write"`). Em telas ≤ 720px o grid vira cards. RLS de `tdis`: SELECT também para `qualidade`.
- Tabela `tdis` (`supabase/tdis.sql`), fora de `supabaseAllData` (`loadTdis`, tolera a tabela não existir). RLS: SELECT admin ou `criado_por = auth.uid()`; INSERT admin/técnico em nome próprio; DELETE só admin; sem UPDATE. `requiredPermission`: DELETE `/api/tdis/` = admin.

### Escala dos técnicos (`escala.html`)
- Três horários, segunda a sexta (padrão: "Horário 1" 08:00–11:00 · 13:00–18:00, "Horário 2" 09:00–13:00 · 15:00–19:00 e "Horário 3" 08:00–12:00 · 14:00–18:00). As Equipes A e B revezam semanalmente entre os Horários 1 e 2; a **Equipe C é fixa** no Horário 3 (o usuário pediu) — não reveza nem é afetada pelas inversões.
- Cada equipe tem `fixo` (bool, dentro do JSONB `equipes`; select "Revezamento" no modal). Equipe fixa fica sempre no seu `turnoReferenciaId`, e esse horário sai do revezamento: as demais giram só entre os horários restantes (`escalaTurnosRotativos`/`escalaIndiceNaConfig`). Uma `e3` salva sem `fixo` é lida como fixa (`loadEscala`, `ajustePendente`).
- Configurações salvas antes de existir o Horário 3/Equipe C recebem os itens que faltam ao abrir o modal (`escalaConfigComPadroes`); nesse caso (ou com `ajustePendente`) o modal propõe a semana atual como referência, mantendo nela o horário atual das equipes antigas, e só passa a valer ao salvar. Horários, nomes das equipes, quem está em cada equipe e a semana de referência são editados no modal "Configurar escala" (`openEscalaConfigModal`/`saveEscalaConfig`, `PUT /api/escala-config` faz upsert da linha `'principal'`). Os técnicos vêm de `state.tecnicos`; cada técnico fica em no máximo uma equipe (select por técnico).
- Horário efetivo de uma equipe numa semana (`escalaIndiceTurnoEquipe`): índice-base (`turnoReferenciaId`) + semanas desde `semana_referencia` + nº de inversões `inverter_daqui` até a semana + 1 se a semana tiver inversão `inverter` — tudo módulo nº de horários rotativos (equipe fixa ignora isso). Por isso "Inverter a partir desta semana" grava uma exceção em vez de mudar a referência: as semanas passadas não mudam. Ao salvar a configuração, o índice-base é gravado já descontando as inversões permanentes até a referência, para que a semana de referência fique exatamente como escolhida no modal.
- Exceções por técnico (`tipo = 'tecnico'`): período (de/até), horário nesse período ou folga/ausente (`turno_id` vazio) e motivo; se mais de uma cobrir o mesmo dia, vale a mais recente. Abertas pelo botão "Nova exceção" (quem tem `write`). A página não tem tabela "Dia a dia" (o usuário pediu para tirar): a semana aparece só nos cards por horário, que mostram as exceções como notas.
- Enquanto a configuração nunca foi salva, a página usa `escalaConfigPadrao()` (referência = semana atual, que andaria com o calendário); por isso inversões e exceções chamam `escalaGarantirConfigSalva()` antes de gravar.
- As tabelas ficam fora de `supabaseAllData` (carregadas só nesta página por `loadEscala`, que tolera elas ainda não existirem e mostra aviso) e fora do loop de `auth.sql` (policies próprias em `escala.sql`: leitura para todos os perfis, escrita para admin e técnico).

### CPF/CNPJ do cliente
- Campo obrigatório no `clienteForm` (`clientes.html` e `setup.html`) e único. Um select "Documento" (`clienteTipoDocumento`: CNPJ/CPF, padrão CNPJ) define o campo: CPF = 11 dígitos, CNPJ = 14 caracteres, sem pontuação (`onClienteTipoDocumentoChange` ajusta rótulo/placeholder; `onClienteCpfCnpjInput` remove pontuação e corta o excesso). Não usar `maxlength` no input: ele cortaria o texto colado com pontuação antes da limpeza. Ao colar (`onClienteCpfCnpjPaste`), a pontuação é removida e o tipo é ajustado pelo tamanho (11 dígitos = CPF, 14 = CNPJ). O tipo não é gravado — na edição é deduzido pelo tamanho do documento.
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
