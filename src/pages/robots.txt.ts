// robots.txt : pointe vers le plan du site, à l'adresse actuelle du site.
import { SITE } from '../config';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /kit/\n\nSitemap: ${SITE.url}/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
