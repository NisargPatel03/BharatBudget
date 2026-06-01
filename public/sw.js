const CACHE_NAME = 'bharatbudget-v2';

/** Only cache stable static files — never index.html or Vite hashed bundles. */
const PRECACHE_URLS = ['/manifest.json', '/logo_alt.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

function isDynamicAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.search.includes('v=')
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Capture uvicorn API queries and respond with structured offline fallback if server is unreachable
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Always fetch fresh HTML and JS/CSS so deploys never reference deleted chunks.
  if (request.mode === 'navigate' || isDynamicAsset(url)) {
    event.respondWith(
      fetch(request).catch(async () => {
        if (request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          return cache.match('/index.html') || Response.error();
        }
        return Response.error();
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
