/*
 * Sprachauswahl als Dropdown-Menü (wird von Shop und FAQ genutzt).
 * Die Reihenfolge hier ist die Reihenfolge im Menü.
 */
const LANGUAGES = [
  { code: "de", label: "Deutsch", short: "DE", locale: "de-DE" },
  { code: "en", label: "English", short: "EN", locale: "en-IE" },
  { code: "ti", label: "ትግርኛ", short: "ትግ", locale: "de-DE" },
];

const LANG_STORAGE_KEY = "aksum-lang";

// Gespeicherte Sprache lesen (nur bekannte Sprachen, sonst Deutsch)
function loadLanguage() {
  try {
    const saved = JSON.parse(localStorage.getItem(LANG_STORAGE_KEY));
    if (LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch (e) {
    /* privates Fenster o. Ä. – dann eben Deutsch */
  }
  return "de";
}

function saveLanguage(code) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, JSON.stringify(code));
  } catch (e) {
    /* ignorieren */
  }
}

function localeFor(code) {
  return (LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]).locale;
}

// Baut das Menü in jedes Element mit [data-lang-menu] und ruft
// onChange(code) auf, wenn eine andere Sprache gewählt wird.
function initLangMenu(current, onChange) {
  const GLOBE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  const CHEVRON = '<svg class="lang-menu__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const CHECK = '<svg class="lang-menu__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  document.querySelectorAll("[data-lang-menu]").forEach((root) => {
    root.classList.add("lang-menu");
    root.innerHTML = `
      <button type="button" class="lang-menu__toggle" aria-haspopup="menu" aria-expanded="false"
        aria-label="Sprache · Language · ቋንቋ">
        ${GLOBE}<span class="lang-menu__current"></span>${CHEVRON}
      </button>
      <ul class="lang-menu__list" role="menu" hidden>
        ${LANGUAGES.map(
          (l) => `<li role="none"><button type="button" role="menuitemradio" lang="${l.code}"
            data-lang-option="${l.code}">${CHECK}<span>${l.label}</span></button></li>`
        ).join("")}
      </ul>`;

    const toggle = root.querySelector(".lang-menu__toggle");
    const list = root.querySelector(".lang-menu__list");
    const options = [...root.querySelectorAll("[data-lang-option]")];

    function show(code) {
      root.querySelector(".lang-menu__current").textContent =
        (LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]).short;
      options.forEach((o) => o.setAttribute("aria-checked", String(o.dataset.langOption === code)));
    }

    function open() {
      list.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      (options.find((o) => o.getAttribute("aria-checked") === "true") || options[0]).focus();
    }

    function close(focusToggle) {
      list.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (focusToggle) toggle.focus();
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      list.hidden ? open() : close(false);
    });

    options.forEach((o, i) => {
      o.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = o.dataset.langOption;
        close(true);
        show(code);
        saveLanguage(code);
        onChange(code);
      });
      o.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); options[(i + 1) % options.length].focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); options[(i - 1 + options.length) % options.length].focus(); }
      });
    });

    root.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !list.hidden) { e.stopPropagation(); close(true); }
    });
    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) close(false);
    });

    show(current);
  });
}
