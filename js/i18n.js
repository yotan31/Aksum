/*
 * ============================================================
 *  TEXTE DER WEBSEITE (Deutsch = de, Tigrinya = ti)
 *  Die Tigrinya-Texte sollten von einer Muttersprachlerin
 *  oder einem Muttersprachler gegengelesen werden.
 * ============================================================
 */
const TEXTS = {
  de: {
    "nav.shop": "Shop",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.faq": "FAQ",
    "nav.cart": "Warenkorb",

    "hero.kicker": "Aus Eritrea zu dir nach Hause",
    "hero.title": "Gewürze & Kultur aus Eritrea",
    "hero.text": "Echtes Berbere, Shiro, Teff-Mehl, Kaffee für die Bun-Zeremonie und handgemachte Kulturgegenstände – sorgfältig ausgewählt und schnell verschickt.",
    "hero.cta": "Zum Shop",

    "shop.title": "Unsere Produkte",
    "filter.all": "Alle",
    "filter.spices": "Gewürze",
    "filter.flour": "Mehl",
    "filter.culture": "Kultur",
    "product.add": "In den Warenkorb",
    "product.added": "Hinzugefügt ✓",
    "badge.glutenFree": "Glutenfrei",

    "about.title": "Über Aksum",
    "about.text1": "Aksum war eines der großen Königreiche der Antike – am Roten Meer, im Gebiet des heutigen Eritrea und Äthiopien. Der Name steht für eine reiche Geschichte und Kultur, die wir mit diesem Shop teilen möchten.",
    "about.text2": "Wir bringen dir die Aromen der eritreischen Küche und die schönen Dinge des Alltags – von der Jebena bis zum Mesob – direkt nach Hause.",

    "contact.title": "Kontakt",
    "contact.text": "Fragen zu Produkten oder Bestellungen? Schreib uns gerne!",

    "cart.title": "Dein Warenkorb",
    "cart.empty": "Dein Warenkorb ist leer.",
    "cart.subtotal": "Zwischensumme",
    "cart.shipping": "Versand",
    "cart.free": "kostenlos",
    "cart.total": "Gesamt",
    "cart.freeHint": "Noch {amount} bis zum kostenlosen Versand.",
    "cart.remove": "Entfernen",
    "cart.payWith": "Sicher bezahlen mit PayPal:",
    "cart.legal": "Mit der Bestellung akzeptierst du unsere <a href=\"agb.html\">AGB</a> und die <a href=\"datenschutz.html\">Datenschutzerklärung</a>. Alle Preise inkl. MwSt.",
    "cart.paypalError": "PayPal konnte nicht geladen werden. Bitte später erneut versuchen.",

    "thanks.title": "Vielen Dank für deine Bestellung!",
    "thanks.text": "Deine Zahlung ist eingegangen. Du bekommst eine Bestätigung per E-Mail von PayPal. Bestellnummer:",
    "thanks.close": "Weiter einkaufen",
    "error.payment": "Die Zahlung hat leider nicht geklappt. Bitte versuche es erneut.",

    "footer.faq": "Häufige Fragen",
    "footer.imprint": "Impressum",
    "footer.privacy": "Datenschutz",
    "footer.terms": "AGB & Widerruf",
    "footer.shipping": "Versandkosten: {cost} · ab {free} versandkostenfrei",
  },

  ti: {
    "nav.shop": "ድኳን",
    "nav.about": "ብዛዕባና",
    "nav.contact": "ርክብ",
    "nav.faq": "ሕቶታት",
    "nav.cart": "ዘንቢል",

    "hero.kicker": "ካብ ኤርትራ ናብ ገዛኻ",
    "hero.title": "ቅመማትን ባህላዊ ኣቑሑን ካብ ኤርትራ",
    "hero.text": "ናይ ሓቂ በርበረ፡ ሽሮ፡ ሓርጭ ጣፍ፡ ንስርዓተ ቡን ዝኸውን ቡንን ብኢድ ዝተሰርሑ ባህላዊ ኣቑሑን – ብጥንቃቐ ተመሪጾም ብቕልጡፍ ይለኣኹ።",
    "hero.cta": "ናብ ድኳን",

    "shop.title": "ፍርያትና",
    "filter.all": "ኩሉ",
    "filter.spices": "ቅመማት",
    "filter.flour": "ሓርጭ",
    "filter.culture": "ባህሊ",
    "product.add": "ናብ ዘንቢል ወስኽ",
    "product.added": "ተወሲኹ ✓",
    "badge.glutenFree": "ብዘይ ግሉተን",

    "about.title": "ብዛዕባ ኣኽሱም",
    "about.text1": "ኣኽሱም ሓደ ካብ ዓበይቲ መንግስታት ጥንቲ እዩ ነይሩ – ኣብ ጥቓ ቀይሕ ባሕሪ። እዚ ስም ንሃብታም ታሪኽን ባህልን ዝውክል እዩ።",
    "about.text2": "ጣዕሚ ኤርትራዊ መግብን ጽቡቕ ባህላዊ ኣቑሑን – ካብ ጀበና ክሳብ መሶብ – ናብ ገዛኻ ነብጽሓልካ።",

    "contact.title": "ርክብ",
    "contact.text": "ብዛዕባ ፍርያት ወይ ትእዛዝ ሕቶ ኣሎካ? ጽሓፉልና!",

    "cart.title": "ዘንቢልካ",
    "cart.empty": "ዘንቢልካ ባዶ እዩ።",
    "cart.subtotal": "ንኡስ ድምር",
    "cart.shipping": "ናይ ምልኣኽ ክፍሊት",
    "cart.free": "ብነጻ",
    "cart.total": "ጠቕላላ ድምር",
    "cart.freeHint": "ንነጻ ምልኣኽ {amount} ጥራይ ተሪፉ።",
    "cart.remove": "ኣልግስ",
    "cart.payWith": "ብውሑስ መንገዲ ብPayPal ክፈል፦",
    "cart.legal": "ብምእዛዝካ <a href=\"agb.html\">ውዕላትና (AGB)</a>ን <a href=\"datenschutz.html\">ፖሊሲ ምስጢራዊነትን</a> ትቕበል። ኩሉ ዋጋታት ምስ ግብሪ (MwSt.) እዩ።",
    "cart.paypalError": "PayPal ክጽዓን ኣይከኣለን። በጃኻ ደሓር ደጊምካ ፈትን።",

    "thanks.title": "ስለ ትእዛዝካ ብዙሕ የቐንየልና!",
    "thanks.text": "ክፍሊትካ በጺሑና ኣሎ። ካብ PayPal ብኢመይል መረጋገጺ ክመጸካ እዩ። ቁጽሪ ትእዛዝ፦",
    "thanks.close": "ዕድጊ ቀጽል",
    "error.payment": "ክፍሊት ኣይተዓወተን። በጃኻ ደጊምካ ፈትን።",

    "footer.faq": "ተደጋገምቲ ሕቶታት",
    "footer.imprint": "Impressum",
    "footer.privacy": "ምስጢራዊነት",
    "footer.terms": "ውዕላት (AGB)",
    "footer.shipping": "ናይ ምልኣኽ ክፍሊት፦ {cost} · ካብ {free} ንላዕሊ ብነጻ",
  },
};
