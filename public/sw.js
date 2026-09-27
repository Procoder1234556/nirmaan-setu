const CACHE = 'nirmaan-setu-shell-v2';
const SHELL = ['/field-log', '/projects', '/reviewer-queue', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/_next/') || url.pathname === '/sw.js') return;

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)
    .then((response) => {
      if (!response.ok) return response;
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    })
    .catch(() => caches.match('/field-log'))));
});
