-- El herbario de la Comarca · Los editores crean y editan fichas directamente (26/10/2026)
-- Ejecútalo en Supabase → SQL Editor. Se puede ejecutar más de una vez
-- (si ya ejecutaste una versión anterior de este archivo, vuelve a ejecutarlo).
--
-- · Editores y admin crean fichas y cambian todo lo de la ficha (vídeo y distintivo de España incluidos)
--   y sus fotos, sin pasar por la revisión.
-- · Borrar fichas sigue siendo solo del admin.
-- · Cada alta, cambio o borrado queda en el historial (quién, cuándo, antes y después)
--   y el admin puede deshacerlo.
-- · Los editores suben fotos a fichas/, pero no pueden borrar archivos: la foto anterior se queda
--   guardada, así que un cambio de foto siempre se puede deshacer.

-- ---------- Fichas: crear y editar ----------
drop policy if exists "admin crea tabacos" on public.tabacos;
drop policy if exists "editor crea tabacos" on public.tabacos;
create policy "editor crea tabacos" on public.tabacos for insert to authenticated with check (public.es_editor());

drop policy if exists "admin edita tabacos" on public.tabacos;
drop policy if exists "editor edita tabacos" on public.tabacos;
create policy "editor edita tabacos" on public.tabacos for update to authenticated
  using (public.es_editor()) with check (public.es_editor());

-- (Una versión anterior de este archivo reservaba el vídeo y la E al admin: se quita.)
drop trigger if exists tabacos_campos_solo_admin on public.tabacos;
drop function if exists public.campos_solo_admin();

-- ---------- Historial de cambios ----------
create table if not exists public.historial_fichas (
  id         bigint generated always as identity primary key,
  tabaco_id  text not null,
  autor      uuid,
  cuando     timestamptz not null default now(),
  accion     text not null default 'cambio',
  antes      jsonb,
  despues    jsonb
);
alter table public.historial_fichas alter column antes drop not null;
alter table public.historial_fichas drop constraint if exists historial_fichas_accion_check;
alter table public.historial_fichas add constraint historial_fichas_accion_check
  check (accion in ('alta', 'cambio', 'borrado'));
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
  a jsonb;
  d jsonb;
begin
  if tg_op = 'INSERT' then
    insert into public.historial_fichas (tabaco_id, autor, accion, despues)
    values (new.id, auth.uid(), 'alta', to_jsonb(new) - 'actualizado' - 'actualizado_por');
    return new;
  end if;
  a := to_jsonb(old) - 'actualizado' - 'actualizado_por';
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
create trigger tabacos_historial after insert or update or delete on public.tabacos
  for each row execute function public.guardar_historial();

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
