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
 *  name / weight / description – jeweils auf Deutsch (de), Englisch (en) und Tigrinya (ti)
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
    price: 6.90,
    image: "images/berbere.jpg",
    name: { de: "Berbere", en: "Berbere", ti: "በርበረ" },
    weight: { de: "250 g", en: "250 g", ti: "250 ግራም" },
    description: {
      de: "Die klassische eritreische Gewürzmischung aus Chili, Ingwer, Knoblauch und vielen weiteren Gewürzen. Unverzichtbar für Tsebhi und Zigni.",
      en: "The classic Eritrean spice blend of chili, ginger, garlic and many other spices. Essential for tsebhi and zigni.",
      ti: "ብበርበረ፡ ጀንጀብል፡ ጻዕዳ ሽጉርቲን ካልኦት ቅመማትን ዝተዳለወ ክላሲካዊ ኤርትራዊ ቅመም። ንጸብሒ ዝግኒ ኣገዳሲ።",
    },
  },
  {
    id: "shiro-500",
    category: "spices",
    price: 8.90,
    image: "images/shiro.jpg",
    name: { de: "Shiro-Pulver", en: "Shiro powder", ti: "ሽሮ" },
    weight: { de: "500 g", en: "500 g", ti: "500 ግራም" },
    description: {
      de: "Fein gemahlenes, gewürztes Kichererbsenmehl für das beliebte Shiro-Gericht.",
      en: "Finely ground, seasoned chickpea flour for the popular shiro dish.",
      ti: "ንጥዑም ጸብሒ ሽሮ ዝኸውን ብቅመም ዝተዳለወ ጽሩይ ሽሮ።",
    },
  },
  {
    id: "mitmita-100",
    category: "spices",
    price: 3.90,
    image: "images/mitmita.jpg",
    name: { de: "Mitmita", en: "Mitmita", ti: "ሚጥሚጣ" },
    weight: { de: "100 g", en: "100 g", ti: "100 ግራም" },
    description: {
      de: "Sehr scharfe Gewürzmischung aus Bird's-Eye-Chili, Kardamom und Salz – zum Nachwürzen bei Tisch.",
      en: "Very hot spice blend of bird's eye chili, cardamom and salt – for seasoning at the table.",
      ti: "ኣዝዩ ዘሕርር ቅመም ካብ ሚጥሚጣ፡ ኮረሪማን ጨውን።",
    },
  },
  {
    id: "korerima-50",
    category: "spices",
    price: 2.90,
    image: "images/korerima.jpg",
    name: { de: "Korerima (Äthiopischer Kardamom)", en: "Korerima (Ethiopian cardamom)", ti: "ኮረሪማ" },
    weight: { de: "50 g", en: "50 g", ti: "50 ግራም" },
    description: {
      de: "Aromatische Samen, die Kaffee, Tee und Eintöpfen eine warme, rauchige Note geben.",
      en: "Aromatic seeds that give coffee, tea and stews a warm, smoky note.",
      ti: "ንቡን፡ ሻሂን ጸብሒን ጥዑም መዓዛ ዝህብ ቅመም።",
    },
  },
  {
    id: "coffee-500",
    category: "spices",
    price: 7.90,
    image: "images/rohkaffee.jpg",
    name: { de: "Rohkaffee für die Kaffeezeremonie", en: "Green coffee for the coffee ceremony", ti: "ጥረ ቡን" },
    weight: { de: "500 g", en: "500 g", ti: "500 ግራም" },
    description: {
      de: "Grüne Kaffeebohnen zum Selbströsten – so wie bei der traditionellen Bun-Zeremonie.",
      en: "Green coffee beans for roasting yourself – just like in the traditional bun ceremony.",
      ti: "ከም ልምዲ ስርዓተ ቡን ገዛእ ርእስኻ እትቖልዎ ጥረ ቡን።",
    },
  },
  {
    id: "etan-100",
    category: "spices",
    price: 4.90,
    image: "images/weihrauch.jpg",
    name: { de: "Weihrauch (Etan)", en: "Frankincense (etan)", ti: "ዕጣን" },
    weight: { de: "100 g", en: "100 g", ti: "100 ግራም" },
    description: {
      de: "Natürlicher Weihrauch – gehört zu jeder Kaffeezeremonie und zu festlichen Anlässen.",
      en: "Natural frankincense – part of every coffee ceremony and festive occasion.",
      ti: "ተፈጥሮኣዊ ዕጣን – ንስርዓተ ቡንን በዓላትን።",
    },
  },

  // ---------------- MEHL ----------------
  {
    id: "teff",
    category: "flour",
    image: "images/teff.jpg",
    name: { de: "Teff-Mehl", en: "Teff flour", ti: "ሓርጭ ጣፍ" },
    glutenFree: false, // erst auf true setzen, wenn vom Lieferanten bestätigt
    variants: [
      { id: "500g", weight: { de: "500 g", en: "500 g", ti: "500 ግራም" }, price: 3.50 },
      { id: "1kg", weight: { de: "1 kg", en: "1 kg", ti: "1 ኪሎ" }, price: 5.90 },
    ],
    description: {
      de: "Fein gemahlenes Mehl aus Teff, dem Urgetreide Ostafrikas – die Grundlage für echtes Injera.",
      en: "Finely ground flour from teff, the ancient grain of East Africa – the basis for authentic injera.",
      ti: "ካብ ጣፍ ዝተጠሓነ ጽሩይ ሓርጭ – መሰረት ናይ ሓቀኛ ጣይታ (እንጀራ)።",
    },
  },
  {
    id: "mashella",
    category: "flour",
    image: "images/maschella.jpg",
    name: { de: "Maschella-Mehl (Sorghum)", en: "Mashella flour (sorghum)", ti: "ሓርጭ መሽላ" },
    glutenFree: false, // erst auf true setzen, wenn vom Lieferanten bestätigt
    variants: [
      { id: "500g", weight: { de: "500 g", en: "500 g", ti: "500 ግራም" }, price: 1.90 },
      { id: "1kg", weight: { de: "1 kg", en: "1 kg", ti: "1 ኪሎ" }, price: 2.90 },
    ],
    description: {
      de: "Mehl aus Maschella (Sorghum-Hirse) – für Injera, gemischt mit Teff, und für Ga'at (Brei).",
      en: "Flour from mashella (sorghum) – for injera mixed with teff, and for ga'at (porridge).",
      ti: "ካብ መሽላ ዝተጠሓነ ሓርጭ – ንጣይታ ምስ ጣፍ ተሓዊሱ፡ ከምኡ'ውን ንዓጊት።",
    },
  },

  // ---------------- KULTUR ----------------
  {
    id: "jebena",
    category: "culture",
    price: 22.90,
    image: "",
    name: { de: "Jebena (Kaffeekanne aus Ton)", en: "Jebena (clay coffee pot)", ti: "ጀበና" },
    weight: { de: "handgemacht", en: "handmade", ti: "ብኢድ ዝተሰርሐ" },
    description: {
      de: "Traditionelle Kaffeekanne aus Ton – das Herzstück der eritreischen Kaffeezeremonie.",
      en: "Traditional clay coffee pot – the heart of the Eritrean coffee ceremony.",
      ti: "ካብ ጭቃ ዝተሰርሐት ባህላዊት ጀበና – ልቢ ስርዓተ ቡን።",
    },
  },
  {
    id: "finjal-set",
    category: "culture",
    price: 15.90,
    image: "",
    name: { de: "Finjal-Set (6 Tassen)", en: "Finjal set (6 cups)", ti: "ፊንጃል (6)" },
    weight: { de: "6 Stück", en: "6 pieces", ti: "6 ፍረ" },
    description: {
      de: "Sechs kleine Porzellantassen ohne Henkel, wie sie für Bun verwendet werden.",
      en: "Six small porcelain cups without handles, as used for bun.",
      ti: "ንቡን ዝኾና ሽዱሽተ ንኣሽቱ ፊንጃላት።",
    },
  },
  {
    id: "mesob",
    category: "culture",
    price: 79.00,
    image: "",
    name: { de: "Mesob (geflochtener Korbtisch)", en: "Mesob (woven basket table)", ti: "መሶብ" },
    weight: { de: "ca. 50 cm", en: "approx. 50 cm", ti: "ኣስታት 50 ሳ.ሜ." },
    description: {
      de: "Handgeflochtener, bunter Korb, auf dem Injera serviert wird – auch ein schönes Deko-Stück.",
      en: "Hand-woven, colourful basket on which injera is served – also a beautiful decorative piece.",
      ti: "ብኢድ ዝተሰርሐ ሕብራዊ መሶብ ንምቕራብ እንጀራ።",
    },
  },
  {
    id: "netela",
    category: "culture",
    price: 37.90,
    image: "",
    name: { de: "Netsela (Baumwolltuch)", en: "Netsela (cotton shawl)", ti: "ነጸላ" },
    weight: { de: "ca. 200 × 100 cm", en: "approx. 200 × 100 cm", ti: "ኣስታት 200 × 100 ሳ.ሜ." },
    description: {
      de: "Weißes, handgewebtes Baumwolltuch mit farbiger Tilet-Bordüre – für Feiertage und Kirche.",
      en: "White, hand-woven cotton shawl with a colourful tilet border – for holidays and church.",
      ti: "ብኢድ ዝተኣልመ ጻዕዳ ነጸላ ምስ ሕብራዊ ጥለት።",
    },
  },
  {
    id: "cross",
    category: "culture",
    price: 19.90,
    image: "",
    name: { de: "Handgefertigtes Kreuz", en: "Handmade cross", ti: "መስቀል" },
    weight: { de: "ca. 12 cm", en: "approx. 12 cm", ti: "ኣስታት 12 ሳ.ሜ." },
    description: {
      de: "Kunstvolles Kreuz im traditionellen eritreischen Stil – als Anhänger oder Wandschmuck.",
      en: "Ornate cross in traditional Eritrean style – as a pendant or wall decoration.",
      ti: "ብባህላዊ ኤርትራዊ ቅዲ ዝተሰርሐ መስቀል።",
    },
  },
  {
    id: "rekebot",
    category: "culture",
    price: 54.90,
    image: "",
    name: { de: "Rekebot (Kaffeetablett)", en: "Rekebot (coffee tray)", ti: "ረከቦት" },
    weight: { de: "Holz", en: "wood", ti: "ዕንጨይቲ" },
    description: {
      de: "Kleiner Holztisch bzw. Tablett, auf dem die Finjal-Tassen bei der Zeremonie stehen.",
      en: "Small wooden table or tray on which the finjal cups stand during the ceremony.",
      ti: "ፊንጃላት ዝቕመጣሉ ናይ ዕንጨይቲ ረከቦት።",
    },
  },
];
