/* PastaFácil: service worker, app funciona offline.
   IMPORTANTE: sempre que qualquer arquivo do SHELL abaixo mudar (index.html,
   core.js, db.js, i18n.js, app.js), bump a VERSION aqui embaixo. Sem isso,
   quem já usou o app antes continua vendo a versão antiga em cache
   indefinidamente (o service worker so busca tudo de novo quando a VERSION
   muda). */
var VERSION = "pf-v34";
// Motivo desta atualizacao, mostrado no aviso "tem uma versao nova" da
// pagina (junto com o numero da versao acima). Atualize essa frase toda
// vez que bumpar a VERSION, resumindo o que mudou (correcao de bug, novo
// recurso, melhoria etc.) - a pessoa que usa a ferramenta ve isso antes
// de clicar em "Atualizar agora".
var CHANGENOTE = "Mensagens da ferramenta agora aparecem no idioma escolhido (EN/ES), a numeração pode começar em 0, o prefixo não é mais afetado por MAIÚSCULAS/minúsculas, e o tema volta a acompanhar o sistema.";
var SHELL = [
  "./",
  "./index.html",
  "./core.js",
  "./db.js",
  "./i18n.js",
  "./app.js",
  "./vendor/jszip.min.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192-maskable.png",
  "./icon-512-maskable.png",
  "../icon.svg",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, { cache: "reload" })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // deixa CDNs passarem direto

  // navegação: rede primeiro, cache de reserva
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (m) { return m || caches.match("./"); });
      })
    );
    return;
  }

  // demais assets do mesmo domínio: cache primeiro, rede de reserva (e guarda)
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && (res.type === "basic" || res.type === "default")) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
