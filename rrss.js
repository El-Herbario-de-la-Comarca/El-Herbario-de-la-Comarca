/* =====================================================================
   Imagen para redes sociales (solo administrador y editores)
   Dibuja una historia de Instagram (1080 × 1920, 9:16) con la ficha:
   franja de colinas con el logo, nicho con la foto o la lata, nombre,
   casillas de datos, hojas y notas de sabor, descripción con capitular,
   lo que dicen las reseñas, la media y la dirección de la web.
   Se descarga como PNG (en el móvil se abre el menú de compartir).
   Uso: RRSS.descargar({ nombre, marca, pais, tipo, corte, formato, hojas, notas,
                         desc, espana, foto, tin, media, n, caract, archivo })
   ===================================================================== */
(function () {
  "use strict";
  const W = 1080, H = 1920, M = 60;              // tamaño y margen lateral
  const C = {
    fondo: "#F5F6F2", franja: "#E7E4CF", colinaA: "#B9C9A6", colinaB: "#8FAE74", tinta: "#1D2320", suave: "#5B655F",
    oro: "#8A5F12", casilla: "#F7EFDC", borde: "#DCCFB0", chip: "#EFE5CC", saborBg: "#F6E1C9", saborFg: "#7A3E12",
    texto: "#3B3A33", sep: "#E2D8BF", marron: "#7A4F2A", filo: "#A87A4A", verde: "#3E5A2B", verdeOsc: "#2F4520",
    verdeClaro: "#D9E4CC", oroPip: "#E0A82E", colinaTxt: "#46513F"
  };
  const F = {
    uncial: '"Uncial Antiqua", Georgia, serif', serif: '"Young Serif", Georgia, serif',
    sans: '"Instrument Sans", system-ui, sans-serif', mono: '"IBM Plex Mono", ui-monospace, monospace'
  };
  const HOJA_COLOR = { Virginia: "#C99A3B", Burley: "#9C6B3A", Oriental: "#B8863A", Latakia: "#4A3B2E", Perique: "#6B2E2A",
    Kentucky: "#5E4630", Cavendish: "#2E2219", Cigarro: "#7A5A3A" };
  const ICO = {   // los mismos iconos de línea que la ficha (viewBox 24)
    mezcla: ["M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z", "M12 9v9"],
    corte: ["M4 7h16M4 11h16M4 15h16M4 19h16"],
    origen: ["M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z", "M14.2 10a2.2 2.2 0 1 1-4.4 0a2.2 2.2 0 1 1 4.4 0z"],
    formato: ["M19 7a7 2.5 0 1 1-14 0a7 2.5 0 1 1 14 0z", "M5 7v10c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V7"]
  };

  /* ---------- Utilidades ---------- */
  function cargarImagen(src, cruzado) {
    return new Promise((ok) => {
      if (!src) return ok(null);
      const img = new Image();
      if (cruzado) img.crossOrigin = "anonymous";
      img.onload = () => ok(img); img.onerror = () => ok(null);
      img.src = src;
    });
  }
  async function imagenDeSvg(svg) {
    if (!svg) return null;
    const url = URL.createObjectURL(new Blob([svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="340" ')], { type: "image/svg+xml" }));
    const img = await cargarImagen(url);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return img;
  }
  // Una foto ajena al dominio puede «manchar» el lienzo: se comprueba antes de usarla.
  function sirve(img) {
    if (!img) return false;
    try { const c = document.createElement("canvas"); c.width = c.height = 2; const x = c.getContext("2d"); x.drawImage(img, 0, 0, 2, 2); x.getImageData(0, 0, 1, 1); return true; }
    catch (e) { return false; }
  }
  async function fuentes() {
    if (!document.fonts || !document.fonts.load) return;
    const pedir = ['48px "Uncial Antiqua"', '92px "Young Serif"', '400 28px "Instrument Sans"', '500 30px "Instrument Sans"',
      '400 20px "IBM Plex Mono"', '500 20px "IBM Plex Mono"', '600 42px "IBM Plex Mono"'];
    try { await Promise.race([Promise.all(pedir.map((f) => document.fonts.load(f))), new Promise((r) => setTimeout(r, 2500))]); } catch (e) { /* se usan las de reserva */ }
  }
  function fuente(x, peso, px, fam) { x.font = `${peso} ${px}px ${fam}`; }
  // Texto con letras separadas (letterSpacing no está en todos los navegadores)
  function anchoEsp(x, t, sep) { return [...t].reduce((a, l) => a + x.measureText(l).width, 0) + sep * Math.max(0, [...t].length - 1); }
  function textoEsp(x, t, cx, y, sep, alinear) {
    const w = anchoEsp(x, t, sep);
    let px = alinear === "center" ? cx - w / 2 : cx;
    const prev = x.textAlign; x.textAlign = "left";
    for (const l of t) { x.fillText(l, px, y); px += x.measureText(l).width + sep; }
    x.textAlign = prev;
    return w;
  }
  function recortar(x, t, max) {
    if (x.measureText(t).width <= max) return t;
    while (t.length > 1 && x.measureText(t + "…").width > max) t = t.slice(0, -1);
    return t.trimEnd() + "…";
  }
  // Ajusta el tamaño de letra hasta que el texto quepa en «max»
  function ajustar(x, t, peso, desde, hasta, fam, max) {
    for (let px = desde; px >= hasta; px -= 2) { fuente(x, peso, px, fam); if (x.measureText(t).width <= max) return px; }
    fuente(x, peso, hasta, fam); return hasta;
  }
  function lineas(x, texto, anchoDe, maxLineas) {
    const pal = String(texto).split(/\s+/).filter(Boolean), out = [];
    let cur = "", i = 0;
    for (; i < pal.length; i++) {
      const prueba = cur ? cur + " " + pal[i] : pal[i];
      if (x.measureText(prueba).width <= anchoDe(out.length) || !cur) cur = prueba;
      else { out.push(cur); cur = pal[i]; if (out.length === maxLineas) break; }
    }
    if (out.length < maxLineas && cur) { out.push(cur); cur = ""; i = pal.length; }
    if (i < pal.length || cur) {   // sobra texto: se corta en una palabra entera y se ponen puntos suspensivos
      const k = out.length - 1;
      let t = out[k];
      while (t.includes(" ") && x.measureText(t + "…").width > anchoDe(k)) t = t.slice(0, t.lastIndexOf(" "));
      out[k] = t.replace(/[\s,;:.\-–]+$/, "") + "…";
    }
    return out;
  }
  function redondeado(x, rx, ry, w, h, r) {
    x.beginPath(); x.moveTo(rx + r, ry); x.arcTo(rx + w, ry, rx + w, ry + h, r); x.arcTo(rx + w, ry + h, rx, ry + h, r);
    x.arcTo(rx, ry + h, rx, ry, r); x.arcTo(rx, ry, rx + w, ry, r); x.closePath();
  }
  function pips(x, cx, cy, n, r, lleno, vacio, sep) {
    for (let i = 0; i < 5; i++) {
      x.beginPath(); x.arc(cx + i * (2 * r + sep) + r, cy, i < n ? r : r - 1, 0, Math.PI * 2);
      if (i < n) { x.fillStyle = lleno; x.fill(); } else { x.strokeStyle = vacio; x.lineWidth = 2; x.stroke(); }
    }
  }
  function badgeEspana(x, cx, cy, r) {
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    x.fillStyle = "#AA151B"; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    x.fillStyle = "#F1BF00"; x.fillRect(cx - r, cy - r / 2, 2 * r, r);
    x.restore();
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.strokeStyle = "rgba(0,0,0,.18)"; x.lineWidth = 2; x.stroke();
    x.fillStyle = "#AA151B"; fuente(x, 700, Math.round(r * 1.05), "system-ui, sans-serif"); x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("E", cx, cy + 1); x.textBaseline = "alphabetic";
  }

  /* ---------- Piezas ---------- */
  function franja(x, logo) {
    const h = 300;
    x.fillStyle = C.franja; x.fillRect(0, 0, W, h);
    x.fillStyle = C.colinaA; x.fill(new Path2D("M0 214 C190 162 360 176 540 202 C720 228 900 176 1080 186 L1080 300 L0 300 Z"));
    x.fillStyle = C.colinaB; x.fill(new Path2D("M0 258 C220 230 440 240 660 252 C840 262 960 246 1080 250 L1080 300 L0 300 Z"));
    // Logo + nombre del herbario, centrados (por debajo de la barra de Instagram)
    fuente(x, 400, 48, F.uncial); const tw = x.measureText("El herbario de la Comarca").width;
    fuente(x, 400, 19, F.mono); const sw = anchoEsp(x, "CATÁLOGO DE TABACO DE PIPA", 1.9);
    const lw = 92, gap = 22, total = lw + gap + Math.max(tw, sw), x0 = (W - total) / 2, cy = 196;
    x.beginPath(); x.arc(x0 + lw / 2, cy, lw / 2, 0, Math.PI * 2); x.fillStyle = C.marron; x.fill();
    if (logo) { x.save(); x.beginPath(); x.arc(x0 + lw / 2, cy, lw / 2 - 6, 0, Math.PI * 2); x.clip(); x.drawImage(logo, x0 + 6, cy - lw / 2 + 6, lw - 12, lw - 12); x.restore(); }
    x.fillStyle = C.tinta; fuente(x, 400, 48, F.uncial); x.textAlign = "left"; x.fillText("El herbario de la Comarca", x0 + lw + gap, cy + 4);
    x.fillStyle = C.colinaTxt; fuente(x, 400, 19, F.mono); textoEsp(x, "CATÁLOGO DE TABACO DE PIPA", x0 + lw + gap, cy + 36, 1.9);
    return h;
  }
  function nicho(x, y, img) {
    const w = 460, h = 500, bx = (W - w) / 2, r = w / 2, rb = 22, balda = 36;
    const arco = () => {
      x.beginPath(); x.moveTo(bx, y + r); x.arc(bx + r, y + r, r, Math.PI, 0); x.lineTo(bx + w, y + h - rb);
      x.arcTo(bx + w, y + h, bx + w - rb, y + h, rb); x.lineTo(bx + rb, y + h); x.arcTo(bx, y + h, bx, y + h - rb, rb); x.closePath();
    };
    // sombra
    x.save(); x.shadowColor = "rgba(60,40,10,.45)"; x.shadowBlur = 50; x.shadowOffsetY = 26; arco(); x.fillStyle = C.marron; x.fill(); x.restore();
    x.save(); arco(); x.clip();
    const g = x.createRadialGradient(W / 2, y + h * 0.7, 10, W / 2, y + h * 0.7, h * 0.75);
    g.addColorStop(0, "#F6E3B4"); g.addColorStop(0.45, "#EBD9AE"); g.addColorStop(1, "#DCC79A");
    x.fillStyle = g; x.fillRect(bx, y, w, h);
    if (img) {
      const maxW = 340, maxH = h - balda - 90;
      const k = Math.min(maxW / img.width, maxH / img.height), iw = img.width * k, ih = img.height * k;
      const ix = W / 2 - iw / 2, iy = y + h - balda - ih - (img.esFoto ? 12 : -6);
      if (img.esFoto) { x.save(); redondeado(x, ix, iy, iw, ih, 12); x.clip(); x.drawImage(img, ix, iy, iw, ih); x.restore(); }
      else x.drawImage(img, ix, iy, iw, ih);
    }
    // balda
    x.fillStyle = "#8A5A2E"; x.fillRect(bx, y + h - balda, w, balda);
    x.fillStyle = "#A8743F"; x.fillRect(bx, y + h - balda, w, 6);
    x.fillStyle = "#6B4322"; x.fillRect(bx, y + h - 8, w, 8);
    x.restore();
    // filo claro por dentro y marco marrón encima
    x.save(); arco(); x.clip(); arco(); x.lineWidth = 18; x.strokeStyle = C.filo; x.stroke(); x.restore();
    arco(); x.lineWidth = 10; x.strokeStyle = C.marron; x.stroke();
    return h;
  }
  function cabecera(x, y, d, medir) {
    const marcaTxt = [d.marca, d.pais].filter(Boolean).join(" · ").toUpperCase();
    x.fillStyle = C.oro; let px = 25; fuente(x, 400, px, F.mono);
    while (px > 18 && anchoEsp(x, marcaTxt, px * 0.08) > W - 2 * M) { px -= 1; fuente(x, 400, px, F.mono); }
    if (!medir) textoEsp(x, marcaTxt, W / 2, y + 26, px * 0.08, "center");
    y += 44;
    const badge = d.espana ? 64 : 0, max = W - 2 * M - badge;
    x.fillStyle = C.tinta; x.textAlign = "center";
    let tam = ajustar(x, d.nombre, 400, 92, 66, F.serif, max), filas = [d.nombre];
    if (x.measureText(d.nombre).width > max) { tam = 66; fuente(x, 400, tam, F.serif); filas = lineas(x, d.nombre, () => max, 2); }
    if (!medir) filas.forEach((l, i) => {
      const lw = x.measureText(l).width, base = y + tam * 0.9 + i * tam * 1.05;
      const esUltima = i === filas.length - 1;
      x.fillText(l, W / 2 - (esUltima ? badge / 2 : 0), base);
      if (esUltima && badge) badgeEspana(x, W / 2 - badge / 2 + lw / 2 + 14 + 25, base - tam * 0.32, 25);
    });
    return 44 + Math.round(tam * 1.05 * filas.length) + 6;
  }
  function casillas(x, y, d) {
    const datos = [["mezcla", "Mezcla", d.tipo], ["corte", "Corte", d.corte], ["origen", "Origen", d.pais], ["formato", "Formato", d.formato]].filter((c) => c[2]);
    if (!datos.length) return 0;
    const gap = 12, h = 112, n = datos.length, w = (W - 2 * M - gap * (n - 1)) / n;
    datos.forEach(([k, etq, v], i) => {
      const cx = M + i * (w + gap);
      redondeado(x, cx, y, w, h, 18); x.fillStyle = C.casilla; x.fill(); x.lineWidth = 1.5; x.strokeStyle = C.borde; x.stroke();
      x.save(); x.translate(cx + 16, y + 14); x.scale(28 / 24, 28 / 24); x.strokeStyle = C.oro; x.lineWidth = 1.6; x.lineCap = "round"; x.lineJoin = "round";
      ICO[k].forEach((p) => x.stroke(new Path2D(p))); x.restore();
      x.fillStyle = C.suave; fuente(x, 400, 19, F.mono); x.textAlign = "left"; x.fillText(etq, cx + 52, y + 35);
      x.fillStyle = C.tinta; const max = w - 32; ajustar(x, v, 500, 30, 20, F.sans, max);
      x.fillText(recortar(x, v, max), cx + 16, y + 88);
    });
    return h;
  }
  function chips(x, y, d, medir) {
    const filas = [];
    if (d.hojas.length) filas.push(["Hojas", d.hojas.map((h) => ({ t: h, punto: HOJA_COLOR[h] || "#9C8466" }))]);
    if (d.notas.length) filas.push(["Notas de sabor", d.notas.map((n) => ({ t: n, sabor: true }))]);
    if (!filas.length) return 0;
    const col = 240, x0 = M + col, max = W - M, ch = 48, gapX = 10, gapY = 10;
    let yy = y;
    filas.forEach(([etq, lista], fi) => {
      if (fi) yy += 14;
      if (!medir) { x.fillStyle = C.suave; fuente(x, 400, 22, F.mono); x.textAlign = "left"; x.fillText(etq, M, yy + 32); }
      let cx = x0;
      fuente(x, 400, 28, F.sans);
      lista.forEach((c) => {
        const tw = Math.min(x.measureText(c.t).width, max - x0 - 44 - (c.punto ? 26 : 0));
        const w = tw + 44 + (c.punto ? 26 : 0);
        if (cx > x0 && cx + w > max) { cx = x0; yy += ch + gapY; }
        if (!medir) {
          redondeado(x, cx, yy, w, ch, ch / 2); x.fillStyle = c.sabor ? C.saborBg : C.chip; x.fill();
          let tx = cx + 22;
          if (c.punto) { x.beginPath(); x.arc(tx + 8, yy + ch / 2, 8, 0, Math.PI * 2); x.fillStyle = c.punto; x.fill(); tx += 26; }
          x.fillStyle = c.sabor ? C.saborFg : C.tinta; fuente(x, 400, 28, F.sans); x.fillText(recortar(x, c.t, tw), tx, yy + 34);
        }
        cx += w + gapX;
      });
      yy += ch;
    });
    return yy - y;
  }
  function descripcion(x, y, texto, maxLineas, medir) {
    texto = String(texto || "").trim();
    if (!texto || maxLineas < 1) return 0;
    const lh = 44, capTam = 94;
    fuente(x, 400, capTam, F.uncial);
    const letra = texto.charAt(0).toUpperCase(), mc = x.measureText(letra), capW = mc.width + 14;
    const capBase = 22 + 78, capFondo = capBase + (mc.actualBoundingBoxDescent || 0);
    let sangria = 1; while (22 + 32 + sangria * lh - 30 < capFondo + 4) sangria++;   // líneas que quedan al lado de la letra
    fuente(x, 400, 31, F.sans);
    const filas = lineas(x, texto.slice(1), (i) => (i < sangria ? W - 2 * M - capW : W - 2 * M), maxLineas);
    const alto = 22 + filas.length * lh;
    if (medir) return Math.max(alto, capFondo + 6);
    x.fillStyle = C.sep; x.fillRect(M, y, W - 2 * M, 2);
    x.fillStyle = C.marron; fuente(x, 400, capTam, F.uncial); x.textAlign = "left"; x.fillText(letra, M, y + capBase);
    x.fillStyle = C.texto; fuente(x, 400, 31, F.sans);
    filas.forEach((l, i) => x.fillText(l, M + (i < sangria ? capW : 0), y + 22 + 32 + i * lh));
    return Math.max(alto, capFondo + 6);
  }
  function resenas(x, y, d, medir) {
    if (!d.n) return 0;
    const caract = (d.caract || []).slice(0, 3);
    const h = caract.length ? 214 : 150, gap = 14, total = W - 2 * M;
    if (medir) return h;
    const wMedia = caract.length ? Math.round((total - gap) * 0.4) : total;
    const wCar = total - gap - wMedia;
    if (caract.length) {
      redondeado(x, M, y, wCar, h, 20); x.fillStyle = C.casilla; x.fill(); x.lineWidth = 1.5; x.strokeStyle = C.borde; x.stroke();
      x.fillStyle = C.oro; fuente(x, 400, 19, F.mono); textoEsp(x, "SEGÚN LAS RESEÑAS", M + 24, y + 42, 1.5);
      caract.forEach(([etq, val], i) => {
        const yy = y + 92 + i * 44;
        x.fillStyle = C.suave; fuente(x, 400, 21, F.mono); x.textAlign = "left"; x.fillText(etq, M + 24, yy);
        x.fillStyle = C.tinta; fuente(x, 500, 28, F.sans); x.textAlign = "right";
        x.fillText(recortar(x, val, wCar - 48 - 200), M + wCar - 24, yy); x.textAlign = "left";
      });
    }
    const mx = M + total - wMedia;
    redondeado(x, mx, y, wMedia, h, 20); x.fillStyle = C.verde; x.fill();
    const media = d.media.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const pie = `${d.n} ${d.n === 1 ? "reseña" : "reseñas"}`;
    x.textAlign = "left";
    x.fillStyle = C.verdeClaro; fuente(x, 400, 19, F.mono); textoEsp(x, "MEDIA DE LAS RESEÑAS", mx + 24, y + 42, 1.5);
    if (!caract.length) {   // sola: cifra a la izquierda y bolitas con el número de reseñas a la derecha
      x.fillStyle = "#F5F6F2"; fuente(x, 400, 76, F.serif); x.fillText(media, mx + 24, y + 128);
      const mw = x.measureText(media).width;
      fuente(x, 400, 28, F.serif); x.fillStyle = C.verdeClaro; x.fillText("/5", mx + 30 + mw, y + 128);
      x.textAlign = "right"; fuente(x, 400, 24, F.mono); x.fillText(pie, mx + wMedia - 28, y + 126); x.textAlign = "left";
      pips(x, mx + wMedia - 28 - (5 * 22 + 4 * 9), y + 82, Math.round(d.media), 11, C.oroPip, C.verdeClaro, 9);
      return h;
    }
    x.fillStyle = "#F5F6F2"; fuente(x, 400, 76, F.serif); x.fillText(media, mx + 24, y + 124);
    const mw = x.measureText(media).width;
    fuente(x, 400, 28, F.serif); x.fillStyle = C.verdeClaro; x.fillText("/5", mx + 30 + mw, y + 124);
    pips(x, mx + 24, y + 156, Math.round(d.media), 9, C.oroPip, C.verdeClaro, 7);
    fuente(x, 400, 21, F.mono); x.fillText(pie, mx + 24, y + 196);
    return h;
  }
  function pie(x) {
    const top = 1640;
    x.fillStyle = C.franja; x.fillRect(0, top, W, H - top);
    x.textAlign = "center";
    x.fillStyle = C.verdeOsc; fuente(x, 600, 42, F.mono); x.fillText("elherbariodelacomarca.es", W / 2, top + 72);
    x.fillStyle = C.suave; fuente(x, 400, 21, F.mono); x.fillText("Contenido informativo · +18", W / 2, top + 112);
    x.textAlign = "left";
    return top;
  }

  /* ---------- Composición ---------- */
  async function dibujar(d) {
    await fuentes();
    const [logo, foto] = await Promise.all([cargarImagen("img/logo.png"), cargarImagen(d.foto, /^https:/.test(d.foto || ""))]);
    let arte = sirve(foto) ? foto : null;
    if (arte) arte.esFoto = true; else arte = await imagenDeSvg(d.tin);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = C.fondo; x.fillRect(0, 0, W, H);
    franja(x, sirve(logo) ? logo : null);
    const finPie = 1640 - 24;
    let y = 300 - 44;
    y += nicho(x, y, arte);

    // Se mide lo que viene después para repartir el hueco que sobre
    const hCab = cabecera(x, 0, d, true), hCas = (d.tipo || d.corte || d.pais || d.formato) ? 112 : 0;
    const hChips = chips(x, 0, d, true), hRes = resenas(x, 0, d, true);
    const bloques = [hCas, hChips, hRes].filter(Boolean).length + 1;
    const libre = finPie - y - hCab - hCas - hChips - hRes - 24 * (bloques + 1);
    const lineasDesc = Math.max(0, Math.min(7, Math.floor((libre - 22) / 44)));
    const hDesc = descripcion(x, 0, d.desc, lineasDesc, true);
    const piezas = 1 + bloques + (hDesc ? 1 : 0);
    const sobra = Math.max(0, finPie - y - hCab - hCas - hChips - hRes - hDesc - 24 * piezas);
    const gap = 24 + Math.min(64, sobra / piezas);

    y += gap;
    y += cabecera(x, y, d);
    if (hCas) { y += gap - 10; y += casillas(x, y, d); }
    if (hChips) { y += gap; y += chips(x, y, d, false); }
    if (hDesc) { y += gap; y += descripcion(x, y, d.desc, lineasDesc, false); }
    if (hRes) { y += gap; resenas(x, y, d, false); }
    pie(x);
    return c;
  }
  function bajar(blob, nombre) {
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  async function descargar(d) {
    const c = await dibujar(d);
    const blob = await new Promise((r) => c.toBlob(r, "image/png"));
    if (!blob) throw new Error("No se pudo crear la imagen");
    const nombre = `${d.archivo || "ficha"}-historia.png`;
    const tactil = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (tactil && navigator.canShare) {
      const file = new File([blob], nombre, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file] }); return "compartida"; }
        catch (e) { if (e && e.name === "AbortError") return "cancelada"; }
      }
    }
    bajar(blob, nombre);
    return "descargada";
  }
  window.RRSS = { descargar, dibujar };
})();
