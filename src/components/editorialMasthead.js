import { DIRECT_APK_URL } from '../api.js';

const MOON = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
const SUN = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95l-1.414 1.414M7.464 16.536L6.05 17.95m11.9 0l-1.414-1.414M7.464 7.464L6.05 6.05M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';

export function renderMasthead() {
  const container = document.createElement('header');
  container.className = 'w-full';

  const isDark = document.documentElement.classList.contains('dark');

  container.innerHTML = `
    <div class="sticky top-0 z-20 bg-paper/85 dark:bg-night/85 backdrop-blur border-b border-rule dark:border-night-rule">
      <div class="max-w-2xl mx-auto px-4 sm:px-5 h-14 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2">
          <img src="/favicon.svg" alt="" class="w-6 h-6 rounded-md" />
          <span class="font-semibold tracking-tight text-ink dark:text-paper-ink">ZeroDaily</span>
        </a>

        <div class="flex items-center gap-2">
          <button
            id="theme-toggle"
            type="button"
            aria-label="${isDark ? 'Switch to light theme' : 'Switch to dark theme'}"
            class="w-9 h-9 grid place-items-center rounded-full text-ink-soft dark:text-paper-soft hover:bg-paper-raised dark:hover:bg-night-raised transition-colors cursor-pointer"
          >
            <svg id="theme-icon-moon" class="w-4 h-4 ${isDark ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${MOON}</svg>
            <svg id="theme-icon-sun" class="w-4 h-4 ${isDark ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${SUN}</svg>
          </button>
          <a
            href="${DIRECT_APK_URL}"
            data-apk-link="true"
            download
            class="px-3.5 py-1.5 rounded-full bg-ink dark:bg-paper-ink text-paper dark:text-night text-sm font-medium hover:opacity-85 transition-opacity"
          >
            Get the app
          </a>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 sm:px-5 pt-16 pb-12 sm:pt-24 sm:pb-16">
      <h1 class="font-serif text-4xl sm:text-6xl font-semibold text-ink dark:text-paper-ink tracking-tight leading-[1.05] text-balance">
        Tech news, minus the noise.
      </h1>
      <p class="mt-5 text-lg text-ink-soft dark:text-paper-soft leading-relaxed max-w-lg">
        Short, honest summaries of what actually happened in security, AI, software,
        hardware and markets. Read the gist, skip the fluff.
      </p>

      <div class="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="${DIRECT_APK_URL}"
          data-apk-link="true"
          download
          class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand dark:bg-brand-dark text-white dark:text-night text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span id="hero-apk-text">Download for Android</span>
        </a>
        <a href="#latest" class="px-5 py-3 rounded-full text-sm font-medium text-ink dark:text-paper-ink border border-rule-dark dark:border-night-rule-dark hover:bg-paper-raised dark:hover:bg-night-raised transition-colors">
          Read the latest
        </a>
      </div>

      <p class="mt-4 text-sm text-ink-faint dark:text-paper-faint">Free. No account, no ads, no trackers.</p>
    </div>
  `;

  const toggle = container.querySelector('#theme-toggle');
  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const nowDark = !root.classList.contains('dark');
    root.classList.toggle('dark', nowDark);
    root.style.colorScheme = nowDark ? 'dark' : 'light';
    try { localStorage.setItem('zd-theme', nowDark ? 'dark' : 'light'); } catch (e) {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nowDark ? '#0d0e12' : '#faf8f3');
    container.querySelector('#theme-icon-moon')?.classList.toggle('hidden', nowDark);
    container.querySelector('#theme-icon-sun')?.classList.toggle('hidden', !nowDark);
    toggle.setAttribute('aria-label', nowDark ? 'Switch to light theme' : 'Switch to dark theme');
  });

  return container;
}
