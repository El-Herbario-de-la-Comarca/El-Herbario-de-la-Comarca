-- =====================================================================
-- 24 · Mi bodega: tarros y latas
-- Cada tabaco de la bodega puede tener varios envases (lata cerrada, tarro de cristal o bolsa),
-- cada uno con sus gramos, su fecha (de embotado, de compra o la impresa en la lata), la fecha en
-- que se abrió y una nota corta. Todo es opcional salvo el envase.
-- «Lo tengo» y los gramos de la tabla bodega se calculan solos a partir de los tarros.
-- Los gramos que ya hubiera apuntados pasan a un primer envase sin fecha, para no perder nada.
-- Ejecútalo una vez en Supabase → SQL Editor, después del 10 y el 15. Se puede repetir sin romper nada.
-- =====================================================================
create table if not exists public.tarros (
  id           bigint generated always as identity primary key,
  usuario      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tabaco_id    text not null references public.tabacos (id) on delete cascade,
  envase       text not null default '' check (envase in ('', 'lata', 'tarro', 'bolsa')),
  gramos       integer check (gramos is null or gramos between 1 and 100000),
  tipo_fecha   text not null default 'embotado' check (tipo_fecha in ('embotado', 'compra', 'lata')),
  fecha_anio   integer check (fecha_anio is null or fecha_anio between 1900 and 2100),
  fecha_mes    integer check (fecha_mes is null or (fecha_mes between 1 and 12 and fecha_anio is not null)),
  abierto_anio integer check (abierto_anio is null or abierto_anio between 1900 and 2100),
  abierto_mes  integer check (abierto_mes is null or (abierto_mes between 1 and 12 and abierto_anio is not null)),
  nota         text not null default '' check (char_length(nota) <= 80),
  creado       timestamptz not null default now()
);
create index if not exists tarros_usuario_tabaco on public.tarros (usuario, tabaco_id);

-- Cada cual solo toca sus tarros; el tabaco de un tarro no se cambia.
create or replace function public.tarros_control() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then new.usuario := auth.uid(); end if;
  if tg_op = 'UPDATE' then new.tabaco_id := old.tabaco_id; end if;
  return new;
end $$;
drop trigger if exists tarros_control on public.tarros;
create trigger tarros_control before insert or update on public.tarros
  for each row execute function public.tarros_control();

-- Mantiene «Lo tengo» y los gramos de la bodega al día con los tarros.
create or replace function public.tarros_sincronizar() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r record := coalesce(new, old);
  n int; g int;
begin
  if auth.uid() is null then return null; end if;   -- SQL Editor o borrado de la cuenta: no se toca la bodega
  select count(*), sum(gramos) into n, g from public.tarros where usuario = r.usuario and tabaco_id = r.tabaco_id;
  if n > 0 then
    insert into public.bodega (usuario, tabaco_id, tengo, gramos) values (r.usuario, r.tabaco_id, true, g)
      on conflict (usuario, tabaco_id) do update set tengo = true, gramos = excluded.gramos;
  else
    update public.bodega set tengo = false, gramos = null where usuario = r.usuario and tabaco_id = r.tabaco_id;
    delete from public.bodega where usuario = r.usuario and tabaco_id = r.tabaco_id and not (tengo or probado or quiero);
  end if;
  return null;
end $$;
drop trigger if exists tarros_sincronizar on public.tarros;
create trigger tarros_sincronizar after insert or update or delete on public.tarros
  for each row execute function public.tarros_sincronizar();

alter table public.tarros enable row level security;
drop policy if exists "tarros propios: leer" on public.tarros;
create policy "tarros propios: leer" on public.tarros for select to authenticated using (usuario = auth.uid());
drop policy if exists "tarros propios: añadir" on public.tarros;
create policy "tarros propios: añadir" on public.tarros for insert to authenticated with check (usuario = auth.uid());
drop policy if exists "tarros propios: cambiar" on public.tarros;
create policy "tarros propios: cambiar" on public.tarros for update to authenticated
  using (usuario = auth.uid()) with check (usuario = auth.uid());
drop policy if exists "tarros propios: quitar" on public.tarros;
create policy "tarros propios: quitar" on public.tarros for delete to authenticated using (usuario = auth.uid());
revoke all on public.tarros from anon;
grant select, insert, update, delete on public.tarros to authenticated;

-- Los gramos ya apuntados pasan a un primer envase sin fecha (solo si ese tabaco aún no tiene tarros).
insert into public.tarros (usuario, tabaco_id, gramos)
select b.usuario, b.tabaco_id, b.gramos from public.bodega b
where b.tengo and b.gramos is not null
  and not exists (select 1 from public.tarros t where t.usuario = b.usuario and t.tabaco_id = b.tabaco_id);
