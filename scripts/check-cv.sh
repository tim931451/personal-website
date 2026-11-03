#!/bin/sh
# Prüft, dass das veröffentlichte CV keine privaten Angaben enthält.
# Die Suchmuster (ERE, eins pro Zeile) stehen nur lokal in .private-patterns (gitignored).
pdf="${1:-public/cv.pdf}"
patterns="${PRIVATE_PATTERNS:-.private-patterns}"

[ -f "$patterns" ] || { echo "check-cv: $patterns fehlt, Abbruch." >&2; exit 1; }
[ -f "$pdf" ] || { echo "check-cv: $pdf fehlt, Abbruch." >&2; exit 1; }
command -v pdftotext >/dev/null || { echo "check-cv: pdftotext fehlt (brew install poppler)." >&2; exit 1; }

text=$(pdftotext "$pdf" -)
if printf '%s' "$text" | grep -E -q -f "$patterns"; then
  echo "check-cv: $pdf enthält private Angaben. Nicht veröffentlichen." >&2
  exit 1
fi
# Allgemein: keine Schweizer Telefonnummer im CV
if printf '%s' "$text" | grep -E -q '\+41|0[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}'; then
  echo "check-cv: $pdf enthält eine Telefonnummer. Nicht veröffentlichen." >&2
  exit 1
fi
echo "check-cv: ok ($pdf)"
