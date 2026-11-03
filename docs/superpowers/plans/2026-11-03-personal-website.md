# Portfolio-Webseite Tim Rusch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Statische Portfolio-Seite (One-Pager + 6 sichtbare Projektdetailseiten) für Tim Rusch, live auf timrusch.pages.dev.

**Architecture:** Astro 7 im statischen Modus. Projekte als Content Collection (Markdown + Zod-Schema),
Profil-Daten (Timeline, Skills, Links) als typisierte TS-Datei. Plain CSS mit Tokens in einer globalen
Datei, Komponenten-Styles scoped. Qualitätsregeln als Node-Skripte, die gegen `dist/` laufen und
`publish` blockieren.

**Tech Stack:** Astro 7.4.x, TypeScript strict, @astrojs/sitemap 3.7.x, @fontsource-variable/geist 5.x,
sharp (über Astro), wrangler 4.x, Node 25 (`node --test` mit nativer TS-Typentfernung), playwright-cli,
Lighthouse über `npx`.

**Spec:** `docs/superpowers/specs/2026-11-03-personal-website-design.md` (Abschnittsnummern unten = Spec-Abschnitte)

## Global Constraints

- Projektordner `~/Projects/personal-website`, Repo `tim931451/personal-website` (öffentlich).
- Astro-Doku nur über `npx ctx7@latest docs /websites/astro_build_en "<frage>"`, nicht aus dem Gedächtnis.
- Kein Tailwind, kein clientseitiges JS-Framework, kein clientseitiges JavaScript.
- Eine Schrift: Geist Sans Variable via `@fontsource-variable/geist`.
- Farben: Akzent `#0F6E6E` hell / `#5CC8C0` dunkel; Grund `#FAFAF9` hell / `#111315` dunkel; alle Textpaare ≥ 4.5:1.
- Seitensprache Englisch, `<html lang="en">`.
- Seitentext ohne `—` und `–`, ohne Emojis, ohne «passionate», «rockstar», ohne «TODO», «lorem», «placeholder».
- Keine Telefonnummer, keine Adresse, kein Geburtsdatum, keine Links auf private Repos.
- Nur Fakten aus Spec Abschnitt 6 und 7. Texte dort wortwörtlich, wo sie als wortwörtlich markiert sind.
- `public/cv.pdf` = ausschliesslich `Lebenslauf_Tim_Rusch_2026-11_web.pdf`, unverändert.
- Private Suchmuster nur in `.private-patterns` (gitignored), nie in getrackten Dateien.
- Commit nach jeder Task, Conventional-Präfix, Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Reihenfolge Deploy: commit → push → publish. Nie Force-Push.

## Review Focus

1. **Draft-Projekt per Direkt-URL:** `/projects/restaurant-order-forecast/` darf nicht existieren (404), nicht in der Sitemap stehen und nirgends verlinkt sein. Test in Task 4 (Build) und Task 7 (Preview).
2. **360 px Breite:** lange Wörter (z. B. «AgentCore», Repo-URLs) und Tag-Listen dürfen kein horizontales Scrollen erzeugen. Test in Task 7 (scrollWidth ≤ clientWidth).
3. **Tastatur-Nutzung:** jede Karte, jeder Button, jeder Anker per Tab erreichbar mit sichtbarem Fokusring, Skip-Link vorhanden. Test in Task 7.
4. **Dunkelmodus-Diagramme und -Kontrast:** dunkle SVG-Variante wird bei `prefers-color-scheme: dark` geladen, Kontraste auch dunkel ≥ 4.5:1. Test in Task 7.
5. **CV-Leck:** falsche PDF-Datei landet in `public/`. `check-cv.sh` bricht `publish` ab. Test in Task 6.

---

### Task 1: Scaffold, Tokens, Base-Layout

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`,
  `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`,
  `src/pages/index.astro` (vorerst nur Layout), `src/pages/404.astro`, `src/assets/portrait.jpg`, `public/cv.pdf`
- Move: Spec und Plan nach `docs/superpowers/` im Repo

**Interfaces:**
- Produces: `Base.astro` Props `{ title: string; description: string; ogImage?: string; noindex?: boolean }`.
  CSS-Tokens: `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-contrast`,
  `--radius: 12px`, `--measure: 70ch`, `--wide: 1080px`, Spacing `--s-1`…`--s-8`.

- [ ] **Step 1:** `mkdir ~/Projects/personal-website && cd` dorthin, `git init -b main`, `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston`, dann `npm install` und `npm i @astrojs/sitemap @fontsource-variable/geist`, `npm i -D @astrojs/check typescript`.
- [ ] **Step 2:** Foto nach `src/assets/portrait.jpg` kopieren (`cp`, unverändert), Web-CV nach `public/cv.pdf` (`cp`, unverändert). `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.env*`, `.private-patterns`, `.DS_Store`, `.playwright-cli/`, `qa/`.
- [ ] **Step 3:** `astro.config.mjs`: `site: 'https://timrusch.pages.dev'`, `trailingSlash: 'always'`, integrations `[sitemap()]`. Kommentar: eigene Domain = diese Zeile ändern.
- [ ] **Step 4:** `global.css`: Tokens für hell, Überschreibung in `@media (prefers-color-scheme: dark)`, `color-scheme: light dark`, Geist-Import, Basis-Typo (16 px+ Fliesstext, Zeilenhöhe 1.6), `:focus-visible` Ring 2 px `--accent` mit Offset, `@media (prefers-reduced-motion: reduce)` setzt Transitions auf 0, `.skip-link`.
- [ ] **Step 5:** `Base.astro` mit Skip-Link, Header (Name links → `/`, Anker `/#projects`, `/#experience`, `/#skills`, `/#contact`; mobil unter dem Namen, kein JS), `<main id="main">`, Footer (© Jahr Tim Rusch). 404-Seite mit Link zurück.
- [ ] **Step 6:** `npm run build` → Expected: exit 0, `dist/index.html` und `dist/404.html` existieren.
- [ ] **Step 7:** Commit `feat: scaffold astro site with design tokens and base layout`.

### Task 2: Projekt-Collection und Reihenfolge-Logik

**Files:**
- Create: `src/content.config.ts`, `src/lib/projects.ts`, `src/lib/project-order.ts`, `tests/project-order.test.ts`,
  `src/content/projects/*.md` (8 Dateien, Slugs aus Spec 7)

**Interfaces:**
- Produces: Collection `projects`, Schema:
  `title: string; summary: string; context: string; period: string; team: string; status: 'shipped' | 'in progress'; order: number; featured: boolean; stack: string[]; repo?: url; grade?: string; draft: boolean = false; diagram?: string; image?: image()`.
  Body: H2-Abschnitte `Problem`, `Approach and architecture`, `My role`, `Status and results` (Stack und Links rendert die Seite aus dem Frontmatter).
- Produces: `project-order.ts`: `visibleSorted<T extends { data: { order: number; draft: boolean } }>(entries: T[]): T[]` und `splitFeatured<T extends { data: { featured: boolean } }>(entries: T[]): { featured: T[]; more: T[] }`.
- Produces: `projects.ts`: `getVisibleProjects(): Promise<CollectionEntry<'projects'>[]>` (nutzt `getCollection` + `visibleSorted`).

- [ ] **Step 1: failing test** `tests/project-order.test.ts` mit `node:test`:
  - `visibleSorted` entfernt `draft: true`, sortiert nach `order` aufsteigend (Eingabe order 3,1,2 + draft → Ausgabe 1,2,3).
  - `splitFeatured` liefert featured `[1..4]`, more `[5,6]` für die 6 sichtbaren Projekte.
- [ ] **Step 2:** `node --test tests/` → Expected: FAIL (Modul fehlt). Script `"test": "node --test tests/"`.
- [ ] **Step 3:** `project-order.ts` implementieren (reine Funktionen, keine Astro-Imports).
- [ ] **Step 4:** `node --test tests/` → Expected: PASS.
- [ ] **Step 5:** `content.config.ts` (glob loader, `base: './src/content/projects'`), 8 Markdown-Dateien mit den Texten aus Spec 7. Restaurant und Ad campaign: `draft: true`, oben HTML-Kommentar `<!-- TODO(Tim): Teamgrösse und eigener Anteil fehlen, dann draft entfernen -->`. Swiss Legal Agent: `<!-- TODO(Tim): nach Abgabe 23.11.2026 prüfen, ob Repo öffentlich wird, dann repo: setzen -->`. Grade nur bei Restaurant: `"Grade 6.0 (Swiss scale, 6 = best)"`. Ad campaign ohne grade. Repo nur bei ECTS und Restaurant.
- [ ] **Step 6:** `npx astro check && npm run build` → Expected: 0 errors.
- [ ] **Step 7:** Commit `content: add project collection with eight projects (two drafts)`.

### Task 3: Startseite

**Files:**
- Create: `src/data/profile.ts`, `src/components/Hero.astro`, `ProjectCard.astro`, `ProjectRow.astro`,
  `StatusBadge.astro`, `Timeline.astro`, `Skills.astro`, `Contact.astro`, `Icon.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getVisibleProjects`, `splitFeatured`.
- Produces: `profile.ts` exports `links: { github: string; linkedin: string; email: string; cv: '/cv.pdf' }`,
  `timeline: { when: string; title: string; org: string; text?: string; upcoming?: boolean }[]`,
  `skills: { group: string; items: string[] }[]`, `intro: string`, `headline: string`.
- `Icon.astro` Props `{ name: 'github' | 'linkedin' | 'mail' | 'download' | 'arrow' }`, inline SVG, `aria-hidden="true"`.

- [ ] **Step 1:** `profile.ts` mit Werten wortwörtlich aus Spec 6 (Headline, Intro, Timeline 1 bis 5, Skills-Gruppen, «Based in the Basel area.»). Kein Werbebudget.
- [ ] **Step 2:** Hero: `<Picture src={portrait} formats={['avif','webp']} widths={[120,240,480]} sizes="(max-width: 640px) 120px, 240px" alt="Portrait of Tim Rusch" loading="eager" fetchpriority="high">`. Desktop Text links/Foto rechts, mobil Foto oben. Buttons: «Download CV (German, PDF)» (`download`-Attribut), GitHub, LinkedIn, Email (`mailto:`). Externe Links `rel="noopener"`.
- [ ] **Step 3:** `#projects`: ProjectCard (featured, 2×2 ab 768 px, sonst 1 Spalte; ganze Karte ein `<a>`; Titel als `<h3>`, Einzeiler, Tags, Kontext, StatusBadge), darunter ProjectRow-Liste für `more`.
- [ ] **Step 4:** `#experience` Timeline (`<ol>`), `#skills` (Gruppen als `<h3>` + Tag-Liste `<ul>`), `#contact` (Email + LinkedIn).
- [ ] **Step 5:** `npm run build`, `npm run preview`, mit playwright-cli bei 390 und 1440 px Screenshot ansehen, Abweichungen zur Spec 5 beheben (mind. zwei Runden).
- [ ] **Step 6:** Commit `feat: build one-page home with hero, projects, timeline, skills, contact`.

### Task 4: Projektdetailseiten

**Files:**
- Create: `src/pages/projects/[slug].astro`, `src/components/Diagram.astro`

**Interfaces:**
- Consumes: `getVisibleProjects`.
- Produces: `Diagram.astro` Props `{ slug: string; alt: string }`; lädt `src/assets/diagrams/${slug}-light.svg` und `-dark.svg` per `import.meta.glob(..., { eager: true, query: '?url' })`, rendert `<picture><source media="(prefers-color-scheme: dark)" srcset=dark><img src=light alt width height></picture>`. Ohne Datei: rendert nichts.

- [ ] **Step 1:** `getStaticPaths` aus `getVisibleProjects()` (Drafts erzeugen keine Seite). Params `slug: entry.id`.
- [ ] **Step 2:** Seite: Zurück-Link, H1, Einzeiler, Meta-Zeile (Kontext · Team · StatusBadge), gerenderter Body, darin nach «Approach and architecture» das Diagramm (wenn `diagram` gesetzt), Abschnitt «Stack» aus `stack`, «Links» nur wenn `repo` (sonst Abschnitt weglassen), Grade-Zeile unter «Status and results» wenn `grade`.
- [ ] **Step 3:** `npm run build` → Expected: genau 6 Ordner unter `dist/projects/`, keiner für die zwei Drafts.
- [ ] **Step 4:** Screenshots 390/1440 hell+dunkel prüfen, fixen.
- [ ] **Step 5:** Commit `feat: add project detail pages`.

### Task 5: Diagramme (mit Freigabe-Halt)

**Files:**
- Create: `diagrams/<slug>.excalidraw` (4×), `src/assets/diagrams/<slug>-light.svg` und `-dark.svg` (4×), `scripts/export-diagram.mjs` falls der Skill-Renderer nur PNG kann.
- Modify: Frontmatter `diagram:` + Alt-Text bei den 4 featured Projekten.

- [ ] **Step 1:** Für jedes der 4 Projekte nur die Komponenten aus Spec 7 zeichnen (Skill excalidraw-diagram, `roughness: 0`, neutrale Sans, Petrol-Akzent). Swiss Legal Agent: Tims Teile Akzent, Teamteile neutral, mit Legende «My part» / «Team».
- [ ] **Step 2:** Rendern, PNG ansehen, fixen bis sauber (Render-Loop des Skills).
- [ ] **Step 3:** SVG-Export hell und dunkel.
- [ ] **Step 4:** **HALT.** Tim die 4 Diagramme (hell) als Screenshot schicken (SendUserFile), auf Freigabe warten. Parallel nur Task 6 weiterführen.
- [ ] **Step 5:** Nach Freigabe: `diagram`-Frontmatter setzen, Build, Detailseiten-Screenshots prüfen.
- [ ] **Step 6:** Commit `feat: add architecture diagrams for featured projects`.

### Task 6: SEO, OG-Bild, Favicon, CV-Check, CLAUDE.md

**Files:**
- Create: `src/pages/og.png.ts`, `public/robots.txt`, `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`,
  `scripts/check-cv.sh`, `scripts/check-dist.mjs`, `tests/check-cv.test.sh` (oder in node:test), `CLAUDE.md`, `README.md`
- Modify: `Base.astro` (Meta, OG, JSON-LD), `package.json` (Scripts)

**Interfaces:**
- `og.png.ts`: `GET` liefert PNG 1200×630, gebaut mit sharp aus SVG-Hintergrund + Name + Headline + Portrait.
- `check-cv.sh [pdf=public/cv.pdf]`: Exit 1 wenn `.private-patterns` fehlt oder `pdftotext` einen Treffer liefert; Exit 0 sonst.
- `check-dist.mjs`: Exit 1 bei: `—`/`–`/Emoji/TODO/lorem/placeholder/passionate/rockstar im sichtbaren Text von `dist/**/*.html`; kaputtem internem Link oder Anker; Telefonnummernmuster `\+41|0\d{2} \d{3} \d{2} \d{2}`; Draft-Slugs irgendwo in `dist`; `<img>` ohne `alt`; fehlendem `<title>`/`meta description`/`og:image`/canonical.
- Scripts: `"check:cv": "sh scripts/check-cv.sh"`, `"check:dist": "node scripts/check-dist.mjs"`, `"verify": "npm test && astro check && npm run check:cv && astro build && npm run check:dist"`, `"publish": "npm run verify && wrangler pages deploy dist --project-name=timrusch --branch=main --commit-dirty=true"`.

- [ ] **Step 1: failing tests:** `check-cv` gegen das ORIGINAL-PDF (aus OneDrive, nur als Testeingabe, nie kopiert) → Expected Exit 1; gegen `public/cv.pdf` → Exit 0; ohne `.private-patterns` → Exit 1. `check-dist` gegen ein Fixture-HTML mit `—` → Exit 1.
- [ ] **Step 2:** Tests laufen lassen → FAIL. `.private-patterns` lokal anlegen (Muster aus der Prüfung vom 2026-11-03, nicht committen).
- [ ] **Step 3:** Skripte implementieren → Tests PASS.
- [ ] **Step 4:** Meta in `Base.astro` (Title-Muster `«<Seite> · Tim Rusch»`, Start `«Tim Rusch · Business AI Student»`), canonical, OG/Twitter, JSON-LD Person (name, jobTitle, url, sameAs, email; keine Adresse). OG-Bild, Favicons, robots.txt mit `Sitemap: https://timrusch.pages.dev/sitemap-index.xml`.
- [ ] **Step 5:** `CLAUDE.md` (Deutsch, Inhalt Spec 3) und `README.md` (Setup, Befehle, Projekt ergänzen, Satz zur Nicht-Wiederverwendung der Inhalte).
- [ ] **Step 6:** `npm run verify` → Expected: alle Checks grün.
- [ ] **Step 7:** Commit `feat: add seo metadata, og image, favicon and pre-publish checks`.

### Task 7: QA

- [ ] **Step 1:** playwright-cli: jede Seite bei 360, 390, 1440 px, hell und dunkel; Screenshots ansehen. `document.documentElement.scrollWidth <= clientWidth` auf allen Seiten bei 360 px.
- [ ] **Step 2:** Tastatur: Tab-Reihenfolge auf Start- und einer Detailseite, Fokusring sichtbar, Skip-Link funktioniert.
- [ ] **Step 3:** Kontraste aller Token-Paare rechnen (hell/dunkel) → alle ≥ 4.5:1.
- [ ] **Step 4:** Lighthouse mobil+Desktop gegen `npm run preview` für `/` und eine Detailseite → alle ≥ 95. Abweichungen fixen.
- [ ] **Step 5:** `/projects/restaurant-order-forecast/` im Preview → 404; Sitemap ohne Drafts.
- [ ] **Step 6:** Skill verification-before-completion, dann Code-Review-Plugin (`/code-review`); Findings fixen.
- [ ] **Step 7:** Commit `fix: qa findings` (falls Änderungen).

### Task 8: Repo und Deploy

- [ ] **Step 1:** `gh repo create tim931451/personal-website --public --source=. --remote=origin --push`. Vorher Secret-/Privat-Check: `git grep -n -f .private-patterns` über getrackte Dateien leer (Muster-Datei ist ignoriert).
- [ ] **Step 2:** Tim führt `npx wrangler login` aus. Danach `npx wrangler pages project create timrusch --production-branch=main` (falls Name vergeben: Tim fragen).
- [ ] **Step 3:** `npm run publish` → Expected: Deployment-URL.
- [ ] **Step 4:** Live-Check: alle Seiten 200, `/cv.pdf` 200 und identisch zu `public/cv.pdf` (sha256), `/robots.txt`, `/sitemap-index.xml`, 404 für Draft-URL, Lighthouse gegen Live-URL.
- [ ] **Step 5:** Abschluss: Zusammenfassung, Live-URL, TODO-Liste (Anteile Restaurant/Ad campaign, Swiss-Legal-Agent-Repo, eigene Domain, ggf. englischer CV, Screenshots).
