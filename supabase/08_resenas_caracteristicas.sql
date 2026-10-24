-- =====================================================================
-- 08 · Características en las reseñas
-- Cada reseña puede indicar (todas opcionales, 0 = sin indicar):
--   fuerza        1 Muy suave … 7 Muy fuerte
--   sabor         intensidad de sabor, 1 Muy suave … 7 Muy intensa
--   aromatizante  1 Ninguno … 6 Muy fuerte
--   nota_hab      nota de habitación, 1 Imperceptible … 5 Muy agradable
-- La fuerza deja de ponerse en la ficha: sale de las reseñas.
-- Ejecútalo después del 07. Se puede repetir sin romper nada.
-- =====================================================================

alter table public.opiniones add column if not exists fuerza       int not null default 0;
alter table public.opiniones add column if not exists sabor        int not null default 0;
alter table public.opiniones add column if not exists aromatizante int not null default 0;
alter table public.opiniones add column if not exists nota_hab     int not null default 0;

alter table public.opiniones drop constraint if exists opiniones_caracteristicas;
alter table public.opiniones add constraint opiniones_caracteristicas check (
  fuerza between 0 and 7 and sabor between 0 and 7 and aromatizante between 0 and 6 and nota_hab between 0 and 5
);

grant insert (fuerza, sabor, aromatizante, nota_hab), update (fuerza, sabor, aromatizante, nota_hab)
  on public.opiniones to authenticated;
