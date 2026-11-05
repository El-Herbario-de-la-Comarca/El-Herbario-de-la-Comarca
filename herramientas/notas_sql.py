#!/usr/bin/env python3
"""Notas de sabor por tandas: lista de pendientes y SQL.

Uso:
  python3 herramientas/notas_sql.py pendientes
      Escribe marcas/notas_pendientes_naturales.txt: fichas NO aromáticas sin notas
      (según las páginas f/ publicadas), quitando las ya apuntadas en
      marcas/notas_naturales.txt y marcas/notas_naturales_sin.txt. Agrupadas por marca.
  python3 herramientas/notas_sql.py sql
      Valida marcas/notas_naturales.txt y genera supabase/51_notas_naturales.sql.
      También rellena las notas en datos-iniciales.js (copia de respaldo).

Formato de marcas/notas_naturales.txt (una línea por ficha):
  id|nota1,nota2,...|fuente
  2000|pan tostado,cítricos|Smokingpipes 12345 (descripción: «bright citrus, toast»)
Formato de marcas/notas_naturales_sin.txt (revisadas sin nota): texto libre, empezando por el id.
  2004 Khartoum (Smokingpipes 6789: sin sabores en la descripción)
"""
import glob, html, json, re, sys
from collections import defaultdict
from pathlib import Path

R = Path(__file__).resolve().parent.parent
RES = R / "marcas/notas_naturales.txt"
SIN = R / "marcas/notas_naturales_sin.txt"

LISTA = {
    # lista cerrada (claude/notas-de-sabor.md)
    "miel", "caramelo", "azúcar moreno", "vainilla", "chocolate", "regaliz",
    "cítricos", "frutos rojos", "cereza", "ciruela", "pasas", "higo", "melocotón", "manzana", "granada",
    "nuez", "avellana", "almendra", "pan tostado", "bizcocho", "café",
    "pimienta", "especias dulces", "anís", "tonka",
    "heno", "hierba", "té", "floral", "hierbas aromáticas",
    "terroso", "cuero", "madera", "cedro", "tabaco curado",
    "ahumado", "incienso", "hoguera",
    "whisky", "ron", "vino", "licor",
    "vinagre", "fermentado",
    # ya en uso en la web
    "frutas tropicales", "arce", "ciruela mirabel", "albaricoque", "turrón", "frutos secos",
}

def vivo():
    out = {}
    for p in glob.glob(str(R / "f/*.html")):
        i = Path(p).stem
        if not i.isdigit():
            continue
        s = open(p, encoding="utf-8").read()
        m = re.search(r"<dt>Notas de sabor</dt><dd>(.*?)</dd>", s)
        notas = re.findall(r'chip sabor">(.*?)<', m.group(1)) if m else []
        t = html.unescape(re.search(r"<title>(.*?)</title>", s).group(1)).split(" · El herbario")[0]
        mz = re.search(r'<span class="d-dato-l">Mezcla</span><span class="d-dato-v">(.*?)</span></div>', s)
        tipo = html.unescape(re.sub("<[^>]+>", "", mz.group(1))) if mz else ""
        out[i] = dict(t=t, notas=notas, tipo=tipo)
    return out

def leer_res():
    filas = []
    if RES.exists():
        for n, l in enumerate(RES.read_text(encoding="utf-8").splitlines(), 1):
            if not l.strip() or l.startswith("#"):
                continue
            partes = l.split("|", 2)
            if len(partes) != 3:
                sys.exit(f"Línea {n} mal formada: {l}")
            filas.append(partes)
    return filas

def pendientes():
    v = vivo()
    hechos = {f[0] for f in leer_res()}
    if SIN.exists():
        hechos |= {l.split()[0] for l in SIN.read_text(encoding="utf-8").splitlines() if l.strip()}
    por_marca = defaultdict(list)
    for i, x in v.items():
        if not x["notas"] and x["tipo"] != "Aromática" and i not in hechos:
            marca = x["t"].split(" · ")[-1]
            por_marca[marca].append((int(i), x["t"].split(" · ")[0], x["tipo"]))
    L, total = [], 0
    for marca in sorted(por_marca, key=lambda m: (-len(por_marca[m]), m)):
        L.append(f"## {marca} ({len(por_marca[marca])})")
        for i, nombre, tipo in sorted(por_marca[marca]):
            L.append(f"{i} | {nombre} | {tipo or 'sin mezcla'}")
            total += 1
        L.append("")
    (R / "marcas/notas_pendientes_naturales.txt").write_text(
        f"# Fichas no aromáticas sin notas pendientes de revisar: {total}\n\n" + "\n".join(L), encoding="utf-8")
    print("pendientes:", total)

def sql():
    v = vivo()
    filas, vistos, errores = leer_res(), set(), []
    for i, notas, src in filas:
        if i not in v:
            errores.append(f"{i}: id que no existe")
        if i in vistos:
            errores.append(f"{i}: repetido")
        vistos.add(i)
        ns = [x.strip() for x in notas.split(",") if x.strip()]
        if not 1 <= len(ns) <= 5:
            errores.append(f"{i}: entre 1 y 5 notas")
        for x in ns:
            if x not in LISTA:
                errores.append(f"{i}: «{x}» no está en la lista")
        if not src.strip():
            errores.append(f"{i}: falta la fuente")
    if errores:
        sys.exit("Errores:\n" + "\n".join(errores))
    q = lambda s: "'" + s.replace("'", "''") + "'"
    L = ["-- =====================================================================",
         "-- 51 · Notas de sabor de mezclas no aromáticas (generado con herramientas/notas_sql.py)",
         "-- Solo sabores que la descripción del fabricante o de la tienda dice expresamente.",
         "-- Solo rellena fichas sin ninguna nota. Se puede ejecutar varias veces.",
         "-- =====================================================================", ""]
    # Fichas que ya rellena el SQL 50: no se repiten aquí.
    s50 = set(re.findall(r"where id = '(\d+)'", (R / "supabase/50_notas_de_sabor.sql").read_text(encoding="utf-8")))
    n = 0
    for i, notas, src in filas:
        if v[i]["notas"] or i in s50:
            continue
        ns = [x.strip() for x in notas.split(",") if x.strip()]
        arr = "array[" + ", ".join(q(x) for x in ns) + "]::text[]"
        L += [f"-- {i} · {v[i]['t']} · {src}",
              f"update public.tabacos set notas = {arr} where id = '{i}' and cardinality(notas) = 0;"]
        n += 1
    (R / "supabase/51_notas_naturales.sql").write_text("\n".join(L) + "\n", encoding="utf-8")
    p = R / "datos-iniciales.js"
    s = p.read_text(encoding="utf-8"); a = s.index("["); b = s.rindex("]") + 1
    d = json.loads(s[a:b]); by = {str(x["id"]): x for x in d}
    for i, notas, _ in filas:
        if not v[i]["notas"] and i in by and not by[i].get("notas"):
            by[i]["notas"] = [x.strip() for x in notas.split(",") if x.strip()]
    p.write_text(s[:a] + json.dumps(d, ensure_ascii=False) + s[b:], encoding="utf-8")
    print("fichas en el SQL 51:", n)

if __name__ == "__main__":
    {"pendientes": pendientes, "sql": sql}.get(sys.argv[1] if len(sys.argv) > 1 else "", lambda: sys.exit(__doc__))()
