/* PastaFácil - pagina de apresentacao (pastafacil/index.html): altura do iframe da ferramenta,
   ano do rodape e o menu lateral (Como funciona / Recursos / Privacidade / Abrir ferramenta).

   Ficava como <script> inline no proprio HTML; virou arquivo separado pra poder travar uma
   Content-Security-Policy sem 'unsafe-inline' em script-src (vercel.json na raiz do repo) - com
   <script> inline, CSP e onclick="..." simplesmente nao rodam. */
"use strict";

(function () {
  var f = document.getElementById("pf");
  window.addEventListener("message", function (e) {
    if (e.origin !== location.origin) return;
    if (e.source !== f.contentWindow || !e.data || e.data.type !== "pf-height") return;
    var h = Math.max(360, Math.min(4000, Number(e.data.height) || 0));
    if (h) f.style.height = (h + 24) + "px";
  });
})();

var ano = document.getElementById("anoAtual");
if (ano) ano.textContent = new Date().getFullYear();

/* ---------------- menu lateral ----------------
   Mesmo padrao acessivel de app/boot.js: foco vai pro primeiro item ao abrir, Tab fica preso
   dentro do menu, Esc fecha, e o foco volta pro botao que abriu ao fechar. */
var MENU_VIEWS = ["list", "como", "recursos", "privacidade"];

function pfShowView(view) {
  MENU_VIEWS.forEach(function (v) {
    var el = document.getElementById("menuView" + v.charAt(0).toUpperCase() + v.slice(1));
    if (el) el.classList.toggle("is-hidden", v !== view);
  });
  var nav = document.getElementById("sideMenu");
  if (nav) nav.scrollTop = 0;
  // Depois de trocar de tela, garante que o foco fique em algo visivel dentro do menu - sem isso,
  // se o item clicado pertencia a tela que acabou de sumir, o foco ficava orfao em <body>.
  if (nav && !nav.classList.contains("is-hidden") && !nav.contains(document.activeElement)) {
    var f3 = pfFocaveisDoMenu();
    if (f3.length) f3[0].focus();
  }
}
function pfFocaveisDoMenu() {
  var nav = document.getElementById("sideMenu");
  if (!nav) return [];
  return Array.prototype.slice.call(nav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
}
var pfMenuAbridoPor = null;
// So' captura quem abriu / focou o 1o item numa transicao FECHADO -> ABERTO de verdade - sem
// esse "estavaFechado", cada clique num item do menu (que tambem passa por pfShowMenu) reescrevia
// pfMenuAbridoPor com o proprio item clicado, e o Esc devolvia o foco pro lugar errado.
function pfShowMenu() {
  var nav = document.getElementById("sideMenu");
  var estavaFechado = nav.classList.contains("is-hidden");
  if (estavaFechado) pfMenuAbridoPor = document.activeElement;
  nav.classList.remove("is-hidden");
  document.getElementById("sideMenuOverlay").classList.remove("is-hidden");
  if (estavaFechado) {
    var f2 = pfFocaveisDoMenu();
    if (f2.length) f2[0].focus();
  }
}
function pfOpenMenu() { pfShowMenu(); pfShowView("list"); }
function pfCloseMenu() {
  document.getElementById("sideMenu").classList.add("is-hidden");
  document.getElementById("sideMenuOverlay").classList.add("is-hidden");
  if (pfMenuAbridoPor && typeof pfMenuAbridoPor.focus === "function") pfMenuAbridoPor.focus();
  pfMenuAbridoPor = null;
}
document.addEventListener("keydown", function (e) {
  var nav = document.getElementById("sideMenu");
  if (!nav || nav.classList.contains("is-hidden")) return;
  if (e.key === "Escape") { e.preventDefault(); pfCloseMenu(); return; }
  if (e.key !== "Tab") return;
  var fs = pfFocaveisDoMenu();
  if (!fs.length) return;
  var primeiro = fs[0], ultimo = fs[fs.length - 1];
  if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
});
// Delegacao: substitui os onclick="..." inline do HTML (data-pf-view / data-pf-action),
// bloqueados por CSP script-src sem 'unsafe-inline'.
document.addEventListener("click", function (e) {
  var comView = e.target.closest("[data-pf-view]");
  if (comView) { pfShowMenu(); pfShowView(comView.getAttribute("data-pf-view")); return; }
  var comAcao = e.target.closest("[data-pf-action]");
  if (!comAcao) return;
  var acao = comAcao.getAttribute("data-pf-action");
  if (acao === "open") pfOpenMenu();
  else if (acao === "close") pfCloseMenu();
  else if (acao === "back") pfShowView("list");
});
