// Service worker del herbario: guarda la web en el móvil para que abra rápido y funcione sin conexión.
// Siempre intenta la red primero (para tener lo último) y usa la copia guardada si falla.
// Las peticiones a Supabase y a otros sitios no se tocan.
const CACHE = "herbario-v2";
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
    // «no-cache»: pregunta siempre a GitHub si hay versión nueva, en lugar de usar la copia del navegador
    // (GitHub Pages la da por buena 10 minutos y los cambios tardaban en verse).
    // (Una navegación no admite opciones: se pide por su dirección.)
    fetch(req.mode === "navigate" ? req.url : req, { cache: "no-cache" }).then((res) => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("./index.html")))
  );
});
