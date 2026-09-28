"use strict";
(function () {
  var C = window.PastaFacilCore;
  var $ = function (s) { return document.querySelector(s); };
  var el = {};
  [
    "names", "file", "drop", "dropLabel", "fileList", "tableOpts", "sheetField", "sheet", "allSheets",
    "nameCols", "groupColumn", "groupColumn2", "groupColumn2Wrap", "separator", "hasHeader", "subdir", "perGroupWrap", "perGroupZip",
    "docDrop", "docFile", "docDropLabel", "docList",
    "btnSave", "saveHint", "libCount", "libList", "libClear",
    "historicoCount", "historicoList", "historicoClear",
    "configAtual", "configSave", "configReset", "configSaveHint",
    "prefix", "letterCase", "sortOrder", "number", "numberOpts", "numStart", "numPad", "template",
    "noAccents", "keepFile", "whoName", "whoMatricula", "whoSector", "whoUnidade", "whoRole", "btnPreview", "btnZip", "btnDirect", "btnShareCfg", "msg", "progress", "result",
    "resultTitle", "counts", "btnExportCsv", "btnReiniciar",
  ].forEach(function (id) { el[id] = document.getElementById(id); });
  el.planBody = $("#planTable tbody");
  el.bar = $("#progress i");

  var DB = window.PastaFacilDB;
  var I18N = window.PastaFacilI18n;
  var tr = function (k) { return I18N ? I18N.t(k) : k; };
  // Igual a tr(), mas troca marcadores {x} pelos valores passados.
  // Ex.: trf("r_errPrefix", { err: e.message }).
  var trf = function (k, vars) {
    var s = tr(k);
    if (vars) for (var p in vars) s = s.split("{" + p + "}").join(String(vars[p] == null ? "" : vars[p]));
    return s;
  };
  // Locale para datas/horas, acompanha o idioma da interface.
  var DATE_LOCALE = { pt: "pt-BR", en: "en-US", es: "es-ES" };
  var dloc = function () { return DATE_LOCALE[I18N && I18N.lang] || "pt-BR"; };
  var activeTab = "paste";
  var files = []; // { file, name, ext, kind:'lista'|'tabela', sheets:[], sheetName, rows:[[...]], wb }
  var docs = [];  // { name, buffer }  - arquivos a distribuir nas pastas
  var MAX_PREVIEW_ROWS = 300;
  var BIG_LIST = 8000;

  /* ---------------- util ---------------- */
  function msg(text, kind) { el.msg.textContent = text; el.msg.className = "msg " + (kind || "info"); }
  function clearMsg() { el.msg.className = "msg is-hidden"; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m];
    });
  }
  // Icone "remover/apagar" (X), repetido em varias listas (arquivos, documentos, biblioteca,
  // historico, mapeamentos). Um so lugar pra mudar o desenho, em vez de 5 copias do mesmo SVG.
  var CLOSE_SVG = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>";

  // Nome do documento (d.name = File.name) usado como entrada no zip ou como nome de arquivo real
  // (File System Access API). Em arquivos soltos do disco isso nunca traz "/" - o navegador nao
  // deixa -, mas nao ha garantia pra sempre (ex.: um File montado por script). So essa barra e' o
  // risco real: dentro do zip ela criaria subpasta(s) e um ".." poderia escapar da pasta de
  // destino ao extrair (zip slip). Troca so "/" "\" e caracteres de controle - mantem o resto do
  // nome (inclusive espacos e acentos) igual ao que aparece na tela, pra nao confundir a pessoa.
  function docEntryName(name) {
    var s = String(name == null ? "" : name).replace(/[/\\]+/g, "-").replace(/[\u0000-\u001f]/g, "");
    return /^\.+$/.test(s) || !s ? "arquivo" : s;
  }
  function reportHeightNow() {
    if (window.parent === window) return;
    // Mesma origem da pagina externa (lumvix.com.br) - nao manda "*".
    try { window.parent.postMessage({ type: "pf-height", height: document.body.scrollHeight }, location.origin); }
    catch (e) { /* ignora */ }
  }
  // Debounce: ResizeObserver/resize podem disparar em rajada; sem isso a
  // pagina externa recebe dezenas de postMessage por segundo em cada relayout.
  var _rhTimer = null;
  function reportHeight() {
    if (_rhTimer) return;
    _rhTimer = setTimeout(function () { _rhTimer = null; reportHeightNow(); }, 120);
  }
  window.addEventListener("load", reportHeightNow);
  window.addEventListener("resize", reportHeight);
  if (window.ResizeObserver) new ResizeObserver(reportHeight).observe(document.body);

  /* ---------------- tabs ---------------- */
  document.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      activeTab = t.dataset.tab;
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.toggle("on", x === t); });
      document.querySelectorAll("[data-panel]").forEach(function (p) {
        p.classList.toggle("is-hidden", p.dataset.panel !== activeTab);
      });
    });
  });

  /* ---------------- toggles avançados ---------------- */
  el.number.addEventListener("change", function () {
    el.numberOpts.classList.toggle("is-hidden", !el.number.checked);
  });
  el.allSheets.addEventListener("change", function () {
    el.sheet.disabled = el.allSheets.checked;
    updateGroupUI();
  });
  el.groupColumn.addEventListener("change", updateGroupUI);
  el.groupColumn2.addEventListener("change", updateGroupWarn);

  function hasGrouping() {
    return el.allSheets.checked || (el.groupColumn && el.groupColumn.value !== "");
  }
  function updateGroupUI() {
    el.perGroupWrap.classList.toggle("is-hidden", !hasGrouping());
    if (!hasGrouping()) el.perGroupZip.checked = false;
    // 2º nível só faz sentido quando ja tem um 1º nível escolhido.
    var temNivel1 = el.groupColumn.value !== "";
    el.groupColumn2Wrap.classList.toggle("is-hidden", !temNivel1);
    if (!temNivel1) el.groupColumn2.value = "";
    updateGroupWarn();
  }
  function updateGroupWarn() {
    var warnEl = document.getElementById("groupWarn");
    if (!warnEl) return;
    var gv = el.groupColumn.value, gv2 = el.groupColumn2.value;
    var marcadas = checkedNameColumns();
    var sobrepoe = (gv !== "" && marcadas.indexOf(Number(gv)) !== -1) ||
      (gv2 !== "" && marcadas.indexOf(Number(gv2)) !== -1);
    warnEl.classList.toggle("is-hidden", !sobrepoe);
  }

  /* ---------------- SheetJS sob demanda ---------------- */
  var xlsxPromise = null;
  function loadXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (!xlsxPromise) {
      xlsxPromise = new Promise(function (res, rej) {
        var s = document.createElement("script");
        s.src = "vendor/xlsx.full.min.js";
        s.onload = function () { res(window.XLSX); };
        s.onerror = function () { rej(new Error(tr("r_loadExcelFail"))); };
        document.head.appendChild(s);
      });
    }
    return xlsxPromise;
  }

  /* ---------------- pdf.js sob demanda ---------------- */
  var pdfjsPromise = null;
  function loadPdfjs() {
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = import("./vendor/pdf.min.mjs").then(function (mod) {
      var lib = mod.default && mod.default.getDocument ? mod.default : mod;
      try { lib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.mjs"; } catch (e) { /* ignora */ }
      return lib;
    }).catch(function () {
      pdfjsPromise = null;
      throw new Error(tr("r_loadPdfFail"));
    });
    return pdfjsPromise;
  }

  function extractPdfLines(file) {
    return loadPdfjs().then(function (pdfjs) {
      return file.arrayBuffer().then(function (buf) {
        var task = pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, disableAutoFetch: true });
        return task.promise.then(function (doc) {
          var pages = [];
          for (var i = 1; i <= doc.numPages; i++) pages.push(i);
          return pages.reduce(function (chain, n) {
            return chain.then(function (acc) {
              return doc.getPage(n).then(function (page) {
                return page.getTextContent().then(function (content) {
                  var lastY = null, cur = "";
                  content.items.forEach(function (it) {
                    if (typeof it.str !== "string") return;
                    var y = it.transform ? it.transform[5] : null;
                    if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
                      if (cur.trim()) acc.push(cur.trim());
                      cur = "";
                    }
                    cur += it.str;
                    if (it.hasEOL) { if (cur.trim()) acc.push(cur.trim()); cur = ""; }
                    lastY = y;
                  });
                  if (cur.trim()) acc.push(cur.trim());
                  return acc;
                });
              });
            });
          }, Promise.resolve([])).then(function (lines) {
            try { doc.destroy(); } catch (e) { /* ignora */ }
            // limpa: sem vazias, sem "#", sem numeros de pagina soltos
            return lines
              .map(function (l) { return l.replace(/\s+/g, " ").trim(); })
              .filter(function (l) { return l && l[0] !== "#" && !/^\d{1,4}$/.test(l) && !/^p[aá]gina\s+\d+/i.test(l); });
          });
        });
      });
    }).catch(function (e) {
      if (e && /Non-JPEG|password|Password/.test(String(e.message || e)))
        throw new Error(trf("r_pdfProtected", { name: file.name }));
      throw new Error(trf("r_pdfReadFail", { name: file.name, err: (e && e.message ? e.message : e) }));
    });
  }

  /* ---------------- leitura de arquivo ---------------- */
  function parseSheetRows(XLSX, wb, sheetName) {
    var ws = wb.Sheets[sheetName];
    if (!ws) return [];
    return XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "", raw: false })
      .map(function (r) { return r.map(function (x) { return String(x); }); })
      .filter(function (r) { return r.some(function (x) { return x.trim() !== ""; }); });
  }

  /* ---------------- OCR (Tesseract) sob demanda ----------------
     Unico ponto do app que carrega codigo de fora (a imagem em si nunca sai
     do navegador - o reconhecimento roda local, via WebAssembly). Versao
     fixada (nao "@5" flutuante) + integrity (SRI) trava o hash do arquivo:
     se o CDN um dia servir algo diferente do esperado (comprometido ou
     adulterado), o navegador recusa executar, em vez de rodar codigo
     desconhecido que poderia tentar ler a imagem/OCR do usuario. */
  var TESSERACT_SRC = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  var TESSERACT_SRI = "sha384-GJqSu7vueQ9qN0E9yLPb3Wtpd7OrgK8KmYzC8T1IysG1bcvxvIO4qtYR/D3A991F";
  var tessPromise = null;
  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (!tessPromise) {
      tessPromise = new Promise(function (res, rej) {
        var s = document.createElement("script");
        s.src = TESSERACT_SRC;
        s.integrity = TESSERACT_SRI;
        s.crossOrigin = "anonymous";
        s.onload = function () { res(window.Tesseract); };
        s.onerror = function () { tessPromise = null; rej(new Error(tr("r_ocrFail"))); };
        document.head.appendChild(s);
      });
    }
    return tessPromise;
  }
  function ocrImage(file) {
    msg(tr("r_ocrLoad"), "info");
    return loadTesseract().then(function (T) {
      msg(tr("r_ocrRun"), "info");
      return T.recognize(file, "por+eng", {
        logger: function (m) {
          if (m.status === "recognizing text") el.bar.style.width = Math.round(m.progress * 100) + "%";
        },
      });
    }).then(function (out) {
      var text = (out && out.data && out.data.text) || "";
      return text.split(/\r?\n/).map(function (l) { return l.replace(/\s+/g, " ").trim(); })
        .filter(function (l) { return l && l[0] !== "#" && !/^\d{1,4}$/.test(l) && l.length >= 2; });
    });
  }

  function readFileEntry(file) {
    var ext = (file.name.split(".").pop() || "").toLowerCase();
    var entry = { file: file, name: file.name, ext: ext, kind: "lista", sheets: [], sheetName: "", rows: [], wb: null };

    if ((file.type && file.type.indexOf("image/") === 0) ||
        ["png", "jpg", "jpeg", "webp", "bmp", "gif"].indexOf(ext) !== -1) {
      el.progress.classList.remove("is-hidden"); el.bar.style.width = "0%";
      return ocrImage(file).then(function (lines) {
        el.progress.classList.add("is-hidden");
        entry.kind = "lista";
        entry.fromOcr = true;
        entry.rows = lines.map(function (l) { return [l]; });
        clearMsg();
        return entry;
      }).catch(function (e) {
        el.progress.classList.add("is-hidden");
        throw new Error(tr("r_ocrFail") + (e && e.message ? " (" + e.message + ")" : ""));
      });
    }
    if (ext === "txt") {
      return file.text().then(function (t) {
        entry.rows = C.linesFromText(t).map(function (l) { return [l]; });
        return entry;
      });
    }
    if (ext === "csv" || ext === "tsv") {
      return file.text().then(function (t) {
        entry.kind = "tabela";
        entry.rows = C.parseCsv(t);
        return entry;
      });
    }
    if (ext === "pdf") {
      return extractPdfLines(file).then(function (lines) {
        entry.kind = "lista";
        entry.fromPdf = true;
        entry.rows = lines.map(function (l) { return [l]; });
        return entry;
      });
    }
    if (["xlsx", "xls", "xlsm", "ods"].indexOf(ext) !== -1) {
      return loadXlsx().then(function (XLSX) {
        return file.arrayBuffer().then(function (buf) {
          var wb;
          try { wb = XLSX.read(buf, { type: "array" }); }
          catch (e) { throw new Error(trf("r_xlsxOpenFail", { name: file.name })); }
          entry.kind = "tabela";
          entry.wb = wb;
          entry.sheets = wb.SheetNames.slice();
          // Escolhe a primeira aba que realmente tem dados: planilhas de RH
          // costumam ter uma aba de capa/instruções vazia antes da aba com
          // os nomes, e sem isso o painel de colunas abria sem nada pra marcar.
          var bestSheet = wb.SheetNames[0];
          var bestRows = parseSheetRows(XLSX, wb, bestSheet);
          for (var si = 1; si < wb.SheetNames.length && bestRows.length === 0; si++) {
            var candRows = parseSheetRows(XLSX, wb, wb.SheetNames[si]);
            if (candRows.length > 0) { bestSheet = wb.SheetNames[si]; bestRows = candRows; }
          }
          entry.sheetName = bestSheet;
          entry.rows = bestRows;
          if (!entry.rows.length)
            throw new Error(trf("r_xlsxEmpty", { name: file.name }));
          return entry;
        });
      });
    }
    return Promise.reject(new Error(trf("r_fmtUnsupported", { name: file.name })));
  }

  /* ---------------- lista de arquivos na tela ---------------- */
  function addFiles(fileListLike) {
    var arr = Array.prototype.slice.call(fileListLike || []);
    if (!arr.length) return;
    clearMsg();
    el.dropLabel.textContent = tr("r_reading");
    Promise.all(arr.map(function (f) {
      return readFileEntry(f).then(function (e) {
        if (e && f.arrayBuffer) return f.arrayBuffer().then(function (buf) { e.savedBuffer = buf; return e; });
        return e;
      }).catch(function (err) { msg(err.message, "err"); return null; });
    })).then(function (entries) {
      entries.forEach(function (e) { if (e) files.push(e); });
      renderFiles();
      refreshTableOpts();
      var ocr = entries.filter(function (e) { return e && e.fromOcr; })[0];
      if (ocr) msg(ocr.rows.length + " " + tr("r_ocrDone"), "warn");
      reportHeight();
    });
  }

  function renderFiles() {
    el.fileList.innerHTML = "";
    el.fileList.classList.toggle("is-hidden", files.length === 0);
    el.dropLabel.innerHTML = files.length
      ? tr("dropMore") : tr("dropLabel");
    files.forEach(function (e, i) {
      var li = document.createElement("li");
      var count = e.rows.length + " " + tr(e.kind === "lista" ? "r_names" : "r_rows");
      if (e.fromPdf) count += " " + tr("fromPdf");
      if (e.fromOcr) count += " " + tr("fromOcr");
      var n = document.createElement("span"); n.className = "n"; n.textContent = e.name;
      var c = document.createElement("span"); c.className = "c"; c.textContent = count;
      if (e.kind === "lista") {
        var ed = document.createElement("button");
        ed.type = "button"; ed.textContent = "✎"; ed.title = tr("r_titleReview");
        ed.onclick = function () {
          var txt = e.rows.map(function (r) { return r[0]; }).join("\n");
          el.names.value = el.names.value.trim() ? el.names.value.trim() + "\n" + txt : txt;
          document.querySelector('.tab[data-tab="paste"]').click();
          files.splice(i, 1); renderFiles(); refreshTableOpts(); reportHeight();
          msg(tr("r_pastedToBox"), "warn");
        };
        li.appendChild(n); li.appendChild(c); li.appendChild(ed);
      } else {
        li.appendChild(n); li.appendChild(c);
      }
      var b = document.createElement("button");
      b.type = "button"; b.innerHTML = CLOSE_SVG; b.title = tr("r_titleRemove");
      b.onclick = function () { files.splice(i, 1); renderFiles(); refreshTableOpts(); reportHeight(); };
      li.appendChild(b);
      el.fileList.appendChild(li);
    });
  }

  function firstTable() {
    for (var i = 0; i < files.length; i++) if (files[i].kind === "tabela") return files[i];
    return null;
  }

  function refreshTableOpts() {
    var t = firstTable();
    if (!t) {
      el.tableOpts.classList.add("is-hidden");
      el.groupColumn.value = "";
      updateGroupUI();
      return;
    }
    el.tableOpts.classList.remove("is-hidden");

    if (t.sheets.length > 1) {
      el.sheetField.classList.remove("is-hidden");
      el.sheet.innerHTML = t.sheets.map(function (s) {
        return "<option" + (s === t.sheetName ? " selected" : "") + ">" + esc(s) + "</option>";
      }).join("");
      el.sheet.disabled = el.allSheets.checked;
    } else {
      el.sheetField.classList.add("is-hidden");
      el.allSheets.checked = false;
      el.sheet.disabled = false;
    }

    var info = C.analyzeTable(t.rows);
    if (info.headerLikely) el.hasHeader.checked = true;

    // checkboxes: uma por coluna, para montar o nome da pasta.
    // Ordem padrao de exibicao: coluna de nome primeiro, coluna de
    // matricula/id por ultimo (padrao "NOME + MATRICULA" da empresa),
    // preservando a ordem original entre as demais colunas. O usuario
    // ainda pode reordenar manualmente com as setas ▲▼.
    var displayColumns = info.columns.slice();
    if (info.suggestedColumn !== -1) {
      displayColumns.sort(function (a, b) {
        function rank(c) {
          if (c.index === info.suggestedColumn) return 0;
          if (c.isId) return 2;
          return 1;
        }
        var ra = rank(a), rb = rank(b);
        return ra !== rb ? ra - rb : a.index - b.index;
      });
    }
    el.nameCols.innerHTML = "";
    displayColumns.forEach(function (col) {
      var lab = document.createElement("label");
      var input = document.createElement("input");
      input.type = "checkbox"; input.value = col.index;
      if (col.index === info.suggestedColumn) { input.checked = true; lab.className = "on"; }
      input.addEventListener("change", function () { lab.classList.toggle("on", input.checked); updateGroupWarn(); });
      var txt = document.createElement("span");
      txt.textContent = col.header || "Coluna " + (col.index + 1);
      var ex = document.createElement("span");
      ex.className = "ex"; ex.textContent = col.sample ? " (" + col.sample + ")" : "";
      lab.appendChild(input); lab.appendChild(txt); lab.appendChild(ex);
      // setas para reordenar: a ordem de juncao no nome da pasta segue a
      // ordem visual aqui, nao a ordem original da planilha.
      var reorder = document.createElement("span");
      reorder.className = "reorder";
      var up = document.createElement("button");
      up.type = "button"; up.className = "reorder-btn"; up.textContent = "▲"; up.title = tr("r_moveBefore");
      up.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        var prev = lab.previousElementSibling;
        if (prev) el.nameCols.insertBefore(lab, prev);
      });
      var down = document.createElement("button");
      down.type = "button"; down.className = "reorder-btn"; down.textContent = "▼"; down.title = tr("r_moveAfter");
      down.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        var next = lab.nextElementSibling;
        if (next) el.nameCols.insertBefore(next, lab);
      });
      reorder.appendChild(up); reorder.appendChild(down);
      lab.appendChild(reorder);
      el.nameCols.appendChild(lab);
    });
    // se nada marcado, marca a 1ª coluna
    if (!el.nameCols.querySelector("input:checked")) {
      var first = el.nameCols.querySelector("input");
      if (first) { first.checked = true; first.parentNode.classList.add("on"); }
    }

    // "agrupar por" select (e o 2º nível, opcional)
    el.groupColumn.innerHTML = '<option value="">Nenhum (tudo no mesmo nível)</option>' +
      info.columns.map(function (col) {
        return '<option value="' + col.index + '">' +
          esc(col.header || "Coluna " + (col.index + 1)) + "</option>";
      }).join("");
    el.groupColumn2.innerHTML = '<option value="">Nenhum</option>' +
      info.columns.map(function (col) {
        return '<option value="' + col.index + '">' +
          esc(col.header || "Coluna " + (col.index + 1)) + "</option>";
      }).join("");
    if (typeof applyPendingColumns === "function" &&
        (pendingNameColumns || (pendingGroupColumn != null && pendingGroupColumn !== ""))) {
      applyPendingColumns();
    } else {
      updateGroupUI();
    }
  }

  el.sheet.addEventListener("change", function () {
    var t = firstTable();
    if (!t || !t.wb) return;
    t.sheetName = el.sheet.value;
    loadXlsx().then(function (XLSX) {
      t.rows = parseSheetRows(XLSX, t.wb, t.sheetName);
      renderFiles();
      refreshTableOpts();
    });
  });

  el.file.addEventListener("change", function () { addFiles(el.file.files); el.file.value = ""; });

  /* drag & drop */
  ["dragenter", "dragover"].forEach(function (ev) {
    el.drop.addEventListener(ev, function (e) { e.preventDefault(); el.drop.classList.add("over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    el.drop.addEventListener(ev, function (e) { e.preventDefault(); el.drop.classList.remove("over"); });
  });
  el.drop.addEventListener("drop", function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });
  window.addEventListener("dragover", function (e) { e.preventDefault(); });
  window.addEventListener("drop", function (e) {
    e.preventDefault();
    if (activeTab === "file" && e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  });

  /* colar um print (Ctrl+V) → OCR */
  window.addEventListener("paste", function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf("image/") === 0) {
        var blob = items[i].getAsFile();
        if (!blob) continue;
        e.preventDefault();
        var named = new File([blob], "print." + (items[i].type.split("/")[1] || "png"), { type: items[i].type });
        document.querySelector('.tab[data-tab="file"]').click();
        msg(tr("r_ocrPaste"), "info");
        addFiles([named]);
        return;
      }
    }
  });

  /* ---------------- documentos para distribuir ---------------- */
  function addDocs(fileListLike) {
    var arr = Array.prototype.slice.call(fileListLike || []);
    if (!arr.length) return;
    Promise.all(arr.map(function (f) {
      return f.arrayBuffer().then(function (buf) { return { name: f.name, buffer: buf }; });
    })).then(function (list) {
      list.forEach(function (d) { docs.push(d); });
      renderDocs();
      reportHeight();
    });
  }
  function renderDocs() {
    el.docList.innerHTML = "";
    el.docList.classList.toggle("is-hidden", docs.length === 0);
    var total = docs.reduce(function (s, d) { return s + d.buffer.byteLength; }, 0);
    el.docDropLabel.innerHTML = docs.length
      ? tr("docsMore") + "  <small>(" + docs.length + " · " + fmtSize(total) + ")</small>"
      : tr("docsDrop");
    docs.forEach(function (d, i) {
      var li = document.createElement("li");
      var n = document.createElement("span"); n.className = "n"; n.textContent = d.name;
      var c = document.createElement("span"); c.className = "c"; c.textContent = fmtSize(d.buffer.byteLength);
      var b = document.createElement("button");
      b.type = "button"; b.innerHTML = CLOSE_SVG; b.title = tr("r_titleRemove");
      b.onclick = function () { docs.splice(i, 1); renderDocs(); reportHeight(); };
      li.appendChild(n); li.appendChild(c); li.appendChild(b);
      el.docList.appendChild(li);
    });
  }
  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }
  el.docFile.addEventListener("change", function () { addDocs(el.docFile.files); el.docFile.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) {
    el.docDrop.addEventListener(ev, function (e) { e.preventDefault(); el.docDrop.classList.add("over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    el.docDrop.addEventListener(ev, function (e) { e.preventDefault(); el.docDrop.classList.remove("over"); });
  });
  el.docDrop.addEventListener("drop", function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addDocs(e.dataTransfer.files);
  });

  /* ---------------- montar lista de nomes ---------------- */
  function checkedNameColumns() {
    return Array.prototype.map.call(
      el.nameCols.querySelectorAll("input:checked"),
      function (i) { return Number(i.value); }
    );
  }

  function tableExtractOpts() {
    var cols = checkedNameColumns();
    if (!cols.length) throw new Error(tr("r_pickCol"));
    var o = {
      nameColumns: cols,
      hasHeader: el.hasHeader.checked,
      separator: el.separator.value,
    };
    if (el.groupColumn.value !== "") o.groupColumn = Number(el.groupColumn.value);
    if (el.groupColumn.value !== "" && el.groupColumn2.value !== "") o.groupColumn2 = Number(el.groupColumn2.value);
    return o;
  }

  function asItem(x, extraGroup) {
    var it = (typeof x === "string") ? { name: x } : { name: x.name, group: x.group };
    if (extraGroup) it.group = it.group ? extraGroup + "/" + it.group : extraGroup;
    return (it.group || extraGroup) ? it : it.name;
  }

  function getNames() {
    var out;
    if (activeTab === "paste") {
      var v = el.names.value.trim();
      if (!v) throw new Error(tr("r_noName"));
      out = C.linesFromText(v);
    } else {
      if (!files.length) throw new Error(tr("r_addFile"));
      var hasTable = files.some(function (e) { return e.kind === "tabela"; });
      var o = hasTable ? tableExtractOpts() : {};
      var perSheet = el.allSheets.checked;
      out = [];
      files.forEach(function (e) {
        if (e.kind === "lista") {
          e.rows.forEach(function (r) { if (r[0]) out.push(r[0]); });
        } else if (perSheet && e.wb && window.XLSX && e.sheets.length > 1) {
          e.sheets.forEach(function (sn) {
            var rows = parseSheetRows(window.XLSX, e.wb, sn);
            C.extractNames(rows, o).forEach(function (x) { out.push(asItem(x, sn)); });
          });
        } else {
          C.extractNames(e.rows, o).forEach(function (x) { out.push(asItem(x, "")); });
        }
      });
    }
    return sortNames(out);
  }

  // Ordena a lista antes de gerar (opcional). Nao mexe em agrupamento nem em
  // numeracao - so muda a ordem em que os nomes entram no plano.
  function sortNames(list) {
    var dir = el.sortOrder.value;
    if (!dir) return list;
    var sorted = list.slice().sort(function (a, b) {
      var an = String(typeof a === "string" ? a : (a && a.name) || "").toLowerCase();
      var bn = String(typeof b === "string" ? b : (b && b.name) || "").toLowerCase();
      return an.localeCompare(bn, "pt-BR");
    });
    if (dir === "za") sorted.reverse();
    return sorted;
  }

  function planOpts() {
    return {
      subfolderTemplate: el.template.value,
      prefix: el.prefix.value,
      number: el.number.checked,
      start: el.numStart.value,
      pad: el.numPad.value,
      // com "criar uma pasta para cada aba", a mesma pessoa repetida em abas
      // diferentes deve contar como duplicada tambem (nao so dentro da mesma aba).
      crossGroupDedup: el.allSheets.checked,
      sanitize: {
        noAccents: el.noAccents.checked,
        letterCase: el.letterCase.value || null,
      },
    };
  }

  // Rotulo de status traduzido - funcao (nao objeto fixo) porque o idioma
  // pode mudar sem recarregar a pagina.
  var LABEL_KEY = { ok: "r_lblOk", ajustado: "r_lblAdjusted", duplicado: "r_lblDuplicate", invalido: "r_lblInvalid" };
  function statusText(status) { return LABEL_KEY[status] ? tr(LABEL_KEY[status]) : status; }

  var lastCreatePlan = [];
  var lastResultTitleKey = "r_previewWord";
  function renderPlan(plan, counts, titleKey) {
    lastCreatePlan = plan;
    lastResultTitleKey = titleKey;
    el.resultTitle.textContent = tr(titleKey);
    var chips = ["<span>" + trf("r_chipFolders", { n: counts.criaveis }) + "</span>"];
    if (counts.ajustados) chips.push('<span class="c-warn">' + trf("r_chipAdjusted", { n: counts.ajustados }) + "</span>");
    if (counts.duplicados) chips.push("<span>" + trf("r_chipDupIgnored", { n: counts.duplicados }) + "</span>");
    if (counts.invalidos) chips.push('<span class="c-err">' + trf("r_chipInvalid", { n: counts.invalidos }) + "</span>");
    el.counts.innerHTML = chips.join("");

    var shown = plan.slice(0, MAX_PREVIEW_ROWS);
    var html = shown.map(function (p) {
      return "<tr><td>" + esc(p.path || "-") + '</td><td class="origin">' +
        esc(String(p.original).trim()) + '</td><td><span class="badge ' + p.status + '">' +
        esc(statusText(p.status)) + "</span></td></tr>";
    }).join("");
    if (plan.length > MAX_PREVIEW_ROWS) {
      html += '<tr><td colspan="3" class="origin">' +
        esc(tr("previewMoreRows").replace("{n}", plan.length - MAX_PREVIEW_ROWS)) + "</td></tr>";
    }
    el.planBody.innerHTML = html;

    var docInfo = document.getElementById("docInfo");
    docInfo.innerHTML = "";
    if (docs.length) {
      var m = C.matchDocs(plan, docs.map(function (d) { return d.name; }));
      var semPasta = m.unmatched.length + m.ambiguous.length;
      var extra = '<div class="msg ' + (semPasta ? "warn" : "ok") + '" style="margin:12px 0 0">' +
        trf("r_docsGoTo", { n: docs.length, ok: m.placements.length }) +
        (semPasta ? trf("r_docsNoMatch", { n: semPasta }) : "") +
        "</div>";
      if (semPasta) {
        var nomes = m.unmatched.concat(m.ambiguous).slice(0, 10).map(function (di) { return esc(docs[di].name); });
        extra += '<p class="hint">' + trf("r_docsNoFolder", { list: nomes.join(", ") + (semPasta > 10 ? "…" : "") }) + "</p>";
      }
      docInfo.innerHTML = extra;
    }

    el.result.classList.remove("is-hidden");
  }

  /* ---------------- ações ---------------- */
  el.btnExportCsv.addEventListener("click", function () {
    if (!lastCreatePlan.length) return;
    var rows = lastCreatePlan.map(function (p) { return [p.path || "", String(p.original).trim(), statusText(p.status)]; });
    exportCsv(tr("r_csvName"), [tr("colFolder"), tr("colOrigin"), tr("colStatus")], rows);
  });
  // "Começar de novo": limpa lista, arquivos e resultado, mas mantém as
  // opções avançadas (prefixo, agrupar por etc.) - só zera o que muda a
  // cada leva de pastas, não a configuração que a pessoa acabou de montar.
  el.btnReiniciar.addEventListener("click", function () {
    el.names.value = "";
    el.file.value = "";
    files = [];
    docs = [];
    lastCreatePlan = [];
    renderFiles();
    refreshTableOpts();
    renderDocs();
    el.result.classList.add("is-hidden");
    clearMsg();
    reportHeight();
  });
  el.btnPreview.addEventListener("click", function () {
    clearMsg();
    try {
      var names = getNames().filter(function (n) { return String(n).trim(); });
      if (!names.length) return msg(tr("r_none"), "err");
      var r = C.buildPlan(names, planOpts());
      renderPlan(r.plan, r.counts, "r_previewWord");
      reportHeight();
    } catch (e) { msg(e.message, "err"); }
  });

  el.names.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); el.btnPreview.click(); }
  });

  // Le o bloco "Quem esta gerando" (compartilhado pelos dois modos).
  function currentWho() {
    return {
      nome: (el.whoName.value || "").trim(),
      matricula: (el.whoMatricula.value || "").trim(),
      setor: (el.whoSector.value || "").trim(),
      unidade: (el.whoUnidade.value || "").trim(),
      funcao: (el.whoRole.value || "").trim(),
    };
  }

  /* Linhas "Gerado por" pro relatorio e pro log de anexos - so aparecem os
     campos que a pessoa preencheu no bloco "Quem esta gerando". */
  function geradoPorLinhas(who) {
    who = who || {};
    if (!who.nome && !who.matricula && !who.setor && !who.unidade && !who.funcao) {
      return ["Gerado por: (não informado)"];
    }
    var linhas = ["Gerado por: " + (who.nome || "(sem nome)")];
    if (who.matricula) linhas.push("Matrícula: " + who.matricula);
    if (who.setor) linhas.push("Setor: " + who.setor);
    if (who.unidade) linhas.push("Unidade: " + who.unidade);
    if (who.funcao) linhas.push("Função: " + who.funcao);
    return linhas;
  }

  function relatorioText(plan, counts, who) {
    return [
      "PastaFácil - " + new Date().toLocaleString(dloc()),
    ].concat(geradoPorLinhas(who)).concat([
      counts.criaveis + " pasta(s) criada(s)" +
        (counts.duplicados ? " · " + counts.duplicados + " repetida(s) ignorada(s)" : "") +
        (counts.invalidos ? " · " + counts.invalidos + " inválida(s)" : ""),
      "",
      "STATUS       | CAMINHO | ORIGEM",
      "-------------|---------|-------",
    ]).concat(plan.map(function (p) {
      return (p.status + "            ").slice(0, 12) + " | " + (p.path || "(vazio)") + " | " + String(p.original).trim();
    })).join("\n") + "\n";
  }

  /* Log de quem anexou o que, pra manter um registro dentro do proprio resultado
     (a ferramenta nao tem conta de usuario nem servidor - isso so fica registrado
     se a pessoa mesma preencher o bloco "Quem esta gerando"). */
  function registroAnexosText(docsByPath, who) {
    var linhas = [
      "PastaFácil - Registro de documentos anexados",
      "Gerado em: " + new Date().toLocaleString(dloc()),
    ].concat(geradoPorLinhas(who)).concat([
      "",
      "PASTA | DOCUMENTO",
      "------|----------",
    ]);
    Object.keys(docsByPath).forEach(function (path) {
      docsByPath[path].forEach(function (d) { linhas.push(path + " | " + d.name); });
    });
    return linhas.join("\n") + "\n";
  }

  function registroRenomeacoesText(lista, who) {
    var linhas = [
      "PastaFácil - Registro de renomeações",
      "Renomeado em: " + new Date().toLocaleString(dloc()),
    ].concat(geradoPorLinhas(who)).concat([
      "",
      "NOME ANTIGO | NOME NOVO",
      "------------|----------",
    ]);
    lista.forEach(function (p) { linhas.push(p.original + " | " + p.name); });
    return linhas.join("\n") + "\n";
  }

  function addFolders(root, items, keep, stripPrefix, docsByPath) {
    items.forEach(function (p) {
      if (p.status !== "ok" && p.status !== "ajustado") return;
      var path = p.path;
      if (stripPrefix && path.indexOf(stripPrefix + "/") === 0) path = path.slice(stripPrefix.length + 1);
      var f = root.folder(path);
      if (keep) {
        f.file("LEIA-ME.txt",
          "Pasta criada com PastaFácil (lumvix.com.br/pastafacil)\nOrigem: " + String(p.original).trim() + "\n");
      }
      var ds = docsByPath && docsByPath[p.path];
      if (ds) ds.forEach(function (d) { f.file(docEntryName(d.name), d.buffer); });
    });
  }

  function downloadBlob(blob, filename) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 6000);
  }

  // Exporta a previa (Criar ou Renomear) como CSV, pra conferir fora da
  // ferramenta antes de aplicar de verdade. "rows" = array de arrays de texto.
  //
  // Nomes vindos da lista da pessoa (ou de outra planilha, colada/importada) podem comecar com
  // =, +, - ou @ - Excel/LibreOffice/Sheets tratam isso como formula e executam na hora de abrir
  // o CSV (ex.: "=HYPERLINK(...)" vazando dados). Um apostrofo na frente neutraliza sem mudar o
  // que aparece na celula (convencao padrao de escape de formula em CSV).
  function csvEscape(v) {
    var s = String(v == null ? "" : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function exportCsv(filename, headers, rows) {
    var linhas = [headers].concat(rows).map(function (r) { return r.map(csvEscape).join(";"); });
    var blob = new Blob(["﻿" + linhas.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename);
  }

  /* prepara tudo: plano + grupos + documentos casados. Retorna null se erro. */
  function prepareJob(actionKey) {
    clearMsg();
    var names, r;
    try {
      names = getNames().filter(function (n) { return String(n).trim(); });
      r = C.buildPlan(names, planOpts());
    } catch (e) { msg(e.message, "err"); return null; }
    if (!r.counts.criaveis) { msg(tr("r_noValid"), "err"); return null; }
    if (r.counts.criaveis > BIG_LIST &&
        !confirm(trf("r_bigListConfirm", { n: r.counts.criaveis, action: tr(actionKey) }))) {
      return null;
    }
    renderPlan(r.plan, r.counts, "r_resultWord");

    var criaveis = r.plan.filter(function (p) { return p.status === "ok" || p.status === "ajustado"; });
    var groups = {};
    criaveis.forEach(function (p) { (groups[p.group || ""] = groups[p.group || ""] || []).push(p); });

    var docsByPath = {}, semCorresp = [];
    if (docs.length) {
      var m = C.matchDocs(r.plan, docs.map(function (d) { return d.name; }));
      m.placements.forEach(function (pl) {
        var path = r.plan[pl.planIndex].path;
        (docsByPath[path] = docsByPath[path] || []).push(docs[pl.doc]);
      });
      m.unmatched.concat(m.ambiguous).forEach(function (di) { semCorresp.push(docs[di]); });
    }
    return {
      r: r, criaveis: criaveis, groups: groups, docsByPath: docsByPath, semCorresp: semCorresp,
      base: C.sanitizePath(el.subdir.value), keep: el.keepFile.checked,
      docCount: Object.keys(docsByPath).reduce(function (s, k) { return s + docsByPath[k].length; }, 0),
      who: currentWho(),
    };
  }

  function runBusy(btn, label, fn) {
    var orig = btn.textContent;
    el.btnZip.disabled = true; el.btnDirect.disabled = true; el.btnPreview.disabled = true;
    btn.textContent = label;
    el.progress.classList.remove("is-hidden");
    el.bar.style.width = "0%";
    Promise.resolve().then(fn).catch(function (e) {
      if (e && e.name === "AbortError") { clearMsg(); return; }
      msg(trf("r_errPrefix", { err: (e && e.message ? e.message : e) }), "err");
    }).finally(function () {
      el.btnZip.disabled = false; el.btnDirect.disabled = false; el.btnPreview.disabled = false;
      btn.textContent = orig;
      setTimeout(function () { el.progress.classList.add("is-hidden"); }, 600);
      reportHeight();
    });
  }

  /* ---- .zip ---- */
  el.btnZip.addEventListener("click", function () {
    var j = prepareJob("r_actGenZip");
    if (!j) return;
    var groupKeys = Object.keys(j.groups).filter(function (g) { return g !== ""; });
    var perGroup = el.perGroupZip.checked && groupKeys.length > 0;

    runBusy(el.btnZip, tr("r_generating"), function () {
      if (perGroup) {
        var outer = new JSZip();
        outer.file("_pastafacil-relatorio.txt", relatorioText(j.r.plan, j.r.counts, j.who));
        if (j.docCount) outer.file("_pastafacil-registro-anexos.txt", registroAnexosText(j.docsByPath, j.who));
        j.semCorresp.forEach(function (d) { outer.folder("_sem-correspondencia").file(docEntryName(d.name), d.buffer); });
        var keys = Object.keys(j.groups);
        return keys.reduce(function (chain, g, idx) {
          return chain.then(function () {
            var inner = new JSZip();
            addFolders(inner, j.groups[g], j.keep, g, j.docsByPath);
            return inner.generateAsync({ type: "blob" }).then(function (blob) {
              outer.file((g ? g.replace(/\//g, "-") : "_sem-grupo") + ".zip", blob);
              el.bar.style.width = Math.round(((idx + 1) / keys.length) * 90) + "%";
            });
          });
        }, Promise.resolve()).then(function () {
          return outer.generateAsync({ type: "blob" }, function (m) { el.bar.style.width = (90 + Math.round(m.percent * 0.1)) + "%"; });
        }).then(function (blob) {
          downloadBlob(blob, (j.base ? j.base.replace(/\//g, "-") : "pastas-por-grupo") + ".zip");
          msg(trf("r_donePerGroup", { g: keys.length, n: j.r.counts.criaveis }), "ok");
          recordHistorico("criar", j.r.counts.criaveis, trf("hist_groups", { n: keys.length }) + (j.base ? trf("hist_in", { name: j.base }) : ""));
        });
      }
      var zip = new JSZip();
      var root = j.base ? zip.folder(j.base) : zip;
      addFolders(root, j.criaveis, j.keep, "", j.docsByPath);
      j.semCorresp.forEach(function (d) { root.folder("_sem-correspondencia").file(docEntryName(d.name), d.buffer); });
      root.file("_pastafacil-relatorio.txt", relatorioText(j.r.plan, j.r.counts, j.who));
      if (j.docCount) root.file("_pastafacil-registro-anexos.txt", registroAnexosText(j.docsByPath, j.who));
      return zip.generateAsync({ type: "blob", streamFiles: true }, function (meta) {
        el.bar.style.width = Math.round(meta.percent) + "%";
      }).then(function (blob) {
        var fn = (j.base ? j.base.replace(/\//g, "-") : "pastas") + ".zip";
        downloadBlob(blob, fn);
        msg(trf("r_doneZip", {
          n: j.r.counts.criaveis,
          docs: j.docCount ? trf("r_doneDocsInside", { n: j.docCount }) : "",
          fn: fn,
        }), "ok");
        recordHistorico("criar", j.r.counts.criaveis, fn);
      });
    });
  });

  /* ---- criar direto numa pasta (File System Access API) ---- */
  var FS_OK = typeof window.showDirectoryPicker === "function";
  if (FS_OK) {
    el.btnDirect.hidden = false;
    var fsHint = document.getElementById("fsHint");
    if (fsHint) fsHint.hidden = false;
  }

  function ensureDir(rootHandle, pathStr, cache) {
    var segs = pathStr.split("/").filter(Boolean);
    var chain = Promise.resolve(rootHandle);
    var acc = "";
    segs.forEach(function (seg) {
      acc += "/" + seg;
      var key = acc;
      chain = chain.then(function (h) {
        if (cache[key]) return cache[key];
        return h.getDirectoryHandle(seg, { create: true }).then(function (dh) { cache[key] = dh; return dh; });
      });
    });
    return chain;
  }
  function writeFileInto(dirHandle, name, data) {
    return dirHandle.getFileHandle(name, { create: true }).then(function (fh) {
      return fh.createWritable().then(function (w) {
        return Promise.resolve(w.write(data)).then(function () { return w.close(); });
      });
    });
  }

  el.btnDirect.addEventListener("click", function () {
    if (!FS_OK) return;
    var j = prepareJob("r_actCreate");
    if (!j) return;

    runBusy(el.btnDirect, tr("r_pickFolderShort"), function () {
      var picker;
      try { picker = window.showDirectoryPicker({ mode: "readwrite", id: "pastafacil" }); }
      catch (e) {
        return Promise.reject(new Error(tr("r_pickerBlocked")));
      }
      return picker.then(function (dirHandle) {
        el.btnDirect.textContent = tr("r_creating");
        var cache = {};
        return (j.base ? ensureDir(dirHandle, j.base, cache) : Promise.resolve(dirHandle)).then(function (rootHandle) {
          var total = j.criaveis.length, done = 0, erros = 0;
          var step = j.criaveis.reduce(function (chain, p) {
            return chain.then(function () {
              return ensureDir(rootHandle, p.path, cache).then(function (leaf) {
                var extra = [];
                if (j.keep) extra.push(writeFileInto(leaf, "LEIA-ME.txt",
                  "Pasta criada com PastaFácil (lumvix.com.br/pastafacil)\nOrigem: " + String(p.original).trim() + "\n"));
                var ds = j.docsByPath[p.path];
                if (ds) ds.forEach(function (d) { extra.push(writeFileInto(leaf, docEntryName(d.name), d.buffer)); });
                return Promise.all(extra);
              }).catch(function () { erros++; }).then(function () {
                done++;
                if (done % 15 === 0 || done === total) el.bar.style.width = Math.round((done / total) * 100) + "%";
              });
            });
          }, Promise.resolve());
          return step.then(function () {
            var tail = [];
            j.semCorresp.forEach(function (d) {
              tail.push(ensureDir(rootHandle, "_sem-correspondencia", cache).then(function (h) { return writeFileInto(h, docEntryName(d.name), d.buffer); }));
            });
            tail.push(writeFileInto(rootHandle, "_pastafacil-relatorio.txt", relatorioText(j.r.plan, j.r.counts, j.who)));
            if (j.docCount) tail.push(writeFileInto(rootHandle, "_pastafacil-registro-anexos.txt", registroAnexosText(j.docsByPath, j.who)));
            return Promise.all(tail);
          }).then(function () {
            msg(trf("r_doneDirect", {
              n: total,
              docs: j.docCount ? trf("r_doneDocsN", { n: j.docCount }) : "",
              errs: erros ? trf("r_doneErrsN", { n: erros }) : "",
              dir: dirHandle.name,
            }), erros ? "warn" : "ok");
            recordHistorico("criar", total, "\"" + dirHandle.name + "\"");
          });
        });
      });
    });
  });

  /* ================= Biblioteca local (IndexedDB) ================= */
  function currentSettings() {
    return {
      activeTab: activeTab,
      hasHeader: el.hasHeader.checked,
      separator: el.separator.value,
      nameColumns: checkedNameColumns(),
      groupColumn: el.groupColumn.value,
      groupColumn2: el.groupColumn2.value,
      allSheets: el.allSheets.checked,
      subdir: el.subdir.value,
      prefix: el.prefix.value,
      letterCase: el.letterCase.value,
      sortOrder: el.sortOrder.value,
      number: el.number.checked,
      numStart: el.numStart.value,
      numPad: el.numPad.value,
      template: el.template.value,
      noAccents: el.noAccents.checked,
      keepFile: el.keepFile.checked,
    };
  }
  function applySettings(s) {
    if (!s) return;
    el.hasHeader.checked = !!s.hasHeader;
    if (s.separator != null) el.separator.value = s.separator;
    el.allSheets.checked = !!s.allSheets;
    el.subdir.value = s.subdir || "";
    el.prefix.value = s.prefix || "";
    el.letterCase.value = s.letterCase || "";
    el.sortOrder.value = s.sortOrder || "";
    el.number.checked = !!s.number;
    el.numberOpts.classList.toggle("is-hidden", !s.number);
    el.numStart.value = s.numStart || "1";
    el.numPad.value = s.numPad || "3";
    el.template.value = s.template || "";
    el.noAccents.checked = !!s.noAccents;
    el.keepFile.checked = !!s.keepFile;
    // colunas e groupColumn são aplicados depois que as colunas forem montadas
    pendingGroupColumn = s.groupColumn || "";
    pendingGroupColumn2 = s.groupColumn2 || "";
    pendingNameColumns = Array.isArray(s.nameColumns) ? s.nameColumns : null;
  }
  var pendingGroupColumn = null;
  var pendingGroupColumn2 = null;
  var pendingNameColumns = null;

  function applyPendingColumns() {
    if (pendingNameColumns && pendingNameColumns.length) {
      Array.prototype.forEach.call(el.nameCols.querySelectorAll("input"), function (i) {
        var on = pendingNameColumns.indexOf(Number(i.value)) !== -1;
        i.checked = on;
        i.parentNode.classList.toggle("on", on);
      });
    }
    if (pendingGroupColumn != null && pendingGroupColumn !== "") {
      el.groupColumn.value = pendingGroupColumn;
    }
    updateGroupUI();
    if (pendingGroupColumn2 != null && pendingGroupColumn2 !== "") {
      el.groupColumn2.value = pendingGroupColumn2;
    }
    pendingGroupColumn = null;
    pendingGroupColumn2 = null;
    pendingNameColumns = null;
  }

  function saveCurrent() {
    if (!DB) return msg(tr("r_libUnavailable"), "err");
    var item = { id: DB.uid(), settings: currentSettings() };
    if (activeTab === "paste") {
      var txt = el.names.value.trim();
      if (!txt) return msg(tr("r_nothingSaveList"), "err");
      item.type = "paste";
      item.text = txt;
      item.name = prompt(tr("r_promptListName"), trf("r_defaultListName", { date: new Date().toLocaleDateString(dloc()) }));
    } else {
      if (!files.length) return msg(tr("r_nothingSaveFiles"), "err");
      item.type = "files";
      item.files = files.map(function (f) {
        var asText = (f.ext === "txt" || f.fromPdf || f.fromOcr);
        return {
          name: f.name,
          text: asText ? f.rows.map(function (r) { return r[0]; }).join("\n") : null,
          buffer: asText ? null : (f.savedBuffer || null),
        };
      });
      item.name = prompt(tr("r_promptSetName"), files[0].name.replace(/\.[^.]+$/, ""));
    }
    if (!item.name) return;
    DB.put(item).then(function () {
      el.saveHint.textContent = tr("r_saved");
      setTimeout(function () { el.saveHint.textContent = ""; }, 2500);
      refreshLibrary();
    }).catch(function (e) { msg(trf("r_saveErr", { err: e.message }), "err"); });
  }

  function openItem(id) {
    DB.get(id).then(function (item) {
      if (!item) return;
      files = [];
      renderFiles();
      applySettings(item.settings);
      if (item.type === "paste") {
        document.querySelector('.tab[data-tab="paste"]').click();
        el.names.value = item.text || "";
      } else {
        document.querySelector('.tab[data-tab="file"]').click();
        var pending = (item.files || []).map(function (f) {
          if (f.text != null) {
            return Promise.resolve({
              name: f.name, ext: "txt", kind: "lista", sheets: [], sheetName: "", rows: C.linesFromText(f.text).map(function (l) { return [l]; }), wb: null,
            });
          }
          if (!f.buffer) return Promise.resolve(null);
          var blob = new File([f.buffer], f.name);
          return readFileEntry(blob).then(function (e) { if (e) e.savedBuffer = f.buffer; return e; });
        });
        Promise.all(pending).then(function (entries) {
          entries.forEach(function (e) { if (e) files.push(e); });
          renderFiles();
          refreshTableOpts();
          if (item.settings && item.settings.allSheets) { el.allSheets.checked = true; el.sheet.disabled = true; }
          applyPendingColumns();
          reportHeight();
        });
      }
      msg(trf("r_opened", { name: item.name }), "info");
    });
  }

  function refreshLibrary() {
    if (!DB) return;
    DB.list().then(function (items) {
      el.libCount.textContent = items.length;
      el.libList.innerHTML = "";
      items.forEach(function (it) {
        var li = document.createElement("li");
        var n = document.createElement("span");
        n.className = "n";
        n.textContent = it.name + "  " + (it.type === "paste" ? tr("r_suffixList") : trf("r_suffixFiles", { n: it.files ? it.files.length : 1 }));
        n.onclick = function () {
          openItem(it.id);
          if (typeof window.pfCloseMenu === "function") window.pfCloseMenu();
        };
        var c = document.createElement("span");
        c.className = "c";
        c.textContent = new Date(it.updatedAt).toLocaleDateString(dloc());
        var b = document.createElement("button");
        b.type = "button"; b.innerHTML = CLOSE_SVG; b.title = tr("r_titleDelete");
        b.onclick = function () {
          if (confirm(trf("r_confirmDeleteOne", { name: it.name }))) DB.remove(it.id).then(refreshLibrary);
        };
        li.appendChild(n); li.appendChild(c); li.appendChild(b);
        el.libList.appendChild(li);
      });
      reportHeight();
    });
  }

  el.btnSave.addEventListener("click", saveCurrent);
  el.libClear.addEventListener("click", function (e) {
    e.preventDefault();
    if (DB && confirm(tr("r_confirmClearLists"))) DB.clear().then(refreshLibrary);
  });

  refreshLibrary();

  /* ---------------- histórico de operações (auditoria local) ----------------
     Guarda so o RESUMO de cada operacao (data, tipo, quantidade, onde) - nunca
     a lista de nomes em si. Fica numa store separada da "biblioteca" (que
     guarda configuracoes pra reusar), entao "Apagar listas salvas" nao mexe
     no historico e vice-versa. */
  var HIST = DB && DB.historico;
  var HIST_MAX = 30; // guarda so as ultimas N, pra nao crescer sem limite
  function recordHistorico(tipo, total, resumo, detalhe) {
    if (!HIST || !total) return;
    HIST.put({ id: HIST.uid(), tipo: tipo, total: total, resumo: resumo || "", detalhe: detalhe || [] })
      .then(function () {
        return HIST.list();
      }).then(function (items) {
        var extra = items.slice(HIST_MAX);
        return Promise.all(extra.map(function (it) { return HIST.remove(it.id); }));
      }).then(refreshHistorico).catch(function () {});
  }
  function historicoResumoTexto(it) {
    var palavra = it.tipo === "renomear" ? tr("historicoRenomear") : tr("historicoCriar");
    var txt = it.total + " " + tr("historicoPasta") + " " + palavra;
    return it.resumo ? txt + " - " + it.resumo : txt;
  }
  function refreshHistorico() {
    if (!HIST) return;
    HIST.list().then(function (items) {
      el.historicoCount.textContent = items.length ? "" : tr("historicoEmpty");
      el.historicoList.innerHTML = "";
      items.forEach(function (it) {
        var li = document.createElement("li");
        li.className = "files-item";
        li.style.cssText = "display:flex;align-items:center;gap:10px;background:var(--input-bg);border:1px solid var(--border);border-radius:9px;padding:8px 10px;font-size:.86rem";
        var n = document.createElement("span");
        n.style.cssText = "flex:1;min-width:0";
        n.textContent = historicoResumoTexto(it);
        var c = document.createElement("span");
        c.style.cssText = "color:var(--dim);font-size:.78rem;white-space:nowrap";
        c.textContent = new Date(it.createdAt).toLocaleString(dloc());
        var b = document.createElement("button");
        b.type = "button";
        b.title = tr("historicoRemover");
        b.style.cssText = "background:none;border:none;color:var(--dim);cursor:pointer;font-size:1rem;padding:0 4px;flex:none";
        b.innerHTML = CLOSE_SVG;
        b.onclick = function () { HIST.remove(it.id).then(refreshHistorico); };
        li.appendChild(n); li.appendChild(c); li.appendChild(b);
        el.historicoList.appendChild(li);
      });
      reportHeight();
    });
  }
  el.historicoClear.addEventListener("click", function (e) {
    e.preventDefault();
    if (HIST && confirm(tr("historicoClear") + "?")) HIST.clear().then(refreshHistorico);
  });
  refreshHistorico();

  // ao trocar de idioma, re-renderiza as partes montadas por JS
  window.addEventListener("pf-lang", function () {
    renderFiles(); renderDocs(); refreshLibrary(); refreshHistorico(); window.pfRefreshConfigAtual();
    if (typeof rnRefreshLibrary === "function") rnRefreshLibrary();
    // Re-renderiza a previa (Criar / Renomear) que ja estiver na tela, pra
    // rotulos de status e chips acompanharem o novo idioma na hora.
    if (lastCreatePlan && lastCreatePlan.length && !el.result.classList.contains("is-hidden")) {
      renderPlan(lastCreatePlan, C.summarize(lastCreatePlan), lastResultTitleKey);
    }
    if (typeof lastRnPlan !== "undefined" && lastRnPlan && lastRnPlan.length && rn.result && !rn.result.classList.contains("is-hidden")) {
      renderRenamePlan(lastRnPlan);
    }
  });

  /* ================= Compartilhar configuração por link ================= */
  var CFG_KEYS = ["separator", "prefix", "letterCase", "sortOrder", "number", "numStart", "numPad",
    "template", "noAccents", "keepFile", "subdir", "hasHeader", "groupColumn", "groupColumn2", "allSheets", "nameColumns"];

  function configToParams() {
    var s = currentSettings();
    var pr = new URLSearchParams();
    CFG_KEYS.forEach(function (k) {
      var v = s[k];
      if (v === "" || v == null || v === false) return;
      if (Array.isArray(v)) { if (v.length) pr.set(k, v.join(",")); return; }
      pr.set(k, v === true ? "1" : String(v));
    });
    if (el.perGroupZip.checked) pr.set("perGroupZip", "1");
    return pr;
  }
  el.btnShareCfg.addEventListener("click", function () {
    var url = location.origin + location.pathname + "#" + configToParams().toString();
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () {
      el.saveHint.textContent = tr("r_linkCopied");
    }).catch(function () {
      prompt(tr("r_promptCopyLink"), url);
    });
    setTimeout(function () { el.saveHint.textContent = ""; }, 3000);
  });
  function applyConfigFromHash() {
    var h = location.hash.replace(/^#/, "");
    if (!h || h.indexOf("=") === -1) return;
    var pr = new URLSearchParams(h);
    var s = {};
    CFG_KEYS.forEach(function (k) {
      if (!pr.has(k)) return;
      var v = pr.get(k);
      if (k === "nameColumns") s[k] = v.split(",").map(Number).filter(function (n) { return !isNaN(n); });
      else if (["number", "noAccents", "keepFile", "hasHeader", "allSheets"].indexOf(k) !== -1) s[k] = v === "1" || v === "true";
      else s[k] = v;
    });
    applySettings(s);
    if (pr.get("perGroupZip") === "1") { el.perGroupZip.checked = true; }
    // se não há tabela ainda, guarda intenção de colunas pra quando um arquivo for aberto
    updateGroupUI();
  }

  /* ---------------- preferencias padrao (Configurações) ----------------
     Diferente da "biblioteca" (listas inteiras salvas) e do link de
     configuracao (compartilhado, unico), isso e simples: so 4 opcoes de
     "Opções avançadas" que a pessoa pode fixar como padrao pra toda vez que
     abrir a ferramenta, sem precisar reconfigurar. Fica so neste navegador. */
  var PREFS_KEY = "pf-prefs";
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY) || "null") || {}; }
    catch (e) { return {}; }
  }
  function applyPrefs(p) {
    if (!p) return;
    el.sortOrder.value = p.sortOrder || "";
    el.letterCase.value = p.letterCase || "";
    el.noAccents.checked = !!p.noAccents;
    el.keepFile.checked = !!p.keepFile;
  }
  applyPrefs(loadPrefs());

  function configResumoTexto(p) {
    var partes = [];
    if (p.sortOrder === "az") partes.push(tr("sortAz"));
    if (p.sortOrder === "za") partes.push(tr("sortZa"));
    if (p.letterCase === "upper") partes.push(tr("caseUpper"));
    if (p.letterCase === "lower") partes.push(tr("caseLower"));
    if (p.noAccents) partes.push(tr("noAccents"));
    if (p.keepFile) partes.push("LEIA-ME.txt");
    return partes;
  }
  window.pfRefreshConfigAtual = function () {
    var p = loadPrefs();
    var partes = configResumoTexto(p);
    el.configAtual.innerHTML = partes.length
      ? "<b>" + tr("configAtualLabel") + "</b> " + partes.join(", ")
      : tr("configNenhum");
  };
  el.configSave.addEventListener("click", function () {
    var p = {
      sortOrder: el.sortOrder.value,
      letterCase: el.letterCase.value,
      noAccents: el.noAccents.checked,
      keepFile: el.keepFile.checked,
    };
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) {}
    el.configSaveHint.textContent = tr("configSaveOk");
    window.pfRefreshConfigAtual();
    reportHeight();
  });
  el.configReset.addEventListener("click", function () {
    try { localStorage.removeItem(PREFS_KEY); } catch (e) {}
    applyPrefs({});
    el.configSaveHint.textContent = tr("configResetOk");
    window.pfRefreshConfigAtual();
    reportHeight();
  });
  window.pfRefreshConfigAtual();

  applyConfigFromHash();

  /* ================= Modo: renomear pastas existentes ================= */
  var mc = document.getElementById("modeCreate");
  var mr = document.getElementById("modeRename");
  document.querySelectorAll(".modeswitch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.dataset.mode;
      document.querySelectorAll(".modeswitch button").forEach(function (b) { b.classList.toggle("on", b === btn); });
      mc.classList.toggle("is-hidden", mode !== "criar");
      mr.classList.toggle("is-hidden", mode !== "renomear");
      reportHeight();
    });
  });

  var rn = {
    pick: document.getElementById("rnPick"),
    pickHint: document.getElementById("rnPickHint"),
    info: document.getElementById("rnFolderInfo"),
    mapCard: document.getElementById("rnMapCard"),
    text: document.getElementById("rnText"),
    file: document.getElementById("rnFile"),
    drop: document.getElementById("rnDrop"),
    preview: document.getElementById("rnPreview"),
    apply: document.getElementById("rnApply"),
    undo: document.getElementById("rnUndo"),
    batchPrefixInput: document.getElementById("rnBatchPrefixInput"),
    batchPrefixBtn: document.getElementById("rnBatchPrefixBtn"),
    batchFind: document.getElementById("rnBatchFind"),
    batchReplace: document.getElementById("rnBatchReplace"),
    batchReplaceBtn: document.getElementById("rnBatchReplaceBtn"),
    batchUpper: document.getElementById("rnBatchUpper"),
    batchLower: document.getElementById("rnBatchLower"),
    saveMapping: document.getElementById("rnSaveMapping"),
    saveHint: document.getElementById("rnSaveHint"),
    libCard: document.getElementById("rnLibCard"),
    libCount: document.getElementById("rnLibCount"),
    libList: document.getElementById("rnLibList"),
    libClear: document.getElementById("rnLibClear"),
    exportCsv: document.getElementById("rnExportCsv"),
    msg: document.getElementById("rnMsg"),
    progress: document.getElementById("rnProgress"),
    bar: document.querySelector("#rnProgress i"),
    result: document.getElementById("rnResult"),
    counts: document.getElementById("rnCounts"),
    body: document.querySelector("#rnTable tbody"),
  };
  var rnDir = null;      // FileSystemDirectoryHandle
  var rnFolders = [];    // [{ name, handle }]
  var rnLastUndo = null; // [{handle, name, parent, original}] - so da ultima leva renomeada com sucesso

  function rnSay(t, kind) { rn.msg.textContent = t; rn.msg.className = "msg " + (kind || "info"); }
  function rnClear() { rn.msg.className = "msg is-hidden"; }

  if (!FS_OK) {
    rn.pick.disabled = true;
    rn.pickHint.textContent = tr("rn_noBrowser");
  }

  rn.pick.addEventListener("click", function () {
    rnClear();
    var picker;
    // Se a pessoa ja tinha escolhido uma pasta antes (ex.: escolheu a pasta
    // errada, sem subpasta dentro, e quer trocar pra pasta de cima), abre o
    // seletor ja perto de onde ela estava - poupa cliques pra subir um nivel.
    var opts = { mode: "readwrite", id: "pastafacil-rn" };
    if (rnDir) opts.startIn = rnDir;
    try { picker = window.showDirectoryPicker(opts); }
    catch (e) { return rnSay(tr("rn_pickBlocked"), "err"); }
    picker.then(function (dh) {
      rnDir = dh;
      rnLastUndo = null;
      rn.undo.classList.add("is-hidden");
      rn.pick.textContent = tr("rn_pickAgain");
      return listSubdirs(dh);
    }).then(function (list) {
      rnFolders = list;
      rn.info.classList.remove("is-hidden");
      if (list.length === 1) {
        rn.info.innerHTML = trf("rn_info1", { name: esc(rnDir.name), sub: esc(list[0].name) });
      } else if (list.length) {
        rn.info.innerHTML = trf("rn_infoN", { name: esc(rnDir.name), n: list.length });
      } else {
        rn.info.innerHTML = trf("rn_info0", { name: esc(rnDir.name) });
        rnSay(tr("rn_say0"), "warn");
      }
      rn.mapCard.classList.remove("is-hidden");
      rn.pick.textContent = tr("rn_changeFolder");
      reportHeight();
    }).catch(function (e) {
      if (e && e.name === "AbortError") return;
      rnSay(trf("rn_openErr", { err: (e && e.message ? e.message : e) }), "err");
    });
  });

  // Lista TODAS as subpastas, em qualquer nivel (nao so as diretas), pra dar
  // pra renomear tanto uma subpasta de primeiro nivel quanto uma pasta dentro
  // dela. "parent" e o handle do pai direto de cada uma (necessario pra
  // renomear certo - a Web nao deixa acessar o pai de quem foi escolhido no
  // seletor, entao a "pasta principal" em si nao entra nessa lista; pra
  // renomear ela, escolha a pasta um nivel acima que ela vira uma entrada
  // normal aqui).
  function listSubdirsRecursive(dh, basePath, parent, out, onProgress) {
    out = out || [];
    var it = dh.entries();
    function next() {
      return it.next().then(function (res) {
        if (res.done) return out;
        var name = res.value[0], handle = res.value[1];
        if (handle.kind === "directory" && name[0] !== "_") {
          var path = basePath ? basePath + "/" + name : name;
          out.push({ name: name, path: path, handle: handle, parent: dh });
          if (onProgress && out.length % 25 === 0) onProgress(out.length);
          return listSubdirsRecursive(handle, path, dh, out, onProgress).then(next);
        }
        return next();
      });
    }
    return next();
  }
  // Varredura de pastas grandes/com muitos niveis pode demorar; mostra
  // "Procurando... X encontradas" no botao enquanto isso, em vez de deixar
  // sem nenhum feedback.
  function listSubdirs(dh) {
    var t0 = Date.now();
    return listSubdirsRecursive(dh, "", dh, [], function (n) {
      if (Date.now() - t0 > 400) rn.pick.textContent = trf("rn_searching", { n: n });
    });
  }

  rn.file.addEventListener("change", function () {
    var f = rn.file.files[0];
    rn.file.value = "";
    if (!f) return;
    readFileEntry(f).then(function (e) {
      if (e.kind !== "tabela") return rnSay(tr("rn_sheetHint"), "err");
      var rows = e.rows;
      var start = rows.length && C.looksLikeHeader(rows[0][0] || "") ? 1 : 0;
      var lines = rows.slice(start).map(function (r) {
        return String(r[0] || "").trim() + " => " + String(r[1] || "").trim();
      }).filter(function (l) { return l !== " => "; });
      rn.text.value = (rn.text.value.trim() ? rn.text.value.trim() + "\n" : "") + lines.join("\n");
      rnSay(trf("rn_sheetLoaded", { n: lines.length }), "ok");
      reportHeight();
    }).catch(function (err) { rnSay(err.message, "err"); });
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    rn.drop.addEventListener(ev, function (e) { e.preventDefault(); rn.drop.classList.add("over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    rn.drop.addEventListener(ev, function (e) { e.preventDefault(); rn.drop.classList.remove("over"); });
  });
  rn.drop.addEventListener("drop", function (e) {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      rn.file.files = e.dataTransfer.files;
      rn.file.dispatchEvent(new Event("change"));
    }
  });

  // Parsing do texto e o casamento pasta<->mapeamento moraram aqui antes;
  // agora vivem em core.js (C.parseRenameMapping/C.buildRenamePlan), puros e
  // testados sem depender da tela - aqui so' repassamos o estado da UI.
  function parseMapping() {
    return C.parseRenameMapping(rn.text.value, rnFolders.length === 1 ? rnFolders[0].name : null);
  }

  function buildRenamePlan() {
    return C.buildRenamePlan(rnFolders, parseMapping());
  }

  var RN_LABEL_KEY = { renomear: "rn_lblRename", "ja-ok": "rn_lblJaOk", "sem-pasta": "rn_lblNoFolder", conflito: "rn_lblConflict", invalido: "rn_lblInvalid", ambiguo: "rn_lblAmbiguous" };
  function rnStatusText(status) { return RN_LABEL_KEY[status] ? tr(RN_LABEL_KEY[status]) : status; }

  var lastRnPlan = [];
  function renderRenamePlan(plan) {
    lastRnPlan = plan;
    var ren = plan.filter(function (p) { return p.status === "renomear"; }).length;
    var chips = ["<span>" + trf("rn_chipToRename", { n: ren }) + "</span>"];
    var jaok = plan.filter(function (p) { return p.status === "ja-ok"; }).length;
    var semp = plan.filter(function (p) { return p.status === "sem-pasta"; }).length;
    var conf = plan.filter(function (p) { return p.status === "conflito" || p.status === "invalido"; }).length;
    var amb = plan.filter(function (p) { return p.status === "ambiguo"; }).length;
    if (jaok) chips.push("<span>" + trf("rn_chipJaOk", { n: jaok }) + "</span>");
    if (semp) chips.push('<span class="c-warn">' + trf("rn_chipNoFolder", { n: semp }) + "</span>");
    if (conf) chips.push('<span class="c-err">' + trf("rn_chipConflict", { n: conf }) + "</span>");
    if (amb) chips.push('<span class="c-warn">' + trf("rn_chipAmbiguous", { n: amb }) + "</span>");
    rn.counts.innerHTML = chips.join("");
    var rnHtml = plan.slice(0, MAX_PREVIEW_ROWS).map(function (p) {
      var badge = p.status === "renomear" ? "ok" : p.status === "ja-ok" ? "duplicado" : (p.status === "sem-pasta" || p.status === "ambiguo") ? "ajustado" : "invalido";
      var origem = p.status === "ambiguo" ? p.from + " (" + tr("rn_in") + ": " + p.caminhos.join(", ") + ")" : p.from;
      return "<tr><td>" + esc(origem) + '</td><td>' + esc(p.to || "-") +
        '</td><td><span class="badge ' + badge +
        '">' + esc(rnStatusText(p.status)) + "</span></td></tr>";
    }).join("");
    if (plan.length > MAX_PREVIEW_ROWS) {
      rnHtml += '<tr><td colspan="3" class="origin">' +
        esc(tr("previewMoreRows").replace("{n}", plan.length - MAX_PREVIEW_ROWS)) + "</td></tr>";
    }
    rn.body.innerHTML = rnHtml;
    rn.result.classList.remove("is-hidden");
    reportHeight();
  }

  // Diferencia "ainda nao escolheu pasta nenhuma" de "escolheu, mas essa
  // pasta nao tem nenhuma subpasta dentro" - sao situacoes diferentes e a
  // mensagem antiga ("Escolha a pasta primeiro") confundia quem ja tinha
  // escolhido uma pasta sem subpastas, parecendo que a escolha nao valeu.
  function rnRequireFolders() {
    if (!rnDir) { rnSay(tr("rn_needFolderFirst"), "err"); return false; }
    if (!rnFolders.length) {
      rnSay(trf("rn_noSubfolders", { name: rnDir.name }), "err");
      return false;
    }
    return true;
  }

  // Gera a lista "de => para" pra TODAS as subpastas encontradas de uma vez,
  // aplicando "transform" no nome de cada uma. So preenche o campo de texto -
  // a pessoa ainda precisa clicar em Pre-visualizar/Renomear, entao passa
  // pelas mesmas checagens de conflito/ambiguidade de sempre.
  function rnGenerateBatch(transform) {
    if (!rnRequireFolders()) return;
    var linhas = [];
    rnFolders.forEach(function (f) {
      var novo = transform(f.name);
      if (novo && novo !== f.name) linhas.push(f.name + " => " + novo);
    });
    if (!linhas.length) { rnSay(tr("rn_batchNoChange"), "warn"); return; }
    rn.text.value = linhas.join("\n");
    rnSay(trf("rn_batchGenerated", { n: linhas.length }), "ok");
    reportHeight();
  }
  rn.batchPrefixBtn.addEventListener("click", function () {
    var prefixo = rn.batchPrefixInput.value || "";
    if (!prefixo) { rnSay(tr("rn_batchNeedPrefix"), "err"); return; }
    rnGenerateBatch(function (nome) { return prefixo + nome; });
  });
  rn.batchReplaceBtn.addEventListener("click", function () {
    var de = rn.batchFind.value || " ";
    var para = rn.batchReplace.value || "";
    rnGenerateBatch(function (nome) { return nome.split(de).join(para); });
  });
  rn.batchUpper.addEventListener("click", function () { rnGenerateBatch(function (nome) { return nome.toUpperCase(); }); });
  rn.batchLower.addEventListener("click", function () { rnGenerateBatch(function (nome) { return nome.toLowerCase(); }); });

  /* Mapeamentos de renomeacao salvos - guarda so o texto "de => para" no
     localStorage (mais simples que a biblioteca do modo Criar, que guarda
     arquivo inteiro via IndexedDB - aqui e so texto, nao precisa disso). */
  var RN_LIB_KEY = "pastafacil-rn-mappings";
  function rnLibItems() {
    try { return JSON.parse(localStorage.getItem(RN_LIB_KEY) || "[]"); } catch (e) { return []; }
  }
  function rnLibSave(items) {
    try { localStorage.setItem(RN_LIB_KEY, JSON.stringify(items)); } catch (e) {}
  }
  function rnRefreshLibrary() {
    var items = rnLibItems();
    rn.libCard.classList.toggle("is-hidden", items.length === 0);
    rn.libCount.textContent = items.length;
    rn.libList.innerHTML = "";
    items.slice().reverse().forEach(function (it) {
      var li = document.createElement("li");
      var n = document.createElement("span"); n.className = "n"; n.textContent = it.name;
      n.onclick = function () {
        rn.text.value = it.text;
        rnSay(trf("rn_mappingLoaded", { name: it.name }), "ok");
        reportHeight();
      };
      var c = document.createElement("span"); c.className = "c"; c.textContent = new Date(it.updatedAt).toLocaleDateString(dloc());
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = CLOSE_SVG;
      b.title = tr("r_titleDelete");
      b.onclick = function () {
        if (!confirm(trf("r_confirmDeleteOne", { name: it.name }))) return;
        rnLibSave(rnLibItems().filter(function (x) { return x.id !== it.id; }));
        rnRefreshLibrary();
      };
      li.appendChild(n); li.appendChild(c); li.appendChild(b);
      rn.libList.appendChild(li);
    });
    reportHeight();
  }
  rn.saveMapping.addEventListener("click", function () {
    var txt = rn.text.value.trim();
    if (!txt) { rnSay(tr("rn_nothingSaveMapping"), "err"); return; }
    var nome = prompt(tr("rn_promptMappingName"), trf("rn_defaultMappingName", { date: new Date().toLocaleDateString(dloc()) }));
    if (!nome) return;
    var items = rnLibItems();
    items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), name: nome, text: txt, updatedAt: Date.now() });
    rnLibSave(items);
    rnRefreshLibrary();
    rn.saveHint.textContent = tr("rn_saved");
    setTimeout(function () { rn.saveHint.textContent = ""; }, 3000);
  });
  rn.libClear.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm(tr("rn_confirmClearMappings"))) { rnLibSave([]); rnRefreshLibrary(); }
  });
  rnRefreshLibrary();

  rn.exportCsv.addEventListener("click", function () {
    if (!lastRnPlan.length) return;
    var rows = lastRnPlan.map(function (p) { return [p.from, p.to || "", rnStatusText(p.status)]; });
    exportCsv(tr("rn_csvCsvName"), [tr("rnColCur"), tr("rnColNew"), tr("colStatus")], rows);
  });

  rn.preview.addEventListener("click", function () {
    rnClear();
    if (!rnRequireFolders()) return;
    var plan = buildRenamePlan();
    if (!plan.length) return rnSay(tr("rn_noRule"), "err");
    renderRenamePlan(plan);
  });

  // Retorna sempre o handle ATUAL da pasta apos a operacao (com o move
  // nativo, o proprio handle continua valido; com copia+apaga, o handle
  // antigo fica invalido - por isso devolvemos o novo "dest"). Isso e
  // necessario pro "Desfazer" funcionar independente de qual caminho foi
  // usado internamente.
  function moveDir(entry, newName) {
    if (typeof entry.handle.move === "function") {
      return Promise.resolve(entry.handle.move(newName)).then(function () { return entry.handle; }).catch(function () {
        return copyThenDelete(entry, newName);
      });
    }
    return copyThenDelete(entry, newName);
  }
  function copyThenDelete(entry, newName) {
    // Cria/apaga sempre dentro do PAI DIRETO da pasta (nao sempre a raiz
    // escolhida) - assim funciona tambem pra subpastas que estao dentro de
    // outras subpastas, nao so as de primeiro nivel.
    var pai = entry.parent || rnDir;
    return pai.getDirectoryHandle(newName, { create: true }).then(function (dest) {
      return copyInto(entry.handle, dest).then(function () { return dest; });
    }).then(function (dest) {
      return pai.removeEntry(entry.name, { recursive: true }).then(function () { return dest; });
    });
  }
  function copyInto(src, dest) {
    var it = src.entries();
    function next() {
      return it.next().then(function (res) {
        if (res.done) return;
        var name = res.value[0], h = res.value[1];
        var p;
        if (h.kind === "file") {
          p = h.getFile().then(function (file) {
            return dest.getFileHandle(name, { create: true }).then(function (fh) {
              return fh.createWritable().then(function (w) {
                return Promise.resolve(w.write(file)).then(function () { return w.close(); });
              });
            });
          });
        } else {
          p = dest.getDirectoryHandle(name, { create: true }).then(function (d2) { return copyInto(h, d2); });
        }
        return p.then(next);
      });
    }
    return next();
  }

  rn.apply.addEventListener("click", function () {
    rnClear();
    if (!rnRequireFolders()) return;
    var plan = buildRenamePlan();
    var todo = plan.filter(function (p) { return p.status === "renomear"; });
    if (!todo.length) return rnSay(tr("rn_nothingToRename"), "err");
    if (!confirm(trf("rn_confirmApply", { n: todo.length, dir: rnDir.name }))) return;

    renderRenamePlan(plan);
    rn.apply.disabled = true; rn.preview.disabled = true; rn.undo.classList.add("is-hidden");
    var orig = rn.apply.textContent; rn.apply.textContent = tr("rn_renaming");
    rn.progress.classList.remove("is-hidden"); rn.bar.style.width = "0%";
    var done = 0, erros = 0, sucessos = [];

    todo.reduce(function (chain, p) {
      return chain.then(function () {
        return moveDir({ handle: p.handle, name: p.name, parent: p.parent }, p.to).then(function (novoHandle) {
          sucessos.push({ handle: novoHandle, name: p.to, parent: p.parent, original: p.name });
        }).catch(function () { erros++; }).then(function () {
          done++;
          rn.bar.style.width = Math.round((done / todo.length) * 100) + "%";
        });
      });
    }, Promise.resolve()).then(function () {
      var who = currentWho();
      var tail = [];
      if (sucessos.length) tail.push(writeFileInto(rnDir, "_pastafacil-registro-renomeacoes.txt", registroRenomeacoesText(sucessos, who)).catch(function () {}));
      return Promise.all(tail);
    }).then(function () {
      return listSubdirs(rnDir).then(function (l) { rnFolders = l; });
    }).then(function () {
      rnSay(trf("rn_doneRename", { n: (done - erros), errs: (erros ? trf("rn_errsN", { n: erros }) : "") }), erros ? "warn" : "ok");
      rn.info.innerHTML = trf("rn_infoCount", { name: esc(rnDir.name), n: rnFolders.length });
      rnLastUndo = sucessos.length ? sucessos : null;
      rn.undo.classList.toggle("is-hidden", !rnLastUndo);
      recordHistorico("renomear", done - erros, "\"" + rnDir.name + "\"");
    }).catch(function (e) {
      rnSay(trf("r_errPrefix", { err: (e && e.message ? e.message : e) }), "err");
    }).finally(function () {
      rn.apply.disabled = false; rn.preview.disabled = false;
      rn.apply.textContent = orig;
      setTimeout(function () { rn.progress.classList.add("is-hidden"); }, 600);
      reportHeight();
    });
  });

  rn.undo.addEventListener("click", function () {
    rnClear();
    if (!rnLastUndo || !rnLastUndo.length) return;
    var lista = rnLastUndo;
    if (!confirm(trf("rn_confirmUndo", { n: lista.length }))) return;

    rn.undo.disabled = true; rn.apply.disabled = true; rn.preview.disabled = true;
    rn.progress.classList.remove("is-hidden"); rn.bar.style.width = "0%";
    var done = 0, erros = 0;

    lista.reduce(function (chain, p) {
      return chain.then(function () {
        return moveDir({ handle: p.handle, name: p.name, parent: p.parent }, p.original).catch(function () { erros++; }).then(function () {
          done++;
          rn.bar.style.width = Math.round((done / lista.length) * 100) + "%";
        });
      });
    }, Promise.resolve()).then(function () {
      return listSubdirs(rnDir).then(function (l) { rnFolders = l; });
    }).then(function () {
      rnSay(trf("rn_doneUndo", { n: (done - erros), errs: (erros ? trf("rn_errsN", { n: erros }) : "") }), erros ? "warn" : "ok");
      rn.info.innerHTML = trf("rn_infoCount", { name: esc(rnDir.name), n: rnFolders.length });
    }).catch(function (e) {
      rnSay(trf("r_errPrefix", { err: (e && e.message ? e.message : e) }), "err");
    }).finally(function () {
      rnLastUndo = null;
      rn.undo.classList.add("is-hidden");
      rn.undo.disabled = false; rn.apply.disabled = false; rn.preview.disabled = false;
      setTimeout(function () { rn.progress.classList.add("is-hidden"); }, 600);
      reportHeight();
    });
  });
})();
