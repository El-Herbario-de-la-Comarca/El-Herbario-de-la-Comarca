-- El herbario de la Comarca · Condor Ready Rubbed (bolsa verde, Lakeland), 25/10/2026
-- Ejecuta ANTES 09_marcas_alemanas.sql (añade la ficha 2293) y después este archivo.
-- Pone la E y deja la mezcla como Lakeland aunque el 09 se ejecutara antes de este cambio.
update public.tabacos set en_espana = true, tipo = 'Lakeland', descripcion = 'Ready Rubbed es una mezcla de estilo Lakeland de Condor, desmenuzado y listo para cargar (ready rubbed). Lleva virginia. La de la bolsa verde. Virginia curado al aire con esencias florales y un toque de licor. Ya no se fabrica. Formato: bolsa de 50 g.' where id = '2293';
