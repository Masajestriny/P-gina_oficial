const CACHE_NAME = 'triny-masajes-v1.2.8';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/config.js',
  './js/data.js',
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
  './img/Imagen para carrousel 1.png',
  './img/Imagen para carrousel 2.png',
  './img/Imagen para carrousel 3.jpg',
  './img/imagen para carrousel 4.jpg',
  './img/Imagen para carrousel 5.png',
  './img/Imagen para carrousel 6.jfif',
  './img/Imagen para galeria de triny 1.jpg',
  './img/Imagen para galeria de triny 2.jpg',
  './img/Imagen para galeria de triny 3.jpg',
  './img/Imagen para galeria de triny 4.png',
  './img/Imagen para galeria de triny 5.png',
  './img/Imagen para galeria de triny 6.png',
  './img/Imagen para galeria de triny 7.png',
  './img/Imagen para galeria de triny 8.jpg',
  './img/Aviso de libro de reclamaciones.png'
];

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
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }))
      .catch(() => caches.match('./index.html'))
  );
});
