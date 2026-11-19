"""Genera mapa-datos.js: los contornos de los países para el mapa de orígenes (mapa.js).

Fuente: Natural Earth, «Admin 0 – Countries» a escala 1:50m (dominio público).
    https://github.com/nvkelso/natural-earth-vector  ->  geojson/ne_50m_admin_0_countries.geojson

Uso:
    python3 herramientas/mapa_origenes.py ruta/a/ne_50m_admin_0_countries.geojson

Saca dos zonas (Europa y América) en proyección equirectangular corregida por la latitud media,
simplificadas (Douglas-Peucker) y con coordenadas enteras para que el archivo pese poco.
Cada país va con su nombre en español (NAME_ES), que es lo que se compara con el campo «país» de las fichas.
"""
import json
import math
import sys

ZONAS = {
    # clave: (nombre, lon0, lon1, lat0, lat1, ancho)
    "eu": ("Europa", -11.0, 45.0, 35.0, 62.5, 700),
    "am": ("América", -126.0, -33.0, -56.0, 50.0, 700),
}
TOL = 1.2          # tolerancia de simplificación, en unidades del dibujo
AREA_MIN = 2.0     # se descartan islas más pequeñas que esto (salvo que sean todo el país)
AREA_PEQ = 40.0    # países más pequeños que esto llevan un punto para poder tocarlos


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    largo = math.hypot(dx, dy)
    im, dm = 0, 0.0
    for i in range(1, len(pts) - 1):
        p = pts[i]
        if largo:
            dist = abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / largo
        else:
            dist = math.hypot(p[0] - a[0], p[1] - a[1])
        if dist > dm:
            im, dm = i, dist
    if dm > tol:
        return dp(pts[: im + 1], tol)[:-1] + dp(pts[im:], tol)
    return [a, b]


def area_y_centro(pts):
    a = cx = cy = 0.0
    for i in range(len(pts)):
        x0, y0 = pts[i - 1]
        x1, y1 = pts[i]
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    a /= 2
    if not a:
        return 0.0, pts[0]
    return abs(a), (cx / (6 * a), cy / (6 * a))


def zona(feats, lon0, lon1, lat0, lat1, ancho):
    k = math.cos(math.radians((lat0 + lat1) / 2))
    s = ancho / ((lon1 - lon0) * k)
    alto = round((lat1 - lat0) * s)

    def P(lo, la):
        return ((lo - lon0) * k * s, (lat1 - la) * s)

    paises, fondo = {}, []
    for f in feats:
        nombre = f["properties"].get("NAME_ES") or f["properties"].get("NAME")
        g = f["geometry"]
        polis = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        trozos, mayor = [], (0.0, None)
        anillos = []
        for poli in polis:
            anillo = poli[0]
            xs = [p[0] for p in anillo]
            ys = [p[1] for p in anillo]
            if max(xs) < lon0 - 2 or min(xs) > lon1 + 2 or max(ys) < lat0 - 2 or min(ys) > lat1 + 2:
                continue
            pts = [P(p[0], p[1]) for p in anillo]
            anillos.append(pts)
        if not anillos:
            continue
        # Un país es de la zona donde está su trozo más grande (Francia no es de América por la Guayana).
        grande = max(polis, key=lambda q: area_y_centro(q[0])[0])[0]
        glon, glat = area_y_centro(grande)[1]
        es_de_aqui = lon0 - 10 <= glon <= lon1 + 10 and lat0 - 10 <= glat <= lat1 + 10
        total = sum(area_y_centro(p)[0] for p in anillos)
        for pts in anillos:
            ar, c = area_y_centro(pts)
            if not (0 <= c[0] <= ancho and 0 <= c[1] <= alto):
                # El centro se sale del mapa (Noruega, Suecia…): se usa la media de la parte que se ve.
                dentro = [q for q in pts if 0 <= q[0] <= ancho and 0 <= q[1] <= alto]
                if dentro:
                    c = (sum(q[0] for q in dentro) / len(dentro), max(14, sum(q[1] for q in dentro) / len(dentro)))
            if ar > mayor[0]:
                mayor = (ar, c)
            if ar < AREA_MIN and total >= AREA_MIN:
                continue
            simp = dp(pts, TOL)
            if len(simp) < 3:
                simp = pts
            ent = []
            for x, y in simp:
                q = (round(x), round(y))
                if not ent or ent[-1] != q:
                    ent.append(q)
            if len(ent) < 3:
                continue
            trozos.append("M" + "L".join(f"{x} {y}" for x, y in ent) + "Z")
        cx, cy = mayor[1]
        if not es_de_aqui or not (0 <= cx <= ancho and 0 <= cy <= alto):
            fondo.extend(trozos)   # se dibuja, pero no se puede elegir en esta zona
            continue
        paises[nombre] = {"d": "".join(trozos), "c": [round(cx), round(cy)]}
        if total < AREA_PEQ:
            paises[nombre]["peq"] = 1
    return {"w": ancho, "h": alto, "paises": paises, "fondo": "".join(fondo)}


def main():
    datos = json.load(open(sys.argv[1], encoding="utf-8"))
    feats = datos["features"]
    salida = {clave: dict(nombre=z[0], **zona(feats, *z[1:])) for clave, z in ZONAS.items()}
    js = ("/* Contornos de los países para el mapa de orígenes (mapa.js). Generado con herramientas/mapa_origenes.py\n"
          "   a partir de Natural Earth (dominio público). No editar a mano. */\n"
          "window.MAPA_ORIGENES = " + json.dumps(salida, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open("mapa-datos.js", "w", encoding="utf-8").write(js)
    for clave, z in salida.items():
        print(clave, z["w"], "x", z["h"], len(z["paises"]), "países")
    print(len(js.encode()) // 1024, "KB")


if __name__ == "__main__":
    main()
