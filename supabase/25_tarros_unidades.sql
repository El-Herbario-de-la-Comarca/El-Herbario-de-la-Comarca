-- =====================================================================
-- 25 · Mi bodega: varios envases iguales en una sola fila
-- «3 latas de 50 g» se apunta una vez con cantidad 3. Los gramos son los de cada envase;
-- el total de la bodega es cantidad × gramos.
-- Ejecútalo una vez en Supabase → SQL Editor, después del 24. Se puede repetir sin romper nada.
-- =====================================================================
alter table public.tarros add column if not exists unidades integer not null default 1;
alter table public.tarros drop constraint if exists tarros_unidades_validas;
alter table public.tarros add constraint tarros_unidades_validas check (unidades between 1 and 99);

create or replace function public.tarros_sincronizar() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r record := coalesce(new, old);
  n int; g int;
begin
  if auth.uid() is null then return null; end if;   -- SQL Editor o borrado de la cuenta: no se toca la bodega
  select count(*), sum(gramos * unidades) into n, g from public.tarros where usuario = r.usuario and tabaco_id = r.tabaco_id;
  if n > 0 then
    insert into public.bodega (usuario, tabaco_id, tengo, gramos) values (r.usuario, r.tabaco_id, true, g)
      on conflict (usuario, tabaco_id) do update set tengo = true, gramos = excluded.gramos;
  else
    update public.bodega set tengo = false, gramos = null where usuario = r.usuario and tabaco_id = r.tabaco_id;
    delete from public.bodega where usuario = r.usuario and tabaco_id = r.tabaco_id and not (tengo or probado or quiero);
  end if;
  return null;
end $$;
