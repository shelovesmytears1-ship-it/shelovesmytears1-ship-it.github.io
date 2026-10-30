import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  // Production deployment: overflow-web.pl via GitHub Pages (root domain, no base path).
  site: 'https://overflow-web.pl',
  trailingSlash: 'ignore',
  server: {
    port: 4321,
    host: false,
  },
  vite: {
    plugins: [
      {
        name: 'serve-public-html-directories',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url) return next();
            const [urlPath, query] = req.url.split('?');
            const trimmed = urlPath.replace(/^\/+|\/+$/g, '');
            if (trimmed) {
              const directFile = path.resolve(process.cwd(), 'public', trimmed, 'index.html');
              if (fs.existsSync(directFile)) {
                req.url = `/${trimmed}/index.html` + (query ? `?${query}` : '');
              }
            }
            next();
          });
        }
      }
    ]
  }
  // Static SSG by default — perfect for portfolio with content collections
  // Sitemap generated manually at src/pages/sitemap.xml.ts to keep control
  // over hreflang alternates per page.
});
