/* Buscador del catálogo: tolera erratas, plurales, palabras parecidas y nombres en otros idiomas.
   Cómo decide si una ficha encaja: cada palabra buscada tiene que aparecer en la ficha de alguna de estas formas
   (de más a menos exacta):
     1. Tal cual (sin tildes ni mayúsculas), en singular o plural, en masculino o femenino.
     2. Como sinónimo o traducción: cherry → cereza, english → inglesa, usa → Estados Unidos…
     3. Corregida, si es una errata: solo cuando la palabra no aparece en ninguna ficha del catálogo
        (latakai → latakia, vainila → vainilla).
   Los resultados salen primero si todo coincide en el nombre, la marca u otros nombres; después si coincide
   en el resto de la ficha; y al final los aproximados (sinónimos y erratas). Dentro de cada grupo, el orden elegido. */
(function () {
  "use strict";

  /* ---------- Normalizar texto ---------- */
  function normalizar(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/œ/g, "oe").replace(/ß/g, "ss")
      .replace(/\b([a-z])\s*&\s*([a-z])\b/g, "$1$2")                 // C&D → cd
      .replace(/(^|[^a-z])(n\s*[º°]|no\.|num\.?|número|numero|#)\s*(?=\d)/g, "$1 no ")   // Nº 2, No. 2, #2 → no 2
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/['’´`]/g, "")                                         // Rattray's → rattrays
      .replace(/[^a-z0-9]+/g, " ").trim();
  }

  /* ---------- Sinónimos y traducciones ----------
     Cada grupo: palabras que se buscan como si fueran la misma. Se escriben ya normalizadas (sin tildes). */
  const GRUPOS = [
    // Sabores
    ["vainilla", "vanilla", "vanille"], ["cereza", "cherry", "kirsch", "kirsche", "guinda"],
    ["chocolate", "cacao", "cocoa", "schokolade"], ["ron", "rum", "rhum"],
    ["whisky", "whiskey", "bourbon", "scotch"], ["conac", "cognac", "brandy"],
    ["miel", "honey", "honig"], ["ciruela", "plum", "pflaume", "mirabel", "mirabelle"],
    ["manzana", "apple", "apfel"], ["melocoton", "peach", "durazno", "pfirsich"],
    ["higo", "fig", "feige"], ["naranja", "orange"], ["limon", "lemon", "zitrone"],
    ["citricos", "citrico", "citrus"], ["coco", "coconut", "kokos"],
    ["nuez", "nueces", "nut", "nuts", "nutty", "walnut", "nuss"], ["avellana", "hazelnut", "haselnuss"],
    ["almendra", "almond", "mandel", "amaretto"], ["caramelo", "caramel", "toffee", "karamell"],
    ["cafe", "coffee", "kaffee", "espresso", "mocha", "moka"], ["regaliz", "licorice", "liquorice", "lakritz"],
    ["anis", "anise", "aniseed"], ["canela", "cinnamon", "zimt"], ["menta", "mint", "minze"],
    ["fresa", "strawberry", "erdbeere"], ["frambuesa", "raspberry", "himbeere"], ["arandano", "blueberry", "heidelbeere"],
    ["frutos rojos", "berries", "berry", "beeren", "frutas del bosque"], ["arce", "maple"], ["granada", "pomegranate", "granatapfel"],
    ["vino", "wine", "wein"], ["jerez", "sherry"], ["licor", "liqueur", "liquor", "likor"],
    ["ahumado", "smoky", "smoked", "smoke", "humo"], ["especias", "especiado", "spice", "spicy", "spiced"],
    ["madera", "wood", "woody", "holz"], ["cuero", "leather"], ["tostado", "toasted", "toast"],
    ["dulce", "sweet"], ["afrutado", "frutal", "fruity", "fruit", "fruta", "frutas"], ["floral", "flores", "flower", "flowers"],
    ["tonka", "tonkabohne"],
    // Mezclas y hojas
    ["inglesa", "ingles", "english"], ["balcanica", "balkan"],
    ["oriental", "orientales", "turkish", "turco", "turca", "smyrna", "esmirna", "izmir", "basma"],
    ["aromatica", "aromatic", "aromatisch"], ["sin mezclar", "unblended"],
    ["latakia", "lattakia", "latakiya"], ["kentucky", "dark fired", "fire cured"],
    ["cigarro", "cigar", "puro", "habano"],
    // Cortes
    ["flake", "laminas", "lamina", "laminado"], ["ribbon", "tiras", "hebra", "hebras", "loose cut"],
    ["broken flake", "desmenuzado", "desmenuzada"], ["plug", "pastilla", "bloque"],
    ["rope", "cuerda", "twist", "trenzado"], ["coins", "monedas", "curly", "curlies", "rodajas"],
    ["shag", "fine cut"], ["cube cut", "cubos", "cubitos", "dados"],
    // Países
    ["estados unidos", "eeuu", "ee uu", "usa", "us", "america", "american", "americano", "americana", "estadounidense"],
    ["reino unido", "uk", "gran bretana", "inglaterra", "england", "escocia", "scotland", "britanico", "britanica", "british", "united kingdom"],
    ["alemania", "germany", "deutschland", "aleman", "alemana", "german"],
    ["dinamarca", "denmark", "danes", "danesa", "danish", "dansk", "danmark"],
    ["irlanda", "ireland", "irish", "irlandes", "irlandesa"], ["brasil", "brazil", "brasileno", "brasilena"],
    ["argentina", "argentino"], ["turquia", "turkey", "turkiye"],
    ["paises bajos", "holanda", "netherlands", "dutch", "holandes", "holandesa"],
    ["suecia", "sweden", "sueco"], ["italia", "italy", "italiano"], ["francia", "france", "frances"],
    // Formatos
    ["lata", "tin", "dose"], ["bolsa", "pouch", "beutel"], ["tarro", "jar"],
    // Marcas (abreviaturas y grafías)
    ["cd", "cyd", "cornell"], ["glp", "pease"], ["sg", "samuel gawith"], ["gh", "gawith hoggarth"],
    ["mac", "mc"], ["st", "saint", "sankt"]
  ];
  const GRUPO_DE = new Map();          // palabra → lista de grupos en los que está
  GRUPOS.forEach((g) => g.forEach((p) => { if (!GRUPO_DE.has(p)) GRUPO_DE.set(p, []); GRUPO_DE.get(p).push(g); }));
  const SOLO_PALABRAS_GRUPO = [...GRUPO_DE.keys()].filter((p) => !p.includes(" "));

  // Palabras que no aportan nada a la búsqueda («tabaco de cereza» → «cereza»)
  const VACIAS = new Set(["de", "del", "la", "las", "el", "los", "con", "y", "e", "a", "al", "en", "un", "una", "para",
    "que", "the", "of", "tabaco", "tabacos", "pipa", "pipas", "mezcla", "mezclas", "sabor", "sabores", "tipo"]);

  /* ---------- Distancia entre palabras (cuántas letras hay que cambiar, quitar, poner o intercambiar) ---------- */
  function distancia(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev2 = null, prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i]; let menor = i;
      for (let j = 1; j <= b.length; j++) {
        const coste = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + coste);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur.push(v); if (v < menor) menor = v;
      }
      if (menor > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[b.length];
  }
  const erratasPermitidas = (w) => (w.length >= 8 ? 2 : 1);

  // Formas de una palabra: plural y singular, masculino y femenino («cerezas» → «cereza», «aromatico» → «aromatica»)
  function formas(w) {
    const f = new Set([w]);
    if (/^[a-z]+$/.test(w)) {
      if (w.length >= 6 && w.endsWith("es")) f.add(w.slice(0, -2));
      if (w.length >= 5 && w.endsWith("s")) f.add(w.slice(0, -1));
      [...f].forEach((x) => {
        if (x.length >= 6 && /[oa]$/.test(x)) f.add(x.slice(0, -1) + (x.endsWith("o") ? "a" : "o"));
      });
    }
    return [...f];
  }

  /* ---------- Índice del catálogo (se rehace solo cuando cambia la lista de fichas) ---------- */
  let cache = { lista: null, entradas: null, todo: "", vocab: [] };
  function indice(lista, campos) {
    if (cache.lista === lista) return cache;
    const vocab = new Set();
    const entradas = lista.map((d) => {
      const c = campos(d);
      const principal = normalizar(c.principal.join(" "));
      const texto = normalizar([...c.principal, ...c.resto].join(" "));
      texto.split(" ").forEach((t) => { if (t.length >= 3 && /^[a-z]+$/.test(t)) vocab.add(t); });
      // Cada nombre junto, sin espacios: «W.Ø. Larsen» → wolarsen, «Mac Baren» → macbaren
      const juntos = c.principal.map((x) => normalizar(x).replace(/ /g, "")).filter(Boolean);
      return { d, principal, juntos, texto: " " + texto + " ", tJunto: texto.replace(/ /g, "") };
    });
    cache = { lista, entradas, todo: entradas.map((e) => e.texto).join("|"), vocab: [...vocab] };
    return cache;
  }

  /* ---------- Preparar la búsqueda ---------- */
  // Une dos palabras seguidas si juntas forman un término conocido («estados unidos», «ready rubbed»)
  function unidades(q) {
    const ws = q.split(" ").filter(Boolean), us = [];
    for (let i = 0; i < ws.length; i++) {
      const par = ws[i] + " " + ws[i + 1];
      if (i + 1 < ws.length && GRUPO_DE.has(par)) { us.push(par); i++; } else us.push(ws[i]);
    }
    const utiles = us.filter((u) => !VACIAS.has(u));
    return utiles.length ? utiles : us;
  }

  // Para cada palabra: sus formas exactas, sus sinónimos y, si es una errata, la palabra corregida
  function preparar(u, idx) {
    const exactas = formas(u);
    const sinonimos = new Set();
    const anadirGrupos = (p) => (GRUPO_DE.get(p) || []).forEach((g) => g.forEach((x) => { if (!exactas.includes(x)) sinonimos.add(x); }));
    exactas.forEach(anadirGrupos);
    // Escribiendo todavía: «cher» → cherry, «vanil» → vanilla
    if (u.length >= 4 && !sinonimos.size) SOLO_PALABRAS_GRUPO.forEach((p) => { if (p.length > u.length && p.startsWith(u)) { sinonimos.add(p); anadirGrupos(p); } });
    // Errata: solo si la palabra no está en ninguna ficha ni es un sinónimo conocido
    let corregidas = [];
    const existe = exactas.some((f) => idx.todo.includes(f));
    if (!existe && !sinonimos.size && u.length >= 4 && /^[a-z]+$/.test(u)) {
      const max = erratasPermitidas(u);
      let mejor = max + 1;
      const candidatas = new Set([...idx.vocab, ...SOLO_PALABRAS_GRUPO]);
      candidatas.forEach((t) => {
        const dd = distancia(u, t, max);
        if (dd < mejor) { mejor = dd; corregidas = [t]; } else if (dd === mejor && dd <= max) corregidas.push(t);
      });
      if (mejor > max) corregidas = [];
      corregidas.slice().forEach((c) => (GRUPO_DE.get(c) || []).forEach((g) => g.forEach((x) => { if (x !== c) sinonimos.add(x); })));
    }
    return { u, exactas, sinonimos: [...sinonimos], corregidas };
  }

  // Nivel de coincidencia de una palabra en una ficha: 0 nombre/marca, 1 resto de la ficha, 2 aproximada, null no está
  function nivel(p, e) {
    let n = null;
    for (const f of p.exactas) {
      // Las palabras cortas y los números tienen que ser el principio de una palabra («ron» no encaja en «Squadron»)
      const corta = f.length <= 3 || /^\d+$/.test(f);
      const en = (t) => (corta ? t.includes(" " + f) : t.includes(f));
      if (en(" " + e.principal) || (!/^\d+$/.test(f) && f.length >= 2 && e.juntos.some((j) => (corta ? j.startsWith(f) : j.includes(f))))) return 0;
      if (en(e.texto) || (f.length >= 4 && e.tJunto.includes(f))) n = 1;
    }
    if (n !== null) return n;
    for (const c of p.corregidas) if (e.texto.includes(" " + c + " ")) return 2;
    for (const s of p.sinonimos) if (e.texto.includes(" " + s + " ") || (s.length >= 4 && e.texto.includes(" " + s))) return 2;
    return null;
  }

  /* ---------- Buscar ----------
     lista: las fichas; q: lo que ha escrito el usuario; campos(d): { principal: [...], resto: [...] }.
     Devuelve { niveles: Map(ficha → 0, 1 o 2), corregidas: [palabras corregidas] } o null si no hay búsqueda. */
  function buscar(lista, q, campos) {
    const qn = normalizar(q);
    if (!qn) return null;
    const idx = indice(lista, campos);
    const ps = unidades(qn).map((u) => preparar(u, idx));
    const niveles = new Map();
    for (const e of idx.entradas) {
      let peor = 0, vale = true;
      for (const p of ps) { const n = nivel(p, e); if (n === null) { vale = false; break; } if (n > peor) peor = n; }
      if (vale) niveles.set(e.d, peor);
    }
    const corregidas = [];
    ps.forEach((p) => { if (p.corregidas.length) corregidas.push(p.corregidas[0]); });
    return { niveles, corregidas };
  }

  window.Buscador = { buscar, normalizar, distancia };
})();
