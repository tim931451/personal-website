import { getCollection, type CollectionEntry } from 'astro:content';
import { visibleSorted } from './project-order';

export type Project = CollectionEntry<'projects'>;

/** Alle nicht-entworfenen Projekte, sortiert nach `order`. */
export async function getVisibleProjects(): Promise<Project[]> {
  return visibleSorted(await getCollection('projects'));
}
