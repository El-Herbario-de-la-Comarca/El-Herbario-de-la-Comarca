-- =====================================================================
-- 55 · Cortes que faltaban (cuarta revisión, 5/11/2026)
-- Fuentes indicadas en cada línea. Solo rellena campos vacíos. Se puede repetir.
-- =====================================================================

-- 2405 · Black Diamond · Doctor Pipe · TR 13325 (Doctor Pipe Black Diamond, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2405' and coalesce(corte, '') = '';
-- 2394 · Royal · Doctor Pipe · TR 13412 (Doctor Pipe Royal, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2394' and coalesce(corte, '') = '';
-- 1220 · F.U.S.T.G! (Fired Up & Set To Go!) · Watch City · TR 13515 (Watch City FUSTG, Mixture)
update public.tabacos set corte = 'Mezcla de cortes' where id = '1220' and coalesce(corte, '') = '';
-- 1221 · None of Your Business · Watch City · TR 5205 (Watch City None of Your Business, Coarse Cut)
update public.tabacos set corte = 'Corte grueso' where id = '1221' and coalesce(corte, '') = '';
-- 1027 · Cruise Line · Robert McConnell · TR 1112 (McConnell Cruise Line Original, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '1027' and coalesce(corte, '') = '';
-- 2292 · No. 6 · Chacom · TR 12298 (Chacom 6, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2292' and coalesce(corte, '') = '';
-- 2225 · Forte · Cellini · TR 1095 (Planta Cellini Forte, Coarse Cut)
update public.tabacos set corte = 'Corte grueso' where id = '2225' and coalesce(corte, '') = '';
-- 2286 · Regular · Brigg · TR 10509 (Planta Brigg Regular, Coarse Cut)
update public.tabacos set corte = 'Corte grueso' where id = '2286' and coalesce(corte, '') = '';
