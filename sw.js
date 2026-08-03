// ============================================================
//  TRINY MASAJES — Service Worker (PWA Offline Support)
// ============================================================

const CACHE_NAME    = 'triny-masajes-v1.1.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/notifications.js',
  './js/whatsapp.js',
  './js/points.js',
  './js/support.js',
  './js/booking.js',
  './js/crm.js',
  './js/game.js',
  './js/app.js',
  './manifest.json',
  './img/Triny_Masajes_logo.png',
  './img/481167345_3881105415472060_5563772965849036966_n.jpg',
  './img/488873475_3916229425292992_1209196953871246027_n.jpg',
  './img/489702665_3919203694995565_8483964575785664527_n.jpg',
  './img/490901552_3929261660656435_3995812252580009694_n.jpg',
  './img/491791637_3930027970579804_1729663323855883877_n.jpg',
  './img/491848418_3929920933923841_6637045350661252133_n.jpg',
  './img/494072324_3943036845945583_4337052228856049629_n.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Install cache error:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const isExternal = !request.url.includes(self.location.origin);
  if (isExternal) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        });
      })
      .catch(() => caches.match('./index.html'))
  );
});

console.log('[Triny Masajes] Service Worker v1.1.0 loaded ✓');
