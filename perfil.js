/* ---------- Perfil público de un usuario ----------
   Se abre tocando el nombre de quien firma una reseña (en la ficha o en «Todas las reseñas»).
   Solo con cuenta: sin sesión se abre la ventana de entrar y, al entrar, el perfil.
   Enseña nombre, foto, distintivo de socio (con el año), rango, número de reseñas, fecha de alta
   y la lista de sus reseñas. Su bodega (las tres listas, sin gramos ni tarros) solo sale si su
   dueño la ha hecho visible en Mi cuenta. Nunca se enseñan el correo, el rol ni la última conexión.
   Dirección propia: index.html#/usuario/<id>. Datos: 65_perfiles_publicos.sql.
   Usa de app.js: ctx, sb, current, findItem, opiniones, BODEGA, RANGOS, rangoDe, resenasDe, estrellas,
   fecha, haceCuanto, art, irAResenas, openDetail, abrirPanel, closeDetail, abrirLogin, panelesHash, fotoSegura,
   FRANJA, esc, $. */
(function () {
  const conCuenta = () => !!ctx.session;
  const hashDe = (id) => `#/usuario/${encodeURIComponent(id)}`;
  const idDeHash = () => { const m = location.hash.match(/^#\/usuario\/([^/?#]+)/); return m ? decodeURIComponent(m[1]) : null; };
  let pendiente = null;      // id de un perfil pedido sin sesión
  let vista = { id: "", tab: "" };   // pestaña de la bodega elegida en el perfil abierto
  const cache = {};          // id -> { perfil, bodega } (mientras dure la visita)

  function pedirCuenta() {
    abrirLogin();
    $("lg-text").textContent = "Para ver el perfil de otros usuarios tienes que entrar con tu cuenta. Si es la primera vez, crea una.";
  }
  // Reseñas de un autor (ya están cargadas en la web), de la más nueva a la más antigua.
  function resenasDeAutor(id) {
    const l = [];
    Object.entries(opiniones).forEach(([tid, ops]) => ops.forEach((o) => { if (o.autor === id) { const d = findItem(tid); if (d) l.push({ o, d }); } }));
    return l.sort((a, b) => new Date(b.o.creado) - new Date(a.o.creado));
  }
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const desdeTxt = (t) => { const f = new Date(t); return isNaN(f) ? "" : `${MESES[f.getMonth()]} de ${f.getFullYear()}`; };

  async function cargar(id) {
    if (cache[id]) return cache[id];
    const { data, error } = await sb.rpc("perfil_publico", { p_id: id });
    if (error) return { error: true };
    const p = Array.isArray(data) ? data[0] : data;
    if (!p) return { nada: true };
    let bod = null;
    if (p.bodega_publica) {
      const r = await sb.rpc("bodega_publica_de", { p_id: id });
      if (!r.error) { bod = {}; (r.data || []).forEach((x) => { bod[String(x.tabaco_id)] = x; }); }
    }
    return (cache[id] = { perfil: p, bodega: bod });
  }

  function cerrarBoton() {
    return '<button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>';
  }
  function mensaje(txt) {
    abrirPanel(`<div class="d-franja">${FRANJA}</div>${cerrarBoton()}<div class="bd-cuerpo"><p class="muted">${esc(txt)}</p></div>`, "bodega-p perfil-p");
    $("d-close").addEventListener("click", () => closeDetail());
  }

  async function abrir(desdeUrl, idPedido) {
    const id = idPedido || idDeHash(); if (!id) return;
    if (!conCuenta()) { pendiente = id; pedirCuenta(); return; }
    if (!desdeUrl && location.hash !== hashDe(id)) history.pushState({ panel: true }, "", hashDe(id));
    if (!cache[id]) mensaje("Cargando el perfil…");
    const r = await cargar(id);
    if (idDeHash() !== id) return;   // se ha cerrado o se ha abierto otra cosa mientras cargaba
    if (r.error) { mensaje("Los perfiles de los usuarios estarán disponibles pronto."); return; }
    if (r.nada) { mensaje("Este perfil no está disponible."); return; }
    pintar(id, r.perfil, r.bodega);
  }

  function pintar(id, p, bod) {
    const res = resenasDeAutor(id);
    const yo = id === ctx.uid;
    const nombre = (p.nombre || "").trim() || (res[0] && res[0].o.firma) || "Vecino del herbario";
    const foto = fotoSegura(p.avatar || "");
    const avatar = foto ? `<img class="avatar big" src="${esc(foto)}" alt="">`
      : `<span class="avatar big" aria-hidden="true">${esc(nombre.charAt(0).toUpperCase())}</span>`;
    const n = ctx.opiniones ? resenasDe(id) : res.length, r = rangoDe(n);
    const desde = desdeTxt(p.creado);

    // Bodega visible: pestañas con las tres listas
    let bodegaHTML = "";
    if (bod) {
      const listas = Object.fromEntries(BODEGA.map(([k]) => [k, current.filter((d) => (bod[String(d.id)] || {})[k]).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))]));
      if (vista.id !== id) vista = { id, tab: "" };
      const tab = vista.tab || (BODEGA.find(([k]) => listas[k].length) || BODEGA[0])[0];
      bodegaHTML = `<section class="pf-sec" aria-labelledby="pf-bod-h">
          <h3 id="pf-bod-h">Su bodega</h3>
          <div class="bd-tabs" role="tablist" aria-label="Listas de la bodega">
            ${BODEGA.map(([k, t]) => `<button role="tab" type="button" data-pf-tab="${k}" aria-selected="${k === tab}">${t} <span>${listas[k].length}</span></button>`).join("")}
          </div>
          ${listas[tab].length ? `<div class="pf-lista">${listas[tab].map((d) => `<button class="mas-item" type="button" data-pf-ficha="${esc(d.id)}"><span class="mas-art">${art(d)}</span><span class="mas-nom">${esc(d.nombre)}<small class="mas-marca">${esc(d.marca)}</small></span></button>`).join("")}</div>`
            : '<p class="muted">Esta lista está vacía.</p>'}
        </section>`;
    } else if (yo) {
      bodegaHTML = '<p class="muted pf-nota">Tu bodega no se ve en tu perfil. Puedes enseñarla a los demás desde Mi cuenta.</p>';
    }

    abrirPanel(`
      <div class="d-franja">${FRANJA}</div>
      ${cerrarBoton()}
      <div class="cu-cab">
        <div class="cu-puerta"><div class="cu-piedras">${avatar}</div></div>
        <div class="cu-quien">
          <h2 id="d-name">${esc(nombre)}</h2>
          <p class="cu-chips">
            ${p.socio ? `<span class="cu-chip rango us-socio-chip"><img src="img/logo.png" alt="" width="16" height="16">Socio del club${p.socio_desde ? ` desde ${esc(p.socio_desde)}` : ""}</span>` : ""}
            ${r.i >= 0 ? `<span class="cu-chip rango">${esc(r.nombre)}</span>` : ""}
          </p>
          ${yo ? '<p class="muted">Así ven tu perfil los demás usuarios.</p>' : ""}
        </div>
      </div>
      <div class="cu-cuerpo">
        <div class="cu-casillas">
          <div class="bd-casilla"><span class="l">Reseñas publicadas</span><span class="n">${n}</span><span class="s">${r.sig ? `Rango siguiente: ${esc(r.sig[0])}` : "Rango más alto del herbario"}</span></div>
          ${desde ? `<div class="bd-casilla"><span class="l">En el herbario</span><span class="n medio">${esc(desde.charAt(0).toUpperCase() + desde.slice(1))}</span><span class="s">Miembro desde entonces</span></div>` : ""}
          ${bod ? (() => { const t = current.filter((d) => (bod[String(d.id)] || {}).tengo).length; return `<div class="bd-casilla"><span class="l">En su bodega</span><span class="n">${t}</span><span class="s">${t === 1 ? "tabaco que tiene" : "tabacos que tiene"}</span></div>`; })() : ""}
        </div>
        ${bodegaHTML}
        <section class="pf-sec" aria-labelledby="pf-res-h">
          <h3 id="pf-res-h">Sus reseñas</h3>
          ${res.length ? `<div class="tr-lista">${res.map(({ o, d }) => `
            <article class="tr-item">
              <button class="tr-art" type="button" data-pf-res="${esc(d.id)}" aria-label="Abrir ${esc(d.nombre)}">${art(d)}</button>
              <div class="tr-c">
                <div class="tr-h"><button class="link tr-nom" type="button" data-pf-res="${esc(d.id)}">${esc(d.nombre)}</button><span class="muted">${esc(d.marca)}</span>${estrellas(o.score)}</div>
                ${o.texto.trim() ? `<p>${esc(o.texto.trim())}</p>` : '<p class="muted">Solo puntuación, sin comentario.</p>'}
                <div class="tr-pie"><span class="muted">${haceCuanto(o.creado)}</span></div>
              </div>
            </article>`).join("")}</div>` : '<p class="muted">Todavía no ha escrito ninguna reseña.</p>'}
        </section>
      </div>`, "cuenta-p perfil-p");
    const panel = $("panel");
    $("d-close").addEventListener("click", () => closeDetail());
    panel.querySelectorAll("[data-pf-tab]").forEach((b) => b.addEventListener("click", () => {
      vista.tab = b.dataset.pfTab; pintar(id, p, bod);
      const nuevo = $("panel").querySelector(`[data-pf-tab="${b.dataset.pfTab}"]`); if (nuevo) nuevo.focus();
    }));
    panel.querySelectorAll("[data-pf-ficha]").forEach((b) => b.addEventListener("click", () => openDetail(b.dataset.pfFicha)));
    panel.querySelectorAll("[data-pf-res]").forEach((b) => b.addEventListener("click", () => irAResenas(b.dataset.pfRes)));
  }

  // Nombre de quien firma una reseña, como botón que abre su perfil.
  function firma(autor, html) {
    if (!autor) return html;
    return `<button class="link pf-firma" type="button" data-perfil="${esc(autor)}" title="Ver su perfil">${html}</button>`;
  }
  // Un solo escuchador para todas las firmas (fichas, «Todas las reseñas»…).
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-perfil]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    abrir(false, b.dataset.perfil);
  });

  function alArrancar() { if (idDeHash() && $("overlay").hidden) abrir(true); }
  // Al entrar o salir de la cuenta.
  function cambioSesion() {
    Object.keys(cache).forEach((k) => delete cache[k]);
    if (!conCuenta() || !pendiente) return;
    const id = pendiente; pendiente = null;
    if (location.hash !== hashDe(id)) history.pushState({ panel: true }, "", hashDe(id));
    abrir(true, id);
  }
  // Cuando el usuario cambia la visibilidad de su bodega, su perfil se vuelve a pedir.
  const olvidar = (id) => { delete cache[id]; };

  panelesHash["#/usuario"] = (desdeUrl) => abrir(desdeUrl);
  window.Perfil = { abrir: (id) => abrir(false, id), firma, alArrancar, cambioSesion, olvidar };
})();
