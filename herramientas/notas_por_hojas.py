#!/usr/bin/env python3
"""Notas de sabor habituales según las hojas de cada ficha (6/11/2026).

Para las fichas NO aromáticas que siguen sin notas (después de los SQL 50 y 51),
propone las notas típicas de sus hojas, afinadas con lo que dice su propia ficha:
color de la virginia, cantidad de latakia o perique, burley oscuro o tostado,
hoja de cigarro, Lakeland, etc. Se guardan como notas normales (decisión del usuario).

Uso:
    python3 herramientas/notas_por_hojas.py
Salida:
    marcas/notas_por_hojas.txt         id|notas|motivo (para revisar)
    supabase/57_notas_por_hojas.sql    solo rellena fichas con notas vacías
    datos-iniciales.js                 copia de respaldo (solo fichas sin notas)

Tabla base (contrastada el 5/11/2026 con Pipedia, Smokingpipes, G. L. Pease,
Russ Ouellette y tiendas británicas):
    Latakia ahumado, cuero · Virginia heno, cítricos · Perique pimienta, higo
    Oriental hierbas aromáticas, floral · Burley nuez, terroso
    Kentucky ahumado, terroso · Cigarro terroso, café · Cavendish ninguna
"""
import glob, html, json, re, sys, unicodedata
from pathlib import Path

R = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(R / "herramientas"))
from notas_sql import LISTA  # lista cerrada

def sin_tildes(s):
    return unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()

def leer_fichas():
    out = {}
    for p in glob.glob(str(R / "f/*.html")):
        i = Path(p).stem
        if not i.isdigit():
            continue
        s = open(p, encoding="utf-8").read()
        def dato(l):
            m = re.search(r'<span class="d-dato-l">' + l + r'</span><span class="d-dato-v">(.*?)</span></div>', s)
            return html.unescape(re.sub("<[^>]+>", "", m.group(1))) if m else ""
        m = re.search(r"<dt>Notas de sabor</dt><dd>(.*?)</dd>", s)
        notas = re.findall(r'chip sabor">(.*?)<', m.group(1)) if m else []
        m = re.search(r"<dt>Hojas</dt><dd>(.*?)</dd>", s)
        hojas = re.findall(r'chip hoja[^"]*">(.*?)<', m.group(1)) if m else []
        m = re.search(r'<p class="d-desc">(.*?)</p>', s, re.S)
        desc = html.unescape(re.sub("<[^>]+>", "", m.group(1))) if m else ""
        t = html.unescape(re.search(r"<title>(.*?)</title>", s).group(1)).split(" · El herbario")[0]
        out[i] = dict(t=t, tipo=dato("Mezcla"), corte=dato("Corte"), hojas=hojas, notas=notas, desc=desc)
    return out

PRENSADO = {"Flake", "Broken Flake", "Plug", "Cake", "Rope", "Coins", "Cube Cut"}
POCO = r"(?:pizca|toque|susurro|punto|poco|algo|chispa|nota|condimento|ligero|ligera)"

def poco_de(t, hoja):
    """La descripción dice que lleva solo un poco de esa hoja."""
    return bool(re.search(POCO + r"[^.,;]{0,25}" + hoja, t))

def mucha(t, hoja):
    return bool(re.search(r"(?:mucha|mucho|abundante|generosa|cargad[ao]|rica en|predomin\w*)[^.,;]{0,20}" + hoja, t)
                or re.search(hoja + r"[^.,;]{0,15}(?:abundante|generos|protagonista|dominante|predomina)", t)
                or re.search(r"\b(?:[2-9]\d)\s?%[^.,;]{0,12}" + hoja, t))

def virginia(t, x):
    # El color solo cuenta si va pegado a «virginia» (así «cavendish negro» o
    # «Black Mallory» no convierten la virginia en oscura).
    cerca = " ".join(re.findall(r"(?:\w+\W+){0,2}virginias?(?:\W+\w+){0,2}", t))
    claro = re.search(r"brillante|dorad|limon|clar[ao]s?|bright|golden|lemon", cerca)
    rojo = re.search(r"\brojo|\broja|\bred\b|madur", cerca)
    marron = re.search(r"marron|brown", cerca)
    oscuro = re.search(r"oscur|\bdark|negr[ao]|\bblack|estufad|stoved|stove", cerca)
    if oscuro and not claro:
        return ["higo", "pasas"], "virginia oscura o estufada"
    if rojo and claro:
        return ["heno", "frutos rojos"], "virginias claras y rojas"
    if rojo:
        return ["frutos rojos", "pan tostado"], "virginia roja"
    if marron:
        return ["nuez", "madera"], "virginia marrón"
    if claro:
        return ["heno", "cítricos"], "virginia clara"
    if x["corte"] in PRENSADO:
        return ["heno", "miel"], "virginia prensada"
    return ["heno", "cítricos"], "virginia"

def proponer(x):
    t = sin_tildes(x["desc"] + " " + x["t"])
    h = set(x["hojas"])
    tipo = x["tipo"]
    bloques, motivos = {}, []

    if "Virginia" in h:
        ns, m = virginia(t, x); bloques["Virginia"] = ns; motivos.append(m)
    if "Latakia" in h:
        if poco_de(t, "latakia"):
            bloques["Latakia"] = ["ahumado"]; motivos.append("poca latakia")
        elif mucha(t, "latakia") or tipo == "Balcánica" or re.search(r"inglesa fuerte|full english", t):
            bloques["Latakia"] = ["ahumado", "cuero", "incienso"]; motivos.append("mucha latakia o balcánica")
        else:
            bloques["Latakia"] = ["ahumado", "cuero"]
    if "Perique" in h:
        dulce = h & {"Cavendish"} or re.search(r"dulce|ciruela", t)
        seca = h & {"Burley", "Kentucky"} and tipo in ("Burley", "Inglesa", "Balcánica")
        if poco_de(t, "perique"):
            bloques["Perique"] = ["pimienta"]; motivos.append("poca perique")
        elif mucha(t, "perique"):
            bloques["Perique"] = ["pimienta", "higo", "ciruela"]; motivos.append("mucha perique")
        elif seca:
            bloques["Perique"] = ["pimienta"]; motivos.append("perique con burley: pimienta")
        elif dulce:
            bloques["Perique"] = ["ciruela", "higo"]; motivos.append("perique con hojas dulces: ciruela")
        else:
            bloques["Perique"] = ["pimienta", "higo"]
    if "Oriental" in h:
        if poco_de(t, "orient"):
            bloques["Oriental"] = ["hierbas aromáticas"]
        elif tipo in ("Balcánica", "Oriental") or mucha(t, "orient"):
            bloques["Oriental"] = ["hierbas aromáticas", "floral", "incienso"]; motivos.append("muchos orientales")
        else:
            bloques["Oriental"] = ["hierbas aromáticas", "floral"]
    if "Burley" in h:
        if re.search(r"tostad|toasted", t):
            bloques["Burley"] = ["nuez", "chocolate"]; motivos.append("burley tostado")
        elif re.search(r"burley oscur|dark burley|burley negro", t):
            bloques["Burley"] = ["nuez", "terroso", "cuero"]; motivos.append("burley oscuro")
        else:
            bloques["Burley"] = ["nuez", "terroso"]
    if "Kentucky" in h:
        bloques["Kentucky"] = ["ahumado", "terroso"] if not poco_de(t, "kentucky") else ["ahumado"]
    if "Cigarro" in h:
        bloques["Cigarro"] = ["terroso", "café"] if not poco_de(t, "cigarro") else ["terroso"]

    # Orden: la hoja que define la mezcla va primero.
    orden = {
        "Inglesa": ["Latakia", "Oriental", "Virginia", "Perique", "Kentucky", "Burley", "Cigarro"],
        "Balcánica": ["Oriental", "Latakia", "Virginia", "Perique", "Kentucky", "Burley", "Cigarro"],
        "Oriental": ["Oriental", "Virginia", "Latakia", "Perique", "Burley", "Kentucky", "Cigarro"],
        "Virginia-Perique": ["Virginia", "Perique", "Oriental", "Burley", "Kentucky", "Latakia", "Cigarro"],
        "Burley": ["Burley", "Kentucky", "Virginia", "Perique", "Oriental", "Latakia", "Cigarro"],
    }.get(tipo, ["Virginia", "Kentucky", "Burley", "Perique", "Oriental", "Latakia", "Cigarro"])
    if tipo == "Virginia" and "Kentucky" in h and re.search(r"kentucky|dark fired|fuego", t):
        orden = ["Virginia", "Kentucky"] + [o for o in orden if o not in ("Virginia", "Kentucky")]

    notas = []
    if tipo == "Lakeland" and not re.search(r"unscented|sin perfum|sin aroma|sin esencia", t):
        notas.append("floral"); motivos.append("Lakeland: aroma floral")
    if re.search(r"\btonka|haba tonka", t):
        notas.append("tonka")
    # Primero una nota de cada hoja (la principal), después las segundas.
    for ronda in range(3):
        for hoja in orden:
            ns = bloques.get(hoja, [])
            if ronda < len(ns) and ns[ronda] not in notas:
                notas.append(ns[ronda])
    notas = notas[:4]
    return notas, "; ".join(motivos)

def main():
    v = leer_fichas()
    ya = {l.split("|")[0] for l in (R / "marcas/notas_naturales.txt").read_text(encoding="utf-8").splitlines()
          if l.strip() and not l.startswith("#")}
    ya |= set(re.findall(r"where id = '(\d+)'", (R / "supabase/50_notas_de_sabor.sql").read_text(encoding="utf-8")))
    filas, sin = [], []
    for i, x in sorted(v.items(), key=lambda kv: (kv[1]["t"].split(" · ")[-1], kv[1]["t"])):
        if x["notas"] or x["tipo"] == "Aromática" or i in ya:
            continue
        notas, motivo = proponer(x)
        if len(notas) < 2:
            sin.append((i, x)); continue
        for n in notas:
            assert n in LISTA, (i, n)
        filas.append((i, x, notas, motivo))

    L = ["# Notas por hojas (herramientas/notas_por_hojas.py). id|notas|motivo"]
    for i, x, notas, motivo in filas:
        L.append(f"{i}|{', '.join(notas)}|{x['t']} · {x['tipo']} · {'/'.join(x['hojas'])}" + (f" · {motivo}" if motivo else ""))
    L.append(""); L.append(f"# Sin nota (no hay hojas que den nota): {len(sin)}")
    L += [f"# {i} {x['t']} · {x['tipo']} · {'/'.join(x['hojas']) or 'sin hojas'}" for i, x in sin]
    (R / "marcas/notas_por_hojas.txt").write_text("\n".join(L) + "\n", encoding="utf-8")

    q = lambda s: "'" + s.replace("'", "''") + "'"
    S = ["-- =====================================================================",
         "-- 57 · Notas de sabor habituales según las hojas (herramientas/notas_por_hojas.py)",
         "-- Mezclas no aromáticas que seguían sin notas. Notas típicas de cada hoja,",
         "-- afinadas con la ficha (color de la virginia, cantidad de latakia o perique...).",
         "-- Ejecutar DESPUÉS del 51. Solo rellena fichas sin ninguna nota; se puede repetir.",
         "-- =====================================================================", ""]
    for i, x, notas, motivo in filas:
        S += [f"-- {i} · {x['t']}" + (f" · {motivo}" if motivo else ""),
              f"update public.tabacos set notas = array[{', '.join(q(n) for n in notas)}]::text[] "
              f"where id = '{i}' and cardinality(notas) = 0;"]
    (R / "supabase/57_notas_por_hojas.sql").write_text("\n".join(S) + "\n", encoding="utf-8")

    p = R / "datos-iniciales.js"
    s = p.read_text(encoding="utf-8"); a = s.index("["); b = s.rindex("]") + 1
    d = json.loads(s[a:b]); by = {str(x["id"]): x for x in d}
    for i, _, notas, _ in filas:
        if i in by and not by[i].get("notas"):
            by[i]["notas"] = notas
    p.write_text(s[:a] + json.dumps(d, ensure_ascii=False) + s[b:], encoding="utf-8")
    print("con notas:", len(filas), "· sin nota:", len(sin))

if __name__ == "__main__":
    main()
