/*
 * Widerrufsbutton (Pflicht seit 19.06.2026): zweistufig, ohne Login.
 * Ist in config.js "withdrawalEndpoint" eingetragen, wird der Widerruf
 * dorthin geschickt und der Kunde bekommt eine Eingangsbestätigung per
 * E-Mail. Solange das fehlt, zeigt die Seite den Text zum Versenden per E-Mail.
 */
(function () {
  "use strict";

  const T = {
    de: {
      title: "Vertrag widerrufen",
      back: "← Zurück zum Shop",
      intro: "Hier kannst du einen Kauf innerhalb der Widerrufsfrist widerrufen. Ein Kundenkonto brauchst du dafür nicht.",
      order: "Bestellnummer (aus der Bestellbestätigung oder der PayPal-Transaktionscode)",
      date: "Bestelldatum",
      name: "Dein Name",
      email: "Deine E-Mail-Adresse (für die Eingangsbestätigung)",
      items: "Welche Artikel? (leer lassen = die ganze Bestellung)",
      next: "Weiter",
      missing: "Bitte fülle Bestellnummer, Bestelldatum, Name und eine gültige E-Mail-Adresse aus.",
      confirmText: "Bitte prüfe deine Angaben. Mit dem Klick auf „Widerruf bestätigen“ widerrufst du den folgenden Vertrag:",
      allItems: "die ganze Bestellung",
      back2: "Angaben ändern",
      confirm: "Widerruf bestätigen",
      sending: "Wird gesendet …",
      sendError: "Der Widerruf konnte gerade nicht gesendet werden. Bitte versuche es nochmal oder schreib uns an {email}.",
      done: "Dein Widerruf ist am {date} um {time} Uhr bei uns eingegangen. Du bekommst eine Bestätigung an {email}. Bitte schicke die Ware an die Adresse aus unserem Impressum zurück.",
      fallback: "Bitte sende deinen Widerruf per E-Mail an {email}. Der Text ist schon vorbereitet:",
      copy: "Text kopieren",
      copied: "Kopiert",
      mailto: "E-Mail öffnen",
      mailSubject: "Widerruf Bestellung {order}",
      mailBody: "Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden Waren:\n{items}\n\nBestellnummer: {order}\nBestellt am: {date}\nName: {name}\nE-Mail: {email}\n\nDatum: {today}",
      lOrder: "Bestellnummer", lDate: "Bestellt am", lName: "Name", lEmail: "E-Mail", lItems: "Artikel",
    },
    en: {
      title: "Cancel contract",
      back: "← Back to the shop",
      intro: "Here you can withdraw from a purchase within the withdrawal period. You do not need a customer account.",
      order: "Order number (from the order confirmation, or the PayPal transaction ID)",
      date: "Order date",
      name: "Your name",
      email: "Your email address (for the confirmation of receipt)",
      items: "Which items? (leave empty = the whole order)",
      next: "Continue",
      missing: "Please enter the order number, order date, name and a valid email address.",
      confirmText: "Please check your details. By clicking “Confirm withdrawal” you withdraw from the following contract:",
      allItems: "the whole order",
      back2: "Change details",
      confirm: "Confirm withdrawal",
      sending: "Sending …",
      sendError: "Your withdrawal could not be sent right now. Please try again or write to us at {email}.",
      done: "We received your withdrawal on {date} at {time}. A confirmation will be sent to {email}. Please return the goods to the address in our legal notice.",
      fallback: "Please send your withdrawal by email to {email}. The text is already prepared:",
      copy: "Copy text",
      copied: "Copied",
      mailto: "Open email",
      mailSubject: "Withdrawal order {order}",
      mailBody: "I hereby withdraw from the contract I concluded for the purchase of the following goods:\n{items}\n\nOrder number: {order}\nOrdered on: {date}\nName: {name}\nEmail: {email}\n\nDate: {today}",
      lOrder: "Order number", lDate: "Ordered on", lName: "Name", lEmail: "Email", lItems: "Items",
    },
  };

  let lang = loadLanguage();
  const t = (k, vars) => {
    let s = (T[lang] && T[lang][k]) || T.de[k] || k;
    Object.entries(vars || {}).forEach(([n, v]) => { s = s.split("{" + n + "}").join(v); });
    return s;
  };
  const $ = (id) => document.getElementById(id);
  const fmtDate = (iso) => (iso ? new Date(iso + "T12:00:00").toLocaleDateString(lang === "en" ? "en-GB" : "de-DE") : "");
  let data = null;

  function texts() {
    document.documentElement.lang = lang;
    $("wd-title").textContent = t("title");
    $("wd-back").textContent = t("back");
    $("wd-intro").textContent = t("intro");
    $("l-order").textContent = t("order");
    $("l-date").textContent = t("date");
    $("l-name").textContent = t("name");
    $("l-email").textContent = t("email");
    $("l-items").textContent = t("items");
    $("wd-next").textContent = t("next");
    $("wd-back2").textContent = t("back2");
    $("wd-confirm").textContent = t("confirm");
    $("wd-copy").textContent = t("copy");
    $("wd-mailto").textContent = t("mailto");
    if (data) summary();
  }

  function summary() {
    $("wd-confirm-text").textContent = t("confirmText");
    const rows = [["lOrder", data.orderNo], ["lDate", fmtDate(data.orderDate)], ["lName", data.name], ["lEmail", data.email], ["lItems", data.items || t("allItems")]];
    $("wd-summary").innerHTML = "";
    rows.forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = t(k);
      const dd = document.createElement("dd"); dd.textContent = v;
      $("wd-summary").append(dt, dd);
    });
  }

  $("wd-step1").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = {
      orderNo: $("wd-order").value.trim(), orderDate: $("wd-date").value, name: $("wd-name").value.trim(),
      email: $("wd-email").value.trim(), items: $("wd-items").value.trim(),
    };
    const ok = d.orderNo && d.orderDate && d.name && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email);
    $("wd-error1").hidden = !!ok;
    $("wd-error1").textContent = t("missing");
    if (!ok) return;
    data = d;
    summary();
    $("wd-step1").hidden = true;
    $("wd-step2").hidden = false;
    $("wd-confirm").focus();
  });

  $("wd-back2").addEventListener("click", () => {
    $("wd-step2").hidden = true;
    $("wd-step1").hidden = false;
  });

  $("wd-step2").addEventListener("submit", async (e) => {
    e.preventDefault();
    const now = new Date();
    const hp = document.getElementById("wd-website");
    const payload = { ...data, submittedAt: now.toISOString(), language: lang, website: hp ? hp.value : "" };
    const sb = (SHOP_CONFIG.supabaseUrl || "").replace(/\/$/, "");
    const endpoint = (SHOP_CONFIG.withdrawalEndpoint || "").trim() || (sb ? sb + "/functions/v1/widerruf" : "");
    const headers = { "Content-Type": "application/json" };
    if (sb && SHOP_CONFIG.supabaseAnonKey) { headers.apikey = SHOP_CONFIG.supabaseAnonKey; headers.Authorization = "Bearer " + SHOP_CONFIG.supabaseAnonKey; }
    if (endpoint) {
      const btn = $("wd-confirm");
      btn.disabled = true; btn.textContent = t("sending");
      try {
        const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(String(res.status));
        $("wd-step2").hidden = true;
        $("wd-done").hidden = false;
        $("wd-done-text").textContent = t("done", {
          date: now.toLocaleDateString(lang === "en" ? "en-GB" : "de-DE"),
          time: now.toLocaleTimeString(lang === "en" ? "en-GB" : "de-DE", { hour: "2-digit", minute: "2-digit" }),
          email: data.email,
        });
      } catch (err) {
        $("wd-error2").hidden = false;
        $("wd-error2").textContent = t("sendError", { email: SHOP_CONFIG.contactEmail });
      } finally {
        btn.disabled = false; btn.textContent = t("confirm");
      }
      return;
    }
    // Ersatzweg, solange keine E-Mail-Funktion eingerichtet ist
    const body = t("mailBody", {
      items: data.items || t("allItems"), order: data.orderNo, date: fmtDate(data.orderDate),
      name: data.name, email: data.email, today: now.toLocaleDateString(lang === "en" ? "en-GB" : "de-DE"),
    });
    $("wd-step2").hidden = true;
    $("wd-fallback").hidden = false;
    $("wd-fallback-text").textContent = t("fallback", { email: SHOP_CONFIG.contactEmail });
    $("wd-mailtext").value = body;
    $("wd-mailto").href = "mailto:" + SHOP_CONFIG.contactEmail + "?subject=" + encodeURIComponent(t("mailSubject", { order: data.orderNo })) + "&body=" + encodeURIComponent(body);
  });

  $("wd-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("wd-mailtext").value); }
    catch (e) { $("wd-mailtext").select(); document.execCommand("copy"); }
    $("wd-copy").textContent = t("copied");
    setTimeout(() => ($("wd-copy").textContent = t("copy")), 2000);
  });

  initLangMenu(lang, (code) => { lang = code; texts(); });
  texts();
})();
