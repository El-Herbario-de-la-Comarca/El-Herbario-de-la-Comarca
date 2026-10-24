-- =====================================================================
-- 07 · Reseñas de los usuarios
-- Cualquier persona registrada (también los lectores) puede dejar una reseña por tabaco:
-- puntuación de 1 a 5, texto opcional y el nombre con el que quiere firmar.
-- Se publican al momento. Cada cual edita o borra la suya; el administrador puede borrar cualquiera.
-- La antigua «reseña del herbario» desaparece de la web: si había alguna con puntuación,
-- se copia como reseña del administrador, firmada «El herbario».
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

create table if not exists public.opiniones (
  id          bigint generated always as identity primary key,
  tabaco_id   text not null references public.tabacos (id) on delete cascade,
  autor       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  firma       text not null check (char_length(firma) between 2 and 40),
  puntuacion  int  not null check (puntuacion between 1 and 5),
  texto       text not null default '' check (char_length(texto) <= 5000),
  creado      timestamptz not null default now(),
  actualizado timestamptz not null default now(),
  unique (tabaco_id, autor)
);
create index if not exists opiniones_tabaco on public.opiniones (tabaco_id);

-- El autor siempre es quien escribe, y al editar no se puede cambiar de tabaco ni de autor.
create or replace function public.opinion_control() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then new.autor := auth.uid(); end if;
  else
    new.autor := old.autor;
    new.tabaco_id := old.tabaco_id;
    new.creado := old.creado;
  end if;
  new.firma := btrim(new.firma);
  new.texto := btrim(new.texto);
  new.actualizado := now();
  return new;
end $$;
drop trigger if exists opiniones_control on public.opiniones;
create trigger opiniones_control before insert or update on public.opiniones
  for each row execute function public.opinion_control();

alter table public.opiniones enable row level security;
drop policy if exists "todos leen opiniones" on public.opiniones;
create policy "todos leen opiniones" on public.opiniones for select to anon, authenticated using (true);
drop policy if exists "registrados opinan" on public.opiniones;
create policy "registrados opinan" on public.opiniones for insert to authenticated
  with check (autor = auth.uid() and public.mi_rol() in ('admin', 'editor', 'lector'));
drop policy if exists "cada cual edita la suya" on public.opiniones;
create policy "cada cual edita la suya" on public.opiniones for update to authenticated
  using (autor = auth.uid()) with check (autor = auth.uid());
drop policy if exists "borra la suya o admin" on public.opiniones;
create policy "borra la suya o admin" on public.opiniones for delete to authenticated
  using (autor = auth.uid() or public.es_admin());

grant select on public.opiniones to anon, authenticated;
grant insert (tabaco_id, firma, puntuacion, texto), update (firma, puntuacion, texto), delete
  on public.opiniones to authenticated;

-- Copia las reseñas del herbario que tenían puntuación como reseñas del administrador.
insert into public.opiniones (tabaco_id, autor, firma, puntuacion, texto, creado)
select r.tabaco_id, a.id, 'El herbario', r.puntuacion,
       left(btrim(concat_ws(E'\n\n', nullif(btrim(r.titular), ''), nullif(btrim(r.texto), ''))), 5000),
       r.actualizado
from public.resenas r
cross join lateral (select id from public.perfiles where rol = 'admin' order by creado limit 1) a
where r.puntuacion between 1 and 5
on conflict (tabaco_id, autor) do nothing;
