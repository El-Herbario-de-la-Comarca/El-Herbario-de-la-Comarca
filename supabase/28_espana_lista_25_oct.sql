-- El herbario de la Comarca · Distintivo de España según la lista del CMT del 25/10/2026
-- Fichas que ya estaban en el catálogo y aparecen en la lista oficial (HU Tobacco, Sillems, HH Vintage Latakia).
-- Ejecútalo en Supabase → SQL Editor después del 09. Se puede repetir sin romper nada.
update public.tabacos set en_espana = true where id in ('2000', '2004', '2012', '2014', '2015', '2017', '2219', '2100', '2101', '2102', '2103', '2104');
