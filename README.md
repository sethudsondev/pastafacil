# PastaFácil

Ferramenta da **Lumvix** para criar pastas em lote a partir de uma lista de nomes
(ou renomear pastas que já existem). Roda **100% no navegador** — nada é enviado a
servidor. PWA instalável, funciona offline, PT/EN/ES.

- Página: `pastafacil/index.html` → servida em `/pastafacil/`
- App: `pastafacil/app/` → servida em `/pastafacil/app/`

## Estrutura

```
vercel.json                 cabeçalhos HTTP (CSP e afins) - ver secção "Segurança" abaixo
LICENSE, CHANGELOG.md
tests/
  core.test.js               testes de core.js (`node --test tests/`, sem instalar nada)
pastafacil/
  index.html                 página com o iframe + menu (Como funciona / Recursos / Privacidade)
  landing.js                 script dessa página (postMessage do iframe, menu, ano do rodapé)
  icon.svg
  app/
    index.html               a ferramenta
    boot.js                  script dessa página: tema, menu, idioma, PWA/instalar, service worker
    app.js                   UI, leitura de arquivos, zip, File System Access, modo renomear
    core.js                  sanitização de nomes, CSV, plano de pastas, casamento de documentos,
                              mapeamento e plano do modo "Renomear existentes" - tudo puro/testável
    db.js                    biblioteca local (IndexedDB) + histórico
    i18n.js                  traduções PT / EN / ES
    sw.js                    service worker (offline). BUMPAR `VERSION` a cada mudança no shell
    manifest.webmanifest
    icon-*.png
    vendor/                  jszip, xlsx (SheetJS), pdf.js — carregados sob demanda
```

Os caminhos nos HTML são absolutos (`/pastafacil/...`), então o conteúdo deve ser
servido a partir da raiz do domínio (ex.: `lumvix.com.br/pastafacil/`).

Nenhum `<script>` inline nem `onclick="..."` nos HTML (por causa da CSP - ver abaixo). Botões do
menu usam `data-pf-view="..."` (abre aquela tela do menu) ou `data-pf-action="open|close|back|..."`,
lidos por um único listener delegado em `landing.js`/`app/boot.js`.

## Testes

```
node --test tests/core.test.js
```

Sem dependências (usa o executor de testes embutido do Node ≥ 18). Cobre `core.js` inteiro:
sanitização de nomes, CSV, plano de pastas, casamento de documentos e o modo Renomear. `app.js`,
`db.js` e os dois `index.html` não têm teste automatizado (dependem do navegador de verdade -
File System Access API, IndexedDB); testados manualmente antes de cada publicação.

## Segurança

`vercel.json` define os cabeçalhos HTTP: `Content-Security-Policy`, `X-Frame-Options`,
`Strict-Transport-Security`, `Referrer-Policy` e `Permissions-Policy`. Dois pontos que exigem
atenção se algo for mudado:

- **`script-src`/`connect-src`/`worker-src` liberam `https://cdn.jsdelivr.net`** só por causa do
  OCR (Tesseract.js, carregado sob demanda em `app.js`): verificado na prática (capturando as
  requisições reais de um OCR rodando) que ele busca o worker, o WASM e os pacotes de idioma
  (por/eng) todos desse mesmo domínio. Se um dia trocar o CDN do Tesseract ou adicionar outro
  idioma hospedado em outro lugar, refaça essa checagem e atualize a lista.
- **`style-src` inclui `'unsafe-inline'`** de propósito: o HTML usa bastante `style="..."` inline
  (ícones, linhas de formulário). Travar isso também exigiria tirar todo `style="..."` pra classes
  CSS - trabalho grande, adiado. `script-src` continua travado (sem `'unsafe-inline'`), que é a
  parte que importa mais (impede rodar JavaScript de origem não autorizada).

Ao adicionar qualquer novo `<script src>` de fora (CDN) ou qualquer chamada de rede nova em
`app.js`/`core.js`, atualize `vercel.json` - senão o navegador bloqueia silenciosamente e um erro
de CSP aparece só no console (a ferramenta continua "funcionando" visualmente, só aquilo específico
para de funcionar, o que é fácil de não perceber sem checar o console em produção).

## Deploy

Estático puro, sem build. Qualquer host de estáticos serve. No Vercel: output
directory = raiz do repositório, sem build command (o `vercel.json` na raiz já
define os cabeçalhos de segurança).

Ao mudar qualquer arquivo do "shell" (`index.html`, `boot.js`, `core.js`, `db.js`, `i18n.js`,
`app.js` dentro de `app/`), **incremente `VERSION` em `app/sw.js`** e resuma a mudança em
`CHANGENOTE` — é isso que dispara o aviso "tem versão nova" para quem já usou a ferramenta.

## Changelog desta importação (v34)

A partir da v35, o histórico de versões fica em [CHANGELOG.md](CHANGELOG.md).

- Mensagens de runtime traduzidas para PT/EN/ES (antes ~110 textos ficavam em
  português para todos): resultados, `confirm()`/`prompt()`, progresso, erros de
  leitura, chips e status da prévia, modo "Renomear existentes" inteiro, datas.
- Tema volta a acompanhar o sistema operacional (antes congelava após a 1ª visita).
- Numeração das pastas pode começar em 0.
- Prefixo não é mais afetado pela opção MAIÚSCULAS/minúsculas (só o nome é).
- Casamento de documento → pasta: só casa em início de palavra / palavra inteira
  (antes `Ana.pdf` podia cair dentro da pasta `Mariana`).
- `aria-label` nos campos e `role="status"` nas mensagens (acessibilidade).
- Landing: `--tint-bg` definido, `<iframe loading="lazy">`, `postMessage` com
  origem verificada em vez de `"*"`, `<link rel="canonical">`.
- `manifest.webmanifest` com `id`.
