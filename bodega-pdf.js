/* =====================================================================
   Mi bodega en PDF: «Inventario de la despensa».
   Se genera en el propio navegador (nada pasa por ningún servidor) con jsPDF, que va en
   vendor/, y las fuentes de la web, que van en fuentes/. Este archivo solo se descarga
   cuando alguien pulsa «Descargar PDF» en Mi bodega.
   app.js llama a window.inventarioBodegaPDF(datos) con:
     { titular, tabacos: [{ id, nombre, marca, tipo, corte, foto, gramos, envases: [tarros] }],
       colores: { tipo: "#hex" }, ordenTipos: [tipos] }
   ===================================================================== */
(function () {
  "use strict";
  const MM = (pt) => pt * 0.3528;   // de puntos a milímetros
  const C = {
    fg: "#2E2418", muted: "#6E5E48", line: "#DDCEB1", fila: "#EEE3CC", papel: "#F3EBDA",
    accent: "#2F5D34", gold: "#A8761E", rojo: "#9A3324",
  };
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const FUENTES = [
    ["Alegreya-Regular.ttf", "Alegreya", "normal"], ["Alegreya-Bold.ttf", "Alegreya", "bold"],
    ["Alegreya-Italic.ttf", "Alegreya", "italic"], ["AlegreyaSC-Medium.ttf", "AlegreyaSC", "normal"],
    ["YoungSerif-Regular.ttf", "YoungSerif", "normal"], ["UncialAntiqua-Regular.ttf", "Uncial", "normal"],
  ];

  /* ---------- Carga de la librería, las fuentes y las imágenes ---------- */
  let cargando = null;
  function cargarJsPDF() {
    if (window.jspdf) return Promise.resolve();
    if (!cargando) cargando = new Promise((ok, mal) => {
      const s = document.createElement("script");
      s.src = "vendor/jspdf-4.2.1.umd.min.js"; s.onload = ok; s.onerror = () => { cargando = null; mal(new Error("jsPDF")); };
      document.head.appendChild(s);
    });
    return cargando;
  }
  const base64 = (buf) => {
    const b = new Uint8Array(buf); let s = "";
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  };
  let fuentes = null;
  function cargarFuentes() {
    if (!fuentes) fuentes = Promise.all(FUENTES.map(([f]) => fetch("fuentes/" + f).then((r) => {
      if (!r.ok) throw new Error(f); return r.arrayBuffer();
    }).then(base64))).catch((e) => { fuentes = null; throw e; });
    return fuentes;
  }
  // Imagen → JPEG cuadrado recortado al centro (como object-fit: cover). null si no se puede.
  function cargarImagen(src, lado = 160, png = false) {
    return new Promise((ok) => {
      if (!src) return ok(null);
      const img = new Image(); let hecho = false;
      const fin = (v) => { if (!hecho) { hecho = true; ok(v); } };
      img.crossOrigin = "anonymous"; img.decoding = "async";
      img.onload = () => {
        try {
          const c = document.createElement("canvas"); c.width = c.height = lado;
          const g = c.getContext("2d");
          if (!png) { g.fillStyle = "#fff"; g.fillRect(0, 0, lado, lado); }
          const k = Math.max(lado / img.naturalWidth, lado / img.naturalHeight);
          const w = img.naturalWidth * k, h = img.naturalHeight * k;
          g.drawImage(img, (lado - w) / 2, (lado - h) / 2, w, h);
          fin(c.toDataURL(png ? "image/png" : "image/jpeg", 0.85));
        } catch (e) { fin(null); }
      };
      img.onerror = () => fin(null);
      setTimeout(() => fin(null), 6000);
      img.src = src;
    });
  }
  // La lata dibujada del catálogo, con el color de su tipo de mezcla, como PNG.
  function lata(color, letra) {
    const W = 200, H = 170, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    const elipse = (cx, cy, rx, ry, f, a = 1) => { g.globalAlpha = a; g.fillStyle = f; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; };
    const rect = (x, y, w, h, f, a = 1) => { g.globalAlpha = a; g.fillStyle = f; g.fillRect(x, y, w, h); g.globalAlpha = 1; };
    elipse(100, 152, 76, 10, "#000", 0.16);
    rect(28, 52, 144, 92, color); elipse(100, 144, 72, 14, color);
    rect(28, 52, 144, 92, "#000", 0.12); rect(42, 54, 10, 88, "#fff", 0.14);
    rect(28, 82, 144, 40, "#15130F", 0.88); rect(28, 86, 144, 1.5, "#D9B45A"); rect(28, 116.5, 144, 1.5, "#D9B45A");
    g.fillStyle = "#F2E9D0"; g.font = "32px Georgia, serif"; g.textAlign = "center"; g.fillText(letra, 100, 112);
    elipse(100, 52, 72, 14, color); elipse(100, 52, 72, 14, "#fff", 0.28);
    return c.toDataURL("image/png");
  }
  async function enParalelo(lista, fn, n = 6) {
    const res = new Array(lista.length); let i = 0;
    await Promise.all(Array.from({ length: Math.min(n, lista.length) }, async () => {
      while (i < lista.length) { const k = i++; res[k] = await fn(lista[k]); }
    }));
    return res;
  }

  /* ---------- Textos ---------- */
  const uds = (t) => (Number.isInteger(t.unidades) && t.unidades > 0 ? t.unidades : 1);
  const miles = (n) => { try { return new Intl.NumberFormat("es-ES", { useGrouping: "always" }).format(n); } catch (e) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); } };
  const gramos = (g) => (g ? `${miles(Number(g))} g` : "");
  function meses(t) {
    const h = new Date();
    return (h.getFullYear() - t.fecha_anio) * 12 + (h.getMonth() + 1 - (t.fecha_mes || 1));
  }
  function edad(t) {
    if (!t.fecha_anio) return "";
    if (!t.fecha_mes) { const a = new Date().getFullYear() - t.fecha_anio; return a <= 0 ? "este año" : a === 1 ? "1 año" : `${a} años`; }
    const m = meses(t);
    if (m <= 0) return "este mes";
    const a = Math.floor(m / 12);
    return a ? (a === 1 ? "1 año" : `${a} años`) : (m === 1 ? "1 mes" : `${m} meses`);
  }
  const fecha = (anio, mes) => (anio ? (mes ? `${MESES[mes - 1]} ${anio}` : String(anio)) : "");
  const NOMBRE = { lata: ["Lata", "latas"], tarro: ["Tarro", "tarros"], bolsa: ["Bolsa", "bolsas"], "": ["Envase", "envases"] };
  function envaseTxt(t) {
    const n = uds(t), nom = NOMBRE[t.envase || ""] || NOMBRE[""];
    if (n === 1) return `${nom[0]}${t.gramos ? " " + gramos(t.gramos) : ""}`;
    return `${n} ${nom[1]}${t.gramos ? " × " + gramos(t.gramos) : ""}`;
  }
  const TIPO_FECHA = { embotado: "Embotado", compra: "Comprado", lata: "Lata de" };
  const hoyTxt = () => { const h = new Date(); return `${h.getDate()} de ${MESES_LARGO[h.getMonth()]} de ${h.getFullYear()}`; };

  /* ---------- El PDF ---------- */
  window.inventarioBodegaPDF = async function (datos) {
    const [, ttfs] = await Promise.all([cargarJsPDF(), cargarFuentes()]);
    const tabacos = datos.tabacos.filter((d) => d.nombre);
    const [logo, fotos] = await Promise.all([
      cargarImagen("img/logo.png", 240, true),
      enParalelo(tabacos, (d) => cargarImagen(d.foto)),
    ]);
    tabacos.forEach((d, i) => { d._img = fotos[i] || lata(datos.colores[d.tipo] || "#5A5548", (d.nombre.trim()[0] || "?").toUpperCase()); });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    FUENTES.forEach(([f, fam, est], i) => { doc.addFileToVFS(f, ttfs[i]); doc.addFont(f, fam, est); });
    doc.setProperties({ title: `Mi bodega · ${datos.titular}`, author: datos.titular, creator: "El herbario de la Comarca" });
    doc.setLineHeightFactor(1.18);

    const W = 210, H = 297, M = 13, ABAJO = H - 16;
    const fuente = (fam, est, pt, color) => { doc.setFont(fam, est || "normal"); doc.setFontSize(pt); doc.setTextColor(color || C.fg); };
    const texto = (t, x, y, op) => doc.text(Array.isArray(t) ? t : String(t), x, y, op);
    let y = M;

    // Cabecera
    if (logo) doc.addImage(logo, "PNG", M, y, 17, 17);
    fuente("Uncial", "normal", 28); texto("Mi bodega", M + 21, y + 9.5);
    fuente("Alegreya", "normal", 10, C.muted); texto(`Inventario de ${datos.titular} · El herbario de la Comarca`, M + 21, y + 15);
    fuente("Alegreya", "normal", 9, C.muted); texto(hoyTxt(), W - M, y + 7, { align: "right" });
    y += 20.5;
    doc.setDrawColor(C.accent); doc.setLineWidth(0.6); doc.line(M, y, W - M, y);
    y += 5;

    // Cifras
    const todos = tabacos.flatMap((d) => d.envases.map((t) => ({ t, d })));
    const nEnv = todos.reduce((s, x) => s + uds(x.t), 0);
    const totalG = tabacos.reduce((s, d) => s + (d.gramos || 0), 0);
    const viejo = todos.filter((x) => x.t.fecha_anio).sort((a, b) => meses(b.t) - meses(a.t))[0];
    const cifras = [
      [String(tabacos.length), tabacos.length === 1 ? "tabaco en la bodega" : "tabacos en la bodega"],
      [String(nEnv), nEnv === 1 ? "lata, tarro o bolsa" : "latas, tarros y bolsas"],
      [gramos(totalG) || "0 g", "en total"],
      viejo ? [viejo.d.nombre, `el más añejo · ${edad(viejo.t)}`, true] : ["—", "sin fechas apuntadas", true],
    ];
    const anchoC = (W - 2 * M - 3 * 3) / 4;
    cifras.forEach(([n, l, nombre], i) => {
      const x = M + i * (anchoC + 3);
      doc.setFillColor(C.papel); doc.roundedRect(x, y, anchoC, 16, 2, 2, "F");
      if (nombre) {
        fuente("YoungSerif", "normal", 11);
        const ls = doc.splitTextToSize(n, anchoC - 7).slice(0, 2);
        texto(ls, x + 3.5, y + 6);
        fuente("Alegreya", "normal", 8, C.muted); texto(doc.splitTextToSize(l, anchoC - 7)[0], x + 3.5, y + 13.4);
      } else {
        fuente("YoungSerif", "normal", 17, C.accent); texto(n, x + 3.5, y + 8.2);
        fuente("Alegreya", "normal", 8, C.muted); texto(l, x + 3.5, y + 13.4);
      }
    });
    y += 22;

    // Tabla
    const COL = { tab: M, env: M + 62, fec: M + 92, edad: M + 117, est: M + 136, nota: M + 163 };
    const FIN = W - M;
    const cabTabla = () => {
      fuente("AlegreyaSC", "normal", 7.5, C.muted);
      [["Tabaco", COL.tab], ["Envase", COL.env], ["Fecha", COL.fec], ["Edad", COL.edad], ["Estado", COL.est], ["Nota", COL.nota]]
        .forEach(([t, x]) => texto(t, x + (x === M ? 0 : 0), y + 3));
      y += 4.6; doc.setDrawColor(C.line); doc.setLineWidth(0.25); doc.line(M, y, FIN, y); y += 1;
    };
    const nuevaPagina = () => { doc.addPage(); y = M; cabTabla(); };
    cabTabla();

    const orden = datos.ordenTipos.concat([""]);
    const grupos = orden.map((tipo) => [tipo, tabacos.filter((d) => (orden.includes(d.tipo) ? d.tipo : "") === tipo)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))]).filter(([, l]) => l.length);

    const FILA = 8.6;
    // Alto de un tabaco: el de sus envases o el de su nombre, lo que sea mayor.
    const medir = (d) => {
      fuente("Alegreya", "bold", 9.5);
      const nom = doc.splitTextToSize(d.nombre, COL.env - COL.tab - 13);
      fuente("Alegreya", "normal", 8);
      const sub = doc.splitTextToSize([d.marca, d.corte].filter(Boolean).join(" · "), COL.env - COL.tab - 13);
      const filas = Math.max(1, d.envases.length);
      const notas = d.envases.map((t) => { fuente("Alegreya", "italic", 8.5); return doc.splitTextToSize(t.nota || "", FIN - COL.nota).length; });
      const altFilas = d.envases.length ? d.envases.map((t, i) => Math.max(FILA, 3 + notas[i] * MM(8.5) * 1.18 + 2.4)) : [FILA];
      const altNom = 3.6 + nom.length * MM(9.5) * 1.18 + sub.length * MM(8) * 1.18 + 1.8;
      const alto = Math.max(altFilas.reduce((s, a) => s + a, 0), altNom, 11);
      return { nom, sub, filas, altFilas, alto };
    };

    grupos.forEach(([tipo, lista]) => {
      const medidas = lista.map(medir);
      if (y + 9 + medidas[0].alto > ABAJO) nuevaPagina();
      // Rótulo del grupo
      y += 2.8;
      doc.setFillColor(datos.colores[tipo] || "#8A7D68"); doc.circle(M + 1.6, y + 2.6, 1.5, "F");
      fuente("YoungSerif", "normal", 12); texto(tipo || "Sin tipo de mezcla", M + 5, y + 4.1);
      const anchoT = doc.getTextWidth(tipo || "Sin tipo de mezcla");
      const g = lista.reduce((s, d) => s + (d.gramos || 0), 0);
      fuente("Alegreya", "normal", 8.5, C.muted);
      texto(`${lista.length === 1 ? "1 tabaco" : lista.length + " tabacos"}${g ? " · " + gramos(g) : ""}`, M + 7 + anchoT, y + 4);
      y += 6.6;

      lista.forEach((d, k) => {
        const m = medidas[k];
        if (y + m.alto > ABAJO) nuevaPagina();
        const y0 = y;
        // Tabaco: imagen, nombre, marca · corte
        const ladoImg = 8.5, yImg = y0 + (m.alto - ladoImg) / 2;
        try { doc.addImage(d._img, d._img.startsWith("data:image/png") ? "PNG" : "JPEG", COL.tab, yImg, ladoImg, ladoImg * (d._img.startsWith("data:image/png") && !d.foto ? 0.85 : 1)); } catch (e) {}
        const altTxt = m.nom.length * MM(9.5) * 1.18 + m.sub.length * MM(8) * 1.18;
        let ty = y0 + (m.alto - altTxt) / 2 + MM(9.5) * 0.9;
        fuente("Alegreya", "bold", 9.5); texto(m.nom, COL.tab + 11, ty);
        ty += m.nom.length * MM(9.5) * 1.18;
        fuente("Alegreya", "normal", 8, C.muted); texto(m.sub, COL.tab + 11, ty);

        // Envases
        let fy = y0 + (m.alto - m.altFilas.reduce((s, a) => s + a, 0)) / 2;
        if (!d.envases.length) {
          fuente("Alegreya", "normal", 9); texto(d.gramos ? gramos(d.gramos) : "—", COL.env, fy + FILA / 2 + 1.2);
          fuente("Alegreya", "italic", 8.5, C.muted); texto("Sin envases apuntados", COL.fec, fy + FILA / 2 + 1.2);
        }
        d.envases.forEach((t, i) => {
          const h = m.altFilas[i], mid = fy + h / 2;
          if (i) { doc.setDrawColor(C.fila); doc.setLineWidth(0.2); doc.line(COL.env, fy, FIN, fy); }
          fuente("Alegreya", "normal", 9); texto(envaseTxt(t), COL.env, mid + 1.2);
          if (t.fecha_anio) {
            fuente("Alegreya", "normal", 7.5, C.muted); texto(TIPO_FECHA[t.tipo_fecha] || "Embotado", COL.fec, mid - 0.7);
            fuente("Alegreya", "normal", 9); texto(fecha(t.fecha_anio, t.fecha_mes), COL.fec, mid + 2.9);
            fuente("Alegreya", "bold", 9, C.gold); texto(edad(t), COL.edad, mid + 1.2);
          } else {
            fuente("Alegreya", "normal", 9, C.muted); texto("—", COL.fec, mid + 1.2);
          }
          if (t.abierto_anio) { fuente("Alegreya", "normal", 8.5, C.rojo); texto(`Abierto ${fecha(t.abierto_anio, t.abierto_mes)}`, COL.est, mid + 1.2); }
          else { fuente("Alegreya", "normal", 8.5, C.accent); texto("Cerrado", COL.est, mid + 1.2); }
          if (t.nota) {
            fuente("Alegreya", "italic", 8.5, C.muted);
            const ls = doc.splitTextToSize(t.nota, FIN - COL.nota);
            texto(ls, COL.nota, mid + 1.2 - (ls.length - 1) * MM(8.5) * 1.18 / 2);
          }
          fy += h;
        });
        y = y0 + m.alto;
        doc.setDrawColor(C.line); doc.setLineWidth(0.25); doc.line(M, y, FIN, y);
      });
      y += 1.5;
    });

    if (!tabacos.length) {
      fuente("Alegreya", "italic", 10, C.muted);
      texto("Todavía no hay ningún tabaco marcado como «Lo tengo».", M, y + 8);
    }

    // Pie de cada página
    const n = doc.getNumberOfPages();
    for (let p = 1; p <= n; p++) {
      doc.setPage(p);
      doc.setDrawColor(C.line); doc.setLineWidth(0.25); doc.line(M, H - 11.5, W - M, H - 11.5);
      fuente("Alegreya", "normal", 7.5, C.muted);
      texto("elherbariodelacomarca.es", M, H - 7.5);
      texto("Fumar perjudica gravemente la salud.", W / 2, H - 7.5, { align: "center" });
      if (n > 1) texto(`${p} / ${n}`, W - M, H - 7.5, { align: "right" });
    }

    const h = new Date(), dd = (v) => String(v).padStart(2, "0");
    doc.save(`mi-bodega-${h.getFullYear()}-${dd(h.getMonth() + 1)}-${dd(h.getDate())}.pdf`);
  };
})();
