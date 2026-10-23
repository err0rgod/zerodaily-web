/**
 * Cloudflare Pages Function: /sitemap.xml
 * Static public pages plus the latest stories (/a/<short_code>) from the backend search index.
 * If the backend fetch fails, the static pages are still returned (never a 5xx).
 */
const SITE = 'https://zerodaily.in';
const SEARCH_INDEX_URL = 'https://api.zerodaily.in/api/v1/search-index?days=7';
const MAX_STORIES = 200;

export const STATIC_PAGES = [
  { path: '/', changefreq: 'hourly', priority: '1.0' },
  { path: '/wire', changefreq: 'hourly', priority: '0.8' },
  { path: '/join', changefreq: 'monthly', priority: '0.5' },
  { path: '/feedback', changefreq: 'monthly', priority: '0.3' },
  { path: '/contact', changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.2' },
  { path: '/terms', changefreq: 'monthly', priority: '0.2' },
];

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Normalise the index's "2026-10-22T23:15" to a W3C datetime; null if unusable. */
export function toLastmod(published) {
  if (typeof published !== 'string') return null;
  const m = published.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2})(:\d{2})?)?/);
  if (!m) return null;
  if (!m[2]) return m[1];
  return `${m[1]}T${m[2]}${m[3] || ':00'}Z`;
}

/** Turn search-index items ({s, h, c, p, b}) into sitemap entries, newest first, deduped. */
export function storyEntries(items, limit = MAX_STORIES) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  const out = [];
  const sorted = [...items].sort((a, b) => String(b?.p || '').localeCompare(String(a?.p || '')));
  for (const item of sorted) {
    const code = item && typeof item.s === 'string' ? item.s.trim() : '';
    if (!/^[A-Za-z0-9_-]{4,64}$/.test(code) || seen.has(code)) continue;
    seen.add(code);
    out.push({ loc: `${SITE}/a/${encodeURIComponent(code)}`, lastmod: toLastmod(item.p) });
    if (out.length >= limit) break;
  }
  return out;
}

export function buildSitemap(stories = []) {
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: SITE + p.path, changefreq: p.changefreq, priority: p.priority })),
    ...stories,
  ];
  const body = urls
    .map((u) => {
      const parts = [`    <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`    <lastmod>${escapeXml(u.lastmod)}</lastmod>`);
      if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function fetchStories() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(SEARCH_INDEX_URL, {
      // api.zerodaily.in challenges unknown clients; "ZeroDaily-" user agents are allowed.
      headers: { Accept: 'application/json', 'User-Agent': 'ZeroDaily-Sitemap/1.0' },
      signal: controller.signal,
      cf: { cacheTtl: 900, cacheEverything: true },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const json = await res.json();
    return storyEntries(json && json.items);
  } catch {
    return [];
  }
}

export async function onRequest() {
  const stories = await fetchStories();
  return new Response(buildSitemap(stories), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
