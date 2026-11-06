-- 60 · Uso de «Identificar por foto» para la casilla de Mi cuenta (solo administrador).
-- Devuelve las fotos leídas hoy, este mes y en total, y cuántas personas la han usado este mes.

create or replace function public.uso_lecturas_foto()
returns json
language sql
stable
security definer
set search_path = public
as $$
  with h as (select (now() at time zone 'Europe/Madrid')::date as hoy)
  select case when public.es_admin() then json_build_object(
    'hoy',      coalesce((select sum(n) from lecturas_foto, h where dia = h.hoy), 0),
    'mes',      coalesce((select sum(n) from lecturas_foto, h where dia >= date_trunc('month', h.hoy)::date), 0),
    'total',    coalesce((select sum(n) from lecturas_foto), 0),
    'personas', (select count(distinct usuario) from lecturas_foto, h where dia >= date_trunc('month', h.hoy)::date)
  ) end;
$$;

revoke all on function public.uso_lecturas_foto() from public, anon;
grant execute on function public.uso_lecturas_foto() to authenticated;
