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



def mini_de(src):
    """Nombre de la miniatura de una foto: «-m.webp» si la grande es WebP y «-m.jpg» si no (como miniDe en app.js)."""
    return re.sub(r"\.(jpe?g|png|webp)$", "-m.webp" if src.lower().endswith(".webp") else "-m.jpg", src, flags=re.I)

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
            f"{url}/rest/v1/tabacos?select=*&order=id",
            headers={"apikey": key, "Authorization": f"Bearer {key}", "Range": f"{desde}-{desde + 999}"})
        with urllib.request.urlopen(req, timeout=30) as r:
            lote = json.loads(r.read().decode("utf-8"))
        filas += lote
        if len(lote) < 1000:
            return filas
        desde += 1000


def _get(ruta, metodo="GET"):
    url, key = config()
    if not url or not key:
        raise RuntimeError("config.js sin Supabase")
    datos = b"{}" if metodo == "POST" else None
    req = urllib.request.Request(f"{url}{ruta}", data=datos, method=metodo, headers={
        "apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def resenas_supabase():
    """Resenas publicas (tabla opiniones), fotos de perfil y socios, como las carga app.js.
    Si algo falla, la ficha sale igual pero sin resenas."""
    opiniones, fotos, socios = {}, {}, set()
    try:
        desde = 0
        while True:
            url, key = config()
            req = urllib.request.Request(f"{url}/rest/v1/opiniones?select=*&order=creado.desc", headers={
                "apikey": key, "Authorization": f"Bearer {key}", "Range": f"{desde}-{desde + 999}"})
            with urllib.request.urlopen(req, timeout=30) as r:
                lote = json.loads(r.read().decode("utf-8"))
            for x in lote:
                opiniones.setdefault(str(x.get("tabaco_id")), []).append(map_opinion(x))
            if len(lote) < 1000:
                break
            desde += 1000
    except Exception as ex:
        print(f"Resenas no disponibles ({ex})", file=sys.stderr)
        return {}, {}, set()
    try:
        for x in _get("/rest/v1/rpc/fotos_resenas", "POST") or []:
            if re.match(r"^(https://|img/)", str(x.get("avatar") or "")):
                fotos[str(x.get("autor"))] = x["avatar"]
    except Exception:
        pass
    try:
        socios = {str(x.get("autor")) for x in (_get("/rest/v1/rpc/socios_resenas", "POST") or [])}
    except Exception:
        pass
    return opiniones, fotos, socios


def textos_supabase():
    url, key = config()
    if not url or not key:
        return []
    req = urllib.request.Request(f"{url}/rest/v1/textos_seccion?select=tipo,clave,texto",
                                 headers={"apikey": key, "Authorization": f"Bearer {key}"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def leer_logos():
    """{clave de la marca: URL del logo} desde la tabla marcas_logo (43_logos_marcas.sql)."""
    url, key = config()
    if not url or not key:
        return {}
    try:
        req = urllib.request.Request(f"{url}/rest/v1/marcas_logo?select=clave,logo",
                                     headers={"apikey": key, "Authorization": f"Bearer {key}"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return {f["clave"]: f["logo"] for f in json.loads(r.read().decode("utf-8"))
                    if str(f.get("logo") or "").startswith("https://")}
    except Exception as ex:   # la tabla aun no existe (falta el SQL 43) o no hay conexion
        print(f"Sin logos de marca ({ex})", file=sys.stderr)
        return {}


LOGOS = {}


def logo_marca(marca, clase="lmarca"):
    """Logo de la marca o, si no tiene, su inicial en un circulo."""
    url = LOGOS.get(slug(marca))
    if url:
        return f'<span class="{clase}"><img src="{e(url)}" alt="" loading="lazy" decoding="async"></span>'
    return f'<span class="{clase} sin" aria-hidden="true">{e(marca.strip()[:1].upper())}</span>'


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
.hero .sitio{margin:0;font-family:"Uncial Antiqua",var(--display);font-weight:400;letter-spacing:.01em;line-height:1.08;text-wrap:balance;color:var(--fg);font-size:clamp(1.9rem,6.6vw,3.4rem)}
@media (max-width:600px){.comarca .hero .sitio{font-size:1.55rem}}
.pag{max-width:900px;margin:0 auto;padding:22px 0 8px}
.pag a{color:var(--accent)}
.migas{font-size:.95rem;color:var(--muted);margin:0 0 14px}
.migas ol{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px}
.migas li+li::before{content:"›";margin-right:4px}
.migas a{color:inherit}
.ficha{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:clamp(18px,4vw,28px);box-shadow:var(--shadow,none)}
.ficha .marca{color:var(--muted);font-size:.95rem;letter-spacing:.06em;margin:0}
.ficha .marca a{color:inherit;text-decoration:none}
.ficha h1{font:400 clamp(1.8rem,5vw,2.4rem)/1.12 var(--display);letter-spacing:0;margin:4px 0 16px;text-wrap:balance}
.es{display:inline-grid;place-items:center;width:1.15em;height:1.15em;margin-left:.3em;vertical-align:.12em;border-radius:50%;
font:700 .55em/1 system-ui,sans-serif;color:#AA151B;background:linear-gradient(#AA151B 0 25%,#F1BF00 25% 75%,#AA151B 75%);box-shadow:0 0 0 1px rgba(0,0,0,.18)}
h1 .es{font-size:.5em}
.foto{display:block;max-width:100%;max-height:340px;margin:0 auto 18px;border-radius:8px}
.ficha dl{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin:0 0 18px}
.ficha dl div{border:1px solid var(--line);border-radius:8px;padding:8px 12px}
.ficha dt{font-size:.88rem;color:var(--muted);margin:0}
.ficha dd{margin:2px 0 0;font-weight:500}
.ficha dd a{color:inherit}
.desc{margin:0 0 18px}
.texto p{margin:0 0 12px}
.resumen{color:var(--muted);margin:-8px 0 18px}
.abrir{display:inline-flex;align-items:center;min-height:44px;background:var(--accent);color:var(--accent-fg)!important;text-decoration:none;font-weight:600;border-radius:6px;padding:10px 18px}
.pag h2{font:400 1.35rem/1.2 var(--display);margin:34px 0 12px}
.grupo h2{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.grupo h2 small{font:400 .9rem/1.2 var(--body);color:var(--muted)}
.grupo p{margin:0}
ul.otras{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px}
ul.otras a{display:block;border:1px solid var(--line);border-radius:999px;padding:4px 14px;text-decoration:none;background:var(--surface);color:var(--fg)}
ul.otras a:hover,ul.tabacos a:hover{border-color:var(--accent)}
ul.tabacos{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}
ul.tabacos a{display:flex;align-items:center;gap:12px;height:100%;border:1px solid var(--line);border-radius:10px;padding:8px 12px 8px 8px;text-decoration:none;background:var(--surface);color:var(--fg)}
ul.tabacos .mini{flex:none;width:56px;height:56px;object-fit:cover;border-radius:6px}
ul.tabacos svg.mini{border-radius:0}
ul.tabacos a>span{min-width:0;overflow-wrap:anywhere}
ul.tabacos small{display:block;color:var(--muted);font-size:.88rem}
.mas-link{margin:12px 0 0}
.cab-marca{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.logo-cab{flex:none;max-width:min(140px,30vw);max-height:90px;object-fit:contain;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px}
ul.tabacos .lmarca{display:grid;place-items:center;background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
ul.tabacos .lmarca img{max-width:48px;max-height:48px;object-fit:contain}
ul.tabacos .lmarca.sin{background:color-mix(in srgb,var(--accent) 12%,var(--surface));border-color:transparent;font:400 1.5rem/1 var(--display);color:var(--accent)}
"""

AVISO = """<div class="gate" id="gate" data-nosnippet role="dialog" aria-modal="true" aria-labelledby="gate-title">
<div class="box"><h2 id="gate-title">Solo para mayores de 18</h2>
<p id="gate-text">El herbario de la Comarca es un catálogo informativo sobre tabaco de pipa. Confirma que eres mayor de edad para entrar.</p>
<div class="acts" id="gate-acts"><button class="yes" id="gate-yes" type="button">Tengo 18 años o más</button><button id="gate-no" type="button">Salir</button></div></div></div>
<script>(function(){var g=document.getElementById("gate");function c(){g.style.display="none"}
try{if(localStorage.getItem("cazoleta-18")==="1")c()}catch(e){}
document.getElementById("gate-yes").onclick=function(){c();try{localStorage.setItem("cazoleta-18","1")}catch(e){}};
document.getElementById("gate-no").onclick=function(){document.getElementById("gate-title").textContent="Gracias por tu visita";
document.getElementById("gate-text").textContent="Esta página solo está disponible para mayores de 18 años.";document.getElementById("gate-acts").hidden=true}})();</script>"""


def de_portada():
    """Saca de index.html las fuentes, las versiones de los estilos y el encabezado de las colinas,
    para que las paginas generadas se vean igual que la web y cambien solas si cambia la portada."""
    txt = (RAIZ / "index.html").read_text(encoding="utf-8")
    fuentes = re.search(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/[^"]*">', txt)
    ver = lambda nombre: (re.search(re.escape(nombre) + r'\?v=(\w+)', txt) or [None, "1"])[1]
    hero = re.search(r'<header class="hero">.*?</header>', txt, re.S).group(0)
    hero = hero.replace('href="./"', 'href="../"').replace('src="img/', 'src="../img/')
    hero = re.sub(r'<h1>(.*?)</h1>', r'<p class="sitio">\1</p>', hero, flags=re.S)   # el h1 de cada pagina es su ficha
    return {"fuentes": fuentes.group(0) if fuentes else "", "hero": hero,
            "estilos": ver("estilos.css"), "tema": ver("tema-comarca.css"), "temporada": ver("temporada.js"),
            "etiquetas": ver("etiquetas.js")}


PORTADA = de_portada()


def lista(v):
    if isinstance(v, list):
        return [str(x) for x in v if str(x).strip()]
    return [s.strip() for s in str(v or "").split(",") if s.strip()]


e = lambda s: html.escape(str(s), quote=True)
PIE = """<footer>
<span><strong>El herbario de la Comarca no vende tabaco</strong> ni incluye enlaces a tiendas. Es un sitio informativo.</span>
<span>Fumar perjudica gravemente la salud. Prohibida la venta a menores de 18 años.</span>
<span class="legal-links"><a href="../marca/">Marcas</a> · <a href="../mezcla/">Tipos de mezcla</a> · <a href="../aviso-legal.html">Aviso legal</a> · <a href="../privacidad.html">Política de privacidad</a></span>
</footer>"""


def url_marca(marca):
    return f"marca/{slug(marca)}.html"


def url_mezcla(tipo):
    return f"mezcla/{slug(tipo)}.html"


def parrafos(texto):
    return "".join(f"<p>{e(p.strip())}</p>".replace("\n", "<br>")
                   for p in re.split(r"\n\s*\n", str(texto or "")) if p.strip())


def marco(titulo, desc, ruta, cuerpo, migas, imagen_og=None, tipo_og="website", ficha=False):
    """Pagina completa. ruta: direccion relativa a BASE (f/1.html, marca/, ...). migas: [(nombre, ruta o None)]."""
    url = BASE + ruta
    nav = "".join(f'<li><a href="../{e(r)}">{e(n)}</a></li>' if r is not None else f'<li aria-current="page">{e(n)}</li>'
                  for n, r in migas)
    ld = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, **({"item": BASE + r} if r is not None else {})}
        for i, (n, r) in enumerate(migas)]}, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!doctype html>
<html lang="es" class="comarca"><head><meta charset="utf-8">
<title>{e(titulo)} · El herbario de la Comarca</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="192x192" href="../img/icono-192.png">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{PORTADA["fuentes"]}
<script src="../temporada.js?v={PORTADA["temporada"]}"></script>
<link rel="stylesheet" href="../estilos.css?v={PORTADA["estilos"]}">
<link rel="stylesheet" href="../tema-comarca.css?v={PORTADA["tema"]}">
<style>{ESTILO_FICHA if ficha else ESTILO}</style>
<script type="application/ld+json">{ld}</script>
</head><body>
{AVISO}
{f'<div class="overlay estatica">{cuerpo}</div><div class="estatica">{PIE}</div>' if ficha else f"""<div class="wrap">
{PORTADA["hero"]}
<div class="pag">
<nav class="migas" aria-label="Estás en"><ol>{nav}</ol></nav>
{cuerpo}
</div>
{PIE}
</div>"""}
</body></html>
"""


# ---------- Ficha: la misma que se abre en el catalogo (openDetail de app.js) ----------
# Se pinta con las mismas clases de estilos.css (panel ficha, franja, nicho, casillas, chips...),
# asi que cualquier cambio de diseno de la ficha en estilos.css se ve tambien aqui.
# Lo que depende de quien mira (Mi bodega, escribir resena, me gusta) se hace en el catalogo:
# los botones llevan a index.html#/ficha/<id>.

CARACT = [
    ("fuerza", "fuerza", "Fuerza", ["", "Muy suave", "Suave", "Suave a media", "Media", "Media a fuerte", "Fuerte", "Muy fuerte"]),
    ("sabor", "sabor", "Intensidad de sabor", ["", "Muy suave", "Suave", "Suave a media", "Media", "Media a intensa", "Intensa", "Muy intensa"]),
    ("aroma", "aromatizante", "Aromatizante", ["", "Ninguno", "Muy ligero", "Ligero", "Medio", "Fuerte", "Muy fuerte"]),
    ("hab", "nota_hab", "Nota de habitación", ["", "Imperceptible", "Desagradable", "Tolerable", "Agradable", "Muy agradable"]),
]
VALORACION = ["", "1 · Malo", "2 · Flojo", "3 · Correcto", "4 · Muy bueno", "5 · Excelente"]
RANGOS = [("Mediano de la Comarca", 1), ("Caminante", 5), ("Montaraz", 15), ("Guardián del Herbario", 30), ("Sabio de la Pipa", 60)]
MIN_MEDIAS = 3
ORDEN_MEDIAS = ["fuerza", "sabor", "hab", "aroma"]
MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"]
HOJAS = ["Virginia", "Burley", "Oriental", "Latakia", "Perique", "Kentucky", "Cavendish", "Cigarro"]
HOJA_CLASE = {h: h.lower() for h in HOJAS}
BODEGA = [("tengo", "Lo tengo"), ("probado", "Lo he probado"), ("quiero", "Quiero probarlo")]
ICO = {
    "mezcla": '<path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9z"/><path d="M12 9v9"/>',
    "corte": '<path d="M4 7h16M4 11h16M4 15h16M4 19h16"/>',
    "origen": '<path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    "formato": '<ellipse cx="12" cy="7" rx="7" ry="2.5"/><path d="M5 7v10c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V7"/>',
    "compartir": '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    "tengo": '<rect x="6" y="7" width="12" height="13" rx="2"/><path d="M8 7V5h8v2"/><path d="M9.5 13.5l2 2 3.5-4"/>',
    "probado": '<path d="M3 14h9a3 3 0 0 0 3-3V8h4v3a7 7 0 0 1-7 7H6a3 3 0 0 1-3-3z"/><path d="M17 5c0-1 1-1.5 1-2.5"/>',
    "quiero": '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    "hoja": '<path d="M12 20C12 13 7 10 4 9c3-2 7 0 8 4 1-4 5-6 8-4-3 1-8 4-8 11z"/>',
    "gusta": '<path d="M12 20.5S3.5 15 3.5 9a5 5 0 0 1 8.5-3.6A5 5 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5z"/>',
    "etiqueta": '<path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8a1.5 1.5 0 0 1 0 2.1l-6.9 6.9a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8.5" cy="8.5" r="1.6"/>',
}
ico = lambda k: f'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">{ICO[k]}</svg>'
FRANJA = """<svg viewBox="0 0 1040 120" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false">
  <path class="fr-a" d="M0 78C120 40 240 36 360 62c110 24 200-8 330-18 130-10 240 16 350 8v68H0z"/>
  <path class="fr-b" d="M0 98c140-28 300-32 430-14 130 18 270-10 410-12 90-1 150 10 200 14v34H0z"/>
  <g class="fr-casa"><path class="fr-m" d="M720 74c40-44 150-48 200 0z"/>
  <circle class="fr-ring" cx="820" cy="84" r="22"/><circle class="fr-door" cx="820" cy="84" r="18"/><circle class="fr-knob" cx="828" cy="86" r="2.4"/>
  <circle class="fr-ring" cx="775" cy="80" r="7"/><circle class="fr-glass" cx="775" cy="80" r="5"/>
  <circle class="fr-ring" cx="865" cy="80" r="7"/><circle class="fr-glass" cx="865" cy="80" r="5"/></g>
  <g class="fr-f1"><circle cx="520" cy="104" r="2.6"/><circle cx="660" cy="96" r="2.6"/><circle cx="975" cy="98" r="2.6"/></g>
  <g class="fr-f2"><circle cx="534" cy="107" r="2.2"/><circle cx="675" cy="100" r="2.2"/><circle cx="960" cy="102" r="2.2"/></g>
</svg>"""
SELLO_SOCIO = ('<img class="sello-socio" src="../img/logo.png" alt="Socio del Pipa Club Fumadas Hobbit" '
               'title="Socio del Pipa Club Fumadas Hobbit" width="18" height="18">')

# Ajustes para que el panel se vea como en el catalogo, pero como pagina (no ventana flotante)
ESTILO_FICHA = """
.overlay.estatica{position:static;inset:auto;z-index:auto;min-height:100dvh;overflow:visible}
.d-ruta a{color:var(--muted);text-decoration:none;min-height:32px;display:inline-flex;align-items:center}
.d-ruta a:hover{color:var(--accent);text-decoration:underline}
a.x-close{text-decoration:none}
a.link{color:var(--accent);text-decoration:underline}
a.btn{text-decoration:none;display:inline-flex;align-items:center}
.d-lado .bodega a.btn{display:flex}
body{padding:0;margin:0}
.estatica footer{max-width:1040px;margin:0 auto;padding:0 max(16px,env(safe-area-inset-left,0px)) 40px}
.panel.ficha h1.d-h{font-family:var(--display);font-weight:400;font-size:clamp(2.2rem,4.6vw,3.3rem);line-height:1.02;margin:0;overflow-wrap:anywhere;color:var(--fg)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
"""

def map_opinion(r):
    p = r.get("puntuacion")
    o = {"id": r.get("id"), "autor": str(r.get("autor") or ""), "firma": str(r.get("firma") or "")[:40],
         "score": p if isinstance(p, int) and 1 <= p <= 5 else 0, "texto": str(r.get("texto") or "")[:5000],
         "creado": r.get("creado") or "", "actualizado": r.get("actualizado") or "",
         "likes": r["likes"] if isinstance(r.get("likes"), int) and r["likes"] > 0 else 0}
    for k, col, _, ops in CARACT:
        v = r.get(col)
        o[k] = v if isinstance(v, int) and 0 < v < len(ops) else 0
    return o


RESENAS = {"op": {}, "fotos": {}, "socios": set(), "cuenta": Counter()}


def fecha_es(t):
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", str(t or ""))
    return f"{int(m[3])} {MESES[int(m[2]) - 1]} {m[1]}" if m else ""


def fmt_media(x):
    return f"{x:.1f}".replace(".", ",")


def pips(n):
    return '<span class="pips" aria-hidden="true">' + "".join(
        f'<i class="{"on" if i <= n else ""}"></i>' for i in range(1, 6)) + "</span>"


def art(d, grande, prefijo="../"):
    """Lo mismo que art() de app.js: la foto o, si no hay, la lata dibujada del color de su mezcla."""
    foto = str(d.get("foto") or "")
    nombre = str(d.get("nombre") or "")
    if foto.startswith(("https://", "img/")):
        src = foto if foto.startswith("https://") else prefijo + foto
        mini = "" if grande else (mini_de(src)
                                  if re.search(r"/storage/v1/object/public/fotos/.+-\d+\.(jpe?g|png|webp)$", src, re.I) else "")
        alterna = f' onerror="this.onerror=null;this.src=\'{e(src)}\'"' if mini else ""
        return (f'<img class="photo" src="{e(mini or src)}"{alterna} alt="Lata de {e(nombre)}" '
                f'loading="{"eager" if grande else "lazy"}" decoding="async">')
    c = COLORES.get(d.get("tipo") or "", "#5A5548")
    m = e(nombre.strip()[:1].upper())
    return f"""<svg viewBox="0 0 200 170" role="img" aria-label="Lata de {e(nombre)}">
    <ellipse cx="100" cy="152" rx="76" ry="10" fill="#000" opacity=".16"/>
    <rect x="28" y="52" width="144" height="92" fill="{c}"/>
    <ellipse cx="100" cy="144" rx="72" ry="14" fill="{c}"/>
    <rect x="28" y="52" width="144" height="92" fill="#000" opacity=".12"/>
    <rect x="42" y="54" width="10" height="88" fill="#fff" opacity=".14"/>
    <rect x="28" y="82" width="144" height="40" fill="#15130F" opacity=".88"/>
    <rect x="28" y="86" width="144" height="1.5" fill="#D9B45A"/>
    <rect x="28" y="116.5" width="144" height="1.5" fill="#D9B45A"/>
    <text x="100" y="112" text-anchor="middle" font-family="Young Serif, Georgia, serif" font-size="32" fill="#F2E9D0">{m}</text>
    <ellipse cx="100" cy="52" rx="72" ry="14" fill="{c}"/>
    <ellipse cx="100" cy="52" rx="72" ry="14" fill="#fff" opacity=".28"/>
    <ellipse cx="100" cy="52" rx="62" ry="10" fill="none" stroke="#000" stroke-opacity=".18"/>
  </svg>"""


def nota_grande(ops):
    l = [o for o in ops if o["score"]]
    if not l:
        return ""
    n, media = len(l), sum(o["score"] for o in l) / len(l)
    r = "reseña" if n == 1 else "reseñas"
    return f"""<div class="nota" aria-label="Media de las reseñas: {fmt_media(media)} de 5, {n} {r}">
      <span class="nota-n" aria-hidden="true">{fmt_media(media)}<small>/5</small></span>
      {pips(round(media))}
      <span class="nota-l" aria-hidden="true">{n} {r}</span>
    </div>"""


def resumen_caract(ops):
    filas = ""
    for k, _, label, opciones in CARACT:
        votos = [o[k] for o in ops if o[k]]
        if not votos:
            continue
        cuenta = [votos.count(i) for i in range(len(opciones))]
        top = cuenta.index(max(cuenta))
        barras = "".join(
            f'<li><span class="op">{e(op)}</span><span class="barra"><i style="width:{round(cuenta[i] / len(votos) * 100)}%"></i></span>'
            f'<span class="n">{cuenta[i]}</span></li>' for i, op in enumerate(opciones) if i and cuenta[i])
        filas += (f'<div class="car"><div class="car-h"><span class="car-l">{e(label)}</span><strong>{e(opciones[top])}</strong></div>'
                  f'<ul>{barras}</ul></div>')
    return f'<div class="caract"><h3>Según las reseñas</h3>{filas}</div>' if filas else ""


def medias_html(todas):
    con = [o for o in todas if 1 <= o["score"] <= 5]
    if not todas:
        return ""
    if len(con) < MIN_MEDIAS:
        return f'<p class="muted">Todavía hay pocas reseñas para sacar medias (hacen falta {MIN_MEDIAS}).</p>'
    n, media = len(con), sum(o["score"] for o in con) / len(con)
    cuenta = [0] * 6
    for o in con:
        cuenta[o["score"]] += 1
    mx = max(cuenta)
    estrellas = "".join(f'<i class="{"on" if media >= i - .25 else "half" if media >= i - .75 else ""}"></i>' for i in range(1, 6))
    reparto = "".join(f'<div class="md-br"><span>{i}</span><span class="md-bb"><span style="width:{round(cuenta[i] / mx * 100) if mx else 0}%"></span></span>'
                      f'<span>{cuenta[i]}</span></div>' for i in (5, 4, 3, 2, 1))
    escalas = ""
    for k in ORDEN_MEDIAS:
        _, _, label, ops = next(c for c in CARACT if c[0] == k)
        tope = len(ops) - 1
        vals = [o[k] for o in todas if 1 <= o[k] <= tope]
        if len(vals) < MIN_MEDIAS:
            continue
        m = sum(vals) / len(vals)
        pos = round((m - 1) / (tope - 1) * 100)
        v = ops[int(m + .5)]
        escalas += (f'<div class="md-fila"><span class="md-lab">{e(label)}</span>'
                    f'<span class="md-esc" role="img" aria-label="{e(label)}: {e(v)}"><span style="left:{pos}%"></span></span>'
                    f'<span class="md-val">{e(v)}</span><span class="md-ext"><span>{e(ops[1])}</span><span>{e(ops[tope])}</span></span></div>')
    return f"""<div class="medias">
    <div class="md-top">
      <div class="md-nota"><strong>{fmt_media(media)}</strong><span class="md-est" aria-hidden="true">{estrellas}</span>
        <span class="muted">{n} {"reseña" if n == 1 else "reseñas"}</span></div>
      <div class="md-reparto" aria-label="Reparto de puntuaciones">{reparto}</div>
    </div>
    {f'<div class="md-escalas"><h4>Según los fumadores</h4>{escalas}</div>' if escalas else ""}
  </div>"""


def rev_html(o):
    foto = RESENAS["fotos"].get(o["autor"])
    avatar = (f'<img class="avatar" src="{e(foto if foto.startswith("https://") else "../" + foto)}" alt="" loading="lazy">' if foto
              else f'<span class="avatar" aria-hidden="true">{e((o["firma"] or "?").strip()[:1].upper())}</span>')
    n, rango = RESENAS["cuenta"][o["autor"]], ""
    for i, (nom, umbral) in enumerate(RANGOS):
        if n >= umbral:
            rango = f'<span class="rango r{i + 1}">{e(nom)}</span>'
    socio = SELLO_SOCIO if o["autor"] in RESENAS["socios"] else ""
    editado = o["actualizado"][:16] > o["creado"][:16] if o["actualizado"] and o["creado"] else False
    car = "".join(f'<dt>{e(label)}</dt><dd>{e(ops[o[k]])}</dd>' for k, _, label, ops in CARACT if o[k])
    gusta = (f'<span class="gusta-ct" title="A {o["likes"]} {"persona le" if o["likes"] == 1 else "personas les"} gusta">'
             f'{ico("gusta")}<span>{o["likes"]}</span></span>') if o["likes"] else ""
    return (f'<div class="head"><span class="who">{avatar}{e(o["firma"])}{socio}{rango}</span>'
            f'<span class="str">{pips(o["score"])}<span>{VALORACION[o["score"]]}</span></span>'
            f'<span class="when">{fecha_es(o["creado"])}{" · editada" if editado else ""}</span></div>'
            + (f'<dl class="rev-car">{car}</dl>' if car else "")
            + (f'<p>{e(o["texto"])}</p>' if o["texto"] else "")
            + (f'<div class="rev-pie">{gusta}</div>' if gusta else ""))


def mas_de_la_marca(d, otras):
    """Como masDeLaMarca de app.js: primero las de la misma serie (primera palabra), como mucho 4."""
    pal = lambda n: re.split(r"[\s.,·\-–]+", slug_texto(n))[0]
    serie = pal(d.get("nombre", ""))
    de_serie = [x for x in otras if pal(x["nombre"]) == serie] if len(serie) > 2 else []
    lista_ = (de_serie or otras)[:4]
    titulo = f'Más de la serie {d["nombre"].split()[0]}' if de_serie else f'Más de {d.get("marca", "")}'
    return titulo, lista_


def slug_texto(s):
    return unicodedata.normalize("NFD", str(s or "")).encode("ascii", "ignore").decode().lower().strip()


def pagina(d, otras):
    ident = str(d["id"])
    marca, tipo = d.get("marca", ""), d.get("tipo") or ""
    nombre = d.get("nombre", "")
    titulo = f'{nombre} · {marca}'.strip(" ·")
    partes = [p for p in (tipo, d.get("corte"), d.get("pais")) if p]
    texto = str(d.get("descripcion") or d.get("desc") or "")
    desc = recorta(" · ".join(partes) + (". " if partes else "") + texto, 200)
    catalogo = f"../index.html#/ficha/{ident}"
    hojas = [h for h in HOJAS if h in lista(d.get("hojas"))]
    notas = lista(d.get("notas"))
    todas = RESENAS["op"].get(ident, [])
    video = str(d.get("video_id") or "")
    video = video if re.fullmatch(r"[A-Za-z0-9_-]{11}", video) else ""

    # Cabecera de datos (metaHTML de app.js)
    casilla = lambda k, t, v, url="": (f'<div class="d-dato">{ico(k)}<span class="d-dato-l">{t}</span><span class="d-dato-v">'
                                        + (f'<a class="d-enlace" href="{e(url)}" title="Qué es: {e(v)}">{e(v)}</a>' if url else e(v))
                                        + '</span></div>') if v else ""
    datos = (casilla("mezcla", "Mezcla", tipo, f"../{url_mezcla(tipo)}" if tipo in MEZCLAS else "")
             + casilla("corte", "Corte", d.get("corte") or "") + casilla("origen", "Origen", d.get("pais") or "")
             + casilla("formato", "Formato", d.get("formato") or ""))
    sin_resenas = "" if any(o["score"] for o in todas) else (
        '<p class="d-rate"><span class="d-pips" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>'
        f'Sin reseñas todavía · <a class="link" href="{e(catalogo)}">escribe la primera</a></p>')
    es = ' <span class="es-badge" role="img" aria-label="España">E</span>' if d.get("en_espana") is True else ""
    chips = ""
    if hojas or notas:
        ch_hojas = "".join('<span class="chip hoja h-%s">%s</span>' % (HOJA_CLASE[h], e(h)) for h in hojas)
        ch_notas = "".join('<span class="chip sabor">%s</span>' % e(n) for n in notas)
        chips = ('<dl class="d-chips">' + (f"<dt>Hojas</dt><dd>{ch_hojas}</dd>" if hojas else "")
                 + (f"<dt>Notas de sabor</dt><dd>{ch_notas}</dd>" if notas else "") + "</dl>")
    marca_html = f'<a class="d-enlace" href="../{e(url_marca(marca))}" title="Todo sobre {e(marca)}">{e(marca)}</a>' if marca else ""
    meta = f"""
      <div class="d-head">
        <div class="d-title">
          <span class="brandname">{marca_html}{f" · {e(d.get('pais'))}" if d.get("pais") else ""}</span>
          <h1 id="d-name" class="d-h">{e(nombre)}{es}</h1>
          {sin_resenas}
        </div>
        {nota_grande(todas)}
      </div>
      {f'<div class="d-datos">{datos}</div>' if datos else ""}
      {chips}
      {f'<hr class="d-sep"><p class="d-desc">{e(texto)}</p>' if texto else ""}
      {resumen_caract(todas)}"""

    # Resenas (paintResenas de app.js, en modo lectura)
    accion = (f'<p class="muted"><a class="link" href="{e(catalogo)}">Abre la ficha en el catálogo</a> '
              'para escribir tu reseña o apuntarla en Mi bodega.</p>')
    if not todas:
        lista_rv = f"""<div class="rv-vacio">
        <svg viewBox="0 0 80 80" aria-hidden="true"><path d="M12 46h26a8 8 0 0 0 8-8v-8h14v10a20 20 0 0 1-20 20H20a8 8 0 0 1-8-8z"/><path d="M60 30h8"/><path class="humo" d="M50 20c0-4 4-5 4-9M56 22c0-4 4-5 4-9"/></svg>
        <div class="rv-vacio-t"><p>Nadie ha reseñado todavía {e(nombre)}.</p>
        <p class="muted">Cuéntanos a qué sabe, cómo arde y qué tal huele en la habitación.</p>
        <div><a class="btn primary" href="{e(catalogo)}">Escribir la primera reseña</a></div></div>
      </div>"""
        mine, resto_html = "", ""
    else:
        lista_rv = f'<div class="rev rev-ultima"><span class="rev-etq">Última reseña</span>{rev_html(todas[0])}</div>'
        mine = accion
        mas_res = todas[1:]
        resto_html = (f'<section class="sec sec-resto" id="d-resto" aria-labelledby="rr-h"><h3 id="rr-h">Más reseñas <small>{len(mas_res)}</small></h3>'
                      f'<div class="reviews rev-rejilla">{"".join("<div class=%s>%s</div>" % (chr(34) + "rev" + chr(34), rev_html(o)) for o in mas_res)}</div></section>'
                      ) if mas_res else ""
    video_html = (f"""<section class="sec" id="d-video" aria-labelledby="vd-h"><h3 id="vd-h">Vídeo</h3>
    <div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/{video}?rel=0"
      title="Vídeo de {e(nombre)}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
    <a class="yt-link" href="https://www.youtube.com/watch?v={video}" target="_blank" rel="noopener noreferrer">Abrir en YouTube</a></section>"""
                  if video else "")
    mas_html = ""
    if otras:
        tit, items = mas_de_la_marca(d, otras)
        mas_html = (f'<section class="sec sec-mas" aria-labelledby="mas-h"><h3 id="mas-h">{e(tit)}</h3><div class="mas-lista">'
                    + "".join(f'<a class="mas-item" href="{e(x["id"])}.html"><span class="mas-art">{art(x, False)}</span>'
                              f'<span class="mas-nom">{e(x["nombre"])}</span></a>' for x in items)
                    + "</div></section>")
    # Mi bodega: solo se ve si quien mira ha entrado con su cuenta en la web (como en el catalogo)
    bodega = (f"""<div id="d-bodega" hidden><div class="bodega-h"><p class="bodega-t">Mi bodega</p></div>
      <div class="btns bodega" role="group" aria-label="Mi bodega">"""
              + "".join(f'<a class="btn" href="{e(catalogo)}">{ico(k)}<span>{t}</span></a>' for k, t in BODEGA)
              + "</div></div>")
    ruta = (f'<nav class="d-ruta" aria-label="Ruta"><a href="../">Catálogo</a><span aria-hidden="true">›</span>'
            + (f'<a href="../{e(url_marca(marca))}">{e(marca)}</a><span aria-hidden="true">›</span>' if marca else "")
            + f'<span class="d-r-yo">{e(nombre)}</span></nav>')
    cuerpo = f"""<main class="panel ficha">
    <div class="d-franja">{FRANJA}</div>
    {ruta}
    <a class="x-close" href="../" aria-label="Volver al catálogo" title="Volver al catálogo"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></a>
    <div class="d-lado">
      <div class="nicho"><div class="art" id="d-art">{art(d, True)}</div><div class="balda" aria-hidden="true"></div></div>
      {bodega}
      <div class="compartir"><button class="btn" id="d-share" type="button">{ico("compartir")}Compartir ficha</button><span class="muted" id="d-share-msg" role="status"></span></div>
      <div class="compartir" id="d-etq" hidden><button class="btn" id="d-etq-btn" type="button">{ico("etiqueta")}Descargar etiquetas</button></div>
    </div>
    <div class="info">
      <div id="d-meta">{meta}</div>
    </div>
    <div class="d-orn" aria-hidden="true"><span></span>{ico("hoja")}<span></span></div>
    <div class="sections">
      {video_html}
      <section class="sec sec-resenas" id="d-resenas" aria-labelledby="rv-h">
        <h3 id="rv-h">Reseñas</h3>
        <div id="rv-medias">{medias_html(todas)}</div>
        <div id="rv-mine">{mine}</div>
        <div class="reviews" id="rv-list">{lista_rv}</div>
      </section>
      {resto_html}
      {mas_html}
    </div>
  </main>"""
    datos_etq = json.dumps({"nombre": nombre, "marca": marca, "tipo": tipo, "corte": d.get("corte") or "", "pais": d.get("pais") or "",
                            "color": COLORES.get(tipo, "#5A5548"), "archivo": slug(nombre) or ident}, ensure_ascii=False).replace("</", "<\\/")
    script = f'<script src="../etiquetas.js?v={PORTADA["etiquetas"]}"></script>\n<script type="application/json" id="d-etq-datos">{datos_etq}</script>\n' + """<script>(function(){
var t=document.title.replace(/ · El herbario de la Comarca$/,""),u=location.href.split("#")[0],m=document.getElementById("d-share-msg");
document.getElementById("d-share").addEventListener("click",function(){
 if(navigator.share){navigator.share({title:t,text:t+" en El herbario de la Comarca",url:u}).catch(function(){});return}
 if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){m.textContent="Enlace copiado. Pégalo en WhatsApp o Telegram."},function(){m.textContent=u})}else m.textContent=u});
try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^sb-.*-auth-token$/.test(k)&&localStorage.getItem(k)){document.getElementById("d-bodega").hidden=false;if(window.Etiquetas)document.getElementById("d-etq").hidden=false;break}}}catch(e){}
document.getElementById("d-etq-btn").addEventListener("click",function(){window.Etiquetas.abrir(JSON.parse(document.getElementById("d-etq-datos").textContent))});
})();</script>"""
    migas = [("Inicio", "")] + ([(marca, url_marca(marca))] if marca else []) + [(nombre, None)]
    return marco(titulo, desc, f"f/{ident}.html", cuerpo + script, migas, imagen(str(d.get("foto") or "")), "article", ficha=True)


def colores_tipo():
    """Colores de cada tipo de mezcla, sacados de TIPOS en app.js (los mismos de las latas del catalogo)."""
    txt = (RAIZ / "app.js").read_text(encoding="utf-8")
    bloque = re.search(r"const TIPOS = \{(.*?)\};", txt, re.S)
    return dict(re.findall(r'"([^"]+)":\s*"(#[0-9A-Fa-f]{6})"', bloque.group(1))) if bloque else {}


COLORES = colores_tipo()


def miniatura(d):
    """Foto pequena del tabaco (la version -m.jpg o -m.webp que usa el catalogo) o, si no hay foto, la lata dibujada."""
    foto = str(d.get("foto") or "")
    nombre = d.get("nombre", "")
    if foto.startswith(("https://", "img/")):
        src = foto if foto.startswith("https://") else "../" + foto
        mini = mini_de(src) \
            if re.search(r"/storage/v1/object/public/fotos/.+-\d+\.(jpe?g|png|webp)$", src, re.I) else ""
        alterna = f' onerror="this.onerror=null;this.src=\'{e(src)}\'"' if mini else ""
        return (f'<img class="mini" src="{e(mini or src)}"{alterna} alt="" loading="lazy" decoding="async" '
                f'width="56" height="56">')
    c = COLORES.get(d.get("tipo") or "", "#5A5548")
    letra = e(nombre.strip()[:1].upper())
    return (f'<svg class="mini" viewBox="0 0 200 170" aria-hidden="true">'
            f'<ellipse cx="100" cy="152" rx="76" ry="10" fill="#000" opacity=".16"/>'
            f'<rect x="28" y="52" width="144" height="92" fill="{c}"/><ellipse cx="100" cy="144" rx="72" ry="14" fill="{c}"/>'
            f'<rect x="28" y="52" width="144" height="92" fill="#000" opacity=".12"/>'
            f'<rect x="28" y="82" width="144" height="40" fill="#15130F" opacity=".88"/>'
            f'<rect x="28" y="86" width="144" height="1.5" fill="#D9B45A"/><rect x="28" y="116.5" width="144" height="1.5" fill="#D9B45A"/>'
            f'<text x="100" y="112" text-anchor="middle" font-family="Young Serif, Georgia, serif" font-size="32" fill="#F2E9D0">{letra}</text>'
            f'<ellipse cx="100" cy="52" rx="72" ry="14" fill="{c}"/><ellipse cx="100" cy="52" rx="72" ry="14" fill="#fff" opacity=".28"/></svg>')


def item_tabaco(d, con_marca=False):
    meta = [x for x in ((d.get("marca") if con_marca else None), d.get("corte")) if x]
    es = ' <span class="es" role="img" aria-label="España" title="España">E</span>' if d.get("en_espana") is True else ""
    return (f'<li><a href="../f/{e(d["id"])}.html">{miniatura(d)}<span>{e(d["nombre"])}{es}'
            + (f'<small>{e(" · ".join(meta))}</small>' if meta else "") + "</span></a></li>")


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
    logo = LOGOS.get(slug(marca))
    cab_logo = f'<img class="logo-cab" src="{e(logo)}" alt="Logo de {e(marca)}">' if logo else ""
    cuerpo = f"""<main class="ficha">
<div class="cab-marca"><div><p class="marca">Marca</p>
<h1>{e(marca)}</h1></div>{cab_logo}</div>
<p class="resumen">{e(resumen)}</p>
<div class="texto">{parrafos(texto)}</div>
<a class="abrir" href="../index.html">Ver el catálogo completo</a>
</main>
{grupos}"""
    return marco(f"{marca} · tabaco de pipa", desc, url_marca(marca), cuerpo,
                 [("Inicio", ""), ("Marcas", "marca/"), (marca, None)], logo)


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
        f'<li><a href="{e(slug(m))}.html">{logo_marca(m, "mini lmarca")}<span>{e(m)}<small>{cuenta(len(fs), "mezcla", "mezclas")}'
        + (f' · {e(Counter(d.get("pais") for d in fs if d.get("pais")).most_common(1)[0][0])}'
           if any(d.get("pais") for d in fs) else "") + "</small></span></a></li>"
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
    if origen == "Supabase":
        RESENAS["op"], RESENAS["fotos"], RESENAS["socios"] = resenas_supabase()
        for l in RESENAS["op"].values():
            for o in l:
                RESENAS["cuenta"][o["autor"]] += 1
    textos = leer_textos()
    LOGOS.update(leer_logos())

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
