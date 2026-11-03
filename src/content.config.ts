import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      context: z.string(),
      period: z.string(),
      team: z.string(),
      status: z.enum(['shipped', 'in progress']),
      order: z.number().int(),
      featured: z.boolean().default(false),
      stack: z.array(z.string()).min(1),
      // Stack-Einträge, die Teammitglieder gebaut haben: auf der Projektseite sichtbar, zählen aber nicht als Tims Skill
      teamStack: z.array(z.string()).optional(),
      repo: z.url().optional(),
      grade: z.string().optional(),
      draft: z.boolean().default(false),
      // Alt-Text des Architekturdiagramms; die SVGs liegen unter src/assets/diagrams/<id>-{light,dark}.svg
      diagram: z.string().optional(),
      image: image().optional(),
    }),
});

export const collections = { projects };
