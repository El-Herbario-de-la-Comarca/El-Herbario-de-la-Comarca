-- =====================================================================
-- 04 · Estilo y hojas
-- Separa el antiguo "tipo" en dos datos:
--   · Estilo (se sigue guardando en la columna "tipo"): Inglés, Oriental, Virginia,
--     Virginia-Perique, Burley, Americano, Aromático o Componente.
--   · Hojas (columna nueva "hojas"): Virginia, Burley, Oriental, Latakia, Perique,
--     Kentucky, Cavendish, Cigarro.
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

alter table public.tabacos add column if not exists hojas text[] not null default '{}';
alter table public.tabacos drop constraint if exists tabacos_hojas_validas;
alter table public.tabacos add constraint tabacos_hojas_validas check (
  hojas <@ array['Virginia','Burley','Oriental','Latakia','Perique','Kentucky','Cavendish','Cigarro']::text[]
);

-- Las propuestas de los editores también pueden traer hojas.
create or replace function public.aprobar_propuesta(p_id bigint) returns text
language plpgsql security definer set search_path = public as $$
declare
  p public.propuestas;
  d jsonb;
  res text;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede aprobar propuestas';
  end if;
  select * into p from public.propuestas where id = p_id for update;
  if not found or p.estado <> 'pendiente' then
    raise exception 'La propuesta no existe o ya está revisada';
  end if;
  d := p.datos;
  if p.tipo = 'nueva' then
    insert into public.tabacos (nombre, marca, pais, tipo, hojas, corte, formato, descripcion, fuerza, notas, foto)
    values (
      coalesce(d->>'nombre', ''), coalesce(d->>'marca', ''), coalesce(d->>'pais', ''),
      coalesce(d->>'tipo', ''),
      coalesce(array(select jsonb_array_elements_text(d->'hojas')), '{}'),
      coalesce(d->>'corte', ''), coalesce(d->>'formato', ''),
      coalesce(d->>'descripcion', ''), coalesce((d->>'fuerza')::int, 0),
      coalesce(array(select jsonb_array_elements_text(d->'notas')), '{}'),
      coalesce(d->>'foto', '')
    ) returning id into res;
  elsif p.tipo = 'cambio' then
    update public.tabacos set
      nombre      = coalesce(d->>'nombre', nombre),
      marca       = coalesce(d->>'marca', marca),
      pais        = coalesce(d->>'pais', pais),
      tipo        = coalesce(d->>'tipo', tipo),
      hojas       = case when d ? 'hojas' then array(select jsonb_array_elements_text(d->'hojas')) else hojas end,
      corte       = coalesce(d->>'corte', corte),
      formato     = coalesce(d->>'formato', formato),
      descripcion = coalesce(d->>'descripcion', descripcion),
      fuerza      = coalesce((d->>'fuerza')::int, fuerza),
      notas       = case when d ? 'notas' then array(select jsonb_array_elements_text(d->'notas')) else notas end
    where id = p.tabaco_id;
    res := p.tabaco_id;
  else
    update public.tabacos set foto = coalesce(d->>'foto', foto) where id = p.tabaco_id;
    res := p.tabaco_id;
  end if;
  update public.propuestas set estado = 'aprobada', revisado_por = auth.uid(), revisado = now() where id = p_id;
  return res;
end $$;

-- ---------------------------------------------------------------------
-- Reclasificación de las fichas: estilo y hojas de cada una.
-- (Se rellena con los datos de fabricante y tiendas.)
-- ---------------------------------------------------------------------
