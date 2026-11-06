#!/usr/bin/env bash
# Copia de seguridad de Supabase: base de datos (catálogo, reseñas, bodegas, cuentas) y fotos.
# La lanza cada noche .github/workflows/copia.yml. Cómo recuperarla: COPIA-DE-SEGURIDAD.md.
#
# Necesita dos variables (secretos del repositorio en GitHub):
#   SUPABASE_DB_URL  cadena de conexión «Session pooler» de Supabase, con la contraseña de la base de datos
#   CLAVE_COPIA      contraseña con la que se cifra la copia (el repositorio es público: sin cifrar no se puede guardar)
# Deja el archivo cifrado en  copia-AAAA-MM-DD.tar.gz.gpg
set -euo pipefail

: "${SUPABASE_DB_URL:?Falta el secreto SUPABASE_DB_URL (ver COPIA-DE-SEGURIDAD.md)}"
: "${CLAVE_COPIA:?Falta el secreto CLAVE_COPIA (ver COPIA-DE-SEGURIDAD.md)}"

# Si Supabase no responde en 20 segundos, se corta en lugar de quedarse esperando.
export PGCONNECT_TIMEOUT=20
case "$SUPABASE_DB_URL" in
  *:6543/*) echo "::error::La cadena usa el puerto 6543 (Transaction pooler). Copia la de «Session pooler», con el puerto 5432."; exit 1 ;;
  *@db.*.supabase.co*) echo "::error::La cadena es la «Direct connection», que no funciona desde GitHub. Copia la de «Session pooler»."; exit 1 ;;
  *YOUR-PASSWORD*) echo "::error::En la cadena falta poner la contraseña en lugar de [YOUR-PASSWORD]."; exit 1 ;;
esac

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
URL="${SUPABASE_URL:-$(grep -oP 'supabaseUrl:\s*"\K[^"]+' "$RAIZ/config.js")}"
FECHA="$(date -u +%Y-%m-%d)"
DIR="copia-$FECHA"
rm -rf "$DIR" && mkdir -p "$DIR/fotos"

echo "1/4 · Datos de la web (esquema public: fichas, reseñas, bodegas, perfiles, textos…)"
pg_dump "$SUPABASE_DB_URL" --schema=public --no-owner --file="$DIR/web.sql"

echo "2/4 · Cuentas de usuario y registro de fotos (auth y storage, solo datos)"
if ! pg_dump "$SUPABASE_DB_URL" --data-only --no-owner \
     --table=auth.users --table=auth.identities \
     --table=storage.buckets --table=storage.objects \
     --file="$DIR/cuentas_y_fotos.sql"; then
  echo "::warning::No se pudieron copiar las cuentas de usuario; el resto de la copia sigue adelante."
  rm -f "$DIR/cuentas_y_fotos.sql"
fi

echo "3/4 · Fotos (carpetas fotos y avatares)"
psql "$SUPABASE_DB_URL" -At -c \
  "select bucket_id || '/' || name from storage.objects where bucket_id in ('fotos','avatares') order by 1" \
  > "$DIR/fotos/lista.txt"
python3 "$RAIZ/herramientas/descargar_fotos.py" "$URL" "$DIR/fotos/lista.txt" "$DIR/fotos"

echo "4/4 · Comprimir y cifrar"
tar czf - "$DIR" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 3 \
  --symmetric --cipher-algo AES256 -o "$DIR.tar.gz.gpg" 3<<<"$CLAVE_COPIA"
rm -rf "$DIR"
echo "Copia lista: $DIR.tar.gz.gpg ($(du -h "$DIR.tar.gz.gpg" | cut -f1))"
