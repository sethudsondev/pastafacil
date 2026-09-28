/* PastaFácil - "boot" da pagina da ferramenta (app/index.html): tema, menu lateral acessivel,
   idioma, instalar como app (PWA) e aviso de atualizacao.

   Ficava como <script> inline no proprio HTML; virou arquivo separado pra poder travar uma
   Content-Security-Policy sem 'unsafe-inline' em script-src (vercel.json na raiz do repo) - com
   <script> inline, CSP e onclick="..." simplesmente nao rodam. Os botoes do HTML nao tem mais
   onclick="...": tem data-pf-view="tutorial" (abre aquela tela do menu) ou
   data-pf-action="open|close|back|theme" (abertos aqui por delegacao, num unico listener). */
"use strict";

function pf$(id) { return document.getElementById(id); }

/* ---------------- tema ----------------
   Comeca seguindo o sistema operacional (prefers-color-scheme); o botao ao lado dos idiomas
   deixa escolher manualmente. So' grava no localStorage quando a pessoa escolhe manualmente
   (persist=true) - gravando tambem ao so' "seguir o sistema", o tema ficava congelado depois da
   1a visita e parava de acompanhar o SO. */
function pfAplicarTema(tema, persist) {
  document.documentElement.setAttribute("data-theme", tema);
  if (persist) { try { localStorage.setItem("pastafacil-theme", tema); } catch (e) {} }
  var btn = pf$("pfThemeToggle");
  if (btn) btn.innerHTML = tema === "light"
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
}
function pfToggleTheme() {
  var atual = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  pfAplicarTema(atual === "light" ? "dark" : "light", true);
}
(function () {
  var salvo = null;
  try { salvo = localStorage.getItem("pastafacil-theme"); } catch (e) {}
  var mql = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");
  pfAplicarTema(salvo || (mql && mql.matches ? "light" : "dark"), false);
  if (mql && mql.addEventListener) mql.addEventListener("change", function (ev) {
    var escolha = null;
    try { escolha = localStorage.getItem("pastafacil-theme"); } catch (e) {}
    if (!escolha) pfAplicarTema(ev.matches ? "light" : "dark", false);
  });
})();
// Mantem o tema em sincronia com a pagina externa (mesma origem, mesmo localStorage)
window.addEventListener("storage", function (e) {
  if (e.key === "pastafacil-theme" && e.newValue) pfAplicarTema(e.newValue, false);
});

/* ---------------- menu lateral ----------------
   Varias "telas" (list, tutorial, historico, lib, config...) - so' uma fica visivel por vez
   dentro do proprio menu. Acessivel: role="dialog" no HTML; aqui, foco vai pro primeiro item ao
   abrir, Tab fica preso dentro do menu enquanto ele estiver aberto, Esc fecha, e o foco volta pro
   botao que abriu o menu ao fechar (sem isso, quem usa so' o teclado perdia o lugar). */
var MENU_VIEWS = ["list", "tutorial", "recursos", "privacidade", "historico", "lib", "config"];
var pfMenuAbridoPor = null;

function pfFocaveisDoMenu() {
  var nav = pf$("sideMenu");
  if (!nav) return [];
  return Array.prototype.slice.call(nav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
}
function pfShowView(view) {
  MENU_VIEWS.forEach(function (v) {
    var el = pf$("menuView" + v.charAt(0).toUpperCase() + v.slice(1));
    if (el) el.classList.toggle("is-hidden", v !== view);
  });
  if (view === "config" && typeof pfRefreshConfigAtual === "function") pfRefreshConfigAtual();
  var nav = pf$("sideMenu");
  if (nav) nav.scrollTop = 0;
  // Depois de trocar de tela, garante que o foco fique em algo visivel dentro do menu - sem isso,
  // se o item clicado pertencia a tela que acabou de sumir, o foco ficava orfao em <body>.
  if (nav && !nav.classList.contains("is-hidden") && !nav.contains(document.activeElement)) {
    var f2 = pfFocaveisDoMenu();
    if (f2.length) f2[0].focus();
  }
}
// So' captura quem abriu / foca o 1o item numa transicao FECHADO -> ABERTO de verdade - sem esse
// "estavaFechado", cada clique num item do menu (que tambem passa por pfShowMenu) reescrevia
// pfMenuAbridoPor com o proprio item clicado, e Esc/fechar devolvia o foco pro lugar errado.
function pfShowMenu() {
  var nav = pf$("sideMenu");
  var estavaFechado = nav.classList.contains("is-hidden");
  if (estavaFechado) pfMenuAbridoPor = document.activeElement;
  nav.classList.remove("is-hidden");
  pf$("sideMenuOverlay").classList.remove("is-hidden");
  if (estavaFechado) {
    var f = pfFocaveisDoMenu();
    if (f.length) f[0].focus();
  }
}
function pfOpenMenu() { pfShowMenu(); pfShowView("list"); }
function pfCloseMenu() {
  pf$("sideMenu").classList.add("is-hidden");
  pf$("sideMenuOverlay").classList.add("is-hidden");
  if (pfMenuAbridoPor && typeof pfMenuAbridoPor.focus === "function") pfMenuAbridoPor.focus();
  pfMenuAbridoPor = null;
}
document.addEventListener("keydown", function (e) {
  var nav = pf$("sideMenu");
  if (!nav || nav.classList.contains("is-hidden")) return;
  if (e.key === "Escape") { e.preventDefault(); pfCloseMenu(); return; }
  if (e.key !== "Tab") return;
  var f = pfFocaveisDoMenu();
  if (!f.length) return;
  var primeiro = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
});
// Delegacao: um listener so' pros botoes do menu, do tema e do "Atualizar agora" do banner -
// evita onclick="..." inline no HTML (bloqueado por CSP script-src sem 'unsafe-inline').
document.addEventListener("click", function (e) {
  var comView = e.target.closest("[data-pf-view]");
  if (comView) { pfShowMenu(); pfShowView(comView.getAttribute("data-pf-view")); return; }
  var comAcao = e.target.closest("[data-pf-action]");
  if (!comAcao) return;
  var acao = comAcao.getAttribute("data-pf-action");
  if (acao === "open") pfOpenMenu();
  else if (acao === "close") pfCloseMenu();
  else if (acao === "back") pfShowView("list");
  else if (acao === "theme") pfToggleTheme();
  else if (acao === "reload") location.reload();
});

/* ---------------- idioma ---------------- */
PastaFacilI18n.init();
document.querySelectorAll(".langswitch button").forEach(function (b) {
  b.addEventListener("click", function () { PastaFacilI18n.apply(b.dataset.lang); });
});

/* ---------------- PWA: aviso de atualizacao + instalar + service worker ---------------- */
function tr(k) {
  if (!window.PastaFacilI18n || typeof PastaFacilI18n.t !== "function") return "";
  return PastaFacilI18n.t(k);
}
function showUpdateBanner() {
  var b = pf$("updateBanner");
  if (!b) return;
  b.style.display = "flex";
  // Busca o sw.js recem-instalado (sem cache) so' pra ler a versao e o motivo da atualizacao
  // (VERSION/CHANGENOTE) e mostrar pra pessoa, antes dela decidir clicar em "Atualizar agora".
  fetch("/pastafacil/app/sw.js", { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (txt) {
    var v = (txt.match(/var VERSION = "([^"]+)"/) || [])[1];
    var nota = (txt.match(/var CHANGENOTE = "([^"]*)"/) || [])[1];
    var span = b.querySelector("[data-i18n='updateMsg']");
    if (!span || !v) return;
    var key = nota ? "updateFull" : "updateVersion";
    var texto = tr(key);
    // Se a traducao nao resolveu de verdade (ex.: i18n.js ainda nao carregou nessa aba), NAO
    // troca o texto - mantem a frase padrao em portugues que ja esta no HTML.
    if (!texto || texto === key) return;
    span.textContent = "⟳ " + texto.replace("{v}", v.replace(/^pf-v/, "v")).replace("{nota}", nota || "");
  }).catch(function () {});
}
if ("serviceWorker" in navigator &&
    (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/pastafacil/app/sw.js").then(function (reg) {
      reg.addEventListener("updatefound", function () {
        var novo = reg.installing;
        if (!novo) return;
        novo.addEventListener("statechange", function () {
          if (novo.state === "installed" && navigator.serviceWorker.controller) showUpdateBanner();
        });
      });
      setInterval(function () { reg.update().catch(function () {}); }, 20 * 60 * 1000);
    }).catch(function () {});
  });
}
(function () {
  var deferred = null;
  var btn = pf$("btnInstall");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e; if (btn) btn.hidden = false;
  });
  // iOS/iPadOS nunca dispara "beforeinstallprompt" - mas ainda da pra instalar manualmente via
  // Compartilhar > Adicionar a Tela de Inicio. Mostra o botao mesmo assim, com passo a passo.
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var jaInstalado = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  if (isIOS && !jaInstalado && btn) btn.hidden = false;
  if (btn) btn.addEventListener("click", function () {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.finally(function () { deferred = null; btn.hidden = true; });
      return;
    }
    if (isIOS) alert(tr("installIosSteps"));
  });
  window.addEventListener("appinstalled", function () { if (btn) btn.hidden = true; });
})();
