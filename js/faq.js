/*
 * ============================================================
 *  HÄUFIGE FRAGEN (FAQ)
 *  Jede Frage steht zwischen { und } – mit Frage (q) und
 *  Antwort (a), jeweils auf Deutsch (de), Englisch (en) und Tigrinya (ti).
 *  {shipping}, {free} und {email} werden automatisch aus
 *  config.js eingesetzt.
 * ============================================================
 */
const FAQ = [
  {
    group: { de: "Bestellung & Bezahlung", en: "Ordering & payment", ti: "ትእዛዝን ክፍሊትን" },
    items: [
      {
        q: { de: "Wie kann ich bezahlen?", en: "How can I pay?", ti: "ብኸመይ ክኸፍል እኽእል?" },
        a: {
          de: "Die Bezahlung läuft sicher über PayPal. Du brauchst dafür nicht unbedingt ein PayPal-Konto: Über den PayPal-Button kannst du auch per Lastschrift oder Kreditkarte bezahlen.",
          en: "Payment is processed securely via PayPal. You don't necessarily need a PayPal account: the PayPal button also lets you pay by direct debit or credit card.",
          ti: "ክፍሊት ብውሑስ መንገዲ ብPayPal እዩ። ሕሳብ PayPal ኣየድልየካን እዩ፡ ብባንክ ካርድ ወይ ክረዲት ካርድ'ውን ክትከፍል ትኽእል ኢኻ።",
        },
      },
      {
        q: { de: "Ist meine Zahlung sicher?", en: "Is my payment secure?", ti: "ክፍሊተይ ውሑስ ድዩ?" },
        a: {
          de: "Ja. Deine Zahlungsdaten gibst du nur bei PayPal ein – wir sehen sie nie. Außerdem gilt der PayPal-Käuferschutz.",
          en: "Yes. You only enter your payment details at PayPal – we never see them. PayPal Buyer Protection also applies.",
          ti: "እወ። ሓበሬታ ክፍሊትካ ኣብ PayPal ጥራይ ኢኻ ተእትዎ – ንሕና ፈጺምና ኣይንርእዮን። ከምኡ'ውን ሓለዋ ዓዳጊ ናይ PayPal ኣሎ።",
        },
      },
      {
        q: { de: "Brauche ich ein Kundenkonto?", en: "Do I need a customer account?", ti: "ሕሳብ ዓሚል የድልየኒ ድዩ?" },
        a: {
          de: "Nein. Leg einfach deine Produkte in den Warenkorb und bezahle mit PayPal. Deine Lieferadresse übernimmt PayPal automatisch.",
          en: "No. Just add your products to the cart and pay with PayPal. PayPal passes on your delivery address automatically.",
          ti: "ኣይፋል። ፍርያትካ ናብ ዘንቢል ወሲኽካ ብPayPal ክፈል። ኣድራሻኻ PayPal ባዕሉ ይወስዶ።",
        },
      },
      {
        q: { de: "Bekomme ich eine Bestätigung?", en: "Will I receive a confirmation?", ti: "መረጋገጺ ይመጸኒ ድዩ?" },
        a: {
          de: "Ja. Direkt nach der Bezahlung bekommst du von PayPal eine E-Mail mit allen Details zu deiner Bestellung.",
          en: "Yes. Right after payment, PayPal sends you an email with all the details of your order.",
          ti: "እወ። ድሕሪ ክፍሊት ብኡንብኡ ካብ PayPal ኩሉ ዝርዝር ትእዛዝካ ዘለዎ ኢመይል ይመጸካ።",
        },
      },
    ],
  },
  {
    group: { de: "Versand & Rückgabe", en: "Shipping & returns", ti: "ምልኣኽን ምምላስን" },
    items: [
      {
        q: { de: "Was kostet der Versand?", en: "How much does shipping cost?", ti: "ምልኣኽ ክንደይ ይኸፍል?" },
        a: {
          de: "Der Versand kostet {shipping}. Ab einem Bestellwert von {free} verschicken wir kostenlos.",
          en: "Shipping costs {shipping}. For orders of {free} or more, shipping is free.",
          ti: "ናይ ምልኣኽ ክፍሊት {shipping} እዩ። ካብ {free} ንላዕሊ ብነጻ ንልእኽ።",
        },
      },
      {
        q: { de: "Wie lange dauert die Lieferung?", en: "How long does delivery take?", ti: "ክሳብ ዝበጽሕ ክንደይ ይወስድ?" },
        a: {
          de: "Innerhalb Deutschlands ist deine Bestellung in der Regel nach 2–5 Werktagen bei dir.",
          en: "Within Germany, your order usually arrives within 2–5 working days.",
          ti: "ኣብ ውሽጢ ጀርመን ብልሙድ ኣብ 2–5 መዓልታት ስራሕ ይበጽሓካ።",
        },
      },
      {
        q: { de: "Liefert ihr auch ins Ausland?", en: "Do you ship abroad?", ti: "ናብ ወጻኢ ሃገር ትልእኹ ዶ?" },
        a: {
          de: "Zurzeit liefern wir nur innerhalb Deutschlands. Für Österreich oder die Schweiz schreib uns gerne eine E-Mail an {email}.",
          en: "At the moment we only ship within Germany. For Austria or Switzerland, feel free to email us at {email}.",
          ti: "ሕጂ ኣብ ውሽጢ ጀርመን ጥራይ ኢና ንልእኽ። ንኦስትርያ ወይ ስዊዘርላንድ ብ{email} ጽሓፉልና።",
        },
      },
      {
        q: { de: "Kann ich etwas zurückgeben?", en: "Can I return something?", ti: "ክመልሶ እኽእል ድየ?" },
        a: {
          de: "Ja, du hast 14 Tage Widerrufsrecht. Ausgenommen sind Lebensmittel wie Gewürze und Mehl, wenn die Verpackung geöffnet wurde. Details findest du in unseren <a href=\"agb.html\">AGB</a>.",
          en: "Yes, you have a 14-day right of withdrawal. This does not apply to food such as spices and flour once the packaging has been opened. You can find details in our <a href=\"agb.html\">terms and conditions</a>.",
          ti: "እወ፡ ኣብ ውሽጢ 14 መዓልቲ ክትመልሶ ትኽእል። ዝተኸፍተ መግቢ ከም ቅመምን ሓርጭን ግን ኣይምለስን። ዝርዝር ኣብ <a href=\"agb.html\">ውዕላትና (AGB)</a>።",
        },
      },
    ],
  },
  {
    group: { de: "Gewürze & Mehl", en: "Spices & flour", ti: "ቅመማትን ሓርጭን" },
    items: [
      {
        q: { de: "Wie scharf ist Berbere?", en: "How hot is berbere?", ti: "በርበረ ክንደይ የሕርር?" },
        a: {
          de: "Berbere ist würzig und mittelscharf bis scharf. Wer es richtig scharf mag, greift zu Mitmita – das ist deutlich schärfer.",
          en: "Berbere is aromatic and medium hot to hot. If you like it really hot, go for mitmita – it is considerably hotter.",
          ti: "በርበረ ጥዑምን ማእከላይ ክሳብ ዘሕርርን እዩ። ኣዝዩ ዘሕርር እንተደሊኻ ሚጥሚጣ ውሰድ።",
        },
      },
      {
        q: { de: "Wie bewahre ich Gewürze und Mehl richtig auf?", en: "How should I store spices and flour?", ti: "ቅመምን ሓርጭን ብኸመይ እዕቅቦ?" },
        a: {
          de: "Am besten kühl, trocken und dunkel in einem luftdicht verschlossenen Behälter. So bleiben Aroma und Frische lange erhalten. Das Mindesthaltbarkeitsdatum steht auf jeder Packung.",
          en: "Ideally in a cool, dry, dark place in an airtight container. This keeps the aroma and freshness for a long time. The best-before date is printed on every pack.",
          ti: "ኣብ ዝሑል፡ ደረቕን ጸልማትን ቦታ ብዕጹው መዕቀኒ ኣቐምጦ። ዕለት ምብላሽ ኣብ ነፍሲ ወከፍ ፓኮ ተጻሒፉ ኣሎ።",
        },
      },
      {
        q: { de: "Was ist Teff?", en: "What is teff?", ti: "ጣፍ እንታይ እዩ?" },
        a: {
          de: "Teff ist ein uraltes Getreide aus Eritrea und Äthiopien mit sehr kleinen Körnern. Aus Teff-Mehl backt man das traditionelle Injera.",
          en: "Teff is an ancient grain from Eritrea and Ethiopia with very small seeds. Teff flour is used to make traditional injera.",
          ti: "ጣፍ ካብ ኤርትራን ኢትዮጵያን ዝመጽእ ጥንታዊ እኽሊ እዩ። ካብ ሓርጭ ጣፍ ጣይታ ይስራሕ።",
        },
      },
      {
        q: { de: "Was ist Maschella?", en: "What is mashella?", ti: "መሽላ እንታይ እዩ?" },
        a: {
          de: "Maschella ist Sorghum, eine Hirse-Art, die in Eritrea viel angebaut wird. Das Mehl wird oft mit Teff gemischt, um Injera zu backen, und ist die Grundlage für Ga'at, einen festen Brei.",
          en: "Mashella is sorghum, a type of millet widely grown in Eritrea. The flour is often mixed with teff to make injera and is the basis for ga'at, a thick porridge.",
          ti: "መሽላ ኣብ ኤርትራ ብብዝሒ ዝዝራእ እኽሊ እዩ። ሓርጩ ምስ ጣፍ ተሓዊሱ ንጣይታ ይኸውን፡ ከምኡ'ውን ንዓጊት።",
        },
      },
      {
        q: { de: "Soll ich 500 g oder 1 kg nehmen?", en: "Should I get 500 g or 1 kg?", ti: "500 ግራም ድየ ክወስድ ወይስ 1 ኪሎ?" },
        a: {
          de: "500 g sind ideal zum Ausprobieren. Wenn du regelmäßig Injera backst, lohnt sich die 1-kg-Packung – sie ist pro Kilo günstiger.",
          en: "500 g is ideal for trying it out. If you make injera regularly, the 1 kg pack is worth it – it is cheaper per kilo.",
          ti: "500 ግራም ንምፍታን ጽቡቕ እዩ። ብቐጻሊ ጣይታ እንተ ትሰርሕ 1 ኪሎ ይሓይሽ – ዋግኡ ይቐንስ።",
        },
      },
      {
        q: { de: "Wie mache ich Injera?", en: "How do I make injera?", ti: "ጣይታ ብኸመይ ይስራሕ?" },
        a: {
          de: "Kurz gesagt: Teff-Mehl (pur oder mit Maschella gemischt) mit Wasser zu einem dünnen Teig verrühren und 2–3 Tage bei Zimmertemperatur gären lassen. Dann den Teig dünn in einer großen, heißen Pfanne (Mogogo) backen – ohne Wenden, mit Deckel, bis sich die typischen kleinen Löcher bilden.",
          en: "In short: mix teff flour (on its own or with mashella) with water into a thin batter and let it ferment for 2–3 days at room temperature. Then pour the batter thinly into a large, hot pan (mogogo) and cook it covered, without flipping, until the typical small holes form.",
          ti: "ሓርጭ ጣፍ (ንበይኑ ወይ ምስ መሽላ) ምስ ማይ ሓዊስካ 2–3 መዓልቲ ኣብ ሙቐት ገዛ ክብኩዕ ግደፎ። ድሕሪኡ ኣብ ውዑይ ምጎጎ ብቐጢን ኣፍስሶ፡ ብመኸደኒ ሽፊንካ ክሳብ ዓይኑ ዝወጽእ ኣብስሎ።",
        },
      },
    ],
  },
  {
    group: { de: "Kontakt", en: "Contact", ti: "ርክብ" },
    items: [
      {
        q: { de: "Meine Frage ist nicht dabei – wie erreiche ich euch?", en: "My question isn't listed – how can I reach you?", ti: "ሕቶይ ኣብዚ የለን – ብኸመይ ክረኽበኩም እኽእል?" },
        a: {
          de: "Schreib uns einfach eine E-Mail an {email}. Wir antworten so schnell wie möglich.",
          en: "Just send us an email at {email}. We'll reply as soon as possible.",
          ti: "ብ{email} ኢመይል ጽሓፉልና። ብቕልጡፍ ክንምልሰልኩም ኢና።",
        },
      },
    ],
  },
];

(function () {
  "use strict";

  let lang = loadLanguage(); // siehe lang-menu.js
  const tr = (field) => field[lang] || field.de;

  const euro = (n) =>
    new Intl.NumberFormat(localeFor(lang), { style: "currency", currency: SHOP_CONFIG.currency }).format(n);
  const fill = (text) =>
    text
      .replace("{shipping}", euro(SHOP_CONFIG.shippingCost))
      .replace("{free}", euro(SHOP_CONFIG.freeShippingFrom))
      .replace("{email}", `<a href="mailto:${SHOP_CONFIG.contactEmail}">${SHOP_CONFIG.contactEmail}</a>`);

  const PAGE = {
    de: { title: "Häufige Fragen", back: "← Zurück zum Shop" },
    en: { title: "Frequently asked questions", back: "← Back to the shop" },
    ti: { title: "ተደጋገምቲ ሕቶታት", back: "← ናብ ድኳን ተመለስ" },
  };

  function render() {
    document.documentElement.lang = lang;
    document.getElementById("faq-title").textContent = (PAGE[lang] || PAGE.de).title;
    document.getElementById("faq-back").textContent = (PAGE[lang] || PAGE.de).back;
    // Texte stammen nur aus dieser Datei (vom Shop-Betreiber), daher innerHTML für Links
    document.getElementById("faq-list").innerHTML = FAQ.map(
      (group) => `
      <h2>${tr(group.group)}</h2>
      ${group.items
        .map(
          (item) => `
        <details class="faq">
          <summary>${tr(item.q)}</summary>
          <p>${fill(tr(item.a))}</p>
        </details>`
        )
        .join("")}`
    ).join("");
  }

  initLangMenu(lang, (code) => {
    lang = code;
    render();
  });

  render();
})();
