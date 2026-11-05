"""Pasa las fuentes de Google Fonts a la propia web (fuentes/web/).

Por qué: así el navegador del visitante no se conecta a Google para cargar las letras (su dirección IP no sale
hacia Google, que es lo que el RGPD pide evitar) y la web carga un poco más rápido.

Qué hace:
  1. Lee en index.html la dirección de Google Fonts con las familias que usa la web.
  2. Descarga el CSS y los archivos .woff2 de los alfabetos latino y latino ampliado (español, alemán, danés...).
  3. Escribe fuentes/web/fuentes.css apuntando a esos archivos.
  4. En index.html, ayuda.html, aviso-legal.html y privacidad.html cambia Google Fonts por fuentes/web/fuentes.css,
     y en privacidad.html quita Google Fonts de la lista de proveedores.
Las páginas generadas (fichas, marcas, mezclas) copian las fuentes de index.html, así que cambian solas
en la siguiente regeneración.

Se ejecuta desde GitHub (Actions → «Fuentes en la propia web»), porque necesita conexión con Google.
Si se quieren cambiar las fuentes más adelante: volver a poner el enlace de Google Fonts en index.html y ejecutarlo otra vez.
"""
import datetime, re, sys, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "fuentes" / "web"
PAGINAS = ["index.html", "ayuda.html", "aviso-legal.html", "privacidad.html"]
ALFABETOS = {"latin", "latin-ext"}
# Con un navegador moderno, Google devuelve woff2
NAVEGADOR = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


def bajar(url):
    req = urllib.request.Request(url, headers={"User-Agent": NAVEGADOR})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    portada = (RAIZ / "index.html").read_text(encoding="utf-8")
    m = re.search(r'<link rel="stylesheet" href="(https://fonts\.googleapis\.com/[^"]*)">', portada)
    if not m:
        print("index.html ya no usa Google Fonts: no hay nada que hacer.")
        return
    url_css = m.group(1).replace("&amp;", "&")
    css = bajar(url_css).decode("utf-8")
    DESTINO.mkdir(parents=True, exist_ok=True)
    bloques = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S)
    salida, archivos = [], {}
    for alfabeto, bloque in bloques:
        if alfabeto not in ALFABETOS:
            continue
        url = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", bloque)
        familia = re.search(r"font-family:\s*'([^']+)'", bloque)
        if not url or not familia:
            continue
        url = url.group(1)
        if url not in archivos:
            nombre = re.sub(r"[^a-z0-9]+", "-", familia.group(1).lower()).strip("-") + "-" + url.rsplit("/", 1)[1]
            (DESTINO / nombre).write_bytes(bajar(url))
            archivos[url] = nombre
        salida.append(f"/* {familia.group(1)} · {alfabeto} */\n" + bloque.replace(url, archivos[url]))
    if not salida:
        sys.exit("No se ha encontrado ninguna fuente en la respuesta de Google: no se cambia nada.")
    for viejo in DESTINO.glob("*.woff2"):
        if viejo.name not in archivos.values():
            viejo.unlink()
    (DESTINO / "fuentes.css").write_text(
        "/* Fuentes de la web, alojadas aquí en lugar de en Google Fonts (las genera herramientas/fuentes_locales.py).\n"
        "   Licencia SIL Open Font License: ver los archivos OFL-*.txt de la carpeta fuentes/. */\n\n" + "\n\n".join(salida) + "\n",
        encoding="utf-8")
    enlace = f'<link rel="stylesheet" href="/fuentes/web/fuentes.css?v={datetime.date.today():%Y%m%d}">'
    for nombre in PAGINAS:
        ruta = RAIZ / nombre
        if not ruta.exists():
            continue
        t = ruta.read_text(encoding="utf-8")
        t = re.sub(r'<link rel="preconnect" href="https://fonts\.(googleapis|gstatic)\.com"[^>]*>\n?', "", t)
        t = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/[^"]*">', enlace, t)
        if nombre == "privacidad.html":
            t = re.sub(r"\s*<li><strong>Google Fonts</strong>.*?</li>", "", t)
        ruta.write_text(t, encoding="utf-8")
    print(f"{len(archivos)} archivos de fuentes en fuentes/web/ y {len(PAGINAS)} páginas actualizadas.")


if __name__ == "__main__":
    main()
