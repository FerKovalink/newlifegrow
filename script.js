const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const catalogDialog = document.querySelector("[data-catalog-dialog]");
const openCatalog = document.querySelector("[data-open-catalog]");
const closeCatalog = document.querySelector("[data-close-catalog]");

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

const closeMenu = () => {
  menu?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

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

const showCatalog = () => {
  if (!catalogDialog) return;
  catalogDialog.showModal();
  document.body.classList.add("dialog-open");
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

document.querySelector("[data-year]").textContent = new Date().getFullYear();
