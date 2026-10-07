// ============================================================
// Game Hub — Tabbed Game Launcher
// ============================================================

const GAMES = [
  {
    id: "duck",
    name: "Duck Duck Clicker",
    url: "https://www.crazygames.com/embed/duck-duck-clicker",
    tags: ["clicker", "idle"]
  },
  {
    id: "cookie",
    name: "Cookie Clicker",
    url: "https://orteil.dashnet.org/cookieclicker/",
    tags: ["clicker", "idle"]
  },
  {
    id: "infinite",
    name: "Infinite Craft",
    url: "https://neal.fun/infinite-craft/",
    tags: ["puzzle", "craft"]
  },
  {
    id: "slope",
    name: "Slope",
    url: "https://www.crazygames.com/embed/slope",
    tags: ["arcade", "reflex"]
  },
  {
    id: "2048",
    name: "2048",
    url: "https://play2048.co/",
    tags: ["puzzle"]
  },
  {
    id: "wordle",
    name: "Wordle Unlimited",
    url: "https://wordleunlimited.org/",
    tags: ["word", "puzzle"]
  },
  {
    id: "suika",
    name: "Suika Game",
    url: "https://www.crazygames.com/embed/suika-game",
    tags: ["physics", "puzzle"]
  },
  {
    id: "nealfun",
    name: "Neal.fun",
    url: "https://neal.fun/",
    tags: ["experiments", "fun"]
  },
  {
    id: "alchemy",
    name: "Little Alchemy 2",
    url: "https://littlealchemy2.com/",
    tags: ["craft", "puzzle"]
  },
  {
    id: "sand",
    name: "This Is Sand",
    url: "https://thisissand.com/",
    tags: ["art", "relax"]
  }
];

// ---------- State ----------
let openTabs = [];          // array of game ids
let activeTab = null;

// ---------- Elements ----------
const tabsEl       = document.getElementById("tabs");
const sidebarEl    = document.getElementById("sidebar");
const gameContEl   = document.getElementById("game-container");
const searchEl     = document.getElementById("search");

// ---------- Rendering ----------
function renderSidebar(filter = "") {
  sidebarEl.innerHTML = "<h3>All Games</h3>";
  const q = filter.toLowerCase();

  GAMES
    .filter(g => g.name.toLowerCase().includes(q) || g.tags.some(t => t.includes(q)))
    .forEach(game => {
      const item = document.createElement("div");
      item.className = "game-item" + (activeTab === game.id ? " active" : "");
      item.textContent = game.name;
      item.onclick = () => openGame(game.id);
      sidebarEl.appendChild(item);
    });
}

function renderTabs() {
  tabsEl.innerHTML = "";
  openTabs.forEach(id => {
    const game = GAMES.find(g => g.id === id);
    if (!game) return;

    const btn = document.createElement("button");
    btn.className = "tab-btn" + (activeTab === id ? " active" : "");
    btn.innerHTML = `${game.name} <span class="close" data-id="${id}">×</span>`;

    btn.onclick = (e) => {
      if (e.target.classList.contains("close")) {
        closeTab(id);
      } else {
        setActive(id);
      }
    };

    tabsEl.appendChild(btn);
  });
}

function renderGame() {
  gameContEl.innerHTML = "";
  if (!activeTab) {
    gameContEl.innerHTML = `
      <div class="placeholder">
        <h2>Pick a game above ☝️</h2>
        <p>Games load in a sandboxed iframe. Some sites may block embedding.</p>
      </div>`;
    return;
  }

  const game = GAMES.find(g => g.id === activeTab);
  if (!game) return;

  const iframe = document.createElement("iframe");
  iframe.src = game.url;
  iframe.allow = "fullscreen; autoplay; gamepad; clipboard-write";
  iframe.referrerPolicy = "no-referrer";
  iframe.loading = "lazy";
  gameContEl.appendChild(iframe);
}

// ---------- Actions ----------
function openGame(id) {
  if (!openTabs.includes(id)) openTabs.push(id);
  activeTab = id;
  renderTabs();
  renderGame();
  renderSidebar(searchEl.value);
}

function closeTab(id) {
  openTabs = openTabs.filter(t => t !== id);
  if (activeTab === id) {
    activeTab = openTabs.length ? openTabs[openTabs.length - 1] : null;
  }
  renderTabs();
  renderGame();
  renderSidebar(searchEl.value);
}

function setActive(id) {
  activeTab = id;
  renderTabs();
  renderGame();
  renderSidebar(searchEl.value);
}

// ---------- Search ----------
searchEl.addEventListener("input", (e) => {
  renderSidebar(e.target.value);
});

// ---------- Init ----------
renderSidebar();
renderTabs();
renderGame();
