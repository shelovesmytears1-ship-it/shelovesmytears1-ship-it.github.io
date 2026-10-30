const CACHE_PREFIX = 'alona-kids-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v11`;
const APP_ROOT = new URL('./', self.registration.scope);
const APP_ROOT_URL = APP_ROOT.href;
const APP_FILES = [
  '/manifest.webmanifest',
  '/assets/icon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/icon-192.png?v=diary-20261022',
  '/assets/icon-512.png?v=diary-20261022',
  '/assets/icon-180.png?v=diary-20261022',
  '/assets/icon-32.png?v=diary-20261022'
];

async function cacheResponse(cache, requestUrl) {
  try {
    const response = await fetch(requestUrl, { cache: 'reload' });
    if (response.ok) await cache.put(requestUrl, response.clone());
  } catch {
    // Keep installation resilient when an optional icon or asset is unavailable.
  }
}

async function prepareAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(APP_ROOT_URL, { cache: 'reload' });
  if (!response.ok) throw new Error('Unable to cache the app shell.');

  const html = await response.clone().text();
  await cache.put(APP_ROOT_URL, response);

  const assets = new Set();
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const assetUrl = new URL(match[1], APP_ROOT_URL);
    if (assetUrl.origin === self.location.origin
      && assetUrl.pathname.startsWith('/assets/')
      && /\.(?:css|js)$/.test(assetUrl.pathname)) {
      assets.add(assetUrl.href);
    }
  }

  await Promise.all([
    ...APP_FILES.map((path) => cacheResponse(cache, new URL(path, APP_ROOT).href)),
    ...[...assets].map((assetUrl) => cacheResponse(cache, assetUrl))
  ]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(prepareAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET'
    || requestUrl.origin !== self.location.origin
    || requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(APP_ROOT_URL, response.clone());
        }
        return response;
      } catch {
        return await caches.match(APP_ROOT_URL)
          || new Response('Alona polski centrum недоступна без подключения к интернету.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  const isAppAsset = requestUrl.pathname.startsWith('/assets/')
    || requestUrl.pathname === '/manifest.webmanifest';
  if (!isAppAsset) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
