-- =====================================================================
-- 15 · Mi bodega: cantidad en gramos
-- Al marcar «Lo tengo» se puede apuntar cuántos gramos se tienen. Es opcional:
-- si no se pone nada, el campo queda vacío (no 0).
-- Ejecútalo una vez en Supabase → SQL Editor, después del 10. Se puede repetir sin romper nada.
-- =====================================================================
alter table public.bodega add column if not exists gramos integer;
alter table public.bodega drop constraint if exists bodega_gramos_validos;
alter table public.bodega add constraint bodega_gramos_validos
  check (gramos is null or (gramos between 1 and 100000 and tengo));
