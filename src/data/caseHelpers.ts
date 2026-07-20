/**
 * Helpers for localizing case study card data (used by HomePage, WorkPage,
 * CaseStudyPage). Keeps locale-aware accessors in one place so the three
 * page components stay DRY.
 */

import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

type Case = CollectionEntry<'cases'>;

/** Get the localized tagline. Falls back to RU master (frontmatter.tagline). */
export function getTagline(c: Case, lang: Lang): string {
  if (lang === 'ru') return c.data.tagline;
  const t = c.data.translations?.[lang]?.tagline;
  return t ?? c.data.tagline;
}

/** Get the localized summary. Falls back to RU master (frontmatter.summary). */
export function getSummary(c: Case, lang: Lang): string {
  if (lang === 'ru') return c.data.summary;
  const t = c.data.translations?.[lang]?.summary;
  return t ?? c.data.summary;
}

/** Get the localized case body (markdown). Falls back to RU master (entry.body). */
export function getBody(c: Case, lang: Lang): string {
  if (lang === 'ru') return c.body;
  const t = c.data.translations?.[lang]?.body;
  return t && t.trim() ? t : c.body;
}

/** Get the localized one-line "result" for the meta strip. RU master fallback. */
export function getResult(c: Case, lang: Lang): string | undefined {
  if (lang === 'ru') return c.data.result;
  return c.data.translations?.[lang]?.result ?? c.data.result;
}

/** Localized stat callout {value, label}. Value is shared; label is per-locale. */
export function getStat(c: Case, lang: Lang): { value: string; label: string } | undefined {
  if (!c.data.stat) return undefined;
  const overrideLabel = lang !== 'ru' ? c.data.translations?.[lang]?.statLabel : undefined;
  return { value: c.data.stat.value, label: overrideLabel ?? c.data.stat.label };
}

/** Map raw frontmatter niche value to localized label via UI translation key. */
export function nicheLabel(niche: string, t: (k: any) => string): string {
  const map: Record<string, string> = {
    'B2B SaaS':         t('work.filter.saas'),
    'E-commerce':       t('work.filter.ecom'),
    'Services':         t('work.filter.services'),
    'Cultural / Event': t('work.filter.cultural'),
    'Multipage':        t('work.filter.multipage'),
  };
  return map[niche] || niche;
}

/** Map niche to filter slug (used by /work client-side filter). */
export function nicheSlug(niche: string): string {
  const map: Record<string, string> = {
    'B2B SaaS':         'saas',
    'E-commerce':       'ecom',
    'Services':         'services',
    'Cultural / Event': 'cultural',
    'Multipage':        'multipage',
  };
  return map[niche] || 'other';
}
