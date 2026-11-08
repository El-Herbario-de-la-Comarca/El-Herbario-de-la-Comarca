-- =====================================================================
-- El herbario de la Comarca · 62_avisos_lectores.sql
-- «Avisar de un error» (en cada ficha) y «Sugerir un tabaco» (en el catálogo).
-- Los mensajes se guardan en la tabla avisos y llegan por correo al
-- administrador (Resend, con la misma clave y el mismo correo de destino
-- que el aviso de registro del SQL 35). El correo lleva «Responder a» con
-- la dirección de quien lo envía, para poder contestarle desde Gmail.
--
-- Solo pueden enviar mensajes los usuarios con cuenta (cualquier rol).
-- Límite: 10 mensajes al día por usuario.
-- Este archivo NO contiene claves: se puede subir a GitHub.
-- =====================================================================

create extension if not exists pg_net with schema extensions;

create table if not exists public.avisos (
  id           bigserial primary key,
  tipo         text not null check (tipo in ('error', 'sugerencia')),
  ficha_id     text,
  ficha_nombre text,
  mensaje      text not null check (char_length(mensaje) between 5 and 2000),
  autor        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  creado       timestamptz not null default now()
);

alter table public.avisos enable row level security;

drop policy if exists "avisos: enviar con cuenta" on public.avisos;
create policy "avisos: enviar con cuenta" on public.avisos
  for insert to authenticated
  with check (autor = auth.uid());

drop policy if exists "avisos: los lee el admin" on public.avisos;
create policy "avisos: los lee el admin" on public.avisos
  for select to authenticated
  using (public.es_admin());

drop policy if exists "avisos: los borra el admin" on public.avisos;
create policy "avisos: los borra el admin" on public.avisos
  for delete to authenticated
  using (public.es_admin());

grant insert on public.avisos to authenticated;
grant select, delete on public.avisos to authenticated;
grant usage on sequence public.avisos_id_seq to authenticated;

-- Límite diario (antes de guardar)
create or replace function public.avisos_limite()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.avisos
       where autor = new.autor and creado > now() - interval '1 day') >= 10 then
    raise exception 'limite_avisos' using errcode = 'P0001';
  end if;
  new.creado := now();
  return new;
end;
$$;

drop trigger if exists avisos_antes on public.avisos;
create trigger avisos_antes
  before insert on public.avisos
  for each row execute function public.avisos_limite();

-- Correo al administrador (después de guardar)
create or replace function public.avisos_correo()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  clave   text;
  destino text;
  remite  text;
  asunto  text;
  enlace  text;
  texto   text;
begin
  select decrypted_secret into clave
    from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  select decrypted_secret into destino
    from vault.decrypted_secrets where name = 'aviso_registro_correo' limit 1;
  if clave is null or destino is null then
    return new;
  end if;

  select email into remite from auth.users where id = new.autor;

  -- El mensaje se escapa para que no se pueda meter HTML en el correo
  texto := replace(replace(replace(new.mensaje, '&', '&amp;'), '<', '&lt;'), '>', '&gt;');
  texto := replace(texto, E'\n', '<br>');

  if new.tipo = 'error' then
    asunto := 'Error en una ficha: ' || coalesce(new.ficha_nombre, new.ficha_id, '(sin ficha)');
    enlace := '<p><b>Ficha:</b> <a href="https://elherbariodelacomarca.es/index.html#/ficha/'
           || coalesce(new.ficha_id, '') || '">'
           || replace(replace(coalesce(new.ficha_nombre, new.ficha_id, ''), '<', '&lt;'), '>', '&gt;')
           || '</a></p>';
  else
    asunto := 'Sugerencia de tabaco en el herbario';
    enlace := '';
  end if;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
                 'Authorization', 'Bearer ' || clave,
                 'Content-Type',  'application/json'),
    body    := jsonb_build_object(
                 'from',     'El herbario de la Comarca <no-responde@elherbariodelacomarca.es>',
                 'to',       jsonb_build_array(destino),
                 'reply_to', coalesce(remite, destino),
                 'subject',  asunto,
                 'html',     '<p>Mensaje de un usuario de <b>El herbario de la Comarca</b>.</p>'
                          || enlace
                          || '<p><b>De:</b> ' || coalesce(remite, '(sin correo)') || '</p>'
                          || '<blockquote style="border-left:3px solid #8a6d3b;margin:0;padding:4px 12px">'
                          || texto || '</blockquote>'
                          || '<p style="color:#777">Pulsa «Responder» para contestarle.</p>')
  );
  return new;
exception when others then
  -- Si falla el correo, el mensaje se queda guardado en la tabla avisos
  return new;
end;
$$;

revoke all on function public.avisos_correo() from public, anon, authenticated;
revoke all on function public.avisos_limite() from public, anon, authenticated;

drop trigger if exists avisos_despues on public.avisos;
create trigger avisos_despues
  after insert on public.avisos
  for each row execute function public.avisos_correo();
