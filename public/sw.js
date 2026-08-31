/* Mesin Es Kristal - Service Worker
   Strategy aman: cache-first hanya untuk aset statis (nama ber-hash/immutable).
   Navigasi (HTML) & permintaan lain selalu ambil dari jaringan agar konten segar.
*/

const CACHE_VERSION = "mesin-es-kristal-v1";

const STATIC_ASSET_EXTENSIONS = [
  ".css",
  ".js",
  ".woff",
  ".woff2",
  ".ttf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
  ".ico",
];

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      );
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const pathname = url.pathname;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) return;

  const isStatic = STATIC_ASSET_EXTENSIONS.some((ext) => pathname.endsWith(ext));

  if (!isStatic) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        throw error;
      }
    })()
  );
});