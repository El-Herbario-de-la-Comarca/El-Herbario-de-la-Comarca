# El herbario de la Comarca · Guía de puesta en marcha

Esta carpeta contiene la web completa. La web se aloja gratis en **GitHub Pages**, y los datos, las cuentas y las fotos se guardan gratis en **Supabase**.

```
index.html          la página
estilos.css         el diseño
app.js              el funcionamiento
config.js           ← aquí pegas los datos de tu proyecto de Supabase
datos-iniciales.js  copia de respaldo del catálogo (se usa si la base de datos no responde)
img/                logo y fotos
supabase/
  01_esquema.sql    tablas, roles y reglas de seguridad
  02_datos.sql      las 419 fichas iniciales
  03_marcas_nuevas.sql  228 fichas de 26 marcas nuevas (octubre de 2026)
marcas/             listas de las marcas nuevas y el script que genera los datos
```

Lo haces una sola vez y se tarda unos 30 minutos.

---

## 1. Crear la base de datos en Supabase

1. Entra en <https://supabase.com>, crea una cuenta gratuita y pulsa **New project**.
2. Ponle un nombre (por ejemplo `herbario`), elige una región de Europa (por ejemplo *West EU* o *Frankfurt*) y escribe una contraseña para la base de datos. Guárdala, aunque no la necesitarás para esta guía.
3. Cuando el proyecto esté listo, ve a **SQL Editor → New query**.
4. Abre `supabase/01_esquema.sql` con un editor de texto, copia **todo** el contenido, pégalo y pulsa **Run**. Debe terminar con *Success*.
5. Haz lo mismo con `supabase/02_datos.sql`. Así se cargan las 419 fichas.
6. Haz lo mismo con `supabase/03_marcas_nuevas.sql`. Así se cargan las 228 fichas de las marcas nuevas, hasta 647 en total.

**Si ya tenías la base de datos montada**, basta con ejecutar `03_marcas_nuevas.sql`. No toca las fichas que ya tienes y se puede ejecutar más de una vez sin duplicar nada.

## 2. Configurar el acceso de usuarios

En Supabase, ve a **Authentication**:

1. **Sign In / Providers → Email**: déjalo activado y **desactiva "Confirm email"**. Guarda.
   *Por qué:* el servicio de correo gratuito que trae Supabase solo envía mensajes a los miembros de tu equipo de Supabase, y como mucho 2 por hora. Sin esta opción, tus colaboradores no podrían confirmar su cuenta. Si más adelante configuras tu propio correo (punto 8), puedes volver a activarla.
2. **URL Configuration**: en *Site URL* escribe la dirección que tendrá tu web, por ejemplo `https://tuusuario.github.io/herbario/`, y añádela también en *Redirect URLs*. (Si aún no la sabes, vuelve aquí después del paso 4).

## 3. Conectar la web con Supabase

1. En Supabase, ve a **Project Settings → API** (en algunas versiones se llama **API Keys** o **Data API**).
2. Copia la **Project URL** (algo como `https://abcdefgh.supabase.co`).
3. Copia la clave pública: la **anon public** (si tu panel muestra las claves nuevas, está en la pestaña *Legacy API keys*; si no, usa la **publishable**, que empieza por `sb_publishable_`). **No uses nunca la clave `service_role` ni la `secret`**, porque dan acceso total.
4. Abre `config.js` y pega los dos valores entre las comillas:

```js
window.HERBARIO_CONFIG = {
  supabaseUrl: "https://abcdefgh.supabase.co",
  supabaseAnonKey: "eyJhbGciOi..."
};
```

La clave pública puede estar a la vista en la web. La seguridad la ponen las reglas del archivo `01_esquema.sql`: aunque alguien la copie, solo podrá leer.

## 4. Publicar la web en GitHub Pages

1. Crea una cuenta gratuita en <https://github.com>.
2. Pulsa **New repository**, llámalo por ejemplo `herbario` y márcalo como **Public** (GitHub Pages es gratis en repositorios públicos).
3. En el repositorio vacío, pulsa **uploading an existing file** y arrastra **todo el contenido de esta carpeta** (con las carpetas `img` y `supabase`). Pulsa **Commit changes**.
4. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)**, y guarda.
5. En uno o dos minutos tu web estará en `https://tuusuario.github.io/herbario/`. Si no lo hiciste antes, pon esa dirección en Supabase (paso 2.2).

## 5. Hacerte administrador

1. Abre tu web, baja al pie y pulsa **Acceso colaboradores → Crear cuenta** con tu correo y una contraseña.
2. En Supabase, ve a **SQL Editor** y ejecuta esto (con tu correo):

```sql
update public.perfiles set rol = 'admin' where email = 'tu@correo.com';
```

3. Recarga la web. En el pie verás «Has entrado como … · administrador» y arriba los botones **Revisar**, **Usuarios** y **Añadir tabaco**.

## 6. Añadir colaboradores

1. Pídeles que entren en la web y pulsen **Acceso colaboradores → Crear cuenta**. Entrarán como *lector*, sin permiso para cambiar nada.
2. Tú abres **Usuarios** y les cambias el rol:
   - **editor**: crea fichas y cambia todo lo de la ficha (fotos, vídeo y distintivo de España incluidos) al momento, sin esperar tu aprobación. Lo único que no puede es borrar fichas. Todo lo que hace queda en **Historial**, desde donde puedes deshacerlo (necesita `supabase/33_editores_editan.sql`).
   - **admin**: puede hacer lo mismo que tú. Dáselo solo a gente de total confianza.
3. Si queda alguna propuesta antigua, te aparece en **Revisar (número)**. Ves qué cambia exactamente (lo anterior tachado y lo nuevo en negrita) y pulsas **Aprobar** o **Rechazar**.

Como no hay confirmación por correo, cualquiera puede crear una cuenta con cualquier dirección. No pasa nada, porque las cuentas nuevas solo pueden leer. Antes de hacer editor a alguien, asegúrate de que el correo es de quien dice ser.

## 7. Cómo hacer cambios una vez publicada

**Contenido** (fichas, fotos, reseñas, usuarios): desde la propia web, con tu cuenta de administrador. Se guarda al momento y no hay que tocar GitHub.

**Diseño o funciones** (colores, textos fijos, filtros nuevos…): se cambian los archivos.
1. Modifica el archivo (o pídeselo a Claude y descarga el nuevo).
2. En GitHub, entra en el repositorio, pulsa **Add file → Upload files**, arrastra el archivo (sustituye al anterior) y pulsa **Commit changes**.
3. La web se actualiza sola en uno o dos minutos. Si no ves el cambio, recarga con Ctrl + F5.

No hace falta volver a ejecutar los archivos SQL cuando cambias el diseño.

## 8. (Opcional) Correo propio: confirmaciones y recuperar contraseñas

Sin correo propio, la opción **He olvidado mi contraseña** solo funciona para ti. Si un colaborador olvida la suya, puedes borrarlo en **Authentication → Users** para que se registre de nuevo, o configurar un correo:

1. Con una cuenta de Gmail que tenga la verificación en dos pasos activada, crea una **contraseña de aplicación** en la configuración de seguridad de Google.
2. En Supabase: **Authentication → Emails → SMTP Settings**, activa *Custom SMTP* y rellena:
   - Host: `smtp.gmail.com` · Puerto: `587`
   - Usuario: tu dirección de Gmail · Contraseña: la contraseña de aplicación
   - Remitente: tu dirección de Gmail
3. Si quieres, vuelve a activar **Confirm email** (punto 2.1).

## 9. Límites del plan gratuito

- Supabase gratis da de sobra para este catálogo (base de datos de 500 MB y 1 GB de fotos, según las condiciones actuales).
- **Si nadie usa el proyecto durante una semana, Supabase lo pone en pausa.** Mientras está en pausa, la web sigue mostrando la copia de respaldo del catálogo, pero no deja entrar ni editar. Para reactivarlo, entra en el panel de Supabase y pulsa **Restore**. Revisa las condiciones vigentes en la web de Supabase.
- GitHub Pages es gratis para repositorios públicos.

## 10. Antes de abrir la web al público

- **Aviso legal y política de privacidad.** En cuanto hay cuentas de usuario guardas datos personales (el correo), así que el RGPD y la LSSI te obligan a informar de ello. Conviene que lo revise un profesional.
- **Publicidad del tabaco.** La web es informativa: no pongas enlaces de compra, precios ni promociones, y mantén el aviso de mayoría de edad.

## Si algo falla

- **El pie dice «Base de datos sin configurar»**: revisa `config.js` (las comillas, y que la URL empiece por `https://`).
- **«No se ha podido conectar con la base de datos»**: el proyecto puede estar en pausa (punto 9) o la clave está mal copiada.
- **Entro pero no veo botones**: tu perfil todavía es *lector*. Repite el paso 5.2 con el correo exacto con el que te registraste.
- **Para ver el error técnico**: pulsa F12 en el navegador y mira la pestaña *Console*.
