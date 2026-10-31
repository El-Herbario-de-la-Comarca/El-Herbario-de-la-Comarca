#!/usr/bin/env python3
"""Genera una pagina propia por ficha (f/<id>.html), el sitemap.xml y el robots.txt.

Cada pagina f/<id>.html sirve para dos cosas:
  - Que WhatsApp, Telegram y demas muestren una tarjeta con el nombre, la marca y la foto.
  - Que Google pueda leer e indexar cada ficha por separado (el catalogo normal va tras la
    almohadilla, #/ficha/<id>, y eso Google no lo indexa como paginas distintas).
La pagina muestra los datos de la ficha y un boton para abrirla en el catalogo completo
(resenas, Mi bodega...). Lleva el mismo aviso de mayoria de edad que la portada.

Lee las fichas de Supabase (con la clave publica de config.js) y, si no puede, de
datos-iniciales.js. Lo ejecuta cada dia la tarea .github/workflows/tarjetas.yml; tambien
se puede lanzar a mano:
    python3 herramientas/generar_tarjetas.py
La direccion publica de la web se toma de SITE_URL o, si no, de BASE por defecto.
"""
import html, json, os, re, sys, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BASE = os.environ.get("SITE_URL", "https://elherbariodelacomarca.es/").rstrip("/") + "/"
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
            f"{url}/rest/v1/tabacos?select=id,nombre,marca,tipo,corte,pais,formato,descripcion,notas,hojas,en_espana,foto&order=id",
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


ESTILO = """
:root{--bg:#E9ECE6;--surface:#F5F6F2;--fg:#1D2320;--muted:#5B655F;--line:#CBD1C8;--accent:#3E5A2B;--accent-fg:#F5F6F2;--hill-a:#B9C9A6;--hill-b:#8FAE74;
--display:"Young Serif",Georgia,serif;--body:"Instrument Sans",system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme:dark){:root{--bg:#121614;--surface:#1A201D;--fg:#E6EAE3;--muted:#9AA59D;--line:#2B342F;--accent:#9DC27A;--accent-fg:#121614;--hill-a:#24352A;--hill-b:#2F4A31;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 var(--body)}
a{color:var(--accent)}
.wrap{max-width:760px;margin:0 auto;padding:0 16px 48px}
.top{display:flex;align-items:center;gap:14px;padding:20px 0 8px;text-decoration:none;color:inherit}
.top img{width:64px;height:64px}
.top b{font:400 1.35rem/1.1 "Uncial Antiqua",var(--display);display:block}
.top small{color:var(--muted)}
.hills{display:block;width:100%;height:48px;margin-bottom:20px}
.hills .a{fill:var(--hill-a)}.hills .b{fill:var(--hill-b)}
.ficha{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:24px}
.marca{color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-size:.82rem;margin:0}
h1{font:400 2rem/1.15 var(--display);margin:4px 0 16px}
.es{display:inline-grid;place-items:center;width:1.15em;height:1.15em;margin-left:.3em;vertical-align:.12em;border-radius:50%;
font:700 .55em/1 system-ui,sans-serif;color:#AA151B;background:linear-gradient(#AA151B 0 25%,#F1BF00 25% 75%,#AA151B 75%);box-shadow:0 0 0 1px rgba(0,0,0,.18)}
.foto{display:block;max-width:100%;max-height:340px;margin:0 auto 18px;border-radius:6px}
dl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:0 0 18px}
dl div{border:1px solid var(--line);border-radius:6px;padding:8px 10px}
dt{font-size:.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
dd{margin:2px 0 0;font-weight:500}
.desc{margin:0 0 18px}
.abrir{display:inline-block;background:var(--accent);color:var(--accent-fg);text-decoration:none;font-weight:600;border-radius:4px;padding:11px 18px}
h2{font:400 1.25rem/1.2 var(--display);margin:32px 0 10px}
ul.otras{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px}
ul.otras a{display:block;border:1px solid var(--line);border-radius:999px;padding:4px 12px;text-decoration:none;background:var(--surface)}
footer{margin-top:36px;color:var(--muted);font-size:.88rem}
.gate{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:var(--bg)}
.gate .box{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:28px;max-width:440px;display:grid;gap:14px}
.gate h2{margin:0;font-size:1.6rem}.gate p{margin:0;color:var(--muted)}
.gate .acts{display:flex;gap:10px;flex-wrap:wrap}
.gate button{font:inherit;font-weight:500;border-radius:4px;padding:10px 16px;min-height:44px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--fg)}
.gate button.yes{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
"""

AVISO = """<div class="gate" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
<div class="box"><h2 id="gate-title">Solo para mayores de 18</h2>
<p id="gate-text">El herbario de la Comarca es un catálogo informativo sobre tabaco de pipa. Confirma que eres mayor de edad para entrar.</p>
<div class="acts" id="gate-acts"><button class="yes" id="gate-yes" type="button">Tengo 18 años o más</button><button id="gate-no" type="button">Salir</button></div></div></div>
<script>(function(){var g=document.getElementById("gate");function c(){g.style.display="none"}
try{if(localStorage.getItem("cazoleta-18")==="1")c()}catch(e){}
document.getElementById("gate-yes").onclick=function(){c();try{localStorage.setItem("cazoleta-18","1")}catch(e){}};
document.getElementById("gate-no").onclick=function(){document.getElementById("gate-title").textContent="Gracias por tu visita";
document.getElementById("gate-text").textContent="Esta página solo está disponible para mayores de 18 años.";document.getElementById("gate-acts").hidden=true}})();</script>"""


def lista(v):
    if isinstance(v, list):
        return [str(x) for x in v if str(x).strip()]
    return [s.strip() for s in str(v or "").split(",") if s.strip()]


def pagina(d, otras):
    ident = str(d["id"])
    e = lambda s: html.escape(str(s), quote=True)
    titulo = f'{d.get("nombre", "")} · {d.get("marca", "")}'.strip(" ·")
    partes = [p for p in (d.get("tipo"), d.get("corte"), d.get("pais")) if p]
    texto = str(d.get("descripcion") or d.get("desc") or "")
    desc = recorta(" · ".join(partes) + (". " if partes else "") + texto, 200)
    url = BASE + "f/" + ident + ".html"
    destino = f"../index.html#/ficha/{ident}"
    foto = str(d.get("foto") or "")
    hojas, notas = lista(d.get("hojas")), lista(d.get("notas"))

    casillas = [("Mezcla", d.get("tipo")), ("Corte", d.get("corte")), ("País", d.get("pais")),
                ("Formato", d.get("formato")), ("Hojas", ", ".join(hojas)), ("Notas de sabor", ", ".join(notas))]
    dl = "".join(f"<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>" for k, v in casillas if v)
    img = (f'<img class="foto" src="{e(imagen(foto))}" alt="{e(titulo)}" loading="lazy">'
           if foto.startswith(("https://", "img/")) else "")
    es = ' <span class="es" role="img" aria-label="España" title="España">E</span>' if d.get("en_espana") is True else ""
    parrafo = f'<p class="desc">{e(texto)}</p>' if texto else ""
    mas = ""
    if otras:
        enlaces = "".join(f'<li><a href="{e(o["id"])}.html">{e(o["nombre"])}</a></li>' for o in otras)
        mas = f'<h2>Más de {e(d.get("marca", ""))}</h2><ul class="otras">{enlaces}</ul>'

    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>{e(titulo)} · El herbario de la Comarca</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{e(url)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="El herbario de la Comarca">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{e(imagen(foto))}">
<meta property="og:url" content="{e(url)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#3E5A2B">
<link rel="icon" href="../img/logo.png">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Uncial+Antiqua&family=Instrument+Sans:wght@400;500;600&display=swap">
<style>{ESTILO}</style>
</head><body>
{AVISO}
<div class="wrap">
<a class="top" href="../index.html"><img src="../img/logo.png" alt="" width="64" height="64"><span><b>El herbario de la Comarca</b><small>Pipa Club Fumadas Hobbit · Catálogo de hierba de pipa</small></span></a>
<svg class="hills" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path class="a" d="M0 30 C200 10 380 6 600 22 C820 38 1000 8 1200 18 V60 H0Z"/><path class="b" d="M0 46 C240 28 420 40 640 36 C860 32 1020 22 1200 38 V60 H0Z"/></svg>
<main class="ficha">
<p class="marca">{e(d.get("marca", ""))}</p>
<h1>{e(d.get("nombre", ""))}{es}</h1>
{img}<dl>{dl}</dl>
{parrafo}
<a class="abrir" href="{e(destino)}">Abrir en el catálogo: reseñas y Mi bodega</a>
</main>
{mas}
<footer>El herbario de la Comarca · catálogo informativo de tabaco de pipa, solo para mayores de 18 años. ·
<a href="../aviso-legal.html">Aviso legal</a> · <a href="../privacidad.html">Privacidad</a></footer>
</div>
</body></html>
"""


def sitemap(ids):
    urls = [BASE] + [f"{BASE}f/{i}.html" for i in ids]
    filas = "".join(f"<url><loc>{html.escape(u)}</loc></url>\n" for u in urls)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + filas + "</urlset>\n")


def main():
    try:
        fichas = desde_supabase()
        origen = "Supabase"
    except Exception as ex:  # sin conexion o sin configurar: copia de respaldo
        print(f"No se ha podido leer Supabase ({ex}); uso datos-iniciales.js", file=sys.stderr)
        fichas, origen = desde_respaldo(), "datos-iniciales.js"
    validas = [d for d in fichas
               if re.fullmatch(r"[A-Za-z0-9_-]{1,40}", str(d.get("id", ""))) and d.get("nombre")]
    por_marca = {}
    for d in validas:
        por_marca.setdefault(d.get("marca", ""), []).append({"id": str(d["id"]), "nombre": d["nombre"]})
    for grupo in por_marca.values():
        grupo.sort(key=lambda o: o["nombre"].lower())

    SALIDA.mkdir(exist_ok=True)
    ids, escritas = [], set()
    for d in validas:
        ident = str(d["id"])
        otras = [o for o in por_marca.get(d.get("marca", ""), []) if o["id"] != ident]
        nombre = f"{ident}.html"
        contenido = pagina(d, otras)
        ruta = SALIDA / nombre
        if not ruta.exists() or ruta.read_text(encoding="utf-8") != contenido:
            ruta.write_text(contenido, encoding="utf-8")
        escritas.add(nombre)
        ids.append(ident)
    for viejo in SALIDA.glob("*.html"):   # fichas borradas
        if viejo.name not in escritas:
            viejo.unlink()
    ids.sort(key=lambda i: (len(i), i))
    (SALIDA / "lista.json").write_text(json.dumps(sorted(ids)), encoding="utf-8")
    (RAIZ / "sitemap.xml").write_text(sitemap(ids), encoding="utf-8")
    (RAIZ / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n", encoding="utf-8")
    print(f"{len(ids)} fichas generadas desde {origen}; sitemap.xml con {len(ids) + 1} direcciones")


if __name__ == "__main__":
    main()
