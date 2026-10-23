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

const TIPOS = {
  "Virginia": "#B8862B", "Burley": "#6B4A2F", "Aromático": "#7B2D4B",
  "Inglés": "#2F3E4E", "Oriental": "#8C3B2A", "Cavendish": "#4A3A6B", "Para mezclas": "#5B6B73"
};
const TIPOS_SUGERIDOS = ["Virginia", "Burley", "Aromático", "Inglés", "Oriental", "Cavendish", "Para mezclas"];
const FUERZA = ["Sin datos", "Muy suave", "Suave", "Media", "Fuerte", "Muy fuerte"];
const VALORACION = ["", "1 · Malo", "2 · Flojo", "3 · Correcto", "4 · Muy bueno", "5 · Excelente"];
const CAMPOS = [["nombre", "Nombre"], ["marca", "Marca"], ["tipo", "Tipo"], ["corte", "Corte"], ["fuerza", "Fuerza"],
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
let resenas = {};   // tabaco_id -> { headline, body, score, videoId }
let openId = null, lastFocus = null;

function mapItem(r) {
  const notas = Array.isArray(r.notas) ? r.notas.filter((n) => typeof n === "string" && n.trim()).map((n) => n.trim().slice(0, 40)).slice(0, 12) : [];
  const f = Number(r.fuerza);
  return {
    id: String(r.id), nombre: str(r.nombre, 120), marca: str(r.marca, 80), tipo: str(r.tipo, 40), corte: str(r.corte, 40),
    pais: str(r.pais, 60), formato: str(r.formato, 80), desc: str(r.descripcion, 2000),
    fuerza: Number.isInteger(f) && f >= 1 && f <= 5 ? f : 0, notas, foto: str(r.foto, 500)
  };
}
function mapResena(r) {
  const videoId = typeof r.video_id === "string" && /^[A-Za-z0-9_-]{11}$/.test(r.video_id) ? r.video_id : "";
  const score = Number.isInteger(r.puntuacion) && r.puntuacion >= 1 && r.puntuacion <= 5 ? r.puntuacion : 0;
  return { headline: str(r.titular, 200), body: str(r.texto, 20000), score, videoId };
}
const findItem = (id) => current.find((d) => d.id === String(id));
function officialFor(id) {
  const o = resenas[String(id)];
  return o && (o.headline || o.body || o.videoId) ? o : null;
}
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
    const r = await sb.from("resenas").select("*");
    if (r.error) throw r.error;
    current = filas.map(mapItem).filter((d) => d.nombre);
    resenas = {};
    r.data.forEach((x) => { resenas[String(x.tabaco_id)] = mapResena(x); });
    ctx.online = true;
  } catch (e) {
    console.error(e);
    usarRespaldo("No se ha podido conectar con la base de datos. Mostrando la copia de respaldo.");
  }
}
function usarRespaldo(aviso) {
  ctx.online = false;
  current = (window.DATOS_INICIALES || []).map(mapItem).filter((d) => d.nombre);
  resenas = {};
  ctx.aviso = aviso || "";
}
async function refrescar() {
  await cargarTodo();
  fillFilters(); render(); paintTop();
  if (!$("overlay").hidden && openId != null) {
    if (!findItem(openId)) closeDetail(); else { paintArt(); paintMeta(); paintTools(); paintOfficial(); }
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
const state = { q: "", marca: "", tipo: "", corte: "", fuerza: "", pais: "", sort: "nombre" };
const FILTERS = [["f-marca", "marca", "Todas"], ["f-tipo", "tipo", "Todos"], ["f-corte", "corte", "Todos"], ["f-pais", "pais", "Todos"]];
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
  fillSelect("f-fuerza", "Cualquiera", [1, 2, 3, 4, 5].map((n) => ({ value: String(n), text: FUERZA[n] })));
  $("f-fuerza").value = state.fuerza;
}
function setupFilters() {
  $("q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  [["f-marca", "marca"], ["f-tipo", "tipo"], ["f-corte", "corte"], ["f-fuerza", "fuerza"], ["f-pais", "pais"], ["sort", "sort"]].forEach(([id, k]) => {
    $(id).addEventListener("change", (e) => { state[k] = e.target.value; render(); });
  });
  $("reset").addEventListener("click", () => {
    Object.assign(state, { q: "", marca: "", tipo: "", corte: "", fuerza: "", pais: "", sort: "nombre" });
    $("q").value = ""; ["f-marca", "f-tipo", "f-corte", "f-fuerza", "f-pais"].forEach((id) => ($(id).value = "")); $("sort").value = "nombre";
    render();
  });
}
function render() {
  const q = norm(state.q.trim());
  const byName = (a, b) => a.nombre.localeCompare(b.nombre, "es");
  const score = (d) => { const o = officialFor(d.id); return o ? o.score : 0; };
  const list = current.filter((d) => {
    if (state.marca && d.marca !== state.marca) return false;
    if (state.tipo && d.tipo !== state.tipo) return false;
    if (state.corte && d.corte !== state.corte) return false;
    if (state.pais && d.pais !== state.pais) return false;
    if (state.fuerza && String(d.fuerza) !== state.fuerza) return false;
    if (q) {
      const hay = norm([d.nombre, d.marca, d.tipo, d.corte, d.pais, d.notas.join(" "), d.desc].join(" "));
      return q.split(/\s+/).every((w) => hay.includes(w));
    }
    return true;
  });
  list.sort((a, b) =>
    state.sort === "fuerza-asc" ? (a.fuerza || 99) - (b.fuerza || 99) || byName(a, b)
    : state.sort === "fuerza-desc" ? b.fuerza - a.fuerza || byName(a, b)
    : state.sort === "puntuacion" ? score(b) - score(a) || byName(a, b)
    : byName(a, b));
  $("count").textContent = list.length === 1 ? "1 tabaco" : `${list.length} tabacos`;
  $("grid").innerHTML = list.length ? list.map((d) => {
    const o = officialFor(d.id);
    const rate = o ? (o.score ? `Puntuación del herbario: ${o.score} de 5` : "") : "Sin reseña todavía";
    return `
    <button class="card" type="button" data-id="${esc(d.id)}" aria-label="Ver ficha de ${esc(d.nombre)}">
      <div class="art">${art(d)}</div>
      <div class="body">
        <span class="brandname">${esc(d.marca)}</span>
        <h2>${esc(d.nombre)}</h2>
        <div class="meta">${d.tipo ? `<span class="chip">${esc(d.tipo)}</span>` : ""}${d.corte ? `<span class="chip">${esc(d.corte)}</span>` : ""}${o ? '<span class="chip official">Reseña</span>' : ""}${o && o.videoId ? '<span class="chip">Vídeo</span>' : ""}</div>
        ${d.fuerza ? `<div class="str">${pips(d.fuerza)}<span>${FUERZA[d.fuerza]}</span></div>` : ""}
        ${rate ? `<span class="rate">${rate}</span>` : ""}
        <p>${esc(d.desc)}</p>
      </div>
    </button>`;
  }).join("") : `<p class="empty">Ningún tabaco coincide con la búsqueda. Prueba con menos filtros.</p>`;
}

/* ---------- Ficha de detalle ---------- */
function metaHTML(d) {
  return `
      <span class="brandname">${esc(d.marca)}</span>
      <h2 id="d-name">${esc(d.nombre)}</h2>
      ${d.desc ? `<p>${esc(d.desc)}</p>` : ""}
      <dl>
        ${d.tipo ? `<dt>Tipo</dt><dd>${esc(d.tipo)}</dd>` : ""}
        ${d.corte ? `<dt>Corte</dt><dd>${esc(d.corte)}</dd>` : ""}
        <dt>Fuerza</dt><dd><span class="str">${d.fuerza ? pips(d.fuerza) : ""}<span>${FUERZA[d.fuerza]}</span></span></dd>
        ${d.pais ? `<dt>Origen</dt><dd>${esc(d.pais)}</dd>` : ""}
        ${d.formato ? `<dt>Formato</dt><dd>${esc(d.formato)}</dd>` : ""}
        ${d.notas.length ? `<dt>Notas</dt><dd><span class="meta">${d.notas.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</span></dd>` : ""}
      </dl>
      ${!d.notas.length ? '<p class="muted">Ficha básica: faltan las notas de sabor.</p>' : ""}`;
}
function abrirPanel(html) {
  if ($("overlay").hidden) lastFocus = document.activeElement;
  $("overlay").hidden = false;
  $("panel").innerHTML = html;
}
function openDetail(id) {
  const d = findItem(id); if (!d) return;
  openId = d.id;
  abrirPanel(`
    <div class="art" id="d-art">${art(d)}</div>
    <div class="info">
      <div id="d-meta"></div>
      <div id="d-tools"></div>
      <button class="close" id="d-close" type="button">Cerrar</button>
    </div>
    <div class="sections">
      <section class="sec" aria-labelledby="of-h">
        <h3 id="of-h">Reseña del herbario</h3>
        <div id="of-view"></div>
        <div id="of-edit"></div>
      </section>
    </div>`);
  $("d-close").addEventListener("click", closeDetail);
  $("d-close").focus();
  paintMeta(); paintTools(); paintOfficial();
}
function closeDetail() {
  $("overlay").hidden = true; openId = null;
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
  const v = d || { nombre: "", marca: "", tipo: "", corte: "", fuerza: 0, pais: "", formato: "", notas: [], desc: "" };
  const uniq = (k) => [...new Set(current.map((x) => x[k]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const dl = (name, vals) => `<datalist id="${name}">${vals.map((x) => `<option value="${esc(x)}">`).join("")}</datalist>`;
  const tipos = [...new Set([...TIPOS_SUGERIDOS, ...uniq("tipo")])];
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
        <div class="field"><label for="ed-tipo">Tipo</label><input id="ed-tipo" type="text" maxlength="40" list="dl-tipo" value="${esc(v.tipo)}" autocomplete="off"></div>
        <div class="field"><label for="ed-corte">Corte</label><input id="ed-corte" type="text" maxlength="40" list="dl-corte" value="${esc(v.corte)}" autocomplete="off"></div>
      </div>
      <div class="two">
        <div class="field"><label for="ed-fuerza">Fuerza</label>
          <select id="ed-fuerza">${[0, 1, 2, 3, 4, 5].map((n) => `<option value="${n}"${v.fuerza === n ? " selected" : ""}>${FUERZA[n]}</option>`).join("")}</select></div>
        <div class="field"><label for="ed-pais">País de origen</label><input id="ed-pais" type="text" maxlength="60" list="dl-pais" value="${esc(v.pais)}" autocomplete="off"></div>
      </div>
      <div class="two">
        <div class="field"><label for="ed-formato">Formato</label><input id="ed-formato" type="text" maxlength="80" value="${esc(v.formato)}" placeholder="Lata de 50 g"></div>
        <div class="field"><label for="ed-notas">Notas de sabor</label><input id="ed-notas" type="text" value="${esc(v.notas.join(", "))}" placeholder="Separadas por comas: heno, miel, cítrico"></div>
      </div>
      <div class="field"><label for="ed-desc">Descripción</label><textarea id="ed-desc" maxlength="2000">${esc(v.desc)}</textarea></div>
      ${!admin ? '<div class="field"><label for="ed-nota">Nota para el administrador (opcional)</label><input id="ed-nota" type="text" maxlength="1000" placeholder="De dónde sale el dato, por ejemplo la web del fabricante"></div>' : ""}
      ${dl("dl-marca", uniq("marca"))}${dl("dl-tipo", tipos)}${dl("dl-corte", uniq("corte"))}${dl("dl-pais", uniq("pais"))}
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
    tipo: $("ed-tipo").value.trim().slice(0, 40), corte: $("ed-corte").value.trim().slice(0, 40),
    fuerza: Number($("ed-fuerza").value) || 0, pais: $("ed-pais").value.trim().slice(0, 60),
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
      $("ok-close").addEventListener("click", closeDetail);
      if (d) $("ok-ficha").addEventListener("click", () => openDetail(d.id));
    }
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    msg.textContent = (e && /50 propuestas/.test(e.message || "")) ? e.message : "No se ha podido guardar. Comprueba la conexión y que tu cuenta tiene permiso.";
  }
}

/* ---------- Reseña del herbario (solo admin) ---------- */
function paintOfficial() {
  if (openId == null || !$("of-view")) return;
  const o = officialFor(openId);
  let h = "";
  if (o) {
    h += `<article class="ofc">`;
    if (o.headline) h += `<h4>${esc(o.headline)}</h4>`;
    if (o.score) h += `<div class="str">${pips(o.score)}<span>Puntuación: ${o.score} de 5</span></div>`;
    if (o.body) h += `<div class="text">${paras(o.body)}</div>`;
    if (o.videoId) {
      h += `<a class="video" href="https://www.youtube.com/watch?v=${o.videoId}" target="_blank" rel="noopener noreferrer">
        <span class="play"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 1.5v17l15-8.5z"/></svg></span>
        <span class="t"><strong>Ver la reseña en vídeo</strong><small>youtube.com/watch?v=${o.videoId}</small></span></a>`;
    }
    h += `</article>`;
  } else {
    h += `<p class="muted">Todavía no hay reseña de este tabaco.</p>`;
  }
  if (esAdmin()) h += `<button class="btn" id="of-toggle" type="button">${o ? "Editar reseña" : "Escribir reseña"}</button>`;
  $("of-view").innerHTML = h;
  const t = $("of-toggle"); if (t) t.addEventListener("click", showOfficialForm);
}
function showOfficialForm() {
  const o = officialFor(openId) || { headline: "", body: "", score: 0, videoId: "" };
  const url = o.videoId ? "https://www.youtube.com/watch?v=" + o.videoId : "";
  $("of-edit").innerHTML = `
    <form class="f" id="of-form" novalidate>
      <div class="field"><label for="of-headline">Titular</label><input id="of-headline" type="text" maxlength="200" value="${esc(o.headline)}" placeholder="Una frase que resuma la reseña"></div>
      <div class="two">
        <div class="field"><label for="of-score">Puntuación</label>
          <select id="of-score"><option value="0">Sin puntuación</option>${[1, 2, 3, 4, 5].map((n) => `<option value="${n}"${o.score === n ? " selected" : ""}>${VALORACION[n]}</option>`).join("")}</select></div>
        <div class="field"><label for="of-video">Vídeo de YouTube (opcional)</label><input id="of-video" type="url" value="${esc(url)}" placeholder="https://www.youtube.com/watch?v=..."></div>
      </div>
      <div class="field"><label for="of-body">Texto de la reseña</label><textarea id="of-body" style="min-height:200px" maxlength="20000" placeholder="Escribe la reseña. Una línea en blanco separa los párrafos.">${esc(o.body)}</textarea></div>
      <p class="msg" id="of-msg" role="alert"></p>
      <div class="btns">
        <button class="btn primary" type="submit" id="of-save">Guardar reseña</button>
        <button class="btn" type="button" id="of-cancel">Cancelar</button>
        ${officialFor(openId) ? '<button class="btn danger" type="button" id="of-del">Quitar reseña</button>' : ""}
      </div>
    </form>`;
  $("of-headline").focus();
  $("of-cancel").addEventListener("click", () => { $("of-edit").innerHTML = ""; });
  $("of-form").addEventListener("submit", saveOfficial);
  const del = $("of-del");
  if (del) del.addEventListener("click", async () => {
    if (!del.dataset.sure) { del.dataset.sure = "1"; del.textContent = "Pulsa otra vez para quitarla"; return; }
    const { error } = await sb.from("resenas").delete().eq("tabaco_id", openId);
    if (error) { $("of-msg").textContent = "No se ha podido quitar la reseña. Inténtalo de nuevo."; return; }
    $("of-edit").innerHTML = ""; refrescar();
  });
}
async function saveOfficial(ev) {
  ev.preventDefault();
  const msg = $("of-msg");
  const raw = $("of-video").value.trim();
  let videoId = "";
  if (raw) {
    videoId = ytId(raw);
    if (!videoId) { msg.textContent = "No reconozco ese enlace. Pega la dirección del vídeo de YouTube, por ejemplo https://www.youtube.com/watch?v=abcdefghijk"; return; }
  }
  const titular = $("of-headline").value.trim(), texto = $("of-body").value.trim();
  if (!texto && !videoId) { msg.textContent = "Escribe el texto de la reseña o añade un vídeo."; return; }
  const btn = $("of-save"); btn.disabled = true; msg.textContent = "";
  const fila = { tabaco_id: openId, titular, texto, puntuacion: Number($("of-score").value) || 0, video_id: videoId, actualizado: new Date().toISOString() };
  const { error } = await sb.from("resenas").upsert(fila);
  if (error) { btn.disabled = false; msg.textContent = "No se ha podido guardar la reseña. Inténtalo de nuevo."; return; }
  $("of-edit").innerHTML = ""; refrescar();
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
  $("d-close").addEventListener("click", closeDetail);
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
  $("d-close").addEventListener("click", closeDetail);
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
  $("d-close").addEventListener("click", closeDetail);
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
  $("lg-title").textContent = "Acceso de colaboradores";
  $("lg-text").textContent = "Entra con tu correo y contraseña. Si es la primera vez, crea tu cuenta y pide al administrador que te dé permiso de edición.";
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

/* ---------- Arranque ---------- */
(async function iniciar() {
  setupFilters();
  usarRespaldo(); fillFilters(); render(); paintTop();   // se ve algo al instante
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  await leerSesion(data && data.session);
  await refrescar();
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
