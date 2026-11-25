const ISSUES_STORAGE_KEY = "projeto_problemas_recorrentes_data";
const SPED_STORAGE_KEY = "projeto_problemas_recorrentes_sped_data";
const SPED_CLIENTS_STORAGE_KEY = "projeto_problemas_recorrentes_sped_clients";

const state = {
  issues: [],
  spedCorrections: [],
  spedClients: [],
  procedimentos: [],
  diario: [],
  diarioSelectedClient: "",
  activeSpedTab: "todos",
  activeProcTab: "todos",
  clientes: [],
  tecnicos: [],
  tiposProcedimento: [],
  implantacoes: [],
  usuarios: [],
  fvCiencias: [],
  escala: null,
  escalaExcecoes: [],
  escalaSemana: null,
  escalaErro: false,
  implSelectedClient: "",
  implSummaryVisible: false,
  activeImplTab: "andamento",
  expandedMatrizes: new Set(),
  listShowAll: { clientes: false, tecnicos: false, tiposProc: false }
};

const SETUP_LIST_PAGE_SIZE = 10;

function applyListLimit(items, key) {
  if (state.listShowAll[key] || items.length <= SETUP_LIST_PAGE_SIZE) return items;
  return items.slice(0, SETUP_LIST_PAGE_SIZE);
}

function updateShowMoreButton(wrapEl, btnEl, key, totalCount) {
  if (!wrapEl || !btnEl) return;
  if (totalCount <= SETUP_LIST_PAGE_SIZE) {
    wrapEl.style.display = "none";
    return;
  }
  wrapEl.style.display = "";
  const hiddenCount = totalCount - SETUP_LIST_PAGE_SIZE;
  btnEl.textContent = state.listShowAll[key]
    ? "Mostrar menos"
    : `Mostrar mais (${hiddenCount} restante${hiddenCount === 1 ? "" : "s"})`;
}

const refs = {
  showSpedFormBtn: document.getElementById("showSpedFormBtn"),
  showClientFormBtn: document.getElementById("showClientFormBtn"),
  spedFormModal: document.getElementById("spedFormModal"),
  spedClientModal: document.getElementById("spedClientModal"),
  spedClientForm: document.getElementById("spedClientForm"),
  spedClientModalTitle: document.getElementById("spedClientModalTitle"),
  spedClientName: document.getElementById("spedClientName"),
  spedClientPhone: document.getElementById("spedClientPhone"),
  spedClientOriginalName: document.getElementById("spedClientOriginalName"),
  spedClientSubmitBtn: document.getElementById("spedClientSubmitBtn"),
  cancelClientEditBtn: document.getElementById("cancelClientEditBtn"),
  spedClientList: document.getElementById("spedClientList"),
  spedForm: document.getElementById("spedForm"),
  spedId: document.getElementById("spedId"),
  spedCliente: document.getElementById("spedCliente"),
  spedClientMenu: document.getElementById("spedClientMenu"),
  spedCompetencia: document.getElementById("spedCompetencia"),
  spedTipo: document.getElementById("spedTipo"),
  spedStatus: document.getElementById("spedStatus"),
  spedTecnico: document.getElementById("spedTecnico"),
  spedTelefone: document.getElementById("spedTelefone"),
  spedDataAgendamento: document.getElementById("spedDataAgendamento"),
  spedHorarioAgendamento: document.getElementById("spedHorarioAgendamento"),
  spedDataFinalizacao: document.getElementById("spedDataFinalizacao"),
  spedObservacao: document.getElementById("spedObservacao"),
  cancelSpedEditBtn: document.getElementById("cancelSpedEditBtn"),
  clearSpedBtn: document.getElementById("clearSpedBtn"),
  spedSummary: document.getElementById("spedSummary"),
  spedClientFilter: document.getElementById("spedClientFilter"),
  spedSearchInput: document.getElementById("spedSearchInput"),
  spedMonthFilter: document.getElementById("spedMonthFilter"),
  spedTableBody: document.getElementById("spedTableBody"),
  spedGroupedList: document.getElementById("spedGroupedList"),
  spedEmptyState: document.getElementById("spedEmptyState"),
  issueForm: document.getElementById("issueForm"),
  issueId: document.getElementById("issueId"),
  issueDescricao: document.getElementById("issueDescricao"),
  issueTecnicos: document.getElementById("issueTecnicos"),
  issueJira: document.getElementById("issueJira"),
  issueCliente: document.getElementById("issueCliente"),
  cancelIssueEditBtn: document.getElementById("cancelIssueEditBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  searchInput: document.getElementById("searchInput"),
  issueTableBody: document.getElementById("issueTableBody"),
  issueEmptyState: document.getElementById("issueEmptyState"),
  exportBackupBtn: document.getElementById("exportBackupBtn"),
  importBackupInput: document.getElementById("importBackupInput"),
  homeTodayStats: document.getElementById("homeTodayStats"),
  homeTodayLabel: document.getElementById("homeTodayLabel"),
  homeTodayList: document.getElementById("homeTodayList"),
  homeTodayEmpty: document.getElementById("homeTodayEmpty"),
  homeAtrasadosList: document.getElementById("homeAtrasadosList"),
  homeAtrasadosEmpty: document.getElementById("homeAtrasadosEmpty"),
  showProcFormBtn: document.getElementById("showProcFormBtn"),
  procFormModal: document.getElementById("procFormModal"),
  procForm: document.getElementById("procForm"),
  procId: document.getElementById("procId"),
  procCliente: document.getElementById("procCliente"),
  procClientMenu: document.getElementById("procClientMenu"),
  procTipo: document.getElementById("procTipo"),
  procVersaoBancoRow: document.getElementById("procVersaoBancoRow"),
  procVersaoBanco: document.getElementById("procVersaoBanco"),
  procStatus: document.getElementById("procStatus"),
  procTecnico: document.getElementById("procTecnico"),
  procTelefone: document.getElementById("procTelefone"),
  procDataAgendamento: document.getElementById("procDataAgendamento"),
  procHorario: document.getElementById("procHorario"),
  procDataFinalizacao: document.getElementById("procDataFinalizacao"),
  procObservacao: document.getElementById("procObservacao"),
  cancelProcEditBtn: document.getElementById("cancelProcEditBtn"),
  clearProcBtn: document.getElementById("clearProcBtn"),
  procSummary: document.getElementById("procSummary"),
  procClientFilter: document.getElementById("procClientFilter"),
  procSearchInput: document.getElementById("procSearchInput"),
  procMonthFilter: document.getElementById("procMonthFilter"),
  procTableBody: document.getElementById("procTableBody"),
  procEmptyState: document.getElementById("procEmptyState"),
  procGroupedList: document.getElementById("procGroupedList"),
  procObsModal: document.getElementById("procObsModal"),
  procObsContent: document.getElementById("procObsContent"),
  showDiarioFormBtn: document.getElementById("showDiarioFormBtn"),
  diarioFormModal: document.getElementById("diarioFormModal"),
  diarioForm: document.getElementById("diarioForm"),
  diarioId: document.getElementById("diarioId"),
  diarioCliente: document.getElementById("diarioCliente"),
  diarioData: document.getElementById("diarioData"),
  diarioTipo: document.getElementById("diarioTipo"),
  diarioDescricao: document.getElementById("diarioDescricao"),
  diarioTecnico: document.getElementById("diarioTecnico"),
  diarioObservacao: document.getElementById("diarioObservacao"),
  cancelDiarioEditBtn: document.getElementById("cancelDiarioEditBtn"),
  clearDiarioBtn: document.getElementById("clearDiarioBtn"),
  diarioSummary: document.getElementById("diarioSummary"),
  diarioClientSearch: document.getElementById("diarioClientSearch"),
  diarioClientMenu: document.getElementById("diarioClientMenu"),
  diarioClientView: document.getElementById("diarioClientView"),
  diarioNoClientState: document.getElementById("diarioNoClientState"),
  diarioSelectedClientName: document.getElementById("diarioSelectedClientName"),
  diarioClearClientBtn: document.getElementById("diarioClearClientBtn"),
  diarioEntryList: document.getElementById("diarioEntryList"),
  estruturaVersaoBanco: document.getElementById("estruturaVersaoBanco"),
  diarioSearchInput: document.getElementById("diarioSearchInput"),
  diarioMonthFilter: document.getElementById("diarioMonthFilter"),
  diarioEmptyState: document.getElementById("diarioEmptyState"),
  showClienteFormBtn: document.getElementById("showClienteFormBtn"),
  clienteFormModal: document.getElementById("clienteFormModal"),
  clienteForm: document.getElementById("clienteForm"),
  clienteId: document.getElementById("clienteId"),
  clienteNome: document.getElementById("clienteNome"),
  clienteTipoDocumento: document.getElementById("clienteTipoDocumento"),
  clienteCpfCnpj: document.getElementById("clienteCpfCnpj"),
  clienteCpfCnpjLabel: document.getElementById("clienteCpfCnpjLabel"),
  clienteTelefone: document.getElementById("clienteTelefone"),
  clientePrioridade: document.getElementById("clientePrioridade"),
  clienteSped: document.getElementById("clienteSped"),
  clienteVem: document.getElementById("clienteVem"),
  clienteVemLicencasRow: document.getElementById("clienteVemLicencasRow"),
  clienteVemLicencas: document.getElementById("clienteVemLicencas"),
  clienteAutomacaoVendas: document.getElementById("clienteAutomacaoVendas"),
  clienteAutomacaoLicencasRow: document.getElementById("clienteAutomacaoLicencasRow"),
  clienteAutomacaoLicencas: document.getElementById("clienteAutomacaoLicencas"),
  cancelClienteEditBtn: document.getElementById("cancelClienteEditBtn"),
  clienteTipoEmpresa: document.getElementById("clienteTipoEmpresa"),
  clienteMatrizRow: document.getElementById("clienteMatrizRow"),
  clienteMatrizId: document.getElementById("clienteMatrizId"),
  clienteSummary: document.getElementById("clienteSummary"),
  clienteSearchInput: document.getElementById("clienteSearchInput"),
  clientePrioridadeFilter: document.getElementById("clientePrioridadeFilter"),
  clienteSpedFilter: document.getElementById("clienteSpedFilter"),
  clienteTipoFilter: document.getElementById("clienteTipoFilter"),
  clienteTableBody: document.getElementById("clienteTableBody"),
  clienteEmptyState: document.getElementById("clienteEmptyState"),
  clienteShowMoreWrap: document.getElementById("clienteShowMoreWrap"),
  clienteShowMoreBtn: document.getElementById("clienteShowMoreBtn"),
  fvTableBody: document.getElementById("fvTableBody"),
  fvEmptyState: document.getElementById("fvEmptyState"),
  fvLimparFiltrosBtn: document.getElementById("fvLimparFiltrosBtn"),
  fvFormModal: document.getElementById("fvFormModal"),
  fvForm: document.getElementById("fvForm"),
  fvClienteId: document.getElementById("fvClienteId"),
  fvFormCliente: document.getElementById("fvFormCliente"),
  fvVem: document.getElementById("fvVem"),
  fvVemLicencasRow: document.getElementById("fvVemLicencasRow"),
  fvVemLicencas: document.getElementById("fvVemLicencas"),
  fvAutomacao: document.getElementById("fvAutomacao"),
  fvAutomacaoLicencasRow: document.getElementById("fvAutomacaoLicencasRow"),
  fvAutomacaoLicencas: document.getElementById("fvAutomacaoLicencas"),
  fvTecnico: document.getElementById("fvTecnico"),
  fvObservacao: document.getElementById("fvObservacao"),
  fvSearchInput: document.getElementById("fvSearchInput"),
  fvProdutoFilter: document.getElementById("fvProdutoFilter"),
  fvGerarPdfBtn: document.getElementById("fvGerarPdfBtn"),
  fvPdfArea: document.getElementById("fvPdfArea"),
  fvPdfModal: document.getElementById("fvPdfModal"),
  fvPdfForm: document.getElementById("fvPdfForm"),
  fvPdfConteudo: document.getElementById("fvPdfConteudo"),
  fvPdfTecnico: document.getElementById("fvPdfTecnico"),
  fvCienciaNovoBtn: document.getElementById("fvCienciaNovoBtn"),
  fvCienciaTableBody: document.getElementById("fvCienciaTableBody"),
  fvCienciaEmptyState: document.getElementById("fvCienciaEmptyState"),
  fvCienciaModal: document.getElementById("fvCienciaModal"),
  fvCienciaForm: document.getElementById("fvCienciaForm"),
  fvCienciaConteudo: document.getElementById("fvCienciaConteudo"),
  fvCienciaResultado: document.getElementById("fvCienciaResultado"),
  fvCienciaLink: document.getElementById("fvCienciaLink"),
  fvCienciaCopiarBtn: document.getElementById("fvCienciaCopiarBtn"),
  fvCienciaDetalheModal: document.getElementById("fvCienciaDetalheModal"),
  fvCienciaDetalheInfo: document.getElementById("fvCienciaDetalheInfo"),
  fvCienciaDetalheBody: document.getElementById("fvCienciaDetalheBody"),
  escalaPrevWeek: document.getElementById("escalaPrevWeek"),
  escalaNextWeek: document.getElementById("escalaNextWeek"),
  escalaTodayBtn: document.getElementById("escalaTodayBtn"),
  escalaWeekLabel: document.getElementById("escalaWeekLabel"),
  escalaWeekInfo: document.getElementById("escalaWeekInfo"),
  escalaInverterSemanaBtn: document.getElementById("escalaInverterSemanaBtn"),
  escalaInverterDaquiBtn: document.getElementById("escalaInverterDaquiBtn"),
  escalaNovaExcecaoBtn: document.getElementById("escalaNovaExcecaoBtn"),
  escalaTurnosGrid: document.getElementById("escalaTurnosGrid"),
  escalaProximasTable: document.getElementById("escalaProximasTable"),
  escalaExcecoesBody: document.getElementById("escalaExcecoesBody"),
  escalaExcecoesEmpty: document.getElementById("escalaExcecoesEmpty"),
  escalaMostrarPassadas: document.getElementById("escalaMostrarPassadas"),
  escalaConfigBtn: document.getElementById("escalaConfigBtn"),
  escalaConfigResumo: document.getElementById("escalaConfigResumo"),
  escalaConfigModal: document.getElementById("escalaConfigModal"),
  escalaConfigForm: document.getElementById("escalaConfigForm"),
  escalaConfigTurnos: document.getElementById("escalaConfigTurnos"),
  escalaConfigEquipes: document.getElementById("escalaConfigEquipes"),
  escalaConfigTecnicos: document.getElementById("escalaConfigTecnicos"),
  escalaSemanaReferencia: document.getElementById("escalaSemanaReferencia"),
  atuNovaBtn: document.getElementById("atuNovaBtn"),
  tdiConversa: document.getElementById("tdiConversa"),
  tdiPromptForm: document.getElementById("tdiPromptForm"),
  tdiTexto: document.getElementById("tdiTexto"),
  tdiImagemPreview: document.getElementById("tdiImagemPreview"),
  tdiAnexarBtn: document.getElementById("tdiAnexarBtn"),
  tdiArquivo: document.getElementById("tdiArquivo"),
  tdiCliente: document.getElementById("tdiCliente"),
  tdiClientMenu: document.getElementById("tdiClientMenu"),
  tdiEnviarBtn: document.getElementById("tdiEnviarBtn"),
  tdiListaTitulo: document.getElementById("tdiListaTitulo"),
  tdiAviso: document.getElementById("tdiAviso"),
  tdiBusca: document.getElementById("tdiBusca"),
  tdiAutorFiltroCampo: document.getElementById("tdiAutorFiltroCampo"),
  tdiAutorFiltro: document.getElementById("tdiAutorFiltro"),
  tdiLista: document.getElementById("tdiLista"),
  tdiClienteFiltro: document.getElementById("tdiClienteFiltro"),
  tdiDataDe: document.getElementById("tdiDataDe"),
  tdiDataAte: document.getElementById("tdiDataAte"),
  tdiGridWrap: document.getElementById("tdiGridWrap"),
  tdiGridBody: document.getElementById("tdiGridBody"),
  tdiGridTotal: document.getElementById("tdiGridTotal"),
  tdiListaVazia: document.getElementById("tdiListaVazia"),
  tdiVerModal: document.getElementById("tdiVerModal"),
  tdiVerTitulo: document.getElementById("tdiVerTitulo"),
  tdiVerMeta: document.getElementById("tdiVerMeta"),
  tdiVerConteudo: document.getElementById("tdiVerConteudo"),
  tdiVerImagem: document.getElementById("tdiVerImagem"),
  tdiVerDescricao: document.getElementById("tdiVerDescricao"),
  tdiCopiarBtn: document.getElementById("tdiCopiarBtn"),
  tdiExcluirBtn: document.getElementById("tdiExcluirBtn"),
  usuarioRotinasModal: document.getElementById("usuarioRotinasModal"),
  usuarioRotinasForm: document.getElementById("usuarioRotinasForm"),
  usuarioRotinasId: document.getElementById("usuarioRotinasId"),
  usuarioRotinasInfo: document.getElementById("usuarioRotinasInfo"),
  usuarioRotinasLista: document.getElementById("usuarioRotinasLista"),
  usuarioRotinasTodasBtn: document.getElementById("usuarioRotinasTodasBtn"),
  usuarioRotinasNenhumaBtn: document.getElementById("usuarioRotinasNenhumaBtn"),
  atuAviso: document.getElementById("atuAviso"),
  atuSearchInput: document.getElementById("atuSearchInput"),
  atuTipoFilter: document.getElementById("atuTipoFilter"),
  atuSituacaoFilter: document.getElementById("atuSituacaoFilter"),
  atuTecnicoFilter: document.getElementById("atuTecnicoFilter"),
  atuTableBody: document.getElementById("atuTableBody"),
  atuEmptyState: document.getElementById("atuEmptyState"),
  atuFormModal: document.getElementById("atuFormModal"),
  atuFormModalTitle: document.getElementById("atuFormModalTitle"),
  atuForm: document.getElementById("atuForm"),
  atuId: document.getElementById("atuId"),
  atuTipo: document.getElementById("atuTipo"),
  atuCliente: document.getElementById("atuCliente"),
  atuClientMenu: document.getElementById("atuClientMenu"),
  atuClienteLabel: document.getElementById("atuClienteLabel"),
  atuLoteRow: document.getElementById("atuLoteRow"),
  atuClientesChips: document.getElementById("atuClientesChips"),
  atuLoteInfo: document.getElementById("atuLoteInfo"),
  atuTecnico: document.getElementById("atuTecnico"),
  atuDataPrevista: document.getElementById("atuDataPrevista"),
  atuVersao: document.getElementById("atuVersao"),
  atuEstacoesRow: document.getElementById("atuEstacoesRow"),
  atuEstacoes: document.getElementById("atuEstacoes"),
  atuObservacao: document.getElementById("atuObservacao"),
  atuRealizada: document.getElementById("atuRealizada"),
  atuRealizadaEmRow: document.getElementById("atuRealizadaEmRow"),
  atuRealizadaEm: document.getElementById("atuRealizadaEm"),
  atuVersaoHelper: document.getElementById("atuVersaoHelper"),
  escalaExcecaoModal: document.getElementById("escalaExcecaoModal"),
  escalaExcecaoForm: document.getElementById("escalaExcecaoForm"),
  escalaExcecaoTecnico: document.getElementById("escalaExcecaoTecnico"),
  escalaExcecaoInicio: document.getElementById("escalaExcecaoInicio"),
  escalaExcecaoFim: document.getElementById("escalaExcecaoFim"),
  escalaExcecaoTurno: document.getElementById("escalaExcecaoTurno"),
  escalaExcecaoMotivo: document.getElementById("escalaExcecaoMotivo"),
  agendaPrevMonth: document.getElementById("agendaPrevMonth"),
  agendaNextMonth: document.getElementById("agendaNextMonth"),
  agendaTodayBtn: document.getElementById("agendaTodayBtn"),
  agendaMonthLabel: document.getElementById("agendaMonthLabel"),
  agendaCalendar: document.getElementById("agendaCalendar"),
  agendaCalendarGrid: document.getElementById("agendaCalendarGrid"),
  agendaDayModal: document.getElementById("agendaDayModal"),
  agendaDayModalTitle: document.getElementById("agendaDayModalTitle"),
  agendaDayList: document.getElementById("agendaDayList"),
  agendaDayEmpty: document.getElementById("agendaDayEmpty"),
  spedTecnicoMenu: document.getElementById("spedTecnicoMenu"),
  procTecnicoMenu: document.getElementById("procTecnicoMenu"),
  showTecnicoFormBtn: document.getElementById("showTecnicoFormBtn"),
  tecnicoFormModal: document.getElementById("tecnicoFormModal"),
  tecnicoForm: document.getElementById("tecnicoForm"),
  tecnicoId: document.getElementById("tecnicoId"),
  tecnicoNome: document.getElementById("tecnicoNome"),
  tecnicoEmail: document.getElementById("tecnicoEmail"),
  cancelTecnicoEditBtn: document.getElementById("cancelTecnicoEditBtn"),
  tecnicoTableBody: document.getElementById("tecnicoTableBody"),
  tecnicoEmptyState: document.getElementById("tecnicoEmptyState"),
  tecnicoShowMoreWrap: document.getElementById("tecnicoShowMoreWrap"),
  tecnicoShowMoreBtn: document.getElementById("tecnicoShowMoreBtn"),
  tecnicoSearchInput: document.getElementById("tecnicoSearchInput"),
  showTipoProcFormBtn: document.getElementById("showTipoProcFormBtn"),
  tipoProcFormModal: document.getElementById("tipoProcFormModal"),
  tipoProcForm: document.getElementById("tipoProcForm"),
  tipoProcId: document.getElementById("tipoProcId"),
  tipoProcNome: document.getElementById("tipoProcNome"),
  cancelTipoProcEditBtn: document.getElementById("cancelTipoProcEditBtn"),
  tipoProcTableBody: document.getElementById("tipoProcTableBody"),
  tipoProcEmptyState: document.getElementById("tipoProcEmptyState"),
  tipoProcShowMoreWrap: document.getElementById("tipoProcShowMoreWrap"),
  tipoProcShowMoreBtn: document.getElementById("tipoProcShowMoreBtn"),
  tipoProcSearchInput: document.getElementById("tipoProcSearchInput"),
  implAbertasList: document.getElementById("implAbertasList"),
  implAbertasEmptyState: document.getElementById("implAbertasEmptyState"),
  implClientSearch: document.getElementById("implClientSearch"),
  implClientMenu: document.getElementById("implClientMenu"),
  implNoClientState: document.getElementById("implNoClientState"),
  implClientView: document.getElementById("implClientView"),
  implSummaryCard: document.getElementById("implSummaryCard"),
  implToggleSummaryBtn: document.getElementById("implToggleSummaryBtn"),
  implSumTecnico: document.getElementById("implSumTecnico"),
  implSumStatus: document.getElementById("implSumStatus"),
  implSumEnquadramento: document.getElementById("implSumEnquadramento"),
  implSumQtd: document.getElementById("implSumQtd"),
  implSumBaseGerencial: document.getElementById("implSumBaseGerencial"),
  implSumBaseFiscal: document.getElementById("implSumBaseFiscal"),
  implSumEstrutura: document.getElementById("implSumEstrutura"),
  implSumMaquinasList: document.getElementById("implSumMaquinasList"),
  showImplFormBtn: document.getElementById("showImplFormBtn"),
  implFormModal: document.getElementById("implFormModal"),
  implForm: document.getElementById("implForm"),
  implId: document.getElementById("implId"),
  implCliente: document.getElementById("implCliente"),
  implTecnico: document.getElementById("implTecnico"),
  implTecnicoMenu: document.getElementById("implTecnicoMenu"),
  implStatus: document.getElementById("implStatus"),
  implEnquadramento: document.getElementById("implEnquadramento"),
  implBaseGerencialQtd: document.getElementById("implBaseGerencialQtd"),
  implBaseGerencialDescricao: document.getElementById("implBaseGerencialDescricao"),
  implBaseFiscalQtd: document.getElementById("implBaseFiscalQtd"),
  implBaseFiscalDescricao: document.getElementById("implBaseFiscalDescricao"),
  implEstrutura: document.getElementById("implEstrutura"),
  implQtdMaquinas: document.getElementById("implQtdMaquinas"),
  implMaquinasSection: document.getElementById("implMaquinasSection"),
  implMaquinasFields: document.getElementById("implMaquinasFields"),
  cancelImplEditBtn: document.getElementById("cancelImplEditBtn"),
  showImplEtapaFormBtn: document.getElementById("showImplEtapaFormBtn"),
  implEtapaFormModal: document.getElementById("implEtapaFormModal"),
  implEtapaForm: document.getElementById("implEtapaForm"),
  implEtapaId: document.getElementById("implEtapaId"),
  implEtapaNome: document.getElementById("implEtapaNome"),
  implEtapaTecnico: document.getElementById("implEtapaTecnico"),
  implEtapaTecnicoMenu: document.getElementById("implEtapaTecnicoMenu"),
  implEtapaData: document.getElementById("implEtapaData"),
  implEtapaStatus: document.getElementById("implEtapaStatus"),
  cancelImplEtapaEditBtn: document.getElementById("cancelImplEtapaEditBtn"),
  implCronogramaTableBody: document.getElementById("implCronogramaTableBody"),
  implCronogramaEmptyState: document.getElementById("implCronogramaEmptyState"),
  showImplReuniaoFormBtn: document.getElementById("showImplReuniaoFormBtn"),
  implReuniaoFormModal: document.getElementById("implReuniaoFormModal"),
  implReuniaoForm: document.getElementById("implReuniaoForm"),
  implReuniaoId: document.getElementById("implReuniaoId"),
  implReuniaoData: document.getElementById("implReuniaoData"),
  implReuniaoTexto: document.getElementById("implReuniaoTexto"),
  cancelImplReuniaoEditBtn: document.getElementById("cancelImplReuniaoEditBtn"),
  implReuniaoList: document.getElementById("implReuniaoList"),
  implReuniaoEmptyState: document.getElementById("implReuniaoEmptyState"),
  showImplFinanceiroFormBtn: document.getElementById("showImplFinanceiroFormBtn"),
  implFinanceiroFormModal: document.getElementById("implFinanceiroFormModal"),
  implFinanceiroForm: document.getElementById("implFinanceiroForm"),
  implFinanceiroId: document.getElementById("implFinanceiroId"),
  implFinanceiroTecnico: document.getElementById("implFinanceiroTecnico"),
  implFinanceiroTecnicoMenu: document.getElementById("implFinanceiroTecnicoMenu"),
  implFinanceiroData: document.getElementById("implFinanceiroData"),
  implFinanceiroValor: document.getElementById("implFinanceiroValor"),
  implFinanceiroDescricao: document.getElementById("implFinanceiroDescricao"),
  cancelImplFinanceiroEditBtn: document.getElementById("cancelImplFinanceiroEditBtn"),
  implFinanceiroTableBody: document.getElementById("implFinanceiroTableBody"),
  implFinanceiroEmptyState: document.getElementById("implFinanceiroEmptyState"),
  implFinanceiroTotal: document.getElementById("implFinanceiroTotal"),

  implGerarPdfBtn: document.getElementById("implGerarPdfBtn"),
  implPdfArea: document.getElementById("implPdfArea"),

  usuarioSummary: document.getElementById("usuarioSummary"),
  usuarioSearchInput: document.getElementById("usuarioSearchInput"),
  usuarioPapelFilter: document.getElementById("usuarioPapelFilter"),
  usuarioStatusFilter: document.getElementById("usuarioStatusFilter"),
  usuarioTableBody: document.getElementById("usuarioTableBody"),
  usuarioEmptyState: document.getElementById("usuarioEmptyState"),
  showUsuarioFormBtn: document.getElementById("showUsuarioFormBtn"),
  usuarioFormModal: document.getElementById("usuarioFormModal"),
  usuarioForm: document.getElementById("usuarioForm"),
  usuarioNome: document.getElementById("usuarioNome"),
  usuarioEmail: document.getElementById("usuarioEmail"),
  usuarioSenha: document.getElementById("usuarioSenha"),
  usuarioPapel: document.getElementById("usuarioPapel"),
  cancelUsuarioBtn: document.getElementById("cancelUsuarioBtn")
};

document.querySelectorAll(".sped-tab-btn").forEach((btn) => {
  addListener(btn, "click", () => {
    state.activeSpedTab = btn.getAttribute("data-tab");
    document.querySelectorAll(".sped-tab-btn").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    renderSpedCorrections();
  });
});

document.querySelectorAll(".proc-tab-btn").forEach((btn) => {
  addListener(btn, "click", () => {
    state.activeProcTab = btn.getAttribute("data-tab");
    document.querySelectorAll(".proc-tab-btn").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    renderProcedimentos();
  });
});

document.querySelectorAll(".impl-tab-btn").forEach((btn) => {
  addListener(btn, "click", () => {
    state.activeImplTab = btn.getAttribute("data-tab");
    document.querySelectorAll(".impl-tab-btn").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    renderImplAbertas();
  });
});

addListener(refs.showSpedFormBtn, "click", focusSpedForm);
addListener(refs.showClientFormBtn, "click", focusSpedClientForm);
addListener(refs.spedClientForm, "submit", saveSpedClient);
addListener(refs.cancelClientEditBtn, "click", cancelClientEdit);
addListener(refs.spedForm, "submit", saveSpedCorrection);
addListener(refs.spedCliente, "focus", openSpedClientMenu);
addListener(refs.spedCliente, "input", openSpedClientMenu);
addListener(refs.spedCliente, "blur", closeSpedClientMenuLater);
addListener(refs.spedCliente, "blur", fillPhoneFromClientName);
addListener(refs.cancelSpedEditBtn, "click", cancelSpedEdit);
addListener(refs.clearSpedBtn, "click", clearAllSpedCorrections);
addListener(refs.spedClientFilter, "change", renderSpedCorrections);
addListener(refs.spedSearchInput, "input", renderSpedCorrections);
addListener(refs.spedMonthFilter, "input", renderSpedCorrections);
addListener(refs.issueForm, "submit", saveIssue);
addListener(refs.cancelIssueEditBtn, "click", resetIssueForm);
addListener(refs.clearAllBtn, "click", clearAllIssues);
addListener(refs.searchInput, "input", renderIssues);
addListener(refs.exportBackupBtn, "click", exportBackup);
addListener(refs.importBackupInput, "change", importBackup);
addListener(refs.showProcFormBtn, "click", focusProcForm);
addListener(refs.procCliente, "focus", openProcClientMenu);
addListener(refs.procCliente, "input", openProcClientMenu);
addListener(refs.procCliente, "blur", closeProcClientMenuLater);
addListener(refs.procCliente, "blur", fillPhoneFromProcClientName);
addListener(refs.procTipo, "change", onProcTipoChange);
addListener(refs.procForm, "submit", saveProcedimento);
addListener(refs.cancelProcEditBtn, "click", cancelProcEdit);
addListener(refs.clearProcBtn, "click", clearAllProcedimentos);
addListener(refs.procClientFilter, "change", renderProcedimentos);
addListener(refs.procSearchInput, "input", renderProcedimentos);
addListener(refs.procMonthFilter, "input", renderProcedimentos);
addListener(refs.showDiarioFormBtn, "click", focusDiarioForm);
addListener(refs.diarioForm, "submit", saveDiario);
addListener(refs.cancelDiarioEditBtn, "click", cancelDiarioEdit);
addListener(refs.clearDiarioBtn, "click", clearAllDiario);
addListener(refs.diarioClientSearch, "focus", openDiarioClientMenu);
addListener(refs.diarioClientSearch, "input", openDiarioClientMenu);
addListener(refs.diarioClientSearch, "blur", closeDiarioClientMenuLater);
addListener(refs.diarioClearClientBtn, "click", clearDiarioClient);
addListener(refs.diarioSearchInput, "input", renderDiario);
addListener(refs.diarioMonthFilter, "input", renderDiario);
addListener(refs.showClienteFormBtn, "click", focusClienteForm);
addListener(refs.clienteForm, "submit", saveCliente);
addListener(refs.clienteCpfCnpj, "input", onClienteCpfCnpjInput);
addListener(refs.clienteCpfCnpj, "paste", onClienteCpfCnpjPaste);
addListener(refs.clienteTipoDocumento, "change", onClienteTipoDocumentoChange);
addListener(refs.cancelClienteEditBtn, "click", cancelClienteEdit);
addListener(refs.clienteTipoEmpresa, "change", onClienteTipoChange);
addListener(refs.clienteVem, "change", onClienteVemChange);
addListener(refs.clienteAutomacaoVendas, "change", onClienteAutomacaoChange);
addListener(refs.clienteSearchInput, "input", renderClientes);
addListener(refs.clientePrioridadeFilter, "change", renderClientes);
addListener(refs.clienteSpedFilter, "change", renderClientes);
addListener(refs.clienteTipoFilter, "change", renderClientes);
addListener(refs.clienteShowMoreBtn, "click", () => {
  state.listShowAll.clientes = !state.listShowAll.clientes;
  renderClientes();
});
addListener(refs.fvSearchInput, "input", renderForcaVendas);
addListener(refs.fvProdutoFilter, "change", renderForcaVendas);
addListener(refs.fvLimparFiltrosBtn, "click", limparFiltrosForcaVendas);
addListener(refs.fvForm, "submit", saveForcaVendas);
addListener(refs.fvVem, "change", onFvProdutoChange);
addListener(refs.fvAutomacao, "change", onFvProdutoChange);
addListener(refs.agendaPrevMonth, "click", () => changeAgendaMonth(-1));
addListener(refs.agendaNextMonth, "click", () => changeAgendaMonth(1));
addListener(refs.agendaTodayBtn, "click", setAgendaToday);
addListener(refs.spedTecnico, "focus", openSpedTecnicoMenu);
addListener(refs.spedTecnico, "input", openSpedTecnicoMenu);
addListener(refs.spedTecnico, "blur", closeSpedTecnicoMenuLater);
addListener(refs.procTecnico, "focus", openProcTecnicoMenu);
addListener(refs.procTecnico, "input", openProcTecnicoMenu);
addListener(refs.procTecnico, "blur", closeProcTecnicoMenuLater);
addListener(refs.showTecnicoFormBtn, "click", focusTecnicoForm);
addListener(refs.tecnicoForm, "submit", saveTecnico);
addListener(refs.cancelTecnicoEditBtn, "click", cancelTecnicoEdit);
addListener(refs.tecnicoSearchInput, "input", renderTecnicos);
addListener(refs.tecnicoShowMoreBtn, "click", () => {
  state.listShowAll.tecnicos = !state.listShowAll.tecnicos;
  renderTecnicos();
});
addListener(refs.showTipoProcFormBtn, "click", focusTipoProcForm);
addListener(refs.tipoProcForm, "submit", saveTipoProc);
addListener(refs.cancelTipoProcEditBtn, "click", cancelTipoProcEdit);
addListener(refs.tipoProcSearchInput, "input", renderTiposProc);
addListener(refs.tipoProcShowMoreBtn, "click", () => {
  state.listShowAll.tiposProc = !state.listShowAll.tiposProc;
  renderTiposProc();
});
addListener(refs.implClientSearch, "focus", openImplClientMenu);
addListener(refs.implClientSearch, "input", openImplClientMenu);
addListener(refs.implClientSearch, "blur", closeImplClientMenuLater);
addListener(refs.implToggleSummaryBtn, "click", toggleImplSummary);
addListener(refs.showImplFormBtn, "click", openImplFormModal);
addListener(refs.implForm, "submit", saveImplantacao);
addListener(refs.cancelImplEditBtn, "click", () => closeModal(refs.implFormModal));
addListener(refs.implQtdMaquinas, "input", onImplQtdMaquinasChange);
addListener(refs.implTecnico, "focus", openImplTecnicoMenu);
addListener(refs.implTecnico, "input", openImplTecnicoMenu);
addListener(refs.implTecnico, "blur", closeImplTecnicoMenuLater);
addListener(refs.showImplEtapaFormBtn, "click", focusImplEtapaForm);
addListener(refs.implEtapaForm, "submit", saveImplEtapa);
addListener(refs.cancelImplEtapaEditBtn, "click", cancelImplEtapaEdit);
addListener(refs.implEtapaTecnico, "focus", openImplEtapaTecnicoMenu);
addListener(refs.implEtapaTecnico, "input", openImplEtapaTecnicoMenu);
addListener(refs.implEtapaTecnico, "blur", closeImplEtapaTecnicoMenuLater);
addListener(refs.showImplReuniaoFormBtn, "click", focusImplReuniaoForm);
addListener(refs.implReuniaoForm, "submit", saveImplReuniao);
addListener(refs.cancelImplReuniaoEditBtn, "click", cancelImplReuniaoEdit);
addListener(refs.showImplFinanceiroFormBtn, "click", focusImplFinanceiroForm);
addListener(refs.implFinanceiroForm, "submit", saveImplFinanceiro);
addListener(refs.cancelImplFinanceiroEditBtn, "click", cancelImplFinanceiroEdit);
addListener(refs.implFinanceiroTecnico, "focus", openImplFinanceiroTecnicoMenu);
addListener(refs.implFinanceiroTecnico, "input", openImplFinanceiroTecnicoMenu);
addListener(refs.implFinanceiroTecnico, "blur", closeImplFinanceiroTecnicoMenuLater);
addListener(refs.implGerarPdfBtn, "click", generateImplantacaoPdf);
window.addEventListener("afterprint", () => {
  document.body.classList.remove("impl-pdf-print");
  if (refs.implPdfArea) refs.implPdfArea.innerHTML = "";
});
addListener(refs.fvGerarPdfBtn, "click", () => {
  if (refs.fvPdfTecnico) refs.fvPdfTecnico.checked = false; // técnico fica de fora por padrão
  openModal(refs.fvPdfModal, refs.fvPdfConteudo);
});
addListener(refs.fvPdfForm, "submit", generateForcaVendasPdf);
addListener(refs.fvCienciaNovoBtn, "click", openFvCienciaModal);
addListener(refs.fvCienciaForm, "submit", saveFvCiencia);
addListener(refs.fvCienciaCopiarBtn, "click", () => copyFvCienciaLink(refs.fvCienciaLink.value, refs.fvCienciaCopiarBtn));
addListener(refs.escalaPrevWeek, "click", () => moveEscalaSemana(-1));
addListener(refs.escalaNextWeek, "click", () => moveEscalaSemana(1));
addListener(refs.escalaTodayBtn, "click", () => moveEscalaSemana(0));
addListener(refs.escalaInverterSemanaBtn, "click", toggleEscalaInversaoSemana);
addListener(refs.escalaInverterDaquiBtn, "click", inverterEscalaDaqui);
addListener(refs.escalaNovaExcecaoBtn, "click", () => openEscalaExcecaoModal());
addListener(refs.escalaMostrarPassadas, "change", renderEscalaExcecoes);
addListener(refs.escalaProximasTable, "click", onEscalaProximasClick);
addListener(refs.escalaConfigBtn, "click", openEscalaConfigModal);
addListener(refs.escalaConfigForm, "submit", saveEscalaConfig);
addListener(refs.escalaExcecaoForm, "submit", saveEscalaExcecao);
addListener(refs.atuNovaBtn, "click", () => openAtualizacaoModal());
addListener(refs.tdiPromptForm, "submit", enviarTdiPrompt);
addListener(refs.tdiTexto, "input", () => { tdiAutoAltura(); tdiAtualizarEnviar(); });
addListener(refs.tdiTexto, "keydown", onTdiTextoKeydown);
addListener(refs.tdiAnexarBtn, "click", () => refs.tdiArquivo.click());
addListener(refs.tdiArquivo, "change", onTdiArquivoChange);
addListener(refs.tdiCliente, "focus", openTdiClientMenu);
addListener(refs.tdiCliente, "input", openTdiClientMenu);
addListener(refs.tdiCliente, "blur", () => setTimeout(closeTdiClientMenu, 120));
addListener(refs.tdiBusca, "input", renderTdis);
addListener(refs.tdiAutorFiltro, "change", renderTdis);
addListener(refs.tdiClienteFiltro, "change", renderTdis);
addListener(refs.tdiDataDe, "change", renderTdis);
addListener(refs.tdiDataAte, "change", renderTdis);
addListener(refs.tdiGridWrap, "click", onTdiGridClick);
addListener(refs.tdiGridWrap, "keydown", (e) => { const tr = e.key === "Enter" && e.target.closest("tr[data-tdi-id]"); if (tr) verTdi(tr.getAttribute("data-tdi-id")); });
addListener(refs.tdiCopiarBtn, "click", copiarTdiAberto);
addListener(refs.tdiExcluirBtn, "click", excluirTdiAberto);
addListener(refs.atuForm, "submit", saveAtualizacao);
addListener(refs.atuTipo, "change", onAtuTipoChange);
addListener(refs.atuRealizada, "change", onAtuRealizadaChange);
addListener(refs.atuCliente, "focus", openAtuClientMenu);
addListener(refs.atuCliente, "input", openAtuClientMenu);
addListener(refs.atuCliente, "keydown", onAtuClienteKeydown);
addListener(refs.atuTecnico, "change", () => { renderAtuClientesLote(); if (refs.atuClientMenu && refs.atuClientMenu.classList.contains("open")) renderAtuClientMenu(); });
addListener(refs.atuCliente, "blur", () => setTimeout(closeAtuClientMenu, 120));
addListener(refs.atuSearchInput, "input", renderAtualizacoes);
addListener(refs.atuTipoFilter, "change", renderAtualizacoes);
addListener(refs.atuSituacaoFilter, "change", renderAtualizacoes);
addListener(refs.atuTecnicoFilter, "change", renderAtualizacoes);
addListener(refs.escalaExcecaoInicio, "change", () => {
  if (refs.escalaExcecaoFim && (!refs.escalaExcecaoFim.value || refs.escalaExcecaoFim.value < refs.escalaExcecaoInicio.value)) {
    refs.escalaExcecaoFim.value = refs.escalaExcecaoInicio.value;
  }
});
addListener(refs.usuarioSearchInput, "input", renderUsuarios);
addListener(refs.usuarioPapelFilter, "change", renderUsuarios);
addListener(refs.usuarioStatusFilter, "change", renderUsuarios);
addListener(refs.showUsuarioFormBtn, "click", focusUsuarioForm);
addListener(refs.usuarioForm, "submit", saveUsuario);
addListener(refs.usuarioRotinasForm, "submit", saveUsuarioRotinas);
addListener(refs.usuarioRotinasTodasBtn, "click", () => marcarUsuarioRotinas(true));
addListener(refs.usuarioRotinasNenhumaBtn, "click", () => marcarUsuarioRotinas(false));
addListener(refs.cancelUsuarioBtn, "click", () => closeModal(refs.usuarioFormModal));
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  if (!reason) return;
  if (reason.isPermissionError) {
    alert(reason.message);
  } else if (reason.code && reason.message) {
    // Erro devolvido pelo Supabase (ex.: coluna inexistente): sem isso a
    // gravação falha em silêncio e o botão parece não fazer nada.
    alert(`Não foi possível salvar: ${reason.message}`);
  }
});
window.addEventListener("afterprint", () => {
  document.body.classList.remove("fv-pdf-print");
  if (refs.fvPdfArea) refs.fvPdfArea.innerHTML = "";
  const fvPageStyle = document.getElementById("fvPdfPageStyle");
  if (fvPageStyle) fvPageStyle.remove();
});
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  addListener(button, "click", () => closeModalById(button.getAttribute("data-close-modal")));
});
document.querySelectorAll("dialog").forEach((modal) => {
  addListener(modal, "click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});
addListener(document, "keydown", (event) => {
  if (event.key === "Escape") closeOpenModal();
});

initApp();

async function initApp() {
  // auth.js valida sessão e perfil; sem acesso ele já redireciona para o login.
  if (!window.authReady || !(await window.authReady)) return;

  try {
    await loadData();
    await migrateLocalStorageData();
    if (refs.usuarioTableBody) await loadUsuarios();
    if (refs.fvCienciaTableBody) await loadFvCiencias();
    if (refs.escalaTurnosGrid) await loadEscala();
    if (refs.atuTableBody) await loadAtualizacoes();
    if (refs.tdiLista) await loadTdis();
  } catch (_) {
    alert("Nao foi possivel conectar ao Supabase. Verifique a configuracao em supabase-config.js.");
    return;
  }

  const safeRender = (fn, label) => {
    try { fn(); } catch (err) { console.error("Erro ao renderizar " + label + ":", err); }
  };

  if (refs.spedForm) {
    safeRender(() => { syncSpedClientsFromCorrections(); setDefaultSpedCompetencia(); renderSpedClients(); renderSpedCorrections(); }, "sped");
  }

  if (refs.issueForm) safeRender(renderIssues, "issues");
  if (refs.procForm) safeRender(renderProcedimentos, "procedimentos");
  if (refs.diarioForm) safeRender(renderDiario, "diario");
  if (refs.clienteForm) safeRender(renderClientes, "clientes");
  if (refs.agendaCalendar) safeRender(initAgenda, "agenda");
  if (refs.tecnicoForm) safeRender(renderTecnicos, "tecnicos");
  if (refs.tipoProcForm) safeRender(renderTiposProc, "tiposProc");
  if (refs.implForm) {
    safeRender(renderImplantacao, "implantacao");
    const clienteParam = new URLSearchParams(window.location.search).get("cliente");
    if (clienteParam) safeRender(() => selectImplClient(clienteParam), "implantacaoDeepLink");
  }
  if (refs.implAbertasList) safeRender(renderImplAbertas, "implAbertas");
  if (refs.clienteForm) initCollapseSections();
  if (refs.fvTableBody) safeRender(renderForcaVendas, "forcaVendas");
  if (refs.fvCienciaTableBody) safeRender(renderFvCiencias, "fvCiencias");
  if (refs.homeTodayList) safeRender(renderHomeToday, "homeToday");
  if (refs.usuarioTableBody) safeRender(renderUsuarios, "usuarios");
  if (refs.escalaTurnosGrid) safeRender(renderEscala, "escala");
  if (refs.atuTableBody) safeRender(renderAtualizacoes, "atualizacoes");
  if (refs.tdiLista) safeRender(renderTdis, "tdis");

  populateProcTipoSelect();
}

function addListener(element, eventName, handler) {
  if (element) {
    element.addEventListener(eventName, handler);
  }
}

// ── Supabase data layer ──────────────────────────────────────────────────────

function toSpedJs(row) {
  return {
    id: row.id,
    cliente: row.cliente,
    competencia: row.competencia,
    tipo: row.tipo,
    status: row.status,
    tecnico: row.tecnico,
    dataAgendamento: row.data_agendamento || "",
    horarioAgendamento: row.horario_agendamento || "",
    dataFinalizacao: row.data_finalizacao || "",
    observacao: row.observacao || "",
    telefone: row.telefone || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toIssueJs(row) {
  return {
    id: row.id,
    descricao: row.descricao,
    tecnicos: Array.isArray(row.tecnicos) ? row.tecnicos : [],
    jira: row.jira,
    cliente: row.cliente,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDiarioJs(row) {
  return {
    id: row.id,
    cliente: row.cliente,
    data: row.data || "",
    tipo: row.tipo,
    descricao: row.descricao || "",
    tecnico: row.tecnico || "",
    observacao: row.observacao || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toTecnicoJs(row) {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toTipoProcJs(row) {
  return {
    id: row.id,
    nome: row.nome,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toClienteJs(row) {
  return {
    id: row.id,
    nome: row.nome,
    cpfCnpj: row.cpf_cnpj || "",
    telefone: row.telefone || "",
    prioridade: row.prioridade || "Baixa",
    sped: row.sped === true,
    versaoBanco: row.versao_banco || "",
    tipoEmpresa: row.tipo_empresa || "Independente",
    matrizId: row.matriz_id || null,
    vem: row.vem === true,
    vemLicencas: row.vem_licencas || 0,
    automacaoVendas: row.automacao_vendas === true,
    automacaoVendasLicencas: row.automacao_vendas_licencas || 0,
    fvTecnico: row.fv_tecnico || "",
    fvObservacao: row.fv_observacao || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProcJs(row) {
  return {
    id: row.id,
    cliente: row.cliente,
    tipo: row.tipo,
    status: row.status,
    tecnico: row.tecnico,
    telefone: row.telefone || "",
    dataAgendamento: row.data_agendamento || "",
    horario: row.horario || "",
    dataFinalizacao: row.data_finalizacao || "",
    observacao: row.observacao || "",
    versaoBanco: row.versao_banco || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toImplJs(row) {
  return {
    id: row.id,
    cliente: row.cliente,
    status: row.status || "Em andamento",
    tecnico: row.tecnico || "",
    enquadramento: row.enquadramento || "",
    estrutura: row.estrutura || "",
    baseGerencialQtd: row.base_gerencial_qtd === null || row.base_gerencial_qtd === undefined ? "" : row.base_gerencial_qtd,
    baseGerencialDescricao: row.base_gerencial_descricao || "",
    baseFiscalQtd: row.base_fiscal_qtd === null || row.base_fiscal_qtd === undefined ? "" : row.base_fiscal_qtd,
    baseFiscalDescricao: row.base_fiscal_descricao || "",
    qtdMaquinas: row.qtd_maquinas === null || row.qtd_maquinas === undefined ? "" : row.qtd_maquinas,
    maquinas: Array.isArray(row.maquinas) ? row.maquinas : [],
    reunioes: Array.isArray(row.reunioes) ? row.reunioes : [],
    cronograma: Array.isArray(row.cronograma) ? row.cronograma : [],
    financeiro: Array.isArray(row.financeiro) ? row.financeiro : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function supabaseAllData() {
  const [clientsRes, correctionsRes, issuesRes, procedimentosRes, clientesRes, tecnicosRes, tiposProcRes, implantacoesRes] = await Promise.all([
    db.from("sped_clients").select("name, phone").order("name"),
    db.from("sped_corrections").select("*").order("competencia", { ascending: false }).order("cliente"),
    db.from("issues").select("*").order("created_at", { ascending: false }),
    db.from("procedimentos").select("*").order("created_at", { ascending: false }),
    db.from("clientes").select("*").order("nome"),
    db.from("tecnicos").select("*").order("nome"),
    db.from("tipos_procedimento").select("*").order("nome"),
    db.from("implantacoes").select("*").order("updated_at", { ascending: false }),
  ]);
  if (clientsRes.error) throw clientsRes.error;
  if (correctionsRes.error) throw correctionsRes.error;
  if (issuesRes.error) throw issuesRes.error;
  return {
    spedClients: clientsRes.data.map((r) => ({ name: r.name, phone: r.phone || "" })),
    spedCorrections: correctionsRes.data.map(toSpedJs),
    issues: issuesRes.data.map(toIssueJs),
    procedimentos: !procedimentosRes.error ? procedimentosRes.data.map(toProcJs) : [],
    diario: [],
    clientes: !clientesRes.error ? clientesRes.data.map(toClienteJs) : [],
    tecnicos: !tecnicosRes.error ? tecnicosRes.data.map(toTecnicoJs) : [],
    tiposProcedimento: !tiposProcRes.error ? tiposProcRes.data.map(toTipoProcJs) : [],
    implantacoes: !implantacoesRes.error ? implantacoesRes.data.map(toImplJs) : [],
  };
}

async function loadData() {
  updateState(await supabaseAllData());
}

function updateState(data) {
  // Técnicos primeiro: o filtro de "só o que é meu" depende do cadastro deles.
  state.tecnicos = Array.isArray(data.tecnicos) ? data.tecnicos : [];
  state.issues = Array.isArray(data.issues) ? data.issues : [];
  state.spedCorrections = registrosDoUsuario(Array.isArray(data.spedCorrections) ? data.spedCorrections : []);
  state.spedClients = Array.isArray(data.spedClients) ? data.spedClients : [];
  state.procedimentos = registrosDoUsuario(Array.isArray(data.procedimentos) ? data.procedimentos : []);
  state.diario = Array.isArray(data.diario) ? data.diario : [];
  state.clientes = Array.isArray(data.clientes) ? data.clientes : [];
  state.tiposProcedimento = Array.isArray(data.tiposProcedimento) ? data.tiposProcedimento : [];
  state.implantacoes = Array.isArray(data.implantacoes) ? data.implantacoes : [];
}

// ── Registros atribuídos ao técnico (SPED, procedimentos, atualizações) ──────
// Admin vê tudo; técnico só o que tem o nome dele em "tecnico"; consulta nada.
// Quem garante é a RLS (tecnico_e_do_usuario em auth.sql); aqui a tela fica
// coerente mesmo antes do script rodar.

function usuarioVeTudo() {
  return Boolean(window.auth && window.auth.can("admin"));
}

// Técnico do usuário logado — mesmo critério da RLS: cadastro de técnico com o
// mesmo e-mail do perfil; senão, o nome do perfil.
function tecnicoDoUsuario() {
  const perfil = (window.auth && window.auth.perfil) || {};
  const email = normalizeText(perfil.email || (window.auth && window.auth.user && window.auth.user.email));
  const porEmail = email && (state.tecnicos || []).find((t) => t.nome && normalizeText(t.email) === email);
  return porEmail ? porEmail.nome : (perfil.nome || "");
}

function registrosDoUsuario(items) {
  if (!window.auth || usuarioVeTudo()) return items;
  if (window.auth.papel !== "tecnico") return [];
  const meu = normalizeText(tecnicoDoUsuario());
  return meu ? items.filter((item) => normalizeText(item.tecnico) === meu) : [];
}

// No formulário, o técnico fica fixo no próprio nome (a RLS recusaria outro).
// Retorna false se o usuário não-admin não estiver vinculado a um técnico.
function fixarTecnicoDoUsuario(input) {
  if (!input) return true;
  if (usuarioVeTudo()) {
    input.readOnly = false;
    input.removeAttribute("title");
    return true;
  }
  const meu = tecnicoDoUsuario();
  input.value = meu;
  input.readOnly = true;
  input.title = "Você só registra itens atribuídos a você";
  return Boolean(meu);
}

function avisarTecnicoNaoVinculado() {
  alert("Seu usuário não está vinculado a um técnico. Peça ao administrador para cadastrar seu e-mail no técnico, em Setup.");
}

function refreshCurrentView() {
  const safeRender = (fn, label) => {
    try { fn(); } catch (err) { console.error("Erro ao renderizar " + label + ":", err); }
  };
  if (refs.spedForm) safeRender(() => { renderSpedClients(); renderSpedCorrections(); }, "sped");
  if (refs.issueForm) safeRender(renderIssues, "issues");
  if (refs.procForm) safeRender(renderProcedimentos, "procedimentos");
  if (refs.diarioForm) safeRender(renderDiario, "diario");
  if (refs.clienteForm) safeRender(renderClientes, "clientes");
  if (refs.agendaCalendarGrid) safeRender(renderAgenda, "agenda");
  if (refs.tecnicoForm) safeRender(renderTecnicos, "tecnicos");
  if (refs.tipoProcForm) safeRender(renderTiposProc, "tiposProc");
  if (refs.implForm) safeRender(renderImplantacao, "implantacao");
  if (refs.implAbertasList) safeRender(renderImplAbertas, "implAbertas");
  if (refs.fvTableBody) safeRender(renderForcaVendas, "forcaVendas");
  if (refs.fvCienciaTableBody) safeRender(renderFvCiencias, "fvCiencias");
  if (refs.homeTodayList) safeRender(renderHomeToday, "homeToday");
  if (refs.escalaTurnosGrid) safeRender(renderEscala, "escala");
  if (refs.atuTableBody) safeRender(renderAtualizacoes, "atualizacoes");
  if (refs.tdiLista) safeRender(renderTdis, "tdis");
  populateProcTipoSelect();
}

async function sendData(path, method, payload) {
  assertPermission(path, method);
  await withPermissionErrors(() => supabaseRoute(path, method, payload));
  updateState(await supabaseAllData());
  refreshCurrentView();
}

async function deleteData(path) {
  assertPermission(path, "DELETE");
  await withPermissionErrors(() => supabaseDeleteRoute(path));
  updateState(await supabaseAllData());
  refreshCurrentView();
}

// ── Controle de acesso das operações ─────────────────────────────────────────
// Espelha as policies RLS de supabase/auth.sql. Quem garante é o banco; aqui é
// para avisar o usuário, já que UPDATE/DELETE barrados pela RLS não retornam
// erro — apenas não afetam nenhuma linha.

function requiredPermission(path, method) {
  if (path === "/api/backup") return "admin";
  // TDI: técnico cria; só o admin exclui (espelha supabase/tdis.sql).
  if (method === "DELETE" && path.startsWith("/api/tdis/")) return "admin";
  // Atualizações: só o admin cadastra/edita/exclui; o técnico só confirma.
  if (/^\/api\/atualizacoes(-lote)?(\/|$)/.test(path)) return "admin";
  if (/^\/api\/(tecnicos|tipos-procedimento)(\/|$)/.test(path)) return "admin";
  if (method === "DELETE" && path.startsWith("/api/clientes/")) return "admin";
  if (method === "DELETE" && !/^\/api\/[^/]+\/./.test(path)) return "admin"; // "Limpar todos"
  return "write";
}

function permissionError(message) {
  const error = new Error(message || "Você não tem permissão para realizar esta operação.");
  error.isPermissionError = true;
  return error;
}

function assertPermission(path, method) {
  const nivel = requiredPermission(path, method);
  if (window.auth && window.auth.can(nivel)) return;
  refreshCurrentView(); // desfaz alterações visuais (ex.: checkbox marcado)
  throw permissionError(nivel === "admin"
    ? "Somente administradores podem realizar esta operação."
    : "Seu perfil é somente leitura. Você não pode alterar dados.");
}

async function withPermissionErrors(fn) {
  try {
    await fn();
  } catch (err) {
    if (err && (err.code === "42501" || /row-level security/i.test(err.message || ""))) {
      throw permissionError();
    }
    throw err;
  }
}

async function supabaseRoute(path, method, payload) {
  if (method === "POST" && path === "/api/sped-clients") {
    const { error } = await db.from("sped_clients").insert({ name: payload.name, phone: payload.phone || "" });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/sped-clients/")) {
    const oldName = decodeURIComponent(path.split("/").pop());
    const newName = payload.name;
    const phone = payload.phone || "";
    if (oldName !== newName) {
      const { error: e1 } = await db.from("sped_corrections").update({ cliente: newName }).eq("cliente", oldName);
      if (e1) throw e1;
      const { error: e2 } = await db.from("sped_clients").delete().eq("name", oldName);
      if (e2) throw e2;
      const { error: e3 } = await db.from("sped_clients").insert({ name: newName, phone });
      if (e3) throw e3;
    } else {
      const { error } = await db.from("sped_clients").update({ phone }).eq("name", oldName);
      if (error) throw error;
    }
    return;
  }

  if (method === "POST" && path === "/api/sped") {
    await db.from("sped_clients").upsert({ name: payload.cliente }, { onConflict: "name", ignoreDuplicates: true });
    const { error } = await db.from("sped_corrections").insert({
      id: payload.id,
      cliente: payload.cliente,
      competencia: payload.competencia,
      tipo: payload.tipo,
      status: payload.status,
      tecnico: payload.tecnico,
      data_agendamento: payload.dataAgendamento || "",
      horario_agendamento: payload.horarioAgendamento || "",
      data_finalizacao: payload.dataFinalizacao || "",
      observacao: payload.observacao || "",
      telefone: payload.telefone || "",
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/sped/")) {
    const id = decodeURIComponent(path.split("/").pop());
    await db.from("sped_clients").upsert({ name: payload.cliente }, { onConflict: "name", ignoreDuplicates: true });
    const { error } = await db.from("sped_corrections").update({
      cliente: payload.cliente,
      competencia: payload.competencia,
      tipo: payload.tipo,
      status: payload.status,
      tecnico: payload.tecnico,
      data_agendamento: payload.dataAgendamento || "",
      horario_agendamento: payload.horarioAgendamento || "",
      data_finalizacao: payload.dataFinalizacao || "",
      observacao: payload.observacao || "",
      telefone: payload.telefone || "",
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/issues") {
    const { error } = await db.from("issues").insert({
      id: payload.id,
      descricao: payload.descricao,
      tecnicos: payload.tecnicos,
      jira: payload.jira,
      cliente: payload.cliente,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/issues/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("issues").update({
      descricao: payload.descricao,
      tecnicos: payload.tecnicos,
      jira: payload.jira,
      cliente: payload.cliente,
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/procedimentos") {
    const { error } = await db.from("procedimentos").insert({
      id: payload.id,
      cliente: payload.cliente,
      tipo: payload.tipo,
      status: payload.status,
      tecnico: payload.tecnico,
      telefone: payload.telefone || "",
      data_agendamento: payload.dataAgendamento || "",
      horario: payload.horario || "",
      data_finalizacao: payload.dataFinalizacao || "",
      observacao: payload.observacao || "",
      versao_banco: payload.versaoBanco || "",
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/procedimentos/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("procedimentos").update({
      cliente: payload.cliente,
      tipo: payload.tipo,
      status: payload.status,
      tecnico: payload.tecnico,
      telefone: payload.telefone || "",
      data_agendamento: payload.dataAgendamento || "",
      horario: payload.horario || "",
      data_finalizacao: payload.dataFinalizacao || "",
      observacao: payload.observacao || "",
      versao_banco: payload.versaoBanco || "",
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/clientes") {
    const { error } = await db.from("clientes").insert({
      id: payload.id,
      nome: payload.nome,
      cpf_cnpj: normalizeCpfCnpj(payload.cpfCnpj) || null,
      telefone: payload.telefone || "",
      prioridade: payload.prioridade || "Baixa",
      sped: payload.sped === true,
      versao_banco: payload.versaoBanco || "",
      tipo_empresa: payload.tipoEmpresa || "Independente",
      matriz_id: payload.matrizId || null,
      vem: payload.vem === true,
      vem_licencas: Math.max(0, parseInt(payload.vemLicencas, 10) || 0),
      automacao_vendas: payload.automacaoVendas === true,
      automacao_vendas_licencas: Math.max(0, parseInt(payload.automacaoVendasLicencas, 10) || 0),
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/clientes/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("clientes").update({
      nome: payload.nome,
      cpf_cnpj: normalizeCpfCnpj(payload.cpfCnpj) || null,
      telefone: payload.telefone || "",
      prioridade: payload.prioridade || "Baixa",
      sped: payload.sped === true,
      versao_banco: payload.versaoBanco || "",
      tipo_empresa: payload.tipoEmpresa || "Independente",
      matriz_id: payload.matrizId || null,
      vem: payload.vem === true,
      vem_licencas: Math.max(0, parseInt(payload.vemLicencas, 10) || 0),
      automacao_vendas: payload.automacaoVendas === true,
      automacao_vendas_licencas: Math.max(0, parseInt(payload.automacaoVendasLicencas, 10) || 0),
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path === "/api/escala-config") {
    const { error } = await db.from("escala_config").upsert({
      id: "principal",
      turnos: payload.turnos,
      equipes: payload.equipes,
      semana_referencia: payload.semanaReferencia,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/escala-excecoes") {
    const { error } = await db.from("escala_excecoes").insert({
      id: payload.id,
      tipo: payload.tipo,
      data_inicio: payload.dataInicio,
      data_fim: payload.dataFim,
      tecnico: payload.tecnico || "",
      turno_id: payload.turnoId || "",
      motivo: payload.motivo || "",
    });
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/fv-ciencias") {
    const { error } = await db.from("fv_ciencias").insert({
      id: payload.id,
      token: payload.token,
      conteudo: payload.conteudo,
      clientes: payload.clientes,
      criado_por: payload.criadoPor || "",
    });
    if (error) throw error;
    return;
  }

  if (method === "PATCH" && path.startsWith("/api/clientes-fv/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("clientes").update({
      vem: payload.vem === true,
      vem_licencas: Math.max(0, parseInt(payload.vemLicencas, 10) || 0),
      automacao_vendas: payload.automacaoVendas === true,
      automacao_vendas_licencas: Math.max(0, parseInt(payload.automacaoVendasLicencas, 10) || 0),
      fv_tecnico: payload.fvTecnico || "",
      fv_observacao: payload.fvObservacao || "",
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "PATCH" && path.startsWith("/api/clientes-versao/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("clientes").update({
      versao_banco: payload.versaoBanco || "",
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/tdis") {
    const { error } = await db.from("tdis").insert({
      id: payload.id,
      cliente: payload.cliente,
      titulo: payload.titulo,
      conteudo: payload.conteudo,
      descricao: payload.descricao || "",
      imagem: payload.imagem || "",
      criado_por_nome: payload.criadoPorNome || "",
    });
    if (error) throw error;
    return;
  }

  // Lote: várias atualizações (uma por cliente) num único INSERT.
  if (method === "POST" && path === "/api/atualizacoes-lote") {
    const linhas = (payload.itens || []).map((item) => ({ id: item.id, ...atuRowDoPayload(item) }));
    if (!linhas.length) return;
    const { error } = await db.from("atualizacoes").insert(linhas);
    if (error) throw error;
    return;
  }

  if ((method === "POST" && path === "/api/atualizacoes") || (method === "PUT" && path.startsWith("/api/atualizacoes/"))) {
    const row = atuRowDoPayload(payload);
    const { error } = method === "POST"
      ? await db.from("atualizacoes").insert({ id: payload.id, ...row })
      : await db.from("atualizacoes").update(row).eq("id", decodeURIComponent(path.split("/").pop()));
    if (error) throw error;
    return;
  }

  if (method === "PATCH" && path.startsWith("/api/atualizacoes-confirmar/")) {
    const { error } = await db.from("atualizacoes").update({
      realizada: true,
      realizada_em: payload.realizadaEm || "",
      confirmado_por: payload.confirmadoPor || "",
      updated_at: new Date().toISOString(),
    }).eq("id", decodeURIComponent(path.split("/").pop()));
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path === "/api/backup") {
    await replaceSupabaseData(payload.data || payload);
    return;
  }

  if (method === "POST" && path === "/api/implantacoes") {
    const { error } = await db.from("implantacoes").insert({
      id: payload.id,
      cliente: payload.cliente,
      status: payload.status || "Em andamento",
      tecnico: payload.tecnico || "",
      enquadramento: payload.enquadramento || "",
      estrutura: payload.estrutura || "",
      base_gerencial_qtd: payload.baseGerencialQtd === "" || payload.baseGerencialQtd === null || payload.baseGerencialQtd === undefined ? null : payload.baseGerencialQtd,
      base_gerencial_descricao: payload.baseGerencialDescricao || "",
      base_fiscal_qtd: payload.baseFiscalQtd === "" || payload.baseFiscalQtd === null || payload.baseFiscalQtd === undefined ? null : payload.baseFiscalQtd,
      base_fiscal_descricao: payload.baseFiscalDescricao || "",
      qtd_maquinas: payload.qtdMaquinas === "" || payload.qtdMaquinas === null || payload.qtdMaquinas === undefined ? null : payload.qtdMaquinas,
      maquinas: payload.maquinas || [],
      reunioes: payload.reunioes || [],
      cronograma: payload.cronograma || [],
      financeiro: payload.financeiro || [],
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/implantacoes/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("implantacoes").update({
      cliente: payload.cliente,
      status: payload.status || "Em andamento",
      tecnico: payload.tecnico || "",
      enquadramento: payload.enquadramento || "",
      estrutura: payload.estrutura || "",
      base_gerencial_qtd: payload.baseGerencialQtd === "" || payload.baseGerencialQtd === null || payload.baseGerencialQtd === undefined ? null : payload.baseGerencialQtd,
      base_gerencial_descricao: payload.baseGerencialDescricao || "",
      base_fiscal_qtd: payload.baseFiscalQtd === "" || payload.baseFiscalQtd === null || payload.baseFiscalQtd === undefined ? null : payload.baseFiscalQtd,
      base_fiscal_descricao: payload.baseFiscalDescricao || "",
      qtd_maquinas: payload.qtdMaquinas === "" || payload.qtdMaquinas === null || payload.qtdMaquinas === undefined ? null : payload.qtdMaquinas,
      maquinas: payload.maquinas || [],
      reunioes: payload.reunioes || [],
      cronograma: payload.cronograma || [],
      financeiro: payload.financeiro || [],
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/tecnicos") {
    const { error } = await db.from("tecnicos").insert({
      id: payload.id,
      nome: payload.nome,
      email: payload.email || "",
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/tecnicos/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("tecnicos").update({
      nome: payload.nome,
      email: payload.email || "",
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  if (method === "POST" && path === "/api/tipos-procedimento") {
    const { error } = await db.from("tipos_procedimento").insert({
      id: payload.id,
      nome: payload.nome,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    });
    if (error) throw error;
    return;
  }

  if (method === "PUT" && path.startsWith("/api/tipos-procedimento/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("tipos_procedimento").update({
      nome: payload.nome,
      updated_at: payload.updatedAt,
    }).eq("id", id);
    if (error) throw error;
    return;
  }

  throw new Error("Rota nao encontrada: " + path);
}

// Linha de `atualizacoes` a partir do payload do formulário (unitário e lote).
function atuRowDoPayload(payload) {
  return {
    tipo: payload.tipo,
    cliente: payload.cliente,
    tecnico: payload.tecnico || "",
    data_prevista: payload.dataPrevista || "",
    versao: payload.versao || "",
    estacoes: payload.tipo === "estacao" ? payload.estacoes || "" : "",
    observacao: payload.observacao || "",
    realizada: payload.realizada === true,
    realizada_em: payload.realizada ? payload.realizadaEm || "" : "",
    confirmado_por: payload.realizada ? payload.confirmadoPor || "" : "",
    updated_at: new Date().toISOString(),
  };
}

async function supabaseDeleteRoute(path) {
  if (path.startsWith("/api/tdis/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("tdis").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/atualizacoes/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("atualizacoes").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/escala-excecoes/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("escala_excecoes").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/fv-ciencias/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("fv_ciencias").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path === "/api/sped") {
    const { error } = await db.from("sped_corrections").delete().not("id", "is", null);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/sped/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("sped_corrections").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path === "/api/issues") {
    const { error } = await db.from("issues").delete().not("id", "is", null);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/issues/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("issues").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/sped-clients/")) {
    const name = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("sped_clients").delete().eq("name", name);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/clientes/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("clientes").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/tecnicos/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("tecnicos").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/tipos-procedimento/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("tipos_procedimento").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path === "/api/procedimentos") {
    const { error } = await db.from("procedimentos").delete().not("id", "is", null);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/procedimentos/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("procedimentos").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  if (path.startsWith("/api/implantacoes/")) {
    const id = decodeURIComponent(path.split("/").pop());
    const { error } = await db.from("implantacoes").delete().eq("id", id);
    if (error) throw error;
    return;
  }


  throw new Error("Rota nao encontrada: " + path);
}

async function replaceSupabaseData(data) {
  const issues = Array.isArray(data.issues) ? data.issues : [];
  const sped = Array.isArray(data.spedCorrections) ? data.spedCorrections : [];
  const clients = Array.isArray(data.spedClients) ? data.spedClients : [];
  const proc = Array.isArray(data.procedimentos) ? data.procedimentos : [];

  const [d1, d2, d3, d4] = await Promise.all([
    db.from("issues").delete().not("id", "is", null),
    db.from("sped_corrections").delete().not("id", "is", null),
    db.from("sped_clients").delete().not("name", "is", null),
    db.from("procedimentos").delete().not("id", "is", null),
  ]);
  if (d1.error) throw d1.error;
  if (d2.error) throw d2.error;
  if (d3.error) throw d3.error;

  const clientMap = new Map();
  clients.forEach((c) => {
    const name = String(typeof c === "string" ? c : c.name || "").trim();
    if (name) clientMap.set(name, { name, phone: (c && c.phone) || "" });
  });
  sped.forEach((item) => {
    const name = String(item.cliente || "").trim();
    if (name && !clientMap.has(name)) clientMap.set(name, { name, phone: "" });
  });

  if (clientMap.size) {
    const { error } = await db.from("sped_clients").insert([...clientMap.values()]);
    if (error) throw error;
  }

  if (sped.length) {
    const { error } = await db.from("sped_corrections").insert(sped.map((item) => ({
      id: item.id,
      cliente: item.cliente || "",
      competencia: item.competencia || "",
      tipo: item.tipo || "",
      status: item.status || "",
      tecnico: item.tecnico || "",
      data_agendamento: item.dataAgendamento || item.data_agendamento || "",
      horario_agendamento: item.horarioAgendamento || item.horario_agendamento || "",
      data_finalizacao: item.dataFinalizacao || item.data_finalizacao || "",
      observacao: item.observacao || "",
      telefone: item.telefone || "",
      created_at: item.createdAt || item.created_at,
      updated_at: item.updatedAt || item.updated_at || item.createdAt || item.created_at,
    })));
    if (error) throw error;
  }

  if (issues.length) {
    const { error } = await db.from("issues").insert(issues.map((item) => ({
      id: item.id,
      descricao: item.descricao || "",
      tecnicos: item.tecnicos || [],
      jira: item.jira || "",
      cliente: item.cliente || "",
      created_at: item.createdAt || item.created_at,
      updated_at: item.updatedAt || item.updated_at || item.createdAt || item.created_at,
    })));
    if (error) throw error;
  }

  if (proc.length && !d4.error) {
    const { error } = await db.from("procedimentos").insert(proc.map((item) => ({
      id: item.id,
      cliente: item.cliente || "",
      tipo: item.tipo || "",
      status: item.status || "",
      tecnico: item.tecnico || "",
      telefone: item.telefone || "",
      data_agendamento: item.dataAgendamento || item.data_agendamento || "",
      horario: item.horario || "",
      data_finalizacao: item.dataFinalizacao || item.data_finalizacao || "",
      observacao: item.observacao || "",
      versao_banco: item.versaoBanco || item.versao_banco || "",
      created_at: item.createdAt || item.created_at,
      updated_at: item.updatedAt || item.updated_at || item.createdAt || item.created_at,
    })));
    if (error) throw error;
  }
}

// ── Migração de dados locais ─────────────────────────────────────────────────

async function migrateLocalStorageData() {
  const legacyData = {
    issues: readStoredArray(ISSUES_STORAGE_KEY),
    spedCorrections: readStoredArray(SPED_STORAGE_KEY),
    spedClients: readStoredArray(SPED_CLIENTS_STORAGE_KEY)
  };
  const hasLegacyData = legacyData.issues.length || legacyData.spedCorrections.length || legacyData.spedClients.length;
  const hasRemoteData = state.issues.length || state.spedCorrections.length || state.spedClients.length;
  if (!hasLegacyData || hasRemoteData) return;
  if (!window.auth || !window.auth.can("admin")) return;
  if (!confirm("Encontrei dados antigos salvos no navegador. Deseja migrar para o Supabase agora?")) return;
  await sendData("/api/backup", "PUT", legacyData);
}

function readStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function exportBackup() {
  if (!usuarioVeTudo() && !confirm("Este backup terá só os SPED e procedimentos que você consegue ver (os atribuídos a você). Não use para restaurar o sistema inteiro. Continuar?")) return;
  const backup = {
    schemaVersion: 1,
    app: "gestao-suporte",
    exportedAt: new Date().toISOString(),
    data: {
      issues: state.issues,
      spedCorrections: state.spedCorrections,
      spedClients: state.spedClients,
      procedimentos: state.procedimentos
    }
  };
  const content = JSON.stringify(backup, null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `backup-gestao-suporte-${getTodayFileValue()}.json`;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function importBackup(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const backup = JSON.parse(String(reader.result || ""));
      const data = backup && backup.data ? backup.data : backup;
      if (!isValidBackupData(data)) {
        alert("Arquivo de backup invalido.");
        return;
      }
      if (!confirm("Importar este backup vai substituir os dados atuais no Supabase. Deseja continuar?")) return;
      await sendData("/api/backup", "PUT", data);
      alert("Backup importado com sucesso.");
    } catch (_) {
      alert("Nao foi possivel importar este arquivo de backup.");
    } finally {
      refs.importBackupInput.value = "";
    }
  };
  reader.onerror = () => {
    alert("Nao foi possivel ler este arquivo de backup.");
    refs.importBackupInput.value = "";
  };
  reader.readAsText(file);
}

function isValidBackupData(data) {
  return Boolean(data) &&
    Array.isArray(data.issues) &&
    Array.isArray(data.spedCorrections) &&
    Array.isArray(data.spedClients);
}

function getTodayFileValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "item_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
}

function focusSpedForm() {
  resetSpedForm();
  if (!fixarTecnicoDoUsuario(refs.spedTecnico)) { avisarTecnicoNaoVinculado(); return; }
  openModal(refs.spedFormModal, refs.spedCliente);
}

function focusSpedClientForm() {
  cancelClientEdit();
  openModal(refs.spedClientModal, refs.spedClientName);
}

function openModal(modal, field) {
  if (!modal) return;
  if (typeof modal.showModal === "function" && !modal.open) {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (field) setTimeout(() => field.focus(), 250);
}

function closeModal(modal) {
  if (!modal) return;
  if (typeof modal.close === "function" && modal.open) {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
  closeSpedClientMenu();
}

function closeModalById(modalId) {
  closeModal(document.getElementById(modalId));
}

function closeOpenModal() {
  const modal = document.querySelector("dialog[open]");
  if (modal) closeModal(modal);
}

function cancelSpedEdit() {
  resetSpedForm();
  closeModal(refs.spedFormModal);
}

function setDefaultSpedCompetencia() {
  if (!refs.spedCompetencia.value) refs.spedCompetencia.value = getCurrentMonthValue();
}

function getCurrentMonthValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

async function saveSpedCorrection(event) {
  event.preventDefault();
  const spedId = refs.spedId.value || null;
  const payload = {
    id: spedId || createId(),
    cliente: refs.spedCliente.value.trim(),
    competencia: formatCompetencia(refs.spedCompetencia.value),
    tipo: refs.spedTipo.value,
    status: refs.spedStatus.value,
    tecnico: refs.spedTecnico.value.trim(),
    telefone: refs.spedTelefone ? refs.spedTelefone.value.trim() : "",
    dataAgendamento: toStorageDate(refs.spedDataAgendamento.value),
    horarioAgendamento: refs.spedHorarioAgendamento.value,
    dataFinalizacao: toStorageDate(refs.spedDataFinalizacao.value),
    observacao: refs.spedObservacao.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!payload.cliente || !payload.competencia || !payload.tipo || !payload.status || !payload.tecnico) {
    alert("Preencha cliente, competencia, tipo de SPED, status e tecnico.");
    return;
  }

  const duplicated = state.spedCorrections.some((item) =>
    String(item.id) !== String(payload.id) &&
    normalizeText(item.cliente) === normalizeText(payload.cliente) &&
    item.competencia === payload.competencia &&
    item.tipo === payload.tipo
  );
  if (duplicated && !confirm("Ja existe um controle para este cliente, competencia e tipo de SPED. Deseja salvar mesmo assim?")) return;

  const prevCompetencia = getPreviousCompetencia(payload.competencia);
  if (prevCompetencia && payload.tecnico) {
    const prevRecord = state.spedCorrections.find((item) =>
      String(item.id) !== String(payload.id) &&
      normalizeText(item.cliente) === normalizeText(payload.cliente) &&
      normalizeText(item.competencia) === normalizeText(prevCompetencia) &&
      normalizeText(item.tecnico) === normalizeText(payload.tecnico)
    );
    if (prevRecord && !confirm(`O técnico "${payload.tecnico}" já foi responsável pelo SPED deste cliente na competência ${prevCompetencia}. Recomenda-se alternar o técnico responsável.\n\nDeseja manter este técnico mesmo assim?`)) return;
  }

  await sendData(spedId ? `/api/sped/${encodeURIComponent(payload.id)}` : "/api/sped", spedId ? "PUT" : "POST", payload);
  resetSpedForm();
  closeModal(refs.spedFormModal);
}

async function saveSpedClient(event) {
  event.preventDefault();
  const clientName = refs.spedClientName.value.trim();
  if (!clientName) {
    alert("Informe o nome do cliente.");
    return;
  }
  const phone = refs.spedClientPhone ? refs.spedClientPhone.value.trim() : "";
  const originalName = refs.spedClientOriginalName ? refs.spedClientOriginalName.value : "";

  if (originalName) {
    const nameChanged = normalizeText(originalName) !== normalizeText(clientName);
    const conflict = nameChanged && state.spedClients.some((c) => normalizeText(c.name) === normalizeText(clientName));
    if (conflict) {
      alert("Ja existe um cliente com este nome.");
      return;
    }
    await sendData(`/api/sped-clients/${encodeURIComponent(originalName)}`, "PUT", { name: clientName, phone });
    cancelClientEdit();
  } else {
    const exists = state.spedClients.some((item) => normalizeText(item.name) === normalizeText(clientName));
    if (exists) {
      alert("Este cliente ja esta salvo na lista de SPED.");
      return;
    }
    await sendData("/api/sped-clients", "POST", { name: clientName, phone });
    refs.spedClientForm.reset();
  }
}

function editSpedClient(name) {
  const client = state.spedClients.find((c) => c.name === name);
  if (!client) return;
  refs.spedClientOriginalName.value = client.name;
  refs.spedClientName.value = client.name;
  if (refs.spedClientPhone) refs.spedClientPhone.value = client.phone || "";
  if (refs.spedClientSubmitBtn) refs.spedClientSubmitBtn.textContent = "Salvar alterações";
  if (refs.cancelClientEditBtn) refs.cancelClientEditBtn.style.display = "";
  refs.spedClientName.focus();
  refs.spedClientName.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cancelClientEdit() {
  if (refs.spedClientOriginalName) refs.spedClientOriginalName.value = "";
  if (refs.spedClientForm) refs.spedClientForm.reset();
  if (refs.spedClientSubmitBtn) refs.spedClientSubmitBtn.textContent = "Adicionar cliente";
  if (refs.cancelClientEditBtn) refs.cancelClientEditBtn.style.display = "none";
}

async function deleteSpedClient(clientName) {
  if (!confirm("Deseja remover este cliente da lista de SPED?")) return;
  const editing = refs.spedClientOriginalName && refs.spedClientOriginalName.value === clientName;
  if (editing) cancelClientEdit();
  await deleteData(`/api/sped-clients/${encodeURIComponent(clientName)}`);
}

function syncSpedClientsFromCorrections() {
  let changed = false;
  state.spedCorrections.forEach((item) => {
    const clientName = String(item.cliente || "").trim();
    if (!clientName) return;
    const exists = state.spedClients.some((client) => normalizeText(client.name) === normalizeText(clientName));
    if (!exists) {
      state.spedClients.push({ name: clientName, phone: "" });
      changed = true;
    }
  });
  if (changed) sortSpedClients();
}

function sortSpedClients() {
  state.spedClients.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}

function editSpedCorrection(id) {
  const item = state.spedCorrections.find((sped) => String(sped.id) === String(id));
  if (!item) return;
  refs.spedId.value = item.id;
  refs.spedCliente.value = item.cliente || "";
  refs.spedCompetencia.value = competenciaToInputValue(item.competencia || "");
  refs.spedTipo.value = item.tipo || "";
  refs.spedStatus.value = item.status || "Pendente";
  refs.spedTecnico.value = item.tecnico || "";
  fixarTecnicoDoUsuario(refs.spedTecnico);
  if (refs.spedTelefone) refs.spedTelefone.value = item.telefone || "";
  refs.spedDataAgendamento.value = storageToInputDate(getSpedDateValue(item, "dataAgendamento", "data_agendamento"));
  refs.spedHorarioAgendamento.value = getSpedDateValue(item, "horarioAgendamento", "horario_agendamento");
  refs.spedDataFinalizacao.value = storageToInputDate(getSpedDateValue(item, "dataFinalizacao", "data_finalizacao"));
  refs.spedObservacao.value = item.observacao || "";
  openModal(refs.spedFormModal, refs.spedCliente);
}

async function deleteSpedCorrection(id) {
  if (!confirm("Deseja excluir este controle SPED?")) return;
  await deleteData(`/api/sped/${encodeURIComponent(id)}`);
}

async function clearAllSpedCorrections() {
  if (!state.spedCorrections.length) return;
  if (!confirm("Deseja remover todos os controles SPED deste projeto?")) return;
  await deleteData("/api/sped");
  resetSpedForm();
}

function resetSpedForm() {
  refs.spedForm.reset();
  refs.spedId.value = "";
  if (refs.spedTelefone) refs.spedTelefone.value = "";
  setDefaultSpedCompetencia();
}

async function saveIssue(event) {
  event.preventDefault();
  const issueId = refs.issueId.value || null;
  const tecnicos = refs.issueTecnicos.value.split(",").map((item) => item.trim()).filter(Boolean);
  const payload = {
    id: issueId || createId(),
    descricao: refs.issueDescricao.value.trim(),
    tecnicos,
    jira: refs.issueJira.value.trim().toUpperCase(),
    cliente: refs.issueCliente.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!payload.descricao || !payload.tecnicos.length || !payload.jira || !payload.cliente) {
    alert("Preencha descricao, tecnico(s), Jira e cliente.");
    return;
  }

  await sendData(issueId ? `/api/issues/${encodeURIComponent(payload.id)}` : "/api/issues", issueId ? "PUT" : "POST", payload);
  resetIssueForm();
}

function editIssue(id) {
  const item = state.issues.find((issue) => String(issue.id) === String(id));
  if (!item) return;
  refs.issueId.value = item.id;
  refs.issueDescricao.value = item.descricao || "";
  refs.issueTecnicos.value = (item.tecnicos || []).join(", ");
  refs.issueJira.value = item.jira || "";
  refs.issueCliente.value = item.cliente || "";
  refs.issueDescricao.focus();
}

async function deleteIssue(id) {
  if (!confirm("Deseja excluir este registro?")) return;
  await deleteData(`/api/issues/${encodeURIComponent(id)}`);
}

async function clearAllIssues() {
  if (!state.issues.length) return;
  if (!confirm("Deseja remover todos os registros deste projeto?")) return;
  await deleteData("/api/issues");
  resetIssueForm();
}

function resetIssueForm() {
  refs.issueForm.reset();
  refs.issueId.value = "";
}

// ── Procedimentos Técnicos ───────────────────────────────────────────────────

function isAtualizacaoBanco(tipo) {
  return normalizeText(tipo || "").includes("banco");
}

function onProcTipoChange() {
  if (!refs.procVersaoBancoRow) return;
  const show = isAtualizacaoBanco(refs.procTipo ? refs.procTipo.value : "");
  refs.procVersaoBancoRow.style.display = show ? "" : "none";
  if (!show && refs.procVersaoBanco) refs.procVersaoBanco.value = "";
}

function getClienteUltimaVersaoBanco(nome) {
  const procs = state.procedimentos
    .filter((p) => normalizeText(p.cliente) === normalizeText(nome) && isAtualizacaoBanco(p.tipo) && p.versaoBanco)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  return procs.length ? procs[0].versaoBanco : "";
}

function focusProcForm() {
  resetProcForm();
  populateProcTipoSelect();
  onProcTipoChange();
  if (!fixarTecnicoDoUsuario(refs.procTecnico)) { avisarTecnicoNaoVinculado(); return; }
  openModal(refs.procFormModal, refs.procCliente);
}

async function saveProcedimento(event) {
  event.preventDefault();
  const procId = refs.procId.value || null;
  const payload = {
    id: procId || createId(),
    cliente: refs.procCliente.value.trim(),
    tipo: refs.procTipo.value,
    status: refs.procStatus.value,
    tecnico: refs.procTecnico.value.trim(),
    telefone: refs.procTelefone ? refs.procTelefone.value.trim() : "",
    dataAgendamento: toStorageDate(refs.procDataAgendamento.value),
    horario: refs.procHorario.value,
    dataFinalizacao: toStorageDate(refs.procDataFinalizacao.value),
    observacao: refs.procObservacao.value.trim(),
    versaoBanco: isAtualizacaoBanco(refs.procTipo.value) && refs.procVersaoBanco ? refs.procVersaoBanco.value.trim() : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!payload.cliente || !payload.tipo || !payload.status || !payload.tecnico) {
    alert("Preencha cliente, tipo, status e técnico.");
    return;
  }

  try {
    await supabaseRoute(
      procId ? `/api/procedimentos/${encodeURIComponent(payload.id)}` : "/api/procedimentos",
      procId ? "PUT" : "POST",
      payload
    );

    if (isAtualizacaoBanco(payload.tipo) && payload.versaoBanco) {
      const clienteRecord = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(payload.cliente));
      if (clienteRecord) {
        await supabaseRoute(`/api/clientes-versao/${encodeURIComponent(clienteRecord.id)}`, "PATCH", {
          versaoBanco: payload.versaoBanco,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    updateState(await supabaseAllData());
    refreshCurrentView();
    resetProcForm();
    closeModal(refs.procFormModal);
  } catch (err) {
    alert("Erro ao salvar procedimento: " + (err.message || JSON.stringify(err)));
  }
}

function editProcedimento(id) {
  const item = state.procedimentos.find((p) => String(p.id) === String(id));
  if (!item) return;
  populateProcTipoSelect();
  refs.procId.value = item.id;
  refs.procCliente.value = item.cliente || "";
  refs.procTipo.value = item.tipo || "";
  onProcTipoChange();
  if (refs.procVersaoBanco) refs.procVersaoBanco.value = item.versaoBanco || "";
  refs.procStatus.value = item.status || "Em aberto";
  refs.procTecnico.value = item.tecnico || "";
  fixarTecnicoDoUsuario(refs.procTecnico);
  if (refs.procTelefone) refs.procTelefone.value = item.telefone || "";
  refs.procDataAgendamento.value = storageToInputDate(item.dataAgendamento || "");
  refs.procHorario.value = item.horario || "";
  refs.procDataFinalizacao.value = storageToInputDate(item.dataFinalizacao || "");
  refs.procObservacao.value = item.observacao || "";
  openModal(refs.procFormModal, refs.procCliente);
}

async function deleteProcedimento(id) {
  if (!confirm("Deseja excluir este procedimento?")) return;
  await deleteData(`/api/procedimentos/${encodeURIComponent(id)}`);
}

async function clearAllProcedimentos() {
  if (!state.procedimentos.length) return;
  if (!confirm("Deseja remover todos os procedimentos?")) return;
  await deleteData("/api/procedimentos");
  resetProcForm();
}

function cancelProcEdit() {
  resetProcForm();
  closeModal(refs.procFormModal);
}

function resetProcForm() {
  refs.procForm.reset();
  refs.procId.value = "";
}

function renderProcClientMenu() {
  if (!refs.procClientMenu) return;
  const typed = normalizeText(refs.procCliente.value);
  const clients = [...state.clientes].sort((a, b) => a.nome.localeCompare(b.nome));
  const filtered = typed ? clients.filter((c) => normalizeText(c.nome).includes(typed)) : clients;
  if (!filtered.length) {
    refs.procClientMenu.innerHTML = `<div class="combo-empty">Nenhum cliente encontrado.</div>`;
    return;
  }
  refs.procClientMenu.innerHTML = filtered.map((c) =>
    `<button type="button" class="combo-option" data-pc="${escapeAttribute(c.nome)}">
      ${escapeHtml(c.nome)}${c.telefone ? `<small class="combo-phone"> · ${escapeHtml(c.telefone)}</small>` : ""}
    </button>`
  ).join("");
  refs.procClientMenu.querySelectorAll("[data-pc]").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const selectedName = btn.getAttribute("data-pc");
      refs.procCliente.value = selectedName;
      const match = state.clientes.find((c) => c.nome === selectedName);
      if (match && refs.procTelefone) refs.procTelefone.value = match.telefone || "";
      closeProcClientMenu();
    });
  });
}

function openProcClientMenu() {
  if (!refs.procClientMenu) return;
  renderProcClientMenu();
  refs.procClientMenu.classList.add("open");
}

function closeProcClientMenu() {
  if (refs.procClientMenu) refs.procClientMenu.classList.remove("open");
}

function closeProcClientMenuLater() {
  setTimeout(closeProcClientMenu, 120);
}

function fillPhoneFromProcClientName() {
  if (!refs.procTelefone) return;
  const clientName = refs.procCliente.value.trim();
  if (!clientName) return;
  const match = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(clientName));
  if (match) refs.procTelefone.value = match.telefone || "";
}

function renderProcedimentos() {
  const term = normalizeText(refs.procSearchInput ? refs.procSearchInput.value : "");
  const month = refs.procMonthFilter ? refs.procMonthFilter.value : "";
  const selectedClient = normalizeText(refs.procClientFilter ? refs.procClientFilter.value : "");
  const isConcluido = state.activeProcTab === "concluido";

  const filtered = state.procedimentos.filter((item) => {
    const fullText = normalizeText(`${item.tipo} ${item.status} ${item.tecnico} ${item.telefone || ""} ${item.dataAgendamento || ""} ${item.horario || ""} ${item.dataFinalizacao || ""} ${item.observacao}`);
    const matchesClient = !selectedClient || normalizeText(item.cliente) === selectedClient;
    const matchesText = !term || fullText.includes(term) || normalizeText(item.cliente).includes(term);
    const matchesMonth = !month || (() => {
      const [yyyy, mm] = month.split("-");
      const agend = item.dataAgendamento || "";
      return agend.slice(3, 5) === mm && agend.slice(6, 10) === yyyy;
    })();
    const matchesTab = isConcluido
      ? normalizeText(item.status) === "concluido"
      : normalizeText(item.status) !== "concluido";
    return matchesClient && matchesText && matchesMonth && matchesTab;
  });

  filtered.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  if (refs.procClientFilter) {
    const clients = [...new Set(state.procedimentos.map((p) => p.cliente).filter(Boolean))].sort();
    const currentSelected = refs.procClientFilter.value;
    refs.procClientFilter.innerHTML = `<option value="">Todos os clientes</option>${clients.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}`;
    if (clients.includes(currentSelected)) refs.procClientFilter.value = currentSelected;
  }

  const tableWrap = refs.procTableBody ? refs.procTableBody.closest(".table-wrap") : null;

  if (isConcluido) {
    if (tableWrap) tableWrap.style.display = "none";
    if (refs.procGroupedList) refs.procGroupedList.style.display = "";
    renderProcGrouped(filtered);
  } else {
    if (tableWrap) tableWrap.style.display = "";
    if (refs.procGroupedList) refs.procGroupedList.style.display = "none";
    if (refs.procTableBody) refs.procTableBody.innerHTML = filtered.map(renderProcTableRow).join("");
  }

  if (refs.procEmptyState) refs.procEmptyState.style.display = filtered.length ? "none" : "block";
  renderProcSummary(filtered);
}

function renderProcGrouped(items) {
  if (!refs.procGroupedList) return;
  if (!items.length) { refs.procGroupedList.innerHTML = ""; return; }

  const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  const groups = {};
  items.forEach((item) => {
    const d = item.createdAt ? new Date(item.createdAt) : null;
    const key = d ? `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, "0")}` : "0000-00";
    const label = d ? `${MONTHS[d.getMonth()]}/${d.getFullYear()}` : "Sem data";
    if (!groups[key]) groups[key] = { label, items: [] };
    groups[key].items.push(item);
  });

  const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  refs.procGroupedList.innerHTML = sortedKeys.map((key) => {
    const { label, items: groupItems } = groups[key];
    return `
      <div class="sped-group">
        <div class="sped-group-header" onclick="toggleProcGroup(this)" role="button" tabindex="0" aria-expanded="false">
          <span class="sped-group-title">${escapeHtml(label)}</span>
          <div class="sped-group-header-right">
            <span class="sped-group-count">${groupItems.length} ${groupItems.length === 1 ? "item" : "itens"}</span>
            <span class="sped-group-toggle" aria-hidden="true">▸</span>
          </div>
        </div>
        <div class="sped-group-items" style="display:none">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th><th>Tipo</th><th>Status</th><th>Técnico</th><th>Telefone</th>
                  <th>Data agendamento</th><th>Horário</th><th>Finalizado em</th><th class="col-dias">Dias</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>${groupItems.map(renderProcGroupedRow).join("")}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  }).join("");
}

function renderProcGroupedRow(item) {
  const dias = calcDaysDiff(item.dataAgendamento || "", item.dataFinalizacao || "");
  const tipoCell = item.versaoBanco
    ? `${escapeHtml(item.tipo)}<br><small class="combo-phone">v${escapeHtml(item.versaoBanco)}</small>`
    : escapeHtml(item.tipo);
  const obsBtn = item.observacao
    ? `<button type="button" class="obs-btn" onclick="openProcObsModal('${escapeAttribute(item.id)}')">Obs.</button>`
    : "";
  const cells = [
    `<strong class="client-name">${escapeHtml(item.cliente)}</strong>`,
    tipoCell,
    `<span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>`,
    escapeHtml(item.tecnico),
    escapeHtml(item.telefone || ""),
    escapeHtml(formatDate(item.dataAgendamento || "")),
    escapeHtml(item.horario || ""),
    escapeHtml(formatDate(item.dataFinalizacao || "")),
  ];
  const actionsCell = `<div class="small-actions">${obsBtn}
      <button type="button" onclick="editProcedimento('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteProcedimento('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`;
  return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}<td class="col-dias"><span class="dias-val">${dias !== "" ? escapeHtml(String(dias)) : "—"}</span></td><td>${actionsCell}</td></tr>`;
}

function openProcObsModal(id) {
  const item = state.procedimentos.find((p) => String(p.id) === String(id));
  if (!item || !refs.procObsModal) return;
  if (refs.procObsContent) refs.procObsContent.textContent = item.observacao || "";
  openModal(refs.procObsModal);
}

function toggleProcGroup(header) {
  const items = header.nextElementSibling;
  const toggle = header.querySelector(".sped-group-toggle");
  const isOpen = items.style.display !== "none";
  items.style.display = isOpen ? "none" : "";
  if (toggle) toggle.textContent = isOpen ? "▸" : "▾";
  header.setAttribute("aria-expanded", String(!isOpen));
}

function renderProcTableRow(item) {
  const tipoCell = item.versaoBanco
    ? `${escapeHtml(item.tipo)}<br><small class="combo-phone">v${escapeHtml(item.versaoBanco)}</small>`
    : escapeHtml(item.tipo);
  const obsBtn = item.observacao
    ? `<button type="button" class="obs-btn" onclick="openProcObsModal('${escapeAttribute(item.id)}')">Obs.</button>`
    : "";
  const dias = calcDaysDiff(item.dataAgendamento || "", item.dataFinalizacao || "");
  const cells = [
    `<strong class="client-name">${escapeHtml(item.cliente)}</strong>`,
    tipoCell,
    `<span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>`,
    escapeHtml(item.tecnico),
    escapeHtml(item.telefone || ""),
    escapeHtml(formatDate(item.dataAgendamento || "")),
    escapeHtml(item.horario || ""),
    escapeHtml(formatDate(item.dataFinalizacao || "")),
  ];
  const actionsCell = `<div class="small-actions">${obsBtn}
      <button type="button" onclick="editProcedimento('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteProcedimento('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`;
  return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}<td class="col-dias"><span class="dias-val">${dias !== "" ? escapeHtml(String(dias)) : "—"}</span></td><td>${actionsCell}</td></tr>`;
}

function renderProcSummary(items) {
  if (!refs.procSummary) return;
  const total = items.length;
  const emAndamento = items.filter((i) => i.status === "Em andamento").length;
  const concluidos = items.filter((i) => i.status === "Concluído").length;
  refs.procSummary.innerHTML = `
    <div class="summary-item"><strong>${total}</strong><span>Total filtrado</span></div>
    <div class="summary-item"><strong>${emAndamento}</strong><span>Em andamento</span></div>
    <div class="summary-item"><strong>${concluidos}</strong><span>Concluídos</span></div>
  `;
}

function renderSpedCorrections() {
  const term = normalizeText(refs.spedSearchInput.value);
  const month = refs.spedMonthFilter.value;
  const selectedClient = normalizeText(refs.spedClientFilter.value);
  const filtered = state.spedCorrections.filter((item) => {
    const fullText = normalizeText(`${item.competencia} ${item.tipo} ${item.status} ${item.tecnico} ${item.telefone || ""} ${getSpedDateValue(item, "dataAgendamento", "data_agendamento")} ${getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")} ${getSpedDateValue(item, "dataFinalizacao", "data_finalizacao")} ${item.observacao}`);
    const matchesClient = !selectedClient || normalizeText(item.cliente) === selectedClient;
    const matchesText = !term || fullText.includes(term);
    const matchesMonth = !month || item.competencia === formatCompetencia(month);
    const isCorrigidoTab = state.activeSpedTab === "corrigido";
    const matchesTab = isCorrigidoTab
      ? normalizeText(item.status) === "corrigido"
      : normalizeText(item.status) !== "corrigido";
    return matchesClient && matchesText && matchesMonth && matchesTab;
  });

  // Ordem: data de agendamento (mais próxima primeiro) e horário; sem agendamento
  // vai para o fim. Empate: competência mais recente, depois cliente.
  filtered.sort((a, b) => {
    const agendKey = (item) => {
      const data = formatDate(getSpedDateValue(item, "dataAgendamento", "data_agendamento"));
      if (!data || data.length !== 10) return "9999-99-99 99:99";
      const [dd, mm, yyyy] = data.split("/");
      const hora = getSpedDateValue(item, "horarioAgendamento", "horario_agendamento") || "99:99";
      return `${yyyy}-${mm}-${dd} ${hora}`;
    };
    const byAgendamento = agendKey(a).localeCompare(agendKey(b));
    if (byAgendamento) return byAgendamento;
    const toKey = (c) => {
      if (c && c.includes("/")) { const [mm, yyyy] = c.split("/"); return `${yyyy}-${mm}`; }
      return c || "";
    };
    const byCompetencia = toKey(b.competencia).localeCompare(toKey(a.competencia));
    if (byCompetencia) return byCompetencia;
    return String(a.cliente || "").localeCompare(String(b.cliente || ""));
  });

  const tableWrap = refs.spedTableBody ? refs.spedTableBody.closest(".table-wrap") : null;
  if (state.activeSpedTab === "corrigido") {
    if (tableWrap) tableWrap.style.display = "none";
    if (refs.spedGroupedList) refs.spedGroupedList.style.display = "";
    renderSpedGrouped(filtered);
  } else {
    if (tableWrap) tableWrap.style.display = "";
    if (refs.spedGroupedList) refs.spedGroupedList.style.display = "none";
    const thead = refs.spedTableBody ? refs.spedTableBody.closest("table").querySelector("thead") : null;
    if (thead) thead.innerHTML = `<tr><th>Cliente</th><th>Competência</th><th>Tipo</th><th>Status</th><th>Técnico</th><th class="sped-col-extra">Telefone</th><th>Agendamento</th><th class="sped-col-extra">Horário</th><th>Finalizado em</th><th>Observação</th><th>Ações</th></tr>`;
    refs.spedTableBody.innerHTML = filtered.map(renderSpedTableRow).join("");
  }

  refs.spedEmptyState.style.display = filtered.length ? "none" : "block";
  renderSpedSummary(filtered);
}

// Linha de tabela do SPED com data-label em cada célula: em telas estreitas o
// CSS (@container em .sped-card) transforma cada linha num card com rótulos.
function spedLinhaTabela(labels, cells) {
  return `<tr>${cells.map((cell, i) => {
    const classes = [];
    if (!String(cell).replace(/<[^>]*>/g, "").trim()) classes.push("sped-cell-vazia");
    if (SPED_COLUNAS_EXTRAS.includes(labels[i])) classes.push("sped-col-extra");
    return `<td data-label="${escapeAttribute(labels[i])}"${classes.length ? ` class="${classes.join(" ")}"` : ""}>${cell}</td>`;
  }).join("")}</tr>`;
}

// Telefone e horário: colunas próprias nos cards; na tabela do desktop aparecem
// como segunda linha do técnico e da data (.sped-sub) para a tabela caber.
const SPED_COLUNAS_EXTRAS = ["Telefone", "Horário"];

function spedComSub(principal, sub) {
  return `${escapeHtml(principal)}${sub ? `<small class="sped-sub">${escapeHtml(sub)}</small>` : ""}`;
}

function spedObservacaoCell(texto) {
  return texto ? `<span class="sped-obs" title="${escapeAttribute(texto)}">${escapeHtml(texto)}</span>` : "";
}

const SPED_LABELS_TABELA = ["Cliente", "Competência", "Tipo", "Status", "Técnico", "Telefone", "Data agendamento", "Horário", "Finalizado em", "Observação", "Ações"];
const SPED_LABELS_AGRUPADO = ["Cliente", "Tipo", "Status", "Técnico", "Telefone", "Data agendamento", "Horário", "Finalizado em", "Quant. dias", "Observação", "Ações"];

function renderSpedTableRow(item) {
  const cells = [
    `<strong class="client-name">${escapeHtml(item.cliente)}</strong>`,
    escapeHtml(formatCompetencia(item.competencia)),
    escapeHtml(item.tipo),
    `<span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>`,
    spedComSub(item.tecnico, item.telefone),
    escapeHtml(item.telefone || ""),
    spedComSub(formatDate(getSpedDateValue(item, "dataAgendamento", "data_agendamento")), getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")),
    escapeHtml(getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")),
    escapeHtml(formatDate(getSpedDateValue(item, "dataFinalizacao", "data_finalizacao"))),
    spedObservacaoCell(item.observacao),
    `<div class="small-actions">
      <button type="button" onclick="editSpedCorrection('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteSpedCorrection('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`
  ];
  return spedLinhaTabela(SPED_LABELS_TABELA, cells);
}

function renderSpedTableRowCorrigido(item) {
  const agend = getSpedDateValue(item, "dataAgendamento", "data_agendamento");
  const final = getSpedDateValue(item, "dataFinalizacao", "data_finalizacao");
  const dias = calcDaysDiff(agend, final);
  const cells = [
    `<strong class="client-name">${escapeHtml(item.cliente)}</strong>`,
    escapeHtml(formatCompetencia(item.competencia)),
    escapeHtml(item.tipo),
    `<span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>`,
    escapeHtml(formatDate(final)),
    dias !== "" ? escapeHtml(String(dias)) : "—",
    escapeHtml(item.observacao),
    `<div class="small-actions">
      <button type="button" onclick="editSpedCorrection('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteSpedCorrection('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`
  ];
  return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
}

function calcDaysDiff(dateFrom, dateTo) {
  const parse = (d) => {
    if (!d) return null;
    if (d.length === 10 && d[2] === "/" && d[5] === "/") {
      return new Date(Number(d.slice(6)), Number(d.slice(3, 5)) - 1, Number(d.slice(0, 2)));
    }
    if (d.includes("-")) {
      const [y, m, day] = d.split("-");
      return new Date(Number(y), Number(m) - 1, Number(day));
    }
    return null;
  };
  const from = parse(dateFrom);
  const to = parse(dateTo);
  if (!from || !to) return "";
  const diff = Math.round((to - from) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : "";
}

function renderSpedClients() {
  sortSpedClients();
  if (refs.spedClientFilter) {
    const selectedClient = refs.spedClientFilter.value;
    refs.spedClientFilter.innerHTML = `
      <option value="">Todos os clientes</option>
      ${state.spedClients.map((client) => `<option value="${escapeHtml(client.name)}">${escapeHtml(client.name)}</option>`).join("")}
    `;
    refs.spedClientFilter.value = state.spedClients.some((c) => c.name === selectedClient) ? selectedClient : "";
  }
  renderSpedClientMenu();
  renderSpedClientList();
}

function renderSpedClientList() {
  if (!refs.spedClientList) return;
  if (!state.spedClients.length) {
    refs.spedClientList.innerHTML = '<p class="client-list-empty">Nenhum cliente cadastrado ainda.</p>';
    return;
  }
  refs.spedClientList.innerHTML = state.spedClients.map((client) => `
    <div class="client-list-item">
      <div class="client-list-info">
        <strong>${escapeHtml(client.name)}</strong>
        ${client.phone ? `<span class="client-list-phone">${escapeHtml(client.phone)}</span>` : ""}
      </div>
      <div class="small-actions">
        <button type="button" onclick="editSpedClient('${escapeAttribute(client.name)}')">Editar</button>
        <button type="button" class="ghost" onclick="deleteSpedClient('${escapeAttribute(client.name)}')">Excluir</button>
      </div>
    </div>
  `).join("");
}

function renderSpedClientMenu() {
  if (!refs.spedClientMenu) return;
  const typedClient = normalizeText(refs.spedCliente.value);
  const filteredClients = state.spedClients.filter((client) => !typedClient || normalizeText(client.name).includes(typedClient));
  if (!filteredClients.length) {
    refs.spedClientMenu.innerHTML = `<div class="combo-empty">Nenhum cliente encontrado.</div>`;
    return;
  }
  refs.spedClientMenu.innerHTML = filteredClients.map((client) =>
    `<button type="button" class="combo-option" data-client-name="${escapeAttribute(client.name)}">
      ${escapeHtml(client.name)}${client.phone ? `<small class="combo-phone"> · ${escapeHtml(client.phone)}</small>` : ""}
    </button>`
  ).join("");
  refs.spedClientMenu.querySelectorAll("[data-client-name]").forEach((button) => {
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      const selectedName = button.getAttribute("data-client-name");
      refs.spedCliente.value = selectedName;
      const selectedClient = state.spedClients.find((c) => c.name === selectedName);
      if (refs.spedTelefone && selectedClient) refs.spedTelefone.value = selectedClient.phone || "";
      closeSpedClientMenu();
    });
  });
}

function openSpedClientMenu() {
  if (!refs.spedClientMenu) return;
  renderSpedClientMenu();
  refs.spedClientMenu.classList.add("open");
}

function closeSpedClientMenu() {
  if (refs.spedClientMenu) refs.spedClientMenu.classList.remove("open");
}

function closeSpedClientMenuLater() {
  setTimeout(closeSpedClientMenu, 120);
}

function fillPhoneFromClientName() {
  if (!refs.spedTelefone) return;
  const clientName = refs.spedCliente.value.trim();
  if (!clientName) return;
  const match = state.spedClients.find((c) => normalizeText(c.name) === normalizeText(clientName));
  if (match) refs.spedTelefone.value = match.phone || "";
}

function renderSpedSummary(items) {
  if (state.activeSpedTab === "corrigido") {
    const total = items.length;
    const competencias = new Set(items.map((i) => i.competencia)).size;
    const clientes = new Set(items.map((i) => i.cliente)).size;
    refs.spedSummary.innerHTML = `
      <div class="summary-item"><strong>${total}</strong><span>Corrigidos</span></div>
      <div class="summary-item"><strong>${competencias}</strong><span>Competências</span></div>
      <div class="summary-item"><strong>${clientes}</strong><span>Clientes</span></div>
    `;
    return;
  }
  const total = items.length;
  const pendentes = items.filter((item) => item.status === "Pendente").length;
  const emCorrecao = items.filter((item) => item.status === "Em correção").length;
  const entregues = items.filter((item) => item.status === "Entregue").length;
  refs.spedSummary.innerHTML = `
    <div class="summary-item"><strong>${total}</strong><span>Total filtrado</span></div>
    <div class="summary-item"><strong>${pendentes}</strong><span>Pendentes</span></div>
    <div class="summary-item"><strong>${emCorrecao}</strong><span>Em correção</span></div>
    <div class="summary-item"><strong>${entregues}</strong><span>Entregues</span></div>
  `;
}

function renderSpedGrouped(items) {
  if (!refs.spedGroupedList) return;
  if (!items.length) {
    refs.spedGroupedList.innerHTML = "";
    return;
  }

  const groups = {};
  items.forEach((item) => {
    const key = item.competencia || "Sem competência";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  const toSortKey = (c) => {
    if (c && c.includes("/")) { const [mm, yyyy] = c.split("/"); return `${yyyy}-${mm}`; }
    return c || "";
  };
  const sortedKeys = Object.keys(groups).sort((a, b) => toSortKey(b).localeCompare(toSortKey(a)));

  refs.spedGroupedList.innerHTML = sortedKeys.map((key) => {
    const groupItems = groups[key];
    return `
      <div class="sped-group">
        <div class="sped-group-header" onclick="toggleSpedGroup(this)" role="button" tabindex="0" aria-expanded="false">
          <span class="sped-group-title">${escapeHtml(formatCompetencia(key))}</span>
          <div class="sped-group-header-right">
            <span class="sped-group-count">${groupItems.length} ${groupItems.length === 1 ? "item" : "itens"}</span>
            <span class="sped-group-toggle" aria-hidden="true">▸</span>
          </div>
        </div>
        <div class="sped-group-items" style="display:none">
          <div class="table-wrap">
            <table class="sped-table">
              <thead>
                <tr>
                  <th>Cliente</th><th>Tipo</th><th>Status</th><th>Técnico</th><th class="sped-col-extra">Telefone</th>
                  <th>Agendamento</th><th class="sped-col-extra">Horário</th><th>Finalizado em</th><th>Quant. dias</th>
                  <th>Observação</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${groupItems.map(renderSpedGroupedRow).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderSpedGroupedRow(item) {
  const agend = getSpedDateValue(item, "dataAgendamento", "data_agendamento");
  const final = getSpedDateValue(item, "dataFinalizacao", "data_finalizacao");
  const dias = calcDaysDiff(agend, final);
  const cells = [
    `<strong class="client-name">${escapeHtml(item.cliente)}</strong>`,
    escapeHtml(item.tipo),
    `<span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>`,
    spedComSub(item.tecnico, item.telefone),
    escapeHtml(item.telefone || ""),
    spedComSub(formatDate(agend), getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")),
    escapeHtml(getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")),
    escapeHtml(formatDate(final)),
    dias !== "" ? escapeHtml(String(dias)) : "—",
    spedObservacaoCell(item.observacao || ""),
    `<div class="small-actions">
      <button type="button" onclick="editSpedCorrection('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteSpedCorrection('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`
  ];
  return spedLinhaTabela(SPED_LABELS_AGRUPADO, cells);
}

function renderIssues() {
  const term = refs.searchInput.value.trim().toLowerCase();
  const filtered = state.issues.filter((item) => {
    const fullText = `${item.descricao} ${(item.tecnicos || []).join(" ")} ${item.jira} ${item.cliente}`.toLowerCase();
    return !term || fullText.includes(term);
  });
  filtered.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  refs.issueTableBody.innerHTML = filtered.map((item) => `
    <tr>
      <td>${escapeHtml(item.descricao)}</td>
      <td>${escapeHtml((item.tecnicos || []).join(", "))}</td>
      <td>${escapeHtml(item.jira)}</td>
      <td>${escapeHtml(item.cliente)}</td>
      <td>
        <div class="small-actions">
          <button type="button" onclick="editIssue('${escapeAttribute(item.id)}')">Editar</button>
          <button type="button" class="ghost" onclick="deleteIssue('${escapeAttribute(item.id)}')">Excluir</button>
        </div>
      </td>
    </tr>
  `).join("");
  refs.issueEmptyState.style.display = filtered.length ? "none" : "block";
}

function formatCompetencia(value) {
  if (!value) return "";
  if (value.includes("/")) return value;
  if (!value.includes("-")) return value;
  const [year, month] = value.split("-");
  return `${month}/${year}`;
}

function getPreviousCompetencia(competencia) {
  if (!competencia || !competencia.includes("/")) return "";
  const [month, year] = competencia.split("/");
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  const prevMonth = m === 1 ? 12 : m - 1;
  const prevYear = m === 1 ? y - 1 : y;
  return `${String(prevMonth).padStart(2, "0")}/${prevYear}`;
}

function toStorageDate(htmlDate) {
  if (!htmlDate || htmlDate.length !== 10 || !htmlDate.includes("-")) return "";
  const [year, month, day] = htmlDate.split("-");
  return `${day}/${month}/${year}`;
}

function todayAsStorageDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${now.getFullYear()}`;
}

function storageToInputDate(stored) {
  if (!stored) return "";
  if (stored.length === 10 && stored[2] === "/" && stored[5] === "/") {
    return `${stored.slice(6)}-${stored.slice(3, 5)}-${stored.slice(0, 2)}`;
  }
  if (stored.length === 8 && !stored.includes("-")) {
    return `${stored.slice(4, 8)}-${stored.slice(2, 4)}-${stored.slice(0, 2)}`;
  }
  return stored;
}

function competenciaToInputValue(stored) {
  if (!stored || !stored.includes("/")) return stored || "";
  const [month, year] = stored.split("/");
  return `${year}-${month}`;
}

function formatDate(value) {
  if (!value) return "";
  if (value.length === 10 && value[2] === "/" && value[5] === "/") return value;
  if (value.length === 8 && !value.includes("-")) {
    return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
  if (value.includes("-")) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  return value;
}

function getSpedDateValue(item, camelKey, snakeKey) {
  return item[camelKey] || item[snakeKey] || "";
}

function getStatusClass(status) {
  return "status-" + normalizeText(status).replace(/\s+/g, "-");
}

function normalizeText(value) {
  return String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function toggleSpedGroup(header) {
  const group = header.closest(".sped-group");
  const items = group && group.querySelector(".sped-group-items");
  if (!items) return;
  const isCollapsed = items.style.display === "none";
  items.style.display = isCollapsed ? "" : "none";
  const toggle = header.querySelector(".sped-group-toggle");
  if (toggle) toggle.textContent = isCollapsed ? "▾" : "▸";
  header.setAttribute("aria-expanded", String(isCollapsed));
}

// ── Diário do Cliente ────────────────────────────────────────────────────────

function focusDiarioForm() {
  resetDiarioForm();
  if (state.diarioSelectedClient && refs.diarioCliente) {
    refs.diarioCliente.value = state.diarioSelectedClient;
  }
  openModal(refs.diarioFormModal, refs.diarioCliente);
}

async function saveDiario(event) {
  event.preventDefault();
  const diarioId = refs.diarioId.value || null;
  const payload = {
    id: diarioId || createId(),
    cliente: refs.diarioCliente.value.trim(),
    data: toStorageDate(refs.diarioData.value),
    tipo: refs.diarioTipo.value,
    descricao: refs.diarioDescricao.value.trim(),
    tecnico: refs.diarioTecnico.value.trim(),
    observacao: refs.diarioObservacao.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!payload.cliente || !payload.tipo || !payload.descricao) {
    alert("Preencha cliente, tipo e descrição.");
    return;
  }

  state.diarioSelectedClient = payload.cliente;
  if (refs.diarioClientSearch) refs.diarioClientSearch.value = payload.cliente;
  await sendData(diarioId ? `/api/diario/${encodeURIComponent(payload.id)}` : "/api/diario", diarioId ? "PUT" : "POST", payload);
  resetDiarioForm();
  closeModal(refs.diarioFormModal);
}

function editDiario(id) {
  const item = state.diario.find((d) => String(d.id) === String(id));
  if (!item) return;
  refs.diarioId.value = item.id;
  refs.diarioCliente.value = item.cliente || "";
  refs.diarioData.value = storageToInputDate(item.data || "");
  refs.diarioTipo.value = item.tipo || "";
  refs.diarioDescricao.value = item.descricao || "";
  refs.diarioTecnico.value = item.tecnico || "";
  refs.diarioObservacao.value = item.observacao || "";
  openModal(refs.diarioFormModal, refs.diarioCliente);
}

async function deleteDiario(id) {
  if (!confirm("Deseja excluir este registro do diário?")) return;
  await deleteData(`/api/diario/${encodeURIComponent(id)}`);
}

async function clearAllDiario() {
  if (!state.diario.length) return;
  if (!confirm("Deseja remover todos os registros do diário?")) return;
  await deleteData("/api/diario");
  resetDiarioForm();
}

function cancelDiarioEdit() {
  resetDiarioForm();
  closeModal(refs.diarioFormModal);
}

function resetDiarioForm() {
  refs.diarioForm.reset();
  refs.diarioId.value = "";
}

function renderDiario() {
  renderDiarioClientMenu();

  const selected = state.diarioSelectedClient;
  if (!selected) {
    if (refs.diarioClientView) refs.diarioClientView.style.display = "none";
    if (refs.diarioNoClientState) refs.diarioNoClientState.style.display = "block";
    return;
  }

  if (refs.diarioClientView) refs.diarioClientView.style.display = "";
  if (refs.diarioNoClientState) refs.diarioNoClientState.style.display = "none";
  if (refs.diarioSelectedClientName) refs.diarioSelectedClientName.textContent = selected;

  const term = normalizeText(refs.diarioSearchInput ? refs.diarioSearchInput.value : "");
  const month = refs.diarioMonthFilter ? refs.diarioMonthFilter.value : "";

  const matchMonth = (dateStr) => {
    if (!month) return true;
    const [yyyy, mm] = month.split("-");
    return dateStr.slice(3, 5) === mm && dateStr.slice(6, 10) === yyyy;
  };

  const diarioItems = state.diario
    .filter((item) => {
      if (normalizeText(item.cliente) !== normalizeText(selected)) return false;
      const fullText = normalizeText(`${item.tipo} ${item.descricao} ${item.tecnico} ${item.observacao}`);
      return (!term || fullText.includes(term)) && matchMonth(item.data || "");
    })
    .map((item) => ({ ...item, _source: "diario", _sortDate: item.data || "" }));

  const spedItems = state.spedCorrections
    .filter((item) => {
      if (normalizeText(item.cliente) !== normalizeText(selected)) return false;
      const fullText = normalizeText(`${item.tipo} ${item.status} ${item.tecnico} ${item.competencia} ${item.observacao}`);
      const agend = getSpedDateValue(item, "dataAgendamento", "data_agendamento");
      return (!term || fullText.includes(term)) && matchMonth(agend);
    })
    .map((item) => ({
      ...item,
      _source: "sped",
      _sortDate: getSpedDateValue(item, "dataAgendamento", "data_agendamento") || getSpedDateValue(item, "dataFinalizacao", "data_finalizacao") || ""
    }));

  const procItems = state.procedimentos
    .filter((item) => {
      if (normalizeText(item.cliente) !== normalizeText(selected)) return false;
      const fullText = normalizeText(`${item.tipo} ${item.status} ${item.tecnico} ${item.observacao}`);
      return (!term || fullText.includes(term)) && matchMonth(item.dataAgendamento || "");
    })
    .map((item) => ({
      ...item,
      _source: "proc",
      _sortDate: item.dataAgendamento || item.dataFinalizacao || ""
    }));

  const merged = [...diarioItems, ...spedItems, ...procItems];
  merged.sort((a, b) => {
    const toKey = (d) => {
      if (d && d.length === 10 && d[2] === "/") return `${d.slice(6)}-${d.slice(3, 5)}-${d.slice(0, 2)}`;
      return d || "";
    };
    return toKey(b._sortDate).localeCompare(toKey(a._sortDate)) || String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });

  if (refs.diarioEntryList) refs.diarioEntryList.innerHTML = merged.map(renderDiarioEntry).join("");
  if (refs.diarioEmptyState) refs.diarioEmptyState.style.display = merged.length ? "none" : "block";
  renderDiarioSummary(diarioItems.length, spedItems.length, procItems.length);

  const clienteRecord = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(selected));
  if (refs.estruturaVersaoBanco) {
    refs.estruturaVersaoBanco.textContent = (clienteRecord && clienteRecord.versaoBanco) || "—";
  }
}

function renderDiarioEntry(item) {
  if (item._source === "sped") return renderDiarioSpedEntry(item);
  if (item._source === "proc") return renderDiarioProcEntry(item);
  return `
    <div class="timeline-item">
      <div class="timeline-dot timeline-dot-diario"></div>
      <div class="timeline-card">
        <div class="timeline-card-info">
          <div class="timeline-card-header">
            ${item.data ? `<span class="timeline-date">${escapeHtml(formatDate(item.data))}</span>` : ""}
            <span class="sped-group-item-chip">${escapeHtml(item.tipo)}</span>
          </div>
          <span class="timeline-body">${escapeHtml(item.descricao)}</span>
          ${item.tecnico ? `<span class="timeline-meta">Técnico: ${escapeHtml(item.tecnico)}</span>` : ""}
          ${item.observacao ? `<span class="timeline-obs">${escapeHtml(item.observacao)}</span>` : ""}
        </div>
      </div>
    </div>`;
}

function renderDiarioSpedEntry(item) {
  const agend = getSpedDateValue(item, "dataAgendamento", "data_agendamento");
  const final = getSpedDateValue(item, "dataFinalizacao", "data_finalizacao");
  return `
    <div class="timeline-item">
      <div class="timeline-dot timeline-dot-sped"></div>
      <div class="timeline-card">
        <div class="timeline-card-info">
          <div class="timeline-card-header">
            ${agend ? `<span class="timeline-date">${escapeHtml(formatDate(agend))}</span>` : ""}
            <span class="sped-group-item-chip" style="background:#6366f1;color:#fff;">SPED</span>
            <span class="sped-group-item-chip">${escapeHtml(item.tipo)}</span>
          </div>
          <span class="timeline-body">Competência: <strong>${escapeHtml(formatCompetencia(item.competencia))}</strong> — <span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span></span>
          ${item.tecnico ? `<span class="timeline-meta">Técnico: ${escapeHtml(item.tecnico)}</span>` : ""}
          ${final ? `<span class="timeline-meta">Finalizado em: ${escapeHtml(formatDate(final))}</span>` : ""}
          ${item.observacao ? `<span class="timeline-obs">${escapeHtml(item.observacao)}</span>` : ""}
        </div>
      </div>
    </div>`;
}

function renderDiarioProcEntry(item) {
  return `
    <div class="timeline-item">
      <div class="timeline-dot timeline-dot-proc"></div>
      <div class="timeline-card">
        <div class="timeline-card-info">
          <div class="timeline-card-header">
            ${item.dataAgendamento ? `<span class="timeline-date">${escapeHtml(formatDate(item.dataAgendamento))}</span>` : ""}
            <span class="sped-group-item-chip" style="background:#f59e0b;color:#fff;">Procedimento</span>
            <span class="sped-group-item-chip">${escapeHtml(item.tipo)}</span>
            ${item.versaoBanco ? `<span class="sped-group-item-chip" style="background:#153b2a;color:#b8ff12;">v${escapeHtml(item.versaoBanco)}</span>` : ""}
            <span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>
          </div>
          ${item.tecnico ? `<span class="timeline-meta">Técnico: ${escapeHtml(item.tecnico)}</span>` : ""}
          ${item.dataFinalizacao ? `<span class="timeline-meta">Finalizado em: ${escapeHtml(formatDate(item.dataFinalizacao))}</span>` : ""}
          ${item.observacao ? `<span class="timeline-obs">${escapeHtml(item.observacao)}</span>` : ""}
        </div>
      </div>
    </div>`;
}

function renderDiarioClientMenu() {
  if (!refs.diarioClientMenu) return;
  const typed = normalizeText(refs.diarioClientSearch ? refs.diarioClientSearch.value : "");
  const fromClientes = state.clientes.map((c) => c.nome);
  const fromSped = state.spedClients.map((c) => c.name);
  const fromDiario = state.diario.map((d) => d.cliente);
  const clients = [...new Set([...fromClientes, ...fromSped, ...fromDiario].filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filtered = typed ? clients.filter((c) => normalizeText(c).includes(typed)) : clients;
  if (!filtered.length) {
    refs.diarioClientMenu.innerHTML = `<div class="combo-empty">Nenhum cliente encontrado.</div>`;
    return;
  }
  refs.diarioClientMenu.innerHTML = filtered.map((c) =>
    `<button type="button" class="combo-option" data-dc="${escapeAttribute(c)}">${escapeHtml(c)}</button>`
  ).join("");
  refs.diarioClientMenu.querySelectorAll("[data-dc]").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectDiarioClient(btn.getAttribute("data-dc"));
    });
  });
}

function openDiarioClientMenu() {
  if (!refs.diarioClientMenu) return;
  renderDiarioClientMenu();
  refs.diarioClientMenu.classList.add("open");
}

function closeDiarioClientMenu() {
  if (refs.diarioClientMenu) refs.diarioClientMenu.classList.remove("open");
}

function closeDiarioClientMenuLater() {
  setTimeout(closeDiarioClientMenu, 120);
}

function selectDiarioClient(name) {
  state.diarioSelectedClient = name;
  if (refs.diarioClientSearch) refs.diarioClientSearch.value = name;
  closeDiarioClientMenu();
  renderDiario();
}

function clearDiarioClient() {
  state.diarioSelectedClient = "";
  if (refs.diarioClientSearch) refs.diarioClientSearch.value = "";
  renderDiario();
}

function renderDiarioSummary(totalDiario, totalSped, totalProc) {
  if (!refs.diarioSummary) return;
  refs.diarioSummary.innerHTML = `
    <div class="summary-item"><strong>${totalDiario + totalSped + totalProc}</strong><span>Total</span></div>
    <div class="summary-item"><strong>${totalDiario}</strong><span>Registros do diário</span></div>
    <div class="summary-item"><strong>${totalSped}</strong><span>SPEDs</span></div>
    <div class="summary-item"><strong>${totalProc}</strong><span>Procedimentos</span></div>
  `;
}

// ── Setup: colapso de seções ──────────────────────────────────────────────────

function initCollapseSections() {
  const STORAGE_KEY = "setup_sections_collapsed";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch {}

  document.querySelectorAll("[data-collapse-target]").forEach((header) => {
    const id = header.dataset.collapseTarget;
    const body = document.getElementById(id);
    if (!body) return;

    function applyState(collapsed) {
      body.classList.toggle("collapsed", collapsed);
      header.setAttribute("aria-expanded", String(!collapsed));
      saved[id] = collapsed;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }

    applyState(Boolean(saved[id]));
    header.addEventListener("click", () => applyState(!body.classList.contains("collapsed")));
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); applyState(!body.classList.contains("collapsed")); }
    });
  });
}

// ── Clientes ─────────────────────────────────────────────────────────────────

// CPF/CNPJ é armazenado sem pontuação e em maiúsculas (o CNPJ alfanumérico tem letras).
function normalizeCpfCnpj(value) {
  return String(value || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
}

function isValidCpf(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (len) => {
    let soma = 0;
    for (let i = 0; i < len; i++) soma += Number(cpf[i]) * (len + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

// Aceita o CNPJ numérico e o alfanumérico (12 posições 0-9/A-Z + 2 dígitos verificadores).
function isValidCnpj(cnpj) {
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;
  const digito = (len) => {
    const pesos = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < len; i++) soma += (cnpj.charCodeAt(i) - 48) * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return digito(12) === Number(cnpj[12]) && digito(13) === Number(cnpj[13]);
}

function formatCpfCnpj(value) {
  const doc = normalizeCpfCnpj(value);
  if (/^\d{11}$/.test(doc)) return doc.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  if (doc.length === 14) return doc.replace(/^(\w{2})(\w{3})(\w{3})(\w{4})(\w{2})$/, "$1.$2.$3/$4-$5");
  return doc;
}

// O campo recebe só os caracteres do documento (sem pontuação): 11 para CPF, 14 para CNPJ.
// O limite fica no JS (não em maxlength): o maxlength cortaria o texto colado com
// pontuação antes de ela ser removida (ex.: "12.345.678/0001-90" virava "12.345.678/000").
function onClienteTipoDocumentoChange() {
  if (!refs.clienteCpfCnpj) return;
  const isCpf = refs.clienteTipoDocumento && refs.clienteTipoDocumento.value === "CPF";
  refs.clienteCpfCnpj.inputMode = isCpf ? "numeric" : "text";
  refs.clienteCpfCnpj.placeholder = isCpf ? "11 dígitos, sem pontuação" : "14 caracteres, sem pontuação";
  if (refs.clienteCpfCnpjLabel) refs.clienteCpfCnpjLabel.textContent = isCpf ? "CPF" : "CNPJ";
  onClienteCpfCnpjInput();
}

function onClienteCpfCnpjInput() {
  if (!refs.clienteCpfCnpj) return;
  const isCpf = refs.clienteTipoDocumento && refs.clienteTipoDocumento.value === "CPF";
  const doc = isCpf
    ? refs.clienteCpfCnpj.value.replace(/\D/g, "")
    : normalizeCpfCnpj(refs.clienteCpfCnpj.value);
  const limpo = doc.slice(0, isCpf ? 11 : 14);
  if (limpo !== refs.clienteCpfCnpj.value) refs.clienteCpfCnpj.value = limpo;
}

// Ao colar um documento inteiro (com ou sem pontuação), ajusta o tipo pelo tamanho:
// 11 dígitos = CPF, 14 caracteres = CNPJ.
function onClienteCpfCnpjPaste(event) {
  const texto = event.clipboardData ? event.clipboardData.getData("text") : "";
  const doc = normalizeCpfCnpj(texto);
  if (!doc) return;
  event.preventDefault();
  if (refs.clienteTipoDocumento) {
    if (/^\d{11}$/.test(doc)) refs.clienteTipoDocumento.value = "CPF";
    else if (doc.length === 14) refs.clienteTipoDocumento.value = "CNPJ";
  }
  refs.clienteCpfCnpj.value = doc;
  onClienteTipoDocumentoChange();
}

function focusClienteForm() {
  resetClienteForm();
  populateMatrizOptions();
  openModal(refs.clienteFormModal, refs.clienteNome);
}

function onClienteTipoChange() {
  if (!refs.clienteMatrizRow) return;
  const tipo = refs.clienteTipoEmpresa ? refs.clienteTipoEmpresa.value : "";
  refs.clienteMatrizRow.style.display = tipo === "Filial" ? "" : "none";
}

function onClienteVemChange() {
  if (!refs.clienteVemLicencasRow) return;
  refs.clienteVemLicencasRow.style.display = refs.clienteVem && refs.clienteVem.value === "true" ? "" : "none";
}

function onClienteAutomacaoChange() {
  if (!refs.clienteAutomacaoLicencasRow) return;
  refs.clienteAutomacaoLicencasRow.style.display = refs.clienteAutomacaoVendas && refs.clienteAutomacaoVendas.value === "true" ? "" : "none";
}

function populateMatrizOptions(selectedId) {
  if (!refs.clienteMatrizId) return;
  const matrizes = state.clientes.filter((c) => c.tipoEmpresa === "Matriz");
  refs.clienteMatrizId.innerHTML = `<option value="">Selecione a matriz...</option>` +
    matrizes.map((m) => `<option value="${escapeAttribute(m.id)}"${String(m.id) === String(selectedId || "") ? " selected" : ""}>${escapeHtml(m.nome)}</option>`).join("");
}

async function saveCliente(event) {
  event.preventDefault();
  const clienteId = refs.clienteId.value || null;
  const tipoEmpresa = refs.clienteTipoEmpresa ? refs.clienteTipoEmpresa.value : "Independente";
  const matrizId = tipoEmpresa === "Filial" && refs.clienteMatrizId ? refs.clienteMatrizId.value || null : null;

  if (tipoEmpresa === "Filial" && !matrizId) {
    alert("Selecione a empresa matriz desta filial.");
    return;
  }

  const existing = clienteId ? state.clientes.find((c) => String(c.id) === String(clienteId)) : null;

  const vem = refs.clienteVem ? refs.clienteVem.value === "true" : (existing ? existing.vem === true : false);
  const vemLicencas = vem
    ? Math.max(0, parseInt(refs.clienteVemLicencas ? refs.clienteVemLicencas.value : (existing ? existing.vemLicencas : 0), 10) || 0)
    : 0;
  const automacaoVendas = refs.clienteAutomacaoVendas ? refs.clienteAutomacaoVendas.value === "true" : (existing ? existing.automacaoVendas === true : false);
  const automacaoVendasLicencas = automacaoVendas
    ? Math.max(0, parseInt(refs.clienteAutomacaoLicencas ? refs.clienteAutomacaoLicencas.value : (existing ? existing.automacaoVendasLicencas : 0), 10) || 0)
    : 0;

  const payload = {
    id: clienteId || createId(),
    nome: refs.clienteNome.value.trim(),
    cpfCnpj: normalizeCpfCnpj(refs.clienteCpfCnpj ? refs.clienteCpfCnpj.value : (existing ? existing.cpfCnpj : "")),
    telefone: refs.clienteTelefone ? refs.clienteTelefone.value.trim() : "",
    prioridade: refs.clientePrioridade.value,
    sped: refs.clienteSped.value === "true",
    tipoEmpresa,
    matrizId,
    vem,
    vemLicencas,
    automacaoVendas,
    automacaoVendasLicencas,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!payload.nome) {
    alert("Informe o nome do cliente.");
    return;
  }

  const tipoDocumento = refs.clienteTipoDocumento
    ? refs.clienteTipoDocumento.value
    : (payload.cpfCnpj.length === 11 ? "CPF" : "CNPJ");
  if (!payload.cpfCnpj) {
    alert(`Informe o ${tipoDocumento} do cliente.`);
    return;
  }
  if (tipoDocumento === "CPF" ? payload.cpfCnpj.length !== 11 : payload.cpfCnpj.length !== 14) {
    alert(tipoDocumento === "CPF" ? "O CPF deve ter 11 dígitos." : "O CNPJ deve ter 14 caracteres.");
    return;
  }
  if (tipoDocumento === "CPF" ? !isValidCpf(payload.cpfCnpj) : !isValidCnpj(payload.cpfCnpj)) {
    alert(`${tipoDocumento} inválido. Confira os caracteres digitados.`);
    return;
  }
  const duplicado = state.clientes.find((c) =>
    String(c.id) !== String(payload.id) && normalizeCpfCnpj(c.cpfCnpj) === payload.cpfCnpj
  );
  if (duplicado) {
    alert(`Este CPF/CNPJ já está cadastrado para o cliente "${duplicado.nome}".`);
    return;
  }

  try {
    await sendData(
      clienteId ? `/api/clientes/${encodeURIComponent(payload.id)}` : "/api/clientes",
      clienteId ? "PUT" : "POST",
      payload
    );
  } catch (error) {
    // 23505 = unique_violation: outro usuário cadastrou o mesmo documento nesse meio-tempo.
    if (error && error.code === "23505") {
      alert("Este CPF/CNPJ já está cadastrado para outro cliente.");
      return;
    }
    throw error;
  }
  resetClienteForm();
  closeModal(refs.clienteFormModal);
}

function editCliente(id) {
  const item = state.clientes.find((c) => String(c.id) === String(id));
  if (!item) return;
  refs.clienteId.value = item.id;
  refs.clienteNome.value = item.nome || "";
  if (refs.clienteTipoDocumento) refs.clienteTipoDocumento.value = normalizeCpfCnpj(item.cpfCnpj).length === 11 ? "CPF" : "CNPJ";
  if (refs.clienteCpfCnpj) refs.clienteCpfCnpj.value = normalizeCpfCnpj(item.cpfCnpj);
  onClienteTipoDocumentoChange();
  if (refs.clienteTelefone) refs.clienteTelefone.value = item.telefone || "";
  refs.clientePrioridade.value = item.prioridade || "Baixa";
  refs.clienteSped.value = String(item.sped);
  if (refs.clienteVem) refs.clienteVem.value = String(item.vem === true);
  if (refs.clienteVemLicencas) refs.clienteVemLicencas.value = item.vemLicencas || 0;
  if (refs.clienteAutomacaoVendas) refs.clienteAutomacaoVendas.value = String(item.automacaoVendas === true);
  if (refs.clienteAutomacaoLicencas) refs.clienteAutomacaoLicencas.value = item.automacaoVendasLicencas || 0;
  if (refs.clienteTipoEmpresa) refs.clienteTipoEmpresa.value = item.tipoEmpresa || "Independente";
  populateMatrizOptions(item.matrizId);
  onClienteTipoChange();
  onClienteVemChange();
  onClienteAutomacaoChange();
  openModal(refs.clienteFormModal, refs.clienteNome);
}

async function deleteCliente(id) {
  const hasFiliais = state.clientes.some((c) => String(c.matrizId) === String(id));
  if (hasFiliais) {
    alert("Este cliente é matriz de outras filiais. Remova ou reatribua as filiais antes de excluir.");
    return;
  }
  if (!confirm("Deseja excluir este cliente?")) return;
  await deleteData(`/api/clientes/${encodeURIComponent(id)}`);
}

function cancelClienteEdit() {
  resetClienteForm();
  closeModal(refs.clienteFormModal);
}

function resetClienteForm() {
  if (refs.clienteForm) refs.clienteForm.reset();
  if (refs.clienteId) refs.clienteId.value = "";
  onClienteTipoDocumentoChange();
  if (refs.clienteMatrizRow) refs.clienteMatrizRow.style.display = "none";
  if (refs.clienteVemLicencasRow) refs.clienteVemLicencasRow.style.display = "none";
  if (refs.clienteAutomacaoLicencasRow) refs.clienteAutomacaoLicencasRow.style.display = "none";
}

function toggleMatrizFiliais(id) {
  if (state.expandedMatrizes.has(id)) {
    state.expandedMatrizes.delete(id);
  } else {
    state.expandedMatrizes.add(id);
  }
  renderClientes();
}

function renderClientes() {
  if (!refs.clienteTableBody) return;
  const term = normalizeText(refs.clienteSearchInput ? refs.clienteSearchInput.value : "");
  const prioFiltro = refs.clientePrioridadeFilter ? refs.clientePrioridadeFilter.value : "";
  const spedFiltro = refs.clienteSpedFilter ? refs.clienteSpedFilter.value : "";
  const tipoFiltro = refs.clienteTipoFilter ? refs.clienteTipoFilter.value : "";
  const hasActiveFilter = term || prioFiltro || spedFiltro || tipoFiltro;

  const matchesFilters = (item) => {
    const termDoc = normalizeCpfCnpj(term);
    const matchesText = !term || normalizeText(item.nome).includes(term) || normalizeText(item.telefone).includes(term)
      || Boolean(termDoc && normalizeCpfCnpj(item.cpfCnpj).includes(termDoc));
    const matchesPrio = !prioFiltro || item.prioridade === prioFiltro;
    const matchesSped = !spedFiltro || String(item.sped) === spedFiltro;
    const matchesTipo = !tipoFiltro || (item.tipoEmpresa || "Independente") === tipoFiltro;
    return matchesText && matchesPrio && matchesSped && matchesTipo;
  };

  const filtered = state.clientes.filter(matchesFilters);

  const prioOrder = { Alta: 0, "Média": 1, Baixa: 2 };
  const sortKey = (a) => [(prioOrder[a.prioridade] ?? 3), String(a.nome || "").toLowerCase()];

  const rows = [];
  const addedIds = new Set();

  const matrizes = state.clientes
    .filter((c) => (c.tipoEmpresa || "Independente") === "Matriz")
    .sort((a, b) => {
      const [pa, na] = sortKey(a);
      const [pb, nb] = sortKey(b);
      return pa !== pb ? pa - pb : na.localeCompare(nb);
    });

  matrizes.forEach((matriz) => {
    const todasFiliais = state.clientes
      .filter((c) => (c.tipoEmpresa || "Independente") === "Filial" && String(c.matrizId) === String(matriz.id))
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")));

    const matrizMatches = matchesFilters(matriz);
    const filiaisFiltered = todasFiliais.filter(matchesFilters);

    if (!matrizMatches && filiaisFiltered.length === 0) return;

    const collapsed = !hasActiveFilter && !state.expandedMatrizes.has(String(matriz.id));
    rows.push({ item: matriz, level: 0, ghost: !matrizMatches, collapsed, filialCount: todasFiliais.length });
    addedIds.add(matriz.id);

    if (!collapsed) {
      filiaisFiltered.forEach((f) => {
        rows.push({ item: f, level: 1, ghost: false, collapsed: false, filialCount: 0 });
        addedIds.add(f.id);
      });
    }
  });

  const remaining = filtered
    .filter((c) => !addedIds.has(c.id))
    .sort((a, b) => {
      const [pa, na] = sortKey(a);
      const [pb, nb] = sortKey(b);
      return pa !== pb ? pa - pb : na.localeCompare(nb);
    });

  remaining.forEach((item) => rows.push({ item, level: 0, ghost: false, collapsed: false, filialCount: 0 }));

  const visibleRows = applyListLimit(rows, "clientes");
  refs.clienteTableBody.innerHTML = visibleRows.map((r) => renderClienteTableRow(r.item, r.level, r.ghost, r.collapsed, r.filialCount)).join("");
  refs.clienteEmptyState.style.display = rows.length ? "none" : "block";
  renderClienteSummary(filtered);
  updateShowMoreButton(refs.clienteShowMoreWrap, refs.clienteShowMoreBtn, "clientes", rows.length);
}

function renderClienteTableRow(item, level = 0, ghost = false, collapsed = false, filialCount = 0) {
  const prioClass = "status-" + normalizeText(item.prioridade).replace(/\s+/g, "-");
  const spedBadge = item.sped
    ? `<span class="status sped-badge-sim">Sim</span>`
    : `<span class="status sped-badge-nao">Não</span>`;

  const tipoBadge = item.tipoEmpresa === "Matriz"
    ? `<span class="status badge-matriz">Matriz</span>`
    : item.tipoEmpresa === "Filial"
    ? `<span class="status badge-filial">Filial</span>`
    : "";

  let toggleBtn = "";
  if (item.tipoEmpresa === "Matriz" && filialCount > 0) {
    const icon = collapsed ? "▶" : "▼";
    const title = collapsed ? `Expandir ${filialCount} filial(is)` : `Recolher filiais`;
    toggleBtn = `<button type="button" class="tree-toggle" title="${title}" onclick="toggleMatrizFiliais('${escapeAttribute(item.id)}')">${icon}</button>`;
  }

  const indent = level === 1 ? `<span class="tree-branch" aria-hidden="true">└─</span>` : "";
  const rowClass = ghost ? ` class="tree-ghost"` : level === 1 ? ` class="tree-filial"` : "";

  const nameCell = `<span class="client-name-cell">${toggleBtn}${indent}<strong class="client-name">${escapeHtml(item.nome)}</strong>${tipoBadge ? " " + tipoBadge : ""}${collapsed ? `<span class="filial-count">${filialCount} filial(is)</span>` : ""}</span>`;

  const cells = [
    nameCell,
    escapeHtml(formatCpfCnpj(item.cpfCnpj) || "—"),
    escapeHtml(item.telefone || ""),
    `<span class="status ${prioClass}">${escapeHtml(item.prioridade)}</span>`,
    spedBadge,
    escapeHtml(item.versaoBanco || "—"),
    `<div class="small-actions">
      <button type="button" onclick="editCliente('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteCliente('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`,
  ];
  return `<tr${rowClass}>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
}

function renderClienteSummary(items) {
  if (!refs.clienteSummary) return;
  const total = items.length;
  const comSped = items.filter((i) => i.sped).length;
  const alta = items.filter((i) => i.prioridade === "Alta").length;
  const matrizes = items.filter((i) => i.tipoEmpresa === "Matriz").length;
  const filiais = items.filter((i) => i.tipoEmpresa === "Filial").length;
  refs.clienteSummary.innerHTML = `
    <div class="summary-item"><strong>${total}</strong><span>Total filtrado</span></div>
    <div class="summary-item"><strong>${comSped}</strong><span>Enviam SPED</span></div>
    <div class="summary-item"><strong>${alta}</strong><span>Prioridade Alta</span></div>
    <div class="summary-item"><strong>${matrizes}</strong><span>Matrizes</span></div>
    <div class="summary-item"><strong>${filiais}</strong><span>Filiais</span></div>
  `;
}

// ── Força de Vendas ─────────────────────────────────────────────────────────

function renderForcaVendas() {
  if (!refs.fvTableBody) return;
  const rawTerm = refs.fvSearchInput ? refs.fvSearchInput.value.trim() : "";
  const term = normalizeText(rawTerm);
  const termDoc = normalizeCpfCnpj(rawTerm);
  const produtoFiltro = refs.fvProdutoFilter ? refs.fvProdutoFilter.value : "";

  if (!rawTerm && !produtoFiltro) {
    refs.fvTableBody.innerHTML = "";
    if (refs.fvEmptyState) {
      refs.fvEmptyState.textContent = "Pesquise um cliente pelo nome ou CPF/CNPJ, ou escolha um filtro de produto.";
      refs.fvEmptyState.style.display = "block";
    }
    return;
  }

  const filtered = state.clientes
    .filter((item) => {
      const matchesText = !term || normalizeText(item.nome).includes(term)
        || Boolean(termDoc && normalizeCpfCnpj(item.cpfCnpj).includes(termDoc));
      const matchesProduto =
        !produtoFiltro || produtoFiltro === "todos" ||
        (produtoFiltro === "vem" && item.vem) ||
        (produtoFiltro === "automacao" && item.automacaoVendas) ||
        (produtoFiltro === "ambos" && item.vem && item.automacaoVendas) ||
        (produtoFiltro === "nenhum" && !item.vem && !item.automacaoVendas);
      return matchesText && matchesProduto;
    })
    .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")));

  refs.fvTableBody.innerHTML = filtered.map(renderFvTableRow).join("");
  if (refs.fvEmptyState) {
    refs.fvEmptyState.textContent = "Nenhum cliente encontrado.";
    refs.fvEmptyState.style.display = filtered.length ? "none" : "block";
  }
}

function renderFvProdutoBadge(tem, licencas) {
  if (!tem) return `<span class="status fv-badge-nao">Não</span>`;
  const qtd = licencas || 0;
  return `<span class="status fv-badge-sim">Sim · ${qtd} ${qtd === 1 ? "licença" : "licenças"}</span>`;
}

function renderFvTableRow(item) {
  const obs = item.fvObservacao || "";
  return `<tr>
    <td><strong class="client-name">${escapeHtml(item.nome)}</strong></td>
    <td class="fv-doc-cell">${escapeHtml(formatCpfCnpj(item.cpfCnpj) || "—")}</td>
    <td>${renderFvProdutoBadge(item.vem, item.vemLicencas)}</td>
    <td>${renderFvProdutoBadge(item.automacaoVendas, item.automacaoVendasLicencas)}</td>
    <td>${escapeHtml(item.fvTecnico || "—")}</td>
    <td class="fv-obs-cell" title="${escapeAttribute(obs)}">${escapeHtml(obs || "—")}</td>
    <td>
      <div class="small-actions">
        <button type="button" onclick="editForcaVendas('${escapeAttribute(item.id)}')">Editar</button>
      </div>
    </td>
  </tr>`;
}

function limparFiltrosForcaVendas() {
  if (refs.fvSearchInput) refs.fvSearchInput.value = "";
  if (refs.fvProdutoFilter) refs.fvProdutoFilter.value = "";
  renderForcaVendas();
}

function onFvProdutoChange() {
  if (refs.fvVemLicencasRow) refs.fvVemLicencasRow.style.display = refs.fvVem.value === "true" ? "" : "none";
  if (refs.fvAutomacaoLicencasRow) refs.fvAutomacaoLicencasRow.style.display = refs.fvAutomacao.value === "true" ? "" : "none";
}

function populateFvTecnicoOptions(selected) {
  if (!refs.fvTecnico) return;
  const nomes = state.tecnicos.map((t) => t.nome).filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));
  // Mantém o técnico gravado mesmo que ele tenha sido removido do cadastro.
  if (selected && !nomes.some((n) => normalizeText(n) === normalizeText(selected))) nomes.unshift(selected);
  refs.fvTecnico.innerHTML = `<option value="">Não informado</option>` +
    nomes.map((n) => `<option value="${escapeAttribute(n)}"${normalizeText(n) === normalizeText(selected || "") ? " selected" : ""}>${escapeHtml(n)}</option>`).join("");
}

function editForcaVendas(id) {
  const item = state.clientes.find((c) => String(c.id) === String(id));
  if (!item || !refs.fvFormModal) return;
  refs.fvClienteId.value = item.id;
  if (refs.fvFormCliente) {
    const doc = formatCpfCnpj(item.cpfCnpj);
    refs.fvFormCliente.innerHTML = `<strong>${escapeHtml(item.nome)}</strong>${doc ? ` · ${escapeHtml(doc)}` : ""}`;
  }
  refs.fvVem.value = String(item.vem === true);
  refs.fvVemLicencas.value = item.vemLicencas || 0;
  refs.fvAutomacao.value = String(item.automacaoVendas === true);
  refs.fvAutomacaoLicencas.value = item.automacaoVendasLicencas || 0;
  populateFvTecnicoOptions(item.fvTecnico);
  refs.fvObservacao.value = item.fvObservacao || "";
  onFvProdutoChange();
  openModal(refs.fvFormModal, refs.fvVem);
}

async function saveForcaVendas(event) {
  event.preventDefault();
  const id = refs.fvClienteId.value;
  if (!id) return;
  // Sem o produto, a quantidade de licenças é zerada junto.
  const vem = refs.fvVem.value === "true";
  const automacaoVendas = refs.fvAutomacao.value === "true";
  const payload = {
    vem,
    vemLicencas: vem ? Math.max(0, parseInt(refs.fvVemLicencas.value, 10) || 0) : 0,
    automacaoVendas,
    automacaoVendasLicencas: automacaoVendas ? Math.max(0, parseInt(refs.fvAutomacaoLicencas.value, 10) || 0) : 0,
    fvTecnico: refs.fvTecnico.value,
    fvObservacao: refs.fvObservacao.value.trim(),
    updatedAt: new Date().toISOString(),
  };
  await sendData(`/api/clientes-fv/${encodeURIComponent(id)}`, "PATCH", payload);
  closeModal(refs.fvFormModal);
}

function generateForcaVendasPdf(event) {
  if (event) event.preventDefault();
  if (!refs.fvPdfArea) return;

  const conteudo = refs.fvPdfConteudo ? refs.fvPdfConteudo.value : "ambos";
  const incluirVem = conteudo !== "automacao";
  const incluirAutomacao = conteudo !== "vem";
  const incluirTecnico = Boolean(refs.fvPdfTecnico && refs.fvPdfTecnico.checked);

  // Tabela única: um cliente por linha, com as licenças de cada produto e o total.
  // O filtro escolhido define quais clientes entram e quais colunas aparecem.
  const clientes = state.clientes
    .filter((item) => (incluirVem && item.vem) || (incluirAutomacao && item.automacaoVendas))
    .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")));

  const now = new Date();
  const licencasVem = (item) => (item.vem ? item.vemLicencas || 0 : 0);
  const licencasAutomacao = (item) => (item.automacaoVendas ? item.automacaoVendasLicencas || 0 : 0);
  const totalCliente = (item) => (incluirVem ? licencasVem(item) : 0) + (incluirAutomacao ? licencasAutomacao(item) : 0);
  const celulaQtd = (temProduto, qtd) => (temProduto ? `<span class="pdf-qtd-pill">${qtd}</span>` : "—");
  const totalVem = clientes.reduce((sum, item) => sum + licencasVem(item), 0);
  const totalAutomacao = clientes.reduce((sum, item) => sum + licencasAutomacao(item), 0);
  const totalGeral = clientes.reduce((sum, item) => sum + totalCliente(item), 0);
  const mostrarTotal = incluirVem && incluirAutomacao;

  const tabela = !clientes.length
    ? `<div class="pdf-empty">Nenhum cliente encontrado.</div>`
    : `
      <table class="pdf-table pdf-table--fv">
        <thead>
          <tr>
            <th class="pdf-col-idx">#</th>
            <th>Cliente</th>
            <th>CPF/CNPJ</th>
            ${incluirTecnico ? `<th>Técnico responsável</th>` : ""}
            ${incluirVem ? `<th class="pdf-col-qtd">VEM</th>` : ""}
            ${incluirAutomacao ? `<th class="pdf-col-qtd">ATS</th>` : ""}
            ${mostrarTotal ? `<th class="pdf-col-qtd">Total</th>` : ""}
          </tr>
        </thead>
        <tbody>
          ${clientes.map((item, idx) => `<tr>
            <td class="pdf-col-idx">${idx + 1}</td>
            <td>${escapeHtml(item.nome)}</td>
            <td>${escapeHtml(formatCpfCnpj(item.cpfCnpj) || "—")}</td>
            ${incluirTecnico ? `<td>${escapeHtml(item.fvTecnico || "—")}</td>` : ""}
            ${incluirVem ? `<td class="pdf-col-qtd">${celulaQtd(item.vem, licencasVem(item))}</td>` : ""}
            ${incluirAutomacao ? `<td class="pdf-col-qtd">${celulaQtd(item.automacaoVendas, licencasAutomacao(item))}</td>` : ""}
            ${mostrarTotal ? `<td class="pdf-col-qtd"><span class="pdf-qtd-pill">${totalCliente(item)}</span></td>` : ""}
          </tr>`).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="${incluirTecnico ? 4 : 3}">Total —${clientes.length} ${clientes.length === 1 ? "cliente" : "clientes"}</td>
            ${incluirVem ? `<td class="pdf-col-qtd">${totalVem}</td>` : ""}
            ${incluirAutomacao ? `<td class="pdf-col-qtd">${totalAutomacao}</td>` : ""}
            ${mostrarTotal ? `<td class="pdf-col-qtd">${totalGeral}</td>` : ""}
          </tr>
        </tfoot>
      </table>`;

  const subtitulo = {
    ambos: "VEM e Automação de Vendas (ATS)",
    vem: "Somente clientes com VEM",
    automacao: "Somente clientes com Automação de Vendas (ATS)",
  }[conteudo] || "";

  refs.fvPdfArea.innerHTML = `
    <div class="pdf-header pdf-header--fv">
      <h1>Relatório de Força de Vendas</h1>
      <p class="pdf-subtitle">${escapeHtml(subtitulo)}</p>
      <div class="pdf-meta">Gerado em ${escapeHtml(now.toLocaleDateString("pt-BR"))} às ${escapeHtml(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))}</div>
    </div>

    <div class="pdf-section">${tabela}</div>
  `;

  closeModal(refs.fvPdfModal);

  // Paisagem só neste relatório: @page não pode depender de classe no body,
  // então a regra é injetada aqui e removida no afterprint.
  if (!document.getElementById("fvPdfPageStyle")) {
    const pageStyle = document.createElement("style");
    pageStyle.id = "fvPdfPageStyle";
    pageStyle.textContent = "@page { size: A4 landscape; }";
    document.head.appendChild(pageStyle);
  }
  document.body.classList.add("fv-pdf-print");
  window.print();
}

// ── Ciência do Financeiro (link público com retrato da Força de Vendas) ──────
// O link aponta para ciencia-fv.html?token=..., que lê e confirma pelas funções
// RPC de supabase/fv_ciencias.sql — a tabela segue fechada para a anon key.

const FV_CIENCIA_CONTEUDO_LABELS = {
  ambos: "VEM e ATS",
  vem: "Somente VEM",
  automacao: "Somente ATS",
};

function toFvCienciaJs(row) {
  return {
    id: row.id,
    token: row.token,
    conteudo: row.conteudo || "ambos",
    clientes: Array.isArray(row.clientes) ? row.clientes : [],
    criadoEm: row.criado_em,
    criadoPor: row.criado_por || "",
    confirmadoEm: row.confirmado_em || null,
    confirmadoPor: row.confirmado_por || "",
  };
}

async function loadFvCiencias() {
  const { data, error } = await db.from("fv_ciencias").select("*").order("criado_em", { ascending: false });
  // Tabela ainda não criada (supabase/fv_ciencias.sql): a página funciona sem o histórico.
  state.fvCiencias = error ? [] : data.map(toFvCienciaJs);
}

// Mesmo critério de generateForcaVendasPdf: entra quem tem ao menos um dos produtos do conteúdo.
function buildFvCienciaSnapshot(conteudo) {
  const incluirVem = conteudo !== "automacao";
  const incluirAutomacao = conteudo !== "vem";
  return state.clientes
    .filter((item) => (incluirVem && item.vem) || (incluirAutomacao && item.automacaoVendas))
    .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")))
    .map((item) => ({
      nome: item.nome || "",
      cpfCnpj: formatCpfCnpj(item.cpfCnpj) || "",
      vem: incluirVem && item.vem ? item.vemLicencas || 0 : null,
      automacao: incluirAutomacao && item.automacaoVendas ? item.automacaoVendasLicencas || 0 : null,
    }));
}

// Campo a campo: o jsonb do banco não preserva a ordem das chaves, então JSON.stringify não serve.
function fvCienciaSnapshotIgual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((x, i) => {
    const y = b[i] || {};
    return x.nome === y.nome && x.cpfCnpj === y.cpfCnpj
      && (x.vem ?? null) === (y.vem ?? null) && (x.automacao ?? null) === (y.automacao ?? null);
  });
}

function fvCienciaTotais(clientes) {
  return clientes.reduce((acc, c) => acc + (c.vem || 0) + (c.automacao || 0), 0);
}

function fvCienciaUrl(token) {
  return new URL(`ciencia-fv.html?token=${encodeURIComponent(token)}`, window.location.href).href;
}

function createFvCienciaToken() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function formatFvCienciaDataHora(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

function renderFvCiencias() {
  if (!refs.fvCienciaTableBody) return;
  const items = state.fvCiencias || [];
  const podeEscrever = Boolean(window.auth && window.auth.can("write"));

  refs.fvCienciaTableBody.innerHTML = items.map((item) => {
    const qtdClientes = item.clientes.length;
    const licencas = fvCienciaTotais(item.clientes);
    // Retrato diferente da lista atual: avisa que vale gerar um link novo.
    const desatualizado = !fvCienciaSnapshotIgual(buildFvCienciaSnapshot(item.conteudo), item.clientes);
    // Ciência individual: a situação do link é a soma das confirmações de cada cliente.
    const cientes = item.clientes.filter((c) => c.confirmadoEm).length;
    const comObservacao = item.clientes.filter((c) => c.confirmadoEm && c.observacao).length;
    const badge = cientes === qtdClientes
      ? `<span class="status status-concluido">Ciente</span>`
      : cientes
        ? `<span class="status status-em-andamento">Parcial</span>`
        : `<span class="status status-pendente">Aguardando</span>`;
    const situacao = `${badge}<small>${cientes} de ${qtdClientes} ${qtdClientes === 1 ? "cliente" : "clientes"}</small>
      ${comObservacao ? `<small class="fv-ciencia-alerta">${comObservacao} com observação</small>` : ""}`;
    const id = escapeAttribute(item.id);
    return `<tr>
      <td>${escapeHtml(formatFvCienciaDataHora(item.criadoEm))}${item.criadoPor ? `<small>por ${escapeHtml(item.criadoPor)}</small>` : ""}</td>
      <td>${escapeHtml(FV_CIENCIA_CONTEUDO_LABELS[item.conteudo] || item.conteudo)}</td>
      <td>${qtdClientes} ${qtdClientes === 1 ? "cliente" : "clientes"} · ${licencas} ${licencas === 1 ? "licença" : "licenças"}
        ${desatualizado ? `<small class="fv-ciencia-alerta">Dados alterados desde o envio</small>` : ""}</td>
      <td>${situacao}</td>
      <td>
        <div class="small-actions">
          <button type="button" onclick="verFvCienciaDetalhe('${id}')">Ver clientes</button>
          <button type="button" class="ghost" onclick="copyFvCienciaLinkById('${id}', this)">Copiar link</button>
          <a class="button-link" href="${escapeAttribute(fvCienciaUrl(item.token))}" target="_blank" rel="noopener">Abrir</a>
          ${podeEscrever ? `<button type="button" class="danger" onclick="deleteFvCiencia('${id}')">Excluir</button>` : ""}
        </div>
      </td>
    </tr>`;
  }).join("");

  if (refs.fvCienciaEmptyState) refs.fvCienciaEmptyState.style.display = items.length ? "none" : "block";
}

function verFvCienciaDetalhe(id) {
  const item = (state.fvCiencias || []).find((c) => String(c.id) === String(id));
  if (!item || !refs.fvCienciaDetalheModal) return;
  const incluirVem = item.conteudo !== "automacao";
  const incluirAutomacao = item.conteudo !== "vem";
  const qtd = (valor) => (valor === null || valor === undefined ? "—" : valor);
  const cientes = item.clientes.filter((c) => c.confirmadoEm).length;

  refs.fvCienciaDetalheInfo.textContent =
    `Link gerado em ${formatFvCienciaDataHora(item.criadoEm)} · ${cientes} de ${item.clientes.length} clientes cientes`;
  refs.fvCienciaDetalheBody.innerHTML = `
    <table class="fv-ciencia-detalhe">
      <thead>
        <tr>
          <th>Cliente</th>
          ${incluirVem ? `<th>VEM</th>` : ""}
          ${incluirAutomacao ? `<th>ATS</th>` : ""}
          <th>Ciência</th>
          <th>Observação</th>
        </tr>
      </thead>
      <tbody>
        ${item.clientes.map((c) => `<tr>
          <td><strong>${escapeHtml(c.nome)}</strong>${c.cpfCnpj ? `<small>${escapeHtml(c.cpfCnpj)}</small>` : ""}</td>
          ${incluirVem ? `<td>${qtd(c.vem)}</td>` : ""}
          ${incluirAutomacao ? `<td>${qtd(c.automacao)}</td>` : ""}
          <td>${c.confirmadoEm
            ? `<span class="status status-concluido">Ciente</span><small>${escapeHtml(c.confirmadoPor || "")} · ${escapeHtml(formatFvCienciaDataHora(c.confirmadoEm))}</small>`
            : `<span class="status status-pendente">Aguardando</span>`}</td>
          <td>${escapeHtml(c.observacao || "—")}</td>
        </tr>`).join("")}
      </tbody>
    </table>`;
  openModal(refs.fvCienciaDetalheModal);
}

function openFvCienciaModal() {
  if (refs.fvCienciaForm) refs.fvCienciaForm.hidden = false;
  if (refs.fvCienciaResultado) refs.fvCienciaResultado.hidden = true;
  if (refs.fvCienciaConteudo) refs.fvCienciaConteudo.value = "ambos";
  openModal(refs.fvCienciaModal, refs.fvCienciaConteudo);
}

async function saveFvCiencia(event) {
  event.preventDefault();
  const conteudo = refs.fvCienciaConteudo ? refs.fvCienciaConteudo.value : "ambos";
  const clientes = buildFvCienciaSnapshot(conteudo);
  if (!clientes.length) {
    alert("Nenhum cliente com o produto escolhido. Não há o que enviar ao Financeiro.");
    return;
  }
  const perfil = window.auth && window.auth.perfil;
  const payload = {
    id: createId(),
    token: createFvCienciaToken(),
    conteudo,
    clientes,
    criadoPor: (perfil && perfil.nome) || (window.auth && window.auth.user && window.auth.user.email) || "",
  };
  await sendData("/api/fv-ciencias", "POST", payload);
  await loadFvCiencias();
  renderFvCiencias();

  refs.fvCienciaLink.value = fvCienciaUrl(payload.token);
  refs.fvCienciaForm.hidden = true;
  refs.fvCienciaResultado.hidden = false;
  refs.fvCienciaLink.select();
}

async function copyFvCienciaLink(url, button) {
  try {
    await navigator.clipboard.writeText(url);
  } catch (_) {
    // Sem permissão de clipboard (ex.: arquivo aberto direto no browser): mostra para copiar à mão.
    prompt("Copie o link:", url);
    return;
  }
  if (button) {
    const texto = button.textContent;
    button.textContent = "Copiado!";
    setTimeout(() => { button.textContent = texto; }, 1500);
  }
}

function copyFvCienciaLinkById(id, button) {
  const item = (state.fvCiencias || []).find((c) => String(c.id) === String(id));
  if (item) copyFvCienciaLink(fvCienciaUrl(item.token), button);
}

async function deleteFvCiencia(id) {
  if (!confirm("Excluir este link? Quem tiver o link não conseguirá mais abri-lo, e o registro de ciência será apagado.")) return;
  await deleteData(`/api/fv-ciencias/${encodeURIComponent(id)}`);
  await loadFvCiencias();
  renderFvCiencias();
}

// ── Escala dos técnicos (escala.html) ───────────────────────────────────────
// Revezamento semanal: cada equipe tem um horário-base e, a cada semana depois
// da semana de referência, avança um horário (com dois horários, alterna).
// Equipe "fixa" (ex.: Equipe C) fica sempre no seu horário, que sai do
// revezamento; as demais giram só entre os horários restantes.
// Horário efetivo de uma equipe que reveza numa semana =
//   base + semanas desde a referência + inversões permanentes até a semana
//   + 1 se a semana tiver inversão só dela   (módulo nº de horários rotativos)
// Inversões e exceções por técnico ficam em escala_excecoes, então mudar o
// revezamento "daqui pra frente" não reescreve as semanas passadas.

const ESCALA_DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const ESCALA_SEMANA_MS = 7 * 24 * 60 * 60 * 1000;
const ESCALA_SEMANAS_PROXIMAS = 8;

function escalaConfigPadrao() {
  return {
    turnos: [
      { id: "t1", nome: "Horário 1", periodos: [{ inicio: "08:00", fim: "11:00" }, { inicio: "13:00", fim: "18:00" }] },
      { id: "t2", nome: "Horário 2", periodos: [{ inicio: "09:00", fim: "13:00" }, { inicio: "15:00", fim: "19:00" }] },
      { id: "t3", nome: "Horário 3", periodos: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
    ],
    equipes: [
      { id: "e1", nome: "Equipe A", turnoReferenciaId: "t1", tecnicos: [] },
      { id: "e2", nome: "Equipe B", turnoReferenciaId: "t2", tecnicos: [] },
      { id: "e3", nome: "Equipe C", turnoReferenciaId: "t3", fixo: true, tecnicos: [] },
    ],
    semanaReferencia: escalaFormatDate(escalaSegunda(escalaHoje())),
    salvo: false,
  };
}

// Datas sempre ao meio-dia local: somar dias nunca cai no dia errado por fuso/horário de verão.
function escalaParseDate(stored) {
  if (!stored || stored.length !== 10 || stored[2] !== "/" || stored[5] !== "/") return null;
  const [d, m, y] = stored.split("/").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d, 12);
}

function escalaFormatDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

function escalaFormatCurto(date) {
  return escalaFormatDate(date).slice(0, 5);
}

function escalaHoje() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}

function escalaSegunda(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function escalaAddDias(date, dias) {
  const d = new Date(date);
  d.setDate(d.getDate() + dias);
  return d;
}

function escalaSemanasEntre(a, b) {
  return Math.round((escalaSegunda(b) - escalaSegunda(a)) / ESCALA_SEMANA_MS);
}

function escalaMesmoDia(a, b) {
  return a && b && escalaFormatDate(a) === escalaFormatDate(b);
}

function escalaHorasTexto(turno) {
  return ((turno && turno.periodos) || [])
    .filter((p) => p.inicio && p.fim)
    .map((p) => `${p.inicio}–${p.fim}`)
    .join(" · ");
}

function toEscalaExcecaoJs(row) {
  return {
    id: row.id,
    tipo: row.tipo,
    dataInicio: row.data_inicio || "",
    dataFim: row.data_fim || row.data_inicio || "",
    tecnico: row.tecnico || "",
    turnoId: row.turno_id || "",
    motivo: row.motivo || "",
    createdAt: row.created_at,
  };
}

async function loadEscala() {
  const [cfgRes, excRes] = await Promise.all([
    db.from("escala_config").select("*").eq("id", "principal").maybeSingle(),
    db.from("escala_excecoes").select("*").order("created_at", { ascending: true }),
  ]);
  // Tabelas ainda não criadas (supabase/escala.sql): mostra o padrão e avisa.
  state.escalaErro = Boolean(cfgRes.error || excRes.error);
  const row = !cfgRes.error ? cfgRes.data : null;
  const padrao = escalaConfigPadrao();
  state.escala = row && Array.isArray(row.turnos) && row.turnos.length
    ? {
      turnos: row.turnos,
      equipes: Array.isArray(row.equipes) ? row.equipes.map((eq) => ({
        ...eq,
        // Equipe C salva antes de existir a opção "fixa": ela é sempre fixa no Horário 3.
        fixo: eq.fixo === undefined ? eq.id === "e3" : Boolean(eq.fixo),
        tecnicos: Array.isArray(eq.tecnicos) ? eq.tecnicos : [],
      })) : [],
      ajustePendente: Array.isArray(row.equipes) && row.equipes.some((eq) => eq.id === "e3" && eq.fixo === undefined),
      semanaReferencia: escalaParseDate(row.semana_referencia) ? row.semana_referencia : padrao.semanaReferencia,
      salvo: true,
    }
    : padrao;
  state.escalaExcecoes = excRes.error ? [] : excRes.data.map(toEscalaExcecaoJs);
  if (!state.escalaSemana) state.escalaSemana = escalaSegunda(escalaHoje());
}

function escalaInversoesPermanentesAte(segunda) {
  return state.escalaExcecoes.filter((e) => {
    const d = e.tipo === "inverter_daqui" && escalaParseDate(e.dataInicio);
    return d && d <= segunda;
  }).length;
}

function escalaInversaoDaSemana(segunda, tipo = "inverter") {
  const chave = escalaFormatDate(segunda);
  return state.escalaExcecoes.find((e) => e.tipo === tipo && e.dataInicio === chave) || null;
}

function escalaMod(valor, n) {
  return ((valor % n) + n) % n;
}

// Índices dos horários que entram no revezamento: todos, menos os que são de
// uma equipe fixa (ex.: Equipe C sempre no Horário 3).
function escalaTurnosRotativos(cfg) {
  const fixos = new Set(cfg.equipes.filter((eq) => eq.fixo).map((eq) => eq.turnoReferenciaId));
  return cfg.turnos.map((t, i) => i).filter((i) => !fixos.has(cfg.turnos[i].id));
}

// Horário (índice em cfg.turnos) da equipe após `deslocamento` passos de revezamento.
// Equipe fixa fica sempre no seu horário; as demais giram só entre os rotativos.
function escalaIndiceNaConfig(cfg, equipe, deslocamento) {
  const idx = cfg.turnos.findIndex((t) => t.id === equipe.turnoReferenciaId);
  if (equipe.fixo) return idx;
  const rot = escalaTurnosRotativos(cfg);
  if (!rot.length) return -1;
  let pos = rot.indexOf(idx);
  if (pos < 0) pos = Math.max(0, cfg.equipes.filter((eq) => !eq.fixo).indexOf(equipe));
  return rot[escalaMod(pos + deslocamento, rot.length)];
}

function escalaDeslocamento(segunda, incluirInversaoDaSemana = true) {
  const ref = escalaParseDate(state.escala.semanaReferencia) || segunda;
  return escalaSemanasEntre(ref, segunda)
    + escalaInversoesPermanentesAte(segunda)
    + (incluirInversaoDaSemana && escalaInversaoDaSemana(segunda) ? 1 : 0);
}

function escalaIndiceTurnoEquipe(equipe, segunda) {
  if (!state.escala.turnos.length) return -1;
  return escalaIndiceNaConfig(state.escala, equipe, escalaDeslocamento(segunda));
}

function escalaEquipeDoTecnico(nome) {
  const alvo = normalizeText(nome);
  return state.escala.equipes.find((eq) => eq.tecnicos.some((t) => normalizeText(t) === alvo)) || null;
}

// Exceção de técnico que vale no dia; se houver mais de uma, vale a mais recente.
function escalaExcecaoTecnicoNoDia(nome, dia) {
  const alvo = normalizeText(nome);
  let achada = null;
  state.escalaExcecoes.forEach((e) => {
    if (e.tipo !== "tecnico" || normalizeText(e.tecnico) !== alvo) return;
    const ini = escalaParseDate(e.dataInicio);
    const fim = escalaParseDate(e.dataFim) || ini;
    if (ini && dia >= ini && dia <= fim) achada = e;
  });
  return achada;
}

// Onde o técnico está num dia: { turno (null = folga/ausente ou sem equipe), indice, excecao, equipe }
function escalaTecnicoNoDia(nome, dia) {
  const { turnos } = state.escala;
  const equipe = escalaEquipeDoTecnico(nome);
  const excecao = escalaExcecaoTecnicoNoDia(nome, dia);
  if (excecao) {
    const indice = turnos.findIndex((t) => t.id === excecao.turnoId);
    return { turno: turnos[indice] || null, indice, excecao, equipe };
  }
  if (!equipe) return { turno: null, indice: -1, excecao: null, equipe: null };
  const indice = escalaIndiceTurnoEquipe(equipe, escalaSegunda(dia));
  return { turno: turnos[indice] || null, indice, excecao: null, equipe };
}

function escalaNomesOrdenados(nomes) {
  return nomes.slice().sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

// Técnicos que aparecem na semana: os das equipes (na ordem das equipes) e
// quem não tem equipe mas tem exceção caindo nesses dias.
function escalaTecnicosDaSemana(segunda) {
  const lista = [];
  const vistos = new Set();
  const incluir = (nome) => {
    const chave = normalizeText(nome);
    if (!chave || vistos.has(chave)) return;
    vistos.add(chave);
    lista.push(nome);
  };
  state.escala.equipes.forEach((eq) => escalaNomesOrdenados(eq.tecnicos).forEach(incluir));
  const sexta = escalaAddDias(segunda, ESCALA_DIAS_SEMANA.length - 1);
  state.escalaExcecoes.forEach((e) => {
    if (e.tipo !== "tecnico") return;
    const ini = escalaParseDate(e.dataInicio);
    const fim = escalaParseDate(e.dataFim) || ini;
    if (ini && ini <= sexta && fim >= segunda) incluir(e.tecnico);
  });
  return lista;
}

function escalaDiasDaSemana(segunda) {
  return ESCALA_DIAS_SEMANA.map((rotulo, i) => ({ rotulo, data: escalaAddDias(segunda, i) }));
}

function escalaChip(turno, indice) {
  return turno
    ? `<span class="escala-chip escala-chip--${escalaMod(indice, 4)}">${escapeHtml(turno.nome)}</span>`
    : `<span class="escala-chip escala-chip--folga">Folga / ausente</span>`;
}

function escalaPodeEscrever() {
  return Boolean(window.auth && window.auth.can("write"));
}

function renderEscala() {
  if (!refs.escalaTurnosGrid || !state.escala) return;
  renderEscalaSemana();
  renderEscalaProximas();
  renderEscalaExcecoes();
  renderEscalaConfigResumo();
}

function renderEscalaSemana() {
  const segunda = state.escalaSemana;
  const dias = escalaDiasDaSemana(segunda);
  const sexta = dias[dias.length - 1].data;
  const hoje = escalaHoje();
  const { turnos, equipes } = state.escala;
  const ehEstaSemana = escalaMesmoDia(segunda, escalaSegunda(hoje));

  refs.escalaWeekLabel.textContent = `${escalaFormatCurto(segunda)} a ${escalaFormatDate(sexta)}${ehEstaSemana ? " · esta semana" : ""}`;

  const avisos = [];
  if (state.escalaErro) {
    avisos.push("Não foi possível carregar a escala do banco. Rode supabase/escala.sql no SQL Editor do Supabase.");
  } else if (!state.escala.salvo) {
    avisos.push("Escala ainda não configurada: mostrando os horários padrão. Use \"Configurar escala\" para montar as equipes.");
  }
  const inversaoSemana = escalaInversaoDaSemana(segunda);
  const inversaoDaqui = escalaInversaoDaSemana(segunda, "inverter_daqui");
  if (inversaoSemana) avisos.push("Equipes invertidas só nesta semana.");
  if (inversaoDaqui) avisos.push("O revezamento foi invertido a partir desta semana.");
  refs.escalaWeekInfo.textContent = avisos.join(" ");
  refs.escalaWeekInfo.hidden = !avisos.length;

  if (refs.escalaInverterSemanaBtn) {
    refs.escalaInverterSemanaBtn.textContent = inversaoSemana ? "Desfazer inversão da semana" : "Inverter só esta semana";
  }
  if (refs.escalaInverterDaquiBtn) {
    refs.escalaInverterDaquiBtn.textContent = inversaoDaqui ? "Desfazer inversão a partir desta semana" : "Inverter a partir desta semana";
  }

  const tecnicos = escalaTecnicosDaSemana(segunda);
  // Grade técnico × dia, calculada uma vez e usada nos cards.
  const grade = tecnicos.map((nome) => ({
    nome,
    equipe: escalaEquipeDoTecnico(nome),
    dias: dias.map((d) => escalaTecnicoNoDia(nome, d.data)),
  }));

  // Cards por horário: equipe da semana, seus técnicos e quem entra/sai por exceção.
  refs.escalaTurnosGrid.innerHTML = turnos.map((turno, i) => {
    const equipesNoTurno = equipes.filter((eq) => escalaIndiceTurnoEquipe(eq, segunda) === i);
    const itens = [];
    grade.forEach((linha) => {
      const regular = linha.equipe && escalaIndiceTurnoEquipe(linha.equipe, segunda) === i;
      const diasFora = linha.dias.map((d, j) => ({ d, j })).filter(({ d }) => d.indice !== i);
      const diasDentro = linha.dias.map((d, j) => ({ d, j })).filter(({ d }) => d.indice === i);
      if (regular) {
        const notas = diasFora.map(({ d, j }) => `${dias[j].rotulo} ${escalaFormatCurto(dias[j].data)}: ${d.turno ? d.turno.nome : "folga/ausente"}`);
        itens.push(`<li>${escapeHtml(linha.nome)}${notas.length ? `<small class="escala-nota">${escapeHtml(notas.join(" · "))}</small>` : ""}</li>`);
      } else if (diasDentro.length) {
        const quando = diasDentro.length === dias.length ? "a semana toda" : diasDentro.map(({ j }) => `${dias[j].rotulo} ${escalaFormatCurto(dias[j].data)}`).join(", ");
        itens.push(`<li class="escala-extra">+ ${escapeHtml(linha.nome)}<small class="escala-nota">${escapeHtml(quando)}</small></li>`);
      }
    });
    return `<article class="escala-turno escala-turno--${escalaMod(i, 4)}">
      <div class="escala-turno-head">
        <h3>${escapeHtml(turno.nome)}</h3>
        <span class="escala-horas">${escapeHtml(escalaHorasTexto(turno))}</span>
      </div>
      <p class="escala-turno-equipe">${equipesNoTurno.length ? escapeHtml(equipesNoTurno.map((eq) => eq.nome).join(", ")) : "Nenhuma equipe"}</p>
      ${itens.length ? `<ul class="escala-turno-lista">${itens.join("")}</ul>` : `<p class="escala-vazio">Nenhum técnico.</p>`}
    </article>`;
  }).join("");
}

function renderEscalaProximas() {
  if (!refs.escalaProximasTable) return;
  const { turnos, equipes } = state.escala;
  const inicio = escalaSegunda(escalaHoje());
  const semanas = Array.from({ length: ESCALA_SEMANAS_PROXIMAS }, (_, i) => escalaAddDias(inicio, i * 7));
  refs.escalaProximasTable.innerHTML = `
    <thead>
      <tr>
        <th>Semana</th>
        ${equipes.map((eq) => `<th>${escapeHtml(eq.nome)}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${semanas.map((segunda) => {
        const invertida = escalaInversaoDaSemana(segunda);
        const selecionada = escalaMesmoDia(segunda, state.escalaSemana);
        return `<tr class="escala-clicavel${selecionada ? " escala-row-atual" : ""}" data-escala-semana="${escalaFormatDate(segunda)}" title="Ver esta semana">
          <td><strong>${escalaFormatCurto(segunda)} a ${escalaFormatCurto(escalaAddDias(segunda, ESCALA_DIAS_SEMANA.length - 1))}</strong>
            ${invertida ? `<small class="escala-nota">Invertida só nesta semana</small>` : ""}</td>
          ${equipes.map((eq) => {
            const i = escalaIndiceTurnoEquipe(eq, segunda);
            return `<td>${escalaChip(turnos[i], i)}<small>${escapeHtml(escalaHorasTexto(turnos[i]))}</small></td>`;
          }).join("")}
        </tr>`;
      }).join("")}
    </tbody>`;
}

function escalaPeriodoTexto(e) {
  if (e.tipo === "inverter") return `Semana de ${e.dataInicio}`;
  if (e.tipo === "inverter_daqui") return `A partir de ${e.dataInicio}`;
  return e.dataFim && e.dataFim !== e.dataInicio ? `${e.dataInicio} a ${e.dataFim}` : e.dataInicio;
}

const ESCALA_TIPO_LABELS = {
  inverter: "Inversão só da semana",
  inverter_daqui: "Inversão daqui em diante",
  tecnico: "Técnico",
};

function renderEscalaExcecoes() {
  if (!refs.escalaExcecoesBody) return;
  const hoje = escalaHoje();
  const segundaAtual = escalaSegunda(hoje);
  const mostrarPassadas = refs.escalaMostrarPassadas && refs.escalaMostrarPassadas.checked;
  const podeEscrever = escalaPodeEscrever();
  const items = state.escalaExcecoes
    .filter((e) => {
      if (mostrarPassadas || e.tipo === "inverter_daqui") return true;
      const fim = escalaParseDate(e.dataFim) || escalaParseDate(e.dataInicio);
      if (!fim) return true;
      return e.tipo === "inverter" ? fim >= segundaAtual : fim >= hoje;
    })
    .sort((a, b) => (escalaParseDate(a.dataInicio) || 0) - (escalaParseDate(b.dataInicio) || 0));

  refs.escalaExcecoesBody.innerHTML = items.map((e) => {
    const indice = state.escala.turnos.findIndex((t) => t.id === e.turnoId);
    const turno = state.escala.turnos[indice];
    return `<tr>
      <td>${escapeHtml(escalaPeriodoTexto(e))}</td>
      <td>${escapeHtml(ESCALA_TIPO_LABELS[e.tipo] || e.tipo)}</td>
      <td>${e.tipo === "tecnico" ? escapeHtml(e.tecnico) : "Todas as equipes"}</td>
      <td>${e.tipo === "tecnico" ? `${escalaChip(turno, indice)}${turno ? `<small>${escapeHtml(escalaHorasTexto(turno))}</small>` : ""}` : "—"}</td>
      <td>${escapeHtml(e.motivo || "—")}</td>
      <td>${podeEscrever ? `<button type="button" class="danger" onclick="deleteEscalaExcecao('${escapeAttribute(e.id)}')">Excluir</button>` : ""}</td>
    </tr>`;
  }).join("");
  if (refs.escalaExcecoesEmpty) {
    refs.escalaExcecoesEmpty.style.display = items.length ? "none" : "block";
    refs.escalaExcecoesEmpty.textContent = state.escalaExcecoes.length && !items.length
      ? "Nenhuma exceção a partir de hoje."
      : "Nenhuma exceção cadastrada.";
  }
}

function renderEscalaConfigResumo() {
  if (!refs.escalaConfigResumo) return;
  const { turnos, equipes } = state.escala;
  const segundaAtual = escalaSegunda(escalaHoje());
  refs.escalaConfigResumo.innerHTML = `
    <div class="escala-resumo-bloco">
      <p class="form-section-title">Horários</p>
      ${turnos.map((t, i) => `<p>${escalaChip(t, i)} <span>${escapeHtml(escalaHorasTexto(t))}</span></p>`).join("")}
    </div>
    <div class="escala-resumo-bloco">
      <p class="form-section-title">Equipes</p>
      ${equipes.map((eq) => {
        const i = escalaIndiceTurnoEquipe(eq, segundaAtual);
        return `<p><strong>${escapeHtml(eq.nome)}</strong> — esta semana no ${escapeHtml(turnos[i] ? turnos[i].nome : "—")}
          <small>${eq.tecnicos.length ? escapeHtml(escalaNomesOrdenados(eq.tecnicos).join(", ")) : "Nenhum técnico"}</small></p>`;
      }).join("")}
    </div>`;
}

function moveEscalaSemana(delta) {
  state.escalaSemana = delta === 0
    ? escalaSegunda(escalaHoje())
    : escalaAddDias(state.escalaSemana, delta * 7);
  renderEscala();
}

function onEscalaProximasClick(event) {
  const row = event.target.closest("tr[data-escala-semana]");
  const segunda = row && escalaParseDate(row.getAttribute("data-escala-semana"));
  if (!segunda) return;
  state.escalaSemana = segunda;
  renderEscala();
  if (refs.escalaWeekLabel) refs.escalaWeekLabel.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function reloadEscala() {
  await loadEscala();
  renderEscala();
}

// Enquanto a configuração não foi salva, a semana de referência padrão é "esta
// semana" e andaria junto com o calendário: grava antes de registrar inversões.
async function escalaGarantirConfigSalva() {
  if (state.escala.salvo) return;
  const { turnos, equipes, semanaReferencia } = state.escala;
  await sendData("/api/escala-config", "PUT", { turnos, equipes, semanaReferencia });
}

async function toggleEscalaInversaoSemana() {
  const segunda = state.escalaSemana;
  const existente = escalaInversaoDaSemana(segunda);
  if (existente) {
    if (!confirm(`Desfazer a inversão da semana de ${escalaFormatDate(segunda)}?`)) return;
    await deleteData(`/api/escala-excecoes/${encodeURIComponent(existente.id)}`);
  } else {
    if (!confirm(`Inverter as equipes só na semana de ${escalaFormatDate(segunda)}? As outras semanas continuam como estão.`)) return;
    await escalaGarantirConfigSalva();
    const data = escalaFormatDate(segunda);
    await sendData("/api/escala-excecoes", "POST", { id: createId(), tipo: "inverter", dataInicio: data, dataFim: data });
  }
  await reloadEscala();
}

async function inverterEscalaDaqui() {
  const segunda = state.escalaSemana;
  const data = escalaFormatDate(segunda);
  const existente = escalaInversaoDaSemana(segunda, "inverter_daqui");
  if (existente) {
    if (!confirm(`Desfazer a inversão feita a partir da semana de ${data}? As semanas seguintes voltam ao revezamento anterior.`)) return;
    await deleteData(`/api/escala-excecoes/${encodeURIComponent(existente.id)}`);
    await reloadEscala();
    return;
  }
  const soDaSemana = escalaInversaoDaSemana(segunda);
  const msg = `As equipes trocam de horário a partir da semana de ${data} e o revezamento continua daí em diante. As semanas anteriores não mudam.`
    + (soDaSemana ? "\n\nEsta semana já tinha uma inversão só dela, que será removida." : "")
    + "\n\nConfirmar?";
  if (!confirm(msg)) return;
  await escalaGarantirConfigSalva();
  if (soDaSemana) await deleteData(`/api/escala-excecoes/${encodeURIComponent(soDaSemana.id)}`);
  await sendData("/api/escala-excecoes", "POST", { id: createId(), tipo: "inverter_daqui", dataInicio: data, dataFim: data });
  await reloadEscala();
}

function escalaTodosTecnicos() {
  const nomes = new Map();
  (state.tecnicos || []).forEach((t) => { if (t.nome) nomes.set(normalizeText(t.nome), t.nome); });
  state.escala.equipes.forEach((eq) => eq.tecnicos.forEach((nome) => {
    if (!nomes.has(normalizeText(nome))) nomes.set(normalizeText(nome), nome);
  }));
  return escalaNomesOrdenados([...nomes.values()]);
}

// Configuração salva antes de existir um horário/equipe do padrão (ex.: o
// Horário 3 / Equipe C): acrescenta o que falta, para aparecer no modal.
function escalaConfigComPadroes(cfg) {
  const padrao = escalaConfigPadrao();
  const turnos = cfg.turnos.slice();
  const equipes = cfg.equipes.slice();
  let adicionados = false;
  padrao.turnos.forEach((t) => {
    if (!turnos.some((x) => x.id === t.id)) { turnos.push(t); adicionados = true; }
  });
  padrao.equipes.forEach((eq) => {
    if (!equipes.some((x) => x.id === eq.id)) { equipes.push(eq); adicionados = true; }
  });
  return { turnos, equipes, adicionados };
}

function openEscalaConfigModal() {
  const rascunho = escalaConfigComPadroes(state.escala);
  state.escalaRascunho = rascunho;
  const { turnos, equipes } = rascunho;
  const segundaAtual = escalaSegunda(escalaHoje());
  // Com horário/equipe novos, o revezamento muda de tamanho: usa esta semana como
  // referência e mantém nela o horário atual das equipes que já existiam.
  const ajustarAoAtual = (rascunho.adicionados || state.escala.ajustePendente) && state.escala.salvo;
  const ref = ajustarAoAtual
    ? segundaAtual
    : escalaParseDate(state.escala.semanaReferencia) || segundaAtual;
  const permAteRef = escalaInversoesPermanentesAte(ref);

  refs.escalaConfigTurnos.innerHTML = turnos.map((t, i) => {
    const p = t.periodos || [];
    const campo = (nome, valor, rotulo, tipo = "time") => `
      <div>
        <label for="escalaTurno${i}${nome}">${rotulo}</label>
        <input id="escalaTurno${i}${nome}" type="${tipo}" data-turno="${i}" data-campo="${nome}" value="${escapeAttribute(valor || "")}" />
      </div>`;
    return `<div class="escala-turno-fields">
      ${campo("nome", t.nome, "Nome", "text")}
      ${campo("inicio1", p[0] && p[0].inicio, "Entrada")}
      ${campo("fim1", p[0] && p[0].fim, "Saída (intervalo)")}
      ${campo("inicio2", p[1] && p[1].inicio, "Retorno")}
      ${campo("fim2", p[1] && p[1].fim, "Saída")}
    </div>`;
  }).join("");

  refs.escalaSemanaReferencia.value = storageToInputDate(escalaFormatDate(ref));

  refs.escalaConfigEquipes.innerHTML = equipes.map((eq, i) => {
    // Mostra o horário efetivo da equipe na semana de referência (sem inversão só da semana).
    const existente = state.escala.equipes.includes(eq);
    const efetivo = existente && ajustarAoAtual
      ? escalaIndiceNaConfig(state.escala, eq, escalaDeslocamento(segundaAtual, false))
      : escalaIndiceNaConfig(rascunho, eq, permAteRef);
    return `<div class="escala-equipe-fields">
      <div>
        <label for="escalaEquipe${i}Nome">Nome da equipe</label>
        <input id="escalaEquipe${i}Nome" data-equipe="${i}" data-campo="nome" value="${escapeAttribute(eq.nome)}" />
      </div>
      <div>
        <label for="escalaEquipe${i}Turno">Horário (na semana de referência)</label>
        <select id="escalaEquipe${i}Turno" data-equipe="${i}" data-campo="turno">
          ${turnos.map((t, j) => `<option value="${j}"${j === efetivo ? " selected" : ""}>${escapeHtml(t.nome)} (${escapeHtml(escalaHorasTexto(t))})</option>`).join("")}
        </select>
      </div>
      <div>
        <label for="escalaEquipe${i}Fixo">Revezamento</label>
        <select id="escalaEquipe${i}Fixo" data-equipe="${i}" data-campo="fixo">
          <option value="reveza"${eq.fixo ? "" : " selected"}>Reveza toda semana</option>
          <option value="fixo"${eq.fixo ? " selected" : ""}>Fixa neste horário</option>
        </select>
      </div>
    </div>`;
  }).join("");

  const tecnicos = escalaTodosTecnicos();
  refs.escalaConfigTecnicos.innerHTML = tecnicos.length
    ? tecnicos.map((nome, i) => {
      const equipe = escalaEquipeDoTecnico(nome);
      const atual = equipe ? equipes.indexOf(equipe) : -1;
      return `<div class="escala-tecnico-row">
        <label for="escalaTecnico${i}">${escapeHtml(nome)}</label>
        <select id="escalaTecnico${i}" data-tecnico-nome="${escapeAttribute(nome)}">
          <option value="">Sem equipe</option>
          ${equipes.map((eq, j) => `<option value="${j}"${j === atual ? " selected" : ""}>${escapeHtml(eq.nome)}</option>`).join("")}
        </select>
      </div>`;
    }).join("")
    : `<p class="helper-text">Nenhum técnico cadastrado. Cadastre os técnicos em Setup.</p>`;

  openModal(refs.escalaConfigModal);
}

async function saveEscalaConfig(event) {
  event.preventDefault();
  const form = refs.escalaConfigForm;
  const cfg = state.escalaRascunho || state.escala;
  const valor = (seletor) => {
    const el = form.querySelector(seletor);
    return el ? el.value.trim() : "";
  };

  const turnos = [];
  for (let i = 0; i < cfg.turnos.length; i++) {
    const t = cfg.turnos[i];
    const get = (campo) => valor(`[data-turno="${i}"][data-campo="${campo}"]`);
    const nome = get("nome") || t.nome;
    const periodos = [];
    for (const [ini, fim] of [["inicio1", "fim1"], ["inicio2", "fim2"]]) {
      const inicio = get(ini);
      const final = get(fim);
      if (!inicio && !final) continue;
      if (!inicio || !final || final <= inicio) {
        alert(`Confira os horários de "${nome}": cada período precisa de início e fim, e o fim deve ser depois do início.`);
        return;
      }
      periodos.push({ inicio, fim: final });
    }
    if (!periodos.length) {
      alert(`Informe ao menos um período para "${nome}".`);
      return;
    }
    if (periodos.length === 2 && periodos[1].inicio < periodos[0].fim) {
      alert(`Em "${nome}", o retorno precisa ser depois da saída para o intervalo.`);
      return;
    }
    turnos.push({ id: t.id, nome, periodos });
  }

  const refData = escalaParseDate(toStorageDate(refs.escalaSemanaReferencia.value));
  if (!refData) {
    alert("Informe a semana de referência.");
    return;
  }
  const ref = escalaSegunda(refData);
  const permAteRef = escalaInversoesPermanentesAte(ref);
  const n = turnos.length;

  const escolhidos = cfg.equipes.map((_, i) => parseInt(valor(`[data-equipe="${i}"][data-campo="turno"]`), 10) || 0);
  const fixos = cfg.equipes.map((_, i) => valor(`[data-equipe="${i}"][data-campo="fixo"]`) === "fixo");
  const nomesEquipes = cfg.equipes.map((eq, i) => valor(`[data-equipe="${i}"][data-campo="nome"]`) || eq.nome);
  if (cfg.equipes.length <= n && new Set(escolhidos).size !== escolhidos.length) {
    alert("Cada equipe precisa estar em um horário diferente na semana de referência.");
    return;
  }

  // Horários do revezamento = os que não são de equipe fixa.
  const turnosFixos = new Set(escolhidos.filter((_, i) => fixos[i]));
  const rot = turnos.map((_, j) => j).filter((j) => !turnosFixos.has(j));
  for (let i = 0; i < cfg.equipes.length; i++) {
    if (fixos[i] || rot.includes(escolhidos[i])) continue;
    alert(`"${nomesEquipes[i]}" reveza, mas o horário escolhido é fixo de outra equipe.`);
    return;
  }

  const equipes = cfg.equipes.map((eq, i) => ({
    id: eq.id,
    nome: nomesEquipes[i],
    fixo: fixos[i],
    // Grava o horário-base já descontando as inversões permanentes até a referência,
    // para que a semana de referência fique exatamente como foi escolhida.
    turnoReferenciaId: fixos[i]
      ? turnos[escolhidos[i]].id
      : turnos[rot[escalaMod(rot.indexOf(escolhidos[i]) - permAteRef, rot.length)]].id,
    tecnicos: [],
  }));
  form.querySelectorAll("[data-tecnico-nome]").forEach((select) => {
    if (select.value === "") return;
    const equipe = equipes[parseInt(select.value, 10)];
    if (equipe) equipe.tecnicos.push(select.getAttribute("data-tecnico-nome"));
  });

  await sendData("/api/escala-config", "PUT", { turnos, equipes, semanaReferencia: escalaFormatDate(ref) });
  closeModal(refs.escalaConfigModal);
  await reloadEscala();
}

function openEscalaExcecaoModal(tecnico, diaStorage) {
  const { turnos } = state.escala;
  const tecnicos = escalaTodosTecnicos();
  if (!tecnicos.length) {
    alert("Nenhum técnico cadastrado. Cadastre os técnicos em Setup.");
    return;
  }
  refs.escalaExcecaoTecnico.innerHTML = tecnicos
    .map((nome) => `<option value="${escapeAttribute(nome)}"${tecnico && normalizeText(nome) === normalizeText(tecnico) ? " selected" : ""}>${escapeHtml(nome)}</option>`)
    .join("");
  refs.escalaExcecaoTurno.innerHTML = turnos
    .map((t) => `<option value="${escapeAttribute(t.id)}">${escapeHtml(t.nome)} (${escapeHtml(escalaHorasTexto(t))})</option>`)
    .join("") + `<option value="">Folga / ausente</option>`;

  const hoje = escalaHoje();
  const segunda = state.escalaSemana;
  const padraoDia = escalaParseDate(diaStorage)
    || (escalaMesmoDia(escalaSegunda(hoje), segunda) ? hoje : segunda);
  refs.escalaExcecaoInicio.value = storageToInputDate(escalaFormatDate(padraoDia));
  refs.escalaExcecaoFim.value = refs.escalaExcecaoInicio.value;
  refs.escalaExcecaoMotivo.value = "";

  // Sugere o horário "do outro lado": o primeiro diferente do que o técnico teria no dia.
  const atual = escalaTecnicoNoDia(refs.escalaExcecaoTecnico.value, padraoDia);
  const sugestao = turnos.find((t) => !atual.turno || t.id !== atual.turno.id);
  refs.escalaExcecaoTurno.value = sugestao ? sugestao.id : "";

  openModal(refs.escalaExcecaoModal, tecnico ? refs.escalaExcecaoTurno : refs.escalaExcecaoTecnico);
}

async function saveEscalaExcecao(event) {
  event.preventDefault();
  const dataInicio = toStorageDate(refs.escalaExcecaoInicio.value);
  const dataFim = toStorageDate(refs.escalaExcecaoFim.value) || dataInicio;
  const ini = escalaParseDate(dataInicio);
  const fim = escalaParseDate(dataFim);
  if (!ini || !fim) {
    alert("Informe o período da exceção.");
    return;
  }
  if (fim < ini) {
    alert("A data final precisa ser igual ou depois da inicial.");
    return;
  }
  await escalaGarantirConfigSalva();
  await sendData("/api/escala-excecoes", "POST", {
    id: createId(),
    tipo: "tecnico",
    dataInicio,
    dataFim,
    tecnico: refs.escalaExcecaoTecnico.value,
    turnoId: refs.escalaExcecaoTurno.value,
    motivo: refs.escalaExcecaoMotivo.value.trim(),
  });
  closeModal(refs.escalaExcecaoModal);
  await reloadEscala();
}

async function deleteEscalaExcecao(id) {
  const item = state.escalaExcecoes.find((e) => String(e.id) === String(id));
  if (!item) return;
  if (!confirm(`Excluir a exceção "${ESCALA_TIPO_LABELS[item.tipo] || item.tipo}" (${escalaPeriodoTexto(item)})?`)) return;
  await deleteData(`/api/escala-excecoes/${encodeURIComponent(id)}`);
  await reloadEscala();
}

// ── Atualizações do sistema (atualizacoes.html) ──────────────────────────────
// Atualizações de banco de dados e de estações, cada uma com técnico responsável
// e confirmação de realização (realizada / realizada_em / confirmado_por).
// Tabela fora de supabaseAllData: carregada só nesta página (supabase/atualizacoes.sql).

const ATU_TIPO_LABELS = { banco: "Banco de dados", estacao: "Estações" };

function toAtualizacaoJs(row) {
  return {
    id: row.id,
    tipo: row.tipo,
    cliente: row.cliente || "",
    tecnico: row.tecnico || "",
    dataPrevista: row.data_prevista || "",
    versao: row.versao || "",
    estacoes: row.estacoes || "",
    observacao: row.observacao || "",
    realizada: row.realizada === true,
    realizadaEm: row.realizada_em || "",
    confirmadoPor: row.confirmado_por || "",
    createdAt: row.created_at,
  };
}

async function loadAtualizacoes() {
  const { data, error } = await db.from("atualizacoes").select("*").order("created_at", { ascending: false });
  // Tabela ainda não criada (supabase/atualizacoes.sql): lista vazia e aviso.
  state.atualizacoesErro = Boolean(error);
  state.atualizacoes = error ? [] : data.map(toAtualizacaoJs);
}

async function reloadAtualizacoes() {
  await loadAtualizacoes();
  renderAtualizacoes();
}

function atuHojeStorage() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function atuNomeUsuario() {
  return (window.auth && window.auth.perfil && (window.auth.perfil.nome || window.auth.perfil.email)) || "";
}

// Data DD/MM/YYYY → número comparável (YYYYMMDD); vazia vai para o fim.
function atuDataOrdem(stored) {
  if (!stored || stored.length !== 10) return 99999999;
  const [d, m, y] = stored.split("/");
  return Number(`${y}${m}${d}`) || 99999999;
}

function atuTecnicosNomes(extra) {
  const nomes = (state.tecnicos || []).map((t) => t.nome).filter(Boolean);
  (extra || []).forEach((n) => {
    if (n && !nomes.some((x) => normalizeText(x) === normalizeText(n))) nomes.push(n);
  });
  return nomes.sort((a, b) => String(a).localeCompare(String(b), "pt-BR"));
}

function atuEhAdmin() {
  return usuarioVeTudo();
}

function atuTecnicoDoUsuario() {
  return tecnicoDoUsuario();
}

// O técnico só enxerga as atualizações atribuídas a ele; o admin vê todas.
function atuAtualizacoesVisiveis() {
  return registrosDoUsuario(state.atualizacoes || []);
}

function populateAtuTecnicoFilter() {
  if (!refs.atuTecnicoFilter) return;
  const campo = refs.atuTecnicoFilter.closest(".filter-field");
  if (campo) campo.style.display = atuEhAdmin() ? "" : "none";
  if (!atuEhAdmin()) { refs.atuTecnicoFilter.value = ""; return; }
  const atual = refs.atuTecnicoFilter.value;
  const nomes = atuTecnicosNomes((state.atualizacoes || []).map((a) => a.tecnico));
  refs.atuTecnicoFilter.innerHTML = `<option value="">Todos</option>` +
    nomes.map((n) => `<option value="${escapeAttribute(n)}">${escapeHtml(n)}</option>`).join("");
  refs.atuTecnicoFilter.value = nomes.includes(atual) ? atual : "";
}

function renderAtualizacoes() {
  if (!refs.atuTableBody) return;
  const items = atuAtualizacoesVisiveis();
  populateAtuTecnicoFilter();

  if (refs.atuAviso) {
    let aviso = "";
    if (state.atualizacoesErro) {
      aviso = "Não foi possível carregar as atualizações. Rode supabase/atualizacoes.sql no SQL Editor do Supabase.";
    } else if (!atuEhAdmin() && window.auth && window.auth.papel === "tecnico") {
      aviso = `Mostrando só as atualizações atribuídas a você (${atuTecnicoDoUsuario() || "técnico não identificado"}).`;
    } else if (!atuEhAdmin()) {
      aviso = "As atualizações ficam visíveis só para o administrador e para o técnico responsável.";
    }
    refs.atuAviso.hidden = !aviso;
    refs.atuAviso.textContent = aviso;
  }

  const busca = normalizeText(refs.atuSearchInput ? refs.atuSearchInput.value : "");
  const tipo = refs.atuTipoFilter ? refs.atuTipoFilter.value : "";
  const situacao = refs.atuSituacaoFilter ? refs.atuSituacaoFilter.value : "";
  const tecnico = refs.atuTecnicoFilter ? refs.atuTecnicoFilter.value : "";

  const filtrados = items
    .filter((a) => !tipo || a.tipo === tipo)
    .filter((a) => !situacao || (situacao === "realizada" ? a.realizada : !a.realizada))
    .filter((a) => !tecnico || normalizeText(a.tecnico) === normalizeText(tecnico))
    .filter((a) => !busca || [a.cliente, a.tecnico, a.versao, a.estacoes, a.observacao, ATU_TIPO_LABELS[a.tipo]]
      .some((v) => normalizeText(v).includes(busca)))
    .sort((a, b) => {
      // Pendentes primeiro (pela data prevista); realizadas depois (mais recentes primeiro).
      if (a.realizada !== b.realizada) return a.realizada ? 1 : -1;
      if (a.realizada) return atuDataOrdem(b.realizadaEm) - atuDataOrdem(a.realizadaEm);
      return atuDataOrdem(a.dataPrevista) - atuDataOrdem(b.dataPrevista) || a.cliente.localeCompare(b.cliente, "pt-BR");
    });

  const podeConfirmar = Boolean(window.auth && window.auth.can("write"));
  const podeGerenciar = atuEhAdmin();
  const hoje = atuDataOrdem(atuHojeStorage());

  refs.atuTableBody.innerHTML = filtrados.map((a) => {
    const atrasada = !a.realizada && a.dataPrevista && atuDataOrdem(a.dataPrevista) < hoje;
    const detalhe = [a.versao && `Versão ${a.versao}`, a.tipo === "estacao" && a.estacoes].filter(Boolean).join(" · ");
    const situacaoHtml = a.realizada
      ? `<span class="status status-concluido">Realizada</span><small class="atu-nota">${escapeHtml([a.realizadaEm, a.confirmadoPor && `por ${a.confirmadoPor}`].filter(Boolean).join(" "))}</small>`
      : `<span class="status ${atrasada ? "status-pendente" : "status-em-andamento"}">${atrasada ? "Atrasada" : "Pendente"}</span>`;
    // Técnico só marca como realizada; editar/excluir é do admin.
    const acoes = `
      ${podeConfirmar && !a.realizada ? `<button type="button" onclick="confirmarAtualizacao('${escapeAttribute(a.id)}')">Realizado</button>` : ""}
      ${podeGerenciar ? `<button type="button" class="ghost" onclick="editAtualizacao('${escapeAttribute(a.id)}')">Editar</button>
      <button type="button" class="danger" onclick="deleteAtualizacao('${escapeAttribute(a.id)}')">Excluir</button>` : ""}`;
    return `<tr>
      <td><span class="status atu-tipo-${a.tipo}">${escapeHtml(ATU_TIPO_LABELS[a.tipo] || a.tipo)}</span></td>
      <td><strong>${escapeHtml(a.cliente)}</strong>${a.observacao ? `<small class="atu-nota" title="${escapeAttribute(a.observacao)}">${escapeHtml(a.observacao)}</small>` : ""}</td>
      <td>${escapeHtml(detalhe || "—")}</td>
      <td>${escapeHtml(a.tecnico || "—")}</td>
      <td>${escapeHtml(a.dataPrevista || "—")}</td>
      <td>${situacaoHtml}</td>
      <td class="atu-acoes">${acoes}</td>
    </tr>`;
  }).join("");

  if (refs.atuEmptyState) {
    refs.atuEmptyState.style.display = filtrados.length ? "none" : "block";
    refs.atuEmptyState.textContent = items.length ? "Nenhuma atualização encontrada com esses filtros." : "Nenhuma atualização cadastrada.";
  }
}

function renderAtuClientMenu() {
  if (!refs.atuClientMenu) return;
  const typed = normalizeText(refs.atuCliente.value);
  // No lote, quem já virou chip sai da lista.
  const escolhidos = atuModoLote() ? (state.atuClientesLote || []).map(normalizeText) : [];
  const clients = [...state.clientes]
    .filter((c) => !escolhidos.includes(normalizeText(c.nome)))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const filtered = typed ? clients.filter((c) => normalizeText(c.nome).includes(typed)) : clients;
  const tecnicoEscolhido = refs.atuTecnico ? refs.atuTecnico.value : "";
  refs.atuClientMenu.innerHTML = filtered.length
    ? filtered.map((c) => {
      const dono = atuTecnicoPendenteDoCliente(c.nome, refs.atuId.value);
      const bloqueado = Boolean(dono && tecnicoEscolhido && normalizeText(dono) !== normalizeText(tecnicoEscolhido));
      const nota = dono ? `<small class="combo-phone"> · pendente com ${escapeHtml(dono)}</small>` : "";
      return bloqueado
        ? `<div class="combo-option combo-option--bloqueada" title="Cliente com atualização pendente com ${escapeAttribute(dono)}">${escapeHtml(c.nome)}${nota}</div>`
        : `<button type="button" class="combo-option" data-atu-cliente="${escapeAttribute(c.nome)}">${escapeHtml(c.nome)}${nota}</button>`;
    }).join("")
    : `<div class="combo-empty">Nenhum cliente encontrado.</div>`;
  refs.atuClientMenu.querySelectorAll("[data-atu-cliente]").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const nome = btn.getAttribute("data-atu-cliente");
      if (atuModoLote()) {
        atuAdicionarClienteLote(nome);
        refs.atuCliente.value = "";
        renderAtuClientMenu(); // menu continua aberto para escolher o próximo
        return;
      }
      refs.atuCliente.value = nome;
      closeAtuClientMenu();
    });
  });
}

// ── Lote: nova atualização para vários clientes de uma vez ──
// Só ao criar (sem id). Cada cliente escolhido vira um chip; ao salvar, uma
// atualização por cliente, com os mesmos técnico, tipo, data, versão etc.

// Um cliente, um técnico: enquanto houver atualização pendente do cliente com
// um técnico, ela não pode ir para outro (o banco também barra — trigger
// atualizacoes_cliente_um_tecnico em atualizacoes.sql).
function atuTecnicoPendenteDoCliente(cliente, ignorarId) {
  const alvo = normalizeText(cliente);
  const item = (state.atualizacoes || []).find((a) =>
    !a.realizada && normalizeText(a.cliente) === alvo && String(a.id) !== String(ignorarId || ""));
  return item ? item.tecnico : "";
}

// Lista "Cliente (técnico X)" dos clientes que já estão pendentes com outro técnico.
function atuConflitosTecnico(clientes, tecnico, ignorarId) {
  return clientes
    .map((cliente) => ({ cliente, dono: atuTecnicoPendenteDoCliente(cliente, ignorarId) }))
    .filter(({ dono }) => dono && normalizeText(dono) !== normalizeText(tecnico));
}

function atuMensagemConflito(conflitos) {
  const linhas = conflitos.map(({ cliente, dono }) => `- ${cliente}: pendente com ${dono}`).join("\n");
  return `Estes clientes já têm atualização pendente com outro técnico e não podem ser atribuídos a este:\n\n${linhas}\n\nConclua (Realizado) ou reatribua a atualização existente antes.`;
}

function atuModoLote() {
  return Boolean(refs.atuId && !refs.atuId.value);
}

function atuAdicionarClienteLote(nome) {
  const cliente = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(nome));
  if (!cliente) return false;
  const tecnico = refs.atuTecnico ? refs.atuTecnico.value : "";
  const conflitos = tecnico ? atuConflitosTecnico([cliente.nome], tecnico) : [];
  if (conflitos.length) {
    alert(`O cliente "${cliente.nome}" já tem atualização pendente com ${conflitos[0].dono}. Ele não pode ser atribuído a outro técnico.`);
    return "conflito";
  }
  state.atuClientesLote = state.atuClientesLote || [];
  if (!state.atuClientesLote.some((n) => normalizeText(n) === normalizeText(cliente.nome))) {
    state.atuClientesLote.push(cliente.nome);
  }
  renderAtuClientesLote();
  return true;
}

function removerAtuClienteLote(indice) {
  (state.atuClientesLote || []).splice(indice, 1);
  renderAtuClientesLote();
}

function renderAtuClientesLote() {
  if (!refs.atuClientesChips) return;
  const lista = state.atuClientesLote || [];
  const tecnico = refs.atuTecnico ? refs.atuTecnico.value : "";
  refs.atuClientesChips.innerHTML = lista.map((nome, i) => {
    const dono = atuTecnicoPendenteDoCliente(nome);
    const conflito = Boolean(dono && tecnico && normalizeText(dono) !== normalizeText(tecnico));
    return `<span class="atu-chip${conflito ? " atu-chip--conflito" : ""}"${conflito ? ` title="Pendente com ${escapeAttribute(dono)} — não pode ir para outro técnico"` : ""}>${escapeHtml(nome)}${conflito ? ` <small>(com ${escapeHtml(dono)})</small>` : ""}<button type="button" onclick="removerAtuClienteLote(${i})" aria-label="Remover ${escapeAttribute(nome)}">×</button></span>`;
  }).join("");
  if (refs.atuLoteInfo) {
    refs.atuLoteInfo.textContent = lista.length
      ? `${lista.length} ${lista.length === 1 ? "cliente" : "clientes"} — será criada uma atualização para cada um.`
      : "Escolha um ou mais clientes. Será criada uma atualização para cada um.";
  }
}

// Enter no campo de cliente (modo lote) adiciona o nome digitado, se for de um cliente cadastrado.
function onAtuClienteKeydown(event) {
  if (event.key !== "Enter" || !atuModoLote()) return;
  event.preventDefault();
  const texto = refs.atuCliente.value.trim();
  if (!texto) return;
  const exato = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(texto));
  const parecidos = state.clientes.filter((c) => normalizeText(c.nome).includes(normalizeText(texto)));
  const alvo = exato || (parecidos.length === 1 ? parecidos[0] : null);
  if (alvo) {
    atuAdicionarClienteLote(alvo.nome);
    refs.atuCliente.value = "";
    renderAtuClientMenu();
  }
}

function openAtuClientMenu() {
  if (!refs.atuClientMenu) return;
  renderAtuClientMenu();
  refs.atuClientMenu.classList.add("open");
}

function closeAtuClientMenu() {
  if (refs.atuClientMenu) refs.atuClientMenu.classList.remove("open");
}

function onAtuTipoChange() {
  const estacao = refs.atuTipo.value === "estacao";
  if (refs.atuEstacoesRow) refs.atuEstacoesRow.style.display = estacao ? "" : "none";
  if (refs.atuVersaoHelper) refs.atuVersaoHelper.style.display = estacao ? "none" : "";
}

function onAtuRealizadaChange() {
  const realizada = refs.atuRealizada.value === "true";
  if (refs.atuRealizadaEmRow) refs.atuRealizadaEmRow.style.display = realizada ? "" : "none";
  if (realizada && !refs.atuRealizadaEm.value) refs.atuRealizadaEm.value = storageToInputDate(atuHojeStorage());
}

function openAtualizacaoModal(item) {
  if (!refs.atuFormModal) return;
  const a = item || {};
  // Técnico só cria/edita atualizações dele mesmo (a RLS barraria outro nome).
  const meuTecnico = atuEhAdmin() ? "" : atuTecnicoDoUsuario();
  if (!atuEhAdmin() && !meuTecnico) {
    alert("Seu usuário não está vinculado a um técnico. Peça ao administrador para cadastrar seu e-mail no técnico, em Setup.");
    return;
  }
  refs.atuFormModalTitle.textContent = item ? "Editar atualização" : "Nova atualização";
  refs.atuId.value = a.id || "";
  refs.atuTipo.value = a.tipo || "banco";
  refs.atuCliente.value = item ? a.cliente || "" : "";
  // Nova: vários clientes (chips). Edição: um cliente só.
  state.atuClientesLote = [];
  if (refs.atuLoteRow) refs.atuLoteRow.hidden = Boolean(item);
  if (refs.atuClienteLabel) refs.atuClienteLabel.textContent = item ? "Cliente" : "Clientes";
  refs.atuCliente.placeholder = item ? "" : "Busque e escolha um ou mais clientes...";
  renderAtuClientesLote();
  if (meuTecnico) {
    refs.atuTecnico.innerHTML = `<option value="${escapeAttribute(meuTecnico)}">${escapeHtml(meuTecnico)}</option>`;
    refs.atuTecnico.value = meuTecnico;
    refs.atuTecnico.disabled = true;
  } else {
    const nomes = atuTecnicosNomes([a.tecnico]);
    refs.atuTecnico.innerHTML = `<option value="">Selecione</option>` +
      nomes.map((n) => `<option value="${escapeAttribute(n)}">${escapeHtml(n)}</option>`).join("");
    refs.atuTecnico.value = a.tecnico || "";
    refs.atuTecnico.disabled = false;
  }
  refs.atuDataPrevista.value = a.dataPrevista ? storageToInputDate(a.dataPrevista) : "";
  refs.atuVersao.value = a.versao || "";
  refs.atuEstacoes.value = a.estacoes || "";
  refs.atuObservacao.value = a.observacao || "";
  refs.atuRealizada.value = a.realizada ? "true" : "false";
  refs.atuRealizadaEm.value = a.realizadaEm ? storageToInputDate(a.realizadaEm) : "";
  onAtuTipoChange();
  onAtuRealizadaChange();
  openModal(refs.atuFormModal, item && !meuTecnico ? refs.atuTecnico : refs.atuCliente);
}

function editAtualizacao(id) {
  const item = (state.atualizacoes || []).find((a) => String(a.id) === String(id));
  if (item) openAtualizacaoModal(item);
}

// Atualização de banco confirmada com versão → grava também a versão do banco no cliente.
async function atuAtualizarVersaoCliente(atu) {
  if (atu.tipo !== "banco" || !atu.realizada || !atu.versao) return;
  const cliente = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(atu.cliente));
  if (!cliente) return;
  await sendData(`/api/clientes-versao/${encodeURIComponent(cliente.id)}`, "PATCH", {
    versaoBanco: atu.versao,
    updatedAt: new Date().toISOString(),
  });
}

async function saveAtualizacao(event) {
  event.preventDefault();
  if (atuModoLote()) { await saveAtualizacoesLote(); return; }
  const cliente = refs.atuCliente.value.trim();
  const clienteCadastrado = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(cliente));
  if (!clienteCadastrado) {
    alert("Selecione um cliente cadastrado.");
    refs.atuCliente.focus();
    return;
  }
  if (!refs.atuTecnico.value) {
    alert("Informe o técnico responsável.");
    refs.atuTecnico.focus();
    return;
  }
  const realizada = refs.atuRealizada.value === "true";
  const realizadaEm = realizada ? toStorageDate(refs.atuRealizadaEm.value) : "";
  if (realizada && !realizadaEm) {
    alert("Informe a data em que a atualização foi realizada.");
    refs.atuRealizadaEm.focus();
    return;
  }

  const id = refs.atuId.value;
  const anterior = id ? (state.atualizacoes || []).find((a) => String(a.id) === String(id)) : null;
  if (refs.atuRealizada.value !== "true") {
    const conflitos = atuConflitosTecnico([clienteCadastrado.nome], refs.atuTecnico.value, id);
    if (conflitos.length) {
      alert(atuMensagemConflito(conflitos));
      return;
    }
  }
  const payload = {
    id: id || createId(),
    tipo: refs.atuTipo.value,
    cliente: clienteCadastrado.nome,
    tecnico: refs.atuTecnico.value,
    dataPrevista: toStorageDate(refs.atuDataPrevista.value) || "",
    versao: refs.atuVersao.value.trim(),
    estacoes: refs.atuEstacoes.value.trim(),
    observacao: refs.atuObservacao.value.trim(),
    realizada,
    realizadaEm,
    // Mantém quem confirmou originalmente; se está confirmando agora, é o usuário atual.
    confirmadoPor: realizada ? (anterior && anterior.realizada && anterior.confirmadoPor) || atuNomeUsuario() : "",
  };

  await sendData(id ? `/api/atualizacoes/${encodeURIComponent(id)}` : "/api/atualizacoes", id ? "PUT" : "POST", payload);
  // Só mexe na versão do cliente quando a confirmação ou a versão mudou agora —
  // editar uma atualização antiga não pode voltar o cliente para uma versão velha.
  if (!anterior || !anterior.realizada || anterior.versao !== payload.versao) await atuAtualizarVersaoCliente(payload);
  closeModal(refs.atuFormModal);
  await reloadAtualizacoes();
}

async function saveAtualizacoesLote() {
  // Um nome digitado e não adicionado como chip também entra, se for de cliente cadastrado.
  const digitado = refs.atuCliente.value.trim();
  const adicionado = digitado ? atuAdicionarClienteLote(digitado) : true;
  if (adicionado !== true) {
    // false = não é cliente cadastrado; "conflito" = o aviso já foi mostrado.
    if (adicionado === false) alert(`"${digitado}" não é um cliente cadastrado. Escolha na lista.`);
    refs.atuCliente.focus();
    return;
  }
  refs.atuCliente.value = "";
  const clientes = state.atuClientesLote || [];
  if (!clientes.length) {
    alert("Escolha pelo menos um cliente.");
    refs.atuCliente.focus();
    return;
  }
  if (!refs.atuTecnico.value) {
    alert("Informe o técnico responsável.");
    refs.atuTecnico.focus();
    return;
  }
  const realizada = refs.atuRealizada.value === "true";
  const realizadaEm = realizada ? toStorageDate(refs.atuRealizadaEm.value) : "";
  if (realizada && !realizadaEm) {
    alert("Informe a data em que a atualização foi realizada.");
    refs.atuRealizadaEm.focus();
    return;
  }
  const base = {
    tipo: refs.atuTipo.value,
    tecnico: refs.atuTecnico.value,
    dataPrevista: toStorageDate(refs.atuDataPrevista.value) || "",
    versao: refs.atuVersao.value.trim(),
    estacoes: refs.atuEstacoes.value.trim(),
    observacao: refs.atuObservacao.value.trim(),
    realizada,
    realizadaEm,
    confirmadoPor: realizada ? atuNomeUsuario() : "",
  };
  const conflitosLote = atuConflitosTecnico(clientes, refs.atuTecnico.value);
  if (conflitosLote.length) {
    alert(atuMensagemConflito(conflitosLote));
    return;
  }
  if (clientes.length > 1 && !confirm(`Criar ${clientes.length} atualizações (uma por cliente) para ${base.tecnico}?`)) return;

  const itens = clientes.map((cliente) => ({ ...base, id: createId(), cliente }));
  await sendData("/api/atualizacoes-lote", "POST", { itens });
  for (const item of itens) await atuAtualizarVersaoCliente(item);
  closeModal(refs.atuFormModal);
  await reloadAtualizacoes();
}

async function confirmarAtualizacao(id) {
  const item = (state.atualizacoes || []).find((a) => String(a.id) === String(id));
  if (!item || item.realizada) return;
  const extra = item.tipo === "banco" && item.versao
    ? `\n\nA versão do banco do cliente será atualizada para ${item.versao}.`
    : "";
  if (!confirm(`Confirmar que a atualização de ${ATU_TIPO_LABELS[item.tipo] || item.tipo} do cliente "${item.cliente}" foi realizada hoje?${extra}`)) return;
  const realizadaEm = atuHojeStorage();
  const confirmadoPor = atuNomeUsuario();
  await sendData(`/api/atualizacoes-confirmar/${encodeURIComponent(id)}`, "PATCH", { realizadaEm, confirmadoPor });
  await atuAtualizarVersaoCliente({ ...item, realizada: true });
  await reloadAtualizacoes();
}

async function deleteAtualizacao(id) {
  const item = (state.atualizacoes || []).find((a) => String(a.id) === String(id));
  if (!item) return;
  if (!confirm(`Excluir a atualização de ${ATU_TIPO_LABELS[item.tipo] || item.tipo} do cliente "${item.cliente}"?`)) return;
  await deleteData(`/api/atualizacoes/${encodeURIComponent(id)}`);
  await reloadAtualizacoes();
}

// ── TDI (tdi.html) ───────────────────────────────────────────────────────────
// O técnico descreve o TDI em texto livre (com cliente e imagem opcional), a IA
// (Claude, via proxy.js em localhost:3001) devolve título + conteúdo
// estruturados, o técnico revisa/ajusta e salva. Tabela `tdis`, fora de
// supabaseAllData (carregada só nesta página por loadTdis).

const TDI_PROXY_URL = "http://localhost:3001/api/chat";
const TDI_MODELO = "claude-opus-5-5";
const TDI_IMAGEM_MAX_LADO = 1600;

// Estrutura pedida à IA. Ajuste aqui as seções se o modelo de TDI da equipe mudar.
const TDI_INSTRUCOES = `Você ajuda técnicos de suporte do sistema Gestão Suporte (ERP: financeiro, documentos fiscais, SPED, cadastros) a escrever TDIs.
O técnico descreve a situação com as próprias palavras, às vezes com um print da tela. Transforme isso num TDI claro e completo, em português do Brasil, que outra pessoa da equipe consiga entender e executar sem conversar com o técnico.

Organize o conteúdo nestas seções, cada uma começando com "## " e o nome da seção:
## Resumo
## Cliente e ambiente
## Descrição
## Passos para reproduzir
## Resultado esperado
## Resultado atual
## Impacto
## Informações adicionais

Use listas com "- " ou "1. " quando ajudar. Use só o que o técnico informou e o que aparece na imagem: não invente versões, telas, valores ou nomes. Quando faltar algo importante, escreva "A confirmar" na seção. Se uma seção não se aplicar, escreva "Não se aplica".
O título deve ser curto e específico (até 90 caracteres), sem a palavra "TDI".`;

const TDI_SCHEMA = {
  type: "object",
  properties: {
    titulo: { type: "string" },
    conteudo: { type: "string" },
  },
  required: ["titulo", "conteudo"],
  additionalProperties: false,
};

function toTdiJs(row) {
  return {
    id: row.id,
    cliente: row.cliente || "",
    titulo: row.titulo || "",
    conteudo: row.conteudo || "",
    descricao: row.descricao || "",
    imagem: row.imagem || "",
    criadoPor: row.criado_por,
    criadoPorNome: row.criado_por_nome || "",
    createdAt: row.created_at,
  };
}

async function loadTdis() {
  const { data, error } = await db.from("tdis").select("*").order("created_at", { ascending: false });
  // Tabela ainda não criada (supabase/tdis.sql): lista vazia e aviso.
  state.tdisErro = Boolean(error);
  state.tdis = error ? [] : data.map(toTdiJs);
}

async function reloadTdis() {
  await loadTdis();
  renderTdis();
}

// Perfil Qualidade: vê os TDIs de todos os técnicos, em grid, somente leitura.
function tdiModoQualidade() {
  return Boolean(window.auth && window.auth.papel === "qualidade");
}

// Admin e Qualidade veem todos; os demais só os que criaram (a RLS já garante; aqui fica coerente).
function tdisVisiveis() {
  const items = state.tdis || [];
  if (usuarioVeTudo() || tdiModoQualidade()) return items;
  const meuId = window.auth && window.auth.user ? window.auth.user.id : null;
  return items.filter((t) => t.criadoPor === meuId);
}

function tdiDataHora(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

// Converte o texto do TDI (## seções, listas "- " e "1. ") em HTML, sempre escapado.
function tdiRenderDoc(texto) {
  const linhas = String(texto || "").replace(/\r/g, "").split("\n");
  const html = [];
  let lista = null;
  const fecharLista = () => { if (lista) { html.push(`</${lista}>`); lista = null; } };
  linhas.forEach((bruta) => {
    const linha = bruta.trim();
    if (!linha) { fecharLista(); return; }
    const titulo = linha.match(/^#{1,6}\s+(.*)$/);
    const ul = linha.match(/^[-*•]\s+(.*)$/);
    const ol = linha.match(/^\d+[.)]\s+(.*)$/);
    if (titulo) { fecharLista(); html.push(`<h3>${escapeHtml(titulo[1])}</h3>`); return; }
    if (ul || ol) {
      const tipo = ul ? "ul" : "ol";
      if (lista !== tipo) { fecharLista(); html.push(`<${tipo}>`); lista = tipo; }
      html.push(`<li>${escapeHtml((ul || ol)[1])}</li>`);
      return;
    }
    fecharLista();
    html.push(`<p>${escapeHtml(linha)}</p>`);
  });
  fecharLista();
  return html.join("");
}

function tdiTextoCompleto(t) {
  return `${t.titulo}\nCliente: ${t.cliente}\n\n${t.conteudo}`;
}

// ── Lista ──

function renderTdis() {
  if (!refs.tdiLista) return;
  if (tdiModoQualidade()) { renderTdiGrid(); return; }
  const admin = usuarioVeTudo();
  if (refs.tdiListaTitulo) refs.tdiListaTitulo.textContent = admin ? "TDIs" : "Meus TDIs";
  if (refs.tdiAviso) {
    refs.tdiAviso.hidden = !state.tdisErro;
    refs.tdiAviso.textContent = state.tdisErro
      ? "Não foi possível carregar os TDIs. Rode supabase/tdis.sql no SQL Editor do Supabase."
      : "";
  }

  const items = tdisVisiveis();
  if (refs.tdiAutorFiltroCampo) refs.tdiAutorFiltroCampo.hidden = !admin;
  if (admin && refs.tdiAutorFiltro) {
    const atual = refs.tdiAutorFiltro.value;
    const autores = [...new Set(items.map((t) => t.criadoPorNome).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    refs.tdiAutorFiltro.innerHTML = `<option value="">Todos</option>` +
      autores.map((n) => `<option value="${escapeAttribute(n)}">${escapeHtml(n)}</option>`).join("");
    refs.tdiAutorFiltro.value = autores.includes(atual) ? atual : "";
  }

  const busca = normalizeText(refs.tdiBusca ? refs.tdiBusca.value : "");
  const autor = admin && refs.tdiAutorFiltro ? refs.tdiAutorFiltro.value : "";
  const filtrados = items
    .filter((t) => !autor || t.criadoPorNome === autor)
    .filter((t) => !busca || [t.titulo, t.cliente, t.conteudo, t.criadoPorNome].some((v) => normalizeText(v).includes(busca)));

  refs.tdiLista.innerHTML = filtrados.map((t) => {
    const resumo = (t.conteudo.split("\n").find((l) => l.trim() && !/^#/.test(l.trim())) || "").trim();
    return `<button type="button" class="tdi-item" onclick="verTdi('${escapeAttribute(t.id)}')">
      <span class="tdi-item-titulo">${escapeHtml(t.titulo || "(sem título)")}</span>
      <span class="tdi-item-meta">${escapeHtml(t.cliente)} · ${escapeHtml(tdiDataHora(t.createdAt))}${admin && t.criadoPorNome ? ` · ${escapeHtml(t.criadoPorNome)}` : ""}${t.imagem ? " · com imagem" : ""}</span>
      ${resumo ? `<span class="tdi-item-resumo">${escapeHtml(resumo)}</span>` : ""}
    </button>`;
  }).join("");

  if (refs.tdiListaVazia) {
    refs.tdiListaVazia.style.display = filtrados.length ? "none" : "block";
    refs.tdiListaVazia.textContent = items.length ? "Nenhum TDI encontrado com essa busca." : "Nenhum TDI criado ainda.";
  }
}

// ── Grid da Qualidade ──

function tdiPreencherSelect(select, valores) {
  if (!select) return;
  const atual = select.value;
  const lista = [...new Set(valores.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  select.innerHTML = `<option value="">Todos</option>` + lista.map((v) => `<option value="${escapeAttribute(v)}">${escapeHtml(v)}</option>`).join("");
  select.value = lista.includes(atual) ? atual : "";
}

function onTdiGridClick(event) {
  const th = event.target.closest("th[data-tdi-ordem]");
  if (th) {
    const campo = th.getAttribute("data-tdi-ordem");
    const ordem = state.tdiOrdem || { campo: "createdAt", desc: true };
    state.tdiOrdem = ordem.campo === campo ? { campo, desc: !ordem.desc } : { campo, desc: campo === "createdAt" };
    renderTdiGrid();
    return;
  }
  const linha = event.target.closest("tr[data-tdi-id]");
  if (linha) verTdi(linha.getAttribute("data-tdi-id"));
}

function renderTdiGrid() {
  const items = tdisVisiveis();
  if (refs.tdiListaTitulo) refs.tdiListaTitulo.textContent = "TDIs dos técnicos";
  if (refs.tdiAviso) {
    refs.tdiAviso.hidden = !state.tdisErro;
    refs.tdiAviso.textContent = state.tdisErro
      ? "Não foi possível carregar os TDIs. Rode supabase/tdis.sql no SQL Editor do Supabase."
      : "";
  }
  if (refs.tdiAutorFiltroCampo) refs.tdiAutorFiltroCampo.hidden = false;
  document.querySelectorAll(".tdi-filtro-grid").forEach((el) => { el.hidden = false; });
  if (refs.tdiLista) refs.tdiLista.hidden = true;
  if (refs.tdiGridWrap) refs.tdiGridWrap.hidden = false;
  const filtros = refs.tdiAutorFiltro && refs.tdiAutorFiltro.closest(".filters");
  if (filtros) filtros.classList.add("tdi-filtros--grid");

  tdiPreencherSelect(refs.tdiAutorFiltro, items.map((t) => t.criadoPorNome));
  tdiPreencherSelect(refs.tdiClienteFiltro, items.map((t) => t.cliente));

  const busca = normalizeText(refs.tdiBusca ? refs.tdiBusca.value : "");
  const autor = refs.tdiAutorFiltro ? refs.tdiAutorFiltro.value : "";
  const cliente = refs.tdiClienteFiltro ? refs.tdiClienteFiltro.value : "";
  // Datas do filtro (YYYY-MM-DD) comparadas com a data local de criação.
  const de = refs.tdiDataDe ? refs.tdiDataDe.value : "";
  const ate = refs.tdiDataAte ? refs.tdiDataAte.value : "";
  const dataLocal = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const ordem = state.tdiOrdem || { campo: "createdAt", desc: true };
  const filtrados = items
    .filter((t) => !autor || t.criadoPorNome === autor)
    .filter((t) => !cliente || t.cliente === cliente)
    .filter((t) => !de || dataLocal(t.createdAt) >= de)
    .filter((t) => !ate || dataLocal(t.createdAt) <= ate)
    .filter((t) => !busca || [t.titulo, t.cliente, t.conteudo, t.criadoPorNome].some((v) => normalizeText(v).includes(busca)))
    .sort((a, b) => {
      const va = String(a[ordem.campo] || "");
      const vb = String(b[ordem.campo] || "");
      const cmp = ordem.campo === "createdAt" ? va.localeCompare(vb) : va.localeCompare(vb, "pt-BR", { sensitivity: "base" });
      return ordem.desc ? -cmp : cmp;
    });

  document.querySelectorAll("th[data-tdi-ordem]").forEach((th) => {
    const ativo = th.getAttribute("data-tdi-ordem") === ordem.campo;
    th.classList.toggle("tdi-ordem-ativa", ativo);
    th.setAttribute("aria-sort", ativo ? (ordem.desc ? "descending" : "ascending") : "none");
    th.dataset.seta = ativo ? (ordem.desc ? " ↓" : " ↑") : "";
  });

  refs.tdiGridBody.innerHTML = filtrados.map((t) => `
    <tr data-tdi-id="${escapeAttribute(t.id)}" tabindex="0" title="Abrir TDI">
      <td data-label="Data" class="tdi-grid-data">${escapeHtml(tdiDataHora(t.createdAt))}</td>
      <td data-label="Técnico">${escapeHtml(t.criadoPorNome || "—")}</td>
      <td data-label="Cliente">${escapeHtml(t.cliente)}</td>
      <td data-label="Título" class="tdi-grid-titulo">${escapeHtml(t.titulo || "(sem título)")}</td>
      <td data-label="Imagem">${t.imagem ? "Sim" : "—"}</td>
      <td class="tdi-grid-acao"><button type="button" class="ghost" tabindex="-1">Ver</button></td>
    </tr>`).join("");

  if (refs.tdiGridTotal) {
    refs.tdiGridTotal.hidden = !items.length;
    refs.tdiGridTotal.textContent = `${filtrados.length} de ${items.length} ${items.length === 1 ? "TDI" : "TDIs"}`;
  }
  if (refs.tdiListaVazia) {
    refs.tdiListaVazia.style.display = filtrados.length ? "none" : "block";
    refs.tdiListaVazia.textContent = items.length ? "Nenhum TDI encontrado com esses filtros." : "Nenhum TDI criado pelos técnicos ainda.";
  }
}

function verTdi(id) {
  const t = (state.tdis || []).find((x) => String(x.id) === String(id));
  if (!t || !refs.tdiVerModal) return;
  state.tdiAberto = t.id;
  refs.tdiVerTitulo.textContent = t.titulo || "TDI";
  refs.tdiVerMeta.textContent = `${t.cliente} · ${tdiDataHora(t.createdAt)}${t.criadoPorNome ? ` · por ${t.criadoPorNome}` : ""}`;
  refs.tdiVerConteudo.innerHTML = tdiRenderDoc(t.conteudo);
  refs.tdiVerImagem.innerHTML = t.imagem ? `<img src="${escapeAttribute(t.imagem)}" alt="Imagem anexada ao TDI" />` : "";
  refs.tdiVerDescricao.textContent = t.descricao || "—";
  openModal(refs.tdiVerModal);
}

async function copiarTdiAberto() {
  const t = (state.tdis || []).find((x) => String(x.id) === String(state.tdiAberto));
  if (!t) return;
  try {
    await navigator.clipboard.writeText(tdiTextoCompleto(t));
    refs.tdiCopiarBtn.textContent = "Copiado!";
    setTimeout(() => { if (refs.tdiCopiarBtn) refs.tdiCopiarBtn.textContent = "Copiar texto"; }, 1500);
  } catch (_) {
    alert("Não foi possível copiar. Selecione o texto e copie manualmente.");
  }
}

async function excluirTdiAberto() {
  const t = (state.tdis || []).find((x) => String(x.id) === String(state.tdiAberto));
  if (!t) return;
  if (!confirm(`Excluir o TDI "${t.titulo}"?`)) return;
  await deleteData(`/api/tdis/${encodeURIComponent(t.id)}`);
  closeModal(refs.tdiVerModal);
  await reloadTdis();
}

// ── Composer (estilo chat) ──

function tdiAtualizarEnviar() {
  if (!refs.tdiEnviarBtn) return;
  const temConteudo = refs.tdiTexto.value.trim() || state.tdiImagem;
  refs.tdiEnviarBtn.disabled = Boolean(state.tdiCarregando) || !temConteudo;
}

function tdiAutoAltura() {
  refs.tdiTexto.style.height = "auto";
  refs.tdiTexto.style.height = Math.min(refs.tdiTexto.scrollHeight, 260) + "px";
}

function onTdiTextoKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (!refs.tdiEnviarBtn.disabled) refs.tdiPromptForm.requestSubmit();
  }
}

function renderTdiClientMenu() {
  if (!refs.tdiClientMenu) return;
  const typed = normalizeText(refs.tdiCliente.value);
  const clients = [...state.clientes].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const filtered = typed ? clients.filter((c) => normalizeText(c.nome).includes(typed)) : clients;
  refs.tdiClientMenu.innerHTML = filtered.length
    ? filtered.map((c) => `<button type="button" class="combo-option" data-tdi-cliente="${escapeAttribute(c.nome)}">${escapeHtml(c.nome)}</button>`).join("")
    : `<div class="combo-empty">Nenhum cliente encontrado.</div>`;
  refs.tdiClientMenu.querySelectorAll("[data-tdi-cliente]").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      refs.tdiCliente.value = btn.getAttribute("data-tdi-cliente");
      closeTdiClientMenu();
      refs.tdiTexto.focus();
    });
  });
}

function openTdiClientMenu() {
  if (!refs.tdiClientMenu) return;
  renderTdiClientMenu();
  refs.tdiClientMenu.classList.add("open");
}

function closeTdiClientMenu() {
  if (refs.tdiClientMenu) refs.tdiClientMenu.classList.remove("open");
}

// Reduz a imagem no navegador (lado maior até TDI_IMAGEM_MAX_LADO, JPEG) para
// caber no banco e na requisição à IA.
function tdiLerImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const escala = Math.min(1, TDI_IMAGEM_MAX_LADO / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}

async function onTdiArquivoChange() {
  const arquivo = refs.tdiArquivo.files && refs.tdiArquivo.files[0];
  refs.tdiArquivo.value = "";
  if (!arquivo) return;
  if (!arquivo.type.startsWith("image/")) { alert("Anexe uma imagem (print da tela, foto...)."); return; }
  try {
    state.tdiImagem = await tdiLerImagem(arquivo);
    renderTdiImagemPreview();
    tdiAtualizarEnviar();
  } catch (err) {
    alert(err.message);
  }
}

function renderTdiImagemPreview() {
  if (!refs.tdiImagemPreview) return;
  refs.tdiImagemPreview.hidden = !state.tdiImagem;
  refs.tdiImagemPreview.innerHTML = state.tdiImagem
    ? `<div class="tdi-thumb"><img src="${escapeAttribute(state.tdiImagem)}" alt="Imagem anexada" />
        <button type="button" class="tdi-thumb-remover" onclick="removerTdiImagem()" aria-label="Remover imagem">×</button></div>`
    : "";
}

function removerTdiImagem() {
  state.tdiImagem = "";
  renderTdiImagemPreview();
  tdiAtualizarEnviar();
}

// Chama a IA pelo proxy local. Pedido único e sem histórico: num ajuste, o
// rascunho atual vai junto no texto (mais simples e robusto que reenviar a conversa).
async function tdiChamarIA({ cliente, descricao, imagem, rascunho, ajuste }) {
  const partes = [];
  if (imagem) {
    const [cabecalho, dados] = imagem.split(",");
    const mediaType = (cabecalho.match(/data:([^;]+)/) || [])[1] || "image/jpeg";
    partes.push({ type: "image", source: { type: "base64", media_type: mediaType, data: dados } });
  }
  let texto = `Cliente: ${cliente}\n\nDescrição do técnico:\n${descricao}`;
  if (rascunho) {
    texto += `\n\nVersão atual do TDI:\nTítulo: ${rascunho.titulo}\n${rascunho.conteudo}\n\nAjuste pedido pelo técnico (aplique e devolva o TDI completo):\n${ajuste}`;
  }
  partes.push({ type: "text", text: texto });

  let resposta;
  try {
    resposta = await fetch(TDI_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2026-10-21",
        "anthropic-beta": "server-side-fallback-2026-07-01",
      },
      body: JSON.stringify({
        model: TDI_MODELO,
        max_tokens: 16000,
        // Se o modelo recusar por política, a API tenta de novo num modelo alternativo.
        fallbacks: "default",
        output_config: {
          effort: "medium",
          format: { type: "json_schema", schema: TDI_SCHEMA },
        },
        system: TDI_INSTRUCOES,
        messages: [{ role: "user", content: partes }],
      }),
    });
  } catch (_) {
    throw new Error("Assistente de IA indisponível. Na máquina que roda o proxy, abra um terminal na pasta do projeto e execute: node proxy.js");
  }

  const data = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error((data.error && data.error.message) || `Erro ${resposta.status} ao falar com a IA.`);
  }
  if (data.stop_reason === "refusal") {
    throw new Error("A IA não conseguiu montar este TDI. Reformule a descrição e tente de novo.");
  }
  if (data.stop_reason === "max_tokens") {
    throw new Error("O TDI ficou grande demais e a resposta foi cortada. Tente resumir a descrição.");
  }
  const bloco = (data.content || []).find((b) => b.type === "text");
  let tdi;
  try {
    tdi = JSON.parse(bloco ? bloco.text : "");
  } catch (_) {
    throw new Error("A resposta da IA veio num formato inesperado. Tente de novo.");
  }
  return { titulo: String(tdi.titulo || "").trim(), conteudo: String(tdi.conteudo || "").trim() };
}

function renderTdiConversa() {
  if (!refs.tdiConversa) return;
  const r = state.tdiRascunho;
  const msgs = (state.tdiMensagens || []).map((m) =>
    `<div class="tdi-msg tdi-msg--usuario">${m.imagem ? `<img src="${escapeAttribute(m.imagem)}" alt="" />` : ""}${escapeHtml(m.texto)}</div>`
  ).join("");
  const carregando = state.tdiCarregando
    ? `<div class="tdi-msg tdi-msg--ia tdi-carregando"><span></span><span></span><span></span> Montando o TDI...</div>`
    : "";
  const erro = state.tdiErro ? `<div class="tdi-msg tdi-msg--erro">${escapeHtml(state.tdiErro)}</div>` : "";
  const doc = r && !state.tdiCarregando ? `
    <article class="tdi-rascunho">
      <div class="tdi-rascunho-head">
        <span class="tdi-rascunho-tag">Rascunho · ${escapeHtml(r.cliente)}</span>
      </div>
      <label for="tdiRascunhoTitulo">Título</label>
      <input id="tdiRascunhoTitulo" value="${escapeAttribute(r.titulo)}" maxlength="200" />
      <label for="tdiRascunhoConteudo">Conteúdo</label>
      <textarea id="tdiRascunhoConteudo" rows="14">${escapeHtml(r.conteudo)}</textarea>
      <div class="actions">
        <button type="button" onclick="salvarTdiRascunho()">Salvar TDI</button>
        <button type="button" class="ghost" onclick="descartarTdiRascunho()">Descartar</button>
      </div>
    </article>` : "";
  refs.tdiConversa.innerHTML = msgs + carregando + erro + doc;
  refs.tdiConversa.hidden = !(msgs || carregando || erro || doc);
  if (refs.tdiTexto) {
    refs.tdiTexto.placeholder = r ? "Peça um ajuste no TDI (ex.: inclua o número da nota 1234)..." : "Descreva o TDI...";
  }
  if (refs.tdiCliente) refs.tdiCliente.disabled = Boolean(r) || Boolean(state.tdiCarregando);
}

// Edições manuais no rascunho ficam guardadas antes de um ajuste pela IA.
function tdiCapturarEdicaoRascunho() {
  const r = state.tdiRascunho;
  const titulo = document.getElementById("tdiRascunhoTitulo");
  const conteudo = document.getElementById("tdiRascunhoConteudo");
  if (r && titulo && conteudo) {
    r.titulo = titulo.value;
    r.conteudo = conteudo.value;
  }
}

async function enviarTdiPrompt(event) {
  event.preventDefault();
  if (state.tdiCarregando) return;
  const texto = refs.tdiTexto.value.trim();
  const imagem = state.tdiImagem || "";
  if (!texto && !imagem) return;

  tdiCapturarEdicaoRascunho();
  const rascunho = state.tdiRascunho;
  let cliente = rascunho ? rascunho.cliente : refs.tdiCliente.value.trim();
  if (!rascunho) {
    const cadastrado = state.clientes.find((c) => normalizeText(c.nome) === normalizeText(cliente));
    if (!cadastrado) {
      alert("Escolha o cliente do TDI (campo Cliente, ao lado do clipe).");
      refs.tdiCliente.focus();
      return;
    }
    cliente = cadastrado.nome;
  }

  state.tdiMensagens = (state.tdiMensagens || []).concat({ texto: texto || "(imagem)", imagem });
  state.tdiErro = "";
  state.tdiCarregando = true;
  refs.tdiTexto.value = "";
  tdiAutoAltura();
  // A imagem fica no rascunho (vai junto para a IA nos ajustes e é salva no TDI).
  const imagemDoTdi = imagem || (rascunho ? rascunho.imagem : "");
  state.tdiImagem = "";
  renderTdiImagemPreview();
  tdiAtualizarEnviar();
  renderTdiConversa();

  try {
    const descricao = rascunho ? rascunho.descricao : texto;
    const resultado = await tdiChamarIA({
      cliente,
      descricao,
      imagem: imagemDoTdi,
      rascunho,
      ajuste: rascunho ? texto : "",
    });
    state.tdiRascunho = {
      cliente,
      descricao: rascunho ? `${rascunho.descricao}\n\nAjuste: ${texto}` : texto,
      imagem: imagemDoTdi,
      titulo: resultado.titulo,
      conteudo: resultado.conteudo,
    };
  } catch (err) {
    state.tdiErro = err.message || String(err);
    // Devolve o que foi digitado para o técnico não perder o texto.
    state.tdiMensagens = state.tdiMensagens.slice(0, -1);
    refs.tdiTexto.value = texto;
    if (imagem) { state.tdiImagem = imagem; renderTdiImagemPreview(); }
    tdiAutoAltura();
  } finally {
    state.tdiCarregando = false;
    tdiAtualizarEnviar();
    renderTdiConversa();
  }
}

async function salvarTdiRascunho() {
  tdiCapturarEdicaoRascunho();
  const r = state.tdiRascunho;
  if (!r) return;
  if (!r.titulo.trim() || !r.conteudo.trim()) {
    alert("O TDI precisa de título e conteúdo.");
    return;
  }
  const perfil = (window.auth && window.auth.perfil) || {};
  await sendData("/api/tdis", "POST", {
    id: createId(),
    cliente: r.cliente,
    titulo: r.titulo.trim(),
    conteudo: r.conteudo.trim(),
    descricao: r.descricao,
    imagem: r.imagem || "",
    criadoPorNome: perfil.nome || perfil.email || "",
  });
  limparTdiComposer();
  await reloadTdis();
}

function descartarTdiRascunho() {
  if (!confirm("Descartar este rascunho de TDI?")) return;
  limparTdiComposer();
}

function limparTdiComposer() {
  state.tdiRascunho = null;
  state.tdiMensagens = [];
  state.tdiErro = "";
  state.tdiImagem = "";
  if (refs.tdiCliente) refs.tdiCliente.value = "";
  renderTdiImagemPreview();
  renderTdiConversa();
  tdiAtualizarEnviar();
}

window.verTdi = verTdi;
window.salvarTdiRascunho = salvarTdiRascunho;
window.descartarTdiRascunho = descartarTdiRascunho;
window.removerTdiImagem = removerTdiImagem;
window.deleteEscalaExcecao = deleteEscalaExcecao;
window.editAtualizacao = editAtualizacao;
window.removerAtuClienteLote = removerAtuClienteLote;
window.confirmarAtualizacao = confirmarAtualizacao;
window.deleteAtualizacao = deleteAtualizacao;
window.editForcaVendas = editForcaVendas;
window.copyFvCienciaLinkById = copyFvCienciaLinkById;
window.verFvCienciaDetalhe = verFvCienciaDetalhe;
window.deleteFvCiencia = deleteFvCiencia;
window.toggleSpedGroup = toggleSpedGroup;
window.toggleProcGroup = toggleProcGroup;
window.editIssue = editIssue;
window.deleteIssue = deleteIssue;
window.editSpedCorrection = editSpedCorrection;
window.deleteSpedCorrection = deleteSpedCorrection;
window.editSpedClient = editSpedClient;
window.deleteSpedClient = deleteSpedClient;
window.editProcedimento = editProcedimento;
window.deleteProcedimento = deleteProcedimento;
window.openProcObsModal = openProcObsModal;
window.editDiario = editDiario;
window.deleteDiario = deleteDiario;
window.editCliente = editCliente;
window.deleteCliente = deleteCliente;
window.populateMatrizOptions = populateMatrizOptions;
window.toggleMatrizFiliais = toggleMatrizFiliais;
window.editTecnico = editTecnico;
window.deleteTecnico = deleteTecnico;

// ── Usuários e acesso (usuarios.html, somente admin) ─────────────────────────

const PAPEL_LABELS = { admin: "Administrador", tecnico: "Técnico", consulta: "Consulta", qualidade: "Qualidade" };

function toUsuarioJs(row) {
  return {
    id: row.id,
    nome: row.nome || "",
    email: row.email || "",
    papel: row.papel || "consulta",
    ativo: row.ativo === true,
    // null = todas as rotinas liberadas (ver supabase/perfis_rotinas.sql)
    rotinas: Array.isArray(row.rotinas) ? row.rotinas : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadUsuarios() {
  const { data, error } = await db.from("perfis").select("*").order("nome");
  if (error) throw error;
  state.usuarios = data.map(toUsuarioJs);
}

function renderUsuarios() {
  if (!refs.usuarioTableBody) return;
  const term = normalizeText(refs.usuarioSearchInput ? refs.usuarioSearchInput.value : "");
  const papel = refs.usuarioPapelFilter ? refs.usuarioPapelFilter.value : "";
  const status = refs.usuarioStatusFilter ? refs.usuarioStatusFilter.value : "";
  const meuId = window.auth && window.auth.user ? window.auth.user.id : null;

  const filtered = state.usuarios.filter((u) =>
    (!term || normalizeText(u.nome).includes(term) || normalizeText(u.email).includes(term)) &&
    (!papel || u.papel === papel) &&
    (!status || (status === "ativo" ? u.ativo : !u.ativo))
  );

  refs.usuarioTableBody.innerHTML = filtered.map((u) => {
    const souEu = u.id === meuId;
    const id = escapeAttribute(String(u.id));
    const options = Object.entries(PAPEL_LABELS).map(([value, label]) =>
      `<option value="${value}"${u.papel === value ? " selected" : ""}>${label}</option>`
    ).join("");
    const acao = souEu
      ? ""
      : u.ativo
        ? `<button type="button" class="ghost" onclick="toggleUsuarioAtivo('${id}', false)">Desativar</button>`
        : `<button type="button" onclick="toggleUsuarioAtivo('${id}', true)">Ativar</button>`;
    return `
    <tr>
      <td><strong>${escapeHtml(u.nome || "—")}</strong>${souEu ? ' <span class="user-you-badge">você</span>' : ""}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>
        <select class="usuario-papel-select" aria-label="Perfil de ${escapeAttribute(u.nome || u.email)}"
          onchange="changeUsuarioPapel('${id}', this.value)"${souEu ? ' disabled title="Você não pode alterar o próprio perfil"' : ""}>${options}</select>
      </td>
      <td><span class="status ${u.ativo ? "status-ativo" : "status-inativo"}">${u.ativo ? "Ativo" : "Inativo"}</span></td>
      <td>${usuarioRotinasCelula(u, id)}</td>
      <td>${escapeHtml(u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "")}</td>
      <td><div class="small-actions">${acao}</div></td>
    </tr>`;
  }).join("");

  if (refs.usuarioEmptyState) refs.usuarioEmptyState.style.display = filtered.length ? "none" : "block";
  if (refs.usuarioSummary) {
    const ativos = state.usuarios.filter((u) => u.ativo).length;
    const admins = state.usuarios.filter((u) => u.ativo && u.papel === "admin").length;
    refs.usuarioSummary.innerHTML = `
      <div class="summary-item"><strong>${state.usuarios.length}</strong><span>Usuários</span></div>
      <div class="summary-item"><strong>${ativos}</strong><span>Ativos</span></div>
      <div class="summary-item"><strong>${state.usuarios.length - ativos}</strong><span>Inativos / pendentes</span></div>
      <div class="summary-item"><strong>${admins}</strong><span>Administradores</span></div>`;
  }
}

async function updateUsuario(id, changes) {
  if (!window.auth || !window.auth.can("admin")) {
    alert("Somente administradores podem gerenciar usuários.");
    renderUsuarios();
    return;
  }
  const { data, error } = await db.from("perfis").update(changes).eq("id", id).select("id");
  if (error) {
    alert("Não foi possível atualizar o usuário: " + (error.message || JSON.stringify(error)));
  } else if (!data || !data.length) {
    alert("Não foi possível atualizar o usuário (sem permissão ou usuário não encontrado).");
  }
  await loadUsuarios();
  renderUsuarios();
}

function changeUsuarioPapel(id, papel) {
  const item = state.usuarios.find((u) => String(u.id) === String(id));
  if (!item || item.papel === papel) return;
  if (!confirm(`Alterar o perfil de ${item.nome || item.email} para "${PAPEL_LABELS[papel]}"?`)) {
    renderUsuarios();
    return;
  }
  return updateUsuario(id, { papel });
}

function toggleUsuarioAtivo(id, ativo) {
  const item = state.usuarios.find((u) => String(u.id) === String(id));
  if (!item) return;
  if (!confirm(`${ativo ? "Ativar" : "Desativar"} o acesso de ${item.nome || item.email}?`)) return;
  return updateUsuario(id, { ativo });
}

// ── Rotinas liberadas por usuário (perfis.rotinas) ──
// A lista de rotinas vem do auth.js (window.auth.ROTINAS). Admin acessa tudo.

function usuarioRotinasLista() {
  return (window.auth && window.auth.ROTINAS) || [];
}

// Padrão do papel quando perfis.rotinas é null (ex.: Qualidade = só TDI); null = todas.
function usuarioRotinasPadrao(papel) {
  const padroes = (window.auth && window.auth.ROTINAS_PADRAO_POR_PAPEL) || {};
  return padroes[papel] || null;
}

// Rotinas que valem de fato para o usuário (gravadas, padrão do papel ou todas).
function usuarioRotinasEfetivas(u) {
  return u.rotinas || usuarioRotinasPadrao(u.papel) || usuarioRotinasLista().map((r) => r.href);
}

function usuarioRotinasCelula(u, id) {
  if (u.papel === "admin") return `<span class="helper-text">Todas (administrador)</span>`;
  const total = usuarioRotinasLista().length;
  const efetivas = usuarioRotinasEfetivas(u);
  const nomes = usuarioRotinasLista().filter((r) => efetivas.includes(r.href)).map((r) => r.label);
  const liberadas = nomes.length;
  const texto = liberadas === total ? "Todas" : liberadas === 0 ? "Nenhuma" : liberadas === 1 ? nomes[0] : `${liberadas} de ${total}`;
  const titulo = liberadas === total ? "Todas as rotinas liberadas" : nomes.join(", ") || "Nenhuma rotina liberada";
  return `<button type="button" class="ghost usuario-rotinas-btn" title="${escapeAttribute(titulo)}" onclick="openUsuarioRotinas('${id}')">${escapeHtml(texto)}</button>`;
}

function openUsuarioRotinas(id) {
  const u = state.usuarios.find((x) => String(x.id) === String(id));
  if (!u || !refs.usuarioRotinasModal) return;
  refs.usuarioRotinasId.value = u.id;
  refs.usuarioRotinasInfo.textContent = `Rotinas que ${u.nome || u.email} (${PAPEL_LABELS[u.papel] || u.papel}) pode usar. As desmarcadas somem do menu e ficam bloqueadas para ele.`;
  refs.usuarioRotinasLista.innerHTML = usuarioRotinasLista().map((r, i) => {
    const marcada = usuarioRotinasEfetivas(u).includes(r.href);
    return `<label class="usuario-rotina-item" for="usuarioRotina${i}">
      <input type="checkbox" id="usuarioRotina${i}" value="${escapeAttribute(r.href)}"${marcada ? " checked" : ""} />
      <span>${escapeHtml(r.label)}</span>
    </label>`;
  }).join("");
  openModal(refs.usuarioRotinasModal);
}

function marcarUsuarioRotinas(marcar) {
  if (!refs.usuarioRotinasLista) return;
  refs.usuarioRotinasLista.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = marcar; });
}

async function saveUsuarioRotinas(event) {
  event.preventDefault();
  const id = refs.usuarioRotinasId.value;
  const marcadas = [...refs.usuarioRotinasLista.querySelectorAll('input[type="checkbox"]:checked')].map((cb) => cb.value);
  // Tudo marcado = null ("todas"): rotinas novas do sistema já entram liberadas.
  // Papel com padrão próprio (ex.: Qualidade) grava sempre a lista explícita,
  // porque para ele null significa "só o padrão".
  const u = state.usuarios.find((x) => String(x.id) === String(id));
  const temPadrao = u && usuarioRotinasPadrao(u.papel);
  const rotinas = !temPadrao && marcadas.length === usuarioRotinasLista().length ? null : marcadas;
  closeModal(refs.usuarioRotinasModal);
  await updateUsuario(id, { rotinas });
}

window.openUsuarioRotinas = openUsuarioRotinas;
window.changeUsuarioPapel = changeUsuarioPapel;
window.toggleUsuarioAtivo = toggleUsuarioAtivo;

function focusUsuarioForm() {
  if (refs.usuarioForm) refs.usuarioForm.reset();
  openModal(refs.usuarioFormModal, refs.usuarioNome);
}

// Cria o usuário no Supabase Auth com um cliente separado, sem persistir sessão
// — assim o admin continua logado. O trigger do banco cria o perfil (inativo,
// "consulta"); em seguida o admin grava nome e papel e ativa.
async function saveUsuario(event) {
  event.preventDefault();
  if (!window.auth || !window.auth.can("admin")) {
    alert("Somente administradores podem cadastrar usuários.");
    return;
  }
  const nome = refs.usuarioNome.value.trim();
  const email = refs.usuarioEmail.value.trim().toLowerCase();
  const senha = refs.usuarioSenha.value;
  const papel = refs.usuarioPapel.value;
  if (!nome || !email) { alert("Preencha nome e e-mail."); return; }
  if (!senha || senha.length < 8) { alert("A senha provisória deve ter pelo menos 8 caracteres."); return; }

  const submitBtn = event.submitter || refs.usuarioForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  try {
    const signupClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "gestao-suporte-cadastro" }
    });
    const { data, error } = await signupClient.auth.signUp({
      email,
      password: senha,
      options: { data: { nome }, emailRedirectTo: new URL("login.html", window.location.href).href }
    });
    if (error) throw new Error(window.auth.traduzirErro(error));
    // E-mail já cadastrado: o Supabase devolve um usuário sem identidades.
    if (!data.user || (Array.isArray(data.user.identities) && !data.user.identities.length)) {
      throw new Error("Este e-mail já está cadastrado. Localize o usuário na lista para ativá-lo ou alterar o perfil.");
    }

    const { data: updated, error: updateError } = await db.from("perfis")
      .update({ nome, papel, ativo: true }).eq("id", data.user.id).select("id");
    if (updateError) throw updateError;
    if (!updated || !updated.length) {
      throw new Error("Usuário criado, mas o perfil não foi encontrado. Verifique se o script supabase/auth.sql foi executado.");
    }

    closeModal(refs.usuarioFormModal);
    await loadUsuarios();
    renderUsuarios();
    alert(data.session
      ? "Usuário criado e liberado. Informe a senha provisória — ela pode ser trocada em \"Alterar senha\"."
      : "Usuário criado e liberado. Ele precisa confirmar o e-mail (link enviado) antes do primeiro acesso.");
  } catch (err) {
    alert("Erro ao cadastrar usuário: " + (err.message || JSON.stringify(err)));
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

// ── Técnicos ─────────────────────────────────────────────────────────────────

function focusTecnicoForm() {
  resetTecnicoForm();
  openModal(refs.tecnicoFormModal, refs.tecnicoNome);
}

async function saveTecnico(event) {
  event.preventDefault();
  const tecnicoId = refs.tecnicoId.value || null;
  const payload = {
    id: tecnicoId || createId(),
    nome: refs.tecnicoNome.value.trim(),
    email: refs.tecnicoEmail ? refs.tecnicoEmail.value.trim() : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (!payload.nome) { alert("Preencha o nome do técnico."); return; }
  try {
    await sendData(
      tecnicoId ? `/api/tecnicos/${encodeURIComponent(payload.id)}` : "/api/tecnicos",
      tecnicoId ? "PUT" : "POST",
      payload
    );
    resetTecnicoForm();
    closeModal(refs.tecnicoFormModal);
  } catch (err) {
    alert("Erro ao salvar técnico: " + (err.message || JSON.stringify(err)));
  }
}

function editTecnico(id) {
  const item = state.tecnicos.find((t) => String(t.id) === String(id));
  if (!item) return;
  refs.tecnicoId.value = item.id;
  refs.tecnicoNome.value = item.nome || "";
  if (refs.tecnicoEmail) refs.tecnicoEmail.value = item.email || "";
  openModal(refs.tecnicoFormModal, refs.tecnicoNome);
}

async function deleteTecnico(id) {
  if (!confirm("Deseja excluir este técnico?")) return;
  await deleteData(`/api/tecnicos/${encodeURIComponent(id)}`);
}

function cancelTecnicoEdit() {
  resetTecnicoForm();
  closeModal(refs.tecnicoFormModal);
}

function resetTecnicoForm() {
  if (refs.tecnicoForm) refs.tecnicoForm.reset();
  if (refs.tecnicoId) refs.tecnicoId.value = "";
}

function renderTecnicos() {
  if (!refs.tecnicoTableBody) return;
  const term = normalizeText(refs.tecnicoSearchInput ? refs.tecnicoSearchInput.value : "");
  const filtered = state.tecnicos.filter((t) =>
    !term || normalizeText(t.nome).includes(term) || normalizeText(t.email).includes(term)
  );
  const visible = applyListLimit(filtered, "tecnicos");
  refs.tecnicoTableBody.innerHTML = visible.map((t) => `
    <tr>
      <td>${escapeHtml(t.nome)}</td>
      <td>${escapeHtml(t.email)}</td>
      <td>
        <div class="small-actions">
          <button type="button" onclick="editTecnico('${escapeAttribute(String(t.id))}')">Editar</button>
          <button type="button" class="danger" onclick="deleteTecnico('${escapeAttribute(String(t.id))}')">Excluir</button>
        </div>
      </td>
    </tr>`).join("");
  if (refs.tecnicoEmptyState) refs.tecnicoEmptyState.style.display = filtered.length ? "none" : "block";
  updateShowMoreButton(refs.tecnicoShowMoreWrap, refs.tecnicoShowMoreBtn, "tecnicos", filtered.length);
}

function renderTecnicoComboMenu(input, menuEl) {
  if (!menuEl || !input) return;
  const typed = normalizeText(input.value);
  const filtered = state.tecnicos.filter((t) => !typed || normalizeText(t.nome).includes(typed));
  if (!filtered.length) {
    menuEl.innerHTML = `<div class="combo-empty">Nenhum técnico encontrado.</div>`;
    return;
  }
  menuEl.innerHTML = filtered.map((t) =>
    `<button type="button" class="combo-option" data-nome="${escapeAttribute(t.nome)}">${escapeHtml(t.nome)}${t.email ? `<small class="combo-phone"> · ${escapeHtml(t.email)}</small>` : ""}</button>`
  ).join("");
  menuEl.querySelectorAll("[data-nome]").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      input.value = btn.getAttribute("data-nome");
      menuEl.classList.remove("open");
    });
  });
}

function openSpedTecnicoMenu() {
  if (!refs.spedTecnicoMenu || refs.spedTecnico.readOnly) return;
  renderTecnicoComboMenu(refs.spedTecnico, refs.spedTecnicoMenu);
  refs.spedTecnicoMenu.classList.add("open");
}

function closeSpedTecnicoMenuLater() {
  setTimeout(() => { if (refs.spedTecnicoMenu) refs.spedTecnicoMenu.classList.remove("open"); }, 120);
}

function openProcTecnicoMenu() {
  if (!refs.procTecnicoMenu || refs.procTecnico.readOnly) return;
  renderTecnicoComboMenu(refs.procTecnico, refs.procTecnicoMenu);
  refs.procTecnicoMenu.classList.add("open");
}

function closeProcTecnicoMenuLater() {
  setTimeout(() => { if (refs.procTecnicoMenu) refs.procTecnicoMenu.classList.remove("open"); }, 120);
}

// ── Tipos de Procedimento ────────────────────────────────────────────────────

function focusTipoProcForm() {
  resetTipoProcForm();
  openModal(refs.tipoProcFormModal, refs.tipoProcNome);
}

async function saveTipoProc(event) {
  event.preventDefault();
  const tipoProcId = refs.tipoProcId.value || null;
  const payload = {
    id: tipoProcId || createId(),
    nome: refs.tipoProcNome.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!payload.nome) {
    alert("Informe o nome do tipo de procedimento.");
    return;
  }

  try {
    await sendData(
      tipoProcId ? `/api/tipos-procedimento/${encodeURIComponent(payload.id)}` : "/api/tipos-procedimento",
      tipoProcId ? "PUT" : "POST",
      payload
    );
    resetTipoProcForm();
    closeModal(refs.tipoProcFormModal);
  } catch (err) {
    alert("Erro ao salvar tipo de procedimento: " + (err.message || JSON.stringify(err)));
  }
}

function editTipoProc(id) {
  const item = state.tiposProcedimento.find((t) => String(t.id) === String(id));
  if (!item) return;
  refs.tipoProcId.value = item.id;
  refs.tipoProcNome.value = item.nome || "";
  openModal(refs.tipoProcFormModal, refs.tipoProcNome);
}

async function deleteTipoProc(id) {
  if (!confirm("Deseja excluir este tipo de procedimento?")) return;
  await deleteData(`/api/tipos-procedimento/${encodeURIComponent(id)}`);
}

function cancelTipoProcEdit() {
  resetTipoProcForm();
  closeModal(refs.tipoProcFormModal);
}

function resetTipoProcForm() {
  if (refs.tipoProcForm) refs.tipoProcForm.reset();
  if (refs.tipoProcId) refs.tipoProcId.value = "";
}

function renderTiposProc() {
  if (!refs.tipoProcTableBody) return;
  const term = normalizeText(refs.tipoProcSearchInput ? refs.tipoProcSearchInput.value : "");
  const filtered = state.tiposProcedimento.filter((t) =>
    !term || normalizeText(t.nome).includes(term)
  );
  const visible = applyListLimit(filtered, "tiposProc");
  refs.tipoProcTableBody.innerHTML = visible.map((t) => `
    <tr>
      <td>${escapeHtml(t.nome)}</td>
      <td>
        <div class="small-actions">
          <button type="button" onclick="editTipoProc('${escapeAttribute(String(t.id))}')">Editar</button>
          <button type="button" class="danger" onclick="deleteTipoProc('${escapeAttribute(String(t.id))}')">Excluir</button>
        </div>
      </td>
    </tr>`).join("");
  if (refs.tipoProcEmptyState) refs.tipoProcEmptyState.style.display = filtered.length ? "none" : "block";
  updateShowMoreButton(refs.tipoProcShowMoreWrap, refs.tipoProcShowMoreBtn, "tiposProc", filtered.length);
}

function populateProcTipoSelect() {
  if (!refs.procTipo) return;
  const current = refs.procTipo.value;
  refs.procTipo.innerHTML = '<option value="">Selecione</option>' +
    state.tiposProcedimento
      .slice()
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((t) => `<option value="${escapeAttribute(t.nome)}">${escapeHtml(t.nome)}</option>`)
      .join("");
  if (current) refs.procTipo.value = current;
}

window.editTipoProc = editTipoProc;
window.deleteTipoProc = deleteTipoProc;

// ── Implantação ──────────────────────────────────────────────────────────────

function findImplantacao(clienteName) {
  return state.implantacoes.find((i) => normalizeText(i.cliente) === normalizeText(clienteName));
}

function blankImplantacao(clienteName) {
  return {
    id: null,
    cliente: clienteName,
    status: "Em andamento",
    tecnico: "",
    enquadramento: "",
    estrutura: "",
    baseGerencialQtd: "",
    baseGerencialDescricao: "",
    baseFiscalQtd: "",
    baseFiscalDescricao: "",
    qtdMaquinas: "",
    maquinas: [],
    reunioes: [],
    cronograma: [],
    financeiro: [],
  };
}

function blankMaquina() {
  return { descricao: "", codigo: "", senha: "" };
}

let implMaquinasDraft = [];

async function persistImplantacao(record) {
  const payload = { ...record, updatedAt: new Date().toISOString() };
  try {
    if (!payload.id) {
      payload.id = createId();
      payload.createdAt = payload.updatedAt;
      await sendData("/api/implantacoes", "POST", payload);
    } else {
      await sendData(`/api/implantacoes/${encodeURIComponent(payload.id)}`, "PUT", payload);
    }
    return true;
  } catch (err) {
    alert("Erro ao salvar implantação: " + (err.message || JSON.stringify(err)));
    return false;
  }
}

function openImplFormModal() {
  if (!state.implSelectedClient) return;
  const record = findImplantacao(state.implSelectedClient) || blankImplantacao(state.implSelectedClient);

  if (refs.implId) refs.implId.value = record.id || "";
  if (refs.implCliente) refs.implCliente.value = state.implSelectedClient;
  if (refs.implTecnico) refs.implTecnico.value = record.tecnico || "";
  if (refs.implStatus) refs.implStatus.value = record.status || "Em andamento";
  if (refs.implEnquadramento) refs.implEnquadramento.value = record.enquadramento || "";
  if (refs.implBaseGerencialQtd) refs.implBaseGerencialQtd.value = record.baseGerencialQtd || "";
  if (refs.implBaseGerencialDescricao) refs.implBaseGerencialDescricao.value = record.baseGerencialDescricao || "";
  if (refs.implBaseFiscalQtd) refs.implBaseFiscalQtd.value = record.baseFiscalQtd || "";
  if (refs.implBaseFiscalDescricao) refs.implBaseFiscalDescricao.value = record.baseFiscalDescricao || "";
  if (refs.implEstrutura) refs.implEstrutura.value = record.estrutura || "";

  implMaquinasDraft = (record.maquinas || []).map((m) => ({
    descricao: m.descricao || "",
    codigo: m.codigo || "",
    senha: m.senha || "",
  }));
  if (refs.implQtdMaquinas) refs.implQtdMaquinas.value = implMaquinasDraft.length || "";
  renderImplMaquinasFieldsFromDraft();

  openModal(refs.implFormModal, refs.implTecnico);
}

function syncImplMaquinasDraftFromDom() {
  if (!refs.implMaquinasFields) return;
  const descs = refs.implMaquinasFields.querySelectorAll(".impl-maquina-descricao");
  const cods = refs.implMaquinasFields.querySelectorAll(".impl-maquina-codigo");
  const senhas = refs.implMaquinasFields.querySelectorAll(".impl-maquina-senha");
  descs.forEach((el, idx) => {
    if (!implMaquinasDraft[idx]) implMaquinasDraft[idx] = blankMaquina();
    implMaquinasDraft[idx].descricao = el.value.trim();
  });
  cods.forEach((el, idx) => { if (implMaquinasDraft[idx]) implMaquinasDraft[idx].codigo = el.value.trim(); });
  senhas.forEach((el, idx) => { if (implMaquinasDraft[idx]) implMaquinasDraft[idx].senha = el.value; });
}

function renderImplMaquinasFieldsFromDraft() {
  if (!refs.implMaquinasFields) return;
  if (refs.implMaquinasSection) refs.implMaquinasSection.style.display = implMaquinasDraft.length ? "" : "none";
  refs.implMaquinasFields.innerHTML = implMaquinasDraft.map((m, idx) => `
    <div class="col-4">
      <label>Descrição (máquina ${idx + 1})</label>
      <input class="impl-maquina-descricao" value="${escapeAttribute(m.descricao)}" placeholder="Ex.: PC Recepção" />
    </div>
    <div class="col-4">
      <label>Código de acesso</label>
      <input class="impl-maquina-codigo" value="${escapeAttribute(m.codigo)}" autocomplete="off" />
    </div>
    <div class="col-4">
      <label>Senha de acesso</label>
      <input class="impl-maquina-senha" value="${escapeAttribute(m.senha)}" autocomplete="off" />
    </div>
  `).join("");
  refs.implMaquinasFields.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", syncImplMaquinasDraftFromDom);
  });
}

function onImplQtdMaquinasChange() {
  const raw = refs.implQtdMaquinas.value;
  const nextCount = raw === "" ? 0 : Math.max(0, parseInt(raw, 10) || 0);
  syncImplMaquinasDraftFromDom();

  if (nextCount < implMaquinasDraft.length) {
    const removed = implMaquinasDraft.slice(nextCount);
    const hasData = removed.some((m) => m.descricao || m.codigo || m.senha);
    if (hasData && !confirm("Reduzir a quantidade de máquinas vai remover os dados preenchidos das máquinas removidas. Deseja continuar?")) {
      refs.implQtdMaquinas.value = implMaquinasDraft.length;
      return;
    }
  }

  while (implMaquinasDraft.length < nextCount) implMaquinasDraft.push(blankMaquina());
  implMaquinasDraft.length = nextCount;
  renderImplMaquinasFieldsFromDraft();
}

async function saveImplantacao(event) {
  event.preventDefault();
  const cliente = refs.implCliente.value.trim();
  if (!cliente) return;
  syncImplMaquinasDraftFromDom();
  const existing = findImplantacao(cliente) || blankImplantacao(cliente);
  const maquinas = implMaquinasDraft.map((m) => ({
    descricao: m.descricao,
    codigo: m.codigo,
    senha: m.senha,
  }));
  const payload = {
    ...existing,
    cliente,
    tecnico: refs.implTecnico.value.trim(),
    status: refs.implStatus.value,
    enquadramento: refs.implEnquadramento.value,
    baseGerencialQtd: refs.implBaseGerencialQtd.value === "" ? "" : Math.max(0, parseInt(refs.implBaseGerencialQtd.value, 10) || 0),
    baseGerencialDescricao: refs.implBaseGerencialDescricao.value.trim(),
    baseFiscalQtd: refs.implBaseFiscalQtd.value === "" ? "" : Math.max(0, parseInt(refs.implBaseFiscalQtd.value, 10) || 0),
    baseFiscalDescricao: refs.implBaseFiscalDescricao.value.trim(),
    estrutura: refs.implEstrutura.value.trim(),
    qtdMaquinas: maquinas.length,
    maquinas,
  };
  const ok = await persistImplantacao(payload);
  if (!ok) return;
  closeModal(refs.implFormModal);
}

function storageDateSortKey(d) {
  if (d && d.length === 10 && d[2] === "/") return `${d.slice(6)}-${d.slice(3, 5)}-${d.slice(0, 2)}`;
  return d || "";
}

function renderImplantacao() {
  renderImplClientMenu();

  const selected = state.implSelectedClient;
  if (!selected) {
    if (refs.implClientView) refs.implClientView.style.display = "none";
    if (refs.implNoClientState) refs.implNoClientState.style.display = "block";
    return;
  }

  if (refs.implClientView) refs.implClientView.style.display = "";
  if (refs.implNoClientState) refs.implNoClientState.style.display = "none";

  const record = findImplantacao(selected);

  renderImplSummary(record);
  renderImplCronograma(record || blankImplantacao(selected));
  renderImplReunioes(record || blankImplantacao(selected));
  renderImplFinanceiro(record || blankImplantacao(selected));
}

function renderImplAbertas() {
  if (!refs.implAbertasList) return;
  const wantedStatus = state.activeImplTab === "concluido" ? "Concluído" : "Em andamento";
  const items = state.implantacoes
    .filter((i) => (i.status || "Em andamento") === wantedStatus)
    .slice()
    .sort((a, b) => a.cliente.localeCompare(b.cliente));
  if (refs.implAbertasEmptyState) {
    refs.implAbertasEmptyState.textContent = state.activeImplTab === "concluido"
      ? "Nenhuma implantação concluída no momento."
      : "Nenhuma implantação em aberto no momento.";
    refs.implAbertasEmptyState.style.display = items.length ? "none" : "block";
  }
  refs.implAbertasList.innerHTML = items.map((item) => `
    <button type="button" class="client-list-item is-clickable" data-impl-abertas-cliente="${escapeAttribute(item.cliente)}">
      <div class="client-list-info">
        <strong>${escapeHtml(item.cliente)}</strong>
        ${item.tecnico ? `<span class="client-list-phone">Técnico: ${escapeHtml(item.tecnico)}</span>` : ""}
      </div>
      <span class="status ${getStatusClass(item.status || "Em andamento")}">${escapeHtml(item.status || "Em andamento")}</span>
    </button>
  `).join("");
  refs.implAbertasList.querySelectorAll("[data-impl-abertas-cliente]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectImplClient(btn.getAttribute("data-impl-abertas-cliente"));
      const section = document.getElementById("implFichaSection");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function formatBaseSummary(qtd, descricao) {
  if (qtd === "" || qtd === null || qtd === undefined) return descricao ? descricao : "—";
  return descricao ? `${qtd} — ${descricao}` : String(qtd);
}

function renderImplSummary(record) {
  const data = record || blankImplantacao(state.implSelectedClient);
  const visible = state.implSummaryVisible;

  if (refs.implSumTecnico) refs.implSumTecnico.textContent = data.tecnico || "—";
  if (refs.implSumStatus) {
    const status = data.status || "Em andamento";
    refs.implSumStatus.innerHTML = `<span class="status ${getStatusClass(status)}">${escapeHtml(status)}</span>`;
  }
  if (refs.implSumEnquadramento) refs.implSumEnquadramento.textContent = data.enquadramento || "—";
  if (refs.implSumQtd) refs.implSumQtd.textContent = (data.maquinas || []).length || "—";

  if (refs.implToggleSummaryBtn) refs.implToggleSummaryBtn.textContent = visible ? "Ocultar estrutura e acessos" : "Mostrar estrutura e acessos";
  if (refs.implSummaryCard) refs.implSummaryCard.style.display = visible ? "" : "none";
  if (!visible) return;

  if (refs.implSumBaseGerencial) refs.implSumBaseGerencial.textContent = formatBaseSummary(data.baseGerencialQtd, data.baseGerencialDescricao);
  if (refs.implSumBaseFiscal) refs.implSumBaseFiscal.textContent = formatBaseSummary(data.baseFiscalQtd, data.baseFiscalDescricao);
  if (refs.implSumEstrutura) refs.implSumEstrutura.textContent = data.estrutura || "—";

  if (refs.implSumMaquinasList) {
    const maquinas = data.maquinas || [];
    refs.implSumMaquinasList.innerHTML = maquinas.length
      ? maquinas.map(renderImplMaquinaSummaryRow).join("")
      : `<p class="impl-maquinas-empty">Nenhuma máquina cadastrada.</p>`;
    bindImplSenhaToggle();
  }
}

function renderImplMaquinaSummaryRow(m, idx) {
  return `
    <div class="impl-maquina-summary-row">
      <strong>${escapeHtml(m.descricao || `Máquina ${idx + 1}`)}</strong>
      <span>Código: ${escapeHtml(m.codigo || "—")}</span>
      <span class="impl-senha-wrap">
        Senha: <span class="impl-senha-value" data-real="${escapeAttribute(m.senha || "")}" data-visible="false">••••••</span>
        <button type="button" class="ghost impl-toggle-senha">Mostrar</button>
      </span>
    </div>`;
}

function bindImplSenhaToggle() {
  if (!refs.implSumMaquinasList) return;
  refs.implSumMaquinasList.querySelectorAll(".impl-toggle-senha").forEach((btn) => {
    btn.addEventListener("click", () => {
      const valueEl = btn.previousElementSibling;
      if (!valueEl) return;
      const visible = valueEl.getAttribute("data-visible") === "true";
      valueEl.textContent = visible ? "••••••" : (valueEl.getAttribute("data-real") || "");
      valueEl.setAttribute("data-visible", String(!visible));
      btn.textContent = visible ? "Mostrar" : "Ocultar";
    });
  });
}

function renderImplCronograma(record) {
  const rows = (record.cronograma || []).slice().sort((a, b) => storageDateSortKey(a.data || "").localeCompare(storageDateSortKey(b.data || "")));
  if (refs.implCronogramaTableBody) refs.implCronogramaTableBody.innerHTML = rows.map(renderImplEtapaRow).join("");
  if (refs.implCronogramaEmptyState) refs.implCronogramaEmptyState.style.display = rows.length ? "none" : "block";
}

function renderImplEtapaRow(etapa) {
  return `<tr>
    <td>${escapeHtml(etapa.etapa)}</td>
    <td>${escapeHtml(etapa.tecnico || "—")}</td>
    <td>${escapeHtml(formatDate(etapa.data || ""))}</td>
    <td><span class="status ${getStatusClass(etapa.status)}">${escapeHtml(etapa.status)}</span></td>
    <td>
      <div class="small-actions">
        <button type="button" onclick="editImplEtapa('${escapeAttribute(etapa.id)}')">Editar</button>
        <button type="button" class="ghost" onclick="deleteImplEtapa('${escapeAttribute(etapa.id)}')">Excluir</button>
      </div>
    </td>
  </tr>`;
}

function renderImplReunioes(record) {
  const items = (record.reunioes || []).slice().sort((a, b) => storageDateSortKey(b.data || "").localeCompare(storageDateSortKey(a.data || "")));
  if (refs.implReuniaoList) refs.implReuniaoList.innerHTML = items.map(renderImplReuniaoEntry).join("");
  if (refs.implReuniaoEmptyState) refs.implReuniaoEmptyState.style.display = items.length ? "none" : "block";
}

function renderImplReuniaoEntry(item) {
  return `
    <div class="timeline-item">
      <div class="timeline-dot timeline-dot-diario"></div>
      <div class="timeline-card">
        <div class="timeline-card-info">
          <div class="timeline-card-header">
            ${item.data ? `<span class="timeline-date">${escapeHtml(formatDate(item.data))}</span>` : ""}
          </div>
          <span class="timeline-body">${escapeHtml(item.texto)}</span>
        </div>
        <div class="small-actions">
          <button type="button" onclick="editImplReuniao('${escapeAttribute(item.id)}')">Editar</button>
          <button type="button" class="ghost" onclick="deleteImplReuniao('${escapeAttribute(item.id)}')">Excluir</button>
        </div>
      </div>
    </div>`;
}

function focusImplEtapaForm() {
  if (!state.implSelectedClient) return;
  resetImplEtapaForm();
  openModal(refs.implEtapaFormModal, refs.implEtapaNome);
}

async function saveImplEtapa(event) {
  event.preventDefault();
  const cliente = state.implSelectedClient;
  if (!cliente) return;
  const etapaId = refs.implEtapaId.value || null;
  const nome = refs.implEtapaNome.value.trim();
  if (!nome) {
    alert("Informe o nome da etapa.");
    return;
  }
  const record = findImplantacao(cliente) || blankImplantacao(cliente);
  const cronograma = [...(record.cronograma || [])];
  const entry = {
    id: etapaId || createId(),
    etapa: nome,
    tecnico: refs.implEtapaTecnico.value.trim(),
    data: toStorageDate(refs.implEtapaData.value),
    status: refs.implEtapaStatus.value,
  };
  if (etapaId) {
    const idx = cronograma.findIndex((e) => String(e.id) === String(etapaId));
    if (idx >= 0) cronograma[idx] = entry; else cronograma.push(entry);
  } else {
    cronograma.push(entry);
  }
  const ok = await persistImplantacao({ ...record, cronograma });
  if (!ok) return;
  resetImplEtapaForm();
  closeModal(refs.implEtapaFormModal);
}

function editImplEtapa(id) {
  const record = findImplantacao(state.implSelectedClient);
  const etapa = record && (record.cronograma || []).find((e) => String(e.id) === String(id));
  if (!etapa) return;
  refs.implEtapaId.value = etapa.id;
  refs.implEtapaNome.value = etapa.etapa || "";
  refs.implEtapaTecnico.value = etapa.tecnico || "";
  refs.implEtapaData.value = storageToInputDate(etapa.data || "");
  refs.implEtapaStatus.value = etapa.status || "Pendente";
  openModal(refs.implEtapaFormModal, refs.implEtapaNome);
}

async function deleteImplEtapa(id) {
  if (!confirm("Deseja excluir esta etapa do cronograma?")) return;
  const record = findImplantacao(state.implSelectedClient);
  if (!record) return;
  const cronograma = (record.cronograma || []).filter((e) => String(e.id) !== String(id));
  await persistImplantacao({ ...record, cronograma });
}

function cancelImplEtapaEdit() {
  resetImplEtapaForm();
  closeModal(refs.implEtapaFormModal);
}

function resetImplEtapaForm() {
  if (refs.implEtapaForm) refs.implEtapaForm.reset();
  if (refs.implEtapaId) refs.implEtapaId.value = "";
  if (refs.implEtapaStatus) refs.implEtapaStatus.value = "Pendente";
}

function focusImplReuniaoForm() {
  if (!state.implSelectedClient) return;
  resetImplReuniaoForm();
  openModal(refs.implReuniaoFormModal, refs.implReuniaoData);
}

async function saveImplReuniao(event) {
  event.preventDefault();
  const cliente = state.implSelectedClient;
  if (!cliente) return;
  const reuniaoId = refs.implReuniaoId.value || null;
  const texto = refs.implReuniaoTexto.value.trim();
  const data = toStorageDate(refs.implReuniaoData.value);
  if (!data || !texto) {
    alert("Preencha data e o que foi conversado.");
    return;
  }
  const record = findImplantacao(cliente) || blankImplantacao(cliente);
  const reunioes = [...(record.reunioes || [])];
  const entry = { id: reuniaoId || createId(), data, texto };
  if (reuniaoId) {
    const idx = reunioes.findIndex((r) => String(r.id) === String(reuniaoId));
    if (idx >= 0) reunioes[idx] = entry; else reunioes.push(entry);
  } else {
    reunioes.push(entry);
  }
  const ok = await persistImplantacao({ ...record, reunioes });
  if (!ok) return;
  resetImplReuniaoForm();
  closeModal(refs.implReuniaoFormModal);
}

function editImplReuniao(id) {
  const record = findImplantacao(state.implSelectedClient);
  const item = record && (record.reunioes || []).find((r) => String(r.id) === String(id));
  if (!item) return;
  refs.implReuniaoId.value = item.id;
  refs.implReuniaoData.value = storageToInputDate(item.data || "");
  refs.implReuniaoTexto.value = item.texto || "";
  openModal(refs.implReuniaoFormModal, refs.implReuniaoData);
}

async function deleteImplReuniao(id) {
  if (!confirm("Deseja excluir esta anotação de reunião?")) return;
  const record = findImplantacao(state.implSelectedClient);
  if (!record) return;
  const reunioes = (record.reunioes || []).filter((r) => String(r.id) !== String(id));
  await persistImplantacao({ ...record, reunioes });
}

function cancelImplReuniaoEdit() {
  resetImplReuniaoForm();
  closeModal(refs.implReuniaoFormModal);
}

function resetImplReuniaoForm() {
  if (refs.implReuniaoForm) refs.implReuniaoForm.reset();
  if (refs.implReuniaoId) refs.implReuniaoId.value = "";
}

function formatCurrency(value) {
  const num = Number(value) || 0;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderImplFinanceiro(record) {
  const items = (record.financeiro || []).slice().sort((a, b) => storageDateSortKey(b.data || "").localeCompare(storageDateSortKey(a.data || "")));
  if (refs.implFinanceiroTableBody) refs.implFinanceiroTableBody.innerHTML = items.map(renderImplFinanceiroRow).join("");
  if (refs.implFinanceiroEmptyState) refs.implFinanceiroEmptyState.style.display = items.length ? "none" : "block";
  if (refs.implFinanceiroTotal) {
    const total = items.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
    refs.implFinanceiroTotal.textContent = formatCurrency(total);
  }
}

function renderImplFinanceiroRow(item) {
  return `<tr>
    <td>${escapeHtml(item.tecnico || "—")}</td>
    <td>${escapeHtml(formatDate(item.data || ""))}</td>
    <td>${escapeHtml(formatCurrency(item.valor))}</td>
    <td style="text-align:left">${escapeHtml(item.descricao || "—")}</td>
    <td>
      <div class="small-actions">
        <button type="button" onclick="editImplFinanceiro('${escapeAttribute(item.id)}')">Editar</button>
        <button type="button" class="ghost" onclick="deleteImplFinanceiro('${escapeAttribute(item.id)}')">Excluir</button>
      </div>
    </td>
  </tr>`;
}

function generateImplantacaoPdf() {
  if (!refs.implPdfArea) return;
  const cliente = state.implSelectedClient;
  if (!cliente) {
    alert("Selecione um cliente antes de gerar o PDF.");
    return;
  }
  const record = findImplantacao(cliente) || blankImplantacao(cliente);
  const now = new Date();

  const cronograma = (record.cronograma || []).slice()
    .sort((a, b) => storageDateSortKey(a.data || "").localeCompare(storageDateSortKey(b.data || "")));
  const reunioes = (record.reunioes || []).slice()
    .sort((a, b) => storageDateSortKey(b.data || "").localeCompare(storageDateSortKey(a.data || "")));
  const financeiro = (record.financeiro || []).slice()
    .sort((a, b) => storageDateSortKey(b.data || "").localeCompare(storageDateSortKey(a.data || "")));
  const totalFinanceiro = financeiro.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  const maquinas = record.maquinas || [];

  refs.implPdfArea.innerHTML = `
    <div class="pdf-header">
      <h1>Ficha de Implantação — ${escapeHtml(cliente)}</h1>
      <div class="pdf-meta">Gerado em ${escapeHtml(now.toLocaleDateString("pt-BR"))} às ${escapeHtml(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))}</div>
    </div>

    <div class="pdf-section">
      <h2 class="pdf-section-title">Dados gerais</h2>
      <div class="pdf-field-grid">
        <div class="pdf-field"><strong>Técnico responsável</strong>${escapeHtml(record.tecnico || "—")}</div>
        <div class="pdf-field"><strong>Status</strong>${escapeHtml(record.status || "Em andamento")}</div>
        <div class="pdf-field"><strong>Enquadramento da empresa</strong>${escapeHtml(record.enquadramento || "—")}</div>
      </div>
    </div>

    <div class="pdf-section">
      <h2 class="pdf-section-title">Estrutura do cliente</h2>
      <div class="pdf-field-grid">
        <div class="pdf-field"><strong>Base Gerencial</strong>${escapeHtml(formatBaseSummary(record.baseGerencialQtd, record.baseGerencialDescricao))}</div>
        <div class="pdf-field"><strong>Base Fiscal</strong>${escapeHtml(formatBaseSummary(record.baseFiscalQtd, record.baseFiscalDescricao))}</div>
        <div class="pdf-field"><strong>Quantidade de máquinas</strong>${maquinas.length || "—"}</div>
      </div>
      <div class="pdf-field">
        <strong>Observações gerais</strong>
        <div>${record.estrutura ? escapeHtml(record.estrutura).replace(/\n/g, "<br>") : "—"}</div>
      </div>
      <h3 style="margin:14px 0 6px;font-size:0.95rem;">Máquinas / acesso remoto</h3>
      ${maquinas.length
        ? maquinas.map((m, idx) => `
          <div class="pdf-maquina-row">
            <strong>${escapeHtml(m.descricao || `Máquina ${idx + 1}`)}</strong> —
            Código: ${escapeHtml(m.codigo || "—")} —
            Senha: ${escapeHtml(m.senha || "—")}
          </div>`).join("")
        : `<p class="pdf-empty">Nenhuma máquina cadastrada.</p>`}
    </div>

    <div class="pdf-section">
      <h2 class="pdf-section-title">Cronograma de implantação</h2>
      ${cronograma.length ? `
        <table class="pdf-table">
          <thead><tr><th>Etapa</th><th>Técnico</th><th>Data prevista</th><th>Status</th></tr></thead>
          <tbody>
            ${cronograma.map((e) => `<tr>
              <td>${escapeHtml(e.etapa || "—")}</td>
              <td>${escapeHtml(e.tecnico || "—")}</td>
              <td>${escapeHtml(formatDate(e.data || ""))}</td>
              <td>${escapeHtml(e.status || "—")}</td>
            </tr>`).join("")}
          </tbody>
        </table>` : `<p class="pdf-empty">Nenhuma etapa cadastrada.</p>`}
    </div>

    <div class="pdf-section">
      <h2 class="pdf-section-title">Reuniões</h2>
      ${reunioes.length
        ? reunioes.map((r) => `<div class="pdf-maquina-row"><strong>${escapeHtml(formatDate(r.data || ""))}</strong> — ${escapeHtml(r.texto || "")}</div>`).join("")
        : `<p class="pdf-empty">Nenhuma reunião registrada.</p>`}
    </div>

    <div class="pdf-section">
      <h2 class="pdf-section-title">Financeiro da implantação</h2>
      ${financeiro.length ? `
        <table class="pdf-table">
          <thead><tr><th>Técnico</th><th>Data</th><th>Valor</th><th>Descrição</th></tr></thead>
          <tbody>
            ${financeiro.map((f) => `<tr>
              <td>${escapeHtml(f.tecnico || "—")}</td>
              <td>${escapeHtml(formatDate(f.data || ""))}</td>
              <td>${escapeHtml(formatCurrency(f.valor))}</td>
              <td>${escapeHtml(f.descricao || "—")}</td>
            </tr>`).join("")}
          </tbody>
        </table>
        <p style="margin-top:8px;"><strong>Total de gastos:</strong> ${escapeHtml(formatCurrency(totalFinanceiro))}</p>`
        : `<p class="pdf-empty">Nenhum gasto registrado.</p>`}
    </div>
  `;

  document.body.classList.add("impl-pdf-print");
  window.print();
}

function focusImplFinanceiroForm() {
  if (!state.implSelectedClient) return;
  resetImplFinanceiroForm();
  openModal(refs.implFinanceiroFormModal, refs.implFinanceiroTecnico);
}

async function saveImplFinanceiro(event) {
  event.preventDefault();
  const cliente = state.implSelectedClient;
  if (!cliente) return;
  const financeiroId = refs.implFinanceiroId.value || null;
  const tecnico = refs.implFinanceiroTecnico.value.trim();
  const data = toStorageDate(refs.implFinanceiroData.value);
  const valor = parseFloat(refs.implFinanceiroValor.value);
  if (!tecnico || !data || !(valor >= 0)) {
    alert("Informe técnico, data e valor do gasto.");
    return;
  }
  const record = findImplantacao(cliente) || blankImplantacao(cliente);
  const financeiro = [...(record.financeiro || [])];
  const entry = {
    id: financeiroId || createId(),
    tecnico,
    data,
    valor,
    descricao: refs.implFinanceiroDescricao.value.trim(),
  };
  if (financeiroId) {
    const idx = financeiro.findIndex((f) => String(f.id) === String(financeiroId));
    if (idx >= 0) financeiro[idx] = entry; else financeiro.push(entry);
  } else {
    financeiro.push(entry);
  }
  const ok = await persistImplantacao({ ...record, financeiro });
  if (!ok) return;
  resetImplFinanceiroForm();
  closeModal(refs.implFinanceiroFormModal);
}

function editImplFinanceiro(id) {
  const record = findImplantacao(state.implSelectedClient);
  const item = record && (record.financeiro || []).find((f) => String(f.id) === String(id));
  if (!item) return;
  refs.implFinanceiroId.value = item.id;
  refs.implFinanceiroTecnico.value = item.tecnico || "";
  refs.implFinanceiroData.value = storageToInputDate(item.data || "");
  refs.implFinanceiroValor.value = item.valor === "" || item.valor === null || item.valor === undefined ? "" : item.valor;
  refs.implFinanceiroDescricao.value = item.descricao || "";
  openModal(refs.implFinanceiroFormModal, refs.implFinanceiroTecnico);
}

async function deleteImplFinanceiro(id) {
  if (!confirm("Deseja excluir este gasto?")) return;
  const record = findImplantacao(state.implSelectedClient);
  if (!record) return;
  const financeiro = (record.financeiro || []).filter((f) => String(f.id) !== String(id));
  await persistImplantacao({ ...record, financeiro });
}

function cancelImplFinanceiroEdit() {
  resetImplFinanceiroForm();
  closeModal(refs.implFinanceiroFormModal);
}

function resetImplFinanceiroForm() {
  if (refs.implFinanceiroForm) refs.implFinanceiroForm.reset();
  if (refs.implFinanceiroId) refs.implFinanceiroId.value = "";
}

function renderImplClientMenu() {
  if (!refs.implClientMenu) return;
  const typed = normalizeText(refs.implClientSearch ? refs.implClientSearch.value : "");
  const fromClientes = state.clientes.map((c) => c.nome);
  const fromImpl = state.implantacoes.map((i) => i.cliente);
  const clients = [...new Set([...fromClientes, ...fromImpl].filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filtered = typed ? clients.filter((c) => normalizeText(c).includes(typed)) : clients;
  if (!filtered.length) {
    refs.implClientMenu.innerHTML = `<div class="combo-empty">Nenhum cliente encontrado.</div>`;
    return;
  }
  refs.implClientMenu.innerHTML = filtered.map((c) =>
    `<button type="button" class="combo-option" data-ic="${escapeAttribute(c)}">${escapeHtml(c)}</button>`
  ).join("");
  refs.implClientMenu.querySelectorAll("[data-ic]").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectImplClient(btn.getAttribute("data-ic"));
    });
  });
}

function openImplClientMenu() {
  if (!refs.implClientMenu) return;
  renderImplClientMenu();
  refs.implClientMenu.classList.add("open");
}

function closeImplClientMenu() {
  if (refs.implClientMenu) refs.implClientMenu.classList.remove("open");
}

function closeImplClientMenuLater() {
  setTimeout(closeImplClientMenu, 120);
}

function selectImplClient(name) {
  state.implSelectedClient = name;
  state.implSummaryVisible = false;
  if (refs.implClientSearch) refs.implClientSearch.value = name;
  closeImplClientMenu();
  closeModal(refs.implFormModal);
  renderImplantacao();
}

function toggleImplSummary() {
  state.implSummaryVisible = !state.implSummaryVisible;
  renderImplantacao();
}

function openImplTecnicoMenu() {
  if (!refs.implTecnicoMenu) return;
  renderTecnicoComboMenu(refs.implTecnico, refs.implTecnicoMenu);
  refs.implTecnicoMenu.classList.add("open");
}

function closeImplTecnicoMenuLater() {
  setTimeout(() => { if (refs.implTecnicoMenu) refs.implTecnicoMenu.classList.remove("open"); }, 120);
}

function openImplEtapaTecnicoMenu() {
  if (!refs.implEtapaTecnicoMenu) return;
  renderTecnicoComboMenu(refs.implEtapaTecnico, refs.implEtapaTecnicoMenu);
  refs.implEtapaTecnicoMenu.classList.add("open");
}

function closeImplEtapaTecnicoMenuLater() {
  setTimeout(() => { if (refs.implEtapaTecnicoMenu) refs.implEtapaTecnicoMenu.classList.remove("open"); }, 120);
}

function openImplFinanceiroTecnicoMenu() {
  if (!refs.implFinanceiroTecnicoMenu) return;
  renderTecnicoComboMenu(refs.implFinanceiroTecnico, refs.implFinanceiroTecnicoMenu);
  refs.implFinanceiroTecnicoMenu.classList.add("open");
}

function closeImplFinanceiroTecnicoMenuLater() {
  setTimeout(() => { if (refs.implFinanceiroTecnicoMenu) refs.implFinanceiroTecnicoMenu.classList.remove("open"); }, 120);
}

// ── Agenda ───────────────────────────────────────────────────────────────────

let agendaViewDate = new Date();
let agendaSelectedDate = "";

function initAgenda() {
  if (!refs.agendaCalendar) return;
  agendaViewDate = new Date();
  renderAgenda();
}

function changeAgendaMonth(delta) {
  agendaViewDate.setDate(1);
  agendaViewDate.setMonth(agendaViewDate.getMonth() + delta);
  renderAgenda();
}

function setAgendaToday() {
  agendaViewDate = new Date();
  renderAgenda();
}

function getAgendaItemsByDate() {
  const map = {};
  state.procedimentos.forEach((p) => {
    if (!p.dataAgendamento) return;
    (map[p.dataAgendamento] = map[p.dataAgendamento] || []).push({ ...p, _type: "proc" });
  });
  state.spedCorrections.forEach((s) => {
    if (!s.dataAgendamento) return;
    (map[s.dataAgendamento] = map[s.dataAgendamento] || []).push({ ...s, _type: "sped" });
  });
  Object.values(map).forEach((items) => {
    items.sort((a, b) => (a.horario || a.horarioAgendamento || "").localeCompare(b.horario || b.horarioAgendamento || ""));
  });
  return map;
}

function renderAgenda() {
  if (!refs.agendaCalendarGrid) return;

  const year = agendaViewDate.getFullYear();
  const month = agendaViewDate.getMonth();

  if (refs.agendaMonthLabel) {
    const label = agendaViewDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    refs.agendaMonthLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  }

  const itemsByDate = getAgendaItemsByDate();
  const todayStored = todayAsStorageDate();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;

  const PREVIEW_LIMIT = 3;
  let html = "";
  for (let cell = 0; cell < totalCells; cell++) {
    const dayNum = cell - leadingBlanks + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      html += `<div class="agenda-calendar-cell agenda-calendar-cell--empty"></div>`;
      continue;
    }
    const dd = String(dayNum).padStart(2, "0");
    const mm = String(month + 1).padStart(2, "0");
    const storedDate = `${dd}/${mm}/${year}`;
    const items = itemsByDate[storedDate] || [];
    const isToday = storedDate === todayStored;

    const preview = items.slice(0, PREVIEW_LIMIT).map((item) => {
      const isProc = item._type === "proc";
      const horario = item.horario || item.horarioAgendamento || "";
      return `<div class="agenda-calendar-item ${isProc ? "agenda-calendar-item--proc" : "agenda-calendar-item--sped"}">
        ${horario ? `<span class="agenda-calendar-item-time">${escapeHtml(horario)}</span>` : ""}
        <span class="agenda-calendar-item-cliente">${escapeHtml(item.cliente || "")}</span>
      </div>`;
    }).join("");
    const extra = items.length > PREVIEW_LIMIT
      ? `<div class="agenda-calendar-more">+${items.length - PREVIEW_LIMIT} mais</div>`
      : "";

    html += `
      <div class="agenda-calendar-cell${isToday ? " agenda-calendar-cell--today" : ""}${items.length ? " agenda-calendar-cell--has-items" : ""}"
           data-date="${escapeAttribute(storedDate)}">
        <div class="agenda-calendar-cell-day">${dayNum}</div>
        <div class="agenda-calendar-cell-items">${preview}${extra}</div>
      </div>`;
  }

  refs.agendaCalendarGrid.innerHTML = html;

  document.querySelectorAll(".agenda-calendar-cell[data-date]").forEach((cell) => {
    cell.addEventListener("click", () => openAgendaDay(cell.dataset.date, itemsByDate[cell.dataset.date] || []));
  });

  if (refs.agendaDayModal && refs.agendaDayModal.open && agendaSelectedDate) {
    renderAgendaDayList(itemsByDate[agendaSelectedDate] || []);
  }
}

function openAgendaDay(storedDate, items) {
  if (!refs.agendaDayModal) return;
  agendaSelectedDate = storedDate;

  if (refs.agendaDayModalTitle) {
    const inputDate = storageToInputDate(storedDate);
    const label = new Date(inputDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    refs.agendaDayModalTitle.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  }

  renderAgendaDayList(items);
  openModal(refs.agendaDayModal);
}

function renderAgendaDayList(items) {
  if (refs.agendaDayList) refs.agendaDayList.innerHTML = items.map(renderAgendaCard).join("");
  if (refs.agendaDayEmpty) refs.agendaDayEmpty.style.display = items.length ? "none" : "block";
  setupAgendaStatusSelects();
}

function renderAgendaCard(item) {
  const isProc = item._type === "proc";
  const horario = item.horario || item.horarioAgendamento || "";
  const statusOpts = isProc
    ? ["Em aberto", "Em andamento", "Concluído", "Cancelado"]
    : ["Em aberto", "Pendente", "Em correcao", "Corrigido", "Entregue"];
  const options = statusOpts
    .map((s) => `<option value="${escapeAttribute(s)}"${s === item.status ? " selected" : ""}>${escapeHtml(s === "Em correcao" ? "Em correção" : s)}</option>`)
    .join("");

  return `
    <div class="agenda-card ${isProc ? "agenda-card--proc" : "agenda-card--sped"}"
         data-id="${escapeAttribute(String(item.id))}"
         data-type="${item._type}">
      <div class="agenda-card-top">
        <span class="agenda-badge ${isProc ? "agenda-badge--proc" : "agenda-badge--sped"}">${isProc ? "Proc" : "SPED"}</span>
        ${horario ? `<span class="agenda-card-time">${escapeHtml(horario)}</span>` : ""}
      </div>
      <div class="agenda-card-cliente">${escapeHtml(item.cliente || "")}</div>
      <div class="agenda-card-tipo">${escapeHtml(item.tipo || "")}</div>
      <div class="agenda-card-meta">
        ${item.tecnico ? `<span>&#128100; ${escapeHtml(item.tecnico)}</span>` : ""}
        ${item.telefone ? `<span>&#128222; ${escapeHtml(item.telefone)}</span>` : ""}
      </div>
      ${item.observacao ? `<div class="agenda-card-obs">${escapeHtml(item.observacao)}</div>` : ""}
      <div class="agenda-card-status-row">
        <select class="agenda-card-status-select"
                data-id="${escapeAttribute(String(item.id))}"
                data-type="${item._type}">${options}</select>
      </div>
    </div>`;
}

function setupAgendaStatusSelects() {
  document.querySelectorAll(".agenda-card-status-select").forEach((sel) => {
    sel.addEventListener("change", async () => {
      await saveAgendaStatus(sel.dataset.id, sel.dataset.type, sel.value);
    });
  });
}

async function saveAgendaStatus(id, type, newStatus) {
  const updatedAt = new Date().toISOString();
  try {
    if (type === "proc") {
      const item = state.procedimentos.find((p) => String(p.id) === String(id));
      if (!item) return;
      await sendData(`/api/procedimentos/${encodeURIComponent(item.id)}`, "PUT", { ...item, status: newStatus, updatedAt });
    } else {
      const item = state.spedCorrections.find((s) => String(s.id) === String(id));
      if (!item) return;
      await sendData(`/api/sped/${encodeURIComponent(item.id)}`, "PUT", { ...item, status: newStatus, updatedAt });
    }
  } catch (err) {
    alert("Erro ao atualizar status: " + (err.message || JSON.stringify(err)));
  }
}


// ── Home: resumo do dia ──────────────────────────────────────────────────────

const HOME_FINAL_STATUS = {
  proc: ["concluido", "cancelado"],
  sped: ["corrigido", "entregue"],
};

function storageDateKey(stored) {
  const input = storageToInputDate(stored);
  return /^\d{4}-\d{2}-\d{2}$/.test(input) ? input.replace(/-/g, "") : "";
}

function isHomeItemFinalizado(item) {
  return HOME_FINAL_STATUS[item._type].includes(normalizeText(item.status));
}

function renderHomeToday() {
  if (!refs.homeTodayList) return;

  const todayKey = storageDateKey(todayAsStorageDate());
  const hoje = [];
  const atrasados = [];
  Object.entries(getAgendaItemsByDate()).forEach(([date, items]) => {
    const key = storageDateKey(date);
    if (key === todayKey) hoje.push(...items);
    else if (key && key < todayKey) atrasados.push(...items.filter((i) => !isHomeItemFinalizado(i)));
  });
  atrasados.sort((a, b) => storageDateKey(a.dataAgendamento).localeCompare(storageDateKey(b.dataAgendamento)));

  const pendentesHoje = hoje.filter((i) => !isHomeItemFinalizado(i)).length;
  const implAndamento = state.implantacoes.filter((i) => (i.status || "Em andamento") === "Em andamento").length;

  if (refs.homeTodayLabel) {
    const label = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    refs.homeTodayLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  }

  if (refs.homeTodayStats) {
    const stats = [
      { label: "Agendados hoje", value: hoje.length, href: "agenda.html" },
      { label: "Pendentes hoje", value: pendentesHoje, href: "agenda.html" },
      { label: "Atrasados", value: atrasados.length, href: "procedimentos.html", alert: atrasados.length > 0 },
      { label: "Implantações em andamento", value: implAndamento, href: "implantacoes.html" },
    ];
    refs.homeTodayStats.innerHTML = stats.map((s) => `
      <a class="today-stat${s.alert ? " today-stat--alert" : ""}" href="${s.href}">
        <span class="today-stat-value">${s.value}</span>
        <span class="today-stat-label">${escapeHtml(s.label)}</span>
      </a>`).join("");
  }

  refs.homeTodayList.innerHTML = hoje.map((item) => renderHomeItem(item, false)).join("");
  if (refs.homeTodayEmpty) refs.homeTodayEmpty.style.display = hoje.length ? "none" : "block";

  if (refs.homeAtrasadosList) {
    refs.homeAtrasadosList.innerHTML = atrasados.map((item) => renderHomeItem(item, true)).join("");
  }
  if (refs.homeAtrasadosEmpty) refs.homeAtrasadosEmpty.style.display = atrasados.length ? "none" : "block";
}

function renderHomeItem(item, showDate) {
  const isProc = item._type === "proc";
  const horario = item.horario || item.horarioAgendamento || "";
  const quando = showDate ? formatDate(item.dataAgendamento) : horario || "—";
  const tipo = isProc ? item.tipo : [item.tipo, item.competencia].filter(Boolean).join(" · ");
  return `
    <li>
      <a class="today-item${isHomeItemFinalizado(item) ? " today-item--done" : ""}" href="${isProc ? "procedimentos.html" : "sped.html"}">
        <span class="today-item-time">${escapeHtml(quando)}</span>
        <span class="today-item-main">
          <strong>${escapeHtml(item.cliente || "")}</strong>
          <small>${escapeHtml(tipo || "")}${item.tecnico ? ` · ${escapeHtml(item.tecnico)}` : ""}</small>
        </span>
        <span class="agenda-badge ${isProc ? "agenda-badge--proc" : "agenda-badge--sped"}">${isProc ? "Proc" : "SPED"}</span>
        <span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status === "Em correcao" ? "Em correção" : item.status || "")}</span>
      </a>
    </li>`;
}
// ── Assistente IA ─────────────────────────────────────────────────────────────

(function () {
  const fabBtn     = document.getElementById("aiFabBtn");
  const modal      = document.getElementById("aiModal");
  const closeBtn   = document.getElementById("aiModalClose");
  const history    = document.getElementById("aiChatHistory");
  const textarea   = document.getElementById("aiTextarea");
  const sendBtn    = document.getElementById("aiSendBtn");
  const fileInput  = document.getElementById("aiFileInput");
  const attachBtn  = document.getElementById("aiAttachBtn");
  const filePreview = document.getElementById("aiFilePreview");
  const searchBtn  = document.getElementById("aiSearchBtn");
  const thinkBtn   = document.getElementById("aiThinkBtn");

  if (!fabBtn || !modal) return;

  let attachedFile = null;
  let activeMode   = null; // "search" | "think" | null
  let isLoading    = false;

  // Abrir / fechar modal
  fabBtn.addEventListener("click", () => modal.showModal());
  closeBtn.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  // Auto-resize textarea
  textarea.addEventListener("input", () => {
    sendBtn.disabled = textarea.value.trim() === "" && !attachedFile;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  });

  // Enviar com Enter (Shift+Enter = nova linha)
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled && !isLoading) sendMessage();
    }
  });

  sendBtn.addEventListener("click", () => { if (!isLoading) sendMessage(); });

  // Toggles de modo
  [searchBtn, thinkBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      if (activeMode === mode) {
        activeMode = null;
        btn.classList.remove("active");
        textarea.placeholder = "Digite sua mensagem...";
      } else {
        activeMode = mode;
        searchBtn.classList.toggle("active", mode === "search");
        thinkBtn.classList.toggle("active",  mode === "think");
        textarea.placeholder = mode === "search" ? "Pesquisar na web..." : "Raciocinar profundamente...";
      }
      textarea.focus();
    });
  });

  // Anexar imagem
  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) { alert("Imagem maior que 10 MB."); return; }
    attachedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.style.display = "flex";
      filePreview.innerHTML = `
        <div class="ai-file-thumb">
          <img src="${e.target.result}" alt="${escapeHtml(file.name)}" />
          <button class="ai-file-remove" id="aiFileRemove" aria-label="Remover imagem">×</button>
        </div>`;
      document.getElementById("aiFileRemove").addEventListener("click", removeAttachment);
    };
    reader.readAsDataURL(file);
    sendBtn.disabled = false;
    fileInput.value = "";
  });

  // Colar imagem do clipboard
  document.addEventListener("paste", (e) => {
    if (!modal.open) return;
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) { simulateFileAttach(file); break; }
      }
    }
  });

  function simulateFileAttach(file) {
    attachedFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      filePreview.style.display = "flex";
      filePreview.innerHTML = `
        <div class="ai-file-thumb">
          <img src="${ev.target.result}" alt="imagem colada" />
          <button class="ai-file-remove" id="aiFileRemove" aria-label="Remover imagem">×</button>
        </div>`;
      document.getElementById("aiFileRemove").addEventListener("click", removeAttachment);
    };
    reader.readAsDataURL(file);
    sendBtn.disabled = false;
  }

  function removeAttachment() {
    attachedFile = null;
    filePreview.style.display = "none";
    filePreview.innerHTML = "";
    sendBtn.disabled = textarea.value.trim() === "";
  }

  function appendMessage(role, text, imageUrl) {
    const wrap = document.createElement("div");
    wrap.className = `ai-msg ai-msg-${role}`;

    if (activeMode && role === "user") {
      const tag = document.createElement("div");
      tag.className = `ai-mode-tag ${activeMode}`;
      tag.textContent = activeMode === "search" ? "Busca" : "Raciocinar";
      wrap.appendChild(tag);
    }

    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.style.cssText = "max-width:200px;border-radius:10px;margin-bottom:4px;display:block;";
      wrap.appendChild(img);
    }

    if (text) {
      const bubble = document.createElement("div");
      bubble.className = "ai-bubble";
      bubble.textContent = text;
      wrap.appendChild(bubble);
    }

    history.appendChild(wrap);
    history.scrollTop = history.scrollHeight;
    return wrap;
  }

  function appendTyping() {
    const wrap = document.createElement("div");
    wrap.className = "ai-msg ai-msg-assistant";
    wrap.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    history.appendChild(wrap);
    history.scrollTop = history.scrollHeight;
    return wrap;
  }

  async function sendMessage() {
    const text = textarea.value.trim();
    if (!text && !attachedFile) return;

    isLoading = true;
    sendBtn.disabled = true;

    let imageUrl = null;
    if (attachedFile) {
      imageUrl = await new Promise((res) => {
        const r = new FileReader();
        r.onload = (e) => res(e.target.result);
        r.readAsDataURL(attachedFile);
      });
    }

    appendMessage("user", text, imageUrl);
    removeAttachment();
    textarea.value = "";
    textarea.style.height = "auto";

    const typing = appendTyping();

    try {
      const reply = await callAI(text, imageUrl);
      typing.remove();
      appendMessage("assistant", reply);
    } catch (err) {
      typing.remove();
      appendMessage("assistant", "Erro: " + (err.message || "falha desconhecida."));
    }

    isLoading = false;
    sendBtn.disabled = textarea.value.trim() === "";
    textarea.focus();
  }

  function buildDatabaseContext() {
    const lines = [];

    if (state.clientes && state.clientes.length) {
      lines.push("## Clientes cadastrados");
      state.clientes.forEach((c) => {
        lines.push(`- ${c.nome} | Tel: ${c.telefone || "—"} | Prioridade: ${c.prioridade || "Baixa"} | SPED: ${c.sped ? "Sim" : "Não"} | Versão banco: ${c.versaoBanco || "—"}`);
      });
    }

    if (state.tecnicos && state.tecnicos.length) {
      lines.push("\n## Técnicos");
      state.tecnicos.forEach((t) => lines.push(`- ${t.nome}${t.email ? ` (${t.email})` : ""}`));
    }

    if (state.tiposProcedimento && state.tiposProcedimento.length) {
      lines.push("\n## Tipos de procedimento");
      lines.push(state.tiposProcedimento.map((t) => t.nome).join(", "));
    }

    if (state.procedimentos && state.procedimentos.length) {
      const procs = state.procedimentos.slice(0, 40);
      lines.push(`\n## Procedimentos técnicos (${state.procedimentos.length} total, exibindo ${procs.length} mais recentes)`);
      procs.forEach((p) => {
        lines.push(`- [${p.status}] ${p.cliente} | ${p.tipo} | Técnico: ${p.tecnico} | Agendado: ${p.dataAgendamento || "—"} | Finalizado: ${p.dataFinalizacao || "—"}${p.versaoBanco ? ` | v${p.versaoBanco}` : ""}${p.observacao ? ` | Obs: ${p.observacao}` : ""}`);
      });
    }

    if (state.spedCorrections && state.spedCorrections.length) {
      const speds = state.spedCorrections.slice(0, 40);
      lines.push(`\n## Controle SPED (${state.spedCorrections.length} total, exibindo ${speds.length} mais recentes)`);
      speds.forEach((s) => {
        lines.push(`- [${s.status}] ${s.cliente} | ${s.tipo} | Competência: ${s.competencia} | Técnico: ${s.tecnico} | Agendado: ${s.dataAgendamento || "—"}${s.observacao ? ` | Obs: ${s.observacao}` : ""}`);
      });
    }

    if (state.issues && state.issues.length) {
      lines.push(`\n## Problemas recorrentes (${state.issues.length} total)`);
      state.issues.slice(0, 20).forEach((i) => {
        lines.push(`- ${i.descricao}${i.cliente ? ` | Cliente: ${i.cliente}` : ""}${i.jira ? ` | Jira: ${i.jira}` : ""}${i.tecnicos && i.tecnicos.length ? ` | Técnicos: ${i.tecnicos.join(", ")}` : ""}`);
      });
    }

    return lines.join("\n");
  }

  async function callAI(userText, imageUrl) {
    const modePrefix = activeMode === "search"
      ? "O usuário quer fazer uma busca nos dados. "
      : activeMode === "think"
      ? "O usuário quer um raciocínio detalhado. "
      : "";

    const dbContext = buildDatabaseContext();

    const systemPrompt = `Você é um assistente de suporte técnico do sistema Gestão Suporte.
Você tem acesso aos dados reais do banco de dados da empresa, listados abaixo.
Use esses dados para responder perguntas com precisão — cite nomes, status e datas reais quando relevante.
Responda em português, de forma objetiva e profissional.

${dbContext}`;

    const body = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: modePrefix + (userText || "(imagem enviada)") }]
    });

    let response;
    try {
      response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });
    } catch (networkErr) {
      throw new Error("Proxy não encontrado. Abra um terminal na pasta do projeto e execute: node proxy.js");
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "Sem resposta.";
  }
})();

