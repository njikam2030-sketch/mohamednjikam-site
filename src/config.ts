// Réglages du site : modifiés ici, ils s'appliquent partout.

// Adresse du site : variable SITE_URL si elle existe, sinon l'adresse principale donnée par Vercel
// (le domaine personnalisé dès qu'il est branché), sinon mohamednjikam.com.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'https://mohamednjikam.com')).replace(/\/$/, '');

export const SITE = {
  name: 'Mohamed Njikam',
  domain: new URL(SITE_URL).host,
  url: SITE_URL,
  linkedin: 'https://www.linkedin.com/in/moha-rama',
  x: 'https://x.com/Moha_Samoa',
  xHandle: 'Moha_Samoa',
  // Newsletter : nom d'utilisateur d'un compte gratuit sur https://buttondown.com (vide = « bientôt »).
  buttondown: '',
};

// Rubriques (thèmes) communes à toutes les publications
export const TOPICS = ['us', 'deals', 'funds', 'ai', 'debt', 'uk', 'africa', 'asia'] as const;
export type Topic = (typeof TOPICS)[number];

// Types de publications
export const KINDS = ['analysis', 'commentary', 'chart', 'video', 'report'] as const;
export type Kind = (typeof KINDS)[number];
