-- =====================================================================
-- 37 · Panel de usuarios: suspender cuentas y notas privadas del administrador
-- - Suspender: la persona no puede entrar ni escribir (reseñas, bodega, tarros, fichas),
--   pero su cuenta y sus reseñas se conservan. Se puede levantar en cualquier momento.
--   Borrar cuentas (36) sigue disponible, por ejemplo para las cuentas de prueba.
-- - Notas privadas sobre cada usuario, que solo ve el administrador.
-- - La lista de usuarios devuelve también si está suspendido y la nota.
-- Necesita el 36. Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir.
-- =====================================================================

-- ---------- Suspender ----------
alter table public.perfiles add column if not exists suspendido boolean not null default false;

-- Quien está suspendido deja de tener rol: no es lector, ni editor, ni admin.
create or replace function public.mi_rol() returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select case when suspendido then 'suspendido' else rol end
                   from public.perfiles where id = auth.uid()), 'anonimo');
$$;

create or replace function public.estoy_suspendido() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select suspendido from public.perfiles where id = auth.uid()), false);
$$;
grant execute on function public.estoy_suspendido() to anon, authenticated;

-- Reglas extra (se suman a las que ya hay): nada de escribir estando suspendido.
drop policy if exists "suspendidos no escriben" on public.opiniones;
create policy "suspendidos no escriben" on public.opiniones as restrictive for insert to authenticated
  with check (not public.estoy_suspendido());
drop policy if exists "suspendidos no cambian" on public.opiniones;
create policy "suspendidos no cambian" on public.opiniones as restrictive for update to authenticated
  using (not public.estoy_suspendido());
drop policy if exists "suspendidos no escriben" on public.bodega;
create policy "suspendidos no escriben" on public.bodega as restrictive for insert to authenticated
  with check (not public.estoy_suspendido());
drop policy if exists "suspendidos no cambian" on public.bodega;
create policy "suspendidos no cambian" on public.bodega as restrictive for update to authenticated
  using (not public.estoy_suspendido());
drop policy if exists "suspendidos no escriben" on public.tarros;
create policy "suspendidos no escriben" on public.tarros as restrictive for insert to authenticated
  with check (not public.estoy_suspendido());
drop policy if exists "suspendidos no cambian" on public.tarros;
create policy "suspendidos no cambian" on public.tarros as restrictive for update to authenticated
  using (not public.estoy_suspendido());

-- Suspende o readmite. Además bloquea el acceso en Supabase (no podrá volver a entrar
-- ni renovar la sesión abierta).
create or replace function public.admin_suspender(p_id uuid, p_suspender boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede suspender cuentas';
  end if;
  if p_id = auth.uid() then
    raise exception 'No puedes suspender tu propia cuenta';
  end if;
  if p_suspender and exists (select 1 from public.perfiles where id = p_id and rol = 'admin') then
    raise exception 'Quítale antes el rol de administrador';
  end if;
  update public.perfiles set suspendido = p_suspender where id = p_id;
  update auth.users set banned_until = case when p_suspender then 'infinity'::timestamptz else null end where id = p_id;
end $$;
revoke all on function public.admin_suspender(uuid, boolean) from public, anon;
grant execute on function public.admin_suspender(uuid, boolean) to authenticated;

-- ---------- Notas privadas del administrador ----------
create table if not exists public.notas_usuarios (
  usuario     uuid primary key references auth.users (id) on delete cascade,
  nota        text not null default '' check (char_length(nota) <= 2000),
  actualizado timestamptz not null default now()
);
alter table public.notas_usuarios enable row level security;
drop policy if exists "notas: solo admin" on public.notas_usuarios;
create policy "notas: solo admin" on public.notas_usuarios for all to authenticated
  using (public.es_admin()) with check (public.es_admin());
revoke all on public.notas_usuarios from anon;
grant select, insert, update, delete on public.notas_usuarios to authenticated;

-- ---------- Lista de usuarios con lo nuevo ----------
drop function if exists public.admin_usuarios();
create function public.admin_usuarios()
returns table (
  id uuid, email text, nombre text, avatar text, rol text, creado timestamptz,
  socio boolean, socio_desde integer, ultima_conexion timestamptz, resenas integer, en_bodega integer,
  suspendido boolean, nota text
)
language sql stable security definer set search_path = public as $$
  select p.id, p.email, p.nombre, p.avatar, p.rol, p.creado, p.socio, p.socio_desde,
         nullif(greatest(coalesce(u.last_sign_in_at, '-infinity'), coalesce(p.ultima_visita, '-infinity')), '-infinity'),
         (select count(*)::int from public.opiniones o where o.autor = p.id),
         (select count(*)::int from public.bodega b where b.usuario = p.id),
         p.suspendido,
         coalesce((select n.nota from public.notas_usuarios n where n.usuario = p.id), '')
  from public.perfiles p
  left join auth.users u on u.id = p.id
  where public.es_admin()
  order by p.creado;
$$;
revoke all on function public.admin_usuarios() from public, anon;
grant execute on function public.admin_usuarios() to authenticated;
