-- =====================================================================
-- 05 · Vídeo de YouTube en la ficha
-- El vídeo deja de ir en la reseña y pasa a la ficha. Solo lo puede poner el administrador
-- desde «Editar ficha» (los editores no pueden: las propuestas no llevan este campo).
-- Ejecútalo una sola vez en Supabase → SQL Editor. Se puede repetir sin romper nada.
-- =====================================================================

alter table public.tabacos add column if not exists video_id text not null default '';
alter table public.tabacos drop constraint if exists tabacos_video_valido;
alter table public.tabacos add constraint tabacos_video_valido
  check (video_id = '' or video_id ~ '^[A-Za-z0-9_-]{11}$');

-- Copia a la ficha los vídeos que ya estaban puestos en las reseñas
-- (la columna antigua de la reseña se queda como copia, pero la web ya no la usa).
update public.tabacos t set video_id = r.video_id
from public.resenas r
where r.tabaco_id = t.id and r.video_id <> '' and t.video_id = '';
