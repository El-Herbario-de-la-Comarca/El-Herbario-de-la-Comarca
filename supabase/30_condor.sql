-- El herbario de la Comarca · Condor Ready Rubbed (bolsa verde), 25/10/2026
-- Ejecuta ANTES 09_marcas_alemanas.sql (añade la ficha 2293) y después este archivo.
-- Pone la E, el tipo Aromática y la nota «Lakeland» aunque el 09 se ejecutara antes de estos cambios.
update public.tabacos set en_espana = true, tipo = 'Aromática', notas = array['Lakeland']::text[], descripcion = 'Ready Rubbed es una mezcla aromática de Condor, desmenuzado y listo para cargar (ready rubbed). Lleva virginia. La de la bolsa verde. Virginia curado al aire con esencias florales y un toque de licor. Ya no se fabrica. Tiene el aroma floral típico de las mezclas Lakeland. Formato: bolsa de 50 g.' where id = '2293';
