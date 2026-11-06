#!/usr/bin/env python3
"""Descarga en paralelo las fotos públicas de Supabase para la copia de seguridad.
Uso: descargar_fotos.py URL_SUPABASE lista.txt carpeta_destino
Bajarlas de una en una tardaba hasta 40 minutos las noches en que Supabase iba lento; de 8 en 8 basta con unos minutos."""
import sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

url, lista, destino = sys.argv[1].rstrip("/"), Path(sys.argv[2]), Path(sys.argv[3])
rutas = [l.strip() for l in lista.read_text(encoding="utf-8").splitlines() if l.strip()]
print(f"  {len(rutas)} fotos que descargar", flush=True)

def bajar(ruta):
    dest = destino / ruta
    dest.parent.mkdir(parents=True, exist_ok=True)
    enlace = f"{url}/storage/v1/object/public/{urllib.parse.quote(ruta)}"
    for intento in range(4):
        try:
            with urllib.request.urlopen(enlace, timeout=60) as r:
                dest.write_bytes(r.read())
            return None
        except Exception as e:
            error = e
            time.sleep(2 * (intento + 1))
    return f"{ruta} ({error})"

fallos = []
with ThreadPoolExecutor(max_workers=8) as pool:
    for n, fut in enumerate(as_completed([pool.submit(bajar, r) for r in rutas]), 1):
        if (f := fut.result()):
            fallos.append(f)
            print(f"  sin descargar: {f}", flush=True)
        if n % 100 == 0:
            print(f"  … {n} de {len(rutas)}", flush=True)

print(f"  {len(rutas)} fotos en la lista, {len(fallos)} sin descargar", flush=True)
if fallos:
    print(f"::warning::{len(fallos)} fotos no se pudieron descargar.")
