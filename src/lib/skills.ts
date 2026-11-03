// Reine Funktionen ohne Astro-Imports, damit sie mit `node --test` prüfbar sind.

export interface SkillItem {
  name: string;
  /** Allgemeiner Skill, belegt durch Ausbildung oder Lebenslauf statt durch ein Projekt. */
  general?: boolean;
  /** Stack-Einträge, die diesen Skill belegen, falls sie anders heissen als `name`. */
  match?: string[];
}

export interface SkillGroup {
  group: string;
  items: SkillItem[];
}

/** Stack eines Projekts ohne die Einträge, die Teammitglieder gebaut haben. */
export function ownStack(data: { stack: string[]; teamStack?: string[] }): string[] {
  const team = new Set((data.teamStack ?? []).map((s) => s.toLowerCase()));
  return data.stack.filter((s) => !team.has(s.toLowerCase()));
}

/** Zeigt nur allgemeine Skills und solche, die ein sichtbares Projekt im eigenen Stack führt. */
export function visibleSkills(groups: SkillGroup[], stacks: string[][]): { group: string; items: string[] }[] {
  const used = new Set(stacks.flat().map((s) => s.toLowerCase()));
  return groups
    .map((g) => ({
      group: g.group,
      items: g.items
        .filter((i) => i.general || [i.name, ...(i.match ?? [])].some((m) => used.has(m.toLowerCase())))
        .map((i) => i.name),
    }))
    .filter((g) => g.items.length > 0);
}
