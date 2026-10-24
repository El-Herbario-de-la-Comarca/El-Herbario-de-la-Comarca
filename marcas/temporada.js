// Temporada de la cabecera según la fecha: Halloween (15 oct – 1 nov) y Navidad (1 dic – 6 ene).
// Para probar: añade ?temporada=halloween, ?temporada=navidad o ?temporada=ninguna a la dirección.
(function () {
  var d = new Date(), m = d.getMonth() + 1, dia = d.getDate(), t = "";
  if ((m === 10 && dia >= 15) || (m === 11 && dia === 1)) t = "halloween";
  else if (m === 12 || (m === 1 && dia <= 6)) t = "navidad";
  var q = /[?&]temporada=(halloween|navidad|ninguna)\b/.exec(location.search);
  if (q) t = q[1] === "ninguna" ? "" : q[1];
  if (t) document.documentElement.setAttribute("data-temporada", t);
})();
