-- =====================================================================
-- 61 · Quita de las descripciones la frase «Todavía no tenemos datos fiables de … ni de …»
-- (variantes: mezcla, familia, composición, corte, fuerza). El resto del texto no cambia.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

-- Antes: cuántas fichas la llevan
select count(*) as fichas_con_la_frase
from public.tabacos
where descripcion ~ 'Todavía no tenemos datos fiables';

update public.tabacos
set descripcion = btrim(regexp_replace(
      descripcion,
      '\s*Todavía no tenemos datos fiables de [^.]*\.',
      '', 'g'))
where descripcion ~ 'Todavía no tenemos datos fiables';

-- Después: debe salir 0
select count(*) as quedan
from public.tabacos
where descripcion ~ 'Todavía no tenemos datos fiables';
