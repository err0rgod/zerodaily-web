/**
 * ZeroDaily Data & API Service
 * High-signal, satirical 60-word tech intelligence.
 */

export const APP_REPO = 'err0rgod/zerodaily-app';
export const DIRECT_APK_URL = `https://github.com/${APP_REPO}/releases/latest/download/ZeroDaily.apk`;
export const RELEASES_URL = `https://github.com/${APP_REPO}/releases`;
export const REPO_URL = `https://github.com/${APP_REPO}`;

export const CATEGORIES = [
  { id: 'all', label: 'All Domains', tag: 'ALL', color: '#10b981' },
  { id: 'cybersec', label: 'Cybersecurity', tag: 'CYBERSEC', color: '#f43f5e' },
  { id: 'ai', label: 'AI & Models', tag: 'AI', color: '#8b5cf6' },
  { id: 'programming', label: 'Software Eng', tag: 'SYSTEMS', color: '#06b6d4' },
  { id: 'robotics', label: 'Robotics', tag: 'ROBOTICS', color: '#f59e0b' },
  { id: 'defense_aerospace', label: 'Defense & Aero', tag: 'DEFENSE', color: '#3b82f6' },
  { id: 'hardware', label: 'Silicon', tag: 'HARDWARE', color: '#ec4899' },
];

export const CURATED_ROASTS = [
  {
    category: 'cybersec',
    badge: 'CVE-2026-KERNEL-PANIC',
    heading: 'CrowdStrike Decides Computers Were A Mistake Anyway',
    roast: 'A single null-pointer dereference in a routine sensor driver bricks 8.5 million Windows machines across airlines, hospitals, and emergency dispatch centers worldwide. IT administrators globally celebrate unexpected downtime before rediscovering the lost, forgotten art of physical USB thumb drives and handwritten paper logs in freezing server closets.',
    wordCount: 52,
    source: 'The Hacker News',
    sourceUrl: 'https://thehackernews.com',
    publishedAgo: '14m ago',
  },
  {
    category: 'ai',
    badge: 'BENCHMARK REALITY CHECK',
    heading: 'Trillion-Parameter Reasoning Model Solves Quantum Physics, Stumbles on Strawberries',
    roast: 'Silicon Valley celebrated the launch of another frontier reasoning model scoring 99.4% on graduate topology benchmarks. When prompted by enterprise clients paying $40/seat to identify how many letters "r" exist in the word "strawberry," the synthetic superintelligence hallucinated a 4-page academic defense asserting that letters are merely societal constructs.',
    wordCount: 51,
    source: 'Ars Technica',
    sourceUrl: 'https://arstechnica.com',
    publishedAgo: '42m ago',
  },
  {
    category: 'programming',
    badge: 'DEPENDENCY HELL',
    heading: 'Developers Revolt as 19th Reactive State Library Drops Before Lunch',
    roast: 'Engineers who spent the last three grueling sprint cycles migrating their entire production monorepo to the latest compile-time reactive signal architecture woke up to discover the library was officially deprecated by its 19-year-old creator, who pivoted to an all-new zero-runtime macro framework currently trending on Hacker News.',
    wordCount: 51,
    source: 'GitHub Releases',
    sourceUrl: 'https://github.com',
    publishedAgo: '1h ago',
  },
  {
    category: 'robotics',
    badge: 'HUMANOID MILESTONE',
    heading: 'Bipedal Humanoid Opens Pantry Door After Only 800 Engineering Hours',
    roast: 'Backed by $600 million in venture funding and 4 million GPU hours of reinforcement learning simulation, a domestic humanoid robot successfully turned a kitchen doorknob. The mechanical marvel celebrated by promptly losing gyro balance, tumbling backward, and violently executing an involuntary disassembly into a recycling bin.',
    wordCount: 49,
    source: 'IEEE Spectrum',
    sourceUrl: 'https://spectrum.ieee.org',
    publishedAgo: '3h ago',
  },
  {
    category: 'defense_aerospace',
    badge: 'ORBITAL TELEMETRY',
    heading: 'Satellite Megaconstellation Briefly Mistaken for Alien Armada',
    roast: 'Ground astronomers attempting deep-space cosmological observations were treated to three hundred identical streaks of reflective low-earth orbit debris. Defense telemetry confirmed the swarm was merely delivering 4K video streams to cruise ships, reminding the scientific community that commercial bandwidth will always trump the mysteries of the universe.',
    wordCount: 48,
    source: 'SpaceNews',
    sourceUrl: 'https://spacenews.com',
    publishedAgo: '5h ago',
  },
  {
    category: 'hardware',
    badge: 'LITHOGRAPHY CRUNCH',
    heading: 'Fab Delays 2nm Chips Because Physics Refused To Sign NDA',
    roast: 'Semiconductor executives held an emergency summit after extreme ultraviolet lithography scanners encountered unexpected quantum tunneling constraints at sub-3-nanometer scale. Engineers requested two more quarters to politely negotiate with the laws of thermodynamics, while graphics card scalpers preemptively doubled the prices of existing inventory.',
    wordCount: 46,
    source: 'Tom’s Hardware',
    sourceUrl: 'https://tomshardware.com',
    publishedAgo: '8h ago',
  }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.zerodaily.in';

export async function fetchLiveRoasts() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/api/v1/feed?limit=6`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(item => ({
        category: item.category || 'cybersec',
        badge: item.category?.toUpperCase() || 'BREAKING',
        heading: item.heading || 'ZeroDaily Intelligence Report',
        roast: item.shortSummary || item.fullSummary || 'No summary available.',
        wordCount: (item.shortSummary || item.fullSummary || '').split(/\s+/).filter(Boolean).length || 60,
        source: item.source_name || 'Original Source',
        sourceUrl: item.link || 'https://zerodaily.in',
        publishedAgo: 'Live',
      }));
    }
  } catch {
    // Gracefully fallback
  }
  return CURATED_ROASTS;
}

/**
 * Dynamically queries GitHub Releases API for err0rgod/zerodaily-app
 * to get the latest APK download asset, release tag, and file size.
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
