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
addListener(refs.usuarioSearchInput, "input", renderUsuarios);
addListener(refs.usuarioPapelFilter, "change", renderUsuarios);
addListener(refs.usuarioStatusFilter, "change", renderUsuarios);
addListener(refs.showUsuarioFormBtn, "click", focusUsuarioForm);
addListener(refs.usuarioForm, "submit", saveUsuario);
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
  if (refs.homeTodayList) safeRender(renderHomeToday, "homeToday");
  if (refs.usuarioTableBody) safeRender(renderUsuarios, "usuarios");

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
  state.issues = Array.isArray(data.issues) ? data.issues : [];
  state.spedCorrections = Array.isArray(data.spedCorrections) ? data.spedCorrections : [];
  state.spedClients = Array.isArray(data.spedClients) ? data.spedClients : [];
  state.procedimentos = Array.isArray(data.procedimentos) ? data.procedimentos : [];
  state.diario = Array.isArray(data.diario) ? data.diario : [];
  state.clientes = Array.isArray(data.clientes) ? data.clientes : [];
  state.tecnicos = Array.isArray(data.tecnicos) ? data.tecnicos : [];
  state.tiposProcedimento = Array.isArray(data.tiposProcedimento) ? data.tiposProcedimento : [];
  state.implantacoes = Array.isArray(data.implantacoes) ? data.implantacoes : [];
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
  if (refs.homeTodayList) safeRender(renderHomeToday, "homeToday");
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

async function supabaseDeleteRoute(path) {
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

  filtered.sort((a, b) => {
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
    if (thead) thead.innerHTML = `<tr><th>Cliente</th><th>Competência</th><th>Tipo</th><th>Status</th><th>Técnico</th><th>Telefone</th><th>Data agendamento</th><th>Horario</th><th>Finalizado em</th><th>Observação</th><th>Ações</th></tr>`;
    refs.spedTableBody.innerHTML = filtered.map(renderSpedTableRow).join("");
  }

  refs.spedEmptyState.style.display = filtered.length ? "none" : "block";
  renderSpedSummary(filtered);
}

function renderSpedTableRow(item) {
  const cells = [
    `<strong class="client-name">${escapeHtml(item.cliente)}</strong>`,
    escapeHtml(formatCompetencia(item.competencia)),
    escapeHtml(item.tipo),
    `<span class="status ${getStatusClass(item.status)}">${escapeHtml(item.status)}</span>`,
    escapeHtml(item.tecnico),
    escapeHtml(item.telefone || ""),
    escapeHtml(formatDate(getSpedDateValue(item, "dataAgendamento", "data_agendamento"))),
    escapeHtml(getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")),
    escapeHtml(formatDate(getSpedDateValue(item, "dataFinalizacao", "data_finalizacao"))),
    escapeHtml(item.observacao),
    `<div class="small-actions">
      <button type="button" onclick="editSpedCorrection('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteSpedCorrection('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`
  ];
  return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
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
            <table>
              <thead>
                <tr>
                  <th>Cliente</th><th>Tipo</th><th>Status</th><th>Técnico</th><th>Telefone</th>
                  <th>Data agendamento</th><th>Horário</th><th>Finalizado em</th><th style="text-align:right">Quant. Dias</th>
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
    escapeHtml(item.tecnico),
    escapeHtml(item.telefone || ""),
    escapeHtml(formatDate(agend)),
    escapeHtml(getSpedDateValue(item, "horarioAgendamento", "horario_agendamento")),
    escapeHtml(formatDate(final)),
    `<span style="display:block;text-align:right">${dias !== "" ? escapeHtml(String(dias)) : "—"}</span>`,
    escapeHtml(item.observacao || ""),
    `<div class="small-actions">
      <button type="button" onclick="editSpedCorrection('${escapeAttribute(item.id)}')">Editar</button>
      <button type="button" class="ghost" onclick="deleteSpedCorrection('${escapeAttribute(item.id)}')">Excluir</button>
    </div>`
  ];
  return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
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

window.editForcaVendas = editForcaVendas;
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

const PAPEL_LABELS = { admin: "Administrador", tecnico: "Técnico", consulta: "Consulta" };

function toUsuarioJs(row) {
  return {
    id: row.id,
    nome: row.nome || "",
    email: row.email || "",
    papel: row.papel || "consulta",
    ativo: row.ativo === true,
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
  if (!refs.spedTecnicoMenu) return;
  renderTecnicoComboMenu(refs.spedTecnico, refs.spedTecnicoMenu);
  refs.spedTecnicoMenu.classList.add("open");
}

function closeSpedTecnicoMenuLater() {
  setTimeout(() => { if (refs.spedTecnicoMenu) refs.spedTecnicoMenu.classList.remove("open"); }, 120);
}

function openProcTecnicoMenu() {
  if (!refs.procTecnicoMenu) return;
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

