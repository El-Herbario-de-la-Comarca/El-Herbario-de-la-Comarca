-- =====================================================================
-- 49 · Mezcla, corte y hojas que faltaban (revisión del 5/11/2026)
-- Datos leídos ficha a ficha en Tobacco Reviews (campos Blend Type, Contents y Cut).
-- Cuando Tobacco Reviews no tenía la mezcla, se usó la ficha de una tienda (pfeifen-shop-online.de,
-- Smokingpipes, smoke-king, cigarworld.de) o la web del fabricante; va indicado en cada línea.
-- Solo rellena campos vacíos: no cambia nada que ya tenga valor.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

-- 21 · Grousemoor Plug · Samuel Gawith · TR 1022
update public.tabacos set corte = 'Plug' where id = '21' and coalesce(corte, '') = '';
-- 183 · Riverboat Gambler · Cornell & Diehl · TR 2968
update public.tabacos set hojas = array['Virginia', 'Burley', 'Oriental', 'Perique']::text[] where id = '183' and hojas = '{}';
-- 189 · Three Friars · Cornell & Diehl · TR 389
update public.tabacos set hojas = array['Virginia', 'Burley', 'Perique']::text[] where id = '189' and hojas = '{}';
-- 211 · Interlude · Cornell & Diehl · TR 2855
update public.tabacos set hojas = array['Virginia']::text[] where id = '211' and hojas = '{}';
-- 347 · Red Ambrosia · STG · TR 696 (Cherry Ambrosia = Red Ambrosia en la UE)
update public.tabacos set corte = 'Ribbon' where id = '347' and coalesce(corte, '') = '';
-- 375 · Good Morning · Cornell & Diehl · TR 3405
update public.tabacos set corte = 'Ribbon' where id = '375' and coalesce(corte, '') = '';
-- 376 · Jolly Old Saint Nicholas · Cornell & Diehl · TR 11763
update public.tabacos set corte = 'Ribbon' where id = '376' and coalesce(corte, '') = '';
-- 377 · Speakeasy Navy Blend · Cornell & Diehl · TR 10910
update public.tabacos set corte = 'Flake' where id = '377' and coalesce(corte, '') = '';
-- 379 · Silent Spire · Cornell & Diehl · Smokingpipes 737254 (no está en TR)
update public.tabacos set corte = 'Plug' where id = '379' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia']::text[] where id = '379' and hojas = '{}';
-- 404 · Kentucky Blend · Amphora · TR 11976
update public.tabacos set corte = 'Broken Flake' where id = '404' and coalesce(corte, '') = '';
-- 405 · Mellow Blend · Amphora · mac-baren.com (TR no la tiene)
update public.tabacos set corte = 'Ready Rubbed' where id = '405' and coalesce(corte, '') = '';
-- 406 · Rich Aroma · Amphora · TR 1065
update public.tabacos set corte = 'Ready Rubbed' where id = '406' and coalesce(corte, '') = '';
-- 407 · Special Reserve Black Cavendish · Amphora · TR 2588
update public.tabacos set corte = 'Ribbon' where id = '407' and coalesce(corte, '') = '';
-- 408 · Nº 2 · Amphora · TR 10858
update public.tabacos set corte = 'Ribbon' where id = '408' and coalesce(corte, '') = '';
-- 409 · Nº 8 · Amphora · TR 11029
update public.tabacos set corte = 'Ribbon' where id = '409' and coalesce(corte, '') = '';
-- 413 · Ruby Melange · Holger Danske · TR 3480
update public.tabacos set corte = 'Ribbon' where id = '413' and coalesce(corte, '') = '';
-- 415 · Amsterdamer · Amsterdamer · TR 4183
update public.tabacos set hojas = array['Virginia', 'Burley', 'Kentucky']::text[] where id = '415' and hojas = '{}';
-- 416 · Black Ambrosia · STG · TR 693
update public.tabacos set corte = 'Ribbon' where id = '416' and coalesce(corte, '') = '';
-- 417 · Plumcake · STG · TR 709
update public.tabacos set corte = 'Ribbon' where id = '417' and coalesce(corte, '') = '';
-- 418 · Golden Blend · STG · TR 701
update public.tabacos set corte = 'Ready Rubbed' where id = '418' and coalesce(corte, '') = '';
-- 419 · Harmony · STG · TR 1790
update public.tabacos set corte = 'Ready Rubbed' where id = '419' and coalesce(corte, '') = '';
-- 420 · Supreme Choice · STG · pfeifen-shop-online.de (Danish, aromatizada, Loose Cut; TR no la tiene)
update public.tabacos set tipo = 'Aromática' where id = '420' and coalesce(tipo, '') = '';
update public.tabacos set corte = 'Ribbon' where id = '420' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Burley', 'Cavendish']::text[] where id = '420' and hojas = '{}';
-- 421 · Absolute Choice · STG · smoke-king (TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '421' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Burley', 'Cavendish']::text[] where id = '421' and hojas = '{}';
-- 423 · Classic Amber Loose Cut · STG · TR 5401 (Loose Cut)
update public.tabacos set corte = 'Ribbon' where id = '423' and coalesce(corte, '') = '';
-- 424 · Classic Flake · STG · TR 713 (Vanilla Cream Flake, nombre antiguo)
update public.tabacos set tipo = 'Aromática' where id = '424' and coalesce(tipo, '') = '';
update public.tabacos set hojas = array['Virginia', 'Burley', 'Cavendish']::text[] where id = '424' and hojas = '{}';
-- 425 · Classic Roll Cake · STG · TR 12474 (Curly Cut)
update public.tabacos set corte = 'Coins' where id = '425' and coalesce(corte, '') = '';
-- 426 · Dark Twist · STG · TR 699 (Curly Cut)
update public.tabacos set corte = 'Coins' where id = '426' and coalesce(corte, '') = '';
-- 427 · The Solent Mixture · STG · TR 1792
update public.tabacos set corte = 'Ribbon' where id = '427' and coalesce(corte, '') = '';
-- 428 · Latakia Blend · STG · TR 704 (Curly Cut)
update public.tabacos set corte = 'Coins' where id = '428' and coalesce(corte, '') = '';
-- 1033 · Old London Pebble Cut · Robert McConnell · TR 14
update public.tabacos set tipo = 'Virginia-Perique' where id = '1033' and coalesce(tipo, '') = '';
update public.tabacos set corte = 'Broken Flake' where id = '1033' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Perique', 'Cavendish']::text[] where id = '1033' and hojas = '{}';
-- 1035 · Pure Black Cavendish · Robert McConnell · TR 11073
update public.tabacos set corte = 'Ribbon' where id = '1035' and coalesce(corte, '') = '';
-- 1037 · Pure Burley · Robert McConnell · TR 11072
update public.tabacos set corte = 'Ribbon' where id = '1037' and coalesce(corte, '') = '';
-- 1038 · Pure Caribe · Robert McConnell · TR 3592
update public.tabacos set hojas = array['Cigarro']::text[] where id = '1038' and hojas = '{}';
-- 1040 · Pure Kentucky · Robert McConnell · TR 12703
update public.tabacos set corte = 'Ribbon' where id = '1040' and coalesce(corte, '') = '';
-- 1042 · Pure Orient · Robert McConnell · TR 13125
update public.tabacos set corte = 'Ribbon' where id = '1042' and coalesce(corte, '') = '';
-- 1045 · Red Roses · Robert McConnell · TR 2275
update public.tabacos set corte = 'Ribbon' where id = '1045' and coalesce(corte, '') = '';
-- 1050 · Sovereign Mixture · Robert McConnell · TR 5324 (Celebrated Sovereign)
update public.tabacos set corte = 'Ribbon' where id = '1050' and coalesce(corte, '') = '';
-- 1052 · The Fragrant Blend · Robert McConnell · TR 11
update public.tabacos set corte = 'Broken Flake' where id = '1052' and coalesce(corte, '') = '';
-- 1063 · Notting Hill · Robert McConnell · TR 11689
update public.tabacos set corte = 'Ribbon' where id = '1063' and coalesce(corte, '') = '';
-- 1065 · Oxford Street · Robert McConnell · TR 11697
update public.tabacos set corte = 'Ribbon' where id = '1065' and coalesce(corte, '') = '';
-- 1072 · River Thames · Robert McConnell · TR 13208 (Curly Cut)
update public.tabacos set corte = 'Coins' where id = '1072' and coalesce(corte, '') = '';
-- 1074 · St. James Park · Robert McConnell · TR 11698
update public.tabacos set corte = 'Ribbon' where id = '1074' and coalesce(corte, '') = '';
-- 1088 · Discovery Argentina Cavendish · Davidoff · TR 10965
update public.tabacos set corte = 'Ribbon' where id = '1088' and coalesce(corte, '') = '';
-- 1089 · Discovery Brazil Virginia · Davidoff · TR 10966
update public.tabacos set corte = 'Ready Rubbed' where id = '1089' and coalesce(corte, '') = '';
-- 1090 · Discovery Malawi Dark Cavendish · Davidoff · TR 10967
update public.tabacos set corte = 'Ribbon' where id = '1090' and coalesce(corte, '') = '';
-- 1118 · Classic · Stanwell · TR 2652
update public.tabacos set corte = 'Ribbon' where id = '1118' and coalesce(corte, '') = '';
-- 1119 · Green & Indigo · Stanwell · TR 11761
update public.tabacos set corte = 'Ready Rubbed' where id = '1119' and coalesce(corte, '') = '';
-- 1120 · Jubilee · Stanwell · TR 2224
update public.tabacos set corte = 'Ribbon' where id = '1120' and coalesce(corte, '') = '';
-- 1143 · R and M · R and M · cigarworld.de (TR no la tiene)
update public.tabacos set tipo = 'Aromática' where id = '1143' and coalesce(tipo, '') = '';
update public.tabacos set hojas = array['Virginia']::text[] where id = '1143' and hojas = '{}';
-- 1149 · Bi Bo – Biker & Bolzer · Dan Tobacco · TR 9466 (Buddies / Bi-Bo)
update public.tabacos set corte = 'Ribbon' where id = '1149' and coalesce(corte, '') = '';
-- 1170 · B.K. Flake · Germain's · TR 11509
update public.tabacos set hojas = array['Virginia', 'Kentucky']::text[] where id = '1170' and hojas = '{}';
-- 1178 · Mixture No. 7 · Germain's · TR 2150
update public.tabacos set tipo = 'Aromática' where id = '1178' and coalesce(tipo, '') = '';
update public.tabacos set hojas = array['Virginia', 'Burley', 'Cavendish']::text[] where id = '1178' and hojas = '{}';
-- 1211 · #7 · Watch City · TR 2456
update public.tabacos set corte = 'Ribbon' where id = '1211' and coalesce(corte, '') = '';
-- 1212 · 4-Q · Watch City · TR 12131
update public.tabacos set corte = 'Ribbon' where id = '1212' and coalesce(corte, '') = '';
-- 1213 · Bada-Bing! · Watch City · TR 2457
update public.tabacos set corte = 'Ribbon' where id = '1213' and coalesce(corte, '') = '';
-- 1214 · Beacon Blend · Watch City · TR 13682
update public.tabacos set corte = 'Cube Cut' where id = '1214' and coalesce(corte, '') = '';
-- 1215 · Blue Ridge Special · Watch City · TR 12351
update public.tabacos set corte = 'Ribbon' where id = '1215' and coalesce(corte, '') = '';
-- 1216 · Bostonian Rhapsody · Watch City · watchcitycigar.com (TR no la tiene)
update public.tabacos set hojas = array['Virginia', 'Perique']::text[] where id = '1216' and hojas = '{}';
-- 1218 · English Ernie-ental · Watch City · TR 12488
update public.tabacos set corte = 'Ribbon' where id = '1218' and coalesce(corte, '') = '';
-- 1219 · Eureka · Watch City · TR 4287
update public.tabacos set corte = 'Ribbon' where id = '1219' and coalesce(corte, '') = '';
-- 1220 · F.U.S.T.G! (Fired Up & Set To Go!) · Watch City · descripción de Watch City citada en pipesmagazine (TR no la tiene)
update public.tabacos set hojas = array['Virginia', 'Burley', 'Perique']::text[] where id = '1220' and hojas = '{}';
-- 1222 · Spiked Spumoni · Watch City · watchcitycigar.com (TR no la tiene)
update public.tabacos set tipo = 'Aromática' where id = '1222' and coalesce(tipo, '') = '';
update public.tabacos set hojas = array['Perique', 'Cavendish']::text[] where id = '1222' and hojas = '{}';
-- 2023 · Green Gold · HU Tobacco · TR 4513
update public.tabacos set tipo = 'Aromática' where id = '2023' and coalesce(tipo, '') = '';
-- 2035 · Hadde's Best Irish · HU Tobacco · TR 4506
update public.tabacos set tipo = 'Aromática' where id = '2035' and coalesce(tipo, '') = '';
-- 2041 · Nebari · HU Tobacco · TR 13059
update public.tabacos set tipo = 'Oriental' where id = '2041' and coalesce(tipo, '') = '';
-- 2116 · Meistermischung Nr. 11 · Kopp · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2116' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Cavendish']::text[] where id = '2116' and hojas = '{}';
-- 2117 · Meistermischung Nr. 22 · Kopp · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2117' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Cavendish']::text[] where id = '2117' and hojas = '{}';
-- 2118 · Meistermischung Nr. 33 · Kopp · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2118' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Cavendish']::text[] where id = '2118' and hojas = '{}';
-- 2119 · Meistermischung Nr. 44 · Kopp · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2119' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Burley', 'Cavendish']::text[] where id = '2119' and hojas = '{}';
-- 2120 · Meistermischung Nr. 55 · Kopp · pfeifen-shop-online.de (TR no la tiene)
update public.tabacos set hojas = array['Virginia', 'Burley', 'Cavendish']::text[] where id = '2120' and hojas = '{}';
-- 2121 · Meistermischung Nr. 66 · Kopp · pfeifen-shop-online.de (Danish, aromatizada; TR no la tiene)
update public.tabacos set tipo = 'Aromática' where id = '2121' and coalesce(tipo, '') = '';
update public.tabacos set hojas = array['Virginia', 'Cavendish']::text[] where id = '2121' and hojas = '{}';
-- 2122 · Meistermischung Nr. 77 Englisch sanft · Kopp · pfeifen-shop-online.de (TR no la tiene)
update public.tabacos set hojas = array['Virginia', 'Latakia', 'Cavendish']::text[] where id = '2122' and hojas = '{}';
-- 2124 · Meistermischung Nr. 99 Englisch · Kopp · pfeifen-shop-online.de (Loose Cut; «Perique/Orient: sí» sin distinguir, no se apunta)
update public.tabacos set corte = 'Ribbon' where id = '2124' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Latakia', 'Cavendish']::text[] where id = '2124' and hojas = '{}';
-- 2125 · Meistermischung Nr. 110 · Kopp · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2125' and coalesce(corte, '') = '';
update public.tabacos set hojas = array['Virginia', 'Cavendish']::text[] where id = '2125' and hojas = '{}';
-- 2175 · No. 6 · Kontor-Tabak · TR 11200
update public.tabacos set corte = 'Ribbon' where id = '2175' and coalesce(corte, '') = '';
-- 2176 · No. 20 · Kontor-Tabak · TR 13510
update public.tabacos set corte = 'Ribbon' where id = '2176' and coalesce(corte, '') = '';
-- 2179 · No. 33 · Kontor-Tabak · TR 11198
update public.tabacos set corte = 'Ready Rubbed' where id = '2179' and coalesce(corte, '') = '';
-- 2192 · A True Delight · W.Ø. Larsen · TR 2004
update public.tabacos set corte = 'Ready Rubbed' where id = '2192' and coalesce(corte, '') = '';
-- 2195 · Rainer Barbi · Dan Tobacco · TR 11496
update public.tabacos set corte = 'Ribbon' where id = '2195' and coalesce(corte, '') = '';
-- 2229 · Holmer Knudsen's Pipe Tobacco · Dan Tobacco · TR 3948
update public.tabacos set corte = 'Ready Rubbed' where id = '2229' and coalesce(corte, '') = '';
-- 2231 · Torben Dansk Latakia (Cyprus) · Dan Tobacco · TR 4316 (Latakia Cypern)
update public.tabacos set corte = 'Ribbon' where id = '2231' and coalesce(corte, '') = '';
-- 2232 · Torben Dansk Louisiana Perique · Dan Tobacco · TR 11286
update public.tabacos set corte = 'Ribbon' where id = '2232' and coalesce(corte, '') = '';
-- 2234 · Torben Dansk Burley · Dan Tobacco · TR 3464
update public.tabacos set corte = 'Ribbon' where id = '2234' and coalesce(corte, '') = '';
-- 2238 · 7 Seas Blue Blend · STG · TR 3677 (7 Seas Royal Blend; gqtobaccos lo vende como «7 Seas Royal (Blue)»)
update public.tabacos set corte = 'Ribbon' where id = '2238' and coalesce(corte, '') = '';
-- 2247 · Red · Käpt'n Barsdorfs Bester · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2247' and coalesce(corte, '') = '';
-- 2291 · No. 5 · Chacom · TR 12302
update public.tabacos set corte = 'Broken Flake' where id = '2291' and coalesce(corte, '') = '';
-- 2296 · Fleetenkieker · Dan Tobacco · TR 1475
update public.tabacos set corte = 'Ribbon' where id = '2296' and coalesce(corte, '') = '';
-- 2299 · Bill Bailey's Birthday Blend · Dan Tobacco · TR 1438
update public.tabacos set corte = 'Ribbon' where id = '2299' and coalesce(corte, '') = '';
-- 2300 · Bill Bailey's Black Blend · Dan Tobacco · TR 1439
update public.tabacos set corte = 'Ribbon' where id = '2300' and coalesce(corte, '') = '';
-- 2301 · Bill Bailey's Best Blend · Dan Tobacco · TR 402
update public.tabacos set corte = 'Ribbon' where id = '2301' and coalesce(corte, '') = '';
-- 2302 · Bulldog Medium Cut · Dan Tobacco · TR 10174
update public.tabacos set corte = 'Ready Rubbed' where id = '2302' and coalesce(corte, '') = '';
-- 2314 · Ascanian No. 2 Castle Blend · Dan Tobacco · pfeifen-shop-online.de (Ascanian No.2; TR no da corte)
update public.tabacos set corte = 'Ready Rubbed' where id = '2314' and coalesce(corte, '') = '';
-- 2316 · Swatte Deern · Dan Tobacco · TR 1504
update public.tabacos set tipo = 'Aromática' where id = '2316' and coalesce(tipo, '') = '';
update public.tabacos set corte = 'Ribbon' where id = '2316' and coalesce(corte, '') = '';
-- 2319 · Käpt'n Brammer Alter Friese · Dan Tobacco · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2319' and coalesce(corte, '') = '';
-- 2323 · Mona Lisa · Dan Tobacco · TR 12223
update public.tabacos set corte = 'Ready Rubbed' where id = '2323' and coalesce(corte, '') = '';
-- 2324 · Mountain Village Evening Standard · Dan Tobacco · TR 1488 (Evening Standard, serie Mountain Village)
update public.tabacos set corte = 'Ribbon' where id = '2324' and coalesce(corte, '') = '';
-- 2331 · Peter Rasmussen Green Label · Dan Tobacco · TR 11656 (Green Label, serie Peter Rasmussen)
update public.tabacos set corte = 'Ready Rubbed' where id = '2331' and coalesce(corte, '') = '';
-- 2336 · Wappen von Hamburg · Dan Tobacco · TR 1515
update public.tabacos set corte = 'Ribbon' where id = '2336' and coalesce(corte, '') = '';
-- 2343 · Auenland Mountain Mixture · Vauen · pfeifen-shop-online.de (Loose Cut; TR no la tiene)
update public.tabacos set corte = 'Ribbon' where id = '2343' and coalesce(corte, '') = '';
-- 2347 · Bavarian Blend No. 3 · Vauen · TR 10976 (Loose)
update public.tabacos set corte = 'Ribbon' where id = '2347' and coalesce(corte, '') = '';
-- 2349 · Oxford Blend No. 5 · Vauen · TR 10330
update public.tabacos set corte = 'Ready Rubbed' where id = '2349' and coalesce(corte, '') = '';
-- 2352 · Sparkling Blend No. 8 · Vauen · TR 5546
update public.tabacos set corte = 'Ribbon' where id = '2352' and coalesce(corte, '') = '';
-- 2355 · Grandpa's Blend No. 11 · Vauen · TR 13129
update public.tabacos set corte = 'Ribbon' where id = '2355' and coalesce(corte, '') = '';
-- 2356 · Summer Blend No. 12 · Vauen · TR 13130
update public.tabacos set corte = 'Ribbon' where id = '2356' and coalesce(corte, '') = '';
-- 2360 · English Blend No. 22 · Vauen · TR 5218
update public.tabacos set corte = 'Ribbon' where id = '2360' and coalesce(corte, '') = '';
-- 2388 · Old Dark Fired · Doctor Pipe · TR 13320
update public.tabacos set corte = 'Ribbon' where id = '2388' and coalesce(corte, '') = '';
-- 2392 · Vanilla Cream · Doctor Pipe · TR 13394
update public.tabacos set corte = 'Ribbon' where id = '2392' and coalesce(corte, '') = '';
-- 2399 · Good Morning · Doctor Pipe · TR 13392
update public.tabacos set corte = 'Ribbon' where id = '2399' and coalesce(corte, '') = '';
-- 2401 · Scottish Mixture · Doctor Pipe · TR 13329
update public.tabacos set corte = 'Ribbon' where id = '2401' and coalesce(corte, '') = '';
-- 2404 · Latakia Blend · Doctor Pipe · TR 13328
update public.tabacos set corte = 'Ribbon' where id = '2404' and coalesce(corte, '') = '';
-- 2409 · Torben Dansk Black Cavendish English Style · Dan Tobacco · TR 3914 (Black Cavendish English Type)
update public.tabacos set corte = 'Ribbon' where id = '2409' and coalesce(corte, '') = '';
-- 2410 · Torben Dansk Kentucky U.S.A. · Dan Tobacco · TR 3685
update public.tabacos set corte = 'Ribbon' where id = '2410' and coalesce(corte, '') = '';
-- 2411 · Torben Dansk Orient · Dan Tobacco · TR 2429
update public.tabacos set corte = 'Ribbon' where id = '2411' and coalesce(corte, '') = '';
-- 2412 · Torben Dansk Latakia Spezial · Dan Tobacco · TR 11420
update public.tabacos set corte = 'Ribbon' where id = '2412' and coalesce(corte, '') = '';
-- 2413 · Torben Dansk Virginia 1,6 Mysore · Dan Tobacco · TR 3926 (Virginia Mysore; 1,6 = ancho de corte)
update public.tabacos set corte = 'Ribbon' where id = '2413' and coalesce(corte, '') = '';
-- 2414 · Torben Dansk Virginia 4,0 Mysore · Dan Tobacco · TR 3926 (Virginia Mysore; 4,0 = ancho de corte)
update public.tabacos set corte = 'Ribbon' where id = '2414' and coalesce(corte, '') = '';
