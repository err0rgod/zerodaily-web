import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDaySitemap, buildNewsSitemap, buildPagesSitemap, buildSitemapIndex, isSitemapDay, recentDays, toLastmod,
} from '../lib/sitemap.js';

const NOW = new Date('2026-10-31T10:00:00Z');

test('recent days: 89 UTC dates, newest first', () => {
  const days = recentDays(NOW);
  assert.equal(days.length, 89);
  assert.equal(days[0], '2026-10-31');
  assert.equal(days[1], '2026-10-30');
  assert.equal(days[88], '2026-08-04');
  assert.ok(isSitemapDay('2026-10-31', NOW));
  assert.ok(!isSitemapDay('2026-11-01', NOW));
  assert.ok(!isSitemapDay('2026-08-03', NOW));
  assert.ok(!isSitemapDay('../x', NOW));
});

test('sitemap index lists pages, news and every day', () => {
  const xml = buildSitemapIndex(NOW);
  assert.match(xml, /<sitemapindex /);
  assert.match(xml, /<loc>https:\/\/zerodaily.in\/sitemap-pages.xml<\/loc>/);
  assert.match(xml, /<loc>https:\/\/zerodaily.in\/sitemap-news.xml<\/loc>/);
  assert.match(xml, /<loc>https:\/\/zerodaily.in\/sitemaps\/2026-10-31.xml<\/loc>/);
  assert.equal((xml.match(/<sitemap>/g) || []).length, 91);
});

test('pages sitemap has the static pages and no delete-account', () => {
  const xml = buildPagesSitemap();
  assert.match(xml, /<loc>https:\/\/zerodaily.in\/<\/loc>/);
  assert.match(xml, /\/wire</);
  assert.ok(!xml.includes('delete-account'));
});

test('day sitemap: valid codes only, deduped, lowercased', () => {
  const xml = buildDaySitemap([
    { s: '1A2B3C4D', p: '2026-10-30T11:02:00Z' },
    { s: '1a2b3c4d', p: '2026-10-30T11:02:00Z' },
    { s: 'bad', p: '2026-10-30T10:00:00Z' },
    { s: 'deadbeef', p: '2026-10-30T09:00' },
  ]);
  assert.equal((xml.match(/<url>/g) || []).length, 2);
  assert.match(xml, /<loc>https:\/\/zerodaily.in\/a\/1a2b3c4d<\/loc>\n    <lastmod>2026-10-30T11:02:00Z<\/lastmod>/);
  assert.match(xml, /<lastmod>2026-10-30T09:00:00Z<\/lastmod>/);
  assert.equal(buildDaySitemap(null).includes('<url>'), false);
});

test('news sitemap: last 48 h, needs a heading, escapes titles', () => {
  const xml = buildNewsSitemap(
    [
      { s: 'aaaaaaaa', h: 'Fresh & <new>', p: '2026-10-31T09:00' },
      { s: 'bbbbbbbb', h: 'Old', p: '2026-10-28T09:00' },
      { s: 'cccccccc', p: '2026-10-31T08:00' },
    ],
    NOW
  );
  assert.match(xml, /xmlns:news="http:\/\/www.google.com\/schemas\/sitemap-news\/0.9"/);
  assert.match(xml, /<news:title>Fresh &amp; &lt;new&gt;<\/news:title>/);
  assert.match(xml, /<news:publication_date>2026-10-31T09:00:00Z<\/news:publication_date>/);
  assert.ok(!xml.includes('bbbbbbbb'));
  assert.ok(!xml.includes('cccccccc'));
});

test('toLastmod', () => {
  assert.equal(toLastmod('2026-10-22T23:15'), '2026-10-22T23:15:00Z');
  assert.equal(toLastmod('2026-10-22'), '2026-10-22');
  assert.equal(toLastmod(null), null);
});
