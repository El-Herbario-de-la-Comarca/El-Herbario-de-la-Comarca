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
  ["pais", "País"], ["formato", "Formato"], ["notas", "Notas"], ["descripcion", "Descripción"]];

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
const ctx = { online: false, session: null, email: "", uid: "", rol: "anonimo", pendientes: 0, misPendientes: 0 };
const esAdmin = () => ctx.online && ctx.rol === "admin";
const esEditor = () => ctx.online && (ctx.rol === "admin" || ctx.rol === "editor");

/* ---------- Estado ---------- */
let current = [];   // fichas
let opiniones = {};   // tabaco_id -> [{ id, autor, firma, score, texto, creado, actualizado }]
let openId = null, lastFocus = null;

function mapItem(r) {
  const notas = Array.isArray(r.notas) ? r.notas.filter((n) => typeof n === "string" && n.trim()).map((n) => n.trim().slice(0, 40)).slice(0, 12) : [];
  const f = Number(r.fuerza);
  const hojas = Array.isArray(r.hojas) ? HOJAS.filter((h) => r.hojas.includes(h)) : [];
  return {
    id: String(r.id), nombre: str(r.nombre, 120), marca: str(r.marca, 80), tipo: str(r.tipo, 40), corte: str(r.corte, 40),
    pais: str(r.pais, 60), formato: str(r.formato, 80), desc: str(r.descripcion, 2000),
    fuerza: Number.isInteger(f) && f >= 1 && f <= 5 ? f : 0, notas, hojas, foto: str(r.foto, 500),
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
async function cargarTodo() {
  if (!sb) { usarRespaldo(); return; }
  try {
    const filas = [];
    for (let desde = 0; ; desde += 1000) {
      const { data, error } = await sb.from("tabacos").select("*").order("nombre").range(desde, desde + 999);
      if (error) throw error;
      filas.push(...data);
      if (data.length < 1000) break;
    }
    current = filas.map(mapItem).filter((d) => d.nombre);
    ctx.online = true;
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
  } catch (e) {
    console.error(e);
    usarRespaldo("No se ha podido conectar con la base de datos. Mostrando la copia de respaldo.");
  }
}
function usarRespaldo(aviso) {
  ctx.online = false;
  current = (window.DATOS_INICIALES || []).map(mapItem).filter((d) => d.nombre);
  opiniones = {};
  ctx.aviso = aviso || "";
}
async function refrescar() {
  await cargarTodo();
  fillFilters(); render(); paintTop();
  if (!$("overlay").hidden && openId != null) {
    if (!findItem(openId)) closeDetail(); else { paintArt(); paintMeta(); paintTools(); paintVideo(); paintResenas(); }
  }
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
function art(d) {
  const src = fotoSegura(d.foto);
  return src ? `<img class="photo" src="${esc(src)}" alt="Lata de ${esc(d.nombre)}" loading="lazy">` : tin(d);
}
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
        <div class="meta">${d.tipo ? `<span class="chip">${esc(d.tipo)}</span>` : ""}${d.corte ? `<span class="chip">${esc(d.corte)}</span>` : ""}${d.video ? '<span class="chip">Vídeo</span>' : ""}</div>
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
function metaHTML(d) {
  return `
      <div class="d-head">
        <div class="d-title">
          <span class="brandname">${esc(d.marca)}</span>
          <h2 id="d-name">${esc(d.nombre)}</h2>
        </div>
        ${notaGrande(d)}
      </div>
      ${d.desc ? `<p>${esc(d.desc)}</p>` : ""}
      <dl>
        ${d.tipo ? `<dt>Mezcla</dt><dd>${esc(d.tipo)}</dd>` : ""}
        ${d.hojas.length ? `<dt>Hojas</dt><dd><span class="meta">${d.hojas.map((h) => `<span class="chip">${esc(h)}</span>`).join("")}</span></dd>` : ""}
        ${d.corte ? `<dt>Corte</dt><dd>${esc(d.corte)}</dd>` : ""}
        ${d.pais ? `<dt>Origen</dt><dd>${esc(d.pais)}</dd>` : ""}
        ${d.formato ? `<dt>Formato</dt><dd>${esc(d.formato)}</dd>` : ""}
        ${d.notas.length ? `<dt>Notas</dt><dd><span class="meta">${d.notas.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</span></dd>` : ""}
      </dl>
      ${resumenCaract(d)}
      ${!d.notas.length && esEditor() ? '<p class="muted">Ficha básica: faltan las notas de sabor.</p>' : ""}`;
}
function abrirPanel(html) {
  if ($("overlay").hidden) lastFocus = document.activeElement;
  $("overlay").hidden = false;
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

function openDetail(id, desdeUrl) {
  const d = findItem(id); if (!d) return;
  openId = d.id;
  if (!desdeUrl) ponerUrlFicha(d);
  document.title = `${d.nombre} · ${TITULO}`;
  abrirPanel(`
    <button class="x-close" id="d-close" type="button" aria-label="Cerrar ficha" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
    <div class="art" id="d-art">${art(d)}</div>
    <div class="info">
      <div id="d-meta"></div>
      <div id="d-tools"></div>
    </div>
    <div class="sections">
      <section class="sec" id="d-video" aria-labelledby="vd-h" hidden></section>
      <section class="sec" aria-labelledby="rv-h">
        <h3 id="rv-h">Reseñas</h3>
        <div id="rv-mine"></div>
        <div class="reviews" id="rv-list"></div>
      </section>
    </div>`);
  $("d-close").addEventListener("click", () => closeDetail());
  $("d-close").focus();
  paintMeta(); paintTools(); paintVideo(); paintResenas();
}
function closeDetail(desdeUrl) {
  $("overlay").hidden = true; openId = null;
  document.title = TITULO;
  if (!desdeUrl) quitarUrlFicha();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function paintArt() { const d = findItem(openId), el = $("d-art"); if (d && el) el.innerHTML = art(d); }
function paintMeta() { const d = findItem(openId), el = $("d-meta"); if (d && el) el.innerHTML = metaHTML(d); }

/* Botones de la ficha según el rol */
function paintTools() {
  const box = $("d-tools"); if (!box || openId == null) return;
  const d = findItem(openId);
  if (esAdmin()) {
    box.innerHTML = `<div class="btns">
        <button class="btn" id="ed-open" type="button">Editar ficha</button>
        <button class="btn" id="ph-pick" type="button">${d.foto ? "Cambiar foto" : "Subir foto"}</button>
        ${d.foto ? '<button class="btn danger" id="ph-del" type="button">Quitar foto</button>' : ""}
        <button class="btn danger" id="fi-del" type="button">Eliminar ficha</button>
      </div>
      <input id="ph-file" type="file" accept="image/jpeg,image/png,image/webp" hidden>
      <p class="msg" id="ph-msg" role="alert"></p>`;
    $("ed-open").addEventListener("click", () => openEditor(openId));
    $("fi-del").addEventListener("click", () => askDelete(openId));
    const del = $("ph-del");
    if (del) del.addEventListener("click", async () => {
      if (!del.dataset.sure) { del.dataset.sure = "1"; del.textContent = "Pulsa otra vez para quitarla"; return; }
      const prev = d.foto;
      const { error } = await sb.from("tabacos").update({ foto: "" }).eq("id", d.id);
      if (error) { $("ph-msg").textContent = "No se ha podido quitar la foto."; return; }
      await borrarFotoDeAlmacen(prev);
      refrescar();
    });
  } else if (esEditor()) {
    box.innerHTML = `<div class="btns">
        <button class="btn" id="ed-open" type="button">Proponer cambios</button>
        <button class="btn" id="ph-pick" type="button">Proponer foto</button>
      </div>
      <input id="ph-file" type="file" accept="image/jpeg,image/png,image/webp" hidden>
      <p class="msg" id="ph-msg" role="alert"></p>`;
    $("ed-open").addEventListener("click", () => openEditor(openId));
  } else { box.innerHTML = ""; return; }
  $("ph-pick").addEventListener("click", () => $("ph-file").click());
  $("ph-file").addEventListener("change", (e) => { const f = e.target.files && e.target.files[0]; if (f) subirFoto(f); });
}

/* ---------- Fotos ---------- */
async function shrink(file) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(bmp, 0, 0, c.width, c.height);
    const b = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.86));
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
  if (ruta) { try { await sb.storage.from("fotos").remove([ruta]); } catch (e) {} }
}
async function subirFoto(file) {
  const msg = $("ph-msg"), id = openId, d = findItem(id);
  if (file.size > 20 * 1024 * 1024) { msg.textContent = "La foto pesa demasiado (máximo 20 MB)."; return; }
  msg.style.color = "var(--muted)"; msg.textContent = "Subiendo foto…";
  try {
    const blob = await shrink(file);
    if (blob.size > 5 * 1024 * 1024) throw new Error("grande");
    const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
    const ruta = esAdmin() ? `fichas/${id}-${Date.now()}.${ext}` : `propuestas/${ctx.uid}/${id}-${Date.now()}.${ext}`;
    const up = await sb.storage.from("fotos").upload(ruta, blob, { contentType: blob.type || "image/jpeg", upsert: false });
    if (up.error) throw up.error;
    const url = sb.storage.from("fotos").getPublicUrl(ruta).data.publicUrl;
    if (esAdmin()) {
      const { error } = await sb.from("tabacos").update({ foto: url }).eq("id", id);
      if (error) throw error;
      await borrarFotoDeAlmacen(d.foto);
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

/* ---------- Editor de fichas: el admin guarda, el editor propone ---------- */
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
  const titulo = admin ? (d ? "Editar ficha" : "Añadir tabaco") : (d ? "Proponer cambios" : "Proponer tabaco nuevo");
  abrirPanel(`
    <form class="f editor" id="ed-form" novalidate>
      <h2 id="d-name">${titulo}</h2>
      ${!admin ? '<p class="muted">Tu propuesta quedará pendiente hasta que el administrador la revise.</p>' : ""}
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
      ${admin ? `<div class="field"><label for="ed-video">Vídeo de YouTube (opcional)</label><input id="ed-video" type="url" value="${esc(v.video ? "https://www.youtube.com/watch?v=" + v.video : "")}" placeholder="https://www.youtube.com/watch?v=..."></div>` : ""}
      <div class="field"><label for="ed-desc">Descripción</label><textarea id="ed-desc" maxlength="2000">${esc(v.desc)}</textarea></div>
      ${!admin ? '<div class="field"><label for="ed-nota">Nota para el administrador (opcional)</label><input id="ed-nota" type="text" maxlength="1000" placeholder="De dónde sale el dato, por ejemplo la web del fabricante"></div>' : ""}
      ${dl("dl-marca", uniq("marca"))}${dl("dl-corte", uniq("corte"))}${dl("dl-pais", uniq("pais"))}
      <p class="msg" id="ed-msg" role="alert"></p>
      <div class="btns">
        <button class="btn primary" type="submit" id="ed-save">${admin ? (d ? "Guardar cambios" : "Crear ficha") : "Enviar propuesta"}</button>
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
    descripcion: $("ed-desc").value.trim().slice(0, 2000)
  };
}
function valorDe(d, k) { return k === "descripcion" ? d.desc : d[k]; }
function igual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
async function saveEditor(ev, d) {
  ev.preventDefault();
  const msg = $("ed-msg"), btn = $("ed-save");
  const data = leerFormulario();
  if (!data.nombre || !data.marca) { msg.textContent = "El nombre y la marca son obligatorios."; return; }
  if (esAdmin() && $("ed-video")) {
    const raw = $("ed-video").value.trim();
    const vid = raw ? ytId(raw) : "";
    if (raw && !vid) { msg.textContent = "No reconozco ese enlace. Pega la dirección del vídeo de YouTube, por ejemplo https://www.youtube.com/watch?v=abcdefghijk"; return; }
    if (vid !== ((d && d.video) || "")) data.video_id = vid;   // solo se envía si cambia
  }
  btn.disabled = true; msg.textContent = "";
  try {
    if (esAdmin()) {
      if (d) {
        const { error } = await sb.from("tabacos").update(data).eq("id", d.id);
        if (error) throw error;
        await refrescar(); openDetail(d.id);
      } else {
        const { data: fila, error } = await sb.from("tabacos").insert(data).select("id").single();
        if (error) throw error;
        await refrescar(); openDetail(fila.id);
      }
    } else {
      const nota = ($("ed-nota") && $("ed-nota").value.trim().slice(0, 1000)) || "";
      let fila;
      if (d) {
        const cambios = {};
        CAMPOS.forEach(([k]) => { if (!igual(data[k], valorDe(d, k))) cambios[k] = data[k]; });
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
    msg.textContent = (e && /50 propuestas/.test(e.message || "")) ? e.message : "No se ha podido guardar. Comprueba la conexión y que tu cuenta tiene permiso.";
  }
}

/* ---------- Vídeo de la ficha (lo pone solo el administrador, desde «Editar ficha») ----------
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
  try { return localStorage.getItem("herbario-firma") || ""; } catch (e) { return ""; }
}
function paintResenas() {
  const list = $("rv-list"), mine = $("rv-mine");
  if (!list || !mine || openId == null) return;
  const todas = opinionesDe(openId);
  const mia = ctx.uid ? todas.find((o) => o.autor === ctx.uid) : null;
  const resto = todas.filter((o) => o !== mia);

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
  list.innerHTML = resto.length ? resto.map((o) => `<div class="rev">${revHTML(o, false)}</div>`).join("")
    : (mia ? "" : '<p class="muted">Todavía no hay reseñas de este tabaco.</p>');
  [mine, list].forEach((box) => box.querySelectorAll("[data-rv]").forEach((b) => b.addEventListener("click", accionResena)));
}
function revHTML(o, propia) {
  const editado = o.actualizado && o.creado && new Date(o.actualizado) - new Date(o.creado) > 60000;
  const acts = propia
    ? `<div class="acts"><button class="link" type="button" data-rv="edit" data-id="${o.id}">Editar</button><button class="link" type="button" data-rv="del" data-id="${o.id}">Borrar</button></div>`
    : (esAdmin() ? `<div class="acts"><button class="link" type="button" data-rv="del" data-id="${o.id}">Borrar (admin)</button></div>` : "");
  return `<div class="head"><span class="who">${esc(o.firma)}${propia ? " <small>(tu reseña)</small>" : ""}</span>
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
      const v = Array.isArray(p.datos[k]) ? p.datos[k].join(", ") : (k === "fuerza" ? FUERZA[p.datos[k] || 0] : p.datos[k]);
      return v ? `<dt>${l}</dt><dd>${esc(v)}</dd>` : "";
    }).join("")}</dl>`;
  } else if (p.tipo === "cambio") {
    titulo = `Cambios en ${esc(nombre)}`;
    cuerpo = `<dl class="diff">${CAMPOS.filter(([k]) => k in p.datos).map(([k, l]) => {
      const fmt = (v) => Array.isArray(v) ? v.join(", ") : (k === "fuerza" ? FUERZA[v || 0] : (v || "—"));
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
async function abrirUsuarios() {
  if (!esAdmin()) return;
  abrirPanel(`<div class="info adm"><h2 id="d-name">Usuarios y permisos</h2>
    <p class="muted">Quien entra por primera vez queda como lector. Cambia aquí su rol para que pueda proponer cambios (editor) o administrar (admin).</p>
    <div id="us-list"><p class="muted">Cargando…</p></div>
    <button class="close" id="d-close" type="button">Cerrar</button></div>`);
  $("d-close").addEventListener("click", () => closeDetail());
  const { data, error } = await sb.from("perfiles").select("id,email,rol,creado").order("creado");
  const box = $("us-list"); if (!box) return;
  if (error) { box.innerHTML = '<p class="msg">No se han podido cargar los usuarios.</p>'; return; }
  box.innerHTML = `<table class="usuarios"><thead><tr><th>Correo</th><th>Rol</th></tr></thead><tbody>${data.map((u) => `
    <tr><td>${esc(u.email || "—")}<br><small class="muted">desde ${fecha(u.creado)}</small></td>
    <td><select data-uid="${esc(u.id)}" aria-label="Rol de ${esc(u.email || "")}"${u.id === ctx.uid ? " disabled" : ""}>
      ${["lector", "editor", "admin"].map((r) => `<option value="${r}"${u.rol === r ? " selected" : ""}>${r}</option>`).join("")}
    </select></td></tr>`).join("")}</tbody></table><p class="msg" id="us-msg" role="alert"></p>`;
  box.addEventListener("change", async (e) => {
    const s = e.target.closest("select[data-uid]"); if (!s) return;
    s.disabled = true;
    const { error } = await sb.from("perfiles").update({ rol: s.value }).eq("id", s.dataset.uid);
    $("us-msg").style.color = error ? "" : "var(--accent)";
    $("us-msg").textContent = error ? "No se ha podido cambiar el rol." : "Rol actualizado.";
    s.disabled = false;
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

/* ---------- Acceso (correo y contraseña) ---------- */
function abrirLogin() {
  $("lg-msg").textContent = ""; $("lg-msg").style.color = "";
  ["lg-send", "lg-new", "lg-forgot"].forEach((id) => ($(id).disabled = false));
  $("lg-form").hidden = false; $("np-form").hidden = true;
  $("lg-title").textContent = "Entrar en el herbario";
  $("lg-text").textContent = "Entra con tu correo y contraseña. Si es la primera vez, crea tu cuenta: con ella puedes escribir reseñas.";
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
  const d = datosLogin(true); if (!d) return;
  $("lg-new").disabled = true;
  const { data, error } = await sb.auth.signUp(Object.assign(d, { options: { emailRedirectTo: location.origin + location.pathname } }));
  $("lg-new").disabled = false;
  if (error) { $("lg-msg").textContent = errorLogin(error); return; }
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
  if (session && sb) {
    const { data, error } = await sb.rpc("mi_rol");
    if (!error && typeof data === "string") ctx.rol = data;
  }
  await contarPendientes();
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
      <button class="btn" id="us-open" type="button">Usuarios</button>
      <button class="btn primary" id="add-open" type="button">Añadir tabaco</button>`;
    $("rv-open").addEventListener("click", abrirRevision);
    $("us-open").addEventListener("click", abrirUsuarios);
    $("add-open").addEventListener("click", () => openEditor(null));
  } else if (esEditor()) {
    bar.innerHTML = `<button class="btn" id="mp-open" type="button">Mis propuestas${ctx.misPendientes ? ` (${ctx.misPendientes} pendientes)` : ""}</button>
      <button class="btn primary" id="add-open" type="button">Proponer tabaco</button>`;
    $("mp-open").addEventListener("click", abrirMisPropuestas);
    $("add-open").addEventListener("click", () => openEditor(null));
  } else bar.innerHTML = "";

  const st = $("status"), box = $("auth-box");
  if (!CONFIGURADO) { st.textContent = "Base de datos sin configurar: catálogo de solo lectura."; box.innerHTML = ""; return; }
  if (!ctx.online) { st.textContent = ctx.aviso || ""; }
  else if (!ctx.session) st.textContent = "";
  else {
    const ROL = { admin: "administrador", editor: "editor", lector: "lector (sin permiso de edición todavía)" };
    st.textContent = `Has entrado como ${ctx.email} · ${ROL[ctx.rol] || ctx.rol}.`;
  }
  box.innerHTML = ctx.session ? '<button class="link" id="out" type="button">Salir</button>' : '<button class="link" id="in" type="button">Acceso colaboradores</button>';
  if (ctx.session) $("out").addEventListener("click", async () => { await sb.auth.signOut(); });
  else $("in").addEventListener("click", abrirLogin);
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
