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
    ("Blue Label 369", "Aromatic", "Virginia, Burley, Black Cavendish, Perique", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Aroma afrutado y de miel.", "cw y Monjure"),
    ("Festival 333", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Aroma afrutado.", "cw"),
    ("Gold Label 779", "English", "Virginia, Latakia, Orientals", "Ribbon", "Lata de 50 g", _SO + " También se vende como English Luxury.", "cw"),
    ("Green Label 127", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Un toque de manzana.", "cw y Monjure"),
    ("Red Label 131", "Aromatic", "Virginia, Burley, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO + " Esencias tropicales y un toque de whisky de malta.", "cw y Monjure"),
    ("Silver Flake 660", "Virginia", "Kentucky, Virginia", "Flake", "Lata de 100 g", _SO, "tr"),
    ("Virginia Flake 633", "Virginia", "Virginia, Perique", "Flake", "Lata de 50 g · lata de 100 g", _SO, "Monjure"),
    ("White and Black 763", "English", "Virginia, Latakia, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO, "sp"),
    ("X - Sweet Mystery 113", "Aromatic", "Virginia, Black Cavendish", "Ribbon", "Lata de 50 g · lata de 100 g", _SO, "sp"),
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
    ("Cedros", "Aromatic", "Black Cavendish, Burley, Kentucky, Virginia", "Ribbon", "Lata de 50 g", _IL + " Aroma de frutos secos; se vende en caja de cedro.", "cw"),
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
    ("Brothers in Arms", "Burley", "Virginia, Perique, Dark Fired Kentucky, Burley, Orientals", "Ribbon", "Lata de 50 g · lata de 2 oz", _PJ, "sp"),
    ("Harbour Dreams", "Aromatic", "Virginia, Burley", "Broken Flake", "Lata de 50 g · lata de 2 oz", _PJ, "sp"),
    ("King's Watch", "Virginia", "Virginia", "Flake", "Lata de 50 g · lata de 2 oz", _PJ, "sp"),
    ("Port Guardian", "Virginia", "Virginia", "Flake", "Lata de 50 g · lata de 2 oz", _PJ, "sp"),
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
