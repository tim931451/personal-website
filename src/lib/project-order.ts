// Reine Funktionen ohne Astro-Imports, damit sie mit `node --test` prüfbar sind.

type Orderable = { data: { order: number; draft: boolean } };
type Featurable = { data: { featured: boolean } };

/** Entfernt Entwürfe und sortiert nach `order` aufsteigend. */
export function visibleSorted<T extends Orderable>(entries: T[]): T[] {
  return entries.filter((e) => !e.data.draft).sort((a, b) => a.data.order - b.data.order);
}

/** Teilt bereits sortierte Projekte in grosse Karten und kompakte Liste. */
export function splitFeatured<T extends Featurable>(entries: T[]): { featured: T[]; more: T[] } {
  return {
    featured: entries.filter((e) => e.data.featured),
    more: entries.filter((e) => !e.data.featured),
  };
}
