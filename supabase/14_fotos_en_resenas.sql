-- =====================================================================
-- 14 · Fotos de perfil en las reseñas
-- Devuelve la foto de perfil de quienes han escrito alguna reseña, para enseñarla junto a su
-- firma. No expone nada más del perfil (ni correo ni rol). Necesita el 13 ejecutado antes.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================
create or replace function public.fotos_resenas() returns table (autor uuid, avatar text)
language sql stable security definer set search_path = public as $$
  select p.id, p.avatar
  from public.perfiles p
  where p.avatar <> '' and exists (select 1 from public.opiniones o where o.autor = p.id);
$$;
revoke all on function public.fotos_resenas() from public;
grant execute on function public.fotos_resenas() to anon, authenticated;
