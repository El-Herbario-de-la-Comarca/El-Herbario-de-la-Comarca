"""Genera las fichas de las marcas encontradas en tiendas alemanas (oct. 2026).

Uso: python3 marcas/generar_alemanas.py
Lee marcas/datos_alemanas.py, calcula mezcla y hojas con las reglas de estilo_hojas.py,
añade las fichas (ids desde 2000) a datos-iniciales.js y escribe supabase/09_marcas_alemanas.sql.
Se puede repetir: antes de añadir, quita las fichas con id >= 2000 de una ejecución anterior.

Ojo: no ejecutes marcas/generar.py después de la fase de mezcla y hojas (rehace las fichas
1000+ con los tipos antiguos).
"""
import json
import pathlib
import sys
from collections import Counter

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent
sys.path.insert(0, str(AQUI))
import datos_alemanas as D  # noqa: E402
from estilo_hojas import estilo_de, hojas_de, ESTILOS, HOJAS  # noqa: E402

PRIMER_ID = 2000

MEZCLA = {
    "Inglesa": "de estilo inglés",
    "Balcánica": "de estilo balcánico",
    "Oriental": "de estilo oriental",
    "Virginia": "de la familia Virginia",
    "Virginia-Perique": "de Virginia con perique",
    "Burley": "de la familia Burley",
    "Lakeland": "de estilo Lakeland",
    "Aromática": "aromática",
}
CORTE = {
    "Flake": "prensado y cortado en láminas (flake)",
    "Ribbon": "cortado en tiras finas (ribbon)",
    "Broken Flake": "en láminas desmenuzadas (broken flake)",
    "Plug": "prensado en barra (plug)",
    "Rope": "retorcido en cuerda (rope)",
    "Coins": "cortado en rodajas (coins)",
    "Cake": "prensado en torta (cake)",
    "Cube Cut": "cortado en cubos (cube cut)",
    "Shag": "cortado muy fino (shag)",
    "Ready Rubbed": "desmenuzado y listo para cargar (ready rubbed)",
}
HOJA_TXT = {
    "Virginia": "virginia", "Burley": "burley", "Oriental": "orientales", "Latakia": "latakia",
    "Perique": "perique", "Kentucky": "kentucky", "Cavendish": "cavendish", "Cigarro": "hoja de cigarro",
}


def lista_es(partes):
    partes = [p for p in partes if p]
    if len(partes) <= 1:
        return "".join(partes)
    return ", ".join(partes[:-1]) + " y " + partes[-1]


def formato_texto(formato):
    if not formato:
        return ""
    partes = [p.strip() for p in formato.split("·")]
    partes = [p[0].lower() + p[1:] if p.lower().startswith(("a granel", "bolsa", "bote", "lata")) else p for p in partes]
    return ("Formatos: " if len(partes) > 1 else "Formato: ") + lista_es(partes) + "."


def descripcion(nombre, marca, mezcla, hojas, corte, formato, extra):
    if mezcla == "Sin mezclar":
        frase = f"{nombre} es un tabaco para mezclar de {marca}"
    else:
        frase = f"{nombre} es una mezcla"
        if mezcla:
            frase += " " + MEZCLA[mezcla]
        frase += f" de {marca}"
    if corte:
        frase += ", " + CORTE[corte]
    frase += "."
    trozos = [frase]
    if hojas:
        trozos.append("Lleva " + lista_es([HOJA_TXT[h] for h in hojas]) + ".")
    if extra:
        trozos.append(extra.strip())
    if not mezcla and not corte:
        trozos.append("Todavía no tenemos datos fiables de mezcla ni de corte.")
    f = formato_texto(formato)
    if f:
        trozos.append(f)
    return " ".join(trozos)


def main():
    ruta_js = RAIZ / "datos-iniciales.js"
    js = ruta_js.read_text(encoding="utf-8")
    pre, cuerpo = js.split("window.DATOS_INICIALES = ", 1)
    datos = json.loads(cuerpo.strip().rstrip(";"))
    base = [d for d in datos if int(d["id"]) < PRIMER_ID]
    espana = {str(d["id"]) for d in datos if d.get("en_espana")}   # se conserva la marca de España (SQL 16-17)
    notas_previas = {str(d["id"]): d.get("notas") or [] for d in datos}   # se conservan las notas de sabor (SQL 44)
    claves = {(d["nombre"].lower(), d["marca"].lower()) for d in base}
    nombres_base = Counter(d["nombre"].lower() for d in base)

    nuevas, avisos, siguiente = [], [], PRIMER_ID
    for marca, filas in list(D.MARCAS.items()) + list(getattr(D, "EXTRA", [])):
        for nombre, familia, comp, corte, formato, extra, fuente in filas:
            assert corte in CORTE or corte == "", (marca, nombre, corte)
            clave = (nombre.lower(), marca.lower())
            if clave in claves:
                raise SystemExit(f"Ficha repetida: {nombre} · {marca}")
            claves.add(clave)
            if nombres_base[nombre.lower()]:
                avisos.append(f"mismo nombre en otra marca: {marca} | {nombre}")
            hojas = hojas_de(comp)
            mezcla = ""
            if familia:
                mezcla, _ = estilo_de(familia, hojas, nombre, fuente, "")
                if mezcla is None:
                    raise SystemExit(f"Familia sin traducir: {familia} ({marca} | {nombre})")
            assert mezcla in ESTILOS or mezcla == "" and all(h in HOJAS for h in hojas)
            desc = descripcion(nombre, marca, mezcla, hojas, corte, formato, extra)
            assert len(nombre) <= 120 and len(marca) <= 80 and len(desc) <= 2000 and len(formato) <= 80, (marca, nombre)
            nuevas.append({
                "nombre": nombre, "marca": marca, "pais": D.PAIS.get(marca, ""), "tipo": mezcla, "corte": corte,
                "formato": formato, "desc": desc, "fuerza": 0, "notas": notas_previas.get(str(siguiente), []), "id": siguiente,
                "descripcion": desc, "hojas": hojas, "en_espana": str(siguiente) in espana,
            })
            siguiente += 1

    ruta_js.write_text(pre + "window.DATOS_INICIALES = " + json.dumps(base + nuevas, ensure_ascii=False) + ";\n",
                       encoding="utf-8")

    def q(v):
        return "'" + str(v).replace("'", "''") + "'"

    filas_sql = [
        f"({q(d['id'])},{q(d['nombre'])},{q(d['marca'])},{q(d['pais'])},{q(d['tipo'])},{q(d['corte'])},"
        f"{q(d['formato'])},{q(d['descripcion'])},0,'{{}}'::text[],'',"
        f"array[{', '.join(q(h) for h in d['hojas'])}]::text[])"
        for d in nuevas
    ]
    sql = (
        f"-- El herbario de la Comarca · Marcas de las tiendas alemanas ({len(nuevas)} fichas)\n"
        "-- Ejecútalo en Supabase → SQL Editor DESPUÉS de 04_estilo_y_hojas.sql. Si una ficha ya existe, no se toca.\n"
        "insert into public.tabacos (id, nombre, marca, pais, tipo, corte, formato, descripcion, fuerza, notas, foto, hojas) values\n"
        + ",\n".join(filas_sql)
        + "\non conflict (id) do nothing;\n"
    )
    (RAIZ / "supabase" / "09_marcas_alemanas.sql").write_text(sql, encoding="utf-8")

    print(f"Fichas base: {len(base)} · nuevas: {len(nuevas)} · total: {len(base) + len(nuevas)}")
    for m, n in Counter(d["marca"] for d in nuevas).most_common():
        print(f"  {m}: {n}")
    print(Counter(d["tipo"] or "(sin dato)" for d in nuevas))
    for a in avisos:
        print("  AVISO", a)
    for est in ("Balcánica", "Lakeland"):
        filas = [d for d in nuevas if d["tipo"] == est]
        if filas:
            print(f"== {est} ==")
            for d in filas:
                print(f"  {d['id']} {d['marca']} | {d['nombre']} | {', '.join(d['hojas'])}")


if __name__ == "__main__":
    main()
