// ============================================================
//  AKSUM – Server-Funktion "paypal" (Supabase Edge Function)
//  1. action "create":  rechnet den Warenkorb mit den Preisen aus
//     products.js (nicht aus dem Browser!) und legt die PayPal-Bestellung an.
//  2. action "capture": bucht die Zahlung, speichert die Bestellung im
//     Kontor und verschickt die Bestellbestätigung (Brevo, kostenlos).
//
//  Benötigte Secrets (Supabase → Edge Functions → Secrets):
//    PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV ("sandbox" oder "live"),
//    SHOP_URL (https://aksum-shop.de), SHOP_EMAIL (info@aksum-shop.de),
//    BREVO_API_KEY (optional, für E-Mails)
//  SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY stellt Supabase selbst bereit.
// ============================================================

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const SHOP_URL = env("SHOP_URL", "https://aksum-shop.de").replace(/\/$/, "");
const SHOP_EMAIL = env("SHOP_EMAIL", "info@aksum-shop.de");
const PAYPAL_BASE = env("PAYPAL_ENV", "sandbox") === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const DB = env("SUPABASE_URL") + "/rest/v1";
const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// ---------- Shop-Daten (products.js / config.js als einzige Quelle) ----------
type Variant = { id: string; weight: Record<string, string>; price: number };
type Product = { id: string; name: Record<string, string>; price?: number; weight?: Record<string, string>; variants?: Variant[]; food?: boolean; info?: Record<string, unknown> };
let cache: { at: number; products: Product[]; config: Record<string, any> } | null = null;
async function shopData() {
  if (cache && Date.now() - cache.at < 5 * 60_000) return cache;
  const [p, c] = await Promise.all([fetch(SHOP_URL + "/js/products.js").then((r) => r.text()), fetch(SHOP_URL + "/js/config.js").then((r) => r.text())]);
  const products = new Function(p + "\n;return PRODUCTS;")() as Product[];
  const config = new Function(c + "\n;return SHOP_CONFIG;")() as Record<string, any>;
  cache = { at: Date.now(), products, config };
  return cache;
}
const variantsOf = (p: Product): Variant[] => p.variants || [{ id: "", weight: p.weight || { de: "" }, price: Number(p.price) }];
const infoText = (v: unknown) => (v && typeof v === "object" ? String((v as any).de || "") : String(v || ""));
const incomplete = (p: Product) => !!p.food && !(p.info && infoText(p.info.ingredients).trim() && infoText(p.info.producer).trim());
const cents = (e: number) => Math.round(e * 100);
const val = (c: number) => (c / 100).toFixed(2);
const eur = (c: number) => (c / 100).toFixed(2).replace(".", ",") + " €";

// ---------- Datenbank (REST mit Service-Schlüssel) ----------
async function db(path: string, init: RequestInit = {}) {
  const res = await fetch(DB + path, { ...init, headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY, "Content-Type": "application/json", ...(init.headers || {}) } });
  if (!res.ok) throw new Error("db " + res.status + " " + (await res.text()));
  return res.status === 204 ? null : res.json().catch(() => null);
}
const putDoc = (collection: string, id: string, data: unknown) =>
  db("/docs?on_conflict=collection,id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ collection, id, data }) });
async function getDoc(collection: string, id: string) {
  const rows = await db(`/docs?collection=eq.${encodeURIComponent(collection)}&id=eq.${encodeURIComponent(id)}&select=data`);
  return rows && rows[0] ? rows[0].data : null;
}
async function soldOut(): Promise<Set<string>> {
  const rows = await db("/shop_status?sold_out=eq.true&select=sku").catch(() => []);
  return new Set((rows || []).map((r: { sku: string }) => r.sku));
}

// ---------- PayPal ----------
async function paypalToken() {
  const res = await fetch(PAYPAL_BASE + "/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + btoa(env("PAYPAL_CLIENT_ID") + ":" + env("PAYPAL_SECRET")), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("PayPal-Anmeldung fehlgeschlagen (" + res.status + ")");
  return (await res.json()).access_token as string;
}
async function paypal(path: string, body?: unknown) {
  const res = await fetch(PAYPAL_BASE + path, { method: "POST", headers: { Authorization: "Bearer " + (await paypalToken()), "Content-Type": "application/json", Prefer: "return=representation" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("PayPal " + res.status + ": " + (data?.details?.[0]?.description || data?.message || ""));
  return data;
}

// Warenkorb serverseitig berechnen
async function priceCart(cart: { key: string; qty: number }[]) {
  const { products, config } = await shopData();
  const out = await soldOut();
  const lines = [];
  for (const line of (cart || []).slice(0, 50)) {
    const [pid, vid = ""] = String(line.key || "").split(":");
    const p = products.find((x) => x.id === pid);
    const v = p && variantsOf(p).find((x) => x.id === vid);
    const qty = Math.max(1, Math.min(99, Math.round(Number(line.qty) || 0)));
    if (!p || !v) throw new Error("Produkt nicht gefunden: " + line.key);
    if (incomplete(p)) throw new Error("Produkt noch nicht bestellbar: " + p.name.de);
    if (out.has(line.key) || out.has(pid)) throw new Error("Leider ausverkauft: " + p.name.de);
    lines.push({ key: line.key, sku: line.key, name: p.name.de + (v.weight?.de ? " (" + v.weight.de + ")" : ""), shortName: p.name.de, qty, unit: cents(v.price), amount: cents(v.price) * qty });
  }
  if (!lines.length) throw new Error("Der Warenkorb ist leer.");
  const itemTotal = lines.reduce((s, l) => s + l.amount, 0);
  const freeFrom = cents(Number(config.freeShippingFrom) || 0);
  const shipping = freeFrom > 0 && itemTotal >= freeFrom ? 0 : cents(Number(config.shippingCost) || 0);
  return { lines, itemTotal, shipping, total: itemTotal + shipping, config };
}

// Datum in deutscher Zeit
const berlinDate = (iso?: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(iso ? new Date(iso) : new Date());
const COUNTRIES: Record<string, string> = { DE: "Deutschland", AT: "Österreich", CH: "Schweiz", NL: "Niederlande", SE: "Schweden" };

// ---------- E-Mail (Brevo, kostenloser Tarif) ----------
async function sendMail(to: { email: string; name?: string }, subject: string, html: string) {
  const key = env("BREVO_API_KEY");
  if (!key || !to.email) return false;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sender: { name: "Aksum", email: SHOP_EMAIL }, to: [to], bcc: [{ email: SHOP_EMAIL }], replyTo: { email: SHOP_EMAIL }, subject, htmlContent: html }),
  });
  return res.ok;
}
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
async function legalHtml() {
  try {
    const html = await fetch(SHOP_URL + "/agb.html").then((r) => r.text());
    const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return m ? m[1].replace(/<p class="todo">[\s\S]*?<\/p>/i, "") : "";
  } catch { return ""; }
}
async function confirmationHtml(order: any, config: Record<string, any>) {
  const rows = order.items.map((i: any) => `<tr><td>${i.qty}×</td><td>${esc(i.name)}</td><td style="text-align:right">${eur(cents(i.amount))}</td></tr>`).join("");
  const tax = config.smallBusiness ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet." : "Alle Preise inkl. MwSt.";
  const addr = order.customer?.address || [];
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#2a1d14;max-width:620px">
  <p>Hallo ${esc(order.customer?.name || "")},</p>
  <p>vielen Dank für deine Bestellung bei Aksum! Hier ist die Übersicht:</p>
  <table cellpadding="6" style="border-collapse:collapse;width:100%">${rows}
  <tr><td></td><td>Versand</td><td style="text-align:right">${eur(cents(order.shipping))}</td></tr>
  <tr><td></td><td><b>Gesamt</b></td><td style="text-align:right"><b>${eur(cents(order.gross))}</b></td></tr></table>
  <p style="font-size:13px;color:#6b5a4c">${tax}</p>
  <p>Bezahlt mit PayPal am ${esc(order.date.split("-").reverse().join("."))}. Bestellnummer: <b>${esc(order.txid)}</b></p>
  <p>Lieferadresse:<br>${addr.map(esc).join("<br>")}</p>
  <p>Voraussichtliche Lieferzeit: ${esc(config.deliveryTime?.de || "2–5 Werktage")}.</p>
  <p>Du möchtest den Kauf widerrufen? Das geht hier: <a href="${SHOP_URL}/widerruf.html">${SHOP_URL}/widerruf.html</a></p>
  <p>Viele Grüße<br>Aksum · ${esc(SHOP_EMAIL)}</p>
  <hr style="margin:28px 0;border:0;border-top:1px solid #e4d6c1">
  <div style="font-size:13px;color:#4a3a2c">${await legalHtml()}</div></div>`;
}

// ---------- Anfragen ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Nur POST" }, 405);
  try {
    const body = await req.json();

    if (body.action === "create") {
      const c = await priceCart(body.cart);
      const order = await paypal("/v2/checkout/orders", {
        intent: "CAPTURE",
        purchase_units: [{
          description: "Aksum – Bestellung",
          amount: { currency_code: "EUR", value: val(c.total), breakdown: { item_total: { currency_code: "EUR", value: val(c.itemTotal) }, shipping: { currency_code: "EUR", value: val(c.shipping) } } },
          items: c.lines.map((l) => ({ name: l.name.slice(0, 127), sku: l.sku, quantity: String(l.qty), unit_amount: { currency_code: "EUR", value: val(l.unit) }, category: "PHYSICAL_GOODS" })),
        }],
        application_context: { brand_name: "Aksum", shipping_preference: "GET_FROM_FILE", user_action: "PAY_NOW", locale: "de-DE" },
      });
      await putDoc("pending", order.id, { lines: c.lines, itemTotal: c.itemTotal, shipping: c.shipping, total: c.total, createdAt: new Date().toISOString() });
      return json({ id: order.id });
    }

    if (body.action === "capture") {
      const id = String(body.orderID || "").replace(/[^A-Za-z0-9-]/g, "");
      const pending = await getDoc("pending", id);
      if (!pending) throw new Error("Unbekannte Bestellung.");
      const res = await paypal(`/v2/checkout/orders/${id}/capture`);
      const unit = res.purchase_units?.[0] || {};
      const cap = unit.payments?.captures?.[0];
      if (!cap || cap.status !== "COMPLETED") throw new Error("Zahlung nicht abgeschlossen (" + (cap?.status || "unbekannt") + ").");
      const gross = Number(cap.amount?.value) || pending.total / 100;
      const fee = Number(cap.seller_receivable_breakdown?.paypal_fee?.value) || 0;
      const a = unit.shipping?.address || {};
      const name = unit.shipping?.name?.full_name || [res.payer?.name?.given_name, res.payer?.name?.surname].filter(Boolean).join(" ");
      const order = {
        txid: cap.id, paypalOrderId: id, date: berlinDate(cap.create_time), currency: "EUR",
        gross, fee, net: Number(cap.seller_receivable_breakdown?.net_amount?.value) || gross - fee, shipping: pending.shipping / 100,
        city: a.admin_area_2 || "", zip: a.postal_code || "", country: COUNTRIES[a.country_code] || a.country_code || "",
        items: pending.lines.map((l: any) => ({ name: l.shortName, sku: l.sku, qty: l.qty, amount: l.amount / 100 })),
        customer: { name, email: res.payer?.email_address || "", address: [name, a.address_line_1, a.address_line_2, [a.postal_code, a.admin_area_2].filter(Boolean).join(" "), COUNTRIES[a.country_code] || a.country_code].filter(Boolean) },
        refunded: false, status: "neu", source: "shop", importedAt: new Date().toISOString(),
      };
      if (Math.abs(cents(gross) - pending.total) > 1) (order as any).amountMismatch = true; // sollte nie passieren
      await putDoc("orders", cap.id, order);
      await db(`/docs?collection=eq.pending&id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }).catch(() => null);
      const { config } = await shopData();
      const mailed = await sendMail({ email: order.customer.email, name }, `Deine Bestellung ${cap.id} bei Aksum`, await confirmationHtml(order, config)).catch(() => false);
      return json({ id: cap.id, mailed });
    }

    return json({ error: "Unbekannte Aktion" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 400);
  }
});
