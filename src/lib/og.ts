// Image de partage (LinkedIn, X, WhatsApp) de chaque publication : 1200 x 630, générée à la construction du site.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../config';
import { KIND_NAME, TOPIC_INFO } from '../i18n/ui';
import type { Item } from './content';

const fontDir = path.resolve('node_modules/@fontsource/inter/files');
const font = (w: number) => fs.readFileSync(path.join(fontDir, `inter-latin-${w}-normal.woff`));
const fonts = [
  { name: 'Inter', data: font(500), weight: 500 as const, style: 'normal' as const },
  { name: 'Inter', data: font(700), weight: 700 as const, style: 'normal' as const },
  { name: 'Inter', data: font(800), weight: 800 as const, style: 'normal' as const },
];
const avatar = `data:image/jpeg;base64,${fs.readFileSync(path.resolve('public/images/avatar.jpg')).toString('base64')}`;

// Petit raccourci pour écrire l'arbre d'éléments attendu par satori
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({ type, props: { style, children, ...extra } });

export async function ogImage(item: Item): Promise<Buffer> {
  const lang = item.lang;
  const topic = item.topics[0];
  const label = `${KIND_NAME[item.kind][lang]}${topic ? ' · ' + TOPIC_INFO[topic][lang] : ''}`.toUpperCase();
  const raw = item.quote ? `“${item.quote}”` : item.title;
  const title = raw.length > 140 ? raw.slice(0, 140).replace(/\s+\S*$/, '') + '…' : raw;
  const size = title.length > 95 ? 50 : title.length > 60 ? 58 : 66;

  const tree = h('div', { width: '1200px', height: '630px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0A2540', padding: '64px 72px', fontFamily: 'Inter', color: '#FFFFFF' }, [
    h('div', { display: 'flex', alignItems: 'center', gap: '18px' }, [
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '6px', background: '#FFFFFF', color: '#0A2540', fontSize: '22px', fontWeight: 800 }, 'MN'),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h('div', { fontSize: '26px', fontWeight: 800 }, SITE.name),
        h('div', { fontSize: '16px', fontWeight: 700, letterSpacing: '2px', color: '#93A4B8' }, lang === 'fr' ? 'ÉCONOMIE ET FINANCE' : 'ECONOMICS & FINANCE'),
      ]),
    ]),
    h('div', { display: 'flex', flexDirection: 'column', gap: '22px', width: '1056px' }, [
      h('div', { display: 'flex', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: '#8FB8E8' }, label),
      h('div', { display: 'block', width: '1056px', fontSize: `${size}px`, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-1.5px' }, title),
    ]),
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '1056px' }, [
      h('div', { display: 'flex', alignItems: 'center', gap: '16px' }, [
        h('img', { width: '64px', height: '64px', borderRadius: '32px' }, undefined, { src: avatar, width: 64, height: 64 }),
        h('div', { fontSize: '22px', fontWeight: 700 }, SITE.name),
      ]),
      h('div', { fontSize: '22px', fontWeight: 500, color: '#93A4B8' }, SITE.domain),
    ]),
  ]);

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

// Nom du fichier de l'image de partage d'une publication
export const ogPath = (item: Item) => `/og/${item.kind}-${item.lang}-${item.id}.png`;
