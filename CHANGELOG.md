# Histórico de versões do PastaFácil

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). A versão em uso
aparece no rodapé do aviso "Nova versão disponível" (`VERSION` em `pastafacil/app/sw.js`).

## [pf-v36] - 2026-09-28

### Segurança
- **`vendor/xlsx.full.min.js` (SheetJS) atualizado de 0.18.5 para 0.20.3** - a versão antiga tem
  duas vulnerabilidades conhecidas corrigidas só a partir da 0.19.3: *Prototype Pollution*
  ([GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6)) e *ReDoS*
  ([GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)), ambas
  exploráveis com uma planilha `.xlsx/.xls/.xlsm/.ods` maliciosa importada na aba "Enviar
  arquivos". Testado de verdade (Playwright, sob a CSP real): importar `.xlsx`, detectar
  colunas e gerar a prévia continuam funcionando igual, sem violação de CSP.

## [pf-v35] - 2026-09-28

### Segurança
- **CSV exportado:** campos que começam com `=`, `+`, `-`, `@` ou tab agora recebem um apóstrofo
  na frente antes de ir para o arquivo, evitando que o Excel/LibreOffice/Sheets os interprete
  como fórmula ao abrir a prévia exportada (injeção de fórmula em CSV).
- **Anexos no .zip / na pasta real:** o nome do arquivo anexado (documento a distribuir nas
  pastas) tem `/` e `\` trocados por `-` antes de virar entrada do zip ou nome de arquivo real
  (File System Access API), fechando um Zip Slip em potencial sem mudar o nome exibido na tela.
- **Content-Security-Policy** e demais cabeçalhos de segurança (`X-Frame-Options`,
  `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`) via `vercel.json` na raiz
  do repositório. Isso exigiu tirar todos os `onclick="..."` inline dos dois HTML (landing e
  ferramenta) e mover a lógica que estava em `<script>` solto para `landing.js` e `app/boot.js`.

### Acessibilidade
- O menu lateral (landing e ferramenta) agora tem `role="dialog"` + `aria-modal`, leva o foco
  para o primeiro item ao abrir, prende o Tab dentro do menu enquanto ele está aberto e devolve o
  foco a quem abriu (o botão "Menu") ao fechar - antes, quem navegava só pelo teclado conseguia
  abrir o menu mas o Tab continuava passando por trás dele.

### Interno (sem mudança visível)
- O plano de renomeação (`buildRenamePlan`) e o parser do mapeamento "de => para"
  (`parseRenameMapping`) saíram de `app.js` e foram para `core.js`, ao lado de `buildPlan` -
  mesma lógica, agora testável sem precisar montar a página nem escolher uma pasta de verdade.
- Ícone de "remover" (✕), que estava copiado em 5 lugares de `app.js`, virou uma constante
  (`CLOSE_SVG`) única.
- Testes automatizados (`node --test tests/`) cobrindo `core.js` inteiro: sanitização de nomes,
  CSV, plano de pastas, casamento de documentos e o modo Renomear. 24 testes, sem dependências.

### Achado durante a auditoria (documentado, não alterado)
- O regex de `sanitizeSegment` (em `core.js`) tem 2 bytes de controle (NUL e Unit Separator) no
  lugar do que a fonte "parece" mostrar como espaço e traço literais - confirmado com `git
  cat-file` direto no primeiro commit do repositório (`2ff38fc`), então **não é algo introduzido
  agora**: está assim desde a importação original da v34. Efeito prático, hoje: caracteres de
  controle (0x00-0x1F) viram `-` (correto - o Windows também não aceita esses bytes em nome de
  arquivo), mas espaço e traço literais ficam como estão, sem virar `-` um pelo outro. Isso bate
  com o resto do código (a numeração já usa `"01 - Nome"`, com espaços). Deixei documentado em
  `tests/core.test.js` e **não mudei o comportamento** - se um dia decidirem que espaço deveria
  virar traço de propósito, é só trocar os 2 bytes de controle por `" -"` de verdade no arquivo.

## [pf-v34] - ver "Changelog desta importação (v34)" no README.md

Histórico anterior a esta versão ainda está descrito no `README.md`.
