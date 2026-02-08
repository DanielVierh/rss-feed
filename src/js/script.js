const FEED_CATALOG = {
  // Nachrichten (DE)
  heise: {
    category: "Nachrichten (DE)",
    label: "Heise",
    rssUrl: "https://heise.de/rss/heise-atom.xml",
    headerClass: "",
    imageMode: "content_img",
  },
  tagesschau: {
    category: "Nachrichten (DE)",
    label: "Tagesschau",
    rssUrl: "https://www.tagesschau.de/xml/rss2",
    headerClass: "tagesschau",
    imageMode: "content_img",
  },
  spiegel: {
    category: "Nachrichten (DE)",
    label: "Spiegel News",
    rssUrl: "https://www.spiegel.de/schlagzeilen/tops/index.rss",
    headerClass: "spiegel",
    imageMode: "enclosure",
  },
  zeit: {
    category: "Nachrichten (DE)",
    label: "DIE ZEIT",
    rssUrl: "https://newsfeed.zeit.de/index",
    headerClass: "",
    imageMode: "content_img",
  },
  faz: {
    category: "Nachrichten (DE)",
    label: "FAZ",
    rssUrl: "https://www.faz.net/rss/aktuell/",
    headerClass: "",
    imageMode: "content_img",
  },
  sueddeutsche: {
    category: "Nachrichten (DE)",
    label: "Süddeutsche Zeitung",
    rssUrl: "https://rss.sueddeutsche.de/rss/Topthemen",
    headerClass: "",
    imageMode: "content_img",
  },

  // Technik & Gadgets
  golem: {
    category: "Technik & Gadgets",
    label: "Golem.de",
    rssUrl: "https://rss.golem.de/rss.php?feed=RSS2.0",
    headerClass: "",
    imageMode: "content_img",
  },
  theverge: {
    category: "Technik & Gadgets",
    label: "The Verge",
    rssUrl: "https://www.theverge.com/rss/index.xml",
    headerClass: "",
    imageMode: "content_img",
  },
  wired: {
    category: "Technik & Gadgets",
    label: "WIRED",
    rssUrl: "https://www.wired.com/feed/rss",
    headerClass: "",
    imageMode: "content_img",
  },
  arstechnica: {
    category: "Technik & Gadgets",
    label: "Ars Technica",
    rssUrl: "https://feeds.arstechnica.com/arstechnica/index",
    headerClass: "",
    imageMode: "content_img",
  },
  engadget: {
    category: "Technik & Gadgets",
    label: "Engadget",
    rssUrl: "https://www.engadget.com/rss.xml",
    headerClass: "",
    imageMode: "content_img",
  },
  techcrunch: {
    category: "Technik & Gadgets",
    label: "TechCrunch",
    rssUrl: "https://techcrunch.com/feed/",
    headerClass: "",
    imageMode: "content_img",
  },

  // Programmieren
  hackernews: {
    category: "Programmieren",
    label: "Hacker News",
    rssUrl: "https://news.ycombinator.com/rss",
    headerClass: "",
    imageMode: "content_img",
  },
  lobsters: {
    category: "Programmieren",
    label: "Lobsters",
    rssUrl: "https://lobste.rs/rss",
    headerClass: "",
    imageMode: "content_img",
  },
  devto: {
    category: "Programmieren",
    label: "DEV Community",
    rssUrl: "https://dev.to/feed",
    headerClass: "",
    imageMode: "content_img",
  },
  githubblog: {
    category: "Programmieren",
    label: "GitHub Blog",
    rssUrl: "https://github.blog/feed/",
    headerClass: "",
    imageMode: "content_img",
  },
  stackoverflowblog: {
    category: "Programmieren",
    label: "Stack Overflow Blog",
    rssUrl: "https://stackoverflow.blog/feed/",
    headerClass: "",
    imageMode: "content_img",
  },
  smashing: {
    category: "Programmieren",
    label: "Smashing Magazine",
    rssUrl: "https://www.smashingmagazine.com/feed/",
    headerClass: "",
    imageMode: "content_img",
  },
  csstricks: {
    category: "Programmieren",
    label: "CSS-Tricks",
    rssUrl: "https://css-tricks.com/feed/",
    headerClass: "",
    imageMode: "content_img",
  },

  // Python
  planetpython: {
    category: "Python",
    label: "Planet Python",
    rssUrl: "https://planetpython.org/rss20.xml",
    headerClass: "",
    imageMode: "content_img",
  },
  pythoninsider: {
    category: "Python",
    label: "Python Insider",
    rssUrl: "https://feeds.feedburner.com/PythonInsider",
    headerClass: "",
    imageMode: "content_img",
  },

  // Fotografie
  petapixel: {
    category: "Fotografie",
    label: "PetaPixel",
    rssUrl: "https://petapixel.com/feed/",
    headerClass: "",
    imageMode: "content_img",
  },
  fstoppers: {
    category: "Fotografie",
    label: "Fstoppers",
    rssUrl: "https://fstoppers.com/feed",
    headerClass: "",
    imageMode: "content_img",
  },
  dps: {
    category: "Fotografie",
    label: "Digital Photography School",
    rssUrl: "https://digital-photography-school.com/feed/",
    headerClass: "",
    imageMode: "content_img",
  },
  phoblographer: {
    category: "Fotografie",
    label: "The Phoblographer",
    rssUrl: "https://www.thephoblographer.com/feed/",
    headerClass: "",
    imageMode: "content_img",
  },
};

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/600x360?text=No+Image";
const DEFAULT_PREVIEW_TEXT = "Keine Vorschau verfügbar.";

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
  customFeedLabel: document.getElementById("custom_feed_label"),
  customFeedUrl: document.getElementById("custom_feed_url"),
  addCustomFeedBtn: document.getElementById("btn_add_custom_feed"),
  customFeedError: document.getElementById("custom_feed_error"),
  scrollTopBtn: document.getElementById("scroll_top"),
};

const STORAGE_KEYS = {
  favorites: "rss-feed:favorites:v1",
  readLater: "rss-feed:readlater:v1",
  prefs: "rss-feed:prefs:v1",
  selectedFeeds: "rss-feed:selected-feeds:v1",
  customFeeds: "rss-feed:custom-feeds:v1",
};

const state = {
  sortOrder: "newest",
  itemsByFeed: new Map(),
  favorites: {},
  readLater: {},
  selectedFeedKeys: [],
  activeFeedConfigs: {},
  customFeeds: {},
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

  if (ui.addCustomFeedBtn) {
    ui.addCustomFeedBtn.addEventListener("click", () => {
      addCustomFeedFromModal();
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

  initScrollTopButton();

  setLoadingAll();
  renderLists();
  setTimeout(() => fetchAllFeeds(), 300);
}

function initScrollTopButton() {
  if (!ui.scrollTopBtn) return;

  const updateVisibility = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    ui.scrollTopBtn.classList.toggle("is-visible", y > 400);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  ui.scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setLoadingAll() {
  Object.values(state.activeFeedConfigs).forEach((cfg) => {
    if (cfg.container)
      cfg.container.innerHTML = `<p class="feed-loading">Lade Daten…</p>`;
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
    const meta = getFeedMeta(key);
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
    const panel = document.createElement("details");
    panel.className = "collapsible";
    panel.dataset.feedKey = key;

    const summary = document.createElement("summary");
    const left = document.createElement("span");
    left.className = "feed-summary-left";

    const label = document.createElement("span");
    label.textContent = cfg.label;

    const count = document.createElement("span");
    count.className = "panel-count";
    count.id = `feed_count_${key}`;
    count.textContent = "(0)";

    left.appendChild(label);
    left.appendChild(count);
    summary.appendChild(left);

    const body = document.createElement("div");
    body.className = "panel-body";

    const grid = document.createElement("div");
    grid.className = "feed-grid";
    grid.dataset.feedKey = key;

    body.appendChild(grid);
    panel.appendChild(summary);
    panel.appendChild(body);

    ui.feedsRoot.appendChild(panel);

    cfg.container = grid;
  }
}

function setFeedCount(feedKey, count) {
  const el = document.getElementById(`feed_count_${feedKey}`);
  if (!el) return;
  el.textContent = `(${count})`;
}

function renderFeedSelectionList() {
  if (!ui.feedsList) return;

  ui.feedsList.innerHTML = "";
  const selected = new Set(state.selectedFeedKeys);

  const entries = getAllCatalogEntries();
  const order = [
    "Nachrichten (DE)",
    "Technik & Gadgets",
    "Programmieren",
    "Python",
    "Fotografie",
    "Eigene Feeds",
    "Sonstiges",
  ];

  const byCategory = new Map();
  entries.forEach(({ key, meta }) => {
    const category = meta.category || "Sonstiges";
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push({ key, meta });
  });

  const categories = Array.from(byCategory.keys()).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  categories.forEach((category) => {
    const title = document.createElement("div");
    title.className = "feeds-category-title";
    title.textContent = category;
    ui.feedsList.appendChild(title);

    byCategory
      .get(category)
      .slice()
      .sort((a, b) => a.meta.label.localeCompare(b.meta.label))
      .forEach(({ key, meta }) => {
        const row = document.createElement("label");
        row.className = "feed-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = key;
        checkbox.checked = selected.has(key);

        const text = document.createElement("div");
        const label = document.createElement("strong");
        label.textContent = meta.label;
        const url = document.createElement("small");
        url.textContent = meta.rssUrl;

        text.appendChild(label);
        text.appendChild(url);

        row.appendChild(checkbox);
        row.appendChild(text);
        ui.feedsList.appendChild(row);
      });
  });
}

function getSelectedFeedKeysFromModal() {
  if (!ui.feedsList) return [];
  return Array.from(ui.feedsList.querySelectorAll('input[type="checkbox"]'))
    .filter((el) => el.checked)
    .map((el) => el.value)
    .filter((key) => !!getFeedMeta(key));
}

function getFeedMeta(key) {
  return FEED_CATALOG[key] || state.customFeeds[key];
}

function getAllCatalogEntries() {
  const builtIn = Object.entries(FEED_CATALOG).map(([key, meta]) => ({
    key,
    meta,
  }));
  const custom = Object.entries(state.customFeeds).map(([key, meta]) => ({
    key,
    meta,
  }));
  return [...builtIn, ...custom];
}

function addCustomFeedFromModal() {
  clearCustomFeedError();

  const label = (ui.customFeedLabel?.value || "").trim();
  const rssUrl = (ui.customFeedUrl?.value || "").trim();

  if (!label) {
    setCustomFeedError("Bitte einen Namen eingeben.");
    return;
  }
  if (!rssUrl) {
    setCustomFeedError("Bitte eine RSS-URL eingeben.");
    return;
  }
  if (!/^https?:\/\//i.test(rssUrl)) {
    setCustomFeedError("Die RSS-URL muss mit http:// oder https:// beginnen.");
    return;
  }

  const key = `custom_${Date.now()}`;
  state.customFeeds[key] = {
    category: "Eigene Feeds",
    label,
    rssUrl,
    headerClass: "",
    imageMode: "content_img",
  };

  saveCustomFeeds();

  // Im Modal direkt vorauswählen (Persistenz der Auswahl erst bei "Speichern")
  if (!state.selectedFeedKeys.includes(key)) state.selectedFeedKeys.push(key);

  if (ui.customFeedLabel) ui.customFeedLabel.value = "";
  if (ui.customFeedUrl) ui.customFeedUrl.value = "";

  renderFeedSelectionList();
}

function setCustomFeedError(message) {
  if (ui.customFeedError) ui.customFeedError.textContent = message;
}

function clearCustomFeedError() {
  if (ui.customFeedError) ui.customFeedError.textContent = "";
}

function buildRss2JsonUrl(rssUrl) {
  return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl,
  )}`;
}

function getImageForItem(mode, item) {
  const baseUrl = item?.link || "";

  // rss2json often provides a direct thumbnail
  const thumb = normalizeImageUrl(item?.thumbnail, baseUrl);
  if (thumb) return thumb;

  // media via enclosure
  const enclosure = normalizeImageUrl(
    item?.enclosure?.link || item?.enclosure?.url,
    baseUrl,
  );
  if (mode === "enclosure" && enclosure) return enclosure;
  if (enclosure) return enclosure;

  // Try to parse <img> from content/description (including data-src/srcset)
  const htmlCandidates = [item?.content, item?.description].filter(Boolean);
  for (const html of htmlCandidates) {
    const extracted = extractImageFromHtml(String(html), baseUrl);
    if (extracted) return extracted;
  }

  return "";
}

function extractImageFromHtml(html, baseUrl) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const img = doc.querySelector("img");
    if (!img) return "";

    const direct =
      img.getAttribute("src") ||
      img.getAttribute("data-src") ||
      img.getAttribute("data-original") ||
      img.getAttribute("data-lazy-src") ||
      "";
    const normalizedDirect = normalizeImageUrl(direct, baseUrl);
    if (normalizedDirect) return normalizedDirect;

    const srcset =
      img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
    const fromSrcset = parseFirstSrcsetUrl(srcset);
    return normalizeImageUrl(fromSrcset, baseUrl);
  } catch {
    return "";
  }
}

function parseFirstSrcsetUrl(srcset) {
  if (!srcset) return "";
  const first = srcset.split(",")[0]?.trim();
  if (!first) return "";
  return first.split(/\s+/)[0] || "";
}

function normalizeImageUrl(url, baseUrl) {
  if (!url) return "";
  let s = String(url).trim();
  if (!s) return "";

  if (s.startsWith("data:")) return "";
  if (s.startsWith("//")) s = `https:${s}`;

  try {
    if (baseUrl) return new URL(s, baseUrl).toString();
    return /^https?:\/\//i.test(s) ? s : "";
  } catch {
    return /^https?:\/\//i.test(s) ? s : "";
  }
}

function renderFeed(feedKey, cfg, items) {
  if (!cfg.container) return;

  const filtered = items
    .filter((item) => !recognizeBadWords(item.title))
    .slice();

  filtered.sort((a, b) => sortByDate(a.pubDate, b.pubDate, state.sortOrder));

  cfg.container.innerHTML = ``;

  setFeedCount(feedKey, filtered.length);

  if (filtered.length === 0) {
    cfg.container.innerHTML = `<p class="feed-empty">Keine Beiträge gefunden.</p>`;
    return;
  }

  filtered.forEach((item) => {
    const summary = normalizeItem(feedKey, item, cfg);
    const card = createItemCard(summary, { showActions: true });
    cfg.container.appendChild(card);
  });
}

function createItemCard(summary, { showActions }) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("grid-item");

  const placeholder =
    summary.placeholderImage ||
    buildPlaceholderImageDataUrl(
      summary.feedKey || "Feed",
      summary.title || "",
    );

  if (!summary.image) summary.image = placeholder;

  if (summary.image) {
    const itemImage = document.createElement("img");
    itemImage.src = summary.image;
    itemImage.alt = summary.title || "Artikelbild";
    itemImage.loading = "lazy";
    itemImage.onerror = () => {
      itemImage.onerror = null;
      itemImage.src = placeholder || DEFAULT_IMAGE_URL;
    };
    itemDiv.appendChild(itemImage);
  }

  const itemTitle = document.createElement("h3");
  itemTitle.textContent = summary.title || "(ohne Titel)";

  const dateTag = document.createElement("p");
  dateTag.className = "card-date";
  dateTag.textContent = formatPubDate(summary.pubDate);

  const descrTag = document.createElement("p");
  descrTag.className = "card-desc";
  descrTag.textContent = summary.description || DEFAULT_PREVIEW_TEXT;

  const normalizedLink = normalizeArticleUrl(summary.link);
  const itemLink = normalizedLink ? document.createElement("a") : null;
  if (itemLink) {
    itemLink.href = normalizedLink;
    itemLink.textContent = "Mehr lesen ➡️";
    itemLink.target = "_blank";
    itemLink.rel = "noopener noreferrer";
  }

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
    favBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      preserveViewportPosition(itemDiv, () => {
        toggleFavorite(summary);
        updateFavoriteButtonUi(favBtn, summary.id);
        renderLists();
      });
    });

    const laterBtn = document.createElement("button");
    laterBtn.type = "button";
    laterBtn.className =
      "btn-action" + (isReadLater(summary.id) ? " is-active" : "");
    laterBtn.textContent = isReadLater(summary.id)
      ? "📌 Gespeichert"
      : "📌 Später lesen";
    laterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      preserveViewportPosition(itemDiv, () => {
        toggleReadLater(summary);
        updateReadLaterButtonUi(laterBtn, summary.id);
        renderLists();
      });
    });

    actions.appendChild(favBtn);
    actions.appendChild(laterBtn);
    footer.appendChild(actions);
  }

  if (itemLink) footer.appendChild(itemLink);

  itemDiv.appendChild(content);
  itemDiv.appendChild(footer);

  return itemDiv;
}

function preserveViewportPosition(anchorEl, updateFn) {
  if (!anchorEl || typeof updateFn !== "function") {
    if (typeof updateFn === "function") updateFn();
    return;
  }

  const before = anchorEl.getBoundingClientRect().top;
  updateFn();

  // If DOM above the current viewport changes height, the browser keeps scrollTop
  // which can visually "jump" the content. Compensate by scrolling the delta.
  const after = anchorEl.getBoundingClientRect().top;
  const delta = after - before;
  if (delta) window.scrollBy(0, delta);
}

function normalizeArticleUrl(url) {
  if (!url) return "";
  let s = String(url).trim();
  if (!s || s === "#") return "";
  if (s.startsWith("//")) s = `https:${s}`;

  // Only allow http(s) links here to avoid scroll-to-top / hash navigation issues.
  if (!/^https?:\/\//i.test(s)) return "";
  try {
    return new URL(s).toString();
  } catch {
    return "";
  }
}

function updateFavoriteButtonUi(buttonEl, id) {
  if (!buttonEl) return;
  const active = isFavorite(id);
  buttonEl.classList.toggle("is-active", active);
  buttonEl.textContent = active ? "⭐ Favorit" : "☆ Favorit";
}

function updateReadLaterButtonUi(buttonEl, id) {
  if (!buttonEl) return;
  const active = isReadLater(id);
  buttonEl.classList.toggle("is-active", active);
  buttonEl.textContent = active ? "📌 Gespeichert" : "📌 Später lesen";
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

  const placeholderImage = buildPlaceholderImageDataUrl(
    cfg?.label || feedKey,
    item?.title || "",
  );

  const img = safeGetImage(cfg, item);
  const previewText = buildPreviewText(item);

  return {
    id,
    feedKey,
    title: item.title || "",
    link: item.link || "",
    pubDate: item.pubDate || "",
    description: previewText,
    image: img || placeholderImage,
    placeholderImage,
  };
}

function buildPreviewText(item) {
  const raw = (item?.description || item?.content || "").trim();
  const text = extractTextFromHtml(raw);
  const normalized = normalizeWhitespace(text);
  const finalText = normalized || DEFAULT_PREVIEW_TEXT;
  return truncateText(finalText, 240);
}

function extractTextFromHtml(htmlOrText) {
  if (!htmlOrText) return "";
  const s = String(htmlOrText);
  if (!/[<>]/.test(s)) return s;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(s, "text/html");
    return doc.body?.textContent || "";
  } catch {
    return s.replace(/<[^>]*>/g, " ");
  }
}

function normalizeWhitespace(text) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text, maxLen) {
  const s = String(text || "");
  if (s.length <= maxLen) return s;
  return s.slice(0, Math.max(0, maxLen - 1)).trimEnd() + "…";
}

function buildPlaceholderImageDataUrl(feedLabel, title) {
  const safeLabel = normalizeWhitespace(feedLabel).slice(0, 26) || "Feed";
  const safeTitle = normalizeWhitespace(title).slice(0, 52);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1f1f1f"/>
      <stop offset="1" stop-color="#0f0f0f"/>
    </linearGradient>
  </defs>
  <rect width="600" height="360" fill="url(#g)"/>
  <rect x="24" y="24" width="552" height="312" rx="18" fill="#151515" stroke="#2a2a2a"/>
  <text x="48" y="110" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="30" fill="#ffffff" font-weight="700">${escapeXml(
    safeLabel,
  )}</text>
  <text x="48" y="150" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="16" fill="#cfcfcf">${escapeXml(
    safeTitle,
  )}</text>
  <text x="48" y="300" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="14" fill="#7c7c7c">Kein Bild im Feed</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

  state.customFeeds = readJson(STORAGE_KEYS.customFeeds, {});
  if (!state.customFeeds || typeof state.customFeeds !== "object") {
    state.customFeeds = {};
  }

  const selected = readJson(STORAGE_KEYS.selectedFeeds, []);
  state.selectedFeedKeys = Array.isArray(selected)
    ? selected.filter((k) => !!getFeedMeta(k))
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

function saveCustomFeeds() {
  writeJson(STORAGE_KEYS.customFeeds, state.customFeeds);
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
