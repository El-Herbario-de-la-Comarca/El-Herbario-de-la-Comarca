-- =====================================================================
-- El herbario de la Comarca · 35_aviso_registro.sql
-- Envía un correo al administrador cada vez que se registra un usuario.
--
-- Antes de ejecutar este archivo, guarda una sola vez en Vault la clave
-- de Resend y tu correo (ver la guía). Este archivo NO contiene claves,
-- así que se puede subir a GitHub sin problema.
-- =====================================================================

-- Extensión para hacer peticiones web desde la base de datos
create extension if not exists pg_net with schema extensions;

create or replace function public.avisar_registro()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  clave   text;
  destino text;
  fecha   text;
begin
  select decrypted_secret into clave
    from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  select decrypted_secret into destino
    from vault.decrypted_secrets where name = 'aviso_registro_correo' limit 1;

  -- Si falta algún dato, no se envía nada (el registro sigue normal)
  if clave is null or destino is null then
    return new;
  end if;

  fecha := to_char(coalesce(new.created_at, now()) at time zone 'Europe/Madrid',
                   'DD/MM/YYYY "a las" HH24:MI');

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
                 'Authorization', 'Bearer ' || clave,
                 'Content-Type',  'application/json'),
    body    := jsonb_build_object(
                 'from',    'El herbario de la Comarca <onboarding@resend.dev>',
                 'to',      jsonb_build_array(destino),
                 'subject', 'Nuevo usuario en el herbario: ' || coalesce(new.email, '(sin correo)'),
                 'html',    '<p>Se ha registrado un usuario nuevo en <b>El herbario de la Comarca</b>.</p>'
                         || '<p><b>Correo:</b> ' || coalesce(new.email, '(sin correo)') || '<br>'
                         || '<b>Fecha:</b> ' || fecha || '</p>'
                         || '<p>Entra con tu cuenta de administrador si quieres cambiarle el rol.</p>')
  );

  return new;
exception when others then
  -- Un fallo del aviso nunca debe impedir que alguien se registre
  return new;
end;
$$;

revoke all on function public.avisar_registro() from public, anon, authenticated;

drop trigger if exists al_registrarse_avisar on auth.users;
create trigger al_registrarse_avisar
  after insert on auth.users
  for each row execute function public.avisar_registro();
