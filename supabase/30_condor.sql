-- El herbario de la Comarca · Condor Ready Rubbed (bolsa verde), 25/10/2026
-- Ejecuta ANTES 09_marcas_alemanas.sql (añade la ficha 2293) y después este archivo, que le pone la E.
update public.tabacos set en_espana = true where id = '2293';
