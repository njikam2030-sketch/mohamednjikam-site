// Textes de l'interface (anglais par défaut, français) et adresses des pages.
import type { Topic } from '../config';

export type Lang = 'en' | 'fr';

export const UI = {
  en: {
    tagline: 'Economics and finance, from London to Douala.',
    location: 'London · Douala',
    bio: 'Capital markets and debt advisory. I write about money moving between Africa, Asia and the City, and about the leaders deciding how AI will reshape finance.',
    bioMore: 'Institutional client management, capital markets, debt advisory, emerging markets and structured finance. Université Paris-Panthéon-Assas. Views are my own.',
    reflections: 'Reflections', analysis: 'Analysis', about: 'About',
    latestAnalysis: 'Latest analysis', allAnalysis: 'All analysis', topics: 'Topics',
    noReflections: 'The first reflections are on their way.',
    noAnalysis: 'The first analysis is on its way.',
    noTopic: 'No analysis in this topic yet.',
    seeAll: 'See all', readMore: 'Read', minRead: 'min read',
    share: 'Share', copy: 'Copy link', copied: 'Link copied', sources: 'Sources',
    back: 'Back', related: 'More analysis', permalink: 'Open',
    newsletterTitle: 'One analysis, every two weeks.',
    newsletterText: 'London, Africa, Asia. The new piece and the numbers behind it, nothing else.',
    newsletterButton: 'Subscribe', newsletterSoon: 'The newsletter opens soon.',
    email: 'Your email', template: 'Template', otherLang: 'In French',
    footer: 'Views are my own.', notFound: 'This page does not exist.', home: 'Home',
    aboutTitle: 'About', basedIn: 'Based in', basedInV: 'London, United Kingdom',
    education: 'Education', writesIn: 'Writes in', writesInV: 'English, French',
    reflectionsCount: 'reflections', analysisCount: 'analyses',
    aboutText: [
      'I work in capital markets and debt advisory in London, close to the institutions that price risk for emerging markets.',
      'From London I follow three stories at once: how Africa finances itself, how Asian capital is changing that, and how the leaders of the AI era are rewriting the rules of finance. This site is where I write about them, in English and in French.',
    ],
    role: 'Institutional client management · Capital markets · Debt advisory · Emerging markets · Structured finance',
  },
  fr: {
    tagline: 'L’économie et la finance, de Londres à Douala.',
    location: 'Londres · Douala',
    bio: 'Marchés de capitaux et conseil en dette. J’écris sur l’argent qui circule entre l’Afrique, l’Asie et la City, et sur les dirigeants qui décident comment l’IA va transformer la finance.',
    bioMore: 'Gestion de clients institutionnels, marchés de capitaux, conseil en dette, marchés émergents et finance structurée. Université Paris-Panthéon-Assas. Les opinions n’engagent que moi.',
    reflections: 'Réflexions', analysis: 'Analyses', about: 'À propos',
    latestAnalysis: 'Dernières analyses', allAnalysis: 'Toutes les analyses', topics: 'Rubriques',
    noReflections: 'Les premières réflexions arrivent.',
    noAnalysis: 'La première analyse arrive.',
    noTopic: 'Pas encore d’analyse dans cette rubrique.',
    seeAll: 'Tout voir', readMore: 'Lire', minRead: 'min de lecture',
    share: 'Partager', copy: 'Copier le lien', copied: 'Lien copié', sources: 'Sources',
    back: 'Retour', related: 'Autres analyses', permalink: 'Ouvrir',
    newsletterTitle: 'Une analyse toutes les deux semaines.',
    newsletterText: 'Londres, l’Afrique, l’Asie. Le nouvel article et les chiffres derrière, rien d’autre.',
    newsletterButton: 'M’inscrire', newsletterSoon: 'La newsletter ouvre bientôt.',
    email: 'Votre email', template: 'Modèle', otherLang: 'En anglais',
    footer: 'Les opinions exprimées n’engagent que moi.', notFound: 'Cette page n’existe pas.', home: 'Accueil',
    aboutTitle: 'À propos', basedIn: 'Basé à', basedInV: 'Londres, Royaume-Uni',
    education: 'Formation', writesIn: 'Écrit en', writesInV: 'anglais, français',
    reflectionsCount: 'réflexions', analysisCount: 'analyses',
    aboutText: [
      'Je travaille dans les marchés de capitaux et le conseil en dette à Londres, au plus près des institutions qui évaluent le risque des marchés émergents.',
      'Depuis Londres, je suis trois histoires à la fois : comment l’Afrique se finance, comment les capitaux asiatiques changent la donne, et comment les dirigeants de l’ère de l’IA réécrivent les règles de la finance. C’est ici que j’écris à leur sujet, en anglais et en français.',
    ],
    role: 'Gestion de clients institutionnels · Marchés de capitaux · Conseil en dette · Marchés émergents · Finance structurée',
  },
} as const;

export const TOPIC_NAMES: Record<Topic, { en: string; fr: string }> = {
  uk: { en: 'London & UK', fr: 'Londres et Royaume-Uni' },
  africa: { en: 'Africa', fr: 'Afrique' },
  asia: { en: 'Asia', fr: 'Asie' },
  ai: { en: 'AI & Leadership', fr: 'IA et leadership' },
  markets: { en: 'Markets & Rates', fr: 'Marchés et taux' },
  payments: { en: 'Payments', fr: 'Paiements' },
  debt: { en: 'Debt', fr: 'Dette' },
};

// Adresses des pages dans chaque langue
export const path = {
  home: (l: Lang) => (l === 'fr' ? '/fr/' : '/'),
  reflections: (l: Lang) => (l === 'fr' ? '/fr/reflexions/' : '/reflections/'),
  reflection: (l: Lang, slug: string) => (l === 'fr' ? `/fr/reflexions/${slug}/` : `/reflections/${slug}/`),
  analyses: (l: Lang) => (l === 'fr' ? '/fr/analyses/' : '/analysis/'),
  analysis: (l: Lang, slug: string) => (l === 'fr' ? `/fr/analyses/${slug}/` : `/analysis/${slug}/`),
  topic: (l: Lang, t: Topic) => (l === 'fr' ? `/fr/analyses/rubrique/${t}/` : `/analysis/topic/${t}/`),
  about: (l: Lang) => (l === 'fr' ? '/fr/a-propos/' : '/about/'),
};

export function formatDate(d: Date, l: Lang) {
  return d.toLocaleDateString(l === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function readingTime(body: string | undefined) {
  const words = (body ?? '').replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
