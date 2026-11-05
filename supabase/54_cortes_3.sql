-- =====================================================================
-- 54 · Cortes que faltaban (tercera revisión, 5/11/2026)
-- Fuentes indicadas en cada línea. Solo rellena campos vacíos. Se puede repetir.
-- =====================================================================

-- 2400 · Crunchy Blend · Doctor Pipe · TR 13327 (Doctor Pipe Crunchy Blend, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2400' and coalesce(corte, '') = '';
-- 54 · Ruby · Borkum Riff · TR 10759 (Borkum Riff Ruby, Ready Rubbed)
update public.tabacos set corte = 'Ready Rubbed' where id = '54' and coalesce(corte, '') = '';
-- 55 · Cherry Liquor · Borkum Riff · TR 2037 (Borkum Riff Cherry Liqueur, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '55' and coalesce(corte, '') = '';
-- 52 · Bronze · Borkum Riff · pfeifen-shop-online.de (Borkum Riff Bronze, Cut: Mixture)
update public.tabacos set corte = 'Mezcla de cortes' where id = '52' and coalesce(corte, '') = '';
-- 51 · Original · Borkum Riff · Smokingpipes 116893 (Borkum Riff Original, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '51' and coalesce(corte, '') = '';
-- 2408 · Torben Dansk Black Cavendish Danish Style · Dan Tobacco · pfeifen-shop-online.de (Torben Dansk Black Cavendish Danish, Ready Rubbed)
update public.tabacos set corte = 'Ready Rubbed' where id = '2408' and coalesce(corte, '') = '';
-- 2312 · Bi Bo – The Other Brother · Dan Tobacco · TR 9466 (Dan Tobacco Buddies Bi-Bo, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2312' and coalesce(corte, '') = '';
