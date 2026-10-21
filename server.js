const { createReadStream } = require("node:fs");
const { stat } = require("node:fs/promises");
const { lookup } = require("node:dns/promises");
const { createServer } = require("node:http");
const { BlockList, isIP } = require("node:net");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const MAX_FEED_SIZE = 5 * 1024 * 1024;
const MAX_HTML_SIZE = 1024 * 1024;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 15000;

const blockedAddresses = {
  ipv4: new BlockList(),
  ipv6: new BlockList(),
};
[
  ["0.0.0.0", 8, "ipv4"],
  ["10.0.0.0", 8, "ipv4"],
  ["100.64.0.0", 10, "ipv4"],
  ["127.0.0.0", 8, "ipv4"],
  ["169.254.0.0", 16, "ipv4"],
  ["172.16.0.0", 12, "ipv4"],
  ["192.0.0.0", 24, "ipv4"],
  ["192.0.2.0", 24, "ipv4"],
  ["192.168.0.0", 16, "ipv4"],
  ["198.18.0.0", 15, "ipv4"],
  ["198.51.100.0", 24, "ipv4"],
  ["203.0.113.0", 24, "ipv4"],
  ["224.0.0.0", 4, "ipv4"],
  ["240.0.0.0", 4, "ipv4"],
  ["::", 128, "ipv6"],
  ["::1", 128, "ipv6"],
  ["::ffff:0:0", 96, "ipv6"],
  ["2001:db8::", 32, "ipv6"],
  ["fc00::", 7, "ipv6"],
  ["fe80::", 10, "ipv6"],
  ["ff00::", 8, "ipv6"],
].forEach(([address, prefix, family]) => {
  blockedAddresses[family].addSubnet(address, prefix, family);
});

function isPublicAddress(address, family) {
  if (family === 6 && !/^[23]/.test(address)) return false;
  const addressFamily = family === 4 ? "ipv4" : "ipv6";
  return !blockedAddresses[addressFamily].check(address, addressFamily);
}

async function assertPublicUrl(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Nur HTTP- und HTTPS-Feeds werden unterstützt.");
  }
  if (url.username || url.password) {
    throw new Error("Feed-URLs mit Zugangsdaten werden nicht unterstützt.");
  }
  if (url.port && !["80", "443"].includes(url.port)) {
    throw new Error("Feed-URLs mit benutzerdefinierten Ports werden nicht unterstützt.");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [{ address: hostname, family: isIP(hostname) }]
    : await lookup(hostname, { all: true, verbatim: true });

  if (
    addresses.length === 0 ||
    addresses.some(({ address, family }) => !isPublicAddress(address, family))
  ) {
    throw new Error("Der Feed muss auf eine öffentliche IP-Adresse verweisen.");
  }

  return url;
}

async function readFeed(url) {
  return readRemoteText(url, {
    accept: "application/atom+xml, application/rss+xml, application/xml, text/xml, */*",
    maxSize: MAX_FEED_SIZE,
    sourceLabel: "RSS-Server",
    sizeErrorMessage: "Der Feed ist größer als 5 MB.",
  });
}

async function readRemoteText(
  url,
  { accept, maxSize, sourceLabel, sizeErrorMessage },
) {
  let target = url;

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    target = await assertPublicUrl(target);
    const response = await fetch(target, {
      redirect: "manual",
      headers: {
        accept,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Der Feed leitete ohne Zieladresse weiter.");
      target = new URL(location, target).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error(`${sourceLabel} antwortete mit HTTP ${response.status}.`);
    }
    if (!response.body) {
      throw new Error(`${sourceLabel} hat keine Daten geliefert.`);
    }

    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxSize) {
        await reader.cancel();
        throw new Error(sizeErrorMessage);
      }
      chunks.push(Buffer.from(value));
    }

    return Buffer.concat(chunks).toString("utf8");
  }

  throw new Error(`${sourceLabel} hat zu viele Weiterleitungen ausgeführt.`);
}

function extractFirstMetaImage(html, pageUrl) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const value = match?.[1]?.trim();
    if (!value) continue;
    try {
      const full = new URL(value, pageUrl).toString();
      if (/^https?:\/\//i.test(full)) return full;
    } catch {
      continue;
    }
  }
  return "";
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

async function serveStaticFile(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400).end("Ungültiger Pfad.");
    return;
  }

  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.resolve(ROOT, `.${requestedPath}`);
  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
    response.writeHead(403).end("Zugriff verweigert.");
    return;
  }

  let fileInfo;
  try {
    fileInfo = await stat(filePath);
  } catch {
    response.writeHead(404).end("Datei nicht gefunden.");
    return;
  }
  if (!fileInfo.isFile()) {
    response.writeHead(404).end("Datei nicht gefunden.");
    return;
  }

  const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
  };
  response.writeHead(200, {
    "Content-Length": fileInfo.size,
    "Content-Type":
      contentTypes[path.extname(filePath)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const allowedOrigins = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
  ];
  const origin = request.headers.origin;

  if (origin && !allowedOrigins.includes(origin)) {
    sendJson(response, 403, { message: "Anfrage von dieser Herkunft abgelehnt." });
    return;
  }

  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" }).end("Methode nicht unterstützt.");
    return;
  }

  if (requestUrl.pathname === "/api/rss") {
    const feedUrl = requestUrl.searchParams.get("url");
    if (!feedUrl || feedUrl.length > 2048) {
      sendJson(response, 400, { message: "Eine gültige Feed-URL ist erforderlich." });
      return;
    }

    if (requestUrl.pathname === "/api/page-meta") {
      const pageUrl = requestUrl.searchParams.get("url");
      if (!pageUrl || pageUrl.length > 2048) {
        sendJson(response, 400, { message: "Eine gültige Seiten-URL ist erforderlich." });
        return;
      }

      try {
        const html = await readRemoteText(pageUrl, {
          accept: "text/html,application/xhtml+xml,*/*",
          maxSize: MAX_HTML_SIZE,
          sourceLabel: "Artikel-Seite",
          sizeErrorMessage: "Die Artikelseite ist größer als 1 MB.",
        });
        const image = extractFirstMetaImage(html, pageUrl);
        sendJson(response, 200, { image });
      } catch (error) {
        sendJson(response, 502, {
          message:
            error instanceof Error
              ? error.message
              : "Artikelseite konnte nicht geladen werden.",
        });
      }
      return;
    }

    try {
      const xml = await readFeed(feedUrl);
      response.writeHead(200, {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(xml);
    } catch (error) {
      sendJson(response, 502, {
        message: error instanceof Error ? error.message : "Feed konnte nicht geladen werden.",
      });
    }
    return;
  }

  if (requestUrl.pathname.startsWith("/api/")) {
    response.writeHead(404).end("API-Endpunkt nicht gefunden.");
    return;
  }

  await serveStaticFile(request, response, requestUrl.pathname);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`RSS-Feed läuft unter http://127.0.0.1:${PORT}`);
});
