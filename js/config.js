/*
 * ============================================================
 *  EINSTELLUNGEN DES SHOPS
 *  Hier kannst du die wichtigsten Dinge ändern, ohne
 *  programmieren zu können. Nur die Werte zwischen den
 *  Anführungszeichen "..." bzw. die Zahlen ändern.
 * ============================================================
 */
const SHOP_CONFIG = {
  // Name des Shops (erscheint oben links und im Browser-Tab)
  shopName: "Aksum",

  // Bestellen und Bezahlen ein- oder ausschalten.
  // false = Die Seite zeigt nur die Produkte (ohne Warenkorb und PayPal)
  //         und einen Hinweis, dass der Shop bald öffnet.
  // true  = Kunden können bestellen und mit PayPal bezahlen.
  ordersEnabled: false,

  // Deine PayPal Client-ID (Anleitung in README.md, Schritt 3).
  // "sb" ist ein Test-Modus von PayPal: Es fließt KEIN echtes Geld.
  // Für echte Verkäufe hier deine "Live Client ID" eintragen.
  paypalClientId: "sb",

  // Währung (EUR = Euro)
  currency: "EUR",

  // Versandkosten in Euro
  shippingCost: 4.90,

  // Ab diesem Bestellwert ist der Versand kostenlos (0 = nie kostenlos)
  freeShippingFrom: 50,

  // Kontaktdaten (erscheinen unten auf der Seite)
  contactEmail: "info@aksum-shop.de",
  contactPhone: "+49 000 0000000",
  instagram: "", // z. B. "https://instagram.com/aksum.shop" (leer lassen = ausblenden)
};
