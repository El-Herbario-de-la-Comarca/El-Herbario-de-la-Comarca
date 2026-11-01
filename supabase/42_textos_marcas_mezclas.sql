-- =====================================================================
-- 42 · Textos de las páginas de marca y de tipo de mezcla
-- Cada marca (marca/<marca>.html) y cada tipo de mezcla (mezcla/<tipo>.html) tiene una página
-- que se genera cada noche. Su texto de presentación sale de aquí; si aquí no hay nada, se usa
-- el texto inicial del archivo secciones/textos.json del repositorio.
-- Solo el administrador puede escribir; cualquiera puede leer (los textos son públicos).
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

create table if not exists public.textos_seccion (
  tipo        text not null check (tipo in ('marca', 'mezcla')),
  clave       text not null check (clave ~ '^[a-z0-9-]{1,80}$'),   -- el nombre en la dirección: samuel-gawith, inglesa…
  texto       text not null default '' check (char_length(texto) <= 6000),
  actualizado timestamptz not null default now(),
  primary key (tipo, clave)
);

create or replace function public.textos_seccion_fecha() returns trigger
language plpgsql set search_path = public as $$
begin
  new.actualizado := now();
  return new;
end $$;
drop trigger if exists textos_seccion_fecha on public.textos_seccion;
create trigger textos_seccion_fecha before insert or update on public.textos_seccion
  for each row execute function public.textos_seccion_fecha();

alter table public.textos_seccion enable row level security;
drop policy if exists "textos: leer" on public.textos_seccion;
create policy "textos: leer" on public.textos_seccion for select to anon, authenticated using (true);
drop policy if exists "textos: admin añade" on public.textos_seccion;
create policy "textos: admin añade" on public.textos_seccion for insert to authenticated with check (public.es_admin());
drop policy if exists "textos: admin cambia" on public.textos_seccion;
create policy "textos: admin cambia" on public.textos_seccion for update to authenticated using (public.es_admin()) with check (public.es_admin());
drop policy if exists "textos: admin borra" on public.textos_seccion;
create policy "textos: admin borra" on public.textos_seccion for delete to authenticated using (public.es_admin());

revoke all on public.textos_seccion from anon, authenticated;
grant select on public.textos_seccion to anon;
grant select, insert, update, delete on public.textos_seccion to authenticated;
