/**
 * Cloudflare Pages Function: /sitemap.xml — sitemap index (pages, news, one file per day).
 * No API call here; see lib/sitemap.js for the layout.
 */
import { buildSitemapIndex, xmlResponse } from '../lib/sitemap.js';

export function onRequest() {
  return xmlResponse(buildSitemapIndex(new Date()), { maxAge: 3600 });
}
