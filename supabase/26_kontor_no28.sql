-- El herbario de la Comarca · Kontor-Tabak No. 28 con sus datos (25/10/2026)
-- La ficha ya existía sin datos; el 09 no la toca porque solo añade fichas nuevas.
-- Ejecútalo en Supabase → SQL Editor. Se puede repetir sin romper nada.
update public.tabacos set tipo = 'Aromática', descripcion = 'No. 28 es una mezcla aromática de Kontor-Tabak. Lleva virginia, burley y cavendish. Mezcla de la casa de la tienda TABAK-KONTOR de Leipzig. Aroma de frambuesa silvestre, vino blanco y un toque de vainilla. Formato: lata de 100 g.',
  hojas = array['Virginia', 'Burley', 'Cavendish']::text[]
where id = '2178';
