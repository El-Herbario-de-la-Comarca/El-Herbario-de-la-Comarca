-- =====================================================================
-- 50 · Notas de sabor que faltaban (primera tanda, 5/11/2026)
-- Solo notas que la fuente dice expresamente: el campo Flavoring de Tobacco Reviews (aroma añadido)
-- o palabras de sabor de la descripción del fabricante (TR o Smokingpipes). Nada deducido de las hojas.
-- Solo rellena fichas que no tienen ninguna nota. Se puede ejecutar varias veces.
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
