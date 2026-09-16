import { CATEGORIES } from '../api.js';

export function renderHeader(activeCategory, onSelectCategory, onSearchChange) {
  const container = document.createElement('header');
  container.className = 'sticky top-0 z-40 bg-[#07090E]/90 backdrop-blur-md border-b border-[#1E293B]';

  const categoryPillsHtml = CATEGORIES.map(cat => {
    const isActive = cat.key === activeCategory;
    const activeClasses = isActive
      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121927] border-transparent';

    return `
      <button
        data-category="${cat.key}"
        class="category-pill whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 ${activeClasses}"
      >
        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${cat.color};"></span>
        ${cat.name}
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Top Alert Bar Placeholder -->
    <div id="breaking-ticker-container" class="hidden bg-red-950/40 border-b border-red-900/40 px-4 py-1.5 text-xs text-red-300">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-hidden">
          <span class="px-1.5 py-0.5 rounded bg-red-500 text-white font-mono font-bold text-[10px] tracking-wider uppercase flex-shrink-0 animate-pulse">BREAKING</span>
          <span id="breaking-ticker-text" class="truncate font-medium"></span>
        </div>
        <button id="breaking-ticker-close" class="text-red-400 hover:text-white text-sm font-bold leading-none px-1">&times;</button>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">
        
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2.5 group flex-shrink-0">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
            <span class="font-mono font-black text-cyan-400 text-lg tracking-tighter">0D</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-extrabold text-lg tracking-tight text-white font-mono">ZeroDaily</span>
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p class="text-[10px] text-slate-400 tracking-wider uppercase font-mono hidden sm:block">Satirical Tech Intelligence</p>
          </div>
        </a>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md hidden md:block">
          <div class="relative">
            <input
              type="text"
              id="search-input"
              placeholder="Filter stories by keyword..."
              class="w-full bg-[#0D131F] border border-[#1E293B] text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 placeholder:text-slate-500 transition-colors"
            />
            <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Right CTAs -->
        <div class="flex items-center gap-3">
          <a
            href="#app-showcase"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span>Get The App</span>
          </a>

          <a
            href="https://github.com/err0rgod"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#121927] border border-transparent hover:border-[#1E293B] transition-colors"
            title="GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
            </svg>
          </a>
        </div>

      </div>

      <!-- Categories Scroll Strip -->
      <div class="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        ${categoryPillsHtml}
      </div>
    </div>
  `;

  // Bind category clicks
  container.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-category');
      onSelectCategory(cat);
    });
  });

  // Bind search input
  const searchInput = container.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      onSearchChange(e.target.value);
    });
  }

  // Bind ticker close
  const tickerClose = container.querySelector('#breaking-ticker-close');
  const tickerContainer = container.querySelector('#breaking-ticker-container');
  if (tickerClose && tickerContainer) {
    tickerClose.addEventListener('click', () => {
      tickerContainer.classList.add('hidden');
    });
  }

  return container;
}
