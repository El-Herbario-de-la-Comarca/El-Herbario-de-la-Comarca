/* El herbario de la Comarca · lógica de la página
   Lee el catálogo de Supabase. Si no está configurado o no responde, usa la copia de respaldo (datos-iniciales.js).
   Roles: admin (edita todo y aprueba), editor (propone cambios), lector y visitantes (solo leen). */

/* ---------- Aviso de mayoría de edad (va primero para que funcione aunque falle otra parte) ---------- */
(function () {
  var gate = document.getElementById("gate");
  function close() { gate.hidden = true; gate.style.display = "none"; }
  var ok = false;
  try { ok = localStorage.getItem("cazoleta-18") === "1"; } catch (e) {}
  // Quien vuelve desde el enlace de acceso ya pasó el aviso antes de pedirlo
  if (ok || /access_token|code=/.test(location.hash + location.search)) close();
  document.getElementById("gate-yes").addEventListener("click", function () {
    close();
    try { localStorage.setItem("cazoleta-18", "1"); } catch (e) {}
  });
  document.getElementById("gate-no").addEventListener("click", function () {
    document.getElementById("gate-title").textContent = "Gracias por tu visita";
    document.getElementById("gate-text").textContent = "Esta página solo está disponible para mayores de 18 años.";
    document.getElementById("gate-acts").hidden = true;
  });
})();

// Mezcla (se guarda en la columna "tipo") y hojas que lleva.
const TIPOS = {
  "Inglesa": "#2F3E4E", "Balcánica": "#4A3B5C", "Oriental": "#8C5A3C", "Virginia": "#B8862B", "Virginia-Perique": "#7A5A1E", "Burley": "#6B4A2F",
  "Lakeland": "#3F6E5A", "Aromática": "#7B2D4B", "Sin mezclar": "#5B6B73"
};
const ESTILOS = Object.keys(TIPOS);
const HOJAS = ["Virginia", "Burley", "Oriental", "Latakia", "Perique", "Kentucky", "Cavendish", "Cigarro"];
const FUERZA = ["Sin datos", "Muy suave", "Suave", "Media", "Fuerte", "Muy fuerte"];   // antigua fuerza de la ficha (propuestas viejas)
/* Características que se valoran en cada reseña (0 = sin indicar) */
const CARACT = [
  { k: "fuerza", col: "fuerza", label: "Fuerza", ops: ["", "Muy suave", "Suave", "Suave a media", "Media", "Media a fuerte", "Fuerte", "Muy fuerte"] },
  { k: "sabor", col: "sabor", label: "Intensidad de sabor", ops: ["", "Muy suave", "Suave", "Suave a media", "Media", "Media a intensa", "Intensa", "Muy intensa"] },
  { k: "aroma", col: "aromatizante", label: "Aromatizante", ops: ["", "Ninguno", "Muy ligero", "Ligero", "Medio", "Fuerte", "Muy fuerte"] },
  { k: "hab", col: "nota_hab", label: "Nota de habitación", ops: ["", "Imperceptible", "Desagradable", "Tolerable", "Agradable", "Muy agradable"] }
];
const VALORACION = ["", "1 · Malo", "2 · Flojo", "3 · Correcto", "4 · Muy bueno", "5 · Excelente"];
const CAMPOS = [["nombre", "Nombre"], ["marca", "Marca"], ["tipo", "Mezcla"], ["hojas", "Hojas"], ["corte", "Corte"],
  ["pais", "País"], ["formato", "Formato"], ["notas", "Notas"], ["descripcion", "Descripción"], ["en_espana", "Distintivo España (E)"]];

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const paras = (t) => String(t).split(/\n{2,}/).filter((p) => p.trim()).map((p) => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
const str = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const fecha = (t) => { try { return new Date(t).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; } };

/* ---------- Conexión ---------- */
const CFG = window.HERBARIO_CONFIG || {};
const CONFIGURADO = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase && window.supabase.createClient);
const sb = CONFIGURADO ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
const ctx = { online: false, session: null, email: "", uid: "", rol: "anonimo", pendientes: 0, misPendientes: 0,
  perfil: { nombre: "", avatar: "" }, perfilOk: false };
const esAdmin = () => ctx.online && ctx.rol === "admin";
const esEditor = () => ctx.online && (ctx.rol === "admin" || ctx.rol === "editor");

/* ---------- Estado ---------- */
let current = [];   // fichas
let opiniones = {};   // tabaco_id -> [{ id, autor, firma, score, texto, creado, actualizado }]
let fotosAutores = {};
let sociosAutores = new Set(); // autores que son socios del club (23_socios_del_club.sql)
const SELLO_SOCIO = '<img class="sello-socio" src="img/logo.png" alt="Socio del Pipa Club Fumadas Hobbit" title="Socio del Pipa Club Fumadas Hobbit" width="18" height="18">'; // autor -> URL de su foto de perfil (14_fotos_en_resenas.sql)
let bodega = {};      // tabaco_id -> { tengo, probado, quiero } (solo la del usuario que ha entrado)
let openId = null, lastFocus = null;

function mapItem(r) {
  const notas = Array.isArray(r.notas) ? r.notas.filter((n) => typeof n === "string" && n.trim()).map((n) => n.trim().slice(0, 40)).slice(0, 12) : [];
  const f = Number(r.fuerza);
  const hojas = Array.isArray(r.hojas) ? HOJAS.filter((h) => r.hojas.includes(h)) : [];
  return {
    id: String(r.id), nombre: str(r.nombre, 120), marca: str(r.marca, 80), tipo: str(r.tipo, 40), corte: str(r.corte, 40),
    pais: str(r.pais, 60), formato: str(r.formato, 80), desc: str(r.descripcion, 2000),
    fuerza: Number.isInteger(f) && f >= 1 && f <= 5 ? f : 0, notas, hojas, foto: str(r.foto, 500),
    espana: r.en_espana === true,
    video: typeof r.video_id === "string" && /^[A-Za-z0-9_-]{11}$/.test(r.video_id) ? r.video_id : ""
  };
}
function mapOpinion(r) {
  const score = Number.isInteger(r.puntuacion) && r.puntuacion >= 1 && r.puntuacion <= 5 ? r.puntuacion : 0;
  const o = { id: r.id, autor: String(r.autor || ""), firma: str(r.firma, 40), score, texto: str(r.texto, 5000),
    creado: r.creado, actualizado: r.actualizado };
  CARACT.forEach((c) => { const v = Number(r[c.col]); o[c.k] = Number.isInteger(v) && v > 0 && v < c.ops.length ? v : 0; });
  return o;
}
const findItem = (id) => current.find((d) => d.id === String(id));
const opinionesDe = (id) => opiniones[String(id)] || [];
/* Media y número de reseñas de un tabaco */
function statsDe(id) {
  const l = opinionesDe(id).filter((o) => o.score);
  const n = l.length;
  return { n, media: n ? l.reduce((a, o) => a + o.score, 0) / n : 0 };
}
const fmtMedia = (m) => m.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function ytId(raw) {
  let url;
  try { url = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); } catch (e) { return ""; }
  const h = url.hostname.replace(/^(www\.|m\.)/, "");
  let id = "";
  if (h === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (h === "youtube.com" || h === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
    else { const m = url.pathname.match(/^\/(shorts|embed|live)\/([^/?]+)/); if (m) id = m[2]; }
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
}
function fotoSegura(u) { return /^(https:\/\/|img\/)/.test(u || "") ? u : ""; }

/* ---------- Carga de datos ---------- */
async function cargarTodo() { if (await cargarTabacos()) await cargarExtras(); }
// Primero las fichas (con sus fotos), para pintar el catálogo cuanto antes. Devuelve false si falla.
async function cargarTabacos() {
  if (!sb) { usarRespaldo(); return false; }
  try {
    const filas = [];
    for (let desde = 0; ; desde += 1000) {
      const { data, error } = await sb.from("tabacos").select("*").order("nombre").range(desde, desde + 999);
      if (error) throw error;
      filas.push(...data);
      if (data.length < 1000) break;
    }
    current = filas.map(mapItem).filter((d) => d.nombre);
    ctx.espanaOk = filas.length > 0 && "en_espana" in filas[0];   // 16_se_vende_en_espana.sql
    ctx.online = true;
    return true;
  } catch (e) {
    console.error(e);
    usarRespaldo("No se ha podido conectar con la base de datos. Mostrando la copia de respaldo.");
    return false;
  }
}
// Después, todo lo demás a la vez: reseñas, fotos y socios de las reseñas, y Mi bodega.
async function cargarExtras() {
  await Promise.all([cargarOpiniones(), cargarFotosAutores(), cargarSocios(), cargarBodega()]);
}
async function cargarOpiniones() {
  {
    // Reseñas de usuarios. Si aún no se ha ejecutado 07_resenas_usuarios.sql, la web sigue sin ellas.
    opiniones = {};
    try {
      for (let desde = 0; ; desde += 1000) {
        const { data, error } = await sb.from("opiniones").select("*").order("creado", { ascending: false }).range(desde, desde + 999);
        if (error) throw error;
        data.forEach((x) => { const k = String(x.tabaco_id); (opiniones[k] = opiniones[k] || []).push(mapOpinion(x)); });
        if (data.length < 1000) break;
      }
      ctx.opiniones = true;
    } catch (e) { console.warn("Reseñas no disponibles", e); ctx.opiniones = false; }
  }
}
async function cargarFotosAutores() {
    fotosAutores = {};
    try {
      const { data, error } = await sb.rpc("fotos_resenas");
      if (error) throw error;
      (data || []).forEach((x) => { const u = fotoSegura(x.avatar); if (u) fotosAutores[String(x.autor)] = u; });
    } catch (e) { console.warn("Fotos de las reseñas no disponibles", e); }
}
async function cargarSocios() {
    sociosAutores = new Set();
    try {
      const { data, error } = await sb.rpc("socios_resenas");
      if (error) throw error;
      (data || []).forEach((x) => sociosAutores.add(String(x.autor)));
    } catch (e) { console.warn("Socios no disponibles (falta 23_socios_del_club.sql)", e); }
}
function usarRespaldo(aviso) {
  ctx.online = false;
  current = (window.DATOS_INICIALES || []).map(mapItem).filter((d) => d.nombre);
  opiniones = {}; bodega = {}; ctx.bodega = false;
  ctx.aviso = aviso || "";
}
async function refrescar() {
  const pintar = () => {
    fillFilters(); render(); paintTop();
    if (!$("overlay").hidden && openId != null) {
      if (!findItem(openId)) closeDetail(); else { paintArt(); paintMeta(); paintBodega(); paintTools(); paintVideo(); paintResenas(); }
    }
  };
  const ok = await cargarTabacos();
  pintar();                       // el catálogo y sus fotos ya se ven
  if (ok) { await cargarExtras(); pintar(); }   // reseñas, medias, socios y Mi bodega
}

/* ---------- Ilustración y piezas ---------- */
function tin(d) {
  const c = TIPOS[d.tipo] || "#5A5548";
  const m = esc(d.nombre.trim().charAt(0).toUpperCase());
  return `<svg viewBox="0 0 200 170" role="img" aria-label="Lata de ${esc(d.nombre)}">
    <ellipse cx="100" cy="152" rx="76" ry="10" fill="#000" opacity=".16"/>
    <rect x="28" y="52" width="144" height="92" fill="${c}"/>
    <ellipse cx="100" cy="144" rx="72" ry="14" fill="${c}"/>
    <rect x="28" y="52" width="144" height="92" fill="#000" opacity=".12"/>
    <rect x="42" y="54" width="10" height="88" fill="#fff" opacity=".14"/>
    <rect x="28" y="82" width="144" height="40" fill="#15130F" opacity=".88"/>
    <rect x="28" y="86" width="144" height="1.5" fill="#D9B45A"/>
    <rect x="28" y="116.5" width="144" height="1.5" fill="#D9B45A"/>
    <text x="100" y="112" text-anchor="middle" font-family="Young Serif, Georgia, serif" font-size="32" fill="#F2E9D0">${m}</text>
    <ellipse cx="100" cy="52" rx="72" ry="14" fill="${c}"/>
    <ellipse cx="100" cy="52" rx="72" ry="14" fill="#fff" opacity=".28"/>
    <ellipse cx="100" cy="52" rx="62" ry="10" fill="none" stroke="#000" stroke-opacity=".18"/>
  </svg>`;
}
/* Fotos: cada foto subida tiene una miniatura al lado (mismo nombre acabado en «-m.jpg»).
   La miniatura se usa en las vistas pequeñas y la grande solo en la ficha abierta.
   Si una foto antigua no tiene miniatura, el navegador carga la grande (ver «error» más abajo). */
function miniDe(url) {
  return /\/storage\/v1\/object\/public\/fotos\/.+-\d+\.(jpe?g|png|webp)$/i.test(url || "") ? url.replace(/\.(jpe?g|png|webp)$/i, "-m.jpg") : "";
}
function art(d, grande) {
  const src = fotoSegura(d.foto);
  if (!src) return tin(d);
  const mini = grande ? "" : miniDe(src);
  return `<img class="photo" src="${esc(mini || src)}"${mini ? ` data-grande="${esc(src)}"` : ""} alt="Lata de ${esc(d.nombre)}" loading="lazy" decoding="async">`;
}
document.addEventListener("error", (e) => {
  const img = e.target;
  if (img && img.tagName === "IMG" && img.dataset && img.dataset.grande) { const g = img.dataset.grande; delete img.dataset.grande; img.src = g; }
}, true);
function pips(n) { let h = '<span class="pips" aria-hidden="true">'; for (let i = 1; i <= 5; i++) h += `<i class="${i <= n ? "on" : ""}"></i>`; return h + "</span>"; }

/* ---------- Catálogo ---------- */
const POR_PAGINA = 20;
const state = { q: "", marca: "", tipo: "", hoja: "", corte: "", pais: "", sort: "nombre", page: 1 };
const FILTERS = [["f-marca", "marca", "Todas"], ["f-corte", "corte", "Todos"], ["f-pais", "pais", "Todos"]];
function fillSelect(id, label, values) {
  $(id).innerHTML = `<option value="">${label}</option>` + values.map((v) => `<option value="${esc(v.value)}">${esc(v.text)}</option>`).join("");
}
function fillFilters() {
  FILTERS.forEach(([id, key, label]) => {
    const vals = [...new Set(current.map((d) => d[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    fillSelect(id, label, vals.map((v) => ({ value: v, text: v })));
    $(id).value = state[key];
    if ($(id).value !== state[key]) state[key] = $(id).value;
  });
  const orden = (lista, k) => lista.filter((v) => current.some((d) => (k === "hojas" ? d.hojas.includes(v) : d[k] === v)));
  fillSelect("f-tipo", "Todos", orden(ESTILOS, "tipo").map((v) => ({ value: v, text: v })));
  $("f-tipo").value = state.tipo; if ($("f-tipo").value !== state.tipo) state.tipo = $("f-tipo").value;
  fillSelect("f-hoja", "Cualquiera", orden(HOJAS, "hojas").map((v) => ({ value: v, text: v })));
  $("f-hoja").value = state.hoja; if ($("f-hoja").value !== state.hoja) state.hoja = $("f-hoja").value;
}
function setupFilters() {
  $("q").addEventListener("input", (e) => { state.q = e.target.value; state.page = 1; render(); });
  [["f-marca", "marca"], ["f-tipo", "tipo"], ["f-hoja", "hoja"], ["f-corte", "corte"], ["f-pais", "pais"], ["sort", "sort"]].forEach(([id, k]) => {
    $(id).addEventListener("change", (e) => { state[k] = e.target.value; state.page = 1; render(); });
  });
  $("reset").addEventListener("click", () => {
    Object.assign(state, { q: "", marca: "", tipo: "", hoja: "", corte: "", pais: "", sort: "nombre", page: 1 });
    $("q").value = ""; ["f-marca", "f-tipo", "f-hoja", "f-corte", "f-pais"].forEach((id) => ($(id).value = "")); $("sort").value = "nombre";
    render();
  });
}
function render() {
  const q = norm(state.q.trim());
  const byName = (a, b) => a.nombre.localeCompare(b.nombre, "es");
  const score = (d) => statsDe(d.id).media;
  const list = current.filter((d) => {
    if (state.marca && d.marca !== state.marca) return false;
    if (state.tipo && d.tipo !== state.tipo) return false;
    if (state.hoja && !d.hojas.includes(state.hoja)) return false;
    if (state.corte && d.corte !== state.corte) return false;
    if (state.pais && d.pais !== state.pais) return false;
    if (q) {
      const hay = norm([d.nombre, d.marca, d.tipo, d.hojas.join(" "), d.corte, d.pais, d.notas.join(" "), d.desc].join(" "));
      return q.split(/\s+/).every((w) => hay.includes(w));
    }
    return true;
  });
  list.sort((a, b) =>
    state.sort === "marca" ? a.marca.localeCompare(b.marca, "es") || byName(a, b)
    : state.sort === "puntuacion" ? score(b) - score(a) || byName(a, b)
    : byName(a, b));
  const paginas = Math.max(1, Math.ceil(list.length / POR_PAGINA));
  state.page = Math.min(Math.max(1, state.page), paginas);
  const desde = (state.page - 1) * POR_PAGINA;
  const visibles = list.slice(desde, desde + POR_PAGINA);
  $("count").textContent = (list.length === 1 ? "1 tabaco" : `${list.length} tabacos`) +
    (paginas > 1 ? ` · mostrando ${desde + 1}–${desde + visibles.length}` : "");
  pintarPaginador(paginas);
  $("grid").innerHTML = list.length ? visibles.map((d) => {
    const st = statsDe(d.id);
    const rate = st.n ? `${fmtMedia(st.media)} de 5 · ${st.n} ${st.n === 1 ? "reseña" : "reseñas"}` : "Sin reseñas todavía";
    return `
    <button class="card" type="button" data-id="${esc(d.id)}" aria-label="Ver ficha de ${esc(d.nombre)}">
      <div class="art">${art(d)}</div>
      <div class="body">
        <span class="brandname">${esc(d.marca)}</span>
        <h2>${esc(d.nombre)}</h2>
        <div class="meta">${d.tipo ? `<span class="chip">${esc(d.tipo)}</span>` : ""}${d.corte ? `<span class="chip">${esc(d.corte)}</span>` : ""}${d.video ? '<span class="chip">Vídeo</span>' : ""}${d.espana ? '<span class="es-badge es-lista" role="img" aria-label="Se encuentra en España" title="España">E</span>' : ""}</div>
        ${st.n ? `<div class="str">${pips(Math.round(st.media))}<span>${rate}</span></div>` : `<span class="rate none">${rate}</span>`}
        <p>${esc(d.desc)}</p>
      </div>
    </button>`;
  }).join("") : `<p class="empty">Ningún tabaco coincide con la búsqueda. Prueba con menos filtros.</p>`;
}

/* Paginador: 20 tabacos por página */
function numerosPagina(actual, total) {
  const set = new Set([1, total, actual - 1, actual, actual + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push("…"); out.push(n); });
  return out;
}
function pintarPaginador(paginas) {
  const nav = $("pager");
  if (paginas <= 1) { nav.hidden = true; nav.innerHTML = ""; return; }
  nav.hidden = false;
  const p = state.page;
  nav.innerHTML =
    `<button class="btn" type="button" data-page="${p - 1}"${p === 1 ? " disabled" : ""}>‹<span class="txt"> Anterior</span></button>` +
    numerosPagina(p, paginas).map((n) => n === "…"
      ? '<span class="gap" aria-hidden="true">…</span>'
      : `<button class="btn${n === p ? " primary" : ""}" type="button" data-page="${n}"${n === p ? ' aria-current="page"' : ""} aria-label="Página ${n}">${n}</button>`).join("") +
    `<button class="btn" type="button" data-page="${p + 1}"${p === paginas ? " disabled" : ""}><span class="txt">Siguiente </span>›</button>`;
}
function irAPagina(n) {
  state.page = n; render();
  const top = $("grid").getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - 8;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

/* ---------- Ficha de detalle ---------- */
/* Media de las reseñas en grande, junto al nombre de la ficha */
function notaGrande(d) {
  const st = statsDe(d.id);
  if (!st.n) return "";
  return `<div class="nota" aria-label="Media de las reseñas: ${fmtMedia(st.media)} de 5, ${st.n} ${st.n === 1 ? "reseña" : "reseñas"}">
      <span class="nota-n" aria-hidden="true">${fmtMedia(st.media)}<small>/5</small></span>
      ${pips(Math.round(st.media))}
      <span class="nota-l" aria-hidden="true">${st.n} ${st.n === 1 ? "reseña" : "reseñas"}</span>
    </div>`;
}
/* Lo que dicen las reseñas de fuerza, sabor, aromatizante y nota de habitación (como Tobacco Reviews) */
function resumenCaract(d) {
  const l = opinionesDe(d.id);
  const filas = CARACT.map((c) => {
    const votos = l.map((o) => o[c.k]).filter(Boolean);
    if (!votos.length) return "";
    const cuenta = c.ops.map((_, i) => votos.filter((v) => v === i).length);
    const max = Math.max(...cuenta);
    const top = cuenta.indexOf(max);
    const barras = c.ops.map((op, i) => i && cuenta[i] ? `<li><span class="op">${esc(op)}</span><span class="barra"><i style="width:${Math.round(cuenta[i] / votos.length * 100)}%"></i></span><span class="n">${cuenta[i]}</span></li>` : "").join("");
    return `<div class="car"><div class="car-h"><span class="car-l">${esc(c.label)}</span><strong>${esc(c.ops[top])}</strong></div><ul>${barras}</ul></div>`;
  }).join("");
  return filas ? `<div class="caract"><h3>Según las reseñas</h3>${filas}</div>` : "";
}
/* Iconos de línea de la ficha (se pintan con el color del texto que los rodea) */
const ICO = {
  mezcla: '<path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z"/><path d="M12 9v9"/>',
  corte: '<path d="M4 7h16M4 11h16M4 15h16M4 19h16"/>',
  origen: '<path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  formato: '<ellipse cx="12" cy="7" rx="7" ry="2.5"/><path d="M5 7v10c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V7"/>',
  compartir: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  tengo: '<rect x="6" y="7" width="12" height="13" rx="2"/><path d="M8 7V5h8v2"/><path d="M9.5 13.5l2 2 3.5-4"/>',
  probado: '<path d="M3 14h9a3 3 0 0 0 3-3V8h4v3a7 7 0 0 1-7 7H6a3 3 0 0 1-3-3z"/><path d="M17 5c0-1 1-1.5 1-2.5"/>',
  quiero: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  hoja: '<path d="M12 20C12 13 7 10 4 9c3-2 7 0 8 4 1-4 5-6 8-4-3 1-8 4-8 11z"/>',
};
const ico = (k) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICO[k]}</svg>`;
const HOJA_CLASE = { Virginia: "virginia", Burley: "burley", Oriental: "oriental", Latakia: "latakia", Perique: "perique", Kentucky: "kentucky", Cavendish: "cavendish", Cigarro: "cigarro" };
const FRANJA = `<svg viewBox="0 0 1040 120" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false">
  <path class="fr-a" d="M0 78C120 40 240 36 360 62c110 24 200-8 330-18 130-10 240 16 350 8v68H0z"/>
  <path class="fr-b" d="M0 98c140-28 300-32 430-14 130 18 270-10 410-12 90-1 150 10 200 14v34H0z"/>
  <path class="fr-m" d="M720 74c40-44 150-48 200 0z"/>
  <circle class="fr-ring" cx="820" cy="84" r="22"/><circle class="fr-door" cx="820" cy="84" r="18"/><circle class="fr-knob" cx="828" cy="86" r="2.4"/>
  <circle class="fr-ring" cx="775" cy="80" r="7"/><circle class="fr-glass" cx="775" cy="80" r="5"/>
  <circle class="fr-ring" cx="865" cy="80" r="7"/><circle class="fr-glass" cx="865" cy="80" r="5"/>
  <g class="fr-f1"><circle cx="520" cy="104" r="2.6"/><circle cx="660" cy="96" r="2.6"/><circle cx="975" cy="98" r="2.6"/></g>
  <g class="fr-f2"><circle cx="534" cy="107" r="2.2"/><circle cx="675" cy="100" r="2.2"/><circle cx="960" cy="102" r="2.2"/></g>
</svg>`;
function metaHTML(d) {
  const st = statsDe(d.id);
  const sinResenas = !st.n
    ? `<p class="d-rate"><span class="d-pips" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>Sin reseñas todavía${ctx.online && ctx.opiniones ? ' · <button class="link" type="button" data-ir="resenas">escribe la primera</button>' : ""}</p>`
    : "";
  const casilla = (k, t, v) => v ? `<div class="d-dato">${ico(k)}<span class="d-dato-l">${t}</span><span class="d-dato-v">${esc(v)}</span></div>` : "";
  const datos = casilla("mezcla", "Mezcla", d.tipo) + casilla("corte", "Corte", d.corte) + casilla("origen", "Origen", d.pais) + casilla("formato", "Formato", d.formato);
  return `
      <div class="d-head">
        <div class="d-title">
          <span class="brandname">${esc(d.marca)}${d.pais ? ` · ${esc(d.pais)}` : ""}</span>
          <h2 id="d-name">${esc(d.nombre)}${d.espana ? ' <span class="es-badge" role="img" aria-label="España">E</span>' : ""}</h2>
          ${sinResenas}
        </div>
        ${notaGrande(d)}
      </div>
      ${datos ? `<div class="d-datos">${datos}</div>` : ""}
      ${d.hojas.length || d.notas.length ? `<dl class="d-chips">
        ${d.hojas.length ? `<dt>Hojas</dt><dd>${d.hojas.map((h) => `<span class="chip hoja h-${HOJA_CLASE[h] || "otra"}">${esc(h)}</span>`).join("")}</dd>` : ""}
        ${d.notas.length ? `<dt>Notas de sabor</dt><dd>${d.notas.map((n) => `<span class="chip sabor">${esc(n)}</span>`).join("")}</dd>` : ""}
      </dl>` : ""}
      ${d.desc ? `<hr class="d-sep"><p class="d-desc">${esc(d.desc)}</p>` : ""}
      ${resumenCaract(d)}
      ${!d.notas.length && esEditor() ? '<p class="muted">Ficha básica: faltan las notas de sabor.</p>' : ""}`;
}
/* Otras fichas de la misma marca: primero las que comparten la primera palabra (la «serie») */
function masDeLaMarca(d) {
  const otras = current.filter((x) => x.marca === d.marca && x.id !== d.id);
  if (!otras.length) return null;
  const pal = (n) => norm(n).split(/[\s.,·\-–]+/)[0];
  const serie = pal(d.nombre);
  const deSerie = serie.length > 2 ? otras.filter((x) => pal(x.nombre) === serie) : [];
  const lista = (deSerie.length ? deSerie : otras).slice(0, 4);
  const titulo = deSerie.length ? `Más de la serie ${d.nombre.split(/\s+/)[0]}` : `Más de ${d.marca}`;
  return { titulo, lista };
}
function abrirPanel(html, clase) {
  if ($("overlay").hidden) lastFocus = document.activeElement;
  $("overlay").hidden = false;
  $("panel").className = "panel" + (clase ? " " + clase : "");
  $("panel").innerHTML = html;
}
/* ---------- Enlace propio de cada ficha: #/ficha/<id>/<nombre> ----------
   Va tras la almohadilla para que GitHub Pages sirva siempre index.html. El id es lo que cuenta;
   el nombre solo hace el enlace legible. */
const TITULO = document.title;
const slug = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const hashFicha = (d) => `#/ficha/${encodeURIComponent(d.id)}/${slug(d.nombre)}`;
function idDeHash() {
  const m = location.hash.match(/^#\/ficha\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
function ponerUrlFicha(d) {
  const h = hashFicha(d);
  if (location.hash === h) return;
  // Si ya había una ficha en la URL se sustituye, para que Atrás siempre vuelva al listado.
  if (idDeHash()) history.replaceState(history.state, "", h);
  else history.pushState({ ficha: true }, "", h);
}
function quitarUrlFicha() {
  if (!idDeHash()) return;
  // Si la ficha se abrió desde el listado, se vuelve atrás; si se entró por un enlace, se limpia la URL.
  if (history.state && history.state.ficha) history.back();
  else history.replaceState(null, "", location.pathname + location.search);
}
function abrirFichaDeUrl() {
  const id = idDeHash();
  if (id && String(openId) !== id && findItem(id)) openDetail(id, true);
}
window.addEventListener("popstate", () => {
  if (idDeHash()) abrirFichaDeUrl();
  else if (!$("overlay").hidden) closeDetail(true);
});

/* ---------- Compartir una ficha ----------
   Cada ficha tiene una página pequeña en f/<id>.html (la genera herramientas/generar_tarjetas.py cada día)
   con su nombre y su foto, para que WhatsApp y Telegram muestren una tarjeta. Si la ficha es de hoy
   y aún no tiene la suya, se comparte el enlace normal. */
let tarjetas = null;   // ids con página propia (f/lista.json)
async function enlaceFicha(d) {
  const base = location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "");
  if (tarjetas === null) {
    try { const r = await fetch("f/lista.json", { cache: "no-cache" }); tarjetas = new Set(r.ok ? await r.json() : []); }
    catch (e) { tarjetas = new Set(); }
  }
  return tarjetas.has(String(d.id)) ? `${base}f/${encodeURIComponent(d.id)}.html` : `${base}index.html#/ficha/${encodeURIComponent(d.id)}`;
}
async function compartirFicha(d) {
  const url = await enlaceFicha(d), msg = $("d-share-msg");
  const titulo = `${d.nombre} · ${d.marca}`;
  if (navigator.share) {
    try { await navigator.share({ title: titulo, text: `${titulo} en El herbario de la Comarca`, url }); return; }
    catch (e) { if (e && e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(url); if (msg) msg.textContent = "Enlace copiado. Pégalo en WhatsApp o Telegram."; }
  catch (e) { if (msg) msg.textContent = url; }
}
function openDetail(id, desdeUrl) {
  const d = findItem(id); if (!d) return;
  openId = d.id;
  if (!desdeUrl) ponerUrlFicha(d);
  document.title = `${d.nombre} · ${TITULO}`;
  const mas = masDeLaMarca(d);
  abrirPanel(`
    <div class="d-franja">${FRANJA}</div>
    <nav class="d-ruta" aria-label="Ruta">
      <button class="link" type="button" id="d-r-cat">Catálogo</button><span aria-hidden="true">›</span>
      <button class="link" type="button" id="d-r-marca">${esc(d.marca)}</button><span aria-hidden="true">›</span>
      <span class="d-r-yo">${esc(d.nombre)}</span>
    </nav>
    <button class="x-close" id="d-close" type="button" aria-label="Cerrar ficha" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
    <div class="d-lado">
      <div class="nicho"><div class="art" id="d-art">${art(d, true)}</div><div class="balda" aria-hidden="true"></div></div>
      <div id="d-bodega"></div>
      <div class="compartir"><button class="btn" id="d-share" type="button">${ico("compartir")}Compartir ficha</button><span class="muted" id="d-share-msg" role="status"></span></div>
    </div>
    <div class="info">
      <div id="d-meta"></div>
      <div id="d-tools"></div>
    </div>
    <div class="d-orn" aria-hidden="true"><span></span>${ico("hoja")}<span></span></div>
    <div class="sections">
      <section class="sec" id="d-video" aria-labelledby="vd-h" hidden></section>
      <section class="sec sec-resenas" id="d-resenas" aria-labelledby="rv-h">
        <h3 id="rv-h">Reseñas</h3>
        <div id="rv-medias"></div>
        <div id="rv-mine"></div>
        <div class="reviews" id="rv-list"></div>
      </section>
      ${mas ? `<section class="sec sec-mas" aria-labelledby="mas-h">
        <h3 id="mas-h">${esc(mas.titulo)}</h3>
        <div class="mas-lista">${mas.lista.map((x) => `<button class="mas-item" type="button" data-ficha="${esc(x.id)}"><span class="mas-art">${art(x)}</span><span class="mas-nom">${esc(x.nombre)}</span></button>`).join("")}</div>
      </section>` : ""}
    </div>`, "ficha");
  $("d-close").addEventListener("click", () => closeDetail());
  $("d-share").addEventListener("click", () => compartirFicha(d));
  $("d-r-cat").addEventListener("click", () => closeDetail());
  $("d-r-marca").addEventListener("click", () => verMarca(d.marca));
  $("panel").querySelectorAll("[data-ficha]").forEach((b) => b.addEventListener("click", () => { openDetail(b.dataset.ficha); $("overlay").scrollTop = 0; }));
  $("d-close").focus();
  paintMeta(); paintBodega(); paintTools(); paintVideo(); paintResenas();
}
/* Desde la ruta de la ficha: cierra y deja el catálogo filtrado por esa marca */
function verMarca(marca) {
  closeDetail();
  state.marca = marca; state.page = 1;
  if ($("f-marca")) $("f-marca").value = marca;
  render();
  const g = $("grid");
  if (g) window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - 8), behavior: "smooth" });
}
function closeDetail(desdeUrl) {
  $("overlay").hidden = true; openId = null;
  document.title = TITULO;
  if (!desdeUrl) quitarUrlFicha();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function paintArt() { const d = findItem(openId), el = $("d-art"); if (d && el) el.innerHTML = art(d, true); }
function paintMeta() {
  const d = findItem(openId), el = $("d-meta"); if (!d || !el) return;
  el.innerHTML = metaHTML(d);
  el.querySelectorAll("[data-ir]").forEach((b) => b.addEventListener("click", () => {
    const sec = $("d-resenas"); if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    const nuevo = $("rv-new"); if (nuevo) nuevo.focus({ preventScroll: true });
  }));
}

/* Botones de la ficha según el rol */
function paintTools() {
  const box = $("d-tools"); if (!box || openId == null) return;
  const d = findItem(openId);
  if (esEditor()) {
    const admin = esAdmin();
    box.innerHTML = `<div class="btns">
        <button class="btn" id="ed-open" type="button">Editar ficha</button>
        <button class="btn" id="ph-pick" type="button">${d.foto ? "Cambiar foto" : "Subir foto"}</button>
        ${d.foto ? '<button class="btn danger" id="ph-del" type="button">Quitar foto</button>' : ""}
        ${admin ? '<button class="btn danger" id="fi-del" type="button">Eliminar ficha</button>' : ""}
      </div>
      <input id="ph-file" type="file" accept="image/jpeg,image/png,image/webp" hidden>
      <p class="msg" id="ph-msg" role="alert"></p>`;
    $("ed-open").addEventListener("click", () => openEditor(openId));
    if (admin) $("fi-del").addEventListener("click", () => askDelete(openId));
    const del = $("ph-del");
    if (del) del.addEventListener("click", async () => {
      if (!del.dataset.sure) { del.dataset.sure = "1"; del.textContent = "Pulsa otra vez para quitarla"; return; }
      const prev = d.foto;
      const { error } = await sb.from("tabacos").update({ foto: "" }).eq("id", d.id);
      if (error) { $("ph-msg").textContent = "No se ha podido quitar la foto."; return; }
      if (admin) await borrarFotoDeAlmacen(prev);   // el editor no borra archivos: así se puede deshacer
      refrescar();
    });
  } else { box.innerHTML = ""; return; }
  $("ph-pick").addEventListener("click", () => $("ph-file").click());
  $("ph-file").addEventListener("change", (e) => { const f = e.target.files && e.target.files[0]; if (f) subirFoto(f); });
}

/* ---------- Fotos ---------- */
async function shrink(file, lado = 1200, calidad = 0.86) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, lado / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(bmp, 0, 0, c.width, c.height);
    const b = await new Promise((r) => c.toBlob(r, "image/jpeg", calidad));
    return b || file;
  } catch (e) { return file; }
}
function rutaEnAlmacen(url) {
  const marca = "/storage/v1/object/public/fotos/";
  const i = (url || "").indexOf(marca);
  return i >= 0 && url.startsWith(CFG.supabaseUrl) ? decodeURIComponent(url.slice(i + marca.length)) : "";
}
async function borrarFotoDeAlmacen(url) {
  const ruta = rutaEnAlmacen(url);
  if (!ruta) return;
  const mini = rutaEnAlmacen(miniDe(url));
  try { await sb.storage.from("fotos").remove(mini ? [ruta, mini] : [ruta]); } catch (e) {}
}
async function subirFoto(file) {
  const msg = $("ph-msg"), id = openId, d = findItem(id);
  if (file.size > 20 * 1024 * 1024) { msg.textContent = "La foto pesa demasiado (máximo 20 MB)."; return; }
  msg.style.color = "var(--muted)"; msg.textContent = "Subiendo foto…";
  try {
    const [blob, mini] = await Promise.all([shrink(file), shrink(file, 400, 0.82)]);
    if (blob.size > 5 * 1024 * 1024) throw new Error("grande");
    const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
    const ruta = esEditor() ? `fichas/${id}-${Date.now()}.${ext}` : `propuestas/${ctx.uid}/${id}-${Date.now()}.${ext}`;
    // Cada foto tiene un nombre nuevo, así que los navegadores pueden guardarla un año sin volver a pedirla.
    const up = await sb.storage.from("fotos").upload(ruta, blob, { contentType: blob.type || "image/jpeg", upsert: false, cacheControl: "31536000" });
    if (up.error) throw up.error;
    if (mini && mini.type === "image/jpeg" && mini !== file) {   // si falla, se usa la grande en todas partes
      try { await sb.storage.from("fotos").upload(ruta.replace(/\.(jpe?g|png|webp)$/i, "-m.jpg"), mini, { contentType: "image/jpeg", upsert: false, cacheControl: "31536000" }); } catch (e) { console.warn("Sin miniatura", e); }
    }
    const url = sb.storage.from("fotos").getPublicUrl(ruta).data.publicUrl;
    if (esEditor()) {
      const { data: hechas, error } = await sb.from("tabacos").update({ foto: url }).eq("id", id).select("id");
      if (error) throw error;
      if (!hechas || !hechas.length) throw new Error("sin permiso");
      if (esAdmin()) await borrarFotoDeAlmacen(d.foto);   // la del editor se guarda para poder deshacer
      msg.textContent = ""; refrescar();
    } else {
      const { error } = await sb.from("propuestas").insert({ tipo: "foto", tabaco_id: id, datos: { foto: url } });
      if (error) throw error;
      msg.style.color = "var(--accent)"; msg.textContent = "Foto enviada. El administrador la revisará antes de publicarla.";
      contarPendientes().then(paintTop);
    }
  } catch (e) {
    console.error(e);
    msg.style.color = ""; msg.textContent = "No se ha podido subir la foto. Usa una imagen JPG, PNG o WebP de menos de 5 MB.";
  }
}

/* Miniaturas de las fotos subidas antes de que existieran (solo admin, desde Mi cuenta).
   Para cada foto del almacén sin «-m.jpg», la descarga, hace la miniatura y la sube. De paso vuelve a
   subir la grande igual que estaba, pero con caché de un año. Se puede repetir: salta las que ya tienen. */
async function crearMiniaturasQueFaltan() {
  if (!esAdmin()) return;
  const btn = $("cu-minis"), msg = $("cu-minis-msg");
  const lista = current.filter((d) => miniDe(fotoSegura(d.foto)) && rutaEnAlmacen(d.foto));
  if (!lista.length) { msg.textContent = "No hay fotos en el almacén."; return; }
  btn.disabled = true;
  let hechas = 0, ya = 0, fallos = 0;
  for (const [i, d] of lista.entries()) {
    msg.textContent = `Revisando ${i + 1} de ${lista.length}: ${d.nombre}…`;
    const grande = d.foto, mini = miniDe(grande);
    try {
      const existe = await fetch(mini, { method: "HEAD", cache: "no-store" });
      if (existe.ok) { ya++; continue; }
      const r = await fetch(grande, { cache: "no-store" });
      if (!r.ok) throw new Error("No se pudo descargar " + grande);
      const original = await r.blob();
      const peque = await shrink(original, 400, 0.82);
      if (!peque || peque === original || peque.type !== "image/jpeg") throw new Error("No se pudo reducir");
      const up = await sb.storage.from("fotos").upload(rutaEnAlmacen(mini), peque, { contentType: "image/jpeg", upsert: true, cacheControl: "31536000" });
      if (up.error) throw up.error;
      // La grande, tal cual, pero con caché de un año (si falla no pasa nada).
      try { await sb.storage.from("fotos").upload(rutaEnAlmacen(grande), original, { contentType: original.type || "image/jpeg", upsert: true, cacheControl: "31536000" }); } catch (e) {}
      hechas++;
    } catch (e) { console.warn("Miniatura", d.id, e); fallos++; }
  }
  msg.textContent = `Listo: ${hechas} miniaturas nuevas, ${ya} ya la tenían${fallos ? `, ${fallos} con error (puedes volver a pulsar)` : ""}.`;
  btn.disabled = false;
}

/* ---------- Eliminar ficha (solo admin) ---------- */
let delTarget = null;
function askDelete(id) {
  const d = findItem(id); if (!d) return;
  delTarget = d.id;
  $("cf-text").textContent = `¿Eliminar «${d.nombre}» de ${d.marca}? Se borrará de la base de datos junto con su reseña.`;
  $("cf-msg").textContent = ""; $("cf-yes").disabled = false;
  $("confirm").hidden = false; $("cf-no").focus();
}
function closeConfirm() { $("confirm").hidden = true; delTarget = null; }
async function doDelete() {
  const tid = delTarget; if (tid == null || !esAdmin()) return;
  const d = findItem(tid);
  $("cf-yes").disabled = true;
  const { error } = await sb.from("tabacos").delete().eq("id", tid);
  if (error) { $("cf-msg").textContent = "No se ha podido eliminar la ficha. Inténtalo de nuevo."; $("cf-yes").disabled = false; return; }
  if (d) await borrarFotoDeAlmacen(d.foto);
  closeConfirm(); closeDetail(); refrescar();
}

/* ---------- Editor de fichas: admin y editores crean y cambian fichas al momento ---------- */
function openEditor(id) {
  if (!esEditor()) return;
  const d = id ? findItem(id) : null;
  if (id && !d) return;
  const admin = esAdmin();
  openId = id || null;
  const v = d || { nombre: "", marca: "", tipo: "", hojas: [], corte: "", fuerza: 0, pais: "", formato: "", notas: [], desc: "", video: "" };
  const uniq = (k) => [...new Set(current.map((x) => x[k]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const dl = (name, vals) => `<datalist id="${name}">${vals.map((x) => `<option value="${esc(x)}">`).join("")}</datalist>`;
  const estilos = v.tipo && !ESTILOS.includes(v.tipo) ? [...ESTILOS, v.tipo] : ESTILOS;
  const titulo = d ? "Editar ficha" : "Añadir tabaco";
  abrirPanel(`
    <form class="f editor" id="ed-form" novalidate>
      <h2 id="d-name">${titulo}</h2>
      <div class="two">
        <div class="field"><label for="ed-nombre">Nombre</label><input id="ed-nombre" type="text" maxlength="120" value="${esc(v.nombre)}" autocomplete="off"></div>
        <div class="field"><label for="ed-marca">Marca</label><input id="ed-marca" type="text" maxlength="80" list="dl-marca" value="${esc(v.marca)}" autocomplete="off"></div>
      </div>
      <div class="two">
        <div class="field"><label for="ed-tipo">Mezcla</label><select id="ed-tipo"><option value="">Sin datos</option>${estilos.map((e) => `<option value="${esc(e)}"${v.tipo === e ? " selected" : ""}>${esc(e)}</option>`).join("")}</select></div>
        <div class="field"><label for="ed-corte">Corte</label><input id="ed-corte" type="text" maxlength="40" list="dl-corte" value="${esc(v.corte)}" autocomplete="off"></div>
      </div>
      <div class="two">
        <div class="field"><label for="ed-pais">País de origen</label><input id="ed-pais" type="text" maxlength="60" list="dl-pais" value="${esc(v.pais)}" autocomplete="off"></div>
      </div>
      <div class="two">
        <div class="field"><label for="ed-formato">Formato</label><input id="ed-formato" type="text" maxlength="80" value="${esc(v.formato)}" placeholder="Lata de 50 g"></div>
        <div class="field"><label for="ed-notas">Notas de sabor</label><input id="ed-notas" type="text" value="${esc(v.notas.join(", "))}" placeholder="Separadas por comas: heno, miel, cítrico"></div>
      </div>
      <fieldset class="hojas-ed"><legend>Hojas que lleva</legend>
        ${HOJAS.map((h, i) => `<label class="check"><input type="checkbox" name="ed-hoja" value="${esc(h)}"${v.hojas.includes(h) ? " checked" : ""}> ${esc(h)}</label>`).join("")}
      </fieldset>
      ${ctx.espanaOk ? `<label class="check es-check"><input type="checkbox" id="ed-es"${v.espana ? " checked" : ""}> Mostrar el distintivo de España <span class="es-badge" aria-hidden="true">E</span></label>` : ""}
      <div class="field"><label for="ed-video">Vídeo de YouTube (opcional)</label><input id="ed-video" type="url" value="${esc(v.video ? "https://www.youtube.com/watch?v=" + v.video : "")}" placeholder="https://www.youtube.com/watch?v=..."></div>
      <div class="field"><label for="ed-desc">Descripción</label><textarea id="ed-desc" maxlength="2000">${esc(v.desc)}</textarea></div>
      ${dl("dl-marca", uniq("marca"))}${dl("dl-corte", uniq("corte"))}${dl("dl-pais", uniq("pais"))}
      <p class="msg" id="ed-msg" role="alert"></p>
      <div class="btns">
        <button class="btn primary" type="submit" id="ed-save">${d ? "Guardar cambios" : "Crear ficha"}</button>
        <button class="btn" type="button" id="ed-cancel">Cancelar</button>
      </div>
    </form>`);
  $("ed-nombre").focus();
  $("ed-cancel").addEventListener("click", () => { if (id) openDetail(id); else closeDetail(); });
  $("ed-form").addEventListener("submit", (ev) => saveEditor(ev, d));
}
function leerFormulario() {
  return {
    nombre: $("ed-nombre").value.trim().slice(0, 120), marca: $("ed-marca").value.trim().slice(0, 80),
    tipo: $("ed-tipo").value.trim().slice(0, 40),
    hojas: [...document.querySelectorAll('input[name="ed-hoja"]:checked')].map((c) => c.value),
    corte: $("ed-corte").value.trim().slice(0, 40),
    pais: $("ed-pais").value.trim().slice(0, 60),
    formato: $("ed-formato").value.trim().slice(0, 80),
    notas: $("ed-notas").value.split(",").map((n) => n.trim().slice(0, 40)).filter(Boolean).slice(0, 12),
    descripcion: $("ed-desc").value.trim().slice(0, 2000),
    ...($("ed-es") ? { en_espana: $("ed-es").checked } : {})
  };
}
function valorDe(d, k) { return k === "descripcion" ? d.desc : k === "en_espana" ? !!d.espana : d[k]; }
function igual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
async function saveEditor(ev, d) {
  ev.preventDefault();
  const msg = $("ed-msg"), btn = $("ed-save");
  const data = leerFormulario();
  if (!data.nombre || !data.marca) { msg.textContent = "El nombre y la marca son obligatorios."; return; }
  if ($("ed-video")) {
    const raw = $("ed-video").value.trim();
    const vid = raw ? ytId(raw) : "";
    if (raw && !vid) { msg.textContent = "No reconozco ese enlace. Pega la dirección del vídeo de YouTube, por ejemplo https://www.youtube.com/watch?v=abcdefghijk"; return; }
    if (vid !== ((d && d.video) || "")) data.video_id = vid;   // solo se envía si cambia
  }
  btn.disabled = true; msg.textContent = "";
  try {
    if (d) {
      const { data: hechas, error } = await sb.from("tabacos").update(data).eq("id", d.id).select("id");
      if (error) throw error;
      if (!hechas || !hechas.length) throw new Error("sin permiso");   // las reglas de la base de datos no lo dejaron
      await refrescar(); openDetail(d.id);
    } else if (esEditor()) {
      const { data: fila, error } = await sb.from("tabacos").insert(data).select("id").single();
      if (error) throw error;
      await refrescar(); openDetail(fila.id);
    } else {
      const nota = ($("ed-nota") && $("ed-nota").value.trim().slice(0, 1000)) || "";
      let fila;
      if (d) {
        const cambios = {};
        CAMPOS.forEach(([k]) => { if (k in data && !igual(data[k], valorDe(d, k))) cambios[k] = data[k]; });
        if (!Object.keys(cambios).length) { msg.textContent = "No has cambiado nada."; btn.disabled = false; return; }
        fila = { tipo: "cambio", tabaco_id: d.id, datos: cambios, nota };
      } else {
        fila = { tipo: "nueva", datos: data, nota };
      }
      const { error } = await sb.from("propuestas").insert(fila);
      if (error) throw error;
      await contarPendientes(); paintTop();
      abrirPanel(`<div class="info aviso-ok"><h2 id="d-name">¡Gracias!</h2>
        <p>Tu propuesta se ha enviado. El administrador la revisará y, si la aprueba, aparecerá en el catálogo.</p>
        <div class="btns"><button class="btn primary" id="ok-close" type="button">Volver al catálogo</button>
        ${d ? '<button class="btn" id="ok-ficha" type="button">Volver a la ficha</button>' : ""}</div></div>`);
      $("ok-close").addEventListener("click", () => closeDetail());
      if (d) $("ok-ficha").addEventListener("click", () => openDetail(d.id));
    }
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    msg.textContent = (e && /50 propuestas|Solo el administrador/.test(e.message || "")) ? e.message : "No se ha podido guardar. Comprueba la conexión y que tu cuenta tiene permiso.";
  }
}

/* ---------- Vídeo de la ficha (lo ponen admin y editores, desde «Editar ficha») ----------
   El reproductor de YouTube se carga embebido al abrir la ficha, sin reproducir solo.
   Se usa youtube-nocookie.com para que YouTube no guarde cookies hasta que se reproduce. */
function paintVideo() {
  const box = $("d-video"); if (!box) return;
  const d = findItem(openId);
  if (!d || !/^[A-Za-z0-9_-]{11}$/.test(d.video || "")) { box.hidden = true; box.innerHTML = ""; return; }
  if (box.dataset.video === d.video && !box.hidden) return;   // no recargar el vídeo si ya está puesto
  box.hidden = false; box.dataset.video = d.video;
  box.innerHTML = `<h3 id="vd-h">Vídeo</h3>
    <div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${d.video}?rel=0"
      title="Vídeo de ${esc(d.nombre)}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
    <a class="yt-link" href="https://www.youtube.com/watch?v=${d.video}" target="_blank" rel="noopener noreferrer">Abrir en YouTube</a>`;
}
/* ---------- Reseñas de los usuarios ----------
   Cualquier persona registrada deja una reseña por tabaco (puntuación y texto). Se publica al momento;
   cada cual edita o borra la suya y el administrador puede borrar cualquiera. */
function firmaGuardada() {
  try { return localStorage.getItem("herbario-firma") || ctx.perfil.nombre || ""; } catch (e) { return ctx.perfil.nombre || ""; }
}
function paintResenas() {
  const list = $("rv-list"), mine = $("rv-mine");
  if (!list || !mine || openId == null) return;
  const todas = opinionesDe(openId);
  const mia = ctx.uid ? todas.find((o) => o.autor === ctx.uid) : null;
  const resto = todas.filter((o) => o !== mia);
  const md = $("rv-medias"); if (md) md.innerHTML = ctx.online && ctx.opiniones ? mediasHTML(todas) : "";

  // Zona propia: escribir, o ver/editar la propia
  if (!ctx.online || !ctx.opiniones) {
    mine.innerHTML = ctx.online ? '<p class="muted">Las reseñas todavía no están disponibles.</p>' : "";
  } else if (!ctx.session) {
    mine.innerHTML = '<p class="muted"><button class="link" type="button" id="rv-login">Entra con tu cuenta</button> para escribir una reseña.</p>';
    $("rv-login").addEventListener("click", abrirLogin);
  } else if (mia) {
    mine.innerHTML = `<div class="rev mine">${revHTML(mia, true)}</div>`;
  } else {
    mine.innerHTML = '<button class="btn primary" type="button" id="rv-new">Escribir una reseña</button>';
    $("rv-new").addEventListener("click", () => formResena(null));
  }
  if (!todas.length) {
    const d = findItem(openId);
    list.innerHTML = `<div class="rv-vacio">
        <svg viewBox="0 0 80 80" aria-hidden="true"><path d="M12 46h26a8 8 0 0 0 8-8v-8h14v10a20 20 0 0 1-20 20H20a8 8 0 0 1-8-8z"/><path d="M60 30h8"/><path class="humo" d="M50 20c0-4 4-5 4-9M56 22c0-4 4-5 4-9"/></svg>
        <div class="rv-vacio-t"><p>Nadie ha reseñado todavía ${esc(d ? d.nombre : "este tabaco")}.</p>
        <p class="muted">Cuéntanos a qué sabe, cómo arde y qué tal huele en la habitación.</p><div id="rv-vacio-acc"></div></div>
      </div>`;
    $("rv-vacio-acc").append(...mine.childNodes);   // el botón de escribir (o de entrar) va dentro de la tarjeta
    const nuevo = $("rv-new"); if (nuevo) nuevo.textContent = "Escribir la primera reseña";
  } else {
    list.innerHTML = resto.length ? resto.map((o) => `<div class="rev">${revHTML(o, false)}</div>`).join("") : "";
  }
  [mine, list].forEach((box) => box.querySelectorAll("[data-rv]").forEach((b) => b.addEventListener("click", accionResena)));
}
/* Medias de las reseñas: nota global, reparto de estrellas y una escala por característica.
   Con menos de MIN_MEDIAS reseñas no se muestran, para que una sola opinión no fije la ficha. */
const MIN_MEDIAS = 3;
const ORDEN_MEDIAS = ["fuerza", "sabor", "hab", "aroma"];
function mediasHTML(todas) {
  const conNota = todas.filter((o) => o.score >= 1 && o.score <= 5);
  if (!todas.length) return "";
  if (conNota.length < MIN_MEDIAS) return `<p class="muted">Todavía hay pocas reseñas para sacar medias (hacen falta ${MIN_MEDIAS}).</p>`;
  const n = conNota.length, media = conNota.reduce((a, o) => a + o.score, 0) / n;
  const cuenta = [0, 0, 0, 0, 0, 0]; conNota.forEach((o) => cuenta[o.score]++);
  const max = Math.max(...cuenta);
  const estrellas = [1, 2, 3, 4, 5].map((i) => `<i class="${media >= i - 0.25 ? "on" : media >= i - 0.75 ? "half" : ""}"></i>`).join("");
  const reparto = [5, 4, 3, 2, 1].map((i) => `<div class="md-br"><span>${i}</span><span class="md-bb"><span style="width:${max ? Math.round(cuenta[i] / max * 100) : 0}%"></span></span><span>${cuenta[i]}</span></div>`).join("");
  const escalas = ORDEN_MEDIAS.map((k) => {
    const c = CARACT.find((x) => x.k === k), tope = c.ops.length - 1;
    const vals = todas.map((o) => o[k]).filter((v) => v >= 1 && v <= tope);
    if (vals.length < MIN_MEDIAS) return "";
    const m = vals.reduce((a, v) => a + v, 0) / vals.length;
    const pos = Math.round((m - 1) / (tope - 1) * 100);
    return `<div class="md-fila"><span class="md-lab">${esc(c.label)}</span>
      <span class="md-esc" role="img" aria-label="${esc(c.label)}: ${esc(c.ops[Math.round(m)])}"><span style="left:${pos}%"></span></span>
      <span class="md-val">${esc(c.ops[Math.round(m)])}</span>
      <span class="md-ext"><span>${esc(c.ops[1])}</span><span>${esc(c.ops[tope])}</span></span></div>`;
  }).join("");
  return `<div class="medias">
    <div class="md-top">
      <div class="md-nota"><strong>${media.toFixed(1).replace(".", ",")}</strong><span class="md-est" aria-hidden="true">${estrellas}</span>
        <span class="muted">${n} ${n === 1 ? "reseña" : "reseñas"}</span></div>
      <div class="md-reparto" aria-label="Reparto de puntuaciones">${reparto}</div>
    </div>
    ${escalas ? `<div class="md-escalas"><h4>Según los fumadores</h4>${escalas}</div>` : ""}
  </div>`;
}
/* Rangos por reseñas publicadas: se calculan con las reseñas que ya se cargan. */
const RANGOS = [["Mediano de la Comarca", 1], ["Caminante", 5], ["Montaraz", 15], ["Guardián del Herbario", 30], ["Sabio de la Pipa", 60]];
function resenasDe(autor) {
  let n = 0; Object.values(opiniones).forEach((l) => l.forEach((o) => { if (o.autor === autor) n++; })); return n;
}
function rangoDe(n) {
  let i = -1; RANGOS.forEach(([, u], j) => { if (n >= u) i = j; });
  return { i, nombre: i >= 0 ? RANGOS[i][0] : "", sig: RANGOS[i + 1] || null, desde: i >= 0 ? RANGOS[i][1] : 0 };
}
function rangoHTML(autor) {
  if (!ctx.opiniones || !autor) return "";
  const r = rangoDe(resenasDe(autor));
  return r.i >= 0 ? `<span class="rango r${r.i + 1}">${esc(r.nombre)}</span>` : "";
}
function esSocio(autor) {
  return (ctx.uid && autor === ctx.uid && ctx.socioOk) ? !!ctx.perfil.socio : sociosAutores.has(autor);
}
function avatarResena(o) {
  const url = (ctx.uid && o.autor === ctx.uid && ctx.perfilOk) ? ctx.perfil.avatar : fotosAutores[o.autor];
  if (url) return `<img class="avatar" src="${esc(url)}" alt="" loading="lazy">`;
  return `<span class="avatar" aria-hidden="true">${esc((o.firma || "?").trim().charAt(0).toUpperCase())}</span>`;
}
function revHTML(o, propia) {
  const editado = o.actualizado && o.creado && new Date(o.actualizado) - new Date(o.creado) > 60000;
  const acts = propia
    ? `<div class="acts"><button class="link" type="button" data-rv="edit" data-id="${o.id}">Editar</button><button class="link" type="button" data-rv="del" data-id="${o.id}">Borrar</button></div>`
    : (esAdmin() ? `<div class="acts"><button class="link" type="button" data-rv="del" data-id="${o.id}">Borrar (admin)</button></div>` : "");
  return `<div class="head"><span class="who">${avatarResena(o)}${esc(o.firma)}${esSocio(o.autor) ? SELLO_SOCIO : ""}${rangoHTML(o.autor)}${propia ? " <small>(tu reseña)</small>" : ""}</span>
      <span class="str">${pips(o.score)}<span>${VALORACION[o.score]}</span></span>
      <span class="when">${fecha(o.creado)}${editado ? " · editada" : ""}</span></div>
    ${CARACT.some((c) => o[c.k]) ? `<dl class="rev-car">${CARACT.map((c) => o[c.k] ? `<dt>${esc(c.label)}</dt><dd>${esc(c.ops[o[c.k]])}</dd>` : "").join("")}</dl>` : ""}
    ${o.texto ? `<p>${esc(o.texto)}</p>` : ""}${acts}`;
}
async function accionResena(e) {
  const b = e.currentTarget, id = Number(b.dataset.id);
  const o = opinionesDe(openId).find((x) => x.id === id); if (!o) return;
  if (b.dataset.rv === "edit") { formResena(o); return; }
  if (!b.dataset.sure) { b.dataset.sure = "1"; b.textContent = "Pulsa otra vez para borrarla"; return; }
  b.disabled = true;
  const { error } = await sb.from("opiniones").delete().eq("id", id);
  if (error) { b.disabled = false; b.textContent = "No se ha podido borrar"; return; }
  refrescar();
}
function formResena(o) {
  const v = o || { firma: firmaGuardada(), score: 0, texto: "", fuerza: 0, sabor: 0, aroma: 0, hab: 0 };
  $("rv-mine").innerHTML = `
    <form class="f" id="rv-form" novalidate>
      <div class="two">
        <div class="field"><label for="rv-score">Puntuación</label>
          <select id="rv-score"><option value="0">Elige…</option>${[1, 2, 3, 4, 5].map((n) => `<option value="${n}"${v.score === n ? " selected" : ""}>${VALORACION[n]}</option>`).join("")}</select></div>
        <div class="field"><label for="rv-firma">Firma (nombre que se muestra)</label><input id="rv-firma" type="text" maxlength="40" value="${esc(v.firma)}" autocomplete="nickname" placeholder="Por ejemplo, Bilbo de Bolsón"></div>
      </div>
      <div class="two">${CARACT.map((c) => `<div class="field"><label for="rv-${c.k}">${esc(c.label)}</label>
          <select id="rv-${c.k}">${c.ops.map((op, i) => `<option value="${i}"${(v[c.k] || 0) === i ? " selected" : ""}>${i ? esc(op) : "Sin indicar"}</option>`).join("")}</select></div>`).join("")}</div>
      <div class="field"><label for="rv-texto">Tu reseña (opcional)</label><textarea id="rv-texto" maxlength="5000" placeholder="Aroma, sabor, cómo se fuma, con qué pipa…">${esc(v.texto)}</textarea></div>
      <p class="muted">Se publica al momento con tu firma. Tu correo no se muestra.</p>
      <p class="msg" id="rv-msg" role="alert"></p>
      <div class="btns">
        <button class="btn primary" type="submit" id="rv-save">${o ? "Guardar cambios" : "Publicar reseña"}</button>
        <button class="btn" type="button" id="rv-cancel">Cancelar</button>
      </div>
    </form>`;
  $("rv-score").focus();
  $("rv-cancel").addEventListener("click", paintResenas);
  $("rv-form").addEventListener("submit", (ev) => guardarResena(ev, o));
}
async function guardarResena(ev, o) {
  ev.preventDefault();
  const msg = $("rv-msg"), btn = $("rv-save");
  const puntuacion = Number($("rv-score").value) || 0;
  const firma = $("rv-firma").value.trim().slice(0, 40);
  const texto = $("rv-texto").value.trim().slice(0, 5000);
  if (!puntuacion) { msg.textContent = "Elige una puntuación de 1 a 5."; return; }
  if (firma.length < 2) { msg.textContent = "Escribe el nombre con el que quieres firmar (al menos 2 letras)."; return; }
  btn.disabled = true; msg.textContent = "";
  const fila = { firma, puntuacion, texto };
  CARACT.forEach((c) => { fila[c.col] = Number($("rv-" + c.k).value) || 0; });
  const r = o
    ? await sb.from("opiniones").update(fila).eq("id", o.id)
    : await sb.from("opiniones").insert(Object.assign({ tabaco_id: openId }, fila));
  if (r.error) {
    btn.disabled = false;
    msg.textContent = /duplicate|unique/i.test(r.error.message || "") ? "Ya tienes una reseña de este tabaco; edítala en lugar de crear otra."
      : "No se ha podido guardar la reseña. Comprueba la conexión e inténtalo de nuevo.";
    return;
  }
  try { localStorage.setItem("herbario-firma", firma); } catch (e) {}
  await refrescar();
}

/* ---------- Panel de revisión y usuarios (solo admin) ---------- */
function describirPropuesta(p) {
  const d = p.tabaco_id ? findItem(p.tabaco_id) : null;
  const nombre = d ? `${d.nombre} (${d.marca})` : (p.tabaco_id ? "ficha ya eliminada" : "");
  let titulo = "", cuerpo = "";
  if (p.tipo === "nueva") {
    titulo = `Ficha nueva: ${esc(p.datos.nombre || "")} · ${esc(p.datos.marca || "")}`;
    cuerpo = `<dl class="diff">${CAMPOS.map(([k, l]) => {
      const v = Array.isArray(p.datos[k]) ? p.datos[k].join(", ") : (k === "fuerza" ? FUERZA[p.datos[k] || 0] : k === "en_espana" ? (p.datos[k] ? "Sí" : "") : p.datos[k]);
      return v ? `<dt>${l}</dt><dd>${esc(v)}</dd>` : "";
    }).join("")}</dl>`;
  } else if (p.tipo === "cambio") {
    titulo = `Cambios en ${esc(nombre)}`;
    cuerpo = `<dl class="diff">${CAMPOS.filter(([k]) => k in p.datos).map(([k, l]) => {
      const fmt = (v) => Array.isArray(v) ? v.join(", ") : (k === "fuerza" ? FUERZA[v || 0] : k === "en_espana" ? (v ? "Sí" : "No") : (v || "—"));
      const antes = d ? fmt(valorDe(d, k)) : "—";
      return `<dt>${l}</dt><dd><span class="antes">${esc(antes)}</span> → <strong>${esc(fmt(p.datos[k]))}</strong></dd>`;
    }).join("")}</dl>`;
  } else {
    titulo = `Foto para ${esc(nombre)}`;
    const src = fotoSegura(p.datos.foto);
    cuerpo = src ? `<img class="prop-foto" src="${esc(src)}" alt="Foto propuesta">` : "<p class='muted'>Sin imagen.</p>";
  }
  return { titulo, cuerpo };
}
async function abrirRevision() {
  if (!esAdmin()) return;
  abrirPanel(`<div class="info adm"><h2 id="d-name">Propuestas pendientes</h2><div id="rv-list"><p class="muted">Cargando…</p></div>
    <button class="close" id="d-close" type="button">Cerrar</button></div>`);
  $("d-close").addEventListener("click", () => closeDetail());
  const { data, error } = await sb.from("propuestas").select("*").eq("estado", "pendiente").order("creado");
  const box = $("rv-list"); if (!box) return;
  if (error) { box.innerHTML = '<p class="msg">No se han podido cargar las propuestas.</p>'; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">No hay nada pendiente de revisar.</p>'; return; }
  box.innerHTML = data.map((p) => {
    const { titulo, cuerpo } = describirPropuesta(p);
    return `<article class="prop" data-id="${p.id}">
      <h3>${titulo}</h3>
      <p class="muted">Propuesta de ${esc(p.autor_email || "usuario")} · ${fecha(p.creado)}</p>
      ${cuerpo}
      ${p.nota ? `<p class="nota">Nota: ${esc(p.nota)}</p>` : ""}
      <div class="btns"><button class="btn primary" data-act="ok" type="button">Aprobar</button><button class="btn danger" data-act="no" type="button">Rechazar</button></div>
      <p class="msg" role="alert"></p>
    </article>`;
  }).join("");
  box.addEventListener("click", async (e) => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const art = b.closest(".prop"), pid = Number(art.dataset.id), p = data.find((x) => x.id === pid);
    art.querySelectorAll("button").forEach((x) => (x.disabled = true));
    const r = b.dataset.act === "ok" ? await sb.rpc("aprobar_propuesta", { p_id: pid }) : await sb.rpc("rechazar_propuesta", { p_id: pid });
    if (r.error) { art.querySelector(".msg").textContent = r.error.message || "No se ha podido completar."; art.querySelectorAll("button").forEach((x) => (x.disabled = false)); return; }
    if (b.dataset.act === "ok" && p.tipo === "foto") { const d = findItem(p.tabaco_id); if (d && d.foto !== p.datos.foto) await borrarFotoDeAlmacen(d.foto); }
    if (b.dataset.act === "no" && p.tipo === "foto") await borrarFotoDeAlmacen(p.datos.foto);
    art.innerHTML = `<p class="muted">${b.dataset.act === "ok" ? "Aprobada y publicada." : "Rechazada."}</p>`;
    await cargarTodo(); fillFilters(); render(); await contarPendientes(); paintTop();
  });
}
/* Historial de cambios en las fichas (solo admin): quién cambió qué y botón para deshacer */
const CAMPOS_HIST = [...CAMPOS, ["foto", "Foto"], ["video_id", "Vídeo"]];
const fechaHora = (t) => { try { return new Date(t).toLocaleString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
function fmtHist(k, v) {
  if (Array.isArray(v)) return v.join(", ") || "—";
  if (k === "en_espana") return v ? "Sí" : "No";
  return v == null || v === "" ? "—" : String(v);
}
function celdaHist(k, v) {
  if (k === "foto") { const src = fotoSegura(v || ""); return src ? `<img class="prop-foto" src="${esc(src)}" alt="">` : "sin foto"; }
  return esc(fmtHist(k, v));
}
async function abrirHistorial() {
  if (!esAdmin()) return;
  abrirPanel(`<div class="info adm"><h2 id="d-name">Historial de cambios</h2>
    <p class="muted">Los últimos 100 cambios en las fichas. Si algo no está bien, pulsa «Deshacer» y la ficha vuelve a como estaba antes de ese cambio.</p>
    <div id="hi-list"><p class="muted">Cargando…</p></div>
    <button class="close" id="d-close" type="button">Cerrar</button></div>`);
  $("d-close").addEventListener("click", () => closeDetail());
  const box = $("hi-list");
  const { data, error } = await sb.from("historial_fichas").select("*").order("cuando", { ascending: false }).limit(100);
  if (!box) return;
  if (error) { box.innerHTML = '<p class="msg">No se ha podido cargar el historial. Si no lo has hecho, ejecuta 33_editores_editan.sql en Supabase.</p>'; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">Todavía no hay cambios registrados.</p>'; return; }
  const ids = [...new Set(data.map((h) => h.autor).filter(Boolean))];
  const correos = {};
  if (ids.length) {
    const { data: ps } = await sb.from("perfiles").select("id,email,nombre").in("id", ids);
    (ps || []).forEach((p) => (correos[p.id] = p.nombre || p.email || "usuario"));
  }
  box.innerHTML = data.map((h) => {
    const a = h.antes || {}, b = h.despues || {};
    const nombre = `${a.nombre || ""} · ${a.marca || ""}`;
    const quien = esc(correos[h.autor] || (h.autor ? "usuario" : "sistema"));
    if (h.accion === "alta") {
      const n = h.despues || {};
      return `<article class="prop" data-id="${h.id}"><h3>Ficha nueva: ${esc(`${n.nombre || ""} · ${n.marca || ""}`)}</h3>
        <p class="muted">${quien} · ${fechaHora(h.cuando)}</p>
        <div class="btns"><button class="btn" data-act="ver" type="button">Abrir ficha</button>
          <button class="btn danger" data-act="quitar" type="button">Deshacer (borrar la ficha)</button></div>
        <p class="msg" role="alert"></p></article>`;
    }
    if (h.accion === "borrado") {
      return `<article class="prop" data-id="${h.id}"><h3>Ficha eliminada: ${esc(nombre)}</h3>
        <p class="muted">${quien} · ${fechaHora(h.cuando)}</p>
        <div class="btns"><button class="btn" data-act="restaurar" type="button">Restaurar ficha</button></div>
        <p class="msg" role="alert"></p></article>`;
    }
    const cambios = CAMPOS_HIST.filter(([k]) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    if (!cambios.length) return "";
    return `<article class="prop" data-id="${h.id}"><h3>${esc(nombre)}</h3>
      <p class="muted">${quien} · ${fechaHora(h.cuando)}</p>
      <dl class="diff">${cambios.map(([k, l]) => `<dt>${l}</dt><dd><span class="antes">${celdaHist(k, a[k])}</span> → <strong>${celdaHist(k, b[k])}</strong></dd>`).join("")}</dl>
      <div class="btns"><button class="btn" data-act="deshacer" type="button">Deshacer</button>
        <button class="btn" data-act="ver" type="button">Abrir ficha</button></div>
      <p class="msg" role="alert"></p></article>`;
  }).join("") || '<p class="muted">Todavía no hay cambios registrados.</p>';
  box.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]"); if (!btn) return;
    const art = btn.closest(".prop"), h = data.find((x) => x.id === Number(art.dataset.id)); if (!h) return;
    if (btn.dataset.act === "ver") { if (findItem(h.tabaco_id)) openDetail(h.tabaco_id); return; }
    const msg = art.querySelector(".msg");
    art.querySelectorAll("button").forEach((x) => (x.disabled = true));
    let r;
    if (btn.dataset.act === "quitar") {
      if (!btn.dataset.sure) { btn.dataset.sure = "1"; btn.textContent = "Pulsa otra vez para borrarla"; art.querySelectorAll("button").forEach((x) => (x.disabled = false)); return; }
      r = await sb.from("tabacos").delete().eq("id", h.tabaco_id);
    } else if (btn.dataset.act === "restaurar") {
      const fila = { ...h.antes }; delete fila.actualizado; delete fila.actualizado_por;
      r = await sb.from("tabacos").insert(fila);
    } else {
      const vuelta = {};
      CAMPOS_HIST.forEach(([k]) => { if (JSON.stringify(h.antes[k]) !== JSON.stringify((h.despues || {})[k])) vuelta[k] = h.antes[k]; });
      r = await sb.from("tabacos").update(vuelta).eq("id", h.tabaco_id);
    }
    if (r.error) { msg.textContent = "No se ha podido deshacer. Puede que la ficha ya no exista o haya cambiado después."; art.querySelectorAll("button").forEach((x) => (x.disabled = false)); return; }
    msg.style.color = "var(--accent)"; msg.textContent = btn.dataset.act === "restaurar" ? "Ficha restaurada." : btn.dataset.act === "quitar" ? "Ficha borrada." : "Cambio deshecho.";
    await refrescar();
  });
}
/* ---------- Usuarios (solo admin) ----------
   Con 36_panel_usuarios.sql: nombre, foto, última conexión, reseñas, bodega y borrar cuentas.
   Sin él, la lista sale con lo que hay en perfiles y sin esas opciones. */
const ICONO_VECINOS = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.5c.6-3.4 3.1-5.4 6.2-5.4s5.6 2 6.2 5.4"/><path d="M15.2 4.9a3.2 3.2 0 0 1 0 6.2M17.4 14.4c2 .6 3.4 2.4 3.8 5.1"/></svg>`;
const ICONO_PAPELERA = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/></svg>`;
const DIA = 86400000;
function haceCuanto(t) {
  if (!t) return "nunca";
  const ms = Date.now() - new Date(t).getTime();
  if (ms < 3600000) return "hace un momento";
  if (ms < DIA) { const h = Math.floor(ms / 3600000); return h === 1 ? "hace 1 hora" : `hace ${h} horas`; }
  if (ms < 2 * DIA) return "ayer";
  if (ms < 30 * DIA) return `hace ${Math.floor(ms / DIA)} días`;
  return `el ${fecha(t)}`;
}
// Apunta la visita del usuario que ha entrado (como mucho una vez por hora; necesita el 36).
function marcarVisita() {
  if (!sb || !ctx.uid) return;
  const k = "herbario-visita-" + ctx.uid;
  try { if (Date.now() - Number(localStorage.getItem(k) || 0) < 3600000) return; localStorage.setItem(k, String(Date.now())); } catch (e) {}
  sb.rpc("marcar_visita").then(() => {}, () => {});
}
const usVista = { filtro: "todos", orden: "recientes", q: "" };
const US_FILTROS = [["todos", "Todos"], ["admin", "Admin"], ["editor", "Editores"], ["lector", "Lectores"], ["socio", "Socios"], ["suspendido", "Suspendidas"]];
const US_ORDEN = [["recientes", "Más recientes"], ["conexion", "Última conexión"], ["nombre", "Nombre"], ["resenas", "Más reseñas"]];
const ICONO_CANDADO = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>`;
const ICONO_NOTA = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12h7M8.5 15.5h5"/></svg>`;
const ICONO_RESENAS = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/></svg>`;
const ICONO_HOJA_CALC = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M4 9h16M4 14.5h16M10 9v11.5"/></svg>`;
// Usuarios nuevos desde la última vez que el administrador abrió el panel (para el numerito del botón).
const US_VISTO = "herbario-usuarios-visto";
function usuariosVisto() { try { return Number(localStorage.getItem(US_VISTO) || 0); } catch (e) { return 0; } }
async function contarUsuariosNuevos() {
  ctx.usuariosNuevos = 0;
  if (!sb || ctx.rol !== "admin") return;
  let visto = usuariosVisto();
  if (!visto) { visto = Date.now(); try { localStorage.setItem(US_VISTO, String(visto)); } catch (e) {} }
  const { count } = await sb.from("perfiles").select("id", { count: "exact", head: true }).gt("creado", new Date(visto).toISOString());
  ctx.usuariosNuevos = count || 0;
}
function descargarCSV(nombre, filas) {
  const celda = (v) => { const t = v == null ? "" : String(v); return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const csv = "﻿" + filas.map((f) => f.map(celda).join(";")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = nombre; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
async function abrirUsuarios() {
  if (!esAdmin()) return;
  // Lo que se registró después de la última visita al panel se marca como «Nuevo».
  const vistoAntes = usuariosVisto();
  try { localStorage.setItem(US_VISTO, String(Date.now())); } catch (e) {}
  if (ctx.usuariosNuevos) { ctx.usuariosNuevos = 0; paintTop(); }
  abrirPanel(`
    <div class="d-franja">${FRANJA}</div>
    <div class="bd-cab">
      <span class="bd-baul" aria-hidden="true">${ICONO_VECINOS}</span>
      <div><h2 id="d-name">Usuarios</h2><p class="muted">Los vecinos registrados en el herbario, sus permisos y su actividad.</p></div>
    </div>
    <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
    <div class="bd-cuerpo" id="us-cuerpo"><p class="muted">Cargando…</p></div>`, "bodega-p usuarios-p");
  $("d-close").addEventListener("click", () => closeDetail());

  // Con el 36 (y el 37), todo en una llamada; si no, lo básico de perfiles.
  let completo = true, socios = true;
  let { data, error } = await sb.rpc("admin_usuarios");
  if (error) {
    completo = false;
    ({ data, error } = await sb.from("perfiles").select("id,email,nombre,avatar,rol,creado,socio,socio_desde").order("creado"));
    if (error) { socios = false; ({ data, error } = await sb.from("perfiles").select("id,email,rol,creado").order("creado")); }
  }
  const cuerpo = $("us-cuerpo"); if (!cuerpo) return;
  if (error) { cuerpo.innerHTML = '<p class="msg">No se han podido cargar los usuarios.</p>'; return; }
  let lista = data || [];
  const extra = completo && lista.length > 0 && "suspendido" in lista[0];   // 37_usuarios_extra.sql
  const abiertos = {};   // id -> "resenas" | "nota" (lo que está desplegado en cada tarjeta)

  const ahora = Date.now();
  const casillas = () => {
    const nuevos = lista.filter((u) => ahora - new Date(u.creado).getTime() < 30 * DIA).length;
    const activos = lista.filter((u) => u.ultima_conexion && ahora - new Date(u.ultima_conexion).getTime() < 30 * DIA).length;
    return `<div class="bd-casilla principal"><span class="l">Usuarios</span><span class="n">${lista.length}</span><span class="s">registrados en el herbario</span></div>
      <div class="bd-casilla"><span class="l">Nuevos</span><span class="n">${nuevos}</span><span class="s">en los últimos 30 días</span></div>
      ${completo ? `<div class="bd-casilla"><span class="l">Activos</span><span class="n">${activos}</span><span class="s">han entrado en 30 días</span></div>` : ""}
      ${socios ? `<div class="bd-casilla"><span class="l">Socios del club</span><span class="n">${lista.filter((u) => u.socio).length}</span><span class="s">con el sello del Pipa Club</span></div>` : ""}`;
  };
  cuerpo.innerHTML = `
    <div class="bd-casillas" id="us-casillas">${casillas()}</div>
    <div class="bd-barra us-barra">
      <div class="bd-tabs" role="tablist" aria-label="Filtrar usuarios" id="us-tabs"></div>
      <div class="us-busca">
        <input id="us-q" type="search" placeholder="Buscar por nombre, correo o nota" aria-label="Buscar usuarios" autocomplete="off" value="${esc(usVista.q)}">
        <span class="us-busca-d">
          <label class="bd-orden">Ordenar por <select id="us-orden">${US_ORDEN.filter(([k]) => completo || (k !== "conexion" && k !== "resenas")).map(([k, t]) => `<option value="${k}"${k === usVista.orden ? " selected" : ""}>${t}</option>`).join("")}</select></label>
          <button class="btn us-exportar" id="us-csv" type="button" title="Descarga la lista que ves ahora (con los filtros aplicados)">${ICONO_HOJA_CALC}<span>Exportar</span></button>
        </span>
      </div>
    </div>
    <p class="msg" id="us-msg" role="status"></p>
    <div class="us-lista" id="us-list"></div>
    ${completo ? "" : '<p class="notice">Para ver la última conexión, las reseñas y la bodega de cada usuario, y poder borrar cuentas, ejecuta <strong>36_panel_usuarios.sql</strong> en Supabase.</p>'}
    ${completo && !extra && lista.length ? '<p class="notice">Para suspender cuentas y escribir notas privadas, ejecuta <strong>37_usuarios_extra.sql</strong> en Supabase.</p>' : ""}
    ${socios ? "" : '<p class="notice">Para marcar socios del club, ejecuta 23_socios_del_club.sql en Supabase.</p>'}`;

  const box = $("us-list");
  const aviso = (txt, ok) => { const m = $("us-msg"); m.style.color = ok ? "var(--accent)" : ""; m.textContent = txt; };
  const quien = (u) => u.nombre || u.email || "este usuario";
  const enFiltro = (u, f) => f === "todos" ? true : f === "socio" ? u.socio : f === "suspendido" ? u.suspendido : u.rol === f && !u.suspendido;
  const visibles = () => {
    const q = usVista.q.trim().toLowerCase();
    let v = lista.filter((u) => enFiltro(u, usVista.filtro));
    if (q) v = v.filter((u) => `${u.nombre || ""} ${u.email || ""} ${u.nota || ""}`.toLowerCase().includes(q));
    const t = (x) => (x ? new Date(x).getTime() : 0);
    const nom = (u) => (u.nombre || u.email || "").toLowerCase();
    const ord = { recientes: (a, b) => t(b.creado) - t(a.creado), conexion: (a, b) => t(b.ultima_conexion) - t(a.ultima_conexion),
      nombre: (a, b) => nom(a).localeCompare(nom(b), "es"), resenas: (a, b) => (b.resenas || 0) - (a.resenas || 0) };
    return v.sort(ord[usVista.orden] || ord.recientes);
  };
  const fila = (u) => {
    const yo = u.id === ctx.uid, foto = fotoSegura(u.avatar || "");
    const letra = (u.nombre || u.email || "?").trim().charAt(0).toUpperCase();
    const borrable = completo && !yo && u.rol !== "admin";
    const nuevo = vistoAntes && new Date(u.creado).getTime() > vistoAntes;
    const abierto = abiertos[u.id] || "";
    return `<article class="us-fila${u.suspendido ? " suspendida" : ""}${nuevo ? " nueva" : ""}" data-uid="${esc(u.id)}">
      <span class="us-foto">${foto ? `<img class="avatar" src="${esc(foto)}" alt="" loading="lazy">` : `<span class="avatar" aria-hidden="true">${esc(letra)}</span>`}</span>
      <div class="us-quien">
        <strong class="us-nombre">${u.nombre ? esc(u.nombre) : '<span class="muted">Sin nombre público</span>'}</strong>
        <span class="us-correo">${esc(u.email || "—")}</span>
        <span class="us-chips">
          ${nuevo ? '<span class="cu-chip nuevo">Nuevo</span>' : ""}
          ${u.suspendido ? `<span class="cu-chip suspendida">${ICONO_CANDADO}Suspendida</span>` : ""}
          <span class="cu-chip rol r-${esc(u.rol)}">${esc(ROL_TXT[u.rol] || u.rol)}</span>
          ${u.socio ? `<span class="cu-chip rango us-socio-chip"><img src="img/logo.png" alt="" width="16" height="16">Socio${u.socio_desde ? ` desde ${u.socio_desde}` : ""}</span>` : ""}
          ${yo ? '<span class="cu-chip tu">Tú</span>' : ""}</span>
        ${extra && u.nota && abierto !== "nota" ? `<span class="us-nota-ver">${ICONO_NOTA}${esc(u.nota)}</span>` : ""}
      </div>
      <dl class="us-datos">
        <div><dt>Alta</dt><dd>${fecha(u.creado)}</dd></div>
        ${completo ? `<div><dt>Última conexión</dt><dd>${haceCuanto(u.ultima_conexion)}</dd></div>
        <div><dt>Actividad</dt><dd>${u.resenas === 1 ? "1 reseña" : `${u.resenas || 0} reseñas`} · ${u.en_bodega || 0} en bodega</dd></div>` : ""}
      </dl>
      <div class="us-acc">
        <label class="us-campo">Rol
          <select data-rol="${esc(u.id)}"${yo ? " disabled title=\"No puedes cambiar tu propio rol\"" : ""}>
            ${["lector", "editor", "admin"].map((r) => `<option value="${r}"${u.rol === r ? " selected" : ""}>${ROL_TXT[r]}</option>`).join("")}
          </select></label>
        ${socios ? `<div class="us-campo us-socio"><label class="check"><input type="checkbox" data-socio="${esc(u.id)}"${u.socio ? " checked" : ""}> Socio</label>
          <input type="number" data-desde="${esc(u.id)}" min="1950" max="2100" step="1" placeholder="Año" value="${u.socio_desde || ""}" aria-label="Socio desde (año)"></div>` : ""}
        <span class="us-acc-d">
          ${completo ? `<button class="btn us-mini" type="button" data-ver="resenas" aria-expanded="${abierto === "resenas"}"${u.resenas ? "" : " disabled"}>${ICONO_RESENAS}<span>Reseñas${u.resenas ? ` (${u.resenas})` : ""}</span></button>` : ""}
          ${extra ? `<button class="btn us-mini" type="button" data-ver="nota" aria-expanded="${abierto === "nota"}">${ICONO_NOTA}<span>${u.nota ? "Nota" : "Añadir nota"}</span></button>` : ""}
          ${extra && !yo ? `<button class="btn us-mini${u.suspendido ? " readmitir" : " suspender"}" type="button" data-suspender="${u.suspendido ? "0" : "1"}"${!u.suspendido && u.rol === "admin" ? ' disabled title="Quítale antes el rol de administrador"' : ""}>${ICONO_CANDADO}<span>${u.suspendido ? "Readmitir" : "Suspender"}</span></button>` : ""}
          ${completo ? `<button class="btn danger us-borrar us-mini" type="button" data-borrar="${esc(u.id)}"${borrable ? "" : ` disabled title="${yo ? "No puedes borrar tu propia cuenta" : "Quítale antes el rol de administrador"}"`}>${ICONO_PAPELERA}<span>Borrar cuenta</span></button>` : ""}
        </span>
      </div>
      ${abierto === "nota" ? `<div class="us-extra us-nota">
        <label for="us-nota-${esc(u.id)}">Nota privada <span class="muted">(solo la ves tú)</span></label>
        <textarea id="us-nota-${esc(u.id)}" maxlength="2000" rows="3" placeholder="Por ejemplo: socio del grupo de Valladolid, lo conocí en la quedada de octubre…">${esc(u.nota || "")}</textarea>
        <span class="btns"><button class="btn primary" type="button" data-nota-guardar>Guardar nota</button><button class="btn" type="button" data-ver="nota">Cerrar</button></span>
      </div>` : ""}
      ${abierto === "resenas" ? `<div class="us-extra us-resenas" data-resenas="${esc(u.id)}"><p class="muted">Cargando reseñas…</p></div>` : ""}
    </article>`;
  };
  const pintarLista = () => {
    $("us-tabs").innerHTML = US_FILTROS.filter(([k]) => (socios || k !== "socio") && (extra || k !== "suspendido"))
      .map(([k, t]) => `<button role="tab" type="button" data-filtro="${k}" aria-selected="${k === usVista.filtro}">${t} <span>${lista.filter((u) => enFiltro(u, k)).length}</span></button>`).join("");
    const v = visibles();
    box.innerHTML = v.length ? v.map(fila).join("") : '<p class="muted us-vacio">Nadie coincide con la búsqueda.</p>';
    box.querySelectorAll("[data-resenas]").forEach((el) => cargarResenasDe(el));
  };
  const repintar = () => { $("us-casillas").innerHTML = casillas(); pintarLista(); };

  // Reseñas de un usuario, con la ficha, la puntuación y el botón de borrar.
  async function cargarResenasDe(el) {
    const id = el.dataset.resenas;
    const { data: rs, error: er } = await sb.from("opiniones").select("id,tabaco_id,puntuacion,texto,creado").eq("autor", id).order("creado", { ascending: false });
    if (!el.isConnected) return;
    if (er) { el.innerHTML = '<p class="msg">No se han podido cargar sus reseñas.</p>'; return; }
    if (!rs.length) { el.innerHTML = '<p class="muted">No tiene reseñas publicadas.</p>'; return; }
    el.innerHTML = `<p class="us-extra-t">Sus reseñas</p>` + rs.map((r) => {
      const d = findItem(r.tabaco_id);
      const texto = (r.texto || "").trim();
      return `<div class="us-res" data-rid="${r.id}">
        <div class="us-res-c">
          <span class="us-res-h">${d ? `<button class="link" type="button" data-ficha="${esc(r.tabaco_id)}">${esc(d.nombre)}</button> <span class="muted">· ${esc(d.marca)}</span>` : '<span class="muted">Ficha eliminada</span>'}
            <span class="us-res-p" aria-label="${r.puntuacion} de 5">${"★".repeat(r.puntuacion)}<span>${"★".repeat(5 - r.puntuacion)}</span></span>
            <span class="muted">· ${fecha(r.creado)}</span></span>
          ${texto ? `<p>${esc(texto.length > 280 ? texto.slice(0, 280) + "…" : texto)}</p>` : '<p class="muted">Sin texto, solo puntuación.</p>'}
        </div>
        <button class="btn danger us-mini" type="button" data-borrar-resena="${r.id}">${ICONO_PAPELERA}<span>Borrar</span></button>
      </div>`;
    }).join("");
  }

  pintarLista();
  $("us-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-filtro]"); if (!b) return; usVista.filtro = b.dataset.filtro; pintarLista(); });
  $("us-q").addEventListener("input", (e) => { usVista.q = e.target.value; pintarLista(); });
  $("us-orden").addEventListener("change", (e) => { usVista.orden = e.target.value; pintarLista(); });
  $("us-csv").addEventListener("click", () => {
    const v = visibles();
    const cab = ["Nombre público", "Correo", "Rol", "Socio", "Socio desde", "Alta"];
    if (completo) cab.push("Última conexión", "Reseñas", "Tabacos en bodega");
    if (extra) cab.push("Suspendida", "Nota");
    const fh = (t) => (t ? new Date(t).toLocaleDateString("es-ES") : "");
    const filas = v.map((u) => {
      const f = [u.nombre || "", u.email || "", ROL_TXT[u.rol] || u.rol, u.socio ? "Sí" : "No", u.socio_desde || "", fh(u.creado)];
      if (completo) f.push(fh(u.ultima_conexion), u.resenas || 0, u.en_bodega || 0);
      if (extra) f.push(u.suspendido ? "Sí" : "No", u.nota || "");
      return f;
    });
    descargarCSV(`usuarios-herbario-${new Date().toISOString().slice(0, 10)}.csv`, [cab, ...filas]);
    aviso(`Descargada la lista de ${v.length === 1 ? "1 usuario" : `${v.length} usuarios`}.`, true);
  });

  box.addEventListener("change", async (e) => {
    const cs = e.target.closest("[data-socio],[data-desde]");
    if (cs) {
      const id = cs.dataset.socio || cs.dataset.desde;
      const marca = box.querySelector(`[data-socio="${id}"]`), anio = box.querySelector(`[data-desde="${id}"]`);
      const n = anio.value.trim() ? Number(anio.value) : null;
      if (n !== null && !(Number.isInteger(n) && n >= 1950 && n <= 2100)) { aviso("El año tiene que estar entre 1950 y 2100."); return; }
      marca.disabled = anio.disabled = true;
      const { error } = await sb.from("perfiles").update({ socio: marca.checked, socio_desde: n }).eq("id", id);
      marca.disabled = anio.disabled = false;
      if (error) { aviso("No se ha podido guardar el socio."); return; }
      aviso(marca.checked ? "Socio guardado." : "Ya no figura como socio.", true);
      const u = lista.find((x) => x.id === id); if (u) { u.socio = marca.checked; u.socio_desde = n; }
      if (id === ctx.uid) { ctx.perfil.socio = marca.checked; ctx.perfil.socioDesde = n; }
      if (marca.checked) sociosAutores.add(id); else sociosAutores.delete(id);
      repintar();
      return;
    }
    const s = e.target.closest("select[data-rol]"); if (!s) return;
    s.disabled = true;
    const { error } = await sb.from("perfiles").update({ rol: s.value }).eq("id", s.dataset.rol);
    s.disabled = false;
    if (error) { aviso("No se ha podido cambiar el rol."); return; }
    const u = lista.find((x) => x.id === s.dataset.rol); if (u) u.rol = s.value;
    aviso(`Rol actualizado: ${quien(u)} ahora es ${ROL_TXT[s.value].toLowerCase()}.`, true);
    repintar();
  });

  box.addEventListener("click", async (e) => {
    const art = e.target.closest(".us-fila"); if (!art) return;
    const id = art.dataset.uid, u = lista.find((x) => x.id === id); if (!u) return;
    const bloquear = (si) => art.querySelectorAll("button,select,input,textarea").forEach((x) => (x.disabled = si));

    // Abrir o cerrar reseñas / nota
    const ver = e.target.closest("[data-ver]");
    if (ver) { abiertos[id] = abiertos[id] === ver.dataset.ver ? "" : ver.dataset.ver; pintarLista();
      if (abiertos[id] === "nota") { const t = $("us-nota-" + id); if (t) t.focus(); } return; }
    const fic = e.target.closest("[data-ficha]");
    if (fic) { openDetail(fic.dataset.ficha); return; }

    // Guardar la nota privada
    if (e.target.closest("[data-nota-guardar]")) {
      const txt = $("us-nota-" + id).value.trim();
      bloquear(true);
      const { error } = txt
        ? await sb.from("notas_usuarios").upsert({ usuario: id, nota: txt, actualizado: new Date().toISOString() })
        : await sb.from("notas_usuarios").delete().eq("usuario", id);
      bloquear(false);
      if (error) { aviso("No se ha podido guardar la nota."); return; }
      u.nota = txt; abiertos[id] = ""; aviso(txt ? "Nota guardada." : "Nota borrada.", true); pintarLista();
      return;
    }

    // Borrar una reseña suya (con confirmación en el propio botón)
    const br = e.target.closest("[data-borrar-resena]");
    if (br) {
      if (!br.dataset.seguro) { br.dataset.seguro = "1"; br.querySelector("span").textContent = "¿Seguro? Pulsa otra vez"; return; }
      br.disabled = true;
      const { error } = await sb.from("opiniones").delete().eq("id", Number(br.dataset.borrarResena));
      if (error) { br.disabled = false; aviso("No se ha podido borrar la reseña."); return; }
      br.closest(".us-res").remove();
      u.resenas = Math.max(0, (u.resenas || 1) - 1);
      aviso("Reseña borrada.", true);
      if (!u.resenas) { abiertos[id] = ""; }
      repintar();
      await cargarExtras(); pintar();
      return;
    }

    // Suspender o readmitir
    const sus = e.target.closest("[data-suspender]");
    if (sus) {
      const suspender = sus.dataset.suspender === "1";
      if (suspender && !sus.dataset.seguro) {
        sus.dataset.seguro = "1"; sus.querySelector("span").textContent = "¿Suspender? Pulsa otra vez";
        aviso(`${quien(u)} no podrá entrar ni escribir. Sus reseñas se quedan publicadas y puedes readmitirle cuando quieras.`, true);
        return;
      }
      bloquear(true);
      const { error } = await sb.rpc("admin_suspender", { p_id: id, p_suspender: suspender });
      bloquear(false);
      if (error) { aviso(error.message || "No se ha podido completar."); return; }
      u.suspendido = suspender;
      aviso(suspender ? `Cuenta de ${quien(u)} suspendida.` : `${quien(u)} vuelve a tener acceso.`, true);
      repintar();
      return;
    }

    // Borrar la cuenta: primero se pide confirmación dentro de la propia fila
    const b = e.target.closest("[data-borrar]");
    if (b) {
      if (art.querySelector(".us-confirma")) return;
      art.insertAdjacentHTML("beforeend", `<div class="us-confirma" role="alertdialog" aria-label="Confirmar borrado">
        <p><strong>¿Borrar la cuenta de ${esc(quien(u))}?</strong>
        Se borrarán también sus reseñas${u.resenas ? ` (${u.resenas})` : ""}, su bodega, sus tarros, sus propuestas, su foto y tu nota. No se puede deshacer.${extra && !u.suspendido ? " Si solo quieres apartarle, mejor «Suspender»." : ""}</p>
        <span class="btns"><button class="btn danger fuerte" type="button" data-si>Sí, borrar la cuenta</button><button class="btn" type="button" data-no>Cancelar</button></span></div>`);
      b.disabled = true; art.querySelector("[data-no]").focus();
      return;
    }
    if (e.target.closest("[data-no]")) { art.querySelector(".us-confirma").remove(); art.querySelector("[data-borrar]").disabled = false; return; }
    if (!e.target.closest("[data-si]")) return;
    bloquear(true);
    // La foto de perfil, antes (después ya no quedaría rastro de la carpeta)
    try {
      const { data: fs } = await sb.storage.from("avatares").list(id);
      if (fs && fs.length) await sb.storage.from("avatares").remove(fs.map((f) => `${id}/${f.name}`));
    } catch (er) { console.warn("No se ha podido borrar la foto de perfil", er); }
    const { error } = await sb.rpc("admin_borrar_usuario", { p_id: id });
    if (error) { aviso(error.message || "No se ha podido borrar la cuenta."); bloquear(false); art.querySelector(".us-confirma").remove(); return; }
    lista = lista.filter((x) => x.id !== id);
    aviso(`Cuenta de ${quien(u)} borrada.`, true);
    repintar();
    if (u.resenas) { await cargarExtras(); pintar(); }
  });
}
async function abrirMisPropuestas() {
  abrirPanel(`<div class="info adm"><h2 id="d-name">Mis propuestas</h2><div id="mp-list"><p class="muted">Cargando…</p></div>
    <button class="close" id="d-close" type="button">Cerrar</button></div>`);
  $("d-close").addEventListener("click", () => closeDetail());
  const { data, error } = await sb.from("propuestas").select("*").eq("autor", ctx.uid).order("creado", { ascending: false }).limit(100);
  const box = $("mp-list"); if (!box) return;
  if (error) { box.innerHTML = '<p class="msg">No se han podido cargar.</p>'; return; }
  if (!data.length) { box.innerHTML = '<p class="muted">Todavía no has enviado propuestas.</p>'; return; }
  const ESTADO = { pendiente: "Pendiente", aprobada: "Aprobada", rechazada: "Rechazada" };
  box.innerHTML = data.map((p) => { const { titulo } = describirPropuesta(p); return `<p><strong>${ESTADO[p.estado]}</strong> · ${titulo} <span class="muted">· ${fecha(p.creado)}</span></p>`; }).join("");
}

/* ---------- Mi bodega ----------
   Cada persona registrada marca sus tabacos: los tiene, los ha probado o quiere probarlos.
   Es privada (reglas de 10_mi_bodega.sql). Si ese SQL aún no se ha ejecutado, la web sigue sin ella. */
const BODEGA = [["tengo", "Lo tengo"], ["probado", "Lo he probado"], ["quiero", "Quiero probarlo"]];
async function cargarBodega() {
  bodega = {}; ctx.bodega = false; ctx.gramosOk = false;
  if (!sb || !ctx.session) return;
  // Primero con los gramos (15_bodega_gramos.sql); si esa columna aún no existe, sin ellos.
  for (const conGramos of [true, false]) {
    try {
      const cols = "tabaco_id,tengo,probado,quiero" + (conGramos ? ",gramos" : "");
      const filas = {};
      for (let desde = 0; ; desde += 1000) {
        const { data, error } = await sb.from("bodega").select(cols).range(desde, desde + 999);
        if (error) throw error;
        data.forEach((x) => { filas[String(x.tabaco_id)] = { tengo: x.tengo, probado: x.probado, quiero: x.quiero,
          gramos: Number.isInteger(x.gramos) && x.gramos > 0 ? x.gramos : null }; });
        if (data.length < 1000) break;
      }
      bodega = filas; ctx.bodega = true; ctx.gramosOk = conGramos;
      await cargarTarros(); return;
    } catch (e) { console.warn(conGramos ? "Mi bodega sin gramos (falta 15_bodega_gramos.sql)" : "Mi bodega no disponible", e); }
  }
}
/* ---------- Tarros y latas (24_tarros.sql) ----------
   Cada tabaco de la bodega puede tener varios envases con sus gramos y su fecha. «Lo tengo» y los
   gramos de la bodega los recalcula la base de datos a partir de los tarros. */
let tarros = {};   // tabaco_id -> [tarro]
const ENVASE = { tarro: "Tarro de cristal", lata: "Lata cerrada", bolsa: "Bolsa", "": "Tabaco" };
const ENVASES = { tarro: "Tarros de cristal", lata: "Latas cerradas", bolsa: "Bolsas", "": "Envases" };
const NOMBRE_ENV = { tarro: ["tarro", "tarros"], lata: ["lata", "latas"], bolsa: ["bolsa", "bolsas"], "": ["envase", "envases"] };
const uds = (t) => (Number.isInteger(t.unidades) && t.unidades > 0 ? t.unidades : 1);
const TIPO_FECHA = { embotado: "Embotado", compra: "Comprado", lata: "Fecha de la lata" };
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const ICONO_TARRO = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V12a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M6 7.5h12v1.5H6z"/>
  <path d="M6.5 9h11" stroke="#D85A30" stroke-width="2"/><path d="M7 7.5c0-2 2.2-3.2 5-3.2s5 1.2 5 3.2"/>
  <path d="M9 4.6 8.3 2.8h7.4l-.7 1.8"/><path d="M18 8.2c1.6.3 2 1.6 1.4 3.8"/><path d="M8 14h3"/></svg>`;
const ICONO_LATA = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <ellipse cx="12" cy="7" rx="8" ry="2.5"/><path d="M4 7v10c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V7"/><path d="M4 10c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/></svg>`;
const ICONO_BOLSA = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6 4h12l1 16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M5.5 8h13"/><path d="M9 12.5h6"/></svg>`;
const iconoEnvase = (e) => (e === "lata" ? ICONO_LATA : e === "bolsa" ? ICONO_BOLSA : ICONO_TARRO);
async function cargarTarros() {
  tarros = {}; ctx.tarrosOk = false;
  try {
    for (let desde = 0; ; desde += 1000) {
      const { data, error } = await sb.from("tarros").select("*").order("creado").range(desde, desde + 999);
      if (error) throw error;
      data.forEach((t) => { const k = String(t.tabaco_id); (tarros[k] = tarros[k] || []).push(t); });
      if (data.length < 1000) break;
    }
    ctx.tarrosOk = true;
  } catch (e) { console.warn("Tarros no disponibles (falta 24_tarros.sql)", e); }
  ctx.unidadesOk = false;
  if (ctx.tarrosOk && Object.keys(tarros).some((k) => tarros[k].some((t) => "unidades" in t))) { ctx.unidadesOk = true; return; }
  if (ctx.tarrosOk) try {
    const { error } = await sb.from("tarros").select("unidades").limit(1);
    if (error) throw error; ctx.unidadesOk = true;
  } catch (e) { console.warn("Tarros sin cantidad (falta 25_tarros_unidades.sql)", e); }
}
// Meses desde una fecha (año y, si lo hay, mes) hasta hoy.
function mesesDesde(anio, mes) {
  const hoy = new Date();
  return (hoy.getFullYear() - anio) * 12 + (hoy.getMonth() + 1 - (mes || 1));
}
function antiguedad(t) {
  if (!t.fecha_anio) return "";
  const m = mesesDesde(t.fecha_anio, t.fecha_mes);
  if (!t.fecha_mes) {
    const a = new Date().getFullYear() - t.fecha_anio;
    return a <= 0 ? "Este año" : a === 1 ? "Un año" : `Unos ${a} años`;
  }
  if (m <= 0) return t.tipo_fecha === "compra" ? "Recién llegada" : "Este mes";
  const a = Math.floor(m / 12), r = m % 12;
  const txtA = a === 1 ? "1 año" : `${a} años`, txtM = r === 1 ? "1 mes" : `${r} meses`;
  return a ? (r ? `${txtA} y ${txtM}` : txtA) : txtM;
}
const fechaTxt = (anio, mes) => (mes ? `${MESES[mes - 1]} de ${anio}` : String(anio));
function lineaTarro(t) {
  const partes = [];
  if (t.fecha_anio) partes.push(t.tipo_fecha === "lata" ? `Fecha de la lata: ${fechaTxt(t.fecha_anio, t.fecha_mes)}`
    : `${TIPO_FECHA[t.tipo_fecha] || "Embotado"} en ${fechaTxt(t.fecha_anio, t.fecha_mes)}`);
  if (t.abierto_anio) partes.push(`abierto en ${fechaTxt(t.abierto_anio, t.abierto_mes)}`);
  if (t.nota) partes.push(`«${t.nota}»`);
  const det = partes.join(" · ");
  return det.charAt(0).toUpperCase() + det.slice(1);
}
// El envase con la fecha más antigua (o null si ninguno tiene fecha).
function masViejo(lista) {
  const conFecha = lista.filter((t) => t.fecha_anio);
  return conFecha.length ? conFecha.reduce((a, t) => (mesesDesde(t.fecha_anio, t.fecha_mes) > mesesDesde(a.fecha_anio, a.fecha_mes) ? t : a)) : null;
}
// «3 latas», «2 tarros y 1 lata»…
function resumenEnvases(lista) {
  const cuenta = {};
  lista.forEach((t) => { cuenta[t.envase || ""] = (cuenta[t.envase || ""] || 0) + uds(t); });
  const partes = ["lata", "tarro", "bolsa", ""].filter((e) => cuenta[e]).map((e) => `${cuenta[e]} ${NOMBRE_ENV[e][cuenta[e] === 1 ? 0 : 1]}`);
  return partes.length > 1 ? partes.slice(0, -1).join(", ") + " y " + partes[partes.length - 1] : partes[0];
}
function tituloTarro(t) {
  const n = uds(t);
  if (n === 1) return `${ENVASE[t.envase] || "Tabaco"}${t.gramos ? ` · ${gramosTxt(t.gramos)}` : ""}`;
  return `${n} ${ENVASES[t.envase || ""].toLowerCase()}${t.gramos ? ` de ${gramosTxt(t.gramos)} · ${gramosTxt(n * t.gramos)}` : ""}`;
}
function tarrosHTML(id) {
  const lista = tarros[String(id)] || [];
  let abierto = false; try { abierto = localStorage.getItem("herbario-tarros-abiertos") === "1"; } catch (e) {}
  const viejo = masViejo(lista);
  const resumen = lista.length
    ? `<span class="tr-res">${resumenEnvases(lista)} en tu bodega</span>${viejo ? `<span class="tr-viejo">el más antiguo: ${antiguedad(viejo).toLowerCase()}</span>` : ""}`
    : '<span class="tr-res">Apunta tus tarros y latas (opcional)</span>';
  const filas = lista.map((t) => `<li class="tr-item">
      <span class="tr-ic">${iconoEnvase(t.envase)}</span>
      <span class="tr-txt"><span>${esc(tituloTarro(t))}</span>
        ${lineaTarro(t) ? `<span class="muted">${esc(lineaTarro(t))}</span>` : ""}</span>
      <span class="tr-der">${t.fecha_anio ? `<span class="tr-edad">${esc(antiguedad(t))}</span>` : ""}
        <button class="link" type="button" data-tarro="${t.id}">Editar</button></span></li>`).join("");
  return `<details class="tarros" id="tr-box"${abierto ? " open" : ""}>
      <summary><span class="tr-chev" aria-hidden="true">›</span><span class="tr-ic sm">${ICONO_TARRO}</span>${resumen}</summary>
      <div class="tr-cuerpo">
        ${filas ? `<ul class="tr-lista">${filas}</ul>` : '<p class="muted">Apunta cada lata o tarro con sus gramos y su fecha para saber cuánto lleva madurando.</p>'}
        <button class="btn" type="button" id="tr-add">+ Añadir tarro</button>
      </div>
    </details>`;
}
function conectarTarros(id) {
  const box = $("tr-box"); if (!box) return;
  box.addEventListener("toggle", () => { try { localStorage.setItem("herbario-tarros-abiertos", box.open ? "1" : "0"); } catch (e) {} });
  $("tr-add").addEventListener("click", () => formTarro(id, null));
  box.querySelectorAll("[data-tarro]").forEach((b) => b.addEventListener("click", () =>
    formTarro(id, (tarros[String(id)] || []).find((t) => String(t.id) === b.dataset.tarro))));
}
// Recalcula en local lo que la base de datos ya ha recalculado (Lo tengo y los gramos).
function sincronizarLocal(id) {
  const k = String(id), lista = tarros[k] || [];
  const m = bodega[k] || { tengo: false, probado: false, quiero: false, gramos: null };
  if (lista.length) {
    const g = lista.reduce((s, t) => s + (t.gramos || 0) * uds(t), 0);
    bodega[k] = { ...m, tengo: true, gramos: lista.some((t) => t.gramos) ? g : null };
  } else {
    const n = { ...m, tengo: false, gramos: null };
    if (n.probado || n.quiero) bodega[k] = n; else delete bodega[k];
  }
}
function opcionesAnio(sel) {
  const hoy = new Date().getFullYear();
  let h = '<option value="">—</option>';
  for (let a = hoy; a >= 1950; a--) h += `<option value="${a}"${sel === a ? " selected" : ""}>${a}</option>`;
  return h;
}
const opcionesMes = (sel) => '<option value="">Sin mes</option>' + MESES.map((m, i) => `<option value="${i + 1}"${sel === i + 1 ? " selected" : ""}>${m}</option>`).join("");
function formTarro(id, t) {
  const d = findItem(id), v = t || { envase: "tarro", gramos: null, tipo_fecha: "embotado", fecha_anio: null, fecha_mes: null, abierto_anio: null, abierto_mes: null, nota: "" };
  const dlg = document.createElement("div");
  dlg.className = "confirm"; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true"); dlg.setAttribute("aria-labelledby", "tf-title");
  dlg.innerHTML = `<form class="box tarro-form" id="tf-form" novalidate>
      <h2 id="tf-title">${t ? "Editar tarro" : "Añadir tarro"}</h2>
      <p class="muted">${esc(d ? d.nombre + " · " + d.marca : "")}</p>
      <div class="tf-grid">
        <div><label for="tf-env">Envase</label><select id="tf-env">${["tarro", "lata", "bolsa"].map((e) => `<option value="${e}"${v.envase === e ? " selected" : ""}>${ENVASE[e]}</option>`).join("")}${v.envase === "" ? '<option value="" selected>Sin indicar</option>' : ""}</select></div>
        ${ctx.unidadesOk ? `<div><label for="tf-uds">Cuántos</label><input id="tf-uds" type="number" inputmode="numeric" min="1" max="99" step="1" value="${uds(v)}"></div>` : ""}
        <div><label for="tf-gr">${ctx.unidadesOk ? "Gramos de cada uno" : "Gramos"}</label><input id="tf-gr" type="number" inputmode="numeric" min="1" max="100000" step="1" placeholder="Por ejemplo, 100" value="${v.gramos || ""}"></div>
        <div><label for="tf-tipo">Qué fecha es</label><select id="tf-tipo">${Object.entries(TIPO_FECHA).map(([k, x]) => `<option value="${k}"${v.tipo_fecha === k ? " selected" : ""}>${x === "Comprado" ? "Compra" : x}</option>`).join("")}</select></div>
        <div><label for="tf-anio">Año</label><select id="tf-anio">${opcionesAnio(v.fecha_anio)}</select></div>
        <div><label for="tf-mes">Mes (opcional)</label><select id="tf-mes">${opcionesMes(v.fecha_mes)}</select></div>
        ${ctx.unidadesOk ? "" : "<div></div>"}
        <div><label for="tf-aanio">Abierto en (año)</label><select id="tf-aanio">${opcionesAnio(v.abierto_anio)}</select></div>
        <div><label for="tf-ames">Mes</label><select id="tf-ames">${opcionesMes(v.abierto_mes)}</select></div>
      </div>
      <label for="tf-nota">Nota (opcional)</label>
      <input id="tf-nota" type="text" maxlength="80" value="${esc(v.nota || "")}" placeholder="Por ejemplo, para abrir en 2030">
      <p class="msg" id="tf-msg" role="alert"></p>
      <div class="acts"><button class="btn primary" type="submit">Guardar</button><button class="btn" type="button" id="tf-no">Cancelar</button>
        ${t ? '<button class="btn danger" type="button" id="tf-del">Borrar tarro</button>' : ""}</div>
    </form>`;
  document.body.appendChild(dlg);
  const quien = document.activeElement;
  const cerrar = () => { document.removeEventListener("keydown", tecla, true); dlg.remove(); if (quien && quien.focus) quien.focus(); };
  const tecla = (e) => { if (e.key === "Escape") { e.stopPropagation(); cerrar(); } };
  document.addEventListener("keydown", tecla, true);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) cerrar(); });
  const msg = dlg.querySelector("#tf-msg"), q = (s) => dlg.querySelector(s);
  ["#tf-uds", "#tf-gr", "#tf-anio", "#tf-mes", "#tf-aanio", "#tf-ames"].filter((s) => q(s)).forEach((s) => q(s).addEventListener("input", () => { msg.textContent = ""; }));
  q("#tf-no").addEventListener("click", cerrar);
  const terminar = async () => { await cargarTarros(); sincronizarLocal(id); cerrar(); if (String(openId) === String(id)) paintBodega(); else if (document.querySelector(".panel.bodega-p")) abrirBodega(); };
  if (t) q("#tf-del").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    if (!b.dataset.sure) { b.dataset.sure = "1"; b.textContent = "Pulsa otra vez para borrarlo"; return; }
    b.disabled = true;
    const { error } = await sb.from("tarros").delete().eq("id", t.id);
    if (error) { b.disabled = false; msg.textContent = "No se ha podido borrar el tarro."; return; }
    terminar();
  });
  q("#tf-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const num = (s) => (q(s).value.trim() ? Number(q(s).value) : null);
    const ud = ctx.unidadesOk ? num("#tf-uds") : 1;
    if (!(Number.isInteger(ud) && ud >= 1 && ud <= 99)) { msg.textContent = "Escribe cuántos envases iguales tienes (de 1 a 99)."; return; }
    const gr = num("#tf-gr"), fa = num("#tf-anio"), fm = num("#tf-mes"), aa = num("#tf-aanio"), am = num("#tf-ames");
    if (gr !== null && !(Number.isInteger(gr) && gr >= 1 && gr <= 100000)) { msg.textContent = "Escribe los gramos como un número entero (de 1 a 100 000) o déjalo vacío."; return; }
    if (fm && !fa) { msg.textContent = "Si pones el mes, elige también el año."; return; }
    if (am && !aa) { msg.textContent = "Si pones el mes de apertura, elige también el año."; return; }
    if (fa && aa && (aa < fa || (aa === fa && fm && am && am < fm))) { msg.textContent = "La fecha de apertura no puede ser anterior a la del tarro."; return; }
    const fila = { envase: q("#tf-env").value, gramos: gr, tipo_fecha: q("#tf-tipo").value, fecha_anio: fa, fecha_mes: fa ? fm : null,
      abierto_anio: aa, abierto_mes: aa ? am : null, nota: q("#tf-nota").value.trim().slice(0, 80) };
    if (ctx.unidadesOk) fila.unidades = ud;
    const boton = q("button[type=submit]"); boton.disabled = true;
    const { error } = t ? await sb.from("tarros").update(fila).eq("id", t.id)
      : await sb.from("tarros").insert({ ...fila, tabaco_id: String(id), usuario: ctx.uid });
    if (error) { boton.disabled = false; msg.textContent = "No se ha podido guardar el tarro."; return; }
    terminar();
  });
  q("#tf-env").focus();
}
const gramosTxt = (g) => (g ? `${g.toLocaleString("es-ES")} g` : "");
function paintBodega() {
  const box = $("d-bodega"); if (!box || openId == null) return;
  if (!ctx.online || !ctx.session || !ctx.bodega) { box.innerHTML = ""; return; }
  const m = bodega[String(openId)] || {};
  const etiqueta = (k, t) => t + (k === "tengo" && m.tengo && m.gramos ? ` · ${gramosTxt(m.gramos)}` : "");
  box.innerHTML = `<p class="bodega-t">Mi bodega</p><div class="btns bodega" role="group" aria-label="Mi bodega">
      ${BODEGA.map(([k, t]) => `<button class="btn${m[k] ? " primary" : ""}" type="button" data-bod="${k}" aria-pressed="${m[k] ? "true" : "false"}">${ico(k)}<span>${esc(etiqueta(k, t))}</span></button>`).join("")}
    </div>
    ${ctx.tarrosOk ? (m.tengo || (tarros[String(openId)] || []).length ? tarrosHTML(openId) : "")
      : m.tengo && ctx.gramosOk ? `<button class="link bd-cant" type="button" id="bd-gr">${m.gramos ? "Cambiar la cantidad" : "Apuntar cuántos gramos tienes"}</button>` : ""}
    <p class="msg" id="bd-msg" role="alert"></p>`;
  box.querySelectorAll("[data-bod]").forEach((b) => b.addEventListener("click", () => marcarBodega(openId, b.dataset.bod)));
  conectarTarros(openId);
  if ($("bd-gr")) $("bd-gr").addEventListener("click", async () => {
    const g = await pedirGramos(findItem(openId), m.gramos);
    if (g !== undefined) guardarBodega(openId, { ...m, gramos: g });
  });
}
// Confirmación sencilla. Devuelve true si se acepta.
function confirmarBorrado(texto) {
  return new Promise((resolver) => {
    const dlg = document.createElement("div");
    dlg.className = "confirm"; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true"); dlg.setAttribute("aria-labelledby", "cb-title");
    dlg.innerHTML = `<div class="box"><h2 id="cb-title">¿Seguro?</h2><p>${esc(texto)}</p>
      <div class="acts"><button class="btn danger" type="button" id="cb-si">Sí, borrar</button><button class="btn" type="button" id="cb-no">Cancelar</button></div></div>`;
    document.body.appendChild(dlg);
    const quien = document.activeElement;
    const cerrar = (v) => { document.removeEventListener("keydown", tecla, true); dlg.remove(); if (quien && quien.focus) quien.focus(); resolver(v); };
    const tecla = (e) => { if (e.key === "Escape") { e.stopPropagation(); cerrar(false); } };
    document.addEventListener("keydown", tecla, true);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) cerrar(false); });
    dlg.querySelector("#cb-si").addEventListener("click", () => cerrar(true));
    dlg.querySelector("#cb-no").addEventListener("click", () => cerrar(false));
    dlg.querySelector("#cb-no").focus();
  });
}
// Ventanita para apuntar los gramos. Devuelve un número, null (lo deja vacío) o undefined (cancelado).
function pedirGramos(d, actual) {
  return new Promise((resolver) => {
    const dlg = document.createElement("div");
    dlg.className = "confirm"; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-labelledby", "gr-title");
    dlg.innerHTML = `<form class="box" id="gr-form">
        <h2 id="gr-title">¿Cuánto tienes?</h2>
        <p>${esc(d ? d.nombre + " · " + d.marca : "")}</p>
        <label for="gr-in">Cantidad en gramos (opcional)</label>
        <input id="gr-in" type="number" inputmode="numeric" min="1" max="100000" step="1" placeholder="Por ejemplo, 100" value="${actual || ""}">
        <p class="muted">Si lo dejas vacío, no se apunta ninguna cantidad.</p>
        <p class="msg" id="gr-msg" role="alert"></p>
        <div class="acts"><button class="btn primary" type="submit">Guardar</button><button class="btn" type="button" id="gr-no">Cancelar</button></div>
      </form>`;
    document.body.appendChild(dlg);
    const quien = document.activeElement, inp = dlg.querySelector("#gr-in");
    const cerrar = (v) => { document.removeEventListener("keydown", tecla, true); dlg.remove(); if (quien && quien.focus) quien.focus(); resolver(v); };
    const tecla = (e) => { if (e.key === "Escape") { e.stopPropagation(); cerrar(undefined); } };
    document.addEventListener("keydown", tecla, true);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) cerrar(undefined); });
    dlg.querySelector("#gr-no").addEventListener("click", () => cerrar(undefined));
    dlg.querySelector("#gr-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const txt = inp.value.trim();
      if (!txt) { cerrar(null); return; }
      const n = Number(txt);
      if (!Number.isInteger(n) || n < 1 || n > 100000) { dlg.querySelector("#gr-msg").textContent = "Escribe un número entero de gramos (de 1 a 100 000) o déjalo vacío."; return; }
      cerrar(n);
    });
    inp.focus();
  });
}
async function marcarBodega(id, campo) {
  const k = String(id), antes = bodega[k] || { tengo: false, probado: false, quiero: false };
  const nuevo = { ...antes, [campo]: !antes[campo] };
  // Al probarlo, deja de estar en «quiero probarlo».
  if (campo === "probado" && nuevo.probado) nuevo.quiero = false;
  // Con tarros: marcar «Lo tengo» no pregunta nada (los gramos salen de los tarros); al quitarlo
  // se borran sus tarros, pidiendo antes confirmación.
  if (campo === "tengo" && ctx.tarrosOk) {
    const lista = tarros[k] || [];
    if (!nuevo.tengo && lista.length) {
      const ok = await confirmarBorrado(`Si quitas «Lo tengo» se borrarán ${lista.length === 1 ? "tu tarro" : `tus ${lista.length} tarros`} de este tabaco.`);
      if (!ok) return;
      const { error } = await sb.from("tarros").delete().eq("tabaco_id", k).eq("usuario", ctx.uid);
      if (error) { const m = $("bd-msg"); if (m) m.textContent = "No se han podido borrar los tarros."; return; }
      delete tarros[k];
    }
    nuevo.gramos = null;
  } else if (campo === "tengo") {
    if (nuevo.tengo && ctx.gramosOk) {
      const g = await pedirGramos(findItem(id), null);
      if (g === undefined) return;   // cancelado: no se marca
      nuevo.gramos = g;
    } else nuevo.gramos = null;
  }
  await guardarBodega(id, nuevo);
}
async function guardarBodega(id, nuevo) {
  const k = String(id);
  const vacio = !nuevo.tengo && !nuevo.probado && !nuevo.quiero;
  const fila = { tabaco_id: k, usuario: ctx.uid, tengo: !!nuevo.tengo, probado: !!nuevo.probado, quiero: !!nuevo.quiero };
  if (ctx.gramosOk) fila.gramos = nuevo.tengo && nuevo.gramos ? nuevo.gramos : null;
  if (ctx.tarrosOk && (tarros[k] || []).length) { fila.tengo = true; fila.gramos = (bodega[k] || {}).gramos || null; }
  const { error } = vacio
    ? await sb.from("bodega").delete().eq("tabaco_id", k).eq("usuario", ctx.uid)
    : await sb.from("bodega").upsert(fila, { onConflict: "usuario,tabaco_id" });
  if (error) { const m = $("bd-msg"); if (m) m.textContent = "No se ha podido guardar en tu bodega."; return; }
  if (vacio) delete bodega[k]; else bodega[k] = { ...fila, gramos: fila.gramos || null };
  if (String(openId) === k) paintBodega();
}
/* ---------- Mi bodega: la estantería ----------
   Pestañas (tengo, probado, quiero), latas de pie en baldas (rotuladas al ordenar por marca o mezcla),
   latas más pequeñas a partir de BODEGA_COMPACTA tabacos, reparto por tipo de mezcla y tarros madurando. */
const BODEGA_COMPACTA = 16;
const MADURA_TOPE = 120;   // meses: la barra de maduración se llena a los 10 años
const ORDEN_BODEGA = [["gramos", "Más gramos"], ["antiguo", "Más antiguo"], ["marca", "Marca"], ["mezcla", "Tipo de mezcla"], ["nombre", "Nombre"]];
const bodegaVista = { tab: "tengo", orden: "" };
try { const v = JSON.parse(localStorage.getItem("herbario-bodega-vista") || "{}"); if (v.tab) bodegaVista.tab = v.tab; if (v.orden) bodegaVista.orden = v.orden; } catch (e) {}
function guardarVistaBodega() { try { localStorage.setItem("herbario-bodega-vista", JSON.stringify(bodegaVista)); } catch (e) {} }
const edadCorta = (t) => {
  if (!t || !t.fecha_anio) return "";
  const m = mesesDesde(t.fecha_anio, t.fecha_mes);
  if (m <= 0) return t.tipo_fecha === "compra" ? "recién llegada" : "este mes";
  const a = Math.floor(m / 12), r = m % 12;
  return a ? `${a} a${r ? ` ${r} m` : ""}` : `${r} m`;
};
function abrirBodega(fuente) {
  const prueba = fuente && fuente.prueba ? fuente : null;   // bodega inventada (solo admin); los clics pasan un evento
  openId = null;
  const B = prueba ? prueba.bodega : bodega, T = prueba ? prueba.tarros : tarros;
  const conGramos = prueba ? true : ctx.gramosOk, conTarros = prueba ? true : ctx.tarrosOk;
  const info = (d) => B[String(d.id)] || {};
  const listas = Object.fromEntries(BODEGA.map(([k]) => [k, current.filter((d) => info(d)[k])]));
  const tab = BODEGA.some(([k]) => k === bodegaVista.tab) ? bodegaVista.tab : "tengo";
  const orden = bodegaVista.orden || (tab === "tengo" ? "gramos" : "nombre");
  const envasesDe = (d) => (conTarros ? T[String(d.id)] || [] : []);
  const mesesViejo = (d) => { const v = masViejo(envasesDe(d)); return v ? mesesDesde(v.fecha_anio, v.fecha_mes) : -1; };
  const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, "es");
  const comparar = {
    gramos: (a, b) => (info(b).gramos || 0) - (info(a).gramos || 0) || porNombre(a, b),
    antiguo: (a, b) => mesesViejo(b) - mesesViejo(a) || porNombre(a, b),
    marca: (a, b) => a.marca.localeCompare(b.marca, "es") || porNombre(a, b),
    mezcla: (a, b) => (a.tipo || "~").localeCompare(b.tipo || "~", "es") || porNombre(a, b),
    nombre: porNombre,
  }[orden] || porNombre;
  const items = listas[tab].slice().sort(comparar);
  const compacta = items.length >= BODEGA_COMPACTA;

  // Resumen
  const tengo = listas.tengo;
  const totalG = tengo.reduce((s, d) => s + (info(d).gramos || 0), 0);
  const todosEnv = tengo.flatMap((d) => envasesDe(d).map((t) => ({ t, d })));
  const nEnv = todosEnv.reduce((s, x) => s + uds(x.t), 0);
  const conFecha = todosEnv.filter((x) => x.t.fecha_anio)
    .sort((a, b) => mesesDesde(b.t.fecha_anio, b.t.fecha_mes) - mesesDesde(a.t.fecha_anio, a.t.fecha_mes));
  const masMaduro = conFecha[0];
  const casillas = [
    conGramos ? `<div class="bd-casilla principal"><span class="l">Total de tabaco</span><span class="n">${gramosTxt(totalG) || "0 g"}</span><span class="s">en ${tengo.length === 1 ? "1 tabaco" : `${tengo.length} tabacos`}</span></div>` : "",
    conTarros && nEnv ? `<div class="bd-casilla"><span class="l">Envases</span><span class="n">${nEnv}</span><span class="s">${esc(resumenEnvases(todosEnv.map((x) => x.t)))}</span></div>` : "",
    masMaduro ? `<div class="bd-casilla"><span class="l">El que más madura</span><span class="n medio">${esc(masMaduro.d.nombre)}</span><span class="s">${esc(antiguedad(masMaduro.t))} en ${esc(NOMBRE_ENV[masMaduro.t.envase || ""][0])}</span></div>` : "",
    `<div class="bd-casilla"><span class="l">Probados</span><span class="n">${listas.probado.length}</span><span class="s">y ${listas.quiero.length} por probar</span></div>`,
  ].join("");

  // Estantería: grupos rotulados si se ordena por marca o mezcla
  const grupoDe = orden === "marca" ? (d) => d.marca : orden === "mezcla" ? (d) => d.tipo || "Sin tipo de mezcla" : null;
  const grupos = [];
  items.forEach((d) => {
    const g = grupoDe ? grupoDe(d) : "";
    if (!grupos.length || grupos[grupos.length - 1].g !== g) grupos.push({ g, lista: [] });
    grupos[grupos.length - 1].lista.push(d);
  });
  const lata = (d) => {
    const env = envasesDe(d), viejo = masViejo(env), g = info(d).gramos;
    const chip = tab === "tengo" && !compacta
      ? (env.length ? `<span class="bd-chip${viejo && mesesDesde(viejo.fecha_anio, viejo.fecha_mes) >= 12 ? " viejo" : ""}">${esc(resumenEnvases(env))}${viejo ? ` · ${esc(edadCorta(viejo))}` : ""}</span>` : '<span class="bd-chip vacio">Sin envases apuntados</span>')
      : "";
    return `<button class="bd-lata" type="button" data-open="${esc(d.id)}" aria-label="${esc(`${d.nombre}, ${d.marca}${g && tab === "tengo" ? `, ${gramosTxt(g)}` : ""}`)}">
        ${chip}<span class="bd-art" aria-hidden="true">${art(d)}</span><span class="bd-balda" aria-hidden="true"></span>
        <span class="bd-nombre" aria-hidden="true">${esc(d.nombre)}</span>
        ${compacta ? "" : `<span class="bd-marca" aria-hidden="true">${esc(d.marca)}</span>`}
        ${tab === "tengo" && g ? `<span class="bd-gramos" aria-hidden="true">${gramosTxt(g)}</span>` : ""}
      </button>`;
  };
  const vacio = {
    tengo: "Todavía no has marcado ningún tabaco como «Lo tengo». Hazlo desde su ficha.",
    probado: "Todavía no has marcado ningún tabaco como probado.",
    quiero: "Todavía no tienes tabacos pendientes de probar.",
  }[tab];
  const estanteria = items.length
    ? grupos.map((gr) => `<div class="bd-grupo">${gr.g ? `<p class="bd-rotulo"><span>${esc(gr.g)}</span><small>${gr.lista.length}</small></p>` : ""}
        <div class="bd-estante${compacta ? " compacta" : ""}">${gr.lista.map(lata).join("")}</div></div>`).join("")
    : `<p class="bd-vacio">${vacio}</p>`;

  // Por tipo de mezcla (solo en «Lo tengo», con gramos)
  let mezclas = "";
  if (tab === "tengo" && conGramos && totalG) {
    const suma = {};
    tengo.forEach((d) => { const g = info(d).gramos || 0; if (g) suma[d.tipo || ""] = (suma[d.tipo || ""] || 0) + g; });
    const filas = Object.entries(suma).sort((a, b) => b[1] - a[1]);
    const pct = (g) => Math.round(g / totalG * 100);
    const color = (k) => TIPOS[k] || "#8A7D68";
    mezclas = `<section class="bd-mezclas" aria-labelledby="bd-mz-h">
        <div class="bd-sec-h"><h3 id="bd-mz-h">Por tipo de mezcla</h3><span class="muted">sobre ${gramosTxt(totalG)}</span></div>
        <div class="bd-mz-barra" aria-hidden="true">${filas.map(([k, g]) => `<span style="flex:${g};background:${color(k)}"></span>`).join("")}</div>
        <ul class="bd-mz-lista">${filas.map(([k, g]) => `<li><span class="sw" style="background:${color(k)}" aria-hidden="true"></span><span class="t">${esc(k || "Sin tipo de mezcla")}</span><span class="g">${gramosTxt(g)}</span><span class="p">${pct(g)} %</span></li>`).join("")}</ul>
      </section>`;
  }

  // Madurando: cada envase con fecha, del más antiguo al más nuevo; la barra se llena a los 10 años
  let madurando = "";
  if (tab === "tengo" && conTarros) {
    const filas = conFecha.map(({ t, d }) => {
      const m = Math.max(0, mesesDesde(t.fecha_anio, t.fecha_mes));
      const ancho = Math.max(2, Math.min(100, Math.round(m / MADURA_TOPE * 100)));
      return `<li class="bd-md">
          <span class="bd-md-ic" aria-hidden="true"><span class="bd-md-art">${art(d)}</span><span class="bd-md-env">${iconoEnvase(t.envase)}</span></span>
          <span class="bd-md-q"><strong>${esc(d.nombre)}</strong><span class="muted">${esc(tituloTarro(t))}</span></span>
          <span class="bd-md-f muted">${esc(lineaTarro(t))}</span>
          <span class="bd-md-e"><span class="bd-md-b"><span style="width:${ancho}%"></span></span><span class="muted">${esc(antiguedad(t))}</span></span>
          ${prueba ? "" : `<button class="link" type="button" data-tarro="${esc(t.id)}" data-tabaco="${esc(d.id)}">Editar</button>`}
        </li>`;
    }).join("");
    madurando = `<div class="d-orn" aria-hidden="true"><span></span>${ico("hoja")}<span></span></div>
      <section class="bd-madura" aria-labelledby="bd-md-h">
        <div class="bd-sec-h"><h3 id="bd-md-h">Madurando en la bodega</h3></div>
        ${filas ? `<ul class="bd-md-lista">${filas}</ul><p class="muted">La barra se llena a los 10 años. Los tarros y latas se apuntan desde la ficha de cada tabaco.</p>`
          : '<p class="muted">Cuando apuntes un tarro o una lata con su fecha desde la ficha de un tabaco, aquí verás cuánto lleva madurando.</p>'}
      </section>`;
  }

  abrirPanel(`
    <div class="d-franja">${FRANJA}</div>
    <div class="bd-cab">
      <span class="bd-baul" aria-hidden="true">${ICONO_BAUL}</span>
      <div>${prueba ? `<h2 id="d-name">Bodega de ${esc(prueba.nombre)}</h2><p class="muted">Bodega de prueba con datos inventados. Solo la ves tú y no se guarda nada.</p>`
        : '<h2 id="d-name">Mi bodega</h2><p class="muted">Solo tú ves esta lista. Marca tus tabacos desde su ficha.</p>'}</div>
    </div>
    <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
    <div class="bd-cuerpo">
      ${prueba ? `<div class="bd-prueba"><span>Estás viendo una bodega de prueba: ${prueba.n} tabacos elegidos al azar.</span>
        <span class="btns"><button class="btn" type="button" id="bd-barajar">Barajar de nuevo</button><button class="btn" type="button" id="bd-salir-prueba">Volver a mi bodega</button></span></div>` : ""}
      <div class="bd-casillas">${casillas}</div>
      <div class="bd-barra">
        <div class="bd-tabs" role="tablist" aria-label="Listas de la bodega">
          ${BODEGA.map(([k, t]) => `<button role="tab" type="button" data-tab="${k}" aria-selected="${k === tab}">${t} <span>${listas[k].length}</span></button>`).join("")}
        </div>
        <label class="bd-orden">Ordenar por
          <select id="bd-orden">${ORDEN_BODEGA.filter(([k]) => tab === "tengo" || (k !== "gramos" && k !== "antiguo")).map(([k, t]) => `<option value="${k}"${k === orden ? " selected" : ""}>${t}</option>`).join("")}</select>
        </label>
      </div>
      <div class="bd-estanteria" role="tabpanel">${estanteria}</div>
      ${mezclas}
      ${madurando}
    </div>`, "bodega-p");
  $("d-close").addEventListener("click", () => closeDetail());
  const panel = $("panel");
  panel.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => openDetail(b.dataset.open)));
  panel.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => {
    bodegaVista.tab = b.dataset.tab; bodegaVista.orden = ""; guardarVistaBodega(); abrirBodega(prueba);
    const nuevo = panel.querySelector(`[data-tab="${b.dataset.tab}"]`); if (nuevo) nuevo.focus();
  }));
  $("bd-orden").addEventListener("change", (e) => { bodegaVista.orden = e.target.value; guardarVistaBodega(); abrirBodega(prueba); $("bd-orden").focus(); });
  if (prueba) {
    $("bd-barajar").addEventListener("click", () => abrirBodega(bodegaDePrueba()));
    $("bd-salir-prueba").addEventListener("click", () => abrirBodega());
  }
  panel.querySelectorAll("[data-tarro]").forEach((b) => b.addEventListener("click", () =>
    formTarro(b.dataset.tabaco, (tarros[b.dataset.tabaco] || []).find((t) => String(t.id) === b.dataset.tarro))));
}

/* Bodega de prueba de «Saruman Blanco» (solo admin, desde Mi cuenta). Se inventa en el navegador:
   unos 100 tabacos al azar con gramos, tarros y fechas. No se guarda nada en la base de datos. */
function bodegaDePrueba() {
  const azar = (n) => Math.floor(Math.random() * n);
  const elige = (l) => l[azar(l.length)];
  const lista = current.slice();
  for (let i = lista.length - 1; i > 0; i--) { const j = azar(i + 1); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  const n = Math.min(lista.length, 95 + azar(11));
  const B = {}, T = {};
  const hoy = new Date(); let idT = 1;
  lista.slice(0, n).forEach((d, i) => {
    const k = String(d.id), r = i / n;
    const m = r < 0.6 ? { tengo: true, probado: Math.random() < 0.5, quiero: false }
      : r < 0.82 ? { tengo: false, probado: true, quiero: false } : { tengo: false, probado: false, quiero: true };
    if (m.tengo) {
      const env = [];
      const cuantos = Math.random() < 0.15 ? 0 : 1 + (Math.random() < 0.3 ? 1 : 0);
      for (let e = 0; e < cuantos; e++) {
        const envase = elige(["tarro", "tarro", "lata", "lata", "bolsa"]);
        const anio = hoy.getFullYear() - azar(azar(3) === 0 ? 14 : 5);
        const mes = anio === hoy.getFullYear() ? 1 + azar(hoy.getMonth() + 1) : 1 + azar(12);
        env.push({ id: "p" + idT++, envase, unidades: 1 + (Math.random() < 0.25 ? 1 + azar(3) : 0),
          gramos: envase === "lata" ? elige([50, 50, 100, 57, 227]) : envase === "bolsa" ? elige([40, 50, 100]) : elige([50, 100, 100, 150, 250]),
          tipo_fecha: envase === "tarro" ? "embotado" : envase === "lata" ? elige(["lata", "compra"]) : "compra",
          fecha_anio: anio, fecha_mes: Math.random() < 0.85 ? mes : null, abierto_anio: null, abierto_mes: null, nota: "" });
      }
      T[k] = env;
      m.gramos = env.length ? env.reduce((s2, t) => s2 + t.gramos * uds(t), 0) : (Math.random() < 0.7 ? elige([50, 100, 200]) : null);
    }
    B[k] = m;
  });
  return { prueba: true, nombre: "Saruman Blanco", n, bodega: B, tarros: T };
}
/* ---------- Mi cuenta ----------
   Nombre visible y foto de perfil (13_mi_cuenta.sql). Si ese SQL aún no se ha ejecutado,
   Mi cuenta sigue funcionando sin esas dos opciones. */
// Baúl para el botón de Mi bodega (mismo círculo que la foto de Mi cuenta).
const ICONO_BAUL = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 10.5V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2.5"/><rect x="3" y="10.5" width="18" height="9.5" rx="1.6"/>
  <path d="M3 13.5h18M8 4.4v6.1M16 4.4v6.1"/><rect x="10.3" y="12.2" width="3.4" height="3.6" rx=".6" fill="currentColor" stroke="none"/></svg>`;
const ROL_TXT = { admin: "Administrador", editor: "Editor", lector: "Lector", suspendido: "Suspendida" };
async function cargarPerfil() {
  ctx.perfil = { nombre: "", avatar: "" }; ctx.perfilOk = false;
  ctx.socioOk = false;
  if (!sb || !ctx.session) return;
  // Las dos consultas van a la vez (la segunda falla si aún no se ha ejecutado el 23).
  const [perfil, socio] = await Promise.all([
    sb.from("perfiles").select("nombre,avatar").eq("id", ctx.uid).maybeSingle(),
    sb.from("perfiles").select("socio,socio_desde").eq("id", ctx.uid).maybeSingle(),
  ]);
  try {
    const { data, error } = perfil;
    if (error) throw error;
    ctx.perfil = { nombre: (data && data.nombre) || "", avatar: fotoSegura((data && data.avatar) || "") };
    ctx.perfilOk = true;
  } catch (e) { console.warn("Perfil sin nombre ni foto (falta 13_mi_cuenta.sql)", e); }
  try {
    const { data, error } = socio;
    if (error) throw error;
    ctx.perfil.socio = !!(data && data.socio); ctx.perfil.socioDesde = (data && data.socio_desde) || null;
    ctx.socioOk = true;
  } catch (e) { console.warn("Sin datos de socio (falta 23_socios_del_club.sql)", e); }
}
function avatarHTML(grande) {
  const cls = grande ? "avatar big" : "avatar";
  if (ctx.perfil.avatar) return `<img class="${cls}" src="${esc(ctx.perfil.avatar)}" alt="">`;
  const letra = (ctx.perfil.nombre || ctx.email || "?").trim().charAt(0).toUpperCase();
  return `<span class="${cls}" aria-hidden="true">${esc(letra)}</span>`;
}
/* ---------- Instalar en el móvil ---------- */
let avisoInstalar = null;   // Android/Chrome: el aviso de instalación se guarda para lanzarlo desde Mi cuenta
// Chrome avisa unos segundos después de cargar; si Mi cuenta ya está abierta, se repinta para enseñar el botón.
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); avisoInstalar = e;
  if (document.querySelector(".panel.cuenta-p") && !document.getElementById("cu-instalar")) abrirCuenta();
});
window.addEventListener("appinstalled", () => { avisoInstalar = null; });
const enApp = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
function instalacionHTML() {
  if (enApp()) return "";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (avisoInstalar) return `<div class="instalar"><strong>Llévate el herbario en el móvil</strong>
      <span class="muted">Instálalo como una app, con el logo del club en tu pantalla de inicio.</span>
      <button class="btn" id="cu-instalar" type="button">Instalar la app</button></div>`;
  if (ios) return `<div class="instalar"><strong>Llévate el herbario en el móvil</strong>
      <span class="muted">En Safari, pulsa Compartir y luego «Añadir a pantalla de inicio».</span></div>`;
  return `<div class="instalar"><strong>Llévate el herbario en el móvil</strong>
      <span class="muted">Ábrelo en el móvil y, en el menú del navegador, elige «Instalar app» o «Añadir a pantalla de inicio».</span></div>`;
}
function abrirCuenta() {
  const p = ctx.perfil;
  const nombre = p.nombre || ctx.email;
  const socio = ctx.socioOk && p.socio;
  const nRes = ctx.opiniones ? resenasDe(ctx.uid) : 0, r = rangoDe(nRes);
  // Bodega: lo que tiene y cuántos gramos
  const tengo = ctx.bodega ? current.filter((d) => (bodega[String(d.id)] || {}).tengo) : [];
  const gramos = tengo.reduce((s2, d) => s2 + ((bodega[String(d.id)] || {}).gramos || 0), 0);
  // Camino de rangos: paradas con el número de reseñas de cada una
  let camino = "";
  if (ctx.opiniones) {
    const hasta = r.sig ? r.sig[1] : null;
    const avance = r.sig ? Math.max(0, Math.min(1, (nRes - r.desde) / (hasta - r.desde))) : 0;
    const relleno = r.i < 0 ? avance * 0 : Math.min(4, r.i + avance) * 20;   // 20 % entre parada y parada
    camino = `<div class="cu-camino-c">
        <div class="cu-sec-h"><span class="cu-et">Tu camino en el herbario</span><span class="muted">${nRes === 1 ? "1 reseña publicada" : `${nRes} reseñas publicadas`}</span></div>
        <div class="cu-camino-w"><span class="cu-linea" aria-hidden="true"><span style="width:${relleno}%"></span></span>
        <ol class="cu-camino" aria-label="Rangos del herbario">
          ${RANGOS.map(([n, u], i) => `<li class="${i < r.i ? "hecho" : i === r.i ? "aqui" : ""}"${i === r.i ? ' aria-current="step"' : ""}><span class="cu-parada">${u}</span><span class="cu-rn">${esc(n)}</span></li>`).join("")}
        </ol></div>
        <p class="cu-falta">${r.sig ? `Te ${hasta - nRes === 1 ? "falta <strong>1 reseña</strong>" : `faltan <strong>${hasta - nRes} reseñas</strong>`} para ser <strong>${esc(r.sig[0])}</strong>.` : "Has llegado al rango más alto del herbario."}</p>
      </div>`;
  }
  abrirPanel(`
    <div class="d-franja">${FRANJA}</div>
    <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
    <div class="cu-cab">
      <div class="cu-puerta"><div class="cu-piedras">${avatarHTML(true)}</div></div>
      <div class="cu-quien">
        <h2 id="d-name">${esc(nombre)}</h2>
        <p class="cu-chips"><span class="muted">${esc(ctx.email)}</span>
          <span class="cu-chip rol">${esc(ROL_TXT[ctx.rol] || ctx.rol)}</span>
          ${ctx.opiniones && r.i >= 0 ? `<span class="cu-chip rango">${esc(r.nombre)}</span>` : ""}</p>
      </div>
      ${ctx.perfilOk ? `<div class="cu-foto btns">
        <button class="btn" id="av-pick" type="button"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>${p.avatar ? "Cambiar foto" : "Subir foto"}</button>
        ${p.avatar ? '<button class="btn danger" id="av-del" type="button">Quitar foto</button>' : ""}
        <input id="av-file" type="file" accept="image/jpeg,image/png,image/webp" hidden>
      </div>` : ""}
    </div>
    <div class="cu-cuerpo">
      ${socio || camino ? `<div class="cu-fila${socio && camino ? " dos" : ""}">
        ${socio ? `<div class="cu-carne">
          <img src="img/logo.png" alt="" width="92" height="92">
          <div><span class="cu-et">Carné de socio</span>
            <span class="cu-club">Pipa Club Fumadas Hobbit</span>
            <strong>${esc(nombre)}</strong>
            <span>${p.socioDesde ? `Socio desde ${p.socioDesde}` : "Socio del club"}</span></div>
        </div>` : ""}
        ${camino}
      </div>` : ""}
      <div class="cu-casillas">
        ${ctx.opiniones ? `<div class="bd-casilla"><span class="l">Reseñas publicadas</span><span class="n">${nRes}</span><span class="s">Firmadas como «${esc(nombre)}»</span></div>` : ""}
        ${ctx.bodega ? `<button class="bd-casilla principal cu-ir" type="button" id="cu-bodega"><span class="l">Mi bodega</span><span class="n">${ctx.gramosOk && gramos ? gramosTxt(gramos) : tengo.length}</span><span class="s">${ctx.gramosOk && gramos ? `${tengo.length === 1 ? "1 tabaco" : `${tengo.length} tabacos`} · ` : (tengo.length === 1 ? "tabaco · " : "tabacos · ")}Abrir la estantería ›</span></button>` : ""}
        ${esAdmin() ? `<div class="bd-casilla cu-admin"><span class="l">Solo administrador</span><button class="btn" id="cu-saruman" type="button">Bodega de prueba: Saruman Blanco</button>
          <button class="btn" id="cu-minis" type="button">Crear las miniaturas que faltan</button><p class="muted" id="cu-minis-msg" role="status"></p></div>` : ""}
      </div>
      <div class="d-orn" aria-hidden="true"><span></span>${ico("hoja")}<span></span></div>
      <div class="cu-abajo">
        <section class="cu-datos" aria-labelledby="cu-datos-h">
          <h3 id="cu-datos-h">Tus datos</h3>
          ${ctx.perfilOk ? `<form id="nm-form" class="cuenta-nombre">
            <label for="nm-in">Nombre visible en tus reseñas</label>
            <div class="btns"><input id="nm-in" maxlength="40" value="${esc(p.nombre)}" placeholder="Cómo quieres que te vean">
            <button class="btn primary" type="submit">Guardar</button></div>
          </form>` : '<p class="muted">El nombre visible y la foto de perfil estarán disponibles pronto.</p>'}
          <p class="msg" id="cu-msg" role="alert"></p>
          <div class="btns">
            <button class="btn" id="cu-pass" type="button">Cambiar contraseña</button>
            <button class="btn danger" id="cu-out" type="button">Salir</button>
          </div>
        </section>
        ${instalacionHTML()}
      </div>
    </div>`, "cuenta-p");
  $("d-close").addEventListener("click", () => closeDetail());
  $("cu-out").addEventListener("click", async () => { closeDetail(); await sb.auth.signOut(); });
  $("cu-pass").addEventListener("click", () => { closeDetail(); pedirNuevaPass(); });
  if ($("cu-bodega")) $("cu-bodega").addEventListener("click", () => abrirBodega());
  if ($("cu-saruman")) $("cu-saruman").addEventListener("click", () => { if (esAdmin()) abrirBodega(bodegaDePrueba()); });
  if ($("cu-minis")) $("cu-minis").addEventListener("click", crearMiniaturasQueFaltan);
  if ($("cu-instalar")) $("cu-instalar").addEventListener("click", async () => {
    if (!avisoInstalar) return;
    avisoInstalar.prompt(); await avisoInstalar.userChoice; avisoInstalar = null; abrirCuenta();
  });
  if (!ctx.perfilOk) return;
  $("av-pick").addEventListener("click", () => $("av-file").click());
  $("av-file").addEventListener("change", (e) => { const f = e.target.files && e.target.files[0]; if (f) subirAvatar(f); });
  if ($("av-del")) $("av-del").addEventListener("click", () => guardarPerfil(ctx.perfil.nombre, "", "Foto quitada."));
  $("nm-form").addEventListener("submit", (e) => { e.preventDefault(); guardarPerfil($("nm-in").value, ctx.perfil.avatar, "Nombre guardado."); });
}
// Recorta la foto al centro en un cuadrado de 320 px.
async function cuadrarAvatar(file) {
  const bmp = await createImageBitmap(file);
  const lado = Math.min(bmp.width, bmp.height), t = 320;
  const c = document.createElement("canvas"); c.width = t; c.height = t;
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, t, t);
  g.drawImage(bmp, (bmp.width - lado) / 2, (bmp.height - lado) / 2, lado, lado, 0, 0, t, t);
  return await new Promise((r) => c.toBlob(r, "image/jpeg", 0.88));
}
function rutaAvatar(url) {
  const marca = "/storage/v1/object/public/avatares/";
  const i = (url || "").indexOf(marca);
  return i >= 0 ? decodeURIComponent(url.slice(i + marca.length)) : "";
}
async function subirAvatar(file) {
  const msg = $("cu-msg");
  if (file.size > 20 * 1024 * 1024) { msg.textContent = "La foto pesa demasiado (máximo 20 MB)."; return; }
  msg.style.color = "var(--muted)"; msg.textContent = "Subiendo foto…";
  try {
    const blob = await cuadrarAvatar(file);
    if (!blob) throw new Error("imagen");
    const ruta = `${ctx.uid}/${Date.now()}.jpg`;
    const up = await sb.storage.from("avatares").upload(ruta, blob, { contentType: "image/jpeg", upsert: false, cacheControl: "31536000" });
    if (up.error) throw up.error;
    const url = sb.storage.from("avatares").getPublicUrl(ruta).data.publicUrl;
    await guardarPerfil(ctx.perfil.nombre, url, "Foto actualizada.");
  } catch (e) {
    console.error(e);
    msg.style.color = ""; msg.textContent = "No se ha podido subir la foto. Prueba con otra imagen (JPG, PNG o WebP).";
  }
}
async function guardarPerfil(nombre, avatar, ok) {
  const msg = $("cu-msg"), anterior = ctx.perfil.avatar;
  const { error } = await sb.rpc("actualizar_mi_perfil", { p_nombre: nombre, p_avatar: avatar });
  if (error) { msg.style.color = ""; msg.textContent = "No se ha podido guardar."; return; }
  ctx.perfil = { nombre: String(nombre || "").trim(), avatar };
  if (anterior && anterior !== avatar) {
    const r = rutaAvatar(anterior);
    if (r.startsWith(ctx.uid + "/")) { try { await sb.storage.from("avatares").remove([r]); } catch (e) {} }
  }
  paintTop(); abrirCuenta();
  const m = $("cu-msg"); if (m) { m.style.color = "var(--accent)"; m.textContent = ok; }
}

/* ---------- Acceso (correo y contraseña) ---------- */
function abrirLogin() {
  $("lg-msg").textContent = ""; $("lg-msg").style.color = "";
  ["lg-send", "lg-new", "lg-forgot"].forEach((id) => ($(id).disabled = false));
  $("lg-form").hidden = false; $("np-form").hidden = true;
  $("lg-title").textContent = "Entrar en el herbario";
  $("lg-text").textContent = "Entra con tu correo y contraseña. Si es la primera vez, crea tu cuenta: con ella puedes escribir reseñas.";
  $("lg-nombre-f").hidden = true; $("lg-send").hidden = false; $("lg-forgot").hidden = false; $("lg-new").classList.remove("primary");
  $("login").hidden = false; $("lg-email").focus();
}
function cerrarLogin() { $("login").hidden = true; }
function datosLogin(conPass) {
  const email = $("lg-email").value.trim(), pass = $("lg-pass").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("lg-msg").textContent = "Escribe un correo válido."; return null; }
  if (conPass && pass.length < 8) { $("lg-msg").textContent = "La contraseña debe tener al menos 8 caracteres."; return null; }
  $("lg-msg").textContent = ""; return { email, password: pass };
}
function errorLogin(err) {
  const m = (err && err.message) || "";
  if (/banned/i.test(m)) return "Tu cuenta está suspendida. Si crees que es un error, habla con el administrador del herbario.";
  if (/invalid login/i.test(m)) return "Correo o contraseña incorrectos.";
  if (/not confirmed/i.test(m)) return "Tienes que confirmar tu correo antes de entrar. Busca el mensaje en tu bandeja de entrada.";
  if (/already registered/i.test(m)) return "Ya existe una cuenta con ese correo. Pulsa «Entrar».";
  if (/rate limit|too many/i.test(m)) return "Demasiados intentos. Espera unos minutos.";
  if (/not authorized/i.test(m)) return "El servidor de correo aún no está configurado para enviar a esta dirección. Avisa al administrador.";
  return "No se ha podido completar. Inténtalo de nuevo.";
}
async function entrar(ev) {
  ev.preventDefault();
  const d = datosLogin(true); if (!d) return;
  $("lg-send").disabled = true;
  $("lg-msg").style.color = "var(--muted)"; $("lg-msg").textContent = "Entrando…";
  let res;
  try { res = await sb.auth.signInWithPassword(d); }
  catch (e) { res = { error: e }; }
  $("lg-send").disabled = false;
  $("lg-msg").style.color = "";
  if (res.error) { console.error(res.error); $("lg-msg").textContent = errorLogin(res.error); }
  else { $("lg-msg").textContent = ""; cerrarLogin(); }
}
async function crearCuenta() {
  // Primera pulsación: se pide también el nombre público.
  if ($("lg-nombre-f").hidden) {
    $("lg-nombre-f").hidden = false; $("lg-send").hidden = true; $("lg-forgot").hidden = true;
    $("lg-new").classList.add("primary");
    $("lg-title").textContent = "Crear cuenta";
    $("lg-text").textContent = "Escribe tu correo, una contraseña y el nombre público que verán los demás en tus reseñas.";
    $("lg-msg").textContent = ""; $("lg-msg").style.color = "";
    $("lg-nombre").focus(); return;
  }
  const nombre = $("lg-nombre").value.trim();
  if (nombre.length < 2 || nombre.length > 40) { $("lg-msg").textContent = "Escribe un nombre público de 2 a 40 caracteres."; $("lg-nombre").focus(); return; }
  const d = datosLogin(true); if (!d) return;
  $("lg-new").disabled = true;
  const { data, error } = await sb.auth.signUp(Object.assign(d, { options: { emailRedirectTo: location.origin + location.pathname, data: { nombre } } }));
  $("lg-new").disabled = false;
  if (error) { $("lg-msg").textContent = errorLogin(error); return; }
  // Si la cuenta queda abierta al momento, se guarda también el nombre en el perfil (por si falta el SQL 21).
  if (data.session) { try { await sb.rpc("actualizar_mi_perfil", { p_nombre: nombre, p_avatar: "" }); } catch (e) {} }
  if (!data.session) { $("lg-msg").style.color = "var(--accent)"; $("lg-msg").textContent = "Cuenta creada. Revisa tu correo y pulsa el enlace de confirmación para poder entrar."; }
}
async function olvido() {
  const d = datosLogin(false); if (!d) return;
  $("lg-forgot").disabled = true;
  const { error } = await sb.auth.resetPasswordForEmail(d.email, { redirectTo: location.origin + location.pathname });
  $("lg-forgot").disabled = false;
  if (error) { $("lg-msg").textContent = errorLogin(error); return; }
  $("lg-msg").style.color = "var(--accent)"; $("lg-msg").textContent = "Si la cuenta existe, te llegará un correo para cambiar la contraseña.";
}
function pedirNuevaPass() {
  $("login").hidden = false; $("lg-form").hidden = true; $("np-form").hidden = false;
  $("lg-title").textContent = "Nueva contraseña"; $("lg-text").textContent = "Escribe la contraseña que quieres usar a partir de ahora.";
  $("np-pass").focus();
}
async function guardarNuevaPass(ev) {
  ev.preventDefault();
  const p = $("np-pass").value;
  if (p.length < 8) { $("np-msg").textContent = "Mínimo 8 caracteres."; return; }
  const { error } = await sb.auth.updateUser({ password: p });
  if (error) { $("np-msg").textContent = "No se ha podido cambiar la contraseña."; return; }
  cerrarLogin();
}
async function leerSesion(session) {
  ctx.session = session || null;
  ctx.email = session ? session.user.email || "" : "";
  ctx.uid = session ? session.user.id : "";
  ctx.rol = "anonimo";
  const rol = async () => {
    if (!session || !sb) return;
    const { data, error } = await sb.rpc("mi_rol");
    if (!error && typeof data === "string") ctx.rol = data;
  };
  await Promise.all([rol(), cargarPerfil()]);
  marcarVisita();
  await Promise.all([contarPendientes(), contarUsuariosNuevos()]);
}
async function contarPendientes() {
  ctx.pendientes = 0; ctx.misPendientes = 0;
  if (!sb || !ctx.session) return;
  if (ctx.rol === "admin") {
    const { count } = await sb.from("propuestas").select("id", { count: "exact", head: true }).eq("estado", "pendiente");
    ctx.pendientes = count || 0;
  } else if (ctx.rol === "editor") {
    const { count } = await sb.from("propuestas").select("id", { count: "exact", head: true }).eq("estado", "pendiente").eq("autor", ctx.uid);
    ctx.misPendientes = count || 0;
  }
}

/* Barra superior (botones por rol) y pie (estado de la sesión) */
function paintTop() {
  const bar = $("admin-bar");
  if (esAdmin()) {
    bar.innerHTML = `<button class="btn" id="rv-open" type="button">Revisar${ctx.pendientes ? ` (${ctx.pendientes})` : ""}</button>
      <button class="btn" id="hi-open" type="button">Historial</button>
      <button class="btn primary" id="add-open" type="button">Añadir tabaco</button>`;
    $("rv-open").addEventListener("click", abrirRevision);
    $("hi-open").addEventListener("click", abrirHistorial);
    $("add-open").addEventListener("click", () => openEditor(null));
  } else if (esEditor()) {
    bar.innerHTML = `${ctx.misPendientes ? `<button class="btn" id="mp-open" type="button">Mis propuestas (${ctx.misPendientes} pendientes)</button>` : ""}
      <button class="btn primary" id="add-open" type="button">Añadir tabaco</button>`;
    if ($("mp-open")) $("mp-open").addEventListener("click", abrirMisPropuestas);
    $("add-open").addEventListener("click", () => openEditor(null));
  } else bar.innerHTML = "";

  const st = $("status"), top = $("cuenta-top");
  if (!CONFIGURADO) { st.textContent = "Base de datos sin configurar: catálogo de solo lectura."; top.innerHTML = ""; return; }
  st.textContent = ctx.online ? "" : (ctx.aviso || "");
  if (ctx.session) {
    top.innerHTML = (ctx.online && esAdmin()
        ? `<button class="btn cuenta-btn us-top" id="us-open" type="button" aria-label="Usuarios${ctx.usuariosNuevos ? ` (${ctx.usuariosNuevos} nuevos)` : ""}" title="Usuarios"><span class="avatar" aria-hidden="true">${ICONO_VECINOS}</span><span>Usuarios</span>${ctx.usuariosNuevos ? `<span class="us-badge" title="Usuarios nuevos desde tu última visita">${ctx.usuariosNuevos}<span class="sr"> nuevos</span></span>` : ""}</button>` : "")
      + (ctx.online && ctx.bodega
        ? `<button class="btn cuenta-btn" id="bd-open" type="button"><span class="avatar" aria-hidden="true">${ICONO_BAUL}</span><span>Mi bodega</span></button>` : "")
      + `<button class="btn cuenta-btn" id="cu-open" type="button" aria-label="Mi cuenta">${avatarHTML()}<span>Mi cuenta</span></button>`;
    if ($("bd-open")) $("bd-open").addEventListener("click", abrirBodega);
    if ($("us-open")) $("us-open").addEventListener("click", abrirUsuarios);
    $("cu-open").addEventListener("click", abrirCuenta);
  } else {
    top.innerHTML = '<button class="btn primary" id="in" type="button">Entrar</button>';
    $("in").addEventListener("click", abrirLogin);
  }
}

/* ---------- Eventos globales ---------- */
$("grid").addEventListener("click", (e) => { const b = e.target.closest(".card"); if (b) openDetail(b.dataset.id); });
$("pager").addEventListener("click", (e) => { const b = e.target.closest("button[data-page]"); if (b && !b.disabled) irAPagina(Number(b.dataset.page)); });
$("overlay").addEventListener("click", (e) => { if (e.target === $("overlay")) closeDetail(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("confirm").hidden) closeConfirm(); else if (!$("login").hidden) cerrarLogin(); else if (!$("overlay").hidden) closeDetail();
});
$("cf-no").addEventListener("click", closeConfirm);
$("cf-yes").addEventListener("click", doDelete);
$("confirm").addEventListener("click", (e) => { if (e.target === $("confirm")) closeConfirm(); });
$("lg-form").addEventListener("submit", entrar);
$("lg-new").addEventListener("click", crearCuenta);
$("lg-forgot").addEventListener("click", olvido);
$("np-form").addEventListener("submit", guardarNuevaPass);
$("lg-cancel").addEventListener("click", cerrarLogin);
$("login").addEventListener("click", (e) => { if (e.target === $("login")) cerrarLogin(); });

/* ---------- Contador de visitas (pie de página) ----------
   Cuenta una visita por sesión del navegador. El país sale de la zona horaria (zonas.js):
   no se usa la IP ni servicios externos, y solo se guarda el total por país. */
async function contarVisita() {
  if (!sb) return;
  let ya = false;
  try { ya = sessionStorage.getItem("herbario-visita") === "1"; } catch (e) {}
  let pais = "";
  try { pais = (window.ZONA_PAIS || {})[Intl.DateTimeFormat().resolvedOptions().timeZone] || ""; } catch (e) {}
  const { data, error } = await sb.rpc("registrar_visita", { p_pais: pais, p_contar: !ya });
  if (error || !data) return;   // si aún no se ha ejecutado 06_visitas.sql, no se muestra nada
  if (!ya) { try { sessionStorage.setItem("herbario-visita", "1"); } catch (e) {} }
  const n = (x) => Number(x || 0).toLocaleString("es-ES");
  const total = Number(data.total || 0), paises = Number(data.paises || 0);
  if (!total) return;
  $("visitas").textContent = `${n(total)} ${total === 1 ? "visita" : "visitas"}` +
    (paises ? ` desde ${n(paises)} ${paises === 1 ? "país" : "países"}` : "");
  $("visitas").hidden = false;
}

/* ---------- Arranque ---------- */
(async function iniciar() {
  setupFilters();
  usarRespaldo(); fillFilters(); render(); paintTop();   // se ve algo al instante
  abrirFichaDeUrl();                                      // quien entra por el enlace de una ficha
  if (!sb) return;
  contarVisita();
  const { data } = await sb.auth.getSession();
  await leerSesion(data && data.session);
  await refrescar();
  abrirFichaDeUrl();   // por si la ficha solo está en Supabase (no en la copia de respaldo)
  // Importante: no se puede llamar a Supabase dentro de este aviso, porque la librería se bloquea
  // (fallo conocido de supabase-js). Por eso el trabajo se aplaza con setTimeout.
  sb.auth.onAuthStateChange((ev, session) => {
    if (ev === "INITIAL_SESSION" || ev === "TOKEN_REFRESHED") return;
    setTimeout(async () => {
      await leerSesion(session);
      if (ev === "PASSWORD_RECOVERY") { paintTop(); pedirNuevaPass(); return; }
      if (ev === "SIGNED_IN") cerrarLogin();
      if (!$("overlay").hidden) closeDetail();
      await refrescar();
    }, 0);
  });
})();

// Service worker: guarda la web para que abra rápido e instalable en el móvil.
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("sw.js").catch((e) => console.warn("Sin service worker", e));
}
