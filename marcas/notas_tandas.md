# Notas de sabor: tandas

Método (5/11/2026): solo notas que la fuente dice expresamente. Tobacco Reviews: campo *Flavoring* (aroma añadido) y descripción del fabricante, nunca las reseñas. Si TR no trae nada, la ficha de Smokingpipes. Nada deducido de las hojas. Vocabulario: lista cerrada de `claude/notas-de-sabor.md` más palabras ya usadas en la web (frutas tropicales, arce, albaricoque, turrón, ciruela mirabel). Coco y piña → frutas tropicales; amaretto y coñac → licor. Categorías genéricas de TR («Fruit / Citrus» sola, «Other / Misc») no dan nota.

Truco para ahorrar búsquedas: la página de marca de TR (p. ej. /brand/48/rattray/) da las URL de cada mezcla y se pueden abrir con WebFetch.

## Hechas (SQL 50, 61 fichas)
```
7|whisky,ahumado|TR 9263 (Flavoring: Whisky; descripción: whisky de malta, fondo ahumado)
9|pimienta|Smokingpipes 652407 (perique especiado)
23|ron|TR 2218 (Flavoring: Rum)
36|frutas tropicales,arce,ron,vainilla|TR 2266 (Flavoring: Fruit/Citrus, Maple, Rum, Vanilla; descripción: fruta tropical)
37|vainilla,nuez,miel|TR 2267 (Flavoring: Honey, Vanilla, Walnut)
39|terroso|Smokingpipes 346525
46|ahumado|Smokingpipes 346526
353|licor,almendra|TR 1729 (Flavoring: Amaretto)
354|caramelo|TR 1697 (Flavoring: Caramel, Cream)
355|ciruela|TR 933 (Flavoring: Plum)
57|licor,chocolate,café,cítricos,whisky|TR 2849 (Flavoring: Amaretto, Cocoa/Chocolate, Coffee, Orange, Whisky)
47|ahumado|TR 931 (descripción: aroma ahumado del latakia)
45|ahumado,terroso|Smokingpipes 346524
35|floral|TR 3526 (Flavoring: Floral Essences)
350|frutas tropicales|TR 1128 (Flavoring: Pineapple)
349|floral|TR 1126 (Flavoring: Floral Essences; descripción: nota floral y afrutada)
59|caramelo,vainilla|TR 2065 (Flavoring: Caramel, Fruit/Citrus, Vanilla)
210|nuez,pimienta|Smokingpipes 486872 (burley de sabor a nuez, perique especiado)
214|cítricos,terroso,especias dulces|Smokingpipes 213177 (cítricos suaves, especia terrosa a clavo)
1003|licor|TR 2838 (Flavoring: Cognac)
2187|nuez,vainilla,especias dulces|TR 1898 (Flavoring: Cinnamon, Vanilla; descripción: nuez de nogal, vainilla, canela)
1095|tonka,cítricos,ron,caramelo|TR 13249 (Flavoring: Caramel, Fruit/Citrus, Rum, Tonquin Bean)
1096|ron,miel,vainilla,frutos rojos|TR 13227 (Flavoring: Fruit/Citrus, Honey, Rum, Vanilla; descripción: bayas de goji)
1093|frutos rojos,frutas tropicales,frutos secos|TR 13251 (Flavoring: Blackberry, Nuts; descripción: coco, mora, frutos secos)
1092|frutas tropicales,vainilla|TR 13252 (Flavoring: Pineapple, Vanilla; descripción: piña, plátano)
1091|frutas tropicales,cítricos,vainilla|TR 13245 (Flavoring: Orange, Vanilla; descripción: melón, plátano, naranja)
1094|frutas tropicales,ciruela mirabel,cereza,frutos rojos|TR 13253 (Flavoring: Cherry, Mango, Plum; descripción: mango, maracuyá, fresa, mirabel, cereza)
1124|vainilla|TR 630 (Flavoring: Vanilla)
289|chocolate,vainilla,caramelo|TR 1702 (Flavoring: Caramel, Cocoa/Chocolate, Vanilla)
1007|nuez,vainilla,especias dulces|TR 9409 (Flavoring: Cinnamon, Nuts, Vanilla; descripción: nuez de nogal, vainilla bourbon, canela)
1009|cítricos,frutas tropicales,arce,floral|TR 10652 (Flavoring: Floral, Mango, Maple, Orange)
1125|licor,chocolate,vainilla,whisky|TR 635 (Flavoring: Alcohol/Liquor, Cocoa/Chocolate, Vanilla, Whisky)
1129|avellana|TR 665 (Flavoring: Nuts; descripción: avellanas tostadas)
1126|frutos rojos|TR 640 (Flavoring: Raspberry)
1134|vainilla|TR 676 (Flavoring: Vanilla)
1133|caramelo,vainilla|TR 673 (Flavoring: Caramel, Vanilla)
1135|vainilla,miel,azúcar moreno,turrón|TR 682 (Flavoring: Cream, Honey, Molasses, Nougat, Vanilla)
1136|cereza|TR 688 (Flavoring: Cherry)
1130|vainilla,terroso|TR 666 (Flavoring: Vanilla; descripción: sabor terroso)
1122|vainilla,ciruela|TR 2715 (Flavoring: Plum, Vanilla)
1121|albaricoque,vainilla|TR 2978 (Flavoring: Apricot, Vanilla)
1082|higo,miel,arce,nuez|TR 434 (Flavoring: Figs, Honey, Maple, Walnut)
1086|caramelo,vainilla|TR 3717 (Flavoring: Caramel, Vanilla)
287|melocotón|TR 1062 (Flavoring: Peach)
329|melocotón|TR 10466 (Flavoring: Peach)
332|frutas tropicales|TR 10464 (descripción: cubierta de coco)
337|caramelo,chocolate|TR 3716 (descripción: toffee cremoso y cacao)
342|cereza,caramelo|TR 6840 (Flavoring: Caramel, Cherry)
1153|frutos rojos|TR 1796 (Flavoring: Blackcurrant; descripción: frutos del bosque)
1152|vino|TR 404 (descripción: vino tinto toscano)
1151|frutas tropicales,vainilla|TR 403 (descripción: frutas exóticas, vainilla bourbon)
1187|regaliz|TR 487 (Flavoring: Licorice)
1198|regaliz|TR 499 (Flavoring: Licorice)
1106|vainilla,miel|TR 5365 (Flavoring: Honey, Vanilla)
1108|vainilla|TR 5724 (Flavoring: Vanilla)
1109|frutos rojos,vainilla|TR 9072 (Flavoring: Blackberry, Vanilla)
140|frutos secos,ciruela,ron|TR 10911 (Flavoring: Nuts, Plum, Rum)
1146|cereza,vainilla|TR 5355 (Flavoring: Cherry, Vanilla)
1144|vainilla,caramelo,miel|TR 3085 (Flavoring: Caramel, Honey, Vanilla)
1159|caramelo,vainilla|TR 2711 (Flavoring: Caramel, Vanilla)
1168|frutos rojos,vainilla|TR 2710 (Flavoring: Blackberry, Vanilla)
```

## Revisadas sin nota en la fuente
```
15 Commonwealth Mixture (TR 1018: sin notas en la descripción)
26 Squadron Leader (Smokingpipes: sin notas)
30 Full Virginia Flake (TR 1020: sin notas)
49 Sherlock Holmes (TR 932: solo «Fruit / Citrus» genérico)
50 Peterson Standard Mixture (Smokingpipes: sin notas)
282 STG Virginia Flake (TR 715: sin notas)
58 W.Ø. Larsen Old Fashioned (TR 1322: «Other/Misc», sin notas)
112 Dreams of Kadath (Smokingpipes: sin descripción)
162 Old Joe Krantz (Smokingpipes: sin notas)
223 Star of the East (Smokingpipes: sin notas)
253 Odyssey (Smokingpipes: sin notas)
1002 Accountant's Mixture, 1004 Black Mallory, 1006 Brown Clunee, 1010 Hal O' The Wynd, 1014 Marlin Flake, 1016 Old Gowrie, 1019 Red Rapparee (TR: sin notas concretas; Red Rapparee solo dice «especiada»)
1132 Lane HS-3 (TR 669: Other/Misc)
1131 Lane HGL (TR 667: sin Flavoring)
2240 Cube Gold (TR 3364: solo «Fruit / Citrus»)
2237 7 Seas Gold Blend (TR 3718: Other/Misc)
294 GH Mahogany Flake (TR 2940: «sabor a caoba», sin nota concreta)
1192 Esoterica Hastings (TR 492: Other/Misc)
88 C&D Brigadier (TR 249: solo «fruta» genérico)
370 C&D Snug Harbor (TR 2765: «licor» genérico, sin nombre)
148 C&D Milk & Honey (TR 2549: Other/Misc)
1156 Dan Liberty (TR 1519: solo «especiado»)
124 C&D Founding Fathers y 161 Old Grove: granada (TR 4325 y 9740). «Granada» no está en la lista: pendiente de que el administrador decida si se añade.
```

## Aromáticas que faltan por revisar (79)
- 11 Cannon Plug · Samuel Gawith
- 16 Fire Dance Flake · Samuel Gawith
- 17 Fire Dance Plug · Samuel Gawith
- 208 Golden Days of Yore · Cornell & Diehl
- 222 We Three Kings · Cornell & Diehl
- 314 Caribbean Coconut · Gawith Hoggarth
- 328 Kendal Gold #14 - Dutch · Gawith Hoggarth
- 347 Red Ambrosia · STG
- 376 Jolly Old Saint Nicholas · Cornell & Diehl
- 389 Rich Dark Spring Dew · Gawith Hoggarth
- 398 Gold Block · St. Bruno
- 422 Mixture Modern · STG
- 1023 Westminster Abbey · Rattray's
- 1024 Black and Gold Mixture · Robert McConnell
- 1029 Glen Piper · Robert McConnell
- 1052 The Fragrant Blend · Robert McConnell
- 1085 Scottish Mixture · Davidoff
- 1088 Discovery Argentina Cavendish · Davidoff
- 1090 Discovery Malawi Dark Cavendish · Davidoff
- 1112 4 Seasons Spring Mixture · Erik Stokkebye
- 1117 Club Mixture · Orlik
- 1118 Classic · Stanwell
- 1119 Green & Indigo · Stanwell
- 1120 Jubilee · Stanwell
- 1142 Wild C · Mc Lintock
- 1149 Bi Bo – Biker & Bolzer · Dan Tobacco
- 1164 S.V.H. · Dan Tobacco
- 1173 Century · Germain's
- 1193 Kingsbridge · Esoterica
- 1200 St. Ives · Esoterica
- 1203 Woodbridge · Esoterica
- 1211 #7 · Watch City
- 1212 4-Q · Watch City
- 1213 Bada-Bing! · Watch City
- 1219 Eureka · Watch City
- 1221 None of Your Business · Watch City
- 1223 Aromatic · Sir Walter Raleigh
- 1226 Half and Half · Half and Half
- 2029 The Untouchables · HU Tobacco
- 2030 Moroccan Bazaar · HU Tobacco
- 2033 Geniet Moment · HU Tobacco
- 2045 Festival 333 · Solani
- 2052 X-Mystery 113 · Solani
- 2058 Professional · Reiner
- 2068 Own Mixture No. 55 · Ilsted
- 2070 Own Mixture No. 77 · Ilsted
- 2073 Own Mixture No. 100 · Ilsted
- 2074 Harlekin · Winsløw
- 2094 Harbour Dreams · Per G. Jensen
- 2099 Sundays Fantasy · Thomas Radford
- 2127 Mixture No. 1 · Exclusiv
- 2128 Mixture No. 2 · Exclusiv
- 2130 Mixture No. 4 · Exclusiv
- 2132 Mixture No. 6 · Exclusiv
- 2134 No. 032 – Extra White · Pfeifendepot
- 2197 L48 · TAK
- 2201 Typ 3/2 – Danish Blend 2.0 · TAK
- 2215 Happy Dad · TAK
- 2236 7 Seas Royal Blend · STG
- 2238 7 Seas Blue Blend · STG
- 2239 7 Seas Bright Blend · STG
- 2241 Cube Silver · STG
- 2243 Fresh & Elegant · W.Ø. Larsen
- 2246 Mixture · Käpt'n Barsdorfs Bester
- 2252 Mixture · Skandinavik
- 2269 Director's Choice · Wessex
- 2296 Fleetenkieker · Dan Tobacco
- 2299 Bill Bailey's Birthday Blend · Dan Tobacco
- 2304 Bjarne Flake de Luxe · Dan Tobacco
- 2309 Dan Pipe 2000 · Dan Tobacco
- 2317 Lütte Deern · Dan Tobacco
- 2318 Jirsa Olda's Louny Blend · Dan Tobacco
- 2322 Memories of Tuscany · Dan Tobacco
- 2328 Olaf Poulsson No. 77 · Dan Tobacco
- 2330 Peter Rasmussen Black Label · Dan Tobacco
- 2333 Sunday's Best · Dan Tobacco
- 2334 Take your time! · Dan Tobacco
- 2336 Wappen von Hamburg · Dan Tobacco
- 2356 Summer Blend No. 12 · Vauen

## Después
Las no aromáticas sin notas (unas 500): pendiente de que el usuario decida el método.
