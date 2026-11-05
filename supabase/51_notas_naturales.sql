-- =====================================================================
-- 51 · Notas de sabor de mezclas no aromáticas (generado con herramientas/notas_sql.py)
-- Solo sabores que la descripción del fabricante o de la tienda dice expresamente.
-- Solo rellena fichas sin ninguna nota. Se puede ejecutar varias veces.
-- =====================================================================

-- 78 · Black Duck · Cornell & Diehl · TR 245 (descripción: earthy, woodsy)
update public.tabacos set notas = array['terroso', 'madera']::text[] where id = '78' and cardinality(notas) = 0;
