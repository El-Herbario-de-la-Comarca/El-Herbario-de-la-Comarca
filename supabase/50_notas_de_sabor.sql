-- =====================================================================
-- 50 · Notas de sabor que faltaban (5/11/2026): fichas vendidas en España y aromáticas
-- Solo notas que la fuente dice expresamente: el campo Flavoring de Tobacco Reviews (aroma añadido),
-- la descripción del fabricante (TR o Smokingpipes) o el atributo «Aroma» de pfeifen-shop-online.de.
-- Nada deducido de las hojas. Solo rellena fichas que no tienen ninguna nota. Se puede repetir.
-- =====================================================================

-- 7 · Bothy Flake · Samuel Gawith · TR 9263 (Flavoring: Whisky; descripción: whisky de malta, fondo ahumado)
update public.tabacos set notas = array['whisky', 'ahumado']::text[] where id = '7' and cardinality(notas) = 0;
-- 9 · Cabbie's Roll Cut · Samuel Gawith · Smokingpipes 652407 (perique especiado)
update public.tabacos set notas = array['pimienta']::text[] where id = '9' and cardinality(notas) = 0;
-- 23 · Navy Flake · Samuel Gawith · TR 2218 (Flavoring: Rum)
update public.tabacos set notas = array['ron']::text[] where id = '23' and cardinality(notas) = 0;
-- 36 · Connoisseur's Choice · Peterson · TR 2266 (Flavoring: Fruit/Citrus, Maple, Rum, Vanilla; descripción: fruta tropical)
update public.tabacos set notas = array['frutas tropicales', 'arce', 'ron', 'vainilla']::text[] where id = '36' and cardinality(notas) = 0;
-- 37 · De Luxe Mixture · Peterson · TR 2267 (Flavoring: Honey, Vanilla, Walnut)
update public.tabacos set notas = array['vainilla', 'nuez', 'miel']::text[] where id = '37' and cardinality(notas) = 0;
-- 39 · Early Morning Pipe · Peterson · Smokingpipes 346525
update public.tabacos set notas = array['terroso']::text[] where id = '39' and cardinality(notas) = 0;
-- 46 · Nightcap · Peterson · Smokingpipes 346526
update public.tabacos set notas = array['ahumado']::text[] where id = '46' and cardinality(notas) = 0;
-- 353 · Sunset Breeze · Peterson · TR 1729 (Flavoring: Amaretto)
update public.tabacos set notas = array['licor', 'almendra']::text[] where id = '353' and cardinality(notas) = 0;
-- 354 · Sweet Killarney · Peterson · TR 1697 (Flavoring: Caramel, Cream)
update public.tabacos set notas = array['caramelo']::text[] where id = '354' and cardinality(notas) = 0;
-- 355 · University Flake · Peterson · TR 933 (Flavoring: Plum)
update public.tabacos set notas = array['ciruela']::text[] where id = '355' and cardinality(notas) = 0;
-- 57 · 1864 Perfect Mixture · W.Ø. Larsen · TR 2849 (Flavoring: Amaretto, Cocoa/Chocolate, Coffee, Orange, Whisky)
update public.tabacos set notas = array['licor', 'chocolate', 'café', 'cítricos', 'whisky']::text[] where id = '57' and cardinality(notas) = 0;
-- 47 · Old Dublin · Peterson · TR 931 (descripción: aroma ahumado del latakia)
update public.tabacos set notas = array['ahumado']::text[] where id = '47' and cardinality(notas) = 0;
-- 45 · My Mixture 965 · Peterson · Smokingpipes 346524
update public.tabacos set notas = array['ahumado', 'terroso']::text[] where id = '45' and cardinality(notas) = 0;
-- 35 · 3 P's Peterson's Perfect Plug · Peterson · TR 3526 (Flavoring: Floral Essences)
update public.tabacos set notas = array['floral']::text[] where id = '35' and cardinality(notas) = 0;
-- 350 · Erinmore Mixture · Erinmore · TR 1128 (Flavoring: Pineapple)
update public.tabacos set notas = array['frutas tropicales']::text[] where id = '350' and cardinality(notas) = 0;
-- 349 · Erinmore Flake · Erinmore · TR 1126 (Flavoring: Floral Essences; descripción: nota floral y afrutada)
update public.tabacos set notas = array['floral']::text[] where id = '349' and cardinality(notas) = 0;
-- 59 · Signature Vintage Mixture · W.Ø. Larsen · TR 2065 (Flavoring: Caramel, Fruit/Citrus, Vanilla)
update public.tabacos set notas = array['caramelo', 'vainilla']::text[] where id = '59' and cardinality(notas) = 0;
-- 210 · Haunted Bookshop Cake · Cornell & Diehl · Smokingpipes 486872 (burley de sabor a nuez, perique especiado)
update public.tabacos set notas = array['nuez', 'pimienta']::text[] where id = '210' and cardinality(notas) = 0;
-- 214 · Sansepolcro · Cornell & Diehl · Smokingpipes 213177 (cítricos suaves, especia terrosa a clavo)
update public.tabacos set notas = array['cítricos', 'terroso', 'especias dulces']::text[] where id = '214' and cardinality(notas) = 0;
-- 1003 · Bagpiper's Dream · Rattray's · TR 2838 (Flavoring: Cognac)
update public.tabacos set notas = array['licor']::text[] where id = '1003' and cardinality(notas) = 0;
-- 2187 · Gold Blend · Peterson · TR 1898 (Flavoring: Cinnamon, Vanilla; descripción: nuez de nogal, vainilla, canela)
update public.tabacos set notas = array['nuez', 'vainilla', 'especias dulces']::text[] where id = '2187' and cardinality(notas) = 0;
-- 1095 · Caribbean Blue Seegar · Kopp · TR 13249 (Flavoring: Caramel, Fruit/Citrus, Rum, Tonquin Bean)
update public.tabacos set notas = array['tonka', 'cítricos', 'ron', 'caramelo']::text[] where id = '1095' and cardinality(notas) = 0;
-- 1096 · Caribbean Blue Wynne · Kopp · TR 13227 (Flavoring: Fruit/Citrus, Honey, Rum, Vanilla; descripción: bayas de goji)
update public.tabacos set notas = array['ron', 'miel', 'vainilla', 'frutos rojos']::text[] where id = '1096' and cardinality(notas) = 0;
-- 1093 · Caribbean Blue Graham · Kopp · TR 13251 (Flavoring: Blackberry, Nuts; descripción: coco, mora, frutos secos)
update public.tabacos set notas = array['frutos rojos', 'frutas tropicales', 'frutos secos']::text[] where id = '1093' and cardinality(notas) = 0;
-- 1092 · Caribbean Blue Drake · Kopp · TR 13252 (Flavoring: Pineapple, Vanilla; descripción: piña, plátano)
update public.tabacos set notas = array['frutas tropicales', 'vainilla']::text[] where id = '1092' and cardinality(notas) = 0;
-- 1091 · Caribbean Blue Bellamy · Kopp · TR 13245 (Flavoring: Orange, Vanilla; descripción: melón, plátano, naranja)
update public.tabacos set notas = array['frutas tropicales', 'cítricos', 'vainilla']::text[] where id = '1091' and cardinality(notas) = 0;
-- 1094 · Caribbean Blue Rackham · Kopp · TR 13253 (Flavoring: Cherry, Mango, Plum; descripción: mango, maracuyá, fresa, mirabel, cereza)
update public.tabacos set notas = array['frutas tropicales', 'ciruela mirabel', 'cereza', 'frutos rojos']::text[] where id = '1094' and cardinality(notas) = 0;
-- 1124 · 1-Q · Lane Limited · TR 630 (Flavoring: Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1124' and cardinality(notas) = 0;
-- 289 · American Delite · Gawith Hoggarth · TR 1702 (Flavoring: Caramel, Cocoa/Chocolate, Vanilla)
update public.tabacos set notas = array['chocolate', 'vainilla', 'caramelo']::text[] where id = '289' and cardinality(notas) = 0;
-- 1007 · Buckingham · Rattray's · TR 9409 (Flavoring: Cinnamon, Nuts, Vanilla; descripción: nuez de nogal, vainilla bourbon, canela)
update public.tabacos set notas = array['nuez', 'vainilla', 'especias dulces']::text[] where id = '1007' and cardinality(notas) = 0;
-- 1009 · Exotic Passion · Rattray's · TR 10652 (Flavoring: Floral, Mango, Maple, Orange)
update public.tabacos set notas = array['cítricos', 'frutas tropicales', 'arce', 'floral']::text[] where id = '1009' and cardinality(notas) = 0;
-- 1125 · BCA · Lane Limited · TR 635 (Flavoring: Alcohol/Liquor, Cocoa/Chocolate, Vanilla, Whisky)
update public.tabacos set notas = array['licor', 'chocolate', 'vainilla', 'whisky']::text[] where id = '1125' and cardinality(notas) = 0;
-- 1129 · Hazelnut · Lane Limited · TR 665 (Flavoring: Nuts; descripción: avellanas tostadas)
update public.tabacos set notas = array['avellana']::text[] where id = '1129' and cardinality(notas) = 0;
-- 1126 · Black Raspberry · Lane Limited · TR 640 (Flavoring: Raspberry)
update public.tabacos set notas = array['frutos rojos']::text[] where id = '1126' and cardinality(notas) = 0;
-- 1134 · MV-1000 · Lane Limited · TR 676 (Flavoring: Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1134' and cardinality(notas) = 0;
-- 1133 · LL-7 · Lane Limited · TR 673 (Flavoring: Caramel, Vanilla)
update public.tabacos set notas = array['caramelo', 'vainilla']::text[] where id = '1133' and cardinality(notas) = 0;
-- 1135 · RLP-6 · Lane Limited · TR 682 (Flavoring: Cream, Honey, Molasses, Nougat, Vanilla)
update public.tabacos set notas = array['vainilla', 'miel', 'azúcar moreno', 'turrón']::text[] where id = '1135' and cardinality(notas) = 0;
-- 1136 · TK-6 · Lane Limited · TR 688 (Flavoring: Cherry)
update public.tabacos set notas = array['cereza']::text[] where id = '1136' and cardinality(notas) = 0;
-- 1130 · HG-2000 · Lane Limited · TR 666 (Flavoring: Vanilla; descripción: sabor terroso)
update public.tabacos set notas = array['vainilla', 'terroso']::text[] where id = '1130' and cardinality(notas) = 0;
-- 1122 · Sungold · Stanwell · TR 2715 (Flavoring: Plum, Vanilla)
update public.tabacos set notas = array['vainilla', 'ciruela']::text[] where id = '1122' and cardinality(notas) = 0;
-- 1121 · Melange · Stanwell · TR 2978 (Flavoring: Apricot, Vanilla)
update public.tabacos set notas = array['albaricoque', 'vainilla']::text[] where id = '1121' and cardinality(notas) = 0;
-- 1082 · Danish Mixture · Davidoff · TR 434 (Flavoring: Figs, Honey, Maple, Walnut)
update public.tabacos set notas = array['higo', 'miel', 'arce', 'nuez']::text[] where id = '1082' and cardinality(notas) = 0;
-- 1086 · Red Mixture · Davidoff · TR 3717 (Flavoring: Caramel, Vanilla)
update public.tabacos set notas = array['caramelo', 'vainilla']::text[] where id = '1086' and cardinality(notas) = 0;
-- 287 · Sweet Peach · Gawith Hoggarth · TR 1062 (Flavoring: Peach)
update public.tabacos set notas = array['melocotón']::text[] where id = '287' and cardinality(notas) = 0;
-- 329 · Kendal Gold #18 - Peach · Gawith Hoggarth · TR 10466 (Flavoring: Peach)
update public.tabacos set notas = array['melocotón']::text[] where id = '329' and cardinality(notas) = 0;
-- 332 · Kendal Gold #9 - Coconut · Gawith Hoggarth · TR 10464 (descripción: cubierta de coco)
update public.tabacos set notas = array['frutas tropicales']::text[] where id = '332' and cardinality(notas) = 0;
-- 337 · Kentucky Nougat · Gawith Hoggarth · TR 3716 (descripción: toffee cremoso y cacao)
update public.tabacos set notas = array['caramelo', 'chocolate']::text[] where id = '337' and cardinality(notas) = 0;
-- 342 · Ultimum · Gawith Hoggarth · TR 6840 (Flavoring: Caramel, Cherry)
update public.tabacos set notas = array['cereza', 'caramelo']::text[] where id = '342' and cardinality(notas) = 0;
-- 1153 · Devil's Holiday · Dan Tobacco · TR 1796 (Flavoring: Blackcurrant; descripción: frutos del bosque)
update public.tabacos set notas = array['frutos rojos']::text[] where id = '1153' and cardinality(notas) = 0;
-- 1152 · Da Vinci · Dan Tobacco · TR 404 (descripción: vino tinto toscano)
update public.tabacos set notas = array['vino']::text[] where id = '1152' and cardinality(notas) = 0;
-- 1151 · Blue Note · Dan Tobacco · TR 403 (descripción: frutas exóticas, vainilla bourbon)
update public.tabacos set notas = array['frutas tropicales', 'vainilla']::text[] where id = '1151' and cardinality(notas) = 0;
-- 1187 · Blackpool · Esoterica · TR 487 (Flavoring: Licorice)
update public.tabacos set notas = array['regaliz']::text[] where id = '1187' and cardinality(notas) = 0;
-- 1198 · Ramsgate · Esoterica · TR 499 (Flavoring: Licorice)
update public.tabacos set notas = array['regaliz']::text[] where id = '1198' and cardinality(notas) = 0;
-- 1106 · 4th Generation 1897 · Erik Stokkebye · TR 5365 (Flavoring: Honey, Vanilla)
update public.tabacos set notas = array['vainilla', 'miel']::text[] where id = '1106' and cardinality(notas) = 0;
-- 1108 · 4th Generation 1957 · Erik Stokkebye · TR 5724 (Flavoring: Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1108' and cardinality(notas) = 0;
-- 1109 · 4th Generation 1982 · Erik Stokkebye · TR 9072 (Flavoring: Blackberry, Vanilla)
update public.tabacos set notas = array['frutos rojos', 'vainilla']::text[] where id = '1109' and cardinality(notas) = 0;
-- 140 · King Cake · Cornell & Diehl · TR 10911 (Flavoring: Nuts, Plum, Rum)
update public.tabacos set notas = array['frutos secos', 'ciruela', 'ron']::text[] where id = '140' and cardinality(notas) = 0;
-- 1146 · Z50 Black Cordial · Sutliff · TR 5355 (Flavoring: Cherry, Vanilla)
update public.tabacos set notas = array['cereza', 'vainilla']::text[] where id = '1146' and cardinality(notas) = 0;
-- 1144 · Creme Brulee · Sutliff · TR 3085 (Flavoring: Caramel, Honey, Vanilla)
update public.tabacos set notas = array['vainilla', 'caramelo', 'miel']::text[] where id = '1144' and cardinality(notas) = 0;
-- 1159 · Milonga · Dan Tobacco · TR 2711 (Flavoring: Caramel, Vanilla)
update public.tabacos set notas = array['caramelo', 'vainilla']::text[] where id = '1159' and cardinality(notas) = 0;
-- 1168 · Treasures of Ireland: Galway · Dan Tobacco · TR 2710 (Flavoring: Blackberry, Vanilla)
update public.tabacos set notas = array['frutos rojos', 'vainilla']::text[] where id = '1168' and cardinality(notas) = 0;
-- 376 · Jolly Old Saint Nicholas · Cornell & Diehl · TR 11763 (Flavoring: Ginger, Orange; descripción: licor de naranja y jengibre)
update public.tabacos set notas = array['licor', 'cítricos']::text[] where id = '376' and cardinality(notas) = 0;
-- 347 · Red Ambrosia · STG · TR 696 (Flavoring: Cherry; descripción: cerezas maduras)
update public.tabacos set notas = array['cereza']::text[] where id = '347' and cardinality(notas) = 0;
-- 1088 · Discovery Argentina Cavendish · Davidoff · TR 10965 (Flavoring: Honey)
update public.tabacos set notas = array['miel']::text[] where id = '1088' and cardinality(notas) = 0;
-- 1090 · Discovery Malawi Dark Cavendish · Davidoff · TR 10967 (Flavoring: Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1090' and cardinality(notas) = 0;
-- 1118 · Classic · Stanwell · TR 2652 (Flavoring: Brandy, Coffee, Plum)
update public.tabacos set notas = array['ciruela', 'licor', 'café']::text[] where id = '1118' and cardinality(notas) = 0;
-- 1119 · Green & Indigo · Stanwell · TR 11761 (Flavoring: Apple, Blackcurrant)
update public.tabacos set notas = array['frutos rojos', 'manzana']::text[] where id = '1119' and cardinality(notas) = 0;
-- 1120 · Jubilee · Stanwell · TR 2224 (Flavoring: Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1120' and cardinality(notas) = 0;
-- 1142 · Wild C · Mc Lintock · TR 826 (Flavoring: Cherry)
update public.tabacos set notas = array['cereza']::text[] where id = '1142' and cardinality(notas) = 0;
-- 1149 · Bi Bo – Biker & Bolzer · Dan Tobacco · TR 9466 (Flavoring: Orange, Vanilla; descripción: naranja y mandarina)
update public.tabacos set notas = array['cítricos', 'vainilla']::text[] where id = '1149' and cardinality(notas) = 0;
-- 1211 · #7 · Watch City · TR 2456 (descripción: sabor a nuez del burley)
update public.tabacos set notas = array['nuez']::text[] where id = '1211' and cardinality(notas) = 0;
-- 1212 · 4-Q · Watch City · TR 12131 (Flavoring: Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1212' and cardinality(notas) = 0;
-- 1213 · Bada-Bing! · Watch City · TR 2457 (Flavoring: Cherry; descripción: cereza, vainilla, especiada con perique)
update public.tabacos set notas = array['cereza', 'vainilla', 'pimienta']::text[] where id = '1213' and cardinality(notas) = 0;
-- 1219 · Eureka · Watch City · TR 4287 (Flavoring: Whisky)
update public.tabacos set notas = array['whisky']::text[] where id = '1219' and cardinality(notas) = 0;
-- 1221 · None of Your Business · Watch City · TR 5205 (Flavoring: Apple, Blackberry, Peach, Raspberry)
update public.tabacos set notas = array['manzana', 'frutos rojos', 'melocotón']::text[] where id = '1221' and cardinality(notas) = 0;
-- 2299 · Bill Bailey's Birthday Blend · Dan Tobacco · TR 1438 (Flavoring: Liquor, Orange; descripción: Blue Curaçao)
update public.tabacos set notas = array['licor', 'cítricos']::text[] where id = '2299' and cardinality(notas) = 0;
-- 2330 · Peter Rasmussen Black Label · Dan Tobacco · TR 11916 (Flavoring: Blackcurrant, Bourbon, Vanilla)
update public.tabacos set notas = array['frutos rojos', 'vainilla']::text[] where id = '2330' and cardinality(notas) = 0;
-- 11 · Cannon Plug · Samuel Gawith · TR 1015 (Flavoring: Floral Essences; descripción: «honey dew»)
update public.tabacos set notas = array['floral']::text[] where id = '11' and cardinality(notas) = 0;
-- 16 · Fire Dance Flake · Samuel Gawith · TR 1965 (Flavoring: Blackberry, Brandy, Vanilla)
update public.tabacos set notas = array['frutos rojos', 'licor', 'vainilla']::text[] where id = '16' and cardinality(notas) = 0;
-- 208 · Golden Days of Yore · Cornell & Diehl · TR 9912 (descripción: jengibre, nuez moscada, pimienta de Jamaica, canela, chocolate, ron oscuro)
update public.tabacos set notas = array['especias dulces', 'chocolate', 'ron']::text[] where id = '208' and cardinality(notas) = 0;
-- 222 · We Three Kings · Cornell & Diehl · TR 9109 (Flavoring: Cinnamon, Vanilla; descripción: pimienta de Jamaica, canela, vainilla)
update public.tabacos set notas = array['especias dulces', 'vainilla']::text[] where id = '222' and cardinality(notas) = 0;
-- 389 · Rich Dark Spring Dew · Gawith Hoggarth · TR 2884 (Rich Dark Honeydew, en la UE Spring Dew; Flavoring: Floral, Honey, Maple)
update public.tabacos set notas = array['arce', 'miel', 'floral']::text[] where id = '389' and cardinality(notas) = 0;
-- 314 · Caribbean Coconut · Gawith Hoggarth · TR 7850 (descripción: coco tropical)
update public.tabacos set notas = array['frutas tropicales']::text[] where id = '314' and cardinality(notas) = 0;
-- 1023 · Westminster Abbey · Rattray's · TR 9494 (Flavoring: Caramel, Cream)
update public.tabacos set notas = array['caramelo']::text[] where id = '1023' and cardinality(notas) = 0;
-- 1029 · Glen Piper · Robert McConnell · TR 972 (Flavoring: Cocoa/Chocolate, Rum)
update public.tabacos set notas = array['chocolate', 'ron']::text[] where id = '1029' and cardinality(notas) = 0;
-- 1085 · Scottish Mixture · Davidoff · TR 441 (Flavoring: Whisky; descripción: aroma floral, whisky escocés)
update public.tabacos set notas = array['whisky', 'floral']::text[] where id = '1085' and cardinality(notas) = 0;
-- 1117 · Club Mixture · Orlik · TR 9110 (Flavoring: Caramel, Vanilla)
update public.tabacos set notas = array['caramelo', 'vainilla']::text[] where id = '1117' and cardinality(notas) = 0;
-- 1193 · Kingsbridge · Esoterica · TR 494 (Flavoring: Licorice)
update public.tabacos set notas = array['regaliz']::text[] where id = '1193' and cardinality(notas) = 0;
-- 1200 · St. Ives · Esoterica · TR 501 (Flavoring: Coffee, Fruit/Citrus)
update public.tabacos set notas = array['café']::text[] where id = '1200' and cardinality(notas) = 0;
-- 2030 · Moroccan Bazaar · HU Tobacco · TR 11567 (Flavoring: Anisette, Cinnamon, Floral, Honey, Spices; descripción: pimienta, canela, anís, incienso, jazmín, miel, higos)
update public.tabacos set notas = array['especias dulces', 'anís', 'incienso', 'floral', 'miel']::text[] where id = '2030' and cardinality(notas) = 0;
-- 2033 · Geniet Moment · HU Tobacco · TR 10658 (Flavoring: Coffee, Vanilla)
update public.tabacos set notas = array['café', 'vainilla']::text[] where id = '2033' and cardinality(notas) = 0;
-- 2029 · The Untouchables · HU Tobacco · TR 11759 (Flavoring: Floral Essences; descripción: cedro, rosa)
update public.tabacos set notas = array['floral', 'cedro']::text[] where id = '2029' and cardinality(notas) = 0;
-- 2052 · X-Mystery 113 · Solani · TR 1985 (Flavoring: Blackcurrant, Cocoa/Chocolate, Rum)
update public.tabacos set notas = array['frutos rojos', 'ron', 'chocolate']::text[] where id = '2052' and cardinality(notas) = 0;
-- 2045 · Festival 333 · Solani · TR 4604 (descripción: un toque de ciruela)
update public.tabacos set notas = array['ciruela']::text[] where id = '2045' and cardinality(notas) = 0;
-- 2068 · Own Mixture No. 55 · Ilsted · TR 585 (Flavoring: Plum, Vanilla)
update public.tabacos set notas = array['ciruela', 'vainilla']::text[] where id = '2068' and cardinality(notas) = 0;
-- 2073 · Own Mixture No. 100 · Ilsted · TR 584 (Flavoring: Fruit/Citrus, Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '2073' and cardinality(notas) = 0;
-- 2094 · Harbour Dreams · Per G. Jensen · TR 13555 (descripción: chocolate cremoso y almendras tostadas)
update public.tabacos set notas = array['chocolate', 'almendra']::text[] where id = '2094' and cardinality(notas) = 0;
-- 2058 · Professional · Reiner · TR 1216 (descripción: barricas de whisky, sabor a nuez)
update public.tabacos set notas = array['whisky', 'nuez']::text[] where id = '2058' and cardinality(notas) = 0;
-- 1223 · Aromatic · Sir Walter Raleigh · TR 1913 (Flavoring: Alcohol/Liquor, Orange)
update public.tabacos set notas = array['licor', 'cítricos']::text[] where id = '1223' and cardinality(notas) = 0;
-- 1173 · Century · Germain's · TR 10962 (Flavoring: Liquor, Rum; descripción: ron y vino)
update public.tabacos set notas = array['ron', 'vino']::text[] where id = '1173' and cardinality(notas) = 0;
-- 2132 · Mixture No. 6 · Exclusiv · TR 1133 (No. 6, antes Sherry & Cherry; Flavoring: Cherry, Sherry)
update public.tabacos set notas = array['vino', 'cereza']::text[] where id = '2132' and cardinality(notas) = 0;
-- 1024 · Black and Gold Mixture · Robert McConnell · TR 965 (Flavoring: Other/Misc, Vanilla)
update public.tabacos set notas = array['vainilla']::text[] where id = '1024' and cardinality(notas) = 0;
-- 2074 · Harlekin · Winsløw · TR 4191 (Flavoring: Fruit/Citrus, Vanilla; descripción: vainilla, coco, lima)
update public.tabacos set notas = array['vainilla', 'frutas tropicales', 'cítricos']::text[] where id = '2074' and cardinality(notas) = 0;
-- 2304 · Bjarne Flake de Luxe · Dan Tobacco · TR 66 (Flavoring: Honey)
update public.tabacos set notas = array['miel']::text[] where id = '2304' and cardinality(notas) = 0;
-- 2322 · Memories of Tuscany · Dan Tobacco · pfeifen-shop-online.de (aroma: uva y grosella negra; TR no la tiene)
update public.tabacos set notas = array['frutos rojos']::text[] where id = '2322' and cardinality(notas) = 0;
-- 2128 · Mixture No. 2 · Exclusiv · pfeifen-shop-online.de (aroma de mango; TR no la tiene con este nombre)
update public.tabacos set notas = array['frutas tropicales']::text[] where id = '2128' and cardinality(notas) = 0;
-- 2241 · Cube Silver · STG · pfeifen-shop-online.de (aroma: Karamell)
update public.tabacos set notas = array['caramelo']::text[] where id = '2241' and cardinality(notas) = 0;
-- 2070 · Own Mixture No. 77 · Ilsted · pfeifen-shop-online.de (descripción: aroma de pasas)
update public.tabacos set notas = array['pasas']::text[] where id = '2070' and cardinality(notas) = 0;
-- 2356 · Summer Blend No. 12 · Vauen · pfeifen-shop-online.de (aroma: Tropical Fruits; descripción: sandía)
update public.tabacos set notas = array['frutas tropicales']::text[] where id = '2356' and cardinality(notas) = 0;
-- 1164 · S.V.H. · Dan Tobacco · pfeifen-shop-online.de (aroma: Vanilla, Honey; S.V.H. = Sweet Vanilla Honeydew)
update public.tabacos set notas = array['vainilla', 'miel']::text[] where id = '1164' and cardinality(notas) = 0;
-- 124 · Founding Fathers · Cornell & Diehl · TR 4325 (Flavoring: Pomegranate)
update public.tabacos set notas = array['granada']::text[] where id = '124' and cardinality(notas) = 0;
-- 161 · Old Grove · Cornell & Diehl · TR 9740 (Flavoring: Pomegranate)
update public.tabacos set notas = array['granada']::text[] where id = '161' and cardinality(notas) = 0;
