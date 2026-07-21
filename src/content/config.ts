import { defineCollection, z } from 'astro:content';

const localeStrings = z
  .object({
    tagline: z.string().optional(),
    summary: z.string().optional(),
    /** Per-locale case body (markdown). Falls back to the RU master body. */
    body: z.string().optional(),
    /** Optional per-locale label for the stat callout (e.g. "vs 540 у обычной стройки"). */
    statLabel: z.string().optional(),
    /** Optional per-locale tiny "result" line under meta panel. */
    result: z.string().optional(),
  })
  .optional();

/** Big "wow" number rendered between body sections (master RU value). */
const statSchema = z
  .object({
    value: z.string(),
    label: z.string(),
  })
  .optional();

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    tagline:      z.string(),
    niche:        z.string(),
    year:         z.string(),
    palette:      z.string(),
    /** Tier 1 = full case study with rich decision log. Tier 2 = archive card. */
    tier:         z.union([z.literal(1), z.literal(2)]),
    accent:       z.string().optional(),
    bg:           z.string().optional(),
    siteUrl:      z.string().url().optional(),
    technologies: z.array(z.string()).default([]),
    region:       z.array(z.string()).default([]),
    /** One-line summary in master locale (RU) — voice-locked per decision 006. */
    summary:      z.string(),
    /** One-line concrete result shown in the meta strip (RU master). Optional. */
    result:       z.string().optional(),
    /** Big number/fact rendered between sections (RU master). Optional. */
    stat:         statSchema,
    cover:        z.string().optional(),
    /** Screen recording shown inside the laptop instead of the static cover.
     *  Muted + looping, and only plays while it is on screen. */
    coverVideo:   z.string().optional(),
    /** Extra device shots rendered after the cover, in order. Phones in a row
     *  parallax against each other; laptops render full width. */
    screens: z.array(z.object({
      src:   z.string(),
      kind:  z.enum(['laptop', 'phone']).default('laptop'),
      video: z.boolean().default(false),
    })).default([]),
    order:        z.number().default(0),
    /** Every project in v3 is a concept. Schema kept boolean for future real-client cases. */
    concept:      z.boolean().default(true),
    /** Per-locale tagline + summary + body overrides. RU master is the fallback. */
    translations: z.object({
      pl: localeStrings,
      en: localeStrings,
      ua: localeStrings,
    }).optional(),
  }),
});

export const collections = { cases };
