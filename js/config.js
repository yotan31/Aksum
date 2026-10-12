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

  // Kleinunternehmer nach § 19 UStG?
  // false = Preise werden als "inkl. MwSt." angezeigt.
  // true  = Hinweis "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
  // Erst umstellen, wenn das Finanzamt deinen Status bestätigt hat.
  smallBusiness: true,

  // Lieferzeit (erscheint bei jedem Produkt und im Warenkorb)
  deliveryTime: { de: "2–5 Werktage", en: "2–5 working days", ti: "2–5 መዓልታት ስራሕ" },

  // Supabase (Datenbank). Beide Werte findest du in Supabase unter
  // Project Settings → API. Der "anon"-Schlüssel ist öffentlich und darf hier stehen.
  // Leer lassen = Shop läuft wie bisher ohne Datenbank.
  supabaseUrl: "https://dmmecpmjuogfqcsabnnw.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtbWVjcG1qdW9nZnFjc2Fibm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTM3ODksImV4cCI6MjEwNzMyOTc4OX0.LU9j3nwS8xb1SE6APaL1jlfOpNMShDaB0pvZIg09j9s",

  // Nur falls die Widerrufs-Funktion woanders liegt. Leer = Supabase-Funktion "widerruf".
  withdrawalEndpoint: "",

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
