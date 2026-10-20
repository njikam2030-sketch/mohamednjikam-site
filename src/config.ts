// Réglages du site : modifiés ici, ils s'appliquent partout.

// Adresse du site : le domaine moharamadan.com (variable SITE_URL pour en changer).
export const SITE_URL = (process.env.SITE_URL || 'https://moharamadan.com').replace(/\/$/, '');

export const SITE = {
  name: 'Mohamed Ramadan',
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
