import { DIRECT_APK_URL, REPO_URL, CATEGORIES } from '../api.js';

export function renderEditorialMasthead(activeCategory, onSelectCategory) {
  const container = document.createElement('div');
  container.className = 'w-full bg-[#08090d] border-b border-[#1d2330]';

  // Format today's date in editorial uppercase
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  container.innerHTML = `
    <!-- Top Dateline & Telemetry Bar -->
    <div class="border-b border-[#1d2330] bg-[#0c0e14] py-2 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        
        <div class="flex items-center gap-3">
          <span class="text-slate-300 font-semibold tracking-wider">${dateStr}</span>
          <span class="text-slate-600 hidden sm:inline">&bull;</span>
          <span class="text-slate-400 hidden sm:inline">EDITION #24</span>
          <span class="text-slate-600 hidden sm:inline">&bull;</span>
          <div class="flex items-center gap-1.5 text-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span id="masthead-pulse-text">10 BREAKING DISPATCHES MONITORED</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a
            href="${REPO_URL}"
            target="_blank"
            rel="noopener"
            class="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>

          <span class="text-slate-600">&bull;</span>

          <a
            id="masthead-apk-btn"
            href="${DIRECT_APK_URL}"
            data-apk-link="true"
            download
            class="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium transition-colors flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span id="masthead-apk-text">Get App</span>
          </a>
        </div>

      </div>
    </div>

    <!-- Editorial Brand Banner -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1d2330]">
        
        <!-- Left: Logo & Purpose -->
        <div>
          <a href="/" class="inline-block group">
            <h1 class="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-none">
              ZeroDaily
            </h1>
          </a>
          <p class="mt-3 text-sm sm:text-base text-slate-300 font-sans max-w-xl leading-relaxed">
            The cynical briefing for engineers, researchers, and quants. 
            <span class="text-slate-400">Strictly 60 words. No sponsor spin. No corporate PR.</span>
          </p>
        </div>

        <!-- Right: Real-time Stats Capsule -->
        <div class="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div class="border-l border-[#1d2330] pl-4">
            <div class="text-white font-bold text-sm">60 WORDS</div>
            <div class="text-[10px] text-slate-500 uppercase">Story Limit</div>
          </div>
          <div class="border-l border-[#1d2330] pl-4">
            <div class="text-white font-bold text-sm">7 DOMAINS</div>
            <div class="text-[10px] text-slate-500 uppercase">Monitored</div>
          </div>
          <div class="border-l border-[#1d2330] pl-4">
            <div class="text-white font-bold text-sm">0% PR SPIN</div>
            <div class="text-[10px] text-slate-500 uppercase">Signal Filter</div>
          </div>
        </div>

      </div>

      <!-- Domain Category Navigation Strip -->
      <div class="pt-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
        <div class="flex items-center gap-1.5 flex-nowrap">
          ${CATEGORIES.map(cat => `
            <button
              type="button"
              data-category-tab="${cat.id}"
              class="masthead-cat-pill whitespace-nowrap px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                cat.id === activeCategory
                  ? 'bg-white text-slate-950 font-bold shadow-sm'
                  : 'bg-[#131720] hover:bg-[#181e2b] text-slate-300 hover:text-white border border-[#1d2330]'
              }"
            >
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <div class="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-500 shrink-0">
          <span>Format: 60w Cynical Breakdown</span>
        </div>
      </div>

    </div>
  `;

  // Bind category tabs
  container.querySelectorAll('[data-category-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-category-tab');
      if (typeof onSelectCategory === 'function') {
        onSelectCategory(catId);
      }
    });
  });

  return container;
}
