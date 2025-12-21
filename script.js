/* ================= MENÚ MOBILE ================= */
let autoClose;
function toggleMenu(){
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  if(menu.classList.contains("mobile-active")){
    closeMenu();
  }else{
    menu.classList.add("mobile-active");
    overlay.style.display = "block";
    clearTimeout(autoClose);
    autoClose = setTimeout(closeMenu, 5000);
  }
}
function closeMenu(){
  document.getElementById("mobile-menu").classList.remove("mobile-active");
  document.getElementById("menu-overlay").style.display = "none";
  clearTimeout(autoClose);
}

/* ================= EJEMPLOS ================= */
const PAGE_SIZE = 8;
const STEP = 8;

const examples = window.EXAMPLES || [];
const categoryOrder = window.CATEGORY_ORDER || [];
const categoryLabels = window.CATEGORY_LABELS || {};

let activeCategory = "all";
let visibleCount = PAGE_SIZE;
let filtered = [];
let modalIndex = -1;

/* DOM */
const catContainer = document.getElementById("category-buttons");
const grid = document.getElementById("examples-grid");
const meta = document.getElementById("examples-meta");
const loadMoreBtn = document.getElementById("load-more-btn");
const showLessBtn = document.getElementById("show-less-btn");
const toggleAllBtn = document.getElementById("toggle-all-btn");

/* MODAL */
const modalOverlay = document.getElementById("modal-overlay");
const modalImg = document.getElementById("modal-img");
const modalCat = document.getElementById("modal-cat");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalLink = document.getElementById("modal-link");

/* Helpers */
function label(cat){
  return categoryLabels[cat] || cat;
}

function getCategories(){
  const set = new Set(examples.map(e => e.category));
  const arr = Array.from(set);
  arr.sort((a,b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));
  return arr;
}

/* Render categorías */
function renderCategories(){
  catContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.innerText = "Todos";
  allBtn.classList.add("active");
  allBtn.onclick = () => selectCategory("all", allBtn);
  catContainer.appendChild(allBtn);

  getCategories().forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = label(cat);
    btn.onclick = () => selectCategory(cat, btn);
    catContainer.appendChild(btn);
  });
}

function selectCategory(cat, btn){
  activeCategory = cat;
  visibleCount = PAGE_SIZE;
  document.querySelectorAll(".categories button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render();
}

/* Render grilla */
function render(){
  filtered = activeCategory === "all"
    ? examples
    : examples.filter(e => e.category === activeCategory);

  const show = filtered.slice(0, visibleCount);
  grid.innerHTML = "";

  show.forEach((item, i) => {
    grid.insertAdjacentHTML("beforeend", `
      <div class="example-card" data-i="${i}">
        <div class="thumb"><img src="${item.img}" alt=""></div>
        <div class="card-row">
          <div class="card-title">${item.title}</div>
          <div class="card-cat">${label(item.category)}</div>
        </div>
        <div class="card-short">${item.short}</div>
      </div>
    `);
  });

  meta.innerText = `Mostrando ${show.length} de ${filtered.length} ejemplos`;

  loadMoreBtn.style.display = filtered.length > visibleCount ? "inline-flex" : "none";
  showLessBtn.style.display = visibleCount > PAGE_SIZE ? "inline-flex" : "none";
}

/* Click cards */
grid.addEventListener("click", e => {
  const card = e.target.closest(".example-card");
  if(!card) return;
  modalIndex = Number(card.dataset.i);
  openModal();
});

/* Modal */
function openModal(){
  const item = filtered[modalIndex];
  modalImg.src = item.img;
  modalCat.innerText = label(item.category);
  modalTitle.innerText = item.title;
  modalDesc.innerText = item.info;
  modalLink.href = item.link;
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}
function closeExampleModal(){
  modalOverlay.style.display = "none";
  document.body.style.overflow = "";
}
function nextExample(){
  modalIndex = (modalIndex + 1) % filtered.length;
  openModal();
}
function prevExample(){
  modalIndex = (modalIndex - 1 + filtered.length) % filtered.length;
  openModal();
}

/* Botones */
loadMoreBtn.onclick = () => {
  visibleCount += STEP;
  render();
};
showLessBtn.onclick = () => {
  visibleCount = PAGE_SIZE;
  render();
};
toggleAllBtn.onclick = () => {
  visibleCount = filtered.length;
  render();
};

/* Init */
renderCategories();
render();

/* Tips */
const tips = [
  "Tip: Una landing clara convierte más clics en ventas.",
  "Tip: Un CTA fuerte aumenta conversiones.",
  "Tip: Las imágenes profesionales venden más."
];
let t = 0;
setInterval(() => {
  document.getElementById("tip-text").innerText = tips[t++ % tips.length];
}, 4000);

/* Exponer global */
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.closeExampleModal = closeExampleModal;
window.nextExample = nextExample;
window.prevExample = prevExample;