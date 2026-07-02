const CACHE_NAME = 'cuspides-v120-cache';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './assets/hero-montage.mp4',
  './assets/hero-clip-1.mp4',
  './assets/identity-paper-mountains.webp',
  './assets/imag.1.webp',
  './assets/imag.2.webp',
  './assets/imag.3.webp',
  './assets/imag.4.webp',
  './assets/imag.5.webp',
  './assets/imag.6.webp',
  './assets/imag.7.webp',
  './assets/imag.8.webp',
  './assets/imag.9.webp',
  './assets/imag.10.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Cache-first para assets propios.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate suave para fuentes externas.
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
