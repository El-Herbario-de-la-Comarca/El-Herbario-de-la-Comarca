#!/usr/bin/env python3
"""Busca logos candidatos para las marcas que aún no tienen logo.

Uso: buscar_logos.py marcas.json carpeta_destino
marcas.json: {"clave": {"nombre": "...", "paginas": ["https://...", ...], "buscar": "texto"}}

Para cada marca descarga imágenes que parecen logos de:
  - las páginas indicadas (web oficial, ficha de marca de tiendas, Pipedia): <img> con «logo» en
    src/alt/class/id, og:image y apple-touch-icon;
  - Wikimedia Commons (búsqueda «<nombre> logo»);
Guarda carpeta_destino/<clave>/NN.<ext> y carpeta_destino/<clave>/fuentes.txt (NN → URL).
Solo sirve para elegir a mano: no publica nada.
"""
import html, json, re, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/130.0 Safari/537.36")
TIPOS = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg",
         "image/gif": "gif"}


def get(url, timeout=25):
    ua = "HerbarioLogos/1.0 (https://elherbariodelacomarca.es)" if "wikimedia.org" in url else UA
    req = urllib.request.Request(urllib.parse.quote(url, safe=":/?&=%#+,;@!$'()*~"), headers={"User-Agent": ua, "Accept-Language": "en,de;q=0.8,es;q=0.6"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), (r.headers.get("Content-Type") or "").split(";")[0].strip().lower(), r.geturl()


def candidatos_pagina(url, nombre=""):
    try:
        cuerpo, tipo, final = get(url)
    except Exception as ex:
        print(f"    sin página {url} ({ex})", flush=True)
        return []
    if "html" not in tipo:
        return []
    t = cuerpo.decode("utf-8", "replace")
    out = []
    for tag in re.findall(r"<img\b[^>]*>", t, re.I):
        alt = " ".join(re.findall(r"(?:alt|title)\s*=\s*[\"']([^\"']*)", tag, re.I)).lower()
        clave_nombre = (nombre.lower().split() or [""])[0]
        if not (re.search(r"logo|brand|marke|hersteller|manufacturer", tag, re.I)
                or (len(clave_nombre) > 2 and clave_nombre in alt)):
            continue
        for attr in ("data-src", "data-lazy-src", "src"):
            m = re.search(attr + r"\s*=\s*[\"']([^\"']+)", tag, re.I)
            if m and not m.group(1).startswith("data:"):
                out.append(m.group(1)); break
        m = re.search(r"srcset\s*=\s*[\"']([^\"']+)", tag, re.I)
        if m:
            out.append(m.group(1).split(",")[-1].strip().split(" ")[0])
    for pat in (r"<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)",
                r"<link[^>]+rel=[\"'][^\"']*apple-touch-icon[^\"']*[\"'][^>]+href=[\"']([^\"']+)",
                r"<link[^>]+href=[\"']([^\"']+)[\"'][^>]+rel=[\"'][^\"']*apple-touch-icon"):
        out += re.findall(pat, t, re.I)
    res = []
    for u in out:
        u = urllib.parse.urljoin(final, html.unescape(u.strip()))
        if u.startswith("http") and u not in res:
            res.append(u)
    return res[:40]


def candidatos_commons(texto):
    q = urllib.parse.urlencode({"action": "query", "generator": "search", "gsrnamespace": 6,
                                "gsrsearch": f"{texto} logo", "gsrlimit": 6, "prop": "imageinfo",
                                "iiprop": "url", "iiurlwidth": 800, "format": "json"})
    try:
        d = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q)[0])
    except Exception as ex:
        print(f"    sin Commons ({ex})", flush=True)
        return None
    pal = [p for p in re.split(r"\W+", texto.lower()) if len(p) > 2]
    res = []
    for p in (d.get("query") or {}).get("pages", {}).values():
        tit = p.get("title", "").lower()
        if pal and not any(x in tit for x in pal):
            continue
        ii = (p.get("imageinfo") or [{}])[0]
        if ii.get("thumburl"):
            res.append(ii["thumburl"])
    return res


def candidatos_bing(texto):
    url = "https://www.bing.com/images/search?" + urllib.parse.urlencode({"q": texto, "form": "HDRSC2"})
    try:
        t = get(url)[0].decode("utf-8", "replace")
    except Exception as ex:
        print(f"    sin Bing ({ex})", flush=True)
        return []
    res = []
    for m in re.findall(r"murl&quot;:&quot;(.*?)&quot;", t):
        u = html.unescape(m)
        if u not in res:
            res.append(u)
    return res[:8]


def bajar(u, destino_base):
    try:
        datos, tipo, _ = get(u, timeout=30)
    except Exception as ex:
        return None, f"{u} (error: {ex})"
    ext = TIPOS.get(tipo)
    if not ext:
        low = u.lower().split("?")[0]
        ext = next((e for e in ("svg", "png", "jpg", "jpeg", "webp", "gif") if low.endswith("." + e)), None)
    if not ext or len(datos) < 300 or len(datos) > 8 * 1024 * 1024:
        return None, f"{u} (descartada: {tipo}, {len(datos)} bytes)"
    ruta = destino_base.with_suffix("." + ("jpg" if ext == "jpeg" else ext))
    ruta.write_bytes(datos)
    return ruta.name, u


SITEMAP = []


def leer_sitemap(url):
    """Todas las direcciones (loc) de un sitemap, siguiendo los índices y los .xml.gz."""
    import gzip
    try:
        datos = get(url, timeout=40)[0]
    except Exception as ex:
        print(f"    sin sitemap {url} ({ex})", flush=True)
        return []
    if datos[:2] == b"\x1f\x8b":
        datos = gzip.decompress(datos)
    locs = re.findall(r"<loc>\s*([^<]+?)\s*</loc>", datos.decode("utf-8", "replace"))
    if "<sitemapindex" in datos.decode("utf-8", "replace")[:500]:
        return [u for l in locs for u in leer_sitemap(html.unescape(l))]
    return [html.unescape(l) for l in locs]


def paginas_sitemap(fichas):
    """Páginas de categoría (pocas partes en la ruta) cuyo último trozo contiene alguna de las fichas."""
    res = []
    for u in SITEMAP:
        partes = [x for x in urllib.parse.urlparse(u).path.split("/") if x]
        if not partes or len(partes) > 3 or partes[0].lower() in ("detail", "en"):
            continue
        ultimo = re.sub(r"[^a-z0-9]", "", partes[-1].lower())
        if any(f in ultimo for f in fichas) and len(ultimo) <= max(len(f) for f in fichas) + 12:
            res.append(u)
    return res[:4]


def marca(clave, info, destino):
    carpeta = destino / clave
    carpeta.mkdir(parents=True, exist_ok=True)
    urls = []
    paginas = info.get("paginas", []) + paginas_sitemap(info.get("fichas", []))
    print(f"  {clave}: páginas {paginas}", flush=True)
    for p in paginas:
        urls += [("pagina " + p, u) for u in candidatos_pagina(p, info["nombre"])]
    for _ in range(3):   # Commons limita las peticiones seguidas
        c = candidatos_commons(info["nombre"])
        if c is not None:
            break
        time.sleep(5)
    urls += [("commons", u) for u in (c or [])]
    vistos, lineas, n = set(), [], 0
    for origen, u in urls:
        if u in vistos:
            continue
        vistos.add(u)
        n += 1
        nombre, nota = bajar(u, carpeta / f"{n:02d}")
        lineas.append(f"{nombre or '--'}\t{origen}\t{nota}")
    (carpeta / "fuentes.txt").write_text("\n".join(lineas) + "\n", encoding="utf-8")
    ok = sum(1 for l in lineas if not l.startswith("--"))
    print(f"  {clave}: {ok} imágenes de {len(lineas)} enlaces", flush=True)


def main():
    marcas = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    destino = Path(sys.argv[2])
    for sm in sys.argv[3:]:
        SITEMAP.extend(leer_sitemap(sm))
    print(f"  {len(SITEMAP)} direcciones en los sitemaps", flush=True)
    with ThreadPoolExecutor(max_workers=2) as pool:
        list(pool.map(lambda kv: marca(kv[0], kv[1], destino), marcas.items()))


if __name__ == "__main__":
    main()
