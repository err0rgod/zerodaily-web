/**
 * Cloudflare Pages Function: /sitemap-news.xml — Google News sitemap, stories of the last 48 hours.
 * Source: /api/v1/search-index?days=2 (small). An API failure gives an empty urlset, never a 5xx.
 */
import { buildNewsSitemap, fetchApiJson, xmlResponse } from '../lib/sitemap.js';

export async function onRequest() {
  const json = await fetchApiJson('https://api.zerodaily.in/api/v1/search-index?days=2', { cacheTtl: 900 });
  return xmlResponse(buildNewsSitemap(json?.items, new Date()), { maxAge: 900 });
}
