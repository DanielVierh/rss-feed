# Cloudflare Worker RSS-Proxy

Dieser Worker stellt zwei Endpunkte bereit:

- `GET /rss?url=<rss-url>` → liefert RSS/Atom-XML
- `GET /page-meta?url=<artikel-url>` → liefert `{ "image": "<og:image>" }`

## Deployment

1. Cloudflare + Wrangler installieren:

```bash
npm i -g wrangler
wrangler login
```

2. Im Ordner `worker/` deployen:

```bash
wrangler deploy rss-proxy-worker.js --name rss-feed-proxy
```

3. Die ausgegebene URL in [index.html](../index.html) eintragen:

```html
<script>
  window.RSS_WORKER_BASE_URL = "https://rss-feed-proxy.<dein-subdomain>.workers.dev";
</script>
```

Danach lädt GitHub Pages die Feeds wieder live.
