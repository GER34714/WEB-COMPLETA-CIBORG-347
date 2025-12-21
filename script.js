/* ===========================
   MENÚ MOBILE
=========================== */
let autoClose;
function toggleMenu(){
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  if(menu.classList.contains("mobile-active")){
    closeMenu();
  } else {
    menu.classList.add("mobile-active");
    overlay.style.display = "block";
    clearTimeout(autoClose);
    autoClose = setTimeout(() => closeMenu(), 5000);
  }
}
function closeMenu(){
  document.getElementById("mobile-menu").classList.remove("mobile-active");
  document.getElementById("menu-overlay").style.display="none";
  clearTimeout(autoClose);
}

/* ===========================
   EJEMPLOS (PRO)
=========================== */
const PAGE_SIZE = 10;         // ✅ cantidad inicial (menos scroll)
const PAGE_STEP = 10;         // ✅ cuánto agrega "Ver más"

const examples = (window.EXAMPLES || []).map((x, idx) => ({
  ...x,
  _id: x._id || `ex_${idx}_${(x.title||"").toLowerCase().replace(/\s+/g,"_")}`
}));

const order = window.CATEGORY_ORDER || [];
const labels = window.CATEGORY_LABELS || {};

let activeCategory = "all";
let searchText = "";
let visibleCount = PAGE_SIZE;
let showAll = false;

let filteredList = [];
let modalIndex = -1;

/* DOM */
const catContainer = document.getElementById("category-buttons");
const grid = document.getElementById("examples-grid");
const meta = document.getElementById("examples-meta");
const searchInput = document.getElementById("search-input");
const loadMoreBtn = document.getElementById("load-more-btn");
const showLessBtn = document.getElementById("show-less-btn");
const toggleAllBtn = document.getElementById("toggle-all-btn");

/* Modal */
const modalOverlay = document.getElementById("modal-overlay");
const modalImg = document.getElementById("modal-img");
const modalCat = document.getElementById("modal-cat");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalLink = document.getElementById("modal-link");

/* Categories auto (si agregás una categoría nueva, aparece sola) */
function getCategoryList(){
  const set = new Set(examples.map(x => x.category).filter(Boolean));
  const arr = Array.from(set);
  arr.sort((a,b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if(ia === -1 && ib === -1) return a.localeCompare(b);
    if(ia === -1) return 1;
    if(ib === -1) return -1;
    return ia - ib;
  });
  return arr;
}

function catLabel(id){
  return labels[id] || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "Categoría");
}

/* Render categorías */
function renderCategoryButtons(){
  catContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.innerText = "Todos";
  allBtn.onclick = () => { activeCategory = "all"; visibleCount = PAGE_SIZE; showAll=false; syncToggleAllText(); render(); };
  catContainer.appendChild(allBtn);

  getCategoryList().forEach((cat) => {
    const btn = document.createElement("button");
    btn.innerText = catLabel(cat);
    btn.onclick = () => { activeCategory = cat; visibleCount = PAGE_SIZE; showAll=false; syncToggleAllText(); render(); };
    catContainer.appendChild(btn);
  });
}

function updateCategoryHighlight(){
  const buttons = catContainer.querySelectorAll("button");
  buttons.forEach((btn) => btn.classList.remove("active"));
  const index = (activeCategory === "all") ? 0 : (getCategoryList().indexOf(activeCategory) + 1);
  if(buttons[index]) buttons[index].classList.add("active");
}

function matchesSearch(item){
  if(!searchText) return true;
  const s = searchText.toLowerCase().trim();
  const hay = `${item.title||""} ${item.short||""} ${item.info||""} ${item.category||""}`.toLowerCase();
  return hay.includes(s);
}

function computeFiltered(){
  filteredList = examples.filter(x => {
    const catOK = (activeCategory === "all") ? true : x.category === activeCategory;
    return catOK && matchesSearch(x);
  });
}

function cardHTML(item, index){
  return `
    <div class="example-card" data-index="${index}">
      <div class="thumb">
        <img src="${item.img}" alt="">
      </div>
      <div class="card-row">
        <div class="card-title">${item.title || "Ejemplo"}</div>
        <div class="card-cat">${catLabel(item.category)}</div>
      </div>
      <div class="card-short">${item.short || ""}</div>
    </div>
  `;
}

function renderGrid(){
  grid.innerHTML = "";

  const total = filteredList.length;
  const canShow = showAll ? total : Math.min(visibleCount, total);
  const slice = filteredList.slice(0, canShow);

  slice.forEach((item, idx) => {
    grid.insertAdjacentHTML("beforeend", cardHTML(item, idx));
  });

  meta.innerText = `Mostrando ${canShow} de ${total} ejemplo(s)`;

  // botones
  loadMoreBtn.style.display = (!showAll && total > canShow) ? "inline-flex" : "none";
  showLessBtn.style.display = (!showAll && canShow > PAGE_SIZE) ? "inline-flex" : "none";
}

function bindGridClicks(){
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".example-card");
    if(!card) return;
    const idx = Number(card.getAttribute("data-index"));
    openExampleModal(idx);
  });
}

function syncToggleAllText(){
  toggleAllBtn.innerText = showAll ? "Mostrar menos" : "Ver todos los ejemplos";
}

/* Modal */
function openExampleModal(idx){
  modalIndex = idx;
  const item = filteredList[modalIndex];
  if(!item) return;

  modalImg.src = item.img || "";
  modalCat.innerText = catLabel(item.category);
  modalTitle.innerText = item.title || "Ejemplo";
  modalDesc.innerText = item.info || item.short || "";
  modalLink.href = item.link || "#";

  modalOverlay.style.display = "flex";
  modalOverlay.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeExampleModal(){
  modalOverlay.style.display = "none";
  modalOverlay.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

function nextExample(){
  if(filteredList.length === 0) return;
  modalIndex = (modalIndex + 1) % filteredList.length;
  openExampleModal(modalIndex);
}
function prevExample(){
  if(filteredList.length === 0) return;
  modalIndex = (modalIndex - 1 + filteredList.length) % filteredList.length;
  openExampleModal(modalIndex);
}

/* Cerrar modal clic afuera + ESC */
modalOverlay.addEventListener("click", (e) => {
  if(e.target === modalOverlay) closeExampleModal();
});
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeExampleModal();
  if(modalOverlay.style.display === "flex"){
    if(e.key === "ArrowRight") nextExample();
    if(e.key === "ArrowLeft") prevExample();
  }
});

/* Controls */
searchInput.addEventListener("input", () => {
  searchText = searchInput.value || "";
  visibleCount = PAGE_SIZE;
  showAll = false;
  syncToggleAllText();
  render();
});

loadMoreBtn.addEventListener("click", () => {
  visibleCount += PAGE_STEP;
  render();
});

showLessBtn.addEventListener("click", () => {
  visibleCount = PAGE_SIZE;
  render();
  document.getElementById("trabajos").scrollIntoView({behavior:"smooth", block:"start"});
});

toggleAllBtn.addEventListener("click", () => {
  showAll = !showAll;
  if(showAll) {
    visibleCount = filteredList.length;
  } else {
    visibleCount = PAGE_SIZE;
  }
  syncToggleAllText();
  render();
  if(!showAll){
    document.getElementById("trabajos").scrollIntoView({behavior:"smooth", block:"start"});
  }
});

/* Init render */
function render(){
  computeFiltered();
  updateCategoryHighlight();
  renderGrid();
}

renderCategoryButtons();
bindGridClicks();
syncToggleAllText();
render();

/* ------------------------ TIPS ROTATIVOS ------------------------ */
const tips = [
  "Tip: Una landing clara convierte más clics en ventas.",
  "Tip: Un CTA fuerte aumenta conversiones.",
  "Tip: Las imágenes profesionales venden más.",
  "Tip: Tu web debe cargar rápido para retener clientes.",
  "Tip: La primera impresión define si confían en tu negocio."
];
let tipIndex = 0;
setInterval(() => {
  tipIndex = (tipIndex + 1) % tips.length;
  const el = document.getElementById("tip-text");
  if(el) el.innerText = tips[tipIndex];
}, 4000);

// Exponer funciones globales usadas en HTML
window.closeMenu = closeMenu;
window.toggleMenu = toggleMenu;

window.closeExampleModal = closeExampleModal;
window.nextExample = nextExample;
window.prevExample = prevExample;