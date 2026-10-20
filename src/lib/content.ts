// Lecture des publications et conversion en « fiches » communes (titre, date, type, rubriques, adresse).
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Kind, Topic } from '../config';
import { path, type Lang } from '../i18n/ui';

export type Analysis = CollectionEntry<'analyses'>;
export type Reflection = CollectionEntry<'reflexions'>;
export type Chart = CollectionEntry<'graphiques'>;
export type Video = CollectionEntry<'videos'>;
export type Report = CollectionEntry<'rapports'>;

export interface Item {
  kind: Kind;
  id: string;
  title: string;
  excerpt?: string;
  date: Date;
  lang: Lang;
  topics: Topic[];
  countries: string[];
  href: string;
  image?: string;
  coming: boolean;
  featured: boolean;
  quote?: string;
  author?: string;
  youtubeId?: string;
  mine?: boolean;
  channel?: string;
  pdf?: string;
  /** Vignette affichée dans les listes : l'image de la publication, sinon une photo de sa rubrique */
  thumb: string;
}

// Photo par défaut de chaque rubrique (photos Pexels, libres de droits) pour les publications sans image
export const TOPIC_PHOTO: Record<string, string> = {
  us: '/images/photos/wall-street.jpg', deals: '/images/photos/nyse-night.jpg', funds: '/images/photos/markets-board.jpg',
  ai: '/images/photos/data-center.jpg', debt: '/images/photos/london-city.jpg', uk: '/images/photos/london-city.jpg',
  africa: '/images/photos/nairobi.jpg', asia: '/images/photos/singapore.jpg',
};
const withThumb = (i: Omit<Item, 'thumb'>): Item => ({ ...i, thumb: i.image ?? TOPIC_PHOTO[i.topics[0] ?? ''] ?? '/images/photos/london-city.jpg' });

const byDate = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime();
const plain = (s = '') => s.replace(/<[^>]+>/g, ' ').replace(/[#>*_`\[\]]/g, '').replace(/\(http[^)]*\)/g, '').replace(/\s+/g, ' ').trim();
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);

export const getAnalyses = async () => (await getCollection('analyses', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));
export const getReflections = async () => (await getCollection('reflexions', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));
export const getVideos = async () => (await getCollection('videos', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));
export const getReports = async () => (await getCollection('rapports', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));
export const getCharts = async () => (await getCollection('graphiques', (e) => !e.data.brouillon)).sort((a, b) => byDate(a.data, b.data));

export function analysisItem(e: Analysis): Item {
  const d = e.data;
  return withThumb({ kind: 'analysis', id: e.id, title: d.titre, excerpt: d.chapeau, date: d.date, lang: d.langue, topics: d.rubriques, countries: d.pays,
    href: path.item(d.langue, 'analysis', e.id), image: d.image, coming: d.aParaitre, featured: d.aLaUne });
}
export function reflectionItem(e: Reflection): Item {
  const d = e.data;
  const text = plain(e.body);
  return withThumb({ kind: 'commentary', id: e.id, title: d.titre ?? (d.citation ? `“${cut(d.citation, 110)}”` : cut(text, 110)),
    excerpt: d.titre || d.citation ? cut(text, 160) : undefined, date: d.date, lang: d.langue, topics: d.rubriques, countries: d.pays,
    href: path.item(d.langue, 'commentary', e.id), image: d.image, coming: false, featured: false, quote: d.citation, author: d.auteur });
}
export function chartItem(e: Chart): Item {
  const d = e.data;
  return withThumb({ kind: 'chart', id: e.id, title: d.titre, excerpt: cut(plain(e.body), 160) || undefined, date: d.date, lang: d.langue, topics: d.rubriques, countries: d.pays,
    href: path.item(d.langue, 'chart', e.id), image: d.image, coming: false, featured: false });
}

// Identifiant d'une vidéo YouTube à partir de son lien (watch?v=, youtu.be/, shorts/, embed/)
export function youtubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : url.trim().slice(0, 11);
}
export function videoItem(e: Video): Item {
  const d = e.data;
  const yid = youtubeId(d.youtube);
  return withThumb({ kind: 'video', id: e.id, title: d.titre, excerpt: cut(plain(e.body), 160) || undefined, date: d.date, lang: d.langue, topics: d.rubriques, countries: d.pays,
    href: path.item(d.langue, 'video', e.id), image: `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`, coming: false, featured: false,
    youtubeId: yid, mine: d.origine === 'moi', channel: d.chaine });
}

export function reportItem(e: Report): Item {
  const d = e.data;
  return withThumb({ kind: 'report', id: e.id, title: d.titre, excerpt: d.chapeau ?? (cut(plain(e.body), 160) || undefined), date: d.date, lang: d.langue, topics: d.rubriques, countries: d.pays,
    href: path.item(d.langue, 'report', e.id), image: d.couverture ?? `/covers/${e.id}.png`, coming: false, featured: false, pdf: d.pdf });
}

// Analyses visibles dans une langue : celles de cette langue, plus celles de l'autre langue sans traduction.
export async function analysesFor(lang: Lang) {
  const all = await getAnalyses();
  const translated = new Set(all.filter((a) => a.data.langue === lang && a.data.traduction).map((a) => a.data.traduction));
  return all.filter((a) => a.data.langue === lang || (!a.data.traduction && !translated.has(a.id)));
}

export async function allItems(lang: Lang): Promise<Item[]> {
  const [a, r, c, v, p] = await Promise.all([analysesFor(lang), getReflections(), getCharts(), getVideos(), getReports()]);
  const all = [...a.map(analysisItem), ...r.map(reflectionItem), ...c.map(chartItem), ...v.map(videoItem), ...p.map(reportItem)].sort(byDate);
  // Site anglais : uniquement les textes en anglais. Site français : tout (le français et l'anglais).
  return lang === 'en' ? all.filter((i) => i.lang === 'en') : all;
}
