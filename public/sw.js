// SAHYAK CRM — Offline Application Shell Service Worker
// Version: v1.0.0

const CACHE_NAME = "sahyak-crm-shell-v1";

// Core application shell assets to pre-cache on install
const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install Event: Pre-cache core shell resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Clear outdated caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Safe Network-First for Pages (Navigation) and Cache-First for Static Assets
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Strategy 1: For HTML navigation requests, use Network-First with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Clone and store valid response in cache for offline use
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: try matching requested route from cache, or return cached root shell
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const rootFallback = await caches.match("/");
          if (rootFallback) {
            return rootFallback;
          }
          return new Response("SAHYAK CRM is currently offline. Please reconnect to access new content.", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        })
    );
    return;
  }

  // Strategy 2: For Next.js static assets & icons, use Stale-While-Revalidate
  if (
    request.url.includes("/_next/static/") ||
    request.url.includes("/icons/") ||
    request.url.includes("/favicon.ico") ||
    request.url.includes("manifest.webmanifest")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with fallback to cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
