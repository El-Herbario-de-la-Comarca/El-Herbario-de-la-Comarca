-- 59 · Límites más altos para «Identificar por foto» mientras duren los créditos gratis de Google Cloud.
-- Hasta el 31 de enero de 2027: 30 fotos al día por usuario, 300 al día en total y 9.000 al mes
-- (como mucho unos 12 $ al mes, que se pagan con los créditos).
-- Desde el 1 de febrero de 2027 vuelven solos los límites del cupo gratis: 10, 30 y 950.
-- Para cambiar la fecha o los números, editar las tres líneas marcadas y volver a ejecutar.

create or replace function public.gastar_lectura_foto()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  yo        uuid := auth.uid();
  hoy       date := (now() at time zone 'Europe/Madrid')::date;
  creditos  boolean := hoy < date '2027-02-01';                 -- ← fin de los créditos
  lim_usu   int := case when creditos then 30   else 10  end;   -- ← por usuario y día
  lim_dia   int := case when creditos then 300  else 30  end;   -- ← total al día
  lim_mes   int := case when creditos then 9000 else 950 end;   -- ← total al mes
  mio       int;
  total_dia int;
  total_mes int;
begin
  if yo is null then
    return 'sin_cuenta';
  end if;

  perform pg_advisory_xact_lock(hashtext('lecturas_foto'));

  select coalesce(sum(n), 0) into total_mes from lecturas_foto where dia >= date_trunc('month', hoy)::date;
  select coalesce(sum(n), 0) into total_dia from lecturas_foto where dia = hoy;
  select n into mio from lecturas_foto where usuario = yo and dia = hoy;
  mio := coalesce(mio, 0);

  if total_mes >= lim_mes then return 'tope_mes'; end if;
  if total_dia >= lim_dia then return 'tope_dia'; end if;
  if mio >= lim_usu       then return 'tope_usuario'; end if;

  insert into lecturas_foto (usuario, dia, n) values (yo, hoy, 1)
  on conflict (usuario, dia) do update set n = lecturas_foto.n + 1;

  return 'ok';
end;
$$;

revoke all on function public.gastar_lectura_foto() from public, anon;
grant execute on function public.gastar_lectura_foto() to authenticated;
