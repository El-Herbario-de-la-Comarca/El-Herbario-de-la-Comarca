-- =====================================================================
-- 53 · Mezcla, corte y hojas que faltaban (segunda revisión, 5/11/2026)
-- Datos de Tobacco Reviews (Blend Type, Contents, Cut). Solo rellena campos vacíos.
-- Se puede repetir sin romper nada.
-- =====================================================================

-- 405 · Mellow Blend · Amphora · TR 2589 (Blend Type: Aromatic)
update public.tabacos set tipo = 'Aromática' where id = '405' and coalesce(tipo, '') = '';
-- 405 · Mellow Blend · Amphora · TR 2589
update public.tabacos set hojas = array['Virginia', 'Burley', 'Oriental', 'Kentucky']::text[] where id = '405' and hojas = '{}';
-- 2273 · No. 88 Matured Dark Virginia · Astley's · TR 27 (Straight Virginia; contenido Black Cavendish)
update public.tabacos set hojas = array['Virginia', 'Cavendish']::text[] where id = '2273' and hojas = '{}';
-- 2026 · Dockworker Flake · HU Tobacco · TR 5347 (Burley Based)
update public.tabacos set tipo = 'Burley' where id = '2026' and coalesce(tipo, '') = '';
-- 2199 · M74 · TAK · TR 11232 (Motzek M74, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2199' and coalesce(corte, '') = '';
-- 2204 · Old School · TAK · TR 11535 (Motzek Old School, Coarse Cut)
update public.tabacos set corte = 'Corte grueso' where id = '2204' and coalesce(corte, '') = '';
-- 2206 · Herbst 84 · TAK · TR 9368 (Motzek Herbst 84, Coarse Cut)
update public.tabacos set corte = 'Corte grueso' where id = '2206' and coalesce(corte, '') = '';
-- 2211 · Dark Matter · TAK · TR 11406 (Motzek Dark Matter, Mixture)
update public.tabacos set corte = 'Mezcla de cortes' where id = '2211' and coalesce(corte, '') = '';
-- 2217 · Ralf's Burley Cup · TAK · TR 11060 (Motzek Ralf's Burley Cup, Ribbon)
update public.tabacos set corte = 'Ribbon' where id = '2217' and coalesce(corte, '') = '';
