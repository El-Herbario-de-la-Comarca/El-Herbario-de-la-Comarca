// Service worker del herbario: guarda la web en el móvil para que abra rápido y funcione sin conexión.
// Siempre intenta la red primero (para tener lo último) y usa la copia guardada si falla.
// Las peticiones a Supabase y a otros sitios no se tocan.
const CACHE = "herbario-v1";
const BASICOS = ["./", "./index.html", "./estilos.css", "./tema-comarca.css", "./app.js", "./config.js",
  "./datos-iniciales.js", "./temporada.js", "./zonas.js", "./img/logo.png", "./img/icono-192.png", "./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("./index.html")))
  );
});
