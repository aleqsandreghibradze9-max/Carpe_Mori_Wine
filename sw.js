const CACHE = "sommelier-1773163031";
const ASSETS = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

// Install - cache all assets
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // activate immediately without waiting
});

// Activate - delete ALL old caches automatically
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // take control of all open tabs immediately
});

// Fetch - network first, fall back to cache
// This means users ALWAYS get the latest version if online
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Update cache with fresh response
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request)) // offline fallback
  );
});
