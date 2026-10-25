# Marcas nuevas encontradas en tiendas alemanas (Pfeifen Huber, Dein Tabak, Tabak-Kontor), oct. 2026.
# Se generan con marcas/generar_alemanas.py (ids desde 2000, con mezcla y hojas ya calculadas).
#
# Formato de cada fila: (nombre, familia, componentes, corte, formato, extra, fuente)
#   familia y componentes: tal como vienen de la fuente (Smokingpipes «Family»/«Components»,
#     Tobacco Reviews «Blend Type»/«Contents»). Vacíos si no hay dato fiable: no se adivina.
#   corte: Flake, Ribbon, Broken Flake, Plug, Rope, Coins, Cake, Cube Cut, Shag, Ready Rubbed o "".
#   extra: frase opcional en español con datos de fabricante o tienda.
#   fuente: de dónde salen familia y componentes (sp = Smokingpipes, tr = Tobacco Reviews…).
#
# Criterio (el mismo de oct. 2026): entra cada mezcla que Smokingpipes o cigarworld.de siguen
# teniendo en catálogo, aunque esté agotada. Fuera ediciones limitadas o anuales y lo que
# cigarworld marca como «Auslauf» o «Restbestand» sin otra fuente que lo confirme.

MARCAS = {}
FUENTES = {}
PAIS = {}

# ---------------------------------------------------------------- HU Tobacco
# Fuentes: cigarworld.de (series y fichas de cada variante: Rohtabak, Typ, Schnitt), Smokingpipes
# (listado de la marca y fichas) y el catálogo de exportación de HU (2024). Familia: la de SP o TR
# cuando la hay; si no, se deduce de los componentes de cigarworld (latakia u orientales con
# virginia → English; solo virginia → Virginia). Si no se puede, queda vacía.
PAIS["HU Tobacco"] = "Alemania"
FUENTES["HU Tobacco"] = "cigarworld.de (series de HU, oct. 2026), Smokingpipes y catálogo de exportación de HU (2024)"
_AL, _OW, _BP, _UP, _PRF, _HO, _PE = (
    "Forma parte de la African Line.", "Forma parte de la serie Original Warehouseblend.",
    "Forma parte de la serie The Blenders Pride.", "Forma parte de la serie United Passion.",
    "Forma parte de la serie PRF, hecha con el foro holandés de pipa.",
    "Forma parte de la serie Hommage to my friends.", "Forma parte de la serie Pipe Enthusiasts Germany.")
MARCAS["HU Tobacco"] = [
    ("Asmara", "English", "Virginia, Latakia, Orientals, Perique", "Ribbon", "Lata de 100 g", _AL, "cw"),
    ("Fayyum", "English", "Virginia, Black Cavendish, Latakia, Kentucky", "Ribbon", "Lata de 100 g", _AL, "cw"),
    ("Fayyum Special Kake", "English", "Virginia, Black Cavendish, Latakia, Kentucky", "Plug", "Lata de 100 g", _AL, "cw"),
    ("Indaba", "Virginia", "Virginia, Burley", "Broken Flake", "Lata de 100 g", _AL, "sp"),
    ("Khartoum", "English", "Virginia, Black Cavendish, Latakia, Perique, Cigar, Kentucky", "Ready Rubbed", "Lata de 100 g", _AL, "cw"),
    ("Khoisaan", "English", "Latakia, Perique, Virginia", "Ribbon", "Lata de 100 g", _AL, "catálogo HU"),
    ("Makhuwa", "Burley", "Virginia, Perique, Burley", "Ribbon", "Lata de 100 g", _AL, "sp"),
    ("Manyara", "English", "Virginia, Burley, Latakia, Orientals, Perique, Cigar, Kentucky", "Ribbon", "Lata de 100 g", _AL, "cw"),
    ("Nyala", "Burley", "Virginia, Perique, Burley, Cigar", "Broken Flake", "Lata de 100 g", _AL, "sp"),
    ("Tigray", "English", "Virginia, Burley, Latakia, Orientals", "Ribbon", "Lata de 100 g", _AL, "cw"),
    ("Tuarekh", "English", "Virginia, Latakia, Orientals, Perique", "Ribbon", "Lata de 100 g", _AL, "cw"),
    ("Zulu Mixture", "English", "Burley, Latakia, Orientals, Perique, Kentucky", "Ribbon", "Lata de 100 g", _AL, "cw"),
    ("Balkan Passion", "English", "Orientals, Latakia, Virginia, Perique", "Ribbon", "Lata de 100 g", _OW, "catálogo HU"),
    ("Director's Cut", "", "Virginia, Burley, Perique", "Coins", "Lata de 100 g", _OW, "cw"),
    ("Edward G.", "Virginia", "Perique, Dark Fired Kentucky, Burley, Orientals, Black Cavendish", "Broken Flake", "Lata de 100 g", _OW, "sp"),
    ("English Breakfast", "English", "Virginia, Latakia, Orientals", "Ribbon", "Lata de 100 g", _OW, "sp"),
    ("Izmir Oriental Cake", "Virginia", "Kentucky, Orientals, Perique, Virginia", "Plug", "Lata de 100 g", _OW, "cw"),
    ("Louisiana Broken", "Virginia", "Virginia, Perique, Kentucky", "Ready Rubbed", "Lata de 100 g", _OW, "cw"),
    ("Nashville County", "Burley", "Virginia, Perique, Burley, Black Cavendish", "Broken Flake", "Lata de 100 g", _OW, "sp"),
    ("Port Latakia", "English", "Virginia, Latakia, Orientals", "Ribbon", "Lata de 100 g", _OW, "cw"),
    ("White Horses", "Virginia", "Virginia, Perique, Dark Fired Kentucky, Cigar", "Ribbon", "Lata de 100 g", _OW, "sp"),
    ("Casablanca Feeling", "English", "Virginia, Burley, Black Cavendish, Latakia", "Ribbon", "Lata de 100 g", _BP + " Lleva un aroma floral suave.", "cw"),
    ("China's Heaven", "Aromatic", "Virginia, Burley", "Ready Rubbed", "Lata de 100 g", _BP + " Aroma afrutado.", "cw"),
    ("Green Gold", "", "Virginia", "Broken Flake", "Lata de 100 g", _BP + " Aroma floral.", "cw"),
    ("Ju 52", "Virginia", "Virginia, Perique", "Ready Rubbed", "Lata de 100 g", _BP, "cw"),
    ("Take Five", "Virginia", "Virginia", "Ready Rubbed", "Lata de 100 g", _BP + " Aroma de frutos secos.", "cw"),
    ("Dockworker Flake", "", "Burley, Orientals", "Flake", "Lata de 50 g", _UP, "cw"),
    ("Flanagan Flake", "Virginia", "Virginia, Orientals, Perique, Kentucky", "Flake", "Lata de 50 g", _UP, "cw"),
    ("Haymaker Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", _UP, "cw"),
    ("The Untouchables", "Aromatic", "Virginia, Black Cavendish", "Ready Rubbed", "Lata de 50 g · lata de 100 g", _UP + " Creada con el ilustrador Michael Apitz.", "sp"),
    ("Moroccan Bazaar", "Aromatic", "Black Cavendish, Virginia", "Ribbon", "Lata de 50 g", _UP, "tr"),
    ("Sunset Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", _UP, "cw"),
    ("Brullende Leeuw", "English", "Black Cavendish, Latakia, Orientals, Perique, Virginia", "Ribbon", "Lata de 100 g", _PRF, "tr"),
    ("Geniet Moment", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Lata de 100 g", _PRF, "tr"),
    ("Janneman Flake", "Virginia", "Virginia, Perique", "Flake", "Lata de 100 g", _PRF, "cw"),
    ("Hadde's Best Irish", "", "Virginia, Perique, Kentucky", "Broken Flake", "Lata de 100 g", _HO + " Aroma floral.", "cw"),
    ("My Red Fox", "Virginia", "Virginia", "Ready Rubbed", "Lata de 50 g", _HO, "cw"),
    ("Old Fredder's Broken Flake", "Virginia", "Virginia, Perique", "Broken Flake", "Lata de 100 g", _HO, "cw"),
    ("Raiko InBeTween", "English", "Virginia, Burley, Black Cavendish, Latakia", "Ribbon", "Lata de 50 g", _HO + " Aroma de chocolate.", "cw"),
    ("Dark Moor", "Virginia", "Virginia, Perique, Burley", "Ribbon", "Lata de 50 g · lata de 100 g", _PE, "sp"),
    ("Dark Sea", "English", "Virginia, Latakia, Perique, Dark Fired Kentucky, Burley", "Ribbon", "Lata de 50 g · lata de 100 g", _PE + " Aroma de ron y anís.", "sp"),
    ("Nebari", "", "Virginia, Burley, Perique", "Ribbon", "Lata de 50 g · lata de 100 g", _PE, "catálogo HU"),
    ("Night Owl", "Burley", "Virginia, Perique, Burley", "Broken Flake", "Lata de 50 g · lata de 100 g", _PE, "sp"),
]

# ---------------------------------------------------------------- Solani
PAIS["Solani"] = "Alemania"
FUENTES["Solani"] = "cigarworld.de (Solani Collection), Smokingpipes y la ficha del importador Monjure International (oct. 2026)"
_SO = "Mezcla de Rüdiger Will."
MARCAS["Solani"] = [
    ("Aged Burley Flake 656", "Burley", "Burley, Cigar, Kentucky", "Flake", "Lata de 50 g", _SO, "cw"),
    ("Blau 369", "Aromatic", "Virginia, Burley, Black Cavendish, Perique", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Aroma afrutado y de miel.", "cw y Monjure"),
    ("Festival 333", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Aroma afrutado.", "cw"),
    ("Gold 779", "English", "Virginia, Latakia, Orientals", "Ribbon", "Lata de 50 g", _SO, "cw"),
    ("Grün 127", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Un toque de manzana.", "cw y Monjure"),
    ("Rot 131", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Esencias tropicales y un toque de whisky de malta.", "cw y Monjure"),
    ("Silver Flake 660", "Virginia", "Kentucky, Virginia", "Flake", "Lata de 100 g", _SO, "tr"),
    ("Virginia Flake 633", "Virginia", "Virginia, Perique", "Flake", "Lata de 50 g · lata de 100 g", _SO, "Monjure"),
    ("White & Black 763", "English", "Virginia, Latakia, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO, "sp"),
    ("X-Mystery 113", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO, "sp"),
]

# ---------------------------------------------------------------- Reiner
PAIS["Reiner"] = "Alemania"
FUENTES["Reiner"] = "cigarworld.de (Reiner Pfeifentabak) y Tobacco Reviews (oct. 2026)"
_RE = "La elabora Kohlhase & Kopp."
MARCAS["Reiner"] = [
    ("Blend 12 (Gelb)", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 50 g", _RE + " Aroma de vainilla.", "cw"),
    ("Blend 25 (Grün)", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _RE + " Aroma de frutos secos.", "cw"),
    ("Blend 36 (Blau)", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _RE + " Aroma de miel.", "cw"),
    ("Blend 51 (Rot)", "English", "Virginia, Black Cavendish, Latakia, Kentucky", "Ribbon", "Lata de 50 g · lata de 100 g", _RE, "cw"),
    ("Long Golden Flake (Blend 71)", "Virginia/Perique", "Burley, Perique, Virginia", "Flake", "", _RE + " Aroma de miel y naranja.", "tr"),
    ("Professional", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 100 g", _RE + " Aroma afrutado.", "cw"),
]

# ---------------------------------------------------------------- Bentley
PAIS["Bentley"] = ""
FUENTES["Bentley"] = "cigarworld.de (Bentley Pfeifentabak, oct. 2026)"
_BE = "Bolsa de 50 g · lata de 100 g"
MARCAS["Bentley"] = [
    ("B13 Pipe Tobacco", "Aromatic", "Virginia, Burley, Orientals", "Ribbon", "Lata de 100 g", "Aroma afrutado.", "cw"),
    ("The Classic One", "Virginia", "Virginia", "Ready Rubbed", _BE, "", "cw"),
    ("The London Carmine", "English", "Virginia, Latakia, Orientals, Kentucky", "Ribbon", _BE, "Antes se llamaba The London Pine.", "cw"),
    ("The Oriental Amber", "English", "Virginia, Orientals, Perique", "Ribbon", _BE, "", "cw"),
    ("The Planters Purpure", "Aromatic", "Virginia, Black Cavendish", "Ribbon", _BE, "Aroma afrutado.", "cw"),
    ("The Royal Gold", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", _BE, "Aroma de vainilla. Antes se llamaba Royal Vanilla.", "cw"),
    ("The Virginia Ruby", "Aromatic", "Virginia, Black Cavendish", "Ribbon", _BE, "Aroma de vainilla. Antes se llamaba Virginia Honey.", "cw"),
]

# ---------------------------------------------------------------- Ilsted
PAIS["Ilsted"] = ""
FUENTES["Ilsted"] = "cigarworld.de (Ilsted's Own, oct. 2026) y Tobacco Reviews"
_IL = "Marca del pipero danés Poul Ilsted."
MARCAS["Ilsted"] = [
    ("Cedros", "Aromatic", "Black Cavendish, Burley, Kentucky, Virginia", "Ribbon", "Lata de 50 g", _IL + " Aroma de frutos secos; viene en caja de cedro.", "cw"),
    ("Golden Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", _IL, "cw"),
    ("Own Mixture No. 55", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 100 g", _IL + " Aroma afrutado.", "cw"),
    ("Own Mixture No. 66", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 100 g", _IL + " Aroma de vainilla.", "cw"),
    ("Own Mixture No. 77", "Aromatic", "Burley, Cavendish, Virginia", "Ribbon", "Lata de 100 g", _IL, "tr"),
    ("Own Mixture No. 88", "English", "Virginia, Latakia, Kentucky", "Ribbon", "Lata de 100 g", _IL, "cw"),
    ("Own Mixture No. 99", "Aromatic", "Black Cavendish, Burley, Orientals, Virginia", "Ribbon", "Lata de 100 g", _IL + " Aroma de caramelo.", "cw"),
    ("Own Mixture No. 100", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 100 g", _IL + " Aroma afrutado.", "cw"),
]

# ---------------------------------------------------------------- Winsløw
PAIS["Winsløw"] = ""
FUENTES["Winsløw"] = "cigarworld.de (Poul Winslow Pfeifentabak, oct. 2026)"
_WI = "Marca del pipero danés Poul Winsløw."
MARCAS["Winsløw"] = [
    ("Harlekin", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 100 g", _WI + " Aroma afrutado.", "cw"),
    ("No. 1", "Aromatic", "Black Cavendish", "Ribbon", "Lata de 100 g", _WI + " Aroma de vainilla.", "cw"),
    ("No. 2", "Aromatic", "Virginia, Black Cavendish, Burley", "Ribbon", "Lata de 100 g", _WI + " Notas de licor de nuez y piña caramelizada.", "cw"),
    ("No. 3", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 100 g", _WI + " Notas de vainilla, almendra y champán.", "cw"),
]

# ---------------------------------------------------------------- Robert Lewis
PAIS["Robert Lewis"] = ""
FUENTES["Robert Lewis"] = "cigarworld.de (Robert Lewis Pfeifentabak) y Smokingpipes (oct. 2026)"
_RL = "Mezcla de la tienda londinense Robert Lewis."
MARCAS["Robert Lewis"] = [
    ("123 Mixture", "English", "Virginia, Black Cavendish, Latakia, Orientals", "Ribbon", "Lata de 50 g", _RL, "cw"),
    ("Orcilla Mixture", "Virginia", "Virginia, Latakia, Perique, Orientals", "Ribbon", "Lata de 50 g", _RL, "sp"),
    ("Tree Mixture", "English", "Virginia, Black Cavendish, Latakia, Orientals", "Ribbon", "Lata de 50 g", _RL, "cw"),
    ("Wingfield Mixture", "English", "Virginia, Black Cavendish, Latakia", "Ribbon", "Lata de 50 g", _RL, "cw"),
]

# ---------------------------------------------------------------- Ermuri
PAIS["Ermuri"] = ""
FUENTES["Ermuri"] = "cigarworld.de (Ermuri Pfeifentabak, oct. 2026)"
_ER = "Marca de Ermuri, cooperativa de estancos alemanes con sede en Detmold."
MARCAS["Ermuri"] = [
    ("Ermuri Tipp", "Aromatic", "Virginia, Burley, Orientals", "Ribbon", "Lata de 250 g", _ER + " Aroma de miel.", "cw"),
    ("Euro Mixture", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Bolsa de 250 g", _ER + " Aroma de vainilla.", "cw"),
    ("No Name No. 1", "English", "Virginia, Burley, Latakia", "Ribbon", "Bolsa de 100 g", _ER, "cw"),
    ("No Name No. 2", "Aromatic", "Virginia, Burley, Orientals", "Ribbon", "Bolsa de 100 g", _ER + " Aroma de caramelo.", "cw"),
    ("No Name No. 3", "", "", "", "Bolsa de 100 g", _ER, ""),
]

# ---------------------------------------------------------------- Gladora
PAIS["Gladora"] = "Turquía"
FUENTES["Gladora"] = "cigarworld.de (Gladora Pesse Canoe), Smokingpipes y Tobacco Reviews (oct. 2026)"
_GL = "De la serie Pesse Canoe, hecha solo con tabaco cultivado en Turquía."
MARCAS["Gladora"] = [
    ("Pesse Canoe Blue Pearl", "Aromatic", "Orientals, Virginia", "Flake", "Lata de 50 g", _GL + " Aroma de chocolate.", "tr"),
    ("Pesse Canoe Latakia Flake 20", "English", "Virginia, Latakia, Orientals", "Flake", "Lata de 50 g", _GL + " Latakia turca.", "sp"),
    ("Pesse Canoe Latakia Flake 40", "English", "Virginia, Latakia, Orientals", "Flake", "Lata de 50 g", _GL + " Latakia turca; más proporción que la Flake 20.", "cw"),
    ("Pesse Canoe Neon Pearl", "Aromatic", "Burley, Orientals, Virginia", "Flake", "Lata de 50 g", _GL + " Aroma de fruta seca y vainilla.", "cw"),
    ("Pesse Canoe Oriental Flake", "Virginia", "Virginia, Orientals", "Flake", "Lata de 50 g", _GL, "cw"),
    ("Pesse Canoe Purple Pearl", "Aromatic", "Orientals", "Flake", "Lata de 50 g", _GL + " Aroma afrutado y de vainilla.", "cw"),
]

# ---------------------------------------------------------------- Per G. Jensen
PAIS["Per G. Jensen"] = "Estados Unidos"
FUENTES["Per G. Jensen"] = "Smokingpipes y cigarworld.de (Legacy Collection, oct. 2026)"
_PJ = "De la Legacy Collection, creada por el maestro mezclador danés Per Georg Jensen y elaborada por Cornell & Diehl."
MARCAS["Per G. Jensen"] = [
    ("Brothers in Arms", "Burley", "Virginia, Perique, Dark Fired Kentucky, Burley, Orientals", "Ribbon", "Lata de 50 g", _PJ, "sp"),
    ("Harbour Dreams", "Aromatic", "Virginia, Burley", "Broken Flake", "Lata de 50 g", _PJ, "sp"),
    ("King's Watch", "Virginia", "Virginia", "Flake", "Lata de 50 g", _PJ, "sp"),
    ("Port Guardian", "Virginia", "Virginia", "Flake", "Lata de 50 g", _PJ, "sp"),
]

# ---------------------------------------------------------------- Thomas Radford
PAIS["Thomas Radford"] = "Alemania"
FUENTES["Thomas Radford"] = "cigarworld.de (Thomas Radford Pfeifentabak, oct. 2026)"
_TR = "La elabora Pöschl en Baviera."
MARCAS["Thomas Radford"] = [
    ("Caribbean Blend", "Aromatic", "Virginia, Burley", "Ribbon", "Bolsa de 50 g · lata de 200 g", _TR + " Aroma de frutos secos.", "cw"),
    ("Scottish", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Bolsa de 50 g · lata de 200 g", _TR + " Aroma de miel.", "cw"),
    ("Sundays Fantasy", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Bolsa de 50 g · lata de 100 g", _TR + " Aroma afrutado.", "cw"),
]

# ---------------------------------------------------------------- Sillems
PAIS["Sillems"] = ""
FUENTES["Sillems"] = "cigarworld.de (Sillems Pfeifentabak, oct. 2026)"
_SI = "La distribuye Kohlhase & Kopp."
MARCAS["Sillems"] = [
    ("Blau", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Caja de 100 g", _SI + " Aroma de caramelo.", "cw"),
    ("Grün", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Caja de 100 g", _SI + " Aroma de frutos secos y piña colada.", "cw"),
    ("Linea Epoque Antique", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 100 g", _SI + " Aroma de vainilla, ciruela mirabel y capuchino.", "cw"),
    ("Rot", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Caja de 100 g", _SI + " Aroma de cereza.", "cw"),
    ("Schwarz", "English", "Virginia, Burley, Black Cavendish, Latakia", "Ribbon", "Caja de 100 g", _SI + " Mucha latakia; aroma de ciruela mirabel y vainilla.", "cw"),
]

# ---------------------------------------------------------------- Kentucky Bird, Prestige, Richmond
PAIS["Kentucky Bird"] = ""
FUENTES["Kentucky Bird"] = "cigarworld.de (oct. 2026)"
MARCAS["Kentucky Bird"] = [
    ("Kentucky Bird", "Aromatic", "Virginia, Burley", "Ribbon", "Bolsa de 50 g · lata de 100 g · lata de 200 g", "La importa Scandinavian Tobacco Group. Aroma afrutado.", "cw"),
]
PAIS["Prestige"] = "Dinamarca"
FUENTES["Prestige"] = "cigarworld.de (oct. 2026)"
MARCAS["Prestige"] = [
    ("Regular Mixture", "", "Virginia, Burley, Kentucky", "Ready Rubbed", "Bolsa de 50 g",
     "La elabora Scandinavian Tobacco Group en Dinamarca. Prensada al modo cavendish y desmenuzada; sin aroma destacado.", "cw"),
]
PAIS["Richmond"] = ""
FUENTES["Richmond"] = "cigarworld.de (oct. 2026)"
MARCAS["Richmond"] = [
    ("Navy Cut (Flake)", "Virginia", "Virginia", "Flake", "Lata de 50 g", "Virginia madurada y prensada, sin aroma marcado.", "cw"),
]

# ---------------------------------------------------------------- Kopp (Kohlhase & Kopp): series nuevas
# La marca Kopp ya existe (Caribbean Blue). Se añaden las series que cigarworld tiene en catálogo
# y no son ediciones limitadas o anuales: Kopp Wood (Woodland) y Kopp Pfeifentabak.
PAIS["Kopp"] = "Alemania"
FUENTES["Kopp"] = "cigarworld.de (Kopp Wood y Kopp Pfeifentabak), pipehouse.de, tabakguru.de, peterheinrichs.de, rauch-lounge.com y Tobacco Reviews (oct. 2026)"
_KW = "Forma parte de la serie Kopp Wood, de Kohlhase & Kopp: cada mezcla lleva el aroma de una madera."
MARCAS["Kopp"] = [
    ("Cremon Mixture", "English", "Latakia, Virginia", "Ribbon", "Lata de 50 g · lata de 200 g", "La elabora Kohlhase & Kopp.", "cw"),
    ("Pipe 66", "Aromatic", "Black Cavendish, Virginia", "Ribbon", "Lata de 100 g", "La elabora Kohlhase & Kopp. Aroma de licor.", "tr (No. 66)"),
    ("Wood I", "English", "Black Cavendish, Kentucky, Virginia, Latakia, Orientals, Perique", "Ribbon", "Lata de 50 g", _KW + " Madera de Limousin.", "pipehouse.de"),
    ("Wood II", "English", "Virginia, Orientals, Latakia, Black Cavendish, Kentucky, Perique", "Ribbon", "Lata de 50 g", _KW + " Madera de limonero.", "tabakguru.de"),
    ("Wood III", "English", "Virginia, Burley, Orientals, Latakia", "Ribbon", "Lata de 50 g", _KW + " Madera de cedro.", "peterheinrichs.de"),
    ("Wood IV", "English", "Latakia, Orientals, Virginia, Burley, Perique", "Ribbon", "Lata de 50 g", _KW + " Madera de incienso.", "rauch-lounge.com"),
    ("Wood V", "English", "Latakia, Orientals, Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g", _KW + " Madera de guayaco.", "rauch-lounge.com"),
    ("Wood VI", "Aromatic", "Virginia, Orientals, Burley, Kentucky, Perique", "Ribbon", "Lata de 50 g", _KW + " Madera de sándalo.", "pipehouse.de"),
]

# ---------------------------------------------------------------- Käpt'n Barsdorfs Bester (Joh. Wilh. von Eicken)
PAIS["Käpt'n Barsdorfs Bester"] = "Alemania"
FUENTES["Käpt'n Barsdorfs Bester"] = "cigarworld.de (oct. 2026). Las demás variantes están como Restbestand o agotadas."
MARCAS["Käpt'n Barsdorfs Bester"] = [
    ("Bright Virginia", "Virginia", "Virginia", "Ribbon", "Lata de 160 g",
     "La elabora Joh. Wilh. von Eicken en Lübeck. Antes se llamaba Black Virginia.", "cw"),
]

# ---------------------------------------------------------------- Exclusiv (Pöschl)
PAIS["Exclusiv"] = "Alemania"
FUENTES["Exclusiv"] = "cigarworld.de (Exclusiv Pfeifentabak, oct. 2026)"
_EX = "La elabora Pöschl en Baviera."
MARCAS["Exclusiv"] = [
    ("Mixture No. 1", "Dutch-style", "Virginia, Burley, Orientals", "Cube Cut", "Bolsa de 50 g · lata de 100 g · lata de 200 g", _EX + " Sin aromatizar.", "cw (Holländisch)"),
    ("Mixture No. 2", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Bolsa de 50 g · lata de 200 g", _EX + " Aroma afrutado.", "cw"),
    ("Mixture No. 3", "Dutch-style", "Virginia, Burley, Orientals", "Ribbon", "Bolsa de 50 g", _EX + " Aroma de miel.", "cw (Holländisch)"),
    ("Mixture No. 4", "Dutch-style", "Virginia, Burley, Orientals", "Ribbon", "Bolsa de 50 g · lata de 200 g", _EX + " Base de cavendish, sin aromatizar.", "cw (Holländisch)"),
    ("Mixture No. 5", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Bolsa de 50 g", _EX + " Aroma de miel.", "cw"),
    ("Mixture No. 6", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Bolsa de 50 g · lata de 100 g · lata de 200 g", _EX + " Aroma afrutado.", "cw"),
    ("Mixture No. 7", "Aromatic", "Black Cavendish", "Ribbon", "Lata de 200 g", _EX + " Aroma de ron de Jamaica y ciruela.", "cw"),
]
_MM = "Forma parte de las Meistermischungen de Kopp Tobaccos (Kohlhase & Kopp, Rellingen)."
MARCAS["Kopp"] += [
    ("Meistermischung Nr. 11", "Aromatic", "", "", "Lata de 100 g", _MM + " Aroma de miel, ron y ciruela.", "cw y rauch-lounge.com (aroma)"),
    ("Meistermischung Nr. 22", "Aromatic", "", "", "Lata de 100 g", _MM + " Aroma de cereza.", "cw y rauch-lounge.com (aroma)"),
    ("Meistermischung Nr. 33", "Aromatic", "", "", "Lata de 100 g", _MM + " Aroma de vainilla y café.", "cw y rauch-lounge.com (aroma)"),
    ("Meistermischung Nr. 44", "Aromatic", "", "", "Lata de 100 g", _MM + " Aroma de frutos del bosque.", "cw y rauch-lounge.com (aroma)"),
    ("Meistermischung Nr. 55", "Aromatic", "", "", "Lata de 100 g", _MM + " Aroma de maracuyá.", "cw y rauch-lounge.com (aroma)"),
    ("Meistermischung Nr. 66", "", "", "", "Lata de 100 g", _MM, "cw"),
    ("Meistermischung Nr. 77 Englisch sanft", "English", "", "", "Lata de 100 g", _MM + " Inglesa suave, según su nombre.", "cw (nombre)"),
    ("Meistermischung Nr. 88 Virginia Flake", "Virginia", "Virginia", "Flake", "Lata de 100 g", _MM, "cw (nombre)"),
    ("Meistermischung Nr. 99 Englisch", "English", "", "", "Lata de 100 g", _MM + " Inglesa, según su nombre.", "cw (nombre)"),
    ("Meistermischung Nr. 110", "Aromatic", "", "", "Lata de 100 g", _MM + " Aroma de naranja, vainilla y licor de almendra.", "cw y rauch-lounge.com (aroma)"),
]

# ---------------------------------------------------------------- Pfeifendepot (marca de la casa)
# Tienda Gerd Jansens Pfeifendepot. No está en Smokingpipes ni en cigarworld: se usa la ficha de su
# propia web (Typ, Blätter, Schnitt, Aromatisierung), como con Watch City. El usuario pegó las URLs.
PAIS["Pfeifendepot"] = "Alemania"
FUENTES["Pfeifendepot"] = "pfeifendepot.de (fichas de cada mezcla de Pfeifendepot Tobaccos, oct. 2026)"
_PD = "Mezcla de la casa de la tienda Gerd Jansens Pfeifendepot."
_PDC = _PD + " Forma parte de la Copenhagen Line."
_PDF = _PD + " Forma parte de la línea Flakes & Co."
MARCAS["Pfeifendepot"] = [
    ("No. 032 – Extra White", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 100 g", _PD + " Aroma afrutado y dulce.", "pfeifendepot"),
    ("No. 034", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 100 g", _PD + " Aroma de caramelo y vainilla.", "pfeifendepot"),
    ("No. 037 – Copenhagen Curlies", "Aromatic", "Virginia, Cavendish", "Coins", "Lata de 50 g · lata de 100 g · 500 g a granel", _PDC + " Aroma de coñac.", "pfeifendepot"),
    ("No. 038 – Copenhagen B", "Virginia", "Virginia", "Ready Rubbed", "Lata de 100 g", _PDC + " Tres virginias suaves, prensadas durante semanas.", "pfeifendepot"),
    ("No. 041 – Fiesta", "Aromatic", "Virginia, Black Cavendish, Burley", "Ribbon", "Lata de 100 g · lata de 200 g", _PD + " Aroma de ciruela mirabel y vainilla.", "pfeifendepot"),
    ("No. 045 – Copenhagen Ø", "English", "Latakia, Black Cavendish, Kentucky, Perique", "", "Lata de 100 g", _PDC + " Mucha latakia y cavendish, con algo de hoja de Maryland.", "pfeifendepot"),
    ("No. 047", "Aromatic", "Burley, Cavendish, Virginia", "Ribbon", "Lata de 100 g", _PD + " Aroma de arce, miel y vainilla.", "pfeifendepot"),
    ("No. 056 – Cremon", "English", "Latakia, Orientals, Virginia", "Ribbon", "Lata de 50 g", _PD + " Una cuarta parte de tabacos especiados, sobre todo latakia.", "pfeifendepot"),
    ("No. 057 – V-Cubes", "Aromatic", "Burley, Cavendish, Virginia", "Cube Cut", "Lata de 50 g · lata de 100 g · lata de 200 g", _PD + " Aroma de vainilla oscura.", "pfeifendepot"),
    ("No. 064 – Rosemoor", "Aromatic", "Virginia, Burley", "Ribbon", "Lata de 100 g", _PD + " Aroma floral de aceite de rosa.", "pfeifendepot (Lakeland)"),
    ("No. 066 – Fredensborg White", "Aromatic", "Burley, Cavendish, Orientals, Perique, Virginia", "Ribbon", "Lata de 100 g", _PD + " Aroma de vainilla, nuez y uva.", "pfeifendepot"),
    ("No. 070 – Flake Cut", "Virginia", "Virginia", "Flake", "Lata de 50 g · lata de 100 g · lata de 200 g · 500 g a granel", _PDF + " Tres virginias madurados dos años en barriles de zinc.", "pfeifendepot"),
    ("No. 079 – Gerd Jansens Scottish", "Scottish", "Virginia, Orientals", "Ribbon", "Lata de 50 g", _PD, "pfeifendepot"),
    ("No. 080 – Gerd Jansens English", "English", "Orientals, Virginia, Latakia", "Ribbon", "Lata de 50 g", _PD, "pfeifendepot"),
    ("No. 081 – Golden Balkan", "English", "Cavendish, Kentucky, Latakia, Perique, Virginia", "Ribbon", "Lata de 50 g · lata de 100 g", _PD + " Mucha latakia.", "pfeifendepot"),
    ("No. 088 – DSK Flake", "Virginia", "Kentucky, Virginia", "Flake", "Lata de 50 g · 500 g a granel", _PDF + " Prensado en tortas claras y oscuras.", "pfeifendepot"),
    ("No. 209 – White Balkan", "English", "Virginia, Black Cavendish, Latakia, Orientals", "Ribbon", "Lata de 100 g", _PD + " La elabora Kopp Tobaccos.", "pfeifendepot"),
]
_PDM = _PD + " Forma parte de la serie Masterblend."
_PDG = _PD + " Forma parte de la miniserie The Good, The Bad & The Ugly."
MARCAS["Pfeifendepot"] += [
    ("No. 089 – DSK Ready Rubbed", "Virginia", "Kentucky, Virginia", "Ready Rubbed", "Lata de 50 g", _PDF + " Versión desmenuzada de la DSK Flake.", "pfeifendepot"),
    ("No. 090 – Merlin Cut Plug", "Virginia/Perique", "Kentucky, Perique, Virginia", "Plug", "Lata de 50 g · 500 g a granel", _PDF + " Virginia oscuro con kentucky curado al fuego y perique.", "pfeifendepot"),
    ("No. 091 – Camelot Broken", "Virginia/Perique", "Kentucky, Perique, Virginia", "Broken Flake", "Lata de 50 g", _PDF + " Versión desmenuzada de la Merlin Cut Plug.", "pfeifendepot"),
    ("No. 098 – Copenhagen 1970", "Aromatic", "Cavendish, Perique, Virginia", "Ribbon", "Lata de 100 g", _PDC + " Lleva también hoja de Maryland; aroma afrutado y de chocolate, suave.", "pfeifendepot"),
    ("No. 101 – Copenhagen Dannebrog", "Aromatic", "Cavendish, Orientals, Virginia", "Ready Rubbed", "Lata de 100 g", _PDC + " Aroma de ron.", "pfeifendepot"),
    ("No. 125 – 125 Years Jubilee", "Virginia", "Virginia, Orientals, Cigar, Kentucky, Perique, Burley", "Ribbon", "Lata de 50 g", _PD + " Mezcla del 125 aniversario de la tienda, sin aromatizar.", "pfeifendepot"),
    ("No. 200 – Bengals", "English", "Cavendish, Latakia, Perique, Virginia", "Ready Rubbed", "Lata de 50 g", _PDF + " Homenaje a las Bengal Slices.", "pfeifendepot"),
    ("No. 202 – Crown „A“", "Balkan", "Latakia, Kentucky, Virginia, Orientals", "Ribbon", "Lata de 50 g", _PD + " Un 70 % de latakia, con kentucky de base y solo un 5 % de virginia.", "pfeifendepot (English)"),
    ("No. 411 – Masterblend", "Aromatic", "Black Cavendish, Virginia", "Ribbon", "Lata de 100 g", _PDM + " Aroma de miel, ron y ciruela.", "pfeifendepot"),
    ("No. 422 – Masterblend", "Aromatic", "Cavendish, Virginia", "Ribbon", "Lata de 100 g", _PDM + " Aroma de cereza.", "pfeifendepot"),
    ("No. 433 – Masterblend", "Aromatic", "Black Cavendish, Virginia", "Ribbon", "Lata de 100 g", _PDM + " Aroma de vainilla y café.", "pfeifendepot"),
    ("No. 444 – Masterblend", "Aromatic", "Black Cavendish, Virginia, Burley", "Ribbon", "Lata de 100 g", _PDM + " Aroma de frutos del bosque.", "pfeifendepot"),
    ("No. 455 – Masterblend", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Lata de 100 g", _PDM + " Aroma de maracuyá y ciruela mirabel.", "pfeifendepot"),
    ("No. 466 – Masterblend", "Aromatic", "Black Cavendish, Virginia, Burley", "Ribbon", "Lata de 100 g", _PDM + " Aroma de frutas tropicales.", "pfeifendepot"),
    ("No. 477 – Masterblend", "English Aromatic", "Virginia, Black Cavendish, Latakia", "Ribbon", "Lata de 100 g", _PDM + " Aroma de miel con un fondo ahumado de latakia.", "pfeifendepot"),
    ("No. 499 – Masterblend", "Aromatic", "Black Cavendish, Virginia", "Ribbon", "Lata de 100 g", _PDM + " Aroma de ciruela mirabel.", "pfeifendepot"),
    ("No. 500 – Kori-Flake", "Virginia", "Virginia", "Flake", "Lata de 100 g", _PDF + " Prensado tres meses; con una nota de cilantro.", "pfeifendepot"),
    ("No. 501 – The Good", "Oriental", "Orientals, Virginia, Burley, Black Cavendish", "Ready Rubbed", "Lata de 50 g", _PDG + " Virginia y oriental de Esmirna, ligera, sin aromatizar.", "pfeifendepot"),
    ("No. 502 – The Bad", "Virginia/Perique", "Virginia, Perique, Kentucky", "Ready Rubbed", "Lata de 50 g", _PDG + " Sin aromatizar.", "pfeifendepot"),
    ("No. 503 – The Ugly", "English Aromatic", "Burley, Latakia, Virginia", "Ribbon", "Lata de 50 g", _PDG + " Aroma de higo y anís.", "pfeifendepot"),
    ("No. 999 – Curly Cut", "Virginia", "Cavendish, Kentucky, Virginia", "Coins", "Lata de 50 g · lata de 100 g", _PDF + " Un toque discreto de miel de bosque.", "pfeifendepot"),
    ("VAPERizer (Plug)", "Virginia/Perique", "Virginia, Perique", "Plug", "Lata de 100 g", _PDF + " Sin aromatizar.", "pfeifendepot"),
]

# ---------------------------------------------------------------- Kontor-Tabak (marca de la casa)
PAIS["Kontor-Tabak"] = "Alemania"
FUENTES["Kontor-Tabak"] = "tabak-kontor.de (listado y fichas de KONTOR-TABAK, oct. 2026)"
_KT = "Mezcla de la casa de la tienda TABAK-KONTOR de Leipzig."
MARCAS["Kontor-Tabak"] = [
    ("No. 3", "Virginia", "Virginia", "Ready Rubbed", "Lata de 100 g", _KT + " Cinco virginias rojas sin aromatizar; algún lote ha salido en flake.", "tabak-kontor"),
    ("No. 5", "English", "Latakia, Perique, Black Cavendish, Virginia", "", "Lata de 100 g", _KT, "tabak-kontor"),
    ("No. 6", "Oriental", "Orientals, Virginia, Burley", "", "Lata de 100 g", _KT + " Predomina el tabaco turco; sin aromatizar.", "tabak-kontor"),
    ("No. 20", "Aromatic", "Virginia, Black Cavendish, Burley", "", "Lata de 50 g · lata de 100 g", _KT + " Aroma de vainilla y miel, de estilo danés.", "tabak-kontor"),
    ("No. 27", "Aromatic", "Black Cavendish, Virginia", "", "Lata de 100 g", _KT + " Aroma de grosella negra.", "tabak-kontor"),
    ("No. 28", "Aromatic", "Black Cavendish, Burley, Virginia", "", "Lata de 100 g", _KT + " Aroma de frambuesa silvestre, vino blanco y un toque de vainilla.", "tabak-kontor"),
    ("No. 33", "Virginia", "Virginia", "", "Lata de 100 g", _KT + " La misma mezcla que la No. 3, madurada el triple de tiempo.", "tabak-kontor"),
]

# ---------------------------------------------------------------- Lista oficial española (25/10)
# Mezclas de la lista de precios del CMT (picadura de pipa, 1 oct. 2026) que no tenían ficha.
# Entran por estar a la venta en España aunque Smokingpipes o cigarworld no las tengan
# (Borkum Riff, Clan Raw Blend, Mac Baren Mixture Flake y Rainer Barbi). Fuente de los datos:
# Tobacco Reviews (tr), Smokingpipes (sp) o cigarworld (cw). Todas llevan la marca de España.
PAIS.update({"Borkum Riff": "Dinamarca", "Clan": "Dinamarca", "Peterson": "Irlanda",
             "Samuel Gawith": "Reino Unido", "Gawith Hoggarth": "Reino Unido",
             "W.Ø. Larsen": "Dinamarca", "Dan Tobacco": "Alemania", "STG": "Dinamarca"})
MARCAS["Borkum Riff"] = [
    ("Champagne", "Aromatic", "Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Aromatizada con licor.", "tr"),
    ("Copper", "Aromatic", "Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de whisky de malta.", "tr"),
    ("Orange", "Aromatic", "Burley, Kentucky, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de naranja y miel.", "tr"),
    ("Scandinavian Mixture", "Aromatic", "Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de chocolate y vainilla.", "tr"),
    ("Special Mixture No. 8", "Aromatic", "Black Cavendish, Burley, Cavendish, Kentucky, Orientals, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de vainilla.", "tr"),
]
MARCAS["Clan"] = [
    ("Raw Blend", "Burley", "Burley, Kentucky, Virginia", "Ready Rubbed", "Bolsa de 40 g", "Sin aromatizar.", "tr (Burley Based)"),
]
MARCAS["Peterson"] = [
    ("1865 Mixture", "English", "Virginia, Latakia", "Ribbon", "Lata de 100 g", "", "sp"),
    ("Gold Blend", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g", "", "sp"),
]
MARCAS["Samuel Gawith"] = [
    ("Celtic Talisman", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Lata de 50 g", "Aroma de licor de cereza y vainilla.", "tr"),
]
MARCAS["W.Ø. Larsen"] = [
    ("Classic", "Aromatic", "Black Cavendish, Virginia", "Ribbon", "Lata de 100 g", "Aroma de higo.", "tr"),
    ("Golden Dream", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Lata de 50 g", "Forma parte de la serie Masters Blend. Aroma de arce.", "tr"),
    ("Mellow & Tasty", "Aromatic", "Black Cavendish, Burley, Virginia", "", "Bolsa de 50 g", "Aroma dulce de melaza.", "tr"),
    ("A True Delight", "English Aromatic", "Virginia, Burley, Black Cavendish, Latakia", "", "Bolsa de 50 g", "Aroma de vainilla con un toque de latakia.", "cw"),
    ("Simply Unique", "Aromatic", "Virginia, Burley, Black Cavendish", "", "Bolsa de 50 g", "Aroma suave de nuez y vainilla.", "cw"),
]
MARCAS["Dan Tobacco"] = [
    ("Choo Choo Train", "Virginia", "Virginia", "Flake", "Lata de 50 g · bolsa de 250 g", "Un toque de miel.", "cw"),
    ("Rainer Barbi", "Aromatic", "Virginia, Black Cavendish", "", "Lata de 50 g", "Aroma de frutos secos.", "cw"),
]
MARCAS["STG"] = [
    ("Mixture Flake", "Aromatic", "Virginia, Burley, Black Cavendish, Kentucky", "Flake", "Lata de 100 g", "Marca Mac Baren. Aroma de miel.", "cw"),
]

# ---------------------------------------------------------------- TAK – Tabak aus Kiel (marca de la casa)
# Fuente: fichas de dein-tabak.de (HAUSMARKE – TAK), oct. 2026. Solo las que se pudieron leer y tienen
# precio. Familia según la categoría de la tienda («naturbelassen», «mit Latakia», «leicht aromatisiert»)
# y los componentes que da la ficha; vacía si no está clara. Fuera: Sailing City 2.0 (sin precio),
# Nice Plug y Micha's Cake (Restbestand 2025). Pendientes de leer: ver claude/traspaso-marcas-alemanas.md.
PAIS["TAK"] = "Alemania"
FUENTES["TAK"] = "dein-tabak.de (fichas de la marca de la casa TAK – Tabak aus Kiel, oct. 2026)"
_TAK = "Mezcla de la casa de la tienda Dein-Tabak de Kiel."
MARCAS["TAK"] = [
    ("L48", "Aromatic", "Virginia, Black Cavendish", "", "Lata de 100 g", _TAK + " De estilo danés, ligeramente aromatizada, con virginia en curly hilado a mano.", "dein-tabak"),
    ("M70", "Aromatic", "Virginia, Burley, Black Cavendish", "", "Lata de 100 g", _TAK + " De estilo danés, ligeramente aromatizada, con notas de fruta seca.", "dein-tabak"),
    ("M74", "Virginia", "Virginia, Perique, Cavendish", "", "Lata de 100 g", _TAK + " Virginias con un toque de perique; sin aromatizar.", "dein-tabak"),
    ("16/5 Der Neue", "Virginia", "Virginia, Burley, Perique", "Coins", "Lata de 100 g · 200 g", _TAK + " Virginias claras y dark fired en curly; sin aromatizar.", "dein-tabak"),
    ("Typ 3/2 – Danish Blend 2.0", "Aromatic", "Virginia, Black Cavendish", "", "200 g", _TAK + " De estilo danés, suave y ligeramente aromatizada.", "dein-tabak"),
    ("Virginia Crumble Cake", "Virginia", "Virginia", "Cake", "100 g", _TAK + " Sin aromatizar.", "dein-tabak"),
    ("Salvo's 2.0", "Virginia", "Virginia", "Broken Flake", "Lata de 100 g", _TAK + " Varias virginias, entre ellas dark fired; sin aromatizar.", "dein-tabak"),
    ("Old School", "", "Virginia, Black Cavendish, Burley", "", "Lata de 100 g", _TAK + " Sin aromatizar.", "dein-tabak"),
    ("Orient Esprex", "Oriental", "Orientals, Virginia, Perique", "", "Lata de 100 g", _TAK + " Un 50 % de tabaco oriental; sin aromatizar.", "dein-tabak"),
    ("Herbst 84", "English", "Virginia, Orientals, Latakia", "", "Lata de 100 g · lata de 200 g", _TAK + " Inglesa suave.", "dein-tabak"),
    ("Evening Latakia", "English", "Orientals, Latakia", "", "Lata de 100 g", _TAK + " Tabaco macedonio con un 45 % de latakia.", "dein-tabak"),
    ("Latakia Revival", "English", "Latakia, Orientals, Virginia, Perique", "", "Lata de 100 g", _TAK + " Latakia suave, con virginias dark fired y algo de perique.", "dein-tabak"),
    ("Italy Style", "English", "Kentucky, Latakia, Orientals, Virginia", "", "Lata de 100 g", _TAK + " Latakia al estilo italiano.", "dein-tabak"),
    ("Kieler Foerde 2.0", "English", "Latakia, Perique, Orientals", "Ribbon", "Lata de 100 g", _TAK + " Un 65 % de latakia, sin virginia.", "dein-tabak"),
    ("Dark Matter", "English", "Latakia, Perique, Virginia", "", "Lata de 100 g", _TAK + " Un 50 % de latakia y un 25 % de perique.", "dein-tabak"),
    ("Amorelli's best Selection", "English", "Latakia, Perique, Orientals, Virginia", "", "100 g", _TAK + " Un 60 % de latakia.", "dein-tabak"),
    ("Teslar", "Aromatic", "Burley, Virginia, Cavendish", "", "Lata de 100 g", _TAK + " Ligeramente aromatizada con melocotón.", "dein-tabak"),
    ("40+10", "Aromatic", "Virginia, Burley", "", "Lata de 100 g", _TAK + " Aroma suave de haba tonka y naranja.", "dein-tabak (tonka)"),
    ("Happy Dad", "Aromatic", "Virginia, Black Cavendish, Burley", "", "Lata de 100 g", _TAK + " De estilo danés, ligeramente aromatizada.", "dein-tabak"),
    ("P7 Cake (T&T 1)", "Aromatic", "Virginia, Burley", "Cake", "100 g", _TAK + " Madurada con ron añejo.", "dein-tabak"),
    ("Ralf's Burley Cup", "Burley", "Burley, Virginia", "", "100 g", _TAK + " Un 65 % de burley.", "dein-tabak"),
]

# ---------------------------------------------------------------- STG: gama HH de Mac Baren (25/10)
# Fichas de mac-baren.com que pasó el usuario (PDF, texto recortado); componentes de Smokingpipes (sp)
# y Tobacco Reviews (tr). Mac Baren es de STG desde 2024: la marca del catálogo es STG.
# Van en EXTRA (se generan después de todo lo demás) para no mover los ids ya publicados.
_HH = "Gama HH de Mac Baren: prensado en caliente, con muy poca salsa y sin aromatizar."
EXTRA = [("STG", [
    ("HH Balkan Blend", "English", "Virginia, Latakia, Burley, Orientals", "Ribbon", "Lata de 100 g", _HH, "sp"),
    ("HH Vintage Latakia", "English", "Burley, Kentucky, Latakia, Orientals, Virginia", "Ribbon", "Lata de 50 g · lata de 100 g", _HH + " Inglesa clásica, según el fabricante.", "mac-baren.com / tr"),
    ("HH Bold Kentucky Flake", "Virginia/Burley", "Kentucky, Virginia", "Flake", "Lata de 50 g", _HH + " Lleva mucho kentucky.", "tr"),
    ("HH Burley Flake", "Burley", "Burley, Virginia, Dark Fired Kentucky", "Flake", "Lata de 50 g · lata de 100 g", _HH + " Predomina el burley, con un poco de kentucky dark fired.", "sp"),
    ("HH Old Dark Fired Flake", "Virginia/Burley", "Burley, Kentucky, Virginia", "Flake", "Lata de 100 g", _HH, "tr"),
    ("HH Pure Virginia Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", _HH + " Solo virginias.", "tr"),
    ("HH Rustica Flake", "Virginia", "Virginia, Burley", "Flake", "Lata de 100 g", _HH + " Lleva Nicotiana rustica, la planta de tabaco nativa de América.", "sp"),
])]

# ---------------------------------------------------------------- Lista oficial española, 2.ª tanda (25/10 tarde)
# Grupos 1 y 2 del cruce con la lista del CMT del 25/10/2026: mezclas que faltaban de marcas ya
# presentes y marcas de pipa nuevas. Todas se venden en España (llevan la E). Fuentes: Tobacco
# Reviews (tr), Smokingpipes (sp), cigarworld (cw), mac-baren.com, smoke-king, cgarsltd, thepipeshop.
# Nombres: el europeo actual cuando el antiguo cambió por la normativa de la UE (Danske Club).
for _m, _p in {"Cellini": "Dinamarca", "Holger Danske": "Dinamarca", "Stanwell": "Dinamarca",
               "Brookfield": "Alemania", "Brigg": "Dinamarca"}.items():
    PAIS.setdefault(_m, _p)
_STGM = "Marca de Mac Baren, hoy de Scandinavian Tobacco Group (STG)."
EXTRA += [
    ("Cellini", [("Forte", "Aromatic", "Black Cavendish, Burley, Virginia", "", "Bolsa de 50 g", "Aromatizada con licor.", "tr")]),
    ("Clan", [("Highland Gold", "Virginia", "Virginia", "Ribbon", "Bolsa de 50 g", "", "tr (Virginia Based)")]),
    ("Borkum Riff", [("Sungold", "Aromatic", "Burley, Cavendish, Kentucky, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de vainilla y whisky.", "tr")]),
    ("Dan Tobacco", [
        ("Ascanian No. 1 Riverside Blend", "Virginia/Perique", "Virginia, Orientals, Perique", "Ready Rubbed", "Lata de 50 g · lata de 100 g", "", "tr"),
        ("Holmer Knudsen's Pipe Tobacco", "Aromatic", "Virginia, Burley, Black Cavendish", "", "Lata de 50 g · lata de 100 g · bolsa de 250 g", "De estilo danés, con aroma de vainilla.", "cw"),
        ("Roper's Roundels", "Virginia", "Virginia, Perique, Black Cavendish", "Coins", "Lata de 100 g", "De la serie Bulldog.", "sp"),
        ("Torben Dansk Latakia (Cyprus)", "Blending", "Latakia", "", "50 g", "Latakia de Chipre para mezclar.", "cw"),
        ("Torben Dansk Louisiana Perique", "Blending", "Perique", "", "Lata de 50 g", "Perique de Luisiana para mezclar.", "cw"),
        ("Torben Dansk Virginia 1,6 Zaire", "Blending", "Virginia", "", "50 g", "Virginia de Zaire en corte de 1,6 mm, para mezclar.", "cw"),
        ("Torben Dansk Burley", "Blending", "Burley", "", "50 g", "Burley para mezclar.", "cw"),
    ]),
    ("STG", [
        ("7 Seas Regular Blend", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 40 g", "Marca Mac Baren. Aroma de chocolate y vainilla.", "tr"),
        ("7 Seas Royal Blend", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 40 g", "Marca Mac Baren.", "tr"),
        ("7 Seas Gold Blend", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 40 g", "Marca Mac Baren.", "tr"),
        ("7 Seas Blue Blend", "Aromatic", "Virginia, Burley, Cavendish", "", "Bolsa de 40 g", "Marca Mac Baren.", "mac-baren.com"),
        ("7 Seas Bright Blend", "Aromatic", "Virginia, Burley", "", "Bolsa de 40 g", "Marca Mac Baren.", "mac-baren.com"),
        ("Cube Gold", "Aromatic", "Black Cavendish, Burley, Cavendish, Kentucky, Virginia", "Ribbon", "Bolsa de 40 g", "Marca Mac Baren. Aroma afrutado.", "tr"),
        ("Cube Silver", "Aromatic", "Virginia, Burley, Orientals, Black Cavendish", "Ribbon", "Bolsa de 40 g", "Marca Mac Baren.", "sp"),
    ]),
    ("Peterson", [("Founder's Choice", "Aromatic", "Black Cavendish, Burley, Cavendish, Orientals", "", "Lata de 100 g", "Aroma de mango, ron y vainilla.", "tr")]),
    ("W.Ø. Larsen", [("Fresh & Elegant", "Aromatic", "Burley, Cavendish, Virginia", "", "Bolsa de 50 g", "Aroma afrutado.", "tr")]),
    ("Holger Danske", [("Original", "Virginia", "Black Cavendish, Burley, Perique, Virginia", "Ribbon", "Bolsa de 40 g", "", "tr (Virginia Based)")]),
    ("Stanwell", [("Kir & Apple", "Aromatic", "Black Cavendish, Burley, Virginia", "Broken Flake", "Bolsa de 50 g", "Aroma de manzana y grosella negra.", "tr")]),
    ("Käpt'n Barsdorfs Bester", [
        ("Mixture", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 50 g · lata de 160 g", "", "tr"),
        ("Red", "Aromatic", "Virginia, Burley", "", "Lata de 160 g", "Aroma de cereza.", "pfeifen-shop-online"),
    ]),
    ("Alsbo", [
        ("Black", "Aromatic", "Cavendish, Black Cavendish", "Ready Rubbed", "Bolsa de 50 g", "Aroma de vainilla con un toque de avellana.", "smoke-king"),
        ("Gold", "Aromatic", "Virginia", "Ribbon", "50 g", "Aroma de pistacho y vainilla.", "tr"),
        ("Ruby", "Aromatic", "Black Cavendish, Burley, Virginia", "Ready Rubbed", "Bolsa de 50 g", "Aroma de cereza.", "cgarsltd"),
        ("Whisky", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de whisky.", "tr"),
    ]),
    ("Skandinavik", [
        ("Mixture", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 50 g", "", "tr"),
        ("Navy", "Aromatic", "Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Aromatizada con licor.", "tr"),
    ]),
    ("Danske Club", [
        ("Black", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Aroma de vainilla. Antes se llamaba Black Luxury.", "tr"),
        ("White", "Aromatic", "Burley, Virginia", "Ribbon", "Lata de 50 g", "Aroma de vainilla. Antes se llamaba White Luxury.", "tr"),
    ]),
    ("Comoy's", [
        ("Cornish Mixture", "Aromatic", "Burley, Cavendish, Virginia", "Ribbon", "Lata de 50 g", "Aroma de canela, chocolate y fruta.", "tr"),
        ("English Mixture", "English", "Latakia, Orientals, Virginia", "Ribbon", "Lata de 50 g", "", "tr"),
        ("Irish Mixture", "Aromatic", "Black Cavendish, Burley, Virginia", "Ribbon", "Lata de 50 g", "Aroma de whisky.", "tr"),
        ("Scottish Mixture", "Scottish", "Orientals, Virginia", "Ribbon", "Lata de 50 g", "", "tr"),
    ]),
    ("Fribourg & Treyer", [
        ("34th Mixture", "English", "Black Cavendish, Latakia, Virginia", "", "Lata de 50 g", "Inglesa fuerte, con mucha latakia.", "tr"),
        ("Special Brown Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", "Navy flake con un ligero toque de ron.", "tr"),
        ("Wingate Mixture", "English", "Latakia, Perique, Virginia", "Ribbon", "Lata de 50 g", "", "tr"),
        ("Waterloo No. 2 Mixture", "Virginia/Latakia", "Latakia, Virginia", "Ribbon", "Lata de 50 g", "", "tr"),
        ("Cut Virginia Plug", "Virginia", "Virginia", "Flake", "Lata de 50 g", "Prensado en plug y cortado en láminas; sin aromatizar.", "smoke-king"),
        ("Vintage Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", "Sin aromatizar.", "smoke-king"),
    ]),
    ("Wessex", [
        ("Brown Virginia Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", "Sin aromatizar.", "tr"),
        ("Gold Virginia Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", "", "tr"),
        ("Red Virginia Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", "", "tr"),
        ("Director's Choice", "Aromatic", "Cavendish, Virginia", "Ribbon", "Lata de 50 g", "Lleva también tabaco Maryland.", "tr"),
        ("Tradition", "English", "Latakia, Orientals, Virginia", "Ribbon", "Lata de 50 g", "", "tr"),
    ]),
    ("Astley's", [
        ("No. 2 Virginia Mixture", "Virginia/Perique", "Perique, Virginia", "Ribbon", "Lata de 50 g", "", "tr"),
        ("No. 55 Elizabethan", "Virginia", "Virginia", "Ribbon", "Lata de 50 g", "Sin aromatizar.", "tr"),
        ("No. 88 Matured Dark Virginia", "Virginia", "", "Ready Rubbed", "Lata de 50 g", "", "tr"),
        ("No. 99 Royal Tudor", "English", "Latakia, Orientals, Virginia", "Ribbon", "Lata de 50 g", "Mezcla con mucha latakia.", "tr"),
        ("No. 109 Medium Flake", "Virginia", "Virginia", "Flake", "Lata de 50 g", "Sin aromatizar.", "tr"),
    ]),
    ("Savinelli", [
        ("The Balkans", "English", "Black Cavendish, Latakia, Orientals, Virginia", "", "Lata de 50 g", "", "tr"),
        ("English Mixture", "English", "Burley, Latakia, Virginia", "", "Lata de 50 g", "", "tr"),
        ("Armonia", "Aromatic", "Burley, Kentucky, Orientals, Virginia", "Ribbon", "Lata de 50 g", "Aroma de cacao, fruta, miel y ron.", "tr"),
        ("Aroma", "Aromatic", "Virginia, Orientals, Black Cavendish", "Ribbon", "Lata de 50 g", "Aroma de amaretto y vainilla.", "sp"),
        ("Black Cavendish", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g", "Notas suaves de vainilla y chocolate.", "sp"),
        ("Cavendish", "Aromatic", "Black Cavendish, Burley, Orientals, Virginia", "Ribbon", "Lata de 50 g", "Aroma de caramelo, nata, miel y vainilla.", "tr"),
        ("Leonardo", "Aromatic", "Black Cavendish, Burley, Cavendish, Virginia", "", "Lata de 100 g", "Aroma de caramelo, chocolate, café y vainilla.", "tr"),
    ]),
    ("Brookfield", [
        ("No. 1", "Aromatic", "Burley, Virginia", "Ribbon", "Bolsa de 50 g", "Lleva también tabaco de Java. Aroma de vainilla.", "tr"),
        ("No. 2", "Aromatic", "Black Cavendish, Burley, Virginia", "Broken Flake", "Bolsa de 50 g", "Aroma de vainilla.", "tr"),
        ("No. 4 (Black Bourbon)", "American", "Burley, Virginia", "Broken Flake", "Bolsa de 50 g · lata de 200 g", "Aroma de bourbon.", "tr"),
    ]),
    ("Brigg", [("Regular", "Aromatic", "Burley, Cavendish, Virginia", "", "Bolsa de 40 g", _STGM + " Aroma de ron.", "tr")]),
    ("Chacom", [
        ("No. 1", "English", "Virginia, Latakia, Orientals, Black Cavendish", "Ribbon", "Lata de 50 g", "Inglesa suave, con poca latakia.", "sp"),
        ("No. 2", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g", "Aroma de vainilla con un toque de ciruela.", "sp"),
        ("No. 3", "Aromatic", "Virginia, Dark Fired Kentucky, Black Cavendish", "Ribbon", "Lata de 50 g", "Aroma de vainilla bourbon.", "sp"),
        ("No. 4", "Virginia", "Virginia, Perique", "Flake", "Lata de 50 g", "", "sp"),
        ("No. 5", "English", "Virginia, Latakia, Black Cavendish, Perique", "", "Lata de 50 g", "Inglesa intensa, sin aromatizar.", "thepipeshop"),
        ("No. 6", "Aromatic", "Black Cavendish, Virginia, Burley", "", "Lata de 50 g", "Aroma de ron, café espresso y caramelo.", "thepipeshop"),
    ]),
]

# Condor (25/10): el usuario conoce la bolsa verde, que es la Ready Rubbed. Ya no se fabrica,
# pero sigue en la lista del CMT y el usuario quiere tenerla.
PAIS.setdefault("Condor", "Reino Unido")
EXTRA += [("Condor", [
    ("Ready Rubbed", "Aromatic", "Virginia", "Ready Rubbed", "Bolsa de 50 g",
     "La de la bolsa verde. Virginia curado al aire con esencias florales y un toque de licor. Ya no se fabrica.", "tr / uktobacco (lakeland, según el usuario)"),
])]
