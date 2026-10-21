const MAX_FEED_SIZE = 5 * 1024 * 1024;
const MAX_HTML_SIZE = 1024 * 1024;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 15000;

const BLOCKED_IPV4 = [
  [/^0\./, "unspecified"],
  [/^10\./, "private"],
  [/^127\./, "loopback"],
  [/^169\.254\./, "linklocal"],
  [/^172\.(1[6-9]|2\d|3[0-1])\./, "private"],
  [/^192\.168\./, "private"],
];

const META_IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/i,
  /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/i,
  /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i,
];

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    if (!target) {
      return json({ message: "Query parameter 'url' fehlt." }, 400);
    }

    try {
      if (url.pathname === "/rss") {
        const xml = await fetchText(target, {
          accept:
            "application/atom+xml, application/rss+xml, application/xml, text/xml, */*",
          maxSize: MAX_FEED_SIZE,
          sourceLabel: "RSS-Server",
        });
        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=120",
          },
        });
      }

      if (url.pathname === "/page-meta") {
        const html = await fetchText(target, {
          accept: "text/html,application/xhtml+xml,*/*",
          maxSize: MAX_HTML_SIZE,
          sourceLabel: "Artikel-Seite",
        });
        const image = extractFirstMetaImage(html, target);
        return json({ image }, 200);
      }

      return json({ message: "Unbekannter Endpunkt." }, 404);
    } catch (error) {
      return json(
        { message: error instanceof Error ? error.message : "Unbekannter Fehler." },
        502,
      );
    }
  },
};

async function fetchText(target, { accept, maxSize, sourceLabel }) {
  let current = target;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const validated = await validateTarget(current);
    const res = await fetch(validated, {
      redirect: "manual",
      headers: { accept },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) {
        throw new Error(`${sourceLabel} leitete ohne Zieladresse weiter.`);
      }
      current = new URL(location, validated).toString();
      continue;
    }

    if (!res.ok) {
      throw new Error(`${sourceLabel} antwortete mit HTTP ${res.status}.`);
    }

    const body = await res.arrayBuffer();
    if (body.byteLength > maxSize) {
      throw new Error(`${sourceLabel} ist zu groß.`);
    }

    return new TextDecoder("utf-8").decode(body);
  }

  throw new Error(`${sourceLabel} hat zu viele Weiterleitungen ausgeführt.`);
}

async function validateTarget(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Nur HTTP/HTTPS wird unterstützt.");
  }
  if (url.username || url.password) {
    throw new Error("URLs mit Zugangsdaten sind nicht erlaubt.");
  }

  const dns = await resolveDNS(url.hostname);
  if (!dns || dns.length === 0) {
    throw new Error("Hostname konnte nicht aufgelöst werden.");
  }

  for (const addr of dns) {
    if (!isPublicAddress(addr)) {
      throw new Error("Nur öffentliche Zieladressen sind erlaubt.");
    }
  }
  return url.toString();
}

function isPublicAddress(addr) {
  if (addr.includes(":")) {
    const lowered = addr.toLowerCase();
    if (
      lowered === "::1" ||
      lowered.startsWith("fc") ||
      lowered.startsWith("fd") ||
      lowered.startsWith("fe80") ||
      lowered.startsWith("ff")
    ) {
      return false;
    }
    return true;
  }
  for (const [pattern] of BLOCKED_IPV4) {
    if (pattern.test(addr)) return false;
  }
  return true;
}

async function resolveDNS(hostname) {
  try {
    const a = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
        hostname,
      )}&type=A`,
      { headers: { accept: "application/dns-json" } },
    ).then((r) => r.json());
    const aaaa = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
        hostname,
      )}&type=AAAA`,
      { headers: { accept: "application/dns-json" } },
    ).then((r) => r.json());

    const ips = [];
    for (const answer of [...(a.Answer || []), ...(aaaa.Answer || [])]) {
      if (typeof answer?.data === "string") ips.push(answer.data);
    }
    return ips;
  } catch {
    return [];
  }
}

function extractFirstMetaImage(html, pageUrl) {
  for (const pattern of META_IMAGE_PATTERNS) {
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

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
