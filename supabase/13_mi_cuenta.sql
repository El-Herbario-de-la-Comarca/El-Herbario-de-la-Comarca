-- =====================================================================
-- 13 · Mi cuenta: nombre visible y foto de perfil
-- Cada persona puede poner un nombre visible y una foto de perfil. Solo cambia lo suyo:
-- el rol sigue siendo cosa del administrador.
-- Las fotos van a una carpeta pública nueva, «avatares», dentro de una subcarpeta con el id
-- de cada usuario. Nadie puede subir ni borrar fotos en la carpeta de otro.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

alter table public.perfiles add column if not exists nombre text not null default ''
  check (char_length(nombre) <= 40);
alter table public.perfiles add column if not exists avatar text not null default ''
  check (char_length(avatar) <= 500);

-- Cambia el nombre visible y la foto del usuario que ha entrado (nunca el rol ni el correo).
create or replace function public.actualizar_mi_perfil(p_nombre text, p_avatar text) returns void
language plpgsql security definer set search_path = public as $$
declare
  base text := '/storage/v1/object/public/avatares/' || auth.uid()::text || '/';
begin
  if auth.uid() is null then
    raise exception 'Hay que entrar con una cuenta';
  end if;
  p_nombre := btrim(coalesce(p_nombre, ''));
  p_avatar := coalesce(p_avatar, '');
  if char_length(p_nombre) > 40 then
    raise exception 'El nombre puede tener como mucho 40 caracteres';
  end if;
  -- La foto solo puede ser una de la propia carpeta del usuario, o ninguna.
  if p_avatar <> '' and (position(base in p_avatar) = 0 or p_avatar !~ '^https://') then
    raise exception 'La foto no es válida';
  end if;
  update public.perfiles set nombre = p_nombre, avatar = p_avatar where id = auth.uid();
end $$;
revoke all on function public.actualizar_mi_perfil(text, text) from public, anon;
grant execute on function public.actualizar_mi_perfil(text, text) to authenticated;
grant select (nombre, avatar) on public.perfiles to authenticated;

-- Carpeta pública de fotos de perfil (máximo 2 MB, solo imágenes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "avatares: subir la propia" on storage.objects;
create policy "avatares: subir la propia" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatares: ver la propia" on storage.objects;
create policy "avatares: ver la propia" on storage.objects for select to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatares: cambiar la propia" on storage.objects;
create policy "avatares: cambiar la propia" on storage.objects for update to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatares: borrar la propia" on storage.objects;
create policy "avatares: borrar la propia" on storage.objects for delete to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
