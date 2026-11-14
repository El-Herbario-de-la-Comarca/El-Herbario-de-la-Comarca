#!/usr/bin/env python3
"""Busca logos candidatos para las marcas que aún no tienen logo.

Uso: buscar_logos.py marcas.json carpeta_destino
marcas.json: {"clave": {"nombre": "...", "paginas": ["https://...", ...], "buscar": "texto"}}

Para cada marca descarga imágenes que parecen logos de:
  - las páginas indicadas (web oficial, ficha de marca de tiendas, Pipedia): <img> con «logo» en
    src/alt/class/id, og:image y apple-touch-icon;
  - Wikimedia Commons (búsqueda «<nombre> logo»);
  - la búsqueda de imágenes de Bing (primeros resultados).
Guarda carpeta_destino/<clave>/NN.<ext> y carpeta_destino/<clave>/fuentes.txt (NN → URL).
Solo sirve para elegir a mano: no publica nada.
"""
import html, json, re, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/130.0 Safari/537.36")
TIPOS = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg",
         "image/gif": "gif"}


def get(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en,de;q=0.8,es;q=0.6"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), (r.headers.get("Content-Type") or "").split(";")[0].strip().lower(), r.geturl()


def candidatos_pagina(url):
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
        if not re.search(r"logo|brand|marke|hersteller", tag, re.I):
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
    return res[:8]


def candidatos_commons(texto):
    q = urllib.parse.urlencode({"action": "query", "generator": "search", "gsrnamespace": 6,
                                "gsrsearch": f"{texto} logo", "gsrlimit": 6, "prop": "imageinfo",
                                "iiprop": "url", "iiurlwidth": 800, "format": "json"})
    try:
        d = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q)[0])
    except Exception as ex:
        print(f"    sin Commons ({ex})", flush=True)
        return []
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


def marca(clave, info, destino):
    carpeta = destino / clave
    carpeta.mkdir(parents=True, exist_ok=True)
    urls = []
    for p in info.get("paginas", []):
        urls += [("pagina " + p, u) for u in candidatos_pagina(p)]
    urls += [("commons", u) for u in candidatos_commons(info["nombre"])]
    urls += [("bing", u) for u in candidatos_bing(info.get("buscar") or f'{info["nombre"]} tobacco logo')]
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
    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(lambda kv: marca(kv[0], kv[1], destino), marcas.items()))


if __name__ == "__main__":
    main()
