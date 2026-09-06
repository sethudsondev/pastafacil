/* PastaFácil - biblioteca local (IndexedDB).
   Guarda listas coladas, arquivos enviados e o histórico de operações
   SÓ no navegador do usuário. */
(function (global) {
  "use strict";

  var NAME = "pastafacil";
  var STORE = "itens";
  var STORE_HIST = "historico";
  var VERSION = 2;
  var dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!global.indexedDB) return rej(new Error("Seu navegador não suporta biblioteca local."));
      var req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_HIST)) {
          db.createObjectStore(STORE_HIST, { keyPath: "id" });
        }
      };
      req.onsuccess = function () { res(req.result); };
      req.onerror = function () { rej(req.error || new Error("Falha ao abrir a biblioteca.")); };
    });
    return dbp;
  }

  function tx(storeName, mode) {
    return open().then(function (db) {
      return db.transaction(storeName, mode).objectStore(storeName);
    });
  }
  function toPromise(req) {
    return new Promise(function (res, rej) {
      req.onsuccess = function () { res(req.result); };
      req.onerror = function () { rej(req.error); };
    });
  }
  function uid() {
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  // fabrica um conjunto put/get/remove/list/clear pra uma store especifica -
  // usado tanto pra "itens" (biblioteca) quanto pra "historico" (auditoria).
  function makeApi(storeName) {
    return {
      uid: uid,
      put: function (item) {
        item.updatedAt = Date.now();
        if (!item.createdAt) item.createdAt = item.updatedAt;
        return tx(storeName, "readwrite").then(function (s) { return toPromise(s.put(item)); }).then(function () { return item; });
      },
      get: function (id) {
        return tx(storeName, "readonly").then(function (s) { return toPromise(s.get(id)); });
      },
      remove: function (id) {
        return tx(storeName, "readwrite").then(function (s) { return toPromise(s.delete(id)); });
      },
      list: function () {
        return tx(storeName, "readonly").then(function (s) { return toPromise(s.getAll()); }).then(function (all) {
          return (all || []).sort(function (a, b) { return b.updatedAt - a.updatedAt; });
        });
      },
      clear: function () {
        return tx(storeName, "readwrite").then(function (s) { return toPromise(s.clear()); });
      },
    };
  }

  var API = makeApi(STORE);
  API.historico = makeApi(STORE_HIST);

  global.PastaFacilDB = API;
})(window);
