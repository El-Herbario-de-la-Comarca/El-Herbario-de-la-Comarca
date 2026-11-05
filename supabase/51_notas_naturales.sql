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
-- 2232 · Torben Dansk Louisiana Perique · Dan Tobacco · pfeifen-shop-online.de (descripción: pfeffrig-würzig, essigsaures Aroma)
update public.tabacos set notas = array['pimienta', 'vinagre']::text[] where id = '2232' and cardinality(notas) = 0;
-- 2412 · Torben Dansk Latakia Spezial · Dan Tobacco · pfeifen-shop-online.de (descripción: smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '2412' and cardinality(notas) = 0;
-- 2408 · Torben Dansk Black Cavendish Danish Style · Dan Tobacco · pfeifen-shop-online.de (Aroma: Maple, Vanilla)
update public.tabacos set notas = array['arce', 'vainilla']::text[] where id = '2408' and cardinality(notas) = 0;
-- 2415 · Torben Dansk Virginia Mysore Ready Rubbed Flake · Dan Tobacco · pfeifen-shop-online.de (descripción: slightly floral/flowery)
update public.tabacos set notas = array['floral']::text[] where id = '2415' and cardinality(notas) = 0;
-- 2231 · Torben Dansk Latakia (Cyprus) · Dan Tobacco · TR 4316 (descripción: smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '2231' and cardinality(notas) = 0;
-- 2301 · Bill Bailey's Best Blend · Dan Tobacco · pfeifen-shop-online.de (descripción: smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '2301' and cardinality(notas) = 0;
-- 2321 · Kriswill Golden Navy Cut · Dan Tobacco · TR 4110 (descripción: dried figs and prunes)
update public.tabacos set notas = array['higo', 'ciruela']::text[] where id = '2321' and cardinality(notas) = 0;
-- 2413 · Torben Dansk Virginia 1,6 Mysore · Dan Tobacco · TR 3926 (descripción: «flowery» Virginia Mysore; misma hoja, sin dato de ancho de corte)
update public.tabacos set notas = array['floral']::text[] where id = '2413' and cardinality(notas) = 0;
-- 2414 · Torben Dansk Virginia 4,0 Mysore · Dan Tobacco · TR 3926 (descripción: «flowery» Virginia Mysore; misma hoja, sin dato de ancho de corte)
update public.tabacos set notas = array['floral']::text[] where id = '2414' and cardinality(notas) = 0;
-- 1026 · Code: Relax · Robert McConnell · Smokingpipes 290837 (descripción: rum, vanilla, tonka bean, citrus, Benedictine)
update public.tabacos set notas = array['ron', 'vainilla', 'tonka', 'cítricos', 'licor']::text[] where id = '1026' and cardinality(notas) = 0;
-- 1030 · Latakia Flake · Robert McConnell · pfeifen-shop-online.de (descripción: spicy and smoky Latakia)
update public.tabacos set notas = array['ahumado']::text[] where id = '1030' and cardinality(notas) = 0;
-- 1068 · Ready Rubbed · Robert McConnell · pfeifen-shop-online.de (descripción: nutty)
update public.tabacos set notas = array['frutos secos']::text[] where id = '1068' and cardinality(notas) = 0;
-- 1064 · Oriental Square · Robert McConnell · cigarworld.de (descripción: floraler, dezent rauchiger)
update public.tabacos set notas = array['floral', 'ahumado']::text[] where id = '1064' and cardinality(notas) = 0;
-- 2152 · No. 090 – Merlin Cut Plug · Pfeifendepot · pfeifendepot.de (Charakter: erdig, pfeffrig)
update public.tabacos set notas = array['terroso', 'pimienta']::text[] where id = '2152' and cardinality(notas) = 0;
-- 2156 · No. 125 – 125 Years Jubilee · Pfeifendepot · pfeifendepot.de (descripción: schokoladig-nussig)
update public.tabacos set notas = array['chocolate', 'frutos secos']::text[] where id = '2156' and cardinality(notas) = 0;
-- 2150 · No. 209 – White Balkan · Pfeifendepot · pfeifendepot.de (Charakter: rauchig)
update public.tabacos set notas = array['ahumado']::text[] where id = '2150' and cardinality(notas) = 0;
-- 2145 · No. 070 – Flake Cut · Pfeifendepot · pfeifendepot.de (Charakter: heuig)
update public.tabacos set notas = array['heno']::text[] where id = '2145' and cardinality(notas) = 0;
-- 2148 · No. 081 – Golden Balkan · Pfeifendepot · pfeifendepot.de (Charakter: rauchig)
update public.tabacos set notas = array['ahumado']::text[] where id = '2148' and cardinality(notas) = 0;
-- 2157 · No. 200 – Bengals · Pfeifendepot · pfeifendepot.de (descripción: rauchigen Latakia; Charakter: rauchig)
update public.tabacos set notas = array['ahumado']::text[] where id = '2157' and cardinality(notas) = 0;
-- 2168 · No. 501 – The Good · Pfeifendepot · pfeifendepot.de (Charakter: erdig; «Trockenobst» sin fruta concreta)
update public.tabacos set notas = array['terroso']::text[] where id = '2168' and cardinality(notas) = 0;
-- 2169 · No. 502 – The Bad · Pfeifendepot · pfeifendepot.de (Charakter: erdig)
update public.tabacos set notas = array['terroso']::text[] where id = '2169' and cardinality(notas) = 0;
-- 2211 · Dark Matter · TAK · TR 11406 (descripción: smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '2211' and cardinality(notas) = 0;
-- 2200 · 16/5 Der Neue · TAK · TR 11095 (descripción: earthy, grassy, nutty Burley, peppery Perique, honey note)
update public.tabacos set notas = array['terroso', 'hierba', 'nuez', 'pimienta', 'miel']::text[] where id = '2200' and cardinality(notas) = 0;
-- 2204 · Old School · TAK · TR 11535 (descripción: nutty, grassy, flowery, chocolaty)
update public.tabacos set notas = array['frutos secos', 'hierba', 'floral', 'chocolate']::text[] where id = '2204' and cardinality(notas) = 0;
-- 2208 · Latakia Revival · TAK · TR 11294 (descripción: leathery)
update public.tabacos set notas = array['cuero']::text[] where id = '2208' and cardinality(notas) = 0;
-- 2217 · Ralf's Burley Cup · TAK · TR 11060 (Flavoring: Cocoa/Chocolate, Coffee; descripción: nuttiness, dark chocolate, coffee)
update public.tabacos set notas = array['chocolate', 'café', 'frutos secos']::text[] where id = '2217' and cardinality(notas) = 0;
-- 1188 · Brighton · Esoterica · TR 488 (Flavoring: Apricot)
update public.tabacos set notas = array['albaricoque']::text[] where id = '1188' and cardinality(notas) = 0;
-- 281 · Navy Flake · STG · Smokingpipes 1189 (descripción: enhanced with rum)
update public.tabacos set notas = array['ron']::text[] where id = '281' and cardinality(notas) = 0;
-- 2218 · HH Balkan Blend · STG · Smokingpipes 290708 (descripción: spicy and smoky English)
update public.tabacos set notas = array['ahumado']::text[] where id = '2218' and cardinality(notas) = 0;
-- 2219 · HH Vintage Latakia · STG · pfeifen-shop-online.de (descripción: smoky English)
update public.tabacos set notas = array['ahumado']::text[] where id = '2219' and cardinality(notas) = 0;
-- 2220 · HH Bold Kentucky Flake · STG · Smokingpipes 169301 (descripción: earthy, smoky)
update public.tabacos set notas = array['terroso', 'ahumado']::text[] where id = '2220' and cardinality(notas) = 0;
-- 2221 · HH Burley Flake · STG · Smokingpipes 278502 (descripción: woodsy)
update public.tabacos set notas = array['madera']::text[] where id = '2221' and cardinality(notas) = 0;
-- 2222 · HH Old Dark Fired Flake · STG · Smokingpipes 169579 (descripción: earthly flavor)
update public.tabacos set notas = array['terroso']::text[] where id = '2222' and cardinality(notas) = 0;
-- 2224 · HH Rustica Flake · STG · Smokingpipes 369409 (descripción: earthy base notes)
update public.tabacos set notas = array['terroso']::text[] where id = '2224' and cardinality(notas) = 0;
-- 2404 · Latakia Blend · Doctor Pipe · TR 13328 (descripción: smoked aromas and flavors)
update public.tabacos set notas = array['ahumado']::text[] where id = '2404' and cardinality(notas) = 0;
-- 2401 · Scottish Mixture · Doctor Pipe · TR 13329 (Flavoring: Bourbon; descripción: smoky touch)
update public.tabacos set notas = array['whisky', 'ahumado']::text[] where id = '2401' and cardinality(notas) = 0;
-- 2391 · Pure Gold Virginia · Doctor Pipe · TR 13463 (descripción: hints of caramel, grass and hay)
update public.tabacos set notas = array['caramelo', 'hierba', 'heno']::text[] where id = '2391' and cardinality(notas) = 0;
-- 1182 · Royal Jersey: Original Latakia Mixture · Germain's · TR 1579 (descripción: enhanced with vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1182' and cardinality(notas) = 0;
-- 1180 · Royal Jersey: Cavendish and Virginia · Germain's · cgarsltd.co.uk (descripción: honey sweet)
update public.tabacos set notas = array['miel']::text[] where id = '1180' and cardinality(notas) = 0;
-- 1214 · Beacon Blend · Watch City · watchcitycigar.com (descripción: earthy and nutty burley taste)
update public.tabacos set notas = array['terroso', 'nuez']::text[] where id = '1214' and cardinality(notas) = 0;
-- 1215 · Blue Ridge Special · Watch City · watchcitycigar.com (descripción: smokey incense like flavor)
update public.tabacos set notas = array['ahumado', 'incienso']::text[] where id = '1215' and cardinality(notas) = 0;
-- 1217 · Deluxe Crumb Cut · Watch City · watchcitycigar.com (descripción: earthy, nutty, caramel like flavor)
update public.tabacos set notas = array['terroso', 'frutos secos', 'caramelo']::text[] where id = '1217' and cardinality(notas) = 0;
-- 1218 · English Ernie-ental · Watch City · TR 12488 (descripción: sweet smokey spice)
update public.tabacos set notas = array['ahumado']::text[] where id = '1218' and cardinality(notas) = 0;
-- 1220 · F.U.S.T.G! (Fired Up & Set To Go!) · Watch City · watchcitycigar.com (descripción: chocolate, nuts, raisin and earth)
update public.tabacos set notas = array['chocolate', 'frutos secos', 'pasas', 'terroso']::text[] where id = '1220' and cardinality(notas) = 0;
-- 1208 · Plum Pudding · Seattle Pipe Club · Smokingpipes 712311 (descripción: smoky, spicy)
update public.tabacos set notas = array['ahumado']::text[] where id = '1208' and cardinality(notas) = 0;
-- 1210 · Plum Pudding Special Reserve · Seattle Pipe Club · Smokingpipes 712313 (descripción: peppery spice, smoky)
update public.tabacos set notas = array['pimienta', 'ahumado']::text[] where id = '1210' and cardinality(notas) = 0;
-- 1089 · Discovery Brazil Virginia · Davidoff · pfeifen-shop-online.de (descripción: light citrus fruit note)
update public.tabacos set notas = array['cítricos']::text[] where id = '1089' and cardinality(notas) = 0;
-- 1087 · Flake Medallions · Davidoff · Smokingpipes 29702 (descripción: spicy Perique)
update public.tabacos set notas = array['pimienta']::text[] where id = '1087' and cardinality(notas) = 0;
-- 2108 · Cremon Mixture · Kopp · pfeifen-shop-online.de (descripción: smoky English mixture)
update public.tabacos set notas = array['ahumado']::text[] where id = '2108' and cardinality(notas) = 0;
-- 2122 · Meistermischung Nr. 77 Englisch sanft · Kopp · pfeifen-shop-online.de (Aroma: Honey)
update public.tabacos set notas = array['miel']::text[] where id = '2122' and cardinality(notas) = 0;
-- 2124 · Meistermischung Nr. 99 Englisch · Kopp · pfeifen-shop-online.de (descripción: pleasantly smoky)
update public.tabacos set notas = array['ahumado']::text[] where id = '2124' and cardinality(notas) = 0;
-- 2179 · No. 33 · Kontor-Tabak · TR 11198 (descripción: plum, apricot, honey, bread and malt)
update public.tabacos set notas = array['ciruela', 'albaricoque', 'miel']::text[] where id = '2179' and cardinality(notas) = 0;
-- 2175 · No. 6 · Kontor-Tabak · TR 11200 (descripción: floral, citrus-notes, nutty)
update public.tabacos set notas = array['floral', 'cítricos', 'frutos secos']::text[] where id = '2175' and cardinality(notas) = 0;
-- 2080 · Tree Mixture · Robert Lewis · Smokingpipes 2028 (descripción: smoky Latakia)
update public.tabacos set notas = array['ahumado']::text[] where id = '2080' and cardinality(notas) = 0;
-- 2051 · White & Black 763 · Solani · smoke-king.co.uk (descripción: smooth smoky Latakia)
update public.tabacos set notas = array['ahumado']::text[] where id = '2051' and cardinality(notas) = 0;
-- 2267 · Gold Virginia Flake · Wessex · Smokingpipes 1268 (descripción: freshly baked bread, citrus undertones)
update public.tabacos set notas = array['cítricos', 'pan tostado']::text[] where id = '2267' and cardinality(notas) = 0;
-- 2088 · Pesse Canoe Latakia Flake 20 · Gladora · Smokingpipes 680559 (descripción: wood, plums)
update public.tabacos set notas = array['madera', 'ciruela']::text[] where id = '2088' and cardinality(notas) = 0;
-- 2089 · Pesse Canoe Latakia Flake 40 · Gladora · Smokingpipes 680560 (descripción: wood, plums)
update public.tabacos set notas = array['madera', 'ciruela']::text[] where id = '2089' and cardinality(notas) = 0;
-- 2091 · Pesse Canoe Oriental Flake · Gladora · TR 13330 (Flavoring: Figs; descripción: floral)
update public.tabacos set notas = array['higo', 'floral']::text[] where id = '2091' and cardinality(notas) = 0;
-- 2093 · Brothers in Arms · Per G. Jensen · Smokingpipes 686081 (descripción: cocoa and smoky spice)
update public.tabacos set notas = array['chocolate', 'ahumado']::text[] where id = '2093' and cardinality(notas) = 0;
-- 2095 · King's Watch · Per G. Jensen · Smokingpipes 686083 (descripción: citrus notes, toasted sweetness)
update public.tabacos set notas = array['cítricos', 'pan tostado']::text[] where id = '2095' and cardinality(notas) = 0;
-- 2096 · Port Guardian · Per G. Jensen · Smokingpipes 686084 (descripción: dark citrus)
update public.tabacos set notas = array['cítricos']::text[] where id = '2096' and cardinality(notas) = 0;
-- 2067 · Golden Flake · Ilsted · pfeifen-shop-online.de (Aroma: Honey, Orange)
update public.tabacos set notas = array['miel', 'cítricos']::text[] where id = '2067' and cardinality(notas) = 0;
-- 2071 · Own Mixture No. 88 · Ilsted · pfeifen-shop-online.de (descripción: honey-orange flavour)
update public.tabacos set notas = array['miel', 'cítricos']::text[] where id = '2071' and cardinality(notas) = 0;
-- 2277 · English Mixture · Savinelli · Smokingpipes 41498 (descripción: smoky flavor profile)
update public.tabacos set notas = array['ahumado']::text[] where id = '2277' and cardinality(notas) = 0;
-- 1116 · Golden Sliced · Orlik · Smokingpipes 53 (descripción: sweet citrus)
update public.tabacos set notas = array['cítricos']::text[] where id = '1116' and cardinality(notas) = 0;
-- 1139 · Presbyterian Mixture · Planta · pfeifen-shop-online.de (descripción: unimposing smoky note)
update public.tabacos set notas = array['ahumado']::text[] where id = '1139' and cardinality(notas) = 0;
-- 1225 · Prince Albert · Prince Albert · Smokingpipes 274404 (descripción: cocoa, molasses)
update public.tabacos set notas = array['chocolate', 'azúcar moreno']::text[] where id = '1225' and cardinality(notas) = 0;
-- 1224 · Regular · Sir Walter Raleigh · Smokingpipes 105178 (descripción: hints of anise and molasses)
update public.tabacos set notas = array['anís', 'azúcar moreno']::text[] where id = '1224' and cardinality(notas) = 0;
-- 396 · St. Bruno Flake · St. Bruno · Smokingpipes 198924 (descripción: smoky Dark-Fired Kentucky, floral and citrus notes)
update public.tabacos set notas = array['ahumado', 'floral', 'cítricos']::text[] where id = '396' and cardinality(notas) = 0;
-- 2244 · Original · Holger Danske · mac-baren.com (descripción: spicy Perique)
update public.tabacos set notas = array['pimienta']::text[] where id = '2244' and cardinality(notas) = 0;
-- 2106 · Regular Mixture · Prestige · pfeifen-shop-online.de (Aroma: Caramel, Chocolate, Tropical Fruits)
update public.tabacos set notas = array['caramelo', 'chocolate', 'frutas tropicales']::text[] where id = '2106' and cardinality(notas) = 0;
-- 2056 · Blend 51 (Rot) · Reiner · Smokingpipes 524 (descripción: distinctive smoky taste)
update public.tabacos set notas = array['ahumado']::text[] where id = '2056' and cardinality(notas) = 0;
-- 2107 · Navy Cut (Flake) · Richmond · TR 3341 (Flavoring: Plum)
update public.tabacos set notas = array['ciruela']::text[] where id = '2107' and cardinality(notas) = 0;
-- 1035 · Pure Black Cavendish · Robert McConnell · lista del usuario (Robert McConnell): caramelo oscuro, vainilla suave, notas tostadas
update public.tabacos set notas = array['caramelo', 'vainilla']::text[] where id = '1035' and cardinality(notas) = 0;
-- 1037 · Pure Burley · Robert McConnell · lista del usuario (Robert McConnell): nueces tostadas, cacao crudo, madera seca
update public.tabacos set notas = array['nuez', 'chocolate', 'madera']::text[] where id = '1037' and cardinality(notas) = 0;
-- 1044 · Pure Virginia · Robert McConnell · lista del usuario (Robert McConnell): cítricos frescos, heno de prado, miel, floral suave
update public.tabacos set notas = array['cítricos', 'heno', 'miel', 'floral']::text[] where id = '1044' and cardinality(notas) = 0;
-- 1048 · Scottish Cake · Robert McConnell · lista del usuario (Robert McConnell): fruta madura, pasas, pan recién horneado, toques especiados
update public.tabacos set notas = array['pasas', 'pan tostado', 'especias dulces']::text[] where id = '1048' and cardinality(notas) = 0;
-- 1049 · Scottish Flake · Robert McConnell · lista del usuario (Robert McConnell): ahumado ligero, frutos secos, tierra, madera
update public.tabacos set notas = array['ahumado', 'frutos secos', 'terroso', 'madera']::text[] where id = '1049' and cardinality(notas) = 0;
-- 1050 · Sovereign Mixture · Robert McConnell · lista del usuario (Robert McConnell): cuero, madera quemada
update public.tabacos set notas = array['cuero', 'madera']::text[] where id = '1050' and cardinality(notas) = 0;
-- 1053 · 5 Year Matured Virginia · Robert McConnell · lista del usuario (Robert McConnell): toque de madera fina
update public.tabacos set notas = array['madera']::text[] where id = '1053' and cardinality(notas) = 0;
-- 1056 · Boutique Blend · Robert McConnell · lista del usuario (Robert McConnell): ahumado meloso, notas de tierra, toffee suave
update public.tabacos set notas = array['ahumado', 'terroso', 'caramelo']::text[] where id = '1056' and cardinality(notas) = 0;
-- 1057 · Covent Garden · Robert McConnell · lista del usuario (Robert McConnell): pimienta negra, cuero, notas de turba
update public.tabacos set notas = array['ahumado', 'pimienta', 'cuero', 'terroso']::text[] where id = '1057' and cardinality(notas) = 0;
-- 1060 · Highgate · Robert McConnell · lista del usuario (Robert McConnell): toques de cacao, madera tostada
update public.tabacos set notas = array['chocolate', 'madera']::text[] where id = '1060' and cardinality(notas) = 0;
-- 1063 · Notting Hill · Robert McConnell · lista del usuario (Robert McConnell): madera ahumada
update public.tabacos set notas = array['madera', 'ahumado']::text[] where id = '1063' and cardinality(notas) = 0;
-- 1065 · Oxford Street · Robert McConnell · lista del usuario (Robert McConnell): ahumado ligero, hierbas secas, matices cítricos
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'cítricos']::text[] where id = '1065' and cardinality(notas) = 0;
-- 1067 · Piccadilly Circus · Robert McConnell · lista del usuario (Robert McConnell): dulzor cítrico, ahumados ligeros, incienso
update public.tabacos set notas = array['cítricos', 'ahumado', 'incienso']::text[] where id = '1067' and cardinality(notas) = 0;
-- 1069 · Regent Street · Robert McConnell · lista del usuario (Robert McConnell): vainilla cremosa, albaricoque, fondo de frutos secos
update public.tabacos set notas = array['vainilla', 'albaricoque', 'frutos secos']::text[] where id = '1069' and cardinality(notas) = 0;
