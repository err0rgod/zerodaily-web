import { CATEGORIES, CURATED_ROASTS } from '../api.js';

export function renderRoastPreview() {
  const section = document.createElement('section');
  section.id = 'preview';
  section.className = 'py-16 md:py-24 border-t border-[#1e2638] bg-[#090a0f]';

  let currentCategory = 'all';
  let currentIndex = 0;
  let activeStories = [...CURATED_ROASTS];

  function filterStories(catId) {
    currentCategory = catId;
    if (catId === 'all') {
      activeStories = [...CURATED_ROASTS];
    } else {
      activeStories = CURATED_ROASTS.filter(s => s.category === catId);
      if (activeStories.length === 0) activeStories = [...CURATED_ROASTS];
    }
    currentIndex = 0;
    updateCard();
  }

  function getActiveStory() {
    return activeStories[currentIndex % activeStories.length] || CURATED_ROASTS[0];
  }

  section.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">[ 01 / The Format ]</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">60 words. Raw facts. Unfiltered satire.</h2>
        <p class="text-slate-400 text-sm">
          Select a domain below to preview how ZeroDaily strips corporate PR into concise, high-signal reality.
        </p>
      </div>

      <!-- Domain Category Tabs -->
      <div class="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
        ${CATEGORIES.map(cat => `
          <button
            type="button"
            data-cat="${cat.id}"
            class="tab-pill whitespace-nowrap px-3 py-1.5 rounded-lg font-mono text-xs font-medium border transition-all ${
              cat.id === 'all'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#0e121a] border-[#1e2638] text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }"
          >
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Interactive Roast Card -->
      <div class="relative rounded-2xl bg-[#0e121a] border border-[#1e2638] shadow-2xl shadow-black/60 overflow-hidden">
        
        <!-- Window Chrome / Top bar -->
        <div class="px-5 py-3.5 border-b border-[#1e2638] bg-[#121722]/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="font-mono text-[11px] text-slate-500 ml-2 hidden sm:inline">zerodaily://feed/preview</span>
          </div>

          <div class="flex items-center gap-2">
            <span id="story-wordcount" class="font-mono text-[11px] px-2 py-0.5 rounded bg-[#1e2638] text-slate-300">
              52 words
            </span>
            <span id="story-timestamp" class="font-mono text-[11px] text-slate-500">
              14m ago
            </span>
          </div>
        </div>

        <!-- Story Body -->
        <div class="p-6 sm:p-8 space-y-4">
          
          <div class="flex items-center gap-2">
            <span id="story-badge" class="font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
              CVE-2026-KERNEL-PANIC
            </span>
          </div>

          <h3 id="story-heading" class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            CrowdStrike Decides Computers Were A Mistake Anyway
          </h3>

          <p id="story-roast" class="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            A single null-pointer dereference in a routine sensor driver bricks 8.5 million Windows machines across airlines, hospitals, and emergency dispatch centers worldwide. IT administrators globally celebrate unexpected downtime before rediscovering the lost, forgotten art of physical USB thumb drives and handwritten paper logs in freezing server closets.
          </p>

        </div>

        <!-- Story Actions / Footer -->
        <div class="px-6 sm:px-8 py-4 border-t border-[#1e2638] bg-[#121722]/30 flex flex-wrap items-center justify-between gap-3">
          
          <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Verified Source:</span>
            <a id="story-source-link" href="https://thehackernews.com" target="_blank" rel="noopener" class="text-emerald-400 hover:underline flex items-center gap-1">
              <span id="story-source-name">The Hacker News</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>

          <div class="flex items-center gap-2">
            <button
              id="copy-roast-btn"
              type="button"
              class="px-3 py-1.5 rounded-lg border border-[#1e2638] bg-[#121722] hover:bg-[#161e2c] text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              <span id="copy-btn-text">Copy</span>
            </button>

            <button
              id="next-roast-btn"
              type="button"
              class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Next Roast</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

        </div>

      </div>

    </div>
  `;

  function updateCard() {
    const story = getActiveStory();
    const heading = section.querySelector('#story-heading');
    const roast = section.querySelector('#story-roast');
    const badge = section.querySelector('#story-badge');
    const wordcount = section.querySelector('#story-wordcount');
    const timestamp = section.querySelector('#story-timestamp');
    const sourceName = section.querySelector('#story-source-name');
    const sourceLink = section.querySelector('#story-source-link');

    if (heading) heading.textContent = story.heading;
    if (roast) roast.textContent = story.roast;
    if (badge) badge.textContent = story.badge;
    if (wordcount) wordcount.textContent = `${story.wordCount} words`;
    if (timestamp) timestamp.textContent = story.publishedAgo;
    if (sourceName) sourceName.textContent = story.source;
    if (sourceLink) sourceLink.href = story.sourceUrl;
  }

  // Bind Tabs
  section.querySelectorAll('.tab-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-cat');
      section.querySelectorAll('.tab-pill').forEach(p => {
        p.className = 'tab-pill whitespace-nowrap px-3 py-1.5 rounded-lg font-mono text-xs font-medium border transition-all bg-[#0e121a] border-[#1e2638] text-slate-400 hover:text-slate-200 hover:border-slate-600';
      });
      pill.className = 'tab-pill whitespace-nowrap px-3 py-1.5 rounded-lg font-mono text-xs font-medium border transition-all bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      filterStories(cat);
    });
  });

  // Next Story button
  const nextBtn = section.querySelector('#next-roast-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateCard();
    });
  }

  // Copy Roast button
  const copyBtn = section.querySelector('#copy-roast-btn');
  const copyText = section.querySelector('#copy-btn-text');
  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', () => {
      const story = getActiveStory();
      const textToCopy = `"${story.heading}"\n\n${story.roast}\n\n— ZeroDaily (${story.sourceUrl})`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyText.textContent = 'Copied!';
        setTimeout(() => {
          copyText.textContent = 'Copy';
        }, 1800);
      });
    });
  }

  // Initialize
  updateCard();

  return section;
}
