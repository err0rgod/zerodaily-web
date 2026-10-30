/**
 * Sitemap builders (pure, tested in tests/). Layout:
 *   /sitemap.xml                 sitemap index (no API call)
 *   /sitemap-pages.xml           static public pages
 *   /sitemap-news.xml            Google News sitemap: stories of the last 48 hours
 *   /sitemaps/<YYYY-MM-DD>.xml   every story published that UTC day (backend /api/v1/sitemap-day)
 * One file per day keeps each Pages Function call small (a single 30-day file took 10-20 ms
 * of CPU, over the free plan's 10 ms).
 */
export const SITE = 'https://zerodaily.in';
export const SITEMAP_DAYS = 89; // stories expire after 90 days

export const STATIC_PAGES = [
  { path: '/', changefreq: 'hourly', priority: '1.0' },
  { path: '/wire', changefreq: 'hourly', priority: '0.8' },
  { path: '/join', changefreq: 'monthly', priority: '0.5' },
  { path: '/feedback', changefreq: 'monthly', priority: '0.3' },
  { path: '/contact', changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.2' },
  { path: '/terms', changefreq: 'monthly', priority: '0.2' },
];

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n';

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Normalise "2026-10-22T23:15" / "2026-10-22T23:15:07Z" to a W3C datetime; null if unusable. */
export function toLastmod(published) {
  if (typeof published !== 'string') return null;
  const m = published.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2})(:\d{2})?)?/);
  if (!m) return null;
  if (!m[2]) return m[1];
  return `${m[1]}T${m[2]}${m[3] || ':00'}Z`;
}

export function isStoryCode(code) {
  return typeof code === 'string' && /^[0-9a-f]{8}$/i.test(code);
}

export function storyUrl(code) {
  return `${SITE}/a/${code.toLowerCase()}`;
}

/** UTC dates (YYYY-MM-DD) from `now` back `days - 1` days, newest first. */
export function recentDays(now = new Date(), days = SITEMAP_DAYS) {
  const out = [];
  const base = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let i = 0; i < days; i += 1) out.push(new Date(base - i * 86400000).toISOString().slice(0, 10));
  return out;
}

/** True for a YYYY-MM-DD between today and SITEMAP_DAYS - 1 days back. */
export function isSitemapDay(date, now = new Date()) {
  return typeof date === 'string' && recentDays(now).includes(date);
}

export function buildSitemapIndex(now = new Date()) {
  const lastmod = now.toISOString().slice(0, 19) + 'Z';
  const files = ['/sitemap-pages.xml', '/sitemap-news.xml', ...recentDays(now).map((d) => `/sitemaps/${d}.xml`)];
  const body = files
    .map((f) => `  <sitemap>\n    <loc>${SITE}${f}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`)
    .join('\n');
  return `${XML_HEAD}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export function buildUrlset(entries) {
  const body = entries
    .map((u) => {
      const parts = [`    <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`    <lastmod>${escapeXml(u.lastmod)}</lastmod>`);
      if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');
  return `${XML_HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function buildPagesSitemap() {
  return buildUrlset(STATIC_PAGES.map((p) => ({ loc: SITE + p.path, changefreq: p.changefreq, priority: p.priority })));
}

/** Items from /api/v1/sitemap-day ({s, p}) -> urlset, deduped, invalid codes skipped. */
export function buildDaySitemap(items) {
  const seen = new Set();
  const entries = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!isStoryCode(it?.s) || seen.has(it.s.toLowerCase())) continue;
    seen.add(it.s.toLowerCase());
    entries.push({ loc: storyUrl(it.s), lastmod: toLastmod(it.p) });
  }
  return buildUrlset(entries);
}

/**
 * Google News sitemap from search-index items ({s, h, p}): stories of the last 48 hours that
 * have a heading, newest first, at most 1000 (Google's limit).
 */
export function buildNewsSitemap(items, now = new Date()) {
  const cutoff = now.getTime() - 48 * 3600 * 1000;
  const seen = new Set();
  const entries = [];
  const sorted = [...(Array.isArray(items) ? items : [])].sort((a, b) => String(b?.p || '').localeCompare(String(a?.p || '')));
  for (const it of sorted) {
    const lastmod = toLastmod(it?.p);
    if (!isStoryCode(it?.s) || !it?.h || !lastmod || seen.has(it.s.toLowerCase())) continue;
    if (Date.parse(lastmod) < cutoff) continue;
    seen.add(it.s.toLowerCase());
    entries.push(
      `  <url>\n    <loc>${storyUrl(it.s)}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>ZeroDaily</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${escapeXml(lastmod)}</news:publication_date>\n      <news:title>${escapeXml(it.h)}</news:title>\n    </news:news>\n  </url>`
    );
    if (entries.length >= 1000) break;
  }
  return `${XML_HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

/** Fetch JSON from the API with a ZeroDaily user agent, a timeout and edge caching; null on failure. */
export async function fetchApiJson(url, { timeoutMs = 4000, cacheTtl = 900 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      // api.zerodaily.in challenges unknown clients; "ZeroDaily-" user agents are allowed.
      headers: { Accept: 'application/json', 'User-Agent': 'ZeroDaily-Sitemap/1.0' },
      signal: controller.signal,
      cf: { cacheTtl, cacheEverything: true },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function xmlResponse(body, { status = 200, maxAge = 3600 } = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': `public, max-age=${maxAge}` },
  });
}
