/* =====================================================================
   Etiquetas para el tarro (solo para usuarios registrados)
   Dos etiquetas con el diseño «botica»:
     - Costado: 90 × 60 mm.
     - Tapa: redonda, 60 mm de diámetro.
   Se rellenan la fecha de embotado, la de compra, el lugar y el precio
   (todo opcional: lo vacío sale en línea de puntos para escribirlo a mano).
   Esos datos no se guardan en la web; solo el lugar se recuerda en este navegador.
   Se descargan en un PDF A4 a tamaño real (o en una imagen PNG).
   La usan la ficha del catálogo (app.js) y las páginas f/<id>.html.
   Uso: Etiquetas.abrir({ nombre, marca, tipo, corte, pais, color, archivo })
   ===================================================================== */
(function () {
  "use strict";
  const PPMM = 300 / 25.4;                 // puntos por milímetro a 300 ppp
  const C = { papel: "#FBF3E0", tinta: "#2E2418", marron: "#5B3E1E", suave: "#6B5536", oro: "#9A6E2A", pie: "#9C7B4C", punto: "#9C7B4C" };
  const SERIF = '"Young Serif", Georgia, serif';
  const TEXTO = 'Alegreya, Georgia, "Times New Roman", serif';
  const HOJA = new Path2D("M12 20C12 13 7 10 4 9c3-2 7 0 8 4 1-4 5-6 8-4-3 1-8 4-8 11z");
  const CLAVE_LUGAR = "herbario-etiqueta-lugar";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Fecha completa (AAAA-MM-DD), solo mes (AAAA-MM, de un tarro de Mi bodega) o solo año
  function fechaTxt(v, corta) {
    v = String(v || "").trim();
    const a = (y) => (corta ? y.slice(2) : y);
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); if (m) return `${m[3]}/${m[2]}/${a(m[1])}`;
    m = /^(\d{4})-(\d{2})$/.exec(v); if (m) return `${m[2]}/${m[1]}`;
    return /^\d{4}$/.test(v) ? v : "";
  }
  function precioTxt(v) {
    v = String(v || "").trim();
    return /^\d+([.,]\d{1,2})?$/.test(v) ? v.replace(".", ",") + " €" : v;
  }

  /* ---------- Dibujo (en milímetros) ---------- */
  function espaciado(ctx, texto, x, y, sep, alinear) {
    // Texto con letras separadas, dibujado letra a letra (letterSpacing no está en todos los navegadores)
    const letras = [...texto];
    const ancho = letras.reduce((a, l) => a + ctx.measureText(l).width, 0) + sep * (letras.length - 1);
    let cx = alinear === "center" ? x - ancho / 2 : x;
    const prev = ctx.textAlign; ctx.textAlign = "left";
    letras.forEach((l) => { ctx.fillText(l, cx, y); cx += ctx.measureText(l).width + sep; });
    ctx.textAlign = prev;
    return ancho;
  }
  function anchoEspaciado(ctx, texto, sep) {
    const l = [...texto]; return l.reduce((a, c) => a + ctx.measureText(c).width, 0) + sep * (l.length - 1);
  }
  // Banda o línea de mayúsculas espaciadas que encoge hasta caber
  function versalitas(ctx, texto, x, y, max, tam, color, peso) {
    texto = texto.toUpperCase();
    let t = tam;
    for (; t > tam * 0.6; t -= 0.1) { ctx.font = `${peso || 500} ${t}px ${TEXTO}`; if (anchoEspaciado(ctx, texto, t * 0.18) <= max) break; }
    ctx.fillStyle = color; espaciado(ctx, texto, x, y, t * 0.18, "center");
  }
  // Nombre: una línea si cabe; si no, dos líneas equilibradas
  function nombre(ctx, texto, x, y, max, grande, minimo, interlinea) {
    const cabe = (t, s) => { ctx.font = `${t}px ${SERIF}`; return ctx.measureText(s).width <= max; };
    for (let t = grande; t >= minimo; t -= 0.1) if (cabe(t, texto)) { ctx.fillText(texto, x, y); return 1; }
    const p = texto.split(/\s+/);
    let mejor = [texto, ""], peor = Infinity;
    for (let i = 1; i < p.length; i++) {
      const a = p.slice(0, i).join(" "), b = p.slice(i).join(" ");
      ctx.font = `10px ${SERIF}`;
      const d = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (d < peor) { peor = d; mejor = [a, b]; }
    }
    let t = grande * 0.8;
    while (t > minimo * 0.7 && !(cabe(t, mejor[0]) && cabe(t, mejor[1]))) t -= 0.1;
    ctx.font = `${t}px ${SERIF}`;
    const h = t * (interlinea || 1.08);
    ctx.fillText(mejor[0], x, y - h / 2); ctx.fillText(mejor[1], x, y + h / 2);
    return 2;
  }
  function adorno(ctx, x, y, ancho) {
    ctx.strokeStyle = C.oro; ctx.lineWidth = 0.22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - ancho / 2, y); ctx.lineTo(x - 2.6, y); ctx.moveTo(x + 2.6, y); ctx.lineTo(x + ancho / 2, y); ctx.stroke();
    ctx.save(); ctx.translate(x - 1.8, y - 2.1); ctx.scale(0.15, 0.15); ctx.lineWidth = 1.6; ctx.lineJoin = "round"; ctx.stroke(HOJA); ctx.restore();
  }
  // Campo: «Etiqueta ......valor»
  function campo(ctx, etiqueta, valor, x, y, ancho, tam) {
    ctx.textAlign = "left";
    ctx.font = `500 ${tam}px ${TEXTO}`; ctx.fillStyle = C.marron;
    ctx.fillText(etiqueta, x, y);
    const x0 = x + ctx.measureText(etiqueta).width + tam * 0.4;
    ctx.save(); ctx.strokeStyle = C.punto; ctx.lineWidth = 0.18; ctx.setLineDash([0.25, 0.55]); ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x0, y + 0.5); ctx.lineTo(x + ancho, y + 0.5); ctx.stroke(); ctx.restore();
    if (valor) {
      let t = tam * 1.06; ctx.font = `${t}px ${TEXTO}`;
      while (ctx.measureText(valor).width > x + ancho - x0 - 0.6 && t > tam * 0.6) { t -= 0.1; ctx.font = `${t}px ${TEXTO}`; }
      ctx.fillStyle = C.tinta; ctx.fillText(valor, x0 + 0.6, y - 0.1);
    }
  }
  function textoBanda(d) { return [d.tipo, d.marca].filter(Boolean).join(" · ") || "El herbario de la Comarca"; }

  // Etiqueta del costado: 90 × 60 mm
  function costado(ctx, d, v) {
    const W = 90, H = 60, x = W / 2;
    ctx.fillStyle = C.papel; ctx.beginPath(); ctx.roundRect(0.3, 0.3, W - 0.6, H - 0.6, 1.2); ctx.fill();
    ctx.strokeStyle = C.marron; ctx.lineWidth = 0.45; ctx.stroke();
    const m = 1.6;                                            // marco interior
    ctx.lineWidth = 0.25; ctx.strokeRect(m, m, W - 2 * m, H - 2 * m);
    ctx.fillStyle = d.color; ctx.fillRect(m + 0.12, m + 0.12, W - 2 * m - 0.24, 6.2);
    ctx.textBaseline = "alphabetic"; ctx.textAlign = "center";
    versalitas(ctx, textoBanda(d), x, m + 4.45, W - 2 * m - 6, 2.9, C.papel);
    ctx.fillStyle = C.tinta;
    const lineas = nombre(ctx, d.nombre, x, 17.6, W - 12, 6.6, 4.6);
    const ySub = lineas === 2 ? 25.4 : 23;
    const sub = [d.corte, d.pais].filter(Boolean).join(" · ");
    if (sub) { ctx.font = `italic 3.1px ${TEXTO}`; ctx.fillStyle = C.suave; ctx.fillText(sub, x, ySub); }
    adorno(ctx, x, ySub + 3.6, 12);
    const y1 = 36.5, y2 = 44.3, iz = 6.5, ancho = 36, der = W - iz - ancho;
    campo(ctx, "Embotado", fechaTxt(v.embotado), iz, y1, ancho, 3.1);
    campo(ctx, "Compra", fechaTxt(v.compra), der, y1, ancho, 3.1);
    campo(ctx, "Lugar", v.lugar, iz, y2, ancho, 3.1);
    campo(ctx, "Precio", precioTxt(v.precio), der, y2, ancho, 3.1);
    ctx.textAlign = "center";
    versalitas(ctx, "El herbario de la Comarca · PCFH", x, H - m - 2.6, W - 20, 2.3, C.pie, 400);
  }
  // Etiqueta de la tapa: círculo de 60 mm
  function tapa(ctx, d, v) {
    const R = 30, x = R;
    ctx.fillStyle = C.papel; ctx.beginPath(); ctx.arc(R, R, R - 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.marron; ctx.lineWidth = 0.45; ctx.stroke();
    const ri = R - 1.6;
    ctx.save(); ctx.beginPath(); ctx.arc(R, R, ri, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = d.color; ctx.fillRect(0, 0, 2 * R, 11.8);
    ctx.restore();
    ctx.lineWidth = 0.25; ctx.beginPath(); ctx.arc(R, R, ri, 0, Math.PI * 2); ctx.stroke();
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    versalitas(ctx, d.tipo || "Tabaco de pipa", x, 9.8, 26, 2.7, C.papel);
    if (d.marca) versalitas(ctx, d.marca, x, 16.2, 36, 2.5, C.oro);
    ctx.fillStyle = C.tinta;
    const lineas = nombre(ctx, d.nombre, x, 22.3, 44, 5.2, 3.8, 1.05);
    const yAd = lineas === 2 ? 30 : 27.6;
    adorno(ctx, x, yAd, 9);
    campo(ctx, "Embot.", fechaTxt(v.embotado, true), 11.5, yAd + 7.4, 37, 2.8);
    campo(ctx, "Compra", fechaTxt(v.compra, true), 11.5, yAd + 13.6, 37, 2.8);
    versalitas(ctx, "El herbario de la Comarca", x, 2 * R - 6.2, 26, 1.9, C.pie, 400);
  }

  async function fuentes() {
    try {
      await Promise.all([`20px ${SERIF}`, `20px ${TEXTO}`, `500 20px ${TEXTO}`, `italic 20px ${TEXTO}`].map((f) => document.fonts.load(f)));
    } catch (e) {}
  }
  function lienzo(anchoMm, altoMm, ppmm, dibujar, fondo) {
    const c = document.createElement("canvas");
    c.width = Math.round(anchoMm * ppmm); c.height = Math.round(altoMm * ppmm);
    const ctx = c.getContext("2d");
    if (fondo) { ctx.fillStyle = fondo; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.scale(ppmm, ppmm);
    dibujar(ctx);
    return c;
  }

  /* ---------- PDF (A4, con las etiquetas como imágenes JPEG a 300 ppp) ---------- */
  function bytesJpeg(canvas) {
    const b64 = canvas.toDataURL("image/jpeg", 0.95).split(",")[1];
    const s = atob(b64), u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }
  function pdf(imagenes, colocar) {
    // imagenes: [{canvas}]; colocar: [{img, x, y, w, h}] en mm desde arriba a la izquierda
    const pt = (mm) => (mm * 72 / 25.4).toFixed(2);
    const A4 = [210, 297];
    const partes = [], offs = [];
    let largo = 0;
    const enc = new TextEncoder();
    const poner = (x) => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); largo += b.length; };
    const obj = (n, cuerpo, flujo) => {
      offs[n] = largo;
      poner(`${n} 0 obj\n${cuerpo}\n`);
      if (flujo) { poner("stream\n"); poner(flujo); poner("\nendstream\n"); }
      poner("endobj\n");
    };
    poner("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    const nImg = imagenes.length, primeraImg = 5;
    let cont = "";
    colocar.forEach((c) => {
      cont += `q ${pt(c.w)} 0 0 ${pt(c.h)} ${pt(c.x)} ${pt(A4[1] - c.y - c.h)} cm /Im${c.img} Do Q\n`;
    });
    const contB = enc.encode(cont);
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    const recursos = imagenes.map((_, i) => `/Im${i} ${primeraImg + i} 0 R`).join(" ");
    obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pt(A4[0])} ${pt(A4[1])}] /Resources << /XObject << ${recursos} >> >> /Contents 4 0 R >>`);
    obj(4, `<< /Length ${contB.length} >>`, contB);
    imagenes.forEach((im, i) => {
      const j = bytesJpeg(im.canvas);
      obj(primeraImg + i, `<< /Type /XObject /Subtype /Image /Width ${im.canvas.width} /Height ${im.canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${j.length} >>`, j);
    });
    const total = primeraImg + nImg;
    const xref = largo;
    let tabla = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let n = 1; n < total; n++) tabla += String(offs[n]).padStart(10, "0") + " 00000 n \n";
    poner(tabla + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(partes, { type: "application/pdf" });
  }
  function bajar(blob, nombreArchivo) {
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = nombreArchivo; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ---------- Cuadro para rellenar ---------- */
  function abrir(d, inicial) {
    inicial = inicial || {};
    d = Object.assign({ nombre: "", marca: "", tipo: "", corte: "", pais: "", color: "#5A5548", archivo: "etiquetas" }, d);
    let lugar = ""; try { lugar = localStorage.getItem(CLAVE_LUGAR) || ""; } catch (e) {}
    const dlg = document.createElement("div");
    dlg.className = "confirm"; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true"); dlg.setAttribute("aria-labelledby", "et-title");
    dlg.innerHTML = `<form class="box tarro-form etq-form" id="et-form">
        <h2 id="et-title">Etiquetas para el tarro</h2>
        <p class="muted">${esc(d.nombre)}${d.marca ? " · " + esc(d.marca) : ""}</p>
        <div class="etq-prev" aria-hidden="true"><canvas id="et-c1"></canvas><canvas id="et-c2"></canvas></div>
        <div class="tf-grid">
          <div><label for="et-emb">Fecha de embotado</label><input id="et-emb" type="date"></div>
          <div><label for="et-com">Fecha de compra</label><input id="et-com" type="date"></div>
          <div><label for="et-lug">Lugar de compra</label><input id="et-lug" type="text" maxlength="40" autocomplete="off" placeholder="Estanco n.º 4" value="${esc(lugar)}"></div>
          <div><label for="et-pre">Precio</label><input id="et-pre" type="text" maxlength="14" inputmode="decimal" autocomplete="off" placeholder="14,50"></div>
          <div><label for="et-cuales">Etiquetas</label><select id="et-cuales"><option value="ambas">Costado y tapa</option><option value="costado">Solo la del costado</option><option value="tapa">Solo la de la tapa</option></select></div>
          <div><label for="et-cop">Copias</label><select id="et-cop"><option>1</option><option>2</option><option>3</option><option>4</option></select></div>
        </div>
        <p class="muted etq-nota">Todo es opcional: lo que dejes vacío sale en línea de puntos para escribirlo a mano. Estos datos no se guardan en la web. La del costado mide 9 × 6 cm y la de la tapa, 6 cm de diámetro; imprime el PDF al 100 % (tamaño real).</p>
        <p class="msg" id="et-msg" role="alert"></p>
        <div class="acts"><button class="btn primary" type="submit">Descargar PDF</button><button class="btn" type="button" id="et-png">Descargar imagen</button><button class="btn" type="button" id="et-no">Cancelar</button></div>
      </form>`;
    document.body.appendChild(dlg);
    const $ = (id) => dlg.querySelector("#" + id);
    const quien = document.activeElement;
    // Fechas que llegan de Mi bodega: con mes y año, el campo pasa a ser de mes; con solo el año, de texto
    [["et-emb", inicial.embotado], ["et-com", inicial.compra]].forEach(([id, f]) => {
      if (!f) return;
      const inp = $(id);
      if (/^\d{4}-\d{2}$/.test(f)) inp.type = "month"; else if (/^\d{4}$/.test(f)) { inp.type = "text"; inp.inputMode = "numeric"; }
      inp.value = f;
    });
    const valores = () => ({ embotado: $("et-emb").value, compra: $("et-com").value, lugar: $("et-lug").value.trim(), precio: $("et-pre").value.trim() });
    const cerrar = () => { document.removeEventListener("keydown", tecla, true); dlg.remove(); if (quien && quien.focus) quien.focus(); };
    const tecla = (e) => { if (e.key === "Escape") { e.stopPropagation(); cerrar(); } };
    document.addEventListener("keydown", tecla, true);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) cerrar(); });
    $("et-no").addEventListener("click", cerrar);

    // Vista previa
    const PREV = 3.4;   // px por mm en pantalla (luego se dibuja al doble para que se vea nítida)
    function previa() {
      const v = valores(), cuales = $("et-cuales").value;
      [["et-c1", 90, 60, costado, cuales !== "tapa"], ["et-c2", 60, 60, tapa, cuales !== "costado"]].forEach(([id, w, h, fn, ver]) => {
        const c = $(id); c.hidden = !ver; if (!ver) return;
        const k = PREV * 2;
        c.width = w * k; c.height = h * k; c.style.width = w * PREV + "px";
        const ctx = c.getContext("2d"); ctx.setTransform(k, 0, 0, k, 0, 0); ctx.clearRect(0, 0, w, h); fn(ctx, d, v);
      });
    }
    fuentes().then(previa);
    dlg.querySelectorAll("input,select").forEach((el) => el.addEventListener("input", previa));

    function guardarLugar() { try { const l = $("et-lug").value.trim(); if (l) localStorage.setItem(CLAVE_LUGAR, l); else localStorage.removeItem(CLAVE_LUGAR); } catch (e) {} }

    dlg.querySelector("#et-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await fuentes();
        const v = valores(), cuales = $("et-cuales").value, copias = Number($("et-cop").value) || 1;
        const imgs = [], col = [];
        let iC = -1, iT = -1;
        if (cuales !== "tapa") { imgs.push({ canvas: lienzo(90, 60, PPMM, (c) => costado(c, d, v), "#ffffff") }); iC = imgs.length - 1; }
        if (cuales !== "costado") { imgs.push({ canvas: lienzo(60, 60, PPMM, (c) => tapa(c, d, v), "#ffffff") }); iT = imgs.length - 1; }
        for (let i = 0; i < copias; i++) {
          const y = 15 + i * 68;
          if (iC >= 0) col.push({ img: iC, x: 15, y, w: 90, h: 60 });
          if (iT >= 0) col.push({ img: iT, x: iC >= 0 ? 125 : 15, y, w: 60, h: 60 });
        }
        bajar(pdf(imgs, col), `etiquetas-${d.archivo}.pdf`);
        guardarLugar(); cerrar();
      } catch (err) { $("et-msg").textContent = "No se ha podido crear el PDF. Inténtalo de nuevo."; }
    });
    $("et-png").addEventListener("click", async () => {
      try {
        await fuentes();
        const v = valores(), cuales = $("et-cuales").value;
        const conC = cuales !== "tapa", conT = cuales !== "costado";
        const ancho = (conC ? 90 : 0) + (conC && conT ? 6 : 0) + (conT ? 60 : 0) + 8;
        const c = lienzo(ancho, 68, PPMM, (ctx) => {
          ctx.translate(4, 4);
          if (conC) { costado(ctx, d, v); ctx.translate(96, 0); }
          if (conT) tapa(ctx, d, v);
        }, "#ffffff");
        c.toBlob((b) => { if (b) { bajar(b, `etiquetas-${d.archivo}.png`); guardarLugar(); cerrar(); } }, "image/png");
      } catch (err) { $("et-msg").textContent = "No se ha podido crear la imagen. Inténtalo de nuevo."; }
    });
    setTimeout(() => $("et-emb").focus(), 30);
  }

  window.Etiquetas = { abrir };
})();
