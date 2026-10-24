-- =====================================================================
-- 06 · Contador de visitas
-- Guarda solo cuántas visitas llegan de cada país (código de 2 letras sacado de la zona
-- horaria del navegador). No se guarda la IP ni nada que identifique a nadie.
-- Una visita = una sesión del navegador (recargar o abrir fichas no cuenta de nuevo).
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

create table if not exists public.visitas (
  pais    text primary key check (pais ~ '^[A-Z]{2}$' or pais = '??'),
  visitas bigint not null default 0
);
alter table public.visitas enable row level security;
-- Nadie lee ni escribe la tabla directamente: solo a través de la función de abajo.
revoke all on public.visitas from anon, authenticated;

-- Suma una visita (si p_contar) y devuelve el total y el número de países.
create or replace function public.registrar_visita(p_pais text, p_contar boolean default true)
returns json
language plpgsql security definer set search_path = public as $$
declare
  cc text := upper(coalesce(p_pais, ''));
  res json;
begin
  if cc !~ '^[A-Z]{2}$' then cc := '??'; end if;
  if p_contar then
    insert into public.visitas (pais, visitas) values (cc, 1)
    on conflict (pais) do update set visitas = public.visitas.visitas + 1;
  end if;
  select json_build_object(
    'total',  coalesce(sum(visitas), 0),
    'paises', count(*) filter (where pais <> '??')
  ) into res from public.visitas;
  return res;
end $$;

revoke all on function public.registrar_visita(text, boolean) from public;
grant execute on function public.registrar_visita(text, boolean) to anon, authenticated;
