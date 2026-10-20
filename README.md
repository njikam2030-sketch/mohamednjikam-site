# moharamadan.com

Site personnel de Mohamed Ramadan : analyses, réflexions, vidéos, rapports et graphiques, en anglais et en français.
Le site est fait de pages HTML (fabriquées avec Astro) et se publie depuis un espace admin, sans toucher au code.

## 1. Brancher le domaine moharamadan.com (une seule fois)

Le site est hébergé sur Vercel. Le domaine reste chez Hostinger : on lui dit seulement d'envoyer les visiteurs vers Vercel.

1. **Vercel** : projet `mohamednjikam-site` > **Settings > Domains** > ajouter `moharamadan.com`, puis `www.moharamadan.com`
   (choisir « Redirect to moharamadan.com »). Vercel affiche les valeurs à copier.
2. **Hostinger** : hPanel > **Domaines** > moharamadan.com > **DNS / Serveurs de noms** > Gérer les enregistrements DNS :
   - supprimer les enregistrements **A** existants sur `@` et le **CNAME** existant sur `www` ;
   - ajouter **A**, nom `@`, valeur `76.76.21.21` (ou l'adresse affichée par Vercel) ;
   - ajouter **CNAME**, nom `www`, valeur `cname.vercel-dns.com` (ou la valeur affichée par Vercel).
3. Attendre « Valid Configuration » dans Vercel (quelques minutes, parfois quelques heures). Le cadenas HTTPS est automatique.

Ensuite, chaque publication met le site à jour toute seule, en une minute environ.

## 2. Publier : `moharamadan.com/admin`

**Une seule fois : créer la clé d'accès**
GitHub > photo de profil > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** > Generate new token :
- Repository access : « Only select repositories » > `mohamednjikam-site` ;
- Permissions > Repository permissions > **Contents : Read and write** ;
- Generate, puis copier la clé (elle commence par `github_pat_`).

**Ensuite** : ouvrir `https://moharamadan.com/admin` > « Sign in with Token » > coller la clé (une fois par appareil).

| Menu | Ce que c'est |
| --- | --- |
| **Analyses** | Articles de fond. Titre, chapeau, rubriques, points clés, image, texte, puis « Sources ». « Mettre à la une » le place en grand sur l'accueil. |
| **Réflexions** | Textes courts, citations (avec auteur), hommages, photo facultative. |
| **Vidéos** | Lien YouTube (votre vidéo ou une sélection) et un petit commentaire affiché sous la vidéo. |
| **Rapports** | À la manière du FMI : collection, numéro, messages clés, PDF (facultatif). Sans PDF, le rapport se lit sur le site et s'imprime avec sa couverture. Couverture créée automatiquement. |
| **Graphiques** | Un graphique (PNG/JPG) avec titre, source et commentaire. |
| **Mon profil** | Présentation de l'accueil et de la page À propos, en anglais et en français. |

Chaque publication peut être rattachée à un ou plusieurs **pays** (menu « Country » en haut du site).
« Brouillon » garde une publication hors du site.

## 3. Solution de secours : héberger chez Hostinger

Possible, mais l'admin ne met alors plus le site à jour tout seul : il faut refaire `npm run build`
et renvoyer le dossier `dist/` à chaque publication.
hPanel > Sites web > Gestionnaire de fichiers > `public_html` : y envoyer **le contenu** du dossier `dist/`
(le fichier `.htaccess` fourni gère HTTPS, le www et la page 404).

## 4. Réglages

- `src/config.ts` : adresse du site, liens LinkedIn et X, newsletter (`buttondown`).
- `src/styles/global.css` : couleurs (bleu nuit `#0A2540`, bleu `#0B5CAD`).
- `public/images/` : photos du site.

## Pour un développeur

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # pages HTML finales dans dist/
```
