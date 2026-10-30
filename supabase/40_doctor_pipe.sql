-- El herbario de la Comarca · Doctor Pipe (Brasil), 30/10/2026
-- Ejecuta ANTES 09_marcas_alemanas.sql (añade las 20 fichas 2388-2407) y después este archivo,
-- que pone la E a las que están en la lista oficial española. Se puede repetir sin romper nada.
update public.tabacos set en_espana = true where id in ('2388', '2394', '2401', '2403', '2404');
