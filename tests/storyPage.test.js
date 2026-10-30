import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalUrl, displayDate, metaDescription, moreStories, newsArticleJsonLd,
  renderNotFoundPage, renderStoryPage, safeUrl, storyIdFromPath, summaryParagraphs,
} from '../lib/storyPage.js';

const article = {
  id: 'https://example.com/story',
  short_code: '1a2b3c4d',
  heading: 'Chip maker <ships> "faster" GPUs & more',
  shortSummary: '• First point here.\n\n- Second point here.\n3) Third point.',
  published_at: '2026-10-30T11:02:00Z',
  link: 'https://www.example.com/story',
  image_url: 'https://media.zerodaily.in/images/hardware/abc.webp',
  category: 'hardware',
};

test('story id from path', () => {
  assert.equal(storyIdFromPath('/a/1a2b3c4d'), '1a2b3c4d');
  assert.equal(storyIdFromPath('/a/1a2b3c4d/'), '1a2b3c4d');
  assert.equal(storyIdFromPath('/a/https%3A%2F%2Fe.com%2Fx'), 'https://e.com/x');
  assert.equal(storyIdFromPath('/a/'), null);
  assert.equal(storyIdFromPath('/a/%E0%A4%A'), null);
});

test('canonical uses the short code', () => {
  assert.equal(canonicalUrl(article, 'https://example.com/story'), 'https://zerodaily.in/a/1a2b3c4d');
  assert.equal(canonicalUrl({}, 'ABCDEF12'), 'https://zerodaily.in/a/abcdef12');
  assert.equal(canonicalUrl({}, 'https://e.com/x'), null);
});

test('summary paragraphs drop bullets and blank lines', () => {
  assert.deepEqual(summaryParagraphs(article.shortSummary), ['First point here.', 'Second point here.', 'Third point.']);
});

test('meta description is at most 156 chars and ends cleanly', () => {
  const d = metaDescription({ shortSummary: 'word '.repeat(80) });
  assert.ok(d.length <= 156);
  assert.ok(d.endsWith('…'));
  assert.equal(
    metaDescription({}),
    'The stories that matter across security, AI/ML, engineering, robotics, defense, VLSI and finance.'
  );
});

test('display date', () => {
  assert.equal(displayDate('2026-10-30T11:02:00Z'), '30 Oct 2026, 11:02 UTC');
  assert.equal(displayDate('nope'), null);
});

test('safeUrl only allows http(s)', () => {
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('https://e.com/a'), 'https://e.com/a');
});

test('JSON-LD is a NewsArticle and cannot close the script tag', () => {
  const raw = newsArticleJsonLd({ ...article, heading: '</script><b>x' }, 'https://zerodaily.in/a/1a2b3c4d');
  assert.ok(!raw.includes('</'));
  const data = JSON.parse(raw);
  assert.equal(data['@type'], 'NewsArticle');
  assert.equal(data.mainEntityOfPage['@id'], 'https://zerodaily.in/a/1a2b3c4d');
  assert.equal(data.isBasedOn, 'https://www.example.com/story');
  assert.equal(data.publisher.name, 'ZeroDaily');
  assert.equal(data.datePublished, '2026-10-30T11:02:00Z');
});

test('more stories skips the current one, bad codes and duplicates, max 10', () => {
  const items = [
    { short_code: '1a2b3c4d', heading: 'current' },
    { short_code: 'zzzz', heading: 'bad' },
    { short_code: 'aaaaaaaa', heading: '' },
    ...Array.from({ length: 15 }, (_, i) => ({ short_code: `b${String(i).padStart(7, '0')}`, heading: `H${i}` })),
    { short_code: 'b0000000', heading: 'dup' },
  ];
  const more = moreStories(items, '1a2b3c4d');
  assert.equal(more.length, 10);
  assert.equal(more[0].code, 'b0000000');
  assert.ok(!more.some((s) => s.code === '1a2b3c4d'));
});

test('story page has the text, tags and links search engines need', () => {
  const page = renderStoryPage(article, { requestedId: '1a2b3c4d', more: [{ code: 'bbbbbbbb', heading: 'Other <one>' }] });
  assert.match(page, /<link rel="canonical" href="https:\/\/zerodaily.in\/a\/1a2b3c4d" \/>/);
  assert.match(page, /<h1>Chip maker &lt;ships&gt; &quot;faster&quot; GPUs &amp; more<\/h1>/);
  assert.match(page, /<p>First point here.<\/p><p>Second point here.<\/p>/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /index, follow, max-image-preview:large/);
  assert.match(page, /Read the original at example.com/);
  assert.match(page, /href="\/a\/bbbbbbbb">Other &lt;one&gt;</);
  assert.match(page, /<time datetime="2026-10-30T11:02:00Z">30 Oct 2026, 11:02 UTC<\/time>/);
  assert.match(page, /og:image" content="https:\/\/media.zerodaily.in\/images\/hardware\/abc.webp"/);
  assert.match(page, /Satirical commentary on real tech news/);
  const text = page.replace(/images\/hardware/g, '');
  assert.ok(!/hardware|VLSI<|Trending|Breaking/i.test(text), 'no topic names or banned words');
  assert.ok(!page.includes('<ships>'));
});

test('story page without image or link still renders', () => {
  const page = renderStoryPage({ heading: 'H', short_code: 'cccccccc' }, {});
  assert.ok(!page.includes('<img'));
  assert.ok(!page.includes('Read the original at'));
  assert.match(page, /og:image" content="https:\/\/zerodaily.in\/og-image.png"/);
});

test('not-found pages are noindex', () => {
  assert.match(renderNotFoundPage(), /noindex/);
  assert.match(renderNotFoundPage(), /Story not found/);
  assert.match(renderNotFoundPage({ temporary: true }), /Try again soon/);
});
