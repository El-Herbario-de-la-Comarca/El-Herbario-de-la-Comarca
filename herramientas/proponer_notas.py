#!/usr/bin/env python3
"""Pasada rápida de notas de sabor.

Lee las descripciones de datos-iniciales.js, busca palabras de sabor y aroma
y escribe propuestas para revisar. No cambia ninguna ficha.

Uso:
    python3 herramientas/proponer_notas.py
Salida:
    marcas/notas_propuestas.csv  (id, marca, nombre, tipo, notas actuales,
                                  propuestas, fragmentos donde aparecen)
    marcas/notas_propuestas.md   (resumen legible por marca)

Las notas son texto libre: el diccionario solo sirve para reconocerlas en la
descripción. No se deducen notas de las hojas (latakia ≠ «ahumado»): solo
cuenta lo que la descripción dice expresamente.
"""
import csv, json, re, sys, unicodedata
from collections import Counter, defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# nota propuesta → patrones (regex sobre texto en minúsculas y sin tildes).
# Orden importa: los compuestos van antes que sus partes.
NOTAS = [
    ("ciruela mirabel", [r"ciruelas? mirabel"]),
    ("ciruela", [r"ciruelas?(?! mirabel)", r"fruta de hueso oscura"]),
    ("frutos rojos", [r"frutos? rojos", r"frutos del bosque", r"bayas"]),
    ("frutos secos", [r"frutos secos"]),
    ("fruta pasa", [r"frutas? secas?", r"\bpasas\b"]),
    ("cereza", [r"cerezas?", r"\bcherry\b"]),
    ("vainilla", [r"vainilla", r"\bvanilla\b", r"cumarina"]),
    ("miel", [r"\bmiel\b", r"\bhoney\b"]),
    ("caramelo", [r"caramel"]),
    ("chocolate", [r"chocolate", r"cacao", r"\bmoca\b"]),
    ("café", [r"\bcafe\b", r"capuchino", r"espresso"]),
    ("arce", [r"\barce\b", r"\bmaple\b"]),
    ("azúcar moreno", [r"azucar moreno", r"melaza"]),
    ("regaliz", [r"regaliz"]),
    ("anís", [r"\banis\b"]),
    ("nata", [r"\bnata\b", r"\bcrema\b(?! de)"]),
    ("ron", [r"\bron\b", r"\brum\b"]),
    ("whisky", [r"whisk(?:e)?y", r"bourbon(?! vanilla)", r"\bmalta\b"]),
    ("coñac", [r"conac", r"brandy", r"cognac"]),
    ("jerez", [r"\bjerez\b", r"\bsherry\b"]),
    ("vino", [r"\bvinos?\b", r"champan", r"oporto"]),
    ("licor", [r"licor(?!ice)", r"amaretto", r"frangelico", r"irish mist"]),
    ("cítricos", [r"citric", r"naranja", r"limon", r"bergamota", r"mandarina"]),
    ("manzana", [r"manzanas?"]),
    ("melocotón", [r"melocoton", r"albaricoque"]),
    ("higo", [r"\bhigos?\b"]),
    ("uva", [r"\buvas?\b"]),
    ("frutas tropicales", [r"tropical", r"mango", r"maracuya", r"\bpina\b", r"lichi", r"coco\b"]),
    ("grosella negra", [r"grosella"]),
    ("frambuesa", [r"frambuesa"]),
    ("mora", [r"\bmoras?\b"]),
    ("fresa", [r"\bfresas?\b"]),
    ("nuez", [r"\bnuez\b", r"\bnueces\b"]),
    ("avellana", [r"avellana"]),
    ("almendra", [r"almendra"]),
    ("pistacho", [r"pistacho"]),
    ("pan tostado", [r"pan tostado", r"cereal tostado", r"\btostadas?\b", r"tostado de (?:pan|cereal)"]),
    ("especias", [r"especia(?!da)", r"especiad"]),
    ("canela", [r"canela"]),
    ("clavo", [r"\bclavo\b"]),
    ("pimienta", [r"pimienta"]),
    ("tonka", [r"tonka"]),
    ("cilantro", [r"cilantro"]),
    ("floral", [r"floral", r"\bflores?\b", r"\brosa\b", r"lavanda"]),
    ("heno", [r"\bheno\b"]),
    ("hierba", [r"\bhierba\b", r"herbal"]),
    ("té", [r"\bte\b(?= negro| verde)"]),
    ("terroso", [r"terros", r"\btierra\b"]),
    ("cuero", [r"\bcuero\b"]),
    ("madera", [r"madera(?!s? de cedro)"]),
    ("cedro", [r"cedro"]),
    ("resina", [r"resina", r"\bpino\b"]),
    ("ahumado", [r"ahumad", r"\bhumo\b"]),
    ("hoguera", [r"hoguera"]),
    ("incienso", [r"incienso"]),
    ("malta", [r"\bmalta\b"]),
    ("lúpulo", [r"lupulo"]),
    ("fermentado", [r"fermentad"]),
]

# Si una de estas palabras va justo antes (hasta 3 palabras), no cuenta.
NEGACION = re.compile(r"\b(sin|nada de|ni|no lleva|no tiene)\b(\s+\w+){0,3}\s*$")
# Frases genéricas que dan falsos positivos.
FALSOS = [
    r"serie kopp wood[^.]*cada mezcla lleva el aroma de una madera",  # la madera concreta va después
    r"cavendish negro sin endulzar",
]


def plano(s):
    # Carácter a carácter, para que las posiciones coincidan con el original.
    return "".join(unicodedata.normalize("NFD", c)[0] for c in s.lower())


def cargar():
    t = (RAIZ / "datos-iniciales.js").read_text(encoding="utf-8")
    return json.loads(t[t.index("["): t.rindex("]") + 1])


def proponer(desc):
    texto = plano(desc)
    for f in FALSOS:
        texto = re.sub(f, lambda m: " " * len(m.group()), texto)
    encontradas, fragmentos = [], []
    for nota, patrones in NOTAS:
        for p in patrones:
            for m in re.finditer(p, texto):
                antes = texto[max(0, m.start() - 40): m.start()]
                if NEGACION.search(antes):
                    continue
                if nota not in encontradas:
                    encontradas.append(nota)
                    a, b = max(0, m.start() - 35), min(len(texto), m.end() + 25)
                    fragmentos.append(f"{nota}: …{desc[a:b].strip()}…")
                break
            if nota in encontradas:
                break
    # «malta» sola suele venir de «whisky de malta»: no duplicar.
    if "malta" in encontradas and "whisky" in encontradas:
        i = encontradas.index("malta"); encontradas.pop(i); fragmentos.pop(i)
    return encontradas, fragmentos


def main():
    fichas = cargar()
    filas, por_marca, cuenta = [], defaultdict(list), Counter()
    for f in fichas:
        desc = f.get("descripcion") or f.get("desc") or ""
        actuales = f.get("notas") or []
        if actuales:  # las notas puestas a mano no se tocan
            continue
        prop, frag = proponer(desc)
        nuevas = [n for n in prop if plano(n) not in {plano(a) for a in actuales}]
        if not nuevas:
            continue
        cuenta.update(nuevas)
        filas.append([f["id"], f["marca"], f["nombre"], f.get("tipo", ""),
                      "; ".join(actuales), "; ".join(nuevas), " | ".join(frag)])
        por_marca[f["marca"]].append((f, actuales, nuevas))

    with open(RAIZ / "marcas/notas_propuestas.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["id", "marca", "nombre", "tipo", "notas_actuales", "propuestas", "fragmentos"])
        w.writerows(filas)

    sin_notas = sum(1 for f in fichas if not f.get("notas"))
    nuevas_con = sum(1 for r in filas if not r[4])
    md = [f"# Propuestas de notas de sabor\n",
          f"Fichas: {len(fichas)} · con notas ya: {len(fichas) - sin_notas} · "
          f"con propuestas: {len(filas)} (de ellas {nuevas_con} hoy vacías)\n",
          "Notas más propuestas: " + ", ".join(f"{n} ({c})" for n, c in cuenta.most_common(15)) + "\n"]
    for marca in sorted(por_marca):
        md.append(f"\n## {marca}\n")
        for f, act, nuevas in por_marca[marca]:
            extra = f" (ya tiene: {', '.join(act)})" if act else ""
            md.append(f"- {f['id']} · {f['nombre']}: **{', '.join(nuevas)}**{extra}")
    (RAIZ / "marcas/notas_propuestas.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(md[1].strip()); print(md[2].strip())


if __name__ == "__main__":
    sys.exit(main())
