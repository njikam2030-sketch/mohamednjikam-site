// Réglages du site : à modifier ici, ils s'appliquent partout.
export const SITE = {
  name: 'Mohamed Njikam',
  domain: 'mohamednjikam.com',
  url: 'https://mohamednjikam.com',
  location: 'London · Douala',
  linkedin: 'https://www.linkedin.com/in/moha-rama',
  x: 'https://x.com/Moha_Samoa',
  xHandle: 'Moha_Samoa',
  // Newsletter : créer un compte gratuit sur https://buttondown.com puis indiquer ici le nom d'utilisateur.
  // Tant que c'est vide, le formulaire affiche « bientôt ».
  buttondown: '',
  // Mettre `true` pour afficher les modèles (fichiers commençant par « _ ») : aperçu uniquement.
  showTemplates: process.env.SHOW_TEMPLATES === '1',
};

// Rubriques des analyses
export const TOPICS = ['uk', 'africa', 'asia', 'ai', 'markets', 'payments', 'debt'] as const;
export type Topic = (typeof TOPICS)[number];
