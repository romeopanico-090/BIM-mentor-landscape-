import React, { useState, useRef, useEffect } from "react";

const CURRICULUM = [
  { id: 1, title: "User Interface", topics: ["Ribbon e schede principali", "Properties panel", "Project Browser", "Creare Plan Views", "Line Styles e Line Patterns", "Fill Patterns"], objective: "Orientarsi in Revit e capire dove si trovano i controlli principali.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=user%20interface", videoQuery: "Revit user interface tutorial beginner",
    steps: [
      { icon: "🖥️", label: "Apri Revit", desc: "Avvia Revit e apri un nuovo progetto con il template Architectural." },
      { icon: "📌", label: "Esplora il Ribbon", desc: "In cima trovi il Ribbon: clicca su Architecture, Structure, Annotate, View e osserva i pannelli che cambiano." },
      { icon: "📋", label: "Properties Panel", desc: "A sinistra in alto: mostra le proprietà dell'elemento selezionato. Se nulla è selezionato, mostra la vista corrente." },
      { icon: "🗂️", label: "Project Browser", desc: "A sinistra in basso: elenca tutte le viste, sheets, famiglie e gruppi del progetto." },
      { icon: "🔍", label: "Area di disegno", desc: "Al centro: qui disegni. Usa la rotella del mouse per zoom, tieni premuto il tasto centrale per pan." },
    ],
    diagram: "ui"
  },
  { id: 2, title: "Concetti BIM", topics: ["BIM vs CAD", "Livelli (Levels)", "Griglie (Grids)", "Discipline e viste"], objective: "Capire la logica BIM prima di modellare qualsiasi elemento.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=levels%20grids", videoQuery: "Revit levels grids BIM basics",
    steps: [
      { icon: "💡", label: "BIM vs CAD", desc: "In CAD disegni linee. In Revit costruisci un edificio 3D — ogni elemento ha dati reali: materiale, costo, area." },
      { icon: "📏", label: "Levels", desc: "Architecture → Datum → Level. I livelli definiscono le quote dei piani. Ogni muro si aggancia a un livello." },
      { icon: "⊞", label: "Grids", desc: "Architecture → Datum → Grid. Le griglie definiscono gli assi strutturali come riferimento." },
    ],
    diagram: "bim"
  },
  { id: 3, title: "Wall", topics: ["System families", "Compound walls", "Stacked walls", "Editare la struttura del muro"], objective: "Creare e modificare muri di diversi tipi e spessori.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=walls", videoQuery: "Revit wall tool tutorial",
    steps: [
      { icon: "🧱", label: "Wall Tool", desc: "Architecture → Build → Wall → Wall: Architectural." },
      { icon: "📐", label: "Scegli il tipo", desc: "Properties panel: clicca il tipo di muro (es. Basic Wall 200mm) e cambialo dal menu." },
      { icon: "✏️", label: "Disegna", desc: "Clicca due punti nell'area di disegno. Premi ESC per uscire dal tool." },
      { icon: "⚙️", label: "Edit Structure", desc: "Seleziona il muro → Properties → Edit Type → Edit Structure per modificare strati." },
    ],
    diagram: "wall"
  },
  { id: 4, title: "Door & Window", topics: ["Inserire porte e finestre", "Modificare parametri", "Tag automatici", "Allineamento"], objective: "Inserire porte e finestre correttamente in un muro.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=doors%20windows", videoQuery: "Revit doors windows tutorial",
    steps: [
      { icon: "🚪", label: "Door Tool", desc: "Architecture → Build → Door. Avvicinati a un muro e clicca per inserire." },
      { icon: "🪟", label: "Window Tool", desc: "Architecture → Build → Window. Clicca sul muro dove vuoi la finestra." },
      { icon: "↔️", label: "Inverti orientamento", desc: "Dopo l'inserimento appaiono frecce blu: cliccale per invertire apertura." },
      { icon: "🏷️", label: "Tag automatico", desc: "Annotate → Tag → Tag All per etichettare tutte le porte e finestre." },
    ],
    diagram: "door"
  },
  { id: 5, title: "Component & Column", topics: ["Loadable components", "Colonne architetturali", "Colonne strutturali"], objective: "Inserire componenti e colonne nel modello.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=components%20columns", videoQuery: "Revit component column placement",
    steps: [
      { icon: "🪑", label: "Component Tool", desc: "Architecture → Build → Component. Inserisce famiglie loadable come mobili e arredi." },
      { icon: "🏛️", label: "Column Tool", desc: "Architecture → Build → Column: Architectural per colonne decorative." },
      { icon: "📦", label: "Load Family", desc: "Se non disponibile, clicca Load Family nel ribbon per cercare nelle librerie." },
    ],
    diagram: null
  },
  { id: 6, title: "Floor", topics: ["Compound floors", "Boundary e sketch mode", "Floor slope", "Core boundary"], objective: "Creare pavimenti con struttura compound e gestire i bordi.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=floors", videoQuery: "Revit floor tool tutorial",
    steps: [
      { icon: "⬛", label: "Floor Tool", desc: "Architecture → Build → Floor: Architectural. Entri in Sketch Mode." },
      { icon: "✏️", label: "Sketch Boundary", desc: "Disegna il perimetro chiuso con Boundary Line." },
      { icon: "✅", label: "Finish Sketch", desc: "Clicca il segno di spunta verde (Finish Edit Mode)." },
      { icon: "📐", label: "Edit Structure", desc: "Seleziona il floor → Edit Type → Edit Structure per aggiungere strati." },
    ],
    diagram: "floor"
  },
  { id: 7, title: "Ceiling", topics: ["Compound ceilings", "Gestione quota", "Pattern e griglia", "Automatic ceiling"], objective: "Creare soffitti e gestirne l'altezza e il pattern.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=ceilings", videoQuery: "Revit ceiling tutorial",
    steps: [
      { icon: "⬜", label: "Ceiling Tool", desc: "Architecture → Build → Ceiling. Usa Automatic Ceiling cliccando dentro un ambiente chiuso." },
      { icon: "📏", label: "Imposta la quota", desc: "Properties panel: modifica Height Offset From Level." },
      { icon: "🔲", label: "Cambia pattern", desc: "Edit Type → modifica il Compound Structure per materiale e pattern." },
    ],
    diagram: null
  },
  { id: 8, title: "Roof", topics: ["Roof by footprint", "Roof by extrusion", "Slope arrow", "Overhang e fascia"], objective: "Modellare tetti a falda e piani in modo corretto.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=roofs", videoQuery: "Revit roof tutorial",
    steps: [
      { icon: "🏠", label: "Roof by Footprint", desc: "Architecture → Build → Roof → Roof by Footprint." },
      { icon: "📐", label: "Imposta slope", desc: "Seleziona ogni lato → Properties → attiva Defines Roof Slope e imposta l'angolo." },
      { icon: "↔️", label: "Overhang", desc: "Properties: imposta Overhang per far sporgere il tetto." },
      { icon: "🏗️", label: "Roof by Extrusion", desc: "Utile per tetti a botte: disegna il profilo in sezione e estrudi lungo un asse." },
    ],
    diagram: null
  },
  { id: 9, title: "Curtain Wall & Mullions", topics: ["Sistema curtain wall", "Curtain grid", "Pannelli", "Mullioni"], objective: "Creare facciate continue con griglie e montanti personalizzati.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=curtain%20walls", videoQuery: "Revit curtain wall mullions tutorial",
    steps: [
      { icon: "🏢", label: "Curtain Wall", desc: "Architecture → Build → Wall → scegli tipo Curtain Wall." },
      { icon: "⊞", label: "Curtain Grid", desc: "Architecture → Build → Curtain Grid. Clicca sul muro per aggiungere griglie." },
      { icon: "🔳", label: "Mullion", desc: "Architecture → Build → Mullion. Clicca sulle linee di griglia per i montanti." },
      { icon: "🚪", label: "Sostituisci pannello", desc: "Seleziona pannello → Properties → cambia tipo (es. porta o pannello opaco)." },
    ],
    diagram: null
  },
  { id: 10, title: "Stairs & Railing", topics: ["Stair by component", "Run e landing", "Railing", "Custom baluster"], objective: "Modellare scale e corrimano con la geometria corretta.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=stairs%20railings", videoQuery: "Revit stairs railing tutorial",
    steps: [
      { icon: "🪜", label: "Stair Tool", desc: "Architecture → Circulation → Stair." },
      { icon: "➡️", label: "Crea Run", desc: "Clicca Run e disegna la direzione. Revit conta i gradini automaticamente." },
      { icon: "⬛", label: "Landing", desc: "Con più rampe, Revit crea il pianerottolo automaticamente." },
      { icon: "🔧", label: "Railing", desc: "Architecture → Circulation → Railing. Aggancia a percorso o scala esistente." },
    ],
    diagram: null
  },
  { id: 11, title: "Opening", topics: ["Wall opening", "Shaft opening", "Vertical opening"], objective: "Creare aperture negli elementi del modello.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=openings", videoQuery: "Revit shaft opening tutorial",
    steps: [
      { icon: "🔲", label: "Wall Opening", desc: "Architecture → Opening → Wall Opening. Clicca il muro e disegna il rettangolo." },
      { icon: "⬇️", label: "Shaft Opening", desc: "Architecture → Opening → Shaft. Taglia verticalmente attraverso più livelli." },
      { icon: "⬜", label: "Vertical Opening", desc: "Architecture → Opening → Vertical. Taglia in un pavimento o tetto." },
    ],
    diagram: null
  },
  { id: 12, title: "Room & Area", topics: ["Room placement", "Room tag", "Area plan", "Color fill"], objective: "Definire e visualizzare ambienti e aree nel modello.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=rooms%20areas", videoQuery: "Revit rooms areas tutorial",
    steps: [
      { icon: "🏠", label: "Room Tool", desc: "Architecture → Room & Area → Room. Clicca dentro un ambiente chiuso." },
      { icon: "🏷️", label: "Room Tag", desc: "Il tag appare automaticamente. Doppio clic per rinominare." },
      { icon: "🗺️", label: "Area Plan", desc: "Architecture → Room & Area → Area Plan." },
      { icon: "🎨", label: "Color Fill", desc: "Annotate → Color Fill → Color Fill Legend per colorare ambienti." },
    ],
    diagram: null
  },
  { id: 13, title: "Materiali", topics: ["Material browser", "Creare materiale", "Surface pattern", "Cut pattern", "Render appearance"], objective: "Creare materiali personalizzati e assegnarli agli elementi.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=materials", videoQuery: "Revit materials tutorial",
    steps: [
      { icon: "🎨", label: "Material Browser", desc: "Manage → Materials. Si apre il browser dei materiali." },
      { icon: "➕", label: "Crea materiale", desc: "Clicca + in basso. Rinomina il materiale." },
      { icon: "🖼️", label: "Surface Pattern", desc: "Tab Graphics → Surface Pattern: texture 2D in pianta/prospetto." },
      { icon: "✂️", label: "Cut Pattern", desc: "Tab Graphics → Cut Pattern: retino di sezione." },
    ],
    diagram: null
  },
  { id: 14, title: "Famiglie — Parte 1", topics: ["Cos'è una famiglia", "System vs Loadable vs In-place", "Logica parametrica"], objective: "Capire la struttura delle famiglie dopo aver usato gli elementi reali.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=families", videoQuery: "Revit families explained system loadable",
    steps: [
      { icon: "📦", label: "Cosa sono", desc: "Ogni elemento in Revit è una Famiglia. Muri, porte, finestre — sono tutte famiglie." },
      { icon: "🧱", label: "System Families", desc: "Non caricabili: muri, pavimenti, soffitti, tetti. Esistono solo nel progetto." },
      { icon: "📂", label: "Loadable Families", desc: "File .rfa: porte, finestre, mobili. Puoi crearne di nuove." },
      { icon: "✏️", label: "In-place Families", desc: "Geometrie uniche nel progetto. Solo per forme non standard." },
    ],
    diagram: "families"
  },
  { id: 15, title: "Famiglie — Parte 2", topics: ["Tipo vs Istanza", "Type parameters", "Instance parameters"], objective: "Distinguere e modificare parametri di tipo e di istanza.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=type%20instance%20properties", videoQuery: "Revit type instance parameters",
    steps: [
      { icon: "📋", label: "Type vs Instance", desc: "TYPE: cambia tutte le copie. INSTANCE: cambia solo l'elemento selezionato." },
      { icon: "⚙️", label: "Edit Type", desc: "Properties → Edit Type. Modifica parametri che cambiano TUTTI gli elementi." },
      { icon: "📐", label: "Instance Parameters", desc: "Properties senza Edit Type: cambiano solo l'elemento selezionato." },
    ],
    diagram: null
  },
  { id: 16, title: "Famiglie — Parte 3", topics: ["Family Editor", "Reference planes", "Extrusion", "Parametri dimensionali"], objective: "Creare una famiglia loadable semplice da zero.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=family%20editor", videoQuery: "Revit family editor create family",
    steps: [
      { icon: "📁", label: "Family Editor", desc: "File → New → Family. Scegli template (es. Generic Model.rft)." },
      { icon: "✚", label: "Reference Planes", desc: "Create → Datum → Reference Plane. Base su cui si aggancia la geometria." },
      { icon: "📦", label: "Extrusion", desc: "Create → Forms → Extrusion. Profilo 2D + profondità = solido 3D." },
      { icon: "📏", label: "Parametri", desc: "Aggiungi quota → lucchetto → Label. La famiglia diventa parametrica." },
      { icon: "💾", label: "Carica nel progetto", desc: "Create → Load into Project." },
    ],
    diagram: null
  },
  { id: 17, title: "Visibility & Graphics", topics: ["VG overrides", "Filtri", "View templates"], objective: "Controllare la grafica delle viste e creare view templates.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=visibility%20graphics", videoQuery: "Revit visibility graphics overrides",
    steps: [
      { icon: "👁️", label: "Apri VG", desc: "Shortcut: VV. Apre Visibility/Graphics per la vista corrente." },
      { icon: "📂", label: "Override categorie", desc: "Model Categories: nascondi categorie o cambia colore/spessore linee." },
      { icon: "🔍", label: "Filtri", desc: "Tab Filters: regole su parametri (es. mostra in rosso muri con Fire Rating 2h)." },
      { icon: "📋", label: "View Template", desc: "View → View Templates → Create Template. Salva impostazioni riutilizzabili." },
    ],
    diagram: null
  },
  { id: 18, title: "Viste e Sezioni", topics: ["Piante di piano", "Prospetti", "Sezioni", "Callout", "Viste 3D"], objective: "Creare e gestire tutti i tipi di vista per la documentazione.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=views%20sections", videoQuery: "Revit views sections tutorial",
    steps: [
      { icon: "📐", label: "Floor Plan", desc: "View → Create → Plan Views → Floor Plan. Scegli il livello." },
      { icon: "⬆️", label: "Elevation", desc: "View → Create → Elevation. Clicca per posizionare il simbolo." },
      { icon: "✂️", label: "Section", desc: "View → Create → Section. Disegna la linea di taglio." },
      { icon: "🔍", label: "Callout", desc: "View → Create → Callout. Rettangolo su una zona per dettaglio ingrandito." },
      { icon: "📦", label: "Vista 3D", desc: "View → Create → 3D View → Default 3D View." },
    ],
    diagram: null
  },
  { id: 19, title: "Massing & Site", topics: ["Conceptual mass", "Model by face", "Toposurface", "Building pad"], objective: "Generare elementi architettonici da masse e modellare il sito.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=massing%20site", videoQuery: "Revit massing site toposurface",
    steps: [
      { icon: "🏗️", label: "Massing Tool", desc: "Massing & Site → Conceptual Mass → In-Place Mass." },
      { icon: "🧱", label: "Model by Face", desc: "Seleziona massa → Model by Face: crea muri/pavimenti/tetti dalle facce." },
      { icon: "🌍", label: "Toposurface", desc: "Massing & Site → Model Site → Toposurface. Clicca punti con quota." },
      { icon: "⬛", label: "Building Pad", desc: "Massing & Site → Building Pad. Piattaforma piana che taglia il terreno." },
    ],
    diagram: null
  },
  { id: 20, title: "Design Options", topics: ["Option sets", "Varianti", "Confrontare opzioni"], objective: "Gestire varianti di progetto nello stesso file.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=design%20options", videoQuery: "Revit design options tutorial",
    steps: [
      { icon: "⚙️", label: "Design Options", desc: "Manage → Design Options. Crea Option Set con opzioni diverse." },
      { icon: "✏️", label: "Modifica opzione", desc: "Seleziona opzione dal menu in basso → disegna elementi per quella variante." },
      { icon: "👁️", label: "Confronta", desc: "In ogni vista puoi impostare quale opzione visualizzare." },
      { icon: "✅", label: "Accetta", desc: "Manage → Design Options → Accept Primary." },
    ],
    diagram: null
  },
  { id: 21, title: "Schedules", topics: ["Room schedule", "Door/window schedule", "Formule", "Export Excel"], objective: "Creare abachi automatici estratti dal modello.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=schedules", videoQuery: "Revit schedules tutorial",
    steps: [
      { icon: "📊", label: "Crea Schedule", desc: "View → Create → Schedules → Schedule/Quantities. Scegli categoria." },
      { icon: "➕", label: "Aggiungi campi", desc: "Tab Fields: aggiungi parametri (Width, Height, Mark, Level)." },
      { icon: "🔽", label: "Filtra e ordina", desc: "Tab Filter + Sorting/Grouping: raggruppa per tipo o livello." },
      { icon: "📤", label: "Export Excel", desc: "File → Export → Reports → Schedule → .txt → apri in Excel." },
    ],
    diagram: null
  },
  { id: 22, title: "Annotazioni", topics: ["Quote", "Testi", "Tag", "Spot elevation"], objective: "Annotare correttamente le viste per la documentazione.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=dimensions%20annotations", videoQuery: "Revit annotations dimensions tags",
    steps: [
      { icon: "📏", label: "Aligned Dimension", desc: "Annotate → Dimension → Aligned. Clicca elementi, poi clicca lontano per quota." },
      { icon: "📝", label: "Text", desc: "Annotate → Text → Text. Clicca e scrivi." },
      { icon: "🏷️", label: "Tag by Category", desc: "Annotate → Tag → Tag by Category. Clicca elemento per tag automatico." },
      { icon: "📍", label: "Spot Elevation", desc: "Annotate → Dimension → Spot Elevation. Clicca pavimento per quota assoluta." },
    ],
    diagram: null
  },
  { id: 23, title: "Sheets", topics: ["Creare sheets", "Titleblock", "Viste sul foglio", "Revisioni"], objective: "Comporre e organizzare le tavole di progetto.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=sheets%20titleblock", videoQuery: "Revit sheets titleblock tutorial",
    steps: [
      { icon: "📄", label: "Nuovo Sheet", desc: "View → Sheet Composition → Sheet. Scegli titleblock." },
      { icon: "🖼️", label: "Aggiungi viste", desc: "Dal Project Browser, trascina una vista sullo sheet." },
      { icon: "📐", label: "Allinea viste", desc: "Seleziona viewport → Align (AL). Blocca con lucchetto." },
      { icon: "📋", label: "Titleblock", desc: "Doppio clic sul titleblock per compilare numero tavola, titolo, data." },
    ],
    diagram: null
  },
  { id: 24, title: "Links", topics: ["Collegare modelli RVT", "Overlay vs Attachment", "CAD link"], objective: "Collegare modelli di discipline diverse.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=link%20models", videoQuery: "Revit link models CAD tutorial",
    steps: [
      { icon: "🔗", label: "Insert Link", desc: "Insert → Link Revit. Scegli il file .rvt da collegare." },
      { icon: "⚙️", label: "Overlay vs Attachment", desc: "Overlay: non si propaga. Attachment: si propaga. Default: Overlay." },
      { icon: "📋", label: "Manage Links", desc: "Insert → Manage Links. Ricarica, rimuovi o aggiorna link." },
      { icon: "📂", label: "CAD Link", desc: "Insert → Link CAD. Collega DWG come riferimento senza incorporarlo." },
    ],
    diagram: null
  },
  { id: 25, title: "Manage & Coordinate", topics: ["Project base point", "Survey point", "Shared coordinates", "Copy/Monitor"], objective: "Gestire il sistema di coordinate tra modelli collegati.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=shared%20coordinates", videoQuery: "Revit manage coordinate copy monitor",
    steps: [
      { icon: "📍", label: "Project Base Point", desc: "Punto di riferimento interno. Cerchio con X in pianta." },
      { icon: "🌍", label: "Survey Point", desc: "Punto geografico reale per coordinarsi con altri modelli." },
      { icon: "🔄", label: "Shared Coordinates", desc: "Manage → Coordinates → Acquire/Publish Coordinates." },
      { icon: "👁️", label: "Copy/Monitor", desc: "Collaborate → Copy/Monitor. Copia levels/grids dal modello linkato." },
    ],
    diagram: null
  },
  { id: 26, title: "Export", topics: ["DWG", "PDF", "IFC", "NWC Navisworks"], objective: "Esportare il modello nei formati richiesti.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=export%20dwg%20ifc", videoQuery: "Revit export DWG PDF IFC",
    steps: [
      { icon: "📤", label: "Export DWG", desc: "File → Export → CAD Formats → DWG. Configura layer mapping." },
      { icon: "🖨️", label: "Export PDF", desc: "File → Export → PDF (Revit 2022+)." },
      { icon: "🔄", label: "Export IFC", desc: "File → Export → IFC. Configura schema e mapping categorie." },
      { icon: "🏗️", label: "Export NWC", desc: "File → Export → NWC per clash detection in Navisworks." },
    ],
    diagram: null
  },
  { id: 27, title: "Progetto Finale", topics: ["Edificio residenziale 2 piani", "Dalla massa alla documentazione", "Export"], objective: "Applicare tutto il curriculum su un progetto reale end-to-end.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/", videoQuery: "Revit beginner full project tutorial",
    steps: [
      { icon: "📋", label: "Brief", desc: "Edificio residenziale 2 livelli. PT: soggiorno, cucina, bagno. P1: 2 camere, bagno, terrazza." },
      { icon: "🏗️", label: "Fase 1 — Struttura", desc: "Imposta Levels e Grids. Crea muri perimetrali e interni su entrambi i livelli." },
      { icon: "🪟", label: "Fase 2 — Aperture", desc: "Inserisci porte, finestre, scala, pavimenti e tetto." },
      { icon: "📄", label: "Fase 3 — Documentazione", desc: "Piante, prospetti, sezioni, quote, tag, sheets." },
      { icon: "📤", label: "Fase 4 — Export", desc: "DWG, PDF e IFC." },
    ],
    diagram: null
  }
];

// SVG Diagrams
const DIAGRAMS = {
  ui: (
    <svg viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="340" rx="8" fill="#ffffff"/>
      {/* Ribbon */}
      <rect x="8" y="8" width="544" height="52" rx="4" fill="#dbe7fc" stroke="#3d7ef5" strokeWidth="1.5"/>
      <text x="18" y="24" fill="#3d7ef5" fontSize="9" fontWeight="700">FILE</text>
      <rect x="50" y="12" width="70" height="20" rx="3" fill="#3d7ef5" opacity="0.3"/>
      <text x="55" y="26" fill="#2563c9" fontSize="9" fontWeight="600">ARCHITECTURE</text>
      <text x="130" y="26" fill="#7a8290" fontSize="9">STRUCTURE</text>
      <text x="195" y="26" fill="#7a8290" fontSize="9">ANNOTATE</text>
      <text x="255" y="26" fill="#7a8290" fontSize="9">VIEW</text>
      <text x="295" y="26" fill="#7a8290" fontSize="9">MANAGE</text>
      {/* Ribbon panels */}
      <rect x="50" y="34" width="490" height="22" rx="2" fill="#eaf1fd"/>
      <rect x="54" y="36" width="55" height="18" rx="2" fill="#eaf1fd"/>
      <text x="66" y="48" fill="#2563c9" fontSize="8">🧱 Wall</text>
      <rect x="114" y="36" width="50" height="18" rx="2" fill="#eaf1fd"/>
      <text x="122" y="48" fill="#2563c9" fontSize="8">🚪 Door</text>
      <rect x="169" y="36" width="55" height="18" rx="2" fill="#eaf1fd"/>
      <text x="175" y="48" fill="#2563c9" fontSize="8">🪟 Window</text>
      <rect x="229" y="36" width="45" height="18" rx="2" fill="#eaf1fd"/>
      <text x="234" y="48" fill="#2563c9" fontSize="8">🏠 Roof</text>
      <rect x="279" y="36" width="50" height="18" rx="2" fill="#eaf1fd"/>
      <text x="283" y="48" fill="#2563c9" fontSize="8">🪜 Stairs</text>
      {/* Label ribbon */}
      <rect x="8" y="3" width="55" height="12" rx="3" fill="#3d7ef5"/>
      <text x="13" y="12" fill="white" fontSize="8" fontWeight="700">① RIBBON</text>

      {/* Properties */}
      <rect x="8" y="66" width="130" height="120" rx="4" fill="#eef1f7" stroke="#9b4ff7" strokeWidth="1.5"/>
      <rect x="8" y="66" width="130" height="16" rx="4" fill="#f1ebfb"/>
      <text x="14" y="77" fill="#7c3aed" fontSize="8" fontWeight="700">Properties</text>
      <text x="14" y="93" fill="#7a8290" fontSize="7">Type Selector</text>
      <rect x="14" y="96" width="118" height="14" rx="2" fill="#dfe4ee"/>
      <text x="18" y="106" fill="#5a6270" fontSize="7">Basic Wall: Generic 200mm</text>
      <text x="14" y="120" fill="#7a8290" fontSize="7">Constraints</text>
      <rect x="14" y="122" width="55" height="10" rx="1" fill="#dfe4ee"/>
      <text x="16" y="130" fill="#6b7280" fontSize="6">Base Constraint</text>
      <rect x="72" y="122" width="60" height="10" rx="1" fill="#dfe4ee"/>
      <text x="74" y="130" fill="#5a6270" fontSize="6">Level 0</text>
      <rect x="14" y="135" width="55" height="10" rx="1" fill="#dfe4ee"/>
      <text x="16" y="143" fill="#6b7280" fontSize="6">Top Constraint</text>
      <rect x="72" y="135" width="60" height="10" rx="1" fill="#dfe4ee"/>
      <text x="74" y="143" fill="#5a6270" fontSize="6">Level 1</text>
      <rect x="30" y="152" width="90" height="14" rx="3" fill="#3d7ef5" opacity="0.8"/>
      <text x="50" y="162" fill="white" fontSize="7" fontWeight="600">Edit Type</text>
      <rect x="8" y="61" width="90" height="12" rx="3" fill="#9b4ff7"/>
      <text x="13" y="70" fill="white" fontSize="8" fontWeight="700">② PROPERTIES</text>

      {/* Project Browser */}
      <rect x="8" y="194" width="130" height="138" rx="4" fill="#eef1f7" stroke="#22c55e" strokeWidth="1.5"/>
      <rect x="8" y="194" width="130" height="16" rx="4" fill="#e9f7ee"/>
      <text x="14" y="205" fill="#16a34a" fontSize="8" fontWeight="700">Project Browser</text>
      <text x="14" y="220" fill="#7a8290" fontSize="7">▼ Views (all)</text>
      <text x="22" y="232" fill="#6b7280" fontSize="7">▼ Floor Plans</text>
      <text x="30" y="243" fill="#5a6270" fontSize="7">Level 0</text>
      <text x="30" y="253" fill="#5a6270" fontSize="7">Level 1</text>
      <text x="30" y="263" fill="#5a6270" fontSize="7">Site</text>
      <text x="22" y="274" fill="#6b7280" fontSize="7">▼ Elevations</text>
      <text x="30" y="284" fill="#5a6270" fontSize="7">North</text>
      <text x="30" y="294" fill="#5a6270" fontSize="7">South</text>
      <text x="14" y="305" fill="#7a8290" fontSize="7">▼ Sheets</text>
      <text x="14" y="316" fill="#7a8290" fontSize="7">▼ Families</text>
      <rect x="8" y="189" width="100" height="12" rx="3" fill="#22c55e"/>
      <text x="13" y="198" fill="white" fontSize="8" fontWeight="700">③ PROJECT BROWSER</text>

      {/* Drawing area */}
      <rect x="146" y="66" width="406" height="266" rx="4" fill="#f4f6fb" stroke="#e9edf5" strokeWidth="1"/>
      {/* Grid lines */}
      <line x1="200" y1="66" x2="200" y2="332" stroke="#dfe4ee" strokeWidth="0.5" strokeDasharray="4,4"/>
      <line x1="300" y1="66" x2="300" y2="332" stroke="#dfe4ee" strokeWidth="0.5" strokeDasharray="4,4"/>
      <line x1="400" y1="66" x2="400" y2="332" stroke="#dfe4ee" strokeWidth="0.5" strokeDasharray="4,4"/>
      <line x1="146" y1="150" x2="552" y2="150" stroke="#dfe4ee" strokeWidth="0.5" strokeDasharray="4,4"/>
      <line x1="146" y1="230" x2="552" y2="230" stroke="#dfe4ee" strokeWidth="0.5" strokeDasharray="4,4"/>
      {/* Sample walls */}
      <rect x="200" y="140" width="200" height="6" rx="1" fill="#3d7ef5" opacity="0.7"/>
      <rect x="200" y="140" width="6" height="100" rx="1" fill="#3d7ef5" opacity="0.7"/>
      <rect x="394" y="140" width="6" height="100" rx="1" fill="#3d7ef5" opacity="0.7"/>
      <rect x="200" y="234" width="200" height="6" rx="1" fill="#3d7ef5" opacity="0.7"/>
      <text x="270" y="200" fill="#3d7ef5" fontSize="11" opacity="0.4">AREA DI DISEGNO</text>
      <rect x="146" y="61" width="90" height="12" rx="3" fill="#f59e0b"/>
      <text x="151" y="70" fill="white" fontSize="8" fontWeight="700">④ AREA DI DISEGNO</text>

      {/* View Control Bar */}
      <rect x="146" y="320" width="406" height="12" rx="2" fill="#eef1f7" stroke="#dfe4ee" strokeWidth="1"/>
      <text x="155" y="329" fill="#7a8290" fontSize="7">1:100  📐  ☀️  🎨  👁  🌐</text>
      <rect x="146" y="315" width="80" height="10" rx="2" fill="#f59e0b" opacity="0.7"/>
      <text x="150" y="323" fill="white" fontSize="6" fontWeight="700">⑤ VIEW CONTROL</text>
    </svg>
  ),

  bim: (
    <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="300" rx="8" fill="#ffffff"/>
      {/* Title */}
      <text x="20" y="28" fill="#1a1d28" fontSize="13" fontWeight="700">Livelli (Levels) e Griglie (Grids)</text>
      {/* Building section */}
      {/* Levels */}
      <line x1="40" y1="80" x2="520" y2="80" stroke="#3d7ef5" strokeWidth="2" strokeDasharray="8,4"/>
      <line x1="40" y1="155" x2="520" y2="155" stroke="#3d7ef5" strokeWidth="2" strokeDasharray="8,4"/>
      <line x1="40" y1="230" x2="520" y2="230" stroke="#3d7ef5" strokeWidth="2" strokeDasharray="8,4"/>
      {/* Level labels */}
      <rect x="440" y="70" width="80" height="18" rx="3" fill="#dbe7fc" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="448" y="82" fill="#3d7ef5" fontSize="9" fontWeight="700">Level 2  +6.00</text>
      <rect x="440" y="145" width="80" height="18" rx="3" fill="#dbe7fc" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="448" y="157" fill="#3d7ef5" fontSize="9" fontWeight="700">Level 1  +3.00</text>
      <rect x="440" y="220" width="80" height="18" rx="3" fill="#dbe7fc" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="448" y="232" fill="#3d7ef5" fontSize="9" fontWeight="700">Level 0  ±0.00</text>
      {/* Walls */}
      <rect x="80" y="80" width="10" height="150" fill="#8a92a0"/>
      <rect x="350" y="80" width="10" height="150" fill="#8a92a0"/>
      <rect x="80" y="155" width="280" height="10" fill="#6b7280" opacity="0.5"/>
      {/* Grid lines */}
      <line x1="85" y1="50" x2="85" y2="250" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3"/>
      <line x1="210" y1="50" x2="210" y2="250" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3"/>
      <line x1="355" y1="50" x2="355" y2="250" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3"/>
      {/* Grid labels */}
      <circle cx="85" cy="48" r="10" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="82" y="52" fill="#22c55e" fontSize="9" fontWeight="700">A</text>
      <circle cx="210" cy="48" r="10" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="207" y="52" fill="#22c55e" fontSize="9" fontWeight="700">B</text>
      <circle cx="355" cy="48" r="10" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="352" y="52" fill="#22c55e" fontSize="9" fontWeight="700">C</text>
      {/* Legend */}
      <line x1="40" y1="268" x2="70" y2="268" stroke="#3d7ef5" strokeWidth="2" strokeDasharray="8,4"/>
      <text x="75" y="272" fill="#3d7ef5" fontSize="9">Levels — quota orizzontale di ogni piano</text>
      <line x1="40" y1="285" x2="70" y2="285" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3"/>
      <text x="75" y="289" fill="#22c55e" fontSize="9">Grids — assi di riferimento verticali</text>
      {/* Muro label */}
      <rect x="40" y="108" width="8" height="4" fill="#8a92a0"/>
      <text x="52" y="115" fill="#5a6270" fontSize="8">Muro agganciato tra Level 0 e Level 2</text>
    </svg>
  ),

  wall: (
    <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="300" rx="8" fill="#ffffff"/>
      <text x="20" y="28" fill="#1a1d28" fontSize="13" fontWeight="700">Wall Tool — dove cliccare</text>
      {/* Ribbon mockup */}
      <rect x="10" y="38" width="540" height="40" rx="4" fill="#dbe7fc" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="18" y="53" fill="#7a8290" fontSize="8">Architecture</text>
      <rect x="60" y="42" width="55" height="32" rx="3" fill="#3d7ef5" opacity="0.2" stroke="#3d7ef5" strokeWidth="1.5"/>
      <text x="68" y="55" fill="#2563c9" fontSize="7" fontWeight="700">Build</text>
      <rect x="64" y="57" width="46" height="14" rx="2" fill="#3d7ef5"/>
      <text x="75" y="67" fill="white" fontSize="8" fontWeight="700">🧱 Wall</text>
      {/* Arrow */}
      <path d="M87 75 L87 92" stroke="#3d7ef5" strokeWidth="2" markerEnd="url(#arrow)"/>
      <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3d7ef5"/></marker></defs>

      {/* Plan view */}
      <rect x="10" y="95" width="330" height="190" rx="4" fill="#f4f6fb" stroke="#e9edf5" strokeWidth="1"/>
      <text x="20" y="113" fill="#7a8290" fontSize="8">Pianta di piano — Area di disegno</text>
      {/* Wall drawing sequence */}
      <circle cx="80" cy="160" r="6" fill="#3d7ef5" stroke="#2563c9" strokeWidth="1.5"/>
      <text x="72" y="178" fill="#3d7ef5" fontSize="8" fontWeight="700">1° click</text>
      <rect x="80" y="154" width="180" height="12" rx="2" fill="#3d7ef5" opacity="0.8"/>
      <circle cx="260" cy="160" r="6" fill="#9b4ff7" stroke="#7c3aed" strokeWidth="1.5"/>
      <text x="250" y="178" fill="#9b4ff7" fontSize="8" fontWeight="700">2° click</text>
      {/* Dimension */}
      <line x1="80" y1="190" x2="260" y2="190" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2"/>
      <text x="145" y="202" fill="#f59e0b" fontSize="8">3600 mm</text>
      {/* Properties mockup */}
      <rect x="350" y="95" width="200" height="190" rx="4" fill="#eef1f7" stroke="#9b4ff7" strokeWidth="1.5"/>
      <text x="360" y="113" fill="#7c3aed" fontSize="8" fontWeight="700">Properties</text>
      <text x="360" y="128" fill="#7a8290" fontSize="7">Tipo muro:</text>
      <rect x="360" y="130" width="180" height="16" rx="2" fill="#dfe4ee"/>
      <text x="364" y="141" fill="#5a6270" fontSize="7">Basic Wall: Generic - 200mm</text>
      <text x="360" y="158" fill="#7a8290" fontSize="7">Base Constraint:</text>
      <rect x="360" y="160" width="180" height="14" rx="2" fill="#dfe4ee"/>
      <text x="364" y="170" fill="#5a6270" fontSize="7">Level 0</text>
      <text x="360" y="184" fill="#7a8290" fontSize="7">Top Constraint:</text>
      <rect x="360" y="186" width="180" height="14" rx="2" fill="#dfe4ee"/>
      <text x="364" y="196" fill="#5a6270" fontSize="7">Level 1</text>
      <rect x="380" y="248" width="110" height="18" rx="3" fill="#3d7ef5"/>
      <text x="408" y="261" fill="white" fontSize="8" fontWeight="700">Edit Type</text>
      {/* Labels */}
      <rect x="10" y="88" width="120" height="12" rx="3" fill="#3d7ef5"/>
      <text x="15" y="97" fill="white" fontSize="8" fontWeight="700">① Seleziona Wall Tool</text>
      <rect x="350" y="88" width="130" height="12" rx="3" fill="#9b4ff7"/>
      <text x="355" y="97" fill="white" fontSize="8" fontWeight="700">② Imposta tipo nel Properties</text>
    </svg>
  ),

  door: (
    <svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="280" rx="8" fill="#ffffff"/>
      <text x="20" y="28" fill="#1a1d28" fontSize="13" fontWeight="700">Door &amp; Window — inserimento in pianta</text>
      {/* Wall */}
      <rect x="60" y="80" width="440" height="14" rx="2" fill="#8a92a0"/>
      <text x="20" y="91" fill="#5a6270" fontSize="8">Muro →</text>
      {/* Door in wall */}
      <rect x="160" y="80" width="60" height="14" rx="0" fill="#ffffff" stroke="#f59e0b" strokeWidth="1"/>
      <path d="M160 94 Q190 130 220 94" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2"/>
      <text x="163" y="75" fill="#f59e0b" fontSize="8" fontWeight="700">🚪 Door</text>
      {/* Window in wall */}
      <rect x="310" y="80" width="50" height="14" fill="#dbe7fc" stroke="#3d7ef5" strokeWidth="1.5"/>
      <line x1="335" y1="80" x2="335" y2="94" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="308" y="75" fill="#3d7ef5" fontSize="8" fontWeight="700">🪟 Window</text>
      {/* Flip arrows */}
      <path d="M185 100 L175 110 M185 100 L195 110" stroke="#22c55e" strokeWidth="2"/>
      <text x="155" y="125" fill="#22c55e" fontSize="7">Frecce blu = inverti</text>
      <text x="155" y="135" fill="#22c55e" fontSize="7">orientamento</text>
      {/* Ribbon path */}
      <rect x="40" y="160" width="480" height="30" rx="4" fill="#dbe7fc" stroke="#e9edf5" strokeWidth="1"/>
      <text x="50" y="170" fill="#7a8290" fontSize="8">Architecture →</text>
      <rect x="120" y="163" width="35" height="22" rx="3" fill="#eaf1fd" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="126" y="172" fill="#2563c9" fontSize="7" fontWeight="600">Build</text>
      <text x="124" y="180" fill="#7a8290" fontSize="6">panel</text>
      <text x="163" y="174" fill="#7a8290" fontSize="8">→</text>
      <rect x="175" y="163" width="35" height="22" rx="3" fill="#3d7ef5" opacity="0.8"/>
      <text x="180" y="177" fill="white" fontSize="8" fontWeight="700">Door</text>
      <text x="218" y="174" fill="#7a8290" fontSize="8">oppure</text>
      <rect x="245" y="163" width="40" height="22" rx="3" fill="#3d7ef5" opacity="0.8"/>
      <text x="248" y="177" fill="white" fontSize="8" fontWeight="700">Window</text>
      {/* Tips */}
      <rect x="40" y="205" width="480" height="60" rx="4" fill="#eef1f7" stroke="#e9edf5" strokeWidth="1"/>
      <text x="52" y="220" fill="#f59e0b" fontSize="8" fontWeight="700">⚠️ Importante:</text>
      <text x="52" y="234" fill="#5a6270" fontSize="8">• La porta/finestra si inserisce SOLO su un muro esistente</text>
      <text x="52" y="247" fill="#5a6270" fontSize="8">• Avvicina il cursore al muro finché non appare l'anteprima</text>
      <text x="52" y="260" fill="#5a6270" fontSize="8">• Le frecce blu indicano verso dove si apre — clicca per invertire</text>
    </svg>
  ),

  floor: (
    <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="300" rx="8" fill="#ffffff"/>
      <text x="20" y="28" fill="#1a1d28" fontSize="13" fontWeight="700">Floor — Sketch Mode</text>
      {/* Step 1: walls */}
      <rect x="10" y="40" width="165" height="120" rx="4" fill="#f4f6fb" stroke="#e9edf5" strokeWidth="1"/>
      <text x="18" y="54" fill="#7a8290" fontSize="7">① Muri esistenti</text>
      <rect x="25" y="60" width="135" height="90" rx="1" fill="none" stroke="#8a92a0" strokeWidth="8"/>
      {/* Step 2: sketch mode */}
      <rect x="185" y="40" width="165" height="120" rx="4" fill="#f4f6fb" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="193" y="54" fill="#f59e0b" fontSize="7">② Sketch Mode attivo</text>
      <rect x="200" y="60" width="135" height="90" rx="1" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3"/>
      <text x="240" y="110" fill="#f59e0b" fontSize="8" opacity="0.6">Boundary</text>
      <text x="245" y="122" fill="#f59e0b" fontSize="8" opacity="0.6">Lines</text>
      {/* Step 3: finish */}
      <rect x="360" y="40" width="190" height="120" rx="4" fill="#f4f6fb" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="368" y="54" fill="#22c55e" fontSize="7">③ Finish → pavimento creato</text>
      <rect x="375" y="60" width="160" height="90" rx="1" fill="#3d7ef5" opacity="0.15" stroke="#22c55e" strokeWidth="1.5"/>
      {/* Hatch pattern */}
      <line x1="375" y1="70" x2="395" y2="70" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="80" x2="405" y2="80" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="90" x2="415" y2="90" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="100" x2="425" y2="100" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="110" x2="435" y2="110" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="120" x2="445" y2="120" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="130" x2="455" y2="130" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <line x1="375" y1="140" x2="465" y2="140" stroke="#3d7ef5" strokeWidth="0.5" opacity="0.3"/>
      <text x="420" y="110" fill="#22c55e" fontSize="11">✓</text>
      {/* Arrows between steps */}
      <path d="M178 100 L183 100" stroke="#7a8290" strokeWidth="2" markerEnd="url(#arr2)"/>
      <path d="M353 100 L358 100" stroke="#7a8290" strokeWidth="2" markerEnd="url(#arr2)"/>
      <defs><marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7a8290"/></marker></defs>
      {/* Ribbon path */}
      <rect x="10" y="175" width="540" height="30" rx="4" fill="#dbe7fc" stroke="#e9edf5" strokeWidth="1"/>
      <text x="20" y="185" fill="#7a8290" fontSize="8">Architecture →</text>
      <rect x="95" y="178" width="35" height="24" rx="3" fill="#eaf1fd" stroke="#3d7ef5" strokeWidth="1"/>
      <text x="101" y="188" fill="#2563c9" fontSize="7">Build</text>
      <text x="100" y="197" fill="#7a8290" fontSize="6">panel</text>
      <text x="138" y="191" fill="#7a8290" fontSize="8">→</text>
      <rect x="150" y="178" width="60" height="24" rx="3" fill="#3d7ef5" opacity="0.9"/>
      <text x="155" y="195" fill="white" fontSize="8" fontWeight="700">Floor: Arch.</text>
      {/* Finish button */}
      <rect x="10" y="220" width="540" height="65" rx="4" fill="#eef1f7" stroke="#e9edf5" strokeWidth="1"/>
      <text x="22" y="236" fill="#5a6270" fontSize="8">Quando sei in Sketch Mode, la ribbon cambia e appare il pannello verde:</text>
      <rect x="200" y="244" width="100" height="28" rx="4" fill="#166534" stroke="#22c55e" strokeWidth="2"/>
      <text x="220" y="258" fill="#22c55e" fontSize="11">✓</text>
      <text x="234" y="258" fill="#22c55e" fontSize="8" fontWeight="700">Finish</text>
      <text x="310" y="247" fill="#5a6270" fontSize="8">← Clicca qui per completare</text>
      <text x="310" y="259" fill="#7a8290" fontSize="7">il pavimento. Se la boundary</text>
      <text x="310" y="270" fill="#7a8290" fontSize="7">non è chiusa, Revit dà errore.</text>
    </svg>
  ),

  families: (
    <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"560px"}}>
      <rect width="560" height="300" rx="8" fill="#ffffff"/>
      <text x="20" y="28" fill="#1a1d28" fontSize="13" fontWeight="700">I 3 tipi di Famiglia in Revit</text>
      {/* System */}
      <rect x="10" y="45" width="165" height="200" rx="6" fill="#eef1f7" stroke="#3d7ef5" strokeWidth="2"/>
      <rect x="10" y="45" width="165" height="28" rx="6" fill="#dbe7fc"/>
      <text x="22" y="63" fill="#3d7ef5" fontSize="10" fontWeight="700">🧱 System Families</text>
      <text x="18" y="85" fill="#6b7280" fontSize="8">Non si caricano</text>
      <text x="18" y="97" fill="#6b7280" fontSize="8">dall'esterno — esistono</text>
      <text x="18" y="109" fill="#6b7280" fontSize="8">solo nel progetto</text>
      <rect x="18" y="120" width="150" height="16" rx="3" fill="#eaf1fd"/>
      <text x="24" y="131" fill="#5a6270" fontSize="7">• Walls (Muri)</text>
      <rect x="18" y="139" width="150" height="16" rx="3" fill="#eaf1fd"/>
      <text x="24" y="150" fill="#5a6270" fontSize="7">• Floors (Pavimenti)</text>
      <rect x="18" y="158" width="150" height="16" rx="3" fill="#eaf1fd"/>
      <text x="24" y="169" fill="#5a6270" fontSize="7">• Ceilings (Soffitti)</text>
      <rect x="18" y="177" width="150" height="16" rx="3" fill="#eaf1fd"/>
      <text x="24" y="188" fill="#5a6270" fontSize="7">• Roofs (Tetti)</text>
      <rect x="18" y="196" width="150" height="16" rx="3" fill="#eaf1fd"/>
      <text x="24" y="207" fill="#5a6270" fontSize="7">• Stairs, Ramps</text>
      <text x="18" y="232" fill="#7a8290" fontSize="7">Modificabile solo</text>
      <text x="18" y="242" fill="#7a8290" fontSize="7">da Edit Type</text>
      {/* Loadable */}
      <rect x="195" y="45" width="165" height="200" rx="6" fill="#eef1f7" stroke="#9b4ff7" strokeWidth="2"/>
      <rect x="195" y="45" width="165" height="28" rx="6" fill="#f1ebfb"/>
      <text x="200" y="63" fill="#7c3aed" fontSize="10" fontWeight="700">📂 Loadable Families</text>
      <text x="203" y="85" fill="#6b7280" fontSize="8">File .rfa — si caricano</text>
      <text x="203" y="97" fill="#6b7280" fontSize="8">da libreria o da web</text>
      <text x="203" y="109" fill="#6b7280" fontSize="8">Puoi crearne di nuove!</text>
      <rect x="203" y="120" width="150" height="16" rx="3" fill="#f1ebfb"/>
      <text x="209" y="131" fill="#5a6270" fontSize="7">• Doors (Porte)</text>
      <rect x="203" y="139" width="150" height="16" rx="3" fill="#f1ebfb"/>
      <text x="209" y="150" fill="#5a6270" fontSize="7">• Windows (Finestre)</text>
      <rect x="203" y="158" width="150" height="16" rx="3" fill="#f1ebfb"/>
      <text x="209" y="169" fill="#5a6270" fontSize="7">• Furniture (Mobili)</text>
      <rect x="203" y="177" width="150" height="16" rx="3" fill="#f1ebfb"/>
      <text x="209" y="188" fill="#5a6270" fontSize="7">• Columns (Colonne)</text>
      <rect x="203" y="196" width="150" height="16" rx="3" fill="#f1ebfb"/>
      <text x="209" y="207" fill="#5a6270" fontSize="7">• Lighting fixtures</text>
      <text x="203" y="232" fill="#9b4ff7" fontSize="7">Insert → Load Family</text>
      <text x="203" y="242" fill="#7a8290" fontSize="7">per caricarle</text>
      {/* In-place */}
      <rect x="380" y="45" width="170" height="200" rx="6" fill="#eef1f7" stroke="#f59e0b" strokeWidth="2"/>
      <rect x="380" y="45" width="170" height="28" rx="6" fill="#fdf6e3"/>
      <text x="386" y="63" fill="#f59e0b" fontSize="10" fontWeight="700">✏️ In-Place Families</text>
      <text x="388" y="85" fill="#6b7280" fontSize="8">Create direttamente</text>
      <text x="388" y="97" fill="#6b7280" fontSize="8">nel progetto per</text>
      <text x="388" y="109" fill="#6b7280" fontSize="8">forme uniche</text>
      <rect x="388" y="120" width="154" height="16" rx="3" fill="#fdf6e3"/>
      <text x="394" y="131" fill="#5a6270" fontSize="7">• Forme architettoniche</text>
      <rect x="388" y="139" width="154" height="16" rx="3" fill="#fdf6e3"/>
      <text x="394" y="150" fill="#5a6270" fontSize="7">  personalizzate</text>
      <rect x="388" y="158" width="154" height="16" rx="3" fill="#fdf6e3"/>
      <text x="394" y="169" fill="#5a6270" fontSize="7">• Elementi non standard</text>
      <text x="388" y="200" fill="#f59e0b" fontSize="7">⚠️ Usa raramente:</text>
      <text x="388" y="212" fill="#7a8290" fontSize="7">pesante sul file,</text>
      <text x="388" y="224" fill="#7a8290" fontSize="7">difficile da riutilizzare</text>
      <text x="388" y="236" fill="#7a8290" fontSize="7">su altri progetti</text>
    </svg>
  )
};

// ── Translations ──────────────────────────────────────────────
const T = {
  it: {
    appSubtitle: "Revit per principianti",
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
    inputPlaceholder: "{t.inputPlaceholder}",
    inputHint: "📎 Screenshot Revit per feedback visivo · Enter per inviare",
    send: "Invia",
    prev: "← Prec",
    next: "Pros →",
    screenshotLabel: "📎 Screenshot allegato",
    helpBtn: "?",
    docsBtn: "📖 Docs",
    videoBtn: "🎥 Video",
    lessonOf: (n, tot) => `Lezione ${n} di ${tot}`,
    welcomeTitle: "Benvenuto in BIMentor",
    welcomeSubtitle: "Il tuo tutor AI per imparare Revit da zero",
    welcomeIntro: "BIMentor ti accompagna lezione per lezione, come un collega esperto seduto accanto a te. Ecco come usarlo al meglio:",
    welcomeTip: "Consiglio:",
    welcomeTipText: "tieni Revit aperto accanto a BIMentor (o su un secondo monitor). Leggi, prova subito in Revit, e torna qui quando hai dubbi. Imparare facendo è il metodo.",
    welcomeStart: "Iniziamo 🚀",
    welcomeFeatures: [
      { icon: "💬", title: "Tutor AI", desc: "Clicca \"Inizia lezione\" e l'AI ti spiega il primo concetto. Fai domande liberamente quando sei bloccato." },
      { icon: "📋", title: "Guida Passo-Passo", desc: "La seconda tab contiene gli step pratici con diagrammi visivi. Per ogni step puoi cliccare \"Chiedi all'AI\" per approfondire." },
      { icon: "📖", title: "Docs Autodesk", desc: "Il bottone in alto apre la documentazione ufficiale Autodesk sulla lezione corrente." },
      { icon: "📎", title: "Screenshot", desc: "Carica uno screenshot di Revit con la graffetta e l'AI ti dirà cosa hai fatto bene e cosa correggere." },
    ],
    startPrompt: "Inizia la lezione",
    askStepPrompt: (icon, label) => `Spiegami nel dettaglio: "${icon} ${label}"`,
    askStepDisplay: (icon, label) => `Spiegami: ${icon} ${label}`,
  },
  en: {
    appSubtitle: "Revit for beginners",
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
    helpBtn: "?",
    docsBtn: "📖 Docs",
    videoBtn: "🎥 Video",
    lessonOf: (n, tot) => `Lesson ${n} of ${tot}`,
    welcomeTitle: "Welcome to BIMentor",
    welcomeSubtitle: "Your AI tutor to learn Revit from scratch",
    welcomeIntro: "BIMentor guides you lesson by lesson, like an expert colleague sitting next to you. Here's how to get the most out of it:",
    welcomeTip: "Tip:",
    welcomeTipText: "Keep Revit open next to BIMentor (or on a second monitor). Read, try it immediately in Revit, and come back when you have questions. Learning by doing is the method.",
    welcomeStart: "Let's start 🚀",
    welcomeFeatures: [
      { icon: "💬", title: "AI Tutor", desc: "Click \"Start lesson\" and the AI explains the first concept. Ask freely whenever you're stuck." },
      { icon: "📋", title: "Step-by-Step Guide", desc: "The second tab contains practical steps with visual diagrams. For each step you can click \"Ask AI\" to go deeper." },
      { icon: "📖", title: "Autodesk Docs", desc: "The button at the top opens the official Autodesk documentation for the current lesson." },
      { icon: "📎", title: "Screenshot", desc: "Upload a Revit screenshot with the paperclip and the AI will tell you what you did right and what to fix." },
    ],
    startPrompt: "Start the lesson",
    askStepPrompt: (icon, label) => `Explain in detail: "${icon} ${label}"`,
    askStepDisplay: (icon, label) => `Explain: ${icon} ${label}`,
  }
};

// ── Curriculum translations ────────────────────────────────────
const CURRICULUM_EN = [
  { id: 1, title: "User Interface", topics: ["Ribbon and main tabs", "Properties panel", "Project Browser", "Creating Plan Views", "Line Styles and Patterns", "Fill Patterns"], objective: "Navigate Revit and understand where the main controls are.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=user%20interface", videoQuery: "Revit user interface tutorial beginner", steps: [
    { icon: "🖥️", label: "Open Revit", desc: "Launch Revit and open a new project with the Architectural template." },
    { icon: "📌", label: "Explore the Ribbon", desc: "At the top is the Ribbon: click Architecture, Structure, Annotate, View and observe how the panels change." },
    { icon: "📋", label: "Properties Panel", desc: "Top left: shows properties of the selected element. If nothing is selected, shows current view properties." },
    { icon: "🗂️", label: "Project Browser", desc: "Bottom left: lists all views, sheets, families and groups in the project." },
    { icon: "🔍", label: "Drawing area", desc: "Center: this is where you draw. Use the mouse wheel to zoom, hold middle button to pan." },
  ], diagram: "ui" },
  { id: 2, title: "BIM Concepts", topics: ["BIM vs CAD", "Levels", "Grids", "Disciplines and views"], objective: "Understand the BIM logic before modelling any element.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=levels%20grids", videoQuery: "Revit levels grids BIM basics", steps: [
    { icon: "💡", label: "BIM vs CAD", desc: "In CAD you draw lines. In Revit you build a real 3D building — every element has real data: material, cost, area." },
    { icon: "📏", label: "Levels", desc: "Architecture → Datum → Level. Levels define floor heights. Every wall attaches to a level." },
    { icon: "⊞", label: "Grids", desc: "Architecture → Datum → Grid. Grids define structural axes as reference lines." },
  ], diagram: "bim" },
  { id: 3, title: "Wall", topics: ["System families", "Compound walls", "Stacked walls", "Edit wall structure"], objective: "Create and modify walls of different types and thicknesses.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=walls", videoQuery: "Revit wall tool tutorial", steps: [
    { icon: "🧱", label: "Wall Tool", desc: "Architecture → Build → Wall → Wall: Architectural." },
    { icon: "📐", label: "Choose type", desc: "Properties panel: click the wall type (e.g. Basic Wall 200mm) and change it from the dropdown." },
    { icon: "✏️", label: "Draw", desc: "Click two points in the drawing area. Press ESC to exit the tool." },
    { icon: "⚙️", label: "Edit Structure", desc: "Select wall → Properties → Edit Type → Edit Structure to modify layers." },
  ], diagram: "wall" },
  { id: 4, title: "Door & Window", topics: ["Inserting doors and windows", "Modify parameters", "Auto tags", "Alignment"], objective: "Insert doors and windows correctly into a wall.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=doors%20windows", videoQuery: "Revit doors windows tutorial", steps: [
    { icon: "🚪", label: "Door Tool", desc: "Architecture → Build → Door. Move close to a wall and click to insert." },
    { icon: "🪟", label: "Window Tool", desc: "Architecture → Build → Window. Click on the wall where you want the window." },
    { icon: "↔️", label: "Flip orientation", desc: "After inserting, blue arrows appear: click them to flip the opening direction." },
    { icon: "🏷️", label: "Auto tag", desc: "Annotate → Tag → Tag All to tag all doors and windows automatically." },
  ], diagram: "door" },
  { id: 5, title: "Component & Column", topics: ["Loadable components", "Architectural columns", "Structural columns"], objective: "Insert components and columns into the model.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=components%20columns", videoQuery: "Revit component column placement", steps: [
    { icon: "🪑", label: "Component Tool", desc: "Architecture → Build → Component. Inserts loadable families like furniture and fixtures." },
    { icon: "🏛️", label: "Column Tool", desc: "Architecture → Build → Column: Architectural for decorative columns." },
    { icon: "📦", label: "Load Family", desc: "If not available, click Load Family in the ribbon to browse libraries." },
  ], diagram: null },
  { id: 6, title: "Floor", topics: ["Compound floors", "Boundary and sketch mode", "Floor slope", "Core boundary"], objective: "Create compound floors and manage boundaries.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=floors", videoQuery: "Revit floor tool tutorial", steps: [
    { icon: "⬛", label: "Floor Tool", desc: "Architecture → Build → Floor: Architectural. You enter Sketch Mode." },
    { icon: "✏️", label: "Sketch Boundary", desc: "Draw a closed perimeter with Boundary Lines." },
    { icon: "✅", label: "Finish Sketch", desc: "Click the green checkmark (Finish Edit Mode)." },
    { icon: "📐", label: "Edit Structure", desc: "Select floor → Edit Type → Edit Structure to add layers." },
  ], diagram: "floor" },
  { id: 7, title: "Ceiling", topics: ["Compound ceilings", "Height offset", "Patterns and grids", "Automatic ceiling"], objective: "Create ceilings and manage height and pattern.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=ceilings", videoQuery: "Revit ceiling tutorial", steps: [
    { icon: "⬜", label: "Ceiling Tool", desc: "Architecture → Build → Ceiling. Use Automatic Ceiling by clicking inside a closed room." },
    { icon: "📏", label: "Set height", desc: "Properties panel: modify Height Offset From Level." },
    { icon: "🔲", label: "Change pattern", desc: "Edit Type → modify Compound Structure for material and pattern." },
  ], diagram: null },
  { id: 8, title: "Roof", topics: ["Roof by footprint", "Roof by extrusion", "Slope arrow", "Overhang and fascia"], objective: "Model pitched and flat roofs correctly.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=roofs", videoQuery: "Revit roof tutorial", steps: [
    { icon: "🏠", label: "Roof by Footprint", desc: "Architecture → Build → Roof → Roof by Footprint." },
    { icon: "📐", label: "Set slope", desc: "Select each boundary line → Properties → enable Defines Roof Slope and set angle." },
    { icon: "↔️", label: "Overhang", desc: "Properties: set Overhang to extend the roof beyond the walls." },
    { icon: "🏗️", label: "Roof by Extrusion", desc: "Useful for barrel roofs: draw the profile in section and extrude along an axis." },
  ], diagram: null },
  { id: 9, title: "Curtain Wall & Mullions", topics: ["Curtain wall system", "Curtain grid", "Panels", "Mullions"], objective: "Create continuous facades with custom grids and mullions.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=curtain%20walls", videoQuery: "Revit curtain wall mullions tutorial", steps: [
    { icon: "🏢", label: "Curtain Wall", desc: "Architecture → Build → Wall → choose Curtain Wall type." },
    { icon: "⊞", label: "Curtain Grid", desc: "Architecture → Build → Curtain Grid. Click on the wall to add grid lines." },
    { icon: "🔳", label: "Mullion", desc: "Architecture → Build → Mullion. Click on grid lines to add mullions." },
    { icon: "🚪", label: "Replace panel", desc: "Select panel → Properties → change type (e.g. door or opaque panel)." },
  ], diagram: null },
  { id: 10, title: "Stairs & Railing", topics: ["Stair by component", "Run and landing", "Railing", "Custom baluster"], objective: "Model stairs and railings with correct geometry.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=stairs%20railings", videoQuery: "Revit stairs railing tutorial", steps: [
    { icon: "🪜", label: "Stair Tool", desc: "Architecture → Circulation → Stair." },
    { icon: "➡️", label: "Create Run", desc: "Click Run and draw the direction. Revit counts risers automatically." },
    { icon: "⬛", label: "Landing", desc: "With multiple runs, Revit creates the landing automatically." },
    { icon: "🔧", label: "Railing", desc: "Architecture → Circulation → Railing. Attach to a path or existing stair." },
  ], diagram: null },
  { id: 11, title: "Opening", topics: ["Wall opening", "Shaft opening", "Vertical opening"], objective: "Create openings in model elements.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=openings", videoQuery: "Revit shaft opening tutorial", steps: [
    { icon: "🔲", label: "Wall Opening", desc: "Architecture → Opening → Wall Opening. Click the wall and draw the rectangle." },
    { icon: "⬇️", label: "Shaft Opening", desc: "Architecture → Opening → Shaft. Cuts vertically through multiple levels." },
    { icon: "⬜", label: "Vertical Opening", desc: "Architecture → Opening → Vertical. Cuts through a floor or roof." },
  ], diagram: null },
  { id: 12, title: "Room & Area", topics: ["Room placement", "Room tag", "Area plan", "Color fill"], objective: "Define and visualise rooms and areas in the model.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=rooms%20areas", videoQuery: "Revit rooms areas tutorial", steps: [
    { icon: "🏠", label: "Room Tool", desc: "Architecture → Room & Area → Room. Click inside a closed room." },
    { icon: "🏷️", label: "Room Tag", desc: "Tag appears automatically. Double-click to rename." },
    { icon: "🗺️", label: "Area Plan", desc: "Architecture → Room & Area → Area Plan." },
    { icon: "🎨", label: "Color Fill", desc: "Annotate → Color Fill → Color Fill Legend to colour rooms by function." },
  ], diagram: null },
  { id: 13, title: "Materials", topics: ["Material browser", "Create material", "Surface pattern", "Cut pattern", "Render appearance"], objective: "Create custom materials and assign them to elements.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=materials", videoQuery: "Revit materials tutorial", steps: [
    { icon: "🎨", label: "Material Browser", desc: "Manage → Materials. Opens the material browser." },
    { icon: "➕", label: "Create material", desc: "Click + at the bottom. Rename the material." },
    { icon: "🖼️", label: "Surface Pattern", desc: "Graphics tab → Surface Pattern: 2D texture in plan/elevation." },
    { icon: "✂️", label: "Cut Pattern", desc: "Graphics tab → Cut Pattern: section hatch pattern." },
  ], diagram: null },
  { id: 14, title: "Families — Part 1", topics: ["What is a family", "System vs Loadable vs In-place", "Parametric logic"], objective: "Understand the family structure after having used real elements.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=families", videoQuery: "Revit families explained system loadable", steps: [
    { icon: "📦", label: "What they are", desc: "Every element in Revit is a Family. Walls, doors, windows — they are all families." },
    { icon: "🧱", label: "System Families", desc: "Cannot be loaded externally: walls, floors, ceilings, roofs. They exist only inside the project." },
    { icon: "📂", label: "Loadable Families", desc: ".rfa files: doors, windows, furniture. You can create new ones." },
    { icon: "✏️", label: "In-place Families", desc: "Unique geometry created inside the project. Only for non-standard shapes." },
  ], diagram: "families" },
  { id: 15, title: "Families — Part 2", topics: ["Type vs Instance", "Type parameters", "Instance parameters"], objective: "Distinguish and modify type and instance parameters.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=type%20instance%20properties", videoQuery: "Revit type instance parameters", steps: [
    { icon: "📋", label: "Type vs Instance", desc: "TYPE: changes all copies. INSTANCE: changes only the selected element." },
    { icon: "⚙️", label: "Edit Type", desc: "Properties → Edit Type. Changes parameters that affect ALL elements of that type." },
    { icon: "📐", label: "Instance Parameters", desc: "Properties without Edit Type: changes only the selected element." },
  ], diagram: null },
  { id: 16, title: "Families — Part 3", topics: ["Family Editor", "Reference planes", "Extrusion", "Dimensional parameters"], objective: "Create a simple loadable family from scratch.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=family%20editor", videoQuery: "Revit family editor create family", steps: [
    { icon: "📁", label: "Family Editor", desc: "File → New → Family. Choose a template (e.g. Generic Model.rft)." },
    { icon: "✚", label: "Reference Planes", desc: "Create → Datum → Reference Plane. The skeleton geometry attaches to." },
    { icon: "📦", label: "Extrusion", desc: "Create → Forms → Extrusion. 2D profile + depth = 3D solid." },
    { icon: "📏", label: "Parameters", desc: "Add dimension → padlock → Label. The family becomes parametric." },
    { icon: "💾", label: "Load into Project", desc: "Create → Load into Project." },
  ], diagram: null },
  { id: 17, title: "Visibility & Graphics", topics: ["VG overrides", "Filters", "View templates"], objective: "Control view graphics and create reusable view templates.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=visibility%20graphics", videoQuery: "Revit visibility graphics overrides", steps: [
    { icon: "👁️", label: "Open VG", desc: "Shortcut: VV. Opens Visibility/Graphics for the current view." },
    { icon: "📂", label: "Category overrides", desc: "Model Categories: hide categories or change line colour/weight." },
    { icon: "🔍", label: "Filters", desc: "Filters tab: parameter-based rules (e.g. show walls with Fire Rating 2h in red)." },
    { icon: "📋", label: "View Template", desc: "View → View Templates → Create Template. Save reusable settings." },
  ], diagram: null },
  { id: 18, title: "Views and Sections", topics: ["Floor plans", "Elevations", "Sections", "Callout", "3D views"], objective: "Create and manage all view types for documentation.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=views%20sections", videoQuery: "Revit views sections tutorial", steps: [
    { icon: "📐", label: "Floor Plan", desc: "View → Create → Plan Views → Floor Plan. Choose the level." },
    { icon: "⬆️", label: "Elevation", desc: "View → Create → Elevation. Click to place the elevation symbol." },
    { icon: "✂️", label: "Section", desc: "View → Create → Section. Draw the cut line." },
    { icon: "🔍", label: "Callout", desc: "View → Create → Callout. Draw a rectangle over an area for a zoomed detail." },
    { icon: "📦", label: "3D View", desc: "View → Create → 3D View → Default 3D View." },
  ], diagram: null },
  { id: 19, title: "Massing & Site", topics: ["Conceptual mass", "Model by face", "Toposurface", "Building pad"], objective: "Generate architectural elements from masses and model the site.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=massing%20site", videoQuery: "Revit massing site toposurface", steps: [
    { icon: "🏗️", label: "Massing Tool", desc: "Massing & Site → Conceptual Mass → In-Place Mass." },
    { icon: "🧱", label: "Model by Face", desc: "Select mass → Model by Face: creates walls/floors/roofs from faces." },
    { icon: "🌍", label: "Toposurface", desc: "Massing & Site → Model Site → Toposurface. Click points with elevation." },
    { icon: "⬛", label: "Building Pad", desc: "Massing & Site → Building Pad. Flat platform that cuts into the terrain." },
  ], diagram: null },
  { id: 20, title: "Design Options", topics: ["Option sets", "Variants", "Compare options"], objective: "Manage design variants in the same file.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=design%20options", videoQuery: "Revit design options tutorial", steps: [
    { icon: "⚙️", label: "Design Options", desc: "Manage → Design Options. Create Option Set with different options." },
    { icon: "✏️", label: "Edit option", desc: "Select option from the bottom menu → draw elements for that variant." },
    { icon: "👁️", label: "Compare", desc: "In each view you can set which option to display." },
    { icon: "✅", label: "Accept", desc: "Manage → Design Options → Accept Primary." },
  ], diagram: null },
  { id: 21, title: "Schedules", topics: ["Room schedule", "Door/window schedule", "Formulas", "Export to Excel"], objective: "Create automatic schedules extracted from the model.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=schedules", videoQuery: "Revit schedules tutorial", steps: [
    { icon: "📊", label: "Create Schedule", desc: "View → Create → Schedules → Schedule/Quantities. Choose category." },
    { icon: "➕", label: "Add fields", desc: "Fields tab: add parameters (Width, Height, Mark, Level)." },
    { icon: "🔽", label: "Filter and sort", desc: "Filter + Sorting/Grouping tabs: group by type or level." },
    { icon: "📤", label: "Export to Excel", desc: "File → Export → Reports → Schedule → .txt → open in Excel." },
  ], diagram: null },
  { id: 22, title: "Annotations", topics: ["Dimensions", "Text", "Tags", "Spot elevation"], objective: "Annotate views correctly for documentation.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=dimensions%20annotations", videoQuery: "Revit annotations dimensions tags", steps: [
    { icon: "📏", label: "Aligned Dimension", desc: "Annotate → Dimension → Aligned. Click elements, then click away to place." },
    { icon: "📝", label: "Text", desc: "Annotate → Text → Text. Click and type." },
    { icon: "🏷️", label: "Tag by Category", desc: "Annotate → Tag → Tag by Category. Click element for automatic tag." },
    { icon: "📍", label: "Spot Elevation", desc: "Annotate → Dimension → Spot Elevation. Click floor for absolute elevation." },
  ], diagram: null },
  { id: 23, title: "Sheets", topics: ["Create sheets", "Titleblock", "Views on sheet", "Revisions"], objective: "Compose and organise project sheets.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=sheets%20titleblock", videoQuery: "Revit sheets titleblock tutorial", steps: [
    { icon: "📄", label: "New Sheet", desc: "View → Sheet Composition → Sheet. Choose titleblock." },
    { icon: "🖼️", label: "Add views", desc: "From the Project Browser, drag a view onto the sheet." },
    { icon: "📐", label: "Align views", desc: "Select viewports → Align (AL). Lock position with padlock." },
    { icon: "📋", label: "Titleblock", desc: "Double-click titleblock to fill in sheet number, title, date." },
  ], diagram: null },
  { id: 24, title: "Links", topics: ["Link Revit models", "Overlay vs Attachment", "CAD link"], objective: "Link models from different disciplines.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=link%20models", videoQuery: "Revit link models CAD tutorial", steps: [
    { icon: "🔗", label: "Insert Link", desc: "Insert → Link Revit. Choose the .rvt file to link." },
    { icon: "⚙️", label: "Overlay vs Attachment", desc: "Overlay: doesn't propagate. Attachment: propagates. Default: Overlay." },
    { icon: "📋", label: "Manage Links", desc: "Insert → Manage Links. Reload, remove or update links." },
    { icon: "📂", label: "CAD Link", desc: "Insert → Link CAD. Links DWG as reference without embedding it." },
  ], diagram: null },
  { id: 25, title: "Manage & Coordinate", topics: ["Project base point", "Survey point", "Shared coordinates", "Copy/Monitor"], objective: "Manage coordinate systems between linked models.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=shared%20coordinates", videoQuery: "Revit manage coordinate copy monitor", steps: [
    { icon: "📍", label: "Project Base Point", desc: "Internal reference point. Circle with X in plan view." },
    { icon: "🌍", label: "Survey Point", desc: "Real geographic reference for coordinating with other models." },
    { icon: "🔄", label: "Shared Coordinates", desc: "Manage → Coordinates → Acquire/Publish Coordinates." },
    { icon: "👁️", label: "Copy/Monitor", desc: "Collaborate → Copy/Monitor. Copy levels/grids from linked model." },
  ], diagram: null },
  { id: 26, title: "Export", topics: ["DWG", "PDF", "IFC", "NWC Navisworks"], objective: "Export the model in the formats required by the project.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/?query=export%20dwg%20ifc", videoQuery: "Revit export DWG PDF IFC", steps: [
    { icon: "📤", label: "Export DWG", desc: "File → Export → CAD Formats → DWG. Configure layer mapping." },
    { icon: "🖨️", label: "Export PDF", desc: "File → Export → PDF (Revit 2022+)." },
    { icon: "🔄", label: "Export IFC", desc: "File → Export → IFC. Configure schema and category mapping." },
    { icon: "🏗️", label: "Export NWC", desc: "File → Export → NWC for clash detection in Navisworks." },
  ], diagram: null },
  { id: 27, title: "Final Project", topics: ["2-storey residential building", "From mass to documentation", "Export"], objective: "Apply the full curriculum on a real end-to-end project.", docsUrl: "https://help.autodesk.com/view/RVT/2025/ENU/", videoQuery: "Revit beginner full project tutorial", steps: [
    { icon: "📋", label: "Brief", desc: "2-storey residential building. GF: living room, kitchen, bathroom. FF: 2 bedrooms, bathroom, terrace." },
    { icon: "🏗️", label: "Phase 1 — Structure", desc: "Set up Levels and Grids. Create perimeter and internal walls on both levels." },
    { icon: "🪟", label: "Phase 2 — Openings", desc: "Insert doors, windows, stairs, floors and roof." },
    { icon: "📄", label: "Phase 3 — Documentation", desc: "Plans, elevations, sections, dimensions, tags, sheets." },
    { icon: "📤", label: "Phase 4 — Export", desc: "DWG, PDF and IFC." },
  ], diagram: null },
];

const SYSTEM_PROMPT = (lesson, lang) => {
  const stepsText = (lesson.steps || []).map(s => `${s.icon} ${s.label}: ${s.desc}`).join("\n");
  return lang === "en"
  ? `You are BIMentor, an AI tutor specialised in teaching Autodesk Revit to absolute beginners.
You are direct, practical and patient — like an expert colleague sitting next to the user.

Current lesson: ${lesson.id} — "${lesson.title}"
Topics: ${lesson.topics.join(", ")}
Objective: ${lesson.objective}

LESSON STEPS (your verified source of truth — base your answers on these, they are accurate):
${stepsText}

RESPONSE RULES:
- Always reply in ENGLISH
- Do NOT use asterisks (**) or hashtags (###) — use emoji and plain text
- Use emoji for section titles (e.g. "🖥️ THE RIBBON")
- Be concise and practical, get to the point
- Always propose a practical exercise at the end

ANSWERING TECHNICAL QUESTIONS:
- If the user asks a clear, specific question — even if it is about a topic from another lesson — ANSWER IT directly. Do NOT tell them they are in the wrong lesson or try to redirect them to the lesson path. Help with what they actually asked.
- Adapt to the user's level: if their question shows experience, skip the basics; if they seem new, go step by step.

WHEN YOU ARE NOT 100% SURE OF A PROCEDURE:
- Do NOT invent steps or button names. It is better to verify than to give a confident wrong answer.
- First, ask the user to send a screenshot of what they see on screen ("Send me a screenshot of your screen so I can guide you precisely").
- When a screenshot arrives, analyse it carefully and give specific feedback based on what is actually shown.
- Then point them to the official Autodesk documentation to confirm, using a search link relevant to THEIR specific question, in this format: https://help.autodesk.com/view/RVT/2025/ENU/?query=KEYWORDS (replace KEYWORDS with the exact topic of their question, e.g. "wall opening curtain wall").

CLOSING:
- When you give a technical procedure, end with a relevant Autodesk documentation link in the format above, matched to the specific question — not a generic one.`
  : `Sei BIMentor, un tutor AI per Autodesk Revit per principianti assoluti.
Sei diretto, pratico e paziente — come un collega esperto seduto accanto all'utente.

Lezione corrente: ${lesson.id} — "${lesson.title}"
Argomenti: ${lesson.topics.join(", ")}
Obiettivo: ${lesson.objective}

STEP DELLA LEZIONE (la tua fonte verificata — basa le risposte su questi, sono accurati):
${stepsText}

REGOLE DI RISPOSTA:
- Rispondi SEMPRE in italiano
- NON usare asterischi (**) o cancelletti (###) — usa emoji e testo normale
- Usa emoji per i titoli delle sezioni (es: "🖥️ IL RIBBON")
- Sii conciso e pratico, vai al punto
- Proponi sempre un esercizio pratico alla fine

RISPONDERE ALLE DOMANDE TECNICHE:
- Se l'utente fa una domanda chiara e specifica — anche se riguarda un argomento di un'altra lezione — RISPONDI direttamente. NON dirgli che è nella lezione sbagliata e non cercare di riportarlo al percorso delle lezioni. Aiutalo su ciò che ha davvero chiesto.
- Adattati al livello dell'utente: se la domanda mostra esperienza, salta le basi; se sembra alle prime armi, vai passo per passo.

QUANDO NON SEI SICURO AL 100% DI UNA PROCEDURA:
- NON inventare passaggi o nomi di pulsanti. È meglio verificare che dare una risposta sbagliata con sicurezza.
- Per prima cosa, chiedi all'utente di mandare uno screenshot di cosa vede a schermo ("Mandami uno screenshot del tuo schermo così ti guido con precisione").
- Quando arriva uno screenshot, analizzalo con attenzione e dai un feedback specifico basato su ciò che è realmente mostrato.
- Poi rimanda alla documentazione ufficiale Autodesk per conferma, con un link di ricerca pertinente alla SUA domanda specifica, in questo formato: https://help.autodesk.com/view/RVT/2025/ENU/?query=PAROLE (sostituisci PAROLE con l'argomento esatto della domanda, es. "wall opening curtain wall").

CHIUSURA:
- Quando dai una procedura tecnica, chiudi con un link alla documentazione Autodesk nel formato sopra, mirato alla domanda specifica — non generico.`;
};

function renderText(text) {
  return text.split("\n").map((line, i) => {
    if (line === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid #dfe4ee", margin: "10px 0" }} />;
    if (line.trim() === "") return <div key={i} style={{ height: "5px" }} />;
    if (line.startsWith("- ")) return (
      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "3px", paddingLeft: "4px" }}>
        <span style={{ color: "#3d7ef5", flexShrink: 0 }}>›</span>
        <span>{line.slice(2)}</span>
      </div>
    );
    return <div key={i} style={{ marginBottom: "2px", lineHeight: "1.7" }}>{line}</div>;
  });
}

export default function RevitTutor() {
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
    // Filter out error messages from history and keep last 12 messages to avoid context issues
    const cleanMsgs = msgs.filter(m => !(m.role === "assistant" && (!m.rawContent || m.rawContent === "")));
    const trimmed = cleanMsgs.slice(-12);
    // Ensure history starts with a user message (API requirement)
    const startIdx = trimmed.findIndex(m => m.role === "user");
    const validMsgs = startIdx >= 0 ? trimmed.slice(startIdx) : trimmed;
    const apiMsgs = validMsgs.map(m => ({
      role: m.role,
      content: m.role === "user" ? m.content : (m.rawContent || "...")
    }));

    // Retry up to 2 times
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
        if (data.error) {
          lastError = data.error.message || JSON.stringify(data.error);
          continue; // retry
        }
        const text = data.content?.find(b => b.type === "text")?.text;
        if (text) return text;
        lastError = "Risposta vuota dal server";
      } catch (e) {
        lastError = e.message || "Errore di rete";
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
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Errore: ${e.message}. Riprova tra qualche secondo.`, rawContent: "" }]);
    }
    setLoading(false);
  };

  const startLesson = async () => {
    setMessages([]); setLoading(true); setActiveTab("chat");
    try {
      const reply = await callAPI([{ role: "user", content: t.startPrompt, rawContent: t.startPrompt }]);
      setMessages([{ role: "assistant", content: reply, rawContent: reply }]);
    } catch (e) {
      setMessages([{ role: "assistant", content: `⚠️ Errore: ${e.message}. Clicca di nuovo "Inizia lezione".`, rawContent: "" }]);
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
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Error: ${e.message}. Please retry.`, rawContent: "" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f4f6fb", color: "#1a1d28", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", position: "relative" }}>

      {/* Welcome modal */}
      {showWelcome && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(230,235,245,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
          <div style={{ maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto", background: "#ffffff", border: "1px solid #e9edf5", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>⬡</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.3px" }}>{t.welcomeTitle}</div>
                <div style={{ fontSize: "12px", color: "#7a8290" }}>{t.welcomeSubtitle}</div>
              </div>
              {/* Language selector */}
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {["it", "en"].map(l => (
                  <button key={l} onClick={() => { setLang(l); setMessages([]); }} style={{ padding: "5px 10px", borderRadius: "6px", border: `1px solid ${lang === l ? "#3d7ef5" : "#dfe4ee"}`, background: lang === l ? "rgba(61,126,245,0.15)" : "transparent", color: lang === l ? "#3d7ef5" : "#7a8290", fontSize: "13px", cursor: "pointer", fontWeight: lang === l ? "700" : "400" }}>
                    {l === "it" ? "🇮🇹" : "🇬🇧"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#5a6270", lineHeight: "1.7", marginBottom: "20px" }}>
              {t.welcomeIntro}
            </div>

            {t.welcomeFeatures.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", padding: "12px", background: "#f4f6fb", border: "1px solid #dfe4ee", borderRadius: "10px" }}>
                <div style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#aab0bca48", marginBottom: "2px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>{item.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ fontSize: "12px", color: "#7a8290", lineHeight: "1.7", padding: "12px", background: "rgba(61,126,245,0.06)", border: "1px solid rgba(61,126,245,0.15)", borderRadius: "10px", marginBottom: "20px" }}>
              💡 <span style={{ color: "#2563c9", fontWeight: "600" }}>{t.welcomeTip}</span> {t.welcomeTipText}
            </div>

            <button onClick={() => setShowWelcome(false)} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {t.welcomeStart}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "252px" : "0", minWidth: sidebarOpen ? "252px" : "0", background: "#ffffff", borderRight: "1px solid #dfe4ee", display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.25s ease", flexShrink: 0 }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid #dfe4ee", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>⬡</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "-0.3px" }}>BIMentor</div>
              <div style={{ fontSize: "10px", color: "#c4ccda" }}>{t.appSubtitle}</div>
            </div>
          </div>
          <div style={{ marginTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#c4ccda", marginBottom: "4px" }}>
              <span>{t.progress}</span><span style={{ color: "#3d7ef5" }}>{currentLesson}/{curriculum.length}</span>
            </div>
            <div style={{ height: "2px", background: "#dfe4ee", borderRadius: "2px" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #3d7ef5, #9b4ff7)", borderRadius: "2px", transition: "width 0.4s" }} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px" }}>
          {curriculum.map((item, i) => (
            <button key={item.id} onClick={() => setCurrentLesson(i)} style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: "6px", border: "none", cursor: "pointer", marginBottom: "1px", background: currentLesson === i ? "rgba(61,126,245,0.1)" : "transparent", borderLeft: `2px solid ${currentLesson === i ? "#3d7ef5" : "transparent"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "9px", fontWeight: "700", color: i < currentLesson ? "#3d7ef5" : currentLesson === i ? "#3d7ef5" : "#e9edf5", minWidth: "16px" }}>
                  {i < currentLesson ? "✓" : String(item.id).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "12px", color: currentLesson === i ? "#1a1d28" : i < currentLesson ? "#9aa2b0" : "#6b7280", fontWeight: currentLesson === i ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #dfe4ee", display: "flex", alignItems: "center", gap: "10px", background: "#ffffff", flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", color: "#aab0bc", cursor: "pointer", fontSize: "17px", padding: "2px", lineHeight: 1, flexShrink: 0 }}>☰</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "10px", color: "#aab0bc" }}>{t.lessonOf(lesson.id, curriculum.length)}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</div>
          </div>
          <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
            {["it","en"].map(l => (
              <button key={l} onClick={() => { setLang(l); setMessages([]); }} style={{ padding: "3px 7px", borderRadius: "5px", border: `1px solid ${lang === l ? "#3d7ef5" : "#dfe4ee"}`, background: lang === l ? "rgba(61,126,245,0.1)" : "transparent", color: lang === l ? "#3d7ef5" : "#9aa2b0", fontSize: "12px", cursor: "pointer" }}>
                {l === "it" ? "🇮🇹" : "🇬🇧"}
              </button>
            ))}
          </div>
          <button onClick={() => setShowWelcome(true)} title={lang === "it" ? "Come si usa BIMentor" : "How to use BIMentor"} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #dfe4ee", background: "transparent", color: "#7a8290", cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>?</button>
          <a href={lesson.docsUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid #dfe4ee", background: "transparent", color: "#7a8290", textDecoration: "none", fontSize: "11px", flexShrink: 0 }}>📖 Docs</a>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.videoQuery || ("Revit " + lesson.title))}`} target="_blank" rel="noopener noreferrer" style={{ padding: "4px 10px", borderRadius: "5px", border: "1px solid #dfe4ee", background: "transparent", color: "#7a8290", textDecoration: "none", fontSize: "11px", flexShrink: 0 }}>{t.videoBtn || "🎥 Video"}</a>
          <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
            <button onClick={() => setCurrentLesson(i => Math.max(0, i - 1))} disabled={currentLesson === 0} style={{ padding: "4px 9px", borderRadius: "5px", border: "1px solid #dfe4ee", background: "transparent", color: currentLesson === 0 ? "#e4e9f2" : "#7a8290", cursor: currentLesson === 0 ? "not-allowed" : "pointer", fontSize: "11px" }}>{t.prev}</button>
            <button onClick={() => setCurrentLesson(i => Math.min(curriculum.length - 1, i + 1))} disabled={currentLesson === curriculum.length - 1} style={{ padding: "4px 9px", borderRadius: "5px", border: "none", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", color: "white", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}>{t.next}</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #dfe4ee", background: "#ffffff", flexShrink: 0 }}>
          {["chat", "steps"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 16px", border: "none", background: "transparent", color: activeTab === tab ? "#3d7ef5" : "#aab0bc", fontSize: "12px", fontWeight: activeTab === tab ? "600" : "400", cursor: "pointer", borderBottom: `2px solid ${activeTab === tab ? "#3d7ef5" : "transparent"}` }}>
              {tab === "chat" ? t.tabChat : t.tabSteps}
            </button>
          ))}
        </div>

        {/* Steps tab */}
        {activeTab === "steps" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <div style={{ marginBottom: "14px", padding: "12px", background: "#ffffff", border: "1px solid #dfe4ee", borderRadius: "8px" }}>
              <div style={{ fontSize: "10px", color: "#aab0bc", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.objective}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>{lesson.objective}</div>
            </div>

            {/* SVG Diagram */}
            {lesson.diagram && DIAGRAMS[lesson.diagram] && (
              <div style={{ marginBottom: "14px", padding: "12px", background: "#f4f6fb", border: "1px solid #dfe4ee", borderRadius: "8px" }}>
                <div style={{ fontSize: "10px", color: "#aab0bc", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.diagram}</div>
                {DIAGRAMS[lesson.diagram]}
              </div>
            )}

            <div style={{ fontSize: "10px", color: "#aab0bc", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.steps}</div>
            {lesson.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px", padding: "12px 14px", background: "#ffffff", border: "1px solid #dfe4ee", borderRadius: "9px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(61,126,245,0.1)", border: "1px solid rgba(61,126,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>{step.icon}</div>
                  <div style={{ fontSize: "9px", fontWeight: "700", color: "#3d7ef5" }}>{String(i + 1).padStart(2, "0")}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#2a2d3a", marginBottom: "3px" }}>{step.label}</div>
                  <div style={{ fontSize: "12px", color: "#7a8290", lineHeight: "1.6" }}>{step.desc}</div>
                  <button onClick={() => askAboutStep(step)} style={{ marginTop: "8px", padding: "3px 10px", borderRadius: "5px", border: "1px solid #dfe4ee", background: "transparent", color: "#3d7ef5", fontSize: "11px", cursor: "pointer" }}>{t.askAI}</button>
                </div>
              </div>
            ))}
            <a href={lesson.docsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#ffffff", border: "1px solid #dfe4ee", borderRadius: "8px", color: "#9aa2b0", textDecoration: "none", fontSize: "12px", marginTop: "4px" }}>
              <span>📖</span><span>{t.officialDocs} — {lesson.title}</span><span style={{ marginLeft: "auto" }}>↗</span>
            </a>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.videoQuery || ("Revit " + lesson.title))}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "#ffffff", border: "1px solid #dfe4ee", borderRadius: "8px", color: "#9aa2b0", textDecoration: "none", fontSize: "12px", marginTop: "4px" }}>
              <span>🎥</span><span>{t.videoBtn || "🎥 Video"} — YouTube</span><span style={{ marginLeft: "auto" }}>↗</span>
            </a>
          </div>
        )}

        {/* Chat tab */}
        {activeTab === "chat" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {messages.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "14px", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>⬡</div>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "5px" }}>{lesson.title}</div>
                    <div style={{ fontSize: "12px", color: "#aab0bc", maxWidth: "300px", lineHeight: "1.6" }}>{lesson.objective}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={startLesson} style={{ padding: "9px 22px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>{t.startLesson}</button>
                    <button onClick={() => setActiveTab("steps")} style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #dfe4ee", background: "transparent", color: "#7a8290", fontSize: "13px", cursor: "pointer" }}>{t.viewGuide}</button>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: "14px", display: "flex", gap: "8px", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "6px", flexShrink: 0, background: msg.role === "user" ? "#dfe4ee" : "linear-gradient(135deg, #3d7ef5, #9b4ff7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
                    {msg.role === "user" ? "👤" : "⬡"}
                  </div>
                  <div style={{ maxWidth: "82%", minWidth: 0 }}>
                    {msg.hasImage && <div style={{ marginBottom: "4px", fontSize: "10px", color: "#aab0bc" }}>{t.screenshotLabel}</div>}
                    <div style={{ padding: "11px 13px", borderRadius: msg.role === "user" ? "11px 2px 11px 11px" : "2px 11px 11px 11px", background: msg.role === "user" ? "#e9edf5" : "#ffffff", border: "1px solid #dfe4ee", fontSize: "13px", color: "#3a4150" }}>
                      {msg.role === "assistant" ? renderText(msg.content) : <span style={{ whiteSpace: "pre-wrap" }}>{msg.displayText || ""}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "linear-gradient(135deg, #3d7ef5, #9b4ff7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>⬡</div>
                  <div style={{ padding: "11px 13px", borderRadius: "2px 11px 11px 11px", background: "#ffffff", border: "1px solid #dfe4ee", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0,1,2].map(j => <div key={j} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3d7ef5", animation: `pulse 1.2s ease-in-out ${j*0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {imagePreview && (
              <div style={{ padding: "7px 16px 0", display: "flex", alignItems: "center", gap: "7px", background: "#f4f6fb" }}>
                <img src={imagePreview} style={{ height: "44px", borderRadius: "5px", border: "1px solid #dfe4ee" }} alt="preview" />
                <button onClick={() => { setImageData(null); setImagePreview(null); }} style={{ background: "#dfe4ee", border: "none", color: "#6b7280", cursor: "pointer", borderRadius: "4px", padding: "2px 8px", fontSize: "11px" }}>✕</button>
              </div>
            )}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #dfe4ee", background: "#ffffff", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "7px", alignItems: "flex-end" }}>
                <button onClick={() => fileInputRef.current?.click()} title="Carica screenshot" style={{ padding: "7px", borderRadius: "7px", border: "1px solid #dfe4ee", background: "#f4f6fb", color: "#aab0bc", cursor: "pointer", fontSize: "15px", flexShrink: 0, lineHeight: 1 }}>📎</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="{t.inputPlaceholder}" rows={1}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "7px", border: "1px solid #dfe4ee", background: "#f4f6fb", color: "#1a1d28", fontSize: "13px", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: "1.5", maxHeight: "90px" }}
                  onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px"; }} />
                <button onClick={sendMessage} disabled={loading || (!input.trim() && !imageData)}
                  style={{ padding: "8px 14px", borderRadius: "7px", border: "none", background: loading || (!input.trim() && !imageData) ? "#dfe4ee" : "linear-gradient(135deg, #3d7ef5, #9b4ff7)", color: loading || (!input.trim() && !imageData) ? "#dfe4ee" : "white", cursor: loading || (!input.trim() && !imageData) ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "12px", flexShrink: 0 }}>
                  {t.send}
                </button>
              </div>
              <div style={{ marginTop: "4px", fontSize: "10px", color: "#e4e9f2", textAlign: "center" }}>{t.inputHint}</div>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#dfe4ee;border-radius:2px}
        *{box-sizing:border-box} a:hover{opacity:0.8} button:hover:not(:disabled){opacity:0.85}
      `}</style>
    </div>
  );
}
