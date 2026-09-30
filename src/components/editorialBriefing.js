import { EDITORIAL_BRIEFINGS, CATEGORIES, fetchArticleDetail } from '../api.js';

export function renderEditorialBriefing(activeCategory = 'all', initialStory = null) {
  const section = document.createElement('section');
  section.id = 'briefing';
  section.className = 'w-full bg-[#08090d] py-12 border-b border-[#1d2330]';

  let currentCategory = activeCategory;
  let activeStories = getFilteredStories(currentCategory);
  let activeStory = initialStory || activeStories[0];

  function getFilteredStories(cat) {
    if (!cat || cat === 'all') return [...EDITORIAL_BRIEFINGS];
    const filtered = EDITORIAL_BRIEFINGS.filter(s => s.category === cat);
    return filtered.length > 0 ? filtered : [...EDITORIAL_BRIEFINGS];
  }

  section.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="flex items-center justify-between pb-6 mb-8 border-b border-[#1d2330]">
        <div>
          <span class="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">[ The Editorial Briefing ]</span>
          <h2 class="text-xl sm:text-2xl font-bold text-white mt-1">Deep Intelligence. Roasted in 60 Words.</h2>
        </div>
        <div class="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Zero PR Spin Guarantee</span>
        </div>
      </div>

      <!-- Main Editorial Layout: Lead Story (Left 65%) + Wire Rail (Right 35%) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Lead Featured Briefing -->
        <div class="lg:col-span-8 p-6 sm:p-8 rounded-xl bg-[#0e1117] border border-[#1d2330] space-y-6">
          
          <!-- Story Header Pill & Metadata -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div class="flex items-center gap-2">
              <span id="lead-category-badge" class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                CYBERSEC
              </span>
              <span id="lead-urgency-badge" class="text-slate-500 font-medium">
                CVE-2026-KERNEL-PANIC
              </span>
            </div>

            <div class="flex items-center gap-3 text-slate-500">
              <span id="lead-wordcount" class="px-2 py-0.5 rounded bg-[#131720] text-slate-300">
                52 / 60 words
              </span>
              <span id="lead-timestamp">
                14m ago
              </span>
            </div>
          </div>

          <!-- Headline -->
          <h3 id="lead-heading" class="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            CrowdStrike Decides Computers Were A Mistake Anyway
          </h3>

          <!-- The Roast Paragraph -->
          <div class="p-4 sm:p-5 rounded-lg bg-[#131720]/80 border-l-2 border-emerald-500">
            <p id="lead-roast" class="text-slate-200 text-base sm:text-lg leading-relaxed font-sans font-normal">
              A single null-pointer dereference in a routine sensor driver bricks 8.5 million enterprise Windows machines worldwide. Sysadmins celebrate unexpected downtime before rediscovering the lost art of physical thumb drives and paper logs in freezing server closets.
            </p>
          </div>

          <!-- Footer Actions & Attribution -->
          <div class="pt-4 border-t border-[#1d2330] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            
            <div class="flex items-center gap-1.5 text-slate-400">
              <span>Primary Source:</span>
              <a
                id="lead-source-link"
                href="https://thehackernews.com"
                target="_blank"
                rel="noopener"
                class="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span id="lead-source-name">The Hacker News</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>

            <div class="flex items-center gap-2">
              <button
                id="copy-roast-btn"
                type="button"
                class="px-3 py-1.5 rounded-lg border border-[#1d2330] bg-[#131720] hover:bg-[#181e2b] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                <span id="copy-btn-label">Copy Roast</span>
              </button>

              <button
                id="next-dispatch-btn"
                type="button"
                class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-all flex items-center gap-1 text-xs"
              >
                <span>Next Dispatch</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

          </div>

        </div>

        <!-- Right: The Briefing Wire Rail -->
        <div class="lg:col-span-4 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-[#1d2330] text-xs font-mono text-slate-400">
            <span class="uppercase tracking-wider font-semibold text-slate-300">Wire Dispatches</span>
            <span id="wire-count" class="text-emerald-400">${activeStories.length} Stories</span>
          </div>

          <div id="briefing-wire-list" class="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            <!-- Hydrated dynamically -->
          </div>
        </div>

      </div>

    </div>
  `;

  function updateLeadCard(story) {
    if (!story) return;
    activeStory = story;

    const heading = section.querySelector('#lead-heading');
    const roast = section.querySelector('#lead-roast');
    const catBadge = section.querySelector('#lead-category-badge');
    const urgencyBadge = section.querySelector('#lead-urgency-badge');
    const wordcount = section.querySelector('#lead-wordcount');
    const timestamp = section.querySelector('#lead-timestamp');
    const sourceName = section.querySelector('#lead-source-name');
    const sourceLink = section.querySelector('#lead-source-link');

    if (heading) heading.textContent = story.heading;
    if (roast) roast.textContent = story.roast;
    if (catBadge) catBadge.textContent = (story.category || 'INTEL').toUpperCase();
    if (urgencyBadge) urgencyBadge.textContent = story.badge || story.urgency || 'DISPATCH';
    if (wordcount) wordcount.textContent = `${story.wordCount || 50} / 60w`;
    if (timestamp) timestamp.textContent = story.publishedAgo || 'Recent';
    if (sourceName) sourceName.textContent = story.source || 'Original Source';
    if (sourceLink) sourceLink.href = story.sourceUrl || '#';

    // If this is a live pipeline story ID with full URL, fetch full 60-word roast
    if (story.id && String(story.id).startsWith('http')) {
      fetchArticleDetail(story.id).then(detail => {
        if (detail && (detail.shortSummary || detail.fullSummary) && activeStory.id === story.id) {
          const fullText = detail.shortSummary || detail.fullSummary;
          if (roast) roast.textContent = fullText;
          const wc = fullText.split(/\s+/).filter(Boolean).length;
          if (wordcount) wordcount.textContent = `${wc} / 60w`;
        }
      });
    }

    // Highlight active item in wire list
    section.querySelectorAll('.wire-list-item').forEach(item => {
      if (item.getAttribute('data-story-id') === story.id) {
        item.classList.add('border-emerald-500/50', 'bg-[#131720]');
        item.classList.remove('border-[#1d2330]', 'bg-[#0e1117]');
      } else {
        item.classList.remove('border-emerald-500/50', 'bg-[#131720]');
        item.classList.add('border-[#1d2330]', 'bg-[#0e1117]');
      }
    });
  }

  function renderWireList() {
    const list = section.querySelector('#briefing-wire-list');
    const countEl = section.querySelector('#wire-count');
    if (!list) return;

    if (countEl) countEl.textContent = `${activeStories.length} Stories`;

    list.innerHTML = '';

    activeStories.forEach(s => {
      const item = document.createElement('div');
      item.setAttribute('data-story-id', s.id);
      item.className = `wire-list-item p-3 rounded-lg border transition-all cursor-pointer hover:border-slate-500 ${
        activeStory && activeStory.id === s.id
          ? 'border-emerald-500/50 bg-[#131720]'
          : 'border-[#1d2330] bg-[#0e1117]'
      }`;

      item.innerHTML = `
        <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
          <span class="text-emerald-400 font-semibold uppercase">${s.category}</span>
          <span>${s.publishedAgo}</span>
        </div>
        <h4 class="text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
          ${s.heading}
        </h4>
      `;

      item.addEventListener('click', () => {
        updateLeadCard(s);
      });

      list.appendChild(item);
    });
  }

  // Bind Next Button
  const nextBtn = section.querySelector('#next-dispatch-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currIdx = activeStories.findIndex(s => s.id === activeStory.id);
      const nextIdx = (currIdx + 1) % activeStories.length;
      updateLeadCard(activeStories[nextIdx]);
    });
  }

  // Bind Copy Roast Button
  const copyBtn = section.querySelector('#copy-roast-btn');
  const copyLabel = section.querySelector('#copy-btn-label');
  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', () => {
      if (!activeStory) return;
      const textToCopy = `"${activeStory.heading}"\n\n${activeStory.roast}\n\n— ZeroDaily (${activeStory.sourceUrl})`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyLabel.textContent = 'Copy Roast';
        }, 1800);
      });
    });
  }

  // Initial render
  renderWireList();
  updateLeadCard(activeStory);

  return {
    element: section,
    setStory: (story) => {
      updateLeadCard(story);
      section.scrollIntoView({ behavior: 'smooth' });
    },
    setCategory: (newCategory) => {
      currentCategory = newCategory;
      activeStories = getFilteredStories(newCategory);
      activeStory = activeStories[0];
      renderWireList();
      updateLeadCard(activeStory);
    },
    prependLiveStory: (story) => {
      // Add live story at top of briefing list if not already present
      if (!activeStories.some(s => s.id === story.id)) {
        activeStories.unshift(story);
        renderWireList();
        updateLeadCard(story);
      }
    }
  };
}
