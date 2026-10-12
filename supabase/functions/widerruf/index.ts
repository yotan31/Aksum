// ============================================================
//  AKSUM – Server-Funktion "widerruf" (Supabase Edge Function)
//  Nimmt Widerrufe vom Widerrufsbutton entgegen, speichert sie im
//  Kontor (mit Todo) und schickt dem Kunden die Pflicht-Eingangsbestätigung.
//  Secrets: SHOP_URL, SHOP_EMAIL, BREVO_API_KEY (wie bei "paypal")
// ============================================================

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const SHOP_URL = env("SHOP_URL", "https://aksum-shop.de").replace(/\/$/, "");
const SHOP_EMAIL = env("SHOP_EMAIL", "info@aksum-shop.de");
const DB = env("SUPABASE_URL") + "/rest/v1";
const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
// Nur der eigene Shop darf die Funktion aus dem Browser aufrufen.
const ALLOWED = new Set([SHOP_URL, SHOP_URL.replace("://", "://www."), "https://aksum-shop.de", "https://www.aksum-shop.de"]);
let CORS: Record<string, string> = {};
const corsFor = (req: Request) => {
  const o = req.headers.get("origin") || "";
  return { "Access-Control-Allow-Origin": ALLOWED.has(o) ? o : "https://aksum-shop.de", "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
};
// Missbrauchsbremse: zählt Aufrufe pro Absender (IP) und insgesamt.
async function allowed(key: string, max: number, seconds: number) {
  const res = await fetch(env("SUPABASE_URL") + "/rest/v1/rpc/rate_hit", {
    method: "POST",
    headers: { apikey: env("SUPABASE_SERVICE_ROLE_KEY"), Authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY"), "Content-Type": "application/json" },
    body: JSON.stringify({ p_key: key, p_max: max, p_seconds: seconds }),
  });
  if (!res.ok) return true; // Bremse defekt -> Shop nicht blockieren
  return (await res.json()) === true;
}
const clientIp = (req: Request) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unbekannt";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

async function putDoc(collection: string, id: string, data: unknown) {
  const res = await fetch(DB + "/docs?on_conflict=collection,id", {
    method: "POST",
    headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ collection, id, data }),
  });
  if (!res.ok) throw new Error("db " + res.status);
}

async function sendMail(to: { email: string; name?: string }, subject: string, html: string) {
  const key = env("BREVO_API_KEY");
  if (!key) return false;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sender: { name: "Aksum", email: SHOP_EMAIL }, to: [to], bcc: [{ email: SHOP_EMAIL }], replyTo: { email: SHOP_EMAIL }, subject, htmlContent: html }),
  });
  return res.ok;
}

Deno.serve(async (req) => {
  CORS = corsFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Nur POST" }, 405);
  try {
    const b = await req.json();
    if (b.website) return json({ ok: true, receivedAt: new Date().toISOString(), mailed: false }); // Bot-Falle
    const ip = clientIp(req);
    if (!(await allowed("wd:ip:" + ip, 5, 3600)) || !(await allowed("wd:all", 100, 86400)))
      return json({ error: "Zu viele Anfragen. Bitte versuche es später noch einmal oder schreib uns an " + SHOP_EMAIL + "." }, 429);
    const w = {
      orderNo: clip(b.orderNo, 60), orderDate: clip(b.orderDate, 10), name: clip(b.name, 120), email: clip(b.email, 160),
      items: clip(b.items, 1000), language: clip(b.language, 5), receivedAt: new Date().toISOString(),
    };
    if (!w.orderNo || !/^\d{4}-\d{2}-\d{2}$/.test(w.orderDate) || !w.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.email)) return json({ error: "Angaben unvollständig" }, 400);
    const id = w.receivedAt.replace(/[^0-9]/g, "").slice(0, 14) + "-" + w.orderNo.replace(/[^A-Za-z0-9]/g, "").slice(-12);
    await putDoc("withdrawals", id, w);
    await putDoc("todos", "wd-" + id, {
      title: `Widerruf prüfen: Bestellung ${w.orderNo}`, detail: `${w.name} (${w.email}) · Artikel: ${w.items || "ganze Bestellung"} · bestellt am ${w.orderDate}`,
      due: "", priority: "high", done: false, source: "shop", createdAt: w.receivedAt,
    });
    const when = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", dateStyle: "long", timeStyle: "short" }).format(new Date(w.receivedAt));
    const mailOk = await allowed("wd:mail", 30, 86400);
    const mailed = mailOk && await sendMail({ email: w.email, name: w.name }, `Wir haben deinen Widerruf erhalten – Bestellung ${w.orderNo}`,
      `<div style="font-family:Arial,sans-serif;font-size:15px;color:#2a1d14;max-width:620px">
      <p>Hallo ${esc(w.name)},</p>
      <p>dein Widerruf ist am <b>${esc(when)} Uhr</b> bei uns eingegangen.</p>
      <p>Bestellnummer: ${esc(w.orderNo)}<br>Bestellt am: ${esc(w.orderDate.split("-").reverse().join("."))}<br>Betroffene Artikel: ${esc(w.items || "die ganze Bestellung")}</p>
      <p>Bitte schicke die Ware innerhalb von 14 Tagen an die Anschrift aus unserem Impressum: <a href="${SHOP_URL}/impressum.html">${SHOP_URL}/impressum.html</a>.
      Sobald die Ware bei uns ist, erstatten wir dir den Betrag über PayPal.</p>
      <p>Viele Grüße<br>Aksum · ${esc(SHOP_EMAIL)}</p></div>`).catch(() => false);
    return json({ ok: true, receivedAt: w.receivedAt, mailed });
  } catch (e) {
    console.error(e);
    return json({ error: "Der Widerruf konnte nicht gespeichert werden." }, 500);
  }
});
