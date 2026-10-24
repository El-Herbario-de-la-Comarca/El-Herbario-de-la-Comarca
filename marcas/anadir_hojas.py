# Añade fichas leídas a marcas/hojas_leidas.json.
# Uso: python3 marcas/anadir_hojas.py  (y pegar líneas id|Familia|Componentes|fuente)
# Al terminar, regenera marcas/fichas_pendientes.txt.
import json, sys, pathlib
D = pathlib.Path(__file__).resolve().parent
r = json.loads((D / "hojas_leidas.json").read_text())
for l in sys.stdin.read().strip().splitlines():
    p = [x.strip() for x in l.split("|")]
    if len(p) < 3 or not p[0]: continue
    r[p[0]] = {"Family": p[1], "Components": p[2], "src": p[3] if len(p) > 3 else "smokingpipes-webfetch"}
(D / "hojas_leidas.json").write_text(json.dumps(r, ensure_ascii=False, indent=0))
c = json.loads((D / "catalogo_por_marca.json").read_text())
out, n = [], 0
for m, l in c.items():
    f = [x for x in l if str(x[0]) not in r]
    if f:
        n += len(f); out.append(m + " | " + " ; ".join(f"{i} {s}" for i, s in f))
out.append(f"FALTAN {n}")
(D / "fichas_pendientes.txt").write_text("\n".join(out) + "\n")
print("leídas:", len(r), "faltan:", n)
