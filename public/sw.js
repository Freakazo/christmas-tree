// Disabled service worker caching. This worker simply takes immediate control so updates deploy quickly.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Always pass-through to network; no offline caching.
});
