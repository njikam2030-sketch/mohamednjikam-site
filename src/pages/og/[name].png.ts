// Fabrique les images de partage de toutes les publications (/og/<type>-<langue>-<nom>.png).
import type { APIRoute } from 'astro';
import { analysisItem, chartItem, getAnalyses, getCharts, getReflections, reflectionItem, type Item } from '../../lib/content';
// Les vidéos n'en ont pas besoin : leur aperçu est l'image de la vidéo YouTube.
import { ogImage, ogPath } from '../../lib/og';

export async function getStaticPaths() {
  const [a, r, c] = await Promise.all([getAnalyses(), getReflections(), getCharts()]);
  const items: Item[] = [...a.map(analysisItem), ...r.map(reflectionItem), ...c.map(chartItem)];
  return items.map((item) => ({ params: { name: ogPath(item).replace('/og/', '').replace(/\.png$/, '') }, props: { item } }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await ogImage(props.item as Item);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
