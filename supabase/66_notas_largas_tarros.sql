-- =====================================================================
-- 66 · Mi bodega: notas más largas en los tarros
-- La nota de cada tarro o lata pasa de 80 a 2000 caracteres.
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- (Ejecútalo antes de publicar el cambio de la web, o las notas de más de 80 caracteres darán error al guardar.)
-- =====================================================================

-- Quita la restricción antigua (la de 80) sea cual sea su nombre.
do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    where c.conrelid = 'public.tarros'::regclass
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%char_length(nota)%'
  loop
    execute format('alter table public.tarros drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.tarros add constraint tarros_nota_check check (char_length(nota) <= 2000);
