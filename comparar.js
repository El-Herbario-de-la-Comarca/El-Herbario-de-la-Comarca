/* ---------- Comparador de dos tabacos ----------
   Se elige un tabaco con «Comparar» en su ficha; queda en una bandeja abajo mientras se busca el segundo,
   y en la ficha del segundo el botón pasa a «Comparar con …». También se puede comparar directamente con
   una de sus «Parecidas de otras marcas». La comparación es una tabla con las casillas de la ficha, una
   columna por tabaco: lo que coincide sale marcado y se puede ocultar con «Ver solo lo que cambia».
   Solo con cuenta. Tiene dirección propia, index.html#/comparar/<id>/<id>, que se comparte con un enlace;
   quien lo abre sin sesión ve la ventana de entrar y, al entrar, la comparación.
   Usa de app.js: ctx, current, findItem, opinionesDe, statsDe, fmtMedia, CARACT, MIN_MEDIAS, columnasCaract,
   puntosParecido, art, ico, panelesHash, abrirPanel, closeDetail, openDetail, abrirLogin, FRANJA, TITULO, esc, norm, $. */
(function () {
  const CLAVE = "herbario-comparar";   // id del primer tabaco elegido (en el navegador)
  const ICONO = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="7.5" height="14" rx="2"/><rect x="13.5" y="5" width="7.5" height="14" rx="2"/></svg>`;
  const PARECIDO_MAX = 16;   // lo más que puede sumar puntosParecido (5 + 4 + 2 + 4,5 + 0,5)

  const leerElegido = () => { try { return localStorage.getItem(CLAVE) || ""; } catch (e) { return ""; } };
  const guardarElegido = (id) => { try { if (id) localStorage.setItem(CLAVE, String(id)); else localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ } };
  let elegido = leerElegido();
  let pendiente = null;   // [a, b] de un enlace abierto sin sesión
  const conCuenta = () => !!ctx.session;

  function pedirCuenta() {
    abrirLogin();
    $("lg-text").textContent = "Para comparar tabacos tienes que entrar con tu cuenta. Si es la primera vez, crea una.";
  }
  const hashDe = (a, b) => `#/comparar/${encodeURIComponent(a)}/${encodeURIComponent(b)}`;
  function idsDeHash() {
    const m = location.hash.match(/^#\/comparar\/([^/?#]+)\/([^/?#]+)/);
    return m ? [decodeURIComponent(m[1]), decodeURIComponent(m[2])] : null;
  }

  /* ---------- Bandeja: el primer tabaco elegido, abajo, mientras se busca el segundo ---------- */
  const bandeja = document.createElement("div");
  bandeja.className = "cm-bandeja"; bandeja.id = "cm-bandeja"; bandeja.hidden = true;
  bandeja.setAttribute("role", "region"); bandeja.setAttribute("aria-label", "Tabaco elegido para comparar");
  document.body.appendChild(bandeja);
  function pintarBandeja() {
    const d = elegido && findItem(elegido);
    const verla = !!d && conCuenta() && $("overlay").hidden;
    bandeja.hidden = !verla;
    if (!d) return;
    bandeja.innerHTML = `<span class="cm-b-art" aria-hidden="true">${art(d)}</span>
      <span class="cm-b-txt"><strong>${esc(d.nombre)}</strong><span>Abre otra ficha y pulsa «Comparar con ${esc(d.nombre)}».</span></span>
      <button class="cm-b-x" type="button" aria-label="Quitar ${esc(d.nombre)} de la comparación" title="Quitar">${'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg>'}</button>`;
    bandeja.querySelector(".cm-b-x").addEventListener("click", () => { elegir(""); });
  }
  function elegir(id) {
    elegido = id ? String(id) : "";
    guardarElegido(elegido);
    pintarBandeja();
  }
  // La bandeja se esconde mientras hay un panel abierto (ficha, rueda…), para no tapar nada.
  new MutationObserver(pintarBandeja).observe($("overlay"), { attributes: true, attributeFilter: ["hidden"] });

  /* ---------- En la ficha ---------- */
  function enFicha(d, par) {
    const box = $("d-cmp"); if (!box) return;
    box.hidden = false;
    const otro = elegido && elegido !== String(d.id) && findItem(elegido);
    if (otro) {
      box.innerHTML = `<button class="btn primary" id="cm-ya" type="button">${ICONO}Comparar con ${esc(otro.nombre)}</button>
        <button class="link cm-cambiar" id="cm-esta" type="button">Elegir esta en su lugar</button>`;
      $("cm-ya").addEventListener("click", () => comparar(otro.id, d.id));
      $("cm-esta").addEventListener("click", () => { if (!conCuenta()) { pedirCuenta(); return; } elegir(d.id); enFicha(d, par); });
    } else if (elegido === String(d.id)) {
      box.innerHTML = `<p class="muted cm-elegida">${ICONO}Elegida para comparar. Abre otra ficha para compararlas.</p>
        <button class="link cm-cambiar" id="cm-quitar" type="button">Quitar</button>`;
      $("cm-quitar").addEventListener("click", () => { elegir(""); enFicha(d, par); });
    } else {
      const pars = (par || []).slice(0, 3);
      box.innerHTML = `<button class="btn" id="cm-elegir" type="button">${ICONO}Comparar con otro tabaco</button>
        ${pars.length ? `<p class="muted cm-con">O compárala con una parecida: ${pars.map((x) => `<button class="link" type="button" data-cm="${esc(x.id)}">${esc(x.nombre)}</button>`).join(", ")}</p>` : ""}`;
      $("cm-elegir").addEventListener("click", () => {
        if (!conCuenta()) { pedirCuenta(); return; }
        elegir(d.id); enFicha(d, par);
      });
      box.querySelectorAll("[data-cm]").forEach((b) => b.addEventListener("click", () => comparar(d.id, b.dataset.cm)));
    }
  }

  function comparar(a, b) {
    if (!conCuenta()) { pendiente = [String(a), String(b)]; pedirCuenta(); return; }
    // La ficha se sustituye por la comparación: Atrás vuelve a donde se estaba antes de la ficha.
    history.replaceState({ panel: true }, "", hashDe(a, b));
    abrir(true);
  }

  /* ---------- La comparación ---------- */
  const vacio = '<span class="muted">—</span>';
  const canon = (n) => (window.Sabores && window.Sabores.canon(n)) || norm(String(n).trim());
  const iguales = (x, y) => !!x && !!y && norm(x) === norm(y);

  function nivelParecido(p) {
    if (p >= 11) return "Mucho";
    if (p >= 7) return "Bastante";
    if (p >= 4) return "Algo";
    return "Poco";
  }
  function frasesParecido(A, B) {
    const t = [];
    if (iguales(A.tipo, B.tipo)) t.push("misma mezcla");
    if (iguales(A.corte, B.corte)) t.push("mismo corte");
    const h = A.hojas.filter((x) => B.hojas.includes(x)).length;
    if (h) t.push(h === 1 ? "una hoja en común" : `${h} hojas en común`);
    const nb = new Set(B.notas.map(canon));
    const n = new Set(A.notas.map(canon).filter((x) => nb.has(x))).size;
    if (n) t.push(n === 1 ? "una nota de sabor en común" : `${n} notas de sabor en común`);
    if (!t.length) return "No comparten mezcla, corte, hojas ni notas.";
    const s = t.length > 1 ? `${t.slice(0, -1).join(", ")} y ${t[t.length - 1]}` : t[0];
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  }

  function fila(etq, va, vb, igual) {
    return `<div class="cm-fila${igual ? " igual" : ""}">
      <span class="cm-etq">${etq}${igual ? '<span class="cm-igual">igual</span>' : ""}</span>
      <div class="cm-dos"><span>${va || vacio}</span><span>${vb || vacio}</span></div></div>`;
  }
  function filaHojas(A, B) {
    const todas = [...new Set([...A.hojas, ...B.hojas])];
    if (!todas.length) return fila("Hojas", "", "", false);
    const igual = todas.every((h) => A.hojas.includes(h) && B.hojas.includes(h));
    // Cada columna repite el nombre de la hoja con su punto; si no la lleva, sale apagada.
    const celda = (d, c, h) => { const on = d.hojas.includes(h);
      return `<span class="cm-h${on ? "" : " no"}"><span class="cm-punto ${c}${on ? " on" : ""}" aria-hidden="true"></span>${esc(h)}<span class="sr">${on ? "" : " (no lleva)"}</span></span>`; };
    return `<div class="cm-fila${igual ? " igual" : ""}">
      <span class="cm-etq">Hojas${igual ? '<span class="cm-igual">igual</span>' : ""}</span>
      ${todas.map((h) => `<div class="cm-dos cm-hoja">${celda(A, "a", h)}${celda(B, "b", h)}</div>`).join("")}</div>`;
  }
  function filaNotas(A, B) {
    if (!A.notas.length && !B.notas.length) return fila("Notas de sabor", "", "", false);
    const ca = new Set(A.notas.map(canon)), cb = new Set(B.notas.map(canon));
    const chips = (d, otras) => d.notas.length ? d.notas.map((n) => `<span class="chip sabor${otras.has(canon(n)) ? " comun" : ""}">${esc(n)}</span>`).join("") : vacio;
    const comunes = [...ca].some((n) => cb.has(n));
    return `<div class="cm-fila">
      <span class="cm-etq">Notas de sabor${comunes ? '<span class="cm-leyenda">en verde, las que comparten</span>' : ""}</span>
      <div class="cm-dos"><span class="cm-chips">${chips(A, cb)}</span><span class="cm-chips">${chips(B, ca)}</span></div></div>`;
  }
  // Valoración (con el mismo mínimo que las medias de la ficha) y, por cada característica que hayan votado
  // en las dos, la opción más votada y su gráfico de columnas, como en «Según las reseñas» de la ficha.
  function filaResenas(A, B) {
    if (!ctx.opiniones) return "";
    const sa = statsDe(A.id), sb = statsDe(B.id);
    const nota = (st) => !st.n ? '<span class="muted">Sin reseñas todavía</span>'
      : st.n < MIN_MEDIAS ? `<span class="muted">${st.n} ${st.n === 1 ? "reseña" : "reseñas"}: faltan para sacar medias</span>`
      : `<strong class="cm-nota">${fmtMedia(st.media)}</strong> <span class="muted">de 5 · ${st.n} reseñas</span>`;
    const oa = opinionesDe(A.id), ob = opinionesDe(B.id);
    const cars = CARACT.map((c) => {
      const va = oa.map((o) => o[c.k]).filter(Boolean), vb = ob.map((o) => o[c.k]).filter(Boolean);
      if (!va.length || !vb.length) return "";
      const ra = columnasCaract(c, va), rb = columnasCaract(c, vb);
      const lado = (r, cls) => `<div class="cm-car ${cls}"><strong>${esc(c.ops[r.top])}</strong><span class="car-n">${r.n} de ${r.total} ${r.total === 1 ? "voto" : "votos"}</span>${r.grafico}</div>`;
      return `<div class="cm-car-f"><span class="cm-car-l">${esc(c.label)}</span><div class="cm-dos">${lado(ra, "a")}${lado(rb, "b")}</div></div>`;
    }).join("");
    return `<div class="cm-fila">
      <span class="cm-etq">Según las reseñas</span>
      <div class="cm-dos"><span>${nota(sa)}</span><span>${nota(sb)}</span></div>
      ${cars ? `<div class="cm-escalas">${cars}</div>` : ""}</div>`;
  }

  function columna(d, cls) {
    return `<div class="cm-col ${cls}">
      <span class="cm-col-art" aria-hidden="true">${art(d)}</span>
      <span class="brandname">${esc(d.marca)}</span>
      <button class="link cm-col-nom" type="button" data-ficha="${esc(d.id)}">${esc(d.nombre)}</button>
      <button class="link cm-cambiar" type="button" data-cambiar="${esc(d.id)}">Cambiar</button>
    </div>`;
  }

  function abrir(desdeUrl) {
    const ids = idsDeHash(); if (!ids) return;
    if (!conCuenta()) { pendiente = ids; pedirCuenta(); return; }
    const A = findItem(ids[0]), B = findItem(ids[1]);
    if (!A || !B || A.id === B.id) {
      abrirPanel(`<div class="d-franja">${FRANJA}</div>
        <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
        <div class="bd-cuerpo"><p class="muted">Esta comparación ya no existe: puede que alguna de las fichas se haya quitado del catálogo.</p></div>`, "bodega-p comparar-p");
      $("d-close").addEventListener("click", () => closeDetail());
      return;
    }
    if (!desdeUrl && location.hash !== hashDe(A.id, B.id)) history.pushState({ panel: true }, "", hashDe(A.id, B.id));
    const p = puntosParecido(A, B);
    const solo = !!abrir.solo;
    abrirPanel(`
      <div class="d-franja">${FRANJA}</div>
      <div class="bd-cab">
        <span class="bd-baul" aria-hidden="true">${ICONO}</span>
        <div><h2 id="d-name">Comparar</h2><p class="muted">${esc(A.nombre)} frente a ${esc(B.nombre)}</p></div>
      </div>
      <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
      <div class="bd-cuerpo cm-cuerpo">
        <div class="cm-cols">${columna(A, "a")}${columna(B, "b")}</div>
        <div class="cm-parecido">
          <div class="cm-p-t"><span>Cuánto se parecen</span><strong>${nivelParecido(p)}</strong></div>
          <span class="cm-p-barra" role="img" aria-label="Se parecen: ${nivelParecido(p).toLowerCase()}"><span style="width:${Math.max(4, Math.round(Math.min(1, Math.max(0, p) / PARECIDO_MAX) * 100))}%"></span></span>
          <p class="muted">${esc(frasesParecido(A, B))}</p>
        </div>
        <label class="cm-solo"><input type="checkbox" id="cm-solo"${solo ? " checked" : ""}> Ver solo lo que cambia</label>
        <div class="cm-tabla${solo ? " solo" : ""}" id="cm-tabla">
          ${fila("Mezcla", esc(A.tipo), esc(B.tipo), iguales(A.tipo, B.tipo))}
          ${fila("Corte", esc(A.corte), esc(B.corte), iguales(A.corte, B.corte))}
          ${fila("Origen", esc(A.pais), esc(B.pais), iguales(A.pais, B.pais))}
          ${fila("Formato", esc(A.formato), esc(B.formato), iguales(A.formato, B.formato))}
          ${filaHojas(A, B)}
          ${filaNotas(A, B)}
          ${filaResenas(A, B)}
        </div>
        <div class="compartir cm-acts"><button class="btn" id="cm-share" type="button">${ico("compartir")}Compartir comparación</button><span class="muted" id="cm-share-msg" role="status"></span></div>
      </div>`, "bodega-p comparar-p");
    document.title = `${A.nombre} frente a ${B.nombre} · ${TITULO}`;
    $("d-close").addEventListener("click", () => closeDetail());
    $("cm-solo").addEventListener("change", (e) => { abrir.solo = e.target.checked; $("cm-tabla").classList.toggle("solo", e.target.checked); });
    $("cm-share").addEventListener("click", () => compartir(A, B));
    $("panel").querySelectorAll("[data-ficha]").forEach((b) => b.addEventListener("click", () => { openDetail(b.dataset.ficha); $("overlay").scrollTop = 0; }));
    // «Cambiar»: se queda el otro tabaco en la bandeja y se vuelve al catálogo a buscar uno nuevo.
    $("panel").querySelectorAll("[data-cambiar]").forEach((b) => b.addEventListener("click", () => {
      const queda = b.dataset.cambiar === String(A.id) ? B : A;
      elegir(queda.id);
      closeDetail();
    }));
    if (elegido && (elegido === String(A.id) || elegido === String(B.id))) elegir("");   // ya está comparado
  }

  async function compartir(A, B) {
    const base = location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "");
    const url = `${base}index.html${hashDe(A.id, B.id)}`, msg = $("cm-share-msg");
    const titulo = `${A.nombre} frente a ${B.nombre}`;
    if (navigator.share) {
      try { await navigator.share({ title: titulo, text: `${titulo} en El herbario de la Comarca`, url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); if (msg) msg.textContent = "Enlace copiado. Pégalo en WhatsApp o Telegram."; }
    catch (e) { if (msg) msg.textContent = url; }
  }

  // Al arrancar (con la sesión ya leída): quien entra por el enlace de una comparación.
  function alArrancar() {
    pintarBandeja();
    if (idsDeHash() && $("overlay").hidden) abrir(true);
  }
  // Al entrar o salir de la cuenta.
  function cambioSesion() {
    pintarBandeja();
    if (!conCuenta()) return;
    if (pendiente) {
      const [a, b] = pendiente; pendiente = null;
      if (location.hash !== hashDe(a, b)) history.pushState({ panel: true }, "", hashDe(a, b));
      abrir(true);
    }
  }

  panelesHash["#/comparar"] = abrir;
  window.Comparar = { enFicha, comparar, alArrancar, cambioSesion, elegir };
  pintarBandeja();
})();
