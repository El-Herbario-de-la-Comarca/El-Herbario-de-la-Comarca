-- =====================================================================
-- 38 · El administrador puede ver la bodega de cada usuario (solo lectura)
-- Desde el panel de Usuarios, botón «Bodega». No cambia las reglas de la tabla «bodega»
-- ni de «tarros»: cada usuario sigue viendo y tocando solo lo suyo. Estas dos funciones
-- devuelven la bodega y los tarros de una persona, y solo responden al administrador.
-- Necesita el 10, 15 y 24. Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir.
-- =====================================================================

create or replace function public.admin_bodega_de(p_id uuid)
returns setof public.bodega
language sql stable security definer set search_path = public as $$
  select b.* from public.bodega b where b.usuario = p_id and public.es_admin();
$$;
revoke all on function public.admin_bodega_de(uuid) from public, anon;
grant execute on function public.admin_bodega_de(uuid) to authenticated;

create or replace function public.admin_tarros_de(p_id uuid)
returns setof public.tarros
language sql stable security definer set search_path = public as $$
  select t.* from public.tarros t where t.usuario = p_id and public.es_admin() order by t.creado;
$$;
revoke all on function public.admin_tarros_de(uuid) from public, anon;
grant execute on function public.admin_tarros_de(uuid) to authenticated;
