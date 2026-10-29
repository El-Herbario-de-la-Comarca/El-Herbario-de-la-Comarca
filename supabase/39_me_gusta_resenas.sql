-- =====================================================================
-- 39 · «Me gusta» en las reseñas
-- Cualquier persona registrada puede marcar con «me gusta» la reseña de otra (no la suya propia).
-- Un voto por persona y reseña; se puede quitar volviendo a pulsar. Solo se ve el número: nadie,
-- ni siquiera el administrador, ve quién ha votado qué.
-- El número de «me gusta» de cada reseña vive en opiniones.likes y se recalcula solo.
-- Ejecútalo una sola vez en Supabase → SQL Editor, después del 07. Se puede repetir sin romper nada.
-- =====================================================================

alter table public.opiniones add column if not exists likes integer not null default 0;

create table if not exists public.me_gusta (
  opinion_id bigint not null references public.opiniones (id) on delete cascade,
  usuario    uuid   not null default auth.uid() references auth.users (id) on delete cascade,
  creado     timestamptz not null default now(),
  primary key (opinion_id, usuario)
);
create index if not exists me_gusta_opinion on public.me_gusta (opinion_id);

-- El dueño del voto siempre es quien escribe.
create or replace function public.me_gusta_control() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.usuario := auth.uid();
  return new;
end $$;
drop trigger if exists me_gusta_control on public.me_gusta;
create trigger me_gusta_control before insert on public.me_gusta
  for each row execute function public.me_gusta_control();

-- Mantiene opiniones.likes al día (suma y resta, sin contar cada vez).
create or replace function public.me_gusta_sincronizar() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.opiniones set likes = likes + 1 where id = new.opinion_id;
  else
    update public.opiniones set likes = greatest(0, likes - 1) where id = old.opinion_id;
  end if;
  return null;
end $$;
drop trigger if exists me_gusta_sincronizar on public.me_gusta;
create trigger me_gusta_sincronizar after insert or delete on public.me_gusta
  for each row execute function public.me_gusta_sincronizar();

alter table public.me_gusta enable row level security;
-- Cada cual solo ve sus propios votos (para saber qué ha marcado); el número ya está en opiniones.likes.
drop policy if exists "me gusta propios: leer" on public.me_gusta;
create policy "me gusta propios: leer" on public.me_gusta for select to authenticated using (usuario = auth.uid());
-- No se puede votar la reseña propia.
drop policy if exists "me gusta propios: añadir" on public.me_gusta;
create policy "me gusta propios: añadir" on public.me_gusta for insert to authenticated
  with check (usuario = auth.uid() and exists (
    select 1 from public.opiniones o where o.id = opinion_id and o.autor <> auth.uid()
  ));
drop policy if exists "me gusta propios: quitar" on public.me_gusta;
create policy "me gusta propios: quitar" on public.me_gusta for delete to authenticated using (usuario = auth.uid());
revoke all on public.me_gusta from anon;
grant select, insert, delete on public.me_gusta to authenticated;

-- El número de «me gusta» ya se lee con el resto de la reseña (grant del 07); por si acaso:
grant select (likes) on public.opiniones to anon, authenticated;
