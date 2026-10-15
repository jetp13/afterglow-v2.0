const CACHE_NAME = 'afterglow-v6-public-safety';
// Public visits must not prefetch detailed adult tools or unverified Rights content.
const ASSETS_TO_CACHE = ['/', '/index.html', '/safety.html', '/etomidate-safety.html',
  '/first-aid.html', '/help.html', '/privacy.html', '/terms.html', '/legal.html', '/about.html',
  '/assets/layout.css', '/assets/shared-emergency.css', '/assets/public-safety.css',
  '/assets/entry-gate.js', '/assets/safety-accessibility.js', '/assets/logo-new.png',
  '/assets/logo-handwritten-nobg.png', '/manifest.json'];
self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(names => Promise.all(names.filter(name => name.startsWith('afterglow-') && name !== CACHE_NAME).map(name => caches.delete(name)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !ASSETS_TO_CACHE.includes(url.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(url.pathname, copy)));
    }
    return response;
  }).catch(async () => (await caches.match(url.pathname)) || new Response('目前離線，請恢復連線後重試。', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
});
