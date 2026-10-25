const CACHE_PREFIX = 'triny-masajes-';
const CACHE_NAME = `${CACHE_PREFIX}v1.4.2`;
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/config.js',
  './js/data.js',
  './js/image-inventory.js',
  './js/notifications.js',
  './js/whatsapp.js',
  './js/drawers.js',
  './js/cart.js',
  './js/checkout.js',
  './js/carousel.js',
  './js/points.js',
  './js/support.js',
  './js/giftcards.js',
  './js/claims.js',
  './js/booking.js',
  './js/app.js',
  './js/videos.js',
  './manifest.json',
  './img/Triny_Masajes_logo.png',
  './img/Imagen para inicio de la page.png',
  './img/Masaje descontracturante.png',
  './img/Imagen para  paquetes de masajes reductores.png',
  './img/Masaje de maderoterapia.png',
  './img/Masaje para descarga muscular.png',
  './img/Masaje drenaje linfático.png',
  './img/Masaje Shiatsu.png',
  './img/Masaje de Refloxología.png',
  './img/Masaje anticelulitico.png',
  './img/Masaje relajante.png',
  './img/Imagen para galeria de triny 2.jpg',
  './img/Aviso de libro de reclamaciones.png'
];
const STATIC_PATHS = new Set(
  STATIC_ASSETS.map(asset => new URL(asset, self.registration.scope).pathname)
);
const INDEX_URL = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('[SW] No se pudieron guardar todos los recursos estáticos:', error);
        throw error;
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const isStaticAsset = STATIC_PATHS.has(requestUrl.pathname);
  if (!isStaticAsset && request.mode !== 'navigate') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cacheKey = new URL(request.url);
      cacheKey.search = '';
      const cached = await cache.match(cacheKey.href);

      if (cached && request.mode !== 'navigate') return cached;

      try {
        const response = await fetch(request);
        if (response.ok && isStaticAsset) {
          event.waitUntil(cache.put(cacheKey.href, response.clone()));
        }
        return response;
      } catch (error) {
        if (request.mode === 'navigate') {
          const offlinePage = await cache.match(INDEX_URL);
          if (offlinePage) return offlinePage;
        }
        if (cached) return cached;
        throw error;
      }
    })
  );
});
