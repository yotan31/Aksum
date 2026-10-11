# Aksum – Eritreische Gewürze & Kultur

Online-Shop für eritreische Gewürze und Kulturgegenstände, auf Deutsch, Englisch und Tigrinya, mit Bezahlung über PayPal.
Die Seite braucht keinen eigenen Server und kann kostenlos über **GitHub Pages** veröffentlicht werden.

## Was ist wo?

| Datei | Wofür? |
|---|---|
| `js/products.js` | **Deine Produkte** (Name, Preis, Beschreibung, Foto) |
| `js/config.js` | **Einstellungen**: PayPal-ID, Versandkosten, Kontaktdaten |
| `js/i18n.js` | Alle Texte der Seite auf Deutsch, Englisch und Tigrinya |
| `js/faq.js` | **Häufige Fragen** (FAQ) auf Deutsch, Englisch und Tigrinya |
| `js/lang-menu.js` | Sprachauswahl (Dropdown) und Reihenfolge der Sprachen |
| `images/` | Hier kommen deine Produktfotos hinein |
| `impressum.html`, `datenschutz.html`, `agb.html` | Rechtstexte (**müssen noch ausgefüllt werden!**) |
| `index.html`, `css/`, `js/app.js` | Aufbau, Design und Technik (normalerweise nicht ändern) |

## Schritt für Schritt online gehen

### 1. Webseite veröffentlichen (GitHub Pages)
1. Den Branch mit dem Shop in `main` übernehmen (Pull Request mergen).
2. Auf GitHub im Projekt **Settings → Pages** öffnen.
3. Unter „Build and deployment“: **Source = Deploy from a branch**, **Branch = main**, Ordner **/ (root)** → *Save*.
4. Nach 1–2 Minuten ist die Seite erreichbar unter `https://yotan31.github.io/Aksum/`.
5. Später kannst du eine eigene Adresse (z. B. `aksum-shop.de`) verbinden, das kostet etwa 1 € im Monat.

### 2. PayPal-Geschäftskonto
1. Ein kostenloses **PayPal-Geschäftskonto** eröffnen: <https://www.paypal.com/de/business>
2. PayPal nimmt pro Verkauf eine Gebühr (ca. 2,5 % + 0,35 €). Monatliche Kosten gibt es keine.

### 3. PayPal mit dem Shop verbinden
1. Auf <https://developer.paypal.com> mit dem PayPal-Geschäftskonto einloggen.
2. **Apps & Credentials** → oben auf **Live** umschalten → **Create App**.
3. Die angezeigte **Client ID** kopieren. Sie ist öffentlich und darf in die Webseite.
   ⚠️ Das **Secret** niemals irgendwo eintragen oder weitergeben!
4. In `js/config.js` den Wert `paypalClientId: "sb"` durch deine Client ID ersetzen.

> Solange dort `"sb"` steht, läuft PayPal im **Testmodus**: Es fließt kein echtes Geld.

5. **Bestellungen einschalten:** In `js/config.js` steht `ordersEnabled: false`. Solange das so ist, zeigt die Seite nur die Produkte mit einem „Shop öffnet bald“-Hinweis, ohne Warenkorb und ohne PayPal. Zum Start auf `true` ändern.

### 4. Bestellungen bearbeiten
- Jede Bestellung erscheint in deinem PayPal-Konto unter **Aktivitäten**, mit allen Artikeln und der Lieferadresse.
- Du bekommst von PayPal zu jeder Bestellung eine E-Mail.
- **Tipp:** Vor dem Versand kurz prüfen, ob der bezahlte Betrag zu den bestellten Artikeln passt.

## Produkte ändern
`js/products.js` öffnen. Auf GitHub geht das mit dem Stift-Symbol direkt im Browser. Dann einen Produkt-Block kopieren und die Werte anpassen.
Produkte mit mehreren Größen (z. B. 500 g / 1 kg) haben statt `price` eine Liste `variants`. Schau dir als Beispiel das Teff-Mehl an.
Für ein Foto lädst du das Bild in den Ordner `images/` hoch und trägst den Pfad ein, z. B. `image: "images/berbere.jpg"`.

## Wichtig vor dem Start (Deutschland)
- **Gewerbe anmelden** beim Gewerbeamt deiner Stadt.
- **Lebensmittel** (Gewürze, Kaffee): beim zuständigen **Lebensmittelüberwachungsamt** registrieren und Kennzeichnung beachten (Zutaten, Allergene, Mindesthaltbarkeit, Füllmenge, Hersteller bzw. Importeur).
- **Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung** ausfüllen und am besten prüfen lassen, z. B. über Händlerbund, IHK oder einen Rechtstext-Generator.
- **Verpackungsgesetz:** Registrierung bei LUCID (kostenlos) und Lizenzierung der Versandverpackungen.
- **Tigrinya- und Englisch-Texte** von Muttersprachlern gegenlesen lassen.
