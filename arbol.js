/* ---------- Árbol de marcas ----------
   Quién es dueño de cada marca (línea continua) y quién la elabora para otro (línea discontinua).
   Se abre desde «Explorar → Árbol de marcas» o con la dirección index.html#/arbol.
   Solo entra lo comprobado: cada grupo lleva sus fuentes en FUENTES (no se enseñan en la web).
   Para cambiar algo, se edita GRUPOS y se sube el ?v= de arbol.js en index.html.
   Usa de app.js: current, panelesHash, abrirPanel, closeDetail, ponerFiltros, FRANJA, TITULO, slug, esc, $.

   Cada rama: { m: marca tal como está en el catálogo (o null si no tiene fichas), t: texto que se
   enseña (si es distinto de m), a: año, n: nota, e: true si es «la elabora», h: ramas hijas }. */
(function () {
  const GRUPOS = [
    { id: "stg", nombre: "Scandinavian Tobacco Group", corto: "STG", pais: "Dinamarca",
      historia: "Grupo danés y el mayor productor de tabaco de pipa del mundo. En 1990 separó su tabaco de pipa en Orlik Tobacco Company, y desde entonces ha ido comprando casas y marcas de medio mundo. Buena parte de sus mezclas se elaboran en su fábrica de Assens.",
      h: [
        { m: "Orlik", t: "Orlik Tobacco Company", a: 1990, n: "La rama de tabaco de pipa del grupo.", h: [
          { m: "Erinmore", a: 2007, n: "Comprada a British American Tobacco." },
          { m: "Clan", a: 2007, n: "Comprada a British American Tobacco." },
          { m: "Danske Club", n: "Comprada a British American Tobacco." },
          { m: "Kentucky Bird", n: "Comprada a British American Tobacco." },
          { m: "Escudo", e: true, a: 2004, n: "La Navy De Luxe que crearon los Cope en 1912. Orlik la elabora desde 2004 con la marca A&C Petersen." },
          { m: "Richmond", e: true, n: "Su Navy Cut la elabora Orlik." },
          { m: "Ashton", e: true, n: "La elabora Orlik en Assens." },
        ] },
        { m: "Stanwell", a: 2003, n: "Comprada a British American Tobacco. Las pipas las lleva Kopp con licencia." },
        { m: "W.Ø. Larsen", n: "La casa de Copenhague pasó a Stanwell y hoy figura entre las marcas del grupo." },
        { m: "Borkum Riff", a: 2011, n: "Nacida en Suecia en 1962. Se elabora en Assens." },
        { m: "Skandinavik", n: "Marca del grupo, con mezclas de Peter Stokkebye." },
        { m: "Alsbo", e: true, n: "Se elabora en la fábrica de STG en Assens." },
        { m: "Comoy's", e: true, n: "El tabaco de la antigua casa de pipas londinense lo elabora STG en Dinamarca." },
        { m: "Lane Limited", a: 2011, n: "Comprada a Reynolds American.", h: [
          { m: "Captain Black" },
          { m: "Half and Half", n: "Nacida con una receta de American Tobacco del siglo XIX." },
          { m: "Sir Walter Raleigh", e: true, n: "La elabora Lane. Antes era de Brown & Williamson." },
        ] },
        { m: "Peterson", t: "Peterson (tabaco)", a: 2019, n: "Las marcas de tabaco de Kapp & Peterson. Las pipas son de Laudisi.", h: [
          { m: null, t: "Mezclas de Dunhill", a: 2019, n: "Early Morning Pipe, Nightcap, Royal Yacht, Elizabethan Mixture… Hoy se venden como Peterson." },
        ] },
        { m: "STG", t: "Mac Baren", a: 2024, n: "La casa de Svendborg. Tras la compra cerró su fábrica; sus mezclas están en el catálogo como STG.", h: [
          { m: "Planta", a: 2019, n: "Mac Baren se quedó con las marcas de tabaco de pipa de esta casa de Berlín, que dejó de fabricar.", h: [
            { m: "Holger Danske" }, { m: "Cellini" }, { m: "Mc Lintock" }, { m: "R and M" }, { m: "Brigg" },
          ] },
          { m: "St. Bruno", a: 2015, n: "La de Ogden's de Liverpool. Mac Baren la elaboraba desde 2006 y en 2015 se quedó con la marca." },
          { m: "Capstan", e: true, n: "La marca es de Imperial Brands. La elaboraba Mac Baren, y antes Orlik." },
          { m: "Three Nuns", e: true, n: "La marca es de Imperial Brands. La elaboraba Mac Baren, y antes Orlik." },
          { m: "Sutliff", a: 2013, n: "Comprada por Mac Baren. Cerró su fábrica de Richmond en 2025." },
          { m: "Amsterdamer", n: "Nació en la francesa Seita y pasó por Imperial antes de ser de Mac Baren." },
          { m: "Amphora", e: true, n: "Figura en el catálogo de Mac Baren." },
        ] },
      ] },
    { id: "laudisi", nombre: "Laudisi Enterprises", corto: "Laudisi", pais: "Estados Unidos",
      historia: "Grupo estadounidense dirigido por Sykes Wilford, que vende, distribuye y fabrica pipas y tabaco.",
      h: [
        { m: "Cornell & Diehl", a: 2014, n: "Se unió al grupo el 1 de enero de 2014. Sigue elaborando en Morganton (Carolina del Norte).", h: [
          { m: "G. L. Pease", e: true, n: "Cornell & Diehl elabora sus mezclas." },
        ] },
        { m: null, t: "Peterson (pipas)", n: "La fábrica de pipas y la tienda de Dublín. El tabaco Peterson es de STG." },
      ] },
    { id: "gawith", nombre: "Gawith Hoggarth & Co", corto: "Gawith Hoggarth", pais: "Kendal, Inglaterra",
      historia: "Empresa familiar de Kendal, dirigida por descendientes de los Gawith y último fabricante de tabaco de Inglaterra. Nació en 1887 y en 1923 pasó a ser sociedad limitada.",
      h: [
        { m: "Gawith Hoggarth" },
        { m: "Samuel Gawith", a: 2015, n: "Las dos casas Gawith, separadas desde 1878, vuelven a estar juntas. Siguen siendo marcas distintas." },
        { m: "Brookfield", e: true, n: "Entre las líneas que elabora." },
        { m: "Thomas Radford", e: true, n: "Entre las líneas que elabora." },
        { m: "Rattray's", e: true, n: "Elabora parte de sus mezclas. La marca es de Kopp." },
        { m: "Robert McConnell", e: true, n: "Elabora parte de sus mezclas. La marca es de Kopp." },
      ] },
    { id: "kopp", nombre: "Kopp", corto: "Kopp", pais: "Alemania",
      historia: "Casa familiar alemana. Kopp Pipes nació en 1919 y Kopp Tobaccos en 1979; durante años la empresa se llamó Kohlhase & Kopp. Hoy es de los hermanos Oliver y Thilo Kopp, que llevan también, con licencia de STG, las pipas Stanwell.",
      h: [
        { m: null, t: "Kopp Tobaccos", a: 1979, n: "Mezclas de tabaco de pipa.", h: [
          { m: "Kopp", n: "Mezclas con el nombre de la casa, como la serie Caribbean Blue." },
          { m: "Robert McConnell" },
          { m: "Fribourg & Treyer" },
          { m: "Ilsted" },
          { m: "Wessex", e: true, n: "Kopp elabora sus mezclas." },
        ] },
        { m: null, t: "Kopp Pipes", a: 1919, n: "Pipas y accesorios.", h: [{ m: "Rattray's" }] },
      ] },
    { id: "imperial", nombre: "Imperial Brands", corto: "Imperial Brands", pais: "Reino Unido",
      historia: "Gran tabaquera británica, antes llamada Imperial Tobacco. Conserva varias marcas clásicas de pipa, aunque ya no las elabora ella.",
      h: [
        { m: "Capstan", n: "Marca de W.D. & H.O. Wills. La elaboraba Mac Baren (STG)." },
        { m: "Three Nuns", n: "Marca de Bell's. La elaboraba Mac Baren (STG)." },
      ] },
    { id: "altria", nombre: "Altria", corto: "Altria", pais: "Estados Unidos",
      historia: "Gran tabaquera estadounidense. Su tabaco de pipa está en John Middleton, comprada en 2007.",
      h: [
        { m: null, t: "John Middleton", a: 2007, n: "Casa de Pensilvania.", h: [
          { m: "Prince Albert" }, { m: "Carter Hall" },
        ] },
      ] },
    { id: "jti", nombre: "Japan Tobacco International", corto: "JTI", pais: "Japón",
      historia: "La tabaquera japonesa compró en 2007 la británica Gallaher, y con ella sus tabacos de pipa.",
      h: [
        { m: null, t: "Gallaher", a: 2007, n: "Tabaquera británica, nacida en Irlanda del Norte.", h: [
          { m: "Condor", n: "La de la bolsa verde. Ya no se fabrica." },
        ] },
      ] },
    { id: "davidoff", nombre: "Oettinger Davidoff", corto: "Oettinger Davidoff", pais: "Suiza",
      historia: "Casa de Basilea, dueña de la marca Davidoff para puros, tabaco de pipa y accesorios. La marca Davidoff de cigarrillos es de Imperial Brands.",
      h: [{ m: "Davidoff", a: 1972, n: "Sus tabacos de pipa salieron en 1972." }] },
    { id: "indep", nombre: "Casas independientes", corto: "independientes", pais: "Varios países",
      historia: "Casas que no forman parte de ningún grupo. Muchas son fabricantes de pipas con mezclas propias.",
      h: [
        { m: "Dan Tobacco", a: 1991, n: "Alemania. Nació como Dan Pipe en 1972, de la mano de Heiko Behrens; en 1991 abrió su fábrica de tabaco en Lauenburg." },
        { m: "Vauen", n: "Alemania. Fabricante de pipas de Núremberg desde 1848; el nombre viene de «Vereinigte Pfeifenfabriken Nürnberg». Elabora también sus mezclas." },
        { m: "Savinelli", n: "Italia. Casa familiar de pipas, nacida en Milán en 1876." },
        { m: "Chacom", n: "Francia. Fabricante de pipas nacido en 1928 de la unión de los Comoy y sus primos Chapuis." },
        { m: "Erik Stokkebye", n: "Dinamarca. Cuarta generación de una familia de tabaqueros; sus mezclas se elaboran en Dinamarca." },
        { m: "Germain's", n: "Jersey. Casa familiar con registros desde 1820; la fundó Thomas Aubin y la siguieron los Germain.", h: [
          { m: "Esoterica", e: true, n: "Marca creada en 1988 por Stephen Richman y hoy de Mike Butera. Sus mezclas las elabora Germain's." },
        ] },
        { m: "Sillem's", n: "Alemania. Nombre de una familia de comerciantes de Hamburgo; la marca es hoy de Seiffert & Sohn, de Kassel." },
        { m: "Astley's", n: "Reino Unido. La tabaquería de Jermyn Street (Londres), abierta en 1862 y ya cerrada. El nombre lo compró Moty Ezrati, dueño de las pipas James Upshall." },
      ] },
  ];
  // Fuentes de cada grupo, para quien lo revise (no salen en la web).
  // eslint-disable-next-line no-unused-vars
  const FUENTES = {
    stg: ["https://pipesmagazine.com/?p=5149", "https://www.st-group.com/press-media/news-stories/press-releases/orlik-acquires-pipe-tobacco-brands-from-bat",
      "https://www.kopp-pipes.com/en/stanwell/", "https://pipedia.org/wiki/W.%C3%98._Larsen", "https://en.wikipedia.org/wiki/Borkum_Riff",
      "https://www.st-group.com/press-media/news-stories/press-releases/scandinavian-tobacco-group-a-s-completes-acquisition-of-lane-limited",
      "https://en.wikipedia.org/wiki/Scandinavian_Tobacco_Group", "https://www.tobaccoreporter.com/2019/07/st-buys-dunhill-assets/",
      "https://halfwheel.com/scandinavian-tobacco-group-acquires-peterson-pipe-tobacco-brands/275372/",
      "https://cigar-coop.com/2024/07/stg-completes-acquisition-of-mac-baren-news.html", "https://mac-baren.com/mac-baren-tobacco-company-take-over-planta-tabak/",
      "https://en.wikipedia.org/wiki/Mac_Baren", "https://mac-baren.com/pipe-tobacco/"],
    laudisi: ["https://pipesmagazine.com/?p=7429", "https://www.smokingpipes.com/smokingpipesblog/single.cfm/post/cornell-diehl-making-union-square",
      "https://halfwheel.com/scandinavian-tobacco-group-acquires-peterson-pipe-tobacco-brands/275372/"],
    gawith: ["https://www.gawithhoggarth.ltd/gawith-hoggarth", "https://www.smokingpipes.com/smokingpipesblog/single.cfm/post/the-history-gawith-hoggarth-co"],
    kopp: ["https://www.kopp-companies.com/en/", "https://www.kopp-pipes.com/en/stanwell/"],
    tanda1: ["https://www.tobaccoreviews.com/blend/6/scandinavian-tobacco-group-stg-escudo-navy-de-luxe/",
      "https://www.tobaccoreviews.com/blend/3341/orlik-tobacco-company-as-richmond-navy-cut/",
      "https://www.tobaccoreviews.com/blend/1149/scandinavian-tobacco-group-stg-half-half",
      "https://www.tobaccoreviews.com/blend/1237/scandinavian-tobacco-group-stg-sir-walter-raleigh",
      "https://www.smokingpipes.com/smokingpipesblog/single.cfm/post/classic-pipe-tobaccos-st-bruno-first-impressions",
      "https://pipesmagazine.com/?p=6933", "https://www.badgerandblade.com/forum/threads/stg-to-stop-making-3-nuns-and-capstan.344134/",
      "https://en.wikipedia.org/wiki/John_Middleton_Co.", "https://en.wikipedia.org/wiki/Gallaher_Group",
      "https://pipesmagazine.com/forums/threads/some-bad-news-for-the-condor-lovers.103649/"],
    tanda2: ["https://www.tobaccoreviews.com/blend/15/ashton-type-1/", "https://en.wikipedia.org/wiki/Davidoff", "https://pipedia.org/wiki/Dan_Pipe",
      "https://www.smokingpipes.com/pipe-tobacco/vauen/", "https://en.wikipedia.org/wiki/Savinelli_Pipes", "https://www.smokingpipes.com/pipe-tobacco/chacom/",
      "https://pipesmagazine.com/?p=6064", "https://theislandwiki.org/wiki/J_F_Germain_and_Son,_tobacco_manufacturers",
      "https://pipesmagazine.com/forums/threads/esoterica-tobacciana.26750/"],
    tanda3: ["https://pipesmagazine.com/?p=17772", "https://www.tobaccoreviews.com/blend/1280/scandinavian-tobacco-group-stg-skandinavik-full-aroma-cavendish",
      "https://www.tobaccoreviews.com/blend/4183/mac-baren-amsterdamer/", "https://www.tobaccoreviews.com/blend/2979/alsbo-whisky/",
      "https://www.tobaccoreviews.com/blend/5622/comoys-of-london-cask-4-stand-fast-navy/", "https://www.tobaccoreviews.com/blend/1274/wessex-classic-virginia/",
      "https://pipedia.org/wiki/Sillem%27s", "https://pipedia.org/wiki/Astley%27s"],
  };

  const fichasDe = (m) => current.filter((d) => d.marca === m).length;
  const fichas = (n) => (n === 1 ? "1 ficha" : `${n.toLocaleString("es-ES")} fichas`);

  function rama(r, grupo) {
    const n = r.m ? fichasDe(r.m) : 0;
    const boton = r.m
      ? `<button class="ab-m" type="button" data-m="${esc(r.m)}" data-g="${esc(grupo.id)}">${esc(r.t || r.m)}${n ? `<small>${n}</small>` : ""}</button>`
      : `<span class="ab-m ab-sin">${esc(r.t)}</span>`;
    return `<div class="ab-r${r.e ? " ab-e" : ""}">
      <div class="ab-l">${boton}${r.a ? `<span class="ab-a">${r.a}</span>` : ""}</div>
      ${r.n ? `<p class="ab-n">${esc(r.n)}</p>` : ""}
      ${(r.h || []).map((x) => rama(x, grupo)).join("")}</div>`;
  }

  function abrir(desdeUrl) {
    if (!desdeUrl && location.hash !== "#/arbol") history.pushState({ panel: true }, "", "#/arbol");
    abrirPanel(`
      <div class="d-franja">${FRANJA}</div>
      <div class="bd-cab">
        <span class="bd-baul" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M12 21v-7M12 14l-5-4M12 14l5-4M7 10V6M17 10V6M12 14V4"/><circle cx="12" cy="3.5" r="1.6"/><circle cx="7" cy="5" r="1.6"/><circle cx="17" cy="5" r="1.6"/></svg></span>
        <div><h2 id="d-name">Árbol de marcas</h2><p class="muted">Qué grupo está detrás de cada marca y quién elabora para quién.</p></div>
      </div>
      <button class="x-close" id="d-close" type="button" aria-label="Cerrar" title="Cerrar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button>
      <div class="bd-cuerpo">
        <div class="ab-ley"><span><i></i>Es su dueño</span><span><i class="e"></i>La elabora para otra casa</span><span class="muted">Toca una marca para verla en todo el árbol.</span></div>
        <div class="ab-grupos">${GRUPOS.map((g) => `
          <section class="ab-g" aria-labelledby="ab-${g.id}">
            <div class="ab-gh"><h3 id="ab-${g.id}">${esc(g.nombre)}</h3><span class="muted">${esc(g.pais)}</span></div>
            <p class="ab-hist">${esc(g.historia)}</p>
            ${g.h.map((r) => rama(r, g)).join("")}
          </section>`).join("")}</div>
        <p class="muted ab-pie">Solo aparecen las relaciones que se han podido comprobar en fuentes fiables. Las marcas que no salen aquí son independientes o aún no se han revisado.</p>
      </div>`, "bodega-p arbol-p");
    document.title = "Árbol de marcas · " + TITULO;
    $("d-close").addEventListener("click", () => closeDetail());
    $("panel").querySelectorAll("button.ab-m").forEach((b) => b.addEventListener("click", () => elegir(b)));
  }

  function elegir(b) {
    const m = b.dataset.m, todos = [...$("panel").querySelectorAll("button.ab-m")];
    const ya = b.classList.contains("on");
    todos.forEach((x) => x.classList.toggle("on", !ya && x.dataset.m === m));
    // La tarjeta de la marca sale justo debajo del botón tocado.
    let info = $("ab-info");
    if (!info) { info = document.createElement("div"); info.id = "ab-info"; info.className = "ab-info"; info.setAttribute("aria-live", "polite"); }
    if (ya) { info.remove(); return; }
    b.closest(".ab-l").after(info);
    const veces = todos.filter((x) => x.dataset.m === m);
    const grupos = [...new Set(veces.map((x) => GRUPOS.find((g) => g.id === x.dataset.g).corto))];
    const n = fichasDe(m), nombre = m === "STG" ? "Mac Baren (STG)" : m;
    info.innerHTML = `<div><strong>${esc(nombre)}</strong>
        <span class="muted">${n ? fichas(n) + " · " : ""}${grupos.length > 1 ? `aparece en ${grupos.join(" y ")}` : esc(grupos[0])}</span></div>
      <div class="ab-acts">
        ${n ? `<button class="btn primary" type="button" id="ab-ver">Ver sus fichas</button>` : ""}
        <a class="btn" href="marca/${esc(slug(m))}.html">Página de la marca</a>
      </div>`;
    if ($("ab-ver")) $("ab-ver").addEventListener("click", () => {
      if (location.hash === "#/arbol") history.replaceState(null, "", location.pathname + location.search);
      closeDetail(true);
      ponerFiltros({ marca: m });
      const g = $("grid");
      if (g) window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - 8), behavior: "smooth" });
    });
  }

  panelesHash["#/arbol"] = abrir;
  document.querySelectorAll('a[href="#/arbol"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); abrir(); }));
  if (location.hash === "#/arbol") abrir(true);
})();
