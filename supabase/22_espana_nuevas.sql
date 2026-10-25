-- El herbario de la Comarca · Fichas nuevas de la lista oficial española (25/10/2026)
-- Ejecuta ANTES 09_marcas_alemanas.sql (añade las fichas 2180-2196) y después este archivo.
update public.tabacos set en_espana = true where id in ('2180', '2181', '2182', '2183', '2184', '2185', '2186', '2187', '2188', '2189', '2190', '2191', '2192', '2193', '2194', '2195', '2196', '291', '1088', '1089', '1090', '1164');
