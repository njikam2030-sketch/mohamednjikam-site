// Réglages du site : modifiés ici, ils s'appliquent partout.
export const SITE = {
  name: 'Mohamed Njikam',
  domain: 'mohamednjikam.com',
  url: 'https://mohamednjikam.com',
  linkedin: 'https://www.linkedin.com/in/moha-rama',
  x: 'https://x.com/Moha_Samoa',
  xHandle: 'Moha_Samoa',
  // Newsletter : nom d'utilisateur d'un compte gratuit sur https://buttondown.com (vide = « bientôt »).
  buttondown: '',
};

// Rubriques (thèmes) communes à toutes les publications
export const TOPICS = ['uk', 'africa', 'asia', 'ai', 'markets', 'payments', 'debt'] as const;
export type Topic = (typeof TOPICS)[number];

// Types de publications
export const KINDS = ['analysis', 'commentary', 'chart'] as const;
export type Kind = (typeof KINDS)[number];
