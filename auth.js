// ── Autenticação e controle de acesso ────────────────────────────────────────
// Carregado no <head> de todas as páginas, logo após supabase-config.js.
// - Páginas protegidas: esconde o conteúdo até validar sessão + perfil ativo,
//   expõe `window.authReady` (Promise<boolean>) que o script.js aguarda antes
//   de carregar dados, e injeta o menu lateral (navegação, usuário, sair).
// - login.html: fluxo de entrar, criar conta, recuperar e redefinir senha.
//
// A segurança real está nas policies RLS (supabase/auth.sql). O que este
// arquivo faz no navegador é só experiência de uso: redirecionar, esconder
// botões e avisar antes de uma operação que o banco recusaria.

(function () {
  const PAPEIS = {
    admin: "Administrador",
    tecnico: "Técnico",
    consulta: "Consulta"
  };
  const PAGINAS_ADMIN = ["setup.html", "usuarios.html"];
  const PAGINA_LOGIN = "login.html";

  const paginaAtual = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  const auth = {
    user: null,
    perfil: null,
    papel: null,
    PAPEIS,
    // nivel: "read" | "write" | "admin"
    can(nivel) {
      if (nivel === "admin") return this.papel === "admin";
      if (nivel === "write") return this.papel === "admin" || this.papel === "tecnico";
      return Boolean(this.papel);
    },
    signOut
  };
  window.auth = auth;

  if (paginaAtual === PAGINA_LOGIN) {
    // Capturado já no carregamento: o supabase-js consome o token do link de
    // recuperação de senha da URL e dispara PASSWORD_RECOVERY logo ao iniciar.
    const recuperacao = { ativa: /type=recovery/.test(window.location.hash), onChange: null };
    const erroNaUrl = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("error_description");
    db.auth.onAuthStateChange((event) => {
      if (event !== "PASSWORD_RECOVERY") return;
      recuperacao.ativa = true;
      if (recuperacao.onChange) recuperacao.onChange();
    });
    whenDomReady().then(() => initLoginPage(recuperacao, erroNaUrl));
    return;
  }

  document.documentElement.classList.add("auth-pending");
  window.authReady = protegerPagina();

  // ── Páginas protegidas ─────────────────────────────────────────────────────

  async function protegerPagina() {
    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session) {
        irParaLogin();
        return false;
      }

      const perfil = await carregarPerfil(session.user.id);
      if (!perfil || !perfil.ativo) {
        await db.auth.signOut();
        irParaLogin("inativo");
        return false;
      }

      auth.user = session.user;
      auth.perfil = perfil;
      auth.papel = perfil.papel;

      if (PAGINAS_ADMIN.includes(paginaAtual) && !auth.can("admin")) {
        window.location.replace("index.html?negado=1");
        return false;
      }

      db.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") irParaLogin();
      });

      await whenDomReady();
      aplicarPermissoes();
      montarMenuLateral();
      avisarAcessoNegado();
      document.documentElement.classList.remove("auth-pending");
      return true;
    } catch (err) {
      console.error("Erro ao validar acesso:", err);
      irParaLogin("erro");
      return false;
    }
  }

  async function carregarPerfil(userId) {
    const { data, error } = await db.from("perfis").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data;
  }

  function irParaLogin(motivo) {
    const params = new URLSearchParams();
    const next = paginaAtual + window.location.search;
    if (next && next !== "index.html") params.set("next", next);
    if (motivo) params.set("motivo", motivo);
    const query = params.toString();
    window.location.replace(PAGINA_LOGIN + (query ? "?" + query : ""));
  }

  async function signOut() {
    await db.auth.signOut();
    window.location.replace(PAGINA_LOGIN);
  }

  function aplicarPermissoes() {
    const body = document.body;
    body.classList.add("papel-" + auth.papel);
    body.classList.toggle("perm-admin", auth.can("admin"));
    body.classList.toggle("perm-write", auth.can("write"));
    body.classList.toggle("perm-readonly", !auth.can("write"));

    if (!auth.can("admin")) {
      PAGINAS_ADMIN.forEach((pagina) => {
        document.querySelectorAll(`a[href="${pagina}"]`).forEach((link) => { link.hidden = true; });
      });
    }
    document.querySelectorAll("[data-requires]").forEach((el) => {
      if (!auth.can(el.getAttribute("data-requires"))) el.hidden = true;
    });
  }

  // ── Menu lateral ───────────────────────────────────────────────────────────
  // Única fonte da navegação: as páginas não têm <nav> próprio. Itens com
  // `admin: true` só aparecem para administradores.

  const ICONES = {
    inicio: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    agenda: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    sped: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    procedimentos: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a2 2 0 0 0 2.8 2.8l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.5-.5-2.4z"/>',
    implantacao: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    diario: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2.5z"/><path d="M4 19.5A2 2 0 0 0 6 21h14M9 7h7M9 11h5"/>',
    problemas: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    forcaVendas: '<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
    clientes: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    setup: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    usuarios: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    senha: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    recolher: '<path d="M15 18l-6-6 6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };

  const MENU = [
    { grupo: "Visão geral", itens: [
      { href: "index.html", label: "Início", icone: "inicio" },
      { href: "agenda.html", label: "Agenda", icone: "agenda" }
    ] },
    { grupo: "Operação", itens: [
      { href: "sped.html", label: "SPED", icone: "sped" },
      { href: "procedimentos.html", label: "Procedimentos", icone: "procedimentos" },
      { href: "implantacoes.html", label: "Implantação", icone: "implantacao" },
      { href: "diario.html", label: "Diário do Cliente", icone: "diario" },
      { href: "problemas.html", label: "Problemas", icone: "problemas" },
      { href: "forca-vendas.html", label: "Força de Vendas", icone: "forcaVendas" }
    ] },
    { grupo: "Cadastros", itens: [
      { href: "clientes.html", label: "Clientes", icone: "clientes" },
      { href: "setup.html", label: "Setup", icone: "setup", admin: true },
      { href: "usuarios.html", label: "Usuários", icone: "usuarios", admin: true }
    ] }
  ];

  const SIDEBAR_KEY = "gs.sidebarRecolhido";

  function icone(nome) {
    return `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome]}</svg>`;
  }

  function lerPreferencia(chave) {
    try { return localStorage.getItem(chave); } catch { return null; }
  }

  function gravarPreferencia(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch { /* sem storage: só não lembra */ }
  }

  function montarMenuLateral() {
    const nome = auth.perfil.nome || auth.user.email;
    const grupos = MENU.map(({ grupo, itens }) => {
      const visiveis = itens.filter((item) => !item.admin || auth.can("admin"));
      if (!visiveis.length) return "";
      const links = visiveis.map((item) => {
        const ativo = item.href === paginaAtual;
        return `<a class="sidebar-link${ativo ? " active" : ""}" href="${item.href}" title="${escapeHtml(item.label)}"${ativo ? ' aria-current="page"' : ""}>
            ${icone(item.icone)}<span class="sidebar-label">${escapeHtml(item.label)}</span>
          </a>`;
      }).join("");
      return `<div class="sidebar-group"><span class="sidebar-group-title">${escapeHtml(grupo)}</span>${links}</div>`;
    }).join("");

    const sidebar = document.createElement("aside");
    sidebar.className = "app-sidebar";
    sidebar.id = "appSidebar";
    sidebar.setAttribute("aria-label", "Menu principal");
    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <a class="sidebar-brand-link" href="index.html" title="Gestão Suporte">
          <span class="sidebar-logo" aria-hidden="true">GS</span>
          <span class="sidebar-brand-text"><strong>Gestão</strong><small>Suporte</small></span>
        </a>
        <button type="button" class="sidebar-collapse" id="sidebarCollapseBtn" aria-label="Recolher menu" title="Recolher menu">${icone("recolher")}</button>
      </div>
      <nav class="sidebar-nav">${grupos}</nav>
      <div class="sidebar-user">
        <div class="sidebar-user-info" title="${escapeHtml(nome)}">
          <span class="sidebar-avatar" aria-hidden="true">${escapeHtml(iniciais(nome))}</span>
          <span class="sidebar-user-text">
            <strong>${escapeHtml(nome)}</strong>
            <span class="user-role-badge role-${escapeHtml(auth.papel)}">${escapeHtml(PAPEIS[auth.papel] || auth.papel)}</span>
          </span>
        </div>
        <div class="sidebar-user-actions">
          <button type="button" class="sidebar-action" id="authChangePasswordBtn" title="Alterar senha">${icone("senha")}<span class="sidebar-label">Alterar senha</span></button>
          <button type="button" class="sidebar-action sidebar-action--sair" id="authLogoutBtn" title="Sair">${icone("sair")}<span class="sidebar-label">Sair</span></button>
        </div>
      </div>`;

    const topbar = document.createElement("header");
    topbar.className = "mobile-topbar";
    topbar.innerHTML = `
      <button type="button" class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menu" aria-controls="appSidebar" aria-expanded="false">${icone("menu")}</button>
      <a class="sidebar-brand-link" href="index.html">
        <span class="sidebar-logo" aria-hidden="true">GS</span>
        <span class="sidebar-brand-text"><strong>Gestão</strong><small>Suporte</small></span>
      </a>`;

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";

    document.body.prepend(topbar, sidebar, backdrop);
    document.body.classList.add("has-sidebar");
    if (lerPreferencia(SIDEBAR_KEY) === "1") document.body.classList.add("sidebar-collapsed");

    const menuBtn = topbar.querySelector("#mobileMenuBtn");
    const abrirMobile = (aberto) => {
      document.body.classList.toggle("sidebar-open", aberto);
      menuBtn.setAttribute("aria-expanded", String(aberto));
    };
    menuBtn.addEventListener("click", () => abrirMobile(!document.body.classList.contains("sidebar-open")));
    backdrop.addEventListener("click", () => abrirMobile(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("sidebar-open")) abrirMobile(false);
    });

    sidebar.querySelector("#sidebarCollapseBtn").addEventListener("click", () => {
      const recolhido = document.body.classList.toggle("sidebar-collapsed");
      gravarPreferencia(SIDEBAR_KEY, recolhido ? "1" : "0");
      const rotulo = recolhido ? "Expandir menu" : "Recolher menu";
      const btn = sidebar.querySelector("#sidebarCollapseBtn");
      btn.setAttribute("aria-label", rotulo);
      btn.title = rotulo;
    });

    sidebar.querySelector("#authLogoutBtn").addEventListener("click", signOut);
    sidebar.querySelector("#authChangePasswordBtn").addEventListener("click", () => {
      abrirMobile(false);
      abrirAlterarSenha();
    });
  }

  function avisarAcessoNegado() {
    if (new URLSearchParams(window.location.search).get("negado") !== "1") return;
    alert("Você não tem permissão para acessar aquela página.");
    const url = new URL(window.location.href);
    url.searchParams.delete("negado");
    window.history.replaceState(null, "", url.pathname.split("/").pop() + url.search);
  }

  function abrirAlterarSenha() {
    let modal = document.getElementById("authPasswordModal");
    if (!modal) {
      modal = document.createElement("dialog");
      modal.id = "authPasswordModal";
      modal.className = "popup-modal";
      modal.setAttribute("aria-labelledby", "authPasswordModalTitle");
      modal.innerHTML = `
        <div class="modal-panel">
          <div class="modal-header">
            <h2 id="authPasswordModalTitle">Alterar senha</h2>
            <button type="button" class="icon-button" data-auth-close aria-label="Fechar">X</button>
          </div>
          <form id="authPasswordForm" novalidate>
            <div class="form-grid">
              <div class="col-12">
                <label for="authNovaSenha">Nova senha</label>
                <input id="authNovaSenha" type="password" autocomplete="new-password" minlength="8" required />
              </div>
              <div class="col-12">
                <label for="authConfirmaSenha">Confirmar nova senha</label>
                <input id="authConfirmaSenha" type="password" autocomplete="new-password" minlength="8" required />
              </div>
            </div>
            <p class="auth-message" id="authPasswordMsg" role="alert" hidden></p>
            <div class="actions">
              <button type="submit">Salvar nova senha</button>
              <button type="button" class="ghost" data-auth-close>Cancelar</button>
            </div>
          </form>
        </div>`;
      document.body.appendChild(modal);

      const fechar = () => { modal.close(); document.body.classList.remove("modal-open"); };
      modal.querySelectorAll("[data-auth-close]").forEach((b) => b.addEventListener("click", fechar));
      modal.addEventListener("click", (e) => { if (e.target === modal) fechar(); });
      modal.addEventListener("close", () => document.body.classList.remove("modal-open"));

      modal.querySelector("#authPasswordForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const msg = modal.querySelector("#authPasswordMsg");
        const senha = modal.querySelector("#authNovaSenha").value;
        const confirma = modal.querySelector("#authConfirmaSenha").value;
        const erro = validarSenha(senha, confirma);
        if (erro) return mostrarMensagem(msg, erro, "erro");

        const btn = event.submitter || modal.querySelector('button[type="submit"]');
        btn.disabled = true;
        const { error } = await db.auth.updateUser({ password: senha });
        btn.disabled = false;
        if (error) return mostrarMensagem(msg, traduzirErro(error), "erro");
        mostrarMensagem(msg, "Senha alterada com sucesso.", "sucesso");
        setTimeout(fechar, 1200);
      });
    }

    modal.querySelector("#authPasswordForm").reset();
    modal.querySelector("#authPasswordMsg").hidden = true;
    modal.showModal();
    document.body.classList.add("modal-open");
  }

  // ── login.html ─────────────────────────────────────────────────────────────

  async function initLoginPage(recuperacao, erroNaUrl) {
    const params = new URLSearchParams(window.location.search);
    const next = destinoSeguro(params.get("next"));
    const views = {
      login: document.getElementById("loginView"),
      cadastro: document.getElementById("signupView"),
      recuperar: document.getElementById("recoverView"),
      redefinir: document.getElementById("resetView")
    };
    const msg = document.getElementById("authMessage");

    const mostrarView = (nome) => {
      Object.entries(views).forEach(([key, el]) => { if (el) el.hidden = key !== nome; });
      msg.hidden = true;
      const primeiro = views[nome] && views[nome].querySelector("input");
      if (primeiro) primeiro.focus();
    };

    document.querySelectorAll("[data-auth-view]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarView(link.getAttribute("data-auth-view"));
      });
    });

    const motivos = {
      inativo: "Seu usuário está aguardando liberação ou foi desativado. Fale com um administrador.",
      erro: "Não foi possível validar seu acesso. Tente entrar novamente."
    };

    recuperacao.onChange = () => mostrarView("redefinir");
    let mensagemInicial = null;

    // Já logado (ex.: abriu login.html de novo): segue direto para o sistema.
    if (!recuperacao.ativa && !params.get("motivo")) {
      const { data: { session } } = await db.auth.getSession();
      if (session && !recuperacao.ativa) {
        const resultado = await validarPerfilAposLogin(session.user.id);
        if (resultado.ok) return window.location.replace(next);
        // Ex.: voltou do link de confirmação de e-mail com a conta ainda pendente.
        await db.auth.signOut();
        window.history.replaceState(null, "", PAGINA_LOGIN);
        mensagemInicial = resultado.mensagem;
      }
    }

    document.getElementById("loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const senha = document.getElementById("loginSenha").value;
      if (!email || !senha) return mostrarMensagem(msg, "Informe e-mail e senha.", "erro");

      await comBotaoOcupado(event, "Entrando...", async () => {
        const { data, error } = await db.auth.signInWithPassword({ email, password: senha });
        if (error) return mostrarMensagem(msg, traduzirErro(error), "erro");

        const resultado = await validarPerfilAposLogin(data.user.id);
        if (!resultado.ok) {
          await db.auth.signOut();
          return mostrarMensagem(msg, resultado.mensagem, "erro");
        }
        window.location.replace(next);
      });
    });

    document.getElementById("signupForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const nome = document.getElementById("signupNome").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const senha = document.getElementById("signupSenha").value;
      const confirma = document.getElementById("signupConfirma").value;
      if (!nome || !email) return mostrarMensagem(msg, "Informe nome e e-mail.", "erro");
      const erro = validarSenha(senha, confirma);
      if (erro) return mostrarMensagem(msg, erro, "erro");

      await comBotaoOcupado(event, "Enviando...", async () => {
        const { error } = await db.auth.signUp({
          email,
          password: senha,
          options: { data: { nome }, emailRedirectTo: urlDaPagina(PAGINA_LOGIN) }
        });
        if (error) return mostrarMensagem(msg, traduzirErro(error), "erro");
        await db.auth.signOut();
        event.target.reset();
        mostrarView("login");
        mostrarMensagem(msg,
          "Solicitação enviada. Se for pedido, confirme seu e-mail. Você poderá entrar assim que um administrador liberar seu acesso.",
          "sucesso");
      });
    });

    document.getElementById("recoverForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("recoverEmail").value.trim();
      if (!email) return mostrarMensagem(msg, "Informe seu e-mail.", "erro");

      await comBotaoOcupado(event, "Enviando...", async () => {
        const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: urlDaPagina(PAGINA_LOGIN) });
        if (error) return mostrarMensagem(msg, traduzirErro(error), "erro");
        mostrarMensagem(msg, "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.", "sucesso");
      });
    });

    document.getElementById("resetForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const senha = document.getElementById("resetSenha").value;
      const confirma = document.getElementById("resetConfirma").value;
      const erro = validarSenha(senha, confirma);
      if (erro) return mostrarMensagem(msg, erro, "erro");

      await comBotaoOcupado(event, "Salvando...", async () => {
        const { error } = await db.auth.updateUser({ password: senha });
        if (error) return mostrarMensagem(msg, traduzirErro(error), "erro");
        await db.auth.signOut();
        window.history.replaceState(null, "", PAGINA_LOGIN);
        mostrarView("login");
        mostrarMensagem(msg, "Senha redefinida. Entre com a nova senha.", "sucesso");
      });
    });

    mostrarView(recuperacao.ativa ? "redefinir" : "login");
    if (mensagemInicial) {
      mostrarMensagem(msg, mensagemInicial, "erro");
    } else if (erroNaUrl) {
      mostrarMensagem(msg, "O link expirou ou é inválido. Solicite um novo link de recuperação.", "erro");
    } else if (motivos[params.get("motivo")]) {
      mostrarMensagem(msg, motivos[params.get("motivo")], "erro");
    }
  }

  async function validarPerfilAposLogin(userId) {
    try {
      const perfil = await carregarPerfil(userId);
      if (!perfil) return { ok: false, mensagem: "Perfil de acesso não encontrado. Fale com um administrador." };
      if (!perfil.ativo) return { ok: false, mensagem: "Seu usuário está aguardando liberação ou foi desativado. Fale com um administrador." };
      return { ok: true, perfil };
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      return { ok: false, mensagem: "Não foi possível carregar seu perfil de acesso. Verifique se o script supabase/auth.sql foi executado." };
    }
  }

  // Só aceita páginas locais do sistema — evita redirecionamento para fora.
  function destinoSeguro(valor) {
    if (valor && /^[a-z0-9-]+\.html(\?[^#]*)?$/i.test(valor) && !valor.toLowerCase().startsWith(PAGINA_LOGIN)) {
      return valor;
    }
    return "index.html";
  }

  function urlDaPagina(pagina) {
    return new URL(pagina, window.location.href).href.split("?")[0].split("#")[0];
  }

  async function comBotaoOcupado(event, texto, fn) {
    const btn = event.submitter || event.target.querySelector('button[type="submit"]');
    const original = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = texto; }
    try {
      await fn();
    } catch (err) {
      console.error(err);
      mostrarMensagem(document.getElementById("authMessage"), "Erro inesperado. Tente novamente.", "erro");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = original; }
    }
  }

  // ── Utilitários ───────────────────────────────────────────────────────────

  function validarSenha(senha, confirma) {
    if (!senha || senha.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
    if (senha !== confirma) return "As senhas não conferem.";
    return "";
  }

  function traduzirErro(error) {
    const texto = String((error && error.message) || "");
    if (/invalid login credentials/i.test(texto)) return "E-mail ou senha inválidos.";
    if (/email not confirmed/i.test(texto)) return "Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).";
    if (/already registered|already been registered/i.test(texto)) return "Este e-mail já está cadastrado.";
    if (/password should be at least/i.test(texto)) return "A senha não atende ao tamanho mínimo exigido.";
    if (/should be different/i.test(texto)) return "A nova senha deve ser diferente da atual.";
    if (/rate limit|too many/i.test(texto)) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    if (/signups not allowed|signup is disabled/i.test(texto)) return "O cadastro de novos usuários está desativado.";
    return texto || "Não foi possível concluir a operação.";
  }
  auth.traduzirErro = traduzirErro;

  function mostrarMensagem(el, texto, tipo) {
    if (!el) return alert(texto);
    el.textContent = texto;
    el.className = "auth-message auth-message-" + tipo;
    el.hidden = false;
  }

  function iniciais(texto) {
    return String(texto || "?").trim().split(/[\s@.]+/).filter(Boolean).slice(0, 2)
      .map((p) => p[0].toUpperCase()).join("") || "?";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function whenDomReady() {
    if (document.readyState !== "loading") return Promise.resolve();
    return new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
  }
})();
