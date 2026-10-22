/**
 * Live HTML mockups of the ZeroDaily Android app (1.8.1) for the landing page phones.
 *
 * Every screen is laid out at the app's own size (390 px wide, the same px values as the
 * React Native styles in the app repo) and scaled down to fit its phone frame, so fonts,
 * spacing and radii stay true to the app. Colours follow the site theme: the app's light
 * theme on the light site, its dark (OLED) theme on the dark site (see `.zd-ui` in styles.css).
 *
 * Feed and Saved screens show real stories from api.zerodaily.in (two Cloudflare-cached
 * requests per page view). Until they arrive the screens show a skeleton; if the request
 * fails or takes longer than FEED_TIMEOUT_MS, those phones fall back to the static
 * screenshots in public/screens/.
 */
import { escapeHtml, safeUrl } from '../api.js';
import './appMockups.css';

const API = 'https://api.zerodaily.in/api/v1';
const FEED_TIMEOUT_MS = 4000;
const ROTATE_MS = 6000;
const UI_WIDTH = 390;

/* ---------- Lucide icons (inline SVG, same glyphs the app uses) ---------- */

const ICONS = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  cybersec: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  ai: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  programming: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  robotics: '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/>',
  defense_aerospace: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  hardware: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  finance: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  phone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  feedback: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/>',
};

function icon(name, size, { stroke = 2, cls = '' } = {}) {
  return `<svg class="zd-i ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

/* ---------- App data (mirrors src/constants/categories.ts) ---------- */

const DESKS = [
  { key: 'cybersec', name: 'Cybersecurity', description: 'Zero-days, critical CVEs, and data breach autopsies.' },
  { key: 'ai', name: 'Artificial Intelligence', description: 'LLM benchmark wars, frontier models, and autonomous agents.' },
  { key: 'programming', name: 'Engineering', description: 'Languages, runtimes, distributed systems, and kernel bugs.' },
  { key: 'robotics', name: 'Robotics', description: 'Humanoid robotics, autonomous vehicles, and industrial sensors.' },
  { key: 'defense_aerospace', name: 'Defense & Aerospace', description: 'Hypersonics, orbital swarms, defense tech, and radar systems.' },
  { key: 'hardware', name: 'Hardware & Silicon', description: 'Semiconductor tape-outs, GPUs, packaging, and quantum chips.' },
  { key: 'finance', name: 'Finance', description: 'Fintech, algorithmic trading, crypto economics, and venture capital.' },
];

/** formatRelativeTime() from the app (src/utils/date.ts). */
function relativeTime(iso) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 'recently';
  const s = Math.floor(Math.max(0, Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.floor(d / 30)}mo ago`;
}

/** extractDomain() from the app (src/utils/url.ts). */
function domainOf(url) {
  try {
    let host = new URL(url).hostname.toLowerCase().replace(/^(www\.|m\.|amp\.)/, '');
    if (host.includes('economictimes')) host = 'economictimes.com';
    if (host.includes('timesofindia')) host = 'timesofindia.com';
    return host || 'Source';
  } catch {
    return 'Source';
  }
}

/* ---------- Shared chrome ---------- */

function statusBar() {
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  return `
    <div class="zd-status">
      <span>${time}</span>
      <span class="zd-status-icons">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 11.5 0.6 3.6a10.6 10.6 0 0 1 14.8 0z"/></svg>
        <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><path d="M13 0v12H1z"/></svg>
        <svg width="9" height="14" viewBox="0 0 9 14" fill="currentColor"><rect x="2.5" y="0" width="4" height="2" rx=".5"/><rect x="0" y="1.5" width="9" height="12.5" rx="1.5"/></svg>
      </span>
    </div>`;
}

const gestureBar = '<div class="zd-gesture"><span></span></div>';

function pills(active) {
  const list = [{ key: 'all', name: 'Hot 🔥' }, ...DESKS];
  return `
    <div class="zd-pills">
      <div class="zd-pills-row${active !== 'all' ? ' zd-pills-scrolled' : ''}">
        ${list.map(d => `
          <span class="zd-pill${d.key === active ? ' is-active' : ''}" style="--accent: var(--c-${d.key})">
            ${d.key === 'all' ? '' : icon(d.key, 13, { stroke: 2.2 })}
            <span>${d.name}</span>
          </span>`).join('')}
      </div>
    </div>`;
}

function bottomNav(active = 'home') {
  const tabs = [['home', 'Home', 22], ['search', 'Search', 21], ['saved', 'Saved', 20], ['settings', 'Settings', 20]];
  return `
    <nav class="zd-nav">
      ${tabs.map(([key, label, size]) => `
        <span class="zd-tab${key === active ? ' is-active' : ''}">
          <span class="zd-tab-icon">${icon(key === 'saved' ? 'bookmark' : key, size)}</span>
          <span class="zd-tab-label">${label}</span>
        </span>`).join('')}
    </nav>`;
}

/* ---------- Feed card (src/components/feed/NewsCard.tsx) ---------- */

function storyCard(story, { eager = false } = {}) {
  const img = safeUrl(story.image_url, '');
  const loading = eager ? 'eager' : 'lazy';
  return `
    <article class="zd-card">
      <div class="zd-hero">
        <img class="zd-hero-blur" src="${escapeHtml(img)}" alt="" loading="${loading}" decoding="async" />
        <img class="zd-hero-img" src="${escapeHtml(img)}" alt="" loading="${loading}" decoding="async" />
        <div class="zd-scrim"></div>
        <div class="zd-overlay">
          <span class="zd-brand">ZERODAILY</span>
          <span class="zd-time">${escapeHtml(relativeTime(story.published_at))}</span>
        </div>
      </div>
      <div class="zd-body">
        <h3 class="zd-heading">${escapeHtml(story.heading)}</h3>
        <p class="zd-summary">${escapeHtml(story.shortSummary)}</p>
      </div>
      ${cardFooter(domainOf(story.link || story.id))}
    </article>`;
}

function cardFooter(domain) {
  return `
    <div class="zd-foot">
      <span class="zd-source">
        ${icon('globe', 13, { cls: 'zd-muted' })}
        <span class="zd-source-text">${escapeHtml(domain)}</span>
        ${icon('external', 12, { cls: 'zd-muted' })}
      </span>
      <span class="zd-actions">
        <span class="zd-btn">${icon('heart', 18)}</span>
        <span class="zd-btn">${icon('share', 17)}</span>
        <span class="zd-btn">${icon('bookmark', 17)}</span>
      </span>
    </div>`;
}

function skeletonCard() {
  return `
    <article class="zd-card is-loading">
      <div class="zd-hero zd-shimmer"></div>
      <div class="zd-body">
        <span class="zd-skel" style="width:92%;height:22px;margin-top:4px"></span>
        <span class="zd-skel" style="width:70%;height:22px;margin-top:8px"></span>
        ${[96, 100, 94, 98, 88, 60].map(w => `<span class="zd-skel" style="width:${w}%;height:13px;margin-top:${w === 96 ? 18 : 10}px"></span>`).join('')}
      </div>
      ${cardFooter('loading…')}
    </article>`;
}

function feedScreen(desk) {
  return `
    ${statusBar()}
    ${pills(desk)}
    <div class="zd-deck" data-deck>${skeletonCard()}</div>
    ${bottomNav('home')}
    ${gestureBar}`;
}

/* ---------- Topic picker (CategoryOnboardingModal.tsx) ---------- */

function onboardingScreen() {
  const selected = new Set(['cybersec', 'ai', 'programming']);
  return `
    ${statusBar()}
    <div class="zd-onb-head">
      <h3 class="zd-onb-title">Personalize your feed</h3>
      <p class="zd-onb-sub">Select the topics you care about. You can always change these later in settings.</p>
    </div>
    <div class="zd-onb-grid">
      ${DESKS.map(d => {
        const on = selected.has(d.key);
        return `
          <div class="zd-box${on ? ' is-on' : ''}" style="--accent: var(--c-${d.key})">
            <div class="zd-box-top">
              <span class="zd-box-icon">${icon(d.key, 15, { stroke: 2.2 })}</span>
              <span class="zd-check">${on ? icon('check', 12, { stroke: 3 }) : ''}</span>
            </div>
            <p class="zd-box-title">${d.name}</p>
            <p class="zd-box-desc">${d.description}</p>
          </div>`;
      }).join('')}
    </div>
    <div class="zd-onb-foot"><span class="zd-cta">Start Reading</span></div>
    ${gestureBar}`;
}

/* ---------- Saved (BookmarksModal.tsx) ---------- */

function sheetHeader(iconName, title, extra = '') {
  return `
    <div class="zd-sheet-head">
      <span class="zd-sheet-title">${iconName === 'bookmark' ? icon('bookmark', 20, { cls: 'zd-primary' }) : icon(iconName, 20)}<span>${title}</span></span>
      <span class="zd-sheet-actions">${extra}<span class="zd-close">${icon('x', 20)}</span></span>
    </div>`;
}

function savedItem(story) {
  // App 1.9.0 dropped the category badge: thumbnail, heading and relative time only.
  const img = safeUrl(story.image_url, '');
  return `
    <div class="zd-saved-item">
      <img class="zd-thumb" src="${escapeHtml(img)}" alt="" loading="lazy" decoding="async" />
      <div class="zd-saved-text">
        <p class="zd-saved-heading">${escapeHtml(story.heading)}</p>
        <span class="zd-saved-time">${escapeHtml(relativeTime(story.published_at))}</span>
      </div>
      <span class="zd-trash">${icon('trash', 16)}</span>
    </div>`;
}

function savedSkeleton() {
  return Array.from({ length: 5 }, () => `
    <div class="zd-saved-item">
      <span class="zd-thumb zd-shimmer"></span>
      <div class="zd-saved-text">
        <span class="zd-skel" style="width:95%;height:13px"></span>
        <span class="zd-skel" style="width:70%;height:13px;margin-top:6px"></span>
        <span class="zd-skel" style="width:30%;height:10px;margin-top:9px"></span>
      </div>
    </div>`).join('');
}

function savedScreen() {
  return `
    ${statusBar()}
    ${sheetHeader('bookmark', 'Saved Offline Stories', '<span class="zd-clear">Clear All</span>')}
    <div class="zd-sheet-body">
      <div class="zd-guest">
        <div class="zd-guest-text">
          <p class="zd-guest-title">Sync Your Saved Roasts</p>
          <p class="zd-guest-sub">Sign in to back up your bookmarks across devices.</p>
        </div>
        <span class="zd-guest-btn">Sign In</span>
      </div>
      <div data-saved-list>${savedSkeleton()}</div>
    </div>
    ${gestureBar}`;
}

/* ---------- Settings (SettingsModal.tsx), scrolled to theme + channels ---------- */

function settingsScreen() {
  const on = new Set(['cybersec', 'ai', 'programming', 'finance']);
  const row = (left, right) => `<div class="zd-row">${left}${right}</div>`;
  const link = (iconName, title, sub) => row(
    `<span class="zd-row-left">${icon(iconName, 18, { cls: 'zd-secondary' })}<span><span class="zd-row-title">${title}</span>${sub ? `<span class="zd-row-sub">${sub}</span>` : ''}</span></span>`,
    icon('external', 16, { cls: 'zd-muted' }),
  );
  return `
    ${statusBar()}
    ${sheetHeader('settings', 'Settings &amp; Preferences')}
    <div class="zd-sheet-body">
      <p class="zd-section">APPEARANCE &amp; THEME</p>
      <div class="zd-theme-row">
        <span class="zd-tb" data-mode="dark">${icon('moon', 16)}Dark</span>
        <span class="zd-tb" data-mode="light">${icon('sun', 16)}Light</span>
        <span class="zd-tb" data-mode="system">${icon('phone', 16)}System</span>
      </div>
      <p class="zd-section">NOTIFICATION CHANNELS</p>
      ${DESKS.map(d => row(`<span class="zd-row-title">${d.name}</span>`, `<span class="zd-switch${on.has(d.key) ? ' is-on' : ''}"><span></span></span>`)).join('')}
      <p class="zd-section" style="margin-top:10px">CONTACT &amp; SUPPORT</p>
      ${link('mail', 'Contact us', 'hi@zerodaily.in')}
      ${link('feedback', 'Send feedback')}
    </div>
    ${gestureBar}`;
}

/* ---------- Public API ---------- */

const SCREEN_HTML = {
  feed: () => feedScreen('all'),
  desks: () => feedScreen('cybersec'),
  onboarding: onboardingScreen,
  saved: savedScreen,
  settings: settingsScreen,
};

/** Live screens are swapped for their static screenshot when the API is unavailable. */
const LIVE_KINDS = new Set(['feed', 'desks', 'saved']);

/**
 * Inner HTML of a phone screen. `screen` is an entry of SCREENS in home.js
 * ({ kind, src, alt, ... }); `role` picks which stories a live phone shows.
 */
export function mockupHtml(screen, role, eager) {
  return `
    <div class="zd-screen" data-mock="${screen.kind}" data-role="${role}" data-src="${screen.src}" data-eager="${eager ? '1' : ''}">
      <div class="zd-ui" aria-hidden="true">${SCREEN_HTML[screen.kind]()}</div>
    </div>`;
}

/** Keep every 390 px wide app UI scaled to its phone screen (and its height filling it). */
function fitScreens(root) {
  const fit = el => {
    const ui = el.firstElementChild;
    const w = el.clientWidth;
    if (!ui || !w) return;
    const scale = w / UI_WIDTH;
    ui.style.transform = `scale(${scale})`;
    ui.style.height = `${el.clientHeight / scale}px`;
  };
  const screens = root.querySelectorAll('.zd-screen');
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(entries => entries.forEach(e => fit(e.target)));
    screens.forEach(el => ro.observe(el));
  }
  requestAnimationFrame(() => screens.forEach(fit));
}

async function getJson(url, signal) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

function usable(story) {
  return story && typeof story.heading === 'string' && story.heading.trim()
    && typeof story.shortSummary === 'string' && story.shortSummary.trim()
    && /^https:\/\/media\.zerodaily\.in\//.test(String(story.image_url || ''))
    && !String(story.id || '').startsWith('SHORT#');
}

/** Loads the stories for the live phones; null when the API is down or slower than 4 s. */
async function loadStories() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const [all, cyber] = await Promise.all([
      getJson(`${API}/feed?limit=12`, controller.signal),
      getJson(`${API}/feed/cybersec?limit=4`, controller.signal).catch(() => []),
    ]);
    const stories = all.filter(usable);
    if (stories.length === 0) return null;
    let cyberStories = cyber.filter(usable);
    if (cyberStories.length === 0) cyberStories = stories.filter(s => s.category === 'cybersec');
    if (cyberStories.length === 0) cyberStories = stories.slice(-2);
    return { stories, cyber: cyberStories };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Real app behaviour: crop when the picture is close to the frame's shape, else contain over a blur. */
function wireHeroImages(scope) {
  scope.querySelectorAll('.zd-hero').forEach(hero => {
    const img = hero.querySelector('.zd-hero-img');
    if (!img) return;
    const apply = () => {
      const frame = hero.clientWidth / Math.max(1, hero.clientHeight);
      const pic = img.naturalWidth / Math.max(1, img.naturalHeight);
      if (!pic || !frame) return;
      const ratio = pic > frame ? pic / frame : frame / pic;
      hero.classList.toggle('is-contain', ratio > 1.3);
      hero.classList.add('is-loaded');
    };
    const fail = () => hero.classList.add('is-broken');
    if (img.complete && img.naturalWidth) apply();
    else {
      img.addEventListener('load', apply, { once: true });
      img.addEventListener('error', fail, { once: true });
    }
  });
}

function showFallback(screenEl) {
  const src = screenEl.dataset.src;
  screenEl.innerHTML = `<img src="${src}" alt="" width="780" height="1688" ${screenEl.dataset.eager ? '' : 'loading="lazy"'} decoding="async" class="w-full h-full object-cover object-top" />`;
  screenEl.classList.add('is-fallback');
}

function startRotation(deck) {
  const cards = [...deck.querySelectorAll('.zd-card')];
  if (cards.length < 2) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  let index = 0;
  setInterval(() => {
    if (document.hidden) return;
    cards[index].classList.remove('is-current');
    index = (index + 1) % cards.length;
    cards[index].classList.add('is-current');
  }, ROTATE_MS);
}

/**
 * Scales the mockups inside `root`, then fills the live phones with real stories
 * (or swaps them back to the static screenshots when the API is unavailable).
 */
export function hydrateMockups(root) {
  fitScreens(root);
  const live = [...root.querySelectorAll('.zd-screen')].filter(el => LIVE_KINDS.has(el.dataset.mock));
  if (live.length === 0) return;

  loadStories().then(data => {
    if (!data) {
      live.forEach(showFallback);
      return;
    }
    const { stories, cyber } = data;
    const pick = (list, i) => list[i % list.length];
    // Desk phones skip stories the rotating hero phone already shows.
    const heroIds = new Set(stories.slice(0, 4).map(st => st.id));
    const fresh = cyber.filter(st => !heroIds.has(st.id));
    const desk = fresh.length ? fresh : cyber;

    live.forEach(el => {
      const role = el.dataset.role;
      const eager = Boolean(el.dataset.eager);
      if (el.dataset.mock === 'saved') {
        const saved = stories.slice(5, 10);
        const list = el.querySelector('[data-saved-list]');
        list.innerHTML = (saved.length >= 3 ? saved : stories.slice(0, 5)).map(savedItem).join('');
        list.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true }));
        return;
      }

      const deck = el.querySelector('[data-deck]');
      let picks;
      if (role === 'hero-front') picks = stories.slice(0, 4);
      else if (role === 'hero-back') picks = [pick(desk, 0)];
      else if (el.dataset.mock === 'desks') picks = [pick(desk, 1)];
      else picks = [pick(stories, 4)];

      deck.innerHTML = picks.map((s, i) => storyCard(s, { eager: eager && i === 0 })).join('');
      deck.firstElementChild.classList.add('is-current');
      wireHeroImages(deck);
      if (role === 'hero-front') startRotation(deck);
    });
  });
}
