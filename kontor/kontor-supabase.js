/*
 * Aksum Kontor – Verbindung zu Supabase
 * Stellt dem Kontor dieselben Funktionen bereit wie die Claude-Seite
 * (Datenbank, Belegfotos, Texterkennung, Downloads) – aber mit deiner
 * eigenen kostenlosen Supabase-Datenbank. Dazu Anmeldung mit Freigabeliste.
 * Zugangsdaten kommen aus ../js/config.js (supabaseUrl, supabaseAnonKey).
 */
(function () {
  "use strict";

  const CFG = typeof SHOP_CONFIG !== "undefined" ? SHOP_CONFIG : {}; // aus ../js/config.js
  const URL_ = (CFG.supabaseUrl || "").replace(/\/$/, "");
  const KEY = CFG.supabaseAnonKey;
  const BUCKET = "belege";
  const $ = (id) => document.getElementById(id);
  let sb = null, session = null, readyResolve;
  const ready = new Promise((r) => (readyResolve = r));

  // ---------- Anmeldung ----------
  const gate = document.createElement("div");
  gate.id = "gate";
  gate.innerHTML = `
    <div class="gate__box">
      <div class="gate__brand"><img src="../images/logo-kranz.svg" alt="" width="56" height="56"><h1>Aksum <span>Kontor</span></h1></div>
      <p class="hint" id="g-sub">Bitte melde dich an.</p>
      <form id="g-form" novalidate>
        <label class="f">E-Mail<input id="g-email" type="email" autocomplete="username" required></label>
        <label class="f" id="g-pass-wrap">Passwort<input id="g-pass" type="password" autocomplete="current-password" required minlength="8"></label>
        <div id="g-msg" hidden></div>
        <button class="btn" type="submit" id="g-submit">Anmelden</button>
      </form>
      <div class="gate__links">
        <button class="link" type="button" id="g-mode-signup">Noch kein Konto? Registrieren</button>
        <button class="link" type="button" id="g-mode-reset">Passwort vergessen</button>
        <button class="link" type="button" id="g-mode-login" hidden>Zurück zur Anmeldung</button>
      </div>
    </div>`;
  const css = document.createElement("style");
  css.textContent = `
    #gate { position: fixed; inset: 0; z-index: 100; background: var(--bg); display: grid; place-items: center; padding: 16px; }
    #gate[hidden] { display: none !important; }
    .gate__box { width: min(400px, 100%); background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 28px 24px; display: grid; gap: 14px; }
    .gate__box h1 { font-size: 1.6rem; }
    .gate__brand { display: flex; align-items: center; gap: 10px; }
    .gate__brand h1 span { color: var(--accent); font-size: 1.1rem; }
    .gate__box { border-top: 6px solid transparent; border-image: repeating-linear-gradient(90deg, #1f6b45 0 18px, #d4952a 18px 24px, #a8361b 24px 42px, #d4952a 42px 48px, #2b5f8a 48px 66px, #d4952a 66px 72px) 6 0 0 0; }
    .gate__box form { display: grid; gap: 12px; }
    .gate__links { display: flex; flex-wrap: wrap; gap: 6px 14px; }
    .logout { margin-left: 8px; }`;
  document.head.appendChild(css);
  document.body.appendChild(gate);

  let mode = "login";
  function setMode(m) {
    mode = m;
    $("g-pass-wrap").hidden = m === "reset";
    $("g-pass").autocomplete = m === "login" ? "current-password" : "new-password";
    $("g-submit").textContent = { login: "Anmelden", signup: "Registrieren", reset: "Link zum Zurücksetzen senden", newpass: "Neues Passwort speichern" }[m];
    $("g-sub").textContent = { login: "Bitte melde dich an.", signup: "Registriere dich mit der E-Mail-Adresse, die im Kontor freigeschaltet ist.", reset: "Wir schicken dir einen Link per E-Mail.", newpass: "Lege ein neues Passwort fest (mindestens 8 Zeichen)." }[m];
    $("g-email").closest("label").hidden = m === "newpass";
    $("g-mode-signup").hidden = m !== "login"; $("g-mode-reset").hidden = m !== "login"; $("g-mode-login").hidden = m === "login" || m === "newpass";
    msg("", "");
  }
  function msg(kind, text) { const m = $("g-msg"); m.hidden = !text; m.className = "notice" + (kind === "ok" ? " notice--ok" : kind === "bad" ? " notice--bad" : ""); m.textContent = text; }
  $("g-mode-signup").onclick = () => setMode("signup");
  $("g-mode-reset").onclick = () => setMode("reset");
  $("g-mode-login").onclick = () => setMode("login");

  $("g-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!sb) return;
    const email = $("g-email").value.trim(), password = $("g-pass").value;
    const btn = $("g-submit"); btn.disabled = true;
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        if (password.length < 8) throw new Error("Das Passwort braucht mindestens 8 Zeichen.");
        const { error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
        if (error) throw error;
        setMode("login");
        msg("ok", "Fast geschafft: Bestätige deine E-Mail-Adresse über den Link in deinem Postfach. Danach kannst du dich hier anmelden.");
      } else if (mode === "reset") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        msg("ok", "Wenn die Adresse bekannt ist, ist der Link unterwegs. Schau in dein Postfach.");
      } else if (mode === "newpass") {
        if (password.length < 8) throw new Error("Das Passwort braucht mindestens 8 Zeichen.");
        const { error } = await sb.auth.updateUser({ password });
        if (error) throw error;
        msg("ok", "Neues Passwort gespeichert.");
        setTimeout(() => location.reload(), 800);
      }
    } catch (err) {
      const t = String(err && err.message || err);
      msg("bad", /invalid login/i.test(t) ? "E-Mail oder Passwort stimmt nicht." : /not confirmed/i.test(t) ? "Bitte bestätige zuerst deine E-Mail-Adresse (Link im Postfach)." : /already registered/i.test(t) ? "Für diese Adresse gibt es schon ein Konto. Melde dich an." : t);
    } finally { btn.disabled = false; }
  });

  async function afterLogin() {
    const { data, error } = await sb.rpc("is_admin");
    if (error || !data) {
      gate.hidden = false;
      setMode("login");
      msg("bad", `Die Adresse ${session.user.email} ist für das Kontor nicht freigeschaltet.`);
      session = null;
      await sb.auth.signOut();
      return;
    }
    gate.hidden = true;
    const st = document.getElementById("status");
    if (st && !document.getElementById("logout")) {
      const host = document.getElementById("account-actions");
      const b = document.createElement("button");
      b.id = "logout"; b.className = host ? "btn btn--ghost" : "link logout"; b.type = "button"; b.textContent = "Abmelden";
      b.onclick = async () => { await sb.auth.signOut(); location.reload(); };
      (host || st).appendChild(b);
    }
    readyResolve(true);
  }

  if (!URL_ || !KEY || !window.supabase) {
    setMode("login");
    msg("bad", "Die Datenbank ist noch nicht eingerichtet. Trag supabaseUrl und supabaseAnonKey in js/config.js ein (siehe SUPABASE-EINRICHTUNG.md).");
    $("g-submit").disabled = true;
  } else {
    sb = window.supabase.createClient(URL_, KEY, { auth: { persistSession: true, detectSessionInUrl: true } });
    sb.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") { session = s; gate.hidden = false; setMode("newpass"); return; }
      if (event === "SIGNED_OUT") { session = null; return; }
      if (event === "SIGNED_IN" && s && !session) { session = s; afterLogin(); }
    });
    sb.auth.getSession().then(({ data }) => {
      if (data.session && !session && !/type=recovery/.test(location.hash)) { session = data.session; afterLogin(); }
      else if (!data.session) setMode("login");
    });
  }

  // ---------- Datenbank im Format der Claude-Seite ----------
  const listeners = {}; // collection -> Set(fn)
  const refetchTimers = {};
  async function fetchCollection(col) {
    const rows = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb.from("docs").select("id,data,version").eq("collection", col).range(from, from + 999);
      if (error) throw error;
      rows.push(...data);
      if (data.length < 1000) break;
    }
    return rows;
  }
  function notify(col) {
    clearTimeout(refetchTimers[col]);
    refetchTimers[col] = setTimeout(async () => {
      const fns = listeners[col]; if (!fns || !fns.size) return;
      try { const rows = await fetchCollection(col); fns.forEach((fn) => fn(rows)); } catch (e) { console.error(e); }
    }, 120);
  }
  let channel = null;
  function ensureRealtime() {
    if (channel) return;
    channel = sb.channel("kontor-docs").on("postgres_changes", { event: "*", schema: "public", table: "docs" }, (p) => {
      const col = (p.new && p.new.collection) || (p.old && p.old.collection);
      if (col) notify(col); else Object.keys(listeners).forEach(notify);
    }).subscribe();
  }
  // Sicherheitsnetz zur Echtzeit: beim Zurückkehren in die App und jede Minute alles neu laden
  const refreshAll = () => Object.keys(listeners).forEach(notify);
  window.addEventListener("focus", refreshAll);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshAll(); });
  setInterval(() => { if (!document.hidden) refreshAll(); }, 60000);
  const fail = (error) => { const c = error && (error.code === "42501" || /row-level security|permission/i.test(error.message || "")) ? "invalid_argument" : "unavailable"; return { code: c, message: error && error.message }; };
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  const merge = (a, b) => { const o = { ...a }; Object.entries(b).forEach(([k, v]) => { o[k] = isObj(v) && isObj(a[k]) ? merge(a[k], v) : v; }); return o; };
  const snap = (id, data) => ({ id, exists: !!data, data: () => (data ? JSON.parse(JSON.stringify(data)) : undefined), metadata: { fromCache: false, hasPendingWrites: false } });
  const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/-/g, "").slice(0, 20);

  function docRef(path) {
    const i = path.indexOf("/"); const col = path.slice(0, i), id = path.slice(i + 1);
    return {
      id, path,
      async get() { const { data, error } = await sb.from("docs").select("data").eq("collection", col).eq("id", id).maybeSingle(); if (error) throw fail(error); return snap(id, data && data.data); },
      async set(data) { const { error } = await sb.from("docs").upsert({ collection: col, id, data }, { onConflict: "collection,id" }); if (error) throw fail(error); notify(col); },
      async update(patch) {
        const { data: row, error } = await sb.from("docs").select("data").eq("collection", col).eq("id", id).maybeSingle();
        if (error) throw fail(error); if (!row) throw { code: "invalid_argument", message: "Eintrag existiert nicht" };
        const { error: e2 } = await sb.from("docs").update({ data: merge(row.data || {}, patch) }).eq("collection", col).eq("id", id);
        if (e2) throw fail(e2); notify(col);
      },
      async delete() { const { error } = await sb.from("docs").delete().eq("collection", col).eq("id", id); if (error) throw fail(error); notify(col); },
      onSnapshot(next, err) {
        const fn = (rows) => { const r = rows.find((x) => x.id === id); next(snap(id, r && r.data)); };
        (listeners[col] ||= new Set()).add(fn); ensureRealtime();
        fetchCollection(col).then(fn).catch((e) => err && err(fail(e)));
        return () => listeners[col].delete(fn);
      },
    };
  }
  function colRef(col) {
    return {
      path: col,
      doc: (id) => docRef(col + "/" + (id || newId())),
      async add(data) { const ref = docRef(col + "/" + newId()); await ref.set(data); return ref; },
      onSnapshot(next, err) {
        const fn = (rows) => { const docs = rows.map((r) => snap(r.id, r.data)); next({ docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } }); };
        (listeners[col] ||= new Set()).add(fn); ensureRealtime();
        fetchCollection(col).then(fn).catch((e) => err && err(fail(e)));
        return () => listeners[col].delete(fn);
      },
    };
  }
  const dbApi = { doc: docRef, collection: colRef };

  // ---------- Belegfotos (privater Speicher) ----------
  const signed = {}, pending = {};
  const PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
  const assetsApi = {
    async upload(blob, opts) {
      const id = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
      const name = (blob.name || "").toLowerCase();
      const type = (opts && opts.type) || blob.type || (/\.pdf$/.test(name) ? "application/pdf" : /\.png$/.test(name) ? "image/png" : /\.hei[cf]$/.test(name) ? "image/heic" : "image/jpeg");
      const { error } = await sb.storage.from(BUCKET).upload(id, blob, { contentType: type, upsert: false });
      if (error) throw { code: /size|large/i.test(error.message) ? "too_large" : "upstream_error", message: error.message };
      return { id, url: URL.createObjectURL(blob), sizeBytes: blob.size, contentType: type };
    },
    async list() { return { assets: [], usage: {} }; },
    async delete() { return { deleted: false }; }, // Belegfotos werden nie gelöscht
  };
  window.__kontorBlob = {
    src(id) {
      const c = signed[id];
      if (c && c.exp > Date.now()) return c.url;
      if (!pending[id]) {
        pending[id] = sb.storage.from(BUCKET).createSignedUrl(id, 3600).then(({ data }) => {
          delete pending[id];
          if (data && data.signedUrl) { signed[id] = { url: data.signedUrl, exp: Date.now() + 3500 * 1000 }; window.dispatchEvent(new Event("kontor-blob-ready")); }
        });
      }
      return PIXEL;
    },
    async get(id) { const { data, error } = await sb.storage.from(BUCKET).download(id); if (error) throw error; return data; },
  };

  // ---------- Texterkennung für Belege (kostenlos, läuft im Browser) ----------
  let tess = null;
  async function loadTesseract() {
    if (window.Tesseract) return window.Tesseract;
    if (!tess) tess = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"; s.integrity = "sha256-qOKZGNCYsrBuEBK9rv+0rsBEXF1WVHCQI+C9H0QqgOg="; s.crossOrigin = "anonymous"; s.onload = () => res(window.Tesseract); s.onerror = rej; document.head.appendChild(s); });
    return tess;
  }
  const sampleFn = async () => { throw { code: "not_granted" }; };
  sampleFn.limits = async () => ({ maxPromptBytes: 262144, images: { maxCount: 1, maxInputBytes: 20 * 1024 * 1024, mediaTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"] } });
  sampleFn.json = async (prompt, opts) => {
    const img = opts && opts.images && (opts.images[0] || opts.images);
    if (!img) throw { code: "invalid_request" };
    const T = await loadTesseract().catch(() => null);
    if (!T) throw { code: "upstream_error" };
    const { data } = await T.recognize(img, "deu");
    if (opts && opts.signal && opts.signal.aborted) throw { code: "cancelled" };
    return window.parseReceiptText(data.text || "", window.KONTOR_PRODUCTS || []);
  };

  // ---------- Downloads ----------
  const downloadsApi = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      return { status: "saved" };
    },
  };

  // ---------- Zugangsliste und Shop-Status ----------
  window.__kontorAccess = {
    get me() { return session && session.user.email.toLowerCase(); },
    async list() { const { data, error } = await sb.from("admins").select("email").order("email"); if (error) throw error; return data.map((r) => r.email.toLowerCase()); },
    async add(email) { const { error } = await sb.from("admins").insert({ email }); if (error && !/duplicate/i.test(error.message)) throw error; },
    async remove(email) { const { error } = await sb.from("admins").delete().eq("email", email); if (error) throw error; },
    async setPassword(password) { const { error } = await sb.auth.updateUser({ password }); if (error) throw error; },
  };
  let lastStatus = null;
  window.__kontorShopStatus = async (map) => {
    const key = JSON.stringify(map);
    if (key === lastStatus) return;
    const prev = lastStatus ? JSON.parse(lastStatus) : null;
    lastStatus = key;
    const rows = Object.entries(map).filter(([sku, v]) => !prev || prev[sku] !== v).map(([sku, sold_out]) => ({ sku, sold_out, updated_at: new Date().toISOString() }));
    if (rows.length) await sb.from("shop_status").upsert(rows, { onConflict: "sku" });
  };

  // ---------- Schnittstelle wie auf der Claude-Seite ----------
  window.claude = {
    async use(name) {
      await ready;
      return { db: dbApi, assets: assetsApi, sample: sampleFn, downloads: downloadsApi }[name] || null;
    },
  };
})();
