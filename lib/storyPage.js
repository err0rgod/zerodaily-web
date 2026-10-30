/**
 * Server-rendered story pages (/a/<code>) for search engines and visitors without the app.
 * Pure helpers (no Cloudflare APIs), used by functions/a/[[catchall]].js and tested in tests/.
 */
export const SITE = 'https://zerodaily.in';
export const SITE_NAME = 'ZeroDaily';
export const TAGLINE = 'Zero fluff. Daily stop for Tech News.';
export const DESCRIPTION =
  'The stories that matter across security, AI/ML, engineering, robotics, defense, VLSI and finance.';
export const SATIRE_NOTE =
  'Satirical commentary on real tech news, summarised with AI. Read the original source for the facts.';
const DEFAULT_IMAGE = `${SITE}/og-image.png`;
const LOGO = `${SITE}/icon-512.png`;
const MORE_STORIES = 10;

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only http(s) URLs are ever put into href/src attributes. */
export function safeUrl(value) {
  try {
    const u = new URL(String(value));
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

/** The id from /a/<id> (or /story/<id>), decoded; null when missing. */
export function storyIdFromPath(pathname) {
  const m = String(pathname).match(/^\/(?:a|story)\/(.+?)\/?$/i);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

export function isShortCode(value) {
  return /^[0-9a-f]{8}$/i.test(String(value || ''));
}

export function canonicalUrl(article, requestedId) {
  const code = isShortCode(article?.short_code) ? article.short_code : isShortCode(requestedId) ? requestedId : null;
  return code ? `${SITE}/a/${code.toLowerCase()}` : null;
}

/** Summary lines without bullet markers or blank lines. */
export function summaryParagraphs(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•▪◦·]|\d+[.)])\s+/, '').trim())
    .filter(Boolean);
}

export function metaDescription(article) {
  const text = summaryParagraphs(article?.shortSummary).join(' ') || DESCRIPTION;
  if (text.length <= 155) return text;
  const cut = text.slice(0, 155);
  const space = cut.lastIndexOf(' ');
  return `${(space > 100 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, '')}…`;
}

export function sourceDomain(link) {
  const url = safeUrl(link);
  if (!url) return null;
  return new URL(url).hostname.replace(/^www\./, '');
}

/** "30 Oct 2026, 11:02 UTC"; null for an unusable value. */
export function displayDate(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return null;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
}

/** schema.org NewsArticle. `</` is escaped so the JSON can't close the script tag. */
export function newsArticleJsonLd(article, canonical) {
  const image = safeUrl(article?.image_url) || DEFAULT_IMAGE;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: String(article?.heading || '').slice(0, 110),
    description: metaDescription(article),
    image: [image],
    datePublished: article?.published_at || undefined,
    dateModified: article?.published_at || undefined,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE, logo: { '@type': 'ImageObject', url: LOGO } },
  };
  if (canonical) data.mainEntityOfPage = { '@type': 'WebPage', '@id': canonical };
  const source = safeUrl(article?.link);
  if (source) data.isBasedOn = source;
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Up to 10 other stories that have a short code and a heading. */
export function moreStories(items, currentCode) {
  const out = [];
  const seen = new Set([String(currentCode || '').toLowerCase()]);
  for (const it of Array.isArray(items) ? items : []) {
    const code = String(it?.short_code || '').toLowerCase();
    if (!isShortCode(code) || !it?.heading || seen.has(code)) continue;
    seen.add(code);
    out.push({ code, heading: String(it.heading) });
    if (out.length >= MORE_STORIES) break;
  }
  return out;
}

const STYLE = `
:root{--paper:#faf8f3;--raised:#f2efe7;--ink:#1b1a17;--soft:#565349;--faint:#8a867b;--rule:#e4e0d6}
@media (prefers-color-scheme:dark){:root{--paper:#0d0e12;--raised:#191c23;--ink:#e9e7e0;--soft:#a5a29a;--faint:#6d6b64;--rule:#262a33}}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:720px;margin:0 auto;padding:0 16px}
header{border-bottom:1px solid var(--rule)}
header .wrap{display:flex;align-items:center;justify-content:space-between;height:56px}
.brand{font:700 20px/1 Newsreader,Georgia,serif;text-decoration:none;letter-spacing:-.01em}
.nav{font-size:14px;color:var(--soft);text-decoration:none}
article{padding:24px 0 8px}
.hero{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:12px;background:var(--raised)}
h1{font:600 clamp(26px,5vw,36px)/1.2 Newsreader,Georgia,serif;letter-spacing:-.01em;margin:20px 0 8px}
.meta{font-size:13px;color:var(--faint);margin:0 0 20px}
.summary p{margin:0 0 14px;font-size:17px;color:var(--ink)}
.source{margin:20px 0 6px;font-size:15px}
.note{font-size:13px;color:var(--faint);margin:0 0 24px}
.actions{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 32px}
.btn{display:inline-block;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;border:1px solid var(--rule)}
.btn.primary{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.more{border-top:1px solid var(--rule);padding:24px 0}
.more h2{font:600 13px/1 Inter,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--faint);margin:0 0 12px}
.more ul{list-style:none;margin:0;padding:0}
.more li{border-bottom:1px solid var(--rule)}
.more a{display:block;padding:12px 0;text-decoration:none;font:500 17px/1.35 Newsreader,Georgia,serif}
.more a:hover,.source a:hover{text-decoration:underline}
footer{border-top:1px solid var(--rule);padding:20px 0 32px;font-size:13px;color:var(--faint)}
footer a{color:var(--soft);text-decoration:none;margin-right:16px}
`;

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com" />' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&display=swap" rel="stylesheet" />';

function shell({ title, head, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="color-scheme" content="light dark" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
${FONTS}
${head}
<style>${STYLE}</style>
</head>
<body>
<header><div class="wrap"><a class="brand" href="/">${SITE_NAME}</a><a class="nav" href="/download">Get the app</a></div></header>
${body}
<footer><div class="wrap"><a href="/">Home</a><a href="/wire">Today's wire</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></div></footer>
</body>
</html>`;
}

/** Full story page. `more` = output of moreStories(). */
export function renderStoryPage(article, { requestedId, more = [] } = {}) {
  const heading = String(article?.heading || article?.title || SITE_NAME);
  const canonical = canonicalUrl(article, requestedId);
  const description = metaDescription(article);
  const image = safeUrl(article?.image_url);
  const ogImage = image || DEFAULT_IMAGE;
  const date = displayDate(article?.published_at);
  const source = safeUrl(article?.link);
  const domain = sourceDomain(article?.link);
  const paragraphs = summaryParagraphs(article?.shortSummary);
  const code = canonical ? canonical.split('/').pop() : null;

  const head = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : '',
    '<meta property="og:type" content="article" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}" />` : '',
    `<meta property="og:title" content="${escapeHtml(heading)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />`,
    article?.published_at ? `<meta property="article:published_time" content="${escapeHtml(article.published_at)}" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(heading)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    `<script type="application/ld+json">${newsArticleJsonLd(article, canonical)}</script>`,
  ]
    .filter(Boolean)
    .join('\n');

  const body = `<main class="wrap">
<article>
${image ? `<img class="hero" src="${escapeHtml(image)}" alt="" width="800" height="450" />` : ''}
<h1>${escapeHtml(heading)}</h1>
${date ? `<p class="meta"><time datetime="${escapeHtml(article.published_at)}">${escapeHtml(date)}</time></p>` : ''}
<div class="summary">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
${source ? `<p class="source"><a href="${escapeHtml(source)}" rel="noopener" target="_blank">Read the original at ${escapeHtml(domain)}</a></p>` : ''}
<p class="note">${escapeHtml(SATIRE_NOTE)}</p>
<div class="actions">${code ? `<a class="btn primary" href="zerodaily://a/${escapeHtml(code)}">Open in the app</a>` : ''}<a class="btn" href="/download">Get the app</a></div>
</article>
${
  more.length
    ? `<section class="more"><h2>More stories</h2><ul>${more
        .map((s) => `<li><a href="/a/${escapeHtml(s.code)}">${escapeHtml(s.heading)}</a></li>`)
        .join('')}</ul></section>`
    : ''
}
</main>`;

  return shell({ title: `${heading} — ${SITE_NAME}`, head, body });
}

/** 410 (story expired / unknown) or 503 (backend unreachable) page; never indexed. */
export function renderNotFoundPage({ temporary = false } = {}) {
  const message = temporary
    ? 'This story could not be loaded right now. Please try again in a few minutes.'
    : 'This story is no longer available. Stories are kept for 90 days.';
  const body = `<main class="wrap"><article><h1>${temporary ? 'Try again soon' : 'Story not found'}</h1><p class="meta">${message}</p><div class="actions"><a class="btn primary" href="/">Go to ${SITE_NAME}</a><a class="btn" href="/download">Get the app</a></div></article></main>`;
  return shell({
    title: `${temporary ? 'Try again soon' : 'Story not found'} — ${SITE_NAME}`,
    head: '<meta name="robots" content="noindex" />',
    body,
  });
}
