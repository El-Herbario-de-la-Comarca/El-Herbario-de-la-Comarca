# Convierte los datos leídos de Smokingpipes (familia y componentes de cada mezcla)
# en el estilo y las hojas del herbario, y genera:
#   - supabase/04_estilo_y_hojas.sql (sección de datos)
#   - datos-iniciales.js (copia de respaldo con estilo y hojas)
#
# Uso: python3 marcas/estilo_hojas.py <resultados.json> [correcciones.tsv]
#   resultados.json: { id: {Family, Components, Flavoring, ...} } leído de Smokingpipes
#   correcciones.tsv: id|estilo|hojas|fuente  (manda sobre lo anterior; hojas separadas por comas)
import json, re, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ESTILOS = ["Inglés", "Oriental", "Virginia", "Virginia-Perique", "Burley", "Americano", "Aromático", "Componente"]
HOJAS = ["Virginia", "Burley", "Oriental", "Latakia", "Perique", "Kentucky", "Cavendish", "Cigarro"]

FAMILIA = {
    "english": "Inglés", "balkan": "Inglés", "scottish": "Inglés",
    "oriental": "Oriental", "turkish": "Oriental", "oriental/turkish": "Oriental",
    "virginia": "Virginia", "virginia/perique": "Virginia-Perique", "virginia perique": "Virginia-Perique", "vaper": "Virginia-Perique",
    "burley": "Burley", "kentucky": "Burley", "virginia/burley": "Burley", "virginia burley": "Burley",
    "american": "Americano",
    "aromatic": "Aromático", "english aromatic": "Aromático", "aromatic english": "Aromático",
    "blending": "Componente", "blending tobacco": "Componente", "component": "Componente",
}
REGLAS_HOJAS = [
    ("Virginia", r"virginia"),
    ("Burley", r"burley"),
    ("Oriental", r"oriental|turkish|izmir|basma|katerini|smyrna|yenidje|samsun|xanthi|drama|macedonian|bulgarian|greek|syrian"),
    ("Latakia", r"latakia"),
    ("Perique", r"perique"),
    ("Kentucky", r"kentucky|dark.?fired|fire.?cured"),
    ("Cavendish", r"cavendish"),
    ("Cigarro", r"cigar"),
]


def hojas_de(componentes):
    c = (componentes or "").lower()
    return [h for h, rx in REGLAS_HOJAS if re.search(rx, c)]


def estilo_de(familia, hojas):
    f = re.sub(r"\s+", " ", (familia or "").lower()).strip()
    e = FAMILIA.get(f)
    if e is None and f:
        if "aromatic" in f: e = "Aromático"
        elif "english" in f or "balkan" in f: e = "Inglés"
        elif "perique" in f: e = "Virginia-Perique"
        elif "oriental" in f or "turkish" in f: e = "Oriental"
        elif "blend" in f: e = "Componente"
    if e == "Virginia" and "Perique" in hojas:
        e = "Virginia-Perique"
    return e


def main():
    res = json.loads(pathlib.Path(sys.argv[1]).read_text())
    corr = {}
    if len(sys.argv) > 2:
        for linea in pathlib.Path(sys.argv[2]).read_text().splitlines():
            if not linea.strip() or linea.startswith("#"): continue
            i, e, h, *_ = linea.split("|")
            corr[i.strip()] = (e.strip(), [x.strip() for x in h.split(",") if x.strip()])

    js = (RAIZ / "datos-iniciales.js").read_text()
    pre, cuerpo = js.split("window.DATOS_INICIALES = ", 1)
    datos = json.loads(cuerpo.strip().rstrip(";"))

    nuevo, sin, raras = {}, [], set()
    for d in datos:
        i = str(d["id"])
        if i in corr:
            nuevo[i] = corr[i]; continue
        r = res.get(i)
        if not r:
            sin.append(d); continue
        h = hojas_de(r.get("Components"))
        e = estilo_de(r.get("Family"), h)
        if e is None:
            raras.add(r.get("Family")); sin.append(d); continue
        nuevo[i] = (e, h)

    for i, (e, h) in nuevo.items():
        assert e in ESTILOS, (i, e)
        assert all(x in HOJAS for x in h), (i, h)

    # Copia de respaldo
    for d in datos:
        i = str(d["id"])
        if i in nuevo:
            d["tipo"], d["hojas"] = nuevo[i][0], nuevo[i][1]
        else:
            d["tipo"] = d["tipo"] if d["tipo"] in ESTILOS else ""
            d.setdefault("hojas", [])
    (RAIZ / "datos-iniciales.js").write_text(pre + "window.DATOS_INICIALES = " + json.dumps(datos, ensure_ascii=False) + ";\n")

    # SQL
    sql = (RAIZ / "supabase" / "04_estilo_y_hojas.sql").read_text()
    marca = "-- (Se rellena con los datos de fabricante y tiendas.)\n"
    cab = sql.split(marca)[0] + marca if marca in sql else sql.split("-- DATOS")[0]
    q = lambda s: "'" + s.replace("'", "''") + "'"
    filas = ",\n".join(f"  ({q(str(i))}, {q(e)}, array[{', '.join(q(x) for x in h)}]::text[])"
                       for i, (e, h) in sorted(nuevo.items(), key=lambda kv: int(kv[0])))
    ids_sin = [str(d["id"]) for d in sin]
    sql = cab + "-- DATOS\n" + f"""update public.tabacos t set tipo = v.estilo, hojas = v.hojas
from (values
{filas}
) as v(id, estilo, hojas)
where t.id = v.id;

-- Fichas sin dato fiable: se deja el estilo vacío si el antiguo ya no existe.
update public.tabacos set tipo = ''
where tipo not in ({', '.join(q(e) for e in ESTILOS)});
"""
    (RAIZ / "supabase" / "04_estilo_y_hojas.sql").write_text(sql)

    from collections import Counter
    print("clasificadas:", len(nuevo), "sin dato:", len(sin))
    print(Counter(e for e, _ in nuevo.values()))
    print(Counter(x for _, h in nuevo.values() for x in h))
    if raras: print("familias sin traducir:", raras)
    for d in sin: print("  SIN", d["id"], d["marca"], "|", d["nombre"])


if __name__ == "__main__":
    main()
