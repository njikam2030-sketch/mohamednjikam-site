// Fabrique le site à partir du dossier content/ (rempli depuis l'espace admin).
//   dist/                 site en ligne (Vercel) : index.html + images, documents, admin
//   dist/site.zip         paquet pour Hostinger : index.html + images + .htaccess
// Lancer : node scripts/build-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { zipSync, strToU8 } from 'fflate';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const C = (p) => path.join(ROOT, 'content', p);
const PUB = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://www.moharamadan.com';

// ---------- Lecture du contenu ----------
const site = JSON.parse(fs.readFileSync(C('site.json'), 'utf8'));
const readDir = (dir) => fs.existsSync(C(dir)) ? fs.readdirSync(C(dir)).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => {
  const { data, content } = matter(fs.readFileSync(C(`${dir}/${f}`), 'utf8'));
  return { id: f.replace(/\.md$/, ''), ...data, md: content.trim() };
}) : [];
const iso = (d) => (d instanceof Date ? d.toISOString() : String(d || '')).slice(0, 10);

const SECTIONS = [
  ['economics', 'Economics', 'Growth, inflation, public debt and the price of time.'],
  ['finance', 'Finance', 'Markets, listings, deals and where capital is deployed.'],
  ['ai', 'AI', 'The economics of artificial intelligence, and what it changes for companies and finance teams.'],
  ['leadership', 'Leadership', 'Judgement, decisions and the dynamics of organisations.'],
  ['africa', 'Africa', 'Capital, markets and growth across the continent.'],
  ['world', 'World', 'The United States, the United Kingdom, Europe and Asia.'],
];
const SEC = Object.fromEntries(SECTIONS.map(([k, n]) => [k, n]));
const TYPE = { analysis: 'Analysis', opinion: 'Opinion', essay: 'The Long Read' };
const TYPE_PATH = { analysis: 'analysis', opinion: 'opinion', essay: 'essays' };
const DESK = { economics: 'Economics', finance: 'Finance', leadership: 'Leadership', ai: 'AI', africa: 'Africa' };
const COUNTRY = {
  GB: 'United Kingdom', US: 'United States', CN: 'China', KR: 'South Korea', JP: 'Japan', IN: 'India', SG: 'Singapore', AE: 'United Arab Emirates',
  SA: 'Saudi Arabia', FR: 'France', DE: 'Germany', CM: 'Cameroon', NG: 'Nigeria', GH: 'Ghana', CI: "Côte d'Ivoire", CD: 'DR Congo', KE: 'Kenya',
  ZA: 'South Africa', SN: 'Senegal', EG: 'Egypt', MA: 'Morocco', ET: 'Ethiopia', RW: 'Rwanda', GA: 'Gabon', CG: 'Congo', TD: 'Chad',
  CF: 'Central African Republic', GQ: 'Equatorial Guinea', BF: 'Burkina Faso', MZ: 'Mozambique', ZM: 'Zambia', TZ: 'Tanzania', UG: 'Uganda',
};
// Pays associés aux notes selon l'auteur cité
const NOTE_COUNTRY = [['Keynes', 'GB'], ['Churchill', 'GB'], ['Franklin', 'US'], ['Federal Reserve', 'US'], ['Greenspan', 'US'], ['Buffett', 'US'],
  ['Carville', 'US'], ['Truman', 'US'], ['Eisenhower', 'US'], ['Nkrumah', 'GH'], ['Aggrey', 'GH'], ['Annan', 'GH'], ['Achebe', 'NG'], ['Mandela', 'ZA'],
  ['Tutu', 'ZA'], ['Biko', 'ZA'], ['Maathai', 'KE'], ['Sankara', 'BF'], ['Machel', 'MZ'], ['Draghi', 'FR'], ['Price of Time', 'CM'], ['Intelligence on Tap', 'CM']];

const articles = readDir('articles').filter((a) => !a.draft).map((a) => ({
  ...a, kind: 'article', date: iso(a.date), type: a.type || 'analysis', sections: a.sections || [], countries: a.countries || [],
  html: render(a.md),
})).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
for (const a of articles) {
  a.path = `/${TYPE_PATH[a.type]}/${a.id}`;
  a.min = Math.max(1, Math.round(a.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));
}
const charts = readDir('charts').filter((c) => !c.draft).map((c) => ({ ...c, kind: 'chart', date: iso(c.date), sections: c.sections || [], countries: c.countries || [], html: render(c.md), path: `/charts/${c.id}` }))
  .sort((a, b) => b.date.localeCompare(a.date));
const reports = readDir('reports').filter((r) => !r.draft).map((r) => ({ ...r, date: iso(r.date), countries: r.countries || [], html: render(r.md), path: `/reports/${r.id}` }))
  .sort((a, b) => b.date.localeCompare(a.date));
const ytId = (u) => (String(u || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1];
const videos = readDir('videos').filter((v) => !v.draft && (ytId(v.youtube) || v.file)).map((v) => ({
  ...v, kind: 'video', date: iso(v.date), yt: ytId(v.youtube), sections: v.sections || [], countries: v.countries || [], html: render(v.md), path: `/videos/${v.id}`,
  thumb: v.thumbnail || (!ytId(v.youtube) ? '/images/og.jpg' : fs.existsSync(path.join(PUB, `images/videos/${ytId(v.youtube)}.jpg`)) ? `/images/videos/${ytId(v.youtube)}.jpg` : `https://i.ytimg.com/vi/${ytId(v.youtube)}/hqdefault.jpg`),
})).sort((a, b) => b.date.localeCompare(a.date));
const events = readDir('events').filter((v) => !v.draft).map((v) => ({ ...v, date: iso(v.date), html: render(v.md), path: `/events/${v.id}` })).sort((a, b) => a.date.localeCompare(b.date));
const notes = readDir('notes').filter((n) => !n.draft).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).map((n) => ({
  ...n, kind: 'note', path: `/notes/${n.id}`, html: render(n.md), first: n.md.split(/(?<=[.!?])\s/)[0],
  countries: [...new Set(NOTE_COUNTRY.filter(([k]) => String(n.author).includes(k)).map(([, c]) => c))],
}));
const pages = readDir('pages').sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).map((p) => ({ ...p, path: `/${p.id}`, html: render(p.md) }));
const byId = Object.fromEntries(articles.map((a) => [a.id, a]));

function videoBlock(id, title = 'Video') {
  return `<div class="vplay" data-yt="${id}" role="button" tabindex="0" aria-label="Play the video"><img class="vimg" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title.replace(/"/g, '&quot;')}" loading="lazy"><i class="play big" aria-hidden="true"></i></div>`;
}

function videoFile(src, poster) {
  return `<video class="vfile" controls preload="metadata" playsinline${poster ? ` poster="${poster}"` : ''}><source src="${src}">Your browser cannot play this video. <a href="${src}">Download it</a>.</video>`;
}

function render(md) {
  let h = marked.parse(md || '', { mangle: false, headerIds: false });
  h = h.replace(/<h2>Sources<\/h2>/, '<h2 id="sources">Sources</h2>');
  // Un lien YouTube seul sur sa ligne devient une vidéo intégrée
  h = h.replace(/<p>(?:<a href="([^"]+)">[^<]*<\/a>|(https?:\/\/[^\s<]+))<\/p>/g, (m, a, b) => {
    const id = (String(a || b).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/) || [])[1];
    return id ? videoBlock(id) : m;
  });
  return h;
}

// ---------- Outils ----------
const e = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fd = (s) => { const [y, m, d] = s.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const kicker = (a) => a.kicker || (a.type === 'opinion' ? 'Opinion' : a.type === 'essay' ? 'The Long Read' : a.budget ? 'UK Autumn Budget 2026' : SEC[a.sections[0]] || 'Analysis');
const A = (href, inner, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${href}">${inner}</a>`;

function build() {
  // Images de fond : une classe CSS par image
  const imgClass = {};
  const asset = (p) => p;
  const pic = (src, alt, cls = 'th') => {
    if (!src) return '';
    if (!imgClass[src]) imgClass[src] = `im${Object.keys(imgClass).length}`;
    return `<span class="${cls} im ${imgClass[src]}" role="img" aria-label="${e(alt || '')}"></span>`;
  };
  const AV = '<span class="av avi"></span>', AVL = '<span class="av lg avi"></span>';

  const card = (a, { ex = true, img = true } = {}) => A(a.path, (img && a.image ? pic(a.image, a.image_alt) : '') + `<span class="k">${e(kicker(a))}</span><b>${e(a.title)}</b>`
    + (ex && a.standfirst ? `<span class="ex">${e(a.standfirst)}</span>` : '') + `<span class="meta">${TYPE[a.type]} · ${fd(a.date)} · ${a.min} min read${a.video || a.video_file ? ' · Video' : ''}${a.pdf || (a.documents || []).length ? ' · PDF' : ''}</span>`, 'card' + (img && a.image ? ' has-im' : ''));
  const opCard = (a) => A(a.path, `${AVL}<span class="k">${e(site.name)}</span><b>${e(a.title)}</b><span class="ex">${e(a.standfirst)}</span><span class="meta">${fd(a.date)} · ${a.min} min read</span>`, 'opc');
  const chartCard = (c) => A(c.path, `<img src="${asset(c.image)}" alt="" loading="lazy"><span class="k">Chart</span><b>${e(c.title)}</b>`, 'chartcard');
  const noteCard = (n) => A(n.path, `<span class="nk">${DESK[n.desk] || n.desk}</span><blockquote>“${e(n.quote)}”</blockquote><span class="by-n">${e(n.author)}</span><span class="tease">${e(n.first)}</span><span class="rm">Read more →</span>`, 'nt').replace('<a class="nt"', `<a class="nt" data-d="${n.desk}"`);
  const videoCard = (v) => A(v.path, `<span class="vth">${pic(v.thumb, v.title, 'th')}<i class="play" aria-hidden="true"></i></span><span class="k">${v.origin === 'mine' ? 'My video' : e(v.channel || 'Video')}</span><b>${e(v.title)}</b><span class="meta">${fd(v.date)}</span>`, 'card vcard has-im');
  const cover = (r) => `<div class="rep-c"><span>${e(r.series || 'Report')}${r.number ? ' · ' + e(r.number) : ''}</span><b>${e(r.title)}</b><small>${e(site.name)} · ${MONTHS[Number(r.date.slice(5, 7)) - 1]} ${r.date.slice(0, 4)}</small></div>`;
  const reportCard = (r) => A(r.path, cover(r) + `<span class="k">${e(r.series || 'Report')}</span><b>${e(r.title)}</b><span class="meta">${fd(r.date)}${r.pdf ? ' · PDF' : ''}</span>`, 'rcard');
  const rail = (id, title, items, more, cls = '') => `<section class="w blk" id="${id}"><div class="rail-h ${cls}"><h2>${e(title)}</h2><div class="r-r">${more ? A(more[0], e(more[1]), 'more') : ''}<button class="arw" data-rail="${id}" data-dir="-1" aria-label="Previous">‹</button><button class="arw" data-rail="${id}" data-dir="1" aria-label="Next">›</button></div></div><div class="track">${items.join('')}</div></section>`;

  // Partage : LinkedIn, X, WhatsApp, Facebook, email, copier le lien, partage du téléphone
  const ICO = {
    li: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="5" r="2.2"/><path d="M10 9h3.8v1.7c.6-1 1.9-2 4-2 3.5 0 4.2 2.2 4.2 5.2V21h-4v-6.3c0-1.5 0-3.3-2.1-3.3s-2.3 1.6-2.3 3.2V21H10z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm0 17.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-2.8.8.8-2.7-.2-.3A7.7 7.7 0 1 1 12 19.7z"/><path d="M16.4 14.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3c-.5.5-.8 1.2-.8 2 .1.8.4 1.6.9 2.3 1 1.4 2.2 2.5 3.8 3.2.4.2.9.3 1.3.4.5.1 1 .1 1.5 0 .6-.1 1.2-.5 1.5-1 .1-.3.2-.7.1-1 0-.1-.2-.2-.4-.3z"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2h-2.6C11.6 2 10 3.7 10 6.4v2.1H7.5V12H10v10h4V12h2.7l.5-3.5z"/></svg>',
    em: '<svg viewBox="0 0 24 24" class="st"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>',
    ln: '<svg viewBox="0 0 24 24" class="st"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>',
    sh: '<svg viewBox="0 0 24 24" class="st"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
  };
  const use = (k) => `<svg${/class="st"/.test(ICO[k]) ? ' class="st"' : ''}><use href="#i-${k}"/></svg>`;
  const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(ICO).map(([k, v]) => v.replace(/<svg viewBox="([^"]+)"(?: class="st")?>/, `<symbol id="i-${k}" viewBox="$1">`).replace('</svg>', '</symbol>')).join('')}</svg>`;
  // La barre est remplie par le script quand la page s'affiche (le HTML reste léger)
  const shareBar = (title, p, cls = '') => `<div class="share-bar ${cls}" data-url="${SITE_URL + p}" data-title="${e(title)}"></div>`;
  const SHARE_TPL = `<span class="sb-l">Share</span><a class="sb sb-li" target="_blank" rel="noopener" aria-label="Share on LinkedIn" title="LinkedIn" data-h="https://www.linkedin.com/sharing/share-offsite/?url={u}">${use('li')}</a>`
    + `<a class="sb sb-x" target="_blank" rel="noopener" aria-label="Share on X" title="X" data-h="https://x.com/intent/post?text={t}&url={u}">${use('x')}</a>`
    + `<a class="sb sb-wa" target="_blank" rel="noopener" aria-label="Share on WhatsApp" title="WhatsApp" data-h="https://wa.me/?text={t}%20{u}">${use('wa')}</a>`
    + `<a class="sb sb-fb" target="_blank" rel="noopener" aria-label="Share on Facebook" title="Facebook" data-h="https://www.facebook.com/sharer/sharer.php?u={u}">${use('fb')}</a>`
    + `<a class="sb sb-em" aria-label="Share by email" title="Email" data-h="mailto:?subject={t}&body={u}">${use('em')}</a>`
    + `<button class="sb sb-ln" type="button" data-copy aria-label="Copy the link" title="Copy the link">${use('ln')}</button>`
    + `<button class="sb sb-sh" type="button" data-native hidden aria-label="Share" title="Share">${use('sh')}</button><span class="sb-ok" hidden>Link copied</span>`;
  const authorBox = (title, p) => `<div class="author">${AVL}<div><b>${e(site.name)}</b><p>${e(site.bio[0])}</p><p class="contact">${e(site.phone)} · <a href="mailto:${e(site.email)}">${e(site.email)}</a></p></div></div>${shareBar(title, p, 'end')}`;

  // ---------- Vues ----------
  const views = [];
  const view = (p, inner) => views.push(`<article class="view" data-path="${p}" hidden><div class="w read">${inner}</div></article>`);
  const page = (p, inner, wide = true) => views.push(`<section class="page" data-path="${p}" hidden><div class="w${wide ? '' : ' read'}">${inner}</div></section>`);
  const back = '<a class="back" href="/">← Home</a>';

  articles.forEach((a, i) => {
    const prev = articles[i + 1], next = articles[i - 1];
    const rel = articles.filter((b) => b !== a && b.sections.some((s) => a.sections.includes(s))).slice(0, 3);
    const tags = a.sections.map((s) => `<a class="tag" href="/${s}">${e(SEC[s] || s)}</a>`).join('') + a.countries.slice(0, 4).map((c) => `<a class="tag" href="/country/${c.toLowerCase()}">${e(COUNTRY[c] || c)}</a>`).join('');
    const acts = (a.pdf ? `<a class="btn" href="${asset(a.pdf)}" download="${a.id}.pdf">Download the PDF</a>` : '') + (a.linkedin ? `<a class="btn ghost" href="${e(a.linkedin)}" target="_blank" rel="noopener">Read on LinkedIn</a>` : '');
    view(a.path, `${back}<p class="kick">${e(kicker(a))}${a.type === 'essay' ? '<span class="essay-mark">Essay</span>' : ''}</p><h1>${e(a.title)}</h1>`
      + (a.standfirst ? `<p class="lede">${e(a.standfirst)}</p>` : '') + (a.type === 'opinion' ? '<p class="op-note">Opinion. The views expressed are the author\'s own.</p>' : '')
      + `<div class="by">${AV}<span><b>${e(site.name)}</b><br>${fd(a.date)} · ${a.min} min read</span><span class="tags">${tags}</span></div>${shareBar(a.title, a.path)}`
      + (a.image ? `<figure class="v-hero">${pic(a.image, a.image_alt, 'hero-im')}<figcaption>${e(a.image_alt || '')}${a.image_credit ? '. ' + e(a.image_credit) : '. Photo: Pexels'}</figcaption></figure>` : '')
      + ((a.video && ytId(a.video)) || a.video_file ? `<figure class="v-video">${a.video_file ? videoFile(a.video_file, a.image) : videoBlock(ytId(a.video), a.title)}${a.video_caption ? `<figcaption>${e(a.video_caption)}</figcaption>` : ''}</figure>` : '')
      + `<div class="prose">${a.html}</div>` + (acts ? `<div class="acts">${acts}</div>` : '')
      + ((a.documents || []).length ? `<aside class="docs"><h3>Documents</h3>${a.documents.map((d) => `<a href="${e(d.file)}" target="_blank" rel="noopener"><span class="pdf">PDF</span><b>${e(d.title || d.file.split('/').pop())}</b><span class="dl">Open ↗</span></a>`).join('')}</aside>` : '')
      + ((a.links || []).length ? `<aside class="links"><h3>Links and further reading</h3>${a.links.map((l) => `<a href="${e(l.url)}" target="_blank" rel="noopener"><b>${e(l.title || l.url)}</b><span>${e(l.source || new URL(l.url).hostname.replace(/^www\./, ''))} ↗</span></a>`).join('')}</aside>` : '')
      + authorBox(a.title, a.path)
      + `<nav class="pn">${prev ? A(prev.path, `<span>← Previous</span><b>${e(prev.title)}</b>`) : '<span></span>'}${next ? A(next.path, `<span>Next →</span><b>${e(next.title)}</b>`, 'nx') : ''}</nav>`
      + (rel.length ? `<div class="rel"><h3>Read next</h3><div class="grid g3">${rel.map((b) => card(b, { ex: false })).join('')}</div></div>` : ''));
  });
  charts.forEach((c) => {
    const art = c.article && byId[c.article];
    view(c.path, `${back}<p class="kick">Chart</p><h1>${e(c.title)}</h1><div class="by">${AV}<span><b>${e(site.name)}</b><br>${fd(c.date)}</span></div>`
      + `<figure class="v-chart chart-v"><img src="${asset(c.image)}" alt="${e(c.title)}"><figcaption><b>Source:</b> ${e(c.source || '')}</figcaption></figure><div class="prose">${c.html}</div>`
      + (art ? `<p class="end">From ${A(art.path, e(art.title))}</p>` : '') + authorBox(c.title, c.path));
  });
  videos.forEach((v) => {
    const more = videos.filter((x) => x !== v).slice(0, 3);
    view(v.path, `<a class="back" href="/videos">← All videos</a><p class="kick">Video${v.channel ? ' · ' + e(v.channel) : ''}</p><h1>${e(v.title)}</h1>`
      + (v.yt ? `<div class="vplay" data-yt="${v.yt}" role="button" tabindex="0" aria-label="Play the video">${pic(v.thumb, v.title, 'hero-im')}<i class="play big" aria-hidden="true"></i></div>` : videoFile(v.file, v.thumbnail))
      + `<p class="vnote">${v.origin === 'mine' ? 'A video by ' + e(site.name) + '.' : 'Selected by ' + e(site.name) + '. Video: ' + e(v.channel || 'YouTube') + '.'}${v.yt ? ` <a href="https://www.youtube.com/watch?v=${v.yt}" target="_blank" rel="noopener">Watch on YouTube</a>` : ''}</p>`
      + `<div class="by">${AV}<span><b>${v.origin === 'mine' ? e(site.name) : 'Why it is worth watching'}</b><br>${fd(v.date)}</span></div><div class="prose nodrop">${v.html}</div>${authorBox(v.title, v.path)}`
      + (more.length ? `<div class="rel"><h3>More videos</h3><div class="grid g3">${more.map(videoCard).join('')}</div></div>` : ''));
  });
  reports.forEach((r) => {
    const art = r.article && byId[r.article];
    view(r.path, `<a class="back" href="/reports">← Reports and documents</a><div class="rep big">${cover(r)}<div><p class="kick">${e(r.series || 'Report')}</p><h1 class="ip-h">${e(r.title)}</h1><p class="lede">${e(r.standfirst || '')}</p>`
      + `<div class="acts">${r.pdf ? `<a class="btn" href="${r.pdf}" download>Download the PDF</a><a class="btn ghost" href="${r.pdf}" target="_blank" rel="noopener">Open in the browser</a>` : ''}${art ? A(art.path, 'Read online', 'btn ghost') : ''}</div></div></div>`
      + ((r.key_messages || []).length ? `<aside class="keys"><h2>Key messages</h2><ul>${r.key_messages.map((m) => `<li>${e(m)}</li>`).join('')}</ul></aside>` : '')
      + (r.md ? `<div class="prose nodrop">${r.html}</div>` : '') + authorBox(r.title, r.path));
  });
  events.forEach((v) => view(v.path, `<a class="back" href="/events">← Events</a><p class="kick">${e(v.kind || 'Event')}</p><h1>${e(v.title)}</h1><p class="lede">${fd(v.date)}${v.place ? ' · ' + e(v.place) : ''}</p>`
    + (v.link ? `<div class="acts"><a class="btn" href="${e(v.link)}" target="_blank" rel="noopener">Details and registration</a></div>` : '') + `<div class="prose nodrop">${v.html}</div>`));
  notes.forEach((n) => {
    const same = notes.filter((m) => m.desk === n.desk && m !== n);
    const k = notes.indexOf(n) % Math.max(1, same.length);
    const more = same.slice(k, k + 3);
    view(n.path, `<a class="back" href="/notes">← All notes</a><p class="kick">Note · ${DESK[n.desk] || ''}</p><blockquote class="nq">“${e(n.quote)}”</blockquote><p class="nw">${e(n.author)}</p>`
      + `<div class="by">${AV}<span><b>Commentary by ${e(site.name)}</b><br>${Math.max(1, Math.round(n.md.split(/\s+/).length / 200))} min read</span></div>${shareBar(n.quote, n.path)}`
      + `<div class="prose">${n.html}</div>${authorBox(n.quote, n.path)}`
      + (more.length ? `<div class="rel"><h3>More ${DESK[n.desk]} notes</h3><div class="notes">${more.map(noteCard).join('')}</div></div>` : ''));
  });
  const BUDGET = articles.filter((a) => a.budget);
  const secPage = (slug, name, intro, list, deskNotes) => page(`/${slug}`, `<div class="ph"><p class="kick">Section</p><h1>${e(name)}</h1><p>${e(intro)}</p></div>`
    + `<div class="list">${list.map((a) => card(a)).join('') || '<p class="empty">First pieces coming soon.</p>'}</div>`
    + (deskNotes && deskNotes.length ? `<div class="sh mt"><h2>${e(name)} notes</h2><a href="/notes">All notes →</a></div><div class="notes">${deskNotes.slice(0, 6).map(noteCard).join('')}</div>` : ''));
  secPage('uk-budget-2026', 'UK Autumn Budget 2026', "John Healey's first Budget, delivered on 28 October 2026, and what comes next for rates and gilts.", BUDGET);
  SECTIONS.forEach(([k, n, intro]) => secPage(k, n, intro, articles.filter((a) => a.sections.includes(k)), notes.filter((m) => m.desk === k)));
  secPage('opinion', 'Opinion', 'Arguments, not summaries. Where I take a position on the debates of the moment.', articles.filter((a) => a.type === 'opinion'));
  secPage('essays', 'The Long Read', 'Longer essays on development, money and institutions, written to be read slowly.', articles.filter((a) => a.type === 'essay'));
  page('/videos', `<div class="ph"><p class="kick">Video</p><h1>Video</h1><p>Interviews, market programmes and explainers I recommend, each with a short commentary, and my own videos.</p></div><div class="grid g3">${videos.map(videoCard).join('') || '<p class="empty">First videos coming soon.</p>'}</div>`);
  page('/reports', `<div class="ph"><p class="kick">Library</p><h1>Reports and documents</h1><p>Research reports, briefings and presentations to read online or download as PDF.</p></div><div class="rgrid">${reports.map(reportCard).join('') || '<p class="empty">First reports coming soon.</p>'}</div>`);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((v) => v.date >= today), past = events.filter((v) => v.date < today).reverse();
  const evRow = (v) => A(v.path, `<span class="ev-d"><b>${Number(v.date.slice(8, 10))}</b>${MONTHS[Number(v.date.slice(5, 7)) - 1].slice(0, 3)} ${v.date.slice(0, 4)}</span><span><span class="k">${e(v.kind || 'Event')}</span><b>${e(v.title)}</b><span class="meta">${e(v.place || '')}</span></span>`, 'ev');
  page('/events', `<div class="ph"><p class="kick">Community & Events</p><h1>Events</h1><p>Talks, panels and conferences where I speak, and community events with YouthShare Initiatives.</p></div>`
    + `<div class="sh"><h2>Upcoming</h2></div>${upcoming.map(evRow).join('') || `<p class="empty">No events announced yet. To invite me to speak, see <a href="/services">Speaking and advisory</a>.</p>`}`
    + (past.length ? `<div class="sh mt"><h2>Past events</h2></div>${past.map(evRow).join('')}` : ''));
  pages.forEach((p) => page(p.path, `${back}<p class="kick">${e(site.name)}</p><h1 class="ip-h">${e(p.title)}</h1><div class="prose nodrop">${p.html}</div>`, false));

  // Pays
  const inC = (c) => ({ arts: articles.filter((a) => a.countries.includes(c)), chs: charts.filter((x) => x.countries.includes(c)), ns: notes.filter((n) => n.countries.includes(c)), vs: videos.filter((v) => v.countries.includes(c)) });
  const allC = Object.keys(COUNTRY).sort((a, b) => COUNTRY[a].localeCompare(COUNTRY[b]));
  const CPIC = { GB: ['/images/photos/westminster.jpg', 'Westminster, London'], US: ['/images/photos/nyse.jpg', 'The New York Stock Exchange'], KE: ['/images/photos/nairobi.jpg', 'Nairobi'], NG: ['/images/photos/lagos.jpg', 'Lagos'] };
  const cTile = (c) => { const x = inC(c), n = x.arts.length + x.chs.length + x.ns.length + x.vs.length; return A(`/country/${c.toLowerCase()}`, `<span class="ct-c">${c}</span><b>${e(COUNTRY[c])}</b><span class="meta">${n ? n + (n === 1 ? ' item' : ' items') : 'Coming soon'}</span>`, 'ctile' + (n ? '' : ' empty')); };
  page('/countries', `<div class="ph"><p class="kick">World</p><h1>Countries</h1><p>Analyses, opinion, charts, notes and videos, country by country.</p></div>`
    + `<div class="sh"><h2>Featured</h2></div><div class="cgrid">${site.countries_bar.map(cTile).join('')}</div>`
    + `<div class="sh mt"><h2>All countries</h2></div><div class="cgrid">${allC.map(cTile).join('')}</div>`);
  allC.forEach((c) => {
    const { arts, chs, ns, vs } = inC(c);
    const head = CPIC[c] ? pic(CPIC[c][0], CPIC[c][1], 'c-im') : `<span class="c-code">${c}</span>`;
    page(`/country/${c.toLowerCase()}`, `<div class="c-head">${head}<div><p class="kick">Country</p><h1>${e(COUNTRY[c])}</h1><p>${arts.length} articles, ${chs.length} charts and ${ns.length} notes about ${e(COUNTRY[c])}.</p></div></div>`
      + `<div class="sh"><h2>Analysis, opinion and essays</h2></div>` + (arts.length ? `<div class="list">${arts.map((a) => card(a)).join('')}</div>` : `<p class="empty">Nothing on ${e(COUNTRY[c])} yet. It is on my list; write to me if there is a subject you would like covered.</p>`)
      + (chs.length ? `<div class="sh mt"><h2>Charts</h2></div><div class="grid g3">${chs.map(chartCard).join('')}</div>` : '')
      + (vs.length ? `<div class="sh mt"><h2>Video</h2></div><div class="grid g3">${vs.map(videoCard).join('')}</div>` : '')
      + (ns.length ? `<div class="sh mt"><h2>Notes</h2></div><div class="notes">${ns.map(noteCard).join('')}</div>` : '')
      + `<p class="cnav">Other countries: ${site.countries_bar.filter((x) => x !== c).map((x) => A(`/country/${x.toLowerCase()}`, e(COUNTRY[x]))).join(' · ')}</p>`);
  });

  // ---------- Accueil ----------
  const lead = articles.find((a) => a.lead) || articles[0];
  const second = articles.find((a) => a.second && a !== lead) || articles[1];
  const picks = articles.filter((a) => a.pick && a !== lead && a !== second).slice(0, 5);
  const opinions = articles.filter((a) => a.type === 'opinion');
  const essays = articles.filter((a) => a.type === 'essay');
  const analyses = articles.filter((a) => a.type === 'analysis' && a !== lead);
  const stack = (keys) => articles.filter((a) => a.sections.some((s) => keys.includes(s))).slice(0, 4).map((a) => card(a, { ex: false, img: false })).join('');
  const r0 = reports[0];
  const rArt = r0 && r0.article && byId[r0.article];
  const NAV = [['/', 'Home'], ['/countries', 'Countries'], ['/uk-budget-2026', 'UK Budget 2026'], ...SECTIONS.map(([k, n]) => [`/${k}`, n]), ['/opinion', 'Opinion'], ['/essays', 'Long Read'], ['/videos', 'Video'], ['/notes', 'Notes'], ['/charts', 'Charts'], ['/reports', 'Reports'], ['/events', 'Events'], ['/about', 'About']];
  const ICO_S = '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
  const ICO_M = '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  const MARK = '<svg class="mk" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#0B1F3A"/><circle cx="45" cy="19" r="6" fill="#E8573C"/><path d="M8 50 25 24l8 11 6-8 17 23z" fill="#fff"/></svg>';
  const FAV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230B1F3A'/%3E%3Ccircle cx='45' cy='19' r='6' fill='%23E8573C'/%3E%3Cpath d='M8 50 25 24l8 11 6-8 17 23z' fill='%23fff'/%3E%3C/svg%3E";
  const countOpt = (c) => { const x = inC(c); return x.arts.length + x.chs.length + x.ns.length + x.vs.length; };

  const home = `<main data-path="/" id="home">
<div class="ticker" aria-label="Key numbers and latest headlines"><span class="tk-l">Highlights</span><div class="tk-v"><div class="tk-track">${[0, 1].map((k) => `<div class="tk-run"${k ? ' aria-hidden="true"' : ''}>${(site.key_figures || []).map(({ label: l, value: v }) => `<span class="fig">${e(l)} <b>${e(v)}</b></span>`).join('')}<span class="figs-d">${e(site.key_figures_date || '')}</span>${articles.slice(0, 8).map((a) => `<a class="tk-h" href="${a.path}"${k ? ' tabindex="-1"' : ''}><i>${e(kicker(a))}</i>${e(a.title)}</a>`).join('')}</div>`).join('')}</div></div></div>
<section class="finder"><div class="w"><form class="sbox" onsubmit="return false">${ICO_S}<input id="q" type="search" placeholder="Search analyses, opinion, essays and notes: gilts, AI, Budget, Africa…" autocomplete="off" aria-label="Search">
<select id="country" aria-label="Choose a country"><option value="">Choose a country</option>${allC.map((c) => `<option value="${c.toLowerCase()}">${e(COUNTRY[c])} (${countOpt(c)})</option>`).join('')}</select></form>
<div class="chips">${(site.search_chips || []).map((c) => `<button data-q="${e(c)}">${e(c)}</button>`).join('')}</div><div id="results" hidden></div></div></section>
<section class="w front">
<div class="f-lead">${A(lead.path, pic(lead.image, lead.image_alt, 'lead-im') + `<span class="k">${e(kicker(lead))}</span><b class="h1">${e(lead.title)}</b><span class="ex">${e(lead.standfirst)}</span><span class="meta">${e(site.name)} · ${fd(lead.date)} · ${lead.min} min read</span>`)}</div>
<div class="f-mid">${A(second.path, (second.chart ? `<img src="${asset(second.chart)}" alt="${e(second.chart_alt || '')}">` : pic(second.image, second.image_alt, 'lead-im')) + `<span class="k">${e(kicker(second))}</span><b>${e(second.title)}</b><span class="ex">${e(second.standfirst)}</span><span class="meta">${fd(second.date)} · ${second.min} min read</span>`)}</div>
<aside class="f-side"><h3>Editor's picks</h3>${picks.map((a) => A(a.path, `<span class="k">${e(kicker(a))}</span><b>${e(a.title)}</b><span class="meta">${a.min} min read</span>`, 'pick')).join('')}</aside>
</section>
${BUDGET.length ? `<section class="band"><div class="w"><div class="sh"><h2><span class="lab">Special</span> UK Autumn Budget 2026</h2><a href="/uk-budget-2026">All coverage →</a></div><div class="grid g3">${BUDGET.filter((a) => a.type === 'analysis').slice(0, 3).map((a) => card(a)).join('')}</div></div></section>` : ''}
${opinions.length ? rail('opinion-rail', 'Opinion', opinions.map(opCard), ['/opinion', 'All opinion →'], 'op') : ''}
${essays.length ? `<section class="long"><div class="w"><div class="rail-h"><h2>The Long Read</h2><div class="r-r"><a class="more" href="/essays">All essays →</a></div></div><div class="lr">${essays.slice(0, 2).map((a) => A(a.path, pic(a.image, a.image_alt, 'lr-im') + `<span class="k">The Long Read · ${a.min} min</span><b>${e(a.title)}</b><span class="ex">${e(a.standfirst)}</span>`)).join('')}</div></div></section>` : ''}
${videos.length ? `<div class="vband">${rail('video-rail', 'Video', videos.map(videoCard), ['/videos', 'All videos →'], 'dark')}</div>` : ''}
${rail('latest', 'Latest analysis', analyses.map((a) => card(a)), ['/economics', 'More →'])}
<section class="w blk duo">
<div><div class="sh"><h2>AI</h2><a href="/ai">More →</a></div><div class="stack">${stack(['ai'])}</div></div>
<div><div class="sh"><h2>Leadership</h2><a href="/leadership">More →</a></div><div class="stack">${stack(['leadership'])}</div></div>
<div><div class="sh"><h2>Africa</h2><a href="/africa">More →</a></div><div class="stack">${stack(['africa'])}</div></div>
</section>
<section class="why" id="why"><div class="w why-in"><p class="kick light">Why I write</p><p class="why-q">${e(site.why_title)}</p><div class="why-c">${site.why.map((p) => `<p>${e(p)}</p>`).join('')}</div></div></section>
<section class="w blk" id="notes"><div class="sh"><h2>Notes</h2><span class="cnt">${notes.length} notes</span></div>
<p class="intro">The words that shape my thinking, from economists, investors, leaders and African thinkers, and a few lines from my own essays. Each comes with a commentary: open a note to read why it matters today.</p>
<div class="filters"><button class="f on" data-f="all">All</button>${Object.entries(DESK).map(([k, v]) => `<button class="f" data-f="${k}">${v}</button>`).join('')}</div>
<div class="notes" id="nl">${notes.map(noteCard).join('')}</div><div class="more-w"><button class="btn ghost" id="more">Show more notes</button></div></section>
<section class="w blk" id="charts"><div class="sh"><h2>Charts</h2></div><div class="grid g3">${charts.map(chartCard).join('')}</div></section>
<section class="w blk" id="reports"><div class="sh"><h2>Reports and documents</h2><a href="/reports">Library →</a></div>
${r0 ? `<div class="rep">${cover(r0)}<div><h3>${e(r0.title)}</h3><p>${e(r0.standfirst || '')}</p><ol>${(r0.key_messages || []).map((m) => `<li>${e(m)}</li>`).join('')}</ol><div class="acts">${r0.pdf ? `<a class="btn" href="${r0.pdf}" download>Download the PDF</a>` : ''}${A(r0.path, 'Details', 'btn ghost')}${rArt ? A(rArt.path, 'Read online', 'btn ghost') : ''}</div></div></div>` : ''}
${reports.length > 1 ? `<div class="rgrid mt2">${reports.slice(1, 5).map(reportCard).join('')}</div>` : ''}
</section>
<section class="w blk" id="about"><div class="about"><img src="${asset('/images/headshot.jpg')}" alt="${e(site.name)}" width="180" height="180"><div><p class="kick light">About</p><h2>${e(site.name)}</h2>${site.bio.map((p) => `<p>${e(p)}</p>`).join('')}
<div class="facts">${(site.facts || []).map(({ title: b, text: s }) => `<span><b>${e(b)}</b>${e(s)}</span>`).join('')}</div></div></div></section>
<section class="w blk" id="contact"><div class="contact-box"><div><h2>Contact</h2><p>For speaking, advisory or press enquiries.</p></div>
<div class="c-lines"><a href="tel:${site.phone.replace(/\s/g, '')}"><span>Phone</span>${e(site.phone)}</a><a href="mailto:${e(site.email)}"><span>Email</span>${e(site.email)}</a><a href="${e(site.linkedin)}" target="_blank" rel="noopener"><span>LinkedIn</span>${e(site.linkedin.split('/in/')[1] || 'LinkedIn')}</a><a href="${e(site.x)}" target="_blank" rel="noopener"><span>X</span>@${e(site.x.split('/').pop())}</a></div></div></section>
</main>`;

  const drawer = `<div id="drawer" hidden><div class="dr-bg" data-close></div><nav class="dr" aria-label="Menu"><div class="dr-h"><span class="ft8-w dark">${MARK}${e(site.name)}</span><button class="x" data-close aria-label="Close">×</button></div>
<form class="sbox sm" onsubmit="return false">${ICO_S}<input id="q2" type="search" placeholder="Search" aria-label="Search"></form>
<h4>Sections</h4>${NAV.map(([h, n]) => A(h, e(n))).join('')}
<h4>Countries</h4><div class="dr-c">${allC.map((c) => A(`/country/${c.toLowerCase()}`, e(COUNTRY[c]))).join('')}</div>
<h4>${e(site.name)}</h4>${A('/about', 'About')}${A('/youthshare', 'YouthShare Initiatives')}${A('/services', 'Speaking and advisory')}${A('/contact', 'Contact')}</nav></div>`;

  const FOOT = [
    ['Support', [['/contact', 'Contact'], ['/corrections', 'Corrections'], ['#search', 'Search the site'], ['#menu', 'Countries']]],
    ['Legal & Privacy', [['/terms', 'Terms of use'], ['/privacy', 'Privacy'], ['/cookies', 'Cookies'], ['/disclaimer', 'Disclaimer']]],
    ['Services', [['/services', 'Speaking'], ['/services', 'Advisory'], ['/services', 'Press enquiries'], ['/terms', 'Republishing']]],
    ['Tools', [['/videos', 'Video'], ['/reports', 'Reports and PDF'], ['/notes', 'Notes'], ['/charts', 'Charts'], ['/essays', 'The Long Read']]],
    ['Community & Events', [['/youthshare', 'YouthShare Initiatives'], [site.linkedin, 'LinkedIn'], [site.x, 'X'], ['/events', 'Events']]],
    ['More', [['/about', 'About'], ['/why', 'Why I write'], ['/opinion', 'Opinion'], ['/uk-budget-2026', 'UK Budget 2026'], ['/economics', 'Economics'], ['/africa', 'Africa']]],
  ];
  const flink = ([h, t]) => h.startsWith('http') ? `<a href="${e(h)}" target="_blank" rel="noopener">${e(t)}</a>` : h === '#search' ? `<a href="/" data-search>${e(t)}</a>` : h === '#menu' ? `<a href="/" data-menu>${e(t)}</a>` : A(h, e(t));
  const year = new Date().getFullYear();
  const footer = `<footer class="ft8"><div class="w"><div class="ft8-cols">${FOOT.map(([h, l]) => `<div><h4>${e(h)}</h4>${l.map(flink).join('')}</div>`).join('')}</div>
<div class="ft8-c"><div class="ft8-cn">${site.countries_bar.map((c) => A(`/country/${c.toLowerCase()}`, e(COUNTRY[c]))).join('')}</div>
<p>Articles are written by ${e(site.name)} and sourced at the end of each piece. Nothing on this site is investment advice. Views are my own.</p>
<p>© ${year} ${e(site.name)}. All rights reserved. Contact: <a href="tel:${site.phone.replace(/\s/g, '')}">${e(site.phone)}</a> · <a href="mailto:${e(site.email)}">${e(site.email)}</a></p></div></div>
<div class="ft8-bar"><div class="w ft8-bar-in"><span class="ft8-w">${MARK}${e(site.name)}</span><span>Economics · Finance · AI · Leadership · Africa</span></div></div></footer>`;

  // Index de recherche
  const ALIAS = { GB: 'uk britain england london royaume-uni', US: 'usa america united states washington etats-unis', CM: 'cameroun yaounde douala', CI: 'ivory coast abidjan', CD: 'drc congo kinshasa', CG: 'congo brazzaville', NG: 'lagos abuja', KE: 'nairobi', ZA: 'johannesburg', SN: 'dakar', CN: 'beijing shanghai chine', KR: 'korea seoul coree', FR: 'paris', DE: 'berlin allemagne frankfurt' };
  const idx = [...allC.map((c) => { const x = inC(c), n = x.arts.length + x.chs.length + x.ns.length + x.vs.length; return { p: `/country/${c.toLowerCase()}`, t: COUNTRY[c], x: n ? `${n} items: analyses, charts, notes and videos` : 'Country page', k: 'Country', s: (COUNTRY[c] + ' ' + c + ' ' + (ALIAS[c] || '')).toLowerCase(), r: 2 }; }),
    ...NAV.filter(([h]) => h !== '/').map(([h, n]) => ({ p: h, t: n, x: 'Section', k: 'Section', s: n.toLowerCase(), r: 1 })),
    ...articles.map((a) => ({ p: a.path, t: a.title, x: a.standfirst || '', k: kicker(a), s: (a.title + ' ' + (a.standfirst || '') + ' ' + a.countries.map((c) => (COUNTRY[c] || '') + ' ' + (ALIAS[c] || '')).join(' ') + ' ' + a.sections.join(' ') + ' ' + a.html.replace(/<[^>]+>/g, ' ')).toLowerCase() })),
    ...charts.map((c) => ({ p: c.path, t: c.title, x: c.source || '', k: 'Chart', s: (c.title + ' ' + c.md).toLowerCase() })),
    ...videos.map((v) => ({ p: v.path, t: v.title, x: v.channel || '', k: 'Video', s: (v.title + ' ' + (v.channel || '') + ' ' + v.md).toLowerCase() })),
    ...reports.map((r) => ({ p: r.path, t: r.title, x: r.series || '', k: 'Report', s: (r.title + ' ' + (r.standfirst || '') + ' ' + (r.key_messages || []).join(' ')).toLowerCase() })),
    ...notes.map((n) => ({ p: n.path, t: `“${n.quote}”`, x: n.author, k: 'Note · ' + (DESK[n.desk] || ''), s: (n.quote + ' ' + n.author + ' ' + n.md + ' ' + n.desk).toLowerCase() }))];
  const css = fs.readFileSync(path.join(ROOT, 'site/style.css'), 'utf8')
    + Object.entries(imgClass).map(([src, cls]) => `.${cls}{background-image:url("${asset(src)}")}`).join('')
    + `.avi{display:inline-block;background:url("${asset('/images/avatar.jpg')}") center/cover}`;
  const homeAnchors = ['notes', 'charts', 'about', 'contact', 'why'];

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(site.name)}</title>
<meta name="description" content="${e(site.description)}">
<meta property="og:title" content="${e(site.name)}"><meta property="og:description" content="${e(site.description)}"><meta property="og:url" content="${SITE_URL}/"><meta property="og:type" content="website">
<meta property="og:image" content="${SITE_URL}/images/og.jpg"><link rel="canonical" href="${SITE_URL}/">
<link rel="icon" href="${FAV}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${SPRITE}
<div class="strip"></div>
<header class="mast"><div class="w mast-in">
<div class="m-left"><button class="ico" data-menu aria-label="Menu">${ICO_M}<span>Menu</span></button><button class="ico" data-search aria-label="Search">${ICO_S}<span>Search</span></button></div>
<a class="word" href="/">${e(site.name)}</a>
<a class="btn sm" href="/contact">Contact</a>
</div>
<nav class="tabs"><div class="w tabs-in">${NAV.map(([h, n]) => A(h, e(n))).join('')}</div></nav>
<div class="cbar"><span class="cb-l">Countries</span><div class="cb-v"><div class="cb-track">${[0, 1].map((k) => `<div class="cb-run"${k ? ' aria-hidden="true"' : ''}>${[...new Set([...site.countries_bar, ...allC.filter((c) => countOpt(c))])].map((c) => `<a href="/country/${c.toLowerCase()}"${k ? ' tabindex="-1"' : ''}>${e(COUNTRY[c])}</a>`).join('')}</div>`).join('')}</div></div><a href="/countries" class="all">All</a></div>
</header>
${drawer}
${home}
${views.join('\n')}
${footer}
<script>
var IDX = ${JSON.stringify(idx)};
var SHARE = ${JSON.stringify(SHARE_TPL)};
var ANCH = ${JSON.stringify(homeAnchors)};
(function () {
  var home = document.getElementById('home'), drawer = document.getElementById('drawer');
  var V = {}; [].forEach.call(document.querySelectorAll('[data-path]'), function (el) { V[el.getAttribute('data-path')] = el; });
  var canPush = location.protocol !== 'file:';
  function closeDrawer() { drawer.hidden = true; document.body.classList.remove('lock'); }
  function mark(p) {
    [].forEach.call(document.querySelectorAll('.tabs a, .cbar a'), function (a) { var h = a.getAttribute('href'); a.classList.toggle('on', h === p || (h !== '/' && p.indexOf(h + '/') === 0 && a.closest('.cbar'))); });
  }
  function show(p, push) {
    p = (p || '/').replace(/\\/+$/, '') || '/';
    var anchor = ANCH.indexOf(p.slice(1)) >= 0 ? p.slice(1) : null;
    var el = anchor ? home : (V[p] || home);
    closeDrawer();
    for (var k in V) V[k].hidden = V[k] !== el;
    fillShare(el);
    mark(anchor ? '/' + anchor : (V[p] ? p : '/'));
    if (push && canPush && location.pathname !== p) history.pushState({}, '', p);
    if (anchor) setTimeout(function () { document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' }); }, 30); else window.scrollTo(0, 0);
  }
  window.addEventListener('popstate', function () { show(location.pathname, false); });
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-menu],[data-close],[data-search],[data-q],[data-rail]');
    if (b) {
      ev.preventDefault();
      if (b.hasAttribute('data-menu')) { drawer.hidden = false; document.body.classList.add('lock'); }
      else if (b.hasAttribute('data-close')) closeDrawer();
      else if (b.hasAttribute('data-search')) { show('/', true); q.focus(); }
      else if (b.dataset.q) { q.value = b.dataset.q; search(); }
      else if (b.dataset.rail) { var t = document.getElementById(b.dataset.rail).querySelector('.track'); t.scrollBy({ left: Number(b.dataset.dir) * t.clientWidth * 0.9, behavior: 'smooth' }); }
      return;
    }
    var a = ev.target.closest('a[href^="/"]');
    if (!a || a.target || a.hasAttribute('download') || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    var h = a.getAttribute('href');
    if (/^\\/(admin|images|documents|site\\.zip|kit)/.test(h)) return;
    ev.preventDefault(); show(h, true);
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { if (!drawer.hidden) closeDrawer(); else show('/', true); } });
  // Vidéo : chargée seulement au clic (youtube-nocookie)
  function play(el) { el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + el.dataset.yt + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'; el.classList.add('on'); }
  document.addEventListener('click', function (ev) { var el = ev.target.closest('.vplay'); if (el && !el.classList.contains('on')) play(el); });
  document.addEventListener('keydown', function (ev) { var el = ev.target.closest && ev.target.closest('.vplay'); if (el && (ev.key === 'Enter' || ev.key === ' ') && !el.classList.contains('on')) { ev.preventDefault(); play(el); } });
  // Partage : barres remplies à l'affichage, copier le lien, partage natif du téléphone
  function fillShare(root) {
    [].forEach.call(root.querySelectorAll('.share-bar:empty'), function (bar) {
      var u = encodeURIComponent(bar.dataset.url), t = encodeURIComponent(bar.dataset.title);
      bar.innerHTML = SHARE;
      [].forEach.call(bar.querySelectorAll('[data-h]'), function (a) { a.href = a.dataset.h.replace('{u}', u).replace('{t}', t); });
      if (navigator.share) bar.querySelector('[data-native]').hidden = false;
    });
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-copy],[data-native]'); if (!b) return;
    var bar = b.closest('.share-bar'), url = bar.dataset.url, title = bar.dataset.title;
    if (b.hasAttribute('data-native')) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    var ok = bar.querySelector('.sb-ok');
    function done() { ok.hidden = false; setTimeout(function () { ok.hidden = true; }, 2000); }
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else { var t = document.createElement('input'); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); done(); }
  });
  // Flèches des rails
  [].forEach.call(document.querySelectorAll('.track'), function (t) {
    var id = t.parentNode.id; function upd() { var bs = document.querySelectorAll('[data-rail="' + id + '"]'); bs[0].disabled = t.scrollLeft < 8; bs[1].disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8; var none = t.scrollWidth <= t.clientWidth + 8; bs[0].hidden = bs[1].hidden = none; }
    t.addEventListener('scroll', upd); window.addEventListener('resize', upd); setTimeout(upd, 50);
  });
  // Recherche et pays
  var q = document.getElementById('q'), q2 = document.getElementById('q2'), sel = document.getElementById('country'), out = document.getElementById('results');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function search() {
    var s = q.value.trim().toLowerCase(); if (s.length < 2) { out.hidden = true; return; }
    var terms = s.split(/\\s+/).map(function (t) { return t.length > 4 && /s$/.test(t) ? t.slice(0, -1) : t; }), hits = IDX.filter(function (r) { return terms.every(function (t) { return r.s.indexOf(t) >= 0; }); });
    function score(r) { var t = (r.t + ' ' + r.x).toLowerCase(), n = (r.r || 0) * 10 - (r.p.indexOf('/notes/') === 0 ? 2 : 0); terms.forEach(function (w) { if (t.indexOf(w) >= 0) n += 3; }); return n; }
    hits.sort(function (a, b) { return score(b) - score(a); });
    out.hidden = false;
    out.innerHTML = '<div class="r-h"><b>' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' for “' + esc(q.value.trim()) + '”</b><button type="button" id="rclose">Close</button></div>'
      + (hits.length ? hits.slice(0, 40).map(function (r) { return '<a class="r" href="' + r.p + '"><span class="k">' + esc(r.k) + '</span><b>' + esc(r.t) + '</b><span class="meta">' + esc(r.x) + '</span></a>'; }).join('') : '<p class="empty">No results yet. Try another word.</p>');
    document.getElementById('rclose').onclick = function () { out.hidden = true; q.value = ''; };
  }
  q.addEventListener('input', search);
  q2.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); show('/', true); q.value = q2.value; search(); q.focus(); } });
  sel.addEventListener('change', function () { if (sel.value) { var c = sel.value; sel.value = ''; show('/country/' + c, true); } });
  // Notes
  var STEP = window.innerWidth < 700 ? 6 : 12, notes = [].slice.call(document.querySelectorAll('#nl .nt')), more = document.getElementById('more'), f = 'all', shown = STEP;
  function draw() { var l = notes.filter(function (n) { return f === 'all' || n.dataset.d === f; }); notes.forEach(function (n) { n.hidden = true; }); l.slice(0, shown).forEach(function (n) { n.hidden = false; }); more.hidden = l.length <= shown; }
  [].forEach.call(document.querySelectorAll('.f'), function (b) { b.addEventListener('click', function () { [].forEach.call(document.querySelectorAll('.f'), function (x) { x.classList.toggle('on', x === b); }); f = b.dataset.f; shown = STEP; draw(); }); });
  more.addEventListener('click', function () { shown += STEP; draw(); });
  draw();
  show(canPush ? location.pathname : '/', false);
})();
</script>
</body>
</html>`;
  const allPaths = ['/', ...homeAnchors.map((a) => '/' + a), ...Object.keys(Object.fromEntries(views.map((v) => [v.match(/data-path="([^"]+)"/)[1], 1])))];
  return { html, allPaths };
}

// ---------- Écriture ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(PUB, DIST, { recursive: true });
fs.rmSync(path.join(DIST, 'site.zip'), { force: true });
const web = build();
fs.writeFileSync(path.join(DIST, 'index.html'), web.html);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${web.allPaths.map((p) => `<url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc></url>`).join('\n')}\n</urlset>\n`);

// Version Hostinger : le même index.html + les fichiers qu'il utilise + .htaccess (adresses propres)
const HTACCESS = `# Toutes les adresses du site (articles, pays, notes) ouvrent index.html\nOptions -MultiViews\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [L]\n`;
const files = { 'index.html': strToU8(web.html), '.htaccess': strToU8(HTACCESS), 'robots.txt': fs.readFileSync(path.join(DIST, 'robots.txt')), 'sitemap.xml': fs.readFileSync(path.join(DIST, 'sitemap.xml')) };
for (const m of new Set(web.html.match(/\/(images|documents)\/[\w./-]+\.(jpe?g|png|svg|webp|pdf)/g) || [])) {
  const f = path.join(PUB, m);
  if (fs.existsSync(f)) files[m.slice(1)] = fs.readFileSync(f);
}
fs.writeFileSync(path.join(DIST, 'site.zip'), zipSync(files, { level: 6 }));

console.log(`${articles.length} articles, ${notes.length} notes, ${charts.length} charts, ${pages.length} pages · index.html ${(web.html.length / 1e6).toFixed(2)} MB · site.zip (Hostinger) ${(fs.statSync(path.join(DIST, 'site.zip')).size / 1e6).toFixed(2)} MB`);
