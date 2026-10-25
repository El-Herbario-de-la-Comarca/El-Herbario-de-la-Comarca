-- =====================================================================
-- 16 · Se vende en España
-- Nueva columna «en_espana»: en la ficha aparece un circulito con los colores de la bandera y
-- una E. Se puede marcar o quitar desde «Editar ficha» (y los editores pueden proponerlo).
-- Fuente: lista oficial de precios de picadura de pipa del Comisionado para el Mercado de Tabacos,
-- Península y Baleares, 1 de octubre de 2026 (última resolución: 26-09-2026).
-- Solo se marcan las coincidencias seguras (154 fichas). Ver marcas/en_espana.md.
-- Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================
alter table public.tabacos add column if not exists en_espana boolean not null default false;

-- Las propuestas de los editores también pueden traer «se vende en España».
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
    insert into public.tabacos (nombre, marca, pais, tipo, hojas, corte, formato, descripcion, fuerza, notas, foto, en_espana)
    values (
      coalesce(d->>'nombre', ''), coalesce(d->>'marca', ''), coalesce(d->>'pais', ''),
      coalesce(d->>'tipo', ''),
      coalesce(array(select jsonb_array_elements_text(d->'hojas')), '{}'),
      coalesce(d->>'corte', ''), coalesce(d->>'formato', ''),
      coalesce(d->>'descripcion', ''), coalesce((d->>'fuerza')::int, 0),
      coalesce(array(select jsonb_array_elements_text(d->'notas')), '{}'),
      coalesce(d->>'foto', ''),
      coalesce((d->>'en_espana')::boolean, false)
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
      notas       = case when d ? 'notas' then array(select jsonb_array_elements_text(d->'notas')) else notas end,
      en_espana   = coalesce((d->>'en_espana')::boolean, en_espana)
    where id = p.tabaco_id;
    res := p.tabaco_id;
  else
    update public.tabacos set foto = coalesce(d->>'foto', foto) where id = p.tabaco_id;
    res := p.tabaco_id;
  end if;
  update public.propuestas set estado = 'aprobada', revisado_por = auth.uid(), revisado = now() where id = p_id;
  return res;
end $$;

-- Fichas que aparecen en la lista oficial
update public.tabacos set en_espana = true
where id in ('1', '4', '7', '9', '15', '18', '23', '26', '27', '30', '35', '36', '37', '39', '44', '45', '46', '47', '49', '50', '51', '57', '58', '59', '65', '70', '75', '79', '112', '157', '162', '210', '214', '223', '229', '253', '256', '262', '268', '269', '270', '271', '282', '284', '286', '295', '333', '336', '347', '348', '349', '350', '353', '354', '355', '357', '358', '360', '377', '391', '393', '397', '400', '410', '411', '412', '413', '414', '415', '420', '421', '422', '1002', '1003', '1004', '1006', '1010', '1011', '1014', '1015', '1016', '1019', '1025', '1029', '1030', '1034', '1039', '1041', '1043', '1044', '1046', '1048', '1056', '1057', '1060', '1062', '1075', '1076', '1077', '1078', '1079', '1080', '1081', '1082', '1083', '1084', '1085', '1087', '1091', '1092', '1093', '1094', '1121', '1122', '1140', '1142', '1148', '1151', '1152', '1153', '1154', '1155', '1157', '1160', '1161', '1167', '1226', '2043', '2044', '2045', '2046', '2047', '2048', '2049', '2050', '2052', '2060', '2061', '2062', '2063', '2064', '2065', '2078', '2087', '2088', '2089', '2090', '2091', '2092', '2099', '2105', '2126', '2128', '2132');
