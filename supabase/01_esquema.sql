-- =====================================================================
-- El herbario de la Comarca · Esquema de base de datos para Supabase
-- Ejecuta este archivo entero en Supabase → SQL Editor → New query → Run.
-- Se puede ejecutar más de una vez sin romper nada.
-- =====================================================================

-- ---------- Perfiles y roles ----------
-- Cada persona que entra con su correo tiene un perfil con un rol:
--   admin  → lo puede todo y aprueba las propuestas
--   editor → propone fichas nuevas, cambios y fotos (quedan pendientes)
--   lector → solo lee (es el rol por defecto al registrarse)
create table if not exists public.perfiles (
  id      uuid primary key references auth.users (id) on delete cascade,
  email   text,
  rol     text not null default 'lector' check (rol in ('admin', 'editor', 'lector')),
  creado  timestamptz not null default now()
);

create or replace function public.mi_rol() returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select rol from public.perfiles where id = auth.uid()), 'anonimo');
$$;
create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select public.mi_rol() = 'admin';
$$;
create or replace function public.es_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select public.mi_rol() in ('admin', 'editor');
$$;

-- Crea el perfil automáticamente cuando alguien se registra
create or replace function public.nuevo_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists al_registrarse on auth.users;
create trigger al_registrarse after insert on auth.users
  for each row execute function public.nuevo_usuario();

-- ---------- Fichas de tabaco ----------
create table if not exists public.tabacos (
  id              text primary key default ('n' || replace(gen_random_uuid()::text, '-', '')),
  nombre          text not null check (char_length(nombre) between 1 and 120),
  marca           text not null check (char_length(marca) between 1 and 80),
  pais            text not null default '' check (char_length(pais) <= 60),
  tipo            text not null default '' check (char_length(tipo) <= 40),
  corte           text not null default '' check (char_length(corte) <= 40),
  formato         text not null default '' check (char_length(formato) <= 80),
  descripcion     text not null default '' check (char_length(descripcion) <= 2000),
  fuerza          int  not null default 0 check (fuerza between 0 and 5),
  notas           text[] not null default '{}' check (cardinality(notas) <= 12),
  foto            text not null default '' check (char_length(foto) <= 500),
  video_id        text not null default '' check (video_id = '' or video_id ~ '^[A-Za-z0-9_-]{11}$'),
  creado          timestamptz not null default now(),
  actualizado     timestamptz not null default now(),
  actualizado_por uuid
);
create index if not exists tabacos_marca on public.tabacos (marca);

create or replace function public.marcar_actualizado() returns trigger
language plpgsql as $$
begin
  new.actualizado := now();
  new.actualizado_por := auth.uid();
  return new;
end $$;
drop trigger if exists tabacos_actualizado on public.tabacos;
create trigger tabacos_actualizado before update on public.tabacos
  for each row execute function public.marcar_actualizado();

-- ---------- Reseñas del herbario (solo admin) ----------
create table if not exists public.resenas (
  tabaco_id   text primary key references public.tabacos (id) on delete cascade,
  titular     text not null default '' check (char_length(titular) <= 200),
  texto       text not null default '' check (char_length(texto) <= 20000),
  puntuacion  int  not null default 0 check (puntuacion between 0 and 5),
  video_id    text not null default '' check (video_id = '' or video_id ~ '^[A-Za-z0-9_-]{11}$'),
  actualizado timestamptz not null default now()
);

-- ---------- Propuestas de los editores ----------
create table if not exists public.propuestas (
  id           bigint generated always as identity primary key,
  tabaco_id    text references public.tabacos (id) on delete cascade,
  tipo         text not null check (tipo in ('nueva', 'cambio', 'foto')),
  datos        jsonb not null default '{}' check (pg_column_size(datos) < 20000),
  nota         text not null default '' check (char_length(nota) <= 1000),
  estado       text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  autor        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  autor_email  text,
  creado       timestamptz not null default now(),
  revisado_por uuid,
  revisado     timestamptz,
  check ((tipo = 'nueva') = (tabaco_id is null))
);
create index if not exists propuestas_estado on public.propuestas (estado, creado);

-- Rellena el correo del autor y limita a 50 propuestas pendientes por persona
create or replace function public.antes_de_proponer() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.autor := auth.uid();
  new.autor_email := (select email from public.perfiles where id = auth.uid());
  new.estado := 'pendiente';
  new.revisado_por := null;
  new.revisado := null;
  if (select count(*) from public.propuestas where autor = auth.uid() and estado = 'pendiente') >= 50 then
    raise exception 'Tienes 50 propuestas pendientes. Espera a que se revisen.';
  end if;
  return new;
end $$;
drop trigger if exists propuestas_antes on public.propuestas;
create trigger propuestas_antes before insert on public.propuestas
  for each row execute function public.antes_de_proponer();

-- Aprobar o rechazar (solo admin). Aplica el cambio de forma segura.
create or replace function public.aprobar_propuesta(p_id bigint) returns text
language plpgsql security definer set search_path = public as $$
declare
  p public.propuestas;
  d jsonb;
  res text;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede aprobar propuestas';
  end if;
  select * into p from public.propuestas where id = p_id for update;
  if not found or p.estado <> 'pendiente' then
    raise exception 'La propuesta no existe o ya está revisada';
  end if;
  d := p.datos;
  if p.tipo = 'nueva' then
    insert into public.tabacos (nombre, marca, pais, tipo, corte, formato, descripcion, fuerza, notas, foto)
    values (
      coalesce(d->>'nombre', ''), coalesce(d->>'marca', ''), coalesce(d->>'pais', ''),
      coalesce(d->>'tipo', ''), coalesce(d->>'corte', ''), coalesce(d->>'formato', ''),
      coalesce(d->>'descripcion', ''), coalesce((d->>'fuerza')::int, 0),
      coalesce(array(select jsonb_array_elements_text(d->'notas')), '{}'),
      coalesce(d->>'foto', '')
    ) returning id into res;
  elsif p.tipo = 'cambio' then
    update public.tabacos set
      nombre      = coalesce(d->>'nombre', nombre),
      marca       = coalesce(d->>'marca', marca),
      pais        = coalesce(d->>'pais', pais),
      tipo        = coalesce(d->>'tipo', tipo),
      corte       = coalesce(d->>'corte', corte),
      formato     = coalesce(d->>'formato', formato),
      descripcion = coalesce(d->>'descripcion', descripcion),
      fuerza      = coalesce((d->>'fuerza')::int, fuerza),
      notas       = case when d ? 'notas' then array(select jsonb_array_elements_text(d->'notas')) else notas end
    where id = p.tabaco_id;
    res := p.tabaco_id;
  else
    update public.tabacos set foto = coalesce(d->>'foto', foto) where id = p.tabaco_id;
    res := p.tabaco_id;
  end if;
  update public.propuestas set estado = 'aprobada', revisado_por = auth.uid(), revisado = now() where id = p_id;
  return res;
end $$;

create or replace function public.rechazar_propuesta(p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede rechazar propuestas';
  end if;
  update public.propuestas set estado = 'rechazada', revisado_por = auth.uid(), revisado = now()
  where id = p_id and estado = 'pendiente';
end $$;

-- ---------- Seguridad: reglas de acceso (RLS) ----------
alter table public.perfiles   enable row level security;
alter table public.tabacos    enable row level security;
alter table public.resenas    enable row level security;
alter table public.propuestas enable row level security;

drop policy if exists "perfil propio o admin" on public.perfiles;
create policy "perfil propio o admin" on public.perfiles for select to authenticated
  using (id = auth.uid() or public.es_admin());
drop policy if exists "admin cambia roles" on public.perfiles;
create policy "admin cambia roles" on public.perfiles for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "todos leen tabacos" on public.tabacos;
create policy "todos leen tabacos" on public.tabacos for select to anon, authenticated using (true);
drop policy if exists "admin crea tabacos" on public.tabacos;
create policy "admin crea tabacos" on public.tabacos for insert to authenticated with check (public.es_admin());
drop policy if exists "admin edita tabacos" on public.tabacos;
create policy "admin edita tabacos" on public.tabacos for update to authenticated using (public.es_admin()) with check (public.es_admin());
drop policy if exists "admin borra tabacos" on public.tabacos;
create policy "admin borra tabacos" on public.tabacos for delete to authenticated using (public.es_admin());

drop policy if exists "todos leen resenas" on public.resenas;
create policy "todos leen resenas" on public.resenas for select to anon, authenticated using (true);
drop policy if exists "admin escribe resenas" on public.resenas;
create policy "admin escribe resenas" on public.resenas for all to authenticated using (public.es_admin()) with check (public.es_admin());

drop policy if exists "editor propone" on public.propuestas;
create policy "editor propone" on public.propuestas for insert to authenticated
  with check (public.es_editor() and autor = auth.uid());
drop policy if exists "ver propuestas propias o admin" on public.propuestas;
create policy "ver propuestas propias o admin" on public.propuestas for select to authenticated
  using (autor = auth.uid() or public.es_admin());
drop policy if exists "admin borra propuestas" on public.propuestas;
create policy "admin borra propuestas" on public.propuestas for delete to authenticated using (public.es_admin());

-- Permisos de tabla para los roles de Supabase (las reglas de arriba deciden qué filas)
grant usage on schema public to anon, authenticated;
grant select on public.tabacos, public.resenas to anon, authenticated;
grant insert, update, delete on public.tabacos, public.resenas to authenticated;
grant select, insert, delete on public.propuestas to authenticated;
grant select, update (rol) on public.perfiles to authenticated;
revoke all on function public.aprobar_propuesta(bigint), public.rechazar_propuesta(bigint) from public, anon;
grant execute on function public.aprobar_propuesta(bigint), public.rechazar_propuesta(bigint) to authenticated;
grant execute on function public.mi_rol(), public.es_admin(), public.es_editor() to anon, authenticated;

-- ---------- Fotos (Supabase Storage) ----------
-- Carpeta pública "fotos": cualquiera ve las imágenes.
-- El admin sube a fichas/…; un editor solo a propuestas/<su id>/…
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "fotos: subir admin o editor" on storage.objects;
create policy "fotos: subir admin o editor" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'fotos' and (
      public.es_admin()
      or (public.es_editor()
          and (storage.foldername(name))[1] = 'propuestas'
          and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );
drop policy if exists "fotos: admin lee" on storage.objects;
create policy "fotos: admin lee" on storage.objects for select to authenticated
  using (bucket_id = 'fotos' and public.es_admin());
drop policy if exists "fotos: admin cambia" on storage.objects;
create policy "fotos: admin cambia" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and public.es_admin());
drop policy if exists "fotos: admin borra" on storage.objects;
create policy "fotos: admin borra" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and public.es_admin());
