"""Genera las fichas nuevas y los archivos de datos de la web.

Uso: python3 generar.py
Lee datos_nuevos.py, añade las fichas a datos-iniciales.js y escribe supabase/03_marcas_nuevas.sql.
"""
import json
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent
sys.path.insert(0, str(AQUI))
import datos_nuevos as D  # noqa: E402

TIPO = {
    "Virginia": "de la familia Virginia",
    "Burley": "de la familia Burley",
    "Aromático": "aromática",
    "Inglés": "de estilo inglés",
    "Oriental": "de estilo oriental",
    "Cavendish": "de la familia Cavendish",
    "Para mezclas": "clasificada como tabaco para mezclar",
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


def descripcion(nombre, marca, tipo, corte, formato, extra):
    frase = f"{nombre} es una mezcla"
    if tipo:
        frase += " " + TIPO[tipo]
    frase += f" de {marca}"
    if corte:
        frase += ", " + CORTE[corte]
    frase += "."
    trozos = [frase]
    if extra:
        trozos.append(extra.strip())
    if not tipo and not corte:
        trozos.append("Todavía no tenemos datos fiables de familia ni de corte.")
    f = formato_texto(formato)
    if f:
        trozos.append(f)
    return " ".join(trozos)


def cargar_existentes():
    s = (RAIZ / "datos-iniciales.js").read_text(encoding="utf-8")
    return json.loads(s[s.index("["): s.rindex("]") + 1])


def main():
    existentes = cargar_existentes()
    # Quita fichas añadidas por una ejecución anterior de este script (ids >= 1000)
    base = [d for d in existentes if int(d["id"]) < 1000]
    claves = {(d["nombre"].lower(), d["marca"].lower()) for d in base}
    nuevas, siguiente = [], 1000
    for marca, filas in D.MARCAS.items():
        for fila in filas:
            nombre, tipo, corte, formato, extra = fila[:5]
            pais = fila[5] if len(fila) > 5 else D.PAIS.get(marca, "")
            assert tipo in TIPO or tipo == "", (marca, nombre, tipo)
            assert corte in CORTE or corte == "", (marca, nombre, corte)
            clave = (nombre.lower(), marca.lower())
            if clave in claves:
                raise SystemExit(f"Ficha repetida: {nombre} · {marca}")
            claves.add(clave)
            desc = descripcion(nombre, marca, tipo, corte, formato, extra)
            assert len(nombre) <= 120 and len(marca) <= 80 and len(desc) <= 2000 and len(formato) <= 80
            nuevas.append({
                "nombre": nombre, "marca": marca, "pais": pais, "tipo": tipo, "corte": corte,
                "formato": formato, "desc": desc, "fuerza": 0, "notas": [], "id": siguiente,
                "descripcion": desc,
            })
            siguiente += 1

    todas = base + nuevas
    (RAIZ / "datos-iniciales.js").write_text(
        "// Copia de respaldo del catálogo: se usa si la base de datos no está configurada o no responde.\n"
        "window.DATOS_INICIALES = " + json.dumps(todas, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )

    def q(v):
        return "'" + str(v).replace("'", "''") + "'"

    filas_sql = [
        f"({q(d['id'])},{q(d['nombre'])},{q(d['marca'])},{q(d['pais'])},{q(d['tipo'])},{q(d['corte'])},"
        f"{q(d['formato'])},{q(d['descripcion'])},0,'{{}}'::text[],'')"
        for d in nuevas
    ]
    sql = (
        f"-- El herbario de la Comarca · Marcas nuevas ({len(nuevas)} fichas de {len(D.MARCAS)} marcas)\n"
        "-- Ejecútalo DESPUÉS de 01_esquema.sql y 02_datos.sql. Si una ficha ya existe, no se toca.\n"
        "insert into public.tabacos (id, nombre, marca, pais, tipo, corte, formato, descripcion, fuerza, notas, foto) values\n"
        + ",\n".join(filas_sql)
        + "\non conflict (id) do nothing;\n"
    )
    (RAIZ / "supabase" / "03_marcas_nuevas.sql").write_text(sql, encoding="utf-8")

    print(f"Fichas existentes: {len(base)} · nuevas: {len(nuevas)} · total: {len(todas)}")
    from collections import Counter
    for m, n in Counter(d["marca"] for d in nuevas).most_common():
        print(f"  {m}: {n}")


if __name__ == "__main__":
    main()
