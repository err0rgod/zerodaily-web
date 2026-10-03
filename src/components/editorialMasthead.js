import { DIRECT_APK_URL, REPO_URL, CATEGORIES, escapeHtml } from '../api.js';

export function renderMasthead(activeCategory, onSelectCategory) {
  const container = document.createElement('header');
  container.className = 'w-full';

  const isDark = document.documentElement.classList.contains('dark');

  container.innerHTML = `
    <!-- Slim top bar -->
    <div class="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5 group">
        <img src="/favicon.svg" alt="ZeroDaily" class="w-7 h-7 rounded-md" />
        <span class="font-serif text-xl font-bold text-ink dark:text-paper-ink tracking-tight group-hover:text-brand dark:group-hover:text-brand-dark transition-colors">ZeroDaily</span>
      </a>

      <div class="flex items-center gap-4 text-sm">
        <a href="${REPO_URL}" target="_blank" rel="noopener" class="text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink transition-colors hidden sm:inline">GitHub</a>
        <button
          id="theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
          class="text-ink-faint dark:text-paper-faint hover:text-ink dark:hover:text-paper-ink transition-colors"
        >
          <svg id="theme-icon-moon" class="w-4 h-4 ${isDark ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          <svg id="theme-icon-sun" class="w-4 h-4 ${isDark ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95l-1.414 1.414M7.464 16.536L6.05 17.95m11.9 0l-1.414-1.414M7.464 7.464L6.05 6.05M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </button>
        <a
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="font-medium text-brand dark:text-brand-dark hover:underline underline-offset-4"
        >
          <span id="masthead-apk-text">Get the app</span>
        </a>
      </div>
    </div>

    <!-- Hero -->
    <div class="max-w-3xl mx-auto px-5 pt-14 pb-12 sm:pt-20 sm:pb-16 text-center">
      <h1 class="font-serif text-5xl sm:text-6xl font-bold text-ink dark:text-paper-ink tracking-tight leading-[1.05] text-balance">
        The whole tech world,<br />in sixty words.
      </h1>
      <p class="mt-6 font-serif italic text-lg sm:text-xl text-ink-soft dark:text-paper-soft leading-relaxed max-w-xl mx-auto">
        ZeroDaily reads the press releases, the post-mortems and the SEC filings
        so you don't have to — then hands you one honest paragraph.
      </p>

      <div class="mt-8 flex items-center justify-center gap-4">
        <a
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink dark:bg-paper-ink text-paper dark:text-night text-sm font-semibold hover:bg-brand dark:hover:bg-brand-dark transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span id="hero-apk-text">Download for Android</span>
        </a>
        <a href="#taste" class="text-sm text-ink-soft dark:text-paper-soft hover:text-brand dark:hover:text-brand-dark transition-colors underline underline-offset-4 decoration-rule-dark dark:decoration-night-rule-dark">
          Read a story first
        </a>
      </div>

      <p class="mt-4 font-mono text-[11px] text-ink-faint dark:text-paper-faint">
        Free &middot; no account &middot; no ads &middot; no trackers
      </p>
    </div>

    <!-- Desk strip: filters the single preview story below -->
    <nav class="border-y border-rule dark:border-night-rule">
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
