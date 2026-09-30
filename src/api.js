/**
 * ZeroDaily Data Service
 * Fetches live dispatches and app releases, with curated fallbacks.
 */

/**
 * Escape a string for safe interpolation into innerHTML.
 * All API-provided strings must pass through this before rendering.
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Only allow http(s) URLs to be used as link targets.
 */
export function safeUrl(value, fallback = '#') {
  try {
    const url = new URL(String(value), 'https://zerodaily.in');
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
  } catch {
    /* fall through */
  }
  return fallback;
}

export const APP_REPO = 'err0rgod/zerodaily-app';
export const DIRECT_APK_URL = `https://github.com/${APP_REPO}/releases/latest/download/ZeroDaily.apk`;
export const RELEASES_URL = `https://github.com/${APP_REPO}/releases`;
export const REPO_URL = `https://github.com/${APP_REPO}`;

export const BREAKING_ENDPOINT = 'https://api.zerodaily.in/api/v1/notifications/history?limit=10';

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cybersec', label: 'Cybersecurity' },
  { id: 'ai', label: 'AI' },
  { id: 'programming', label: 'Software' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'defense_aerospace', label: 'Defense' },
  { id: 'hardware', label: 'Silicon' },
  { id: 'finance', label: 'Finance' },
];

/**
 * Editorial breaking dispatches used as high-signal base & fallback
 */
export const BREAKING_DISPATCHES = [
  {
    id: 'dispatch-01',
    category: 'cybersec',
    badge: '0-DAY EXPLOIT',
    heading: 'CrowdStrike Sensor Driver Triggers Global BSOD Meltdown',
    roast: 'A single null-pointer dereference in a routine sensor driver bricks 8.5 million enterprise Windows machines worldwide. Sysadmins celebrate unexpected downtime before rediscovering the lost art of physical thumb drives and paper logs in freezing server closets.',
    wordCount: 39,
    source: 'The Hacker News',
    sourceUrl: 'https://thehackernews.com',
    publishedAgo: '3m ago',
    urgency: 'CRITICAL',
    isLive: false,
  },
  {
    id: 'dispatch-02',
    category: 'finance',
    badge: 'FLASH CRASH',
    heading: 'HFT Microwave Link Drifts 3 Nanoseconds, Liquidating $400M in Quant Portfolios',
    roast: 'A Wall Street quant fund suffered cascading liquidation after microwave link latency between Chicago and New Jersey drifted imperceptibly. Meanwhile, a venture-backed neobank accidentally credited negative overdraft balances as dividends, prompting retail degens to arbitrage breakfast burritos.',
    wordCount: 40,
    source: 'Bloomberg Markets',
    sourceUrl: 'https://bloomberg.com',
    publishedAgo: '11m ago',
    urgency: 'HIGH',
    isLive: false,
  },
  {
    id: 'dispatch-03',
    category: 'ai',
    badge: 'BENCHMARK HALLUCINATION',
    heading: 'Trillion-Parameter Model Hallucinates 4-Page Defense for Strawberry Spelling',
    roast: 'Silicon Valley celebrated another frontier reasoning model scoring 99.4% on quantum topology benchmarks. When prompted by paying enterprise seats to count the letter "r" in "strawberry," the model hallucinated a four-page philosophical essay declaring letters are merely societal constructs.',
    wordCount: 39,
    source: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    publishedAgo: '24m ago',
    urgency: 'MEDIUM',
    isLive: false,
  },
  {
    id: 'dispatch-04',
    category: 'hardware',
    badge: 'YIELD CRISIS',
    heading: '2nm Silicon Node Stalls as Subatomic Physics Refuses to Sign NDA',
    roast: 'Semiconductor executives held an emergency summit after extreme ultraviolet lithography scanners encountered unexpected quantum tunneling constraints at sub-3-nanometer scale. Engineers requested two quarters to politely negotiate with thermodynamics, while GPU scalpers immediately doubled prices.',
    wordCount: 36,
    source: 'Tom’s Hardware',
    sourceUrl: 'https://tomshardware.com',
    publishedAgo: '42m ago',
    urgency: 'HIGH',
    isLive: false,
  },
  {
    id: 'dispatch-05',
    category: 'programming',
    badge: 'SUPPLY CHAIN',
    heading: 'Leftpad Successor Deprecated Minutes Before Enterprise Production Release',
    roast: 'Engineers who spent the last three grueling sprint cycles migrating their entire monorepo to the latest compile-time reactive signal architecture woke up to discover the library was officially deprecated by its 19-year-old creator, who pivoted to zero-runtime macros.',
    wordCount: 40,
    source: 'GitHub Releases',
    sourceUrl: 'https://github.com',
    publishedAgo: '1h ago',
    urgency: 'MEDIUM',
    isLive: false,
  },
  {
    id: 'dispatch-06',
    category: 'robotics',
    badge: 'KINEMATICS FAIL',
    heading: 'Bipedal Humanoid Opens Pantry Door, Involuntarily Disassembles in Recycling Bin',
    roast: 'Backed by $600M in venture funding and 4 million GPU hours of reinforcement learning simulation, a domestic humanoid successfully turned a kitchen doorknob. The robot celebrated by losing gyro balance, tumbling backward, and violently disassembling into a recycling bin.',
    wordCount: 41,
    source: 'IEEE Spectrum',
    sourceUrl: 'https://spectrum.ieee.org',
    publishedAgo: '2h ago',
    urgency: 'LOW',
    isLive: false,
  },
  {
    id: 'dispatch-07',
    category: 'defense_aerospace',
    badge: 'ORBITAL INTERFERENCE',
    heading: 'Satellite Megaconstellation Streaks Disrupt Deep-Space Hubble Spectroscopy',
    roast: 'Ground astronomers attempting deep-space cosmological observations were treated to three hundred identical streaks of reflective low-earth orbit debris. Telemetry confirmed the swarm was merely delivering 4K video streams to cruise ships, reminding humanity that commercial bandwidth trumps the universe.',
    wordCount: 39,
    source: 'SpaceNews',
    sourceUrl: 'https://spacenews.com',
    publishedAgo: '3h ago',
    urgency: 'MEDIUM',
    isLive: false,
  },
  {
    id: 'dispatch-08',
    category: 'finance',
    badge: 'DEFI DRAIN',
    heading: 'Liquidity Pool Drained After Pricing Oracle Trusts Single Illiquid DEX',
    roast: 'An algorithmic stablecoin pegged to the US Dollar lost its parity within forty seconds after an automated pricing oracle polled an empty Uniswap v2 pair. The protocol founder posted a reflective thread praising the resilience of decentralization while boarding a flight to Dubai.',
    wordCount: 44,
    source: 'CoinDesk',
    sourceUrl: 'https://coindesk.com',
    publishedAgo: '4h ago',
    urgency: 'HIGH',
    isLive: false,
  },
  {
    id: 'dispatch-09',
    category: 'programming',
    badge: 'KERNEL HOTFIX',
    heading: 'Linux Ext4 Corruption Bug Fixed 4 Hours Before Massive Cloud Blackout',
    roast: 'Kernel maintainers scrambled over a weekend to patch a silent data corruption bug introduced in a patch promising a 0.2% write throughput gain. Cloud hypervisors silently accepted truncated metadata until a lone sysadmin noticed their database cluster converting foreign keys to garbage.',
    wordCount: 44,
    source: 'LWN.net',
    sourceUrl: 'https://lwn.net',
    publishedAgo: '6h ago',
    urgency: 'HIGH',
    isLive: false,
  },
  {
    id: 'dispatch-10',
    category: 'cybersec',
    badge: 'VPN EXPLOIT',
    heading: 'Zero-Day in Enterprise SSL-VPN Actively Exploited for 180 Days Prior to Patch',
    roast: 'Security researchers discovered that nation-state actors had maintained persistent root access across defense contractors through a buffer overflow in an enterprise VPN authentication daemon. The vendor issued an advisory urging customers to reboot their gateways twice weekly.',
    wordCount: 41,
    source: 'BleepingComputer',
    sourceUrl: 'https://bleepingcomputer.com',
    publishedAgo: '8h ago',
    urgency: 'CRITICAL',
    isLive: false,
  },
];

export const EDITORIAL_BRIEFINGS = [
  ...BREAKING_DISPATCHES
];

function extractSourceFromUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host.includes('tomshardware')) return 'Tom’s Hardware';
    if (host.includes('thehackernews')) return 'The Hacker News';
    if (host.includes('bloomberg')) return 'Bloomberg';
    if (host.includes('arstechnica')) return 'Ars Technica';
    if (host.includes('reuters')) return 'Reuters';
    if (host.includes('bleepingcomputer')) return 'BleepingComputer';
    if (host.includes('wired')) return 'Wired';
    if (host.includes('coindesk')) return 'CoinDesk';
    if (host.includes('lwn')) return 'LWN.net';
    return host;
  } catch {
    return 'Primary Source';
  }
}

function formatTimeAgo(dateStr) {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return 'Recent';
  }
}
let currentBreakingEndpoint = BREAKING_ENDPOINT;

export function setBreakingEndpoint(url) {
  currentBreakingEndpoint = url;
}

const FETCH_ATTEMPTS = 3;
const FETCH_RETRY_DELAY_MS = 3000;
const FETCH_TIMEOUT_MS = 4500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * One attempt at the wire. Returns the raw list, or null on any failure
 * (network error, timeout, non-200, malformed payload, empty feed).
 */
async function tryFetchWire() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(currentBreakingEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    if (!res.ok) return null;

    const json = await res.json();
    const rawList = Array.isArray(json.data) ? json.data : [];
    return rawList.length > 0 ? rawList : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches the last 10 breaking news from the live wire.
 * Retries up to 3 times, 3 seconds apart, before falling back to the
 * curated wire dispatches so the page is never empty.
 */
export async function fetchTopBreakingNews() {
  let rawList = null;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    rawList = await tryFetchWire();
    if (rawList) break;
    if (attempt < FETCH_ATTEMPTS) {
      console.debug(`[ZeroDaily Wire] Attempt ${attempt}/${FETCH_ATTEMPTS} came back empty, retrying in ${FETCH_RETRY_DELAY_MS / 1000}s…`);
      await sleep(FETCH_RETRY_DELAY_MS);
    }
  }

  if (!rawList) {
    console.debug('[ZeroDaily Wire] Live wire unreachable, serving curated dispatches.');
    return BREAKING_DISPATCHES.slice(0, 10);
  }

  const liveItems = rawList.map((item, idx) => {
    const roastText = item.push_punchline || item.heading || '';
    return {
      id: item.article_id || `live-breaking-${idx}`,
      category: CATEGORIES.some(c => c.id === item.category) ? item.category : 'cybersec',
      badge: 'LIVE BREAKING',
      heading: item.heading || 'ZeroDaily Breaking',
      roast: roastText,
      wordCount: roastText.split(/\s+/).filter(Boolean).length || 45,
      source: extractSourceFromUrl(item.article_id || ''),
      sourceUrl: safeUrl(item.article_id, 'https://zerodaily.in'),
      publishedAgo: formatTimeAgo(item.published_at),
      imageUrl: null,
      urgency: 'CRITICAL',
      isLive: true,
    };
  });

  // Top up with non-duplicate dispatches so the wire always shows 10 stories.
  const liveUrls = new Set(liveItems.map(i => i.sourceUrl));
  const remaining = BREAKING_DISPATCHES.filter(d => !liveUrls.has(d.sourceUrl));
  return [...liveItems, ...remaining].slice(0, 10);
}

/**
 * Fetches full story detail from /api/v1/article?id=...
 * Retries up to 3 times, 3 seconds apart, then gives up quietly.
 */
export async function fetchArticleDetail(articleId) {
  const url = `https://api.zerodaily.in/api/v1/article?id=${encodeURIComponent(articleId)}`;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // retry below
    } finally {
      clearTimeout(timeoutId);
    }

    if (attempt < FETCH_ATTEMPTS) await sleep(FETCH_RETRY_DELAY_MS);
  }

  return null;
}

/**
 * Dynamically queries GitHub Releases API for err0rgod/zerodaily-app
 */
export async function fetchLatestAppRelease() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.github.com/repos/${APP_REPO}/releases/latest`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
    const data = await res.json();

    const apkAsset = data.assets?.find(a => a.name.endsWith('.apk'));
    const shaAsset = data.assets?.find(a => a.name.includes('SHA256') || a.name.endsWith('.txt'));
    const sizeMb = apkAsset?.size ? (apkAsset.size / (1024 * 1024)).toFixed(1) + ' MB' : null;

    return {
      version: data.tag_name || 'Latest',
      name: data.name || `ZeroDaily Release ${data.tag_name || ''}`,
      apkUrl: apkAsset?.browser_download_url || DIRECT_APK_URL,
      apkSize: sizeMb,
      releaseUrl: data.html_url || RELEASES_URL,
      shaUrl: shaAsset?.browser_download_url || null,
      publishedAt: data.published_at ? new Date(data.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
    };
  } catch (err) {
    console.debug('[Release Service] Using fallback direct APK URL:', err);
    return {
      version: 'Latest',
      name: 'ZeroDaily Android Release',
      apkUrl: DIRECT_APK_URL,
      apkSize: null,
      releaseUrl: RELEASES_URL,
      shaUrl: null,
      publishedAt: null
    };
  }
}
