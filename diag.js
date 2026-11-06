/* Diagnóstico de la sesión (solo con ?diag en la dirección). Muestra en pantalla lo que en el
   móvil no se ve sin consola: errores, eventos de acceso, la sesión guardada y los candados. */
(function () {
  if (!/[?&]diag\b/.test(location.search)) return;
  var log = [];
  function add(t) { log.push(new Date().toTimeString().slice(0, 8) + " " + t); if (log.length > 25) log.shift(); }
  window.__diag = add;
  window.addEventListener("error", function (e) { add("ERROR " + (e.message || e.type) + " @" + (e.filename || "").split("/").pop() + ":" + e.lineno); });
  window.addEventListener("unhandledrejection", function (e) { var r = e.reason; add("PROMESA " + (r && (r.message || r.name) || String(r))); });
  var ce = console.error;
  console.error = function () { try { add("console.error " + [].map.call(arguments, function (a) { return a && a.message ? a.message : String(a); }).join(" ").slice(0, 200)); } catch (x) {} return ce.apply(console, arguments); };

  var box;
  function pintar(info) {
    if (!box) {
      box = document.createElement("pre");
      box.style.cssText = "position:fixed;left:0;right:0;bottom:0;max-height:45vh;overflow:auto;margin:0;padding:8px;z-index:99999;background:#111;color:#9f9;font:11px/1.35 monospace;white-space:pre-wrap;word-break:break-all";
      document.body.appendChild(box);
    }
    box.textContent = info + "\n--- registro ---\n" + log.join("\n");
  }
  async function revisar() {
    var l = [];
    try { l.push("app.js: " + ([].slice.call(document.scripts).map(function (s) { return s.src; }).filter(function (s) { return /app\.js/.test(s); })[0] || "?").split("/").pop()); } catch (e) {}
    try { l.push("SW: " + (navigator.serviceWorker && navigator.serviceWorker.controller ? "activo" : "no")); } catch (e) {}
    try {
      var k = Object.keys(localStorage).filter(function (x) { return /^sb-|supabase/.test(x); });
      l.push("localStorage sb: " + (k.length ? k.map(function (x) { var v = localStorage.getItem(x) || ""; var u = ""; try { var j = JSON.parse(v); u = j && j.user ? j.user.email : ""; } catch (e) {} return x + " (" + v.length + "c " + u + ")"; }).join(", ") : "ninguna"));
    } catch (e) { l.push("localStorage: NO ACCESIBLE " + e.message); }
    try {
      if (navigator.locks && navigator.locks.query) {
        var q = await navigator.locks.query();
        l.push("candados: retenidos " + q.held.map(function (x) { return x.name; }).join(",") + " | esperando " + q.pending.map(function (x) { return x.name; }).join(","));
      } else l.push("candados: sin navigator.locks");
    } catch (e) { l.push("candados: error " + e.message); }
    try {
      if (typeof sb !== "undefined" && sb) {
        var r = await Promise.race([sb.auth.getSession(), new Promise(function (ok) { setTimeout(function () { ok("TIEMPO AGOTADO"); }, 4000); })]);
        if (r === "TIEMPO AGOTADO") l.push("getSession: SE QUEDA COLGADO (>4 s)");
        else l.push("getSession: " + (r.error ? "error " + r.error.message : r.data.session ? "sesión de " + r.data.session.user.email : "sin sesión"));
      } else l.push("Supabase: no cargado");
    } catch (e) { l.push("getSession: excepción " + e.message); }
    try { l.push("ctx: uid " + (ctx.uid ? ctx.uid.slice(0, 8) : "-") + " rol " + ctx.rol + " online " + ctx.online); } catch (e) {}
    pintar(l.join("\n"));
  }
  var suscrito = false;
  function vigilar() {
    if (!suscrito && typeof sb !== "undefined" && sb) {
      suscrito = true;
      sb.auth.onAuthStateChange(function (ev, s) { add("EVENTO " + ev + (s ? " " + s.user.email : " sin sesión")); });
    }
    revisar();
  }
  window.addEventListener("load", function () { vigilar(); setInterval(vigilar, 3000); });
})();
