// Flux RSS : réflexions et analyses, toutes langues.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { path } from '../i18n/ui';
import { getAnalyses, getReflections, slugOf } from '../lib/content';

export async function GET(context: APIContext) {
  const [reflections, analyses] = await Promise.all([getReflections(), getAnalyses()]);
  const items = [
    ...analyses.map((a) => ({ title: a.data.titre, description: a.data.description, pubDate: a.data.date, link: path.analysis(a.data.langue, slugOf(a.id)) })),
    ...reflections.map((r) => ({
      title: r.data.citation ? `“${r.data.citation.slice(0, 90)}”` : (r.body ?? '').replace(/\s+/g, ' ').slice(0, 90),
      description: r.data.citation ? `${r.data.citation} ${r.data.auteur ?? ''}` : (r.body ?? '').slice(0, 300),
      pubDate: r.data.date,
      link: path.reflection(r.data.langue, slugOf(r.id)),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({ title: SITE.name, description: 'Economics and finance, from London to Douala.', site: context.site ?? SITE.url, items });
}
