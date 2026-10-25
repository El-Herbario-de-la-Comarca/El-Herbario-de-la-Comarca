#!/usr/bin/env python3
"""Genera una pagina pequena por ficha (f/<id>.html) para que WhatsApp, Telegram y demas
muestren una tarjeta con el nombre, la marca y la foto al compartir un enlace.

Lee las fichas de Supabase (con la clave publica de config.js) y, si no puede, de
datos-iniciales.js. Quien abre el enlace va al momento a la ficha normal de la web.
Lo ejecuta cada dia la tarea .github/workflows/tarjetas.yml; tambien se puede lanzar a mano:
    python3 herramientas/generar_tarjetas.py
La direccion publica de la web se toma de SITE_URL o, si no, de BASE por defecto.
"""
import html, json, os, re, sys, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BASE = os.environ.get("SITE_URL", "https://el-herbario-de-la-comarca.github.io/El-Herbario-de-la-Comarca/").rstrip("/") + "/"
SALIDA = RAIZ / "f"


def config():
    txt = (RAIZ / "config.js").read_text(encoding="utf-8")
    url = re.search(r'supabaseUrl:\s*"([^"]*)"', txt)
    key = re.search(r'supabaseAnonKey:\s*"([^"]*)"', txt)
    return (url.group(1) if url else ""), (key.group(1) if key else "")


def desde_supabase():
    url, key = config()
    if not url or not key:
        raise RuntimeError("config.js sin Supabase")
    filas, desde = [], 0
    while True:
        req = urllib.request.Request(
            f"{url}/rest/v1/tabacos?select=id,nombre,marca,tipo,corte,pais,descripcion,foto&order=id",
            headers={"apikey": key, "Authorization": f"Bearer {key}", "Range": f"{desde}-{desde + 999}"})
        with urllib.request.urlopen(req, timeout=30) as r:
            lote = json.loads(r.read().decode("utf-8"))
        filas += lote
        if len(lote) < 1000:
            return filas
        desde += 1000


def desde_respaldo():
    txt = (RAIZ / "datos-iniciales.js").read_text(encoding="utf-8")
    return json.loads(txt.split("window.DATOS_INICIALES = ", 1)[1].strip().rstrip(";"))


def recorta(t, n):
    t = " ".join(str(t or "").split())
    return t if len(t) <= n else t[: n - 1].rsplit(" ", 1)[0] + "…"


def imagen(foto):
    foto = str(foto or "")
    if foto.startswith("https://"):
        return foto
    if foto.startswith("img/"):
        return BASE + foto
    return BASE + "img/icono-512.png"


def pagina(d):
    ident = str(d["id"])
    titulo = f'{d.get("nombre", "")} · {d.get("marca", "")}'.strip(" ·")
    partes = [p for p in (d.get("tipo"), d.get("corte"), d.get("pais")) if p]
    desc = recorta(" · ".join(partes) + (". " if partes else "") + str(d.get("descripcion") or ""), 200)
    destino = f"../index.html#/ficha/{ident}"
    e = lambda s: html.escape(str(s), quote=True)
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>{e(titulo)} · El herbario de la Comarca</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{e(desc)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="El herbario de la Comarca">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{e(imagen(d.get("foto")))}">
<meta property="og:url" content="{e(BASE + "f/" + ident + ".html")}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#3E5A2B">
<link rel="icon" href="../img/logo.png">
<meta http-equiv="refresh" content="0; url={e(destino)}">
<script>location.replace({json.dumps(destino)});</script>
</head><body><p><a href="{e(destino)}">Ver {e(titulo)} en El herbario de la Comarca</a></p></body></html>
"""


def main():
    try:
        fichas = desde_supabase()
        origen = "Supabase"
    except Exception as ex:  # sin conexion o sin configurar: copia de respaldo
        print(f"No se ha podido leer Supabase ({ex}); uso datos-iniciales.js", file=sys.stderr)
        fichas, origen = desde_respaldo(), "datos-iniciales.js"
    SALIDA.mkdir(exist_ok=True)
    ids, escritas = [], set()
    for d in fichas:
        ident = str(d.get("id", ""))
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", ident) or not d.get("nombre"):
            continue
        nombre = f"{ident}.html"
        contenido = pagina(d)
        ruta = SALIDA / nombre
        if not ruta.exists() or ruta.read_text(encoding="utf-8") != contenido:
            ruta.write_text(contenido, encoding="utf-8")
        escritas.add(nombre)
        ids.append(ident)
    for viejo in SALIDA.glob("*.html"):   # fichas borradas
        if viejo.name not in escritas:
            viejo.unlink()
    (SALIDA / "lista.json").write_text(json.dumps(sorted(ids)), encoding="utf-8")
    print(f"{len(ids)} tarjetas generadas desde {origen}")


if __name__ == "__main__":
    main()
