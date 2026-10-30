/**
 * Cloudflare Pages Function: /sitemaps/<YYYY-MM-DD>.xml — every story published that UTC day,
 * from /api/v1/sitemap-day. Unknown or out-of-range dates are 404. Past days are cached for a
 * day, today for 15 minutes. If the API fails the response is 503 (Google retries later).
 */
import { buildDaySitemap, fetchApiJson, isSitemapDay, xmlResponse } from '../../lib/sitemap.js';

export async function onRequest(context) {
  const m = String(context.params.file || '').match(/^(\d{4}-\d{2}-\d{2})\.xml$/);
  const now = new Date();
  if (!m || !isSitemapDay(m[1], now)) return new Response('Not found', { status: 404 });

  const isToday = m[1] === now.toISOString().slice(0, 10);
  const json = await fetchApiJson(`https://api.zerodaily.in/api/v1/sitemap-day?date=${m[1]}`, {
    cacheTtl: isToday ? 900 : 86400,
  });
  if (!json) return new Response('Try again later', { status: 503, headers: { 'Retry-After': '600' } });
  return xmlResponse(buildDaySitemap(json.items), { maxAge: isToday ? 900 : 86400 });
}
