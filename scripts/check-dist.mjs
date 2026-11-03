// Prüft die gebaute Seite gegen die Inhaltsregeln (Spec Abschnitt 2 und 11).
// Aufruf: node scripts/check-dist.mjs [dist-Ordner]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const root = process.argv[2] ?? 'dist';
const errors = [];

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });

const contentDir = process.env.CONTENT_DIR ?? 'src/content/projects';
const draftSlugs = existsSync(contentDir)
  ? readdirSync(contentDir)
      .filter((f) => /^draft:\s*true\b/m.test(readFileSync(join(contentDir, f), 'utf8')))
      .map((f) => f.replace(/\.md$/, ''))
  : [];

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');

/** Attributtexte, die Menschen zu sehen oder zu hören bekommen (Suchtreffer, Vorschau, Screenreader). */
const attributeText = (html) =>
  [
    ...html.matchAll(/<meta\s+(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:[^"]*)"\s+content="([^"]*)"/g),
    ...html.matchAll(/\s(?:alt|aria-label|title)="([^"]*)"/g),
  ]
    .map((m) => m[1])
    .join(' ');

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const urlPath = (file) => '/' + relative(root, file).split('\\').join('/').replace(/index\.html$/, '');

/** Löst einen internen Pfad auf eine Datei in dist auf. */
function resolveTarget(path) {
  let clean;
  try {
    clean = decodeURI(path);
  } catch {
    return undefined;
  }
  const candidates = clean.endsWith('/') ? [join(root, clean, 'index.html')] : [join(root, clean), join(root, clean, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

const FORBIDDEN = [
  [/[—–]/, 'langer Gedankenstrich'],
  [/(?![©®™])\p{Extended_Pictographic}/u, 'Emoji'],
  [/\b(TODO|lorem|ipsum|placeholder|passionate|rockstar)\b/i, 'Platzhalter oder Floskel'],
  [/\+41|\b0\d{2}\s?\d{3}\s?\d{2}\s?\d{2}\b/, 'Telefonnummer'],
];

const files = htmlFiles(root);
const cache = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));

for (const file of files) {
  const html = cache.get(file);
  const where = relative(root, file);
  const text = visibleText(html) + ' ' + attributeText(html);

  for (const [re, label] of FORBIDDEN) {
    const m = text.match(re);
    if (m) errors.push(`${where}: ${label}: "${text.slice(Math.max(0, m.index - 30), m.index + 30).trim()}"`);
  }

  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${where}: <title> fehlt`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${where}: meta description fehlt`);
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) errors.push(`${where}: canonical fehlt`);
  if (!/<meta property="og:image" content="[^"]+"/.test(html)) errors.push(`${where}: og:image fehlt`);

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(m[0])) errors.push(`${where}: <img> ohne alt: ${m[0].slice(0, 80)}`);
  }

  for (const slug of draftSlugs) {
    if (html.includes(`/projects/${slug}`)) errors.push(`${where}: verlinkt Entwurf ${slug}`);
  }

  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    const [pathPart, hash] = href.split('#');
    const targetFile = pathPart === '' ? file : resolveTarget(pathPart.startsWith('/') ? pathPart : posix.join(urlPath(file), pathPart));
    if (!targetFile) {
      errors.push(`${where}: kaputter Link ${href}`);
      continue;
    }
    if (hash && targetFile.endsWith('.html') && !ids(cache.get(targetFile) ?? readFileSync(targetFile, 'utf8')).has(hash)) {
      errors.push(`${where}: Anker fehlt ${href}`);
    }
  }
}

for (const slug of draftSlugs) {
  if (existsSync(join(root, 'projects', slug))) errors.push(`dist enthält Entwurfsseite projects/${slug}`);
}

if (errors.length) {
  console.error(`check-dist: ${errors.length} Problem(e)\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`check-dist: ok (${files.length} Seiten)`);
