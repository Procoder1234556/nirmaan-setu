/**
 * Retired portal shell worker — cleanup only.
 *
 * The previous Next.js portal shell registered this file and cached
 * `/field-log`, `/projects` and `/reviewer-queue` with a cache-first strategy.
 * The product UI is now the legacy Nirmaan Setu static frontend in `public/`,
 * which ships its own offline shell (`ns-sw.js`).
 *
 * This file is intentionally kept (do not delete it): a service worker update
 * check that returns 404 leaves the old worker installed forever. Instead, it
 * now deletes the retired caches, unregisters itself and reloads open clients
 * once, so browsers that already installed the portal shell self-heal.
 */
const RETIRED_CACHE_PREFIXES = ['nirmaan-setu-shell-'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => RETIRED_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
          .map((key) => caches.delete(key)),
      );

      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url).catch(() => undefined);
      }
    })(),
  );
});

// While this worker is still in control, never serve anything from a cache.
self.addEventListener('fetch', () => {});
