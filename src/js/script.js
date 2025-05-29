const feed_container = document.getElementById("feed_container");
const feed_container_spiegel = document.getElementById("feed_container_spiegel");
const btn_refresh = document.getElementById("btn_refresh");
const heise_url = 'https://api.rss2json.com/v1/api.json?rss_url=https://heise.de/rss/heise-atom.xml';
const spiegel_url = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.spiegel.de/schlagzeilen/tops/index.rss';
const tagesschau_url = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.tagesschau.de/xml/rss2';

window.onload = init();

function init() {
    feed_container.innerHTML = `<h1>Lade Daten....</h1>`;
    setTimeout(() => {
        fetchData(heise_url);
        fetchDataSpiegel(spiegel_url);
        fetchDataTagesschau(tagesschau_url)
    }, 1000);
}

// https://www.spiegel.de/schlagzeilen/tops/index.rss
btn_refresh.addEventListener("click", () => {
    feed_container.innerHTML = `<h1>Lade Daten....</h1>`;
    feed_container_spiegel.innerHTML = `<h1>Lade Daten....</h1>`;
    feed_container_tagesschau.innerHTML = `<h1>Lade Daten....</h1>`;
    setTimeout(() => {
        fetchData(heise_url);
        fetchDataSpiegel(spiegel_url);
        fetchDataTagesschau(tagesschau_url)
    }, 1000);
});

function fetchData(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            feed_container.innerHTML = ``;
            data.items.forEach((item) => {
                console.log(item.title, item.link);
                const contains_badWords = recognizeBadWords(item.title);
                if (!contains_badWords) {
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("grid-item");

                    // Isolieren des Bildes aus dem Content
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                        item.content,
                        "text/html"
                    );
                    const imgTag = doc.querySelector("img");
                    const imgSrc = imgTag
                        ? imgTag.src
                        : "https://via.placeholder.com/150"; // Fallback image

                    const DateTag = document.createElement("p");
                    const pubDate = new Date(item.pubDate);
                    const now = new Date();
                    const yesterday = new Date();
                    yesterday.setDate(now.getDate() - 1);

                    // Datumsteil (ohne Uhrzeit) vergleichen
                    const isToday = pubDate.toDateString() === now.toDateString();
                    const isYesterday = pubDate.toDateString() === yesterday.toDateString();

                    // Uhrzeit extrahieren
                    const timeString = pubDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    if (isToday) {
                        DateTag.textContent = `heute, ${timeString}`;
                    } else if (isYesterday) {
                        DateTag.textContent = `gestern, ${timeString}`;
                    } else {
                        DateTag.textContent = `${pubDate.toLocaleDateString()}, ${timeString}`;
                    }

                    const itemImage = document.createElement("img");
                    itemImage.src = imgSrc;
                    itemImage.alt = item.title;

                    const DescrTag = document.createElement("p");
                    DescrTag.textContent = item.description;

                    const itemTitle = document.createElement("h3");
                    itemTitle.textContent = item.title;

                    const itemLink = document.createElement("a");
                    itemLink.href = item.link;
                    itemLink.textContent = "Read more";
                    itemLink.target = "_blank";

                    itemDiv.appendChild(itemTitle);
                    itemDiv.appendChild(itemImage);
                    itemDiv.appendChild(DateTag);
                    itemDiv.appendChild(DescrTag);
                    itemDiv.appendChild(itemLink);

                    feed_container.appendChild(itemDiv);
                }
            });
        });
}

function fetchDataSpiegel(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Spiegel data:', data);
            
            feed_container_spiegel.innerHTML = ``;
            data.items.forEach((item) => {
                const title = item.title;
                const link = item.link;
                const pubDate = item.pubDate;
                const description = item.description;

                // Bild aus enclosure oder Fallback-Bild verwenden
                const imgSrc = item.enclosure && item.enclosure.link
                    ? item.enclosure.link
                    : "https://via.placeholder.com/150"; // Fallback-Bild

                const contains_badWords = recognizeBadWords(title);
                if (!contains_badWords) {
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("grid-item");

                    const itemImage = document.createElement("img");
                    itemImage.src = imgSrc;
                    itemImage.alt = title;

                    const itemTitle = document.createElement("h3");
                    itemTitle.textContent = title;

                    const DateTag = document.createElement("p");
                    const pubDateObj = new Date(pubDate);
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

                    const DescrTag = document.createElement("p");
                    DescrTag.textContent = description;

                    const itemLink = document.createElement("a");
                    itemLink.href = link;
                    itemLink.textContent = "Read more";
                    itemLink.target = "_blank";

                    itemDiv.appendChild(itemImage); // Bild hinzufügen
                    itemDiv.appendChild(itemTitle);
                    itemDiv.appendChild(DateTag);
                    itemDiv.appendChild(DescrTag);
                    itemDiv.appendChild(itemLink);

                    feed_container_spiegel.appendChild(itemDiv);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching Spiegel data:", error);
            feed_container_spiegel.innerHTML = `<h1>Fehler beim Laden der Daten</h1>`;
        });
}


function fetchDataTagesschau(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log('Tagesschau data:', data);
            feed_container_tagesschau.innerHTML = ``;
            data.items.forEach((item) => {
                const title = item.title;
                const link = item.link;
                const pubDate = item.pubDate;
                const description = item.description;

                // Bild aus content extrahieren (Fallback falls kein Bild gefunden)
                let imgSrc = "https://via.placeholder.com/150";
                if (item.content) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(item.content, "text/html");
                    const imgTag = doc.querySelector("img");
                    if (imgTag && imgTag.src) {
                        imgSrc = imgTag.src;
                    }
                }

                const itemDiv = document.createElement("div");
                itemDiv.classList.add("grid-item");

                const itemImage = document.createElement("img");
                itemImage.src = imgSrc;
                itemImage.alt = title;

                const itemTitle = document.createElement("h3");
                itemTitle.textContent = title;

                const DateTag = document.createElement("p");
                const pubDateObj = new Date(pubDate);
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

                const DescrTag = document.createElement("p");
                DescrTag.textContent = description;

                const itemLink = document.createElement("a");
                itemLink.href = link;
                itemLink.textContent = "Read more";
                itemLink.target = "_blank";

                itemDiv.appendChild(itemImage);
                itemDiv.appendChild(itemTitle);
                itemDiv.appendChild(DateTag);
                itemDiv.appendChild(DescrTag);
                itemDiv.appendChild(itemLink);

                feed_container_tagesschau.appendChild(itemDiv);
            });
        })
        .catch((error) => {
            console.error("Error fetching Tagesschau data:", error);
            feed_container_tagesschau.innerHTML = `<h1>Fehler beim Laden der Daten</h1>`;
        });
}

function recognizeBadWords(text) {
    const badWords = ["heise+", "heise-Angebot"];
    if (badWords.some((word) => text.includes(word))) {
        return true;
    }
    return false;
}
