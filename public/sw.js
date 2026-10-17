const CACHE_NAME = "medicare-shell-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icons.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Do not cache API calls or authenticated/patient data.
  if (url.pathname.startsWith("/auth/") || url.pathname.startsWith("/appointments") || url.pathname.startsWith("/doctors")) return;
  event.respondWith(
    fetch(request).then((response) => {
      if (response && response.ok && (request.mode === "navigate" || url.pathname.startsWith("/assets/"))) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match("/index.html")) || Response.error())
  );
});
