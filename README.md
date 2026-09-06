# PastaFácil

Ferramenta da **Lumvix** para criar pastas em lote a partir de uma lista de nomes
(ou renomear pastas que já existem). Roda **100% no navegador** — nada é enviado a
servidor. PWA instalável, funciona offline, PT/EN/ES.

- Página: `pastafacil/index.html` → servida em `/pastafacil/`
- App: `pastafacil/app/` → servida em `/pastafacil/app/`

## Estrutura

```
pastafacil/
  index.html              página com o iframe + menu (Como funciona / Recursos / Privacidade)
  icon.svg
  app/
    index.html            a ferramenta
    app.js                UI, leitura de arquivos, zip, File System Access, modo renomear
    core.js               sanitização de nomes, CSV, plano de pastas, casamento de documentos
    db.js                 biblioteca local (IndexedDB) + histórico
    i18n.js               traduções PT / EN / ES
    sw.js                 service worker (offline). BUMPAR `VERSION` a cada mudança no shell
    manifest.webmanifest
    icon-*.png
    vendor/               jszip, xlsx (SheetJS), pdf.js — carregados sob demanda
```

Os caminhos nos HTML são absolutos (`/pastafacil/...`), então o conteúdo deve ser
servido a partir da raiz do domínio (ex.: `lumvix.com.br/pastafacil/`).

## Deploy

Estático puro, sem build. Qualquer host de estáticos serve. No Vercel: output
directory = raiz do repositório, sem build command.

Ao mudar qualquer arquivo de `app/` (index.html, app.js, core.js, db.js, i18n.js),
**incremente `VERSION` em `app/sw.js`** e resuma a mudança em `CHANGENOTE` — é isso
que dispara o aviso "tem versão nova" para quem já usou a ferramenta.

## Changelog desta importação (v34)

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
