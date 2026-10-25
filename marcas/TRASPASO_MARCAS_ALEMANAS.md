# Traspaso: estado del catálogo y siguientes fichas

**Estado a 25/10/2026 (10:40):** 825 fichas de 60 marcas en `datos-iniciales.js`; 163 con el distintivo de España (E).
Todo está en `main` y publicado. El usuario ejecutó el 20 (junta del 13 al 19); el 21 (nombre al registrarse) estaba pendiente de ejecutar.

## Vauen (26/10/2026)
- 24 fichas nuevas (ids 2338-2361) al final de `EXTRA`: la serie Auenland (8) y las numeradas No. 1 a No. 23 (16).
  SQL: `supabase/32_vauen.sql` (o volver a ejecutar el 09). Ninguna está en la lista del CMT: sin E.
- Fuera: Tradition No. 2 (Restbestand/Auslauf, agotada) y Jubiläumsedition 150 y 175 (aniversario).
- Por revisar: Grandpa's Blend No. 11 lleva haba tonka (¿Lakeland?); Auenland Signature Edition no consta como limitada.
- Comprobado el 26/10 que no faltan marcas de la lista del CMT; candidatas europeas sin meter: Sail (STG),
  Peter Stokkebye y las mezclas de la casa de Peter Heinrichs.

## Cómo seguir metiendo fichas
- Añadir filas en `marcas/datos_alemanas.py` (formato y criterio al principio del archivo) y ejecutar
  `python3 marcas/generar_alemanas.py`: regenera `datos-iniciales.js` y `supabase/09_marcas_alemanas.sql`
  (ids desde 2000; conserva la marca de España). Para subirlas basta con volver a ejecutar el 09 en Supabase.
- Si se añaden mezclas que están en la lista oficial española, marcarlas con un SQL `update ... set en_espana = true`.
- Reglas fijadas por el usuario el 25/10:
  - Solo información de España/Europa: si el nombre en EE. UU. es distinto, se usa el europeo y no se menciona el de EE. UU.
  - Nada de textos sobre venta («se vende…»). El distintivo de España es solo el circulito con la E, sin texto.
  - Formatos siempre en gramos (nada de onzas).
- Truco para fuentes que WebFetch no abre: pedir al usuario que pegue las URLs (se le da el bloque ya preparado).

## Siguiente tanda propuesta: mezclas de la lista oficial española que faltan
Ver `marcas/en_espana.md` («En la lista oficial pero sin ficha»). El usuario iba a confirmarlas a mano.
Lista oficial: PDF del CMT «Lista Precios Picadura de Pipa Península y Baleares 01_10_26» (el usuario lo adjuntó).


Detalle de la tanda alemana (25/10 mañana): **134 fichas de 22 marcas** (ids 2000–2133). Rama `marcas-alemanas`, fusionada en `main`.

Hechas: HU Tobacco 43, Kopp +18 (Wood, Cremon Mixture, Pipe 66, Meistermischungen), Solani 10, Ilsted 8, Bentley 7,
Exclusiv (Pöschl) 7, Reiner 6, Gladora 6, Ermuri 5, Sillems 5, Winsløw 4, Robert Lewis 4, Per G. Jensen 4,
Thomas Radford (Pöschl) 3, Kentucky Bird, Prestige, Richmond y Käpt'n Barsdorfs Bester (von Eicken) 1 cada una.

## Cómo funciona
- `marcas/datos_alemanas.py`: una lista por marca, filas `(nombre, familia, componentes, corte, formato, extra, fuente)`.
- `python3 marcas/generar_alemanas.py`: ids desde 2000, calcula mezcla y hojas con `estilo_hojas.py`,
  actualiza `datos-iniciales.js` y escribe `supabase/09_marcas_alemanas.sql`. Se puede repetir.
- No ejecutar `marcas/generar.py` (rehace las fichas 1000+ con los tipos antiguos).

## Fuentes y método
- cigarworld.de: índice de marcas en `cigarworld.de/en/shop/marken/Tabak/Pfeifentabak`; cada serie lista
  sus variantes, y la ficha de cada variante da Rohtabak (componentes), Typ, Schnitt y Aromatisierung.
- WebFetch solo abre URLs que hayan salido en una búsqueda: buscar «cigarworld <Marca> <Serie> Dose»
  (modo extended) devuelve varias fichas de variantes de golpe.
- Familia: la de Smokingpipes o TR si la hay. Si solo hay cigarworld, su «Typ» no es fiable
  (usa «Englisch» o «Dänisch» para virginias sin latakia), así que se deduce de los componentes:
  latakia, u orientales con virginia → English; solo virginia (+perique/kentucky) → Virginia;
  aromatizada sin latakia → Aromatic; si no está claro, vacía.
- Las variantes que cigarworld da como agotadas **sin precio ni formato** no se han añadido
  (parecen retiradas): HU Imagine, Out of Africa y 9 de United Passion (Bahia O., Coming Home,
  Daddy Gefftl, Darkwood Scenery, Great Dixter, Jerry Saronno, Scotney, Sissinghurst, Tillerman Flake).
  Tampoco Gran Reserva Limitada (edición limitada). Consultar con el usuario.

## Para revisar con el usuario
- Balcánicas nuevas: HU Zulu Mixture (sin virginia) y HU Balkan Passion.
- Sin mezcla (falta familia fiable): HU Director's Cut, Green Gold, Dockworker Flake, Hadde's Best Irish, Nebari;
  Ermuri No Name No. 3; Prestige Regular Mixture; Kopp Meistermischung Nr. 66.

## Decisiones de esta tanda
- Agotadas: entran si la tienda las sigue vendiendo con precio y aviso de reposición; las que salen
  «agotadas» sin precio ni formato, o como Restbestand/Auslauf, no entran.
- A & C Petersen: en Smokingpipes solo queda Escudo Navy Deluxe, que ya está como marca Escudo. No se añade nada.
- Kohlhase & Kopp: sus mezclas se añaden a la marca Kopp. Las de Smokingpipes son casi todas ediciones limitadas o anuales (fuera).
- Pöschl: vende como Exclusiv y Thomas Radford. von Eicken: como Käpt'n Barsdorfs Bester (solo Bright Virginia sigue a la venta; Private Club, agotada).
- Kentucky Club: no aparece a la venta ni en cigarworld ni en Smokingpipes. No se añade.
- Per Jensen Aftensmad (Smokingpipes, agotada con aviso) y Sir Henry's (marca de Ermuri en cigarworld): sin añadir, por revisar.
- Meistermischungen de Kopp: sin componentes publicados; mezcla según el aroma o el nombre que da la tienda.

## Marcas de casa (añadidas el 25/10 con permiso del usuario)
- Pfeifendepot (Gerd Jansens Pfeifendepot): 39 mezclas, de las fichas de su web (el usuario pegó las URLs, porque
  WebFetch solo abre URLs vistas en búsquedas o pegadas). Fuera: No. 083 Copenhagen Jubiläum (aniversario, agotada).
  Dentro, aunque es de aniversario: No. 125 (está en la serie fija House Blends). Revisar.
  Balcánicas: No. 081 Golden Balkan (sin orientales), No. 209 White Balkan, No. 202 Crown «A» (70 % latakia, 5 % virginia).
  Lakeland: No. 064 Rosemoor (aceite de rosa).
- Kontor-Tabak (TABAK-KONTOR Leipzig): 7 mezclas. No. 28 sin datos; No. 13 fuera (agotada y sin datos).
- Pfeifen Huber: su web carga los productos con JavaScript; no se pudo leer. El texto que pasó el usuario parecía generado
  por otra IA (no coincidía con la tienda) y no se usó.
- TAK (Dein-Tabak): solo se leyó la página 1 de cada categoría y los listados no traen datos. Pendiente.

## Pendiente (preguntar al usuario)
No están ni en Smokingpipes ni en cigarworld, así que no cumplen el criterio de octubre:
- John Aylesbury (marca de una cooperativa de estancos; ~13 mezclas fijas en pipehouse.de y Tabak-Kontor).
- Marcas de casa: Pfeifen Huber (11 subcategorías propias), TAK de Dein-Tabak (Kiel) y Kontor-Tabak.
Si se aceptan, usar la web de la propia tienda como fuente, como se hizo con Watch City.

## Al terminar
Fusionar en `main` y ejecutar `supabase/09_marcas_alemanas.sql` en Supabase → SQL Editor.
