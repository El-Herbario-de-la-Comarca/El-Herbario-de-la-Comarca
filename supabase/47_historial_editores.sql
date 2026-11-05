-- =====================================================================
-- 47 · Los editores ven el historial de cambios
-- · Los editores pueden leer el historial de las fichas (quién cambió qué y cuándo).
--   Deshacer sigue siendo solo del administrador (lo hace la web con sus permisos de siempre).
-- · nombres_historial(): nombre visible de quienes aparecen en el historial, para enseñarlo
--   junto a cada cambio. A los editores solo les da el nombre visible (nunca el correo);
--   al administrador, si alguien no tiene nombre, le da el correo.
-- Necesita el 33 ejecutado antes. Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir.
-- =====================================================================

drop policy if exists "editores leen historial" on public.historial_fichas;
create policy "editores leen historial" on public.historial_fichas for select to authenticated
  using (public.es_editor());

create index if not exists historial_fichas_autor on public.historial_fichas (autor, cuando desc);

create or replace function public.nombres_historial() returns table (autor uuid, nombre text)
language sql stable security definer set search_path = public as $$
  select p.id,
         coalesce(nullif(btrim(p.nombre), ''), case when public.es_admin() then p.email end, 'usuario')
  from public.perfiles p
  where public.es_editor()
    and exists (select 1 from public.historial_fichas h where h.autor = p.id);
$$;
revoke all on function public.nombres_historial() from public, anon;
grant execute on function public.nombres_historial() to authenticated;
