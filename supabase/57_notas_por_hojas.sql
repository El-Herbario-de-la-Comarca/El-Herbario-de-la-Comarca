-- =====================================================================
-- 57 · Notas de sabor habituales según las hojas (herramientas/notas_por_hojas.py)
-- Mezclas no aromáticas que seguían sin notas. Notas típicas de cada hoja,
-- afinadas con la ficha (color de la virginia, cantidad de latakia o perique...).
-- Ejecutar DESPUÉS del 51. Solo rellena fichas sin ninguna nota; se puede repetir.
-- =====================================================================

-- 365 · Atlas Balkan · Cornell & Diehl · mucha latakia o balcánica; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'pimienta', 'nuez', 'cuero']::text[] where id = '365' and cardinality(notas) = 0;
-- 68 · Barrister · Cornell & Diehl · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'cuero']::text[] where id = '68' and cardinality(notas) = 0;
-- 69 · Bayou Morning · Cornell & Diehl · virginia roja; mucha perique
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'pan tostado', 'higo']::text[] where id = '69' and cardinality(notas) = 0;
-- 71 · Bayou Night · Cornell & Diehl · virginia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '71' and cardinality(notas) = 0;
-- 74 · Big 'n' Burley · Cornell & Diehl · mucha latakia o balcánica; poca perique; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'pimienta', 'nuez']::text[] where id = '74' and cardinality(notas) = 0;
-- 77 · Billy Budd Blonde · Cornell & Diehl · virginia clara; poca perique
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'terroso']::text[] where id = '77' and cardinality(notas) = 0;
-- 76 · Billy Budd · Cornell & Diehl · virginia clara
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'terroso']::text[] where id = '76' and cardinality(notas) = 0;
-- 83 · Blue Ridge · Cornell & Diehl · virginia oscura o estufada; perique con hojas dulces: ciruela
update public.tabacos set notas = array['hierbas aromáticas', 'higo', 'ciruela', 'floral']::text[] where id = '83' and cardinality(notas) = 0;
-- 85 · Bow-Legged Bear · Cornell & Diehl · virginia prensada; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '85' and cardinality(notas) = 0;
-- 86 · Briar Fox · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['heno', 'nuez', 'miel', 'terroso']::text[] where id = '86' and cardinality(notas) = 0;
-- 90 · Burley Flake #2 · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['nuez', 'ahumado', 'frutos rojos', 'terroso']::text[] where id = '90' and cardinality(notas) = 0;
-- 91 · Burley Flake #3 · Cornell & Diehl · virginia prensada; poca perique
update public.tabacos set notas = array['nuez', 'ahumado', 'heno', 'pimienta']::text[] where id = '91' and cardinality(notas) = 0;
-- 92 · Burley Flake #4 · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['nuez', 'ahumado', 'frutos rojos', 'terroso']::text[] where id = '92' and cardinality(notas) = 0;
-- 95 · Byzantium · Cornell & Diehl · mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'pimienta', 'floral']::text[] where id = '95' and cardinality(notas) = 0;
-- 97 · Chenet's Cake · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '97' and cardinality(notas) = 0;
-- 100 · Comfort · Cornell & Diehl · virginia clara; perique con hojas dulces: ciruela
update public.tabacos set notas = array['heno', 'ciruela', 'nuez', 'cítricos']::text[] where id = '100' and cardinality(notas) = 0;
-- 101 · Consolation · Cornell & Diehl · virginia clara
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'nuez']::text[] where id = '101' and cardinality(notas) = 0;
-- 102 · Crooked Lane · Cornell & Diehl · virginia; poca perique
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '102' and cardinality(notas) = 0;
-- 105 · Cube Cut Burley · Cornell & Diehl
update public.tabacos set notas = array['nuez', 'terroso']::text[] where id = '105' and cardinality(notas) = 0;
-- 109 · Da Vinci · Cornell & Diehl · virginia clara; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'cuero']::text[] where id = '109' and cardinality(notas) = 0;
-- 106 · Dark Burley · Cornell & Diehl · burley oscuro
update public.tabacos set notas = array['nuez', 'terroso', 'cuero']::text[] where id = '106' and cardinality(notas) = 0;
-- 110 · Daylight: Or L'yom · Cornell & Diehl · virginia roja; perique con burley: pimienta; burley tostado
update public.tabacos set notas = array['hierbas aromáticas', 'frutos rojos', 'pimienta', 'nuez']::text[] where id = '110' and cardinality(notas) = 0;
-- 111 · Derringer · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '111' and cardinality(notas) = 0;
-- 112 · Dreams of Kadath · Cornell & Diehl · virginia prensada; perique con burley: pimienta
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'ahumado']::text[] where id = '112' and cardinality(notas) = 0;
-- 113 · Easy Times · Cornell & Diehl · virginia roja; poca latakia
update public.tabacos set notas = array['nuez', 'ahumado', 'frutos rojos', 'terroso']::text[] where id = '113' and cardinality(notas) = 0;
-- 117 · Engine #99 · Cornell & Diehl · virginia; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '117' and cardinality(notas) = 0;
-- 118 · Epiphany · Cornell & Diehl · virginia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'heno', 'pimienta', 'nuez']::text[] where id = '118' and cardinality(notas) = 0;
-- 119 · Evening Rise · Cornell & Diehl · virginia
update public.tabacos set notas = array['nuez', 'heno', 'hierbas aromáticas', 'ahumado']::text[] where id = '119' and cardinality(notas) = 0;
-- 121 · Exhausted Rooster · Cornell & Diehl · virginia oscura o estufada; poca perique; burley oscuro
update public.tabacos set notas = array['higo', 'pimienta', 'nuez', 'pasas']::text[] where id = '121' and cardinality(notas) = 0;
-- 122 · First Responders · Cornell & Diehl · virginias claras y rojas; poca perique
update public.tabacos set notas = array['heno', 'pimienta', 'frutos rojos']::text[] where id = '122' and cardinality(notas) = 0;
-- 123 · Five O'Clock Shadow · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'nuez', 'pan tostado']::text[] where id = '123' and cardinality(notas) = 0;
-- 375 · Good Morning · Cornell & Diehl · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '375' and cardinality(notas) = 0;
-- 209 · Gray Ghost · Cornell & Diehl · virginia
update public.tabacos set notas = array['heno', 'terroso', 'cítricos', 'café']::text[] where id = '209' and cardinality(notas) = 0;
-- 128 · Habana Daydream · Cornell & Diehl · virginia; poca latakia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'heno', 'ciruela', 'terroso']::text[] where id = '128' and cardinality(notas) = 0;
-- 130 · Haunted Bookshop · Cornell & Diehl · virginia; poca perique
update public.tabacos set notas = array['nuez', 'heno', 'pimienta', 'terroso']::text[] where id = '130' and cardinality(notas) = 0;
-- 132 · Innsmouth · Cornell & Diehl · virginia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'ciruela', 'floral']::text[] where id = '132' and cardinality(notas) = 0;
-- 134 · Izmir Turkish · Cornell & Diehl
update public.tabacos set notas = array['hierbas aromáticas', 'floral']::text[] where id = '134' and cardinality(notas) = 0;
-- 136 · Joie de Vivre · Cornell & Diehl · virginia roja; perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'frutos rojos', 'ciruela']::text[] where id = '136' and cardinality(notas) = 0;
-- 137 · Junkyard Dawg · Cornell & Diehl · virginia clara
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'cuero']::text[] where id = '137' and cardinality(notas) = 0;
-- 139 · Kelly's Coin · Cornell & Diehl · virginia
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'cítricos']::text[] where id = '139' and cardinality(notas) = 0;
-- 141 · Latakia · Cornell & Diehl
update public.tabacos set notas = array['ahumado', 'cuero']::text[] where id = '141' and cardinality(notas) = 0;
-- 144 · Lunchtime Blues · Cornell & Diehl · virginia
update public.tabacos set notas = array['nuez', 'heno', 'hierbas aromáticas', 'terroso']::text[] where id = '144' and cardinality(notas) = 0;
-- 145 · Mad Fiddler Flake · Cornell & Diehl · virginia prensada; perique con hojas dulces: ciruela
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'ciruela', 'terroso']::text[] where id = '145' and cardinality(notas) = 0;
-- 147 · Midnight Drive · Cornell & Diehl · virginia clara; poca latakia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '147' and cardinality(notas) = 0;
-- 212 · Miskatonic Mixture · Cornell & Diehl · virginia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'ciruela', 'floral']::text[] where id = '212' and cardinality(notas) = 0;
-- 149 · Mississippi Mud · Cornell & Diehl · perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'ciruela', 'cuero', 'higo']::text[] where id = '149' and cardinality(notas) = 0;
-- 151 · Montford Point Marine · Cornell & Diehl · perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'pimienta', 'nuez', 'cuero']::text[] where id = '151' and cardinality(notas) = 0;
-- 152 · Morley's Best · Cornell & Diehl · virginia
update public.tabacos set notas = array['nuez', 'heno', 'ahumado', 'terroso']::text[] where id = '152' and cardinality(notas) = 0;
-- 153 · Morning Drive · Cornell & Diehl · virginia roja; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'frutos rojos', 'pimienta', 'nuez']::text[] where id = '153' and cardinality(notas) = 0;
-- 155 · Mountain Camp · Cornell & Diehl · virginia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '155' and cardinality(notas) = 0;
-- 158 · Oak Alley · Cornell & Diehl · virginia roja; perique con burley: pimienta
update public.tabacos set notas = array['nuez', 'frutos rojos', 'pimienta', 'hierbas aromáticas']::text[] where id = '158' and cardinality(notas) = 0;
-- 159 · Odessa · Cornell & Diehl · perique con burley: pimienta
update public.tabacos set notas = array['nuez', 'pimienta', 'hierbas aromáticas', 'ahumado']::text[] where id = '159' and cardinality(notas) = 0;
-- 163 · Old Joe Krantz Blue Label · Cornell & Diehl · virginia
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'cítricos']::text[] where id = '163' and cardinality(notas) = 0;
-- 162 · Old Joe Krantz · Cornell & Diehl · virginia roja; perique con burley: pimienta; burley oscuro
update public.tabacos set notas = array['nuez', 'frutos rojos', 'pimienta', 'terroso']::text[] where id = '162' and cardinality(notas) = 0;
-- 166 · Opening Night · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pan tostado']::text[] where id = '166' and cardinality(notas) = 0;
-- 168 · Orient Express · Cornell & Diehl · virginia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'ciruela']::text[] where id = '168' and cardinality(notas) = 0;
-- 167 · Oriental Silk · Cornell & Diehl · virginia clara
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'floral']::text[] where id = '167' and cardinality(notas) = 0;
-- 169 · Pegasus · Cornell & Diehl · virginia
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'cítricos']::text[] where id = '169' and cardinality(notas) = 0;
-- 171 · Pirate Kake · Cornell & Diehl · mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'nuez', 'floral']::text[] where id = '171' and cardinality(notas) = 0;
-- 172 · Plantation Evening · Cornell & Diehl · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '172' and cardinality(notas) = 0;
-- 173 · Privateer · Cornell & Diehl · virginia clara; burley oscuro
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'cuero']::text[] where id = '173' and cardinality(notas) = 0;
-- 175 · Purple Cow · Cornell & Diehl · virginia clara
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'terroso']::text[] where id = '175' and cardinality(notas) = 0;
-- 176 · Rajah's Court · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'frutos rojos', 'cuero']::text[] where id = '176' and cardinality(notas) = 0;
-- 178 · Red Carpet · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'pan tostado', 'higo']::text[] where id = '178' and cardinality(notas) = 0;
-- 180 · Red Virginia Ribbon · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pan tostado']::text[] where id = '180' and cardinality(notas) = 0;
-- 182 · Reverie · Cornell & Diehl · mucha latakia o balcánica; poca perique; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'pimienta', 'nuez']::text[] where id = '182' and cardinality(notas) = 0;
-- 183 · Riverboat Gambler · Cornell & Diehl · virginia; perique con burley: pimienta
update public.tabacos set notas = array['nuez', 'heno', 'pimienta', 'hierbas aromáticas']::text[] where id = '183' and cardinality(notas) = 0;
-- 184 · Sam's Blend · Cornell & Diehl · perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'ciruela', 'cuero', 'higo']::text[] where id = '184' and cardinality(notas) = 0;
-- 185 · Sea Dog · Cornell & Diehl · virginia clara; burley oscuro
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'nuez']::text[] where id = '185' and cardinality(notas) = 0;
-- 369 · Smooth English · Cornell & Diehl
update public.tabacos set notas = array['ahumado', 'nuez', 'cuero', 'terroso']::text[] where id = '369' and cardinality(notas) = 0;
-- 371 · Stanhope · Cornell & Diehl · virginia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'heno', 'pimienta', 'nuez']::text[] where id = '371' and cardinality(notas) = 0;
-- 215 · Star of the East Flake · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '215' and cardinality(notas) = 0;
-- 223 · Star of the East · Cornell & Diehl · virginia oscura o estufada; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'higo', 'cuero']::text[] where id = '223' and cardinality(notas) = 0;
-- 216 · Steamworks · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'floral']::text[] where id = '216' and cardinality(notas) = 0;
-- 188 · Super Balkan · Cornell & Diehl · virginia; mucha latakia o balcánica; perique con burley: pimienta; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'heno', 'pimienta']::text[] where id = '188' and cardinality(notas) = 0;
-- 191 · Tuskegee Airman · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '191' and cardinality(notas) = 0;
-- 193 · Vieux Carré · Cornell & Diehl · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '193' and cardinality(notas) = 0;
-- 195 · Virginia Gentleman · Cornell & Diehl · virginia
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'nuez', 'floral']::text[] where id = '195' and cardinality(notas) = 0;
-- 372 · White Burley · Cornell & Diehl
update public.tabacos set notas = array['nuez', 'terroso']::text[] where id = '372' and cardinality(notas) = 0;
-- 373 · Winchester · Cornell & Diehl · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pan tostado']::text[] where id = '373' and cardinality(notas) = 0;
-- 198 · Yale Mixture · Cornell & Diehl · virginia; poca latakia
update public.tabacos set notas = array['ahumado', 'heno', 'cítricos']::text[] where id = '198' and cardinality(notas) = 0;
-- 199 · Yorktown · Cornell & Diehl · virginias claras y rojas
update public.tabacos set notas = array['heno', 'frutos rojos']::text[] where id = '199' and cardinality(notas) = 0;
-- 2228 · Ascanian No. 1 Riverside Blend · Dan Tobacco · virginia
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'floral']::text[] where id = '2228' and cardinality(notas) = 0;
-- 2314 · Ascanian No. 2 Castle Blend · Dan Tobacco · virginia
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'floral']::text[] where id = '2314' and cardinality(notas) = 0;
-- 1148 · Bill Bailey's Balkan Blend · Dan Tobacco · virginia; mucha latakia o balcánica; perique con burley: pimienta; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'heno', 'pimienta']::text[] where id = '1148' and cardinality(notas) = 0;
-- 2306 · Dark Moon · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'miel']::text[] where id = '2306' and cardinality(notas) = 0;
-- 1154 · Gordon Pym · Dan Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1154' and cardinality(notas) = 0;
-- 1155 · Hamborger Veermaster · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1155' and cardinality(notas) = 0;
-- 2310 · Hamburger Pfeifenrunde · Dan Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2310' and cardinality(notas) = 0;
-- 2311 · Holly's Discovery Extraordinary · Dan Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2311' and cardinality(notas) = 0;
-- 2320 · Kriswill Classical Navy Cut · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2320' and cardinality(notas) = 0;
-- 1157 · London Blend No. 1000 · Dan Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1157' and cardinality(notas) = 0;
-- 1158 · Midnight Ride · Dan Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '1158' and cardinality(notas) = 0;
-- 2324 · Mountain Village Evening Standard · Dan Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2324' and cardinality(notas) = 0;
-- 2325 · No Name No. 1 · Dan Tobacco · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '2325' and cardinality(notas) = 0;
-- 1160 · Old Ironsides · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'nuez']::text[] where id = '1160' and cardinality(notas) = 0;
-- 1161 · Patriot Flake · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1161' and cardinality(notas) = 0;
-- 2230 · Roper's Roundels · Dan Tobacco · virginia prensada; perique con hojas dulces: ciruela
update public.tabacos set notas = array['heno', 'ciruela', 'miel', 'higo']::text[] where id = '2230' and cardinality(notas) = 0;
-- 1163 · Skipper's Flake · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1163' and cardinality(notas) = 0;
-- 2332 · St. Bernard Flake · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2332' and cardinality(notas) = 0;
-- 2335 · The Mallard Flake plus Perique · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2335' and cardinality(notas) = 0;
-- 1165 · The Mallard · Dan Tobacco · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1165' and cardinality(notas) = 0;
-- 2234 · Torben Dansk Burley · Dan Tobacco
update public.tabacos set notas = array['nuez', 'terroso']::text[] where id = '2234' and cardinality(notas) = 0;
-- 2410 · Torben Dansk Kentucky U.S.A. · Dan Tobacco
update public.tabacos set notas = array['ahumado', 'terroso']::text[] where id = '2410' and cardinality(notas) = 0;
-- 2411 · Torben Dansk Orient · Dan Tobacco
update public.tabacos set notas = array['hierbas aromáticas', 'floral']::text[] where id = '2411' and cardinality(notas) = 0;
-- 2233 · Torben Dansk Virginia 1,6 Zaire · Dan Tobacco · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '2233' and cardinality(notas) = 0;
-- 1167 · Tordenskjold Virginia Slices · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '1167' and cardinality(notas) = 0;
-- 1169 · Treasures of Ireland: Limerick · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '1169' and cardinality(notas) = 0;
-- 2313 · Tumblin' Dice · Dan Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2313' and cardinality(notas) = 0;
-- 1083 · English Mixture · Davidoff · virginia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'heno', 'pimienta', 'nuez']::text[] where id = '1083' and cardinality(notas) = 0;
-- 1084 · Royalty Mixture · Davidoff · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1084' and cardinality(notas) = 0;
-- 2402 · Classic · Doctor Pipe · virginia; poca latakia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'floral']::text[] where id = '2402' and cardinality(notas) = 0;
-- 2403 · English Blend · Doctor Pipe · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2403' and cardinality(notas) = 0;
-- 2399 · Good Morning · Doctor Pipe · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2399' and cardinality(notas) = 0;
-- 2396 · Virginia Blend · Doctor Pipe · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '2396' and cardinality(notas) = 0;
-- 1114 · 4 Seasons Autumn Mixture · Erik Stokkebye · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'ahumado', 'miel']::text[] where id = '1114' and cardinality(notas) = 0;
-- 1113 · 4 Seasons Summer Mixture · Erik Stokkebye · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1113' and cardinality(notas) = 0;
-- 1115 · 4 Seasons Winter Mixture · Erik Stokkebye · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1115' and cardinality(notas) = 0;
-- 1104 · 4th Generation 1855 · Erik Stokkebye · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1104' and cardinality(notas) = 0;
-- 1105 · 4th Generation 1882 Founder's Blend · Erik Stokkebye · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'nuez']::text[] where id = '1105' and cardinality(notas) = 0;
-- 1107 · 4th Generation 1931 Flake · Erik Stokkebye · virginia prensada
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'miel']::text[] where id = '1107' and cardinality(notas) = 0;
-- 1110 · 4th Generation 2012 Anniversary Blend · Erik Stokkebye · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1110' and cardinality(notas) = 0;
-- 1111 · 4th Generation Max Erik 1989 · Erik Stokkebye · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1111' and cardinality(notas) = 0;
-- 2084 · No Name No. 1 · Ermuri · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'cuero']::text[] where id = '2084' and cardinality(notas) = 0;
-- 1123 · Navy Deluxe · Escudo · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '1123' and cardinality(notas) = 0;
-- 1186 · And So To Bed · Esoterica · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1186' and cardinality(notas) = 0;
-- 1189 · Cardiff · Esoterica · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1189' and cardinality(notas) = 0;
-- 1190 · Dorchester · Esoterica · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '1190' and cardinality(notas) = 0;
-- 1191 · Dunbar · Esoterica · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '1191' and cardinality(notas) = 0;
-- 1194 · Margate · Esoterica · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1194' and cardinality(notas) = 0;
-- 1195 · Peacehaven · Esoterica · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1195' and cardinality(notas) = 0;
-- 1196 · Pembroke · Esoterica · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1196' and cardinality(notas) = 0;
-- 1197 · Penzance · Esoterica · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1197' and cardinality(notas) = 0;
-- 1199 · Scarborough · Esoterica · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1199' and cardinality(notas) = 0;
-- 1201 · Stonehaven · Esoterica · virginia prensada
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'miel']::text[] where id = '1201' and cardinality(notas) = 0;
-- 1202 · Tilbury · Esoterica · virginia
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'cítricos']::text[] where id = '1202' and cardinality(notas) = 0;
-- 2260 · 34th Mixture · Fribourg & Treyer · virginia; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2260' and cardinality(notas) = 0;
-- 2264 · Cut Virginia Plug · Fribourg & Treyer · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2264' and cardinality(notas) = 0;
-- 2265 · Vintage Flake · Fribourg & Treyer · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2265' and cardinality(notas) = 0;
-- 2263 · Waterloo No. 2 Mixture · Fribourg & Treyer · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2263' and cardinality(notas) = 0;
-- 2262 · Wingate Mixture · Fribourg & Treyer · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'pimienta', 'cuero']::text[] where id = '2262' and cardinality(notas) = 0;
-- 224 · Abingdon · G. L. Pease · virginia; mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'heno', 'floral']::text[] where id = '224' and cardinality(notas) = 0;
-- 232 · Chelsea Morning · G. L. Pease · virginia clara; poca latakia; poca perique
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '232' and cardinality(notas) = 0;
-- 233 · Cumberland · G. L. Pease · virginia; poca perique
update public.tabacos set notas = array['heno', 'pimienta', 'ahumado', 'cítricos']::text[] where id = '233' and cardinality(notas) = 0;
-- 235 · Embarcadero · G. L. Pease · virginia roja
update public.tabacos set notas = array['hierbas aromáticas', 'frutos rojos', 'floral', 'pan tostado']::text[] where id = '235' and cardinality(notas) = 0;
-- 236 · Fillmore · G. L. Pease · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'pan tostado', 'higo']::text[] where id = '236' and cardinality(notas) = 0;
-- 237 · Gaslight · G. L. Pease · virginia roja
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'frutos rojos', 'cuero']::text[] where id = '237' and cardinality(notas) = 0;
-- 243 · Kensington · G. L. Pease · virginia; mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'heno', 'floral']::text[] where id = '243' and cardinality(notas) = 0;
-- 245 · Lagonda · G. L. Pease · virginia roja; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'frutos rojos', 'cuero']::text[] where id = '245' and cardinality(notas) = 0;
-- 248 · Maltese Falcon · G. L. Pease · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '248' and cardinality(notas) = 0;
-- 249 · Meridian · G. L. Pease · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '249' and cardinality(notas) = 0;
-- 251 · Montgomery · G. L. Pease · virginia
update public.tabacos set notas = array['heno', 'ahumado', 'cítricos']::text[] where id = '251' and cardinality(notas) = 0;
-- 253 · Odyssey · G. L. Pease · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '253' and cardinality(notas) = 0;
-- 258 · Robusto · G. L. Pease · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'terroso']::text[] where id = '258' and cardinality(notas) = 0;
-- 261 · Sixpence · G. L. Pease · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'ahumado', 'pan tostado']::text[] where id = '261' and cardinality(notas) = 0;
-- 263 · Stratford · G. L. Pease · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '263' and cardinality(notas) = 0;
-- 264 · Telegraph Hill · G. L. Pease · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '264' and cardinality(notas) = 0;
-- 265 · Temple Bar · G. L. Pease · virginia prensada
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'floral']::text[] where id = '265' and cardinality(notas) = 0;
-- 269 · Westminster · G. L. Pease · virginia roja
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'frutos rojos', 'cuero']::text[] where id = '269' and cardinality(notas) = 0;
-- 297 · #12 Mixture · Gawith Hoggarth · virginia clara
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '297' and cardinality(notas) = 0;
-- 284 · Balkan Mixture · Gawith Hoggarth · virginia; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '284' and cardinality(notas) = 0;
-- 290 · Best Brown #2 Flake · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'nuez', 'miel', 'terroso']::text[] where id = '290' and cardinality(notas) = 0;
-- 302 · Black Bogie Twist · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '302' and cardinality(notas) = 0;
-- 344 · Black Irish X · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '344' and cardinality(notas) = 0;
-- 303 · Black Irish XXX Twist · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '303' and cardinality(notas) = 0;
-- 304 · Black Twist Sliced · Gawith Hoggarth · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '304' and cardinality(notas) = 0;
-- 382 · Bright CR Flake Burnt Ends · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '382' and cardinality(notas) = 0;
-- 381 · Bright CR Flake · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '381' and cardinality(notas) = 0;
-- 307 · Broken Scotch Cake · Gawith Hoggarth · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'nuez', 'miel']::text[] where id = '307' and cardinality(notas) = 0;
-- 308 · Brown Bogie · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '308' and cardinality(notas) = 0;
-- 309 · Brown Flake Aromatic · Gawith Hoggarth · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'nuez', 'miel']::text[] where id = '309' and cardinality(notas) = 0;
-- 310 · Brown Flake Unscented · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'nuez', 'miel', 'terroso']::text[] where id = '310' and cardinality(notas) = 0;
-- 311 · Brown Irish X Aromatic Twist · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '311' and cardinality(notas) = 0;
-- 383 · Brown Irish X · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '383' and cardinality(notas) = 0;
-- 312 · Brown Twist · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '312' and cardinality(notas) = 0;
-- 316 · Curly Cut Deluxe · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '316' and cardinality(notas) = 0;
-- 318 · Dark Bird's Eye Vintage Cut · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'ahumado', 'cítricos']::text[] where id = '318' and cardinality(notas) = 0;
-- 317 · Dark Bird's Eye · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'ahumado', 'cítricos']::text[] where id = '317' and cardinality(notas) = 0;
-- 320 · Dark Flake Unscented · Gawith Hoggarth
update public.tabacos set notas = array['ahumado', 'nuez', 'terroso']::text[] where id = '320' and cardinality(notas) = 0;
-- 323 · Exmoor Mixture · Gawith Hoggarth · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '323' and cardinality(notas) = 0;
-- 324 · Extra Sweet Brown Bogie Twist · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '324' and cardinality(notas) = 0;
-- 326 · Kendal #6 · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'ahumado', 'nuez']::text[] where id = '326' and cardinality(notas) = 0;
-- 327 · Kendal Dark Vintage Cut · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'cítricos']::text[] where id = '327' and cardinality(notas) = 0;
-- 386 · Kendal Dark · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'cítricos']::text[] where id = '386' and cardinality(notas) = 0;
-- 334 · Kendal Gold Vintage Cut · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'cítricos']::text[] where id = '334' and cardinality(notas) = 0;
-- 333 · Kendal Gold · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'cítricos']::text[] where id = '333' and cardinality(notas) = 0;
-- 336 · Kendal Mixed · Gawith Hoggarth · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'nuez', 'cítricos']::text[] where id = '336' and cardinality(notas) = 0;
-- 387 · Louisiana Flake Burnt Ends · Gawith Hoggarth · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'nuez', 'pimienta']::text[] where id = '387' and cardinality(notas) = 0;
-- 286 · Rodeo · Gawith Hoggarth · virginia
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'ahumado', 'nuez']::text[] where id = '286' and cardinality(notas) = 0;
-- 340 · Scotch Mixture · Gawith Hoggarth · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'nuez', 'cuero']::text[] where id = '340' and cardinality(notas) = 0;
-- 390 · Westmorland Slices · Gawith Hoggarth · virginia prensada
update public.tabacos set notas = array['heno', 'ahumado', 'miel', 'terroso']::text[] where id = '390' and cardinality(notas) = 0;
-- 1171 · Bridge: Old Brown Flake · Germain's · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1171' and cardinality(notas) = 0;
-- 1172 · Brown Flake · Germain's · virginia prensada
update public.tabacos set notas = array['heno', 'nuez', 'miel', 'terroso']::text[] where id = '1172' and cardinality(notas) = 0;
-- 1174 · Club Mixture · Germain's · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1174' and cardinality(notas) = 0;
-- 1175 · Eighteen Twenty · Germain's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1175' and cardinality(notas) = 0;
-- 1176 · King Charles Mixture · Germain's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1176' and cardinality(notas) = 0;
-- 1177 · Medium Flake · Germain's · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1177' and cardinality(notas) = 0;
-- 1183 · Royal Jersey: Perique Mixture · Germain's · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '1183' and cardinality(notas) = 0;
-- 1184 · Special Latakia Flake · Germain's · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1184' and cardinality(notas) = 0;
-- 1185 · Uncle Tom's · Germain's · virginia
update public.tabacos set notas = array['heno', 'nuez', 'cítricos', 'terroso']::text[] where id = '1185' and cardinality(notas) = 0;
-- 2000 · Asmara · HU Tobacco · virginia clara; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'ahumado', 'pimienta']::text[] where id = '2000' and cardinality(notas) = 0;
-- 2032 · Brullende Leeuw · HU Tobacco · virginia clara; perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'ciruela']::text[] where id = '2032' and cardinality(notas) = 0;
-- 2039 · Dark Moor · HU Tobacco · virginia marrón
update public.tabacos set notas = array['nuez', 'pimienta', 'ahumado', 'madera']::text[] where id = '2039' and cardinality(notas) = 0;
-- 2013 · Director's Cut · HU Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'ahumado']::text[] where id = '2013' and cardinality(notas) = 0;
-- 2014 · Edward G. · HU Tobacco · virginia roja; perique con hojas dulces: ciruela
update public.tabacos set notas = array['frutos rojos', 'ciruela', 'hierbas aromáticas', 'nuez']::text[] where id = '2014' and cardinality(notas) = 0;
-- 2015 · English Breakfast · HU Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2015' and cardinality(notas) = 0;
-- 2002 · Fayyum Special Kake · HU Tobacco · virginia prensada
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'miel']::text[] where id = '2002' and cardinality(notas) = 0;
-- 2001 · Fayyum · HU Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2001' and cardinality(notas) = 0;
-- 2028 · Haymaker Flake · HU Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2028' and cardinality(notas) = 0;
-- 2003 · Indaba · HU Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'nuez', 'miel', 'terroso']::text[] where id = '2003' and cardinality(notas) = 0;
-- 2034 · Janneman Flake · HU Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2034' and cardinality(notas) = 0;
-- 2004 · Khartoum · HU Tobacco · virginia; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'heno', 'pimienta', 'terroso']::text[] where id = '2004' and cardinality(notas) = 0;
-- 2017 · Louisiana Broken · HU Tobacco · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'ahumado', 'cítricos']::text[] where id = '2017' and cardinality(notas) = 0;
-- 2036 · My Red Fox · HU Tobacco · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '2036' and cardinality(notas) = 0;
-- 2041 · Nebari · HU Tobacco · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'cítricos']::text[] where id = '2041' and cardinality(notas) = 0;
-- 2008 · Nyala · HU Tobacco · virginia prensada; perique con burley: pimienta
update public.tabacos set notas = array['nuez', 'heno', 'pimienta', 'terroso']::text[] where id = '2008' and cardinality(notas) = 0;
-- 2037 · Old Fredder's Broken Flake · HU Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2037' and cardinality(notas) = 0;
-- 2019 · Port Latakia · HU Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2019' and cardinality(notas) = 0;
-- 2031 · Sunset Flake · HU Tobacco · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2031' and cardinality(notas) = 0;
-- 2009 · Tigray · HU Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'nuez']::text[] where id = '2009' and cardinality(notas) = 0;
-- 2010 · Tuarekh · HU Tobacco · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '2010' and cardinality(notas) = 0;
-- 2020 · White Horses · HU Tobacco · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'ahumado', 'terroso']::text[] where id = '2020' and cardinality(notas) = 0;
-- 2011 · Zulu Mixture · HU Tobacco · mucha latakia o balcánica; perique con burley: pimienta; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'pimienta', 'nuez']::text[] where id = '2011' and cardinality(notas) = 0;
-- 2173 · No. 3 · Kontor-Tabak · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pan tostado']::text[] where id = '2173' and cardinality(notas) = 0;
-- 2174 · No. 5 · Kontor-Tabak · virginia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'heno', 'ciruela', 'cuero']::text[] where id = '2174' and cardinality(notas) = 0;
-- 2123 · Meistermischung Nr. 88 Virginia Flake · Kopp · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2123' and cardinality(notas) = 0;
-- 2126 · Bright Virginia · Käpt'n Barsdorfs Bester · virginia clara
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '2126' and cardinality(notas) = 0;
-- 1127 · BL/WB · Lane Limited
update public.tabacos set notas = array['nuez', 'terroso']::text[] where id = '1127' and cardinality(notas) = 0;
-- 2384 · Malvinas Plug · MyRott · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'nuez', 'pan tostado']::text[] where id = '2384' and cardinality(notas) = 0;
-- 2378 · Sunshine Mixture · MyRott · virginia clara
update public.tabacos set notas = array['heno', 'nuez', 'cítricos', 'terroso']::text[] where id = '2378' and cardinality(notas) = 0;
-- 2362 · Virginia Mellow · MyRott · virginia
update public.tabacos set notas = array['heno', 'nuez', 'cítricos', 'terroso']::text[] where id = '2362' and cardinality(notas) = 0;
-- 2372 · Widow's Sons Mixture · MyRott · virginia roja
update public.tabacos set notas = array['frutos rojos', 'nuez', 'pan tostado', 'terroso']::text[] where id = '2372' and cardinality(notas) = 0;
-- 38 · De Luxe Navy Rolls · Peterson · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '38' and cardinality(notas) = 0;
-- 41 · Flake · Peterson · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '41' and cardinality(notas) = 0;
-- 43 · Irish Flake · Peterson · virginia prensada
update public.tabacos set notas = array['nuez', 'ahumado', 'heno', 'terroso']::text[] where id = '43' and cardinality(notas) = 0;
-- 48 · Royal Yacht · Peterson · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '48' and cardinality(notas) = 0;
-- 2137 · No. 038 – Copenhagen B · Pfeifendepot · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '2137' and cardinality(notas) = 0;
-- 2139 · No. 045 – Copenhagen Ø · Pfeifendepot · mucha latakia o balcánica; perique con burley: pimienta
update public.tabacos set notas = array['ahumado', 'pimienta', 'cuero', 'terroso']::text[] where id = '2139' and cardinality(notas) = 0;
-- 2146 · No. 079 – Gerd Jansens Scottish · Pfeifendepot · virginia
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'floral', 'cítricos']::text[] where id = '2146' and cardinality(notas) = 0;
-- 2147 · No. 080 – Gerd Jansens English · Pfeifendepot · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2147' and cardinality(notas) = 0;
-- 2149 · No. 088 – DSK Flake · Pfeifendepot · virginia prensada
update public.tabacos set notas = array['heno', 'ahumado', 'miel', 'terroso']::text[] where id = '2149' and cardinality(notas) = 0;
-- 2151 · No. 089 – DSK Ready Rubbed · Pfeifendepot · virginia
update public.tabacos set notas = array['heno', 'ahumado', 'cítricos', 'terroso']::text[] where id = '2151' and cardinality(notas) = 0;
-- 2153 · No. 091 – Camelot Broken · Pfeifendepot · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'ahumado', 'miel']::text[] where id = '2153' and cardinality(notas) = 0;
-- 2158 · No. 202 – Crown „A“ · Pfeifendepot · virginia; mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'heno', 'floral']::text[] where id = '2158' and cardinality(notas) = 0;
-- 2172 · VAPERizer (Plug) · Pfeifendepot · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2172' and cardinality(notas) = 0;
-- 1000 · 3 Noggins · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1000' and cardinality(notas) = 0;
-- 1002 · Accountant's Mixture · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '1002' and cardinality(notas) = 0;
-- 1004 · Black Mallory · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1004' and cardinality(notas) = 0;
-- 1006 · Brown Clunee · Rattray's · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'miel']::text[] where id = '1006' and cardinality(notas) = 0;
-- 1008 · Dark Fragrant · Rattray's · virginia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['heno', 'ciruela', 'cítricos', 'higo']::text[] where id = '1008' and cardinality(notas) = 0;
-- 1010 · Hal O' The Wynd · Rattray's · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'miel']::text[] where id = '1010' and cardinality(notas) = 0;
-- 1011 · Highland Targe · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1011' and cardinality(notas) = 0;
-- 1012 · Jocks Mixture · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '1012' and cardinality(notas) = 0;
-- 1013 · Macbeth · Rattray's · virginia
update public.tabacos set notas = array['heno', 'nuez', 'cítricos', 'terroso']::text[] where id = '1013' and cardinality(notas) = 0;
-- 1014 · Marlin Flake · Rattray's · virginia prensada; perique con hojas dulces: ciruela
update public.tabacos set notas = array['heno', 'ciruela', 'miel', 'higo']::text[] where id = '1014' and cardinality(notas) = 0;
-- 1015 · No. 7 Reserve · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1015' and cardinality(notas) = 0;
-- 1016 · Old Gowrie · Rattray's · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'miel']::text[] where id = '1016' and cardinality(notas) = 0;
-- 1017 · Professional Mixture · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1017' and cardinality(notas) = 0;
-- 1019 · Red Rapparee · Rattray's · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1019' and cardinality(notas) = 0;
-- 1021 · Stirling Flake · Rattray's · virginia prensada
update public.tabacos set notas = array['nuez', 'heno', 'terroso', 'miel']::text[] where id = '1021' and cardinality(notas) = 0;
-- 2078 · 123 Mixture · Robert Lewis · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2078' and cardinality(notas) = 0;
-- 2079 · Orcilla Mixture · Robert Lewis · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '2079' and cardinality(notas) = 0;
-- 2081 · Wingfield Mixture · Robert Lewis · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '2081' and cardinality(notas) = 0;
-- 1053 · 5 Year Matured Virginia · Robert McConnell · virginia
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'floral', 'cítricos']::text[] where id = '1053' and cardinality(notas) = 0;
-- 1054 · Barking Road · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1054' and cardinality(notas) = 0;
-- 1055 · Black Flake · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '1055' and cardinality(notas) = 0;
-- 1025 · Black Parrot Special Cut · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '1025' and cardinality(notas) = 0;
-- 1056 · Boutique Blend · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1056' and cardinality(notas) = 0;
-- 1057 · Covent Garden · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '1057' and cardinality(notas) = 0;
-- 1058 · Flake · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1058' and cardinality(notas) = 0;
-- 1059 · Folded Flake · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'ahumado', 'miel']::text[] where id = '1059' and cardinality(notas) = 0;
-- 1060 · Highgate · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '1060' and cardinality(notas) = 0;
-- 1061 · Latakia Mixture 1848 · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '1061' and cardinality(notas) = 0;
-- 1062 · Marylebone · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1062' and cardinality(notas) = 0;
-- 1063 · Notting Hill · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1063' and cardinality(notas) = 0;
-- 1033 · Old London Pebble Cut · Robert McConnell · virginia prensada; perique con hojas dulces: ciruela
update public.tabacos set notas = array['heno', 'ciruela', 'miel', 'higo']::text[] where id = '1033' and cardinality(notas) = 0;
-- 1034 · Oriental · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1034' and cardinality(notas) = 0;
-- 1065 · Oxford Street · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1065' and cardinality(notas) = 0;
-- 1066 · Paddington · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1066' and cardinality(notas) = 0;
-- 1067 · Piccadilly Circus · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1067' and cardinality(notas) = 0;
-- 1036 · Pure Brasil · Robert McConnell
update public.tabacos set notas = array['terroso', 'café']::text[] where id = '1036' and cardinality(notas) = 0;
-- 1037 · Pure Burley · Robert McConnell
update public.tabacos set notas = array['nuez', 'terroso']::text[] where id = '1037' and cardinality(notas) = 0;
-- 1038 · Pure Caribe · Robert McConnell
update public.tabacos set notas = array['terroso', 'café']::text[] where id = '1038' and cardinality(notas) = 0;
-- 1039 · Pure Cuba · Robert McConnell
update public.tabacos set notas = array['terroso', 'café']::text[] where id = '1039' and cardinality(notas) = 0;
-- 1040 · Pure Kentucky · Robert McConnell
update public.tabacos set notas = array['ahumado', 'terroso']::text[] where id = '1040' and cardinality(notas) = 0;
-- 1042 · Pure Orient · Robert McConnell
update public.tabacos set notas = array['hierbas aromáticas', 'floral']::text[] where id = '1042' and cardinality(notas) = 0;
-- 1043 · Pure Perique · Robert McConnell
update public.tabacos set notas = array['pimienta', 'higo']::text[] where id = '1043' and cardinality(notas) = 0;
-- 1044 · Pure Virginia · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1044' and cardinality(notas) = 0;
-- 1046 · Red Virginia · Robert McConnell · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pimienta', 'pan tostado', 'higo']::text[] where id = '1046' and cardinality(notas) = 0;
-- 1069 · Regent Street · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '1069' and cardinality(notas) = 0;
-- 1070 · Rich Dark Virginia · Robert McConnell · virginia oscura o estufada
update public.tabacos set notas = array['higo', 'pasas']::text[] where id = '1070' and cardinality(notas) = 0;
-- 1072 · River Thames · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '1072' and cardinality(notas) = 0;
-- 1047 · Scottish Blend · Robert McConnell · virginia; perique con hojas dulces: ciruela
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'ciruela']::text[] where id = '1047' and cardinality(notas) = 0;
-- 1048 · Scottish Cake · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'miel']::text[] where id = '1048' and cardinality(notas) = 0;
-- 1049 · Scottish Flake · Robert McConnell · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'nuez', 'miel']::text[] where id = '1049' and cardinality(notas) = 0;
-- 1073 · Shakespeare · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1073' and cardinality(notas) = 0;
-- 1050 · Sovereign Mixture · Robert McConnell · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '1050' and cardinality(notas) = 0;
-- 1051 · Special London Fine Cut · Robert McConnell · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '1051' and cardinality(notas) = 0;
-- 2223 · HH Pure Virginia Flake · STG · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2223' and cardinality(notas) = 0;
-- 428 · Latakia Blend · STG · virginia prensada
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'miel']::text[] where id = '428' and cardinality(notas) = 0;
-- 282 · Virginia Flake · STG · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '282' and cardinality(notas) = 0;
-- 29 · 1792 Mini Plug · Samuel Gawith · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'ahumado', 'miel']::text[] where id = '29' and cardinality(notas) = 0;
-- 4 · Best Brown Flake · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '4' and cardinality(notas) = 0;
-- 6 · Black XX Rope · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '6' and cardinality(notas) = 0;
-- 8 · Brown No. 4 Rope · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'ahumado', 'terroso', 'miel']::text[] where id = '8' and cardinality(notas) = 0;
-- 10 · Cabbie's Rope · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '10' and cardinality(notas) = 0;
-- 14 · Cob Plug · Samuel Gawith · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'ahumado', 'miel']::text[] where id = '14' and cardinality(notas) = 0;
-- 15 · Commonwealth Mixture · Samuel Gawith · virginia
update public.tabacos set notas = array['ahumado', 'heno', 'cuero', 'cítricos']::text[] where id = '15' and cardinality(notas) = 0;
-- 30 · Full Virginia Flake · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '30' and cardinality(notas) = 0;
-- 32 · Full Virginia Mini Plug · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '32' and cardinality(notas) = 0;
-- 33 · Full Virginia Mixture · Samuel Gawith · virginia
update public.tabacos set notas = array['heno', 'cítricos']::text[] where id = '33' and cardinality(notas) = 0;
-- 34 · Full Virginia Plug · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '34' and cardinality(notas) = 0;
-- 19 · Golden Glow Broken Flake · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '19' and cardinality(notas) = 0;
-- 21 · Grousemoor Plug · Samuel Gawith · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'miel']::text[] where id = '21' and cardinality(notas) = 0;
-- 20 · Grousemoor · Samuel Gawith · virginia; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'cítricos']::text[] where id = '20' and cardinality(notas) = 0;
-- 22 · Kendal Cream Flake · Samuel Gawith · virginia prensada; Lakeland: aroma floral
update public.tabacos set notas = array['floral', 'heno', 'nuez', 'miel']::text[] where id = '22' and cardinality(notas) = 0;
-- 24 · RC Turkish · Samuel Gawith
update public.tabacos set notas = array['hierbas aromáticas', 'floral']::text[] where id = '24' and cardinality(notas) = 0;
-- 359 · Sam's Flake Burnt Ends · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'floral', 'miel']::text[] where id = '359' and cardinality(notas) = 0;
-- 358 · Sam's Flake · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'floral', 'miel']::text[] where id = '358' and cardinality(notas) = 0;
-- 25 · Skiff Mixture · Samuel Gawith · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '25' and cardinality(notas) = 0;
-- 26 · Squadron Leader · Samuel Gawith · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '26' and cardinality(notas) = 0;
-- 361 · St. James Flake Burnt Ends · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '361' and cardinality(notas) = 0;
-- 360 · St. James Flake · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '360' and cardinality(notas) = 0;
-- 362 · St. James Mini Plug · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '362' and cardinality(notas) = 0;
-- 363 · St. James Plug · Samuel Gawith · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '363' and cardinality(notas) = 0;
-- 2276 · The Balkans · Savinelli · virginia; mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'heno', 'floral']::text[] where id = '2276' and cardinality(notas) = 0;
-- 1204 · Hogshead · Seattle Pipe Club · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '1204' and cardinality(notas) = 0;
-- 1207 · Mississippi River Special Reserve · Seattle Pipe Club · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '1207' and cardinality(notas) = 0;
-- 1205 · Mississippi River · Seattle Pipe Club · virginia prensada
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '1205' and cardinality(notas) = 0;
-- 2046 · Gold 779 · Solani · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2046' and cardinality(notas) = 0;
-- 2049 · Silver Flake 660 · Solani · virginia prensada
update public.tabacos set notas = array['heno', 'ahumado', 'miel', 'terroso']::text[] where id = '2049' and cardinality(notas) = 0;
-- 2050 · Virginia Flake 633 · Solani · virginia prensada
update public.tabacos set notas = array['heno', 'pimienta', 'miel', 'higo']::text[] where id = '2050' and cardinality(notas) = 0;
-- 2212 · Amorelli's best Selection · TAK · virginia; mucha latakia o balcánica
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'pimienta']::text[] where id = '2212' and cardinality(notas) = 0;
-- 2207 · Evening Latakia · TAK · mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'floral', 'cuero']::text[] where id = '2207' and cardinality(notas) = 0;
-- 2206 · Herbst 84 · TAK · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2206' and cardinality(notas) = 0;
-- 2209 · Italy Style · TAK · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2209' and cardinality(notas) = 0;
-- 2210 · Kieler Foerde 2.0 · TAK · mucha latakia o balcánica; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'ahumado', 'pimienta', 'floral']::text[] where id = '2210' and cardinality(notas) = 0;
-- 2199 · M74 · TAK · virginia; poca perique
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos']::text[] where id = '2199' and cardinality(notas) = 0;
-- 2205 · Orient Esprex · TAK · virginia; muchos orientales
update public.tabacos set notas = array['hierbas aromáticas', 'heno', 'pimienta', 'floral']::text[] where id = '2205' and cardinality(notas) = 0;
-- 2203 · Salvo's 2.0 · TAK · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2203' and cardinality(notas) = 0;
-- 2202 · Virginia Crumble Cake · TAK · virginia prensada
update public.tabacos set notas = array['heno', 'miel']::text[] where id = '2202' and cardinality(notas) = 0;
-- 395 · Three Nuns · Three Nuns · virginia prensada
update public.tabacos set notas = array['heno', 'ahumado', 'nuez', 'miel']::text[] where id = '395' and cardinality(notas) = 0;
-- 1216 · Bostonian Rhapsody · Watch City · virginia
update public.tabacos set notas = array['heno', 'pimienta', 'cítricos', 'higo']::text[] where id = '1216' and cardinality(notas) = 0;
-- 2266 · Brown Virginia Flake · Wessex · virginia marrón
update public.tabacos set notas = array['nuez', 'madera']::text[] where id = '2266' and cardinality(notas) = 0;
-- 2268 · Red Virginia Flake · Wessex · virginia roja
update public.tabacos set notas = array['frutos rojos', 'pan tostado']::text[] where id = '2268' and cardinality(notas) = 0;
-- 2270 · Tradition · Wessex · virginia
update public.tabacos set notas = array['ahumado', 'hierbas aromáticas', 'heno', 'cuero']::text[] where id = '2270' and cardinality(notas) = 0;
