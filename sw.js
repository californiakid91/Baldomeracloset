// Baldomera Closet: funciona sin conexión y se actualiza sola.
// Al publicar cambios, sube VERSION (y APP_VERSION en index.html).
const VERSION = "baldomera-v1";
const SHELL = ["./", "index.html", "manifest.json", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];
// Si la red tarda más que esto (señal floja en el mercadillo), se abre con la copia guardada.
const ESPERA_RED = 4000;

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

const esFuente = url => url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

function guardar(req, res) {
  const copia = res.clone();
  caches.open(VERSION).then(c => c.put(req, copia)).catch(() => {});
}

// Sin nada en caché: la navegación recibe la app; el resto, un error normal (no HTML disfrazado de CSS o fuente).
const deCache = req => caches.match(req, { ignoreSearch: true })
  .then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined));

// Red primero, saltándose la caché del navegador, para recibir siempre la última versión.
// Si la red falla o tarda demasiado, se usa la copia guardada; la respuesta de red, cuando llega, se guarda igualmente.
function redPrimero(req) {
  return new Promise(resolve => {
    let resuelto = false;
    const entregar = r => { if (!resuelto && r) { resuelto = true; resolve(r) } };
    const temporizador = setTimeout(() => deCache(req).then(entregar), ESPERA_RED);
    fetch(new Request(req, { cache: "no-cache" })).then(res => {
      if (res.ok) guardar(req, res);
      clearTimeout(temporizador);
      entregar(res);
    }).catch(() => {
      clearTimeout(temporizador);
      deCache(req).then(r => entregar(r || Response.error()));
    });
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) { e.respondWith(redPrimero(req)); return }
  if (esFuente(url)) {
    // Fuentes: caché primero (no cambian) y, si no están, red. La hoja de estilos de Google llega "opaque" y también se guarda.
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        if (res.ok || res.type === "opaque") guardar(req, res);
        return res;
      }))
    );
  }
});
