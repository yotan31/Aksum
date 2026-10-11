# Aksum mit Supabase einrichten (kostenlos)

Danach gilt:
- **Shop** (aksum-shop.de): Bestellungen landen automatisch im Kontor, Kunden bekommen eine Bestellbestätigung, der Widerrufsbutton funktioniert, und ausverkaufte Produkte werden automatisch markiert.
- **Kontor** (aksum-shop.de/kontor): eigene Web-App mit Login. Nur freigeschaltete E-Mail-Adressen sehen deine Daten. Am Handy legst du sie als App auf den Home-Bildschirm.

**Kosten: 0 €.** Supabase (Datenbank), GitHub Pages (Webseite), Brevo (E-Mails, 300 pro Tag) und GitHub Actions (wach halten) sind im kostenlosen Tarif. PayPal nimmt nur die üblichen Gebühren pro Verkauf.

> **Schneller Weg:** Lege das Supabase-Konto an (Schritt 1) und verbinde Supabase mit Claude.
> Dann übernimmt Claude die Schritte 2, 3 und 5. Du machst nur noch 1, 4, 6, 7 und 8.

---

## 1. Supabase-Konto und Projekt anlegen
1. Auf **supabase.com** → **Start your project** → **Continue with GitHub**.
2. **New project**:
   - Name: `aksum`
   - Database Password: ein starkes Passwort. Speichere es im Passwort-Manager.
   - Region: **Central EU (Frankfurt)**
   - Plan: **Free**
3. Ein paar Minuten warten, bis das Projekt bereit ist.

## 2. Datenbank anlegen
1. Links auf **SQL Editor** → **New query**.
2. Den kompletten Inhalt von `supabase/schema.sql` einfügen → **Run**.
3. Diese Zeile mit **deiner** E-Mail-Adresse ausführen (das ist dein Admin-Zugang):
   ```sql
   insert into public.admins (email) values ('deine@email.de');
   ```
4. Den Inhalt von `supabase/import-bisherige-daten.sql` ausführen. Das übernimmt deine bisherigen Kosten und Todos.

## 3. Anmeldung einstellen
1. **Authentication → Sign In / Providers → Email**: aktiviert lassen, **Confirm email** an.
2. **Authentication → URL Configuration**:
   - Site URL: `https://aksum-shop.de/kontor/`
   - Redirect URLs: `https://aksum-shop.de/kontor/` hinzufügen.

## 4. Adresse und öffentlichen Schlüssel eintragen
1. **Project Settings → API** (bzw. **Data API**): **Project URL** und den **anon / public**-Schlüssel kopieren.
2. Beides in `js/config.js` eintragen (oder Claude schicken):
   ```js
   supabaseUrl: "https://xxxx.supabase.co",
   supabaseAnonKey: "eyJ...",
   ```
   Der anon-Schlüssel ist öffentlich und darf auf der Webseite stehen. Den **service_role**-Schlüssel gibst du **niemals** weiter.

## 5. Server-Funktionen hochladen
Für **jede** der beiden Funktionen:
1. **Edge Functions → Deploy a new function → Via Editor**.
2. Name `paypal` → Inhalt von `supabase/functions/paypal/index.ts` einfügen → **Deploy**.
3. Name `widerruf` → Inhalt von `supabase/functions/widerruf/index.ts` einfügen → **Deploy**.

Danach unter **Edge Functions → Secrets** eintragen:

| Name | Wert |
|---|---|
| `SHOP_URL` | `https://aksum-shop.de` |
| `SHOP_EMAIL` | `info@aksum-shop.de` |
| `PAYPAL_ENV` | `sandbox` (zum Testen), später `live` |
| `PAYPAL_CLIENT_ID` | aus Schritt 7 |
| `PAYPAL_SECRET` | aus Schritt 7 (geheim!) |
| `BREVO_API_KEY` | aus Schritt 6 (geheim!) |

## 6. E-Mail-Versand (Brevo, kostenlos)
1. Kostenloses Konto auf **brevo.com** anlegen.
2. **Senders, Domains & Dedicated IPs → Domains → Add a domain**: `aksum-shop.de`.
   Brevo zeigt dir ein paar DNS-Einträge. Die trägst du bei **IONOS → Domains → aksum-shop.de → DNS** genauso ein (wie damals bei GitHub).
3. **Senders → Add a sender**: `info@aksum-shop.de`.
4. **SMTP & API → API Keys → Generate a new API key** → als `BREVO_API_KEY` eintragen (Schritt 5).

## 7. PayPal verbinden
1. Auf **developer.paypal.com** mit deinem PayPal-Geschäftskonto anmelden.
2. **Apps & Credentials** → erst **Sandbox** (Test) → **Create App**.
3. **Client ID** und **Secret** als Secrets eintragen (Schritt 5). Die Client ID zusätzlich in `js/config.js` bei `paypalClientId`.
4. Mit einem Sandbox-Testkonto eine Bestellung machen. Sie muss im Kontor unter **Bestellungen** erscheinen, und eine Bestätigungsmail muss ankommen.
5. Erst dann auf **Live** umschalten: neue Live-App anlegen, Live-Client-ID und Live-Secret eintragen, `PAYPAL_ENV` auf `live` setzen.

## 8. Im Kontor registrieren
1. **aksum-shop.de/kontor** öffnen → **Registrieren** mit genau der E-Mail aus Schritt 2.
2. Bestätigungslink im Postfach anklicken → anmelden.
3. Am Handy: Seite öffnen → Teilen → **Zum Home-Bildschirm**.
4. Weitere Personen schaltest du im Kontor unter **Finanzen → Zugang zum Kontor** frei.

---

## Gut zu wissen
- **Wach halten:** Kostenlose Supabase-Projekte pausieren nach 7 Tagen ohne Zugriff. Die GitHub-Aktion `Supabase wach halten` pingt die Datenbank deshalb täglich an. Falls GitHub die Aktion nach längerer Zeit ohne Änderungen am Repo pausiert, bekommst du eine Mail. Dann reicht ein Klick auf „Enable workflow“.
- **Backups:** Der kostenlose Tarif hat keine automatischen Backups. Lade deshalb monatlich im Kontor die EÜR-Tabelle und vierteljährlich das Belege-Archiv herunter. Die Fristen erinnern dich daran.
- **Belege auslesen:** In der Web-App läuft die Texterkennung kostenlos im Browser. Beim ersten Mal werden einmalig ein paar Megabyte geladen. Sie ist nicht so gut wie eine KI. Prüfe deshalb jede Angabe, oder schick das Foto an Claude, dann trägt Claude den Beleg ein.
- **Die Claude-Seite** des Kontors bleibt vorerst als Reserve bestehen. Deine Daten laufen ab der Einrichtung nur noch über Supabase.
