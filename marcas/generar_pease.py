"""Aplica marcas/datos_pease.py a datos-iniciales.js y genera supabase/45_gl_pease_fichas.sql.
Uso: python3 marcas/generar_pease.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from datos_pease import DATOS, HOJAS, TIPO

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(RAIZ, 'datos-iniciales.js')
SQL = os.path.join(RAIZ, 'supabase', '45_gl_pease_fichas.sql')

s = open(JS, encoding='utf-8').read()
ini, fin = s.index('['), s.rindex(']') + 1
datos = json.loads(s[ini:fin])
por_id = {x['id']: x for x in datos}

def formatos(f):
    partes = [p.strip() for p in f.split('·') if p.strip()]
    if not partes:
        return ''
    if len(partes) == 1:
        return f' Formato: {partes[0]}.'
    return ' Formatos: ' + ', '.join(partes[:-1]) + ' y ' + partes[-1] + '.'

def q(t):
    return "'" + t.replace("'", "''") + "'"

desc, cortes, notas = [], [], []
for i, (corte, texto, ns) in sorted(DATOS.items()):
    x = por_id[i]
    assert x['marca'] == 'G. L. Pease', i
    nueva = texto + formatos(x['formato'])
    vieja = x['descripcion']
    if vieja != nueva:
        desc.append((i, vieja, nueva))
    x['descripcion'] = x['desc'] = nueva
    if corte:
        assert not x['corte'], (i, x['corte'])
        cortes.append((i, corte))
        x['corte'] = corte
    if ns:
        notas.append((i, ns))
        if not x['notas']:
            x['notas'] = ns
for i, h in HOJAS.items():
    if not por_id[i]['hojas']:
        por_id[i]['hojas'] = h
for i, (antes, despues) in TIPO.items():
    if por_id[i]['tipo'] == antes:
        por_id[i]['tipo'] = despues

open(JS, 'w', encoding='utf-8').write(s[:ini] + json.dumps(datos, ensure_ascii=False) + s[fin:])

ids = ','.join(q(str(i)) for i in sorted(DATOS))
L = [
 '-- El herbario de la Comarca · G. L. Pease: descripciones, cortes y notas de sabor (47 fichas)',
 '-- Fuentes: glpease.com/CompleteList y fichas de smokingpipes.com (leídas el 4/11/2026), resumidas con palabras propias.',
 '-- Ejecútalo en Supabase → SQL Editor. Es seguro repetirlo: la descripción solo cambia si sigue siendo la automática,',
 '-- el corte solo si está vacío y las notas solo si la ficha no tiene ninguna. Lo editado a mano no se pisa.',
 '',
 'update public.tabacos t set descripcion = v.nueva',
 'from (values',
 ',\n'.join(f'({q(str(i))},{q(a)},{q(b)})' for i, a, b in desc),
 ') as v(id, vieja, nueva)',
 'where t.id = v.id and t.descripcion = v.vieja;',
 '',
 "update public.tabacos t set corte = v.corte",
 'from (values',
 ',\n'.join(f'({q(str(i))},{q(c)})' for i, c in cortes),
 ') as v(id, corte)',
 "where t.id = v.id and t.corte = '';",
 '',
 'update public.tabacos t set notas = v.notas',
 'from (values',
 ',\n'.join(f"({q(str(i))},array[{', '.join(q(n) for n in ns)}]::text[])" for i, ns in notas),
 ') as v(id, notas)',
 'where t.id = v.id and cardinality(t.notas) = 0;',
 '',
]
for i, h in HOJAS.items():
    L.append(f"update public.tabacos set hojas = array[{', '.join(q(x) for x in h)}]::text[] where id = {q(str(i))} and cardinality(hojas) = 0;")
for i, (a, b) in TIPO.items():
    L.append(f"update public.tabacos set tipo = {q(b)} where id = {q(str(i))} and tipo = {q(a)};")
L += ['',
 f'-- Comprobación: debería devolver 47, 0 y {len(notas)}',
 "select count(*) filter (where descripcion not like '%es una mezcla%de G. L. Pease%') as con_descripcion_nueva,",
 "       count(*) filter (where corte = '') as sin_corte,",
 '       count(*) filter (where cardinality(notas) > 0) as con_notas',
 f"from public.tabacos where id in ({ids});", '']
open(SQL, 'w', encoding='utf-8').write('\n'.join(L))
print(len(desc), 'descripciones,', len(cortes), 'cortes,', len(notas), 'con notas')
