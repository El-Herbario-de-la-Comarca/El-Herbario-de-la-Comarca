-- =====================================================================
-- 17 · Se vende en España: mezclas con otro nombre en Europa
-- Por la directiva europea del tabaco, en Europa varias mezclas se venden sin el sabor en el nombre
-- (Borkum Riff Bronze = Bourbon Whiskey, Ruby = Cherry Cavendish, Mac Baren Classic Loose Cut =
-- Vanilla Cream…). Se marcan como «se vende en España» y se añade a la descripción el nombre
-- con el que aparecen en la lista oficial del CMT (1-10-2026). Ejecútalo después del 16.
-- Se puede repetir: la frase no se duplica.
-- =====================================================================
update public.tabacos t
set en_espana = true,
    descripcion = case when position('En España se vende como ' || v.nombre in t.descripcion) > 0 then t.descripcion
                       else btrim(t.descripcion || ' En España se vende como ' || v.nombre || '.') end
from (values
  ('52', 'Borkum Riff Bronze'),
  ('53', 'Borkum Riff Black'),
  ('54', 'Borkum Riff Ruby'),
  ('1103', 'Clan'),
  ('276', 'Mac Baren Mixture'),
  ('278', 'Mac Baren Classic Loose Cut'),
  ('408', 'Amphora Nº 2'),
  ('409', 'Amphora Nº 8'),
  ('22', 'Samuel Gawith K C Flake')
) as v(id, nombre)
where t.id = v.id;
