# mohamednjikam.com

Site personnel de Mohamed Njikam : analyses, réflexions et graphiques, en anglais et en français.
Le site est fabriqué en pages HTML (avec Astro) et se publie depuis un espace admin, sans toucher au code.

## 1. Mettre le site en ligne (une seule fois, environ 15 minutes)

1. Aller sur **vercel.com** > « Sign up » > « Continue with GitHub » (compte `njikam2030-sketch`).
2. « Add New… » > « Project » > choisir le dépôt **mohamednjikam-site** > « Deploy ». Vercel reconnaît Astro tout seul.
3. Dans le projet Vercel : **Settings > Domains** > ajouter `mohamednjikam.com` (et `www.mohamednjikam.com`).
4. Chez **Hostinger** (hPanel > Domaines > mohamednjikam.com > DNS) :
   - enregistrement **A**, nom `@`, valeur `76.76.21.21` (supprimer les autres A sur `@`) ;
   - enregistrement **CNAME**, nom `www`, valeur `cname.vercel-dns.com`.
   Vercel affiche « Valid Configuration » après quelques minutes (parfois quelques heures).

Ensuite, chaque publication met le site à jour automatiquement, en une minute environ.

## 2. Publier : l'espace admin `mohamednjikam.com/admin`

**Une seule fois : créer la clé d'accès**
GitHub > photo de profil > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** > Generate new token :
- Repository access : « Only select repositories » > `mohamednjikam-site` ;
- Permissions > Repository permissions > **Contents : Read and write** ;
- Generate, puis copier la clé (elle commence par `github_pat_`).

**Ensuite, à chaque fois**
Ouvrir `https://mohamednjikam.com/admin` > « Sign in with Token » (se connecter avec une clé) > coller la clé.
Le navigateur la garde : on ne la donne qu'une fois par appareil.

| Menu | Ce que c'est |
| --- | --- |
| **Analyses** | Articles de fond. Titre, chapeau, rubriques, points clés, image, texte, puis un titre « Sources » en fin de texte. « Mettre à la une » le place en grand sur l'accueil. |
| **Réflexions** | Textes courts, citations (avec auteur), hommages, photo facultative. |
| **Vidéos** | Lien YouTube (votre vidéo ou une sélection), points clés et votre analyse et commentaire. |
| **Rapports (PDF)** | Un fichier PDF avec titre, résumé et image de couverture : téléchargeable et lisible sur le site. |
| **Graphiques** | Un graphique (PNG/JPG) avec son titre, sa source et un commentaire : « le graphique de la semaine ». |
| **Mon profil** | Présentation de l'accueil et de la page À propos, en anglais et en français. |

Chaque publication peut être rattachée à un ou plusieurs **pays** : elle apparaît alors sur la page du pays (menu « Country » en haut du site).

« Brouillon » garde une publication hors du site. Pour supprimer : ouvrir la publication > Supprimer.

## 3. Pages du site

| Page | Anglais | Français |
| --- | --- | --- |
| Accueil | `/` | `/fr/` |
| Analyses | `/analysis/` | `/fr/analyses/` |
| Réflexions | `/reflections/` | `/fr/reflexions/` |
| Graphiques | `/charts/` | `/fr/graphiques/` |
| Rubriques | `/topics/` | `/fr/rubriques/` |
| À propos | `/about/` | `/fr/a-propos/` |

Rubriques : Londres et Royaume-Uni, Afrique, Asie, IA et leadership, Marchés et taux, Paiements, Dette.
Aussi : flux RSS `/rss.xml`, plan du site `/sitemap-index.xml`, image de partage LinkedIn / X / WhatsApp.

## 4. Réglages

- `src/config.ts` : liens LinkedIn et X, newsletter (`buttondown` : nom d'utilisateur d'un compte gratuit sur buttondown.com ; vide = « bientôt »).
- `src/styles/global.css` : couleurs (bleu nuit `#0A2540`, bleu `#0B5CAD`), en haut du fichier.
- `public/images/` : photos du site.

## Pour un développeur

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # pages HTML finales dans dist/
```
