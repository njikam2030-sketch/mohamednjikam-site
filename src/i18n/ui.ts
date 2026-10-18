// Textes de l'interface (anglais par défaut, français), noms des rubriques et adresses des pages.
import type { Kind, Topic } from '../config';

export type Lang = 'en' | 'fr';
export const other = (l: Lang): Lang => (l === 'en' ? 'fr' : 'en');

export const UI = {
  en: {
    home: 'Home', analysis: 'Analysis', commentary: 'Reflections', charts: 'Charts', videos: 'Videos', topics: 'Topics', about: 'About',
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
    videosIntro: 'My videos, and a selection of the best conversations on finance, markets and AI.',
    myVideo: 'My video', selected: 'Selected', watch: 'Watch the video', watchOn: 'Watch on YouTube', myTake: 'My analysis and commentary', elsewhere: 'Elsewhere', latestVideos: 'Videos',
    topicsIntro: 'Every publication, by topic.',
    breadcrumbHome: 'Home', lang: 'Language',
    reports: 'Reports', reportsIntro: 'Notes, studies and presentations in PDF.', downloadPdf: 'Download the PDF', openPdf: 'Open in a new tab', pagesLabel: 'pages',
    country: 'Country', countries: 'Countries', allCountries: 'All countries', chooseCountry: 'Choose a country', countriesIntro: 'Every publication, country by country.', noCountry: 'No publication on this country yet. Here are the latest in the region.', publicationsOn: 'Publications on',
    pdf: 'Download PDF', edition: 'Edition', global: 'Global', alsoOn: 'Also published on LinkedIn', keyReads: 'Key reads', followMe: 'Follow', inThisEdition: 'In this edition', topStories: 'Top stories', latestNews: 'Latest', moreIn: 'More in', allPublications: 'All publications', search: 'Search', searchIntro: 'Search every analysis, reflection and chart.',
  },
  fr: {
    home: 'Accueil', analysis: 'Analyses', commentary: 'Réflexions', charts: 'Graphiques', videos: 'Vidéos', topics: 'Rubriques', about: 'À propos',
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
    videosIntro: 'Mes vidéos, et une sélection des meilleures discussions sur la finance, les marchés et l\u2019IA.',
    myVideo: 'Ma vidéo', selected: 'Sélection', watch: 'Voir la vidéo', watchOn: 'Voir sur YouTube', myTake: 'Mon analyse et mon commentaire', elsewhere: 'Ailleurs', latestVideos: 'Vidéos',
    topicsIntro: 'Toutes les publications, par rubrique.',
    breadcrumbHome: 'Accueil', lang: 'Langue',
    reports: 'Rapports', reportsIntro: 'Notes, études et présentations en PDF.', downloadPdf: 'Télécharger le PDF', openPdf: 'Ouvrir dans un nouvel onglet', pagesLabel: 'pages',
    country: 'Pays', countries: 'Pays', allCountries: 'Tous les pays', chooseCountry: 'Choisir un pays', countriesIntro: 'Toutes les publications, pays par pays.', noCountry: 'Pas encore de publication sur ce pays. Voici les dernières de la région.', publicationsOn: 'Publications sur',
    pdf: 'Télécharger en PDF', edition: 'Édition', global: 'Monde', alsoOn: 'Publié aussi sur LinkedIn', keyReads: 'À lire', followMe: 'Suivre', inThisEdition: 'Dans cette édition', topStories: 'À la une', latestNews: 'Dernière minute', moreIn: 'Plus dans', allPublications: 'Toutes les publications', search: 'Rechercher', searchIntro: 'Chercher dans toutes les analyses, réflexions et graphiques.',
  },
} as const;

export const TOPIC_INFO: Record<Topic, { en: string; fr: string; den: string; dfr: string }> = {
  us: { en: 'United States', fr: 'États-Unis', den: 'Wall Street, the Fed and America\u2019s largest companies.', dfr: 'Wall Street, la Fed et les grandes entreprises américaines.' },
  deals: { en: 'IPOs & M&A', fr: 'IPO et fusions', den: 'Listings, mergers, acquisitions and fundraising.', dfr: 'Introductions en bourse, fusions, acquisitions et levées de fonds.' },
  funds: { en: 'Hedge Funds & Investing', fr: 'Fonds et investissement', den: 'Hedge funds, private equity, private credit and where capital is deployed.', dfr: 'Hedge funds, private equity, dette privée et déploiement des capitaux.' },
  ai: { en: 'AI & Finance', fr: 'IA et finance', den: 'The AI companies, how they are funded, and what they change in finance.', dfr: 'Les entreprises de l\u2019IA, leur financement, et ce qu\u2019elles changent en finance.' },
  debt: { en: 'Debt & Rates', fr: 'Dette et taux', den: 'Sovereign and corporate debt, central banks and interest rates.', dfr: 'Dette des États et des entreprises, banques centrales et taux.' },
  uk: { en: 'London & UK', fr: 'Londres et Royaume-Uni', den: 'Gilts, the Bank of England and the City.', dfr: 'Gilts, Banque d\u2019Angleterre et la City.' },
  africa: { en: 'Africa', fr: 'Afrique', den: 'Capital markets, debt and investment across the continent.', dfr: 'Marchés de capitaux, dette et investissement sur le continent.' },
  asia: { en: 'Asia', fr: 'Asie', den: 'China, India, the Gulf, and their capital abroad.', dfr: 'Chine, Inde, Golfe, et leurs capitaux à l\u2019étranger.' },
};

// Éditions (pays et régions), comme les éditions du FT
export const REGIONS = ['us', 'uk', 'africa', 'asia'] as const;
export type Region = (typeof REGIONS)[number];
export const REGION_NAME: Record<Region, { en: string; fr: string }> = {
  us: { en: 'US', fr: 'États-Unis' },
  uk: { en: 'UK', fr: 'Royaume-Uni' },
  africa: { en: 'Africa', fr: 'Afrique' },
  asia: { en: 'Asia', fr: 'Asie' },
};

export const KIND_NAME: Record<Kind, { en: string; fr: string }> = {
  analysis: { en: 'Analysis', fr: 'Analyse' },
  commentary: { en: 'Reflection', fr: 'Réflexion' },
  chart: { en: 'Chart', fr: 'Graphique' },
  video: { en: 'Video', fr: 'Vidéo' },
  report: { en: 'Report', fr: 'Rapport' },
};

// Adresses des pages
const seg = {
  analysis: { en: 'analysis', fr: 'analyses' },
  commentary: { en: 'reflections', fr: 'reflexions' },
  chart: { en: 'charts', fr: 'graphiques' },
  video: { en: 'videos', fr: 'videos' },
  report: { en: 'reports', fr: 'rapports' },
} as const;
const base = (l: Lang) => (l === 'fr' ? '/fr' : '');
export const path = {
  home: (l: Lang) => `${base(l)}/`,
  list: (l: Lang, k: Kind) => `${base(l)}/${seg[k][l]}/`,
  item: (l: Lang, k: Kind, slug: string) => `${base(l)}/${seg[k][l]}/${slug}/`,
  topics: (l: Lang) => `${base(l)}/${l === 'fr' ? 'rubriques' : 'topics'}/`,
  topic: (l: Lang, t: Topic) => `${base(l)}/${l === 'fr' ? 'rubriques' : 'topics'}/${t}/`,
  about: (l: Lang) => `${base(l)}/${l === 'fr' ? 'a-propos' : 'about'}/`,
  country: (l: Lang, c: string) => `${base(l)}/${l === 'fr' ? 'pays' : 'country'}/${c.toLowerCase()}/`,
  countries: (l: Lang) => `${base(l)}/${l === 'fr' ? 'pays' : 'countries'}/`,
  edition: (l: Lang, r: Region) => `${base(l)}/edition/${r}/`,
  search: (l: Lang) => `${base(l)}/${l === 'fr' ? 'recherche' : 'search'}/`,
};

export function formatDate(d: Date, l: Lang) {
  return d.toLocaleDateString(l === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function readingTime(body: string | undefined) {
  const words = (body ?? '').replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
