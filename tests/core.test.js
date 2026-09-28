// Testes de core.js (sanitizacao de nomes, CSV, plano de pastas, casamento de documentos e
// mapeamento de renomeacao). core.js e' puro (sem DOM), entao roda aqui sem precisar de
// navegador nem montar a pagina - so' o executor de testes embutido do Node, sem instalar nada:
//
//   node --test tests/
//
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Executa core.js de verdade (o mesmo arquivo servido ao navegador), so' passando um "window"
// de mentira - sem vm.createContext, pra nao criar um realm/Object.prototype separado, que faria
// assert.deepEqual falhar comparando objetos "estruturalmente iguais" de dois construtores Object
// diferentes.
function loadCore() {
  const arquivo = path.join(__dirname, "..", "pastafacil", "app", "core.js");
  const codigo = fs.readFileSync(arquivo, "utf8");
  const windowFalso = {};
  new Function("window", codigo)(windowFalso);
  return windowFalso.PastaFacilCore;
}

const C = loadCore();

test("carrega o PastaFacilCore com todas as funcoes esperadas", () => {
  for (const nome of [
    "norm", "looksLikeHeader", "sanitizeSegment", "sanitizeFolderName", "sanitizePath",
    "parseCsv", "linesFromText", "analyzeTable", "extractNames", "buildPlan", "summarize",
    "matchDocs", "parseRenameMapping", "buildRenamePlan",
  ]) {
    assert.equal(typeof C[nome], "function", `falta ${nome}`);
  }
});

// ---------------- sanitizeSegment / sanitizePath ----------------

test("sanitizeSegment: remove caracteres invalidos de pasta (Windows) e colapsa espacos internos", () => {
  assert.equal(C.sanitizeSegment('a/b\\c:d*e?f"g<h>i|j'), "a-b-c-d-e-f-g-h-i-j");
  assert.equal(C.sanitizeSegment("  João   da   Silva  "), "João da Silva"); // espaco NAO vira traco (ver nota abaixo)
  assert.equal(C.sanitizeSegment("nome---com----tracos"), "nome-com-tracos");
});

// ACHADO: o regex de sanitizeSegment (core.js) tem 2 bytes de controle (NUL 0x00 e Unit
// Separator 0x1F) no lugar do que a fonte "parece" mostrar como espaco e traco literais -
// confirmado com `od -c` direto no blob do commit 2ff38fc (o import original), entao NAO fui
// eu que corrompi nem e' um efeito do meu editor: esta assim desde a primeira versao no GitHub.
// Efeito pratico, hoje, em producao: caracteres de controle (0x00-0x1F) SAO trocados por "-"
// (o que ja e' o comportamento correto - Windows tambem proibe esses bytes em nome de arquivo),
// mas espaco e traco ficam iguais (NAO SAO trocados por "-" um pelo outro). Isso bate com o
// resto do codigo (ex.: a numeracao usa "01 - Nome" com espacos, nao "01---Nome"), entao pode
// ser o comportamento pretendido mesmo - so' documentando aqui pra nao quebrar sem querer numa
// proxima mudanca. Se um dia decidirem trocar espaco por traco de proposito, e' so' trocar os 2
// bytes de controle por " -" (espaco + traco) de verdade no arquivo e atualizar este teste.
test("sanitizeSegment: caracteres de controle (0x00-0x1F) tambem viram traco", () => {
  assert.equal(C.sanitizeSegment("nome\x01com\x1Fcontrole"), "nome-com-controle");
});

test("sanitizeSegment: nao deixa a pasta terminar com ponto ou espaco (Windows)", () => {
  assert.equal(C.sanitizeSegment("nome. "), "nome");
  assert.equal(C.sanitizeSegment("nome..."), "nome");
});

test("sanitizeSegment: nomes reservados do Windows ganham prefixo", () => {
  for (const reservado of ["con", "CON", "prn", "aux", "nul", "com1", "lpt9"]) {
    assert.equal(C.sanitizeSegment(reservado), "_" + reservado);
  }
  assert.equal(C.sanitizeSegment("constança"), "constança"); // nao e' EXATAMENTE "con"
});

test("sanitizeSegment: corta em 150 caracteres", () => {
  const longo = "a".repeat(300);
  assert.equal(C.sanitizeSegment(longo).length, 150);
});

test("sanitizeSegment: opcoes noAccents e letterCase", () => {
  assert.equal(C.sanitizeSegment("São Paulo", { noAccents: true }), "Sao Paulo");
  assert.equal(C.sanitizeSegment("São Paulo", { letterCase: "upper" }), "SÃO PAULO");
  assert.equal(C.sanitizeSegment("São Paulo", { letterCase: "lower" }), "são paulo");
});

test("sanitizePath: bloqueia segmentos '..' e '.' (sem escapar da pasta de destino)", () => {
  assert.equal(C.sanitizePath("../../etc/passwd"), "etc/passwd");
  assert.equal(C.sanitizePath("a/../b"), "a/b");
  assert.equal(C.sanitizePath("./a/./b"), "a/b");
  assert.equal(C.sanitizePath("a\\b/c"), "a/b/c");
});

// ---------------- CSV ----------------

test("parseCsv: detecta o delimitador e respeita aspas com delimitador dentro", () => {
  assert.deepEqual(C.parseCsv("a;b;c\n1;2;3"), [["a", "b", "c"], ["1", "2", "3"]]);
  assert.deepEqual(C.parseCsv('nome,obs\n"Silva, João",ok'), [["nome", "obs"], ["Silva, João", "ok"]]);
  assert.deepEqual(C.parseCsv('a,"b""c"'), [["a", 'b"c']]);
});

test("parseCsv: ignora BOM e linhas em branco", () => {
  assert.deepEqual(C.parseCsv("﻿a,b\n\n1,2\n"), [["a", "b"], ["1", "2"]]);
});

test("linesFromText: tira espacos, linhas vazias e comentarios (#)", () => {
  assert.deepEqual(C.linesFromText("  Ana  \n\n# comentário\nBia\n"), ["Ana", "Bia"]);
});

// ---------------- buildPlan ----------------

test("buildPlan: sanitiza, ignora duplicado (mesmo com maiuscula/minuscula diferente) e conta certo", () => {
  const { plan, counts } = C.buildPlan(["Ana", "ana", "Bia"], {});
  assert.deepEqual(plan.map((p) => p.status), ["ok", "duplicado", "ok"]);
  assert.equal(counts.criaveis, 2);
  assert.equal(counts.duplicados, 1);
});

test("buildPlan: prefixo, numeracao com preenchimento de zeros e comeco em 0", () => {
  const { plan } = C.buildPlan(["Ana", "Bia"], { prefix: "T-", number: true, start: 0, pad: 2 });
  assert.deepEqual(plan.map((p) => p.final), ["00 - T-Ana", "01 - T-Bia"]);
});

test("buildPlan: modelo de subpasta com {nome}", () => {
  const { plan } = C.buildPlan(["Ana"], { subfolderTemplate: "Documentos/{nome}/Entrada" });
  assert.equal(plan[0].path, "Documentos/Ana/Entrada");
});

test("buildPlan: agrupamento (2 niveis) e crossGroupDedup", () => {
  const nomes = [{ name: "Ana", group: "Turma A" }, { name: "Ana", group: "Turma B" }];
  const semDedup = C.buildPlan(nomes, {});
  // "ajustado" (nao "ok") porque o caminho final difere do nome original assim que ha' grupo.
  assert.deepEqual(semDedup.plan.map((p) => p.status), ["ajustado", "ajustado"]); // grupos diferentes, sem cruzar
  assert.deepEqual(semDedup.plan.map((p) => p.path), ["Turma A/Ana", "Turma B/Ana"]);
  const comDedup = C.buildPlan(nomes, { crossGroupDedup: true });
  assert.deepEqual(comDedup.plan.map((p) => p.status), ["ajustado", "duplicado"]);
});

test("buildPlan: nome vazio depois de sanitizar vira invalido", () => {
  const { plan, counts } = C.buildPlan(["   ", "<<<>>>"], {});
  assert.deepEqual(plan.map((p) => p.status), ["invalido", "invalido"]);
  assert.equal(counts.invalidos, 2);
});

// ---------------- matchDocs ----------------

test("matchDocs: casa por nome inteiro e ignora a extensao", () => {
  const { plan } = C.buildPlan(["Ana Souza", "Mariana"], {});
  const m = C.matchDocs(plan, ["Ana Souza.pdf", "Mariana.docx"]);
  assert.equal(m.placements.length, 2);
  assert.equal(m.unmatched.length, 0);
});

test("matchDocs: so' casa em inicio/fim de palavra - 'Ana.pdf' nao cai dentro de 'Mariana'", () => {
  const { plan } = C.buildPlan(["Mariana"], {});
  const m = C.matchDocs(plan, ["Ana.pdf"]);
  assert.deepEqual(m.placements, []);
  assert.deepEqual(m.unmatched, [0]);
});

test("matchDocs: nome que bate com mais de uma pasta fica ambiguo", () => {
  const { plan } = C.buildPlan(["Ana Paula Souza", "Ana Paula Lima"], {});
  const m = C.matchDocs(plan, ["Ana Paula.pdf"]);
  assert.deepEqual(m.ambiguous, [0]);
});

// ---------------- renomear existentes ----------------

test("parseRenameMapping: aceita '=>', tab, '|' e ';' como separador", () => {
  const texto = "Ana => Ana Souza\nBia\tBia Lima\nCarla | Carla Dias\nDani ; Dani Reis";
  const m = C.parseRenameMapping(texto, null);
  assert.deepEqual(m, [
    { from: "Ana", to: "Ana Souza" },
    { from: "Bia", to: "Bia Lima" },
    { from: "Carla", to: "Carla Dias" },
    { from: "Dani", to: "Dani Reis" },
  ]);
});

test("parseRenameMapping: linha sem separador so' vira mapeamento quando ha' 1 pasta so'", () => {
  assert.deepEqual(C.parseRenameMapping("Novo Nome", "Pasta Antiga"), [{ from: "Pasta Antiga", to: "Novo Nome" }]);
  assert.deepEqual(C.parseRenameMapping("Novo Nome", null), []); // mais de uma pasta: nao da pra saber qual
});

test("buildRenamePlan: renomeia, detecta pasta ja' com o nome certo, sem-pasta e conflito", () => {
  const folders = [
    { name: "Ana", path: "Ana", handle: "h1", parent: "root" },
    { name: "Bia", path: "Bia", handle: "h2", parent: "root" },
  ];
  const mapping = [
    { from: "Ana", to: "Ana Souza" },
    { from: "Bia", to: "Bia" },            // ja' esta' com esse nome
    { from: "Carla", to: "Carla Dias" },   // nao existe
    { from: "Ana", to: "Bia" },            // conflito: "Bia" ja' e' nome de outra pasta
  ];
  const plan = C.buildRenamePlan(folders, mapping);
  assert.deepEqual(plan.map((p) => p.status), ["renomear", "ja-ok", "sem-pasta", "conflito"]);
  assert.equal(plan[0].handle, "h1");
  assert.equal(plan[0].parent, "root");
});

test("buildRenamePlan: mesmo nome em pastas diferentes fica ambiguo (nao renomeia a errada)", () => {
  const folders = [
    { name: "Ana", path: "TurmaA/Ana", handle: "h1" },
    { name: "Ana", path: "TurmaB/Ana", handle: "h2" },
  ];
  const plan = C.buildRenamePlan(folders, [{ from: "Ana", to: "Ana Souza" }]);
  assert.equal(plan[0].status, "ambiguo");
  assert.deepEqual(plan[0].caminhos, ["TurmaA/Ana", "TurmaB/Ana"]);
});

test("buildRenamePlan: novo nome vazio depois de sanitizar vira invalido", () => {
  const folders = [{ name: "Ana", path: "Ana", handle: "h1" }];
  const plan = C.buildRenamePlan(folders, [{ from: "Ana", to: "***" }]);
  assert.equal(plan[0].status, "invalido");
});
