// Flux RSS : toutes les publications, les deux langues.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { analysisItem, chartItem, getAnalyses, getCharts, getReflections, getReports, getVideos, reflectionItem, reportItem, videoItem } from '../lib/content';

export async function GET(context: APIContext) {
  const [a, r, c, v, p] = await Promise.all([getAnalyses(), getReflections(), getCharts(), getVideos(), getReports()]);
  const items = [...a.map(analysisItem), ...r.map(reflectionItem), ...c.map(chartItem), ...v.map(videoItem), ...p.map(reportItem)]
    .sort((x, y) => y.date.getTime() - x.date.getTime())
    .map((i) => ({ title: i.title, description: i.excerpt ?? i.quote ?? '', pubDate: i.date, link: i.href }));
  return rss({ title: SITE.name, description: 'Economics and finance, from London to Douala.', site: context.site ?? SITE.url, items });
}
