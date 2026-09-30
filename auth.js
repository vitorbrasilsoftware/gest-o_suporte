// ── Autenticação e controle de acesso ────────────────────────────────────────
// Carregado no <head> de todas as páginas, logo após supabase-config.js.
// - Páginas protegidas: esconde o conteúdo até validar sessão + perfil ativo,
//   expõe `window.authReady` (Promise<boolean>) que o script.js aguarda antes
//   de carregar dados, e injeta a barra do usuário (nome, papel, sair).
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
      montarBarraUsuario();
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

  function montarBarraUsuario() {
    const bar = document.createElement("div");
    bar.className = "user-bar";
    bar.innerHTML = `
      <div class="user-bar-info">
        <span class="user-bar-avatar" aria-hidden="true">${escapeHtml(iniciais(auth.perfil.nome || auth.user.email))}</span>
        <div>
          <strong>${escapeHtml(auth.perfil.nome || auth.user.email)}</strong>
          <span class="user-role-badge role-${escapeHtml(auth.papel)}">${escapeHtml(PAPEIS[auth.papel] || auth.papel)}</span>
        </div>
      </div>
      <div class="user-bar-actions">
        ${auth.can("admin") ? '<a class="user-bar-link" href="usuarios.html">Usuários</a>' : ""}
        <button type="button" class="ghost" id="authChangePasswordBtn">Alterar senha</button>
        <button type="button" class="ghost" id="authLogoutBtn">Sair</button>
      </div>`;

    const container = document.querySelector("main.container") || document.body;
    container.insertBefore(bar, container.firstChild);

    bar.querySelector("#authLogoutBtn").addEventListener("click", signOut);
    bar.querySelector("#authChangePasswordBtn").addEventListener("click", abrirAlterarSenha);
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
