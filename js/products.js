/*
 * ============================================================
 *  PRODUKTLISTE
 *  Jedes Produkt steht zwischen { und }, mit einem Komma danach.
 *  So fügst du ein neues Produkt hinzu: einen Block kopieren,
 *  darunter einfügen und die Werte ändern.
 *
 *  id        – eindeutiger Kurzname ohne Leerzeichen (z. B. "berbere-250")
 *  category  – "spices" (Gewürze), "flour" (Mehl) oder "culture" (Kultur)
 *  price     – Preis in Euro, mit PUNKT statt Komma (z. B. 8.90)
 *  image     – Pfad zu einem Foto, z. B. "images/berbere.jpg"
 *              (leer lassen "" = es wird ein Platzhalter angezeigt)
 *  name / weight / description – jeweils auf Deutsch (de) und Tigrinya (ti)
 *  glutenFree – true = grünes Zeichen „Glutenfrei“ am Produkt
 *              (nur setzen, wenn das Produkt nachweislich glutenfrei ist!)
 *  variants  – statt "price" und "weight": mehrere Größen zur Auswahl,
 *              jede mit eigener id, Größe und eigenem Preis (siehe Teff-Mehl)
 *
 *  HINWEIS: Das sind BEISPIELPRODUKTE. Bitte durch deine echten
 *  Produkte, Preise und Fotos ersetzen.
 * ============================================================
 */
const PRODUCTS = [
  // ---------------- GEWÜRZE ----------------
  {
    id: "berbere-250",
    category: "spices",
    price: 8.90,
    image: "",
    name: { de: "Berbere", ti: "በርበረ" },
    weight: { de: "250 g", ti: "250 ግራም" },
    description: {
      de: "Die klassische eritreische Gewürzmischung aus Chili, Ingwer, Knoblauch und vielen weiteren Gewürzen. Unverzichtbar für Tsebhi und Zigni.",
      ti: "ብበርበረ፡ ጀንጀብል፡ ጻዕዳ ሽጉርቲን ካልኦት ቅመማትን ዝተዳለወ ክላሲካዊ ኤርትራዊ ቅመም። ንጸብሒ ዝግኒ ኣገዳሲ።",
    },
  },
  {
    id: "shiro-500",
    category: "spices",
    price: 7.50,
    image: "",
    name: { de: "Shiro-Pulver", ti: "ሽሮ" },
    weight: { de: "500 g", ti: "500 ግራም" },
    description: {
      de: "Fein gemahlenes, gewürztes Kichererbsenmehl für das beliebte Shiro-Gericht.",
      ti: "ንጥዑም ጸብሒ ሽሮ ዝኸውን ብቅመም ዝተዳለወ ጽሩይ ሽሮ።",
    },
  },
  {
    id: "mitmita-100",
    category: "spices",
    price: 6.90,
    image: "",
    name: { de: "Mitmita", ti: "ሚጥሚጣ" },
    weight: { de: "100 g", ti: "100 ግራም" },
    description: {
      de: "Sehr scharfe Gewürzmischung aus Bird's-Eye-Chili, Kardamom und Salz – zum Nachwürzen bei Tisch.",
      ti: "ኣዝዩ ዘሕርር ቅመም ካብ ሚጥሚጣ፡ ኮረሪማን ጨውን።",
    },
  },
  {
    id: "korerima-50",
    category: "spices",
    price: 5.90,
    image: "",
    name: { de: "Korerima (Äthiopischer Kardamom)", ti: "ኮረሪማ" },
    weight: { de: "50 g", ti: "50 ግራም" },
    description: {
      de: "Aromatische Samen, die Kaffee, Tee und Eintöpfen eine warme, rauchige Note geben.",
      ti: "ንቡን፡ ሻሂን ጸብሒን ጥዑም መዓዛ ዝህብ ቅመም።",
    },
  },
  {
    id: "coffee-500",
    category: "spices",
    price: 12.90,
    image: "",
    name: { de: "Rohkaffee für die Kaffeezeremonie", ti: "ጥረ ቡን" },
    weight: { de: "500 g", ti: "500 ግራም" },
    description: {
      de: "Grüne Kaffeebohnen zum Selbströsten – so wie bei der traditionellen Bun-Zeremonie.",
      ti: "ከም ልምዲ ስርዓተ ቡን ገዛእ ርእስኻ እትቖልዎ ጥረ ቡን።",
    },
  },
  {
    id: "etan-100",
    category: "spices",
    price: 4.90,
    image: "",
    name: { de: "Weihrauch (Etan)", ti: "ዕጣን" },
    weight: { de: "100 g", ti: "100 ግራም" },
    description: {
      de: "Natürlicher Weihrauch – gehört zu jeder Kaffeezeremonie und zu festlichen Anlässen.",
      ti: "ተፈጥሮኣዊ ዕጣን – ንስርዓተ ቡንን በዓላትን።",
    },
  },

  // ---------------- MEHL ----------------
  {
    id: "teff",
    category: "flour",
    image: "",
    name: { de: "Teff-Mehl", ti: "ሓርጭ ጣፍ" },
    glutenFree: false, // erst auf true setzen, wenn vom Lieferanten bestätigt
    variants: [
      { id: "500g", weight: { de: "500 g", ti: "500 ግራም" }, price: 5.90 },
      { id: "1kg", weight: { de: "1 kg", ti: "1 ኪሎ" }, price: 9.90 },
    ],
    description: {
      de: "Fein gemahlenes Mehl aus Teff, dem Urgetreide Ostafrikas – die Grundlage für echtes Injera.",
      ti: "ካብ ጣፍ ዝተጠሓነ ጽሩይ ሓርጭ – መሰረት ናይ ሓቀኛ ጣይታ (እንጀራ)።",
    },
  },
  {
    id: "mashella",
    category: "flour",
    image: "",
    name: { de: "Maschella-Mehl (Sorghum)", ti: "ሓርጭ መሽላ" },
    glutenFree: false, // erst auf true setzen, wenn vom Lieferanten bestätigt
    variants: [
      { id: "500g", weight: { de: "500 g", ti: "500 ግራም" }, price: 3.90 },
      { id: "1kg", weight: { de: "1 kg", ti: "1 ኪሎ" }, price: 6.90 },
    ],
    description: {
      de: "Mehl aus Maschella (Sorghum-Hirse) – für Injera, gemischt mit Teff, und für Ga'at (Brei).",
      ti: "ካብ መሽላ ዝተጠሓነ ሓርጭ – ንጣይታ ምስ ጣፍ ተሓዊሱ፡ ከምኡ'ውን ንዓጊት።",
    },
  },

  // ---------------- KULTUR ----------------
  {
    id: "jebena",
    category: "culture",
    price: 29.90,
    image: "",
    name: { de: "Jebena (Kaffeekanne aus Ton)", ti: "ጀበና" },
    weight: { de: "handgemacht", ti: "ብኢድ ዝተሰርሐ" },
    description: {
      de: "Traditionelle Kaffeekanne aus Ton – das Herzstück der eritreischen Kaffeezeremonie.",
      ti: "ካብ ጭቃ ዝተሰርሐት ባህላዊት ጀበና – ልቢ ስርዓተ ቡን።",
    },
  },
  {
    id: "finjal-set",
    category: "culture",
    price: 24.90,
    image: "",
    name: { de: "Finjal-Set (6 Tassen)", ti: "ፊንጃል (6)" },
    weight: { de: "6 Stück", ti: "6 ፍረ" },
    description: {
      de: "Sechs kleine Porzellantassen ohne Henkel, wie sie für Bun verwendet werden.",
      ti: "ንቡን ዝኾና ሽዱሽተ ንኣሽቱ ፊንጃላት።",
    },
  },
  {
    id: "mesob",
    category: "culture",
    price: 59.00,
    image: "",
    name: { de: "Mesob (geflochtener Korbtisch)", ti: "መሶብ" },
    weight: { de: "ca. 50 cm", ti: "ኣስታት 50 ሳ.ሜ." },
    description: {
      de: "Handgeflochtener, bunter Korb, auf dem Injera serviert wird – auch ein schönes Deko-Stück.",
      ti: "ብኢድ ዝተሰርሐ ሕብራዊ መሶብ ንምቕራብ እንጀራ።",
    },
  },
  {
    id: "netela",
    category: "culture",
    price: 34.90,
    image: "",
    name: { de: "Netsela (Baumwolltuch)", ti: "ነጸላ" },
    weight: { de: "ca. 200 × 100 cm", ti: "ኣስታት 200 × 100 ሳ.ሜ." },
    description: {
      de: "Weißes, handgewebtes Baumwolltuch mit farbiger Tilet-Bordüre – für Feiertage und Kirche.",
      ti: "ብኢድ ዝተኣልመ ጻዕዳ ነጸላ ምስ ሕብራዊ ጥለት።",
    },
  },
  {
    id: "cross",
    category: "culture",
    price: 19.90,
    image: "",
    name: { de: "Handgefertigtes Kreuz", ti: "መስቀል" },
    weight: { de: "ca. 12 cm", ti: "ኣስታት 12 ሳ.ሜ." },
    description: {
      de: "Kunstvolles Kreuz im traditionellen eritreischen Stil – als Anhänger oder Wandschmuck.",
      ti: "ብባህላዊ ኤርትራዊ ቅዲ ዝተሰርሐ መስቀል።",
    },
  },
  {
    id: "rekebot",
    category: "culture",
    price: 39.90,
    image: "",
    name: { de: "Rekebot (Kaffeetablett)", ti: "ረከቦት" },
    weight: { de: "Holz", ti: "ዕንጨይቲ" },
    description: {
      de: "Kleiner Holztisch bzw. Tablett, auf dem die Finjal-Tassen bei der Zeremonie stehen.",
      ti: "ፊንጃላት ዝቕመጣሉ ናይ ዕንጨይቲ ረከቦት።",
    },
  },
];
