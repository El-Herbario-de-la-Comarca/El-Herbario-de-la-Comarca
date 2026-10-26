-- El herbario de la Comarca · Los editores editan directamente (26/10/2026)
-- Ejecútalo en Supabase → SQL Editor. Se puede ejecutar más de una vez.
--
-- · Editores y admin pueden cambiar las fichas y sus fotos sin pasar por la revisión.
-- · Crear fichas nuevas y borrarlas sigue siendo solo del admin (el editor propone las nuevas).
-- · El vídeo y el distintivo de España (E) solo los cambia el admin.
-- · Cada cambio queda en el historial (quién, cuándo, antes y después) y el admin puede deshacerlo.
-- · Los editores suben fotos a fichas/, pero no pueden borrar archivos: la foto anterior se queda
--   guardada, así que un cambio de foto siempre se puede deshacer.

-- ---------- Fichas: editar ----------
drop policy if exists "admin edita tabacos" on public.tabacos;
drop policy if exists "editor edita tabacos" on public.tabacos;
create policy "editor edita tabacos" on public.tabacos for update to authenticated
  using (public.es_editor()) with check (public.es_editor());

-- Campos que solo toca el admin (aunque la página no los enseñe, se comprueba aquí)
create or replace function public.campos_solo_admin() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.es_admin() then
    if new.id is distinct from old.id
       or new.video_id is distinct from old.video_id
       or new.en_espana is distinct from old.en_espana then
      raise exception 'Solo el administrador puede cambiar el vídeo o el distintivo de España.';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists tabacos_campos_solo_admin on public.tabacos;
create trigger tabacos_campos_solo_admin before update on public.tabacos
  for each row execute function public.campos_solo_admin();

-- ---------- Historial de cambios ----------
create table if not exists public.historial_fichas (
  id         bigint generated always as identity primary key,
  tabaco_id  text not null,
  autor      uuid,
  cuando     timestamptz not null default now(),
  accion     text not null default 'cambio' check (accion in ('cambio', 'borrado')),
  antes      jsonb not null,
  despues    jsonb
);
create index if not exists historial_fichas_cuando on public.historial_fichas (cuando desc);
create index if not exists historial_fichas_tabaco on public.historial_fichas (tabaco_id);
alter table public.historial_fichas enable row level security;

drop policy if exists "admin lee historial" on public.historial_fichas;
create policy "admin lee historial" on public.historial_fichas for select to authenticated using (public.es_admin());
drop policy if exists "admin borra historial" on public.historial_fichas;
create policy "admin borra historial" on public.historial_fichas for delete to authenticated using (public.es_admin());
grant select, delete on public.historial_fichas to authenticated;

create or replace function public.guardar_historial() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  a jsonb := to_jsonb(old) - 'actualizado' - 'actualizado_por';
  d jsonb;
begin
  if tg_op = 'DELETE' then
    insert into public.historial_fichas (tabaco_id, autor, accion, antes) values (old.id, auth.uid(), 'borrado', a);
    return old;
  end if;
  d := to_jsonb(new) - 'actualizado' - 'actualizado_por';
  if a is distinct from d then
    insert into public.historial_fichas (tabaco_id, autor, antes, despues) values (new.id, auth.uid(), a, d);
  end if;
  return new;
end $$;
drop trigger if exists tabacos_historial on public.tabacos;
create trigger tabacos_historial after update or delete on public.tabacos
  for each row execute function public.guardar_historial();

-- Para enseñar quién hizo cada cambio: el admin ya lee todos los perfiles.

-- ---------- Fotos ----------
drop policy if exists "fotos: subir admin o editor" on storage.objects;
create policy "fotos: subir admin o editor" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'fotos' and (
      public.es_admin()
      or (public.es_editor() and (storage.foldername(name))[1] = 'fichas')
      or (public.es_editor()
          and (storage.foldername(name))[1] = 'propuestas'
          and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );
