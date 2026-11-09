-- 63 · Quitar el correo al administrador cada vez que se registra alguien (SQL 35).
-- Los registros nuevos ya se ven en la web (contador de «Usuarios nuevos» del administrador),
-- así se ahorran envíos de Resend.
-- Los secretos de Vault (resend_api_key y aviso_registro_correo) NO se borran:
-- los usa el SQL 62 para los avisos de error y las sugerencias de los lectores.

drop trigger if exists al_registrarse_avisar on auth.users;
drop function if exists public.avisar_registro();
