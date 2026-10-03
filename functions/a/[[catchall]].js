/**
 * Cloudflare Pages Function: /a/[[catchall]]
 * Intercepts shared article links to dynamically inject Open Graph & Twitter Card
 * meta tags for embeds on WhatsApp, Twitter/X, Discord, Telegram, Slack, iMessage, etc.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const match = url.pathname.match(/^\/(?:a|story)\/(.+?)(?:[?#]|$)/i);
  const articleId = match ? decodeURIComponent(match[1]) : null;

  let heading = "ZeroDaily — Tech News, Roasted in 60 Words";
  let description = "Download ZeroDaily for fastest tech news — 60-word, no-spin intelligence briefings.";
  let imageUrl = "https://zerodaily.in/og-image.png";

  if (articleId) {
    try {
      const apiUrl = `https://api.zerodaily.in/api/v1/article?id=${encodeURIComponent(articleId)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const apiRes = await fetch(apiUrl, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
        cf: { cacheTtl: 3600, cacheEverything: true }
      });
      clearTimeout(timeout);

      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.data) {
          heading = json.data.heading || heading;
          const snippet = json.data.shortSummary || json.data.fullSummary || "";
          description = snippet
            ? `Download ZeroDaily for fastest tech news • ${snippet.slice(0, 160)}...`
            : "Download ZeroDaily for fastest tech news";
          imageUrl = json.data.image_url || imageUrl;
        }
      }
    } catch {}
  }

  // Fetch the static SPA index.html from Cloudflare Pages assets
  const response = await context.env.ASSETS.fetch(new URL("/", context.request.url));

  // Dynamically rewrite meta tags using native Cloudflare HTMLRewriter
  return new HTMLRewriter()
    .on('title', {
      element(e) {
        e.setInnerContent(`${heading} — ZeroDaily`);
      }
    })
    .on('meta[property="og:title"]', {
      element(e) {
        e.setAttribute('content', heading);
      }
    })
    .on('meta[property="og:description"]', {
      element(e) {
        e.setAttribute('content', description);
      }
    })
    .on('meta[property="og:image"]', {
      element(e) {
        e.setAttribute('content', imageUrl);
      }
    })
    .on('meta[name="twitter:title"]', {
      element(e) {
        e.setAttribute('content', heading);
      }
    })
    .on('meta[name="twitter:description"]', {
      element(e) {
        e.setAttribute('content', description);
      }
    })
    .on('meta[name="twitter:image"]', {
      element(e) {
        e.setAttribute('content', imageUrl);
      }
    })
    .transform(response);
}
