-- =====================================================================
-- 65 · Perfil público de cada usuario y bodega visible si el usuario quiere
-- Quien ha entrado con su cuenta puede abrir el perfil de otro usuario tocando su nombre en
-- una reseña. El perfil enseña solo: nombre visible, foto, si es socio del club (y desde qué año)
-- y la fecha de alta. Las reseñas y el rango ya son públicos y se sacan de «opiniones».
-- Nunca se enseñan el correo, el rol ni la última conexión.
-- La bodega (las tres listas, sin gramos ni tarros) solo se ve si su dueño lo activa en Mi cuenta.
-- Empieza desactivada para todos.
-- Necesita el 10, 13, 23 y 37. Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir.
-- =====================================================================

alter table public.perfiles add column if not exists bodega_publica boolean not null default false;
grant select (bodega_publica) on public.perfiles to authenticated;

-- Cada cual cambia solo lo suyo.
create or replace function public.cambiar_bodega_publica(p_publica boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Hay que entrar con una cuenta';
  end if;
  update public.perfiles set bodega_publica = coalesce(p_publica, false) where id = auth.uid();
end $$;
revoke all on function public.cambiar_bodega_publica(boolean) from public, anon;
grant execute on function public.cambiar_bodega_publica(boolean) to authenticated;

-- Perfil de otro usuario (solo con cuenta). Las cuentas suspendidas no tienen perfil público.
create or replace function public.perfil_publico(p_id uuid)
returns table (nombre text, avatar text, socio boolean, socio_desde integer, creado timestamptz, bodega_publica boolean)
language sql stable security definer set search_path = public as $$
  select p.nombre, p.avatar, p.socio, p.socio_desde, p.creado, p.bodega_publica
  from public.perfiles p
  where p.id = p_id and auth.uid() is not null and not coalesce(p.suspendido, false);
$$;
revoke all on function public.perfil_publico(uuid) from public, anon;
grant execute on function public.perfil_publico(uuid) to authenticated;

-- Bodega de otro usuario: solo las tres listas, y solo si la ha hecho visible.
create or replace function public.bodega_publica_de(p_id uuid)
returns table (tabaco_id text, tengo boolean, probado boolean, quiero boolean)
language sql stable security definer set search_path = public as $$
  select b.tabaco_id, b.tengo, b.probado, b.quiero
  from public.bodega b join public.perfiles p on p.id = b.usuario
  where b.usuario = p_id and auth.uid() is not null
    and p.bodega_publica and not coalesce(p.suspendido, false)
    and (b.tengo or b.probado or b.quiero);
$$;
revoke all on function public.bodega_publica_de(uuid) from public, anon;
grant execute on function public.bodega_publica_de(uuid) to authenticated;
