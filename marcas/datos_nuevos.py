# Fichas nuevas, marca a marca.
# Formato de cada fila: (nombre, tipo, corte, formato, extra)
#   tipo: Virginia, Burley, Aromático, Inglés, Oriental, Cavendish, Para mezclas o "" si no hay dato fiable
#   corte: Flake, Ribbon, Broken Flake, Plug, Rope, Coins, Cake, Cube Cut, Shag, Ready Rubbed o ""
#   extra: frase opcional con datos de fabricante o tienda (composición, nombres anteriores…)
# Fuentes de cada marca en FUENTES.

MARCAS = {}
FUENTES = {}
PAIS = {}

# ---------------------------------------------------------------- Kohlhase & Kopp
PAIS["Rattray's"] = "Alemania"
FUENTES["Rattray's"] = "Smokingpipes (listado de la marca, oct. 2026) y cigarworld.de"
MARCAS["Rattray's"] = [
    ("3 Noggins", "Inglés", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("40 Virginia", "Virginia", "Ribbon", "100 g", ""),
    ("Accountant's Mixture", "Inglés", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Bagpiper's Dream", "Aromático", "Ribbon", "100 g", ""),
    ("Black Mallory", "Inglés", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Black Virginia", "Virginia", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Brown Clunee", "Virginia", "Broken Flake", "50 g · 100 g · 500 g", ""),
    ("Buckingham", "Aromático", "Ribbon", "100 g", ""),
    ("Dark Fragrant", "Virginia", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Exotic Passion", "Aromático", "Ribbon", "100 g", ""),
    ("Hal O' The Wynd", "Virginia", "Broken Flake", "50 g · 100 g · 500 g", ""),
    ("Highland Targe", "Inglés", "Ribbon", "50 g · 100 g", ""),
    ("Jocks Mixture", "Inglés", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Macbeth", "Virginia", "Ribbon", "100 g", ""),
    ("Marlin Flake", "Virginia", "Flake", "50 g · 100 g · 500 g", ""),
    ("No. 7 Reserve", "Inglés", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Old Gowrie", "Virginia", "Broken Flake", "50 g · 100 g · 500 g", ""),
    ("Professional Mixture", "Inglés", "Ribbon", "50 g · 100 g", ""),
    ("Red Lion", "Inglés", "Ribbon", "100 g", ""),
    ("Red Rapparee", "Inglés", "Ribbon", "50 g · 100 g · 500 g", ""),
    ("Sir William", "Virginia", "Ribbon", "100 g", ""),
    ("Stirling Flake", "Burley", "Flake", "50 g", ""),
    ("Wallace Flake", "Virginia", "Flake", "50 g", ""),
    ("Westminster Abbey", "Aromático", "Ribbon", "100 g", ""),
]

PAIS["Robert McConnell"] = "Alemania"
FUENTES["Robert McConnell"] = "cigarworld.de (series Original y Heritage) y Smokingpipes (oct. 2026)"
MARCAS["Robert McConnell"] = [
    # Serie Original
    ("Black and Gold Mixture", "Aromático", "Broken Flake", "50 g · 100 g", "Forma parte de la serie Original."),
    ("Black Parrot Special Cut", "", "", "100 g", "Forma parte de la serie Original."),
    ("Code: Relax", "Aromático", "Ribbon", "100 g", "Forma parte de la serie Original."),
    ("Cruise Line", "", "", "100 g", "Forma parte de la serie Original."),
    ("Fancy Selection No. 1", "", "", "50 g", "Forma parte de la serie Original."),
    ("Glen Piper", "Aromático", "Broken Flake", "50 g · 100 g", "Forma parte de la serie Original."),
    ("Latakia Flake", "Inglés", "Flake", "50 g", "Forma parte de la serie Original."),
    ("Maduro", "Virginia", "Ribbon", "50 g · 100 g", "Forma parte de la serie Original. Lleva cavendish natural muy oscuro."),
    ("Mature", "Virginia", "Broken Flake", "50 g", "Forma parte de la serie Original."),
    ("Old London Pebble Cut", "", "", "100 g", "Forma parte de la serie Original. Se presenta en trocitos (pebble cut)."),
    ("Oriental", "Inglés", "Ribbon", "50 g · 100 g", "Forma parte de la serie Original. Lleva tabacos del Mediterráneo oriental."),
    ("Pure Black Cavendish", "Para mezclas", "", "50 g", "Forma parte de la serie Original."),
    ("Pure Brasil", "Para mezclas", "", "50 g", "Forma parte de la serie Original."),
    ("Pure Burley", "Para mezclas", "", "50 g", "Forma parte de la serie Original."),
    ("Pure Caribe", "Para mezclas", "Ribbon", "50 g · 500 g", "Forma parte de la serie Original."),
    ("Pure Cuba", "Para mezclas", "", "50 g", "Forma parte de la serie Original."),
    ("Pure Kentucky", "Para mezclas", "", "50 g", "Forma parte de la serie Original."),
    ("Pure Latakia", "Para mezclas", "Ribbon", "50 g", "Forma parte de la serie Original."),
    ("Pure Orient", "Para mezclas", "", "50 g", "Forma parte de la serie Original."),
    ("Pure Perique", "Para mezclas", "Ribbon", "50 g", "Forma parte de la serie Original."),
    ("Pure Virginia", "Para mezclas", "Ribbon", "50 g", "Forma parte de la serie Original."),
    ("Red Roses", "Aromático", "", "100 g", "Forma parte de la serie Original. Se aromatiza con pétalos de rosa."),
    ("Red Virginia", "Virginia", "Broken Flake", "50 g · 100 g", "Forma parte de la serie Original."),
    ("Scottish Blend", "Inglés", "Ribbon", "50 g · 100 g", "Forma parte de la serie Original."),
    ("Scottish Cake", "Virginia", "Broken Flake", "50 g · 100 g", "Forma parte de la serie Original."),
    ("Scottish Flake", "Virginia", "Flake", "50 g", "Forma parte de la serie Original."),
    ("Sovereign Mixture", "", "", "100 g", "Forma parte de la serie Original."),
    ("Special London Fine Cut", "Virginia", "Shag", "50 g", "Forma parte de la serie Original."),
    ("The Fragrant Blend", "", "", "100 g", "Forma parte de la serie Original."),
    # Serie Heritage
    ("5 Year Matured Virginia", "Virginia", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Barking Road", "Virginia", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Black Flake", "Virginia", "Flake", "50 g", "Forma parte de la serie Heritage."),
    ("Boutique Blend", "Inglés", "Ribbon", "50 g · 100 g", "Forma parte de la serie Heritage."),
    ("Covent Garden", "Inglés", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Flake", "Virginia", "Flake", "50 g", "Forma parte de la serie Heritage."),
    ("Folded Flake", "Virginia", "Flake", "50 g", "Forma parte de la serie Heritage."),
    ("Highgate", "Virginia", "Coins", "50 g", "Forma parte de la serie Heritage."),
    ("Latakia Mixture 1848", "Inglés", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Marylebone", "Inglés", "Ribbon", "50 g · 100 g", "Forma parte de la serie Heritage."),
    ("Notting Hill", "", "", "50 g", "Forma parte de la serie Heritage."),
    ("Oriental Square", "Inglés", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Oxford Street", "", "", "50 g", "Forma parte de la serie Heritage."),
    ("Paddington", "Virginia", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Piccadilly Circus", "Inglés", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Ready Rubbed", "Virginia", "Broken Flake", "50 g", "Forma parte de la serie Heritage."),
    ("Regent Street", "Virginia", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Rich Dark Virginia", "Virginia", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("Ripe Honeydew", "Virginia", "Broken Flake", "50 g", "Forma parte de la serie Heritage."),
    ("River Thames", "", "", "50 g", "Forma parte de la serie Heritage."),
    ("Shakespeare", "Virginia", "Ribbon", "50 g", "Forma parte de la serie Heritage."),
    ("St. James Park", "", "", "50 g", "Forma parte de la serie Heritage."),
]

PAIS["Ashton"] = "Alemania"
FUENTES["Ashton"] = "Smokingpipes (oct. 2026); cigarworld.de vende la marca de pipas Ashton"
MARCAS["Ashton"] = [
    ("Artisan's Blend", "Inglés", "Ribbon", "50 g", ""),
    ("Consummate Gentleman", "Inglés", "Ribbon", "50 g", ""),
    ("Gold Rush", "Virginia", "Ribbon", "50 g", ""),
    ("Guilty Pleasure", "Aromático", "Ribbon", "50 g", ""),
    ("Rainy Day", "Aromático", "Ribbon", "50 g", ""),
    ("Smooth Sailing", "Aromático", "Ribbon", "50 g", ""),
    ("Winding Road", "Aromático", "Ribbon", "50 g", ""),
]

PAIS["Davidoff"] = ""
FUENTES["Davidoff"] = "cigarworld.de (Davidoff Pfeifentabak y Discovery) y Smokingpipes (oct. 2026)"
MARCAS["Davidoff"] = [
    ("Danish Mixture", "Aromático", "Ribbon", "50 g", ""),
    ("English Mixture", "Inglés", "Ribbon", "50 g", ""),
    ("Royalty Mixture", "Inglés", "Ribbon", "50 g", ""),
    ("Scottish Mixture", "Aromático", "Ribbon", "50 g", ""),
    ("Red Mixture", "Aromático", "Ribbon", "50 g", ""),
    ("Flake Medallions", "Virginia", "Coins", "50 g", ""),
    ("Discovery Argentina Cavendish", "Cavendish", "", "Bolsa de 50 g", "Forma parte de la serie Discovery."),
    ("Discovery Brazil Virginia", "Virginia", "", "Bolsa de 50 g", "Forma parte de la serie Discovery."),
    ("Discovery Malawi Dark Cavendish", "Cavendish", "", "Bolsa de 50 g", "Forma parte de la serie Discovery."),
]

PAIS["Kopp"] = "Alemania"
FUENTES["Kopp"] = "Smokingpipes (oct. 2026)"
MARCAS["Kopp"] = [
    (f"Caribbean Blue {n}", "Aromático", "Ribbon", "50 g", "Forma parte de la serie Caribbean Blue de Kohlhase & Kopp.")
    for n in ["Bellamy", "Drake", "Graham", "Rackham", "Seegar", "Wynne"]
]

# ---------------------------------------------------------------- Grupo STG
PAIS["Captain Black"] = "Estados Unidos"
FUENTES["Captain Black"] = "Smokingpipes (oct. 2026)"
MARCAS["Captain Black"] = [
    ("Cherry", "Aromático", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", ""),
    ("Dark", "Aromático", "Ribbon", "Bolsa de 1,5 oz", ""),
    ("Gold", "Aromático", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", ""),
    ("Original", "Aromático", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", ""),
    ("Platinum", "Aromático", "Ribbon", "Bolsa de 1,5 oz", ""),
    ("Royal", "Aromático", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", ""),
]

PAIS["Clan"] = ""
FUENTES["Clan"] = "cigarworld.de (oct. 2026)"
MARCAS["Clan"] = [
    ("Original", "Aromático", "Ribbon", "50 g", "Lleva Virginia, burley, cavendish negro y perique, con un toque de frutos secos. La creó Theodorus Niemeyer y la elabora Scandinavian Tobacco Group."),
]

PAIS["Erik Stokkebye"] = "Dinamarca"
FUENTES["Erik Stokkebye"] = "Smokingpipes y cigarworld.de (oct. 2026)"
MARCAS["Erik Stokkebye"] = [
    ("4th Generation 1855", "Virginia", "Ribbon", "50 g", "Forma parte de la línea 4th Generation."),
    ("4th Generation 1882 Founder's Blend", "Inglés", "Ribbon", "50 g", "Forma parte de la línea 4th Generation."),
    ("4th Generation 1897", "Aromático", "Ribbon", "Bolsa de 1,5 oz", "Forma parte de la línea 4th Generation. Lleva cavendish negro."),
    ("4th Generation 1931 Flake", "Virginia", "Flake", "50 g", "Forma parte de la línea 4th Generation. Lleva burley y Virginia."),
    ("4th Generation 1957", "Aromático", "Ribbon", "50 g", "Forma parte de la línea 4th Generation."),
    ("4th Generation 1982", "Aromático", "Ribbon", "Bolsa de 1,5 oz", "Forma parte de la línea 4th Generation."),
    ("4th Generation 2012 Anniversary Blend", "Virginia", "Flake", "1,75 oz", "Forma parte de la línea 4th Generation."),
    ("4th Generation Max Erik 1989", "Virginia", "Flake", "1,75 oz", "Forma parte de la línea 4th Generation."),
    ("4 Seasons Spring Mixture", "Aromático", "Ribbon", "50 g", "Forma parte de la serie 4 Seasons."),
    ("4 Seasons Summer Mixture", "Inglés", "Ribbon", "50 g", "Forma parte de la serie 4 Seasons."),
    ("4 Seasons Autumn Mixture", "Virginia", "Broken Flake", "50 g", "Forma parte de la serie 4 Seasons."),
    ("4 Seasons Winter Mixture", "Virginia", "Broken Flake", "50 g", "Forma parte de la serie 4 Seasons."),
]

PAIS["Orlik"] = "Dinamarca"
FUENTES["Orlik"] = "Smokingpipes y cigarworld.de (oct. 2026)"
MARCAS["Orlik"] = [
    ("Golden Sliced", "Virginia", "Flake", "50 g · 100 g", "Lleva un casing ligero."),
    ("Club Mixture", "Aromático", "Ribbon", "100 g", "Lleva cavendish negro, burley y Virginia."),
]

PAIS["Stanwell"] = "Dinamarca"
FUENTES["Stanwell"] = "cigarworld.de y Smokingpipes (oct. 2026)"
MARCAS["Stanwell"] = [
    ("Classic", "", "", "50 g", ""),
    ("Green & Indigo", "", "", "50 g", ""),
    ("Jubilee", "", "", "50 g", ""),
    ("Melange", "Aromático", "Broken Flake", "50 g", ""),
    ("Sungold", "Aromático", "Ribbon", "50 g", "Antes se llamaba Vanilla, nombre con el que aún se vende en EE. UU."),
]

PAIS["Escudo"] = "Dinamarca"
FUENTES["Escudo"] = "Smokingpipes (A&C Petersen, oct. 2026)"
MARCAS["Escudo"] = [
    ("Navy Deluxe", "Virginia", "Coins", "50 g", "Lleva Virginia y perique. Se vende con la marca A&C Petersen, de Scandinavian Tobacco Group."),
]

PAIS["Lane Limited"] = "Estados Unidos"
FUENTES["Lane Limited"] = "Smokingpipes (granel, oct. 2026)"
MARCAS["Lane Limited"] = [
    ("1-Q", "Aromático", "Ribbon", "A granel", ""),
    ("BCA", "Aromático", "Ribbon", "A granel", ""),
    ("Black Raspberry", "Aromático", "Ribbon", "A granel", ""),
    ("BL/WB", "Burley", "Ribbon", "A granel", ""),
    ("Buttered Rum", "Aromático", "Ribbon", "A granel", ""),
    ("Hazelnut", "Aromático", "Ribbon", "A granel", ""),
    ("HG-2000", "Aromático", "Ribbon", "A granel", ""),
    ("HGL", "Aromático", "Ribbon", "A granel", "Es una aromática de estilo inglés."),
    ("HS-3", "Aromático", "Ribbon", "A granel", ""),
    ("LL-7", "Aromático", "Ribbon", "A granel", ""),
    ("MV-1000", "Aromático", "Ribbon", "A granel", ""),
    ("RLP-6", "Aromático", "Ribbon", "A granel", ""),
    ("TK-6", "Aromático", "Ribbon", "A granel", ""),
    ("Very Cherry", "Aromático", "Ribbon", "A granel", ""),
]

# ---------------------------------------------------------------- Antiguas marcas de Mac Baren (hoy STG)
PAIS["Planta"] = "Dinamarca"
FUENTES["Planta"] = "cigarworld.de, Smoke-King y Smokingpipes (oct. 2026)"
MARCAS["Planta"] = [
    ("Original Danish Black V Mixture", "Aromático", "Ribbon", "Bolsa de 40 g · lata de 50 g", "Lleva Virginia y burley tratado como cavendish, con vainilla. Antes se llamaba Danish Black Vanilla."),
    ("Presbyterian Mixture", "Inglés", "Ribbon", "50 g", ""),
]

PAIS["Cellini"] = "Dinamarca"
FUENTES["Cellini"] = "cigarworld.de (oct. 2026)"
MARCAS["Cellini"] = [
    ("Classico", "Aromático", "Ribbon", "Bolsa de 50 g", "Lleva Virginia, burley y cavendish negro, con aroma afrutado. Marca creada por Planta."),
]

PAIS["Mc Lintock"] = "Dinamarca"
FUENTES["Mc Lintock"] = "cigarworld.de (oct. 2026)"
MARCAS["Mc Lintock"] = [
    ("Shamrock Isle", "Aromático", "", "100 g", "Marca creada por Planta."),
    ("Wild C", "Aromático", "", "100 g", "Antes se llamaba Wild Cherry. Marca creada por Planta."),
]

PAIS["R and M"] = "Dinamarca"
FUENTES["R and M"] = "cigarworld.de (oct. 2026)"
MARCAS["R and M"] = [
    ("R and M", "Aromático", "Ribbon", "50 g", "Lleva Virginia y burley, con notas de ron y arce. Antes se llamaba Rum and Maple. Marca creada por Planta."),
]

PAIS["Sutliff"] = "Dinamarca"
FUENTES["Sutliff"] = "Smokingpipes (granel) y cigar-coop.com (cierre de la fábrica de Richmond, ene. 2025)"
_SUT = "Sutliff cerró su fábrica de Richmond en 2025 y esta mezcla, de las pocas que siguen, se elabora ahora en la fábrica de Scandinavian Tobacco Group en Assens (Dinamarca)."
MARCAS["Sutliff"] = [
    ("Creme Brulee", "Aromático", "Ribbon", "A granel", _SUT),
    ("Rum & Maple", "Aromático", "Ribbon", "A granel", _SUT),
    ("Z50 Black Cordial", "Aromático", "Ribbon", "A granel", _SUT),
    ("Z92 Vanilla Custard", "Aromático", "Ribbon", "A granel", _SUT),
]

# ---------------------------------------------------------------- Independientes
PAIS["Dan Tobacco"] = "Alemania"
FUENTES["Dan Tobacco"] = "Smokingpipes y cigarworld.de (oct. 2026)"
MARCAS["Dan Tobacco"] = [
    ("Bill Bailey's Balkan Blend", "Inglés", "Ribbon", "50 g · 250 g · 500 g", ""),
    ("Bi Bo – Biker & Bolzer", "", "", "100 g", ""),
    ("Bizzy Lizzy", "", "", "50 g", ""),
    ("Blue Note", "Aromático", "Ribbon", "50 g · 250 g · 500 g", ""),
    ("Da Vinci", "Aromático", "Ribbon", "50 g · 500 g", ""),
    ("Devil's Holiday", "Aromático", "Ribbon", "50 g · 500 g", ""),
    ("Gordon Pym", "Inglés", "Ribbon", "50 g", ""),
    ("Hamborger Veermaster", "Virginia", "Broken Flake", "50 g · 250 g", ""),
    ("Liberty", "Aromático", "Ribbon", "50 g", "Es una aromática de estilo inglés."),
    ("London Blend No. 1000", "Inglés", "Ribbon", "100 g", ""),
    ("Midnight Ride", "Inglés", "Ribbon", "50 g", ""),
    ("Milonga", "Aromático", "Ribbon", "50 g", ""),
    ("Old Ironsides", "Inglés", "Flake", "50 g", ""),
    ("Patriot Flake", "Virginia", "Flake", "50 g", ""),
    ("Salty Dogs", "Virginia", "Plug", "50 g", ""),
    ("Skipper's Flake", "", "Flake", "50 g", ""),
    ("Sweet Vanilla Honeydew", "Aromático", "Broken Flake", "50 g · 250 g · 500 g", "En Alemania se vende ahora como S.V.H."),
    ("The Mallard", "Virginia", "Ribbon", "50 g", ""),
    ("The Manager", "", "", "50 g", ""),
    ("Tordenskjold Virginia Slices", "Virginia", "Flake", "50 g", "Forma parte de la serie Torben Dansk."),
    ("Treasures of Ireland: Galway", "Aromático", "Ribbon", "50 g", "Forma parte de la serie Treasures of Ireland."),
    ("Treasures of Ireland: Limerick", "Virginia", "Flake", "50 g", "Forma parte de la serie Treasures of Ireland."),
]

PAIS["Germain's"] = "Reino Unido"
FUENTES["Germain's"] = "Smokingpipes y cigarworld.de (oct. 2026)"
MARCAS["Germain's"] = [
    ("B.K. Flake", "Virginia", "Broken Flake", "50 g", "Se elabora en Jersey."),
    ("Bridge: Old Brown Flake", "Virginia", "Broken Flake", "50 g", "Se elabora en Jersey."),
    ("Brown Flake", "Virginia", "Flake", "50 g", "Se elabora en Jersey."),
    ("Century", "Aromático", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Club Mixture", "Virginia", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Eighteen Twenty", "Inglés", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("King Charles Mixture", "Inglés", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Medium Flake", "Virginia", "Flake", "50 g", "Se elabora en Jersey."),
    ("Mixture No. 7", "Aromático", "Ribbon", "50 g", "Lleva Virginia, burley y cavendish negro. Se elabora en Alemania bajo licencia.", "Alemania"),
    ("Plum Cake", "Virginia", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Royal Jersey: Cavendish and Virginia", "Virginia", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Royal Jersey: Dark Cavendish", "Virginia", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Royal Jersey: Original Latakia Mixture", "Inglés", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Royal Jersey: Perique Mixture", "Virginia", "Ribbon", "50 g", "Se elabora en Jersey."),
    ("Special Latakia Flake", "Inglés", "Flake", "50 g", "Se elabora en Jersey."),
    ("Uncle Tom's", "Virginia", "Ribbon", "50 g", "Se elabora en Jersey."),
]

PAIS["Esoterica"] = "Reino Unido"
FUENTES["Esoterica"] = "Smokingpipes (oct. 2026); todas agotadas, como es habitual en la marca"
_ESO = "La elabora G. F. Germain en Jersey."
MARCAS["Esoterica"] = [
    ("And So To Bed", "Inglés", "Ribbon", "2 oz · 8 oz", _ESO),
    ("Blackpool", "Aromático", "Ribbon", "8 oz", _ESO),
    ("Brighton", "Virginia", "Ribbon", "8 oz", _ESO),
    ("Cardiff", "Virginia", "Ribbon", "8 oz", _ESO),
    ("Dorchester", "Virginia", "Ribbon", "2 oz · 8 oz", _ESO),
    ("Dunbar", "Virginia", "Ribbon", "2 oz · 8 oz", _ESO),
    ("Hastings", "Aromático", "Ribbon", "8 oz", _ESO),
    ("Kingsbridge", "Virginia", "Ribbon", "8 oz", _ESO),
    ("Margate", "Inglés", "Ribbon", "2 oz · 8 oz", _ESO),
    ("Peacehaven", "Virginia", "Flake", "8 oz", _ESO),
    ("Pembroke", "Inglés", "Ribbon", "2 oz · 8 oz", _ESO),
    ("Penzance", "Inglés", "Flake", "2 oz · 8 oz", _ESO),
    ("Ramsgate", "Aromático", "Ribbon", "8 oz", _ESO),
    ("Scarborough", "Virginia", "Ribbon", "8 oz", _ESO),
    ("St. Ives", "Aromático", "Ribbon", "8 oz", _ESO + " Es una aromática de estilo inglés."),
    ("Stonehaven", "Burley", "Flake", "2 oz · 8 oz", _ESO),
    ("Tilbury", "Virginia", "Ribbon", "2 oz · 8 oz", _ESO),
    ("Woodbridge", "Aromático", "Ribbon", "8 oz", _ESO),
]

PAIS["Seattle Pipe Club"] = "Estados Unidos"
FUENTES["Seattle Pipe Club"] = "Smokingpipes (oct. 2026)"
_SPC = "La elabora Cornell & Diehl."
MARCAS["Seattle Pipe Club"] = [
    ("Hogshead", "Virginia", "Plug", "2 oz", _SPC),
    ("Mississippi River", "Inglés", "Cake", "2 oz · 8 oz", _SPC),
    ("Mississippi River Rum Barrel Aged", "Inglés", "Cake", "2 oz", _SPC + " Es una variante madurada en barrica de ron."),
    ("Mississippi River Special Reserve", "Inglés", "Plug", "2 oz", _SPC),
    ("Plum Pudding", "Inglés", "Cake", "2 oz · 8 oz", _SPC),
    ("Plum Pudding Bourbon Barrel Aged", "Inglés", "Cake", "2 oz", _SPC + " Es una variante madurada en barrica de bourbon."),
    ("Plum Pudding Special Reserve", "Inglés", "Plug", "2 oz", _SPC),
]

PAIS["Watch City"] = "Estados Unidos"
FUENTES["Watch City"] = "watchcitycigar.com (mezclas de la casa, oct. 2026)"
_WC = "Es una mezcla de la casa de la tienda Watch City Cigar & Pipe (Massachusetts)."
MARCAS["Watch City"] = [
    ("#7", "Aromático", "", "A granel", _WC + " Lleva cavendish, burley y Virginia."),
    ("4-Q", "Aromático", "", "A granel", _WC + " Lleva burley prensado y cavendish."),
    ("Bada-Bing!", "", "", "A granel", _WC),
    ("Beacon Blend", "Burley", "", "A granel", _WC),
    ("Blue Ridge Special", "Inglés", "", "A granel", _WC + " Lleva Virginia y latakia."),
    ("Bostonian Rhapsody", "Virginia", "Ribbon", "A granel", _WC + " Lleva Virginia y perique."),
    ("Deluxe Crumb Cut", "Burley", "", "A granel", _WC),
    ("English Ernie-ental", "Inglés", "", "A granel", _WC + " Lleva Virginia, latakia y oriental de Macedonia."),
    ("Eureka", "Aromático", "", "A granel", _WC + " Lleva cavendish dorado y negro."),
    ("F.U.S.T.G! (Fired Up & Set To Go!)", "Burley", "", "A granel", _WC + " Lleva burley, Virginia y perique."),
    ("None of Your Business", "Aromático", "", "A granel", _WC + " Es una aromática de estilo inglés."),
    ("Spiked Spumoni", "Aromático", "", "A granel", _WC + " Lleva cavendish y perique."),
]

PAIS["Sir Walter Raleigh"] = "Estados Unidos"
FUENTES["Sir Walter Raleigh"] = "Smokingpipes (oct. 2026)"
MARCAS["Sir Walter Raleigh"] = [
    ("Aromatic", "Aromático", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", ""),
    ("Regular", "Burley", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", ""),
]
PAIS["Prince Albert"] = "Estados Unidos"
FUENTES["Prince Albert"] = "Smokingpipes (oct. 2026)"
MARCAS["Prince Albert"] = [("Prince Albert", "Burley", "Ribbon", "Bote de 14 oz", "")]
PAIS["Half and Half"] = "Estados Unidos"
FUENTES["Half and Half"] = "Smokingpipes (oct. 2026)"
MARCAS["Half and Half"] = [("Half and Half", "Aromático", "Ribbon", "Bolsa de 1,5 oz · bote de 7 oz", "")]
PAIS["Carter Hall"] = "Estados Unidos"
FUENTES["Carter Hall"] = "Smokingpipes (oct. 2026)"
MARCAS["Carter Hall"] = [("Carter Hall", "Burley", "Ribbon", "Bote de 14 oz", "")]
