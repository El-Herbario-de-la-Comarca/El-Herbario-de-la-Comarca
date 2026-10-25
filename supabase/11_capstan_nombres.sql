-- =====================================================================
-- 11 · Capstan: nombres oficiales
-- Los nombres que usan el fabricante y las tiendas europeas son «Original Navy Cut» (lata azul)
-- y «Gold Navy Cut» (lata dorada), más sus versiones Ready Rubbed. Solo cambia las fichas que
-- siguen con el nombre antiguo, así que no pisa cambios hechos a mano desde la web.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================
update public.tabacos t
set nombre = v.nombre,
    descripcion = v.descripcion,
    formato = case when v.formato <> '' and t.formato in ('', '50 g') then v.formato else t.formato end
from (values
  ('391', 'Original Flake', 'Original Navy Cut', 'lata de 50 g', 'Original Navy Cut es una mezcla de la familia Virginia de Capstan, prensado y cortado en láminas (flake). Lleva Virginia prensada y tratada al vapor. Es la lata azul. Marca de Mac Baren, hoy de Scandinavian Tobacco Group. En EE. UU. se vende como Capstan Flake Blue. Formato: lata de 50 g.'),
  ('392', 'Original Ready Rubbed', 'Original Navy Cut Ready Rubbed', '', 'Original Navy Cut Ready Rubbed es la versión desmenuzada y lista para cargar (ready rubbed) del Original Navy Cut de Capstan, de la familia Virginia. Marca de Mac Baren, hoy de Scandinavian Tobacco Group. En EE. UU. se vendía como Capstan Ready Rubbed Blue.'),
  ('393', 'Gold Flake', 'Gold Navy Cut', 'lata de 50 g', 'Gold Navy Cut es una mezcla de la familia Virginia de Capstan, prensado y cortado en láminas (flake). Es la lata dorada, más suave que la Original. Marca de Mac Baren, hoy de Scandinavian Tobacco Group. En EE. UU. se vendía como Capstan Flake Yellow. Formato: lata de 50 g.'),
  ('394', 'Gold Ready Rubbed', 'Gold Navy Cut Ready Rubbed', '', 'Gold Navy Cut Ready Rubbed es la versión desmenuzada y lista para cargar (ready rubbed) del Gold Navy Cut de Capstan, de la familia Virginia. Marca de Mac Baren, hoy de Scandinavian Tobacco Group.')
) as v(id, viejo, nombre, formato, descripcion)
where t.id = v.id and t.marca = 'Capstan' and t.nombre = v.viejo;
