-- =====================================================================
-- 17 · Se vende en España: mezclas con otro nombre en Europa
-- Por la directiva europea del tabaco, en Europa varias mezclas se venden sin el sabor en el nombre.
-- Se les pone el nombre con el que se venden aquí (lista oficial del CMT, 1-10-2026), se marcan como
-- «se vende en España» y la descripción recuerda el nombre antiguo.
--   Borkum Riff: Bourbon Whiskey → Bronze, Black Cavendish → Black, Cherry Cavendish → Ruby
--   Mac Baren: Mixture Scottish Blend → Mixture, Vanilla Cream Loose Cut → Classic Loose Cut
--   Amphora: Special Reserve No. 2 / No. 8 → Nº 2 / Nº 8 · Clan: Original → Clan
--   Samuel Gawith Kendal Cream Flake: se queda con su nombre (en la lista sale abreviado, «K C Flake»).
-- Ejecútalo después del 16. Se puede repetir. Solo cambia el nombre y la descripción si la ficha sigue con
-- el nombre antiguo o con el nuevo (no pisa una ficha renombrada a mano con otro nombre).
-- =====================================================================
update public.tabacos t
set en_espana = true, nombre = v.nuevo, descripcion = v.descripcion
from (values
  ('22', 'Kendal Cream Flake', 'Kendal Cream Flake', 'Kendal Cream Flake es una mezcla de la familia Virginia de Samuel Gawith, prensado y cortado en láminas (flake). Formatos: 50 g y 8 oz.'),
  ('52', 'Bourbon Whiskey', 'Bronze', 'Virginia y cavendish negro, 65/35 según el envase, aromatizados con bourbon de Kentucky. Es una de las mezclas más antiguas de la marca. Se recomienda fumarla despacio, porque puede morder si se da caladas fuertes. Antes se llamaba Bourbon Whiskey.'),
  ('53', 'Black Cavendish', 'Black', 'Cavendish negro y Virginia madura, a partes iguales según el envase, con algo de burley Kentucky curado al fuego. Sale de 1975 y es más lleno y fuerte que la Original, con un humo más oscuro y un toque de ciruela. Antes se llamaba Black Cavendish.'),
  ('54', 'Cherry Cavendish', 'Ruby', 'Cavendish negro y Virginia al 50 %, con burley Kentucky curado al fuego y maduración en barril. Sabe a cereza con fondo de chocolate y frutos secos. Salió en 1979 y es más pesada que la Cherry Liquor. Antes se llamaba Cherry Cavendish.'),
  ('276', 'Mixture Scottish Blend', 'Mixture', 'Mixture es una mezcla aromática de Mac Baren, en láminas desmenuzadas (broken flake). Lleva Virginia, burley y cavendish negro. Antes se llamaba Mixture Scottish Blend; la línea nació en 1958. Formatos: 50 g, 100 g y 250 g.'),
  ('278', 'Vanilla Cream Loose Cut', 'Classic Loose Cut', 'Classic Loose Cut es una mezcla aromática de Mac Baren, cortado en tiras finas (ribbon). Lleva Virginia, burley y cavendish negro. Antes se llamaba Vanilla Cream Loose Cut. Formatos: 40 g, 50 g y 100 g.'),
  ('408', 'Special Reserve No. 2', 'Nº 2', 'Nº 2 es una mezcla aromática de Amphora. Lleva Virginia, burley y cavendish. Antes se llamaba Special Reserve No. 2. Marca de Mac Baren. Formato: 50 g.'),
  ('409', 'Special Reserve No. 8', 'Nº 8', 'Nº 8 es una mezcla aromática de Amphora. Lleva Virginia, burley y cavendish. Antes se llamaba Special Reserve No. 8. Marca de Mac Baren. Formato: 50 g.'),
  ('1103', 'Original', 'Clan', 'La mezcla aromática clásica de Clan, cortada en tiras finas (ribbon). Lleva Virginia, burley, cavendish negro y perique, con un toque de frutos secos. La creó Theodorus Niemeyer y la elabora Scandinavian Tobacco Group. Antes figuraba aquí como Clan Original. Formato: 50 g.')
) as v(id, viejo, nuevo, descripcion)
where t.id = v.id and t.nombre in (v.viejo, v.nuevo);
