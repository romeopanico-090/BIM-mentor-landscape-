import React, { useState, useRef, useEffect } from "react";

// ── Translations ──────────────────────────────────────────────
const T = {
  it: {
    appSubtitle: "Revit per il Landscape",
    progress: "Progresso",
    tabChat: "💬 Tutor AI",
    tabSteps: "📋 Guida Passo-Passo",
    objective: "Obiettivo",
    steps: "Steps",
    askAI: "Chiedi all'AI →",
    officialDocs: "Documentazione ufficiale Autodesk",
    startLesson: "Inizia lezione",
    viewGuide: "📋 Vedi guida",
    diagram: "📊 Diagramma visivo",
    inputPlaceholder: "Fai una domanda o descrivi cosa hai fatto in Revit...",
    inputHint: "📎 Screenshot Revit per feedback visivo · Enter per inviare",
    send: "Invia",
    prev: "← Prec",
    next: "Pros →",
    screenshotLabel: "📎 Screenshot allegato",
    docsBtn: "📖 Docs",
    videoBtn: "🎥 Video",
    lessonOf: (n, tot) => `Lezione ${n} di ${tot}`,
    sectionBase: "FONDAMENTA REVIT",
    sectionLandscape: "LANDSCAPE",
    welcomeTitle: "Benvenuto in BIMentor Landscape",
    welcomeSubtitle: "Il tuo tutor AI per il BIM nel paesaggio",
    welcomeIntro: "Questo percorso ti porta da zero alla modellazione Landscape professionale in Revit. Prima le fondamenta, poi le tecniche specialistiche per paving, grading, drainage e topografia.",
    welcomeTip: "Consiglio:",
    welcomeTipText: "in Revit non esistono tool nativi per il Landscape — imparerai a piegare i tool architettonici (Floor, Wall, Sweep) all'uso paesaggistico. Tieni Revit aperto e prova subito ogni tecnica.",
    welcomeStart: "Iniziamo 🌿",
    welcomeFeatures: [
      { icon: "🌿", title: "Percorso Landscape", desc: "13 lezioni di fondamenta Revit + 16 lezioni specialistiche Landscape: paving, grading, drainage, toposurface, net/cut/fill." },
      { icon: "💬", title: "Tutor AI", desc: "Clicca \"Inizia lezione\" e l'AI ti guida. Fai domande quando sei bloccato — conosce il contesto di ogni lezione." },
      { icon: "📋", title: "Guida Passo-Passo", desc: "Step pratici con diagrammi per ogni tecnica. Clicca \"Chiedi all'AI\" su ogni step per approfondire." },
      { icon: "📎", title: "Screenshot", desc: "Carica uno screenshot di Revit e l'AI ti dirà cosa hai fatto bene e cosa correggere." },
    ],
    startPrompt: "Inizia la lezione",
    askStepPrompt: (icon, label) => `Spiegami nel dettaglio: "${icon} ${label}"`,
    askStepDisplay: (icon, label) => `Spiegami: ${icon} ${label}`,
  },
  en: {
    appSubtitle: "Revit for Landscape",
    progress: "Progress",
    tabChat: "💬 AI Tutor",
    tabSteps: "📋 Step-by-Step Guide",
    objective: "Objective",
    steps: "Steps",
    askAI: "Ask AI →",
    officialDocs: "Official Autodesk Documentation",
    startLesson: "Start lesson",
    viewGuide: "📋 View guide",
    diagram: "📊 Visual diagram",
    inputPlaceholder: "Ask a question or describe what you did in Revit...",
    inputHint: "📎 Revit screenshot for visual feedback · Enter to send",
    send: "Send",
    prev: "← Prev",
    next: "Next →",
    screenshotLabel: "📎 Screenshot attached",
    docsBtn: "📖 Docs",
    videoBtn: "🎥 Video",
    lessonOf: (n, tot) => `Lesson ${n} of ${tot}`,
    sectionBase: "REVIT FOUNDATIONS",
    sectionLandscape: "LANDSCAPE",
    welcomeTitle: "Welcome to BIMentor Landscape",
    welcomeSubtitle: "Your AI tutor for Landscape BIM",
    welcomeIntro: "This path takes you from zero to professional Landscape modelling in Revit. Foundations first, then the specialist techniques for paving, grading, drainage and topography.",
    welcomeTip: "Tip:",
    welcomeTipText: "Revit has no native Landscape tools — you'll learn to bend the architectural tools (Floor, Wall, Sweep) to landscape use. Keep Revit open and try every technique immediately.",
    welcomeStart: "Let's start 🌿",
    welcomeFeatures: [
      { icon: "🌿", title: "Landscape Path", desc: "13 Revit foundation lessons + 16 specialist Landscape lessons: paving, grading, drainage, toposurface, net/cut/fill." },
      { icon: "💬", title: "AI Tutor", desc: "Click \"Start lesson\" and the AI guides you. Ask questions when stuck — it knows the context of every lesson." },
      { icon: "📋", title: "Step-by-Step Guide", desc: "Practical steps with diagrams for every technique. Click \"Ask AI\" on any step to go deeper." },
      { icon: "📎", title: "Screenshot", desc: "Upload a Revit screenshot and the AI will tell you what you did right and what to fix." },
    ],
    startPrompt: "Start the lesson",
    askStepPrompt: (icon, label) => `Explain in detail: "${icon} ${label}"`,
    askStepDisplay: (icon, label) => `Explain: ${icon} ${label}`,
  }
};

const DOCS = "https://help.autodesk.com/view/RVT/2025/ENU/?query=";

// ── Curriculum IT ─────────────────────────────────────────────
const CURRICULUM = [
  { id: 1, section: "base", title: "User Interface", topics: ["Ribbon", "Properties panel", "Project Browser", "Plan Views", "Navigazione 3D"], objective: "Orientarsi in Revit e capire dove si trovano i controlli principali.", docsUrl: DOCS+"user%20interface", videoQuery: "Revit user interface tutorial beginner", diagram: "ui", steps: [
    { icon: "🖥️", label: "Apri Revit", desc: "Avvia Revit con un nuovo progetto, template Architectural." },
    { icon: "📌", label: "Esplora il Ribbon", desc: "Clicca su Architecture, Massing & Site, Annotate, View e osserva i pannelli. Massing & Site sarà la tua scheda chiave per la topografia." },
    { icon: "📋", label: "Properties Panel", desc: "A sinistra in alto: proprietà dell'elemento selezionato o della vista corrente. Abituati a guardarlo sempre." },
    { icon: "🗂️", label: "Project Browser", desc: "A sinistra in basso: tutte le viste, sheets, famiglie del progetto." },
    { icon: "🔍", label: "Area di disegno", desc: "Rotella per zoom, tasto centrale premuto per pan, Shift+centrale per orbit 3D." },
  ]},
  { id: 2, section: "base", title: "Concetti BIM", topics: ["BIM vs CAD", "Livelli", "Griglie", "Il dato nel modello"], objective: "Capire la logica BIM: ogni elemento contiene informazioni reali.", docsUrl: DOCS+"levels%20grids", videoQuery: "Revit levels grids BIM basics", diagram: null, steps: [
    { icon: "💡", label: "BIM vs CAD", desc: "In CAD disegni linee. In Revit ogni elemento ha dati: materiale, costo, volume. Nel Landscape questo significa quantità di scavo, aree di pavimentazione, conteggi piante." },
    { icon: "📏", label: "Levels", desc: "Architecture → Datum → Level. Nel Landscape i livelli definiscono le quote di riferimento del sito." },
    { icon: "⊞", label: "Grids", desc: "Architecture → Datum → Grid. Assi di riferimento, utili nei progetti landscape di grande scala." },
  ]},
  { id: 3, section: "base", title: "Wall", topics: ["System families", "Compound walls", "Edit structure"], objective: "Creare e modificare muri — base per retaining walls e planter walls.", docsUrl: DOCS+"walls", videoQuery: "Revit wall tool tutorial", diagram: null, steps: [
    { icon: "🧱", label: "Wall Tool", desc: "Architecture → Build → Wall: Architectural." },
    { icon: "📐", label: "Scegli il tipo", desc: "Properties panel → tipo di muro. Duplica sempre prima di modificare." },
    { icon: "✏️", label: "Disegna", desc: "Due click nell'area di disegno. ESC per uscire." },
    { icon: "⚙️", label: "Edit Structure", desc: "Edit Type → Edit Structure: aggiungi strati e materiali. Stesso processo che userai per i muri di contenimento." },
  ]},
  { id: 4, section: "base", title: "Floor", topics: ["Compound floors", "Sketch mode", "Boundary"], objective: "Il Floor è IL tool del Landscape: diventerà paving, grading, rampe.", docsUrl: DOCS+"floors", videoQuery: "Revit floor tool tutorial", diagram: "floor", steps: [
    { icon: "⬛", label: "Floor Tool", desc: "Architecture → Build → Floor: Architectural. Entri in Sketch Mode." },
    { icon: "✏️", label: "Sketch Boundary", desc: "Disegna un perimetro chiuso con Boundary Line." },
    { icon: "✅", label: "Finish", desc: "Spunta verde per completare. Boundary aperta = errore." },
    { icon: "📐", label: "Edit Structure", desc: "Edit Type → Edit Structure: strati del pavimento. Nel Landscape qui definirai sub-base, allettamento e finitura della pavimentazione." },
  ]},
  { id: 5, section: "base", title: "Component & Column", topics: ["Loadable components", "Site components", "Load Family"], objective: "Inserire componenti — arredi urbani, alberi, attrezzature.", docsUrl: DOCS+"components", videoQuery: "Revit component placement tutorial", diagram: null, steps: [
    { icon: "🪑", label: "Component Tool", desc: "Architecture → Build → Component. Nel Landscape: panchine, cestini, alberi, lampioni." },
    { icon: "📦", label: "Load Family", desc: "Insert → Load Family per caricare famiglie dalle librerie. Massing & Site → Site Component per gli elementi di sito." },
  ]},
  { id: 6, section: "base", title: "Materiali", topics: ["Material browser", "Surface pattern", "Cut pattern"], objective: "Creare materiali — fondamentale per pavimentazioni e finiture esterne.", docsUrl: DOCS+"materials", videoQuery: "Revit materials tutorial", diagram: null, steps: [
    { icon: "🎨", label: "Material Browser", desc: "Manage → Materials. Qui creerai i materiali di paving, ghiaia, prato, asfalto." },
    { icon: "➕", label: "Crea materiale", desc: "Clicca + → rinomina (es. 'Paving_Granito_600x600')." },
    { icon: "🖼️", label: "Surface Pattern", desc: "Tab Graphics → Surface Pattern: come appare in pianta. Per il paving è il pattern delle lastre." },
    { icon: "✂️", label: "Cut Pattern", desc: "Tab Graphics → Cut Pattern: il retino quando l'elemento è sezionato." },
  ]},
  { id: 7, section: "base", title: "Famiglie — Parte 1", topics: ["System vs Loadable vs In-place", "Logica parametrica"], objective: "Capire le famiglie — nel Landscape userai molto le in-place e i profili.", docsUrl: DOCS+"families", videoQuery: "Revit families explained system loadable", diagram: null, steps: [
    { icon: "📦", label: "Cosa sono", desc: "Ogni elemento è una Famiglia. Floor e Wall sono system; alberi e arredi sono loadable; il drainage custom sarà in-place." },
    { icon: "🧱", label: "System Families", desc: "Muri, pavimenti, toposurface. Esistono solo nel progetto." },
    { icon: "📂", label: "Loadable Families", desc: "File .rfa: alberi, arredi, profili. Le carichi da libreria." },
    { icon: "✏️", label: "In-place Families", desc: "Geometrie uniche nel progetto. Nel Landscape: drainage che segue le pendenze, elementi custom." },
  ]},
  { id: 8, section: "base", title: "Famiglie — Parte 2", topics: ["Tipo vs Istanza", "Parametri"], objective: "Distinguere parametri di tipo e di istanza.", docsUrl: DOCS+"type%20instance%20properties", videoQuery: "Revit type instance parameters", diagram: null, steps: [
    { icon: "📋", label: "Type vs Instance", desc: "TYPE cambia tutte le copie (es. spessore paving). INSTANCE cambia solo l'elemento selezionato (es. quota di un singolo floor)." },
    { icon: "⚙️", label: "Edit Type", desc: "Properties → Edit Type. Duplica SEMPRE prima di modificare — regola d'oro." },
  ]},
  { id: 9, section: "base", title: "Famiglie — Parte 3", topics: ["Family Editor", "Reference planes", "Extrusion"], objective: "Creare una famiglia da zero — preparazione per i profili Landscape.", docsUrl: DOCS+"family%20editor", videoQuery: "Revit family editor create family", diagram: null, steps: [
    { icon: "📁", label: "Family Editor", desc: "File → New → Family → scegli template (es. Generic Model.rft)." },
    { icon: "✚", label: "Reference Planes", desc: "Create → Datum → Reference Plane: lo scheletro della geometria." },
    { icon: "📦", label: "Extrusion", desc: "Create → Forms → Extrusion: profilo 2D + profondità = solido." },
    { icon: "💾", label: "Load into Project", desc: "Create → Load into Project." },
  ]},
  { id: 10, section: "base", title: "Stairs & Railing", topics: ["Stair by component", "Run", "Railing host"], objective: "Scale e ringhiere — elementi ricorrenti nel paesaggio.", docsUrl: DOCS+"stairs%20railings", videoQuery: "Revit stairs railing tutorial", diagram: null, steps: [
    { icon: "🪜", label: "Stair Tool", desc: "Architecture → Circulation → Stair. Run per le rampe, landing automatici. Due opzioni: sketch da zero o tipo standard esistente." },
    { icon: "🔧", label: "Railing", desc: "Architecture → Circulation → Railing. Su host (scale) o su sketch path libero." },
  ]},
  { id: 11, section: "base", title: "Visibility & Graphics", topics: ["VG overrides (VV)", "Filtri", "View templates"], objective: "Controllare la grafica — essenziale per i piani landscape complessi.", docsUrl: DOCS+"visibility%20graphics", videoQuery: "Revit visibility graphics overrides", diagram: null, steps: [
    { icon: "👁️", label: "Apri VG", desc: "Shortcut VV. Override per categoria, visibilità worksets." },
    { icon: "🔍", label: "Filtri", desc: "Regole su parametri — es. colora di verde tutto il Soft Landscape." },
    { icon: "📋", label: "View Template", desc: "Salva impostazioni per riusarle: General Arrangement, Grading Plan, Planting Plan." },
  ]},
  { id: 12, section: "base", title: "Viste e Sezioni", topics: ["Floor plans", "Sezioni", "3D views", "Duplicate"], objective: "Creare le viste per la documentazione landscape.", docsUrl: DOCS+"views%20sections", videoQuery: "Revit views sections tutorial", diagram: null, steps: [
    { icon: "📐", label: "Floor Plan", desc: "View → Plan Views → Floor Plan. Nel landscape: GA, Grading, Hard/Soft Landscape per livello." },
    { icon: "✂️", label: "Section", desc: "View → Section. Site-wide e di dettaglio." },
    { icon: "📦", label: "Vista 3D", desc: "Default 3D View. Usa 2 viste affiancate (pianta+3D) quando lavori sul terreno." },
  ]},
  { id: 13, section: "base", title: "Sheets", topics: ["Titleblock", "Viewport", "Output"], objective: "Comporre le tavole di progetto.", docsUrl: DOCS+"sheets%20titleblock", videoQuery: "Revit sheets titleblock tutorial", diagram: null, steps: [
    { icon: "📄", label: "Nuovo Sheet", desc: "View → Sheet. Trascina le viste dal Project Browser." },
    { icon: "📋", label: "Titleblock", desc: "Doppio clic per compilare numero, titolo, revisione." },
  ]},
  { id: 14, section: "landscape", title: "BIM for Landscape", topics: ["Vantaggi e sfide", "Nessun tool nativo", "EIR e scala progetto"], objective: "Capire il contesto: in Revit il Landscape si fa piegando i tool architettonici.", docsUrl: DOCS+"site%20design", videoQuery: "Revit landscape architecture BIM site design", diagram: null, steps: [
    { icon: "💡", label: "Il principio chiave", desc: "Revit NON ha tool nativi per il Landscape. Userai Floor per il paving, Wall per i muri di contenimento, Sweep per drainage e cordoli. Questa è la mentalità da adottare." },
    { icon: "✅", label: "Vantaggi", desc: "Collaborazione integrata, schedule e budget aggiornati automaticamente al cambiare del design, quantità reali (scavi, riporti, aree), analisi rapida di scenari, approccio lean con meno sprechi." },
    { icon: "⚠️", label: "Sfide", desc: "Toposurface a triangoli (non contorni), nessuna interazione topo-paving, molti consulenti ancora in 2D, interoperabilità software, frustrazione iniziale degli utenti — si supera con buona strategia di modellazione e training." },
    { icon: "📋", label: "Cosa determina il modello", desc: "Scala, uso, location, design e fase del progetto — ma soprattutto ciò che è contrattualmente concordato col cliente e scritto nell'EIR." },
  ]},
  { id: 15, section: "landscape", title: "Worksets & Collaborazione", topics: ["Central model", "Naming standard", "Divisione tipica"], objective: "Impostare la collaborazione multi-utente con worksets ben organizzati.", docsUrl: DOCS+"worksets", videoQuery: "Revit worksets worksharing tutorial", diagram: null, steps: [
    { icon: "🤝", label: "Central model", desc: "Dal primo giorno lavorerai in un modello centrale condiviso, accessibile da più utenti contemporaneamente. I worksets sono la chiave della collaborazione." },
    { icon: "🏷️", label: "Naming convention", desc: "Field 1: Zona (opzionale — progetti grandi divisi orizzontalmente o verticalmente). Field 2: Contenuto. Naming coerente e logico, secondo standard aziendali e ISO." },
    { icon: "📂", label: "Worksets Site", desc: "S-01_Components, S-02_Existing_Topography, S-03_Proposed_Topography, S-04_Existing_Planting, S-05_Entourage, S-06_Masses." },
    { icon: "🧱", label: "Worksets Hard Landscape", desc: "HL-01_Paving, HL-02_Stairs_Ramps_Railings, HL-03_Walls_Fences, HL-04_Furniture." },
    { icon: "🌳", label: "Worksets Soft Landscape", desc: "SL-01_Trees, SL-02_Planting, SL-03_Shrubs. Questa divisione è importante nelle fasi successive per sheets e visualizzazioni." },
  ]},
  { id: 16, section: "landscape", title: "Viste per il Landscape", topics: ["General Arrangement", "Grading Plan", "Hard/Soft Landscape"], objective: "Creare il set di viste base di un progetto landscape.", docsUrl: DOCS+"view%20templates", videoQuery: "Revit view templates site plan", diagram: null, steps: [
    { icon: "📐", label: "Floorplans per livello", desc: "General Arrangement, Grading and Levels, Hard Landscape and Furniture, Soft Landscape." },
    { icon: "📦", label: "Viste 3D", desc: "Site View, Tree and Planting views, Hardscape, Softscape." },
    { icon: "⬆️", label: "Prospetti e Sezioni", desc: "Site-wide elevations/sections + detail elevations/sections." },
    { icon: "📋", label: "View Templates", desc: "Crea un view template per ogni tipo di vista così le impostazioni grafiche sono coerenti su tutto il progetto." },
  ]},
  { id: 17, section: "landscape", title: "Paving — Floor Tool", topics: ["Floor come pavimentazione", "Duplicare tipi", "Strati"], objective: "Creare pavimentazioni esterne usando il Floor tool.", docsUrl: DOCS+"floors", videoQuery: "Revit floor paving landscape tutorial", diagram: "paving", steps: [
    { icon: "🧱", label: "Il concetto", desc: "Il paving è l'elemento hard landscape più comune. Si modella con il Floor tool: fa da host per famiglie, top face alla quota del livello, shape editabile, si raccorda ai floor architettonici." },
    { icon: "📋", label: "Nuovo tipo paving", desc: "Duplica un floor esistente → rinomina (es. Paving_Granito_60mm) → Edit Structure → cambia le proprietà." },
    { icon: "📚", label: "Aggiungi strati", desc: "Aggiungi tutti i layer necessari a descrivere il materiale: sub-base, allettamento, finitura. Ogni strato con il suo materiale e spessore." },
    { icon: "🌱", label: "Anche suolo e prato", desc: "Stesso metodo per terreno e prato: floor con strati come per un pavimento architettonico — l'unica differenza sono gli hatch appropriati." },
  ]},
  { id: 18, section: "landscape", title: "Filled Patterns 2D", topics: ["Model vs Drafting", "Surface pattern", "Filled regions"], objective: "Rappresentare correttamente il paving nelle piante 2D.", docsUrl: DOCS+"fill%20patterns", videoQuery: "Revit fill patterns model drafting", diagram: null, steps: [
    { icon: "🔲", label: "Due tipi di pattern", desc: "Gli 'hatch' in Revit sono Filled Patterns (file PAT). MODEL: dimensione reale fissa, si adatta alla scala — perfetto per lastre, blocchi, tiles ma illeggibile a scale grandi. DRAFTING: dimensione costante a ogni scala — sempre leggibile ma non a misura reale." },
    { icon: "🎨", label: "Applicali nel materiale", desc: "Floor editor → colonna Material → Material Editor → duplica o crea il materiale → definisci Surface pattern e Cut pattern." },
    { icon: "📐", label: "Oppure Filled Region", desc: "Come material property il pattern è un elemento di modello; come filled region è specifico della vista. Nessuna soluzione giusta o sbagliata — dipende dal progetto, puoi anche combinarli per il tuo Hard Landscape Plan." },
  ]},
  { id: 19, section: "landscape", title: "Grading & Levels", topics: ["Modify sub-elements", "Add point", "Split lines", "Pendenze"], objective: "Dare pendenze e quote al paving — nel Landscape niente è piatto.", docsUrl: DOCS+"modify%20sub%20elements%20floor", videoQuery: "Revit floor grading modify sub elements slope", diagram: "grading", steps: [
    { icon: "💡", label: "Perché serve", desc: "A differenza dell'architettura, il paving esterno è raramente piatto: servono falde e pendenze per il drenaggio e per raccordarsi alle quote esistenti. Seleziona il floor → nel ribbon appaiono i tool di shape editing." },
    { icon: "🟩", label: "Dividi in pattern regolari", desc: "Dividi il paving in moduli regolari (es. quadrati) per controllare facilmente i cambi di quota ed evitare il warning: 'Thickness of this Floor may be slightly inaccurate due to extreme Shape Editing'." },
    { icon: "✏️", label: "Edit Boundary", desc: "Modifica la forma del floor. ATTENZIONE: se cancelli/aggiungi segmenti su un floor già shaped, le quote tornano a 0. Sposta le linee senza cancellarle. Usa le dynamic dimensions cliccando sul valore." },
    { icon: "📍", label: "Modify Sub-elements", desc: "Cambia la quota relativa di punti, segmenti e split lines. Numeri negativi = verso il basso. Così crei falde e pendenze." },
    { icon: "➕", label: "Add Point", desc: "Aggiungi punti dentro la boundary. In questa modalità Revit non snappa agli elementi modello, solo a detail/model lines: traccia prima detail lines come guida." },
    { icon: "📏", label: "Add Split Lines", desc: "Crea creste e valli. Genera automaticamente punto iniziale e finale a cui dare le quote. Anche qui le detail lines aiutano a posizionare con precisione." },
    { icon: "🔄", label: "Reset Shape", desc: "Riporta il floor piatto rimuovendo tutte le modifiche." },
  ]},
  { id: 20, section: "landscape", title: "Drainage", topics: ["Famiglie floor-based", "Model in-place", "Sweep su path"], objective: "Modellare canalette e sistemi di drenaggio che seguono le pendenze.", docsUrl: DOCS+"sweep", videoQuery: "Revit landscape drainage sweep model in place", diagram: "drainage", steps: [
    { icon: "💡", label: "Il problema", desc: "Non esiste un tool drainage in Revit. Griglie e caditoie = famiglie floor-based (seguono la pendenza). Canalette continue lungo le pendenze = model in-place con sweep." },
    { icon: "📦", label: "Via 1 — Famiglia floor-based", desc: "Carica famiglie dal tab Systems o dalle librerie: applicate al floor ne seguono la pendenza. REGOLA: devono essere floor-based, altrimenti NON seguiranno la pendenza." },
    { icon: "✏️", label: "Via 2 — Model In-Place", desc: "Architecture → Component → Model In-Place. Scegli una categoria appropriata per le schedules future: Specialty Equipment o Plumbing Fixture. Nomina il componente descrivendo elemento e dimensione." },
    { icon: "🛤️", label: "Sweep + Pick Path", desc: "Usa Sweep (estrude un profilo su un percorso) → Pick Path → apri una vista 3D e seleziona il bordo del floor in pendenza. Apparirà un piano tratteggiato dove definire il profilo." },
    { icon: "📐", label: "Profilo", desc: "Due opzioni: sketcha il profilo direttamente, oppure seleziona un Metric Profile caricato. Usa la barra con assi x/y per posizionarlo, una sezione per le distanze esatte, poi spunta verde." },
    { icon: "🔄", label: "Aggiornamento automatico", desc: "Se il floor cambia quota o pendenza: seleziona l'elemento → l'elemento si aggiorna in accordo col floor senza ridisegnare path o profilo. Poi chiudi l'editor in-place." },
  ]},
  { id: 21, section: "landscape", title: "Creare un Profile", topics: ["Metric Profile family", "Profilo chiuso", "Load"], objective: "Creare profili custom per drainage, kerbs e copping stones.", docsUrl: DOCS+"profile%20family", videoQuery: "Revit profile family tutorial", diagram: null, steps: [
    { icon: "📁", label: "Nuova famiglia", desc: "File → New → Family → seleziona il template Metric Profile." },
    { icon: "✏️", label: "Disegna il profilo", desc: "Nel template 2D disegna con semplici linee. REGOLA: il profilo deve essere CHIUSO." },
    { icon: "💾", label: "Salva e carica", desc: "Salva nella cartella profili del progetto → Load into Project. Ora è selezionabile quando usi Sweep, Slab Edge e Wall Sweep." },
  ]},
  { id: 22, section: "landscape", title: "Kerbs (Cordoli)", topics: ["Sloped vs flat", "Slab Edge tool"], objective: "Creare cordoli in pendenza e piani.", docsUrl: DOCS+"slab%20edge", videoQuery: "Revit slab edge kerb curb", diagram: null, steps: [
    { icon: "🔀", label: "Due strade", desc: "Cordolo IN PENDENZA → stesso processo del drainage (sweep model in-place su path). Cordolo PIANO → Slab Edge tool, più rapido." },
    { icon: "📋", label: "Slab Edge", desc: "Duplica la famiglia → rinomina in modo descrittivo → seleziona il profilo dalla lista → applica il materiale con surface e cut pattern → OK → clicca il bordo della slab." },
    { icon: "📐", label: "Posizionamento", desc: "Seleziona lo slab edge e premi invio → nel Properties a sinistra trovi i constraints per posizionarlo correttamente. Il punto di inserimento dipende da come hai disegnato il profilo nella famiglia." },
  ]},
  { id: 23, section: "landscape", title: "Ramps nel Landscape", topics: ["Floor sloped vs Ramp tool"], objective: "Creare rampe esterne con il metodo più pratico.", docsUrl: DOCS+"ramps", videoQuery: "Revit sloped floor ramp landscape", diagram: null, steps: [
    { icon: "⚠️", label: "Il Ramp tool è ostico", desc: "Revit ha un tool Ramp dedicato sotto Architecture ma è macchinoso da usare e gestire." },
    { icon: "✅", label: "Usa i Floor", desc: "Consiglio pratico: usa floor in pendenza (Modify Sub-elements, come nel Grading). Più facile da creare, modificare e raccordare al paving circostante." },
  ]},
  { id: 24, section: "landscape", title: "Railings & Fences", topics: ["Sketch path", "Host", "Handrails", "Template"], objective: "Modellare ringhiere e recinzioni — uno degli elementi più complessi.", docsUrl: DOCS+"railings", videoQuery: "Revit railing fence tutorial", diagram: null, steps: [
    { icon: "⚠️", label: "Premessa onesta", desc: "Le railing sono tra gli elementi più complessi di Revit, difficili da far funzionare come vuoi. Parti da template e famiglie esistenti di recinzioni e cancelli quando possibile." },
    { icon: "✏️", label: "Sketch Path", desc: "Architecture → Railing → Sketch Path. Se la vista non è adatta, Revit ti chiede di sceglierne una. Pick New Host per agganciare a floor, rampa o scala. Attiva Preview per vedere la geometria mentre sketchi." },
    { icon: "🪜", label: "Su scale", desc: "La railing va sketchata lungo la linea interna dello stringer per agganciarsi e inclinarsi correttamente. Su component-based stairs scegli posizionamento su Treads o Stringer." },
    { icon: "🔧", label: "Handrails", desc: "Fino a 2 handrail per tipo di railing. Modifica le type properties di rail system (tipo e posizione), continuous rail (altezza, famiglia supports) e supports (layout, spacing, justification, number)." },
    { icon: "🔄", label: "Posizione", desc: "Flip Railing Direction (doppia freccia) per invertire lato. Tread/Stringer offset per la regolazione fine: default 1/2 Stringer Width sugli stringer, 1 pollice sui treads." },
    { icon: "🌐", label: "Free-standing", desc: "Le railing possono anche essere libere su un livello, o agganciate a slab edge, wall top, roof, topografia. Rails e balusters si piazzano automaticamente a intervalli regolari, definiti dai profili caricati." },
  ]},
  { id: 25, section: "landscape", title: "Retaining & Planter Walls", topics: ["Wall structure", "Sweeps", "Copping stone", "Foundation"], objective: "Muri di contenimento e fioriere con coronamenti e fondazioni.", docsUrl: DOCS+"wall%20sweeps", videoQuery: "Revit retaining wall sweep coping", diagram: null, steps: [
    { icon: "🧱", label: "Usi nel Landscape", desc: "I muri nel paesaggio sono soprattutto: retaining walls (contenimento), planter walls (fioriere), balaustre. Sono system families di cui personalizzi composizione e spessore." },
    { icon: "📋", label: "Modifica struttura", desc: "Duplica SEMPRE la famiglia prima di modificare → Edit Structure → Insert per aggiungere layer → frecce su/giù per posizionarli → assegna i materiali." },
    { icon: "👑", label: "Copping stone con Sweep", desc: "Tipico nel landscape: coronamento e fondazione del retaining wall. Il modo più rapido: Wall Sweep. Aggiungi il profilo (o creane uno — vedi lezione Profile) → applica il materiale per dettagliarlo → usa i parametri e gli offset per posizionarlo in alto (copping) o in basso (foundation)." },
    { icon: "📏", label: "Reveal", desc: "Usa i Reveal per creare pattern e scanalature diverse sulla superficie del muro." },
  ]},
  { id: 26, section: "landscape", title: "Toposurface", topics: ["Place points", "Create from import", "TIN da Civil 3D"], objective: "Creare la topografia — l'elemento più ostico di Revit.", docsUrl: DOCS+"toposurface", videoQuery: "Revit toposurface tutorial site", diagram: "topo", steps: [
    { icon: "⚠️", label: "Limiti da conoscere", desc: "La toposurface non si comporta come gli altri elementi: un solo materiale che si estende all'infinito (niente strati né profondità), poche famiglie ospitabili (perlopiù entourage), niente vuoti, niente tool per specchi d'acqua, nessuna interazione con l'hard landscape, triangoli e non contorni." },
    { icon: "📍", label: "Metodo 1 — Place Points", desc: "Massing & Site → Toposurface → Place Points: digita la quota e piazza manualmente. Tedioso su progetti grandi, ok per aree piccole. Usa 2 viste (pianta + 3D) per vedere la profondità dei punti." },
    { icon: "📂", label: "Metodo 2 — Import DWG", desc: "Create from Import → Select Import Instance: Revit crea la toposurface dai punti del DWG (da AutoCAD o Civil 3D). Seleziona solo i layer con la geometria appropriata. È il metodo più comune." },
    { icon: "📄", label: "Metodo 3 — Point file", desc: "Da file Excel/TXT con coordinate. Metodo poco usato." },
    { icon: "⭐", label: "Best practice — TIN", desc: "Revit triangola i punti più vicini, quindi dai contorni il risultato è spesso impreciso. Chiedi al civil engineer (o al survey) di esportare una TIN surface da Civil 3D in DWG: selezioni i vertici come punti e il risultato è molto più accurato." },
  ]},
  { id: 27, section: "landscape", title: "Split Surface", topics: ["Dividere toposurface", "Landform", "Percorsi"], objective: "Dividere la topografia per disegnare percorsi e landform.", docsUrl: DOCS+"split%20surface", videoQuery: "Revit split surface topography", diagram: null, steps: [
    { icon: "✂️", label: "Cosa fa", desc: "Divide la toposurface in due (massimo due superfici per volta). Visto che non ci sono tool di disegno per il terreno, Split è il modo per 'disegnare' percorsi, terrain e landform." },
    { icon: "📂", label: "Con DWG di guida", desc: "L'ideale: importa un DWG con landform/percorsi già disegnati e seleziona le linee. In alternativa usa detail lines come guida per il pick." },
    { icon: "✅", label: "Regione chiusa", desc: "Lo sketch deve formare una regione correttamente chiusa, altrimenti Revit non ti lascia uscire dall'editing mode." },
    { icon: "👁️", label: "Due viste sempre", desc: "Lavora con pianta + 3D affiancate per verificare il risultato. Lo split non modifica le quote anche con pendenze diverse — divide solo le superfici per fartele gestire. Applica il materiale prima di terminare l'editing." },
  ]},
  { id: 28, section: "landscape", title: "Net / Cut / Fill", topics: ["Graded Region", "Volumi di scavo e riporto"], objective: "Calcolare scavi e riporti del landform — dato fondamentale di progetto.", docsUrl: DOCS+"graded%20region", videoQuery: "Revit graded region cut fill toposurface", diagram: "cutfill", steps: [
    { icon: "💡", label: "Il task", desc: "Una delle richieste più comuni nel landscape: il calcolo Net/Cut/Fill del landform progettato. Si ottiene con il Graded Region tool." },
    { icon: "✂️", label: "Prima: Split", desc: "Dividi la superficie come nella lezione precedente per isolare l'area di intervento." },
    { icon: "📋", label: "Graded Region", desc: "Clicca Graded Region → si apre una finestra: scegli la PRIMA opzione, 'Create a new toposurface exactly like the existing one' (copia punti interni e perimetrali). Revit crea una superficie sopra quella esistente su cui puoi piazzare punti." },
    { icon: "📍", label: "Piazza i punti", desc: "Metti i punti DENTRO la boundary del tuo landform o area. La nuova superficie creata fornirà il valore Net/Cut/Fill necessario." },
    { icon: "📊", label: "Leggi i valori", desc: "Seleziona l'elemento creato → nel Properties trovi i dati Net/Cut/Fill in m³. La superficie resta sempre editabile; se la cancelli, il terreno torna alla forma originale." },
  ]},
  { id: 29, section: "landscape", title: "Progetto Finale Landscape", topics: ["Piazza urbana completa", "Dal terreno alle tavole"], objective: "Applicare tutto: un piccolo spazio pubblico end-to-end.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/", videoQuery: "Revit landscape site project tutorial", diagram: null, steps: [
    { icon: "📋", label: "Brief", desc: "Piccola piazza urbana: paving in pendenza, canaletta di drenaggio, cordoli, muro di contenimento con copping stone, rampa, ringhiera, terreno con landform." },
    { icon: "🌍", label: "Fase 1 — Terreno", desc: "Crea la toposurface, split per l'area pavimentata, calcola il cut/fill del landform con Graded Region." },
    { icon: "🧱", label: "Fase 2 — Hard Landscape", desc: "Paving con grading e pendenze, drainage sweep sul bordo, kerbs, retaining wall con copping stone, rampa con floor sloped, railing." },
    { icon: "📄", label: "Fase 3 — Documentazione", desc: "Grading plan con quote, General Arrangement, sezioni site-wide, sheets con view templates." },
  ]},
];

// ── Curriculum EN ─────────────────────────────────────────────
const CURRICULUM_EN = [
  { id: 1, section: "base", title: "User Interface", topics: ["Ribbon", "Properties panel", "Project Browser", "Plan Views", "3D navigation"], objective: "Navigate Revit and find the main controls.", docsUrl: DOCS+"user%20interface", videoQuery: "Revit user interface tutorial beginner", diagram: "ui", steps: [
    { icon: "🖥️", label: "Open Revit", desc: "Start Revit with a new project, Architectural template." },
    { icon: "📌", label: "Explore the Ribbon", desc: "Click Architecture, Massing & Site, Annotate, View and watch the panels change. Massing & Site will be your key tab for topography." },
    { icon: "📋", label: "Properties Panel", desc: "Top left: properties of the selected element or current view. Get into the habit of always checking it." },
    { icon: "🗂️", label: "Project Browser", desc: "Bottom left: all views, sheets, families in the project." },
    { icon: "🔍", label: "Drawing area", desc: "Wheel to zoom, hold middle button to pan, Shift+middle for 3D orbit." },
  ]},
  { id: 2, section: "base", title: "BIM Concepts", topics: ["BIM vs CAD", "Levels", "Grids", "Data in the model"], objective: "Understand the BIM logic: every element carries real information.", docsUrl: DOCS+"levels%20grids", videoQuery: "Revit levels grids BIM basics", diagram: null, steps: [
    { icon: "💡", label: "BIM vs CAD", desc: "In CAD you draw lines. In Revit every element has data: material, cost, volume. In Landscape this means cut/fill quantities, paving areas, plant counts." },
    { icon: "📏", label: "Levels", desc: "Architecture → Datum → Level. In Landscape, levels define the site reference elevations." },
    { icon: "⊞", label: "Grids", desc: "Architecture → Datum → Grid. Reference axes, useful in large-scale landscape projects." },
  ]},
  { id: 3, section: "base", title: "Wall", topics: ["System families", "Compound walls", "Edit structure"], objective: "Create and modify walls — the basis for retaining and planter walls.", docsUrl: DOCS+"walls", videoQuery: "Revit wall tool tutorial", diagram: null, steps: [
    { icon: "🧱", label: "Wall Tool", desc: "Architecture → Build → Wall: Architectural." },
    { icon: "📐", label: "Choose type", desc: "Properties panel → wall type. Always duplicate before modifying." },
    { icon: "✏️", label: "Draw", desc: "Two clicks in the drawing area. ESC to exit." },
    { icon: "⚙️", label: "Edit Structure", desc: "Edit Type → Edit Structure: add layers and materials. Same process you'll use for retaining walls." },
  ]},
  { id: 4, section: "base", title: "Floor", topics: ["Compound floors", "Sketch mode", "Boundary"], objective: "The Floor is THE Landscape tool: it becomes paving, grading, ramps.", docsUrl: DOCS+"floors", videoQuery: "Revit floor tool tutorial", diagram: "floor", steps: [
    { icon: "⬛", label: "Floor Tool", desc: "Architecture → Build → Floor: Architectural. You enter Sketch Mode." },
    { icon: "✏️", label: "Sketch Boundary", desc: "Draw a closed perimeter with Boundary Lines." },
    { icon: "✅", label: "Finish", desc: "Green checkmark to complete. Open boundary = error." },
    { icon: "📐", label: "Edit Structure", desc: "Edit Type → Edit Structure: floor layers. In Landscape this is where you'll define sub-base, bedding and paving finish." },
  ]},
  { id: 5, section: "base", title: "Component & Column", topics: ["Loadable components", "Site components", "Load Family"], objective: "Insert components — street furniture, trees, equipment.", docsUrl: DOCS+"components", videoQuery: "Revit component placement tutorial", diagram: null, steps: [
    { icon: "🪑", label: "Component Tool", desc: "Architecture → Build → Component. In Landscape: benches, bins, trees, lighting." },
    { icon: "📦", label: "Load Family", desc: "Insert → Load Family from libraries. Massing & Site → Site Component for site elements." },
  ]},
  { id: 6, section: "base", title: "Materials", topics: ["Material browser", "Surface pattern", "Cut pattern"], objective: "Create materials — essential for paving and external finishes.", docsUrl: DOCS+"materials", videoQuery: "Revit materials tutorial", diagram: null, steps: [
    { icon: "🎨", label: "Material Browser", desc: "Manage → Materials. Here you'll create paving, gravel, grass, asphalt materials." },
    { icon: "➕", label: "Create material", desc: "Click + → rename (e.g. 'Paving_Granite_600x600')." },
    { icon: "🖼️", label: "Surface Pattern", desc: "Graphics tab → Surface Pattern: how it looks in plan. For paving it's the slab pattern." },
    { icon: "✂️", label: "Cut Pattern", desc: "Graphics tab → Cut Pattern: the hatch when the element is sectioned." },
  ]},
  { id: 7, section: "base", title: "Families — Part 1", topics: ["System vs Loadable vs In-place", "Parametric logic"], objective: "Understand families — Landscape uses in-place and profiles heavily.", docsUrl: DOCS+"families", videoQuery: "Revit families explained system loadable", diagram: null, steps: [
    { icon: "📦", label: "What they are", desc: "Every element is a Family. Floors and Walls are system; trees and furniture are loadable; custom drainage will be in-place." },
    { icon: "🧱", label: "System Families", desc: "Walls, floors, toposurface. They exist only inside the project." },
    { icon: "📂", label: "Loadable Families", desc: ".rfa files: trees, furniture, profiles. Loaded from libraries." },
    { icon: "✏️", label: "In-place Families", desc: "Unique geometry in the project. In Landscape: drainage that follows slopes, custom elements." },
  ]},
  { id: 8, section: "base", title: "Families — Part 2", topics: ["Type vs Instance", "Parameters"], objective: "Distinguish type and instance parameters.", docsUrl: DOCS+"type%20instance%20properties", videoQuery: "Revit type instance parameters", diagram: null, steps: [
    { icon: "📋", label: "Type vs Instance", desc: "TYPE changes all copies (e.g. paving thickness). INSTANCE changes only the selected element (e.g. one floor's elevation)." },
    { icon: "⚙️", label: "Edit Type", desc: "Properties → Edit Type. ALWAYS duplicate before modifying — golden rule." },
  ]},
  { id: 9, section: "base", title: "Families — Part 3", topics: ["Family Editor", "Reference planes", "Extrusion"], objective: "Create a family from scratch — preparation for Landscape profiles.", docsUrl: DOCS+"family%20editor", videoQuery: "Revit family editor create family", diagram: null, steps: [
    { icon: "📁", label: "Family Editor", desc: "File → New → Family → choose template (e.g. Generic Model.rft)." },
    { icon: "✚", label: "Reference Planes", desc: "Create → Datum → Reference Plane: the geometry skeleton." },
    { icon: "📦", label: "Extrusion", desc: "Create → Forms → Extrusion: 2D profile + depth = solid." },
    { icon: "💾", label: "Load into Project", desc: "Create → Load into Project." },
  ]},
  { id: 10, section: "base", title: "Stairs & Railing", topics: ["Stair by component", "Run", "Railing host"], objective: "Stairs and railings — recurring landscape elements.", docsUrl: DOCS+"stairs%20railings", videoQuery: "Revit stairs railing tutorial", diagram: null, steps: [
    { icon: "🪜", label: "Stair Tool", desc: "Architecture → Circulation → Stair. Run for flights, automatic landings. Two options: sketch from scratch or use a standard type." },
    { icon: "🔧", label: "Railing", desc: "Architecture → Circulation → Railing. On a host (stairs) or free sketch path." },
  ]},
  { id: 11, section: "base", title: "Visibility & Graphics", topics: ["VG overrides (VV)", "Filters", "View templates"], objective: "Control view graphics — essential for complex landscape plans.", docsUrl: DOCS+"visibility%20graphics", videoQuery: "Revit visibility graphics overrides", diagram: null, steps: [
    { icon: "👁️", label: "Open VG", desc: "Shortcut VV. Category overrides, workset visibility." },
    { icon: "🔍", label: "Filters", desc: "Parameter-based rules — e.g. colour all Soft Landscape green." },
    { icon: "📋", label: "View Template", desc: "Save settings for reuse: General Arrangement, Grading Plan, Planting Plan." },
  ]},
  { id: 12, section: "base", title: "Views and Sections", topics: ["Floor plans", "Sections", "3D views", "Duplicate"], objective: "Create the views for landscape documentation.", docsUrl: DOCS+"views%20sections", videoQuery: "Revit views sections tutorial", diagram: null, steps: [
    { icon: "📐", label: "Floor Plan", desc: "View → Plan Views → Floor Plan. In landscape: GA, Grading, Hard/Soft Landscape per level." },
    { icon: "✂️", label: "Section", desc: "View → Section. Site-wide and detail." },
    { icon: "📦", label: "3D View", desc: "Default 3D View. Use 2 tiled views (plan+3D) when working on terrain." },
  ]},
  { id: 13, section: "base", title: "Sheets", topics: ["Titleblock", "Viewport", "Output"], objective: "Compose project sheets.", docsUrl: DOCS+"sheets%20titleblock", videoQuery: "Revit sheets titleblock tutorial", diagram: null, steps: [
    { icon: "📄", label: "New Sheet", desc: "View → Sheet. Drag views from the Project Browser." },
    { icon: "📋", label: "Titleblock", desc: "Double-click to fill number, title, revision." },
  ]},
  { id: 14, section: "landscape", title: "BIM for Landscape", topics: ["Advantages & challenges", "No native tools", "EIR and project scale"], objective: "Understand the context: Landscape in Revit means bending architectural tools.", docsUrl: DOCS+"site%20design", videoQuery: "Revit landscape architecture BIM site design", diagram: null, steps: [
    { icon: "💡", label: "The key principle", desc: "Revit has NO native Landscape tools. You'll use Floor for paving, Wall for retaining walls, Sweep for drainage and kerbs. This is the mindset to adopt." },
    { icon: "✅", label: "Advantages", desc: "Integrated collaboration, schedules and budgets updated automatically as the design changes, real quantities (cut/fill, paving areas), rapid scenario analysis, lean approach with less waste." },
    { icon: "⚠️", label: "Challenges", desc: "Toposurface built on triangles (not contours), no topo-paving interaction, many consultants still in 2D, software interoperability, initial user frustration — overcome with a good modelling strategy and training." },
    { icon: "📋", label: "What drives the model", desc: "Scale, use, location, design and project phase — but above all what is contractually agreed with the client and written in the EIR." },
  ]},
  { id: 15, section: "landscape", title: "Worksets & Collaboration", topics: ["Central model", "Naming standard", "Typical division"], objective: "Set up multi-user collaboration with well-organised worksets.", docsUrl: DOCS+"worksets", videoQuery: "Revit worksets worksharing tutorial", diagram: null, steps: [
    { icon: "🤝", label: "Central model", desc: "From day one you'll work in a shared central model, accessed by several users simultaneously. Worksets are the key to collaboration." },
    { icon: "🏷️", label: "Naming convention", desc: "Field 1: Zone (optional — large projects split horizontally or vertically). Field 2: Content. Consistent, logical naming following company and ISO standards." },
    { icon: "📂", label: "Site worksets", desc: "S-01_Components, S-02_Existing_Topography, S-03_Proposed_Topography, S-04_Existing_Planting, S-05_Entourage, S-06_Masses." },
    { icon: "🧱", label: "Hard Landscape worksets", desc: "HL-01_Paving, HL-02_Stairs_Ramps_Railings, HL-03_Walls_Fences, HL-04_Furniture." },
    { icon: "🌳", label: "Soft Landscape worksets", desc: "SL-01_Trees, SL-02_Planting, SL-03_Shrubs. This division matters later for sheets and visualisation setups." },
  ]},
  { id: 16, section: "landscape", title: "Landscape Views", topics: ["General Arrangement", "Grading Plan", "Hard/Soft Landscape"], objective: "Create the basic view set of a landscape project.", docsUrl: DOCS+"view%20templates", videoQuery: "Revit view templates site plan", diagram: null, steps: [
    { icon: "📐", label: "Floorplans per level", desc: "General Arrangement, Grading and Levels, Hard Landscape and Furniture, Soft Landscape." },
    { icon: "📦", label: "3D views", desc: "Site View, Tree and Planting views, Hardscape, Softscape." },
    { icon: "⬆️", label: "Elevations and Sections", desc: "Site-wide elevations/sections + detail elevations/sections." },
    { icon: "📋", label: "View Templates", desc: "Create a view template per view type so graphics stay consistent across the project." },
  ]},
  { id: 17, section: "landscape", title: "Paving — Floor Tool", topics: ["Floor as paving", "Duplicating types", "Layers"], objective: "Create external paving using the Floor tool.", docsUrl: DOCS+"floors", videoQuery: "Revit floor paving landscape tutorial", diagram: "paving", steps: [
    { icon: "🧱", label: "The concept", desc: "Paving is the most common hard landscape element. Model it with the Floor tool: hosts families, top face at creation level, editable shape, matches architectural floors." },
    { icon: "📋", label: "New paving type", desc: "Duplicate an existing floor → rename (e.g. Paving_Granite_60mm) → Edit Structure → change properties." },
    { icon: "📚", label: "Add layers", desc: "Add as many layers as needed to describe your paving material: sub-base, bedding, finish. Each with its material and thickness." },
    { icon: "🌱", label: "Soil and grass too", desc: "Same method for soil and grass: a floor with layers just like an architectural floor — the only difference is applying the proper hatches." },
  ]},
  { id: 18, section: "landscape", title: "2D Filled Patterns", topics: ["Model vs Drafting", "Surface pattern", "Filled regions"], objective: "Represent paving correctly in 2D plans.", docsUrl: DOCS+"fill%20patterns", videoQuery: "Revit fill patterns model drafting", diagram: null, steps: [
    { icon: "🔲", label: "Two pattern types", desc: "Revit 'hatches' are Filled Patterns (PAT files). MODEL: fixed real size, adjusts with view scale — perfect for slabs, blocks, tiles but unreadable at large/small scales. DRAFTING: constant size at any scale — always readable but not true-size." },
    { icon: "🎨", label: "Apply in the material", desc: "Floor editor → Material column → Material Editor → duplicate or create the material → define Surface and Cut patterns." },
    { icon: "📐", label: "Or Filled Region", desc: "As a material property the pattern is a model element; as a filled region it's view-specific. No right or wrong — depends on project needs, you can even combine both for your Hard Landscape Plan." },
  ]},
  { id: 19, section: "landscape", title: "Grading & Levels", topics: ["Modify sub-elements", "Add point", "Split lines", "Slopes"], objective: "Give slopes and levels to paving — nothing is flat in Landscape.", docsUrl: DOCS+"modify%20sub%20elements%20floor", videoQuery: "Revit floor grading modify sub elements slope", diagram: "grading", steps: [
    { icon: "💡", label: "Why it matters", desc: "Unlike architecture, external paving is rarely flat: falls and slopes are needed for drainage and to match existing levels. Select the floor → the shape editing tools appear in the ribbon." },
    { icon: "🟩", label: "Divide into regular patterns", desc: "Divide paving into regular modules (e.g. squares) to control level changes easily and avoid the warning: 'Thickness of this Floor may be slightly inaccurate due to extreme Shape Editing'." },
    { icon: "✏️", label: "Edit Boundary", desc: "Modifies the floor shape. WARNING: deleting/adding segments on an already-shaped floor resets elevations to 0. Move lines without deleting. Use dynamic dimensions by clicking the value." },
    { icon: "📍", label: "Modify Sub-elements", desc: "Change the relative elevation of points, segments and split lines. Negative numbers = downward. This is how you create falls and slopes." },
    { icon: "➕", label: "Add Point", desc: "Add points inside the boundary. In this mode Revit doesn't snap to model elements, only detail/model lines: sketch detail lines first as guides." },
    { icon: "📏", label: "Add Split Lines", desc: "Create ridges and valleys. Automatically generates start and end points to assign levels to. Detail lines help place them precisely here too." },
    { icon: "🔄", label: "Reset Shape", desc: "Returns the floor to flat, removing all modifications." },
  ]},
  { id: 20, section: "landscape", title: "Drainage", topics: ["Floor-based families", "Model in-place", "Sweep on path"], objective: "Model channels and drainage systems that follow slopes.", docsUrl: DOCS+"sweep", videoQuery: "Revit landscape drainage sweep model in place", diagram: "drainage", steps: [
    { icon: "💡", label: "The problem", desc: "There is no drainage tool in Revit. Gratings and gullies = floor-based families (follow the slope). Continuous channels along slopes = model in-place with sweep." },
    { icon: "📦", label: "Way 1 — Floor-based family", desc: "Load families from the Systems tab or libraries: applied to the floor they follow its slope. RULE: they must be floor-based, otherwise they will NOT follow the slope." },
    { icon: "✏️", label: "Way 2 — Model In-Place", desc: "Architecture → Component → Model In-Place. Choose an appropriate category for future schedules: Specialty Equipment or Plumbing Fixture. Name the component describing element and size." },
    { icon: "🛤️", label: "Sweep + Pick Path", desc: "Use Sweep (extrudes a profile along a path) → Pick Path → open a 3D view and select the sloped floor edge. A dashed plane appears where you define the profile." },
    { icon: "📐", label: "Profile", desc: "Two options: sketch the profile directly, or select a loaded Metric Profile. Use the x/y axis bar to place it, a section view for exact distances, then green checkmark." },
    { icon: "🔄", label: "Automatic update", desc: "If the floor changes level or slope: select the element → it updates according to the floor without redrawing path or profile. Then close the in-place editor." },
  ]},
  { id: 21, section: "landscape", title: "Creating a Profile", topics: ["Metric Profile family", "Closed profile", "Load"], objective: "Create custom profiles for drainage, kerbs and copping stones.", docsUrl: DOCS+"profile%20family", videoQuery: "Revit profile family tutorial", diagram: null, steps: [
    { icon: "📁", label: "New family", desc: "File → New → Family → select the Metric Profile template." },
    { icon: "✏️", label: "Draw the profile", desc: "In the 2D standard template draw with simple lines. RULE: the profile must be CLOSED." },
    { icon: "💾", label: "Save and load", desc: "Save in the project profiles folder → Load into Project. Now selectable when using Sweep, Slab Edge and Wall Sweep." },
  ]},
  { id: 22, section: "landscape", title: "Kerbs (Curbs)", topics: ["Sloped vs flat", "Slab Edge tool"], objective: "Create sloped and flat kerbs.", docsUrl: DOCS+"slab%20edge", videoQuery: "Revit slab edge kerb curb", diagram: null, steps: [
    { icon: "🔀", label: "Two ways", desc: "SLOPED kerb → same process as drainage (model in-place sweep on path). FLAT kerb → Slab Edge tool, faster." },
    { icon: "📋", label: "Slab Edge", desc: "Duplicate the family → rename descriptively → pick the profile from the list → apply material with surface and cut patterns → OK → click the slab edge to apply." },
    { icon: "📐", label: "Placement", desc: "Select the slab edge and press enter → constraints in the Properties panel help you position it correctly. The insertion point depends on how the profile was drawn in the Metric Profile family." },
  ]},
  { id: 23, section: "landscape", title: "Ramps in Landscape", topics: ["Sloped floor vs Ramp tool"], objective: "Create external ramps the practical way.", docsUrl: DOCS+"ramps", videoQuery: "Revit sloped floor ramp landscape", diagram: null, steps: [
    { icon: "⚠️", label: "The Ramp tool is tricky", desc: "Revit has a dedicated Ramp tool under Architecture but it's awkward to use and manage." },
    { icon: "✅", label: "Use Floors", desc: "Practical advice: use sloped floors (Modify Sub-elements, as in Grading). Easier to create, modify and match to surrounding paving." },
  ]},
  { id: 24, section: "landscape", title: "Railings & Fences", topics: ["Sketch path", "Host", "Handrails", "Template"], objective: "Model railings and fences — one of the most complex elements.", docsUrl: DOCS+"railings", videoQuery: "Revit railing fence tutorial", diagram: null, steps: [
    { icon: "⚠️", label: "Honest premise", desc: "Railings are among Revit's most complex elements, hard to make behave as you want. Start from existing templates and fence/gate families when possible." },
    { icon: "✏️", label: "Sketch Path", desc: "Architecture → Railing → Sketch Path. If the view isn't suitable, Revit asks you to pick one. Pick New Host to attach to floor, ramp or stair. Enable Preview to see the geometry while sketching." },
    { icon: "🪜", label: "On stairs", desc: "The railing must be sketched along the inside line of the stair stringer to host and slope correctly. On component-based stairs choose placement on Treads or Stringer." },
    { icon: "🔧", label: "Handrails", desc: "Up to 2 handrails per railing type. Modify type properties of the rail system (type and position), continuous rail (height, supports family) and supports (layout, spacing, justification, number)." },
    { icon: "🔄", label: "Position", desc: "Flip Railing Direction (double arrow) to switch side. Tread/Stringer offset for fine adjustment: default 1/2 Stringer Width on stringers, 1 inch on treads." },
    { icon: "🌐", label: "Free-standing", desc: "Railings can also be free-standing on a level, or attached to slab edges, wall tops, roofs, topography. Rails and balusters are placed automatically at even intervals, shapes defined by the loaded profile families." },
  ]},
  { id: 25, section: "landscape", title: "Retaining & Planter Walls", topics: ["Wall structure", "Sweeps", "Copping stone", "Foundation"], objective: "Retaining walls and planters with coping and foundations.", docsUrl: DOCS+"wall%20sweeps", videoQuery: "Revit retaining wall sweep coping", diagram: null, steps: [
    { icon: "🧱", label: "Landscape uses", desc: "Walls in landscape are mostly: retaining walls, planter walls, balustrades. They are system families whose composition and thickness you customise." },
    { icon: "📋", label: "Modify structure", desc: "ALWAYS duplicate the family before modifying → Edit Structure → Insert to add layers → up/down arrows to position them → assign materials." },
    { icon: "👑", label: "Copping stone with Sweep", desc: "Typical in landscape: coping and foundation slab on the retaining wall. Fastest way: Wall Sweep. Add the profile (or create one — see Profile lesson) → apply the material to detail it → use parameters and offsets to place it top (coping) or bottom (foundation)." },
    { icon: "📏", label: "Reveal", desc: "Use Reveals to create different patterns and grooves on the wall surface." },
  ]},
  { id: 26, section: "landscape", title: "Toposurface", topics: ["Place points", "Create from import", "TIN from Civil 3D"], objective: "Create topography — Revit's most challenging element.", docsUrl: DOCS+"toposurface", videoQuery: "Revit toposurface tutorial site", diagram: "topo", steps: [
    { icon: "⚠️", label: "Know the limits", desc: "The toposurface doesn't behave like other elements: one single material extending infinitely (no layers or depths), few hostable families (mostly entourage), no voids, no water body tools, no interaction with hard landscape, triangles not contours." },
    { icon: "📍", label: "Method 1 — Place Points", desc: "Massing & Site → Toposurface → Place Points: type the elevation and place manually. Tedious for big projects, fine for small areas. Use 2 views (plan + 3D) to see point depth." },
    { icon: "📂", label: "Method 2 — Import DWG", desc: "Create from Import → Select Import Instance: Revit creates the toposurface from the points of the DWG (from AutoCAD or Civil 3D). Select only the layers containing the appropriate geometry. The most common method." },
    { icon: "📄", label: "Method 3 — Point file", desc: "From an Excel/TXT coordinate file. Rarely used." },
    { icon: "⭐", label: "Best practice — TIN", desc: "Revit triangulates the closest points, so from contours the result is often inaccurate. Ask the civil engineer (or survey) to export a TIN surface from Civil 3D to DWG: pick the vertices as points and the result is far more accurate." },
  ]},
  { id: 27, section: "landscape", title: "Split Surface", topics: ["Dividing toposurface", "Landform", "Paths"], objective: "Divide the topography to design paths and landforms.", docsUrl: DOCS+"split%20surface", videoQuery: "Revit split surface topography", diagram: null, steps: [
    { icon: "✂️", label: "What it does", desc: "Splits the toposurface in two (max two surfaces at a time). Since there are no terrain drawing tools, Split is how you 'design' paths, terrain and landforms." },
    { icon: "📂", label: "With a guide DWG", desc: "Best option: import a DWG with landforms/paths already drawn and pick the lines. Alternatively use detail lines as guides for picking." },
    { icon: "✅", label: "Closed region", desc: "The sketch must form a properly enclosed region or Revit won't let you finish editing mode." },
    { icon: "👁️", label: "Always two views", desc: "Work with plan + 3D tiled to check the result. Split doesn't change levels even with different slopes — it only divides surfaces so you can manage them. Apply the material before finishing the edit." },
  ]},
  { id: 28, section: "landscape", title: "Net / Cut / Fill", topics: ["Graded Region", "Cut and fill volumes"], objective: "Calculate cut and fill of the designed landform — a key project figure.", docsUrl: DOCS+"graded%20region", videoQuery: "Revit graded region cut fill toposurface", diagram: "cutfill", steps: [
    { icon: "💡", label: "The task", desc: "One of the most common landscape requests: the Net/Cut/Fill of the designed landform. Achieved with the Graded Region tool." },
    { icon: "✂️", label: "First: Split", desc: "Split the surface as in the previous lesson to isolate the intervention area." },
    { icon: "📋", label: "Graded Region", desc: "Click Graded Region → a window opens: choose the FIRST option, 'Create a new toposurface exactly like the existing one' (both internal and perimeter points are copied). Revit creates a surface on top of the existing one where you can place points." },
    { icon: "📍", label: "Place the points", desc: "Place points INSIDE the boundary of your landform or area. The new surface created will provide the required Net/Cut/Fill value." },
    { icon: "📊", label: "Read the values", desc: "Select the created element → the Properties panel shows Net/Cut/Fill data in m³. The surface always stays editable; delete it and the terrain returns to its original form." },
  ]},
  { id: 29, section: "landscape", title: "Final Landscape Project", topics: ["Complete urban plaza", "From terrain to sheets"], objective: "Apply everything: a small public space end-to-end.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/", videoQuery: "Revit landscape site project tutorial", diagram: null, steps: [
    { icon: "📋", label: "Brief", desc: "Small urban plaza: sloped paving, drainage channel, kerbs, retaining wall with copping stone, ramp, railing, terrain with landform." },
    { icon: "🌍", label: "Phase 1 — Terrain", desc: "Create the toposurface, split for the paved area, calculate the landform cut/fill with Graded Region." },
    { icon: "🧱", label: "Phase 2 — Hard Landscape", desc: "Paving with grading and slopes, drainage sweep on the edge, kerbs, retaining wall with copping stone, sloped-floor ramp, railing." },
    { icon: "📄", label: "Phase 3 — Documentation", desc: "Grading plan with levels, General Arrangement, site-wide sections, sheets with view templates." },
  ]},
];

// ── SVG Diagrams ──────────────────────────────────────────────
const DIAGRAMS = {
  ui: (
    <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="300" rx="8" fill="#ffffff"/>
      <rect x="8" y="8" width="544" height="46" rx="4" fill="#e3f1e7" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="16" y="24" fill="#22c55e" fontSize="9" fontWeight="700">FILE</text>
      <rect x="48" y="12" width="78" height="18" rx="3" fill="#22c55e" opacity="0.25"/>
      <text x="52" y="24" fill="#15803d" fontSize="8" fontWeight="600">ARCHITECTURE</text>
      <rect x="130" y="12" width="92" height="18" rx="3" fill="#22c55e" opacity="0.4"/>
      <text x="134" y="24" fill="#15803d" fontSize="8" fontWeight="700">MASSING &amp; SITE ★</text>
      <text x="232" y="24" fill="#7c8a80" fontSize="8">ANNOTATE</text>
      <text x="292" y="24" fill="#7c8a80" fontSize="8">VIEW</text>
      <rect x="48" y="32" width="490" height="18" rx="2" fill="#eef5ef"/>
      <text x="55" y="44" fill="#15803d" fontSize="7">🧱 Wall</text>
      <text x="105" y="44" fill="#15803d" fontSize="7">⬛ Floor</text>
      <text x="155" y="44" fill="#15803d" fontSize="7">🌍 Toposurface</text>
      <text x="235" y="44" fill="#15803d" fontSize="7">🪜 Stair</text>
      <text x="285" y="44" fill="#15803d" fontSize="7">🔧 Railing</text>
      <rect x="8" y="3" width="55" height="11" rx="3" fill="#22c55e"/>
      <text x="12" y="11" fill="#0a2814" fontSize="7" fontWeight="700">① RIBBON</text>
      <rect x="8" y="60" width="125" height="110" rx="4" fill="#eef5ef" stroke="#9b4ff7" strokeWidth="1.5"/>
      <text x="14" y="74" fill="#7c3aed" fontSize="8" fontWeight="700">Properties</text>
      <rect x="14" y="80" width="113" height="13" rx="2" fill="#eef1f7"/>
      <text x="18" y="89" fill="#6b7280" fontSize="6">Paving_Granite_60mm</text>
      <text x="14" y="104" fill="#7a8290" fontSize="6">Height Offset From Level</text>
      <rect x="14" y="107" width="113" height="11" rx="2" fill="#eef1f7"/>
      <text x="18" y="115" fill="#6b7280" fontSize="6">0.0</text>
      <rect x="30" y="140" width="80" height="14" rx="3" fill="#9b4ff7" opacity="0.8"/>
      <text x="48" y="150" fill="white" fontSize="7" fontWeight="600">Edit Type</text>
      <rect x="8" y="55" width="85" height="11" rx="3" fill="#9b4ff7"/>
      <text x="12" y="63" fill="white" fontSize="7" fontWeight="700">② PROPERTIES</text>
      <rect x="8" y="178" width="125" height="114" rx="4" fill="#eef5ef" stroke="#3d7ef5" strokeWidth="1.5"/>
      <text x="14" y="192" fill="#2563c9" fontSize="8" fontWeight="700">Project Browser</text>
      <text x="14" y="206" fill="#7a8290" fontSize="6">▼ Floor Plans</text>
      <text x="22" y="217" fill="#6b7280" fontSize="6">General Arrangement</text>
      <text x="22" y="227" fill="#6b7280" fontSize="6">Grading and Levels</text>
      <text x="22" y="237" fill="#6b7280" fontSize="6">Hard Landscape</text>
      <text x="22" y="247" fill="#6b7280" fontSize="6">Soft Landscape</text>
      <text x="14" y="260" fill="#7a8290" fontSize="6">▼ 3D Views</text>
      <text x="22" y="271" fill="#6b7280" fontSize="6">Site View · Hardscape</text>
      <rect x="8" y="173" width="105" height="11" rx="3" fill="#3d7ef5"/>
      <text x="12" y="181" fill="white" fontSize="7" fontWeight="700">③ PROJECT BROWSER</text>
      <rect x="141" y="60" width="411" height="232" rx="4" fill="#ffffff" stroke="#d4e3d8" strokeWidth="1"/>
      <path d="M180 240 Q280 130 380 200 Q450 240 520 180" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.5"/>
      <rect x="220" y="160" width="120" height="70" rx="2" fill="#22c55e" opacity="0.12" stroke="#22c55e" strokeWidth="1"/>
      <text x="248" y="200" fill="#22c55e" fontSize="9" opacity="0.6">PAVING</text>
      <text x="280" y="100" fill="#15803d" fontSize="10" textAnchor="middle">DRAWING AREA — SITE</text>
      <rect x="141" y="55" width="95" height="11" rx="3" fill="#f59e0b"/>
      <text x="145" y="63" fill="#1a1200" fontSize="7" fontWeight="700">④ DRAWING AREA</text>
    </svg>
  ),
  floor: (
    <svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="240" rx="8" fill="#ffffff"/>
      <text x="18" y="26" fill="#16241a" fontSize="13" fontWeight="700">Floor — the base of paving</text>
      <rect x="15" y="40" width="165" height="150" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="22" y="54" fill="#7a8290" fontSize="7">① Closed Sketch Boundary</text>
      <rect x="35" y="65" width="125" height="100" rx="1" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3"/>
      <rect x="195" y="40" width="165" height="150" rx="4" fill="#ffffff" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="202" y="54" fill="#22c55e" fontSize="7">② Finish → floor created</text>
      <rect x="215" y="65" width="125" height="100" rx="1" fill="#22c55e" opacity="0.12" stroke="#22c55e" strokeWidth="1.5"/>
      <line x1="215" y1="85" x2="340" y2="85" stroke="#22c55e" strokeWidth="0.4" opacity="0.4"/>
      <line x1="215" y1="105" x2="340" y2="105" stroke="#22c55e" strokeWidth="0.4" opacity="0.4"/>
      <line x1="215" y1="125" x2="340" y2="125" stroke="#22c55e" strokeWidth="0.4" opacity="0.4"/>
      <line x1="245" y1="65" x2="245" y2="165" stroke="#22c55e" strokeWidth="0.4" opacity="0.4"/>
      <line x1="285" y1="65" x2="285" y2="165" stroke="#22c55e" strokeWidth="0.4" opacity="0.4"/>
      <text x="252" y="120" fill="#22c55e" fontSize="9">✓ Paving</text>
      <rect x="375" y="40" width="170" height="150" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="382" y="54" fill="#7a8290" fontSize="7">③ Edit Structure — layers</text>
      <rect x="395" y="70" width="130" height="14" fill="#8a6d4a"/>
      <text x="400" y="80" fill="#e8d8c0" fontSize="7">Finish — granite 60mm</text>
      <rect x="395" y="84" width="130" height="20" fill="#6a5a40"/>
      <text x="400" y="97" fill="#d8c8a8" fontSize="7">Bedding — sand 40mm</text>
      <rect x="395" y="104" width="130" height="34" fill="#4a4438"/>
      <text x="400" y="124" fill="#b8b098" fontSize="7">Sub-base — 200mm</text>
      <text x="395" y="160" fill="#7a8290" fontSize="6">Each layer: material + thickness</text>
      <text x="18" y="218" fill="#7c8a80" fontSize="8">Soil and grass = same process, different materials and hatches. The floor is the Swiss army knife of Landscape.</text>
    </svg>
  ),
  paving: (
    <svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="260" rx="8" fill="#ffffff"/>
      <text x="18" y="26" fill="#16241a" fontSize="13" fontWeight="700">Paving — full workflow</text>
      <defs><marker id="arP" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c8a80"/></marker></defs>
      <rect x="15" y="42" width="120" height="80" rx="6" fill="#eef5ef" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="25" y="60" fill="#22c55e" fontSize="9" fontWeight="700">1. Duplicate</text>
      <text x="25" y="76" fill="#6b7280" fontSize="7">Existing floor →</text>
      <text x="25" y="87" fill="#6b7280" fontSize="7">Duplicate →</text>
      <text x="25" y="98" fill="#6b7280" fontSize="7">rename:</text>
      <text x="25" y="110" fill="#15803d" fontSize="6">Paving_Granite_60mm</text>
      <path d="M140 82 L155 82" stroke="#7c8a80" strokeWidth="2" markerEnd="url(#arP)"/>
      <rect x="160" y="42" width="120" height="80" rx="6" fill="#eef5ef" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="170" y="60" fill="#22c55e" fontSize="9" fontWeight="700">2. Layers</text>
      <text x="170" y="76" fill="#6b7280" fontSize="7">Edit Structure:</text>
      <text x="170" y="88" fill="#6b7280" fontSize="7">finish + bedding</text>
      <text x="170" y="99" fill="#6b7280" fontSize="7">+ sub-base, each</text>
      <text x="170" y="110" fill="#6b7280" fontSize="7">with material</text>
      <path d="M285 82 L300 82" stroke="#7c8a80" strokeWidth="2" markerEnd="url(#arP)"/>
      <rect x="305" y="42" width="120" height="80" rx="6" fill="#eef5ef" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="315" y="60" fill="#22c55e" fontSize="9" fontWeight="700">3. Patterns</text>
      <text x="315" y="76" fill="#6b7280" fontSize="7">Material Editor:</text>
      <text x="315" y="88" fill="#6b7280" fontSize="7">Surface pattern (2D)</text>
      <text x="315" y="99" fill="#6b7280" fontSize="7">+ Cut pattern</text>
      <text x="315" y="110" fill="#6b7280" fontSize="7">(section)</text>
      <path d="M430 82 L445 82" stroke="#7c8a80" strokeWidth="2" markerEnd="url(#arP)"/>
      <rect x="450" y="42" width="95" height="80" rx="6" fill="#eef5ef" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="460" y="60" fill="#f59e0b" fontSize="9" fontWeight="700">4. Grading</text>
      <text x="460" y="76" fill="#6b7280" fontSize="7">Slopes with</text>
      <text x="460" y="88" fill="#6b7280" fontSize="7">Modify Sub-</text>
      <text x="460" y="99" fill="#6b7280" fontSize="7">elements</text>
      <text x="460" y="110" fill="#6b7280" fontSize="7">(Grading lesson)</text>
      <rect x="15" y="140" width="530" height="100" rx="6" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="25" y="158" fill="#7a8290" fontSize="8">Plan patterns — MODEL (real size, scales with view) vs DRAFTING (always readable)</text>
      <rect x="30" y="170" width="230" height="55" fill="#eef5ef" stroke="#c0d2c5"/>
      <line x1="30" y1="185" x2="260" y2="185" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="30" y1="200" x2="260" y2="200" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="30" y1="215" x2="260" y2="215" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="70" y1="170" x2="70" y2="225" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="110" y1="170" x2="110" y2="225" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="150" y1="170" x2="150" y2="225" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="190" y1="170" x2="190" y2="225" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <line x1="230" y1="170" x2="230" y2="225" stroke="#22c55e" strokeWidth="0.5" opacity="0.5"/>
      <text x="95" y="237" fill="#7c8a80" fontSize="7">MODEL — real 600x600 slabs</text>
      <rect x="290" y="170" width="230" height="55" fill="#eef5ef" stroke="#c0d2c5"/>
      <line x1="290" y1="178" x2="520" y2="178" stroke="#15803d" strokeWidth="0.4" opacity="0.6"/>
      <line x1="290" y1="186" x2="520" y2="186" stroke="#15803d" strokeWidth="0.4" opacity="0.6"/>
      <line x1="290" y1="194" x2="520" y2="194" stroke="#15803d" strokeWidth="0.4" opacity="0.6"/>
      <line x1="290" y1="202" x2="520" y2="202" stroke="#15803d" strokeWidth="0.4" opacity="0.6"/>
      <line x1="290" y1="210" x2="520" y2="210" stroke="#15803d" strokeWidth="0.4" opacity="0.6"/>
      <line x1="290" y1="218" x2="520" y2="218" stroke="#15803d" strokeWidth="0.4" opacity="0.6"/>
      <text x="355" y="237" fill="#7c8a80" fontSize="7">DRAFTING — fixed at any scale</text>
    </svg>
  ),
  grading: (
    <svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="280" rx="8" fill="#ffffff"/>
      <text x="18" y="26" fill="#16241a" fontSize="13" fontWeight="700">Grading — slopes on the floor</text>
      <rect x="15" y="42" width="255" height="130" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="24" y="58" fill="#7a8290" fontSize="8">PLAN — points and split lines</text>
      <rect x="40" y="70" width="200" height="90" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="1"/>
      <line x1="140" y1="70" x2="140" y2="160" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <text x="118" y="175" fill="#f59e0b" fontSize="7">split line (valley)</text>
      <circle cx="40" cy="70" r="4" fill="#3d7ef5"/><text x="28" y="62" fill="#3d7ef5" fontSize="7">+0.00</text>
      <circle cx="240" cy="70" r="4" fill="#3d7ef5"/><text x="228" y="62" fill="#3d7ef5" fontSize="7">+0.00</text>
      <circle cx="40" cy="160" r="4" fill="#3d7ef5"/><text x="20" y="172" fill="#3d7ef5" fontSize="7">+0.00</text>
      <circle cx="240" cy="160" r="4" fill="#3d7ef5"/><text x="245" y="172" fill="#3d7ef5" fontSize="7">+0.00</text>
      <circle cx="140" cy="70" r="4" fill="#ef4444"/><text x="148" y="65" fill="#ef4444" fontSize="7">-0.15</text>
      <circle cx="140" cy="160" r="4" fill="#ef4444"/><text x="148" y="155" fill="#ef4444" fontSize="7">-0.15</text>
      <rect x="290" y="42" width="255" height="130" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="299" y="58" fill="#7a8290" fontSize="8">SECTION — the valley created</text>
      <path d="M310 100 L420 135 L530 100" fill="none" stroke="#22c55e" strokeWidth="2.5"/>
      <path d="M310 100 L420 135 L530 100 L530 115 L420 150 L310 115 Z" fill="#22c55e" opacity="0.15"/>
      <path d="M420 135 L420 155" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2"/>
      <text x="428" y="152" fill="#ef4444" fontSize="7">-0.15 (drainage)</text>
      <text x="318" y="92" fill="#3d7ef5" fontSize="7">±0.00</text>
      <text x="505" y="92" fill="#3d7ef5" fontSize="7">±0.00</text>
      <rect x="15" y="186" width="530" height="80" rx="6" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="25" y="204" fill="#f59e0b" fontSize="8" fontWeight="700">⚠️ Golden rules of Grading:</text>
      <text x="25" y="220" fill="#6b7280" fontSize="8">1. Divide paving into regular modules — avoids the extreme Shape Editing warning</text>
      <text x="25" y="234" fill="#6b7280" fontSize="8">2. In Edit Boundary do NOT delete segments on a shaped floor — elevations reset to 0</text>
      <text x="25" y="248" fill="#6b7280" fontSize="8">3. Add Point doesn't snap to the model — sketch detail lines first as guides</text>
      <text x="25" y="262" fill="#6b7280" fontSize="8">4. Negative numbers = downward. Reset Shape flattens everything</text>
    </svg>
  ),
  drainage: (
    <svg viewBox="0 0 560 270" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="270" rx="8" fill="#ffffff"/>
      <text x="18" y="26" fill="#16241a" fontSize="13" fontWeight="700">Drainage — sweep on a sloped path</text>
      <rect x="15" y="42" width="530" height="120" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="24" y="58" fill="#7a8290" fontSize="8">3D — the profile follows the sloped floor edge</text>
      <path d="M60 130 L260 90 L460 120" fill="none" stroke="#22c55e" strokeWidth="3"/>
      <path d="M60 130 L260 90 L460 120 L460 135 L260 105 L60 145 Z" fill="#22c55e" opacity="0.12"/>
      <path d="M60 128 L260 88 L460 118" fill="none" stroke="#3d7ef5" strokeWidth="2" strokeDasharray="6,3"/>
      <text x="200" y="78" fill="#3d7ef5" fontSize="8">Pick Path → floor edge (sloped)</text>
      <rect x="48" y="118" width="14" height="16" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M51 122 L59 122 L59 130 L51 130 Z" fill="#f59e0b" opacity="0.3"/>
      <text x="20" y="155" fill="#f59e0b" fontSize="7">Profile (Metric Profile)</text>
      <text x="330" y="148" fill="#15803d" fontSize="7">→ the channel updates if the slope changes</text>
      <rect x="15" y="176" width="255" height="84" rx="6" fill="#eef5ef" stroke="#22c55e" strokeWidth="1"/>
      <text x="25" y="194" fill="#22c55e" fontSize="9" fontWeight="700">Way 1 — Floor-based family</text>
      <text x="25" y="210" fill="#6b7280" fontSize="7">Point gratings and gullies. Applied to</text>
      <text x="25" y="222" fill="#6b7280" fontSize="7">the floor they follow its slope.</text>
      <text x="25" y="240" fill="#f59e0b" fontSize="7">⚠️ MUST be floor-based, otherwise</text>
      <text x="25" y="252" fill="#f59e0b" fontSize="7">it won't follow the slope.</text>
      <rect x="290" y="176" width="255" height="84" rx="6" fill="#eef5ef" stroke="#22c55e" strokeWidth="1"/>
      <text x="300" y="194" fill="#22c55e" fontSize="9" fontWeight="700">Way 2 — Model In-Place + Sweep</text>
      <text x="300" y="210" fill="#6b7280" fontSize="7">Continuous channels. Category: Specialty</text>
      <text x="300" y="222" fill="#6b7280" fontSize="7">Equipment or Plumbing Fixture (schedules).</text>
      <text x="300" y="238" fill="#6b7280" fontSize="7">Sweep → Pick Path → floor edge in 3D</text>
      <text x="300" y="250" fill="#6b7280" fontSize="7">→ sketched profile or Metric Profile.</text>
    </svg>
  ),
  topo: (
    <svg viewBox="0 0 560 270" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="270" rx="8" fill="#ffffff"/>
      <text x="18" y="26" fill="#16241a" fontSize="13" fontWeight="700">Toposurface — triangles, not contours</text>
      <rect x="15" y="42" width="255" height="140" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="24" y="58" fill="#7a8290" fontSize="8">Revit triangulates points (TIN)</text>
      <polygon points="50,150 110,80 170,140" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="0.8"/>
      <polygon points="110,80 170,140 200,70" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="0.8"/>
      <polygon points="170,140 200,70 250,130" fill="#22c55e" opacity="0.08" stroke="#22c55e" strokeWidth="0.8"/>
      <polygon points="50,150 170,140 120,170" fill="#22c55e" opacity="0.12" stroke="#22c55e" strokeWidth="0.8"/>
      <circle cx="50" cy="150" r="3" fill="#f59e0b"/><circle cx="110" cy="80" r="3" fill="#f59e0b"/>
      <circle cx="170" cy="140" r="3" fill="#f59e0b"/><circle cx="200" cy="70" r="3" fill="#f59e0b"/>
      <circle cx="250" cy="130" r="3" fill="#f59e0b"/><circle cx="120" cy="170" r="3" fill="#f59e0b"/>
      <text x="60" y="178" fill="#f59e0b" fontSize="7">points with elevation → triangles</text>
      <rect x="290" y="42" width="255" height="140" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="299" y="58" fill="#7a8290" fontSize="8">⭐ Best practice — TIN from Civil 3D</text>
      <defs><marker id="arT" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c8a80"/></marker></defs>
      <rect x="310" y="70" width="90" height="30" rx="4" fill="#e3f1e7" stroke="#22c55e"/>
      <text x="318" y="89" fill="#15803d" fontSize="8">Civil 3D — TIN</text>
      <path d="M400 85 L425 85" stroke="#7c8a80" strokeWidth="2" markerEnd="url(#arT)"/>
      <rect x="430" y="70" width="50" height="30" rx="4" fill="#e3f1e7" stroke="#22c55e"/>
      <text x="442" y="89" fill="#15803d" fontSize="8">DWG</text>
      <path d="M455 100 L455 120" stroke="#7c8a80" strokeWidth="2" markerEnd="url(#arT)"/>
      <rect x="380" y="125" width="150" height="30" rx="4" fill="#e3f1e7" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="388" y="144" fill="#15803d" fontSize="8">Create from Import → vertices</text>
      <text x="299" y="172" fill="#7a8290" fontSize="7">Far more accurate than contours</text>
      <rect x="15" y="196" width="530" height="64" rx="6" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="25" y="214" fill="#ef4444" fontSize="8" fontWeight="700">⚠️ Toposurface limits:</text>
      <text x="25" y="230" fill="#6b7280" fontSize="8">One single infinite material · no layers · no voids · no water bodies</text>
      <text x="25" y="244" fill="#6b7280" fontSize="8">Few hostable families · no interaction with paving · triangles only</text>
    </svg>
  ),
  cutfill: (
    <svg viewBox="0 0 560 250" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="250" rx="8" fill="#ffffff"/>
      <text x="18" y="26" fill="#16241a" fontSize="13" fontWeight="700">Net / Cut / Fill — Graded Region</text>
      <rect x="15" y="42" width="530" height="130" rx="4" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="24" y="58" fill="#7a8290" fontSize="8">SECTION — existing surface vs design</text>
      <path d="M50 130 Q160 90 280 120 Q400 145 520 110" fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="6,3"/>
      <text x="55" y="120" fill="#6b7280" fontSize="7">existing</text>
      <path d="M50 130 Q160 130 280 95 Q400 95 520 110" fill="none" stroke="#22c55e" strokeWidth="2.5"/>
      <text x="290" y="88" fill="#22c55e" fontSize="7">design (graded region)</text>
      <path d="M160 110 Q220 100 280 108 Q230 116 170 118 Z" fill="#ef4444" opacity="0.25"/>
      <text x="200" y="112" fill="#ef4444" fontSize="8" fontWeight="700">CUT</text>
      <path d="M300 100 Q380 96 460 116 Q380 128 310 112 Z" fill="#3d7ef5" opacity="0.25"/>
      <text x="370" y="112" fill="#3d7ef5" fontSize="8" fontWeight="700">FILL</text>
      <rect x="395" y="145" width="135" height="20" rx="3" fill="#e3f1e7" stroke="#22c55e"/>
      <text x="403" y="158" fill="#15803d" fontSize="7">Properties → Net/Cut/Fill m³</text>
      <rect x="15" y="186" width="530" height="50" rx="6" fill="#ffffff" stroke="#d4e3d8"/>
      <text x="25" y="204" fill="#22c55e" fontSize="8" fontWeight="700">Workflow: Split surface → Graded Region → option 1 (exact copy) → points inside the boundary → read m³</text>
      <text x="25" y="222" fill="#6b7280" fontSize="8">The surface stays editable. Delete it and the terrain returns to its original form.</text>
    </svg>
  )
};

const SYSTEM_PROMPT = (lesson, lang) => {
  const stepsText = (lesson.steps || []).map(s => `${s.icon} ${s.label}: ${s.desc}`).join("\n");
  return lang === "en"
  ? `You are BIMentor Landscape, an AI tutor specialised in teaching Autodesk Revit for Landscape Architecture.
You are direct, practical and patient — like an expert landscape BIM specialist sitting next to the user.
Key context: Revit has NO native landscape tools. The method taught here bends architectural tools to landscape use: Floor tool for paving and grading, Walls for retaining walls, Sweeps for drainage and kerbs, Toposurface for terrain. Worksets follow the S-xx / HL-xx / SL-xx convention.

Current lesson: ${lesson.id} — "${lesson.title}"
Topics: ${lesson.topics.join(", ")}
Objective: ${lesson.objective}

LESSON STEPS (your verified source of truth — base your answers on these, they are accurate):
${stepsText}

RESPONSE RULES:
- Always reply in ENGLISH
- Do NOT use asterisks (**) or hashtags (###) — use emoji and plain text
- Use emoji for section titles (e.g. "🌍 TOPOSURFACE")
- Be concise and practical, get to the point
- Always propose a practical exercise at the end

ANSWERING TECHNICAL QUESTIONS:
- If the user asks a clear, specific question — even if it is about a topic from another lesson — ANSWER IT directly. Do NOT tell them they are in the wrong lesson or redirect them to the lesson path. Help with what they actually asked.
- Adapt to the user's level: if their question shows experience, skip the basics; if they seem new, go step by step.

WHEN YOU ARE NOT 100% SURE OF A PROCEDURE:
- Do NOT invent steps or button names. It is better to verify than to give a confident wrong answer.
- First, ask the user to send a screenshot of what they see on screen ("Send me a screenshot of your screen so I can guide you precisely").
- When a screenshot arrives, analyse it carefully and give specific feedback based on what is actually shown.
- Then point them to the official Autodesk documentation to confirm, using a search link relevant to THEIR specific question, in this format: https://help.autodesk.com/view/RVT/2025/ENU/?query=KEYWORDS (replace KEYWORDS with the exact topic, e.g. "toposurface split surface").

CLOSING:
- When you give a technical procedure, end with a relevant Autodesk documentation link in the format above, matched to the specific question — not a generic one.`
  : `Sei BIMentor Landscape, un tutor AI specializzato in Autodesk Revit per l'Architettura del Paesaggio.
Sei diretto, pratico e paziente — come un BIM specialist landscape esperto seduto accanto all'utente.
Contesto chiave: Revit NON ha tool nativi per il landscape. Il metodo insegnato qui piega i tool architettonici all'uso paesaggistico: Floor per paving e grading, Wall per muri di contenimento, Sweep per drainage e cordoli, Toposurface per il terreno. I worksets seguono la convenzione S-xx / HL-xx / SL-xx.

Lezione corrente: ${lesson.id} — "${lesson.title}"
Argomenti: ${lesson.topics.join(", ")}
Obiettivo: ${lesson.objective}

STEP DELLA LEZIONE (la tua fonte verificata — basa le risposte su questi, sono accurati):
${stepsText}

REGOLE DI RISPOSTA:
- Rispondi SEMPRE in italiano
- NON usare asterischi (**) o cancelletti (###) — usa emoji e testo normale
- Usa emoji per i titoli delle sezioni (es: "🌍 TOPOSURFACE")
- Sii conciso e pratico, vai al punto
- Proponi sempre un esercizio pratico alla fine

RISPONDERE ALLE DOMANDE TECNICHE:
- Se l'utente fa una domanda chiara e specifica — anche se riguarda un argomento di un'altra lezione — RISPONDI direttamente. NON dirgli che è nella lezione sbagliata e non riportarlo al percorso delle lezioni. Aiutalo su ciò che ha davvero chiesto.
- Adattati al livello dell'utente: se la domanda mostra esperienza, salta le basi; se sembra alle prime armi, vai passo per passo.

QUANDO NON SEI SICURO AL 100% DI UNA PROCEDURA:
- NON inventare passaggi o nomi di pulsanti. È meglio verificare che dare una risposta sbagliata con sicurezza.
- Per prima cosa, chiedi all'utente di mandare uno screenshot di cosa vede a schermo ("Mandami uno screenshot del tuo schermo così ti guido con precisione").
- Quando arriva uno screenshot, analizzalo con attenzione e dai un feedback specifico basato su ciò che è realmente mostrato.
- Poi rimanda alla documentazione ufficiale Autodesk per conferma, con un link di ricerca pertinente alla SUA domanda specifica, in questo formato: https://help.autodesk.com/view/RVT/2025/ENU/?query=PAROLE (sostituisci PAROLE con l'argomento esatto, es. "toposurface split surface").

CHIUSURA:
- Quando dai una procedura tecnica, chiudi con un link alla documentazione Autodesk nel formato sopra, mirato alla domanda specifica — non generico.`;
};

function renderText(text) {
  return text.split("\n").map((line, i) => {
    if (line === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid #d4e3d8", margin: "10px 0" }} />;
    if (line.trim() === "") return <div key={i} style={{ height: "5px" }} />;
    if (line.startsWith("- ")) return (
      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "3px", paddingLeft: "4px" }}>
        <span style={{ color: "#22c55e", flexShrink: 0 }}>›</span>
        <span>{line.slice(2)}</span>
      </div>
    );
    return <div key={i} style={{ marginBottom: "2px", lineHeight: "1.7" }}>{line}</div>;
  });
}

export default function LandscapeTutor() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [showWelcome, setShowWelcome] = useState(true);
  const [lang, setLang] = useState("it");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = T[lang];
  const curriculum = lang === "en" ? CURRICULUM_EN : CURRICULUM;
  const lesson = curriculum[currentLesson];
  const progress = Math.round((currentLesson / curriculum.length) * 100);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { setMessages([]); setImageData(null); setImagePreview(null); }, [currentLesson]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData({ base64: ev.target.result.split(",")[1], mediaType: file.type });
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const callAPI = async (msgs) => {
    const cleanMsgs = msgs.filter(m => !(m.role === "assistant" && (!m.rawContent || m.rawContent === "")));
    const trimmed = cleanMsgs.slice(-12);
    const startIdx = trimmed.findIndex(m => m.role === "user");
    const validMsgs = startIdx >= 0 ? trimmed.slice(startIdx) : trimmed;
    const apiMsgs = validMsgs.map(m => ({
      role: m.role,
      content: m.role === "user" ? m.content : (m.rawContent || "...")
    }));

    let lastError = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY || "",
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1500, system: SYSTEM_PROMPT(lesson, lang), messages: apiMsgs })
        });
        const data = await response.json();
        if (data.error) { lastError = data.error.message || JSON.stringify(data.error); continue; }
        const text = data.content?.find(b => b.type === "text")?.text;
        if (text) return text;
        lastError = lang === "en" ? "Empty response from server" : "Risposta vuota dal server";
      } catch (e) {
        lastError = e.message || (lang === "en" ? "Network error" : "Errore di rete");
      }
    }
    throw new Error(lastError);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && !imageData) return;
    const userContent = [];
    if (imageData) userContent.push({ type: "image", source: { type: "base64", media_type: imageData.mediaType, data: imageData.base64 } });
    if (text) userContent.push({ type: "text", text });
    const userMsg = { role: "user", content: userContent, displayText: text, hasImage: !!imageData };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput(""); setImageData(null); setImagePreview(null);
    setLoading(true);
    try {
      const reply = await callAPI(newMsgs);
      setMessages(prev => [...prev, { role: "assistant", content: reply, rawContent: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e.message}`, rawContent: "" }]);
    }
    setLoading(false);
  };

  const startLesson = async () => {
    setMessages([]); setLoading(true); setActiveTab("chat");
    try {
      const reply = await callAPI([{ role: "user", content: t.startPrompt, rawContent: t.startPrompt }]);
      setMessages([{ role: "assistant", content: reply, rawContent: reply }]);
    } catch (e) {
      setMessages([{ role: "assistant", content: `⚠️ ${e.message}`, rawContent: "" }]);
    }
    setLoading(false);
  };

  const askAboutStep = async (step) => {
    const text = t.askStepPrompt(step.icon, step.label) + ` — ${step.desc}`;
    const userMsg = { role: "user", content: [{ type: "text", text }], displayText: t.askStepDisplay(step.icon, step.label), hasImage: false };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setActiveTab("chat"); setLoading(true);
    try {
      const reply = await callAPI(newMsgs);
      setMessages(prev => [...prev, { role: "assistant", content: reply, rawContent: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e.message}`, rawContent: "" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  let lastSection = null;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f8f4", color: "#16241a", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", position: "relative" }}>

      {showWelcome && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(228,238,230,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
          <div style={{ maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto", background: "#ffffff", border: "1px solid #cfe2d5", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #22c55e, #0d9488)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🌿</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.3px" }}>{t.welcomeTitle}</div>
                <div style={{ fontSize: "12px", color: "#8a92a0" }}>{t.welcomeSubtitle}</div>
              </div>
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {["it", "en"].map(l => (
                  <button key={l} onClick={() => { setLang(l); setMessages([]); }} style={{ padding: "5px 10px", borderRadius: "6px", border: `1px solid ${lang === l ? "#22c55e" : "#cfe2d5"}`, background: lang === l ? "rgba(34,197,94,0.12)" : "transparent", color: lang === l ? "#22c55e" : "#8a92a0", fontSize: "13px", cursor: "pointer", fontWeight: lang === l ? "700" : "400" }}>
                    {l === "it" ? "🇮🇹" : "🇬🇧"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.7", marginBottom: "20px" }}>{t.welcomeIntro}</div>
            {t.welcomeFeatures.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", padding: "12px", background: "#f3f8f4", border: "1px solid #cfe2d5", borderRadius: "10px" }}>
                <div style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#2a3a30", marginBottom: "2px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.7", padding: "12px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px", marginBottom: "20px" }}>
              💡 <span style={{ color: "#15803d", fontWeight: "600" }}>{t.welcomeTip}</span> {t.welcomeTipText}
            </div>
            <button onClick={() => setShowWelcome(false)} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #22c55e, #0d9488)", color: "#0a2814", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {t.welcomeStart}
            </button>
          </div>
        </div>
      )}

      <div style={{ width: sidebarOpen ? "262px" : "0", minWidth: sidebarOpen ? "262px" : "0", background: "#ffffff", borderRight: "1px solid #dde9e0", display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.25s ease", flexShrink: 0 }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid #dde9e0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #22c55e, #0d9488)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>🌿</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "-0.3px" }}>BIMentor</div>
              <div style={{ fontSize: "10px", color: "#7c8a80" }}>{t.appSubtitle}</div>
            </div>
          </div>
          <div style={{ marginTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#7c8a80", marginBottom: "4px" }}>
              <span>{t.progress}</span><span style={{ color: "#22c55e" }}>{currentLesson}/{curriculum.length}</span>
            </div>
            <div style={{ height: "2px", background: "#dde9e0", borderRadius: "2px" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #22c55e, #0d9488)", borderRadius: "2px", transition: "width 0.4s" }} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px" }}>
          {curriculum.map((item, i) => {
            const showDivider = item.section !== lastSection;
            lastSection = item.section;
            return (
              <React.Fragment key={item.id}>
                {showDivider && (
                  <div style={{ padding: "10px 12px 4px", fontSize: "9px", fontWeight: "700", letterSpacing: "1px", color: item.section === "landscape" ? "#22c55e" : "#7c8a80" }}>
                    {item.section === "landscape" ? `🌿 ${t.sectionLandscape}` : t.sectionBase}
                  </div>
                )}
                <button onClick={() => setCurrentLesson(i)} style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: "6px", border: "none", cursor: "pointer", marginBottom: "1px", background: currentLesson === i ? "rgba(34,197,94,0.1)" : "transparent", borderLeft: `2px solid ${currentLesson === i ? "#22c55e" : "transparent"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: i < currentLesson ? "#22c55e" : currentLesson === i ? "#22c55e" : "#cdddd0", minWidth: "16px" }}>
                      {i < currentLesson ? "✓" : String(item.id).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "12px", color: currentLesson === i ? "#16241a" : i < currentLesson ? "#7c8a80" : "#6b7280", fontWeight: currentLesson === i ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #dde9e0", display: "flex", alignItems: "center", gap: "10px", background: "#ffffff", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", color: "#c0d2c5", cursor: "pointer", fontSize: "17px", padding: "2px", lineHeight: 1, flexShrink: 0 }}>☰</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "10px", color: "#c0d2c5" }}>{t.lessonOf(lesson.id, curriculum.length)}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</div>
          </div>
          <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
            {["it","en"].map(l => (
              <button key={l} onClick={() => { setLang(l); setMessages([]); }} style={{ padding: "3px 7px", borderRadius: "5px", border: `1px solid ${lang === l ? "#22c55e" : "#dde9e0"}`, background: lang === l ? "rgba(34,197,94,0.1)" : "transparent", color: lang === l ? "#22c55e" : "#c0d2c5", fontSize: "12px", cursor: "pointer" }}>
                {l === "it" ? "🇮🇹" : "🇬🇧"}
              </button>
            ))}
          </div>
          <button onClick={() => setShowWelcome(true)} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #dde9e0", background: "transparent", color: "#8a92a0", cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>?</button>
          <a href={lesson.docsUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid #dde9e0", background: "transparent", color: "#8a92a0", textDecoration: "none", fontSize: "11px", flexShrink: 0 }}>{t.docsBtn}</a>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.videoQuery || ("Revit " + lesson.title))}`} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid #dde9e0", background: "transparent", color: "#8a92a0", textDecoration: "none", fontSize: "11px", flexShrink: 0 }}>{t.videoBtn}</a>
          <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
            <button onClick={() => setCurrentLesson(i => Math.max(0, i - 1))} disabled={currentLesson === 0} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #dde9e0", background: "transparent", color: currentLesson === 0 ? "#dde9e0" : "#8a92a0", cursor: currentLesson === 0 ? "not-allowed" : "pointer", fontSize: "11px" }}>{t.prev}</button>
            <button onClick={() => setCurrentLesson(i => Math.min(curriculum.length - 1, i + 1))} disabled={currentLesson === curriculum.length - 1} style={{ padding: "4px 9px", borderRadius: "5px", border: "none", background: "linear-gradient(135deg, #22c55e, #0d9488)", color: "#0a2814", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>{t.next}</button>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #dde9e0", background: "#ffffff", flexShrink: 0 }}>
          {["chat", "steps"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 16px", border: "none", background: "transparent", color: activeTab === tab ? "#22c55e" : "#c0d2c5", fontSize: "12px", fontWeight: activeTab === tab ? "600" : "400", cursor: "pointer", borderBottom: `2px solid ${activeTab === tab ? "#22c55e" : "transparent"}` }}>
              {tab === "chat" ? t.tabChat : t.tabSteps}
            </button>
          ))}
        </div>

        {activeTab === "steps" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <div style={{ marginBottom: "14px", padding: "12px", background: "#ffffff", border: "1px solid #dde9e0", borderRadius: "8px" }}>
              <div style={{ fontSize: "10px", color: "#c0d2c5", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.objective}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>{lesson.objective}</div>
            </div>
            {lesson.diagram && DIAGRAMS[lesson.diagram] && (
              <div style={{ marginBottom: "14px", padding: "12px", background: "#f3f8f4", border: "1px solid #dde9e0", borderRadius: "8px" }}>
                <div style={{ fontSize: "10px", color: "#c0d2c5", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.diagram}</div>
                {DIAGRAMS[lesson.diagram]}
              </div>
            )}
            <div style={{ fontSize: "10px", color: "#c0d2c5", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.steps}</div>
            {lesson.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px", padding: "12px 14px", background: "#ffffff", border: "1px solid #dde9e0", borderRadius: "9px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>{step.icon}</div>
                  <div style={{ fontSize: "9px", fontWeight: "700", color: "#22c55e" }}>{String(i + 1).padStart(2, "0")}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#3a4a40", marginBottom: "3px" }}>{step.label}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>{step.desc}</div>
                  <button onClick={() => askAboutStep(step)} style={{ marginTop: "8px", padding: "3px 10px", borderRadius: "5px", border: "1px solid #dde9e0", background: "transparent", color: "#22c55e", fontSize: "11px", cursor: "pointer" }}>{t.askAI}</button>
                </div>
              </div>
            ))}
            <a href={lesson.docsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#ffffff", border: "1px solid #dde9e0", borderRadius: "8px", color: "#7c8a80", textDecoration: "none", fontSize: "12px", marginTop: "4px" }}>
              <span>📖</span><span>{t.officialDocs} — {lesson.title}</span><span style={{ marginLeft: "auto" }}>↗</span>
            </a>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.videoQuery || ("Revit " + lesson.title))}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#ffffff", border: "1px solid #dde9e0", borderRadius: "8px", color: "#7c8a80", textDecoration: "none", fontSize: "12px", marginTop: "4px" }}>
              <span>🎥</span><span>{t.videoBtn} — YouTube</span><span style={{ marginLeft: "auto" }}>↗</span>
            </a>
          </div>
        )}

        {activeTab === "chat" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {messages.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "14px", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #22c55e, #0d9488)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🌿</div>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "5px" }}>{lesson.title}</div>
                    <div style={{ fontSize: "12px", color: "#7c8a80", maxWidth: "300px", lineHeight: "1.6" }}>{lesson.objective}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={startLesson} style={{ padding: "9px 22px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #22c55e, #0d9488)", color: "#0a2814", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>{t.startLesson}</button>
                    <button onClick={() => setActiveTab("steps")} style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #dde9e0", background: "transparent", color: "#8a92a0", fontSize: "13px", cursor: "pointer" }}>{t.viewGuide}</button>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: "14px", display: "flex", gap: "8px", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "6px", flexShrink: 0, background: msg.role === "user" ? "#dde9e0" : "linear-gradient(135deg, #22c55e, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
                    {msg.role === "user" ? "👤" : "🌿"}
                  </div>
                  <div style={{ maxWidth: "82%", minWidth: 0 }}>
                    {msg.hasImage && <div style={{ marginBottom: "4px", fontSize: "10px", color: "#c0d2c5" }}>{t.screenshotLabel}</div>}
                    <div style={{ padding: "11px 13px", borderRadius: msg.role === "user" ? "11px 2px 11px 11px" : "2px 11px 11px 11px", background: msg.role === "user" ? "#e7f0e8" : "#ffffff", border: "1px solid #dde9e0", fontSize: "13px", color: "#3a4a40" }}>
                      {msg.role === "assistant" ? renderText(msg.content) : <span style={{ whiteSpace: "pre-wrap" }}>{msg.displayText || ""}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "linear-gradient(135deg, #22c55e, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>🌿</div>
                  <div style={{ padding: "11px 13px", borderRadius: "2px 11px 11px 11px", background: "#ffffff", border: "1px solid #dde9e0", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0,1,2].map(j => <div key={j} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", animation: `pulse 1.2s ease-in-out ${j*0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {imagePreview && (
              <div style={{ padding: "7px 16px 0", display: "flex", alignItems: "center", gap: "7px", background: "#f3f8f4" }}>
                <img src={imagePreview} style={{ height: "44px", borderRadius: "5px", border: "1px solid #dde9e0" }} alt="preview" />
                <button onClick={() => { setImageData(null); setImagePreview(null); }} style={{ background: "#dde9e0", border: "none", color: "#6b7280", cursor: "pointer", borderRadius: "4px", padding: "2px 8px", fontSize: "11px" }}>✕</button>
              </div>
            )}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #dde9e0", background: "#ffffff", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "7px", alignItems: "flex-end" }}>
                <button onClick={() => fileInputRef.current?.click()} style={{ padding: "7px", borderRadius: "7px", border: "1px solid #dde9e0", background: "#f3f8f4", color: "#c0d2c5", cursor: "pointer", fontSize: "15px", flexShrink: 0, lineHeight: 1 }}>📎</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.inputPlaceholder} rows={1}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "7px", border: "1px solid #dde9e0", background: "#f3f8f4", color: "#16241a", fontSize: "13px", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: "1.5", maxHeight: "90px" }}
                  onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px"; }} />
                <button onClick={sendMessage} disabled={loading || (!input.trim() && !imageData)}
                  style={{ padding: "8px 14px", borderRadius: "7px", border: "none", background: loading || (!input.trim() && !imageData) ? "#dde9e0" : "linear-gradient(135deg, #22c55e, #0d9488)", color: loading || (!input.trim() && !imageData) ? "#cdddd0" : "#0a2814", cursor: loading || (!input.trim() && !imageData) ? "not-allowed" : "pointer", fontWeight: "700", fontSize: "12px", flexShrink: 0 }}>
                  {t.send}
                </button>
              </div>
              <div style={{ marginTop: "4px", fontSize: "10px", color: "#dde9e0", textAlign: "center" }}>{t.inputHint}</div>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#dde9e0;border-radius:2px}
        *{box-sizing:border-box} a:hover{opacity:0.8} button:hover:not(:disabled){opacity:0.85}
      `}</style>
    </div>
  );
}
