# Traspaso: lectura de mezcla y hojas de las fichas

Estado a 24/10/2026 (noche): **fase de lectura terminada**. Hay **632 de 647** fichas leídas. Faltan **15** sin dato fiable (lista en `marcas/fichas_pendientes.txt`): Mac Baren 420 y 424, Amphora 405 Mellow Blend, McConnell 1028 y 1033, Mc Lintock 1141, R and M 1143, Dan Tobacco 1150 y 1166, Germain's 1170, 1178 y 1181, Watch City 1216, 1220 y 1222. Germain's 1170 y 1181 existen en Smokingpipes (familia Virginia) pero no se pudieron abrir. Siguiente paso: la fase final (más abajo).

### Notas de la última tanda
- Familias nuevas que `estilo_hojas.py` debe contemplar tal cual vienen de la fuente: «Virginia Based», «Cavendish Based», «Virginia/Perique», «Virginia/Burley», «Scottish», «Dutch-style» (Clan), «Other» (Amsterdamer) y «English Aromatic» (Lane HGL). «Burley Based» se guardó ya como Burley.
- Nombres asumidos o distintos (revisar): 1142 Mc Lintock «Wild C» guardada como McLintock Wild Cherry; 1139 Presbyterian Mixture (TR la lista bajo Mac Baren); 1211 Watch City #7 guardada como «Aromatic #7»; 1122 Stanwell Sungold (TR: «Vanilla (Sungold)»); 398 St. Bruno Gold Block (TR: «Mac Baren Gold Block»); 393 Capstan Gold Flake (TR: «Gold Navy Cut»); 394 Capstan Gold Ready Rubbed (TR: «Gold Navy Cut Ready Rubbed»).
- 391 Capstan Original Flake viene de mac-baren.com (solo Virginia, sin campo de familia).
- Erik Stokkebye 4 Seasons (1112-1115): comprobadas con la descripción de Smokingpipes; salen Aromática, Inglesa, Virginia y Virginia.
- Smokingpipes mostró una sala de espera con anti-robot en una página de listado (Seattle Pipe Club). No se insistió; las fichas individuales sí abrían.
Rama de trabajo: `estilo-y-hojas`. No toques `main` hasta la fase final.

## Archivos
- `marcas/hojas_leidas.json`: id → {Family, Components, src}. Es el resultado de la lectura.
- `marcas/catalogo_por_marca.json`: fichas del catálogo agrupadas por marca, con el formato `[id, nombre]`.
- `marcas/fichas_pendientes.txt`: fichas que faltan, agrupadas por marca. Se regenera sola.
- `marcas/anadir_hojas.py`: se le pasan por la entrada estándar líneas `id|Familia|Componentes|fuente` y las fusiona en hojas_leidas.json.
  Ejemplo: `python3 marcas/anadir_hojas.py <<'EOF'` … `EOF`.
- `marcas/estilo_hojas.py`: fase final. Convierte la familia y los componentes en mezcla y hojas y genera el SQL. Está pendiente de actualizar; ver abajo.

## Cómo leer una ficha (fase de lectura)
1. Hacer una búsqueda web del tipo `smokingpipes <Marca> <Nombre>`. WebFetch solo abre URLs que hayan salido en una búsqueda.
2. Abrir con WebFetch la ficha de smokingpipes.com y pedirle «Give the Family and Components fields exactly».
3. Si Smokingpipes no la tiene, usar tobaccoreviews.com («Blend Type and Contents») o tiendas británicas (cgarsltd, smoke-king).
4. Guardar con anadir_hojas.py. En la fuente se indica si no es Smokingpipes o si el nombre es distinto. Ejemplo: `tobaccoreviews (Burley Based)`.
5. Hacer commit y push de `marcas/` cada 30–40 fichas.
- Trabajar por tandas: unas 10 búsquedas en paralelo y luego unos 10 WebFetch en paralelo.
- Familias de TR: «Straight Virginia» se apunta como Virginia; «Burley Based» como Burley; «Virginia/Burley» se deja tal cual.

## Prohibido
- No usar el Chrome del usuario ni su conexión contra Smokingpipes o Tobacco Reviews, porque lo bloquearon.
- No saltar CAPTCHAs, Cloudflare ni límites de peticiones. Si aparece un 429 o un bloqueo, esperar o pasar a otra fuente.
- No adivinar. Si no hay dato fiable, dejar la ficha sin leer y anotarla abajo.

## Sin datos encontrados
- McConnell: 1028 Fancy Selection No. 1 y 1033 Old London Pebble Cut.
- Mac Baren: 420 Supreme Choice y 424 Classic Flake (antes Vanilla Cream Flake; seguramente Aromática, sin confirmar).
- Mac Baren 421 Absolute Choice: guardada solo como Aromatic, sin componentes.
- Dan Tobacco: 1150 Bizzy Lizzy y 1166 The Manager.
- Esoterica ya leídas: 1186, 1187, 1191, 1194, 1195, 1196 y 1201. Pendientes: Brighton, Cardiff, Dorchester, Hastings, Kingsbridge, Ramsgate, Scarborough, St. Ives, Tilbury y Woodbridge, que Smokingpipes no devolvía en la búsqueda. Probar con TR.

## Reglas de mezcla acordadas con el usuario (fase final, con un modelo potente)
Mezclas (columna `tipo`, en femenino): Inglesa, Balcánica, Oriental, Virginia, Virginia-Perique, Burley, Lakeland, Aromática y Sin mezclar.
Hojas: Virginia, Burley, Oriental, Latakia, Perique, Kentucky, Cavendish y Cigarro. Deertongue se ignora.
- **Inglesa**: virginia con orientales, lleve latakia o no. También virginia con latakia sin orientales, como Mac Baren 428 Latakia Blend, que SP marca como «Virginia».
- **Balcánica**: mucha carga de orientales frente a una inglesa normal. Se aplica si la familia de la fuente es «Balkan», si «Balkan» aparece en el nombre o la descripción, o si lleva latakia y orientales sin virginia o con muy poca. Las Balcánicas se enseñan al usuario antes de publicar.
- **Oriental**: solo cuando la fuente lo indique.
- **Virginia-Perique**: familia Virginia con perique.
- **Lakeland**: incluye las mezclas con tonka. Hay que revisar Samuel Gawith y Gawith Hoggarth con la descripción del fabricante, y las fichas con «LAKELAND» en src. Posibles: 315 Coniston Cut Plug y 385 Grasmere Flake. La lista se enseña al usuario.
- **Aromática**: incluye English Aromatic.
- **Sin mezclar**: blending, componentes y fichas «Pure».
- Cambios necesarios en estilo_hojas.py: añadir Balcánica y Oriental a ESTILOS; dejar de mapear balkan, oriental y turkish a Inglesa o Virginia; añadir la regla de Inglesa por componentes; añadir «virginia/latakia» y «scottish».

## Fase final
1. Actualizar estilo_hojas.py y ejecutar `python3 marcas/estilo_hojas.py marcas/hojas_leidas.json`.
2. Enseñar al usuario la lista de Balcánicas y de Lakeland.
3. Regenerar la vista previa, hacer merge a main y decir al usuario que ejecute `supabase/04_estilo_y_hojas.sql` en el SQL Editor de Supabase al publicar.
