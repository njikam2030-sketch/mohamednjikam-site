# moharamadan.com

Site de Mohamed Ramadan : analyses, tribunes, essais longs, notes, graphiques et rapports.

Tout le contenu se trouve dans le dossier `content/`, et vous le modifiez depuis l'espace de publication, sans toucher au code. À chaque « Publier », le site se reconstruit tout seul en une minute environ (`scripts/build-site.mjs`).

## Publier : l'espace admin

Adresse : `https://moharamadan.com/admin`, une fois le domaine branché sur Vercel. En attendant : `https://mohamednjikam-site.vercel.app/admin`.

**La première fois, sur chaque appareil**, il faut une clé d'accès GitHub. La clé sert de mot de passe : ne la donnez à personne.

- Allez dans GitHub > photo de profil > Settings > Developer settings > Personal access tokens > **Fine-grained tokens** > Generate new token.
- Dans « Repository access », choisissez « Only select repositories » puis `mohamednjikam-site`.
- Dans Permissions > Repository permissions, réglez **Contents** sur **Read and write**.
- Générez la clé et copiez-la (elle commence par `github_pat_`).
- Ouvrez l'admin, choisissez « Sign in with Token » et collez la clé.

**Ensuite**, voici ce que contient chaque menu :

| Menu | Usage |
| --- | --- |
| **Articles** | Analyses, tribunes (« Opinion ») et essais longs (« The Long Read »). Vous renseignez le titre, le chapeau, le genre, les rubriques, les pays, une photo, puis le texte. Les sources vont à la fin, sous un intertitre « Sources ». Des cases permettent de mettre l'article à la une, dans « Editor's picks » ou dans le dossier Budget. |
| **Notes** | Une citation, son auteur et votre commentaire. |
| **Graphiques** | L'image, la source et un commentaire. |
| **Rapports** | Le PDF, les messages clés et la couverture, qui est fabriquée automatiquement. |
| **Pages** | Les pages du pied de page : conditions d'utilisation, confidentialité, YouthShare Initiatives, services. |
| **Réglages du site** | La présentation, le téléphone et l'email, les chiffres clés de l'accueil, les pays de la barre du haut et les mots proposés sous la recherche. |

Cochez « Brouillon » pour garder un texte hors ligne. Chaque article reçoit sa propre adresse, par exemple `moharamadan.com/analysis/boring-budget`, `/opinion/...` ou `/essays/...`. Chaque pays a la sienne aussi : `/country/gb`, `/country/cm`, etc.

## Brancher moharamadan.com sur Vercel (une seule fois, recommandé)

Une fois le domaine branché, ce que vous publiez dans l'admin est en ligne en une minute, sans rien téléverser.

1. Dans **Vercel**, ouvrez le projet `mohamednjikam-site` > Settings > Domains, ajoutez `moharamadan.com`, puis `www.moharamadan.com` en choisissant « Redirect to moharamadan.com ».
2. Dans **Hostinger**, allez dans hPanel > Domaines > moharamadan.com > DNS. Remplacez l'enregistrement **A** de `@` par `76.76.21.21`, et le **CNAME** de `www` par `cname.vercel-dns.com`. Utilisez les valeurs que Vercel affiche si elles sont différentes.
3. Attendez que Vercel affiche « Valid Configuration ». Le HTTPS se met en place automatiquement.

## Solution de secours : rester sur l'hébergement Hostinger

À chaque publication, Vercel fabrique aussi un paquet prêt pour Hostinger : `https://mohamednjikam-site.vercel.app/site.zip`. Il contient index.html, les images, le PDF et un `.htaccess` qui fait fonctionner les adresses des articles.

Pour l'installer : hPanel > Gestionnaire de fichiers > `public_html`. Supprimez l'ancien contenu, téléversez `site.zip`, puis faites « Extraire ». Il faut refaire cette opération après chaque publication, c'est pourquoi la solution Vercel est préférable.

## Pour un développeur

```bash
npm install
npm run build     # fabrique dist/ (site) et dist/site.zip (Hostinger)
npm run preview   # http://localhost:3000
```

- `content/` : le contenu (Markdown et `site.json`).
- `site/style.css` : la charte graphique (Inter ; bleu nuit `#0B1F3A`, bleu `#0F6E8C`, corail `#E8573C`).
- `public/` : les images (`images/photos`, `images/charts`, `images/uploads`), les documents et l'admin.
- `src/` : l'ancien site Astro, qui n'est plus publié (`npm run build:astro`).
