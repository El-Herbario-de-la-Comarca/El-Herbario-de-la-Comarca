-- =====================================================================
-- 43 · Logo de cada marca
-- Los editores (y el administrador) pueden poner, cambiar o quitar el logo de una marca desde
-- la ficha de cualquiera de sus tabacos. El logo sale en la página de la marca y en el listado
-- de marcas (marca/), que se regeneran cada noche.
-- Las imágenes van a la carpeta pública «fotos», subcarpeta «marcas/».
-- Ejecútalo una sola vez en Supabase → SQL Editor, después del 33. Se puede repetir sin romper nada.
-- =====================================================================

create table if not exists public.marcas_logo (
  clave       text primary key check (clave ~ '^[a-z0-9-]{1,80}$'),   -- el nombre en la dirección: samuel-gawith…
  marca       text not null check (char_length(marca) between 1 and 80),
  logo        text not null check (logo ~ '^https://' and char_length(logo) <= 500),
  autor       uuid default auth.uid() references auth.users (id) on delete set null,
  actualizado timestamptz not null default now()
);

-- Quien guarda y cuándo lo pone siempre la base de datos.
create or replace function public.marcas_logo_control() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.autor := auth.uid();
  new.actualizado := now();
  return new;
end $$;
drop trigger if exists marcas_logo_control on public.marcas_logo;
create trigger marcas_logo_control before insert or update on public.marcas_logo
  for each row execute function public.marcas_logo_control();

alter table public.marcas_logo enable row level security;
drop policy if exists "logos: leer" on public.marcas_logo;
create policy "logos: leer" on public.marcas_logo for select to anon, authenticated using (true);
drop policy if exists "logos: editor añade" on public.marcas_logo;
create policy "logos: editor añade" on public.marcas_logo for insert to authenticated with check (public.es_editor());
drop policy if exists "logos: editor cambia" on public.marcas_logo;
create policy "logos: editor cambia" on public.marcas_logo for update to authenticated using (public.es_editor()) with check (public.es_editor());
drop policy if exists "logos: editor quita" on public.marcas_logo;
create policy "logos: editor quita" on public.marcas_logo for delete to authenticated using (public.es_editor());

revoke all on public.marcas_logo from anon, authenticated;
grant select on public.marcas_logo to anon;
grant select, insert, update, delete on public.marcas_logo to authenticated;

-- Subida de imágenes: igual que hasta ahora (33) y, además, los editores pueden subir a fotos/marcas/.
drop policy if exists "fotos: subir admin o editor" on storage.objects;
create policy "fotos: subir admin o editor" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'fotos' and (
      public.es_admin()
      or (public.es_editor() and (storage.foldername(name))[1] in ('fichas', 'marcas'))
      or (public.es_editor()
          and (storage.foldername(name))[1] = 'propuestas'
          and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );
