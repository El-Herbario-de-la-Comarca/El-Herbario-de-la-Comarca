/* ---------- Rueda de sabores ----------
   Las notas de sabor de las fichas, agrupadas en familias y dibujadas en un círculo.
   Al tocar una nota se ve cuántas fichas la tienen y se puede filtrar el catálogo por ella.
   Las notas que significan lo mismo cuentan como una sola (ALIAS); las palabras vagas
   («dulce», «suave», «cremoso»…) no salen en la rueda, aunque sigan en la ficha.
   Se abre desde «Explorar → Sabores» o con la dirección index.html#/sabores.
   Usa de app.js: current, state, abrirPanel, closeDetail, ponerFiltros, FRANJA, esc, norm, $. */
(function () {
  // [nombre, color fuerte, color claro, color del texto sobre el fuerte, notas]
  const FAMILIAS = [
    ["Dulces", "#C9962E", "#F1E2BC", "#2E2418", ["miel", "vainilla", "chocolate", "caramelo", "arce", "azúcar moreno", "regaliz", "turrón"]],
    ["Frutas", "#B5523B", "#EFD0C4", "#FBF6EA", ["cítricos", "frutos rojos", "cereza", "ciruela", "higo", "pasas", "frutas tropicales", "melocotón", "albaricoque", "manzana", "granada", "fruta"]],
    ["Frutos secos y tostados", "#8A5A2B", "#E6D3BC", "#FBF6EA", ["nuez", "avellana", "almendra", "frutos secos", "pan tostado", "bizcocho", "café"]],
    ["Especias", "#9C4468", "#EBCCD8", "#FBF6EA", ["pimienta", "especias dulces", "especias", "anís", "tonka"]],
    ["Hierba y flores", "#5F7F34", "#D7E2BC", "#FBF6EA", ["heno", "hierba", "té", "floral", "hierbas aromáticas"]],
    ["Tierra y madera", "#6E604C", "#DED5C5", "#FBF6EA", ["terroso", "cuero", "madera", "cedro", "tabaco curado"]],
    ["Humo", "#5D6E80", "#D3DAE2", "#FBF6EA", ["ahumado", "incienso", "hoguera"]],
    ["Licores", "#674C88", "#DBD0E7", "#FBF6EA", ["whisky", "ron", "vino", "licor"]],
    ["Ácidos y fermentados", "#2F7E6C", "#C9E3DA", "#FBF6EA", ["vinagre", "fermentado"]],
  ];
  // Nombre corto de cada familia para el anillo de dentro
  const CORTOS = { "Frutos secos y tostados": "Tostados", "Hierba y flores": "Hierba", "Tierra y madera": "Tierra", "Ácidos y fermentados": "Ácidos" };
  // Notas escritas de otra forma que cuentan como una de la rueda.
  const ALIAS = {
    "ciruela mirabel": "ciruela", "ciruela pasa": "ciruela", "ciruelas": "ciruela",
    "canela": "especias dulces", "clavo": "especias dulces", "especiado": "especias",
    "frutas exoticas": "frutas tropicales", "mango": "frutas tropicales", "pina": "frutas tropicales",
    "citrico": "cítricos", "naranja": "cítricos", "limon": "cítricos",
    "fruta pasa": "pasas", "frutal": "fruta", "frutas": "fruta",
    "grosella negra": "frutos rojos", "ron jamaicano": "ron", "bourbon": "whisky",
    "conac": "licor", "jerez": "licor", "humo oscuro": "ahumado", "hierbas": "hierbas aromáticas",
  };
  const FAM_DE = {}, CANON = {};
  FAMILIAS.forEach((f) => f[4].forEach((n) => { FAM_DE[n] = f; CANON[norm(n)] = n; }));
  Object.entries(ALIAS).forEach(([a, n]) => { CANON[norm(a)] = n; });
  const canon = (nota) => CANON[norm(String(nota || "").trim())] || null;
  const tieneNota = (d, nota) => (d.notas || []).some((n) => canon(n) === nota);
  const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fichas = (n) => (n === 1 ? "1 ficha" : `${n.toLocaleString("es-ES")} fichas`);

  // Cuántas fichas tiene cada nota (una ficha cuenta una vez aunque lleve dos alias de la misma nota).
  function contar() {
    const c = {};
    current.forEach((d) => new Set((d.notas || []).map(canon).filter(Boolean)).forEach((n) => { c[n] = (c[n] || 0) + 1; }));
    return c;
  }

  const NS = "http://www.w3.org/2000/svg";
  const R0 = 46, R1 = 98, R2 = 102, R3 = 196;   // anillo de familias y anillo de notas
  const pt = (r, a) => [+(r * Math.sin(a)).toFixed(2), +(-r * Math.cos(a)).toFixed(2)];
  function arco(r0, r1, a0, a1) {
    const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0), l = a1 - a0 > Math.PI ? 1 : 0;
    return `M${x0} ${y0}A${r1} ${r1} 0 ${l} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${l} 0 ${x3} ${y3}Z`;
  }
  // Texto en dirección al centro, girado para que nunca quede boca abajo.
  function texto(s, r, a, clase, color, haciaFuera) {
    const deg = (a * 180) / Math.PI - 90, vuelta = deg > 90 && deg < 270, [x, y] = pt(r, a);
    const ancla = haciaFuera ? (vuelta ? "end" : "start") : "middle";
    return `<text class="${clase}" x="${x}" y="${y}"${color ? ` style="fill:${color}"` : ""} text-anchor="${ancla}" dominant-baseline="central" transform="rotate(${(vuelta ? deg + 180 : deg).toFixed(1)} ${x} ${y})">${esc(s)}</text>`;
  }

  function dibujo(cuentas) {
    const fams = FAMILIAS.map((f) => [f, f[4].filter((n) => cuentas[n]).sort((a, b) => cuentas[b] - cuentas[a] || a.localeCompare(b, "es"))])
      .filter(([, ns]) => ns.length);
    const total = fams.reduce((s, [, ns]) => s + ns.length, 0);
    if (!total) return "";
    const paso = (2 * Math.PI) / total;
    let a = 0, formas = "", letras = "";
    fams.forEach(([f, ns]) => {
      const a0 = a, corto = CORTOS[f[0]] || f[0];
      formas += `<path class="rs-fam" d="${arco(R0, R1, a0, a0 + ns.length * paso)}" style="--c1:${f[1]};--c2:${f[2]}" data-fam="${esc(f[0])}" tabindex="0" role="button" aria-label="${esc(f[0])}"/>`;
      // El nombre va a lo ancho del anillo; si la familia tiene muy poco arco, solo la inicial.
      letras += texto(ns.length * paso * ((R0 + R1) / 2) >= 13 ? corto : corto.charAt(0), (R0 + R1) / 2, a0 + (ns.length * paso) / 2, "rs-tf", f[3], false);
      ns.forEach((n, i) => {
        formas += `<path class="rs-nota" d="${arco(R2, R3, a0 + i * paso, a0 + (i + 1) * paso)}" style="--c1:${f[1]};--c2:${f[2]}" data-nota="${esc(n)}" tabindex="0" role="button" aria-label="${esc(n)}: ${fichas(cuentas[n])}"/>`;
        letras += texto(n, R2 + 6, a0 + (i + 0.5) * paso, "rs-tn", "", true);
      });
      a += ns.length * paso;
    });
    return `<svg class="rueda" id="rueda" viewBox="-200 -200 400 400" role="group" aria-label="Rueda de sabores">${formas}${letras}
      <circle class="rs-centro" r="${R0 - 3}" tabindex="0" role="button" aria-label="Ver todas las familias"/>
      <text class="rs-tc" text-anchor="middle" dominant-baseline="central">Sabores</text></svg>`;
  }

  let abierta = false;
  function abrir(desdeUrl) {
    if (!desdeUrl && location.hash !== "#/sabores") history.pushState({ sabores: true }, "", "#/sabores");
    const cuentas = contar();
    const conNota = current.filter((d) => (d.notas || []).some(canon)).length;
    abrirPanel(`
      <div class="d-franja">${FRANJA}</div>
      <div class="bd-cab">
        <span class="bd-baul" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v5.3M12 15.2v5.3M3.5 12h5.3M15.2 12h5.3M6 6l3.7 3.7M14.3 14.3 18 18M18 6l-3.7 3.7M9.7 14.3 6 18"/></svg></span>
        <div><h2 id="d-name">Rueda de sabores</h2><p class="muted">Las notas de sabor de ${fichas(conNota)}, agrupadas por familias.</p></div>
      </div>
      <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
      <div class="bd-cuerpo rs-cuerpo">
        <div class="rs-dibujo">${dibujo(cuentas)}</div>
        <div class="rs-info" id="rs-info" aria-live="polite"></div>
      </div>`, "bodega-p sabores-p");
    abierta = true;
    document.title = "Rueda de sabores · " + TITULO;
    $("d-close").addEventListener("click", () => closeDetail());
    const svg = $("rueda"); if (!svg) { $("rs-info").innerHTML = '<p class="muted">Aún no hay notas de sabor.</p>'; return; }
    const elegir = (el) => {
      svg.classList.add("foco");
      svg.querySelectorAll("path").forEach((p) => p.classList.remove("on"));
      el.classList.add("on");
      if (el.dataset.nota) {
        const n = el.dataset.nota, f = FAM_DE[n];
        svg.querySelector(`.rs-fam[data-fam="${CSS.escape(f[0])}"]`).classList.add("on");
        pintarInfo(f, n, cuentas);
      } else {
        const f = FAMILIAS.find((x) => x[0] === el.dataset.fam);
        svg.querySelectorAll(".rs-nota").forEach((p) => { if (FAM_DE[p.dataset.nota] === f) p.classList.add("on"); });
        pintarInfo(f, null, cuentas);
      }
    };
    svg.querySelectorAll("path").forEach((p) => {
      p.addEventListener("click", () => elegir(p));
      p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(p); } });
    });
    const centro = () => { svg.classList.remove("foco"); svg.querySelectorAll("path").forEach((p) => p.classList.remove("on")); pintarInfo(null, null, cuentas); };
    svg.querySelector(".rs-centro").addEventListener("click", centro);
    svg.querySelector(".rs-centro").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); centro(); } });
    // Si se vuelve con una nota ya filtrada, la rueda se abre con ella marcada.
    const ya = state.nota && svg.querySelector(`.rs-nota[data-nota="${CSS.escape(state.nota)}"]`);
    if (ya) elegir(ya); else pintarInfo(null, null, cuentas);
  }

  function chips(f, cuentas) {
    return `<div class="rs-chips">${f[4].filter((n) => cuentas[n]).sort((a, b) => cuentas[b] - cuentas[a])
      .map((n) => `<button type="button" class="rs-chip" style="--c1:${f[1]};--c2:${f[2]}" data-ver="${esc(n)}">${esc(n)}<small>${cuentas[n]}</small></button>`).join("")}</div>`;
  }
  function pintarInfo(f, nota, cuentas) {
    const box = $("rs-info"); if (!box) return;
    if (nota) {
      const n = cuentas[nota] || 0;
      box.innerHTML = `<span class="rs-fam-l" style="--c1:${f[1]}">${esc(f[0])}</span>
        <h3>${esc(mayus(nota))}</h3><p class="muted">${fichas(n)} con esta nota.</p>
        <button class="btn primary" type="button" data-ver="${esc(nota)}">Ver ${n === 1 ? "la ficha" : `las ${n.toLocaleString("es-ES")} fichas`}</button>
        <p class="rs-otras muted">Otras notas de la familia</p>${chips(f, cuentas)}`;
    } else if (f) {
      box.innerHTML = `<span class="rs-fam-l" style="--c1:${f[1]}">Familia</span><h3>${esc(f[0])}</h3>
        <p class="muted">Toca una nota para ver sus fichas.</p>${chips(f, cuentas)}`;
    } else {
      const usadas = Object.keys(cuentas).length;
      box.innerHTML = `<h3>Elige un sabor</h3>
        <p class="muted">Toca una familia del anillo de dentro o una nota del de fuera. Hay ${usadas} notas en ${FAMILIAS.filter((x) => x[4].some((n) => cuentas[n])).length} familias.</p>
        <p class="muted rs-nota-pie">Las notas salen de la descripción del fabricante o, si no la hay, de las hojas de la mezcla.</p>`;
    }
    box.querySelectorAll("[data-ver]").forEach((b) => b.addEventListener("click", () => verNota(b.dataset.ver)));
  }

  // Cierra la rueda y deja el catálogo filtrado por la nota. La entrada de la rueda se sustituye,
  // así Atrás lleva al catálogo sin filtros.
  function verNota(nota) {
    if (location.hash === "#/sabores") history.replaceState(null, "", location.pathname + location.search);
    closeDetail(true);
    ponerFiltros({ nota });
    const g = $("grid");
    if (g) window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - 8), behavior: "smooth" });
  }

  window.Sabores = {
    canon, tieneNota, abrir, verNota,
    abierta: () => abierta && !$("overlay").hidden && !!$("rueda"),
    cerrada: () => { abierta = false; },
  };

  document.querySelectorAll('a[href="#/sabores"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); abrir(); }));
  if (location.hash === "#/sabores") abrir(true);
})();
