-- El herbario de la Comarca · G. L. Pease: descripciones, cortes y notas de sabor (47 fichas)
-- Fuentes: glpease.com/CompleteList y fichas de smokingpipes.com (leídas el 4/11/2026), resumidas con palabras propias.
-- Ejecútalo en Supabase → SQL Editor. Es seguro repetirlo: la descripción solo cambia si sigue siendo la automática,
-- el corte solo si está vacío y las notas solo si la ficha no tiene ninguna. Lo editado a mano no se pisa.

update public.tabacos t set descripcion = v.nueva
from (values
('224','Abingdon es una mezcla de estilo inglés de G. L. Pease, cortado en tiras finas (ribbon). Lleva Virginia, latakia y orientales. Formatos: 57 g y 227 g.','La más plena de las balcánicas de la casa, con una generosa proporción de Latakia de Chipre. Una mezcla de carácter fuerte y decidido que, aun así, conserva un acabado pulido y elegante. Pertenece a la Classic Collection. Formatos: 57 g y 227 g.'),
('225','Ashbury es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla de varios orientales con abundante Virginia, desde el amarillo pálido hasta el rojo oscuro, y la Latakia de Chipre justa para darle un fondo ahumado. Forma parte de la Fog City Selection, dedicada a los barrios de San Francisco. Formatos: 57 g y 227 g.'),
('226','Bankside es una mezcla de la familia Virginia de G. L. Pease, prensado y cortado en láminas (flake). Formato: 57 g.','Virginias con algo de Burley, un rastro muy leve de Latakia de Chipre y Perique de Luisiana auténtico, prensados y cortados en láminas. Es una de las mezclas de la Zeitgeist Collection. Formato: 57 g.'),
('227','Barbary Coast es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Burley cortado en cubos, Virginia rojo madurado y Perique de Luisiana, con un toque de brandy y un proceso especial para que el acabado sea suave. Las fuentes hablan de notas de nuez negra, chocolate negro y fruta seca, en una fumada rica y llena. De la Original Series. Formatos: 57 g y 227 g.'),
('228','Blackpoint es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla inglesa de varios Virginias rojos y brillantes, orientales selectos y Latakia de Chipre, con una pizca de Perique que aporta un ligero picor. Pertenece a la Classic Collection. Formatos: 57 g y 227 g.'),
('229','Cairo es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla de Virginia y orientales, sin Latakia, con un poco de Perique. Es de dulzor natural, con un punto suave de especia y de frutos secos y notas que recuerdan a los cítricos; cuerpo medio y aroma delicado. De la Original Series. Formatos: 57 g y 227 g.'),
('230','Caravan es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','La Latakia de Chipre da un carácter de cuero a una buena proporción de orientales turcos y griegos y de Virginias del Nuevo Mundo, con algo de Burley. El humo es rico sin resultar pesado y deja un final largo. De la Original Series. Formatos: 57 g y 227 g.'),
('231','Charing Cross es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla balcánica tradicional, bien sazonada con Latakia, sobre Virginias y orientales. Es más ligera y menos densa que Abingdon. Pertenece a la Classic Collection. Formatos: 57 g y 227 g.'),
('232','Chelsea Morning es una mezcla de estilo inglés de G. L. Pease, en láminas desmenuzadas (broken flake). Lleva Virginia, latakia, perique y orientales. Formatos: 57 g y 227 g.','Mezcla de corte clásico con Virginias brillantes y rojos, orientales, un susurro de Latakia de Chipre y un toque de Perique. De la Old London Series. Formatos: 57 g y 227 g.'),
('233','Cumberland es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla americana robusta construida sobre un Kentucky curado al fuego, raro y envejecido, acompañado de Virginias y una pizca de Perique de Luisiana. Pide fumarse despacio y deja sabores largos y armoniosos. De la Original Series. Formatos: 57 g y 227 g.'),
('234','Ellipsis Flake es una mezcla de la familia Virginia de G. L. Pease, prensado y cortado en láminas (flake). Formato: 57 g.','Virginias y orientales prensados y envejecidos en tortas, que después se cortan en láminas y se envasan. La casa la describe como rica y llena de matices. Es de la Zeitgeist Collection. Formato: 57 g.'),
('235','Embarcadero es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Láminas cortadas y después desmenuzadas de Virginias rojos maduros y hoja turca de Esmirna. Una mezcla rica y compleja, de sabor y aroma agradables. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('236','Fillmore es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Láminas desmenuzadas al estilo escocés, hechas con Virginias rojos maduros y Perique de Luisiana. Se prensan, se cortan y se desmenuzan con cuidado antes de envasarse, y arden despacio y frescas. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('237','Gaslight es una mezcla de estilo inglés de G. L. Pease, prensado en barra (plug). Lleva Virginia, latakia y orientales. Formatos: 57 g y 227 g.','Mezcla inglesa con Latakia prensada y envejecida en tortas, y cortada después en barras de una onza. Es profunda y de mucho sabor, arde muy despacio y combina el dulzor natural de los Virginias rojos con la especia de los orientales. De la Old London Series. Formatos: 57 g y 227 g.'),
('238','Géométrie es una mezcla de la familia Virginia de G. L. Pease, prensado en barra (plug). Formato: 57 g.','Virginias rojos en capas con orientales Basma y Esmirna envejecidos, prensados en tortas y presentados como barra (plug). Una mezcla rica, compleja y sofisticada. Es de la Zeitgeist Collection. Formato: 57 g.'),
('239','Haddo''s Delight es una mezcla de la familia Virginia de G. L. Pease, cortado en tiras finas (ribbon). Lleva Virginia, perique, burley y cavendish negro. Formatos: 57 g, 227 g y 454 g.','Mezcla recia y de cuerpo pleno de Virginias, Burleys y Perique de corte largo. Es una de las más vendidas de la casa desde el año 2000. De la Original Series. Formatos: 57 g, 227 g y 454 g.'),
('240','Horizons Flake es una mezcla de estilo inglés de G. L. Pease, prensado y cortado en láminas (flake). Lleva Virginia, latakia y orientales. Formato: 57 g.','Mezcla de Latakia rica, de cuerpo medio a pleno, reforzada con Cavendish de Virginia rojo, prensada y cortada en láminas. Es de la Zeitgeist Collection. Formato: 57 g.'),
('241','JackKnife Plug es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla recia de Virginias oscuros y brillantes con Kentucky curado al fuego, prensada, envejecida y cortada en barras. Admite muchas formas de prepararla: en láminas gruesas o finas, desmenuzada en tiras o en cubos. De la New World Collection. Formatos: 57 g y 227 g.'),
('242','JackKnife Ready Rubbed es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','La versión ya desmenuzada de JackKnife Plug: Kentucky curado al fuego y Virginia rojo maduro sobre un núcleo de Virginia dorado curado al aire caliente, que le da un dulzor suave. Se prensa y envejece en tortas, se corta en láminas y se desmenuza para que esté lista para cargar. De la New World Collection. Formatos: 57 g y 227 g.'),
('243','Kensington es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Balcánica comedida, menos plena que Charing Cross pero con carácter suficiente para mantener el interés. Pensada para fumar a media jornada. Pertenece a la Classic Collection. Formatos: 57 g y 227 g.'),
('244','Key Largo es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias y orientales en capas, con un poco de Latakia de Chipre y la especia terrosa de la hoja de cigarro. Es cremosa, con un aroma en la habitación más suave de lo que harían pensar sus componentes, y resulta fresca pese a su cuerpo pleno. Las fuentes citan notas de cacao, café tostado y cuero. De la Heirloom Collection. Formatos: 57 g y 227 g.'),
('245','Lagonda es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Abundante Latakia de Chipre con Virginias rojos maduros y orientales selectos, más algo de hoja brillante para un dulzor suave. Se prensa y envejece en tortas para que los sabores se unan y la hoja fermente en parte; después se corta y se desmenuza en tiras. De la Old London Series. Formatos: 57 g y 227 g.'),
('246','Laurel Heights es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla profunda y de cuerpo pleno basada en Virginias rojos y hoja oscura sin estufar. De sabor suave y redondo, con notas sutiles de cítricos y de avena tostada sobre un dulzor natural. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('247','Lombard es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias realzados con hoja «condimental» americana y una buena dosis de Perique; un poco de Latakia de Chipre añade humo y profundidad. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('248','Maltese Falcon es una mezcla de estilo inglés de G. L. Pease, cortado en tiras finas (ribbon). Lleva Virginia, latakia y orientales. Formatos: 57 g y 227 g.','Nació para sustituir a Raven''s Wing y acabó siendo una mezcla propia. Inglesa rica y decidida, con buen cuerpo, un dulzor atractivo y una estructura sólida. De la Heirloom Collection. Formatos: 57 g y 227 g.'),
('249','Meridian es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla tradicional y equilibrada de Latakia de Chipre con Virginias y orientales de hoja pequeña, prensada, cortada y desmenuzada en tiras. Tira más a lo sabroso que a lo dulce, con cuerpo medio y mucha complejidad. De la Old London Series. Formatos: 57 g y 227 g.'),
('250','Metropolis es una mezcla de estilo inglés de G. L. Pease, prensado y cortado en láminas (flake). Formato: 57 g.','Virginias rojos y brillantes sazonados con Latakia turca, hoja italiana curada al fuego, Kentucky semicurado al fuego y un poco de Perique. Es de la Zeitgeist Collection. Formato: 57 g.'),
('251','Montgomery es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla de Virginia con varios grados de hoja curada al aire caliente, del amarillo pálido al rojo oscuro, y un toque de Kentucky curado al fuego que le da riqueza. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('252','Navigator es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Láminas de cuerpo más pleno pero equilibrado, con Virginias rojos y brillantes y hoja curada al fuego que aporta profundidad. Un toque de ron realza la fruta natural del Virginia y suaviza las aristas; se prensa y envejece en tortas para unir los sabores. De la Old London Series. Formatos: 57 g y 227 g.'),
('253','Odyssey es una mezcla de estilo inglés de G. L. Pease, cortado en tiras finas (ribbon). Lleva Virginia, latakia y orientales. Formatos: 57 g y 227 g.','Mezcla de Latakia muy contundente, casi a la altura de Abingdon pero con más dulzor natural y más complejidad. Pensada para la noche, aunque los aficionados a las mezclas fuertes también la fuman de día. De la Original Series. Formatos: 57 g y 227 g.'),
('254','Penny Farthing es una mezcla de G. L. Pease. Formato: 57 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias claros y rojizos con Perique de Luisiana y una pequeña cantidad de Kentucky oscuro curado al fuego, en corte shag fácil de cargar. Empieza dulce y refinada y va ganando profundidad hacia el final. Formato: 57 g.'),
('255','Piccadilly es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Presentada como mezcla de desayuno inglés: Virginia ligeramente especiado con Latakia y un toque de Perique, sin hoja oriental. Las fuentes citan notas de canela y cítricos. Pertenece a la Classic Collection. Formatos: 57 g y 227 g.'),
('256','Quiet Nights es una mezcla de estilo inglés de G. L. Pease, prensado y cortado en láminas (flake). Lleva Virginia, latakia, perique y orientales. Formatos: 57 g y 227 g.','Láminas ricas de estilo inglés con Virginias, orientales, Latakia de Chipre y Perique acadiano, pensadas para una fumada pausada. De la Old London Series. Formatos: 57 g y 227 g.'),
('257','Regents Flake es una mezcla de G. L. Pease. Formato: 57 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla compleja de Virginias brillantes, rojos y marrones con una buena parte de hoja oriental y algo de Perique que da profundidad. De la Old London Series. Formato: 57 g.'),
('258','Robusto es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','A una mezcla de Virginia, orientales y Latakia de Chipre se le añade hoja de cigarro para darle otra dimensión. La casa la compara con la desaparecida Sobranie Virginia No. 10. De la Original Series. Formatos: 57 g y 227 g.'),
('259','Samarra es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla inglesa de Latakia, de las más elaboradas de la casa: varios Virginias, Latakia chipriota ahumada, hoja turca y un poco de Perique. El humo es suave y lleno, con un dulzor delicado que se desarrolla a lo largo de la fumada. De la Original Series. Formatos: 57 g y 227 g.'),
('260','Sextant es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla clásica que une un Navy flake con Virginias maduros, Latakia chipriota, orientales y un toque de Kentucky curado al fuego, con algo de Burley. Se infusiona con un poco de ron oscuro y después se prensa, se madura y se corta en láminas. Rica, decidida y llena. De la Old London Series. Formatos: 57 g y 227 g.'),
('261','Sixpence es una mezcla de la familia Virginia de G. L. Pease, prensado y cortado en láminas (flake). Lleva Virginia, perique y Kentucky curado al fuego. Formatos: 57 g y 227 g.','Virginias rojos, Perique y un poco de hoja curada al fuego para dar cuerpo, con un «algo más» que la casa no desvela. Se prensa y envejece en tortas antes de cortarse en láminas. Rica en sabor y aroma, evoluciona durante la fumada sin cansar el paladar. De la Old London Series. Formatos: 57 g y 227 g.'),
('262','Spark Plug es una mezcla de G. L. Pease. Formato: 57 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Latakia de Chipre y orientales griegos y turcos especiados sobre una base de Virginias brillantes y rojos, prensados en una barra densa que se puede cortar en láminas gruesas o finas. Sabor profundo en el que manda la Latakia, con notas de hoguera, cuero curtido y especia. Formato: 57 g.'),
('263','Stratford es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias y Perique en una mezcla llena de matices, de dulzor delicado, con un juego agradable entre el azúcar y la especia. La casa recomienda fumarla despacio. Pertenece a la Classic Collection. Formatos: 57 g y 227 g.'),
('264','Telegraph Hill es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Una base de Virginia con Perique cortado en pequeñas láminas, para una fumada refinada de sabor firme y final largo. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('265','Temple Bar es una mezcla de G. L. Pease. Formato: 57 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Mezcla rica de Virginia y orientales con Perique, que aporta especia y complejidad. Las hojas enteras se prensan y envejecen en tortas y se cortan en barras de dos onzas, que el fumador lamina y desmenuza a su gusto. Arde despacio. De la Old London Series. Formato: 57 g.'),
('266','The Virginia Cream es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias rojizos y dorados curados al aire caliente, sazonados con una hoja «condimental» poco común y con una cobertura discreta de vainilla y bourbon que no tapa el tabaco. Aromática ligera que arde limpia. De la Heirloom Collection. Formatos: 57 g y 227 g.'),
('267','Triple Play es una mezcla de G. L. Pease. Formatos: 57 g y 227 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias rojos y brillantes curados al aire caliente con Perique acadiano y una medida justa de Kentucky ahumado curado al fuego. Se prensa y madura en tortas y se corta en barras de dos onzas. Pensada para los aficionados al Virginia con Perique. De la New World Collection. Formatos: 57 g y 227 g.'),
('268','Union Square es una mezcla de la familia Virginia de G. L. Pease, prensado y cortado en láminas (flake). Lleva Virginia. Formatos: 57 g y 227 g.','La primera mezcla 100 % Virginia de la casa, lanzada en junio de 2009, sin azúcares, salsas ni saborizantes. De la Fog City Selection. Formatos: 57 g y 227 g.'),
('269','Westminster es una mezcla de estilo inglés de G. L. Pease, cortado en tiras finas (ribbon). Lleva Virginia, latakia y orientales. Formatos: 57 g, 227 g y 454 g.','Mezcla inglesa rica y equilibrada de Latakia de Chipre, orientales selectos y Virginia maduro, presentada en enero de 2007. De la Heirloom Collection. Formatos: 57 g, 227 g y 454 g.'),
('270','Windjammer es una mezcla de G. L. Pease. Formato: 57 g. Todavía no tenemos datos fiables de familia, corte ni composición.','Virginias de dulzor natural y Burleys de toque a nuez con una buena parte de Perique especiado, unidos por Cavendish tostado sin endulzar. Se hace en torta cortada en láminas y lleva un toque de ron oscuro. Arde despacio y limpia, con notas de cacao, nuez negra y fruta seca. Formato: 57 g.')
) as v(id, vieja, nueva)
where t.id = v.id and t.descripcion = v.vieja;

update public.tabacos t set corte = v.corte
from (values
('225','Ribbon'),
('227','Cube Cut'),
('228','Ribbon'),
('229','Ribbon'),
('230','Ribbon'),
('231','Ribbon'),
('233','Ribbon'),
('235','Broken Flake'),
('236','Broken Flake'),
('241','Plug'),
('242','Broken Flake'),
('243','Ribbon'),
('244','Broken Flake'),
('245','Ribbon'),
('246','Ribbon'),
('247','Ribbon'),
('249','Ribbon'),
('251','Ribbon'),
('252','Flake'),
('254','Shag'),
('255','Ribbon'),
('257','Flake'),
('258','Ribbon'),
('259','Ribbon'),
('260','Flake'),
('262','Plug'),
('263','Ribbon'),
('264','Ribbon'),
('265','Plug'),
('266','Ribbon'),
('267','Plug'),
('270','Flake')
) as v(id, corte)
where t.id = v.id and t.corte = '';

update public.tabacos t set notas = v.notas
from (values
('227',array['nuez', 'chocolate', 'licor']::text[]),
('229',array['cítricos', 'nuez']::text[]),
('230',array['cuero']::text[]),
('244',array['chocolate', 'café', 'cuero']::text[]),
('246',array['cítricos', 'pan tostado']::text[]),
('252',array['ron']::text[]),
('255',array['especias dulces', 'cítricos']::text[]),
('260',array['ron']::text[]),
('262',array['hoguera', 'cuero']::text[]),
('266',array['vainilla', 'whisky']::text[]),
('270',array['chocolate', 'nuez', 'ron']::text[])
) as v(id, notas)
where t.id = v.id and cardinality(t.notas) = 0;

update public.tabacos set hojas = array['Virginia', 'Oriental']::text[] where id = '238' and cardinality(hojas) = 0;
update public.tabacos set tipo = 'Inglesa' where id = '238' and tipo = 'Virginia';

-- Comprobación: debería devolver 47, 0 y 11
select count(*) filter (where descripcion not like '%es una mezcla%de G. L. Pease%') as con_descripcion_nueva,
       count(*) filter (where corte = '') as sin_corte,
       count(*) filter (where cardinality(notas) > 0) as con_notas
from public.tabacos where id in ('224','225','226','227','228','229','230','231','232','233','234','235','236','237','238','239','240','241','242','243','244','245','246','247','248','249','250','251','252','253','254','255','256','257','258','259','260','261','262','263','264','265','266','267','268','269','270');
