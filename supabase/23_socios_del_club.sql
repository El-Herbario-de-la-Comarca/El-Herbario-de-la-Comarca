-- =====================================================================
-- 23 · Socios del Pipa Club Fumadas Hobbit
-- El administrador marca a los socios (y, si quiere, el año de entrada) desde «Usuarios y permisos».
-- Los socios llevan el logo del club junto a su firma en las reseñas y ven su carné en «Mi cuenta».
-- Nadie puede marcarse como socio a sí mismo: solo el admin puede cambiar perfiles (política del 01).
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================
alter table public.perfiles add column if not exists socio boolean not null default false;
alter table public.perfiles add column if not exists socio_desde integer;
alter table public.perfiles drop constraint if exists perfiles_socio_desde;
alter table public.perfiles add constraint perfiles_socio_desde
  check (socio_desde is null or socio_desde between 1950 and 2100);

-- Cada cual lee su propia fila (y el admin todas), por la política del 01.
grant select (socio, socio_desde) on public.perfiles to authenticated;
grant update (socio, socio_desde) on public.perfiles to authenticated;

-- Lista pública de los socios que han escrito alguna reseña (solo el id, nada más del perfil).
create or replace function public.socios_resenas() returns table (autor uuid)
language sql stable security definer set search_path = public as $$
  select p.id from public.perfiles p
  where p.socio and exists (select 1 from public.opiniones o where o.autor = p.id);
$$;
revoke all on function public.socios_resenas() from public;
grant execute on function public.socios_resenas() to anon, authenticated;
