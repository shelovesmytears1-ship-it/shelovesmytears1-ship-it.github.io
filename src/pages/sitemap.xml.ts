import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Manual sitemap.xml generation with hreflang alternates per page.
 *
 * Pages with all 4 locales (PL default, /en/, /ru/, /ua/):
 *   /                 (homepage)
 *   /work             (gallery)
 *   /work/[slug]      (×9 case studies)
 *   /method
 *   /about
 *   /contact
 */

const SITE = 'https://overflow-web.pl';

const LOCALES = ['pl', 'en', 'ru', 'ua'] as const;
type Locale = typeof LOCALES[number];

const HREFLANG: Record<Locale, string> = {
  pl: 'pl',
  en: 'en',
  ru: 'ru',
  ua: 'uk', // ISO 639-1 for Ukrainian is 'uk'
};

/** Build localized URL: '/work' + 'en' → '/en/work'. PL = no prefix. */
function urlFor(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : '/' + path;
  if (locale === 'pl') return SITE + clean;
  return SITE + `/${locale}` + (clean === '/' ? '' : clean);
}

/** Render a single <url> entry with alternates for all 4 locales. */
function urlEntry(path: string): string {
  const alts = LOCALES.map(
    (loc) =>
      `    <xhtml:link rel="alternate" hreflang="${HREFLANG[loc]}" href="${urlFor(path, loc)}" />`
  ).join('\n');
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(path, 'pl')}" />`;

  // Emit one <url> entry per locale (per Google guidelines for hreflang).
  return LOCALES.map(
    (loc) => `  <url>
    <loc>${urlFor(path, loc)}</loc>
${alts}
${xDefault}
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  ).join('\n');
}

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');

  const staticPaths = ['/', '/work', '/method', '/about', '/contact'];
  const casePaths = cases.map((c) => `/work/${c.slug}`);
  const allPaths = [...staticPaths, ...casePaths];

  // Legal pages — English only, no hreflang alternates
  const legalPaths = ['/privacy', '/impressum'];
  const legalEntries = legalPaths.map((path) => `  <url>
    <loc>${SITE}${path}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPaths.map((path) => urlEntry(path)).join('\n')}
${legalEntries}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
