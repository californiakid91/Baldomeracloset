// Baldomera Closet: funciona sin conexión y se actualiza sola.
// Al publicar cambios, sube VERSION (y APP_VERSION en index.html).
const VERSION = "baldomera-v4";
const SHELL = ["./", "index.html", "manifest.json", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const propio = url.origin === location.origin;
  // Red primero, saltándose la caché del navegador, para recibir siempre la última versión.
  // Sin conexión, se usa la copia guardada.
  e.respondWith(
    fetch(propio ? new Request(req, { cache: "no-cache" }) : req).then(res => {
      if (res.ok && (propio || url.hostname.startsWith("fonts."))) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
