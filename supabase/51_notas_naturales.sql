-- =====================================================================
-- 51 · Notas de sabor de mezclas no aromáticas (generado con herramientas/notas_sql.py)
-- Solo sabores que la descripción del fabricante o de la tienda dice expresamente.
-- Solo rellena fichas sin ninguna nota. Se puede ejecutar varias veces.
-- =====================================================================

-- 156 · Night Train · Cornell & Diehl · Smokingpipes 66086 (descripción: spicy Perique)
update public.tabacos set notas = array['pimienta']::text[] where id = '156' and cardinality(notas) = 0;
-- 201 · Carolina Red Flake · Cornell & Diehl · Smokingpipes 204290 (descripción: hay-like grassiness, earthy, citrus)
update public.tabacos set notas = array['heno', 'terroso', 'cítricos']::text[] where id = '201' and cardinality(notas) = 0;
-- 202 · Carolina Red Flake with Perique · Cornell & Diehl · Smokingpipes 365380 (descripción: stone fruit, pepper, baked goods, citrus, port wine)
update public.tabacos set notas = array['ciruela', 'pimienta', 'bizcocho', 'cítricos', 'vino']::text[] where id = '202' and cardinality(notas) = 0;
-- 203 · Eight State Burley · Cornell & Diehl · Smokingpipes 432647 (descripción: nuttiness, cocoa, bready, floral)
update public.tabacos set notas = array['frutos secos', 'chocolate', 'pan tostado', 'floral']::text[] where id = '203' and cardinality(notas) = 0;
-- 204 · Firebird Flake · Cornell & Diehl · Smokingpipes 651383 (descripción: citrus, wood smoke, green peppercorn)
update public.tabacos set notas = array['cítricos', 'ahumado', 'pimienta']::text[] where id = '204' and cardinality(notas) = 0;
-- 205 · Fires on the Levee · Cornell & Diehl · Smokingpipes 706206 (descripción: stone-fruit, woody, campfire)
update public.tabacos set notas = array['ciruela', 'madera', 'hoguera']::text[] where id = '205' and cardinality(notas) = 0;
-- 206 · Folklore · Cornell & Diehl · Smokingpipes 465810 (descripción: citrus, lemony, woodsy)
update public.tabacos set notas = array['cítricos', 'madera']::text[] where id = '206' and cardinality(notas) = 0;
-- 207 · From Beyond · Cornell & Diehl · Smokingpipes 448569 (descripción: smoky, incense-like)
update public.tabacos set notas = array['ahumado', 'incienso']::text[] where id = '207' and cardinality(notas) = 0;
-- 213 · Palmetto Balkan · Cornell & Diehl · Smokingpipes 486905 (descripción: wood smoke, berries, wine-like)
update public.tabacos set notas = array['ahumado', 'frutos rojos', 'vino']::text[] where id = '213' and cardinality(notas) = 0;
-- 217 · Sun Bear Black Locust · Cornell & Diehl · Smokingpipes 438927 (descripción: honey, silver tequila, elderflower)
update public.tabacos set notas = array['miel', 'licor', 'floral']::text[] where id = '217' and cardinality(notas) = 0;
-- 218 · Sun Bear Navy Cask · Cornell & Diehl · Smokingpipes 685836 (descripción: vanilla, charred oak, toffee)
update public.tabacos set notas = array['vainilla', 'madera', 'caramelo']::text[] where id = '218' and cardinality(notas) = 0;
-- 219 · Sun Bear Tupelo · Cornell & Diehl · Smokingpipes 563516 (descripción: tupelo honey, silver tequila, elderflower)
update public.tabacos set notas = array['miel', 'licor', 'floral']::text[] where id = '219' and cardinality(notas) = 0;
-- 220 · The Beast · Cornell & Diehl · Smokingpipes 201358 (descripción: stone fruits, loamy earth, mesquite wood, black pepper)
update public.tabacos set notas = array['ciruela', 'terroso', 'madera', 'pimienta']::text[] where id = '220' and cardinality(notas) = 0;
-- 367 · Shandygaff · Cornell & Diehl · Smokingpipes 164537 (descripción: ginger)
update public.tabacos set notas = array['especias dulces']::text[] where id = '367' and cardinality(notas) = 0;
