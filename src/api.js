/**
 * ZeroDaily Web API Client
 * Consumes the high-performance serving layer at https://api.zerodaily.in
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.zerodaily.in';

export const CATEGORIES = [
  { key: 'all', name: 'All Domains', color: '#06B6D4', icon: 'zap' },
  { key: 'cybersec', name: 'Cybersecurity', color: '#EF4444', icon: 'shield-alert' },
  { key: 'ai', name: 'Artificial Intelligence', color: '#8B5CF6', icon: 'cpu' },
  { key: 'programming', name: 'Software Eng', color: '#10B981', icon: 'code-2' },
  { key: 'robotics', name: 'Robotics', color: '#F59E0B', icon: 'bot' },
  { key: 'defense_aerospace', name: 'Defense & Aero', color: '#3B82F6', icon: 'plane' },
  { key: 'hardware', name: 'Silicon & Hardware', color: '#EC4899', icon: 'microchip' }
];

export async function fetchFeed(category = 'all', cursor = null, limit = 18) {
  try {
    const isGlobal = !category || category === 'all';
    const endpoint = isGlobal
      ? `${API_BASE_URL}/api/v1/feed`
      : `${API_BASE_URL}/api/v1/feed/${encodeURIComponent(category)}`;

    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
      params.append('cursor', cursor);
    }

    const res = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    const json = await res.json();
    return {
      success: true,
      articles: json.data || [],
      hasMore: json.pagination?.has_more || false,
      nextCursor: json.pagination?.next_cursor || null
    };
  } catch (err) {
    console.warn('[API Warning] Failed fetching live feed from', API_BASE_URL, err);
    // Fallback gracefully to demo articles if backend is unreachable
    return getFallbackFeed(category);
  }
}

export async function fetchRecentAlerts(limit = 5) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/notifications/history?limit=${limit}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[API Warning] Failed fetching breaking alerts:', err);
    return [];
  }
}

export async function fetchArticle(articleId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/article?id=${encodeURIComponent(articleId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn('[API Warning] Failed fetching article detail:', err);
    return null;
  }
}

function getFallbackFeed(category) {
  const sampleArticles = [
    {
      id: 'https://example.com/crowdstrike-update',
      category: 'cybersec',
      heading: 'CrowdStrike Decides Computers Were A Mistake Anyway',
      shortSummary: 'A single null-pointer dereference in a routine sensor driver bricks 8.5 million Windows machines across airlines, banks, and 911 dispatch centers. IT admins globally rediscover the lost art of physical thumb drives.',
      fullSummary: 'In what cybersecurity historians are already calling the most comprehensive self-inflicted blackout in computing history, a routine channel file update shipped by CrowdStrike bypassed standard regression testing and immediately triggered kernel panics across millions of enterprise endpoints. Ground stop orders were issued at major international airports, hospital surgeries were rescheduled onto paper charts, and thousands of sysadmins were observed crying softly in server closets across five continents.',
      published_at: new Date().toISOString(),
      link: 'https://thehackernews.com',
      image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      is_breaking: true,
      push_punchline: 'Faulty CrowdStrike driver grounds flights worldwide'
    },
    {
      id: 'https://example.com/frontier-model-hype',
      category: 'ai',
      heading: 'AI Startup Valued at $10 Billion For Solving Problems That Do Not Exist',
      shortSummary: 'The latest trillion-parameter reasoning model scores 99.4% on graduate-level quantum physics benchmarks, yet repeatedly struggles to count the number of letter "r"s in strawberry.',
      fullSummary: 'Venture capitalists poured another record round into autonomous cognitive orchestration architectures this morning. Benchmarks show staggering breakthroughs in theoretical algebraic topology, but enterprise customers deploying the model to automate customer support reported it offered entire inventory catalogs for seventy-five cents after polite persuasion.',
      published_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      link: 'https://techcrunch.com',
      image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      is_breaking: false,
      push_punchline: null
    },
    {
      id: 'https://example.com/javascript-framework-73',
      category: 'programming',
      heading: 'Developers Revolt as 14th State Management Library of the Week Released',
      shortSummary: 'Engineers who spent the last three months migrating their production codebase to the latest syntax discover it was officially deprecated twenty minutes before lunch.',
      fullSummary: 'The JavaScript ecosystem achieved peak velocity today as yet another zero-runtime compile-time reactive signals framework launched with 10,000 GitHub stars within four hours of publication. Senior engineers tasked with maintaining mission-critical payroll software confirmed they will continue running Node 14 until retirement.',
      published_at: new Date(Date.now() - 3600000 * 7).toISOString(),
      link: 'https://arstechnica.com',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      is_breaking: false,
      push_punchline: null
    },
    {
      id: 'https://example.com/humanoid-robot-walk',
      category: 'robotics',
      heading: 'Humanoid Robot Successfully Opens Door After Only 400 Engineering Hours',
      shortSummary: 'Trained on 4 million GPU hours of reinforcement learning simulation, the bipedal marvel opens a standard pantry door before triumphantly falling backward into a recycling bin.',
      fullSummary: 'Robotics researchers unveiled their latest generation of general-purpose domestic automation units today. Equipped with hydraulic actuators and stereoscopic vision, the machine completed a laundry folding routine in just four and a half hours, tearing only three expensive shirts in the process.',
      published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      link: 'https://wired.com',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      is_breaking: false,
      push_punchline: null
    }
  ];

  const filtered = (category && category !== 'all')
    ? sampleArticles.filter(a => a.category === category)
    : sampleArticles;

  return {
    success: true,
    articles: filtered,
    hasMore: false,
    nextCursor: null
  };
}
