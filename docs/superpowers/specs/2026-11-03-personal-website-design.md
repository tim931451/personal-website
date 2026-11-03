# Design: Portfolio-Webseite Tim Rusch

Stand: 2026-11-03. Ergebnis von drei Fragerunden (grilling) mit Tim.
Dieses Dokument liegt vorläufig im OneDrive-Ordner «Personal Website» und wird beim Scaffold nach
`~/Projects/personal-website/docs/superpowers/specs/` verschoben und committet.

## 1. Zweck und Warum

Tim Rusch, Business-AI-Student an der FHNW, sucht ab Januar 2027 eine Werkstudenten- oder
Praktikumsstelle in Data/AI. Die Seite soll Recruitern und Hackathon-Partnern in 30 Sekunden zeigen,
was er baut, und bei Teamprojekten klar zeigen, was sein Anteil war.

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
- One-Pager mit Hero, Selected projects, Experience and education, Skills, Contact.
- Eine Detailseite pro Projekt unter `/projects/[slug]`.
- Neue Projekte ohne Code ergänzen (eine Markdown-Datei pro Projekt).
- Lighthouse ≥ 95 in allen vier Kategorien, responsive ab 360 px, Hell/Dunkel nach System,
  barrierearm (Kontrast ≥ 4.5:1, Alt-Texte, sichtbare Fokuszustände).
- SEO: Title, Meta-Description, OG-Bild, sitemap.xml, robots.txt, Favicon.

**Nicht-Ziele**
- Kein Blog, kein CMS, kein Kontaktformular, keine Analytics (vorerst), kein Theme-Umschalter.
- Keine Projekt-Screenshots (vorerst).
- Keine eigene Domain jetzt (aber einplanen, siehe 9).

**Anti-Ziele (Misserfolg, auch wenn es technisch läuft)**
- Erfundene Zahlen, Kunden, Zitate, Testimonials oder Komponenten.
- Teamarbeit, die als Tims Arbeit dargestellt wird.
- Telefonnummer, Adresse oder Geburtsdatum irgendwo öffentlich (auch nicht im PDF).
- Links auf private Repos.
- Platzhaltertext auf der Live-Seite.
- Floskeln («passionate», «rockstar»), Emojis, lange Gedankenstriche (— und –) im Seitentext.
- Animationslastiges Design. Nur dezente Übergänge (Hover/Fokus).

## 3. Technik (von Tim festgelegt)

- Astro, aktuelle stabile Version, TypeScript, statischer Output, kein clientseitiges JS-Framework.
  Astro-Doku über Context7 (`npx ctx7`) nachschlagen, nicht aus dem Gedächtnis.
- Plain CSS mit CSS-Variablen, kein Tailwind.
- Content Collection `projects`, eine Markdown-Datei pro Projekt unter `src/content/projects/`.
- Projektordner `~/Projects/personal-website` (nicht OneDrive), Git-Repo, öffentlich auf GitHub als
  `tim931451/personal-website` (mit `gh` anlegen).
- Deploy wie `~/Projects/slide-astro`: wrangler-Direktupload, Cloudflare-Pages-Projekt `timrusch`
  (→ timrusch.pages.dev). Skript
  `"publish": "astro build && wrangler pages deploy dist --project-name=timrusch --branch=main --commit-dirty=true"`.
  Reihenfolge immer: commit → push → publish. Keine Git-Integration bei Cloudflare.
  wrangler ist aktuell nicht eingeloggt: Tim führt `npx wrangler login` aus, wenn es so weit ist.
- Nichts Inhaltliches aus slide-astro übernehmen, nur Setup-/Deploy-/Workflow-Muster.
- Commits nach jedem grösseren Schritt, Conventional-Präfixe (`feat:`, `fix:`, `style:`, `content:`,
  `refactor:`, `docs:`), Autor = globales Git-Profil, Zeile `Co-Authored-By: Claude` bleibt drin.
  Secret-Check vor jedem Commit, nie Force-Push.
- Projekt-`CLAUDE.md` (Deutsch): Stack, Befehle (`dev`, `build`, `preview`, `publish`), wie man ein
  Projekt ergänzt, Inhaltsregeln aus Abschnitt 2, Workflow (Secret-Check, Präfixe, Push vor Publish,
  kein Force-Push), Hinweis «nur der Web-CV».
- Keine LICENSE-Datei. README-Satz: Inhalte (Texte, Foto, CV) sind nicht zur Wiederverwendung freigegeben.

## 4. Assets

- **Foto:** `~/Library/CloudStorage/OneDrive-Personal/HS26/Claude outputs/Profilbild_quadratisch.jpg`
  (1080×1080). Original unverändert ins Repo (`src/assets/`), Ausgabe über `astro:assets` als
  AVIF/WebP in passenden Grössen. Alt-Text: «Portrait of Tim Rusch».
- **CV:** NUR `~/Library/CloudStorage/OneDrive-Personal/HS26/Claude outputs/Lebenslauf_Tim_Rusch_2026-11_web.pdf`
  → `public/cv.pdf`, unverändert. Das Original (mit Adresse/Telefon) kommt nie ins Repo.
  Pflichtprüfung vor jedem Deploy: Skript `scripts/check-cv.sh` prüft `public/cv.pdf` mit `pdftotext`
  gegen Suchmuster (Strassenname, Telefonvorwahl, Geburtsdatum) und bricht `publish` ab, wenn eines
  vorkommt (am 2026-11-03 manuell geprüft: sauber). Die Muster selbst sind privat und stehen nur in
  der gitignorten Datei `.private-patterns`; fehlt sie, bricht das Skript ebenfalls ab.
  Dieses Spec-Dokument kommt ohne die Muster ins öffentliche Repo.
  Button: «Download CV (German, PDF)».
- **Foto-Metadaten:** am 2026-11-03 geprüft, keine GPS- oder Kameradaten. Original geht unverändert ins Repo.

## 5. Design (von Tim bestätigt)

- **Schrift:** eine einzige, Geist Sans Variable, selbst gehostet via `@fontsource-variable/geist`.
- **Farben:** Akzent Petrol `#0F6E6E` (hell) / `#5CC8C0` (dunkel). Grund `#FAFAF9` (hell) / `#111315`
  (dunkel), Text fast schwarz bzw. fast weiss, ein gedämpfter Grauton für Sekundärtext.
  Alle Text/Hintergrund-Paare ≥ 4.5:1 (prüfen, Werte notfalls nachjustieren, Akzent bleibt Petrol).
  Hell/Dunkel nur über `prefers-color-scheme`.
- **Stil:** ruhig, modern, viel Weissraum. Textspalte ~70 Zeichen, Projektbereich breiter
  (max. ~1080 px). Übergänge nur Hover/Fokus, ~150 ms, `prefers-reduced-motion` respektieren.
  Keine Stockbilder, keine Emojis, Icons nur als inline SVG.
- **Header:** nicht sticky. Name links, rechts Anker Projects, Experience, Skills, Contact.
  Mobil rutschen die Anker unter den Namen. Kein Hamburger, kein JS.
- **Hero:** Desktop: Text links, Foto rechts (~240 px, Quadrat, Radius 12 px). Mobil: Foto oben
  (~120 px), darunter Name, Headline, Intro, Buttons. Buttons: Download CV (German, PDF), GitHub,
  LinkedIn, Email.
- **Projekte auf der Startseite:** vier grosse Karten im 2×2-Raster (mobil 1 Spalte) mit Titel,
  Einzeiler, Stack-Tags, Kontext (Modul/Event, Jahr) und Status-Badge (shipped / in progress);
  ganze Karte ist Link. Darunter die vier kleineren Projekte als kompakte Liste (Titel, Einzeiler,
  Kontext, Status), ebenfalls verlinkt.
- **Experience and education:** eine gemeinsame, chronologische vertikale Timeline.
- **Skills:** Gruppen mit Text-Tags, keine Balken, keine Prozente.
- **Contact:** E-Mail (sichtbarer `mailto:`-Link) und LinkedIn. Nichts anderes.
- **Detailseiten:** Abschnitte Problem, Approach and architecture, My role, Stack, Status and results,
  Links. Zurück-Link zur Startseite.
- **404-Seite** im selben Stil.

## 6. Inhalte der Startseite (Seitensprache Englisch)

**Hero**
- Name: Tim Rusch
- Headline: «Business AI Student | Agentic AI, ML & Data»
- Intro, wortwörtlich: «I study Business Artificial Intelligence at FHNW and build agentic AI systems
  and machine learning pipelines. I am looking for a working student position or internship in data or
  AI from January 2027.»
- Links: github.com/tim931451, linkedin.com/in/tim-rusch, tim.rusch@bluewin.ch, /cv.pdf

**Timeline (oben = neuestes/kommend)**
1. Upcoming, 4 to 5 December 2026: Hack Apertus Basel, one of 150 selected builders.
2. 09/2024 to 2028 (expected): BSc Business Artificial Intelligence, FHNW School of Business. Focus on
   agentic AI, machine learning and data engineering.
3. Since 2023: Social media manager (freelance, part-time) for Swiss SMEs. Brands: SLIDE and Furrer
   Metallbau, ANDREANI and KIVA, Oli's Modellbahndepot. Strategy, copy, photo and video for five
   brands; automation with Python, e.g. scheduling YouTube Shorts via the YouTube Data API.
   (Werbebudget NICHT nennen.)
4. 2023 to 2024: Intern Front Desk and Events, Basel Area Business & Innovation.
5. 2020 to 2024: Federal Vocational Baccalaureate and EFZ, Wirtschaftsmittelschule Reinach BL.

Ort-Angabe irgendwo dezent erlaubt: «Based in the Basel area.»

**Skills (genau diese)**
- Agentic AI and LLMs: LangGraph, MCP servers, LangSmith, Claude API (tool use), AWS Bedrock AgentCore,
  LiteLLM, guardrails, Apertus
- Machine learning and data: Python, pandas, Polars, SQL and MySQL, scikit-learn, NetworkX, Gymnasium,
  Azure ML, data pipelines, regression and classification
- Engineering and deployment: FastAPI, Docker, Google Cloud Run, CI/CD on render.com, Streamlit,
  pytest, Git and GitHub
- Content and communication: social media strategy, copywriting, photo and video production
- Languages: German (native), English B2 (Cambridge B2 First), French B1 (DELF)
- Certificates: Claude Code 101 (Anthropic, 2026), ICT Advanced-User SIZ (2023)

## 7. Projekte

Reihenfolge = `order`. Featured (gross): 1 bis 4. Diagramm nur bei 1 bis 4.
Repo-Link nur, wo angegeben. Noten nur auf der Detailseite.

### 1. Swiss Legal Agent (`swiss-legal-agent`)
- One-liner: Multi-agent system that drafts legal opinions in Swiss employment and tenancy law with
  verifiable sources.
- Context: Generative AI and Agent Systems, FHNW, HS 2026 · Team of 2 · In progress
- Fakten zum System: router, specialist agents and reviewer loop in LangGraph; own MCP server for Fedlex
  law texts (fedlex-mcp); retrieval with BM25 and embeddings (FAISS); guardrails with PII redaction and
  citation check; tracing with LangSmith; evaluation of the Swiss model Apertus against a commercial
  model with LLM-as-a-judge.
- My role: I built the Apertus integration with model-based endpoint routing, the processing pipeline
  with a jurisdiction anchor, our own MCP server fedlex-mcp, the LangGraph orchestration (router,
  specialist agents, reviewer loop, human in the loop), the input guardrails, the citation check,
  tracing with LangSmith and the evaluation run of Apertus against a commercial model.
- Team: My teammate defined the idea and scope and built the test set, the Fedlex ingestion, the
  retrieval (BM25 and FAISS embeddings), the UI and the LLM-as-a-judge, and led the storyline and
  presentation. (Teammate nicht namentlich nennen.)
- Repo: privat, nicht verlinken. TODO-Kommentar: «Nach Abgabe 23.11.2026 prüfen, ob Repo öffentlich wird».

### 2. Pythia, AI advisor for SMEs (`pythia`)
- One-liner: AI advisor that assesses an SME's AI maturity and proposes use cases with a business case.
- Context: FHNW MAKEathon, October 2026 · Two-day hackathon, team of 5 · Shipped
- My role: I built the AI core: seven role agents, tools via a gateway, guardrails and a knowledge base
  on AWS Bedrock AgentCore. A teammate built the frontend and the live demo as a Streamlit web app.
- Zusatz, wortwörtlich: «Part of the team will compete again as Team Pythia at Hack Apertus Basel
  (4 to 5 December 2026).»
- Kein Ergebnis/Platzierung nennen. Kein Repo.

### 3. SOC Triage Assistant (`soc-triage-assistant`)
- One-liner: Security incident triage for SMEs, built on Microsoft's GUIDE dataset with 9.5 million
  evidence records.
- Context: Machine Learning and Knowledge-Based Systems, FHNW, HS 2026 · Team of 2 · In progress
- My role: I built the data pipeline with a leakage check, the mapping to MITRE ATT&CK, the ontology and
  rule engine, and the reproducible repository. I am also responsible for the ML models, which are in
  progress.
- Stack: Python, Polars, scikit-learn, NetworkX. Repo privat.

### 4. James (`james`)
- One-liner: German-language voice assistant for macOS with local wake word and speech recognition and
  about 1.7 s to first audio.
- Context: Personal project, since October 2026 · Solo · In progress
- My role: Solo project, I designed and built the whole pipeline.
- Details: local wake word and speech recognition (openWakeWord, Parakeet MLX); answers via the Claude
  API with tool use (weather, news, web search); speech output via ElevenLabs with local Piper fallback;
  about 1.7 s to first audio; write actions only after spoken confirmation. Repo privat.

### 5. LexLoop (`lexloop`)
- One-liner: A contextual bandit learns which of three LLM agents solves a legal case best, rewarded via
  an LLM-as-a-judge rubric.
- Context: Reinforcement Learning, FHNW, HS 2026 · Team of 4 · In progress
- My role: I built the environment, the run logging and the Apertus integration, and I am responsible for
  documentation and QA.
- Stack: Python, Gymnasium, LiteLLM, pytest. Repo privat.

### 6. ECTS tracker and MLOps (`ects-tracker-mlops`)
- One-liner: FastAPI service with CI/CD on render.com and a forecast of Swiss electricity consumption
  deployed as an Azure ML endpoint.
- Context: AI Operations, FHNW, HS 2026 · Solo · In progress (submission 6 December 2026; service is
  deployed, remaining work ongoing)
- Details: Swissgrid data, Azure ML endpoint, cost monitoring.
- Repo: https://github.com/tim931451/ects-tracker

### 7. Restaurant order forecast (`restaurant-order-forecast`)
- One-liner: Pipeline that forecasts restaurant orders from weather data, with a regression model and a
  dashboard on Google Cloud Run.
- Context: Data Engineering and Wrangling, FHNW, FS 2026 · Shipped
- Grade (nur Detailseite): «Grade 6.0 (Swiss scale, 6 = best)». Modulnote beruht ganz auf dem Projekt.
- Details: weather API, regression model, dashboard, containerised with Docker on Google Cloud Run.
- Repo: https://github.com/tim931451/fus-asia-dashboard
- **OFFEN (Tim):** Teamgrösse (2 oder 3) und Tims Anteil. Bis dahin: siehe Abschnitt 10.

### 8. Ad campaign success prediction (`ad-campaign-prediction`)
- One-liner: Binary classification for an event agency: five algorithms compared, logistic regression
  reached an AUC of 0.84.
- Context: Machine Learning, FHNW, FS 2026 · Team of 4 · Shipped
- Werkzeuge laut Aufgabe: Tableau Prep and Orange.
- KEINE Note anzeigen. Agentur nicht namentlich nennen. Kein Repo.
- **OFFEN (Tim):** Tims Anteil. Bis dahin: siehe Abschnitt 10.

Detailseiten 5 bis 8: «Approach and architecture» als 2 bis 4 Sätze nur aus den obigen Fakten.

## 8. Diagramme

- Nur Projekte 1 bis 4. Erstellt mit dem Skill excalidraw-diagram, exportiert als SVG, je eine helle
  und eine dunkle Variante, Auswahl per `<picture>` mit `prefers-color-scheme`.
- Stil: gerade Linien (keine Handzeichnung), Schrift der Seite (oder neutrale Sans), Akzent Petrol.
- Nur Komponenten, die in Abschnitt 7 stehen. Nichts erfinden.
- Swiss Legal Agent: Tims Teile und Teamteile optisch unterscheidbar (z. B. Akzent vs. neutral) und in
  einer Legende benannt.
- **Freigabe:** Tim bekommt die vier Diagramme als Screenshot zur Prüfung, BEVOR sie eingebaut werden.
- Jedes Diagramm bekommt eine Textbeschreibung (Alt-Text bzw. Beschriftung) für Screenreader.

## 9. SEO, Domain, Meta

- `site` zentral in `astro.config.mjs` (`https://timrusch.pages.dev`). Eigene Domain später: diese
  Zeile ändern und Custom Domain in Cloudflare hinzufügen (macht Tim im Dashboard).
- Pro Seite Title, Meta-Description, canonical URL, OG/Twitter-Tags.
- OG-Bild 1200×630: Foto, Name, Headline, neutraler Grund mit Petrol-Akzent, einmal beim Build erzeugt.
- `@astrojs/sitemap`, `robots.txt` mit Sitemap-Verweis, SVG-Favicon (Monogramm «TR») plus PNG/ICO-Fallback
  und apple-touch-icon.
- JSON-LD `Person` (Name, jobTitle, sameAs GitHub/LinkedIn, email). Keine Adresse.
- Keine Analytics.

## 10. Offene Punkte und Umgang damit

- Restaurant order forecast: Teamgrösse und Tims Anteil fehlen (Tims Antwort enthielt noch Platzhalter).
- Ad campaign: Tims Anteil fehlt (dito).
- Regel: Kein Platzhaltertext live, und bei Teamprojekten muss der eigene Anteil klar sein. Solange die
  Angaben fehlen, bekommen beide Projekte `draft: true` und erscheinen nicht auf der Live-Seite;
  TODO-Kommentar in der Datei, Eintrag in der Abschlussliste.
- Swiss Legal Agent: Repo-Link nach dem 23.11.2026 nachrüsten, falls öffentlich.
- Eigene Domain: später.

## 11. Qualitätssicherung (von Tim festgelegt)

- `npm run build` fehlerfrei, `astro check` ohne Fehler.
- Jede Seite mit Playwright in 390 px und 1440 px, hell und dunkel, Screenshots selbst ansehen und
  Abweichungen beheben. Zusätzlich 360 px auf horizontales Scrollen prüfen.
- Linkcheck über `dist` (interne Links, Anker, externe Links erreichbar).
- Lighthouse lokal gegen `npm run preview`, alle Kategorien ≥ 95, mobil und Desktop.
- Kontrastprüfung aller Farbpaare.
- Text-Check: keine `—`/`–` im Seitentext, keine Emojis, keine verbotenen Floskeln, kein «TODO»/
  «lorem» im `dist`.
- CV-Check (Abschnitt 4).
- Vor Go-live: Skill verification-before-completion und das code-review-Plugin.

## 11b. Ablauf und Kontrollpunkte (Entscheid des Builders, für Tim zur Prüfung)

1. Scaffold, Design-System, Startseite, Detailseiten bauen, lokal prüfen, jeweils committen.
2. Die vier Diagramme erstellen und Tim als Screenshots vorlegen. **Halt bis zur Freigabe.**
   Detailseiten funktionieren auch ohne Diagramm (wie bei Projekten 5 bis 8).
3. Nach Freigabe einbauen, komplette QA (Abschnitt 11), Repo anlegen und pushen.
4. Tim führt `npx wrangler login` aus, dann `npm run publish`, danach Linkcheck und Lighthouse
   gegen die Live-URL.

## 12. Dem Builder überlassen

- Komponentenschnitt, Dateinamen, CSS-Organisation, genaue Abstände und Typo-Skala.
- Zod-Schema-Details der Collection (mindestens: title, summary, context, period, team, status,
  order, featured, stack, role, repo?, grade?, draft?, diagram?, image?).
- Wie das OG-Bild erzeugt wird (z. B. sharp aus SVG), solange es beim Build entsteht.
- Wortlaut der Abschnitte Problem, Approach, Status and results auf den Detailseiten, solange nur
  Fakten aus Abschnitt 7 verwendet werden.
