/** Cloudflare Pages Function: /sitemap-pages.xml — static public pages. */
import { buildPagesSitemap, xmlResponse } from '../lib/sitemap.js';

export function onRequest() {
  return xmlResponse(buildPagesSitemap(), { maxAge: 86400 });
}
