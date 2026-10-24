# Convierte los datos leídos de Smokingpipes (familia y componentes de cada mezcla)
# en el estilo y las hojas del herbario, y genera:
#   - supabase/04_estilo_y_hojas.sql (sección de datos)
#   - datos-iniciales.js (copia de respaldo con estilo y hojas)
#
# Uso: python3 marcas/estilo_hojas.py <resultados.json> [correcciones.tsv]
# Al final imprime las listas de Balcánicas y Lakeland para revisarlas.
#   resultados.json: { id: {Family, Components, Flavoring, ...} } leído de Smokingpipes
#   correcciones.tsv: id|estilo|hojas|fuente  (manda sobre lo anterior; hojas separadas por comas;
#                     si las hojas van vacías se calculan con los componentes)
import json, re, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ESTILOS = ["Inglesa", "Balcánica", "Oriental", "Virginia", "Virginia-Perique", "Burley", "Lakeland", "Aromática", "Sin mezclar"]
HOJAS = ["Virginia", "Burley", "Oriental", "Latakia", "Perique", "Kentucky", "Cavendish", "Cigarro"]

# Familia tal como viene de la fuente (Smokingpipes o Tobacco Reviews) -> mezcla base.
# Balkan y Oriental ya no se reducen a Inglesa o Virginia: tienen mezcla propia.
FAMILIA = {
    "english": "Inglesa", "scottish": "Inglesa", "virginia/latakia": "Inglesa",
    "balkan": "Balcánica",
    "oriental": "Oriental", "turkish": "Oriental", "oriental/turkish": "Oriental",
    "virginia": "Virginia", "virginia based": "Virginia", "straight virginia": "Virginia",
    "virginia/perique": "Virginia-Perique", "virginia perique": "Virginia-Perique", "vaper": "Virginia-Perique",
    "burley": "Burley", "burley based": "Burley", "kentucky": "Burley",
    "virginia/burley": "Burley", "virginia burley": "Burley", "american": "Burley",
    "aromatic": "Aromática", "english aromatic": "Aromática", "aromatic english": "Aromática",
    "cavendish based": "Aromática", "dutch-style": "Aromática",
    "blending": "Sin mezclar", "blending tobacco": "Sin mezclar", "component": "Sin mezclar",
}

# Lakeland comprobadas en la descripción de Smokingpipes (esencias del Lake District,
# floral, rosa, tonka/tonquin). Ver marcas/TRASPASO.md.
LAKELAND = {
    "14",   # SG Cob Plug: tonka
    "20",   # SG Grousemoor: esencias Lake District
    "21",   # SG Grousemoor Plug
    "22",   # SG Kendal Cream Flake: esencias estilo Lakeland
    "27",   # SG 1792 Flake: tonquin
    "292",  # GH Ennerdale Flake: esencias florales
    "322",  # GH Ennerdale Mixture
    "384",  # GH Ennerdale Flake Burnt Ends: floral
    "305",  # GH Bosun Cut Plug: floral, clavo y rosa
    "306",  # GH Bosun Plug: floral, clavo y rosa
    "315",  # GH Coniston Cut Plug: esencia floral
    "385",  # GH Grasmere Flake: geranio rosa
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


def estilo_de(familia, hojas, nombre="", src="", i=""):
    """Devuelve (mezcla, motivo). Orden de las reglas acordadas con el usuario."""
    f = re.sub(r"\s+", " ", (familia or "").lower()).strip()
    texto = f"{nombre} {src}".lower()
    e = FAMILIA.get(f)
    if e is None and f:
        if "aromatic" in f: e = "Aromática"
        elif "balkan" in f: e = "Balcánica"
        elif "english" in f: e = "Inglesa"
        elif "perique" in f: e = "Virginia-Perique"
        elif "oriental" in f or "turkish" in f: e = "Oriental"
        elif "blend" in f: e = "Sin mezclar"
    if e is None:
        return None, "familia sin traducir"

    # Sin mezclar: tabacos para mezclar y fichas «Pure».
    if e == "Sin mezclar" or re.match(r"pure\b", nombre.lower()):
        return "Sin mezclar", "para mezclar"
    # Lakeland: lista comprobada, marca LAKELAND en la fuente o tonka.
    if i in LAKELAND or "lakeland" in texto or re.search(r"tonka|tonquin", texto):
        return "Lakeland", "lakeland"
    if e == "Aromática":
        return e, "familia"

    lat, ori, va = "Latakia" in hojas, "Oriental" in hojas, "Virginia" in hojas
    # Balcánica: familia Balkan, «Balkan» en el nombre o la fuente,
    # o latakia con orientales sin virginia (solo en familias inglesas).
    if e == "Balcánica":
        return e, "familia Balkan"
    if e == "Inglesa" and "balkan" in texto:
        return "Balcánica", "Balkan en el nombre"
    if e == "Inglesa" and lat and ori and not va:
        return "Balcánica", "latakia y orientales sin virginia"
    # Inglesa por componentes: virginia con orientales (con o sin latakia),
    # o virginia con latakia sin orientales (p. ej. Mac Baren 428).
    if e in ("Virginia", "Virginia-Perique") and va and (ori or lat):
        return "Inglesa", "virginia con orientales o latakia"
    if e == "Virginia" and "Perique" in hojas:
        return "Virginia-Perique", "virginia con perique"
    return e, "familia"


def main():
    res = json.loads(pathlib.Path(sys.argv[1]).read_text())
    corr = {}
    if len(sys.argv) > 2:
        for linea in pathlib.Path(sys.argv[2]).read_text().splitlines():
            if not linea.strip() or linea.startswith("#"): continue
            i, e, h, *_ = linea.split("|")
            corr[i.strip()] = (e.strip(), [x.strip() for x in h.split(",") if x.strip()])  # hojas vacías: se calculan

    js = (RAIZ / "datos-iniciales.js").read_text()
    pre, cuerpo = js.split("window.DATOS_INICIALES = ", 1)
    datos = json.loads(cuerpo.strip().rstrip(";"))

    nuevo, sin, raras, motivo = {}, [], set(), {}
    for d in datos:
        i = str(d["id"])
        r = res.get(i)
        if i in corr:
            e, h = corr[i]
            nuevo[i] = (e, h or hojas_de((r or {}).get("Components")))
            motivo[i] = "corrección"; continue
        if not r:
            sin.append(d); continue
        h = hojas_de(r.get("Components"))
        e, m = estilo_de(r.get("Family"), h, d["nombre"], r.get("src", ""), i)
        motivo[i] = m
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
    porid = {str(d["id"]): d for d in datos}
    for est in ("Balcánica", "Lakeland"):
        print(f"\n== {est} ==")
        for i, (e, h) in sorted(nuevo.items(), key=lambda kv: int(kv[0])):
            if e == est:
                d = porid[i]
                print(f"  {i} {d['marca']} | {d['nombre']} | {', '.join(h)} | {motivo.get(i)}")


if __name__ == "__main__":
    main()
