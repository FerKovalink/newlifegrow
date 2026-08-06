const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const catalogDialog = document.querySelector("[data-catalog-dialog]");
const openCatalog = document.querySelector("[data-open-catalog]");
const closeCatalog = document.querySelector("[data-close-catalog]");
const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieDialog = document.querySelector("[data-cookie-dialog]");
const cookieForm = document.querySelector("[data-cookie-form]");
const cookieStorageKey = "newlife_consent_v1";
const gtmId = import.meta.env.VITE_GTM_ID?.trim();

const pushEvent = (event, parameters = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
};

const updateGoogleConsent = ({ analytics, marketing }) => {
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
};

const loadGtm = () => {
  if (!gtmId || !/^GTM-[A-Z0-9]+$/i.test(gtmId) || document.querySelector("[data-gtm-script]")) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.dataset.gtmScript = "true";
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.append(script);
};

const readConsent = () => {
  try {
    return JSON.parse(localStorage.getItem(cookieStorageKey));
  } catch {
    return null;
  }
};

const applyConsent = (consent, { persist = false } = {}) => {
  const normalized = {
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
  };

  updateGoogleConsent(normalized);
  if (normalized.analytics || normalized.marketing) loadGtm();
  if (persist) localStorage.setItem(cookieStorageKey, JSON.stringify(normalized));
  if (cookieBanner) cookieBanner.hidden = true;
  cookieDialog?.close();
  document.body.classList.remove("dialog-open");
};

const openCookieSettings = () => {
  if (!cookieDialog) return;
  const consent = readConsent() || { analytics: false, marketing: false };
  cookieForm.elements.analytics.checked = Boolean(consent.analytics);
  cookieForm.elements.marketing.checked = Boolean(consent.marketing);
  cookieDialog.showModal();
  document.body.classList.add("dialog-open");
};

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

const closeMenu = () => {
  menu?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.classList.contains("open")) closeMenu();
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("revealed"));
}

const showCatalog = () => {
  if (!catalogDialog) return;
  catalogDialog.showModal();
  document.body.classList.add("dialog-open");
  pushEvent("view_catalog", { catalog_name: "Cannabian" });
};

const hideCatalog = () => {
  if (!catalogDialog) return;
  catalogDialog.close();
  document.body.classList.remove("dialog-open");
};

openCatalog?.addEventListener("click", showCatalog);
closeCatalog?.addEventListener("click", hideCatalog);

catalogDialog?.addEventListener("click", (event) => {
  if (event.target === catalogDialog) hideCatalog();
});

catalogDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => pushEvent("click_whatsapp", { link_url: link.href }));
});

document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
  link.addEventListener("click", () => pushEvent("click_instagram", { link_url: link.href }));
});

document.querySelectorAll('a[href="https://kovalink.com.ar/"]').forEach((link) => {
  link.addEventListener("click", () => pushEvent("click_creator", { creator_name: "Kova-Link", link_url: link.href }));
});

document.querySelectorAll("[data-cookie-accept]").forEach((button) => {
  button.addEventListener("click", () => applyConsent({ analytics: true, marketing: true }, { persist: true }));
});

document.querySelectorAll("[data-cookie-reject]").forEach((button) => {
  button.addEventListener("click", () => applyConsent({ analytics: false, marketing: false }, { persist: true }));
});

document.querySelectorAll("[data-cookie-configure], [data-open-cookie-settings]").forEach((button) => {
  button.addEventListener("click", openCookieSettings);
});

document.querySelectorAll("[data-close-cookie-settings]").forEach((button) => {
  button.addEventListener("click", () => cookieDialog?.close());
});

cookieForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.submitter?.value === "cancel") {
    cookieDialog?.close();
    return;
  }
  applyConsent(
    {
      analytics: cookieForm.elements.analytics.checked,
      marketing: cookieForm.elements.marketing.checked,
    },
    { persist: true },
  );
});

cookieDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
});

const savedConsent = readConsent();
if (savedConsent) {
  applyConsent(savedConsent);
} else if (cookieBanner) {
  cookieBanner.hidden = false;
}
