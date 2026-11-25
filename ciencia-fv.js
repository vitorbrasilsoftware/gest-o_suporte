// ── Ciência do Financeiro — página pública (ciencia-fv.html?token=...) ──────
// Sem login: lê e confirma o retrato pelas funções RPC de supabase/fv_ciencias.sql
// (fv_ciencia_obter / fv_ciencia_confirmar). O link é gerado em forca-vendas.html.
// A ciência é individual: cada cliente da lista é confirmado separadamente.

(function () {
  const NOME_STORAGE_KEY = "gs.cienciaNome";

  const el = (id) => document.getElementById(id);
  const token = new URLSearchParams(window.location.search).get("token") || "";
  let dadosAtuais = null;
  let indiceSelecionado = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function dataHora(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }

  function lerNome() {
    try { return localStorage.getItem(NOME_STORAGE_KEY) || ""; } catch (_) { return ""; }
  }

  function gravarNome(nome) {
    try { localStorage.setItem(NOME_STORAGE_KEY, nome); } catch (_) { /* sem storage: só não lembra */ }
  }

  function mostrarErro(texto) {
    el("cienciaCarregando").hidden = true;
    el("cienciaConteudo").hidden = true;
    if (texto) el("cienciaErroTexto").textContent = texto;
    el("cienciaErro").hidden = false;
  }

  function celulaCiencia(c, idx) {
    if (c.confirmadoEm) {
      return `<span class="status status-concluido">Ciente</span>
        <small>${escapeHtml(c.confirmadoPor)} · ${escapeHtml(dataHora(c.confirmadoEm))}</small>
        ${c.observacao ? `<small class="ciencia-obs">“${escapeHtml(c.observacao)}”</small>` : ""}`;
    }
    return `<button type="button" class="ciencia-btn" data-indice="${idx}">Ciente</button>`;
  }

  function render(dados) {
    dadosAtuais = dados;
    const incluirVem = dados.conteudo !== "automacao";
    const incluirAutomacao = dados.conteudo !== "vem";
    const mostrarTotal = incluirVem && incluirAutomacao;
    const clientes = Array.isArray(dados.clientes) ? dados.clientes : [];
    const totalVem = clientes.reduce((s, c) => s + (c.vem || 0), 0);
    const totalAutomacao = clientes.reduce((s, c) => s + (c.automacao || 0), 0);
    const cientes = clientes.filter((c) => c.confirmadoEm).length;
    const pendentes = clientes.length - cientes;
    const celula = (qtd) => (qtd === null || qtd === undefined ? "—" : `<span class="pdf-qtd-pill">${qtd}</span>`);

    const concluida = el("cienciaConcluida");
    concluida.hidden = pendentes > 0;
    concluida.textContent = "Ciência registrada para todos os clientes desta lista. Obrigado!";

    el("cienciaTabelaHead").innerHTML = `<tr>
      <th class="pdf-col-idx">#</th>
      <th>Cliente</th>
      <th>CPF/CNPJ</th>
      ${incluirVem ? `<th class="pdf-col-qtd">VEM</th>` : ""}
      ${incluirAutomacao ? `<th class="pdf-col-qtd">ATS</th>` : ""}
      ${mostrarTotal ? `<th class="pdf-col-qtd">Total</th>` : ""}
      <th class="ciencia-col">Ciência</th>
    </tr>`;

    el("cienciaTabelaBody").innerHTML = clientes.map((c, idx) => `<tr${c.confirmadoEm ? ` class="ciencia-row-ok"` : ""}>
      <td class="pdf-col-idx">${idx + 1}</td>
      <td>${escapeHtml(c.nome)}</td>
      <td>${escapeHtml(c.cpfCnpj || "—")}</td>
      ${incluirVem ? `<td class="pdf-col-qtd">${celula(c.vem)}</td>` : ""}
      ${incluirAutomacao ? `<td class="pdf-col-qtd">${celula(c.automacao)}</td>` : ""}
      ${mostrarTotal ? `<td class="pdf-col-qtd"><span class="pdf-qtd-pill">${(c.vem || 0) + (c.automacao || 0)}</span></td>` : ""}
      <td class="ciencia-col">${celulaCiencia(c, idx)}</td>
    </tr>`).join("");

    el("cienciaTabelaFoot").innerHTML = `<tr>
      <td colspan="3">Total — ${clientes.length} ${clientes.length === 1 ? "cliente" : "clientes"}</td>
      ${incluirVem ? `<td class="pdf-col-qtd">${totalVem}</td>` : ""}
      ${incluirAutomacao ? `<td class="pdf-col-qtd">${totalAutomacao}</td>` : ""}
      ${mostrarTotal ? `<td class="pdf-col-qtd">${totalVem + totalAutomacao}</td>` : ""}
      <td class="ciencia-col">${cientes} de ${clientes.length}</td>
    </tr>`;

    el("cienciaCarregando").hidden = true;
    el("cienciaErro").hidden = true;
    el("cienciaConteudo").hidden = false;
  }

  async function carregar() {
    if (!token) {
      mostrarErro("Link incompleto. Confira se copiou o endereço inteiro.");
      return;
    }
    const { data, error } = await db.rpc("fv_ciencia_obter", { p_token: token });
    if (error) {
      console.error(error);
      mostrarErro("Não foi possível carregar a lista. Tente novamente em instantes.");
      return;
    }
    if (!data) {
      mostrarErro();
      return;
    }
    render(data);
  }

  function abrirConfirmacao(idx) {
    const cliente = dadosAtuais.clientes[idx];
    indiceSelecionado = idx;
    el("cienciaModalCliente").innerHTML = `<strong>${escapeHtml(cliente.nome)}</strong>${cliente.cpfCnpj ? ` · ${escapeHtml(cliente.cpfCnpj)}` : ""}`;
    // O nome vem preenchido com o último usado neste navegador.
    const nomeInput = el("cienciaNome");
    nomeInput.value = lerNome();
    nomeInput.classList.remove("ciencia-input-erro");
    el("cienciaObservacao").value = "";
    el("cienciaFormErro").hidden = true;
    const modal = el("cienciaModal");
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    (nomeInput.value ? el("cienciaObservacao") : nomeInput).focus();
  }

  function fecharConfirmacao() {
    const modal = el("cienciaModal");
    if (typeof modal.close === "function" && modal.open) modal.close(); else modal.removeAttribute("open");
    indiceSelecionado = null;
  }

  async function confirmar(event) {
    event.preventDefault();
    if (indiceSelecionado === null) return;
    const erro = el("cienciaFormErro");
    const nomeInput = el("cienciaNome");
    const nome = nomeInput.value.trim();
    if (!nome) {
      erro.textContent = "Informe o nome de quem está dando ciência.";
      erro.hidden = false;
      nomeInput.classList.add("ciencia-input-erro");
      nomeInput.focus();
      return;
    }
    gravarNome(nome);

    const botao = el("cienciaConfirmarBtn");
    botao.disabled = true;
    botao.textContent = "Registrando...";
    const { data, error } = await db.rpc("fv_ciencia_confirmar", {
      p_token: token,
      p_indice: indiceSelecionado,
      p_nome: nome,
      p_observacao: el("cienciaObservacao").value.trim(),
    });
    botao.disabled = false;
    botao.textContent = "Estou ciente";

    if (error) {
      erro.textContent = `Não foi possível registrar: ${error.message}`;
      erro.hidden = false;
      return;
    }
    fecharConfirmacao();
    if (!data) {
      mostrarErro();
      return;
    }
    render(data);
  }

  el("cienciaNome").addEventListener("input", (e) => e.target.classList.remove("ciencia-input-erro"));
  el("cienciaTabelaBody").addEventListener("click", (event) => {
    const botao = event.target.closest(".ciencia-btn");
    if (botao) abrirConfirmacao(Number(botao.dataset.indice));
  });
  el("cienciaForm").addEventListener("submit", confirmar);
  document.querySelectorAll("[data-close-ciencia]").forEach((b) => b.addEventListener("click", fecharConfirmacao));
  el("cienciaModal").addEventListener("click", (event) => {
    if (event.target === el("cienciaModal")) fecharConfirmacao();
  });
  carregar();
})();
