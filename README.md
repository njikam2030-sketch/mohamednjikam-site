# mohamednjikam.com

Site personnel de Mohamed Njikam : réflexions courtes (le fil, comme sur X) et analyses longues, en anglais et en français.

## Publier

Deux façons, au choix.

### 1. Depuis le navigateur ou le téléphone : `mohamednjikam.com/admin`

1. Une seule fois : créer un jeton GitHub (GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens), avec accès **Contents : Read and write** sur le dépôt `mohamednjikam-site`.
2. Ouvrir `https://mohamednjikam.com/admin`, choisir « Se connecter avec un jeton », coller le jeton.
3. « Réflexions » ou « Analyses » > « Nouveau », écrire, « Enregistrer ». Le site se met à jour tout seul en une minute environ.

Le dépôt est réglé dans `public/admin/config.yml` (`njikam2030-sketch/mohamednjikam-site`).

### 2. En ajoutant un fichier sur GitHub

- **Réflexion** : un fichier dans `src/content/reflexions/`, par exemple `2026-10-20-yondo-black.md`. Modèles : `_modele-citation.md`, `_modele-question.md`, `_modele-english.md`.
- **Analyse** : un fichier dans `src/content/analyses/`, par exemple `the-price-of-time.md`. Modèle : `_modele-analyse.md` (thèse, preuves, objections, que faire, sources).
- Graphiques et photos : dans `public/images/analyses/`, puis `![légende](/images/analyses/graphique-1.png)` ou le bloc `<figure>` du modèle.
- Les fichiers dont le nom commence par `_` ne sont **jamais publiés**. `brouillon: true` cache aussi une publication.
- Une analyse dans les deux langues : deux fichiers, chacun avec `traduction:` qui donne le nom de l'autre (sans `.md`).

## Adresses

| Page | Anglais | Français |
| --- | --- | --- |
| Accueil (profil + fil) | `/` | `/fr/` |
| Réflexions | `/reflections/` | `/fr/reflexions/` |
| Analyses | `/analysis/` | `/fr/analyses/` |
| Rubrique | `/analysis/topic/africa/` | `/fr/analyses/rubrique/africa/` |
| À propos | `/about/` | `/fr/a-propos/` |

Rubriques : `uk`, `africa`, `asia`, `ai`, `markets`, `payments`, `debt`. Flux RSS : `/rss.xml`. Plan du site : `/sitemap-index.xml`.

## Réglages

`src/config.ts` : liens LinkedIn et X, newsletter (`buttondown` : nom d'utilisateur d'un compte gratuit sur buttondown.com ; vide = « bientôt »).
Textes de l'interface et présentation : `src/i18n/ui.ts`. Couleurs : `src/styles/global.css`. Photos : `public/images/`.

## Mise en ligne

**Vercel (conseillé)** : importer le dépôt GitHub sur vercel.com (Astro est détecté seul), puis Settings > Domains > `mohamednjikam.com`, et chez Hostinger (DNS) : enregistrement `A` `@` vers `76.76.21.21` et `CNAME` `www` vers `cname.vercel-dns.com`. Chaque publication remet le site à jour.

**Hostinger seul** : `npm run build`, puis envoyer le contenu du dossier `dist/` dans `public_html` (gestionnaire de fichiers). À refaire à chaque publication.

## Développement

```bash
npm install
npm run dev                     # http://localhost:4321
SHOW_TEMPLATES=1 npm run dev    # avec les modèles affichés
npm run build                   # site final dans dist/
npx astro check                 # vérification des types
```
