/*
 * ============================================================
 *  HÄUFIGE FRAGEN (FAQ)
 *  Jede Frage steht zwischen { und } – mit Frage (q) und
 *  Antwort (a), jeweils auf Deutsch (de) und Tigrinya (ti).
 *  {shipping}, {free} und {email} werden automatisch aus
 *  config.js eingesetzt.
 * ============================================================
 */
const FAQ = [
  {
    group: { de: "Bestellung & Bezahlung", ti: "ትእዛዝን ክፍሊትን" },
    items: [
      {
        q: { de: "Wie kann ich bezahlen?", ti: "ብኸመይ ክኸፍል እኽእል?" },
        a: {
          de: "Die Bezahlung läuft sicher über PayPal. Du brauchst dafür nicht unbedingt ein PayPal-Konto: Über den PayPal-Button kannst du auch per Lastschrift oder Kreditkarte bezahlen.",
          ti: "ክፍሊት ብውሑስ መንገዲ ብPayPal እዩ። ሕሳብ PayPal ኣየድልየካን እዩ፡ ብባንክ ካርድ ወይ ክረዲት ካርድ'ውን ክትከፍል ትኽእል ኢኻ።",
        },
      },
      {
        q: { de: "Ist meine Zahlung sicher?", ti: "ክፍሊተይ ውሑስ ድዩ?" },
        a: {
          de: "Ja. Deine Zahlungsdaten gibst du nur bei PayPal ein – wir sehen sie nie. Außerdem gilt der PayPal-Käuferschutz.",
          ti: "እወ። ሓበሬታ ክፍሊትካ ኣብ PayPal ጥራይ ኢኻ ተእትዎ – ንሕና ፈጺምና ኣይንርእዮን። ከምኡ'ውን ሓለዋ ዓዳጊ ናይ PayPal ኣሎ።",
        },
      },
      {
        q: { de: "Brauche ich ein Kundenkonto?", ti: "ሕሳብ ዓሚል የድልየኒ ድዩ?" },
        a: {
          de: "Nein. Leg einfach deine Produkte in den Warenkorb und bezahle mit PayPal. Deine Lieferadresse übernimmt PayPal automatisch.",
          ti: "ኣይፋል። ፍርያትካ ናብ ዘንቢል ወሲኽካ ብPayPal ክፈል። ኣድራሻኻ PayPal ባዕሉ ይወስዶ።",
        },
      },
      {
        q: { de: "Bekomme ich eine Bestätigung?", ti: "መረጋገጺ ይመጸኒ ድዩ?" },
        a: {
          de: "Ja. Direkt nach der Bezahlung bekommst du von PayPal eine E-Mail mit allen Details zu deiner Bestellung.",
          ti: "እወ። ድሕሪ ክፍሊት ብኡንብኡ ካብ PayPal ኩሉ ዝርዝር ትእዛዝካ ዘለዎ ኢመይል ይመጸካ።",
        },
      },
    ],
  },
  {
    group: { de: "Versand & Rückgabe", ti: "ምልኣኽን ምምላስን" },
    items: [
      {
        q: { de: "Was kostet der Versand?", ti: "ምልኣኽ ክንደይ ይኸፍል?" },
        a: {
          de: "Der Versand kostet {shipping}. Ab einem Bestellwert von {free} verschicken wir kostenlos.",
          ti: "ናይ ምልኣኽ ክፍሊት {shipping} እዩ። ካብ {free} ንላዕሊ ብነጻ ንልእኽ።",
        },
      },
      {
        q: { de: "Wie lange dauert die Lieferung?", ti: "ክሳብ ዝበጽሕ ክንደይ ይወስድ?" },
        a: {
          de: "Innerhalb Deutschlands ist deine Bestellung in der Regel nach 2–5 Werktagen bei dir.",
          ti: "ኣብ ውሽጢ ጀርመን ብልሙድ ኣብ 2–5 መዓልታት ስራሕ ይበጽሓካ።",
        },
      },
      {
        q: { de: "Liefert ihr auch ins Ausland?", ti: "ናብ ወጻኢ ሃገር ትልእኹ ዶ?" },
        a: {
          de: "Zurzeit liefern wir nur innerhalb Deutschlands. Für Österreich oder die Schweiz schreib uns gerne eine E-Mail an {email}.",
          ti: "ሕጂ ኣብ ውሽጢ ጀርመን ጥራይ ኢና ንልእኽ። ንኦስትርያ ወይ ስዊዘርላንድ ብ{email} ጽሓፉልና።",
        },
      },
      {
        q: { de: "Kann ich etwas zurückgeben?", ti: "ክመልሶ እኽእል ድየ?" },
        a: {
          de: "Ja, du hast 14 Tage Widerrufsrecht. Ausgenommen sind Lebensmittel wie Gewürze und Mehl, wenn die Verpackung geöffnet wurde. Details findest du in unseren <a href=\"agb.html\">AGB</a>.",
          ti: "እወ፡ ኣብ ውሽጢ 14 መዓልቲ ክትመልሶ ትኽእል። ዝተኸፍተ መግቢ ከም ቅመምን ሓርጭን ግን ኣይምለስን። ዝርዝር ኣብ <a href=\"agb.html\">ውዕላትና (AGB)</a>።",
        },
      },
    ],
  },
  {
    group: { de: "Gewürze & Mehl", ti: "ቅመማትን ሓርጭን" },
    items: [
      {
        q: { de: "Wie scharf ist Berbere?", ti: "በርበረ ክንደይ የሕርር?" },
        a: {
          de: "Berbere ist würzig und mittelscharf bis scharf. Wer es richtig scharf mag, greift zu Mitmita – das ist deutlich schärfer.",
          ti: "በርበረ ጥዑምን ማእከላይ ክሳብ ዘሕርርን እዩ። ኣዝዩ ዘሕርር እንተደሊኻ ሚጥሚጣ ውሰድ።",
        },
      },
      {
        q: { de: "Wie bewahre ich Gewürze und Mehl richtig auf?", ti: "ቅመምን ሓርጭን ብኸመይ እዕቅቦ?" },
        a: {
          de: "Am besten kühl, trocken und dunkel in einem luftdicht verschlossenen Behälter. So bleiben Aroma und Frische lange erhalten. Das Mindesthaltbarkeitsdatum steht auf jeder Packung.",
          ti: "ኣብ ዝሑል፡ ደረቕን ጸልማትን ቦታ ብዕጹው መዕቀኒ ኣቐምጦ። ዕለት ምብላሽ ኣብ ነፍሲ ወከፍ ፓኮ ተጻሒፉ ኣሎ።",
        },
      },
      {
        q: { de: "Was ist Teff?", ti: "ጣፍ እንታይ እዩ?" },
        a: {
          de: "Teff ist ein uraltes Getreide aus Eritrea und Äthiopien mit sehr kleinen Körnern. Aus Teff-Mehl backt man das traditionelle Injera. Teff enthält von Natur aus kein Gluten – bei Unverträglichkeit beachte bitte trotzdem die Hinweise auf der Packung, da Spuren möglich sind.",
          ti: "ጣፍ ካብ ኤርትራን ኢትዮጵያን ዝመጽእ ጥንታዊ እኽሊ እዩ። ካብ ሓርጭ ጣፍ ጣይታ ይስራሕ። ብተፈጥሮ ግሉተን የብሉን – ግን በጃኻ ኣብ ፓኮ ዘሎ ሓበሬታ ርአ።",
        },
      },
      {
        q: { de: "Was ist Maschella?", ti: "መሽላ እንታይ እዩ?" },
        a: {
          de: "Maschella ist Sorghum, eine Hirse-Art, die in Eritrea viel angebaut wird. Das Mehl wird oft mit Teff gemischt, um Injera zu backen, und ist die Grundlage für Ga'at, einen festen Brei.",
          ti: "መሽላ ኣብ ኤርትራ ብብዝሒ ዝዝራእ እኽሊ እዩ። ሓርጩ ምስ ጣፍ ተሓዊሱ ንጣይታ ይኸውን፡ ከምኡ'ውን ንዓጊት።",
        },
      },
      {
        q: { de: "Soll ich 500 g oder 1 kg nehmen?", ti: "500 ግራም ድየ ክወስድ ወይስ 1 ኪሎ?" },
        a: {
          de: "500 g sind ideal zum Ausprobieren. Wenn du regelmäßig Injera backst, lohnt sich die 1-kg-Packung – sie ist pro Kilo günstiger.",
          ti: "500 ግራም ንምፍታን ጽቡቕ እዩ። ብቐጻሊ ጣይታ እንተ ትሰርሕ 1 ኪሎ ይሓይሽ – ዋግኡ ይቐንስ።",
        },
      },
      {
        q: { de: "Wie mache ich Injera?", ti: "ጣይታ ብኸመይ ይስራሕ?" },
        a: {
          de: "Kurz gesagt: Teff-Mehl (pur oder mit Maschella gemischt) mit Wasser zu einem dünnen Teig verrühren und 2–3 Tage bei Zimmertemperatur gären lassen. Dann den Teig dünn in einer großen, heißen Pfanne (Mogogo) backen – ohne Wenden, mit Deckel, bis sich die typischen kleinen Löcher bilden.",
          ti: "ሓርጭ ጣፍ (ንበይኑ ወይ ምስ መሽላ) ምስ ማይ ሓዊስካ 2–3 መዓልቲ ኣብ ሙቐት ገዛ ክብኩዕ ግደፎ። ድሕሪኡ ኣብ ውዑይ ምጎጎ ብቐጢን ኣፍስሶ፡ ብመኸደኒ ሽፊንካ ክሳብ ዓይኑ ዝወጽእ ኣብስሎ።",
        },
      },
    ],
  },
  {
    group: { de: "Kontakt", ti: "ርክብ" },
    items: [
      {
        q: { de: "Meine Frage ist nicht dabei – wie erreiche ich euch?", ti: "ሕቶይ ኣብዚ የለን – ብኸመይ ክረኽበኩም እኽእል?" },
        a: {
          de: "Schreib uns einfach eine E-Mail an {email}. Wir antworten so schnell wie möglich.",
          ti: "ብ{email} ኢመይል ጽሓፉልና። ብቕልጡፍ ክንምልሰልኩም ኢና።",
        },
      },
    ],
  },
];

(function () {
  "use strict";

  const LANG_KEY = "aksum-lang";
  let lang = "de";
  try {
    if (localStorage.getItem(LANG_KEY) === '"ti"') lang = "ti";
  } catch (e) {
    /* ignorieren */
  }

  const euro = (n) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: SHOP_CONFIG.currency }).format(n);
  const fill = (text) =>
    text
      .replace("{shipping}", euro(SHOP_CONFIG.shippingCost))
      .replace("{free}", euro(SHOP_CONFIG.freeShippingFrom))
      .replace("{email}", `<a href="mailto:${SHOP_CONFIG.contactEmail}">${SHOP_CONFIG.contactEmail}</a>`);

  const PAGE = {
    de: { title: "Häufige Fragen", back: "← Zurück zum Shop" },
    ti: { title: "ተደጋገምቲ ሕቶታት", back: "← ናብ ድኳን ተመለስ" },
  };

  function render() {
    document.documentElement.lang = lang;
    document.getElementById("faq-title").textContent = PAGE[lang].title;
    document.getElementById("faq-back").textContent = PAGE[lang].back;
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    // Texte stammen nur aus dieser Datei (vom Shop-Betreiber), daher innerHTML für Links
    document.getElementById("faq-list").innerHTML = FAQ.map(
      (group) => `
      <h2>${group.group[lang]}</h2>
      ${group.items
        .map(
          (item) => `
        <details class="faq">
          <summary>${item.q[lang]}</summary>
          <p>${fill(item.a[lang])}</p>
        </details>`
        )
        .join("")}`
    ).join("");
  }

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = btn.dataset.lang;
      try {
        localStorage.setItem(LANG_KEY, JSON.stringify(lang));
      } catch (e) {
        /* ignorieren */
      }
      render();
    });
  });

  render();
})();
