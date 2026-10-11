/*
 * Hauptlogik des Shops: Sprache, Produktliste, Warenkorb und PayPal.
 * Normalerweise musst du hier nichts ändern – Produkte stehen in
 * products.js, Einstellungen in config.js und Texte in i18n.js.
 */
(function () {
  "use strict";

  const CART_KEY = "aksum-cart";

  // ---------- Kleine Helfer ----------

  // localStorage kann in privaten Fenstern fehlen – dann eben ohne Speichern.
  function load(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* ignorieren */
    }
  }

  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Beträge intern in Cent rechnen, damit keine Rundungsfehler entstehen.
  const toCents = (euro) => Math.round(euro * 100);
  const centsToValue = (cents) => (cents / 100).toFixed(2);
  // Preisformat passend zur Sprache (z. B. 8,90 € oder €8.90)
  const formatCents = (cents) =>
    new Intl.NumberFormat(localeFor(lang), {
      style: "currency",
      currency: SHOP_CONFIG.currency,
    }).format(cents / 100);

  // ---------- Zustand ----------

  // Bestellungen aus? Dann keine Warenkorb-Knöpfe und kein PayPal.
  const ordersOpen = SHOP_CONFIG.ordersEnabled !== false;

  let lang = loadLanguage(); // "de", "en" oder "ti" (siehe lang-menu.js)
  let filter = "all";
  let cart = load(CART_KEY, {}); // { produktId: anzahl }

  let chosen = {}; // gewählte Größe pro Produkt, z. B. { teff: "1kg" }

  // Größen eines Produkts. Produkte ohne "variants" haben genau eine.
  function variantsOf(product) {
    return product.variants || [{ id: "", weight: product.weight, price: product.price }];
  }

  // Im Warenkorb steht "produkt" oder "produkt:größe" als Schlüssel.
  function lookup(key) {
    const [productId, variantId = ""] = key.split(":");
    const product = PRODUCTS.find((p) => p.id === productId);
    const variant = product && variantsOf(product).find((v) => v.id === variantId);
    return variant ? { product, variant } : null;
  }

  // Produkte entfernen, die es inzwischen nicht mehr gibt
  Object.keys(cart).forEach((key) => {
    if (!lookup(key) || !(cart[key] > 0)) delete cart[key];
  });

  function t(key, vars) {
    let text = (TEXTS[lang] && TEXTS[lang][key]) || TEXTS.de[key] || key;
    if (vars) {
      Object.keys(vars).forEach((name) => {
        text = text.replace("{" + name + "}", vars[name]);
      });
    }
    return text;
  }

  // Produkttext in der gewählten Sprache (sonst Deutsch)
  const tr = (field) => (field && (field[lang] || field.de)) || "";

  // ---------- Warenkorb-Berechnung ----------

  function cartLines() {
    return Object.keys(cart).map((key) => ({ key, ...lookup(key), qty: cart[key] }));
  }

  function totals() {
    const itemTotal = cartLines().reduce(
      (sum, line) => sum + toCents(line.variant.price) * line.qty,
      0
    );
    const freeFrom = toCents(SHOP_CONFIG.freeShippingFrom);
    const isFree = itemTotal === 0 || (freeFrom > 0 && itemTotal >= freeFrom);
    const shipping = isFree ? 0 : toCents(SHOP_CONFIG.shippingCost);
    return { itemTotal, shipping, total: itemTotal + shipping, freeFrom };
  }

  function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }

  function setQty(id, qty) {
    if (qty > 0) cart[id] = Math.min(qty, 99);
    else delete cart[id];
    save(CART_KEY, cart);
    renderCart();
  }

  // ---------- Darstellung ----------

  function applyTexts() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.getElementById("shipping-info").textContent = t("footer.shipping", {
      cost: formatCents(toCents(SHOP_CONFIG.shippingCost)),
      free: formatCents(toCents(SHOP_CONFIG.freeShippingFrom)),
    });
  }

  function glutenBadge() {
    return `<span class="badge-gf">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
      ${esc(t("badge.glutenFree"))}</span>`;
  }

  function productImage(product) {
    if (product.image) {
      return `<img src="${esc(product.image)}" alt="${esc(tr(product.name))}" loading="lazy">`;
    }
    // Platzhalter, solange kein Foto vorhanden ist
    return `<div class="placeholder placeholder--${product.category}" aria-hidden="true">
      <span>${esc(product.name.ti)}</span>
    </div>`;
  }

  function selectedVariant(product) {
    const all = variantsOf(product);
    return all.find((v) => v.id === chosen[product.id]) || all[0];
  }

  function variantPicker(product) {
    const all = variantsOf(product);
    if (all.length < 2) return `<p class="product__weight">${esc(tr(all[0].weight))}</p>`;
    const current = selectedVariant(product);
    return `<div class="variants" role="group">${all
      .map(
        (v) => `<button data-variant="${esc(v.id)}" data-product="${esc(product.id)}"
          aria-pressed="${v === current}">${esc(tr(v.weight))}</button>`
      )
      .join("")}</div>`;
  }

  function renderProducts() {
    const grid = document.getElementById("product-grid");
    const visible = PRODUCTS.filter((p) => filter === "all" || p.category === filter);
    grid.innerHTML = visible
      .map(
        (p) => `
      <article class="product">
        <div class="product__image">${productImage(p)}${p.glutenFree ? glutenBadge() : ""}</div>
        <div class="product__body">
          <p class="product__category">${esc(t("filter." + p.category))}</p>
          <h3 class="product__name">${esc(tr(p.name))}</h3>
          ${variantPicker(p)}
          <p class="product__desc">${esc(tr(p.description))}</p>
          <div class="product__footer">
            <span class="product__price">${formatCents(toCents(selectedVariant(p).price))}</span>
            ${ordersOpen ? `<button class="btn btn--small" data-add="${esc(p.id)}">${esc(t("product.add"))}</button>` : ""}
          </div>
        </div>
      </article>`
      )
      .join("");

    document.querySelectorAll(".filters button").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.filter === filter));
    });
  }

  function renderCart() {
    const lines = cartLines();
    const sums = totals();
    const list = document.getElementById("cart-items");
    const empty = lines.length === 0;

    document.getElementById("cart-count").textContent = cartCount();
    document.getElementById("cart-count").hidden = empty;
    document.getElementById("cart-empty").hidden = !empty;
    document.getElementById("cart-summary").hidden = empty;

    list.innerHTML = lines
      .map(
        ({ key, product, variant, qty }) => `
      <li class="cart-item">
        <div class="cart-item__info">
          <strong>${esc(tr(product.name))}</strong>
          <span>${esc(tr(variant.weight))} · ${formatCents(toCents(variant.price))}</span>
        </div>
        <div class="qty">
          <button data-qty="${esc(key)}" data-delta="-1" aria-label="−">−</button>
          <span>${qty}</span>
          <button data-qty="${esc(key)}" data-delta="1" aria-label="+">+</button>
        </div>
        <button class="cart-item__remove" data-remove="${esc(key)}">${esc(t("cart.remove"))}</button>
      </li>`
      )
      .join("");

    document.getElementById("sum-subtotal").textContent = formatCents(sums.itemTotal);
    document.getElementById("sum-shipping").textContent =
      sums.shipping === 0 ? t("cart.free") : formatCents(sums.shipping);
    document.getElementById("sum-total").textContent = formatCents(sums.total);

    const hint = document.getElementById("free-hint");
    const missing = sums.freeFrom - sums.itemTotal;
    hint.hidden = !(sums.freeFrom > 0 && missing > 0);
    hint.textContent = t("cart.freeHint", { amount: formatCents(missing) });
  }

  function renderAll() {
    applyTexts();
    renderProducts();
    renderCart();
  }

  // ---------- Warenkorb öffnen / schließen ----------

  const drawer = document.getElementById("cart");
  const overlay = document.getElementById("overlay");

  function openCart() {
    drawer.classList.add("is-open");
    overlay.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    document.getElementById("cart-close").focus();
  }

  function closeCart() {
    drawer.classList.remove("is-open");
    overlay.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
  }

  // ---------- PayPal ----------

  function loadPayPal() {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=" +
      encodeURIComponent(SHOP_CONFIG.paypalClientId) +
      "&currency=" + encodeURIComponent(SHOP_CONFIG.currency) +
      "&locale=de_DE&intent=capture";
    script.onload = renderPayPalButtons;
    script.onerror = showPayPalError;
    document.head.appendChild(script);
  }

  function showPayPalError() {
    const box = document.getElementById("paypal-buttons");
    box.innerHTML = `<p class="notice">${esc(t("cart.paypalError"))}</p>`;
  }

  function renderPayPalButtons() {
    if (!window.paypal) return showPayPalError();
    const currency = SHOP_CONFIG.currency;

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },

        // Bestellung bei PayPal anlegen – mit allen Artikeln, damit du
        // in deinem PayPal-Konto siehst, was gekauft wurde.
        createOrder: function (data, actions) {
          const sums = totals();
          return actions.order.create({
            purchase_units: [
              {
                description: SHOP_CONFIG.shopName + " – Bestellung",
                amount: {
                  currency_code: currency,
                  value: centsToValue(sums.total),
                  breakdown: {
                    item_total: { currency_code: currency, value: centsToValue(sums.itemTotal) },
                    shipping: { currency_code: currency, value: centsToValue(sums.shipping) },
                  },
                },
                items: cartLines().map(({ key, product, variant, qty }) => ({
                  name: (product.name.de + " (" + variant.weight.de + ")").slice(0, 127),
                  sku: key,
                  unit_amount: { currency_code: currency, value: centsToValue(toCents(variant.price)) },
                  quantity: String(qty),
                  category: "PHYSICAL_GOODS",
                })),
              },
            ],
          });
        },

        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            cart = {};
            save(CART_KEY, cart);
            renderCart();
            closeCart();
            document.getElementById("order-id").textContent = details.id;
            document.getElementById("thanks").showModal();
          });
        },

        onError: function (err) {
          console.error(err);
          alert(t("error.payment"));
        },
      })
      .render("#paypal-buttons")
      .catch(showPayPalError);
  }

  // ---------- Ereignisse ----------

  document.addEventListener("click", (event) => {
    const el = event.target.closest("button, [data-open-cart]");
    if (!el) return;

    if (el.dataset.add) {
      const product = PRODUCTS.find((p) => p.id === el.dataset.add);
      const variant = selectedVariant(product);
      const key = variant.id ? product.id + ":" + variant.id : product.id;
      setQty(key, (cart[key] || 0) + 1);
      el.textContent = t("product.added");
      el.disabled = true;
      setTimeout(() => {
        el.textContent = t("product.add");
        el.disabled = false;
      }, 1200);
    } else if (el.dataset.qty) {
      const id = el.dataset.qty;
      setQty(id, (cart[id] || 0) + Number(el.dataset.delta));
    } else if (el.dataset.remove) {
      setQty(el.dataset.remove, 0);
    } else if (el.dataset.variant !== undefined && el.dataset.product) {
      chosen[el.dataset.product] = el.dataset.variant;
      renderProducts();
    } else if (el.dataset.filter) {
      filter = el.dataset.filter;
      renderProducts();
    } else if (el.hasAttribute("data-open-cart")) {
      openCart();
    }
  });

  document.getElementById("cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
  document.getElementById("thanks-close").addEventListener("click", () => {
    document.getElementById("thanks").close();
  });

  // ---------- Start ----------

  document.title = SHOP_CONFIG.shopName + " – Eritreische Gewürze & Kultur";
  document.getElementById("year").textContent = new Date().getFullYear();
  const mail = document.getElementById("contact-email");
  mail.textContent = SHOP_CONFIG.contactEmail;
  mail.href = "mailto:" + SHOP_CONFIG.contactEmail;
  const phone = document.getElementById("contact-phone");
  phone.textContent = SHOP_CONFIG.contactPhone;
  phone.href = "tel:" + SHOP_CONFIG.contactPhone.replace(/\s/g, "");
  const insta = document.getElementById("contact-instagram");
  if (SHOP_CONFIG.instagram) insta.href = SHOP_CONFIG.instagram;
  else insta.parentElement.hidden = true;

  initLangMenu(lang, (code) => {
    lang = code;
    renderAll();
  });

  if (ordersOpen) {
    renderAll();
    loadPayPal();
  } else {
    // Shop noch geschlossen: Warenkorb ausblenden, Hinweis zeigen
    cart = {};
    document.querySelector(".cart-button").hidden = true;
    document.getElementById("shop-closed").hidden = false;
    renderAll();
  }
})();
