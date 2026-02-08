const feed_configs = {
  heise: {
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://heise.de/rss/heise-atom.xml",
    container: document.getElementById("feed_container"),
    getImage: (item) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.content, "text/html");
      const imgTag = doc.querySelector("img");
      return imgTag ? imgTag.src : "https://via.placeholder.com/150";
    },
  },
  spiegel: {
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.spiegel.de/schlagzeilen/tops/index.rss",
    container: document.getElementById("feed_container_spiegel"),
    getImage: (item) =>
      item.enclosure && item.enclosure.link
        ? item.enclosure.link
        : "https://via.placeholder.com/150",
  },
  tagesschau: {
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.tagesschau.de/xml/rss2",
    container: document.getElementById("feed_container_tagesschau"),
    getImage: (item) => {
      if (item.content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.content, "text/html");
        const imgTag = doc.querySelector("img");
        if (imgTag && imgTag.src) return imgTag.src;
      }
      return "https://via.placeholder.com/150";
    },
  },
};

const ui = {
  refreshBtn: document.getElementById("btn_refresh"),
  sortOrder: document.getElementById("sort_order"),
  favoritesContainer: document.getElementById("favorites_container"),
  readLaterContainer: document.getElementById("readlater_container"),
  favoritesCount: document.getElementById("favorites_count"),
  readLaterCount: document.getElementById("readlater_count"),
};

const STORAGE_KEYS = {
  favorites: "rss-feed:favorites:v1",
  readLater: "rss-feed:readlater:v1",
  prefs: "rss-feed:prefs:v1",
};

const state = {
  sortOrder: "newest",
  itemsByFeed: new Map(),
  favorites: {},
  readLater: {},
};

window.onload = init;

function init() {
  loadStateFromStorage();

  if (ui.sortOrder) {
    ui.sortOrder.value = state.sortOrder;
    ui.sortOrder.addEventListener("change", (e) => {
      state.sortOrder = e.target.value === "oldest" ? "oldest" : "newest";
      savePrefs();
      renderAllFromCache();
      renderLists();
    });
  }

  if (ui.refreshBtn) {
    ui.refreshBtn.addEventListener("click", () => fetchAllFeeds());
  }

  setLoadingAll();
  renderLists();
  setTimeout(() => fetchAllFeeds(), 300);
}

function setLoadingAll() {
  Object.values(feed_configs).forEach((cfg) => {
    if (cfg.container) cfg.container.innerHTML = `<h1>Lade Daten....</h1>`;
  });
}

function fetchAllFeeds() {
  setLoadingAll();
  Object.entries(feed_configs).forEach(([key, cfg]) => fetchFeed(key, cfg));
}

async function fetchFeed(key, cfg) {
  try {
    const res = await fetch(cfg.url);
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    state.itemsByFeed.set(key, items);
    renderFeed(key, cfg, items);
  } catch (error) {
    console.error(`Error fetching data:`, error);
    if (cfg.container)
      cfg.container.innerHTML = `<h1>Fehler beim Laden der Daten</h1>`;
  }
}

function renderAllFromCache() {
  Object.entries(feed_configs).forEach(([key, cfg]) => {
    const items = state.itemsByFeed.get(key);
    if (items) renderFeed(key, cfg, items);
  });
}

function renderFeed(feedKey, cfg, items) {
  if (!cfg.container) return;

  const filtered = items
    .filter((item) => !recognizeBadWords(item.title))
    .slice();

  filtered.sort((a, b) => sortByDate(a.pubDate, b.pubDate, state.sortOrder));

  cfg.container.innerHTML = ``;

  filtered.forEach((item) => {
    const summary = normalizeItem(feedKey, item, cfg);
    const card = createItemCard(summary, { showActions: true });
    cfg.container.appendChild(card);
  });
}

function createItemCard(summary, { showActions }) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("grid-item");

  if (summary.image) {
    const itemImage = document.createElement("img");
    itemImage.src = summary.image;
    itemImage.alt = summary.title || "Artikelbild";
    itemImage.loading = "lazy";
    itemDiv.appendChild(itemImage);
  }

  const itemTitle = document.createElement("h3");
  itemTitle.textContent = summary.title || "(ohne Titel)";

  const dateTag = document.createElement("p");
  dateTag.textContent = formatPubDate(summary.pubDate);

  const descrTag = document.createElement("p");
  descrTag.textContent = summary.description || "";

  const itemLink = document.createElement("a");
  itemLink.href = summary.link;
  itemLink.textContent = "Read more";
  itemLink.target = "_blank";
  itemLink.rel = "noopener noreferrer";

  itemDiv.appendChild(itemTitle);
  itemDiv.appendChild(dateTag);
  itemDiv.appendChild(descrTag);
  itemDiv.appendChild(itemLink);

  if (showActions) {
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className =
      "btn-action" + (isFavorite(summary.id) ? " is-active" : "");
    favBtn.textContent = isFavorite(summary.id) ? "⭐ Favorit" : "☆ Favorit";
    favBtn.addEventListener("click", () => {
      toggleFavorite(summary);
      renderAllFromCache();
      renderLists();
    });

    const laterBtn = document.createElement("button");
    laterBtn.type = "button";
    laterBtn.className =
      "btn-action" + (isReadLater(summary.id) ? " is-active" : "");
    laterBtn.textContent = isReadLater(summary.id)
      ? "📌 Gespeichert"
      : "📌 Später lesen";
    laterBtn.addEventListener("click", () => {
      toggleReadLater(summary);
      renderAllFromCache();
      renderLists();
    });

    actions.appendChild(favBtn);
    actions.appendChild(laterBtn);
    itemDiv.appendChild(actions);
  }

  return itemDiv;
}

function renderLists() {
  if (ui.favoritesContainer) {
    const favs = Object.values(state.favorites).slice();
    favs.sort((a, b) => sortByDate(a.pubDate, b.pubDate, state.sortOrder));
    ui.favoritesContainer.innerHTML = "";

    if (ui.favoritesCount) ui.favoritesCount.textContent = `(${favs.length})`;

    if (favs.length === 0) {
      ui.favoritesContainer.innerHTML = `<p style="padding: 0 20px; opacity: 0.8;">Noch keine Favoriten.</p>`;
    } else {
      favs.forEach((summary) => {
        const card = createItemCard(summary, { showActions: true });
        ui.favoritesContainer.appendChild(card);
      });
    }
  }

  if (ui.readLaterContainer) {
    const later = Object.values(state.readLater).slice();
    later.sort((a, b) => sortByDate(a.pubDate, b.pubDate, state.sortOrder));
    ui.readLaterContainer.innerHTML = "";

    if (ui.readLaterCount) ui.readLaterCount.textContent = `(${later.length})`;

    if (later.length === 0) {
      ui.readLaterContainer.innerHTML = `<p style="padding: 0 20px; opacity: 0.8;">Noch keine Artikel für „Später lesen“.</p>`;
    } else {
      later.forEach((summary) => {
        const card = createItemCard(summary, { showActions: true });
        ui.readLaterContainer.appendChild(card);
      });
    }
  }
}

function normalizeItem(feedKey, item, cfg) {
  const id = String(
    item.link || item.guid || `${feedKey}:${item.title}:${item.pubDate}`,
  );
  return {
    id,
    feedKey,
    title: item.title || "",
    link: item.link || "#",
    pubDate: item.pubDate || "",
    description: item.description || "",
    image: safeGetImage(cfg, item),
  };
}

function safeGetImage(cfg, item) {
  try {
    const img = cfg.getImage(item);
    return img || "";
  } catch {
    return "";
  }
}

function sortByDate(dateA, dateB, order) {
  const a = new Date(dateA).getTime() || 0;
  const b = new Date(dateB).getTime() || 0;
  return order === "oldest" ? a - b : b - a;
}

function formatPubDate(pubDate) {
  const pubDateObj = new Date(pubDate);
  if (!isFinite(pubDateObj)) return "";

  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isToday = pubDateObj.toDateString() === now.toDateString();
  const isYesterday = pubDateObj.toDateString() === yesterday.toDateString();
  const timeString = pubDateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `heute, ${timeString}`;
  if (isYesterday) return `gestern, ${timeString}`;
  return `${pubDateObj.toLocaleDateString()}, ${timeString}`;
}

function isFavorite(id) {
  return !!state.favorites[id];
}

function isReadLater(id) {
  return !!state.readLater[id];
}

function toggleFavorite(summary) {
  if (state.favorites[summary.id]) {
    delete state.favorites[summary.id];
  } else {
    state.favorites[summary.id] = summary;
  }
  saveLists();
}

function toggleReadLater(summary) {
  if (state.readLater[summary.id]) {
    delete state.readLater[summary.id];
  } else {
    state.readLater[summary.id] = summary;
  }
  saveLists();
}

function loadStateFromStorage() {
  state.favorites = readJson(STORAGE_KEYS.favorites, {});
  state.readLater = readJson(STORAGE_KEYS.readLater, {});

  const prefs = readJson(STORAGE_KEYS.prefs, {});
  state.sortOrder = prefs.sortOrder === "oldest" ? "oldest" : "newest";
}

function saveLists() {
  writeJson(STORAGE_KEYS.favorites, state.favorites);
  writeJson(STORAGE_KEYS.readLater, state.readLater);
}

function savePrefs() {
  writeJson(STORAGE_KEYS.prefs, { sortOrder: state.sortOrder });
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function recognizeBadWords(text) {
  const badWords = ["heise+", "heise-Angebot"];
  return badWords.some((word) => (text || "").includes(word));
}
