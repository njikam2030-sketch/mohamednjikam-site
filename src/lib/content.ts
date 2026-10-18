// Lecture des publications et conversion en « fiches » communes (titre, date, type, rubriques, adresse).
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Kind, Topic } from '../config';
import { path, type Lang } from '../i18n/ui';

export type Analysis = CollectionEntry<'analyses'>;
export type Reflection = CollectionEntry<'reflexions'>;
export type Chart = CollectionEntry<'graphiques'>;

export interface Item {
  kind: Kind;
  id: string;
  title: string;
  excerpt?: string;
  date: Date;
  lang: Lang;
  topics: Topic[];
  href: string;
  image?: string;
  coming: boolean;
  featured: boolean;
  quote?: string;
  author?: string;
}

const byDate = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime();
const plain = (s = '') => s.replace(/<[^>]+>/g, ' ').replace(/[#>*_`\[\]]/g, '').replace(/\(http[^)]*\)/g, '').replace(/\s+/g, ' ').trim();
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);

export const getAnalyses = async () => (await getCollection('analyses', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));
export const getReflections = async () => (await getCollection('reflexions', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));
export const getCharts = async () => (await getCollection('graphiques', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));

export function analysisItem(e: Analysis): Item {
  const d = e.data;
  return { kind: 'analysis', id: e.id, title: d.titre, excerpt: d.chapeau, date: d.date, lang: d.langue, topics: d.rubriques,
    href: path.item(d.langue, 'analysis', e.id), image: d.image, coming: d.aParaitre, featured: d.aLaUne };
}
export function reflectionItem(e: Reflection): Item {
  const d = e.data;
  const text = plain(e.body);
  return { kind: 'commentary', id: e.id, title: d.titre ?? (d.citation ? `“${cut(d.citation, 110)}”` : cut(text, 110)),
    excerpt: d.titre || d.citation ? cut(text, 160) : undefined, date: d.date, lang: d.langue, topics: d.rubriques,
    href: path.item(d.langue, 'commentary', e.id), image: d.image, coming: false, featured: false, quote: d.citation, author: d.auteur };
}
export function chartItem(e: Chart): Item {
  const d = e.data;
  return { kind: 'chart', id: e.id, title: d.titre, excerpt: cut(plain(e.body), 160) || undefined, date: d.date, lang: d.langue, topics: d.rubriques,
    href: path.item(d.langue, 'chart', e.id), image: d.image, coming: false, featured: false };
}

// Analyses visibles dans une langue : celles de cette langue, plus celles de l'autre langue sans traduction.
export async function analysesFor(lang: Lang) {
  const all = await getAnalyses();
  const translated = new Set(all.filter((a) => a.data.langue === lang && a.data.traduction).map((a) => a.data.traduction));
  return all.filter((a) => a.data.langue === lang || (!a.data.traduction && !translated.has(a.id)));
}

export async function allItems(lang: Lang): Promise<Item[]> {
  const [a, r, c] = await Promise.all([analysesFor(lang), getReflections(), getCharts()]);
  return [...a.map(analysisItem), ...r.map(reflectionItem), ...c.map(chartItem)].sort(byDate);
}
