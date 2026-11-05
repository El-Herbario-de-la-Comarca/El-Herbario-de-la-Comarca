# Traspaso: notas de sabor de las mezclas no aromáticas (método 1)

Preparado el 5/11/2026 para hacerlo por tandas (pensado para Sonnet). Las aromáticas ya están hechas (SQL 50).

## Objetivo
Poner notas de sabor a las mezclas **no aromáticas** que no tienen ninguna, **solo** con los sabores que la descripción del fabricante o de la tienda dice expresamente. Al final, saber cuántas fichas se quedan sin nota con este método, para que el usuario decida qué hacer con ellas (posible opción: que las notas salgan de las reseñas de los usuarios).

## Archivos
- `marcas/notas_pendientes_naturales.txt`: las fichas que faltan, agrupadas por marca (id | nombre | mezcla). Se regenera sola.
- `marcas/notas_naturales.txt`: **resultados**, una línea por ficha con nota: `id|nota1,nota2|fuente`.
- `marcas/notas_naturales_sin.txt`: fichas **revisadas sin nota**, una por línea: `id Nombre (fuente: motivo)`.
- `herramientas/notas_sql.py`:
  - `python3 herramientas/notas_sql.py pendientes` → regenera la lista de pendientes (quita las ya apuntadas en los dos archivos anteriores).
  - `python3 herramientas/notas_sql.py sql` → comprueba los resultados (notas de la lista, 1 a 5 por ficha, ids que existen, sin repetidos) y genera `supabase/51_notas_naturales.sql`. También actualiza `datos-iniciales.js`. Si da errores, corrígelos antes de seguir.

## Cómo hacer una tanda
1. `git pull` del repositorio (`El-Herbario-de-la-Comarca/El-Herbario-de-la-Comarca`, rama main) y `python3 herramientas/notas_sql.py pendientes`.
2. Coge la siguiente marca de la lista (orden: Cornell & Diehl, G. L. Pease, Samuel Gawith, Gawith Hoggarth, HU Tobacco, Peterson y luego el resto).
3. Para cada ficha:
   a. **Smokingpipes primero** (es la tienda que mejor describe el sabor de las mezclas naturales): `WebSearch` con `smokingpipes <marca> <nombre>` (allowed_domains `smokingpipes.com`). Abre la ficha del producto con `WebFetch` y pide: *«From the product description (not customer reviews), list only the flavour/aroma words it explicitly mentions. If none, say none.»*
   b. Si Smokingpipes no la tiene o no dice nada: **Tobacco Reviews** (`tobaccoreviews <marca> <nombre>`), pidiendo *«1) Flavoring field exactly. 2) Flavour/aroma words explicitly in the blend's own description (not reviews).»* Truco: la página de marca de TR (`/brand/<id>/<marca>/`) da las URL de todas las mezclas; pide solo las URL de las que necesitas.
   c. Para mezclas alemanas y danesas (Dan Tobacco, Kopp, Pfeifendepot, Kontor, TAK…): **pfeifen-shop-online.de**, campo «Aroma» de la ficha.
   d. Apunta el resultado en `notas_naturales.txt` o, si no hay sabores, en `notas_naturales_sin.txt`. **Toda ficha revisada va a uno de los dos archivos**, para no repetirla.
4. Cada 30–40 fichas: `python3 herramientas/notas_sql.py sql`, y commit y push de `marcas/notas_naturales*.txt`, `supabase/51_notas_naturales.sql` y `datos-iniciales.js` a main. Firma el commit como pidan las instrucciones de la sesión.
5. Trabaja por lotes: unas 8 búsquedas en paralelo y luego sus WebFetch en paralelo. Si una URL da error de servidor, no insistas: pasa a otra fuente o apúntala como «no se pudo abrir».
6. Al terminar la tanda, actualiza la línea de «Estado» de abajo y di al usuario cuántas llevas con nota, cuántas sin nota y cuántas faltan.

## Qué cuenta como nota (lo importante)
**Solo sabores o aromas concretos que la descripción dice expresamente.** Nunca de las reseñas de usuarios ni deducidos de las hojas.

Sí cuenta (ejemplos reales):
- «notes of mellow citrus… earthy, clove-like spice» → `cítricos,terroso,especias dulces`
- «nutty Burley and spicy Perique» → `nuez,pimienta` (el adjetivo va unido a una hoja concreta y dice a qué sabe)
- «a smoky, delightfully satisfying mixture» → `ahumado`
- «cool smoky aroma» del latakia → `ahumado` (lo dice la descripción, no lo deducimos)
- «dark fruit», «stone fruit» → `ciruela`; «toast», «bread» → `pan tostado`; «hay» → `heno`; «leather» → `cuero`; «incense» → `incienso`; «campfire» → `hoguera`; «cocoa» → `chocolate`; «raisin» → `pasas`; «fig» → `higo`; «molasses» → `azúcar moreno`.

No cuenta (no se apunta nada):
- Palabras genéricas: «sweet», «sweetness», «rich», «full», «mellow», «smooth», «delicious», «flavorful», «aromatic», «balanced», «complex».
- «spicy» o «spice» solos, sin decir de qué (salvo que se una a perique → `pimienta`, o diga canela/clavo → `especias dulces`).
- «fruity», «fruit» o la categoría «Fruit / Citrus» de TR sin fruta concreta.
- Campo Flavoring de TR «Other / Misc» o «Sweet / Sugar».
- Listas de hojas («Virginia, Latakia, Orientals») sin sabor: la latakia **no** da «ahumado» si la descripción no lo dice.
- Lo que digan las reseñas o los foros.

## Lista de notas permitidas (el script rechaza cualquier otra)
miel, caramelo, azúcar moreno, vainilla, chocolate, regaliz · cítricos, frutos rojos, cereza, ciruela, pasas, higo, melocotón, manzana, granada · nuez, avellana, almendra, pan tostado, bizcocho, café · pimienta, especias dulces, anís, tonka · heno, hierba, té, floral, hierbas aromáticas · terroso, cuero, madera, cedro, tabaco curado · ahumado, incienso, hoguera · whisky, ron, vino, licor · vinagre, fermentado · frutas tropicales, arce, ciruela mirabel, albaricoque, turrón, frutos secos.

Equivalencias: naranja, limón, mandarina, lima → cítricos · bayas, mora, frambuesa, grosella → frutos rojos · coco, piña, mango, plátano → frutas tropicales · canela, clavo, nuez moscada, pimienta de Jamaica, jengibre → especias dulces · pepper → pimienta · coñac, brandy, amaretto, curaçao → licor · jerez, oporto → vino · bourbon → whisky · toffee → caramelo · nougat → turrón · earthy → terroso · wood, oak → madera · grass → hierba · flowers → floral · nuts (sin especificar) → frutos secos · walnut, hickory nut → nuez.
Si aparece un sabor concreto que no encaja en nada (p. ej. «sandía»), no lo inventes: apúntalo en `notas_naturales_sin.txt` con la palabra, para que el administrador decida si se añade a la lista.

## Reglas de forma
- De 1 a 5 notas por ficha, de más a menos marcada (el orden de la descripción vale).
- Fuente siempre: `Smokingpipes <product_id>`, `TR <id>` o `pfeifen-shop-online.de`, más entre paréntesis las palabras en que te basas. Ej.: `Smokingpipes 213177 (descripción: cítricos suaves, especia terrosa a clavo)`.
- **Nombres:** comprueba que la ficha de la fuente es la misma mezcla. Ojo con mezclas renombradas en la UE (en TR suele venir en «Notes»: «sold in the EU as…») y con nombres parecidos (Kendal Gold #14 ≠ Kendal Dutch). Si no está claro, a `notas_naturales_sin.txt` con el motivo.
- En `tabacos` el id es **texto**: el script ya genera el SQL con el id entre comillas. No escribas SQL a mano.
- No toques fichas que ya tienen notas, ni las aromáticas.

## Prohibido
- Usar el Chrome del usuario o su conexión contra Smokingpipes o Tobacco Reviews.
- Saltar CAPTCHAs, Cloudflare o límites. Si hay bloqueo, cambia de fuente.
- Copiar frases de las fuentes en la web: solo se guardan las notas (palabras de la lista).

## Al publicar
El usuario ejecuta `supabase/51_notas_naturales.sql` en Supabase → SQL Editor (solo rellena fichas sin notas; se puede repetir). Las páginas `f/` se actualizan solas por la noche.

## Estado
5/11/2026 (noche): **descartadas** las dos tandas anteriores (Robert McConnell y Dan Tobacco con «lista del usuario»): las listas se las había pasado el usuario pidiéndoselas a Gemini, que se inventó los datos. Se han quitado las 40 líneas de `notas_naturales.txt`, revertido `datos-iniciales.js` a `notas: []` en esas 40 fichas y regenerado el SQL 51. Vuelta a los números de método 1: con nota 159, sin nota 356, pendientes 0, SQL 51 con 88 fichas.
5/11/2026 (noche): **método 1 terminado.** Pendientes: 0. Con nota: 159 fichas. Revisadas sin nota: 356 (lista en notas_naturales_sin.txt). El SQL 51 lleva las 88 que aún no están en Supabase. Palabras fuera de la lista para que decida el administrador: pera (Stokkebye 2012), cilantro (Kopp 88). Falta decidir qué hacer con las 356 sin nota (rellenar a mano, notas votadas en reseñas o bloque orientativo).
5/11/2026 (noche): tanda 6 a medias, pausada por límite de uso. Hechas: Dan Tobacco, Robert McConnell, Pfeifendepot (Charakter de pfeifendepot.de), TAK (vía TR «Motzek»), Esoterica, STG, Erik Stokkebye, Doctor Pipe, Germain's, Watch City, Fribourg & Treyer, Seattle Pipe Club, Davidoff, Kopp y Kontor No. 6 y 33. Pendiente seguir con: Kontor No. 3 y 5, MyRott (no aparece en búsquedas), Robert Lewis, Solani, Wessex, Gladora, Per G. Jensen, Gawith Hoggarth, Ilsted, Savinelli y las marcas sueltas (comando pendientes). Palabras fuera de la lista para que decida el administrador: pera (Stokkebye 2012), cilantro (Kopp 88).
5/11/2026 (tarde): tanda 5 hecha, Cornell & Diehl completo (58 fichas: 14 con nota, 44 sin nota; casi todas las descripciones de C&D en Smokingpipes solo enumeran hojas; las que dan sabores son las Small Batch). El SQL 51 regenerado solo lleva estas 14, porque las anteriores ya están en Supabase. Con nota: 85. Revisadas sin nota: 232. Pendientes: 198 (siguiente: Dan Tobacco con pfeifen-shop-online.de, Robert McConnell con TR).
5/11/2026: tandas 1-3 hechas (Cornell & Diehl parte 1, Peterson, G. L. Pease, HU Tobacco, Rattray's, Samuel Gawith, Gawith Hoggarth). Tanda 4 a medias: Robert McConnell, Dan Tobacco y Germain's revisadas en parte (las que Smokingpipes abrió); Pfeifendepot y TAK sin empezar. Con nota: 71. Revisadas sin nota: 188. Quedan pendientes en C&D unas 60 fichas, y el resto de las marcas que no figuran en los dos archivos (usar el comando pendientes). Smokingpipes falla con muchas fichas de McConnell; probar Tobacco Reviews para ellas.
