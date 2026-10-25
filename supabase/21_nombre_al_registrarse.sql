-- =====================================================================
-- 21 · Nombre público al crear la cuenta
-- Al registrarse se pide un nombre público; aquí se guarda en el perfil automáticamente.
-- Necesita el 13 (columna «nombre»). Ejecútalo una vez en Supabase → SQL Editor. Se puede repetir.
-- =====================================================================
create or replace function public.nuevo_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (new.id, new.email, left(btrim(coalesce(new.raw_user_meta_data->>'nombre', '')), 40))
  on conflict (id) do nothing;
  return new;
end $$;
