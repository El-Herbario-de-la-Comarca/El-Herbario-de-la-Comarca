/* ---------- Avisar de un error en una ficha · Sugerir un tabaco ----------
   Ventana con un cuadro de texto. El mensaje se guarda en la tabla «avisos» de Supabase y un disparador
   (SQL 62) lo manda por correo al administrador con «Responder a» la dirección de quien escribe.
   Solo para quien ha entrado con su cuenta (así se evita el correo basura y se le puede contestar).
   Usa de app.js: sb, ctx, $, esc, abrirLogin. */
window.Avisos = (function () {
  const dlg = $("aviso-dlg");
  if (!dlg || !sb) return { abrir() {} };
  const titulo = $("av-title"), texto = $("av-text"), campo = $("av-msg"), estado = $("av-estado"),
    enviar = $("av-send"), cerrarB = $("av-cancel"), form = $("av-form");
  let actual = null, vueltaFoco = null;

  const TEXTOS = {
    error: {
      titulo: "Avisar de un error",
      texto: (f) => `Cuéntanos qué está mal en la ficha de <strong>${esc(f.nombre)}</strong> (${esc(f.marca)}): un dato equivocado, una errata, la foto… Si sabes cuál es el dato correcto y de dónde sale, mejor.`,
      ph: "Por ejemplo: el corte es Ready Rubbed, no Flake (lo pone en la web del fabricante).",
      cuenta: "Para avisar de un error tienes que entrar con tu cuenta. Si es la primera vez, crea una.",
    },
    sugerencia: {
      titulo: "Sugerir un tabaco",
      texto: () => "¿Echas en falta un tabaco de pipa en el catálogo? Dinos la marca y el nombre de la mezcla y, si puedes, dónde la has visto. Lo revisamos antes de añadirlo.",
      ph: "Por ejemplo: Marca X, mezcla Y. La he visto en estancos de España.",
      cuenta: "Para sugerir un tabaco tienes que entrar con tu cuenta. Si es la primera vez, crea una.",
    },
  };

  async function abrir(tipo, ficha, borrador) {
    const t = TEXTOS[tipo]; if (!t) return;
    let conCuenta = !!ctx.session;
    // Al llegar desde una página f/<id>.html la sesión puede no estar cargada todavía en ctx
    if (!conCuenta) { try { const r = await sb.auth.getSession(); conCuenta = !!(r.data && r.data.session); } catch (e) {} }
    if (!conCuenta) {
      abrirLogin();
      $("lg-text").textContent = t.cuenta;
      return;
    }
    actual = { tipo, ficha: ficha || null };
    vueltaFoco = document.activeElement;
    titulo.textContent = t.titulo;
    texto.innerHTML = t.texto(ficha || {});
    campo.placeholder = t.ph;
    campo.value = borrador || "";
    estado.textContent = ""; estado.style.color = "";
    enviar.disabled = false; enviar.hidden = false; campo.disabled = false;
    cerrarB.textContent = "Cancelar";
    dlg.hidden = false;
    campo.focus();
  }
  function cerrar() {
    dlg.hidden = true; actual = null;
    if (vueltaFoco && vueltaFoco.focus) vueltaFoco.focus();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!actual) return;
    const mensaje = campo.value.trim();
    if (mensaje.length < 5) { estado.textContent = "Escribe un poco más, por favor."; estado.style.color = "var(--danger)"; return; }
    enviar.disabled = true; estado.style.color = ""; estado.textContent = "Enviando…";
    const fila = { tipo: actual.tipo, mensaje: mensaje.slice(0, 2000) };
    if (actual.ficha) { fila.ficha_id = String(actual.ficha.id); fila.ficha_nombre = `${actual.ficha.nombre} · ${actual.ficha.marca}`; }
    const { error } = await sb.from("avisos").insert(fila);
    if (error) {
      console.error("Avisos:", error);
      estado.style.color = "var(--danger)";
      estado.textContent = /limite_avisos/.test(error.message || "")
        ? "Has enviado muchos mensajes hoy. Prueba de nuevo mañana."
        : "No se ha podido enviar. Prueba otra vez dentro de un rato.";
      enviar.disabled = false;
      return;
    }
    estado.textContent = actual.tipo === "error"
      ? "¡Gracias! Hemos recibido tu aviso y revisaremos la ficha."
      : "¡Gracias! Hemos recibido tu sugerencia.";
    campo.disabled = true; enviar.hidden = true; cerrarB.textContent = "Cerrar";
  });
  cerrarB.addEventListener("click", cerrar);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) cerrar(); });
  // Escape cierra solo esta ventana, no la ficha que hay debajo
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dlg.hidden) { e.stopPropagation(); cerrar(); }
  }, true);

  // Enlaces «Sugerir un tabaco» de la portada (pie del catálogo, pie de página y búsqueda sin resultados)
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-sugerir]");
    if (!b) return;
    e.preventDefault();
    const q = ($("q") && $("q").value.trim()) || "";
    abrir("sugerencia", null, b.dataset.sugerir === "busqueda" && q ? q : "");
  });

  return { abrir };
})();
