# E-Mail-Vorlagen für den Shop

Diese Texte verschickt später die E-Mail-Funktion (Cloudflare Worker) automatisch.
Bis dahin kannst du sie von Hand verwenden. Platzhalter stehen in {geschweiften Klammern}.
**Vor dem Start prüfen lassen** (z. B. Händlerbund, IT-Recht-Kanzlei).

---

## 1. Bestellbestätigung (direkt nach der Zahlung)

**Betreff:** Deine Bestellung {Bestellnummer} bei Aksum

Hallo {Name},

vielen Dank für deine Bestellung! Hier ist die Übersicht:

{Artikel – Menge – Preis}
Versand: {Versandkosten}
**Gesamt: {Gesamtbetrag}** ({Steuerhinweis: „inkl. MwSt.“ oder „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“})

Bezahlt mit PayPal am {Datum}.
Lieferadresse: {Adresse}
Voraussichtliche Lieferzeit: 2–5 Werktage.

Unsere AGB und die Widerrufsbelehrung findest du unten in dieser E-Mail
und unter https://aksum-shop.de/agb.html.
Widerrufen kannst du ganz einfach hier: https://aksum-shop.de/widerruf.html

Viele Grüße
{Dein Name} · Aksum
{Anschrift} · info@aksum-shop.de

--- Anhang in der Mail (Pflicht, „dauerhafter Datenträger“) ---
- vollständige AGB
- Widerrufsbelehrung
- Muster-Widerrufsformular

---

## 2. Eingangsbestätigung Widerruf (automatisch nach dem Widerrufsbutton)

**Betreff:** Wir haben deinen Widerruf erhalten – Bestellung {Bestellnummer}

Hallo {Name},

dein Widerruf ist am {Datum} um {Uhrzeit} Uhr bei uns eingegangen.

Bestellnummer: {Bestellnummer}
Betroffene Artikel: {Artikel oder „die ganze Bestellung“}

Bitte schicke die Ware innerhalb von 14 Tagen an:
{Anschrift}

Sobald die Ware bei uns ist, erstatten wir dir den Betrag über PayPal.
Hinweis: Geöffnete, versiegelte Lebensmittel (z. B. Gewürze) sind vom Widerruf ausgeschlossen.

Viele Grüße
{Dein Name} · Aksum

---

## 3. Versandbestätigung (macht das Kontor per Knopfdruck)

**Betreff:** Deine Aksum-Bestellung ist unterwegs

Hallo,

deine Bestellung {Bestellnummer} ist heute an DHL übergeben worden.
Sendungsnummer: {Sendungsnummer}
Verfolgen: https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode={Sendungsnummer}

Viel Freude mit deinen Produkten!
Aksum
