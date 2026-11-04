# Copia de seguridad de Supabase

Cada noche (hacia las 3:45 en España) la tarea **«Copia de seguridad»** de GitHub Actions guarda una copia de todo lo que vive en Supabase:

- **Datos de la web**: fichas, reseñas, bodegas, perfiles, textos de marcas, propuestas, etc. (`web.sql`).
- **Cuentas de usuario** y el registro de fotos (`cuentas_y_fotos.sql`).
- **Las fotos** de las fichas y las fotos de perfil (carpeta `fotos/`).

Todo va comprimido y **cifrado con una contraseña** (`copia-AAAA-MM-DD.tar.gz.gpg`), porque el repositorio es público y la copia contiene correos y datos personales. Sin la contraseña no se puede abrir.

Se guarda dentro de cada ejecución de la tarea, en el apartado **Artifacts**: las de cada día durante 30 días y la del día 1 de cada mes durante 90 días. No se sube al repositorio. Si una noche falla, GitHub manda un correo.

## Configuración (una sola vez)

Hacen falta dos secretos en GitHub: repositorio → **Settings → Secrets and variables → Actions → New repository secret**.

1. **`SUPABASE_DB_URL`**
   - En Supabase, abre el proyecto y pulsa **Connect** (arriba).
   - Elige **Session pooler** y copia la cadena «URI». Es como
     `postgresql://postgres.xxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
   - Cambia `[YOUR-PASSWORD]` por la contraseña de la base de datos (sin los corchetes).
   - Si no la recuerdas: **Project Settings → Database → Reset database password**. Cambiarla no afecta a la web, que usa otra clave.
   - Usa «Session pooler», no «Direct connection»: la conexión directa no funciona desde GitHub.
2. **`CLAVE_COPIA`**: una contraseña larga que inventes tú. **Apúntala en un sitio seguro** (gestor de contraseñas): sin ella las copias no sirven de nada.

Para probarla: **Actions → Copia de seguridad → Run workflow**. Tarda un par de minutos; al terminar, abre la ejecución y abajo verás el archivo en **Artifacts**.

## Cómo abrir una copia

1. Descarga el archivo desde **Actions → Copia de seguridad → (la ejecución del día) → Artifacts**. Llega como `.zip`; descomprímelo.
2. Descífralo con la contraseña `CLAVE_COPIA`:
   - En Windows, con **Gpg4win** (Kleopatra → Descifrar).
   - En Mac o Linux: `gpg -d copia-AAAA-MM-DD.tar.gz.gpg > copia.tar.gz` y después `tar xzf copia.tar.gz`.
3. Dentro están `web.sql`, `cuentas_y_fotos.sql` y la carpeta `fotos/`.

## Cómo recuperar la web a partir de una copia

Es una operación delicada; lo mejor es hacerla con ayuda. A grandes rasgos:

1. En un proyecto de Supabase (el mismo o uno nuevo), cargar `web.sql` con
   `psql "<cadena de conexión>" -f web.sql`.
2. Cargar `cuentas_y_fotos.sql` de la misma forma, para recuperar las cuentas.
3. Volver a subir las fotos a las carpetas `fotos` y `avatares` de Storage, con las mismas rutas.
4. Si el proyecto es nuevo, poner su dirección y su clave pública en `config.js`.

El script que hace la copia es `herramientas/copia_seguridad.sh`.
