/* ---------- Mapa de orígenes ----------
   Un mapa real (Europa y América) con los países del campo «Origen» de las fichas.
   Cuantas más fichas tiene un país, más oscuro sale. Al tocar un país se ven sus fichas y marcas,
   y se puede filtrar el catálogo por él. Los países muy pequeños (Jersey…) llevan un punto, y debajo hay
   una lista con todos, que hace lo mismo que el mapa (y sirve para los que no salen en él).
   Los contornos están en mapa-datos.js (Natural Earth, dominio público), que solo se carga al abrir el mapa.
   Se abre desde «Explorar → Orígenes» o con la dirección index.html#/origenes.
   Usa de app.js: current, panelesHash, abrirPanel, closeDetail, ponerFiltros, FRANJA, TITULO, slug, esc, norm, $. */
(function () {
  const VERSION_DATOS = "202611191130";
  const NS = "http://www.w3.org/2000/svg";
  // Otras formas de escribir un país en la ficha -> nombre del mapa
  const ALIAS = {
    "ee uu": "Estados Unidos", "eeuu": "Estados Unidos", "ee. uu.": "Estados Unidos", "usa": "Estados Unidos", "estados unidos de america": "Estados Unidos",
    "holanda": "Países Bajos", "inglaterra": "Reino Unido", "escocia": "Reino Unido", "gales": "Reino Unido", "irlanda del norte": "Reino Unido",
    "gran bretana": "Reino Unido", "chequia": "República Checa",
  };
  const NIVELES = [[1, "1–9"], [10, "10–49"], [50, "50–199"], [200, "200 o más"]];
  const nivel = (n) => NIVELES.reduce((k, [min], i) => (n >= min ? i + 1 : k), 0);
  const fichas = (n) => (n === 1 ? "1 ficha" : `${n.toLocaleString("es-ES")} fichas`);
  const marcasTxt = (n) => (n === 1 ? "1 marca" : `${n} marcas`);
  const limpio = (s) => norm(String(s || "").trim()).replace(/\s+/g, " ");

  let cargando = null;
  function cargarDatos() {
    if (window.MAPA_ORIGENES) return Promise.resolve();
    if (!cargando) cargando = new Promise((ok, mal) => {
      const s = document.createElement("script");
      s.src = `mapa-datos.js?v=${VERSION_DATOS}`;
      s.onload = ok;
      s.onerror = () => { cargando = null; mal(); };
      document.head.appendChild(s);
    });
    return cargando;
  }

  // Dónde está cada país en el mapa: nombre normalizado -> [zona, nombre del mapa]
  function indice() {
    const ix = {};
    Object.entries(window.MAPA_ORIGENES).forEach(([z, d]) => Object.keys(d.paises).forEach((p) => { ix[limpio(p)] = [z, p]; }));
    Object.entries(ALIAS).forEach(([a, p]) => { const x = ix[limpio(p)]; if (x) ix[a] = x; });
    return ix;
  }
  // Países de las fichas, con su número de fichas y marcas. «valor» es el texto tal como está en la ficha
  // (es lo que usa el filtro del catálogo); si un país se escribe de dos formas, gana la más usada.
  function contar(ix) {
    const porPais = {};
    let sinPais = 0;
    current.forEach((d) => {
      const v = String(d.pais || "").trim();
      if (!v) { sinPais++; return; }
      const sitio = ix[limpio(v)];
      const clave = sitio ? sitio[1] : v;
      const p = porPais[clave] || (porPais[clave] = { nombre: clave, zona: sitio ? sitio[0] : null, n: 0, marcas: {}, valores: {} });
      p.n++;
      if (d.marca) p.marcas[d.marca] = (p.marcas[d.marca] || 0) + 1;
      p.valores[v] = (p.valores[v] || 0) + 1;
    });
    const lista = Object.values(porPais).map((p) => ({
      ...p,
      valor: Object.entries(p.valores).sort((a, b) => b[1] - a[1])[0][0],
      marcas: Object.entries(p.marcas).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es")),
    })).sort((a, b) => b.n - a.n || a.nombre.localeCompare(b.nombre, "es"));
    return { lista, sinPais };
  }

  function dibujo(zona, porNombre) {
    const z = window.MAPA_ORIGENES[zona];
    let tierra = `<path class="mo-fondo" d="${z.fondo}"/>`, puntos = "", marcas = "";
    Object.entries(z.paises).forEach(([nombre, p]) => {
      const dato = porNombre[nombre];
      if (!dato) { tierra += `<path class="mo-fondo" d="${p.d}"/>`; return; }
      const etiqueta = `${esc(nombre)}: ${fichas(dato.n)}`;
      tierra += `<path class="mo-pais" data-p="${esc(nombre)}" style="--nv:var(--mo-${nivel(dato.n)})" d="${p.d}" tabindex="0" role="button" aria-label="${etiqueta}"/>`;
      const [x, y] = p.c;
      if (p.peq) puntos += `<circle class="mo-punto" data-p="${esc(nombre)}" cx="${x}" cy="${y}" r="9" style="--nv:var(--mo-${nivel(dato.n)})"/>`;
      const txt = dato.n.toLocaleString("es-ES"), ancho = Math.max(38, 14 + txt.length * 12);
      const dy = p.peq ? -24 : 0;
      marcas += `<g class="mo-cifra" transform="translate(${x} ${y + dy})"><rect x="${-ancho / 2}" y="-16" width="${ancho}" height="32" rx="16"/><text text-anchor="middle" dominant-baseline="central">${txt}</text></g>`;
    });
    return `<svg class="mo-mapa" id="mo-mapa" viewBox="0 0 ${z.w} ${z.h}" role="group" aria-label="Mapa de ${esc(z.nombre)}">
      <rect class="mo-mar" width="${z.w}" height="${z.h}"/>${tierra}${puntos}<g class="mo-cifras" aria-hidden="true">${marcas}</g></svg>`;
  }

  function abrir(desdeUrl) {
    if (!desdeUrl && location.hash !== "#/origenes") history.pushState({ panel: true }, "", "#/origenes");
    abrirPanel(`
      <div class="d-franja">${FRANJA}</div>
      <div class="bd-cab">
        <span class="bd-baul" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.4"/></svg></span>
        <div><h2 id="d-name">Mapa de orígenes</h2><p class="muted" id="mo-sub">De dónde son los tabacos del herbario.</p></div>
      </div>
      <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
      <div class="bd-cuerpo mo-cuerpo">
        <div class="mo-izq">
          <div class="mo-tabs" role="tablist" aria-label="Zona del mapa">
            <button type="button" role="tab" data-z="eu" aria-selected="true">Europa</button>
            <button type="button" role="tab" data-z="am" aria-selected="false">América</button>
          </div>
          <div class="mo-dibujo" id="mo-dibujo"><p class="muted">Cargando el mapa…</p></div>
          <div class="mo-leyenda" aria-hidden="true"><span>Fichas:</span>${NIVELES.map(([, t], i) => `<span><i style="--nv:var(--mo-${i + 1})"></i>${t}</span>`).join("")}</div>
        </div>
        <div class="mo-info" id="mo-info" aria-live="polite"></div>
      </div>`, "bodega-p origenes-p");
    document.title = "Mapa de orígenes · " + TITULO;
    $("d-close").addEventListener("click", () => closeDetail());

    cargarDatos().then(() => montar(), () => {
      const caja = $("mo-dibujo");
      if (caja) caja.innerHTML = '<p class="muted">No se ha podido cargar el mapa. Comprueba la conexión y vuelve a abrirlo.</p>';
    });
  }

  function montar() {
    if (!$("mo-dibujo")) return;   // se cerró mientras cargaba
    const ix = indice(), { lista, sinPais } = contar(ix);
    const porNombre = Object.fromEntries(lista.map((p) => [p.nombre, p]));
    const total = lista.reduce((s, p) => s + p.n, 0);
    $("mo-sub").textContent = `De dónde son ${fichas(total)} del herbario, en ${lista.length} ${lista.length === 1 ? "país" : "países"}.`;
    let zona = "eu", elegido = null;

    function pintarMapa() {
      $("mo-dibujo").innerHTML = dibujo(zona, porNombre);
      document.querySelectorAll(".mo-tabs [data-z]").forEach((b) => b.setAttribute("aria-selected", b.dataset.z === zona ? "true" : "false"));
      const svg = $("mo-mapa");
      svg.querySelectorAll("[data-p]").forEach((el) => {
        el.addEventListener("click", () => elegir(el.dataset.p));
        el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(el.dataset.p); } });
      });
      marcar();
    }
    // El país elegido se resalta y pasa por encima de sus vecinos (para que se vea todo su borde).
    function marcar() {
      const svg = $("mo-mapa"); if (!svg) return;
      svg.querySelectorAll("[data-p]").forEach((el) => {
        const on = el.dataset.p === elegido;
        el.classList.toggle("sel", on);
        if (on && el.tagName === "path") svg.insertBefore(el, svg.querySelector(".mo-punto, .mo-cifras"));
      });
    }
    function elegir(nombre) {
      elegido = nombre;
      const p = porNombre[nombre];
      if (p && p.zona && p.zona !== zona) { zona = p.zona; pintarMapa(); } else marcar();
      pintarInfo();
    }

    function chipsPaises() {
      return `<div class="rs-chips mo-paises">${lista.map((p) => `<button type="button" class="rs-chip${p.nombre === elegido ? " on" : ""}" style="--c1:var(--accent);--c2:var(--surface)" data-pais="${esc(p.nombre)}" aria-pressed="${p.nombre === elegido}">${esc(p.nombre)}<small>${p.n.toLocaleString("es-ES")}</small></button>`).join("")}</div>`;
    }
    function pintarInfo() {
      const box = $("mo-info"); if (!box) return;
      const p = elegido && porNombre[elegido];
      if (p) {
        const MAX = 24, vistas = p.marcas.slice(0, MAX);
        box.innerHTML = `<span class="rs-fam-l" style="--c1:var(--mo-${nivel(p.n)})">${p.zona ? esc(window.MAPA_ORIGENES[p.zona].nombre) : "Fuera del mapa"}</span>
          <h3>${esc(p.nombre)}</h3><p class="muted">${fichas(p.n)} · ${marcasTxt(p.marcas.length)}</p>
          <button class="btn primary" type="button" id="mo-ver">Ver ${p.n === 1 ? "la ficha" : `las ${p.n.toLocaleString("es-ES")} fichas`}</button>
          <p class="rs-otras muted">Sus marcas</p>
          <div class="rs-chips">${vistas.map(([m, n]) => `<a class="rs-chip" style="--c1:var(--accent);--c2:var(--surface)" href="marca/${esc(slug(m))}.html">${esc(m)}<small>${n}</small></a>`).join("")}</div>
          ${p.marcas.length > MAX ? `<p class="muted">Y ${p.marcas.length - MAX} más.</p>` : ""}
          <p class="rs-otras muted">Otros países</p>${chipsPaises()}`;
        $("mo-ver").addEventListener("click", () => verPais(p.valor));
      } else {
        box.innerHTML = `<h3>Elige un país</h3>
          <p class="muted">Toca un país en el mapa o en la lista. Cuanto más oscuro, más fichas tiene; el número es el de fichas.</p>
          ${chipsPaises()}
          <p class="muted rs-nota-pie">El origen es el que figura en cada ficha.${sinPais ? ` Hay ${fichas(sinPais)} sin origen todavía.` : ""}</p>`;
      }
      box.querySelectorAll("[data-pais]").forEach((b) => b.addEventListener("click", () => elegir(b.dataset.pais)));
    }

    document.querySelectorAll(".mo-tabs [data-z]").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.z === zona) return;
      zona = b.dataset.z; pintarMapa();
    }));
    pintarMapa();
    // Si se vuelve con un país ya filtrado, se abre con ese país elegido.
    const ya = state.pais && ix[limpio(state.pais)];
    if (ya && porNombre[ya[1]]) elegir(ya[1]); else pintarInfo();
  }

  // Cierra el mapa y deja el catálogo filtrado por el país. La entrada del mapa se sustituye,
  // así Atrás lleva al catálogo sin filtros.
  function verPais(valor) {
    if (location.hash === "#/origenes") history.replaceState(null, "", location.pathname + location.search);
    closeDetail(true);
    ponerFiltros({ pais: valor });
    const g = $("grid");
    if (g) window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - 8), behavior: "smooth" });
  }

  panelesHash["#/origenes"] = abrir;
  window.Origenes = { abrir };
  document.querySelectorAll('a[href="#/origenes"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); abrir(); }));
  if (location.hash === "#/origenes") abrir(true);
})();
