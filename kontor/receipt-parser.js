/*
 * Kassenzettel-Text auswerten (nach der kostenlosen Texterkennung im Browser).
 * Liefert dasselbe Format wie das Auslesen auf der Claude-Seite.
 * Ergebnis immer prüfen – Texterkennung ist nicht perfekt.
 */
(function (root) {
  "use strict";

  const AMOUNT = /(-?\d{1,5}(?:[.\s]\d{3})*[,.]\d{2})(?!\d)/g;
  const toNum = (s) => {
    s = String(s).replace(/\s/g, "");
    const lc = s.lastIndexOf(","), ld = s.lastIndexOf(".");
    if (lc > ld) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
    return Number(s);
  };
  const amountsIn = (line) => [...line.matchAll(AMOUNT)].map((m) => toNum(m[1])).filter((n) => Number.isFinite(n));
  const round2 = (n) => Math.round(n * 100) / 100;

  const SKIP = /summe|gesamt|total|zu zahlen|zwischensumme|mwst|ust|steuer|netto|brutto|bar\b|gegeben|rückgeld|wechselgeld|karte|ec-|girocard|visa|mastercard|kartenzahlung|betrag|saldo|tse|transaktion|beleg|kasse|bon-?nr|datum|uhrzeit|vielen dank|danke/i;
  const KEYWORDS = [
    ["berbere", "berbere-250"], ["shiro", "shiro-500"], ["mitmita", "mitmita-100"], ["korerima", "korerima-50"],
    ["kaffee", "coffee-500"], ["weihrauch", "etan-100"], ["etan", "etan-100"], ["teff", "teff"], ["maschella", "mashella"], ["mashella", "mashella"], ["sorghum", "mashella"],
    ["jebena", "jebena"], ["finjal", "finjal-set"], ["mesob", "mesob"], ["netsela", "netela"], ["netela", "netela"], ["kreuz", "cross"], ["rekebot", "rekebot"],
  ];
  const COST_HINTS = [
    [/karton|versand|porto|dhl|hermes|dpd|post|klebeband|luftpolster|verpackung|etikett/i, "Versandmaterial"],
    [/druck|papier|toner|büro|ordner/i, "Sonstiges"],
    [/werbung|flyer|anzeige|instagram|facebook/i, "Marketing"],
    [/gebühr|gebuehr/i, "Gebühren"],
  ];

  function skuFor(text, products) {
    const t = text.toLowerCase();
    for (const [kw, base] of KEYWORDS) {
      if (!t.includes(kw)) continue;
      // Variante über die Größe erkennen, z. B. "Teff 1kg" -> teff:1kg
      const variants = products.filter((p) => p.sku === base || p.sku.startsWith(base + ":"));
      if (variants.length === 1) return variants[0].sku;
      const kg = /(\d+(?:[.,]\d+)?)\s*kg/.exec(t), g = /(\d{2,4})\s*g\b/.exec(t);
      const grams = kg ? toNum(kg[1].includes(",") || kg[1].includes(".") ? kg[1] : kg[1] + ",00") * 1000 : g ? Number(g[1]) : 0;
      const hit = variants.find((p) => (grams >= 1000 && /1kg/.test(p.sku)) || (grams === 500 && /500g/.test(p.sku)));
      return hit ? hit.sku : "";
    }
    return "";
  }

  function parseReceiptText(raw, products) {
    const lines = String(raw || "").split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
    const text = lines.join("\n");
    const out = { lesbar: text.replace(/[^A-Za-z0-9]/g, "").length > 15, datum: "", haendler: "", belegnummer: "", zahlungsart: "unbekannt", waehrung: "EUR", brutto: 0, mwst: [], positionen: [], art: "kosten", kategorie: "Sonstiges", beschreibung: "" };
    if (!out.lesbar) return out;

    // Datum
    const d = /(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})/.exec(text);
    if (d) { const y = d[3].length === 2 ? "20" + d[3] : d[3]; const mm = Number(d[2]), dd = Number(d[1]); if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) out.datum = `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`; }

    // Händler: erste Zeile mit mehreren Buchstaben, die kein Datum/Betrag ist
    out.haendler = (lines.find((l) => /[A-Za-zÄÖÜäöüß]{3,}/.test(l) && !amountsIn(l).length && !/\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}/.test(l)) || "").replace(/[^\wÄÖÜäöüß&.,' -]/g, "").trim().slice(0, 60);

    // Belegnummer
    const bn = /(?:bon|beleg|rechnung|re)[-\s.]*(?:nr|nummer)?[.:\s#]*([A-Z0-9-]{3,})/i.exec(text);
    if (bn) out.belegnummer = bn[1];

    // Zahlungsart
    if (/paypal/i.test(text)) out.zahlungsart = "paypal";
    else if (/karte|girocard|ec-?cash|visa|mastercard|maestro|kontaktlos/i.test(text)) out.zahlungsart = "karte";
    else if (/\bbar\b|gegeben|rückgeld|wechselgeld/i.test(text)) out.zahlungsart = "bar";
    else if (/überweisung|iban/i.test(text)) out.zahlungsart = "ueberweisung";

    // Gesamtbetrag: Zeile mit Summe/Gesamt/zu zahlen, sonst größter Betrag
    const totalLine = lines.filter((l) => /summe|gesamt|total|zu zahlen|endbetrag|betrag/i.test(l) && !/zwischen|netto|mwst|ust/i.test(l) && amountsIn(l).length).pop();
    const all = lines.flatMap(amountsIn).filter((n) => n > 0);
    out.brutto = totalLine ? Math.max(...amountsIn(totalLine)) : all.length ? Math.max(...all) : 0;

    // MwSt: Zeilen mit 7 % oder 19 %
    lines.forEach((l) => {
      const r = /(?:^|\D)(7|19)(?:[,.]0+)?\s*%/.exec(l);
      if (!r) return;
      const nums = amountsIn(l).filter((n) => n > 0);
      if (!nums.length) return;
      const rate = Number(r[1]);
      if (out.mwst.some((x) => x.satz === rate)) return;
      let net = 0, tax = 0;
      if (nums.length >= 2) { const sorted = [...nums].sort((a, b) => a - b); tax = sorted[0]; net = sorted[sorted.length - 1]; if (Math.abs(net * rate / 100 - tax) > Math.max(0.05, tax * 0.1)) { net = round2(tax / (rate / 100)); } }
      else { tax = nums[0]; net = round2(tax / (rate / 100)); }
      out.mwst.push({ satz: rate, netto: round2(net), steuer: round2(tax), brutto: round2(net + tax) });
    });

    // Positionen: Zeilen mit Text und Betrag, ohne Summen-/Zahlungszeilen
    lines.forEach((l) => {
      if (SKIP.test(l)) return;
      const nums = amountsIn(l);
      if (!nums.length || !/[A-Za-zÄÖÜäöüß]{3,}/.test(l)) return;
      const amount = nums[nums.length - 1];
      const q = /(\d{1,3})\s*[xX×*]\s|(?:^|\s)[xX×]\s*(\d{1,3})\b/.exec(l);
      const qty = q ? Number(q[1] || q[2]) : 1;
      const name = l.replace(AMOUNT, "").replace(/(\d{1,3})\s*[xX×*]\s/, "").replace(/\s[A-C]$/, "").replace(/\s{2,}/g, " ").trim();
      if (!name) return;
      out.positionen.push({ text: name.slice(0, 60), menge: qty, brutto: round2(amount), sku: skuFor(name, products) });
    });

    // Art und Kategorie
    if (out.positionen.some((p) => p.sku)) { out.art = "ware"; out.kategorie = ""; out.beschreibung = "Wareneinkauf"; }
    else {
      const hint = COST_HINTS.find(([re]) => re.test(text));
      out.kategorie = hint ? hint[1] : "Sonstiges";
      out.beschreibung = out.positionen.slice(0, 2).map((p) => p.text).join(", ").slice(0, 60);
    }
    return out;
  }

  root.parseReceiptText = parseReceiptText;
  if (typeof module !== "undefined") module.exports = { parseReceiptText };
})(typeof window !== "undefined" ? window : globalThis);
