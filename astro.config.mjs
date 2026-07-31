import { defineConfig } from 'astro/config';

export default defineConfig({
  // Production deployment: overflow-web.pl via GitHub Pages (root domain, no base path).
  site: 'https://overflow-web.pl',
  trailingSlash: 'ignore',
  server: {
    port: 4321,
    host: false,
  },
  // Static SSG by default — perfect for portfolio with content collections
  // Sitemap generated manually at src/pages/sitemap.xml.ts to keep control
  // over hreflang alternates per page.
});
