-- El herbario de la Comarca · Las fichas de STG vuelven a la marca Mac Baren (10/11/2026)
-- Decisión del usuario: todas las fichas de STG son mezclas de Mac Baren, que se siguen vendiendo con ese nombre.
-- Deshace el cambio de marca del SQL 27. En las descripciones cambia solo el nombre de la marca:
--   «de STG (Mac Baren)» → «de Mac Baren», «de STG» → «de Mac Baren» y quita «Marca Mac Baren.», que sobra.
-- El resto de cada descripción (incluidas las ediciones hechas desde la web) se queda como está.
-- Las otras marcas («Marca de Mac Baren, hoy de Scandinavian Tobacco Group (STG)») no se tocan: eso sigue siendo cierto.
-- Ejecútalo en Supabase → SQL Editor. Se puede repetir sin romper nada.

update public.tabacos
set marca = 'Mac Baren',
    descripcion = btrim(regexp_replace(
                    replace(replace(coalesce(descripcion, ''), 'de STG (Mac Baren)', 'de Mac Baren'), 'de STG', 'de Mac Baren'),
                    '\s*Marca Mac Baren\.', '', 'g'))
where marca = 'STG';

-- Comprobación: tiene que salir 0 en la primera columna y 37 (o las que haya) en la segunda.
select (select count(*) from public.tabacos where marca = 'STG')       as fichas_stg,
       (select count(*) from public.tabacos where marca = 'Mac Baren') as fichas_mac_baren;
