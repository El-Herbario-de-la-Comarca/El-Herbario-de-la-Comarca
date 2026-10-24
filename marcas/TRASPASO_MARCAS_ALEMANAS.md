# Traspaso: marcas nuevas de las tiendas alemanas

Estado a 25/10/2026: **HU Tobacco hecha (43 fichas)**. Rama `marcas-alemanas` (sale de `main`).

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
- HU sin mezcla (falta familia fiable): Director's Cut, Green Gold, Dockworker Flake, Hadde's Best Irish, Nebari.

## Pendiente (marcas)
En cigarworld: Bentley, Ermuri, Gladora, Kentucky Bird, Per G. Jensen, Poul Ilsted, Poul Winslow,
Prestige, Reiner, Richmond, Robert Lewis, Sillems, Solani, Thomas Radford.
Fuera de cigarworld (buscar en Smokingpipes): John Aylesbury, Pöschl, Kohlhase & Kopp (ojo: ya existe
la marca «Kopp»), Joh. Wilh. von Eicken, A & C Petersen, Kentucky Club.
Marcas de casa (Pfeifen Huber, Kontor-Tabak, TAK): solo en su tienda; usar su web como con Watch City.

## Al terminar
Fusionar en `main` y ejecutar `supabase/09_marcas_alemanas.sql` en Supabase → SQL Editor.
