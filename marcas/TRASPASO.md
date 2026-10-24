# Traspaso: lectura de mezcla y hojas de las fichas

Estado a 24/10/2026: hay **485 de 647** fichas leídas. Faltan **162**; la lista está en `marcas/fichas_pendientes.txt`.
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
