-- 58 · Contador de fotos leídas con Google Cloud Vision («Identificar por foto»).
-- Lo usa la función leer-etiqueta antes de enviar cada foto a Google.
-- Límites: 10 fotos al día por usuario, 30 al día en total y 950 al mes (el cupo gratis de Google es 1.000).

create table if not exists public.lecturas_foto (
  usuario uuid not null references auth.users(id) on delete cascade,
  dia     date not null,
  n       int  not null default 0,
  primary key (usuario, dia)
);

-- Seguridad activada y sin políticas: nadie la lee ni la escribe directamente desde la web.
alter table public.lecturas_foto enable row level security;

-- Apunta una foto al usuario que ha entrado y dice si puede hacerse.
-- Devuelve: 'ok', 'sin_cuenta', 'tope_usuario', 'tope_dia' o 'tope_mes'.
create or replace function public.gastar_lectura_foto()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  yo        uuid := auth.uid();
  hoy       date := (now() at time zone 'Europe/Madrid')::date;
  mio       int;
  total_dia int;
  total_mes int;
begin
  if yo is null then
    return 'sin_cuenta';
  end if;

  -- Una petición cada vez, para que dos fotos a la vez no se salten el límite.
  perform pg_advisory_xact_lock(hashtext('lecturas_foto'));

  select coalesce(sum(n), 0) into total_mes from lecturas_foto where dia >= date_trunc('month', hoy)::date;
  select coalesce(sum(n), 0) into total_dia from lecturas_foto where dia = hoy;
  select n into mio from lecturas_foto where usuario = yo and dia = hoy;
  mio := coalesce(mio, 0);

  if total_mes >= 950 then return 'tope_mes'; end if;
  if total_dia >= 30  then return 'tope_dia'; end if;
  if mio >= 10        then return 'tope_usuario'; end if;

  insert into lecturas_foto (usuario, dia, n) values (yo, hoy, 1)
  on conflict (usuario, dia) do update set n = lecturas_foto.n + 1;

  return 'ok';
end;
$$;

revoke all on function public.gastar_lectura_foto() from public, anon;
grant execute on function public.gastar_lectura_foto() to authenticated;
