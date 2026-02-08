const FEED_CATALOG = {
  heise: {
    label: "Heise",
    rssUrl: "https://heise.de/rss/heise-atom.xml",
    headerClass: "",
    imageMode: "content_img",
  },
  tagesschau: {
    label: "Tagesschau",
    rssUrl: "https://www.tagesschau.de/xml/rss2",
    headerClass: "tagesschau",
    imageMode: "content_img",
  },
  spiegel: {
    label: "Spiegel News",
    rssUrl: "https://www.spiegel.de/schlagzeilen/tops/index.rss",
    headerClass: "spiegel",
    imageMode: "enclosure",
  },
  zeit: {
    label: "DIE ZEIT",
    rssUrl: "https://newsfeed.zeit.de/index",
    headerClass: "",
    imageMode: "content_img",
  },
  faz: {
    label: "FAZ",
    rssUrl: "https://www.faz.net/rss/aktuell/",
    headerClass: "",
    imageMode: "content_img",
  },
  sueddeutsche: {
    label: "Süddeutsche Zeitung",
    rssUrl: "https://rss.sueddeutsche.de/rss/Topthemen",
    headerClass: "",
    imageMode: "content_img",
  },
};

const ui = {
  refreshBtn: document.getElementById("btn_refresh"),
  manageFeedsBtn: document.getElementById("btn_manage_feeds"),
  sortOrder: document.getElementById("sort_order"),
  favoritesContainer: document.getElementById("favorites_container"),
  readLaterContainer: document.getElementById("readlater_container"),
  favoritesCount: document.getElementById("favorites_count"),
  readLaterCount: document.getElementById("readlater_count"),
  feedsRoot: document.getElementById("feeds_root"),
  feedsModal: document.getElementById("feeds_modal"),
  feedsList: document.getElementById("feeds_list"),
  feedsSave: document.getElementById("feeds_save"),
};

const STORAGE_KEYS = {
  favorites: "rss-feed:favorites:v1",
  readLater: "rss-feed:readlater:v1",
  prefs: "rss-feed:prefs:v1",
  selectedFeeds: "rss-feed:selected-feeds:v1",
};

const state = {
  sortOrder: "newest",
  itemsByFeed: new Map(),
  favorites: {},
  readLater: {},
  selectedFeedKeys: [],
  activeFeedConfigs: {},
};

window.onload = init;

function init() {
  loadStateFromStorage();

  buildActiveFeedConfigs();
  renderActiveFeedsSkeleton();

  if (ui.sortOrder) {
    ui.sortOrder.value = state.sortOrder;
    ui.sortOrder.addEventListener("change", (e) => {
      state.sortOrder = e.target.value === "oldest" ? "oldest" : "newest";
      savePrefs();
      renderAllFromCache();
      renderLists();
    });
  }

  if (ui.manageFeedsBtn && ui.feedsModal) {
    ui.manageFeedsBtn.addEventListener("click", () => {
      renderFeedSelectionList();
      ui.feedsModal.showModal();
    });
  }

  if (ui.feedsModal) {
    ui.feedsModal.addEventListener("click", (e) => {
      if (e.target === ui.feedsModal) ui.feedsModal.close();
    });
  }

  if (ui.feedsSave) {
    ui.feedsSave.addEventListener("click", () => {
      const next = getSelectedFeedKeysFromModal();
      state.selectedFeedKeys = next.length
        ? next
        : getDefaultSelectedFeedKeys();
      saveSelectedFeeds();

      // Reset feed cache for non-selected feeds
      const active = new Set(state.selectedFeedKeys);
      for (const key of Array.from(state.itemsByFeed.keys())) {
        if (!active.has(key)) state.itemsByFeed.delete(key);
      }

      buildActiveFeedConfigs();
      renderActiveFeedsSkeleton();
      renderLists();
      fetchAllFeeds();
      ui.feedsModal?.close();
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
  Object.values(state.activeFeedConfigs).forEach((cfg) => {
    if (cfg.container) cfg.container.innerHTML = `<h1>Lade Daten....</h1>`;
  });
}

function fetchAllFeeds() {
  setLoadingAll();
  Object.entries(state.activeFeedConfigs).forEach(([key, cfg]) =>
    fetchFeed(key, cfg),
  );
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
  Object.entries(state.activeFeedConfigs).forEach(([key, cfg]) => {
    const items = state.itemsByFeed.get(key);
    if (items) renderFeed(key, cfg, items);
  });
}

function buildActiveFeedConfigs() {
  const next = {};
  for (const key of state.selectedFeedKeys) {
    const meta = FEED_CATALOG[key];
    if (!meta) continue;
    next[key] = {
      key,
      label: meta.label,
      headerClass: meta.headerClass || "",
      url: buildRss2JsonUrl(meta.rssUrl),
      container: null,
      getImage: (item) => getImageForItem(meta.imageMode, item),
    };
  }
  state.activeFeedConfigs = next;
}

function renderActiveFeedsSkeleton() {
  if (!ui.feedsRoot) return;
  ui.feedsRoot.innerHTML = "";

  for (const [key, cfg] of Object.entries(state.activeFeedConfigs)) {
    const hrTop = document.createElement("hr");
    const heading = document.createElement("h2");
    heading.className = `feed-heading ${cfg.headerClass || ""}`.trim();
    heading.textContent = cfg.label;
    const hrBottom = document.createElement("hr");

    const grid = document.createElement("div");
    grid.className = "feed-grid";
    grid.dataset.feedKey = key;

    ui.feedsRoot.appendChild(hrTop);
    ui.feedsRoot.appendChild(heading);
    ui.feedsRoot.appendChild(hrBottom);
    ui.feedsRoot.appendChild(grid);

    cfg.container = grid;
  }
}

function renderFeedSelectionList() {
  if (!ui.feedsList) return;

  ui.feedsList.innerHTML = "";
  const selected = new Set(state.selectedFeedKeys);

  Object.entries(FEED_CATALOG).forEach(([key, meta]) => {
    const row = document.createElement("label");
    row.className = "feed-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = key;
    checkbox.checked = selected.has(key);

    const text = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = meta.label;
    const url = document.createElement("small");
    url.textContent = meta.rssUrl;

    text.appendChild(title);
    text.appendChild(url);

    row.appendChild(checkbox);
    row.appendChild(text);
    ui.feedsList.appendChild(row);
  });
}

function getSelectedFeedKeysFromModal() {
  if (!ui.feedsList) return [];
  return Array.from(ui.feedsList.querySelectorAll('input[type="checkbox"]'))
    .filter((el) => el.checked)
    .map((el) => el.value)
    .filter((key) => !!FEED_CATALOG[key]);
}

function buildRss2JsonUrl(rssUrl) {
  return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl,
  )}`;
}

function getImageForItem(mode, item) {
  if (mode === "enclosure") {
    return item?.enclosure?.link || "https://via.placeholder.com/150";
  }

  // Default: try to parse first <img> from content
  const content = item?.content || item?.description || "";
  if (content) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const imgTag = doc.querySelector("img");
      if (imgTag?.src) return imgTag.src;
    } catch {
      // ignore
    }
  }

  return "https://via.placeholder.com/150";
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
  dateTag.className = "card-date";
  dateTag.textContent = formatPubDate(summary.pubDate);

  const descrTag = document.createElement("p");
  descrTag.className = "card-desc";
  descrTag.textContent = summary.description || "";

  const itemLink = document.createElement("a");
  itemLink.href = summary.link;
  itemLink.textContent = "Read more";
  itemLink.target = "_blank";
  itemLink.rel = "noopener noreferrer";

  const content = document.createElement("div");
  content.className = "card-content";
  content.appendChild(itemTitle);
  content.appendChild(dateTag);
  content.appendChild(descrTag);

  const footer = document.createElement("div");
  footer.className = "card-footer";

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
    footer.appendChild(actions);
  }

  footer.appendChild(itemLink);

  itemDiv.appendChild(content);
  itemDiv.appendChild(footer);

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

  const selected = readJson(STORAGE_KEYS.selectedFeeds, []);
  state.selectedFeedKeys = Array.isArray(selected)
    ? selected.filter((k) => !!FEED_CATALOG[k])
    : [];
  if (state.selectedFeedKeys.length === 0) {
    state.selectedFeedKeys = getDefaultSelectedFeedKeys();
  }

  const prefs = readJson(STORAGE_KEYS.prefs, {});
  state.sortOrder = prefs.sortOrder === "oldest" ? "oldest" : "newest";
}

function getDefaultSelectedFeedKeys() {
  return ["heise", "tagesschau", "spiegel"];
}

function saveLists() {
  writeJson(STORAGE_KEYS.favorites, state.favorites);
  writeJson(STORAGE_KEYS.readLater, state.readLater);
}

function savePrefs() {
  writeJson(STORAGE_KEYS.prefs, { sortOrder: state.sortOrder });
}

function saveSelectedFeeds() {
  writeJson(STORAGE_KEYS.selectedFeeds, state.selectedFeedKeys);
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
