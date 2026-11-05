-- =====================================================================
-- 51 · Notas de sabor de mezclas no aromáticas (generado con herramientas/notas_sql.py)
-- Solo sabores que la descripción del fabricante o de la tienda dice expresamente.
-- Solo rellena fichas sin ninguna nota. Se puede ejecutar varias veces.
-- =====================================================================

-- 78 · Black Duck · Cornell & Diehl · TR 245 (descripción: earthy, woodsy)
update public.tabacos set notas = array['terroso', 'madera']::text[] where id = '78' and cardinality(notas) = 0;
-- 40 · Elizabethan Mixture · Peterson · Smokingpipes 346529 (descripción: peppery spice)
update public.tabacos set notas = array['pimienta']::text[] where id = '40' and cardinality(notas) = 0;
-- 351 · Balkan Mixture · Peterson · Smokingpipes 133055 (descripción: peppery spice)
update public.tabacos set notas = array['pimienta']::text[] where id = '351' and cardinality(notas) = 0;
-- 352 · Hyde Park · Peterson · Smokingpipes 111264 (descripción: rum, maple sugar)
update public.tabacos set notas = array['ron', 'arce']::text[] where id = '352' and cardinality(notas) = 0;
-- 225 · Ashbury · G. L. Pease · Smokingpipes 16474 (descripción: leather, campfire)
update public.tabacos set notas = array['cuero', 'hoguera']::text[] where id = '225' and cardinality(notas) = 0;
-- 226 · Bankside · G. L. Pease · Smokingpipes 509016 (descripción: smoky, citrusy)
update public.tabacos set notas = array['ahumado', 'cítricos']::text[] where id = '226' and cardinality(notas) = 0;
-- 228 · Blackpoint · G. L. Pease · Smokingpipes 2976 (descripción: raisins, stewed figs)
update public.tabacos set notas = array['pasas', 'higo']::text[] where id = '228' and cardinality(notas) = 0;
-- 231 · Charing Cross · G. L. Pease · Smokingpipes 2971 (descripción: cocoa, orange zest, campfires, smoky)
update public.tabacos set notas = array['chocolate', 'cítricos', 'hoguera', 'ahumado']::text[] where id = '231' and cardinality(notas) = 0;
-- 234 · Ellipsis Flake · G. L. Pease · Smokingpipes 671512 (descripción: nuttiness)
update public.tabacos set notas = array['frutos secos']::text[] where id = '234' and cardinality(notas) = 0;
-- 238 · Géométrie · G. L. Pease · Smokingpipes 543654 (descripción: baked goods, floral)
update public.tabacos set notas = array['bizcocho', 'floral']::text[] where id = '238' and cardinality(notas) = 0;
-- 239 · Haddo's Delight · G. L. Pease · Smokingpipes 2283 (descripción: cocoa, figs, raisins, earthy)
update public.tabacos set notas = array['chocolate', 'higo', 'pasas', 'terroso']::text[] where id = '239' and cardinality(notas) = 0;
-- 240 · Horizons Flake · G. L. Pease · Smokingpipes 610251 (descripción: smokiness)
update public.tabacos set notas = array['ahumado']::text[] where id = '240' and cardinality(notas) = 0;
-- 241 · JackKnife Plug · G. L. Pease · Smokingpipes 74582 (descripción: earthy)
update public.tabacos set notas = array['terroso']::text[] where id = '241' and cardinality(notas) = 0;
-- 242 · JackKnife Ready Rubbed · G. L. Pease · Smokingpipes 90289 (descripción: earthy)
update public.tabacos set notas = array['terroso']::text[] where id = '242' and cardinality(notas) = 0;
-- 247 · Lombard · G. L. Pease · Smokingpipes 15297 (descripción: smokiness)
update public.tabacos set notas = array['ahumado']::text[] where id = '247' and cardinality(notas) = 0;
-- 250 · Metropolis · G. L. Pease · Smokingpipes 727299 (descripción: peppery, earthy)
update public.tabacos set notas = array['pimienta', 'terroso']::text[] where id = '250' and cardinality(notas) = 0;
-- 254 · Penny Farthing · G. L. Pease · Smokingpipes 328410 (descripción: spiced with Louisiana Perique)
update public.tabacos set notas = array['pimienta']::text[] where id = '254' and cardinality(notas) = 0;
-- 257 · Regents Flake · G. L. Pease · Smokingpipes 205228 (descripción: incense-like aroma)
update public.tabacos set notas = array['incienso']::text[] where id = '257' and cardinality(notas) = 0;
-- 259 · Samarra · G. L. Pease · Smokingpipes 706 (descripción: smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '259' and cardinality(notas) = 0;
-- 256 · Quiet Nights · G. L. Pease · Smokingpipes 64444 (descripción: smoky Cyprian Latakia)
update public.tabacos set notas = array['ahumado']::text[] where id = '256' and cardinality(notas) = 0;
-- 267 · Triple Play · G. L. Pease · Smokingpipes 80555 (descripción: smoky dark-fired Kentucky)
update public.tabacos set notas = array['ahumado']::text[] where id = '267' and cardinality(notas) = 0;
-- 268 · Union Square · G. L. Pease · Smokingpipes 49966 (descripción: deep, earthy reds)
update public.tabacos set notas = array['terroso']::text[] where id = '268' and cardinality(notas) = 0;
-- 2006 · Makhuwa · HU Tobacco · Smokingpipes 630134 (descripción: nutty)
update public.tabacos set notas = array['frutos secos']::text[] where id = '2006' and cardinality(notas) = 0;
-- 2005 · Khoisaan · HU Tobacco · Smokingpipes 630132 (descripción: subtle wood)
update public.tabacos set notas = array['madera']::text[] where id = '2005' and cardinality(notas) = 0;
-- 2042 · Night Owl · HU Tobacco · Smokingpipes 630128 (descripción: spicy Perique; «peaty» del Burley no está en la lista)
update public.tabacos set notas = array['pimienta']::text[] where id = '2042' and cardinality(notas) = 0;
-- 2018 · Nashville County · HU Tobacco · Smokingpipes 695094 (descripción: licorice)
update public.tabacos set notas = array['regaliz']::text[] where id = '2018' and cardinality(notas) = 0;
-- 2012 · Balkan Passion · HU Tobacco · Smokingpipes 630100 (descripción: smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '2012' and cardinality(notas) = 0;
-- 2007 · Manyara · HU Tobacco · pfeifen-shop-online.de (descripción: woodiness, leather, earth, chocolate)
update public.tabacos set notas = array['madera', 'cuero', 'terroso', 'chocolate']::text[] where id = '2007' and cardinality(notas) = 0;
-- 2026 · Dockworker Flake · HU Tobacco · pfeifen-shop-online.de (descripción: chocolaty, nutty)
update public.tabacos set notas = array['chocolate', 'frutos secos']::text[] where id = '2026' and cardinality(notas) = 0;
-- 2027 · Flanagan Flake · HU Tobacco · pfeifen-shop-online.de (descripción: earthy, wood, citrus)
update public.tabacos set notas = array['terroso', 'madera', 'cítricos']::text[] where id = '2027' and cardinality(notas) = 0;
-- 2016 · Izmir Oriental Cake · HU Tobacco · pfeifen-shop-online.de (descripción: hay, floral, herbal)
update public.tabacos set notas = array['heno', 'floral', 'hierbas aromáticas']::text[] where id = '2016' and cardinality(notas) = 0;
-- 2024 · Ju 52 · HU Tobacco · pfeifen-shop-online.de (descripción: raspberry, flowers)
update public.tabacos set notas = array['frutos rojos', 'floral']::text[] where id = '2024' and cardinality(notas) = 0;
-- 1001 · 40 Virginia · Rattray's · Smokingpipes 179032 (descripción: honey and grass)
update public.tabacos set notas = array['miel', 'hierba']::text[] where id = '1001' and cardinality(notas) = 0;
-- 1018 · Red Lion · Rattray's · Smokingpipes 156722 (descripción: smoky aroma del Latakia)
update public.tabacos set notas = array['ahumado']::text[] where id = '1018' and cardinality(notas) = 0;
-- 1020 · Sir William · Rattray's · Smokingpipes 156745 (descripción: whisky aroma)
update public.tabacos set notas = array['whisky']::text[] where id = '1020' and cardinality(notas) = 0;
-- 1022 · Wallace Flake · Rattray's · Smokingpipes 156748 (descripción: plum aroma)
update public.tabacos set notas = array['ciruela']::text[] where id = '1022' and cardinality(notas) = 0;
-- 2 · Balkan Flake Burnt Ends · Samuel Gawith · Smokingpipes 8275 (descripción: smoky, campfire essence of Latakia; misma mezcla que Balkan Flake)
update public.tabacos set notas = array['ahumado', 'hoguera']::text[] where id = '2' and cardinality(notas) = 0;
-- 3 · Balkan Mini Plug · Samuel Gawith · Smokingpipes 8275 (descripción: smoky, campfire essence of Latakia; misma mezcla que Balkan Flake)
update public.tabacos set notas = array['ahumado', 'hoguera']::text[] where id = '3' and cardinality(notas) = 0;
-- 356 · Navy Flake Burnt Ends · Samuel Gawith · Smokingpipes 8115 (descripción: rum; misma mezcla que Navy Flake)
update public.tabacos set notas = array['ron']::text[] where id = '356' and cardinality(notas) = 0;
-- 357 · Perfection Mixture · Samuel Gawith · Smokingpipes 526529 (descripción: touch of vanilla, smoky notes of Latakia)
update public.tabacos set notas = array['vainilla', 'ahumado']::text[] where id = '357' and cardinality(notas) = 0;
-- 31 · Full Virginia Flake Burnt Ends · Samuel Gawith · Smokingpipes 585703 (descripción: fermented dark fruit, earth, oak, hay)
update public.tabacos set notas = array['ciruela', 'fermentado', 'terroso', 'madera', 'heno']::text[] where id = '31' and cardinality(notas) = 0;
