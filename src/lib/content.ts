// Lecture des publications : brouillons exclus, triées de la plus récente à la plus ancienne.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Reflection = CollectionEntry<'reflexions'>;
export type Analysis = CollectionEntry<'analyses'>;

const byDate = <T extends { data: { date: Date } }>(a: T, b: T) => b.data.date.getTime() - a.data.date.getTime();

export async function getReflections() {
  return (await getCollection('reflexions', (e) => !e.data.brouillon)).sort(byDate);
}

export async function getAnalyses() {
  return (await getCollection('analyses', (e) => !e.data.brouillon)).sort(byDate);
}

// Analyses à montrer dans une langue : celles écrites dans cette langue,
// plus celles de l'autre langue qui n'ont pas de traduction.
export async function getAnalysesFor(lang: Lang) {
  const all = await getAnalyses();
  const translated = new Set(all.filter((a) => a.data.langue === lang && a.data.traduction).map((a) => a.data.traduction));
  return all.filter((a) => a.data.langue === lang || (!a.data.traduction && !translated.has(slugOf(a.id))));
}

// Identifiant d'adresse : le nom du fichier, sans le « _ » des modèles.
export const slugOf = (id: string) => id.replace(/^_+/, '');
