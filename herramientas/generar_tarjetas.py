#!/usr/bin/env python3
"""Genera una pagina propia por ficha (f/<id>.html), las paginas de marca (marca/<marca>.html)
y de tipo de mezcla (mezcla/<tipo>.html) con sus indices, el sitemap.xml y el robots.txt.

Cada pagina f/<id>.html sirve para dos cosas:
  - Que WhatsApp, Telegram y demas muestren una tarjeta con el nombre, la marca y la foto.
  - Que Google pueda leer e indexar cada ficha por separado (el catalogo normal va tras la
    almohadilla, #/ficha/<id>, y eso Google no lo indexa como paginas distintas).
La pagina muestra los datos de la ficha y un boton para abrirla en el catalogo completo
(resenas, Mi bodega...). Lleva el mismo aviso de mayoria de edad que la portada.

Las paginas de marca y de mezcla llevan un texto de presentacion, un resumen automatico y la
lista de sus tabacos. El texto sale de la tabla textos_seccion de Supabase (lo edita el
administrador desde la web) y, si alli no hay nada, de secciones/textos.json.

Lee las fichas de Supabase (con la clave publica de config.js) y, si no puede, de
datos-iniciales.js. Lo ejecuta cada dia la tarea .github/workflows/tarjetas.yml; tambien
se puede lanzar a mano:
    python3 herramientas/generar_tarjetas.py
La direccion publica de la web se toma de SITE_URL o, si no, de BASE por defecto.
"""
import html, json, os, re, sys, unicodedata, urllib.request
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BASE = os.environ.get("SITE_URL", "https://elherbariodelacomarca.es/").rstrip("/") + "/"
SALIDA = RAIZ / "f"
CARPETA_MARCA = RAIZ / "marca"
CARPETA_MEZCLA = RAIZ / "mezcla"


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


def textos_supabase():
    url, key = config()
    if not url or not key:
        return []
    req = urllib.request.Request(f"{url}/rest/v1/textos_seccion?select=tipo,clave,texto",
                                 headers={"apikey": key, "Authorization": f"Bearer {key}"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def leer_textos():
    """{"marca": {clave: texto}, "mezcla": {...}}: primero secciones/textos.json y encima lo de Supabase."""
    textos = {"marca": {}, "mezcla": {}}
    try:
        base = json.loads((RAIZ / "secciones" / "textos.json").read_text(encoding="utf-8"))
        for tipo in textos:
            textos[tipo].update({k: v for k, v in (base.get(tipo) or {}).items() if str(v).strip()})
    except Exception as ex:
        print(f"No se ha podido leer secciones/textos.json ({ex})", file=sys.stderr)
    try:
        for f in textos_supabase():
            if f.get("tipo") in textos and str(f.get("texto") or "").strip():
                textos[f["tipo"]][f["clave"]] = f["texto"]
    except Exception as ex:   # la tabla aun no existe (falta el SQL 42) o no hay conexion
        print(f"Sin textos de Supabase ({ex})", file=sys.stderr)
    return textos


def slug(s):
    """Igual que slug() de app.js: sin acentos, minusculas y guiones."""
    s = str(s or "").replace("ø", "o").replace("Ø", "O").replace("æ", "ae").replace("Æ", "AE").replace("ß", "ss")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


# Tipos de mezcla: el nombre de la ficha y como se llama su pagina.
MEZCLAS = {
    "Inglesa": "Mezclas inglesas", "Balcánica": "Mezclas balcánicas", "Oriental": "Mezclas orientales",
    "Virginia": "Mezclas de Virginia", "Virginia-Perique": "Mezclas de Virginia y Perique",
    "Burley": "Mezclas de Burley", "Lakeland": "Mezclas Lakeland", "Aromática": "Mezclas aromáticas",
    "Sin mezclar": "Tabacos sin mezclar",
}


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
.migas{font-size:.88rem;color:var(--muted);margin:0 0 14px}
.migas ol{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px}
.migas li+li::before{content:"›";margin-right:4px}
.migas a{color:inherit}
dd a{color:inherit}
.texto p{margin:0 0 12px}
.resumen{color:var(--muted);margin:0 0 18px}
h1+.resumen{margin-top:-8px}
.grupo h2{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.grupo h2 small{font:400 .85rem/1.2 var(--body);color:var(--muted)}
ul.tabacos{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}
ul.tabacos a{display:block;height:100%;border:1px solid var(--line);border-radius:6px;padding:8px 12px;text-decoration:none;background:var(--surface);color:var(--fg)}
ul.tabacos a:hover{border-color:var(--accent)}
ul.tabacos small{display:block;color:var(--muted);font-size:.82rem}
.mas-link{margin:12px 0 0}
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


e = lambda s: html.escape(str(s), quote=True)
PIE = """<footer>El herbario de la Comarca · catálogo informativo de tabaco de pipa, solo para mayores de 18 años. ·
<a href="../marca/">Marcas</a> · <a href="../mezcla/">Tipos de mezcla</a> ·
<a href="../aviso-legal.html">Aviso legal</a> · <a href="../privacidad.html">Privacidad</a></footer>"""


def url_marca(marca):
    return f"marca/{slug(marca)}.html"


def url_mezcla(tipo):
    return f"mezcla/{slug(tipo)}.html"


def parrafos(texto):
    return "".join(f"<p>{e(p.strip())}</p>".replace("\n", "<br>")
                   for p in re.split(r"\n\s*\n", str(texto or "")) if p.strip())


def marco(titulo, desc, ruta, cuerpo, migas, imagen_og=None, tipo_og="website"):
    """Pagina completa. ruta: direccion relativa a BASE (f/1.html, marca/, ...). migas: [(nombre, ruta o None)]."""
    url = BASE + ruta
    nav = "".join(f'<li><a href="../{e(r)}">{e(n)}</a></li>' if r is not None else f'<li aria-current="page">{e(n)}</li>'
                  for n, r in migas)
    ld = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, **({"item": BASE + r} if r is not None else {})}
        for i, (n, r) in enumerate(migas)]}, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>{e(titulo)} · El herbario de la Comarca</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{e(url)}">
<meta property="og:type" content="{tipo_og}">
<meta property="og:site_name" content="El herbario de la Comarca">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{e(imagen_og or BASE + "img/icono-512.png")}">
<meta property="og:url" content="{e(url)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#3E5A2B">
<link rel="icon" href="../img/logo.png">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Uncial+Antiqua&family=Instrument+Sans:wght@400;500;600&display=swap">
<style>{ESTILO}</style>
<script type="application/ld+json">{ld}</script>
</head><body>
{AVISO}
<div class="wrap">
<a class="top" href="../index.html"><img src="../img/logo.png" alt="" width="64" height="64"><span><b>El herbario de la Comarca</b><small>Pipa Club Fumadas Hobbit · Catálogo de hierba de pipa</small></span></a>
<svg class="hills" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path class="a" d="M0 30 C200 10 380 6 600 22 C820 38 1000 8 1200 18 V60 H0Z"/><path class="b" d="M0 46 C240 28 420 40 640 36 C860 32 1020 22 1200 38 V60 H0Z"/></svg>
<nav class="migas" aria-label="Estás en"><ol>{nav}</ol></nav>
{cuerpo}
{PIE}
</div>
</body></html>
"""


def pagina(d, otras):
    ident = str(d["id"])
    marca, tipo = d.get("marca", ""), d.get("tipo") or ""
    titulo = f'{d.get("nombre", "")} · {marca}'.strip(" ·")
    partes = [p for p in (tipo, d.get("corte"), d.get("pais")) if p]
    texto = str(d.get("descripcion") or d.get("desc") or "")
    desc = recorta(" · ".join(partes) + (". " if partes else "") + texto, 200)
    destino = f"../index.html#/ficha/{ident}"
    foto = str(d.get("foto") or "")
    hojas, notas = lista(d.get("hojas")), lista(d.get("notas"))

    mezcla = f'<a href="../{e(url_mezcla(tipo))}">{e(tipo)}</a>' if tipo in MEZCLAS else e(tipo)
    casillas = [("Mezcla", mezcla), ("Corte", e(d.get("corte") or "")), ("País", e(d.get("pais") or "")),
                ("Formato", e(d.get("formato") or "")), ("Hojas", e(", ".join(hojas))), ("Notas de sabor", e(", ".join(notas)))]
    dl = "".join(f"<div><dt>{e(k)}</dt><dd>{v}</dd></div>" for k, v in casillas if v)
    img = (f'<img class="foto" src="{e(imagen(foto))}" alt="{e(titulo)}" loading="lazy">'
           if foto.startswith(("https://", "img/")) else "")
    es = ' <span class="es" role="img" aria-label="España" title="España">E</span>' if d.get("en_espana") is True else ""
    parrafo = f'<p class="desc">{e(texto)}</p>' if texto else ""
    mas = ""
    if otras:
        enlaces = "".join(f'<li><a href="{e(o["id"])}.html">{e(o["nombre"])}</a></li>' for o in otras)
        mas = (f'<h2>Más de {e(marca)}</h2><ul class="otras">{enlaces}</ul>'
               f'<p class="mas-link"><a href="../{e(url_marca(marca))}">Todo sobre {e(marca)}</a></p>')
    cuerpo = f"""<main class="ficha">
<p class="marca"><a href="../{e(url_marca(marca))}" style="color:inherit;text-decoration:none">{e(marca)}</a></p>
<h1>{e(d.get("nombre", ""))}{es}</h1>
{img}<dl>{dl}</dl>
{parrafo}
<a class="abrir" href="{e(destino)}">Abrir en el catálogo: reseñas y Mi bodega</a>
</main>
{mas}"""
    migas = [("Inicio", "")] + ([(marca, url_marca(marca))] if marca else []) + [(d.get("nombre", ""), None)]
    return marco(titulo, desc, f"f/{ident}.html", cuerpo, migas, imagen(foto), "article")


def item_tabaco(d, con_marca=False):
    meta = [x for x in ((d.get("marca") if con_marca else None), d.get("corte")) if x]
    es = ' <span class="es" role="img" aria-label="España" title="España">E</span>' if d.get("en_espana") is True else ""
    return (f'<li><a href="../f/{e(d["id"])}.html">{e(d["nombre"])}{es}'
            + (f'<small>{e(" · ".join(meta))}</small>' if meta else "") + "</a></li>")


def cuenta(n, uno, varios):
    return f"{n} {uno if n == 1 else varios}"


def lista_natural(xs):
    xs = list(xs)
    return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " y " + xs[-1]


def pagina_marca(marca, fichas, texto):
    paises = [p for p, _ in Counter(d.get("pais") for d in fichas if d.get("pais")).most_common(3)]
    tipos = Counter(d.get("tipo") or "" for d in fichas)
    en_es = sum(1 for d in fichas if d.get("en_espana") is True)
    trozos = [cuenta(len(fichas), "mezcla en el catálogo", "mezclas en el catálogo")]
    if paises:
        trozos.append(lista_natural(paises))
    principales = [t for t, _ in tipos.most_common() if t][:3]
    if principales and len(fichas) > 1:
        nombres = [MEZCLAS[t][0].lower() + MEZCLAS[t][1:] if t in MEZCLAS else t for t in principales]
        nombres = nombres[:1] + [n[len("mezclas "):] if n.startswith("Mezclas ") or n.startswith("mezclas ") else n
                                 for n in nombres[1:]]
        trozos.append(("sobre todo " if len([t for t in tipos if t]) > 1 else "todas ") + lista_natural(nombres))
    if en_es:
        trozos.append(cuenta(en_es, "se encuentra en España", "se encuentran en España"))
    resumen = " · ".join(trozos)

    grupos = ""
    for tipo, n in sorted(tipos.items(), key=lambda kv: (-kv[1], kv[0] or "~")):
        del_tipo = sorted((d for d in fichas if (d.get("tipo") or "") == tipo), key=lambda d: d["nombre"].lower())
        nombre = tipo or "Sin clasificar"
        cab = f'<a href="../{e(url_mezcla(tipo))}">{e(nombre)}</a>' if tipo in MEZCLAS else e(nombre)
        grupos += (f'<section class="grupo"><h2>{cab}<small>{cuenta(n, "mezcla", "mezclas")}</small></h2>'
                   f'<ul class="tabacos">{"".join(item_tabaco(d) for d in del_tipo)}</ul></section>\n')

    nombres = ", ".join(d["nombre"] for d in sorted(fichas, key=lambda d: d["nombre"].lower())[:6])
    desc = recorta(texto, 200) if texto.strip() else recorta(
        f"Tabaco de pipa de {marca}: {resumen}. Entre ellas, {nombres}.", 200)
    cuerpo = f"""<main class="ficha">
<p class="marca">Marca</p>
<h1>{e(marca)}</h1>
<p class="resumen">{e(resumen)}</p>
<div class="texto">{parrafos(texto)}</div>
<a class="abrir" href="../index.html">Ver el catálogo completo</a>
</main>
{grupos}"""
    return marco(f"{marca} · tabaco de pipa", desc, url_marca(marca), cuerpo,
                 [("Inicio", ""), ("Marcas", "marca/"), (marca, None)])


def pagina_mezcla(tipo, fichas, texto):
    titulo = MEZCLAS[tipo]
    marcas = Counter(d.get("marca", "") for d in fichas)
    en_es = sum(1 for d in fichas if d.get("en_espana") is True)
    resumen = " · ".join([cuenta(len(fichas), "tabaco en el catálogo", "tabacos en el catálogo"),
                          cuenta(len(marcas), "marca", "marcas")]
                         + ([cuenta(en_es, "se encuentra en España", "se encuentran en España")] if en_es else []))
    grupos = ""
    for marca in sorted(marcas, key=str.lower):
        de_marca = sorted((d for d in fichas if d.get("marca", "") == marca), key=lambda d: d["nombre"].lower())
        grupos += (f'<section class="grupo"><h2><a href="../{e(url_marca(marca))}">{e(marca)}</a>'
                   f'<small>{cuenta(len(de_marca), "mezcla", "mezclas")}</small></h2>'
                   f'<ul class="tabacos">{"".join(item_tabaco(d) for d in de_marca)}</ul></section>\n')
    desc = recorta(texto, 200) if texto.strip() else recorta(f"{titulo} de tabaco de pipa: {resumen}.", 200)
    cuerpo = f"""<main class="ficha">
<p class="marca">Tipo de mezcla</p>
<h1>{e(titulo)}</h1>
<p class="resumen">{e(resumen)}</p>
<div class="texto">{parrafos(texto)}</div>
<a class="abrir" href="../index.html">Ver el catálogo completo</a>
</main>
{grupos}"""
    return marco(f"{titulo} · tabaco de pipa", desc, url_mezcla(tipo), cuerpo,
                 [("Inicio", ""), ("Tipos de mezcla", "mezcla/"), (titulo, None)])


def indice_marcas(por_marca):
    filas = "".join(
        f'<li><a href="{e(slug(m))}.html">{e(m)}<small>{cuenta(len(fs), "mezcla", "mezclas")}'
        + (f' · {e(Counter(d.get("pais") for d in fs if d.get("pais")).most_common(1)[0][0])}'
           if any(d.get("pais") for d in fs) else "") + "</small></a></li>"
        for m, fs in sorted(por_marca.items(), key=lambda kv: kv[0].lower()))
    total = sum(len(fs) for fs in por_marca.values())
    cuerpo = f"""<main class="ficha">
<h1>Marcas de tabaco de pipa</h1>
<p class="resumen">{cuenta(len(por_marca), "marca", "marcas")} · {cuenta(total, "tabaco", "tabacos")} en el catálogo</p>
<ul class="tabacos">{filas}</ul>
</main>"""
    return marco("Marcas de tabaco de pipa", f"Las {len(por_marca)} marcas de tabaco de pipa del catálogo del herbario, "
                 "con todas sus mezclas.", "marca/", cuerpo, [("Inicio", ""), ("Marcas", None)])


def indice_mezclas(por_tipo, textos):
    filas = ""
    for tipo in MEZCLAS:
        fs = por_tipo.get(tipo)
        if not fs:
            continue
        intro = recorta(re.split(r"\n\s*\n", textos.get(slug(tipo), ""))[0], 230)
        filas += (f'<section class="grupo"><h2><a href="{e(slug(tipo))}.html">{e(MEZCLAS[tipo])}</a>'
                  f'<small>{cuenta(len(fs), "tabaco", "tabacos")}</small></h2>'
                  + (f"<p>{e(intro)}</p>" if intro else "") + "</section>\n")
    cuerpo = f"""<main class="ficha">
<h1>Tipos de mezcla</h1>
<p class="resumen">Cómo se clasifican los tabacos del herbario según las hojas que llevan.</p>
</main>
{filas}"""
    return marco("Tipos de mezcla de tabaco de pipa", "Mezclas inglesas, balcánicas, de Virginia, Virginia y Perique, "
                 "Burley, Lakeland, aromáticas y más: qué es cada tipo y qué tabacos hay de cada uno.",
                 "mezcla/", cuerpo, [("Inicio", ""), ("Tipos de mezcla", None)])


def sitemap(rutas):
    filas = "".join(f"<url><loc>{html.escape(BASE + r)}</loc></url>\n" for r in rutas)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + filas + "</urlset>\n")


def escribir(ruta, contenido):
    if not ruta.exists() or ruta.read_text(encoding="utf-8") != contenido:
        ruta.write_text(contenido, encoding="utf-8")


def volcar(carpeta, paginas):
    """Escribe {nombre: html} en la carpeta y borra las paginas que ya no existen."""
    carpeta.mkdir(exist_ok=True)
    for nombre, contenido in paginas.items():
        escribir(carpeta / nombre, contenido)
    for viejo in carpeta.glob("*.html"):
        if viejo.name not in paginas:
            viejo.unlink()


def main():
    try:
        fichas = desde_supabase()
        origen = "Supabase"
    except Exception as ex:  # sin conexion o sin configurar: copia de respaldo
        print(f"No se ha podido leer Supabase ({ex}); uso datos-iniciales.js", file=sys.stderr)
        fichas, origen = desde_respaldo(), "datos-iniciales.js"
    validas = [d for d in fichas
               if re.fullmatch(r"[A-Za-z0-9_-]{1,40}", str(d.get("id", ""))) and d.get("nombre")]
    por_marca, por_tipo = {}, {}
    for d in validas:
        d["id"] = str(d["id"])
        por_marca.setdefault(d.get("marca", ""), []).append(d)
        if d.get("tipo") in MEZCLAS:
            por_tipo.setdefault(d["tipo"], []).append(d)
    por_marca.pop("", None)
    textos = leer_textos()

    # Fichas
    paginas, ids = {}, []
    for d in validas:
        grupo = sorted(por_marca.get(d.get("marca", ""), []), key=lambda o: o["nombre"].lower())
        otras = [o for o in grupo if o["id"] != d["id"]]
        paginas[f'{d["id"]}.html'] = pagina(d, otras)
        ids.append(d["id"])
    volcar(SALIDA, paginas)
    ids.sort(key=lambda i: (len(i), i))
    (SALIDA / "lista.json").write_text(json.dumps(sorted(ids)), encoding="utf-8")

    # Marcas y tipos de mezcla (dos marcas que den el mismo nombre de pagina: se queda la primera)
    marcas = {}
    for marca, fs in sorted(por_marca.items(), key=lambda kv: kv[0].lower()):
        clave = slug(marca)
        if clave and f"{clave}.html" not in marcas:
            marcas[f"{clave}.html"] = pagina_marca(marca, fs, textos["marca"].get(clave, ""))
    marcas["index.html"] = indice_marcas(por_marca)
    volcar(CARPETA_MARCA, marcas)
    mezclas = {f"{slug(t)}.html": pagina_mezcla(t, fs, textos["mezcla"].get(slug(t), "")) for t, fs in por_tipo.items()}
    mezclas["index.html"] = indice_mezclas(por_tipo, textos["mezcla"])
    volcar(CARPETA_MEZCLA, mezclas)

    rutas = ([""] + ["marca/", "mezcla/"]
             + [f"marca/{n}" for n in sorted(marcas) if n != "index.html"]
             + [f"mezcla/{n}" for n in sorted(mezclas) if n != "index.html"]
             + [f"f/{i}.html" for i in ids])
    (RAIZ / "sitemap.xml").write_text(sitemap(rutas), encoding="utf-8")
    (RAIZ / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n", encoding="utf-8")
    con_texto = sum(1 for m in por_marca if textos["marca"].get(slug(m)))
    print(f"{len(ids)} fichas, {len(marcas) - 1} marcas ({con_texto} con texto) y {len(mezclas) - 1} tipos de mezcla "
          f"generados desde {origen}; sitemap.xml con {len(rutas)} direcciones")


if __name__ == "__main__":
    main()
