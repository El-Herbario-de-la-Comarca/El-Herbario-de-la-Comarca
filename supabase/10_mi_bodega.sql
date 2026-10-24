-- =====================================================================
-- 10 · Mi bodega
-- Cada persona registrada puede marcar un tabaco como «Lo tengo», «Lo he probado» o
-- «Quiero probarlo» (una o varias a la vez). Es privado: cada cual solo ve y cambia lo suyo;
-- ni siquiera el administrador ve la bodega de los demás.
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

create table if not exists public.bodega (
  usuario     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tabaco_id   text not null references public.tabacos (id) on delete cascade,
  tengo       boolean not null default false,
  probado     boolean not null default false,
  quiero      boolean not null default false,
  actualizado timestamptz not null default now(),
  primary key (usuario, tabaco_id)
);

-- El dueño de la fila siempre es quien escribe.
create or replace function public.bodega_control() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.usuario := auth.uid();
  if tg_op = 'UPDATE' then new.tabaco_id := old.tabaco_id; end if;
  new.actualizado := now();
  return new;
end $$;
drop trigger if exists bodega_control on public.bodega;
create trigger bodega_control before insert or update on public.bodega
  for each row execute function public.bodega_control();

alter table public.bodega enable row level security;
drop policy if exists "bodega propia: leer" on public.bodega;
create policy "bodega propia: leer" on public.bodega for select to authenticated using (usuario = auth.uid());
drop policy if exists "bodega propia: añadir" on public.bodega;
create policy "bodega propia: añadir" on public.bodega for insert to authenticated with check (usuario = auth.uid());
drop policy if exists "bodega propia: cambiar" on public.bodega;
create policy "bodega propia: cambiar" on public.bodega for update to authenticated
  using (usuario = auth.uid()) with check (usuario = auth.uid());
drop policy if exists "bodega propia: quitar" on public.bodega;
create policy "bodega propia: quitar" on public.bodega for delete to authenticated using (usuario = auth.uid());

revoke all on public.bodega from anon;
grant select, insert, update, delete on public.bodega to authenticated;
