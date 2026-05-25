const PHONE = "525587471699"; // wa.me usa código país +52
const BASE = `https://wa.me/${PHONE}`;

const buildMsg = (product = "", price = "") => {
  const lines = [
    "Hola, quiero hacer un pedido con Hielo Express:",
    product ? `Producto: ${product}` : "Producto: ______",
    "Cantidad: ______",
    "Dirección / zona: ______",
    "¿Pago con tarjeta o transferencia?: ______",
    "",
    "Nota: Sujeto a disponibilidad de ruta."
  ];
  if (price) lines.splice(2, 0, `Precio: $${price} MXN`);
  return lines.join("\n");
};

const openWhats = (msg) => {
  const url = `${BASE}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener");
};

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Main CTA + contact + floating
const defaultMsg = buildMsg();
["ctaWhats", "contactWhats", "floatWhats"].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const product = el.dataset.product || "";
  const price = el.dataset.price || "";
  const msg = product || price ? buildMsg(product, price) : defaultMsg;
  if ("href" in el) el.href = `${BASE}?text=${encodeURIComponent(msg)}`;
});

// Copy message button
const copyBtn = document.getElementById("copyMsg");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(defaultMsg);
      alert("Mensaje copiado ✅ Pégalo en WhatsApp y te confirmamos disponibilidad.");
    } catch {
      alert("No pude copiar automáticamente. Copia manualmente el mensaje del recuadro.");
    }
  });
}

// Order buttons
document.querySelectorAll(".orderBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.product;
    const price = btn.dataset.price;
    openWhats(buildMsg(product, price));
  });
});

// Mobile menu
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.style.display === "block";
    mobileNav.style.display = isOpen ? "none" : "block";
  });
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => (mobileNav.style.display = "none"));
  });
}

// Reveal animations on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}

// Search dropdown + product filter
const searchToggle = document.getElementById("searchToggle");
const searchDropdown = document.getElementById("searchDropdown");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const productCards = Array.from(document.querySelectorAll("[data-search]"));

const products = [
  { name: "Hielo ROL 16KG", link: "producto-rol.html", tags: "hielo rol 16kg bolsa" },
  { name: "Hielo Cubo Gourmet 16KG", link: "producto-cubo.html", tags: "hielo cubo gourmet 16kg bolsa" },
  { name: "Barra de Hielo 170KG", link: "producto-barra170.html", tags: "barra de hielo 170kg barra" },
  { name: "Media Barra 85KG", link: "producto-barra85.html", tags: "media barra 85kg barra" }
];

const normalize = (value) => value.toLowerCase().trim();

const renderResults = (query) => {
  if (!searchResults) return;
  const q = normalize(query);
  searchResults.innerHTML = "";

  if (!q) {
    const hint = document.createElement("div");
    hint.className = "search-hint";
    hint.textContent = "Escribe para buscar productos o proveedores.";
    searchResults.appendChild(hint);
    productCards.forEach(card => (card.style.display = ""));
    return;
  }

  const matches = products.filter(p => p.tags.includes(q));
  if (q.includes("proveedor")) {
    const info = document.createElement("div");
    info.className = "search-hint";
    info.textContent = "Próximamente: directorio de proveedores y rutas comerciales.";
    searchResults.appendChild(info);
  }

  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "search-hint";
    empty.textContent = "Sin resultados. Intenta con “rol”, “cubo” o “barra”.";
    searchResults.appendChild(empty);
  } else {
    matches.forEach(item => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = item.link;
      link.textContent = item.name;
      searchResults.appendChild(link);
    });
  }

  if (productCards.length) {
    productCards.forEach(card => {
      const text = normalize(card.dataset.search || "");
      card.style.display = text.includes(q) ? "" : "none";
    });
  }
};

if (searchToggle && searchDropdown && searchInput) {
  searchToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = searchDropdown.classList.toggle("is-open");
    searchToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      searchInput.focus();
      renderResults(searchInput.value);
    }
  });

  searchInput.addEventListener("input", (e) => renderResults(e.target.value));

  document.addEventListener("click", (e) => {
    if (!searchDropdown.contains(e.target) && e.target !== searchToggle) {
      searchDropdown.classList.remove("is-open");
      searchToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchDropdown.classList.remove("is-open");
      searchToggle.setAttribute("aria-expanded", "false");
    }
  });
}
