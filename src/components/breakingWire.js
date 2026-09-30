import { fetchTopBreakingNews } from '../api.js';

export function renderBreakingWire(onSelectStory, activeCategory = 'all') {
  const section = document.createElement('section');
  section.className = 'w-full bg-[#0b0d13] border-b border-[#1d2330] py-6';

  section.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      
      <!-- Breaking Wire Header -->
      <div class="flex items-center justify-between pb-4 border-b border-[#1d2330]/80">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 beacon-red"></span>
          <div class="flex items-baseline gap-2">
            <span class="font-mono text-xs font-bold text-white tracking-widest uppercase">Live Breaking Wire</span>
            <span class="font-mono text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">LAST 10 BREAKING</span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs font-mono text-slate-400">
          <button
            id="refresh-wire-btn"
            type="button"
            class="hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131720] border border-[#1d2330] hover:border-slate-500 text-[11px]"
          >
            <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span id="refresh-btn-label">Poll Wire</span>
          </button>
        </div>
      </div>

      <!-- Dispatches Carousel / Grid -->
      <div id="breaking-items-container" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <!-- Hydrated dynamically -->
      </div>

    </div>
  `;

  async function loadWireItems(triggerSelect = false) {
    const container = section.querySelector('#breaking-items-container');
    const refreshLabel = section.querySelector('#refresh-btn-label');

    if (refreshLabel) refreshLabel.textContent = 'Polling...';

    const items = await fetchTopBreakingNews();

    if (refreshLabel) refreshLabel.textContent = 'Poll Wire';

    // Apply category filter if set
    const filtered = (activeCategory && activeCategory !== 'all')
      ? items.filter(i => i.category === activeCategory)
      : items;

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-8 text-center text-xs font-mono text-slate-500">
          No breaking dispatches in this category right now. Showing all active feeds.
        </div>
      `;
      return;
    }

    // Auto-promote top live story to lead briefing on initial load
    if (triggerSelect && filtered.length > 0 && typeof onSelectStory === 'function') {
      onSelectStory(filtered[0], false);
    }

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'p-3.5 rounded-lg bg-[#0e1117] border border-[#1d2330] hover:border-[#2c364a] transition-all cursor-pointer group flex flex-col justify-between';

      const urgencyColor = item.urgency === 'CRITICAL'
        ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
        : item.urgency === 'HIGH'
        ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
        : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-2 text-[10px] font-mono">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-slate-500 font-bold">#${String(index + 1).padStart(2, '0')}</span>
              <span class="px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${urgencyColor}">
                ${item.badge || item.category.toUpperCase()}
              </span>
              ${item.isLive ? `
                <span class="px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-emerald-400"></span>LIVE
                </span>
              ` : ''}
            </div>
            <span class="text-slate-500 shrink-0">${item.publishedAgo || 'Recent'}</span>
          </div>

          <h4 class="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-1.5">
            ${item.heading}
          </h4>

          <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans mb-3">
            ${item.roast}
          </p>
        </div>

        <div class="pt-2 border-t border-[#1d2330]/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span class="truncate max-w-[140px] text-slate-400">Via ${item.source}</span>
          <span class="text-emerald-400/90 group-hover:underline flex items-center gap-0.5">
            Read Roast &rarr;
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (typeof onSelectStory === 'function') {
          onSelectStory(item, true);
        }
      });

      container.appendChild(card);
    });
  }

  // Bind refresh button
  const refreshBtn = section.querySelector('#refresh-wire-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadWireItems(false);
    });
  }

  // Load initially and promote top story to lead briefing
  loadWireItems(true);

  return {
    element: section,
    reload: () => loadWireItems(false),
    setCategory: (newCategory) => {
      activeCategory = newCategory;
      loadWireItems(false);
    }
  };
}
