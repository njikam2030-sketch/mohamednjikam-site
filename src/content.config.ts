// Les trois types de publications. Chaque publication = un fichier, créé depuis l'espace admin (/admin).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPICS } from './config';

const pattern = '**/[^_]*.md';
const topic = z.enum(TOPICS);
// Pays concernés (codes ISO à deux lettres, ex. CM, GB, US)
const pays = z.array(z.string().length(2).transform((c) => c.toUpperCase())).default([]);

// Analyses : articles longs (thèse, preuves, objections, que faire, sources)
const analyses = defineCollection({
  loader: glob({ pattern, base: './src/content/analyses' }),
  schema: z.object({
    titre: z.string(),
    chapeau: z.string().optional(),
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    rubriques: z.array(topic).min(1),
    pays,
    pointsCles: z.array(z.string()).default([]),
    image: z.string().optional(),
    legendeImage: z.string().optional(),
    traduction: z.string().optional(),
    linkedin: z.string().optional(),
    aLaUne: z.boolean().default(false),
    aParaitre: z.boolean().default(false),
    brouillon: z.boolean().default(false),
  }),
});

// Réflexions : textes courts, citations, hommages (comme un fil X)
const reflexions = defineCollection({
  loader: glob({ pattern, base: './src/content/reflexions' }),
  schema: z.object({
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    titre: z.string().optional(),
    citation: z.string().optional(),
    auteur: z.string().optional(),
    image: z.string().optional(),
    rubriques: z.array(topic).default([]),
    pays,
    brouillon: z.boolean().default(false),
  }),
});

// Graphiques : un graphique commenté (« le graphique de la semaine »)
const graphiques = defineCollection({
  loader: glob({ pattern, base: './src/content/graphiques' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    image: z.string(),
    source: z.string().optional(),
    rubriques: z.array(topic).default([]),
    pays,
    brouillon: z.boolean().default(false),
  }),
});

// Vidéos : les vôtres, ou une sélection YouTube (lien + votre commentaire)
const videos = defineCollection({
  loader: glob({ pattern, base: './src/content/videos' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    youtube: z.string(),
    origine: z.enum(['moi', 'selection']).default('selection'),
    chaine: z.string().optional(),
    pointsCles: z.array(z.string()).default([]),
    rubriques: z.array(topic).default([]),
    pays,
    brouillon: z.boolean().default(false),
  }),
});

// Rapports : documents PDF (notes, études, présentations)
const rapports = defineCollection({
  loader: glob({ pattern, base: './src/content/rapports' }),
  schema: z.object({
    titre: z.string(),
    chapeau: z.string().optional(),
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    serie: z.string().default('Report'),
    numero: z.string().optional(),
    pdf: z.string().optional(),
    couverture: z.string().optional(),
    pages: z.number().optional(),
    messagesCles: z.array(z.string()).default([]),
    rubriques: z.array(topic).default([]),
    pays,
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { analyses, reflexions, graphiques, videos, rapports };
