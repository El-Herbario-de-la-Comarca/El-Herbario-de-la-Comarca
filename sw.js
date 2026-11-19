// Service worker del herbario: guarda la web en el móvil para que abra rápido y funcione sin conexión.
// Las páginas se piden siempre a la red primero (para tener lo último) y se usa la copia guardada si falla.
// Los archivos con versión (?v=…) y las fuentes salen directamente de la copia guardada.
// Las peticiones a Supabase y a otros sitios no se tocan.
const CACHE = "herbario-v4";
const BASICOS = ["./", "./index.html", "./estilos.css", "./tema-comarca.css", "./app.js", "./buscador.js", "./config.js",
  "./datos-iniciales.js", "./temporada.js", "./zonas.js", "./img/logo.png", "./img/icono-192.png", "./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Guarda una respuesta y borra las versiones anteriores del mismo archivo (otra «?v=…»), para que la
// copia no crezca sin fin.
function guardar(req, res) {
  const copia = res.clone();
  return caches.open(CACHE).then(async (c) => {
    await c.put(req, copia);
    const ruta = new URL(req.url).pathname;
    (await c.keys()).forEach((k) => { if (k.url !== req.url && new URL(k.url).pathname === ruta) c.delete(k); });
  });
}
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // Archivos con versión (app.js?v=…, estilos.css?v=…) y fuentes: con la misma dirección no cambian nunca
  // (cuando cambian, index.html pide otra «?v=»). Se sirven de la copia guardada sin preguntar a GitHub.
  if (req.mode !== "navigate" && (url.searchParams.has("v") || url.pathname.startsWith("/fuentes/"))) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => { if (res.ok) e.waitUntil(guardar(req, res)); return res; })));
    return;
  }
  // Copia de respaldo del catálogo: sale la guardada al instante y se pide la nueva para la próxima visita.
  if (url.pathname === "/datos-iniciales.js") {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => {
      const red = fetch(req, { cache: "no-cache" }).then((res) => { if (res.ok) e.waitUntil(guardar(req, res)); return res; });
      if (r) { e.waitUntil(red.catch(() => {})); return r; }
      return red;
    }));
    return;
  }
  e.respondWith(
    // «no-cache»: pregunta siempre a GitHub si hay versión nueva, en lugar de usar la copia del navegador
    // (GitHub Pages la da por buena 10 minutos y los cambios tardaban en verse).
    // (Una navegación no admite opciones: se pide por su dirección.)
    fetch(req.mode === "navigate" ? req.url : req, { cache: "no-cache" }).then((res) => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return res;
    }).catch(() => {
      // Sin conexión. Las páginas se buscan sin «?…»; los archivos, con su versión exacta, para no mezclar
      // un index.html nuevo con un app.js viejo (o al revés).
      if (req.mode === "navigate") return caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("./index.html"));
      return caches.match(req).then((r) => r || caches.match(req, { ignoreSearch: true }).then((v) => (v && !/\?v=/.test(req.url) ? v : Response.error())));
    })
  );
});
