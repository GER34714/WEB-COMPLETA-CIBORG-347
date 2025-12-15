/* -------- MENÚ -------- */
let autoClose;
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");

  if (menu.classList.contains("mobile-active")) {
    closeMenu();
  } else {
    menu.classList.add("mobile-active");
    overlay.style.display = "block";

    clearTimeout(autoClose);
    autoClose = setTimeout(() => closeMenu(), 5000);
  }
}

function closeMenu() {
  document.getElementById("mobile-menu").classList.remove("mobile-active");
  document.getElementById("menu-overlay").style.display = "none";
  clearTimeout(autoClose);
}

/* ===================== CMS ===================== */

let allSlides = [];
let index = 0;

const categories = [
  { id: "estetica", name: "Estética" },
  { id: "barber", name: "Barberías" },
  { id: "food", name: "Gastronomía" },
  { id: "evento", name: "Eventos" },
  { id: "radio", name: "Radios" },
  { id: "casino", name: "Casinos" },
  { id: "construccion", name: "Construcción" }
];

const catContainer = document.getElementById("category-buttons");

/* CARGAR PROJECTS.JSON */
fetch("projects.json")
  .then(res => res.json())
  .then(data => {
    allSlides = data;
    generarCategorias();
    updateCarousel();
  });

/* GENERAR BOTONES DE CATEGORÍA */
function generarCategorias() {
  catContainer.innerHTML = "";

  categories.forEach(cat => {
    if (allSlides.some(s => s.category === cat.id)) {
      const btn = document.createElement("button");
      btn.innerText = cat.name;
      btn.onclick = () => jumpToCategory(cat.id);
      catContainer.appendChild(btn);
    }
  });
}

/* RESALTAR CATEGORÍA ACTIVA */
function updateCategoryHighlight() {
  const activeCat = allSlides[index].category;

  document.querySelectorAll(".categories button").forEach(btn => {
    btn.classList.remove("active");
    const cat = categories.find(c => c.id === activeCat);
    if (cat && btn.innerText === cat.name) {
      btn.classList.add("active");
    }
  });
}

/* SALTO A CATEGORÍA */
function jumpToCategory(catId) {
  const i = allSlides.findIndex(s => s.category === catId);
  if (i !== -1) {
    index = i;
    updateCarousel();
  }
}

/* ACTUALIZAR CARRUSEL */
function updateCarousel() {
  if (!allSlides.length) return;

  const s = allSlides[index];

  document.getElementById("carousel-img").src = s.img;
  document.getElementById("carousel-short").innerText = s.short;
  document.getElementById("carousel-info").innerText = s.info;
  document.getElementById("carousel-btn").href = s.link;

  updateCategoryHighlight();
}

/* FLECHAS */
function nextSlide() {
  index = (index + 1) % allSlides.length;
  updateCarousel();
}
function prevSlide() {
  index = (index - 1 + allSlides.length) % allSlides.length;
  updateCarousel();
}

/* SWIPE */
let startX = 0;
document.getElementById("carousel").addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});
document.getElementById("carousel").addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  if (endX < startX - 50) nextSlide();
  if (endX > startX + 50) prevSlide();
});

/* TIPS ROTATIVOS */
const tips = [
  "Tip: Una landing clara convierte más clics en ventas.",
  "Tip: Un CTA fuerte aumenta conversiones hasta un 40%.",
  "Tip: Las imágenes profesionales venden más.",
  "Tip: Tu web debe cargar rápido para retener clientes.",
  "Tip: La primera impresión define si confían en tu negocio."
];

let tipIndex = 0;
setInterval(() => {
  const el = document.getElementById("tip-text");
  if (!el) return;
  tipIndex = (tipIndex + 1) % tips.length;
  el.innerText = tips[tipIndex];
}, 4000);/* ===================== PORTFOLIO REAL POR CATEGORÍAS ===================== */

function renderPortfolioCategorias() {
  const container = document.getElementById("portfolio-categorias");
  if (!container) return;

  container.innerHTML = "";

  const categoriasUnicas = [...new Set(allSlides.map(p => p.category))];

  categoriasUnicas.forEach(cat => {
    const items = allSlides.filter(p => p.category === cat);
    if (!items.length) return;

    const catName = categories.find(c => c.id === cat)?.name || cat;

    const section = document.createElement("div");
    section.className = "portfolio-category";

    section.innerHTML = `<h3>${catName}</h3>`;

    const grid = document.createElement("div");
    grid.className = "portfolio-grid";

    items.forEach(p => {
      const a = document.createElement("a");
      a.href = p.link;
      a.target = "_blank";
      a.innerHTML = `<img src="${p.img}" alt="${p.title}">`;
      grid.appendChild(a);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}