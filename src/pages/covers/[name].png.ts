// Couvertures automatiques des rapports (/covers/<nom>.png), utilisées quand aucune image n'est fournie.
import type { APIRoute } from 'astro';
import { getReports, reportItem, type Report } from '../../lib/content';
import { reportCover } from '../../lib/og';

export async function getStaticPaths() {
  return (await getReports()).map((entry) => ({ params: { name: entry.id }, props: { entry } }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Report;
  const png = await reportCover(reportItem(entry), entry.data.serie, entry.data.numero);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
