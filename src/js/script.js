const feed_configs = {
    heise: {
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://heise.de/rss/heise-atom.xml',
        container: document.getElementById("feed_container"),
        getImage: item => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(item.content, "text/html");
            const imgTag = doc.querySelector("img");
            return imgTag ? imgTag.src : "https://via.placeholder.com/150";
        }
    },
    spiegel: {
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.spiegel.de/schlagzeilen/tops/index.rss',
        container: document.getElementById("feed_container_spiegel"),
        getImage: item => (item.enclosure && item.enclosure.link) ? item.enclosure.link : "https://via.placeholder.com/150"
    },
    tagesschau: {
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.tagesschau.de/xml/rss2',
        container: document.getElementById("feed_container_tagesschau"),
        getImage: item => {
            if (item.content) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(item.content, "text/html");
                const imgTag = doc.querySelector("img");
                if (imgTag && imgTag.src) return imgTag.src;
            }
            return "https://via.placeholder.com/150";
        }
    }
};

window.onload = init;

function init() {
    Object.values(feed_configs).forEach(cfg => {
        cfg.container.innerHTML = `<h1>Lade Daten....</h1>`;
    });
    setTimeout(() => {
        Object.entries(feed_configs).forEach(([key, cfg]) => fetchFeed(cfg));
    }, 1000);
}

btn_refresh.addEventListener("click", () => {
    Object.values(feed_configs).forEach(cfg => {
        cfg.container.innerHTML = `<h1>Lade Daten....</h1>`;
    });
    setTimeout(() => {
        Object.entries(feed_configs).forEach(([key, cfg]) => fetchFeed(cfg));
    }, 1000);
});

function fetchFeed(cfg) {
    fetch(cfg.url)
        .then(res => res.json())
        .then(data => {
            cfg.container.innerHTML = ``;
            data.items.forEach(item => {
                if (recognizeBadWords(item.title)) return;

                const itemDiv = document.createElement("div");
                itemDiv.classList.add("grid-item");

                // Bild
                const itemImage = document.createElement("img");
                itemImage.src = cfg.getImage(item);
                itemImage.alt = item.title;

                // Titel
                const itemTitle = document.createElement("h3");
                itemTitle.textContent = item.title;

                // Datum
                const DateTag = document.createElement("p");
                const pubDateObj = new Date(item.pubDate);
                const now = new Date();
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                const isToday = pubDateObj.toDateString() === now.toDateString();
                const isYesterday = pubDateObj.toDateString() === yesterday.toDateString();
                const timeString = pubDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                if (isToday) {
                    DateTag.textContent = `heute, ${timeString}`;
                } else if (isYesterday) {
                    DateTag.textContent = `gestern, ${timeString}`;
                } else {
                    DateTag.textContent = `${pubDateObj.toLocaleDateString()}, ${timeString}`;
                }

                // Beschreibung
                const DescrTag = document.createElement("p");
                DescrTag.textContent = item.description;

                // Link
                const itemLink = document.createElement("a");
                itemLink.href = item.link;
                itemLink.textContent = "Read more";
                itemLink.target = "_blank";

                itemDiv.appendChild(itemImage);
                itemDiv.appendChild(itemTitle);
                itemDiv.appendChild(DateTag);
                itemDiv.appendChild(DescrTag);
                itemDiv.appendChild(itemLink);

                cfg.container.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error(`Error fetching data:`, error);
            cfg.container.innerHTML = `<h1>Fehler beim Laden der Daten</h1>`;
        });
}

function recognizeBadWords(text) {
    const badWords = ["heise+", "heise-Angebot"];
    return badWords.some(word => text.includes(word));
}