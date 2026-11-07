/* ---------- Buscar por foto ----------
   Icono de cámara dentro del buscador. Hace (o elige) una foto de la lata, la reduce a 1280 px y la manda a la
   función de Supabase «leer-etiqueta», que comprueba los límites (SQL 58-59) y devuelve el texto que lee
   Google Cloud Vision. Con ese texto se buscan las fichas que encajan y se enseñan en el catálogo, ordenadas
   de más a menos probable («Tu foto · …»). La foto no se guarda en ningún sitio.
   Solo para quien ha entrado con su cuenta (cada foto gasta una lectura de Google).
   Usa de app.js: sb, ctx, current, busquedaFoto, ponerFiltros, render, abrirLogin, $. */
(function () {
  const boton = $("q-foto"), archivo = $("q-foto-archivo"), msg = $("foto-msg");
  if (!boton || !sb) return;          // sin Supabase no hay lectura
  boton.hidden = false;

  /* ---------- Emparejar el texto leído con las fichas (mismo método que identificar.html) ---------- */
  function normalizar(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/œ/g, "oe").replace(/ß/g, "ss")
      .replace(/\b([a-z])\s*&\s*([a-z])\b/g, "$1$2")
      .replace(/(^|[^a-z])(n\s*[º°]|no\.|num\.?|número|numero|#)\s*(?=\d)/g, "$1 no ")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/['’´`]/g, "")
      .replace(/[^a-z0-9]+/g, " ").trim();
  }
  const palabras = (s) => normalizar(s).split(" ").filter(Boolean);
  // Palabras que salen en latas de todo tipo y no ayudan a distinguir.
  const VACIAS = new Set(["the", "and", "de", "la", "el", "of", "y", "und", "a", "g", "gr", "gramos", "net", "wt", "oz",
    "tobacco", "tabaco", "tabak", "pipe", "pipa", "pfeifentabak", "smoking", "co", "ltd", "inc", "est", "since"]);
  // Lo que pone en la lata cuando la marca del catálogo es otra (dueño actual, nombre corto…).
  const OTRAS_MARCAS = { "STG": ["Mac Baren", "Scandinavian Tobacco Group"], "Kopp": ["Kohlhase & Kopp", "Kohlhase Kopp"],
    "G. L. Pease": ["GL Pease", "Pease"], "Cornell & Diehl": ["Cornell Diehl"], "W.Ø. Larsen": ["WO Larsen", "Larsen"] };

  let indice = null, base = null;   // se rehace si cambia el catálogo
  function preparar() {
    if (indice && base === current) return;
    const df = new Map(), limpias = (n) => [...new Set(palabras(n).filter((p) => !VACIAS.has(p)))];
    indice = current.filter((d) => d && d.nombre).map((d) => {
      const marcas = [d.marca || ""].concat(OTRAS_MARCAS[d.marca] || []).map(limpias).filter((m) => m.length);
      const nombres = [d.nombre].concat(d.otros || []).map(limpias).filter((n) => n.length);
      new Set([...marcas.flat(), ...nombres.flat()]).forEach((p) => df.set(p, (df.get(p) || 0) + 1));
      return { id: d.id, marcas, nombres };
    });
    const N = indice.length;
    indice.pesos = new Map();
    df.forEach((n, p) => indice.pesos.set(p, Math.log(1 + N / n) * (p.length <= 2 ? 0.6 : 1)));
    base = current;
  }
  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length; let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      [prev, cur] = [cur, prev];
    }
    return prev[n];
  }
  function parecido(p, q) {
    if (p === q) return 1;
    if (p.length <= 3 || /\d/.test(p)) return 0;           // cortas y números: solo exactas
    if (Math.abs(p.length - q.length) > 2) return 0;
    const s = 1 - lev(p, q) / Math.max(p.length, q.length);
    return s >= 0.75 ? s : 0;
  }
  // Devuelve las fichas que encajan, de más a menos probable (como mucho 8).
  function buscar(texto) {
    preparar();
    const t = palabras(texto).filter((p) => p.length >= 2);
    const leidas = new Set(t);
    for (let i = 0; i + 1 < t.length; i++) leidas.add(t[i] + t[i + 1]);   // «SAMUELGAWITH», palabras partidas
    const lista = [...leidas], memo = new Map();
    const mejor = (p) => {
      if (memo.has(p)) return memo.get(p);
      let m = 0; for (const q of lista) { const s = parecido(p, q); if (s > m) m = s; if (m === 1) break; }
      memo.set(p, m); return m;
    };
    const puntua = (ps) => {
      let tot = 0, ok = 0;
      for (const p of ps) { const w = indice.pesos.get(p) || 1; tot += w; ok += w * mejor(p); }
      return tot ? { frac: ok / tot, peso: ok } : { frac: 0, peso: 0 };
    };
    const res = [];
    for (const f of indice) {
      let m = { frac: 0, peso: 0 };
      for (const ms of f.marcas) { const x = puntua(ms); if (x.frac > m.frac) m = x; }
      let n = { frac: 0, peso: 0 };
      for (const ns of f.nombres) { const x = puntua(ns); if (x.frac > n.frac || (x.frac === n.frac && x.peso > n.peso)) n = x; }
      if (n.frac === 0) continue;                            // sin nada del nombre no vale
      const marcaFrac = f.marcas.length ? m.frac : 0.5;
      const total = 0.6 * n.frac + 0.4 * marcaFrac + 0.04 * Math.min(1, (n.peso + m.peso) / 12);
      if (total >= 0.3) res.push({ id: f.id, total });
    }
    res.sort((a, b) => b.total - a.total);
    // Si la primera es casi segura, se quitan las que quedan muy por debajo.
    const tope = res.length && res[0].total >= 0.85 ? res[0].total - 0.3 : 0;
    return res.filter((r) => r.total >= tope).slice(0, 8);
  }

  /* ---------- Foto ---------- */
  const MENSAJES = {
    sin_cuenta: "Entra con tu cuenta para buscar por foto.",
    tope_usuario: "Has llegado al máximo de fotos de hoy. Mañana podrás seguir; mientras, escribe el nombre.",
    tope_dia: "Hoy ya se han leído todas las fotos disponibles para la web. Prueba mañana o escribe el nombre.",
    tope_mes: "Este mes ya se han leído todas las fotos disponibles. Escribe el nombre.",
    imagen_grande: "La foto es demasiado grande.",
    google: "El servicio de lectura no ha respondido. Prueba otra vez en un momento.",
  };
  function aviso(texto, tipo) {
    msg.textContent = texto || "";
    msg.hidden = !texto;
    msg.dataset.tipo = tipo || "";
  }
  function reducir(img) {
    const max = 1280, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85);
  }
  function abrirImagen(file) {
    return new Promise((ok, mal) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(url); ok(img); };
      img.onerror = () => { URL.revokeObjectURL(url); mal(new Error("imagen")); };
      img.src = url;
    });
  }

  async function leer(file) {
    boton.disabled = true; boton.classList.add("leyendo");
    aviso("Leyendo la lata…", "leyendo");
    try {
      const foto = reducir(await abrirImagen(file));
      const { data, error } = await sb.functions.invoke("leer-etiqueta", { body: { imagen: foto } });
      let codigo = data && data.error;
      if (error) {
        try { const j = await error.context.json(); codigo = j.error || codigo; } catch (_) { /* sin cuerpo */ }
        codigo = codigo || "google";
      }
      if (codigo) {
        aviso(MENSAJES[codigo] || "No se ha podido leer la foto.", "error");
        if (codigo === "sin_cuenta") pedirCuenta();
        return;
      }
      const texto = (data && data.texto) || "";
      if (!texto.trim()) { aviso("No he encontrado texto en la foto. Prueba más de cerca y con buena luz.", "error"); return; }
      const res = buscar(texto);
      ponerFiltros({});                                   // la foto busca en todo el catálogo
      busquedaFoto = new Map(res.map((r, i) => [r.id, i]));
      $("q").value = "";
      render();
      aviso(res.length ? (res.length === 1 ? "Esta es la ficha que encaja con tu foto." : "Estas son las fichas que encajan con tu foto, de más a menos probable.") : "", "hecho");
      const g = $("grid");
      if (g) window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - document.querySelector(".bar").offsetHeight - 8), behavior: "smooth" });
    } catch (e) {
      console.error(e);
      aviso(e && e.message === "imagen" ? "No se ha podido abrir la imagen." : "Algo ha fallado al leer la foto. Prueba otra vez.", "error");
    } finally {
      boton.disabled = false; boton.classList.remove("leyendo");
    }
  }

  // Abre la ventana de entrar, explicando para qué hace falta la cuenta.
  function pedirCuenta() {
    abrirLogin();
    $("lg-text").textContent = "Para buscar por foto tienes que entrar con tu cuenta. Si es la primera vez, crea una.";
  }

  boton.addEventListener("click", () => {
    if (!ctx.session) { pedirCuenta(); return; }
    aviso("");
    archivo.click();
  });
  archivo.addEventListener("change", () => {
    const f = archivo.files && archivo.files[0];
    archivo.value = "";
    if (f) leer(f);
  });
  // Al escribir en el buscador o cambiar un filtro desaparece el aviso de la foto.
  $("q").addEventListener("input", () => { if (msg.dataset.tipo !== "leyendo") aviso(""); });
  document.addEventListener("change", (e) => { if (e.target.closest && e.target.closest("#filtros-row") && e.target !== archivo) aviso(""); });
})();
