import { DIRECT_APK_URL, REPO_URL, CATEGORIES, escapeHtml } from '../api.js';

export function renderEditorialMasthead(activeCategory, onSelectCategory) {
  const container = document.createElement('header');
  container.className = 'w-full border-b border-rule dark:border-night-rule bg-paper dark:bg-night';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isDark = document.documentElement.classList.contains('dark');

  container.innerHTML = `
    <!-- Dateline -->
    <div class="border-b border-rule dark:border-night-rule">
      <div class="max-w-3xl mx-auto px-5 py-2 flex items-center justify-between gap-4 text-[11px] font-mono text-ink-faint dark:text-paper-faint">
        <span class="truncate">${escapeHtml(dateStr)}</span>
        <div class="flex items-center gap-4 shrink-0">
          <a href="${REPO_URL}" target="_blank" rel="noopener" class="hover:text-ink dark:hover:text-paper-ink transition-colors hidden sm:inline">GitHub</a>
          <button
            id="theme-toggle"
            type="button"
            aria-label="Toggle dark mode"
            class="hover:text-ink dark:hover:text-paper-ink transition-colors flex items-center gap-1.5"
          >
            <svg id="theme-icon-moon" class="w-3.5 h-3.5 ${isDark ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            <svg id="theme-icon-sun" class="w-3.5 h-3.5 ${isDark ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95l-1.414 1.414M7.464 16.536L6.05 17.95m11.9 0l-1.414-1.414M7.464 7.464L6.05 6.05M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </button>
          <a
            href="${DIRECT_APK_URL}"
            data-apk-link="true"
            download
            class="text-brand dark:text-brand-dark font-medium hover:underline underline-offset-4"
          >
            <span id="masthead-apk-text">Get the app</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Nameplate -->
    <div class="max-w-3xl mx-auto px-5 pt-10 pb-8 text-center">
      <a href="/" class="inline-block">
        <h1 class="font-serif text-6xl sm:text-7xl font-bold tracking-tight text-ink dark:text-paper-ink leading-none">
          ZeroDaily
        </h1>
      </a>
      <p class="mt-4 font-serif italic text-base sm:text-lg text-ink-soft dark:text-paper-soft leading-relaxed">
        Tech news, roasted in sixty words.
      </p>
      <p class="mt-2 text-xs text-ink-faint dark:text-paper-faint font-mono">
        We read the press releases so you don't have to.
      </p>
    </div>

    <!-- Category strip -->
    <nav class="border-t border-rule dark:border-night-rule">
      <div class="max-w-3xl mx-auto px-5 py-2.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        ${CATEGORIES.map(cat => `
          <button
            type="button"
            data-category-tab="${cat.id}"
            class="whitespace-nowrap px-2.5 py-1 text-[13px] font-sans transition-colors border-b-2 -mb-px ${
              cat.id === activeCategory
                ? 'border-brand dark:border-brand-dark text-ink dark:text-paper-ink font-semibold'
                : 'border-transparent text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink'
            }"
          >
            ${escapeHtml(cat.label)}
          </button>
        `).join('')}
      </div>
    </nav>
  `;

  container.querySelectorAll('[data-category-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-category-tab');
      if (typeof onSelectCategory === 'function') onSelectCategory(catId);
    });
  });

  const toggle = container.querySelector('#theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const root = document.documentElement;
      const nowDark = !root.classList.contains('dark');
      root.classList.toggle('dark', nowDark);
      try { localStorage.setItem('zd-theme', nowDark ? 'dark' : 'light'); } catch (e) {}
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', nowDark ? '#0d0e12' : '#faf8f3');
      container.querySelector('#theme-icon-moon')?.classList.toggle('hidden', nowDark);
      container.querySelector('#theme-icon-sun')?.classList.toggle('hidden', !nowDark);
    });
  }

  return container;
}
