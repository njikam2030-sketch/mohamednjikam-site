// Les deux types de publications. Un fichier Markdown = une publication.
// Les fichiers dont le nom commence par « _ » sont des modèles : jamais publiés.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPICS } from './config';

const pattern = process.env.SHOW_TEMPLATES === '1' ? '**/*.md' : '**/[^_]*.md';

// Réflexions : textes courts, citations, hommages, questions (le fil, comme sur X).
const reflexions = defineCollection({
  loader: glob({ pattern, base: './src/content/reflexions' }),
  schema: z.object({
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    citation: z.string().optional(),
    auteur: z.string().optional(),
    image: z.string().optional(),
    legende: z.string().optional(),
    brouillon: z.boolean().default(false),
    modele: z.boolean().default(false),
  }),
});

// Analyses : articles longs, avec thèse, preuves, objections, conseils et sources.
const analyses = defineCollection({
  loader: glob({ pattern, base: './src/content/analyses' }),
  schema: z.object({
    titre: z.string(),
    sousTitre: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    langue: z.enum(['en', 'fr']),
    rubrique: z.enum(TOPICS),
    rubrique2: z.enum(TOPICS).optional(),
    chiffreCle: z.string().optional(),
    couverture: z.string().optional(),
    traduction: z.string().optional(),
    brouillon: z.boolean().default(false),
    modele: z.boolean().default(false),
  }),
});

export const collections = { reflexions, analyses };
