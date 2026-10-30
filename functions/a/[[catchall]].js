/**
 * Cloudflare Pages Function: /a/<short code or article id>
 * Server-rendered story page (heading, summary, image, source link, more stories) with
 * canonical URL, NewsArticle JSON-LD and Open Graph / Twitter tags, so search engines can index
 * every story and link previews (WhatsApp, X, Telegram, ...) show it. HTML lives in lib/storyPage.js.
 *
 * Status codes: 200 story; 410 unknown/expired story (noindex); 503 backend unreachable (noindex,
 * Retry-After) so a hiccup never gets indexed as an empty page.
 */
import { moreStories, renderNotFoundPage, renderStoryPage, storyIdFromPath } from '../../lib/storyPage.js';

const API = 'https://api.zerodaily.in/api/v1';
// api.zerodaily.in challenges unknown clients; "ZeroDaily-" user agents are allowed.
const API_HEADERS = { Accept: 'application/json', 'User-Agent': 'ZeroDaily-Web/1.0' };

async function fetchJson(url, { timeoutMs, cacheTtl }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: API_HEADERS,
      signal: controller.signal,
      cf: { cacheTtl, cacheEverything: true },
    });
    return { status: res.status, json: res.ok ? await res.json() : null };
  } finally {
    clearTimeout(timer);
  }
}

function html(body, status, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...extraHeaders },
  });
}

export async function onRequest(context) {
  const id = storyIdFromPath(new URL(context.request.url).pathname);
  if (!id) return html(renderNotFoundPage(), 410, { 'Cache-Control': 'public, max-age=3600' });

  const [articleRes, feedRes] = await Promise.allSettled([
    fetchJson(`${API}/article?id=${encodeURIComponent(id)}`, { timeoutMs: 3000, cacheTtl: 3600 }),
    fetchJson(`${API}/feed?limit=15`, { timeoutMs: 2000, cacheTtl: 300 }),
  ]);

  if (articleRes.status === 'fulfilled' && articleRes.value.status === 404) {
    return html(renderNotFoundPage(), 410, { 'Cache-Control': 'public, max-age=3600' });
  }
  const article = articleRes.status === 'fulfilled' ? articleRes.value.json?.data : null;
  if (!article) {
    return html(renderNotFoundPage({ temporary: true }), 503, { 'Cache-Control': 'no-store', 'Retry-After': '300' });
  }

  const feedItems = feedRes.status === 'fulfilled' ? feedRes.value.json?.data : [];
  const page = renderStoryPage(article, { requestedId: id, more: moreStories(feedItems, article.short_code) });
  return html(page, 200, { 'Cache-Control': 'public, max-age=300' });
}
