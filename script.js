// =========================
// MENÚ HAMBURGUESA
// =========================
const navMenu = document.getElementById("nav-links");
const navLinks = navMenu.querySelectorAll("a");

function toggleMenu() {
  navMenu.classList.toggle("active");
}

navLinks.forEach(link =>
  link.addEventListener("click", () => navMenu.classList.remove("active"))
);



// =========================
// 🚀 CARRUSEL PREMIUM
// =========================
const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
let index = 0;

document.querySelector(".next-slide").onclick = () => {
  index = (index + 1) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
};

document.querySelector(".prev-slide").onclick = () => {
  index = (index - 1 + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
};