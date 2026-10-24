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
