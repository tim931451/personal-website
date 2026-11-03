/** Teilt gerendertes Markdown-HTML direkt vor `<h2 id="…">`; fehlt die Überschrift, ist der zweite Teil leer. */
export function splitBeforeHeading(html: string, id: string): [string, string] {
  const at = html.indexOf(`<h2 id="${id}"`);
  return at === -1 ? [html, ''] : [html.slice(0, at), html.slice(at)];
}
