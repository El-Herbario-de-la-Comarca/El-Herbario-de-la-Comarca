-- =====================================================================
-- 46 · Misma foto para todas las fichas de Pfeifendepot
-- Pone el logo de la tienda (img/fichas/pfeifendepot.webp, alojado en la propia web) como foto
-- de todos los tabacos de la marca Pfeifendepot, incluidos los que se hayan creado desde la web.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

update public.tabacos
   set foto = 'img/fichas/pfeifendepot.webp'
 where marca = 'Pfeifendepot';

-- Comprobación: debe salir una sola fila con la foto nueva y el número de fichas (39 o más).
select foto, count(*) from public.tabacos where marca = 'Pfeifendepot' group by foto;
