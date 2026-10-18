// Textes de l'interface (anglais par défaut, français), noms des rubriques et adresses des pages.
import type { Kind, Topic } from '../config';

export type Lang = 'en' | 'fr';
export const other = (l: Lang): Lang => (l === 'en' ? 'fr' : 'en');

export const UI = {
  en: {
    home: 'Home', analysis: 'Analysis', commentary: 'Reflections', charts: 'Charts', topics: 'Topics', about: 'About',
    subscribe: 'Subscribe', menu: 'Menu', subtitle: 'Economics & Finance',
    featured: 'Featured', latest: 'Latest', seeAll: 'See all', readAnalysis: 'Read the analysis',
    chartOfWeek: 'Chart of the week', exploreTopics: 'Explore by topic', aboutAuthor: 'About the author', moreAbout: 'More about Mohamed',
    keyPoints: 'Key points', sources: 'Sources', share: 'Share', copy: 'Copy link', copied: 'Link copied',
    related: 'Related', minRead: 'min read', coming: 'Coming soon', comingText: 'This analysis will be published shortly. Subscribe to receive it.',
    by: 'By', publications: 'publications', all: 'All', source: 'Source',
    empty: 'Nothing published here yet.', emptyHome: 'The first publications are on their way.',
    nlTitle: 'Get the next analysis by email', nlText: 'One analysis every two weeks. London, Africa, Asia. No noise.',
    nlButton: 'Subscribe', nlSoon: 'The newsletter opens soon.', email: 'Email address',
    footerNote: 'Views expressed are my own.', follow: 'Follow', site: 'Site',
    notFound: 'This page does not exist.', basedIn: 'Based in', education: 'Education', writesIn: 'Writes in', writesInV: 'English, French',
    analysisIntro: 'Long-form analysis. One thesis per piece, every number sourced.',
    commentaryIntro: 'Short reflections, quotes and tributes.',
    chartsIntro: 'One chart, one idea.',
    topicsIntro: 'Every publication, by topic.',
    breadcrumbHome: 'Home', lang: 'Language',
    pdf: 'Download PDF', search: 'Search', searchIntro: 'Search every analysis, reflection and chart.',
  },
  fr: {
    home: 'Accueil', analysis: 'Analyses', commentary: 'Réflexions', charts: 'Graphiques', topics: 'Rubriques', about: 'À propos',
    subscribe: 'S’abonner', menu: 'Menu', subtitle: 'Économie et finance',
    featured: 'À la une', latest: 'Dernières publications', seeAll: 'Tout voir', readAnalysis: 'Lire l’analyse',
    chartOfWeek: 'Le graphique de la semaine', exploreTopics: 'Explorer par rubrique', aboutAuthor: 'L’auteur', moreAbout: 'En savoir plus',
    keyPoints: 'Points clés', sources: 'Sources', share: 'Partager', copy: 'Copier le lien', copied: 'Lien copié',
    related: 'À lire aussi', minRead: 'min de lecture', coming: 'À paraître', comingText: 'Cette analyse sera publiée très prochainement. Abonnez-vous pour la recevoir.',
    by: 'Par', publications: 'publications', all: 'Tout', source: 'Source',
    empty: 'Rien de publié ici pour l’instant.', emptyHome: 'Les premières publications arrivent.',
    nlTitle: 'Recevoir la prochaine analyse par email', nlText: 'Une analyse toutes les deux semaines. Londres, l’Afrique, l’Asie. Pas de bruit.',
    nlButton: 'S’abonner', nlSoon: 'La newsletter ouvre bientôt.', email: 'Adresse email',
    footerNote: 'Les opinions exprimées n’engagent que moi.', follow: 'Suivre', site: 'Site',
    notFound: 'Cette page n’existe pas.', basedIn: 'Basé à', education: 'Formation', writesIn: 'Écrit en', writesInV: 'anglais, français',
    analysisIntro: 'Analyses de fond. Une thèse par article, chaque chiffre sourcé.',
    commentaryIntro: 'Réflexions courtes, citations et hommages.',
    chartsIntro: 'Un graphique, une idée.',
    topicsIntro: 'Toutes les publications, par rubrique.',
    breadcrumbHome: 'Accueil', lang: 'Langue',
    pdf: 'Télécharger en PDF', search: 'Rechercher', searchIntro: 'Chercher dans toutes les analyses, réflexions et graphiques.',
  },
} as const;

export const TOPIC_INFO: Record<Topic, { en: string; fr: string; den: string; dfr: string }> = {
  uk: { en: 'London & UK', fr: 'Londres et Royaume-Uni', den: 'Gilts, the Bank of England, the City.', dfr: 'Gilts, Banque d’Angleterre, la City.' },
  africa: { en: 'Africa', fr: 'Afrique', den: 'CEMAC, WAEMU, Nigeria, Kenya, South Africa.', dfr: 'CEMAC, UEMOA, Nigeria, Kenya, Afrique du Sud.' },
  asia: { en: 'Asia', fr: 'Asie', den: 'China, India, the Gulf, and their capital in Africa.', dfr: 'Chine, Inde, Golfe, et leurs capitaux en Afrique.' },
  ai: { en: 'AI & Leadership', fr: 'IA et leadership', den: 'The people and decisions shaping AI in finance.', dfr: 'Les personnes et les choix qui façonnent l’IA en finance.' },
  markets: { en: 'Markets & Rates', fr: 'Marchés et taux', den: 'Rates, currencies, commodities.', dfr: 'Taux, devises, matières premières.' },
  payments: { en: 'Payments', fr: 'Paiements', den: 'Remittances, mobile money, cross-border rails.', dfr: 'Transferts, mobile money, paiements transfrontaliers.' },
  debt: { en: 'Debt', fr: 'Dette', den: 'Sovereign and corporate borrowing.', dfr: 'Dette souveraine et des entreprises.' },
};

export const KIND_NAME: Record<Kind, { en: string; fr: string }> = {
  analysis: { en: 'Analysis', fr: 'Analyse' },
  commentary: { en: 'Reflection', fr: 'Réflexion' },
  chart: { en: 'Chart', fr: 'Graphique' },
};

// Adresses des pages
const seg = {
  analysis: { en: 'analysis', fr: 'analyses' },
  commentary: { en: 'reflections', fr: 'reflexions' },
  chart: { en: 'charts', fr: 'graphiques' },
} as const;
const base = (l: Lang) => (l === 'fr' ? '/fr' : '');
export const path = {
  home: (l: Lang) => `${base(l)}/`,
  list: (l: Lang, k: Kind) => `${base(l)}/${seg[k][l]}/`,
  item: (l: Lang, k: Kind, slug: string) => `${base(l)}/${seg[k][l]}/${slug}/`,
  topics: (l: Lang) => `${base(l)}/${l === 'fr' ? 'rubriques' : 'topics'}/`,
  topic: (l: Lang, t: Topic) => `${base(l)}/${l === 'fr' ? 'rubriques' : 'topics'}/${t}/`,
  about: (l: Lang) => `${base(l)}/${l === 'fr' ? 'a-propos' : 'about'}/`,
  search: (l: Lang) => `${base(l)}/${l === 'fr' ? 'recherche' : 'search'}/`,
};

export function formatDate(d: Date, l: Lang) {
  return d.toLocaleDateString(l === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function readingTime(body: string | undefined) {
  const words = (body ?? '').replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
