# Portfolio-Webseite Tim Rusch

Persönliche Portfolio-Seite (Englisch) für Recruiter und Hackathon-Partner. Live: https://timrusch.pages.dev
Spec: `docs/superpowers/specs/2026-11-03-personal-website-design.md` (verbindlich für Inhalte und Design).

## Stack

- Astro 7, TypeScript strict, statischer Output, kein clientseitiges JavaScript, kein Tailwind.
- Plain CSS: Tokens in `src/styles/global.css`, Komponenten-Styles scoped.
- Schrift: Geist Sans Variable, selbst gehostet über `@fontsource-variable/geist`.
- Projekte: Content Collection `projects` (`src/content.config.ts`), eine Markdown-Datei pro Projekt.
- Profil, Timeline, Skills: `src/data/profile.ts`.
- Hosting: Cloudflare Pages, Projekt `timrusch`, Direktupload mit wrangler (keine Git-Integration).
- Astro-Doku über Context7 nachschlagen, nicht aus dem Gedächtnis:
  `npx ctx7@latest docs /websites/astro_build_en "<frage>"`

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Dev-Server auf http://localhost:4321 (im Hintergrund: `npx astro dev --background`) |
| `npm test` | Unit-Tests (`node --test`) |
| `npm run verify` | Tests, `astro check`, CV-Check, Build, `check:dist` |
| `npm run preview` | gebaute Seite lokal ansehen |
| `npm run publish` | `verify` und danach Deploy nach Cloudflare Pages |

`publish` bricht ab, wenn `.private-patterns` fehlt oder das CV private Angaben enthält, und wenn
`check:dist` Regelverstösse findet. `.private-patterns` ist gitignored und liegt nur lokal.

## Neues Projekt ergänzen

1. Datei `src/content/projects/<slug>.md` anlegen; der Dateiname ist die URL `/projects/<slug>/`.
2. Frontmatter: `title`, `summary`, `context`, `period`, `team`, `status` (`shipped` | `in progress`),
   `order`, `featured`, `stack`, optional `repo`, `grade`, `diagram` (Alt-Text), `draft`.
3. Body mit den Abschnitten `## Problem`, `## Approach and architecture`, `## My role`, `## Status and results`.
4. `featured: true` = grosse Karte auf der Startseite (gedacht für vier Projekte), sonst kompakte Liste.
5. `draft: true` = erscheint nirgends (keine Seite, kein Link, nicht in der Sitemap).
6. Diagramm: in `diagrams/build.py` ergänzen, `python3 diagrams/build.py`, dann `diagrams/export.sh`
   (braucht `python3 -m http.server 4400` in `diagrams/` und `playwright-cli open`). Ergebnis:
   `src/assets/diagrams/<slug>-light.svg` und `-dark.svg`.

## Inhaltsregeln

- Nur belegte Fakten. Keine erfundenen Zahlen, Kunden, Zitate, Testimonials oder Komponenten.
  Fehlt etwas: Tim fragen oder `<!-- TODO(Tim): … -->` setzen und das Projekt auf `draft: true` lassen.
- Bei Teamprojekten klar trennen, was Tims Anteil war («My role»). Teammitglieder nicht namentlich nennen.
- Keine privaten Repos verlinken, keine Kundendaten (z. B. Budgets), keine Telefonnummer, keine Adresse,
  kein Geburtsdatum.
- `public/cv.pdf` ist ausschliesslich die Web-Version des Lebenslaufs. Nie das Original verwenden.
- Ton sachlich und konkret. Keine Floskeln («passionate», «rockstar»), keine Emojis, keine langen
  Gedankenstriche (— oder –) im Seitentext. `check:dist` prüft das.
- Design: ruhig, viel Weissraum, eine Akzentfarbe (Petrol), eine Schrift, nur dezente Übergänge,
  Kontraste ≥ 4.5:1 in Hell- und Dunkelmodus.

## Workflow

1. **Vor jedem Commit:** `git status` prüfen. STOP, falls `.env*`, `.private-patterns` oder Dateien mit
   echten Tokens gestaged sind. Privat-Check: `git grep -n -f .private-patterns` muss leer sein.
2. **Commit** mit Conventional-Präfix: `feat:`, `fix:`, `style:`, `content:`, `refactor:`, `docs:`.
   Autor ist das globale Git-Profil (Tim Rusch).
3. **Push:** `git push origin main`. Nie Force-Push.
4. **Deploy:** erst nach dem Push `npm run publish`, damit Cloudflare den richtigen Commit zeigt.
5. Eigene Domain später: in `astro.config.mjs` die Konstante `SITE` ändern und die Domain im
   Cloudflare-Dashboard bei Pages-Projekt `timrusch` hinzufügen (macht Tim).
