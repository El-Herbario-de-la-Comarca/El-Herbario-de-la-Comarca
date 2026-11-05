-- =====================================================================
-- 46 · Otros nombres de cada ficha (solo para el buscador)
-- Nombres con los que una mezcla se vende en otros países (sobre todo EE. UU.) o que tuvo antes.
-- No se enseñan en la ficha ni en las páginas públicas: solo sirven para que el buscador la encuentre
-- (por ejemplo, «Cherry Cavendish» encuentra Borkum Riff Ruby). Se pueden cambiar desde «Editar ficha».
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada:
-- solo rellena las fichas que todavía no tienen otros nombres.
-- =====================================================================

alter table public.tabacos add column if not exists otros_nombres text[] not null default '{}';
alter table public.tabacos drop constraint if exists tabacos_otros_nombres_validos;
alter table public.tabacos add constraint tabacos_otros_nombres_validos
  check (cardinality(otros_nombres) <= 10 and char_length(array_to_string(otros_nombres, ',')) <= 1300);

update public.tabacos t
set otros_nombres = v.otros
from (values
  -- Nombres antiguos o de EE. UU. (los que se quitaron de las descripciones con el 17 y el 18)
  ('52',   array['Bourbon Whiskey']),
  ('53',   array['Black Cavendish']),
  ('54',   array['Cherry Cavendish']),
  ('276',  array['Mixture Scottish Blend', 'Scottish Blend']),
  ('278',  array['Vanilla Cream Loose Cut', 'Vanilla Cream']),
  ('347',  array['Cherry Ambrosia']),
  ('391',  array['Capstan Flake Blue', 'Original Flake']),
  ('393',  array['Capstan Flake Yellow', 'Gold Flake']),
  ('400',  array['Full Aroma']),
  ('408',  array['Special Reserve No. 2']),
  ('409',  array['Special Reserve No. 8']),
  ('411',  array['Black & Bourbon']),
  ('423',  array['Vanilla Toffee Cream']),
  ('424',  array['Vanilla Cream Flake']),
  ('1103', array['Clan Original']),
  ('1122', array['Vanilla']),
  ('1138', array['Danish Black Vanilla']),
  ('1142', array['Wild Cherry']),
  ('1143', array['Rum and Maple']),
  ('1164', array['Sweet Vanilla Honeydew']),
  ('2044', array['Blue Label 369']),
  ('2046', array['Gold Label 779', 'English Luxury']),
  ('2047', array['Green Label 127']),
  ('2048', array['Red Label 131']),
  ('2051', array['White and Black 763']),
  ('2052', array['X - Sweet Mystery 113']),
  -- Mezclas de Dunhill que hoy vende Peterson (STG)
  ('38',   array['Dunhill De Luxe Navy Rolls']),
  ('39',   array['Dunhill Early Morning Pipe']),
  ('40',   array['Dunhill Elizabethan Mixture']),
  ('41',   array['Dunhill Flake']),
  ('45',   array['Dunhill My Mixture 965']),
  ('46',   array['Dunhill Nightcap']),
  ('48',   array['Dunhill Royal Yacht']),
  ('50',   array['Dunhill Standard Mixture Medium'])
) as v(id, otros)
where t.id = v.id and t.otros_nombres = '{}';
