/* ============================================================
   HyenaX - The Ndlela Millionaires GoldPack Service Worker
   App-shell caching + network-first data refresh.

   Strategy:
   - Navigations ......... network-first, fall back to cached shell (offline launch)
   - data/fixtures.json .. network-first, always cache latest, fall back to cache
   - Same-origin assets .. cache-first
   - CDN assets .......... stale-while-revalidate (Tailwind, Alpine, Google Fonts)
   ============================================================ */

const VERSION = 'hyenax-v4';
const SHELL_CACHE = VERSION + '-shell';
const DATA_CACHE = VERSION + '-data';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-maskable.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => (key.startsWith('hyenax-') || key.startsWith('ndlela-')) && key !== SHELL_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* App navigations: fresh shell when online, cached shell when offline */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Scraper output: network-first */
  if (url.pathname.includes('/data/') || url.pathname.endsWith('fixtures.json')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) =>
            hit || new Response(
              JSON.stringify({ meta: { source: 'offline-cache', match_count: 0 }, matches: [] }),
              { headers: { 'Content-Type': 'application/json' } }
            )
          )
        )
    );
    return;
  }

  /* Same-origin static assets: cache-first */
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  /* CDN dependencies: stale-while-revalidate */
  event.respondWith(
    caches.open(DATA_CACHE).then((cache) =>
      cache.match(req).then((hit) => {
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || refresh;
      })
    )
  );
});
