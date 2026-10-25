-- =====================================================================
-- 12 · Quitar Capstan Ready Rubbed
-- Original Navy Cut Ready Rubbed y Gold Navy Cut Ready Rubbed ya no están a la venta en
-- Smokingpipes ni en cigarworld.de (oct. 2026). Se borran sus fichas; si tenían reseñas o
-- estaban en alguna bodega, eso también se borra.
-- Ejecútalo una vez en Supabase → SQL Editor, después del 11. Se puede repetir sin romper nada.
-- =====================================================================
delete from public.tabacos where marca = 'Capstan' and id in ('392', '394');
