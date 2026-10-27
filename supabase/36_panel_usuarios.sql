-- =====================================================================
-- 36 · Panel de usuarios (solo administrador)
-- - Guarda la última visita de cada usuario (la fecha de «entrar» de Supabase solo cambia
--   cuando alguien escribe su contraseña; quien deja la sesión abierta no la actualiza).
-- - Lista de usuarios para el administrador: correo, nombre público, foto, rol, socio,
--   alta, última conexión, reseñas publicadas y tabacos en su bodega.
-- - Borrar una cuenta: se borran también su perfil, sus reseñas, su bodega, sus tarros y sus
--   propuestas. El historial de fichas se conserva (aparece como «usuario»).
-- Necesita el 07, 10, 13 y 23. Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir.
-- =====================================================================

-- Última visita
alter table public.perfiles add column if not exists ultima_visita timestamptz;

create or replace function public.marcar_visita() returns void
language sql security definer set search_path = public as $$
  update public.perfiles set ultima_visita = now() where id = auth.uid();
$$;
revoke all on function public.marcar_visita() from public, anon;
grant execute on function public.marcar_visita() to authenticated;

-- Lista de usuarios (devuelve vacío a quien no sea administrador)
drop function if exists public.admin_usuarios();
create function public.admin_usuarios()
returns table (
  id uuid, email text, nombre text, avatar text, rol text, creado timestamptz,
  socio boolean, socio_desde integer, ultima_conexion timestamptz, resenas integer, en_bodega integer
)
language sql stable security definer set search_path = public as $$
  select p.id, p.email, p.nombre, p.avatar, p.rol, p.creado, p.socio, p.socio_desde,
         nullif(greatest(coalesce(u.last_sign_in_at, '-infinity'), coalesce(p.ultima_visita, '-infinity')), '-infinity'),
         (select count(*)::int from public.opiniones o where o.autor = p.id),
         (select count(*)::int from public.bodega b where b.usuario = p.id)
  from public.perfiles p
  left join auth.users u on u.id = p.id
  where public.es_admin()
  order by p.creado;
$$;
revoke all on function public.admin_usuarios() from public, anon;
grant execute on function public.admin_usuarios() to authenticated;

-- Borrar una cuenta (nunca la propia ni la de otro administrador)
create or replace function public.admin_borrar_usuario(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede borrar cuentas';
  end if;
  if p_id = auth.uid() then
    raise exception 'No puedes borrar tu propia cuenta desde aquí';
  end if;
  if exists (select 1 from public.perfiles where id = p_id and rol = 'admin') then
    raise exception 'Quítale antes el rol de administrador';
  end if;
  delete from auth.users where id = p_id;
end $$;
revoke all on function public.admin_borrar_usuario(uuid) from public, anon;
grant execute on function public.admin_borrar_usuario(uuid) to authenticated;

-- El administrador puede ver y borrar las fotos de perfil de otros (para limpiar al borrar una cuenta)
drop policy if exists "avatares: admin lee" on storage.objects;
create policy "avatares: admin lee" on storage.objects for select to authenticated
  using (bucket_id = 'avatares' and public.es_admin());
drop policy if exists "avatares: admin borra" on storage.objects;
create policy "avatares: admin borra" on storage.objects for delete to authenticated
  using (bucket_id = 'avatares' and public.es_admin());
