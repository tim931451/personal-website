#!/bin/sh
# Exportiert diagrams/<slug>[.dark].excalidraw nach src/assets/diagrams/<slug>-{light,dark}.svg
# Voraussetzung: python3 -m http.server 4400 in diagrams/ und playwright-cli geöffnet.
set -e
cd "$(dirname "$0")"
playwright-cli goto "http://127.0.0.1:4400/export.html" >/dev/null
for f in *.excalidraw; do
  case "$f" in *.dark.excalidraw) slug="${f%.dark.excalidraw}"; var=dark ;; *) slug="${f%.excalidraw}"; var=light ;; esac
  playwright-cli run-code "async page => { await page.waitForFunction('window.__moduleReady === true', null, {timeout: 90000}); return await page.evaluate(async url => { const d = await (await fetch(url)).json(); const r = await window.renderDiagram(d); if (!r.success) return 'ERROR ' + r.error; return document.querySelector('#root svg').outerHTML; }, 'http://127.0.0.1:4400/$f'); }" > "/tmp/export-$slug-$var.txt"
  python3 - "/tmp/export-$slug-$var.txt" "../src/assets/diagrams/$slug-$var.svg" <<'PY'
import json, sys
raw = open(sys.argv[1], encoding="utf-8").read()
body = raw.split("### Result\n", 1)[1].split("\n### Ran", 1)[0].strip()
svg = json.loads(body)
assert svg.startswith("<svg"), svg[:200]
open(sys.argv[2], "w", encoding="utf-8").write(svg)
print(sys.argv[2], len(svg))
PY
done
