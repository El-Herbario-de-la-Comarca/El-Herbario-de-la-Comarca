-- =====================================================================
-- 48 · Erinmore: país de origen Dinamarca
-- Desde 2005 Erinmore la elabora Scandinavian Tobacco Group en su fábrica de Orlik, en Assens (Dinamarca).
-- Antes la hacía Murray, Sons and Company en Belfast.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir. Solo cambia las fichas que aún dicen Reino Unido.
-- =====================================================================
update public.tabacos set pais = 'Dinamarca'
where marca = 'Erinmore' and pais = 'Reino Unido';
