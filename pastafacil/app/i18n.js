/* PastaFácil - traducoes (pt / en / es) */
(function (global) {
  "use strict";

  var DICT = {
    lead: {
      pt: "Crie uma pasta para cada nome de uma lista, ou renomeie pastas que já existem. Roda 100% no seu navegador, nada é enviado a servidor.",
      en: "Create one folder per name from a list, or rename folders that already exist. Runs 100% in your browser; nothing is sent to a server.",
      es: "Crea una carpeta por cada nombre de una lista, o renombra carpetas que ya existen. Funciona 100% en tu navegador; nada se envía a un servidor.",
    },
    install: { pt: "Instalar app", en: "Install app", es: "Instalar app" },
    installIosSteps: {
      pt: "Pra instalar no iPhone/iPad: toque no ícone Compartilhar (o quadrado com uma seta pra cima, na barra do Safari) e depois em \"Adicionar à Tela de Início\".",
      en: "To install on iPhone/iPad: tap the Share icon (the square with an arrow pointing up, in the Safari bar), then tap \"Add to Home Screen\".",
      es: "Para instalar en iPhone/iPad: toca el ícono Compartir (el cuadrado con una flecha hacia arriba, en la barra de Safari) y luego \"Agregar a pantalla de inicio\".",
    },
    updateMsg: { pt: "⟳ Tem uma versão nova do PastaFácil pronta.", en: "⟳ A new version of PastaFácil is ready.", es: "⟳ Hay una nueva versión de PastaFácil lista." },
    updateVersion: { pt: "Versão {v} do PastaFácil disponível.", en: "PastaFácil version {v} available.", es: "Versión {v} de PastaFácil disponible." },
    updateFull: { pt: "Versão {v} do PastaFácil disponível: {nota}", en: "PastaFácil version {v} available: {nota}", es: "Versión {v} de PastaFácil disponible: {nota}" },
    updateBtn: { pt: "Atualizar agora", en: "Update now", es: "Actualizar ahora" },
    previewMoreRows: {
      pt: "… e mais {n} linha(s), não mostradas aqui só por espaço - mas serão criadas/renomeadas normalmente.",
      en: "… and {n} more row(s), not shown here just to save space - but they will be created/renamed normally.",
      es: "… y {n} fila(s) más, no mostradas aquí solo por espacio - pero serán creadas/renombradas normalmente.",
    },
    tutorialBtn: { pt: "Tutorial", en: "Tutorial", es: "Tutorial" },
    tutorialTitle: { pt: "❓ Tutorial completo da ferramenta", en: "❓ Full tool tutorial", es: "❓ Tutorial completo de la herramienta" },
    tutorialIntro: {
      pt: '<b>Visão geral:</b> a ferramenta tem dois modos, alternáveis nos botões abaixo da lista: <b>"Criar pastas"</b> (gera uma pasta pra cada nome de uma lista) e <b>"Renomear existentes"</b> (renomeia pastas que já existem no seu computador). Os dois rodam 100% no navegador, nada do que você digita ou envia sai do seu computador.',
      en: '<b>Overview:</b> the tool has two modes, switchable with the buttons below the list: <b>"Create folders"</b> (makes one folder per name from a list) and <b>"Rename existing"</b> (renames folders that already exist on your computer). Both run 100% in your browser; nothing you type or upload ever leaves your computer.',
      es: '<b>Visión general:</b> la herramienta tiene dos modos, alternables con los botones debajo de la lista: <b>"Crear carpetas"</b> (crea una carpeta por cada nombre de una lista) y <b>"Renombrar existentes"</b> (renombra carpetas que ya existen en tu computadora). Ambos funcionan 100% en tu navegador; nada de lo que escribes o subes sale de tu computadora.',
    },
    tutorialInput: {
      pt: '<b>1. Fornecer a lista de nomes</b><br>Na aba "Colar nomes", digite ou cole um nome por linha (linhas em branco e as que começam com <code>#</code> são ignoradas). Na aba "Enviar arquivos", você pode enviar: <b>.txt/.csv</b> (uma linha ou coluna por nome), <b>.xlsx/.xls</b> (planilha, com escolha de colunas), <b>PDF</b> (o texto é extraído automaticamente) ou uma <b>imagem/foto/print</b> (a ferramenta lê o texto da imagem por OCR, inclusive colando direto com Ctrl+V). Revise sempre o resultado do PDF/OCR: a leitura automática não é 100% exata, principalmente em letra de mão ou fotos tortas/escuras.',
      en: '<b>1. Providing the list of names</b><br>In the "Paste names" tab, type or paste one name per line (blank lines and lines starting with <code>#</code> are ignored). In the "Upload files" tab, you can upload: <b>.txt/.csv</b> (one line or column per name), <b>.xlsx/.xls</b> (spreadsheet, with column selection), <b>PDF</b> (text is extracted automatically) or an <b>image/photo/screenshot</b> (the tool reads the text from the image via OCR, and you can even paste one directly with Ctrl+V). Always review PDF/OCR results: automatic reading isn\'t 100% accurate, especially with handwriting or crooked/dark photos.',
      es: '<b>1. Proporcionar la lista de nombres</b><br>En la pestaña "Pegar nombres", escribe o pega un nombre por línea (las líneas en blanco y las que empiezan con <code>#</code> se ignoran). En la pestaña "Subir archivos", puedes subir: <b>.txt/.csv</b> (una línea o columna por nombre), <b>.xlsx/.xls</b> (hoja de cálculo, con selección de columnas), <b>PDF</b> (el texto se extrae automáticamente) o una <b>imagen/foto/captura</b> (la herramienta lee el texto de la imagen por OCR, incluso pegando directo con Ctrl+V). Revisa siempre el resultado del PDF/OCR: la lectura automática no es 100% exacta, sobre todo con letra manuscrita o fotos torcidas/oscuras.',
    },
    tutorialSheet: {
      pt: '<b>2. Trabalhando com planilhas</b><br>Ao enviar uma planilha, marque quais colunas formam o nome da pasta (pode marcar mais de uma; a coluna de nome já vem primeiro e a de matrícula/código por último, na ordem padrão - use as setinhas <b>▲▼</b> ao lado de cada uma se quiser mudar) e o texto que separa elas. Se a primeira linha da planilha for um título (cabeçalho) em vez de um nome de verdade, marque "Primeira linha é título" pra ignorá-la. Planilhas com mais de uma aba mostram um seletor de aba (a ferramenta já escolhe sozinha a primeira aba com dados, pulando abas de capa/instruções vazias); marcando "Criar uma pasta para cada aba", a ferramenta gera pastas separadas pra cada aba da planilha de uma vez.',
      en: '<b>2. Working with spreadsheets</b><br>When you upload a spreadsheet, check which columns make up the folder name (you can check more than one; the name column already comes first and the ID/registration column last, by default - use the <b>▲▼</b> arrows next to each one if you want to change it) and the text that separates them. If the spreadsheet\'s first row is a header instead of an actual name, check "First row is a header" to ignore it. Spreadsheets with more than one tab show a tab selector (the tool already picks the first tab with data on its own, skipping empty cover/instruction tabs); checking "Create one folder per tab" makes the tool generate separate folders for every tab of the spreadsheet at once.',
      es: '<b>2. Trabajando con hojas de cálculo</b><br>Al subir una hoja de cálculo, marca qué columnas forman el nombre de la carpeta (puedes marcar más de una; la columna de nombre ya viene primero y la de matrícula/código al final, por defecto - usa las flechitas <b>▲▼</b> junto a cada una si quieres cambiarlo) y el texto que las separa. Si la primera fila de la hoja es un título (encabezado) en vez de un nombre de verdad, marca "La primera fila es un título" para ignorarla. Las hojas con más de una pestaña muestran un selector de hoja (la herramienta ya elige sola la primera pestaña con datos, saltando pestañas de portada/instrucciones vacías); marcando "Crear una carpeta por cada hoja", la herramienta genera carpetas separadas para cada hoja de la planilla de una vez.',
    },
    tutorialGroup: {
      pt: '<b>3. Agrupar em subpastas</b><br>Em "Agrupar em pastas por", escolha uma coluna pra criar uma subpasta por valor dela (ex.: uma pasta por turma, e dentro de cada uma, a pasta de cada aluno). Se você marcar a mesma coluna usada no nome da pasta, aparece um aviso: o valor vai repetir (uma vez como pasta do grupo, outra vez dentro do nome), isso é esperado, não é erro, mas se não for o que você quer, é só trocar pra "Nenhum" ou escolher outra coluna pro nome.',
      en: '<b>3. Grouping into subfolders</b><br>In "Group into folders by", choose a column to create one subfolder per value of it (e.g. one folder per class, with each student\'s folder inside it). If you check the same column used in the folder name, a warning appears: the value will repeat (once as the group folder, once inside the name), that\'s expected, not an error, but if it\'s not what you want, just switch it to "None" or pick a different column for the name.',
      es: '<b>3. Agrupar en subcarpetas</b><br>En "Agrupar en carpetas por", elige una columna para crear una subcarpeta por cada valor de ella (ej.: una carpeta por grupo, y dentro de cada una, la carpeta de cada alumno). Si marcas la misma columna usada en el nombre de la carpeta, aparece un aviso: el valor se repetirá (una vez como carpeta del grupo, otra vez dentro del nombre), esto es esperado, no es un error, pero si no es lo que quieres, solo cambia a "Ninguno" o elige otra columna para el nombre.',
    },
    tutorialDocs: {
      pt: '<b>4. Colocar documentos dentro das pastas</b><br>Em "Documentos para colocar dentro das pastas", envie arquivos cujo nome comece igual ao nome de uma pessoa da lista (ex.: "João da Silva.pdf" entra sozinho dentro da pasta "João da Silva"). Útil pra distribuir contratos, boletins, certificados etc. junto com a criação das pastas, tudo de uma vez.',
      en: '<b>4. Placing documents inside the folders</b><br>In "Documents to place inside the folders", upload files whose name starts the same as a person\'s name on the list (e.g. "John Smith.pdf" automatically goes inside the "John Smith" folder). Useful for distributing contracts, report cards, certificates, etc. together with the folder creation, all at once.',
      es: '<b>4. Poner documentos dentro de las carpetas</b><br>En "Documentos para poner dentro de las carpetas", sube archivos cuyo nombre empiece igual al nombre de una persona de la lista (ej.: "Juan Pérez.pdf" entra solo dentro de la carpeta "Juan Pérez"). Útil para repartir contratos, boletines, certificados, etc. junto con la creación de las carpetas, todo de una vez.',
    },
    tutorialAdvanced2: {
      pt: '<b>5. Opções avançadas (tudo opcional)</b><br><b>Prefixo:</b> texto fixo antes de cada nome. <b>Maiúsculas/minúsculas:</b> muda só a caixa das letras. <b>Numerar as pastas:</b> acrescenta 001, 002... na ordem da lista (escolha onde começar e quantos dígitos). <b>Modelo de subpasta:</b> cria níveis dentro da pasta de cada pessoa (ex.: <code>{nome}/Documentos</code> gera uma subpasta "Documentos" vazia dentro de cada uma). <b>Remover acentos:</b> troca á/ã/ç etc. por a/a/c. <b>Arquivo LEIA-ME.txt:</b> garante que a pasta não fique vazia (alguns programas de zip pulam pastas vazias ao extrair).',
      en: '<b>5. Advanced options (all optional)</b><br><b>Prefix:</b> fixed text before each name. <b>Upper/lower case:</b> only changes the letter case. <b>Number the folders:</b> adds 001, 002... in list order (choose the starting number and how many digits). <b>Subfolder template:</b> creates levels inside each person\'s folder (e.g. <code>{nome}/Documents</code> makes an empty "Documents" subfolder inside each one). <b>Remove accents:</b> replaces á/ã/ç etc. with a/a/c. <b>README.txt file:</b> makes sure the folder isn\'t empty (some zip programs skip empty folders when extracting).',
      es: '<b>5. Opciones avanzadas (todo opcional)</b><br><b>Prefijo:</b> texto fijo antes de cada nombre. <b>Mayúsculas/minúsculas:</b> solo cambia la caja de las letras. <b>Numerar las carpetas:</b> agrega 001, 002... en el orden de la lista (elige dónde empezar y cuántos dígitos). <b>Plantilla de subcarpeta:</b> crea niveles dentro de la carpeta de cada persona (ej.: <code>{nome}/Documentos</code> genera una subcarpeta "Documentos" vacía dentro de cada una). <b>Quitar acentos:</b> cambia á/ã/ç etc. por a/a/c. <b>Archivo LÉEME.txt:</b> asegura que la carpeta no quede vacía (algunos programas de zip saltan carpetas vacías al extraer).',
    },
    tutorialWho: {
      pt: '<b>6. Quem está gerando (registro para auditoria)</b><br>Antes dos botões de criar/baixar, tem um bloco opcional pra informar <b>nome, matrícula, setor, unidade e função</b> de quem está gerando aquela leva de pastas - colaborador ou cliente. Não é obrigatório, mas quando preenchido, fica gravado num arquivo de relatório dentro do resultado (e também no log de anexos, se houver documentos), junto com a data e a hora - já que a ferramenta não tem login nem servidor, é assim que fica um histórico de quem gerou o quê.',
      en: '<b>6. Who\'s generating this (audit record)</b><br>Before the create/download buttons, there\'s an optional block to fill in <b>name, employee ID, department, branch and role</b> of whoever is generating that batch of folders - employee or client. Not required, but when filled in, it gets recorded in a report file inside the result (and also in the attachment log, if there are documents), together with the date and time - since the tool has no login or server, this is how a history of who generated what is kept.',
      es: '<b>6. Quién está generando esto (registro de auditoría)</b><br>Antes de los botones de crear/descargar, hay un bloque opcional para completar <b>nombre, legajo, sector, sede y función</b> de quién está generando ese lote de carpetas, empleado o cliente. No es obligatorio, pero cuando se completa, queda registrado en un archivo de informe dentro del resultado (y también en el registro de adjuntos, si hay documentos), junto con la fecha y la hora - como la herramienta no tiene inicio de sesión ni servidor, así se mantiene un historial de quién generó qué.',
    },
    tutorialSaveShare: {
      pt: '<b>7. Salvar e compartilhar configurações</b><br>"Salvar na biblioteca" guarda a lista e as configurações atuais só no seu navegador (aparece depois em "Minhas listas salvas", pra reabrir sem digitar tudo de novo, some se você limpar os dados do navegador). "Copiar link da configuração" gera um link que guarda só as opções escolhidas (separador, colunas, prefixo etc.), nunca a lista de nomes em si, dá pra mandar esse link pra outra pessoa configurar igual, sem compartilhar dados de ninguém.',
      en: '<b>7. Saving and sharing settings</b><br>"Save to library" stores the current list and settings only in your browser (it later shows up under "My saved lists", so you can reopen it without retyping everything, and it disappears if you clear your browser data). "Copy settings link" generates a link that stores only the chosen options (separator, columns, prefix, etc.), never the actual list of names, so you can send that link to someone else to set up the same way, without sharing anyone\'s data.',
      es: '<b>7. Guardar y compartir configuraciones</b><br>"Guardar en la biblioteca" guarda la lista y la configuración actual solo en tu navegador (después aparece en "Mis listas guardadas", para reabrirla sin escribir todo de nuevo, y desaparece si borras los datos del navegador). "Copiar enlace de configuración" genera un enlace que guarda solo las opciones elegidas (separador, columnas, prefijo, etc.), nunca la lista de nombres en sí, así puedes enviar ese enlace a otra persona para que configure igual, sin compartir datos de nadie.',
    },
    tutorialOutput: {
      pt: '<b>8. Pré-visualizar e criar as pastas</b><br>Clique em "Pré-visualizar" pra ver a tabela com o nome final de cada pasta e o status de cada linha (ok, ajustado, duplicado ou inválido) antes de criar qualquer coisa de verdade. Depois, "Baixar pastas (.zip)" funciona em qualquer navegador (baixe e "Extrair tudo"). Já "Criar direto numa pasta" cria as pastas na hora, sem baixar nem extrair zip, só aparece no Chrome ou Edge, no computador (não funciona no celular nem em outros navegadores).',
      en: '<b>8. Preview and create the folders</b><br>Click "Preview" to see the table with the final name of each folder and each row\'s status (ok, adjusted, duplicate or invalid) before creating anything for real. Then, "Download folders (.zip)" works in any browser (download it and "Extract all"). "Create straight into a folder" instead creates the folders right away, with no zip to download or extract, but it only shows up in Chrome or Edge, on desktop (it doesn\'t work on mobile or other browsers).',
      es: '<b>8. Vista previa y creación de las carpetas</b><br>Haz clic en "Vista previa" para ver la tabla con el nombre final de cada carpeta y el estado de cada fila (ok, ajustado, duplicado o inválido) antes de crear algo de verdad. Luego, "Descargar carpetas (.zip)" funciona en cualquier navegador (descárgalo y "Extraer todo"). "Crear directamente en una carpeta" en cambio crea las carpetas al instante, sin descargar ni extraer zip, pero solo aparece en Chrome o Edge, en la computadora (no funciona en el celular ni en otros navegadores).',
    },
    tutorialRename2: {
      pt: '<b>Modo "Renomear existentes"</b><br>Clique em "Escolher pasta..." e selecione, no seu computador, a pasta-mãe que já contém as subpastas a renomear (só funciona no Chrome/Edge, no computador). Depois, cole uma lista no formato <code>nome atual =&gt; nome novo</code> (uma linha por pasta, também aceita <code>|</code>, <code>;</code> ou tabulação como separador), ou envie uma planilha com a coluna 1 = nome atual e coluna 2 = nome novo. Pré-visualize pra conferir e clique em "Renomear pastas": a renomeação acontece direto no seu computador, sem gerar nenhum arquivo pra baixar.',
      en: '<b>"Rename existing" mode</b><br>Click "Pick folder..." and select, on your computer, the parent folder that already contains the subfolders to rename (only works in Chrome/Edge, on desktop). Then paste a list as <code>current name =&gt; new name</code> (one line per folder, also accepts <code>|</code>, <code>;</code> or tab as separator), or upload a spreadsheet with column 1 = current name and column 2 = new name. Preview to check, then click "Rename folders": the renaming happens directly on your computer, with no file generated to download.',
      es: '<b>Modo "Renombrar existentes"</b><br>Haz clic en "Elegir carpeta..." y selecciona, en tu computadora, la carpeta madre que ya contiene las subcarpetas a renombrar (solo funciona en Chrome/Edge, en la computadora). Luego pega una lista con el formato <code>nombre actual =&gt; nombre nuevo</code> (una línea por carpeta, también acepta <code>|</code>, <code>;</code> o tabulación como separador), o sube una hoja de cálculo con columna 1 = nombre actual y columna 2 = nombre nuevo. Revisa la vista previa y haz clic en "Renombrar carpetas": el cambio ocurre directamente en tu computadora, sin generar ningún archivo para descargar.',
    },
    tutorialExtras: {
      pt: '<b>Outros recursos</b><br>No topo da página: troque o idioma (PT/EN/ES) e (se o navegador oferecer) instale a ferramenta como aplicativo pra abrir direto da tela inicial e usar até sem internet - o tema claro/escuro segue automaticamente a preferência do seu sistema. Quando sair uma versão nova da ferramenta, aparece um aviso no topo da página com um botão pra atualizar.',
      en: '<b>Other features</b><br>At the top of the page: switch language (PT/EN/ES) and (if your browser offers it) install the tool as an app to open it straight from your home screen and use it even without internet - light/dark theme automatically follows your system preference. When a new version of the tool is released, a banner appears at the top of the page with a button to update.',
      es: '<b>Otras funciones</b><br>En la parte superior de la página: cambia el idioma (PT/EN/ES) y (si tu navegador lo ofrece) instala la herramienta como app para abrirla directo desde tu pantalla de inicio y usarla incluso sin internet - el tema claro/oscuro sigue automáticamente la preferencia de tu sistema. Cuando sale una versión nueva de la herramienta, aparece un aviso en la parte superior de la página con un botón para actualizar.',
    },
    menuBtn: { pt: "Menu", en: "Menu", es: "Menú" },
    menuTitle: { pt: "Menu", en: "Menu", es: "Menú" },
    menuCatAjuda: { pt: "Ajuda", en: "Help", es: "Ayuda" },
    menuCatDados: { pt: "Meus dados (neste navegador)", en: "My data (this browser)", es: "Mis datos (este navegador)" },
    menuVoltar: { pt: "Voltar", en: "Back", es: "Volver" },
    menuCatSobre: { pt: "Sobre o PastaFácil", en: "About PastaFácil", es: "Sobre PastaFácil" },
    recursosBtn: { pt: "Recursos", en: "Features", es: "Funciones" },
    recursosTitle: { pt: "✅ Recursos do PastaFácil", en: "✅ PastaFácil features", es: "✅ Funciones de PastaFácil" },
    recursosSubtitle: {
      pt: "Tudo abaixo já funciona, hoje, na ferramenta.",
      en: "Everything below already works, today, in the tool.",
      es: "Todo lo de abajo ya funciona, hoy, en la herramienta.",
    },
    recurso01: { pt: "Colar lista de nomes", en: "Paste a list of names", es: "Pegar una lista de nombres" },
    recurso02: { pt: "Enviar planilha (Excel/CSV)", en: "Upload a spreadsheet (Excel/CSV)", es: "Subir una hoja de cálculo (Excel/CSV)" },
    recurso03: { pt: "Enviar arquivo .txt ou PDF", en: "Upload a .txt or PDF file", es: "Subir un archivo .txt o PDF" },
    recurso04: { pt: "Ler nomes de uma foto/print (OCR)", en: "Read names from a photo/screenshot (OCR)", es: "Leer nombres de una foto/captura (OCR)" },
    recurso05: { pt: "Detectar e ignorar duplicados", en: "Detect and skip duplicates", es: "Detectar e ignorar duplicados" },
    recurso06: { pt: "Combinar várias colunas no nome da pasta", en: "Combine multiple columns in the folder name", es: "Combinar varias columnas en el nombre de la carpeta" },
    recurso07: { pt: "Gerar uma pasta pra cada aba da planilha", en: "Generate one folder per spreadsheet tab", es: "Generar una carpeta por cada hoja de la planilla" },
    recurso08: { pt: "Organizar em subpastas (cidade, setor...)", en: "Organize into subfolders (city, department...)", es: "Organizar en subcarpetas (ciudad, sector...)" },
    recurso09: { pt: "Agrupar tudo dentro de uma pasta-mãe", en: "Group everything inside one parent folder", es: "Agrupar todo dentro de una carpeta madre" },
    recurso10: { pt: "Distribuir documentos nas pastas certas", en: "Distribute documents into the right folders", es: "Distribuir documentos en las carpetas correctas" },
    recurso11: { pt: "Prefixo, numeração e modelo de subpasta", en: "Prefix, numbering and subfolder template", es: "Prefijo, numeración y plantilla de subcarpeta" },
    recurso12: { pt: "Maiúsculas/minúsculas e remover acentos", en: "Upper/lowercase and accent removal", es: "Mayúsculas/minúsculas y quitar acentos" },
    recurso13: { pt: "Arquivo LEIA-ME.txt automático", en: "Automatic README.txt file", es: "Archivo LÉEME.txt automático" },
    recurso14: { pt: "Pré-visualizar antes de criar", en: "Preview before creating", es: "Vista previa antes de crear" },
    recurso15: { pt: "Baixar tudo em um .zip", en: "Download everything as a .zip", es: "Descargar todo en un .zip" },
    recurso16: { pt: "Criar direto numa pasta do PC", en: "Create straight into a folder on your PC", es: "Crear directamente en una carpeta del PC" },
    recurso17: { pt: "Renomear pastas já existentes (qualquer nível)", en: "Rename existing folders (any level)", es: "Renombrar carpetas ya existentes (cualquier nivel)" },
    recurso18: { pt: "Ações em lote pra gerar o de/para", en: "Batch actions to generate the from/to list", es: "Acciones en lote para generar el de/a" },
    recurso19: { pt: "Desfazer a última renomeação", en: "Undo the last rename", es: "Deshacer el último renombrado" },
    recurso20: { pt: "Registro de quem gerou (auditoria)", en: "Record of who generated it (audit)", es: "Registro de quién lo generó (auditoría)" },
    recurso21: { pt: "Exportar relatório em CSV", en: "Export report as CSV", es: "Exportar informe en CSV" },
    recurso22: { pt: "Salvar listas e mapeamentos na biblioteca", en: "Save lists and mappings to the library", es: "Guardar listas y mapeos en la biblioteca" },
    recurso23: { pt: "Compartilhar configuração por link", en: "Share settings via link", es: "Compartir configuración por enlace" },
    recurso24: { pt: "Funciona offline, instalável como app", en: "Works offline, installable as an app", es: "Funciona sin conexión, instalable como app" },
    recurso25: { pt: "Aviso automático de atualização", en: "Automatic update notice", es: "Aviso automático de actualización" },
    recurso26: { pt: "Tema claro/escuro", en: "Light/dark theme", es: "Tema claro/oscuro" },
    recurso27: { pt: "Português, inglês e espanhol", en: "Portuguese, English and Spanish", es: "Portugués, inglés y español" },
    recurso28: { pt: "100% no navegador, nada enviado a servidor", en: "100% in your browser, nothing sent to a server", es: "100% en el navegador, nada se envía a un servidor" },
    privacidadeBtn: { pt: "Privacidade", en: "Privacy", es: "Privacidad" },
    privacidadeTitle: { pt: "🔒 Privacidade", en: "🔒 Privacy", es: "🔒 Privacidad" },
    privacidade1: {
      pt: "<b>Nada sai do seu computador.</b> A lista de nomes, os arquivos que você envia e as pastas geradas são processados 100% dentro do seu navegador.",
      en: "<b>Nothing leaves your computer.</b> The list of names, the files you upload and the generated folders are processed 100% inside your browser.",
      es: "<b>Nada sale de tu computadora.</b> La lista de nombres, los archivos que subes y las carpetas generadas se procesan 100% dentro de tu navegador.",
    },
    privacidade2: {
      pt: "<b>Sem servidor.</b> O PastaFácil não tem backend nem banco de dados - não existe um lugar remoto onde seus dados fiquem guardados.",
      en: "<b>No server.</b> PastaFácil has no backend or database - there's no remote place where your data gets stored.",
      es: "<b>Sin servidor.</b> PastaFácil no tiene backend ni base de datos - no existe un lugar remoto donde tus datos queden guardados.",
    },
    privacidade3: {
      pt: "<b>Sem conta, sem login.</b> Não é preciso se cadastrar nem informar e-mail pra usar a ferramenta.",
      en: "<b>No account, no login.</b> You don't need to sign up or give an email to use the tool.",
      es: "<b>Sin cuenta, sin inicio de sesión.</b> No hace falta registrarse ni dar un correo para usar la herramienta.",
    },
    privacidade4: {
      pt: "<b>O que fica salvo, fica só no seu navegador.</b> \"Minhas listas salvas\" e as preferências de tema/idioma usam o armazenamento local do navegador (localStorage/IndexedDB) - some se você limpar os dados do site, e nunca é enviado a lugar nenhum.",
      en: "<b>Whatever gets saved stays only in your browser.</b> \"My saved lists\" and the theme/language preferences use the browser's local storage (localStorage/IndexedDB) - it disappears if you clear the site's data, and is never sent anywhere.",
      es: "<b>Lo que queda guardado, queda solo en tu navegador.</b> \"Mis listas guardadas\" y las preferencias de tema/idioma usan el almacenamiento local del navegador (localStorage/IndexedDB) - desaparece si borras los datos del sitio, y nunca se envía a ningún lado.",
    },
    privacidade5: {
      pt: "<b>Reconhecimento de texto em imagem (OCR)</b> também roda localmente, via WebAssembly - a foto nunca é enviada para nenhum serviço externo.",
      en: "<b>Image text recognition (OCR)</b> also runs locally, via WebAssembly - the photo is never sent to any external service.",
      es: "<b>El reconocimiento de texto en imagen (OCR)</b> también funciona localmente, vía WebAssembly - la foto nunca se envía a ningún servicio externo.",
    },
    historicoBtn: { pt: "Histórico", en: "History", es: "Historial" },
    historicoTitle: { pt: "🕘 Histórico de operações", en: "🕘 Operation history", es: "🕘 Historial de operaciones" },
    historicoHint: {
      pt: "Guarda, só neste navegador, as últimas vezes que você criou ou renomeou pastas (data, quantidade e onde). Não guarda a lista de nomes em si.",
      en: "Keeps, only in this browser, the last times you created or renamed folders (date, quantity and where). Doesn't store the list of names itself.",
      es: "Guarda, solo en este navegador, las últimas veces que creaste o renombraste carpetas (fecha, cantidad y dónde). No guarda la lista de nombres en sí.",
    },
    historicoClear: { pt: "Limpar histórico", en: "Clear history", es: "Limpiar historial" },
    historicoEmpty: { pt: "Nenhum registro ainda.", en: "No records yet.", es: "Ningún registro todavía." },
    historicoCriar: { pt: "criadas", en: "created", es: "creadas" },
    historicoRenomear: { pt: "renomeadas", en: "renamed", es: "renombradas" },
    historicoVer: { pt: "Ver detalhes", en: "View details", es: "Ver detalles" },
    historicoPasta: { pt: "pasta(s)", en: "folder(s)", es: "carpeta(s)" },
    configBtn: { pt: "Configurações", en: "Settings", es: "Configuración" },
    configTitle: { pt: "⚙ Configurações", en: "⚙ Settings", es: "⚙ Configuración" },
    configHint: {
      pt: 'Idioma e tema já ficam salvos automaticamente (os botões no topo da página). Aqui você pode salvar como <b>padrão</b> as opções abaixo, pra elas já virem marcadas assim toda vez que abrir a ferramenta - sem precisar reconfigurar em cada lista.',
      en: 'Language and theme are already saved automatically (the buttons at the top of the page). Here you can save the options below as the <b>default</b>, so they come already checked every time you open the tool - no need to reconfigure them for every list.',
      es: 'El idioma y el tema ya se guardan automáticamente (los botones en la parte superior de la página). Aquí puedes guardar las opciones de abajo como <b>predeterminadas</b>, para que ya vengan marcadas cada vez que abras la herramienta, sin tener que reconfigurarlas en cada lista.',
    },
    configSave: { pt: "💾 Salvar opções atuais como padrão", en: "💾 Save current options as default", es: "💾 Guardar opciones actuales como predeterminadas" },
    configReset: { pt: "↺ Restaurar padrão de fábrica", en: "↺ Restore factory default", es: "↺ Restaurar predeterminado de fábrica" },
    configNenhum: {
      pt: "Nenhuma preferência salva ainda - usando os padrões de fábrica (sem ordenar, sem mudar caixa, sem remover acentos, sem LEIA-ME.txt).",
      en: "No preference saved yet - using factory defaults (no sorting, no case change, no accent removal, no LEIA-ME.txt).",
      es: "Ninguna preferencia guardada todavía - usando los valores de fábrica (sin ordenar, sin cambiar mayúsculas, sin quitar acentos, sin LEIA-ME.txt).",
    },
    configAtualLabel: { pt: "Padrão salvo hoje:", en: "Saved default:", es: "Predeterminado guardado:" },
    configSaveOk: { pt: "Salvo! Essas opções já vêm marcadas da próxima vez que você abrir a ferramenta.", en: "Saved! These options will already be checked next time you open the tool.", es: "¡Guardado! Estas opciones ya vendrán marcadas la próxima vez que abras la herramienta." },
    configResetOk: { pt: "Restaurado ao padrão de fábrica.", en: "Restored to factory default.", es: "Restaurado al valor de fábrica." },
    historicoRemover: { pt: "Remover", en: "Remove", es: "Eliminar" },
    modeCreate: { pt: "Criar pastas", en: "Create folders", es: "Crear carpetas" },
    modeRename: { pt: "Renomear existentes", en: "Rename existing", es: "Renombrar existentes" },

    step1: { pt: "1. Lista de nomes", en: "1. List of names", es: "1. Lista de nombres" },
    tabPaste: { pt: "Colar nomes", en: "Paste names", es: "Pegar nombres" },
    tabFiles: { pt: "Enviar arquivos", en: "Upload files", es: "Subir archivos" },
    pastePh: {
      pt: "Um nome por linha:\nJoão da Silva\nMaria Souza - 20231234\nCarlos Eduardo Pereira Lima",
      en: "One name per line:\nJohn Smith\nMary Jones - 20231234\nCharles Edward Parker",
      es: "Un nombre por línea:\nJuan Pérez\nMaría Gómez - 20231234\nCarlos Eduardo López",
    },
    pasteHint: {
      pt: "Linhas em branco e as que começam com # são ignoradas.",
      en: "Blank lines and lines starting with # are ignored.",
      es: "Las líneas en blanco y las que empiezan con # se ignoran.",
    },
    dropLabel: {
      pt: "Arraste arquivos aqui ou <u>clique para escolher</u><br><small>.txt, .csv, .xlsx, .pdf, imagem, ou cole um print (Ctrl+V)</small>",
      en: "Drag files here or <u>click to choose</u><br><small>.txt, .csv, .xlsx, .pdf, image, or paste a screenshot (Ctrl+V)</small>",
      es: "Arrastra archivos aquí o <u>haz clic para elegir</u><br><small>.txt, .csv, .xlsx, .pdf, imagen, o pega una captura (Ctrl+V)</small>",
    },
    dropMore: { pt: "Adicionar mais arquivos", en: "Add more files", es: "Agregar más archivos" },
    docsMore: { pt: "Adicionar mais documentos", en: "Add more documents", es: "Agregar más documentos" },
    sheet: { pt: "Aba da planilha", en: "Spreadsheet tab", es: "Hoja de cálculo" },
    allSheets: {
      pt: "Criar uma pasta para cada aba (usa todas as abas)",
      en: "Create one folder per tab (uses every tab)",
      es: "Crear una carpeta por cada hoja (usa todas las hojas)",
    },
    nameCols: { pt: "Colunas que formam o nome da pasta", en: "Columns that make up the folder name", es: "Columnas que forman el nombre de la carpeta" },
    nameColsHint: {
      pt: "Marque uma ou mais. Serão juntadas na ordem em que aparecem aqui (use ▲▼ pra mudar a ordem), com o separador abaixo.",
      en: "Check one or more. They are joined in the order shown here (use ▲▼ to reorder), using the separator below.",
      es: "Marca una o más. Se unen en el orden en que aparecen aquí (usa ▲▼ para reordenar), con el separador de abajo.",
    },
    sep: { pt: "Separador entre as colunas", en: "Separator between columns", es: "Separador entre columnas" },
    sepHint: {
      pt: 'Fica entre os valores das colunas marcadas acima. Ex.: com " - ", o nome vira "João Silva - 20231234".',
      en: 'Goes between the values of the columns checked above. E.g. with " - ", the name becomes "John Smith - 20231234".',
      es: 'Va entre los valores de las columnas marcadas arriba. Ej.: con " - ", el nombre queda "Juan Pérez - 20231234".',
    },
    groupBy: { pt: "Agrupar em pastas por", en: "Group into folders by", es: "Agrupar en carpetas por" },
    groupByHint: {
      pt: 'Cria uma subpasta pra cada valor dessa coluna, e a pasta de cada nome fica dentro dela. Ex.: agrupando por "Turma", vira Turma A/João, Turma A/Maria, Turma B/Carlos.',
      en: 'Creates one subfolder per value of this column, and each name\'s folder goes inside it. E.g. grouping by "Class" becomes Class A/John, Class A/Mary, Class B/Charles.',
      es: 'Crea una subcarpeta por cada valor de esa columna, y la carpeta de cada nombre queda dentro de ella. Ej.: agrupando por "Grupo", queda Grupo A/Juan, Grupo A/María, Grupo B/Carlos.',
    },
    groupNone: { pt: "Nenhum (tudo no mesmo nível)", en: "None (all at the same level)", es: "Ninguno (todo al mismo nivel)" },
    groupBy2: { pt: "E também por (2º nível, opcional)", en: "And also by (2nd level, optional)", es: "Y también por (2º nivel, opcional)" },
    groupBy2Hint: {
      pt: 'Cria mais um nível de subpasta dentro do primeiro. Ex.: agrupando por "Cidade" e depois por "Setor", vira Cidade/Setor/Nome.',
      en: 'Creates one more subfolder level inside the first. E.g. grouping by "City" and then by "Department" becomes City/Department/Name.',
      es: 'Crea un nivel más de subcarpeta dentro del primero. Ej.: agrupando por "Ciudad" y luego por "Sector", queda Ciudad/Sector/Nombre.',
    },
    groupNone2: { pt: "Nenhum", en: "None", es: "Ninguno" },
    groupWarn: {
      pt: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;margin-right:3px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Essa coluna também está marcada acima. O nome dela vai aparecer duas vezes no caminho da pasta: uma como grupo, outra no nome.',
      en: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;margin-right:3px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>This column is also checked above. Its name will appear twice in the folder path: once as the group, once in the name.',
      es: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;margin-right:3px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Esta columna también está marcada arriba. Su nombre aparecerá dos veces en la ruta de la carpeta: una como grupo, otra en el nombre.',
    },
    header: { pt: "Primeira linha é título (ignorar)", en: "First row is a header (ignore it)", es: "La primera fila es un título (ignorar)" },
    subdir: { pt: "Agrupar tudo dentro de uma pasta (opcional)", en: "Put everything inside one folder (optional)", es: "Poner todo dentro de una carpeta (opcional)" },
    subdirPh: { pt: "ex.: Turma A 2026", en: "e.g. Class A 2026", es: "ej.: Grupo A 2026" },
    subdirHint: {
      pt: "Todas as pastas criadas ficam dentro dessa pasta-mãe, em vez de soltas. Útil pra organizar tudo junto num só lugar.",
      en: "Every folder created goes inside this parent folder, instead of loose. Useful to keep everything organized together in one place.",
      es: "Todas las carpetas creadas quedan dentro de esta carpeta madre, en vez de sueltas. Útil para organizar todo junto en un solo lugar.",
    },
    docs: { pt: "Documentos para colocar dentro das pastas (opcional)", en: "Documents to place inside the folders (optional)", es: "Documentos para poner dentro de las carpetas (opcional)" },
    docsDrop: {
      pt: 'Arraste arquivos aqui ou <u>clique para escolher</u><br><small>Cada arquivo entra na pasta da pessoa com nome correspondente (ex.: "João da Silva.pdf" → pasta "João da Silva")</small>',
      en: 'Drag files here or <u>click to choose</u><br><small>Each file goes into the folder of the person with a matching name (e.g. "John Smith.pdf" → "John Smith" folder)</small>',
      es: 'Arrastra archivos aquí o <u>haz clic para elegir</u><br><small>Cada archivo entra en la carpeta de la persona con nombre correspondiente (ej.: "Juan Pérez.pdf" → carpeta "Juan Pérez")</small>',
    },
    whoTitle: { pt: "Quem está gerando (opcional)", en: "Who's generating this (optional)", es: "Quién está generando esto (opcional)" },
    whoHint: {
      pt: "Fica registrado no relatório junto com o resultado (data, hora, nome, matrícula, setor, unidade e função), só pra manter um histórico de quem fez cada geração. Não é obrigatório.",
      en: "Gets recorded in the report together with the result (date, time, name, employee ID, department, branch and role), just to keep a history of who made each generation. Not required.",
      es: "Queda registrado en el informe junto con el resultado (fecha, hora, nombre, legajo, sector, sede y función), solo para mantener un historial de quién hizo cada generación. No es obligatorio.",
    },
    whoName: { pt: "Nome (colaborador ou cliente)", en: "Name (employee or client)", es: "Nombre (empleado o cliente)" },
    whoNamePh: { pt: "ex.: Maria Souza", en: "e.g. Mary Jones", es: "ej.: María Gómez" },
    whoMatricula: { pt: "Matrícula", en: "Employee ID", es: "Legajo" },
    whoMatriculaPh: { pt: "ex.: 20231234", en: "e.g. 20231234", es: "ej.: 20231234" },
    whoSector: { pt: "Setor", en: "Department", es: "Sector" },
    whoSectorPh: { pt: "ex.: Recursos Humanos", en: "e.g. Human Resources", es: "ej.: Recursos Humanos" },
    whoUnidade: { pt: "Unidade", en: "Branch", es: "Sede" },
    whoUnidadePh: { pt: "ex.: Matriz - São Paulo", en: "e.g. Headquarters - São Paulo", es: "ej.: Casa Matriz - São Paulo" },
    whoRole: { pt: "Função", en: "Role", es: "Función" },
    whoRolePh: { pt: "ex.: Analista de RH", en: "e.g. HR Analyst", es: "ej.: Analista de RRHH" },
    perGroup: {
      pt: 'Gerar um <code>.zip</code> separado para cada grupo (dentro do arquivo final)',
      en: 'Make a separate <code>.zip</code> for each group (inside the final file)',
      es: 'Generar un <code>.zip</code> separado para cada grupo (dentro del archivo final)',
    },
    perGroupHint: {
      pt: "Em vez de um único .zip com tudo dentro, baixa um .zip para cada grupo (ex.: um .zip por turma), todos dentro de um arquivo .zip principal.",
      en: "Instead of a single .zip with everything inside, downloads one .zip per group (e.g. one .zip per class), all inside one main .zip file.",
      es: "En vez de un único .zip con todo dentro, descarga un .zip por cada grupo (ej.: un .zip por grupo), todos dentro de un archivo .zip principal.",
    },
    save: { pt: "Salvar na biblioteca", en: "Save to library", es: "Guardar en la biblioteca" },
    shareCfg: { pt: "Copiar link da configuração", en: "Copy settings link", es: "Copiar enlace de configuración" },
    libTitle: { pt: "Minhas listas salvas", en: "My saved lists", es: "Mis listas guardadas" },
    libHint: { pt: "Fica salvo só no seu navegador (neste computador).", en: "Saved only in your browser (on this computer).", es: "Se guarda solo en tu navegador (en esta computadora)." },
    libClear: { pt: "Apagar tudo", en: "Delete all", es: "Borrar todo" },
    adv: { pt: "Opções avançadas", en: "Advanced options", es: "Opciones avanzadas" },
    prefix: { pt: "Prefixo em cada pasta", en: "Prefix on every folder", es: "Prefijo en cada carpeta" },
    prefixPh: { pt: "ex.: Aluno ", en: "e.g. Student ", es: "ej.: Alumno " },
    prefixHint: {
      pt: 'Entra antes do nome em toda pasta. Ex.: prefixo "Aluno " + nome "João" = pasta "Aluno João".',
      en: 'Goes before the name on every folder. E.g. prefix "Student " + name "John" = folder "Student John".',
      es: 'Va antes del nombre en cada carpeta. Ej.: prefijo "Alumno " + nombre "Juan" = carpeta "Alumno Juan".',
    },
    letterCase: { pt: "Maiúsculas / minúsculas", en: "Upper / lower case", es: "Mayúsculas / minúsculas" },
    letterCaseHint: {
      pt: "Só muda a caixa das letras do nome, não mexe no prefixo nem no separador.",
      en: "Only changes the letter case of the name, doesn't touch the prefix or separator.",
      es: "Solo cambia mayúsculas/minúsculas del nombre, no afecta el prefijo ni el separador.",
    },
    caseKeep: { pt: "Manter como está", en: "Keep as is", es: "Mantener como está" },
    caseUpper: { pt: "MAIÚSCULAS", en: "UPPERCASE", es: "MAYÚSCULAS" },
    caseLower: { pt: "minúsculas", en: "lowercase", es: "minúsculas" },
    sortOrder: { pt: "Ordenar lista", en: "Sort list", es: "Ordenar lista" },
    sortOrderHint: {
      pt: "Reordena os nomes antes de gerar (não afeta agrupamento nem numeração por grupo).",
      en: "Reorders the names before generating (doesn't affect grouping or per-group numbering).",
      es: "Reordena los nombres antes de generar (no afecta el agrupamiento ni la numeración por grupo).",
    },
    sortKeep: { pt: "Ordem original", en: "Original order", es: "Orden original" },
    sortAz: { pt: "A → Z", en: "A → Z", es: "A → Z" },
    sortZa: { pt: "Z → A", en: "Z → A", es: "Z → A" },
    number: { pt: "Numerar as pastas (001, 002, 003…)", en: "Number the folders (001, 002, 003…)", es: "Numerar las carpetas (001, 002, 003…)" },
    numberHint: {
      pt: 'Acrescenta um número antes do nome de cada pasta, na ordem em que aparecem na lista. Ex.: "001 - João", "002 - Maria".',
      en: 'Adds a number before the name of each folder, in the order they appear in the list. E.g. "001 - John", "002 - Mary".',
      es: 'Agrega un número antes del nombre de cada carpeta, en el orden en que aparecen en la lista. Ej.: "001 - Juan", "002 - María".',
    },
    numStart: { pt: "Começar em", en: "Start at", es: "Empezar en" },
    numDigits: { pt: "Dígitos", en: "Digits", es: "Dígitos" },
    template: { pt: "Modelo de subpasta", en: "Subfolder template", es: "Plantilla de subcarpeta" },
    templatePh: { pt: "ex.: {nome}/Documentos  ou  Turma A/{nome}", en: "e.g. {nome}/Documents  or  Class A/{nome}", es: "ej.: {nome}/Documentos  o  Grupo A/{nome}" },
    templateHint: {
      pt: "Use <code>{nome}</code> onde o nome deve entrar. Barras <code>/</code> criam subníveis.",
      en: "Use <code>{nome}</code> where the name should go. Slashes <code>/</code> create sub-levels.",
      es: "Usa <code>{nome}</code> donde debe ir el nombre. Las barras <code>/</code> crean subniveles.",
    },
    noAccents: { pt: "Remover acentos dos nomes das pastas", en: "Remove accents from folder names", es: "Quitar acentos de los nombres de las carpetas" },
    noAccentsHint: {
      pt: "Troca á, ã, ç, etc. por a, a, c nos nomes das pastas. Útil se o programa que vai ler os arquivos não lida bem com acentos.",
      en: "Replaces á, ã, ç, etc. with a, a, c in folder names. Useful if the program reading the files doesn't handle accents well.",
      es: "Cambia á, ã, ç, etc. por a, a, c en los nombres de las carpetas. Útil si el programa que va a leer los archivos no maneja bien los acentos.",
    },
    keepFile: { pt: "Colocar um arquivo <code>LEIA-ME.txt</code> dentro de cada pasta", en: "Put a <code>README.txt</code> file inside each folder", es: "Poner un archivo <code>LÉEME.txt</code> dentro de cada carpeta" },
    keepFileHint: { pt: "Ative se o programa que abre o .zip costuma pular pastas vazias.", en: "Turn on if your unzip tool tends to skip empty folders.", es: "Actívalo si tu programa para abrir el .zip suele saltarse carpetas vacías." },
    preview: { pt: "Pré-visualizar", en: "Preview", es: "Vista previa" },
    btnDirect: { pt: "Criar direto numa pasta →", en: "Create straight into a folder →", es: "Crear directamente en una carpeta →" },
    btnZip: { pt: "Baixar pastas (.zip)", en: "Download folders (.zip)", es: "Descargar carpetas (.zip)" },
    fsHint: {
      pt: "“Criar direto numa pasta” cria as pastas na hora, dentro de uma pasta que você escolher, sem baixar nem extrair zip. (Chrome ou Edge no computador.)",
      en: "“Create straight into a folder” makes the folders right away, inside a folder you pick, no zip to download or extract. (Chrome or Edge on desktop.)",
      es: "“Crear directamente en una carpeta” crea las carpetas al instante, dentro de una carpeta que elijas, sin descargar ni extraer zip. (Chrome o Edge en la computadora.)",
    },
    previewTitle: { pt: "Prévia", en: "Preview", es: "Vista previa" },
    colFolder: { pt: "Pasta / caminho", en: "Folder / path", es: "Carpeta / ruta" },
    colOrigin: { pt: "Origem", en: "Source", es: "Origen" },
    colStatus: { pt: "Status", en: "Status", es: "Estado" },
    resultFoot: {
      pt: "Depois de baixar: botão direito no <code>.zip</code> → <em>Extrair tudo</em>. As pastas aparecem prontas.",
      en: "After downloading: right-click the <code>.zip</code> → <em>Extract all</em>. The folders appear ready.",
      es: "Después de descargar: clic derecho en el <code>.zip</code> → <em>Extraer todo</em>. Las carpetas aparecen listas.",
    },

    rnStep1: { pt: "1. Escolha a pasta que tem as subpastas", en: "1. Pick the folder that contains the subfolders", es: "1. Elige la carpeta que contiene las subcarpetas" },
    rnPick: { pt: "Escolher pasta…", en: "Pick folder…", es: "Elegir carpeta…" },
    rnPickHint: {
      pt: "Funciona no Chrome ou Edge, no computador. As pastas são renomeadas direto no seu PC. Inclui subpastas de qualquer nível (não só as de primeiro nível). Para renomear a própria pasta escolhida, selecione a pasta um nível acima dela.",
      en: "Works in Chrome or Edge, on desktop. Folders are renamed directly on your PC. Includes subfolders at any level (not just the first one). To rename the picked folder itself, select the folder one level above it.",
      es: "Funciona en Chrome o Edge, en la computadora. Las carpetas se renombran directamente en tu PC. Incluye subcarpetas de cualquier nivel (no solo las de primer nivel). Para renombrar la carpeta elegida en sí, selecciona la carpeta un nivel arriba de ella.",
    },
    rnStep2: { pt: "2. De → Para", en: "2. From → To", es: "2. De → A" },
    rnMapHint: {
      pt: "Cole uma linha por pasta no formato <code>nome atual =&gt; nome novo</code>. Também aceita <code>|</code>, <code>;</code> ou tabulação como separador.",
      en: "Paste one line per folder as <code>current name =&gt; new name</code>. Also accepts <code>|</code>, <code>;</code> or tab as separator.",
      es: "Pega una línea por carpeta con el formato <code>nombre actual =&gt; nombre nuevo</code>. También acepta <code>|</code>, <code>;</code> o tabulación como separador.",
    },
    rnMapDrop: {
      pt: "ou clique para enviar uma planilha: <b>coluna 1</b> = nome atual, <b>coluna 2</b> = nome novo",
      en: "or click to upload a spreadsheet: <b>column 1</b> = current name, <b>column 2</b> = new name",
      es: "o haz clic para subir una hoja de cálculo: <b>columna 1</b> = nombre actual, <b>columna 2</b> = nombre nuevo",
    },
    rnApply: { pt: "Renomear pastas", en: "Rename folders", es: "Renombrar carpetas" },
    rnUndo: { pt: "↶ Desfazer última renomeação", en: "↶ Undo last rename", es: "↶ Deshacer último renombrado" },
    rnBatchTitle: { pt: "Ações em lote (gera a lista acima automaticamente)", en: "Batch actions (auto-fills the list above)", es: "Acciones en lote (autocompleta la lista de arriba)" },
    rnBatchHint: {
      pt: 'Aplica em todas as subpastas encontradas de uma vez. Só preenche o campo "De → Para" acima - confira e clique em "Pré-visualizar" antes de renomear de verdade.',
      en: 'Applies to every subfolder found, all at once. Only fills in the "From → To" field above - check it and click "Preview" before renaming for real.',
      es: 'Se aplica a todas las subcarpetas encontradas, de una vez. Solo completa el campo "De → A" de arriba - revísalo y haz clic en "Vista previa" antes de renombrar de verdad.',
    },
    rnBatchPrefix: { pt: "Adicionar prefixo em todas", en: "Add prefix to all", es: "Agregar prefijo a todas" },
    rnBatchPrefixPh: { pt: "ex.: Turma A - ", en: "e.g. Class A - ", es: "ej.: Grupo A - " },
    rnBatchApply: { pt: "Gerar", en: "Generate", es: "Generar" },
    rnBatchFind: { pt: "Trocar texto em todas", en: "Replace text in all", es: "Reemplazar texto en todas" },
    rnBatchFindPh: { pt: "ex.: espaço (deixe em branco pra representar espaço)", en: "e.g. space (leave blank for a space)", es: "ej.: espacio (deja en blanco para representar un espacio)" },
    rnBatchReplace: { pt: "Por", en: "With", es: "Por" },
    rnBatchReplacePh: { pt: "ex.: -", en: "e.g. -", es: "ej.: -" },
    rnBatchUpperBtn: { pt: "Gerar tudo em MAIÚSCULAS", en: "Generate all UPPERCASE", es: "Generar todo en MAYÚSCULAS" },
    rnBatchLowerBtn: { pt: "Gerar tudo em minúsculas", en: "Generate all lowercase", es: "Generar todo en minúsculas" },
    rnSaveMapping: { pt: "Salvar este mapeamento", en: "Save this mapping", es: "Guardar este mapeo" },
    rnLibTitle: { pt: "Meus mapeamentos salvos", en: "My saved mappings", es: "Mis mapeos guardados" },
    exportCsv: { pt: "Exportar CSV", en: "Export CSV", es: "Exportar CSV" },
    btnReiniciar: { pt: "↺ Começar de novo", en: "↺ Start over", es: "↺ Empezar de nuevo" },
    rnColCur: { pt: "Nome atual", en: "Current name", es: "Nombre actual" },
    rnColNew: { pt: "Novo nome", en: "New name", es: "Nombre nuevo" },

    /* runtime */
    r_noName: { pt: "Cole ao menos um nome.", en: "Paste at least one name.", es: "Pega al menos un nombre." },
    r_addFile: { pt: "Adicione ao menos um arquivo.", en: "Add at least one file.", es: "Agrega al menos un archivo." },
    r_pickCol: { pt: "Marque ao menos uma coluna para o nome da pasta.", en: "Check at least one column for the folder name.", es: "Marca al menos una columna para el nombre de la carpeta." },
    r_none: { pt: "Nenhum nome encontrado.", en: "No names found.", es: "No se encontraron nombres." },
    r_noValid: { pt: "Nenhuma pasta válida para criar.", en: "No valid folders to create.", es: "No hay carpetas válidas para crear." },
    r_done: { pt: "Pronto!", en: "Done!", es: "¡Listo!" },
    r_folders: { pt: "pasta(s)", en: "folder(s)", es: "carpeta(s)" },
    r_previewWord: { pt: "Prévia", en: "Preview", es: "Vista previa" },
    r_resultWord: { pt: "Resultado", en: "Result", es: "Resultado" },
    r_linkCopied: { pt: "link copiado ✓", en: "link copied ✓", es: "enlace copiado ✓" },
    r_saved: { pt: "salvo ✓", en: "saved ✓", es: "guardado ✓" },
    r_ocrLoad: { pt: "Baixando o leitor de imagem (uma vez)…", en: "Downloading the image reader (one time)…", es: "Descargando el lector de imágenes (una vez)…" },
    r_ocrRun: { pt: "Lendo o texto da imagem…", en: "Reading text from the image…", es: "Leyendo el texto de la imagen…" },
    r_ocrDone: { pt: "linha(s) lidas da imagem. Revise, a leitura não é 100% exata.", en: "line(s) read from the image. Please review, OCR is not 100% accurate.", es: "línea(s) leídas de la imagen. Revisa, el OCR no es 100% exacto." },
    r_ocrFail: { pt: "Não consegui ler o texto da imagem.", en: "Could not read text from the image.", es: "No pude leer el texto de la imagen." },
    r_ocrPaste: { pt: "Imagem colada, lendo o texto…", en: "Image pasted, reading text…", es: "Imagen pegada, leyendo el texto…" },
    fromOcr: { pt: "(da imagem, revise)", en: "(from image, review)", es: "(de la imagen, revisar)" },
    fromPdf: { pt: "(do PDF, revise)", en: "(from PDF, review)", es: "(del PDF, revisar)" },

    /* runtime - mensagens montadas em JS (usam {n}, {name}, {fn}, {err} etc.) */
    r_reading: { pt: "Lendo…", en: "Reading…", es: "Leyendo…" },
    r_loadExcelFail: { pt: "Não consegui carregar o leitor de Excel. Verifique a conexão.", en: "Couldn't load the Excel reader. Check your connection.", es: "No pude cargar el lector de Excel. Revisa tu conexión." },
    r_loadPdfFail: { pt: "Não consegui carregar o leitor de PDF. Verifique a conexão.", en: "Couldn't load the PDF reader. Check your connection.", es: "No pude cargar el lector de PDF. Revisa tu conexión." },
    r_pdfProtected: { pt: '"{name}" parece protegido por senha ou digitalizado (imagem). Não consegui ler o texto.', en: '"{name}" looks password-protected or scanned (image). I couldn\'t read the text.', es: '"{name}" parece protegido con contraseña o escaneado (imagen). No pude leer el texto.' },
    r_pdfReadFail: { pt: 'Não consegui ler "{name}": {err}', en: 'Couldn\'t read "{name}": {err}', es: 'No pude leer "{name}": {err}' },
    r_xlsxOpenFail: { pt: 'Não consegui abrir "{name}" (arquivo corrompido ou protegido por senha).', en: 'Couldn\'t open "{name}" (corrupt file or password-protected).', es: 'No pude abrir "{name}" (archivo dañado o protegido con contraseña).' },
    r_xlsxEmpty: { pt: '"{name}" parece vazio (nenhuma aba com dados). Verifique se a planilha tem nomes preenchidos.', en: '"{name}" looks empty (no sheet with data). Check that the spreadsheet has names filled in.', es: '"{name}" parece vacío (ninguna hoja con datos). Verifica que la planilla tenga nombres.' },
    r_fmtUnsupported: { pt: 'Formato não suportado: "{name}". Use .txt, .csv, .xlsx ou .pdf.', en: 'Unsupported format: "{name}". Use .txt, .csv, .xlsx or .pdf.', es: 'Formato no admitido: "{name}". Usa .txt, .csv, .xlsx o .pdf.' },
    r_pastedToBox: { pt: "Texto do arquivo colado na caixa. Revise e remova o que não for nome.", en: "The file's text was pasted into the box. Review it and remove anything that isn't a name.", es: "El texto del archivo se pegó en el cuadro. Revísalo y quita lo que no sea un nombre." },
    r_names: { pt: "nome(s)", en: "name(s)", es: "nombre(s)" },
    r_rows: { pt: "linha(s)", en: "row(s)", es: "fila(s)" },
    r_titleRemove: { pt: "Remover", en: "Remove", es: "Quitar" },
    r_titleDelete: { pt: "Excluir", en: "Delete", es: "Eliminar" },
    r_titleReview: { pt: "Revisar o texto na caixa acima", en: "Review the text in the box above", es: "Revisar el texto en el cuadro de arriba" },

    r_generating: { pt: "Gerando…", en: "Generating…", es: "Generando…" },
    r_creating: { pt: "Criando…", en: "Creating…", es: "Creando…" },
    r_pickFolderShort: { pt: "Escolha a pasta…", en: "Choose the folder…", es: "Elige la carpeta…" },
    r_errPrefix: { pt: "Erro: {err}", en: "Error: {err}", es: "Error: {err}" },
    r_bigListConfirm: { pt: "São {n} pastas. {action} pode demorar alguns segundos. Continuar?", en: "That's {n} folders. {action} may take a few seconds. Continue?", es: "Son {n} carpetas. {action} puede tardar unos segundos. ¿Continuar?" },
    r_actGenZip: { pt: "Gerar o .zip", en: "Generating the .zip", es: "Generar el .zip" },
    r_actCreate: { pt: "Criar as pastas", en: "Creating the folders", es: "Crear las carpetas" },
    r_pickerBlocked: { pt: 'O navegador bloqueou a escolha de pasta aqui dentro. Clique em "Abrir em tela cheia" e tente de novo, ou use o botão do .zip.', en: 'The browser blocked folder picking inside here. Click "Open fullscreen" and try again, or use the .zip button.', es: 'El navegador bloqueó la selección de carpeta aquí dentro. Haz clic en "Abrir en pantalla completa" e inténtalo de nuevo, o usa el botón del .zip.' },

    r_chipFolders: { pt: "{n} pasta(s)", en: "{n} folder(s)", es: "{n} carpeta(s)" },
    r_chipAdjusted: { pt: "{n} ajustada(s)", en: "{n} adjusted", es: "{n} ajustada(s)" },
    r_chipDupIgnored: { pt: "{n} repetida(s) ignorada(s)", en: "{n} duplicate(s) ignored", es: "{n} repetida(s) ignorada(s)" },
    r_chipInvalid: { pt: "{n} inválida(s)", en: "{n} invalid", es: "{n} inválida(s)" },
    r_lblOk: { pt: "ok", en: "ok", es: "ok" },
    r_lblAdjusted: { pt: "ajustado", en: "adjusted", es: "ajustado" },
    r_lblDuplicate: { pt: "repetido", en: "duplicate", es: "repetido" },
    r_lblInvalid: { pt: "inválido", en: "invalid", es: "inválido" },

    r_docsGoTo: { pt: "{n} documento(s): <strong>{ok}</strong> vão para as pastas", en: "{n} document(s): <strong>{ok}</strong> go into the folders", es: "{n} documento(s): <strong>{ok}</strong> van a las carpetas" },
    r_docsNoMatch: { pt: " · <strong>{n}</strong> sem correspondência (vão para <code>_sem-correspondencia</code>)", en: " · <strong>{n}</strong> unmatched (go to <code>_sem-correspondencia</code>)", es: " · <strong>{n}</strong> sin coincidencia (van a <code>_sem-correspondencia</code>)" },
    r_docsNoFolder: { pt: "Sem pasta: {list}", en: "No folder: {list}", es: "Sin carpeta: {list}" },

    r_doneZip: { pt: "Pronto! {n} pasta(s){docs} em {fn}.", en: "Done! {n} folder(s){docs} in {fn}.", es: "¡Listo! {n} carpeta(s){docs} en {fn}." },
    r_doneDocsInside: { pt: " · {n} documento(s) dentro", en: " · {n} document(s) inside", es: " · {n} documento(s) dentro" },
    r_donePerGroup: { pt: "Pronto! {g} grupo(s), {n} pasta(s). O .zip tem um arquivo por grupo.", en: "Done! {g} group(s), {n} folder(s). The .zip has one file per group.", es: "¡Listo! {g} grupo(s), {n} carpeta(s). El .zip tiene un archivo por grupo." },
    r_doneDirect: { pt: 'Pronto! {n} pasta(s){docs}{errs} criadas em "{dir}".', en: 'Done! {n} folder(s){docs}{errs} created in "{dir}".', es: '¡Listo! {n} carpeta(s){docs}{errs} creadas en "{dir}".' },
    r_doneDocsN: { pt: " · {n} documento(s)", en: " · {n} document(s)", es: " · {n} documento(s)" },
    r_doneErrsN: { pt: " · {n} com erro", en: " · {n} with errors", es: " · {n} con errores" },
    r_histCreatePlace: { pt: '"{dir}"', en: '"{dir}"', es: '"{dir}"' },

    r_libUnavailable: { pt: "Biblioteca não disponível neste navegador.", en: "Library not available in this browser.", es: "La biblioteca no está disponible en este navegador." },
    r_nothingSaveList: { pt: "Nada para salvar. Cole uma lista primeiro.", en: "Nothing to save. Paste a list first.", es: "Nada para guardar. Pega una lista primero." },
    r_nothingSaveFiles: { pt: "Nada para salvar. Adicione um arquivo primeiro.", en: "Nothing to save. Add a file first.", es: "Nada para guardar. Agrega un archivo primero." },
    r_promptListName: { pt: "Nome desta lista:", en: "Name for this list:", es: "Nombre de esta lista:" },
    r_promptSetName: { pt: "Nome deste conjunto:", en: "Name for this set:", es: "Nombre de este conjunto:" },
    r_defaultListName: { pt: "Lista {date}", en: "List {date}", es: "Lista {date}" },
    r_saveErr: { pt: "Erro ao salvar: {err}", en: "Error saving: {err}", es: "Error al guardar: {err}" },
    r_opened: { pt: 'Aberto: "{name}". Revise e gere as pastas.', en: 'Opened: "{name}". Review and generate the folders.', es: 'Abierto: "{name}". Revisa y genera las carpetas.' },
    r_suffixList: { pt: "(lista)", en: "(list)", es: "(lista)" },
    r_suffixFiles: { pt: "({n} arq.)", en: "({n} files)", es: "({n} arch.)" },
    r_confirmDeleteOne: { pt: 'Excluir "{name}"?', en: 'Delete "{name}"?', es: '¿Eliminar "{name}"?' },
    r_confirmClearLists: { pt: "Apagar todas as listas salvas neste navegador?", en: "Delete all lists saved in this browser?", es: "¿Borrar todas las listas guardadas en este navegador?" },
    r_promptCopyLink: { pt: "Copie o link da configuração:", en: "Copy the settings link:", es: "Copia el enlace de configuración:" },

    /* modo renomear */
    rn_noBrowser: { pt: "Seu navegador não permite mexer em pastas. Abra no Chrome ou Edge, no computador.", en: "Your browser can't modify folders. Open it in Chrome or Edge, on a computer.", es: "Tu navegador no permite modificar carpetas. Ábrelo en Chrome o Edge, en la computadora." },
    rn_pickBlocked: { pt: 'O navegador bloqueou a escolha de pasta. Clique em "Abrir em tela cheia" e tente de novo.', en: 'The browser blocked folder picking. Click "Open fullscreen" and try again.', es: 'El navegador bloqueó la selección de carpeta. Haz clic en "Abrir en pantalla completa" e inténtalo de nuevo.' },
    rn_openErr: { pt: "Erro ao abrir a pasta: {err}", en: "Error opening the folder: {err}", es: "Error al abrir la carpeta: {err}" },
    rn_pickAgain: { pt: "Escolha a pasta…", en: "Choose the folder…", es: "Elige la carpeta…" },
    rn_changeFolder: { pt: "Trocar pasta", en: "Change folder", es: "Cambiar carpeta" },
    rn_searching: { pt: "Procurando… ({n} encontrada(s))", en: "Searching… ({n} found)", es: "Buscando… ({n} encontrada(s))" },
    rn_sheetHint: { pt: "Envie uma planilha .csv ou .xlsx com 2 colunas.", en: "Upload a .csv or .xlsx spreadsheet with 2 columns.", es: "Sube una planilla .csv o .xlsx con 2 columnas." },
    rn_sheetLoaded: { pt: "{n} linha(s) da planilha carregadas.", en: "{n} row(s) loaded from the spreadsheet.", es: "{n} fila(s) cargadas de la planilla." },
    rn_needFolderFirst: { pt: "Escolha a pasta primeiro.", en: "Choose the folder first.", es: "Elige la carpeta primero." },
    rn_noSubfolders: { pt: 'A pasta "{name}" não tem nenhuma subpasta dentro pra renomear. Pra renomear ela mesma, escolha a pasta um nível acima dela.', en: 'The folder "{name}" has no subfolders inside to rename. To rename it, pick the folder one level above.', es: 'La carpeta "{name}" no tiene subcarpetas dentro para renombrar. Para renombrarla, elige la carpeta un nivel más arriba.' },
    rn_noRule: { pt: "Nenhuma regra de renomeação. Cole as linhas ou envie a planilha.", en: "No rename rules. Paste the lines or upload the spreadsheet.", es: "No hay reglas de renombrado. Pega las líneas o sube la planilla." },
    rn_batchNeedPrefix: { pt: "Digite o prefixo primeiro.", en: "Type the prefix first.", es: "Escribe el prefijo primero." },
    rn_batchNoChange: { pt: "Nenhuma pasta mudaria de nome com essa ação.", en: "No folder would change name with this action.", es: "Ninguna carpeta cambiaría de nombre con esta acción." },
    rn_batchGenerated: { pt: '{n} linha(s) geradas no campo "De → Para" abaixo. Confira e clique em "Pré-visualizar".', en: '{n} line(s) generated in the "From → To" field below. Check them and click "Preview".', es: '{n} línea(s) generadas en el campo "De → A" abajo. Revísalas y haz clic en "Vista previa".' },
    rn_mappingLoaded: { pt: 'Mapeamento "{name}" carregado no campo "De → Para".', en: 'Mapping "{name}" loaded into the "From → To" field.', es: 'Mapeo "{name}" cargado en el campo "De → A".' },
    rn_nothingSaveMapping: { pt: 'Nada pra salvar. Preencha o campo "De → Para" primeiro.', en: 'Nothing to save. Fill the "From → To" field first.', es: 'Nada para guardar. Completa el campo "De → A" primero.' },
    rn_promptMappingName: { pt: "Nome deste mapeamento:", en: "Name for this mapping:", es: "Nombre de este mapeo:" },
    rn_defaultMappingName: { pt: "Mapeamento {date}", en: "Mapping {date}", es: "Mapeo {date}" },
    rn_confirmClearMappings: { pt: "Apagar todos os mapeamentos salvos neste navegador?", en: "Delete all mappings saved in this browser?", es: "¿Borrar todos los mapeos guardados en este navegador?" },
    rn_nothingToRename: { pt: "Nada para renomear.", en: "Nothing to rename.", es: "Nada para renombrar." },
    rn_confirmApply: { pt: 'Renomear {n} pasta(s) dentro de "{dir}"? Isso mexe nos arquivos de verdade.', en: 'Rename {n} folder(s) inside "{dir}"? This changes the real files.', es: '¿Renombrar {n} carpeta(s) dentro de "{dir}"? Esto modifica los archivos de verdad.' },
    rn_renaming: { pt: "Renomeando…", en: "Renaming…", es: "Renombrando…" },
    rn_doneRename: { pt: "Pronto! {n} pasta(s) renomeada(s){errs}.", en: "Done! {n} folder(s) renamed{errs}.", es: "¡Listo! {n} carpeta(s) renombrada(s){errs}." },
    rn_infoCount: { pt: "<strong>{name}</strong>: {n} subpasta(s).", en: "<strong>{name}</strong>: {n} subfolder(s).", es: "<strong>{name}</strong>: {n} subcarpeta(s)." },
    rn_confirmUndo: { pt: "Desfazer a última renomeação ({n} pasta(s))? Os nomes voltam ao que eram antes.", en: "Undo the last rename ({n} folder(s))? Names go back to what they were.", es: "¿Deshacer el último renombrado ({n} carpeta(s))? Los nombres vuelven a como estaban." },
    rn_doneUndo: { pt: "Desfeito! {n} pasta(s) voltaram ao nome original{errs}.", en: "Undone! {n} folder(s) back to their original name{errs}.", es: "¡Deshecho! {n} carpeta(s) volvieron a su nombre original{errs}." },
    rn_errsN: { pt: " · {n} com erro", en: " · {n} with errors", es: " · {n} con errores" },
    rn_lblRename: { pt: "renomear", en: "rename", es: "renombrar" },
    rn_lblJaOk: { pt: "já ok", en: "already ok", es: "ya ok" },
    rn_lblNoFolder: { pt: "pasta não existe", en: "folder doesn't exist", es: "la carpeta no existe" },
    rn_lblConflict: { pt: "conflito de nome", en: "name conflict", es: "conflicto de nombre" },
    rn_lblInvalid: { pt: "nome inválido", en: "invalid name", es: "nombre inválido" },
    rn_lblAmbiguous: { pt: "nome em mais de 1 pasta", en: "name in more than 1 folder", es: "nombre en más de 1 carpeta" },
    rn_chipToRename: { pt: "{n} a renomear", en: "{n} to rename", es: "{n} a renombrar" },
    rn_chipJaOk: { pt: "{n} já ok", en: "{n} already ok", es: "{n} ya ok" },
    rn_chipNoFolder: { pt: "{n} sem pasta", en: "{n} no folder", es: "{n} sin carpeta" },
    rn_chipConflict: { pt: "{n} conflito(s)", en: "{n} conflict(s)", es: "{n} conflicto(s)" },
    rn_chipAmbiguous: { pt: "{n} ambíguo(s)", en: "{n} ambiguous", es: "{n} ambiguo(s)" },
    rn_saved: { pt: "salvo ✓", en: "saved ✓", es: "guardado ✓" },
    rn_in: { pt: "em", en: "in", es: "en" },
    r_moveBefore: { pt: "Mover antes", en: "Move earlier", es: "Mover antes" },
    r_moveAfter: { pt: "Mover depois", en: "Move later", es: "Mover después" },
    hist_groups: { pt: "{n} grupo(s)", en: "{n} group(s)", es: "{n} grupo(s)" },
    hist_in: { pt: ' em "{name}"', en: ' in "{name}"', es: ' en "{name}"' },
    rn_info1: { pt: '<strong>{name}</strong>: 1 subpasta encontrada ("{sub}"). Como só tem essa, pode digitar só o nome novo direto no campo abaixo, sem precisar do "nome atual =>".', en: '<strong>{name}</strong>: 1 subfolder found ("{sub}"). Since it\'s the only one, you can type just the new name in the field below, without the "current name =>".', es: '<strong>{name}</strong>: 1 subcarpeta encontrada ("{sub}"). Como es la única, puedes escribir solo el nombre nuevo en el campo de abajo, sin el "nombre actual =>".' },
    rn_infoN: { pt: "<strong>{name}</strong>: {n} subpasta(s) encontrada(s) (inclui as de dentro de subpastas). Pra renomear essa pasta principal em si, escolha a pasta um nível acima dela.", en: "<strong>{name}</strong>: {n} subfolder(s) found (including those inside subfolders). To rename this main folder itself, pick the folder one level above it.", es: "<strong>{name}</strong>: {n} subcarpeta(s) encontrada(s) (incluye las que están dentro de subcarpetas). Para renombrar esta carpeta principal, elige la carpeta un nivel más arriba." },
    rn_info0: { pt: '<strong>"{name}"</strong> não tem nenhuma subpasta dentro. Se você quer renomear essa pasta em si (não o que tem dentro dela), clique em "Trocar pasta" de novo e escolha a pasta <u>de cima</u>, que contém "{name}" - assim ela vai aparecer na lista pra renomear.', en: '<strong>"{name}"</strong> has no subfolders inside. If you want to rename this folder itself (not its contents), click "Change folder" again and pick the folder <u>above</u>, which contains "{name}" - then it will show up in the list to rename.', es: '<strong>"{name}"</strong> no tiene subcarpetas dentro. Si quieres renombrar esta carpeta (no su contenido), haz clic en "Cambiar carpeta" de nuevo y elige la carpeta <u>de arriba</u>, que contiene "{name}" - así aparecerá en la lista para renombrar.' },
    rn_say0: { pt: 'A pasta escolhida não tem subpastas. Pra renomear ela mesma, escolha a pasta de cima (o navegador não deixa acessar o "pai" da pasta escolhida diretamente).', en: 'The chosen folder has no subfolders. To rename it, pick the folder above (the browser doesn\'t allow accessing the "parent" of the chosen folder directly).', es: 'La carpeta elegida no tiene subcarpetas. Para renombrarla, elige la carpeta de arriba (el navegador no permite acceder al "padre" de la carpeta elegida directamente).' },
    rn_csvCsvName: { pt: "pastafacil-renomeacao-previa.csv", en: "pastafacil-rename-preview.csv", es: "pastafacil-renombrado-vista-previa.csv" },
    r_csvName: { pt: "pastafacil-previa.csv", en: "pastafacil-preview.csv", es: "pastafacil-vista-previa.csv" },
  };

  var LANGS = ["pt", "en", "es"];
  var lang = "pt";

  function resolveLang() {
    try {
      var stored = localStorage.getItem("pf-lang");
      if (LANGS.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    var hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    var q = hash.get("lang") || new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(q) !== -1) return q;
    var nav = (navigator.language || "pt").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : "pt";
  }

  function t(key) {
    var e = DICT[key];
    return e ? (e[lang] || e.pt) : key;
  }

  function apply(l) {
    lang = LANGS.indexOf(l) !== -1 ? l : "pt";
    try { localStorage.setItem("pf-lang", lang); } catch (e) {}
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      // Se a chave nao existe no dicionario (ex.: HTML novo com i18n.js
      // antigo, ainda em cache), NAO troca o conteudo - mantem o texto em
      // portugues que ja vem escrito no proprio HTML, em vez de mostrar o
      // nome tecnico da chave pra quem esta usando.
      if (!DICT[key]) return;
      var v = t(key);
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = v; else el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (!DICT[key]) return;
      el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (!DICT[key]) return;
      el.setAttribute("aria-label", t(key));
    });
    document.querySelectorAll(".langswitch button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.lang === lang);
    });
    global.dispatchEvent(new CustomEvent("pf-lang", { detail: lang }));
  }

  global.PastaFacilI18n = {
    t: t, apply: apply, get lang() { return lang; }, langs: LANGS,
    init: function () { apply(resolveLang()); },
  };
})(window);
