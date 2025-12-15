let projects = [];
let featured = [];
let fIndex = 0;

/* CARGAR CMS */
fetch("projects.json")
  .then(res => res.json())
  .then(data => {
    projects = data;
    featured = projects.filter(p => p.featured);

    // Si existe la sección destacadas (index)
    if (document.getElementById("featured-img")) {
      initFeatured();
    }

    // Si existe portfolio (index o portfolio.html)
    if (document.getElementById("portfolio-container")) {
      buildPortfolio();
    }
  });

/* DESTACADAS */
function initFeatured(){
  if(!featured.length) return;
  showFeatured();
}

function showFeatured(){
  const p = featured[fIndex];
  document.getElementById("featured-img").src = p.img;
  document.getElementById("featured-text").innerText = p.text;
  document.getElementById("featured-link").href = p.link;
}

function nextFeatured(){
  fIndex = (fIndex + 1) % featured.length;
  showFeatured();
}
function prevFeatured(){
  fIndex = (fIndex - 1 + featured.length) % featured.length;
  showFeatured();
}

/* PORTFOLIO */
function buildPortfolio(){
  const container = document.getElementById("portfolio-container");
  container.innerHTML = "";

  const categories = [...new Set(projects.map(p => p.category))];

  categories.forEach(cat => {
    const block = document.createElement("div");
    block.className = "category";
    block.innerHTML = `<h3>${cat}</h3>`;

    const grid = document.createElement("div");
    grid.className = "grid";

    projects
      .filter(p => p.category === cat)
      .forEach(p => {
        const a = document.createElement("a");
        a.href = p.link;
        a.target = "_blank";
        a.innerHTML = `<img src="${p.img}" alt="${p.title}" title="${p.title}">`;
        grid.appendChild(a);
      });

    block.appendChild(grid);
    container.appendChild(block);
  });
}