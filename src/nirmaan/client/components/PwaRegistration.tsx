'use client';

import { useEffect } from 'react';

/**
 * The product surface is now the legacy static frontend in `public/`, which
 * registers its own offline shell (`ns-sw.js`) from each of its pages.
 *
 * Registering the old `/sw.js` here would put a cache-first worker in front of
 * those pages, so this component registers the legacy shell worker instead.
 * `public/sw.js` is still shipped as a cleanup stub for browsers that already
 * installed the retired portal shell.
 */
export function PwaRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      return;
    }

    navigator.serviceWorker.register('/ns-sw.js').catch(() => undefined);
  }, []);

  return null;
}
